from rest_framework import serializers
from .models import NCMXInconsistencies, NCMXInconsistencyComments

class NCMXInconsistenciesSerializer(serializers.ModelSerializer):
    class Meta:
        model = NCMXInconsistencies
        fields = '__all__'

class NCMXInconsistencyCommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = NCMXInconsistencyComments
        fields = '__all__'