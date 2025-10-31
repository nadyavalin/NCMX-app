from django.urls import path
from .views import Inconsistencies, Observations, Comments  # ← ИМПОРТИРОВАТЬ ЕДИНЫЙ Comments VIEW

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
]
