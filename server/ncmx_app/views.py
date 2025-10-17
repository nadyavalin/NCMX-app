from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import NCMXInconsistencies, NCMXInconsistencyComments, NCMXObservations, NCMXObservationComments
from .serializers import NCMXInconsistenciesSerializer, NCMXInconsistencyCommentsSerializer, NCMXObservationsSerializer, NCMXObservationCommentsSerializer
from django.utils import timezone
import logging

# Настройка логгера
logger = logging.getLogger(__name__)

class Inconsistencies(APIView):
    def get(self, request):
        is_archived = request.query_params.get('is_archived')
        inconsistencies = NCMXInconsistencies.objects.all()
        if is_archived is not None:
            try:
                is_archived = is_archived.lower() == 'true'
                inconsistencies = inconsistencies.filter(is_archived=is_archived)
            except ValueError:
                logger.error(f"Invalid is_archived value: {is_archived}")
                return Response(
                    {"error": "is_archived должен быть boolean"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        serializer = NCMXInconsistenciesSerializer(inconsistencies, many=True)
        return Response({"results": serializer.data})

    def post(self, request, num_nonconf=None):
        if num_nonconf is not None:
            # Обработка восстановления
            inconsistency = get_object_or_404(NCMXInconsistencies, num_nonconf=num_nonconf)
            inconsistency.is_archived = False
            inconsistency.save()
            serializer = NCMXInconsistenciesSerializer(inconsistency)
            logger.debug(f"Inconsistency restored: {num_nonconf}")
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Обработка создания нового несоответствия
        serializer = NCMXInconsistenciesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.debug(f"Inconsistency created: {serializer.data}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error(f"Serializer validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, num_nonconf):
        inconsistency = get_object_or_404(NCMXInconsistencies, num_nonconf=num_nonconf)
        serializer = NCMXInconsistenciesSerializer(inconsistency, data=request.data, partial=True)
        if serializer.is_valid():
            logger.debug(f"Validated data for patch: {serializer.validated_data}")
            if serializer.validated_data.get('estimate') == 1:
                serializer.validated_data['nonconf_closure_date'] = timezone.now()  # Используем DateTime
                serializer.validated_data['is_archived'] = True
            serializer.save()
            logger.debug(f"Inconsistency updated: {num_nonconf}, is_archived: {inconsistency.is_archived}")
            return Response(serializer.data, status=status.HTTP_200_OK)
        logger.error(f"Serializer validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, num_nonconf):
        inconsistency = get_object_or_404(NCMXInconsistencies, num_nonconf=num_nonconf)
        inconsistency.delete()
        logger.debug(f"Inconsistency deleted: {num_nonconf}")
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

    def patch(self, request, id):
        comment = get_object_or_404(NCMXInconsistencyComments, id=id)
        serializer = NCMXInconsistencyCommentsSerializer(comment, data=request.data, partial=True)
        if serializer.is_valid():
            try:
                comment = serializer.save()
                logger.debug(f"Comment updated: {serializer.data}")
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                logger.error(f"Error updating comment: {str(e)}", exc_info=True)
                return Response(
                    {"error": f"Ошибка при обновлении комментария: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        logger.error(f"Serializer validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id):
        comment = get_object_or_404(NCMXInconsistencyComments, id=id)
        try:
            comment.delete()
            logger.debug(f"Comment deleted: {id}")
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            logger.error(f"Error deleting comment: {str(e)}", exc_info=True)
            return Response(
                {"error": f"Ошибка при удалении комментария: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class Observations(APIView):
    def get(self, request):
        is_archived = request.query_params.get('is_archived')
        observations = NCMXObservations.objects.all()
        if is_archived is not None:
            try:
                is_archived = is_archived.lower() == 'true'
                observations = observations.filter(is_archived=is_archived)
            except ValueError:
                logger.error(f"Invalid is_archived value: {is_archived}")
                return Response(
                    {"error": "is_archived должен быть boolean"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        serializer = NCMXObservationsSerializer(observations, many=True)
        return Response({"results": serializer.data})

    def post(self, request, num_observation=None):
        if num_observation is not None:
            # Обработка восстановления
            observation = get_object_or_404(NCMXObservations, num_observation=num_observation)
            observation.is_archived = False
            observation.save()
            serializer = NCMXObservationsSerializer(observation)
            logger.debug(f"Observation restored: {num_observation}")
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Обработка создания нового наблюдения
        serializer = NCMXObservationsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.debug(f"Observation created: {serializer.data}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error(f"Serializer validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, num_observation):
        observation = get_object_or_404(NCMXObservations, num_observation=num_observation)
        serializer = NCMXObservationsSerializer(observation, data=request.data, partial=True)
        if serializer.is_valid():
            logger.debug(f"Validated data for patch: {serializer.validated_data}")
            serializer.save()
            logger.debug(f"Observation updated: {num_observation}, is_archived: {observation.is_archived}")
            return Response(serializer.data, status=status.HTTP_200_OK)
        logger.error(f"Serializer validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, num_observation):
        observation = get_object_or_404(NCMXObservations, num_observation=num_observation)
        observation.delete()
        logger.debug(f"Observation deleted: {num_observation}")
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class ObservationsComments(APIView):
    def get(self, request):
        num_observation = request.query_params.get('num_observation')
        comments = NCMXObservationComments.objects.all()
        if num_observation:
            try:
                num_observation = int(num_observation)
                comments = comments.filter(num_observation__num_observation=num_observation)
            except (ValueError, TypeError):
                logger.error(f"Invalid num_observation value: {num_observation}")
                return Response(
                    {"error": "num_observation должен быть числом"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        serializer = NCMXObservationCommentsSerializer(comments, many=True)
        return Response({"results": serializer.data})

    def post(self, request):
        logger.debug(f"POST /ncmx_app/api/ncmx-comments/ data: {request.data}")
        serializer = NCMXObservationCommentsSerializer(data=request.data)
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

    def patch(self, request, id):
        comment = get_object_or_404(NCMXObservationComments, id=id)
        serializer = NCMXObservationCommentsSerializer(comment, data=request.data, partial=True)
        if serializer.is_valid():
            try:
                comment = serializer.save()
                logger.debug(f"Comment updated: {serializer.data}")
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                logger.error(f"Error updating comment: {str(e)}", exc_info=True)
                return Response(
                    {"error": f"Ошибка при обновлении комментария: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        logger.error(f"Serializer validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id):
        comment = get_object_or_404(NCMXObservationComments, id=id)
        try:
            comment.delete()
            logger.debug(f"Comment deleted: {id}")
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            logger.error(f"Error deleting comment: {str(e)}", exc_info=True)
            return Response(
                {"error": f"Ошибка при удалении комментария: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )