from django.contrib import admin
from ncmx_app.models import (
    NCMXInconsistencies, 
    NCMXObservations, 
    NCMXComment
)

admin.site.register(NCMXInconsistencies)
admin.site.register(NCMXObservations)
admin.site.register(NCMXComment)