from rest_framework import serializers
from .models import NCMXInconsistencies, NCMXObservations, NCMXComment, NCMXRescheduleComment
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

class CorrectiveActionSerializer(serializers.Serializer):
    corrective_action = serializers.CharField(max_length=1000, allow_blank=True)
    corrective_action_date = serializers.DateField(allow_null=True)
    responsible_for_corrective_action = ResponsibleSerializer(many=True, required=False)

class SolutionSerializer(serializers.Serializer):
    solution = serializers.CharField(max_length=1000, allow_blank=True)
    solution_date = serializers.DateField(allow_null=True)
    responsible_for_solution = ResponsibleSerializer(many=True, required=False)

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
        print("Validated data (create):", validated_data)
        try:
            if NCMXInconsistencies.objects.filter(num_nonconf=validated_data['num_nonconf']).exists():
                raise serializers.ValidationError({"num_nonconf": f"Несоответствие с номером {validated_data['num_nonconf']} уже существует"})
            return super().create(validated_data)
        except Exception as e:
            print("Create error:", str(e))
            raise serializers.ValidationError({"error": f"Ошибка при создании несоответствия: {str(e)}"})

    def update(self, instance, validated_data):
        print("Validated data (update):", validated_data)
        try:
            instance = super().update(instance, validated_data)
            print("Inconsistency updated:", instance.num_nonconf, "is_archived:", instance.is_archived)
            return instance
        except Exception as e:
            print("Update error:", str(e))
            raise serializers.ValidationError({"error": f"Ошибка при обновлении несоответствия: {str(e)}"})

class NCMXObservationsSerializer(serializers.ModelSerializer):
    normative_documents = NormativeDocumentSerializer(many=True, required=False)
    solutions = SolutionSerializer(many=True, required=False)

    class Meta:
        model = NCMXObservations
        fields = [
            'num_observation', 'normative_documents', 'observation', 'report', 'report_date',
            'analysis_start_date', 'analysis_finish_date', 'solutions',
            'observation_closure_date', 'resp_person_observation_closure', 'auto_data', 'is_archived'
        ]

    def validate(self, data):
        if not data.get('num_observation') and not self.instance:
            raise serializers.ValidationError({"num_observation": "Номер наблюдения обязателен"})
        return data
    
    def to_internal_value(self, data):
        validated_data = super().to_internal_value(data)
 
        if 'solutions' in validated_data:
            for solution in validated_data['solutions']:
                if solution.get('solution_date') and isinstance(solution['solution_date'], date):
                    solution['solution_date'] = solution['solution_date'].isoformat()
        
        return validated_data

    def create(self, validated_data):
        print("Validated data (create):", validated_data)
        try:
            if NCMXObservations.objects.filter(num_observation=validated_data['num_observation']).exists():
                raise serializers.ValidationError({"num_observation": f"Наблюдение с номером {validated_data['num_observation']} уже существует"})
            return super().create(validated_data)
        except Exception as e:
            print("Create error:", str(e))
            raise serializers.ValidationError({"error": f"Ошибка при создании наблюдения: {str(e)}"})

    def update(self, instance, validated_data):
        print("Validated data (update):", validated_data)
        try:
            instance = super().update(instance, validated_data)
            print("Observation updated:", instance.num_observation, "is_archived:", instance.is_archived)
            return instance
        except Exception as e:
            print("Update error:", str(e))
            raise serializers.ValidationError({"error": f"Ошибка при обновлении наблюдения: {str(e)}"})

