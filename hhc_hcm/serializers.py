from rest_framework import serializers
from hhcweb import models
from datetime import datetime

class NewHospitalRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
      model = models.agg_hhc_hospitals
      fields=['hosp_id','branch','hospital_name','hospital_short_code','phone_no','website_url','address','status','lattitude','langitude','distance_km','price_change_km','km_price','last_modified_by']
    #   fields = '__all__'
      
# class ServicesSerializer(serializers.ModelSerializer):
#     class Meta:
#       model = models.agg_hhc_services
#       fields = ['srv_id', 'service_title', 'status','added_by','last_modified_by','added_date']
class ServicesSerializer(serializers.ModelSerializer):
    class Meta:
      model = models.agg_hhc_services
      fields = ['srv_id', 'service_title','image_path', 'status','added_by','last_modified_by']

class Profs_serializer(serializers.ModelSerializer):
   class Meta:
      model = models.agg_hhc_service_professionals
      fields=['srv_prof_id','professional_code','clg_ref_id','reference_type','title','skill_set','Job_type','prof_fullname','email_id','phone_no','alt_phone_no','eme_contact_no','eme_contact_relation','eme_conact_person_name','dob','doj','address','work_email_id','work_phone_no','work_address','prof_zone_id','set_location','status','isDelStatus','lattitude','langitude','google_home_location','google_work_location','Physio_Rate','police_varification','apron_charges','document_status','OTP','OTP_count','otp_expire_time','Profile_pic','Ratings','Reviews','OTP_verification','availability_status','mode_of_service','location_status','srv_id','prof_sub_srv_id','Calendar','certificate_registration_no','Experience','gender','Education_level','pin_code_id','prof_address','city','state_name','prof_address','cv_file','profile_file','prof_registered','prof_interviewed','prof_doc_verified','designation','availability','professinal_status','last_modified_by']
    #   fields = '__all__'
      
class SubServicesSerializer(serializers.ModelSerializer):
    srv_name = serializers.SerializerMethodField()
    class Meta:
      model = models.agg_hhc_sub_services
      fields=['sub_srv_id','recommomded_service','srv_id','srv_name','cost','tax','deposit','supplied_by','UOM','status','tf','Instruction','Specimen','last_modified_by']
    #   fields = '__all__'

    def get_srv_name(self, obj):
        return obj.srv_id.service_title
      
class ConsultantSerializer(serializers.ModelSerializer):
    class Meta:
      model = models.agg_hhc_doctors_consultants
      fields = ['doct_cons_id','hos_nm','cons_fullname','email_id','mobile_no','weblogin_password','work_email_id','work_phone_no','work_address','speciality','type1','telephonic_consultation_fees','approved_by','reject_by','reject_reason','status','last_modified_by']
    
      
class CallBackBtnSerializer(serializers.ModelSerializer):
    class Meta:
      model = models.agg_hhc_prof_call_back_btn_rec
      fields=['call_back_btn_id','srv_prof_id','agg_sp_dt_eve_poc_id','last_modified_by']
    #   fields = '__all__'

    #   fields = '__all__'

class Prof_aval_serializer(serializers.ModelSerializer):
   class Meta:
      model = models.agg_hhc_professional_availability
      # fields = '__all__'
      fields = ['professional_avaibility_id', 'srv_prof_id', 'date']

class agg_hhc_prof_avail_serializer(serializers.ModelSerializer):

    srv_prof_id = serializers.PrimaryKeyRelatedField(queryset=models.agg_hhc_service_professionals.objects.all(),many=False)

    class Meta:
        model  = models.agg_hhc_professional_availability

        fields = ['professional_avaibility_id','srv_prof_id', 'date']
        
    def validate(self, data):
        return data
    
    def create(self, validated_data):
        srv_prof_id = validated_data.pop('srv_prof_id')

        validated_data['srv_prof_id'] = srv_prof_id

        pro_loc = models.agg_hhc_professional_availability.objects.create(**validated_data)
        pro_loc.save(force_insert=False)
        return pro_loc
    
    def update(self, instance, validated_data):
        return instance


