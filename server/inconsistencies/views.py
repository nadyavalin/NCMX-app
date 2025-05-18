from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import NCMXInconsistencies, NCMXInconsistencyComments
from .serializers import NCMXInconsistenciesSerializer, NCMXInconsistencyCommentsSerializer

class Inconsistencies(APIView):
    def get(self, request):
        inconsistencies = NCMXInconsistencies.objects.all()
        serializer = NCMXInconsistenciesSerializer(inconsistencies, many=True)
        return Response({"results": serializer.data})

    def post(self, request):
        serializer = NCMXInconsistenciesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InconsistenciesComments(APIView):
    def get(self, request):
        num_nonconf = request.query_params.get('num_nonconf')
        comments = NCMXInconsistencyComments.objects.all()
        if num_nonconf:
            comments = comments.filter(num_nonconf=num_nonconf)
        serializer = NCMXInconsistencyCommentsSerializer(comments, many=True)
        return Response({"results": serializer.data})

    def post(self, request):
        serializer = NCMXInconsistencyCommentsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)