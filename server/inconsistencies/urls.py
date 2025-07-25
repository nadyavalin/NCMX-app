from django.urls import path
from .views import Inconsistencies, InconsistencyDelete, InconsistenciesComments

urlpatterns = [
    path('ncmx-table/', Inconsistencies.as_view(), name='inconsistencies'),
    path('ncmx-table/<int:num_nonconf>/',
         InconsistencyDelete.as_view(), name='inconsistency_detail'),
    path('ncmx-comments/', InconsistenciesComments.as_view(),
         name='inconsistency_comments'),
]