class NCMXCommentSerializer(serializers.ModelSerializer):
    # Поля для обратной совместимости (опционально)
    num_nonconf = serializers.IntegerField(write_only=True, required=False)
    num_observation = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = NCMXComment
        fields = ['id', 'content_type', 'object_id', 'comment_author', 'comment_text', 'created_at', 'num_nonconf', 'num_observation']
        read_only_fields = ['id', 'created_at']

    def validate(self, data):
        # Определяем content_type и object_id из входных данных
        content_type = data.get('content_type')
        object_id = data.get('object_id')
        
        # Обратная совместимость: если переданы старые поля
        if not content_type and data.get('num_nonconf'):
            content_type = 'inconsistency'
            object_id = data['num_nonconf']
        elif not content_type and data.get('num_observation'):
            content_type = 'observation' 
            object_id = data['num_observation']
        
        if not content_type:
            raise serializers.ValidationError({"content_type": "Тип сущности обязателен"})
        if not object_id:
            raise serializers.ValidationError({"object_id": "ID сущности обязателен"})
        if not data.get('comment_author'):
            raise serializers.ValidationError({"comment_author": "Автор комментария обязателен"})
        if not data.get('comment_text'):
            raise serializers.ValidationError({"comment_text": "Текст комментария обязателен"})
        
        # Проверяем существование связанной сущности
        try:
            if content_type == 'inconsistency':
                NCMXInconsistencies.objects.get(num_nonconf=object_id)
            elif content_type == 'observation':
                NCMXObservations.objects.get(num_observation=object_id)
            # Для improvement можно добавить позже
        except NCMXInconsistencies.DoesNotExist:
            raise serializers.ValidationError({"object_id": "Несоответствие с таким номером не существует"})
        except NCMXObservations.DoesNotExist:
            raise serializers.ValidationError({"object_id": "Наблюдение с таким номером не существует"})
        
        # Обновляем данные для сохранения
        data['content_type'] = content_type
        data['object_id'] = object_id
        
        return data

    def create(self, validated_data):
        try:
            # Удаляем временные поля обратной совместимости
            validated_data.pop('num_nonconf', None)
            validated_data.pop('num_observation', None)
            
            return super().create(validated_data)
        except Exception as e:
            raise serializers.ValidationError({"error": f"Ошибка при создании комментария: {str(e)}"})

    def update(self, instance, validated_data):
        try:
            # Удаляем временные поля обратной совместимости
            validated_data.pop('num_nonconf', None)
            validated_data.pop('num_observation', None)
            
            return super().update(instance, validated_data)
        except Exception as e:
            raise serializers.ValidationError({"error": f"Ошибка при обновлении комментария: {str(e)}"})

    def to_representation(self, instance):
        representation = {
            'id': instance.id,
            'content_type': instance.content_type,
            'object_id': instance.object_id,
            'comment_author': instance.comment_author,
            'comment_text': instance.comment_text,
            'created_at': instance.created_at
        }
        
        # Обратная совместимость: добавляем старые поля
        if instance.content_type == 'inconsistency':
            representation['num_nonconf'] = instance.object_id
        elif instance.content_type == 'observation':
            representation['num_observation'] = instance.object_id
            
        return representation

class NCMXRescheduleCommentSerializer(serializers.ModelSerializer):
    old_date = serializers.DateTimeField(allow_null=True, required=False)
    new_date = serializers.DateTimeField(allow_null=True, required=False)
    action_type = serializers.CharField(allow_null=True, required=False)
    action_index = serializers.IntegerField(allow_null=True, required=False)

    class Meta:
        model = NCMXRescheduleComment
        fields = '__all__'
        read_only_fields = ('id', 'created_at')
    
    def validate(self, data):
        # Проверяем существование связанной сущности
        content_type = data.get('content_type')
        object_id = data.get('object_id')
        
        if content_type and object_id:
            try:
                if content_type == 'inconsistency':
                    NCMXInconsistencies.objects.get(num_nonconf=object_id)
                elif content_type == 'observation':
                    NCMXObservations.objects.get(num_observation=object_id)
            except NCMXInconsistencies.DoesNotExist:
                raise serializers.ValidationError(
                    {"object_id": "Несоответствие с таким номером не существует"}
                )
            except NCMXObservations.DoesNotExist:
                raise serializers.ValidationError(
                    {"object_id": "Наблюдение с таким номером не существует"}
                )
        
        return data
