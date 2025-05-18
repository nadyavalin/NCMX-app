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
            'nonconf_closure_date', 'resp_person_nonconf_closure'
        ]

    def validate(self, data):
        if not data.get('num_nonconf'):
            raise serializers.ValidationError({"num_nonconf": "Номер несоответствия обязателен"})
        return data

class NCMXInconsistencyCommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = NCMXInconsistencyComments
        fields = '__all__'