class agg_hhc_professional_avail_detail_serializer(serializers.ModelSerializer):

    prof_avaib_id = serializers.PrimaryKeyRelatedField(queryset=models.agg_hhc_professional_availability.objects.all(),many=False)
   #  prof_loc_id = serializers.PrimaryKeyRelatedField(queryset=models.agg_hhc_professional_location.objects.all(),many=False)

    class Meta:
        model  = models.agg_hhc_professional_availability_detail

      #   fields = ['prof_avaib_dt_id','prof_avaib_id', 'start_time', 'end_time', 'prof_loc_id']
        fields = ['prof_avaib_dt_id','prof_avaib_id', 'start_time', 'end_time']

    
    def is_time_slot_available(self, requested_start, requested_end, occupied_slots):

        for start, end in occupied_slots:
            start = datetime.strptime(str(start), "%H:%M:%S")
            end = datetime.strptime(str(end), "%H:%M:%S")

            if requested_start < end and requested_end > start:
                return False
        return True
        
    def validate(self, data):
        st = data['start_time']
        ed = data['end_time']
        st_time = datetime.strptime(str(st), "%H:%M:%S")
        ed_time = datetime.strptime(str(ed), "%H:%M:%S")
        prof_avaib_id = data['prof_avaib_id']

        
        occupied_time = models.agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=prof_avaib_id)
        occupied_time_slots = []
        for i in occupied_time: #Adding occupied time slots in list so we can pass this list in the function call.
            start_time = i.start_time
            end_time = i.end_time
            occupied_time_slots.append((start_time, end_time))

        is_available_slots = self.is_time_slot_available(st_time, ed_time, occupied_time_slots)
        if is_available_slots == False: 
            raise serializers.ValidationError({"Time Slot Is Already Taken."})
        else:
            return data
    
    def create(self, validated_data):
        prof_avaib_id = validated_data.pop('prof_avaib_id')
      #   prof_loc_id = validated_data.pop('prof_loc_id')

        validated_data['prof_avaib_id'] = prof_avaib_id
      #   validated_data['prof_loc_id'] = prof_loc_id

        pro_loc_details = models.agg_hhc_professional_availability_detail.objects.create(**validated_data)
        pro_loc_details.save(force_insert=False)
        return pro_loc_details 

class VIPPatient_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_events
        fields = ['eve_id']

class VIPConvert_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.VIPConvert_to_normal
        fields = ['eve_id', 'last_modified_by']

class VIP_event_update_serailzer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_events
        fields = ['eve_id', 'discount_type']
        # fields = ['eve_id', 'discount_type', 'last_modified_by']





# -------------------------------- (Vinayak) Request of reschedule and cancel APi serilizers ----------------------------------
        

class get_ptn_data_of_prof_recan():
    class Meta:
        model = models.agg_hhc_patients
        fields = ['agg_sp_pt_id','name','Age','gender_id','state_id','city_id','address']

class eve_data_recan_re(serializers.ModelSerializer):
    agg_sp_pt_id = get_ptn_data_of_prof_recan()
    class Meta:
        model = models.agg_hhc_events
        fields = ['eve_id','event_code','caller_id','agg_sp_pt_id','final_amount']

class prof_data_to_recan(serializers.ModelSerializer):
     class Meta:
        model = models.agg_hhc_service_professionals
        fields = ['srv_prof_id','professional_code','clg_ref_id','title','Job_type','prof_fullname','phone_no']
                  
class dtl_epoc_data_recan_re(serializers.ModelSerializer):
    srv_prof_id = prof_data_to_recan()
    class Meta:
        model = models.agg_hhc_detailed_event_plan_of_care
        fields = ['agg_sp_dt_eve_poc_id','index_of_Session','srv_prof_id','actual_StartDate_Time','actual_EndDate_Time',
                  'start_time','end_time']

class reschedule_cancle_request_pro_seri(serializers.ModelSerializer):
    dtl_eve_id = dtl_epoc_data_recan_re()
    eve_id = eve_data_recan_re()
    class Meta:
        model = models.agg_hhc_cancellation_and_reschedule_request
        fields = ['req_id','eve_id','epoc_id','dtl_eve_id','is_canceled','is_srv_sesn','is_reschedule',
                  'req_resson','remark','added_by','added_date']


# ==============================================================================================================================

class logedin_prof_serializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    class Meta:
        model = models.agg_com_colleague
        fields = ['id','clg_ref_id', 'name', 'clg_mobile_no','clg_email', 'clg_gender', 'clg_is_login']


    def get_name(self, obj):
        return f'{obj.clg_first_name} {obj.clg_mid_name} {obj.clg_last_name}'
    
    # def get_clg_gender(self, obj):
    #     return





