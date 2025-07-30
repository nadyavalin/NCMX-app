from django.urls import path
from .views import Inconsistencies, InconsistencyDelete, InconsistenciesComments

urlpatterns = [
    path('ncmx-table/', Inconsistencies.as_view(), name='inconsistencies'),
    path('ncmx-table/<int:num_nonconf>/', Inconsistencies.as_view(), name='inconsistency_detail'),
    path('ncmx-table/<int:num_nonconf>/delete/', InconsistencyDelete.as_view(), name='inconsistency_delete'),
    path('ncmx-comments/', InconsistenciesComments.as_view(), name='inconsistency_comments'),
]
