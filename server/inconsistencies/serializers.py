from rest_framework import serializers
from .models import NCMXInconsistencies, NCMXInconsistencyComments

class NormativeDocumentSerializer(serializers.Serializer):
    norm_doc = serializers.CharField(max_length=50, allow_blank=False)
    point = serializers.CharField(max_length=50, allow_blank=True)

    def validate(self, data):
        if not data.get('norm_doc'):
            raise serializers.ValidationError({"norm_doc": "Нормативный документ обязателен"})
        return data
    
class AuditorsSerializer(serializers.Serializer):
    auditor = serializers.CharField(max_length=50, allow_blank=False)

    def validate(self, data):
        if not data.get('auditor'):
            raise serializers.ValidationError({"auditor": "Укажите не менее одного аудитора"})
        return data
    

class NCMXInconsistenciesSerializer(serializers.ModelSerializer):
    normative_documents = NormativeDocumentSerializer(many=True, required=True)
    auditors = AuditorsSerializer(many = True, required=True)

    class Meta:
        model = NCMXInconsistencies
        fields = [
            'num_nonconf', 'normative_documents', 'nonconf', 'report', 'report_date',
            'analysis_start_date', 'analysis_finish_date', 'head_auditor', 'auditors',
            'reason', 'correction', 'correction_date', 'resp_person_correction',
            'department_correction', 'corrective_action', 'corrective_action_date',
            'resp_person_corrective_action', 'department_corrective_action', 'estimate',
            'nonconf_closure_date', 'resp_person_nonconf_closure', 'auto_data', 'is_archived'
        ]

    def validate(self, data):
        # Проверка num_nonconf только при создании
        if not data.get('num_nonconf') and not self.instance:
            raise serializers.ValidationError({"num_nonconf": "Номер несоответствия обязателен"})

        # Проверка обязательных полей только при создании или если они переданы
        if not self.instance:  # Создание новой записи
            if not data.get('normative_documents') or not any(doc.get('norm_doc') for doc in data.get('normative_documents', [])):
                raise serializers.ValidationError({"normative_documents": "Укажите не менее одного нормативного документа"})
            if not data.get('head_auditor'):
                raise serializers.ValidationError({"head_auditor": "Укажите главного аудитора"})
            if not data.get('auditors') or not any(auditor.get('auditor') for auditor in data.get('auditors', [])):
                raise serializers.ValidationError({"auditors": "Укажите не менее одного аудитора"})
        else:  # Обновление существующей записи
            # Проверяем normative_documents, только если переданы
            if 'normative_documents' in data and (not data.get('normative_documents') or not any(doc.get('norm_doc') for doc in data.get('normative_documents', []))):
                raise serializers.ValidationError({"normative_documents": "Укажите не менее одного нормативного документа"})
            # Проверяем head_auditor, только если передан
            if 'head_auditor' in data and not data.get('head_auditor'):
                raise serializers.ValidationError({"head_auditor": "Укажите главного аудитора"})
            # Проверяем auditors, только если переданы
            if 'auditors' in data and (not data.get('auditors') or not any(auditor.get('auditor') for auditor in data.get('auditors', []))):
                raise serializers.ValidationError({"auditors": "Укажите не менее одного аудитора"})
        return data

    def create(self, validated_data):
        try:
            # Проверка на дублирование num_nonconf
            if NCMXInconsistencies.objects.filter(num_nonconf=validated_data['num_nonconf']).exists():
                raise serializers.ValidationError({"num_nonconf": f"Несоответствие с номером {validated_data['num_nonconf']} уже существует"})
            return super().create(validated_data)
        except Exception as e:
            raise serializers.ValidationError({"error": f"Ошибка при создании несоответствия: {str(e)}"})

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