from django.urls import path
from .views import Inconsistencies, InconsistenciesComments

urlpatterns = [
    path('ncmx-table/', Inconsistencies.as_view(), name='inconsistencies'),
    path('ncmx-table/<int:num_nonconf>/', Inconsistencies.as_view(), name='inconsistency_detail'),
    path('ncmx-comments/', InconsistenciesComments.as_view(), name='inconsistency_comments'),
    path('ncmx-comments/<int:id>/', InconsistenciesComments.as_view(), name='inconsistency_comment_detail'),
]