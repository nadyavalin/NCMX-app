from django.contrib import admin
from ncmx_app.models import NCMXInconsistencies
from ncmx_app.models import NCMXInconsistencyComments
from ncmx_app.models import NCMXObservations
from ncmx_app.models import NCMXObservationComments

admin.site.register(NCMXInconsistencies)
admin.site.register(NCMXInconsistencyComments)
admin.site.register(NCMXObservations)
admin.site.register(NCMXObservationComments)