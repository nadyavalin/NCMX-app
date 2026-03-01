# ncmx_app/urls.py
from django.urls import path
from . import views
from .views import Nonconformities, Observations, Improvements, Comments, RescheduleComments

urlpatterns = [
    # Несоответствия
    path('ncmx-table-nonconformities/', Nonconformities.as_view(), name='nonconformities'),
    path('ncmx-table-nonconformities/<int:num_nonconf>/', Nonconformities.as_view(), name='nonconformities_detail'),
    path('ncmx-table-nonconformities/<int:num_nonconf>/restore/', Nonconformities.as_view(), name='nonconformities_restore'),
    
    # Наблюдения
    path('ncmx-table-observations/', Observations.as_view(), name='observations'),
    path('ncmx-table-observations/<int:num_observation>/', Observations.as_view(), name='observation_detail'),
    path('ncmx-table-observations/<int:num_observation>/restore/', Observations.as_view(), name='observation_restore'),
    
    # Возможности улучшения (ДОБАВИТЬ!)
    path('ncmx-table-improvements/', Improvements.as_view(), name='improvements'),
    path('ncmx-table-improvements/<int:num_improvement>/', Improvements.as_view(), name='improvement_detail'),
    path('ncmx-table-improvements/<int:num_improvement>/restore/', Improvements.as_view(), name='improvement_restore'),

    # Комментарии
    path('ncmx-comments/', Comments.as_view(), name='comments'),
    path('ncmx-comments/<int:id>/', Comments.as_view(), name='comment_detail'),
    
    # Комментарии о переносе сроков
    path('reschedule-comments/', RescheduleComments.as_view(), name='reschedule_comments'),
    path('reschedule-comments/<int:id>/', RescheduleComments.as_view(), name='reschedule_comment_detail'),
]