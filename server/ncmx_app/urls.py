from django.urls import path
from .views import Inconsistencies, InconsistenciesComments, Observations, ObservationsComments

urlpatterns = [
    path('ncmx-table-inconsistencies/', Inconsistencies.as_view(), name='inconsistencies'),
    path('ncmx-table-inconsistencies/<int:num_nonconf>/', Inconsistencies.as_view(), name='inconsistency_detail'),
    path('ncmx-table-inconsistencies/<int:num_nonconf>/restore/', Inconsistencies.as_view(), name='inconsistency_restore'),
    path('ncmx-comments/', InconsistenciesComments.as_view(), name='inconsistency_comments'),
    path('ncmx-comments/<int:id>/', InconsistenciesComments.as_view(), name='inconsistency_comment_detail'),

    path('ncmx-table-observations/', Observations.as_view(), name='observations'),
    path('ncmx-table-observations/<int:num_observation>/', Observations.as_view(), name='observation_detail'),
    path('ncmx-table-observations/<int:num_observation>/restore/', Observations.as_view(), name='observation_restore'),
    path('ncmx-comments-observations/', ObservationsComments.as_view(), name='observation_comments'),
    path('ncmx-comments-observations/<int:id>/', ObservationsComments.as_view(), name='observation_comment_detail'),
]