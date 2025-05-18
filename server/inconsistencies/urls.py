from django.urls import path
from .views import Inconsistencies, InconsistenciesComments

urlpatterns = [
    path('ncmx-table/', Inconsistencies.as_view(), name='inconsistencies'),
    path('ncmx-comments/', InconsistenciesComments.as_view(), name='inconsistency_comments'),
]