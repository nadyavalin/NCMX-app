from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import NCMXInconsistencies, NCMXObservations, NCMXImprovements, NCMXComment, NCMXRescheduleComment
from .serializers import NCMXInconsistenciesSerializer, NCMXObservationsSerializer, NCMXImprovementsSerializer, NCMXCommentSerializer, NCMXRescheduleCommentSerializer
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
                serializer.validated_data['nonconf_closure_date'] = timezone.now()
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
            
            if serializer.validated_data.get('is_archived') == True:
                serializer.validated_data['observation_closure_date'] = timezone.now()
                # !пока не используется возможность отображения ответственного за закрытие
                if not serializer.validated_data.get('resp_person_observation_closure'):
                    serializer.validated_data['resp_person_observation_closure'] = request.data.get(
                        'resp_person_observation_closure', 'Система'
                    )
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

class Improvements(APIView):
    def get(self, request):
        is_archived = request.query_params.get('is_archived')
        improvements = NCMXImprovements.objects.all()
        if is_archived is not None:
            try:
                is_archived = is_archived.lower() == 'true'
                improvements = improvements.filter(is_archived=is_archived)
            except ValueError:
                logger.error(f"Invalid is_archived value: {is_archived}")
                return Response(
                    {"error": "is_archived должен быть boolean"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        serializer = NCMXImprovementsSerializer(improvements, many=True)
        return Response({"results": serializer.data})

    def post(self, request, num_improvement=None):
        if num_improvement is not None:
            # Обработка восстановления
            improvement = get_object_or_404(NCMXImprovements, num_improvement=num_improvement)
            improvement.is_archived = False
            improvement.save()
            serializer = NCMXImprovementsSerializer(improvement)
            logger.debug(f"Improvement restored: {num_improvement}")
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Обработка создания новой возможности улучшения
        serializer = NCMXImprovementsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.debug(f"Improvement created: {serializer.data}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error(f"Serializer validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, num_improvement):
        improvement = get_object_or_404(NCMXImprovements, num_improvement=num_improvement)
        serializer = NCMXImprovementsSerializer(improvement, data=request.data, partial=True)
        if serializer.is_valid():
            logger.debug(f"Validated data for patch: {serializer.validated_data}")
            
            if serializer.validated_data.get('is_archived') == True:
                serializer.validated_data['improvement_closure_date'] = timezone.now()
                if not serializer.validated_data.get('resp_person_improvement_closure'):
                    serializer.validated_data['resp_person_improvement_closure'] = request.data.get(
                        'resp_person_improvement_closure', 'Система'
                    )
            serializer.save()
            logger.debug(f"Improvement updated: {num_improvement}, is_archived: {improvement.is_archived}")
            return Response(serializer.data, status=status.HTTP_200_OK)
        logger.error(f"Serializer validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, num_improvement):
        improvement = get_object_or_404(NCMXImprovements, num_improvement=num_improvement)
        improvement.delete()
        logger.debug(f"Improvement deleted: {num_improvement}")
        return Response(status=status.HTTP_204_NO_CONTENT)

# УНИВЕРСАЛЬНЫЙ VIEW ДЛЯ ОБЫЧНЫХ КОММЕНТАРИЕВ
class Comments(APIView):
    def get(self, request):
        content_type = request.query_params.get('content_type')
        object_id = request.query_params.get('object_id')
        
        comments = NCMXComment.objects.all()
        
        # Фильтрация по типу сущности и ID
        if content_type:
            comments = comments.filter(content_type=content_type)
        if object_id:
            try:
                object_id = int(object_id)
                comments = comments.filter(object_id=object_id)
            except (ValueError, TypeError):
                logger.error(f"Invalid object_id value: {object_id}")
                return Response(
                    {"error": "object_id должен быть числом"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Обратная совместимость: поддержка старых параметров
        num_nonconf = request.query_params.get('num_nonconf')
        if num_nonconf and not content_type:
            try:
                num_nonconf = int(num_nonconf)
                comments = comments.filter(content_type='inconsistency', object_id=num_nonconf)
            except (ValueError, TypeError):
                logger.error(f"Invalid num_nonconf value: {num_nonconf}")
                return Response(
                    {"error": "num_nonconf должен быть числом"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        num_observation = request.query_params.get('num_observation')
        if num_observation and not content_type:
            try:
                num_observation = int(num_observation)
                comments = comments.filter(content_type='observation', object_id=num_observation)
            except (ValueError, TypeError):
                logger.error(f"Invalid num_observation value: {num_observation}")
                return Response(
                    {"error": "num_observation должен быть числом"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        num_improvement = request.query_params.get('num_improvement')
        if num_improvement and not content_type:
            try:
                num_improvement = int(num_improvement)
                comments = comments.filter(content_type='improvement', object_id=num_improvement)
            except (ValueError, TypeError):
                logger.error(f"Invalid num_improvement value: {num_improvement}")
                return Response(
                    {"error": "num_improvement должен быть числом"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        serializer = NCMXCommentSerializer(comments, many=True)
        return Response({"results": serializer.data})

    def post(self, request):
        logger.debug(f"POST /ncmx-comments/ data: {request.data}")
        serializer = NCMXCommentSerializer(data=request.data)
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
        comment = get_object_or_404(NCMXComment, id=id)
        serializer = NCMXCommentSerializer(comment, data=request.data, partial=True)
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
        comment = get_object_or_404(NCMXComment, id=id)
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

# VIEW ДЛЯ КОММЕНТАРИЕВ О ПЕРЕНОСЕ СРОКОВ
class RescheduleComments(APIView):
    def get(self, request):
        content_type = request.query_params.get('content_type')
        object_id = request.query_params.get('object_id')
        
        comments = NCMXRescheduleComment.objects.all()
        
        if content_type:
            comments = comments.filter(content_type=content_type)
        if object_id:
            try:
                object_id = int(object_id)
                comments = comments.filter(object_id=object_id)
            except (ValueError, TypeError):
                logger.error(f"Invalid object_id value: {object_id}")
                return Response(
                    {"error": "object_id должен быть числом"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        serializer = NCMXRescheduleCommentSerializer(comments, many=True)
        return Response({"results": serializer.data})

    def post(self, request):
        logger.debug(f"POST /reschedule-comments/ data: {request.data}")

        
        serializer = NCMXRescheduleCommentSerializer(data=request.data)
        if serializer.is_valid():
            try:
                comment = serializer.save()
                logger.debug(f"Reschedule comment created: {serializer.data}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                logger.error(f"Error saving reschedule comment: {str(e)}", exc_info=True)
                return Response(
                    {"error": f"Ошибка при сохранении комментария о переносе: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        logger.error(f"Serializer validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, id):
        comment = get_object_or_404(NCMXRescheduleComment, id=id)
        serializer = NCMXRescheduleCommentSerializer(comment, data=request.data, partial=True)
        if serializer.is_valid():
            try:
                comment = serializer.save()
                logger.debug(f"Reschedule comment updated: {serializer.data}")
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                logger.error(f"Error updating reschedule comment: {str(e)}", exc_info=True)
                return Response(
                    {"error": f"Ошибка при обновлении комментария о переносе: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        logger.error(f"Serializer validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id):
        comment = get_object_or_404(NCMXRescheduleComment, id=id)
        try:
            comment.delete()
            logger.debug(f"Reschedule comment deleted: {id}")
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            logger.error(f"Error deleting reschedule comment: {str(e)}", exc_info=True)
            return Response(
                {"error": f"Ошибка при удалении комментария о переносе: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
