from rest_framework import serializers
from .models import NCMXInconsistencies, NCMXInconsistencyComments

class NCMXInconsistenciesSerializer(serializers.ModelSerializer):
    class Meta:
        model = NCMXInconsistencies
        fields = [
            'num_nonconf', 'norm_doc', 'point', 'nonconf', 'report', 'report_date',
            'analysis_start_date', 'analysis_finish_date', 'head_auditor', 'auditor',
            'reason', 'correction', 'correction_date', 'resp_person_correction',
            'department_correction', 'corrective_action', 'corrective_action_date',
            'resp_person_corrective_action', 'department_corrective_action', 'estimate',
            'nonconf_closure_date', 'resp_person_nonconf_closure', 'auto_data'
        ]

    def validate(self, data):
        if not data.get('num_nonconf'):
            raise serializers.ValidationError({"num_nonconf": "Номер несоответствия обязателен"})
        return data

class NCMXInconsistencyCommentsSerializer(serializers.ModelSerializer):
    num_nonconf = serializers.IntegerField(write_only=True)

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
        
        # Проверяем, существует ли NCMXInconsistencies с указанным num_nonconf
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

    def to_representation(self, instance):
        representation = {
            'id': instance.id,
            'num_nonconf': instance.num_nonconf.num_nonconf,
            'comment_author': instance.comment_author,
            'comment_text': instance.comment_text,
            'created_at': instance.created_at
        }
        return representation