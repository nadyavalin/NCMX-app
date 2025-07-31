from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import NCMXInconsistencies, NCMXInconsistencyComments
from .serializers import NCMXInconsistenciesSerializer, NCMXInconsistencyCommentsSerializer
import logging

# Настройка логгера
logger = logging.getLogger(__name__)

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

    def patch(self, request, num_nonconf):
        inconsistency = get_object_or_404(NCMXInconsistencies, num_nonconf=num_nonconf)
        serializer = NCMXInconsistenciesSerializer(inconsistency, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, num_nonconf):
        inconsistency = get_object_or_404(NCMXInconsistencies, num_nonconf=num_nonconf)
        inconsistency.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class InconsistenciesComments(APIView):
    def get(self, request):
        num_nonconf = request.query_params.get('num_nonconf')
        comments = NCMXInconsistencyComments.objects.all()
        if num_nonconf:
            try:
                num_nonconf = int(num_nonconf)
                comments = comments.filter(num_nonconf__num_nonconf=num_nonconf)
            except (ValueError, TypeError):
                logger.error(f"Invalid num_nonconf value: {num_nonconf}")
                return Response(
                    {"error": "num_nonconf должен быть числом"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        serializer = NCMXInconsistencyCommentsSerializer(comments, many=True)
        return Response({"results": serializer.data})

    def post(self, request):
        logger.debug(f"POST /ncmx_app/api/ncmx-comments/ data: {request.data}")
        serializer = NCMXInconsistencyCommentsSerializer(data=request.data)
        if serializer.is_valid():
            try:
                comment = serializer.save()
                logger.debug(f"Comment created: {serializer.data}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                logger.error(f"Error saving comment: {str(e)}", exc_info=True)
                return Response(
                    {"error": f"Ошибка при сохранении комментария: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        logger.error(f"Serializer validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)