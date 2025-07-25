from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('ncmx_app/api/', include('inconsistencies.urls')),
]
