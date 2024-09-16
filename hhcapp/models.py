from django.db import models
#from hhcweb.models import active_inactive_enum
from django_enumfield import enum
# from hhcweb import models as webmodels

# Create your models here.


class status_enum(enum.Enum):
	Active = 1
	Inactive = 2
	Delete = 3

class agg_hhc_app_add_address(models.Model):
	address_id = models.AutoField(primary_key=True)
	address = models.CharField(max_length=500, null=True)