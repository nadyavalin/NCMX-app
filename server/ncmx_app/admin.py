from django.contrib import admin
from ncmx_app.models import (
    NCMXInconsistencies, 
    NCMXObservations,
    NCMXImprovements,
    NCMXComment,
    NCMXRescheduleComment
)

admin.site.register(NCMXInconsistencies)
admin.site.register(NCMXObservations)
admin.site.register(NCMXImprovements)
admin.site.register(NCMXComment)
admin.site.register(NCMXRescheduleComment)