from rest_framework import serializers
from hhcweb import models

class NewHospitalRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
      model = models.agg_hhc_hospitals
      fields = ['hosp_id','branch','hospital_name','hospital_short_code','phone_no','website_url','address','status','lattitude','langitude','distance_km','price_change_km','km_price','last_modified_by']
      # fields = '__all__'