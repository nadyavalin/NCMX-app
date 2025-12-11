# ncmx_app/urls.py
from django.urls import path
from . import views
from .views import Inconsistencies, Observations, Comments, RescheduleComments

urlpatterns = [
    # Несоответствия
    path('ncmx-table-inconsistencies/', Inconsistencies.as_view(), name='inconsistencies'),
    path('ncmx-table-inconsistencies/<int:num_nonconf>/', Inconsistencies.as_view(), name='inconsistency_detail'),
    path('ncmx-table-inconsistencies/<int:num_nonconf>/restore/', Inconsistencies.as_view(), name='inconsistency_restore'),
    
    # Наблюдения
    path('ncmx-table-observations/', Observations.as_view(), name='observations'),
    path('ncmx-table-observations/<int:num_observation>/', Observations.as_view(), name='observation_detail'),
    path('ncmx-table-observations/<int:num_observation>/restore/', Observations.as_view(), name='observation_restore'),
    
    # Комментарии
    path('ncmx-comments/', Comments.as_view(), name='comments'),
    path('ncmx-comments/<int:id>/', Comments.as_view(), name='comment_detail'),
    
    # Комментарии о переносе сроков
    path('reschedule-comments/', RescheduleComments.as_view(), name='reschedule_comments'),
    path('reschedule-comments/<int:id>/', RescheduleComments.as_view(), name='reschedule_comment_detail'),
]