from rest_framework import serializers
from .models import NCMXInconsistencies, NCMXInconsistencyComments
from datetime import date

class NormativeDocumentSerializer(serializers.Serializer):
    norm_doc = serializers.CharField(max_length=50, allow_blank=True)
    point = serializers.CharField(max_length=50, allow_blank=True)

class AuditorsSerializer(serializers.Serializer):
    auditor = serializers.CharField(max_length=50, allow_blank=True)

class ResponsibleSerializer(serializers.Serializer):
    department = serializers.CharField(max_length=50, allow_blank=True)
    person = serializers.CharField(max_length=50, allow_blank=True)

class CorrectionSerializer(serializers.Serializer):
    correction = serializers.CharField(max_length=1000, allow_blank=True)
    correction_date = serializers.DateField(allow_null=True)
    responsible_for_correction = ResponsibleSerializer(many=True, required=False)

    def to_internal_value(self, data):
        if data.get('correction_date') and isinstance(data['correction_date'], date):
            data['correction_date'] = data['correction_date'].isoformat()
        return super().to_internal_value(data)

class CorrectiveActionSerializer(serializers.Serializer):
    corrective_action = serializers.CharField(max_length=1000, allow_blank=True)
    corrective_action_date = serializers.DateField(allow_null=True)
    responsible_for_corrective_action = ResponsibleSerializer(many=True, required=False)

    def to_internal_value(self, data):
        if data.get('corrective_action_date') and isinstance(data['corrective_action_date'], date):
            data['corrective_action_date'] = data['corrective_action_date'].isoformat()
        return super().to_internal_value(data)

class NCMXInconsistenciesSerializer(serializers.ModelSerializer):
    normative_documents = NormativeDocumentSerializer(many=True, required=False)
    auditors = AuditorsSerializer(many=True, required=False)
    corrections = CorrectionSerializer(many=True, required=False)
    corrective_actions = CorrectiveActionSerializer(many=True, required=False)

    class Meta:
        model = NCMXInconsistencies
        fields = [
            'num_nonconf', 'normative_documents', 'nonconf', 'report', 'report_date',
            'analysis_start_date', 'analysis_finish_date', 'head_auditor', 'auditors',
            'reason', 'corrections', 'corrective_actions',
            'estimate', 'nonconf_closure_date', 'resp_person_nonconf_closure', 'auto_data', 'is_archived'
        ]

    def validate(self, data):
        if not data.get('num_nonconf') and not self.instance:
            raise serializers.ValidationError({"num_nonconf": "Номер несоответствия обязателен"})
        return data

    def to_internal_value(self, data):
        validated_data = super().to_internal_value(data)
 
        if 'corrections' in validated_data:
            for correction in validated_data['corrections']:
                if correction.get('correction_date') and isinstance(correction['correction_date'], date):
                    correction['correction_date'] = correction['correction_date'].isoformat()
        
        if 'corrective_actions' in validated_data:
            for action in validated_data['corrective_actions']:
                if action.get('corrective_action_date') and isinstance(action['corrective_action_date'], date):
                    action['corrective_action_date'] = action['corrective_action_date'].isoformat()
        
        return validated_data

    def create(self, validated_data):
        print("Validated data (create):", validated_data)  # Отладка
        try:
            if NCMXInconsistencies.objects.filter(num_nonconf=validated_data['num_nonconf']).exists():
                raise serializers.ValidationError({"num_nonconf": f"Несоответствие с номером {validated_data['num_nonconf']} уже существует"})
            return super().create(validated_data)
        except Exception as e:
            print("Create error:", str(e))  # Отладка
            raise serializers.ValidationError({"error": f"Ошибка при создании несоответствия: {str(e)}"})

    def update(self, instance, validated_data):
        print("Validated data (update):", validated_data)  # Отладка
        try:
            instance = super().update(instance, validated_data)
            print("Inconsistency updated:", instance.num_nonconf, "is_archived:", instance.is_archived)
            return instance
        except Exception as e:
            print("Update error:", str(e))  # Отладка
            raise serializers.ValidationError({"error": f"Ошибка при обновлении несоответствия: {str(e)}"})

class NCMXInconsistencyCommentsSerializer(serializers.ModelSerializer):
    num_nonconf = serializers.IntegerField()

    class Meta:
        model = NCMXInconsistencyComments
        fields = ['id', 'num_nonconf', 'comment_author', 'comment_text', 'created_at']

    def validate(self, data):
        if not data.get('num_nonconf'):
            raise serializers.ValidationError({"num_nonconf": "Номер несоответствия обязателен"})
        if not data.get('comment_author'):
            raise serializers.ValidationError({"comment_author": "Автор комментария обязателен"})
        if not data.get('comment_text'):
            raise serializers.ValidationError({"comment_text": "Текст комментария обязателен"})
        
        try:
            NCMXInconsistencies.objects.get(num_nonconf=data['num_nonconf'])
        except NCMXInconsistencies.DoesNotExist:
            raise serializers.ValidationError({"num_nonconf": "Несоответствие с таким номером не существует"})
        return data

    def create(self, validated_data):
        try:
            num_nonconf_value = validated_data.pop('num_nonconf')
            num_nonconf_instance = NCMXInconsistencies.objects.get(num_nonconf=num_nonconf_value)
            comment = NCMXInconsistencyComments.objects.create(
                num_nonconf=num_nonconf_instance,
                comment_author=validated_data['comment_author'],
                comment_text=validated_data['comment_text']
            )
            return comment
        except NCMXInconsistencies.DoesNotExist:
            raise serializers.ValidationError({"num_nonconf": "Несоответствие с таким номером не существует"})
        except Exception as e:
            raise serializers.ValidationError({"error": f"Ошибка при создании комментария: {str(e)}"})

    def update(self, instance, validated_data):
        try:
            num_nonconf_value = validated_data.pop('num_nonconf')
            num_nonconf_instance = NCMXInconsistencies.objects.get(num_nonconf=num_nonconf_value)
            instance.num_nonconf = num_nonconf_instance
            instance.comment_author = validated_data.get('comment_author', instance.comment_author)
            instance.comment_text = validated_data.get('comment_text', instance.comment_text)
            instance.save()
            return instance
        except NCMXInconsistencies.DoesNotExist:
            raise serializers.ValidationError({"num_nonconf": "Несоответствие с таким номером не существует"})
        except Exception as e:
            raise serializers.ValidationError({"error": f"Ошибка при обновлении комментария: {str(e)}"})

    def to_representation(self, instance):
        representation = {
            'id': instance.id,
            'num_nonconf': instance.num_nonconf.num_nonconf,
            'comment_author': instance.comment_author,
            'comment_text': instance.comment_text,
            'created_at': instance.created_at
        }
        return representation