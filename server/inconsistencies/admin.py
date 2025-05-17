from django.contrib import admin
from inconsistencies.models import NCMXInconsistencies
from inconsistencies.models import NCMXInconsistencyComments

admin.site.register(NCMXInconsistencies)
admin.site.register(NCMXInconsistencyComments)