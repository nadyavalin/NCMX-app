from django.contrib import admin
from ncmx_app.models import (
    NCMXInconsistencies, 
    NCMXObservations, 
    NCMXComment,
    NCMXRescheduleComment
)

admin.site.register(NCMXInconsistencies)
admin.site.register(NCMXObservations)
admin.site.register(NCMXComment)
admin.site.register(NCMXRescheduleComment)