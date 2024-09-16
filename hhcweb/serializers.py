from rest_framework import serializers
from hhcweb.models import agg_com_colleague, agg_hhc_professional_zone, agg_hhc_service_professionals, agg_hhc_detailed_event_plan_of_care, agg_mas_group, sos_details, agg_hhc_professional_availability_detail, agg_hhc_professional_availability, agg_hhc_professional_locations_as_per_zones
from django.contrib.auth.hashers import make_password, check_password
from datetime import datetime, timedelta
from hhcweb import models
from django.conf import settings
from hhcspero.settings import SERVER_KEY
import requests


# We are writing this because we need confirm password field in our Registration Request
class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type':'password'}, write_only=True)
    grp_id = serializers.PrimaryKeyRelatedField(queryset=agg_mas_group.objects.all(),many=False)
    
    class Meta:
        model  = agg_com_colleague
        # fields = ['pk','clg_ref_id','grp_id','clg_mobile_no', 'clg_otp', 'password','password2']
        fields = ['pk','clg_ref_id', 'clg_first_name', 'clg_mid_name' ,'clg_last_name' ,'grp_id' ,'clg_email' ,'clg_mobile_no' ,'clg_gender' ,'clg_address' ,'clg_is_login' ,'clg_designation' ,'clg_state' ,'clg_division' ,'clg_district' ,'clg_break_type' ,'clg_senior' ,'clg_hos_id' ,'clg_agency_id' ,'clg_status' ,'clg_modify_by' ,'clg_Date_of_birth' ,'clg_Work_phone_number' ,'clg_work_email_id' ,'clg_Emplyee_code' ,'clg_qualification','clg_avaya_agentid' ,'clg_Aadhar_no','clg_specialization', 'clg_profile_photo_path' ,'clg_joining_date' ,'clg_marital_status',  'clg_otp', 'clg_otp_count', 'clg_otp_expire_time', 'password','password2']

        extra_kwargs = {
            'password':{'write_only':True}
        }
        
    def validate(self, data):
        password = data.get('password')
        password2 = data.get('password2')
        if password != password2:
            raise serializers.ValidationError('Password and Confirm Password does not match')

        return data
    
    def create(self, validated_data):
        group_data = validated_data.pop('grp_id')
        validated_data['grp_id'] = group_data

        # Hash the password before creating the user
        password = validated_data.pop('password')
        validated_data['password'] = make_password(password)

        # Create a new user with the hashed password
        user = agg_com_colleague.objects.create_user(**validated_data)
        user.save()
        return user


class UserLoginSerializer(serializers.ModelSerializer):
    clg_ref_id = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(style={'input_type': 'password'})
    class Meta:
        model = agg_com_colleague
        fields = ['clg_ref_id', 'password']



class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_com_colleague
        fields = ['id', 'clg_first_name', 'clg_mid_name' ,'clg_last_name' ,'clg_email' ,'clg_mobile_no' ,'clg_address' ,'clg_designation' ,'clg_Work_phone_number' ,'clg_work_email_id', 'clg_profile_photo_path']





# class professional_otp_dtl(serializers.ModelSerializer):
#     class Meta:
#         model  = SMS_sent_details
#         fields = ["professional_name","contact_number","sent_status","sms_type","status","added_by"]

class AggHHCAttendanceSerializer(serializers.ModelSerializer):
    srv_name = serializers.CharField(source='srv_id.service_title', allow_null=True)
    class Meta:
        model  = agg_hhc_service_professionals
        fields = ['srv_prof_id','prof_fullname','phone_no','Job_type','srv_id','srv_name']
        
    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data












#---------------------------------------------- Sandip ----------------------------------------------------------
class agg_hhc_caller_relation_serializer(serializers.ModelSerializer):
    class Meta:
        model=models.agg_hhc_caller_relation
        fields = ['caller_rel_id','relation']           

class agg_hhc_locations_serializer(serializers.ModelSerializer):
    class Meta:
        model=models.agg_hhc_locations
        fields = ['loc_id','location'] 


class agg_hhc_sub_services_serializer(serializers.ModelSerializer): 
    class Meta:
        model = models.agg_hhc_sub_services
        fields = ['sub_srv_id','recommomded_service','srv_id','cost','Service_Time']

class agg_hhc_sub_services_jc_form_serializer(serializers.ModelSerializer): 
    class Meta:
        model = models.agg_hhc_jobclosure_form_numbering
        fields = ['jc_form_id','prof_sub_srv_id','form_number','status']

    def validate(self, data):
        return data

class agg_hhc_session_job_closure_serializer_form_1(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id','Baseline','Airway', 'Breathing', 'Circulation', 'Temp_core','TBSL','Pulse','SpO2','RR','GCS_Total','BP','diastolic','Skin_Perfusion','Remark','is_patient_death', 'last_modified_by']

    def validate(self, data):
        return data

# class agg_hhc_session_job_closure_serializer_form_2(serializers.ModelSerializer):
#     class Meta:
#         model = models.agg_hhc_jobclosure_detail
#         fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id', 'Movin_or_moveout', 'Getin_or_getout', 'ChairTobed_or_bedTochair', 'Situp_onbed','Unocp_or_ocp_bed','Showershampoo','Incontinent_care','Mouth_care','Shaving','Hand_care','Foot_care','Vital_care', 'motion_care', 'Grooming', 'Bed_bath', 'Feeding', 'Reposition_patient', 'Bed_pan', 'last_modified_by']

#     def validate(self, data):
#         return data
    

class agg_hhc_session_job_closure_serializer_form_2(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id', 'Movin_or_moveout','Mobin_or_moveout_datetime_remark', 'Getin_or_getout','Getin_or_getout_datetime_remark', 'ChairTobed_or_bedTochair','ChairTobed_or_bedTochair_datetime_remark', 'Situp_onbed','Situp_onbed_datetime_remark','Unocp_or_ocp_bed','Unocp_or_ocp_bed_datetime_remark','Showershampoo','Showershampoo_datetime_remark','Incontinent_care','Incontinent_care_datetime_remark','Mouth_care','Mouth_care_datetime_remark','Shaving','Shaving_datetime_remark','Hand_care','Hand_care_datetime_remark','Foot_care','Foot_care_datetime_remark','Vital_care','vital_care_datetime_remark', 'motion_care','motion_care_datetime_remark', 'Grooming','Grooming_datetime_remark', 'Bed_bath','Bed_bath_datetime_remark', 'Feeding','Feeding_datetime_remark', 'Reposition_patient','Reposition_patient_datetime_remark', 'Bed_pan','Bed_pan_datetime_remark', 'last_modified_by']
        
    def validate(self, data):
        return data
    

class agg_hhc_session_job_closure_serializer_form_3(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id','Wound', 'Oozing', 'Discharge', 'Dressing_status', 'last_modified_by']

    def validate(self, data):
        return data
class agg_hhc_session_job_closure_serializer_form_4(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id', 'Name_injection_fld', 'Inj_site_IM', 'Dose_freq', 'Remark', 'last_modified_by']

    def validate(self, data):
        return data
class agg_hhc_session_job_closure_serializer_form_5(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id', 'Catheter_type', 'Size_catheter', 'Procedure', 'Remark', 'last_modified_by']

    def validate(self, data):
        return data

class agg_hhc_session_job_closure_serializer_form_6(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id','Baseline','Airway','Breathing','Circulation', 'Remark', 'last_modified_by']

    def validate(self, data):
        return data

class agg_hhc_session_job_closure_serializer_form_7(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_jobclosure_detail
        # fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id', 'Temp_core', 'TBSL', 'Pulse', 'SpO2', 'RR', 'GCS_Total', 'BP', 'last_modified_by']
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id', 'Temp_core', 'TBSL', 'Pulse', 'SpO2', 'RR', 'GCS_Total', 'BP','diastolic', 'last_modified_by']
    def validate(self, data):
        return data


class agg_hhc_session_job_closure_serializer_form_8(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id', 'Sutures_type', 'Num_Sutures_staples', 'Wound_dehiscence', 'Wound', 'Remark', 'last_modified_by']

    def validate(self, data):
        return data

class agg_hhc_session_job_closure_serializer_form_9(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id', 'Size_RT', 'Procedure', 'Remark', 'last_modified_by']

    def validate(self, data):
        return data
class agg_hhc_session_job_closure_serializer_form_10(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id', 'Strength_exer', 'Stretch_exer', 'Walk_indep', 'Walker_stick' ,'Remark', 'last_modified_by']

    def validate(self, data):
        return data

# class agg_hhc_services_serializer(serializers.ModelSerializer):
#     class Meta:
#         model = models.agg_hhc_services
#         fields = ['srv_id','service_title']

class agg_hhc_event_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_events
        # fields = ['purp_call_id', 'event_status', 'Total_cost', 'discount_type', 'discount_value', 'final_amount', 'refer_by', 'enq_spero_srv_status','day_convinance','total_convinance','added_from_hosp']
        fields = ['purp_call_id', 'event_status', 'Total_cost', 'discount_type', 'discount_value', 'final_amount', 'refer_by', 'enq_spero_srv_status','added_from_hosp','Patient_status_at_present','Suffered_from', 'last_modified_by','coupon_id']

class agg_hhc_event_response_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_events
        fields = ['agg_sp_pt_id','caller_id']



class cf_payment_otp_details(serializers.ModelSerializer):
    class Meta:
        model = models.SMS_sent_details
        fields = ["patient_name","contact_number","sent_status","sms_type","status","added_by"]





class agg_hhc_job_cl_questions_eventwise(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_events_wise_jc_question
        fields = ['eve_id','srv_id','jcq_id','is_srv_enq_q']

class agg_hhc_updateIDs_event_serializer(serializers.ModelSerializer): #also used to allocate
    class Meta:
        model = models.agg_hhc_events
        fields = ['eve_id','agg_sp_pt_id','caller_id','status','enq_spero_srv_status','Suffered_from', 'last_modified_by','added_by']
        # fields = ['purp_call_id', 'event_status', 'Total_cost', 'discount_type', 'discount_value', 'final_amount', 'refer_by', 'enq_spero_srv_status','added_from_hosp','Patient_status_at_present','Suffered_from']

class agg_hhc_updateID_event_serializer(serializers.ModelSerializer): #also used to allocate
    class Meta:
        model = models.agg_hhc_events
        # fields = ['eve_id','agg_sp_pt_id','caller_id','status','enq_spero_srv_status','Suffered_from']
        fields = ['purp_call_id', 'event_status', 'Total_cost', 'discount_type', 'discount_value', 'final_amount', 'refer_by', 'enq_spero_srv_status','added_from_hosp','Patient_status_at_present','Suffered_from', 'last_modified_by']

        

class get_service_name(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_services
        fields = ['srv_id', 'service_title']

class get_sub_service_name(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_sub_services
        fields = ['sub_srv_id', 'recommomded_service']

class agg_hhc_add_service_serializer(serializers.ModelSerializer):
    srv_id = get_service_name()
    sub_srv_id = get_sub_service_name()
    class Meta:
        model = models.agg_hhc_event_plan_of_care
        fields = ['eve_poc_id','srv_id', 'sub_srv_id', 'start_date', 'end_date', 'prof_prefered','remark','start_time','end_time']

class agg_hhc_add_service_put_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_event_plan_of_care
        fields = ['eve_poc_id','srv_id', 'sub_srv_id', 'start_date', 'end_date', 'prof_prefered','remark']

class put_agg_hhc_add_service_put_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_event_plan_of_care
        fields = ['eve_poc_id','srv_id', 'sub_srv_id', 'prof_prefered','remark', 'last_modified_by']

class agg_hhc_create_service_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_event_plan_of_care
        fields = ['eve_poc_id','srv_id', 'sub_srv_id', 'start_date', 'end_date', 'prof_prefered','remark','start_time','end_time','initail_final_amount','No_session_dates', 'doct_cons_id', 'hosp_id', 'last_modified_by']

    def validate(self, data):
        excluded_fields = ['prof_prefered', 'remark', 'initail_final_amount']
        excluded_fields_present = {field_name: data.get(field_name) for field_name in excluded_fields}
        for field_name in data:
            if field_name not in excluded_fields_present and not data[field_name]:
                field_label = self.fields[field_name].label
                raise serializers.ValidationError(f"{field_label} field is required.")
        return data
class agg_hhc_add_discount_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_events
        fields = ['discount_type', 'discount','total_cost','final_cost']

class relation_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_caller_relation
        fields = ['caller_rel_id', 'relation']

class Caller_details_serializer(serializers.ModelSerializer):
    # caller_rel_id=relation_serializer()
    class Meta:
        model = models.agg_hhc_callers
        fields = ['phone', 'caller_fullname']

class Update_Caller_details_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_callers
        fields = ['phone', 'caller_fullname', 'last_modified_by']



class preffered_proffesional(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_doctors_consultants
        fields = ['doct_cons_id','cons_fullname','mobile_no']

class patient_get_zone_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_professional_zone
        fields = ['prof_zone_id', 'Name']

class agg_hhc_state(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_state
        fields = ['state_id','state_name']

class agg_hhc_city(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_city
        fields = ['city_id','city_name']

class hospital_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_hospitals
        fields = ['hosp_id', 'hospital_name']



class patient_detail_serializer(serializers.ModelSerializer):
    preferred_hosp_id=hospital_serializer()
    doct_cons_id=preffered_proffesional()
    prof_zone_id=patient_get_zone_serializer()
    state_id = agg_hhc_state()
    city_id = agg_hhc_city() 
    class Meta:
        model = models.agg_hhc_patients
        fields = ['agg_sp_pt_id','name', 'gender_id', 'Suffered_from', 'preferred_hosp_id', 'phone_no', 'patient_email_id','doct_cons_id','Age', 'state_id' ,'city_id' ,'address' ,'google_address','pincode' ,'prof_zone_id']

class update_patient_detail_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_patients
        fields = ['agg_sp_pt_id','name', 'gender_id', 'Suffered_from', 'preferred_hosp_id', 'phone_no', 'patient_email_id','doct_cons_id','Age', 'state_id' ,'city_id' ,'address' ,'pincode' ,'prof_zone_id', 'last_modified_by']
        # fields = ['agg_sp_pt_id','name', 'gender_id', 'Suffered_from', 'preferred_hosp_id', 'phone_no', 'patient_email_id','doct_cons_id','Age','state_id' ,'city_id' ,'address' ,'pincode' ,'prof_zone_id']



class payment_status(serializers.Serializer):
    class Meta:
        model = models.agg_hhc_payments
        fields = ['pay_id', 'Transaction_Type', 'amount']
# ------------------------------------------------------ Vishal -------------------------------------------------------
class agg_hhc_purpose_call_serializer(serializers.ModelSerializer):#25
    class Meta:
        model=models.agg_hhc_purpose_call
        # fields='__all__'
        fields = ['purp_call_id','name']
        


class agg_hhc_gender_serializer(serializers.ModelSerializer):#112
    class Meta:
        model=models.agg_hhc_gender
        fields=['gender_id','name','status','last_modified_by']
        # fields='__all__'


class agg_hhc_patients_serializer(serializers.ModelSerializer):#6
    class Meta:
        model=models.agg_hhc_patients
        # fields='__all__'
        fields=['agg_sp_pt_id','caller_id','name','Age','gender_id','preferred_hosp_id','Suffered_from','phone_no','patient_email_id','doct_cons_id','state_id','city_id','prof_zone_id','caller_rel_id','address','pincode','lattitude','langitude','google_address', 'last_modified_by']

    # def validate(self, data):
    #     excluded_fields = ['caller_id', 'pincode']
    #     excluded_fields_present = {field_name: data.get(field_name) for field_name in excluded_fields}
    #     for field_name in data:
    #         if field_name not in excluded_fields_present and not data[field_name]:
    #             # If any required field (except excluded fields) is empty, raise validation error
    #             field_label = self.fields[field_name].label
    #             raise serializers.ValidationError(f"{field_label} field is required.")
    #     return data

class agg_hhc_services_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_services
        fields = ['srv_id','service_title']
#############______________get patient details from caller id but latest record_______#

class get_latest_patient_record_from_caller_id(serializers.ModelSerializer):
    class Meta:
        model=models.agg_hhc_patients
        fields=['agg_sp_pt_id','doct_cons_id','caller_id','caller_rel_id','hhc_code','name','Age','gender_id','patient_email_id','state_id','city_id','address','google_address','prof_zone_id','pincode','otp','otp_expire_time','Suffered_from','hospital_name','preferred_hosp_id','phone_no','dob','status','isVIP','lattitude','langitude','Profile_pic','last_modified_by']
        # fields='__all__'

#####_____________________agg_hhc_callers_____________________________________________#######

class agg_hhc_callers_serializer(serializers.ModelSerializer):#20
    # fullname=serializers.SerializerMethodField()
    class Meta:
        model=models.agg_hhc_callers
        # fields=('caller_fullname','caller_id','phone','caller_rel_id','gender','email','Address','profile_pic','purp_call_id')
        fields=('caller_fullname','caller_id','phone','purp_call_id', 'last_modified_by')
    def validate(self, data):
        caller_rel_id = data.get('caller_rel_id')
        for field_name in data:
            if field_name != 'caller_rel_id' and not data[field_name]:
                # If any required field (except caller_rel_id) is empty, raise validation error
                field_label = self.fields[field_name].label
                raise serializers.ValidationError(f"{field_label} field is required.")
        return data

    
##_______________________________enquiry_list________________##

class agg_hhc_patinet_list_enquiry_serializer(serializers.ModelSerializer):
    class Meta:
        model=models.agg_hhc_patient_list_enquiry
        fields=['pt_id','doct_cons_id','caller_id','name','phone_no','call_type','relation','preferred_hosp_id','Age','patient_date_of_birth','gender_id','Suffered_from','hospital_name','patient_add','google_location','patient_Locality','patient_contact','patient_email_id','srv_id','Patient_status_at_present','Start_Date_and_Time','enquiry_status','enquiry_from','address','city_id','state_id','pincode','refer_by','sub_location','prof_zone_id','last_modified_by']
        # fields='__all__'

class agg_hhc_get_state_serializer(serializers.ModelSerializer):    
    class Meta:
        model = models.agg_hhc_state
        fields = ['state_id','state_name']

#_____________________________agg_hhc_service_professional_details____##
class agg_hhc_service_professional_details_serializer(serializers.ModelSerializer):
    class Meta:
        model=models.agg_hhc_service_professional_details
        fields=['srv_prof_dt_id','srv_prof_id','qualification','specialization','skill_set','work_experience','hospital_attached_to','pancard_no','service_tax','status','designation','reference_1','reference_2','reference_1_contact_num','reference_2_contact_num','last_modified_by']
        # fields='__all__'

class agg_hhc_services_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_services
        fields = ['srv_id','service_title']
        
#__________________________agg_hhc_callers_seralizer____________________##
class agg_hhc_callers_seralizer(serializers.ModelSerializer):
    class Meta:
        model=models.agg_hhc_callers
        fields=['caller_id','clg_ref_id','phone','otp','otp_expire_time','caller_fullname','purp_call_id','Age','gender','email','alter_contact','Address','city','locality','state','pincode','emp_id','profile_pic','status','service_taken','last_modified_by']
        # fields='__all__'

class agg_hhc_get_city_serializer1(serializers.ModelSerializer):    
    class Meta:
        model = models.agg_hhc_city
        fields = ['city_id','city_name']
class agg_hhc_app_patient_by_caller_phone_no(serializers.ModelSerializer):
    state= serializers.SerializerMethodField()
    city=serializers.SerializerMethodField()
    zone=serializers.SerializerMethodField()
    gender=serializers.SerializerMethodField()
    doct_cons=serializers.SerializerMethodField()
    preferred_hosp=serializers.SerializerMethodField()
    # new_user=serializers.SerializerMethodField()
    class Meta:
        model=models.agg_hhc_patients
        fields=['agg_sp_pt_id','doct_cons','caller_id','caller_rel_id','hhc_code','name','Age','gender','patient_email_id','state','city','address','google_address','zone','pincode','otp','otp_expire_time','Suffered_from','hospital_name','preferred_hosp','phone_no','dob','status','isVIP','lattitude','langitude','Profile_pic','last_modified_by']
        # fields=['agg_sp_pt_id','doct_cons_id','caller_id','caller_rel_id','hhc_code','name','Age','gender_id','patient_email_id','state_id','city_id','address','google_address','prof_zone_id','pincode','otp','otp_expire_time','Suffered_from','hospital_name','preferred_hosp_id','phone_no','dob','status','isVIP','lattitude','langitude','Profile_pic','last_modified_by']
    def get_state(self, instance):
        state_id_is = instance.state_id
        state_name_serializer = agg_hhc_get_state_serializer(state_id_is)
        return state_name_serializer.data
    def get_city(self,instance):
        city_id_is=instance.city_id
        city_id_serializer=agg_hhc_get_city_serializer1(city_id_is)
        return city_id_serializer.data
    def get_zone(self,instance):
        zone_id_is=instance.prof_zone_id
        zone_id_serializer=agg_hhc_professional_zone_serializer(zone_id_is)
        return zone_id_serializer.data
    def get_gender(self,instance):
        gender_id_is=instance.gender_id
        gender_id_serializer=agg_hhc_gender_serializer(gender_id_is)
        return gender_id_serializer.data
    def get_doct_cons(self,instance):
        doct_cons_id_is=instance.doct_cons_id
        gender_id_serializer=preffered_proffesional(doct_cons_id_is)
        return gender_id_serializer.data
    def get_preferred_hosp(self,instance):
        pref_hospital_id_is=instance.preferred_hosp_id
        pref_hospital_serializer=hospital_serializer(pref_hospital_id_is)
        return pref_hospital_serializer.data
    # def get_new_user(self,instance):
    #     return {'New':'new user'}
    # def to_representation(self, instance):
    #     data = super().to_representation(instance)
    #     print(instance)
    #     state_data = models.agg_hhc_state.objects.get(state_id=instance.state_id)
    #     state_data_serialized =agg_hhc_get_state_serializer(state_data).data
    #     data['state'] = state_data_serialized
    #     return data

#______________________________________agg_hhc_callers_serializer_____________
class agg_hhc_callers_details_serializer(serializers.ModelSerializer):#20
    # fullname = serializers.SerializerMethodField()
    # caller_rel_id=relation_serializer()
    class Meta:
        model=models.agg_hhc_callers
        fields=('caller_fullname','caller_id','phone','Age','gender','email','Address','profile_pic')
    # def get_fullname(self, obj):
    #     return f"{obj.fname} {obj.lname}".strip()
        
class agg_hhc_form_callers_details_serializer(serializers.ModelSerializer):#20
    # fullname = serializers.SerializerMethodField()
    # caller_rel_id=relation_serializer()
    class Meta:
        model=models.agg_hhc_callers
        fields=('caller_fullname','caller_id','phone','Age','gender','email','Address','profile_pic')
    # def get_fullname(self, obj):
    #     return f"{obj.fname} {obj.lname}".strip()
#------------------------------------agg_hhc_hospitals_serializer_____________
class agg_hhc_hospitals_serializer(serializers.ModelSerializer):
    class Meta:
        model=models.agg_hhc_hospitals
        fields=['hosp_id','branch','hospital_name','hospital_short_code','phone_no','website_url','address','status','lattitude','langitude','distance_km','price_change_km','km_price','last_modified_by']
        # fields='__all__'
    
#-----------------------------------agg_hhc_agg_hhc_pincode-----------------------
class agg_hhc_pincode_serializer(serializers.ModelSerializer):
    class Meta:
        model=models.agg_hhc_pincode
        fields=['pincode_id','state_name','city_id','pincode_number','last_modified_by']
        # fields="__all__"

#--------------------------------------agg_hhc_city--------------------------
class agg_hhc_city(serializers.ModelSerializer):
    class Meta:
        model=models.agg_hhc_city
        fields=['city_id','city_name','state_id','status','last_modified_by']
        # fields='__all__'

#------------------------------------agg_hhc_service_professionals------------

class agg_hhc_service_professionals_serializer(serializers.ModelSerializer): #professional availablity details with professional name and professional skill 
    class Meta:
        model=models.agg_hhc_service_professionals
        fields=('first_name','last_name','skill_set')
    
#-------------------------------------agg_hhc_professional_scheduled-----------

class agg_hhc_professional_scheduled_serializer(serializers.ModelSerializer):
    class Meta:
        model=models.agg_hhc_professional_scheduled
        fields=('srv_prof_id','scheduled_date','from_time','to_time')

#------------------------------------agg_hhc_event_professional---------------------

class agg_hhc_event_professional_serializer(serializers.ModelSerializer):
    class Meta:
        model=models.agg_hhc_event_professional
        fields=('eve_prof_id','eve_id','eve_req_id','srv_prof_id','eve_poc_id','srv_id')

#--------------------------------agg_hhc_recived_hospitals------------------

class agg_hhc_recived_hospitals_serializer(serializers.ModelSerializer):
    class Meta:
        model=models.agg_hhc_recived_hospitals
        fields=('')



class agg_hhc_professional_Denial_serializer(serializers.ModelSerializer):
    class Meta:
        model=models.agg_hhc_professional_Denial_reason
        fields=['Denial_reason_id','srv_prof_id','Reason_lst_id','eve_id','reason_note','status','last_modified_by']
        # fields="__all__"
    
class agg_hhc_professional_Denial_reason_list_serializer(serializers.ModelSerializer):
    class Meta:
        model=models.agg_hhc_professional_Denial_reason_list
        fields=['Reason_lst_id','reason','status','last_modified_by']
        # fields='__all__'

#----------------------------------------agg_hhc_professional_zone------------------------#

# class agg_hhc_professional_zone_serializer(serializers.ModelSerializer):
#     class Meta:
#         model=models.agg_hhc_professional_zone
#         fields='__all__'




#--------------------------------------mayank--------------------------------------------
class JobTypeCountSerializer(serializers.ModelSerializer):
    class Meta :
        model  = agg_hhc_service_professionals
        fields = ['Job_type','status']
# class Services_data(serializers.ModelSerializer)
class AggHHCServiceProfessionalSerializer(serializers.ModelSerializer):
    phone_no = serializers.SerializerMethodField()
    # Services = Services_data()

    class Meta:
        model = models.agg_hhc_service_professionals
        fields = ('prof_fullname', 'srv_id', 'phone_no','Ratings','Experience','Calendar','clg_ref_id')
    
    def get_phone_no(self, obj):
        get_clg = agg_com_colleague.objects.get(clg_ref_id=obj.clg_ref_id)
        return get_clg.clg_Work_phone_number

    def to_representation(self, instance):
        # Serialize the instance using the default representation
        data = super().to_representation(instance)
        
        # Check if srv_id exists before accessing service_title
        if instance.srv_id:
            data['service_title'] = instance.srv_id.service_title
        else:
            data['service_title'] = None  # or any default value if srv_id is None

        return data
    


    # def get_full_name(self, obj):
    #     return f"{obj.first_name} {obj.middle_name} {obj.last_name}".strip()

# class PaymentDetailSerializer(serializers.ModelSerializer):
#     # pay_recived_by = serializers.PrimaryKeyRelatedField(queryset=agg_com_colleague.objects.all(),many=False)
#     class Meta:
#         model = models.agg_hhc_payment_details
#         fields = ['pay_dt_id','eve_id', 'Total_cost', 'paid_by', 'amount_paid', 'amount_remaining', 'date','mode', 'pay_recived_by','online_payment_by','srv_prof_id', 'last_modified_by','overall_status']



class PaymentDetailSerializercash(serializers.ModelSerializer):
    # pay_recived_by = serializers.PrimaryKeyRelatedField(queryset=agg_com_colleague.objects.all(),many=False)
    class Meta:
        model = models.agg_hhc_payment_details
        # fields = ['pay_dt_id','eve_id', 'Total_cost', 'paid_by', 'amount_paid', 'amount_remaining', 'utr','date','mode', 'Remark', 'pay_recived_by','online_payment_by','srv_prof_id', 'last_modified_by','overall_status']
        fields = ['pay_dt_id','eve_id', 'Total_cost', 'paid_by', 'amount_paid', 'amount_remaining', 'utr','date','mode', 'Remark', 'pay_recived_by','online_payment_by','srv_prof_id', 'last_modified_by','overall_status','payment_to_desk_date']


class PaymentDetailchequeSerializer(serializers.ModelSerializer):
    # pay_recived_by = serializers.PrimaryKeyRelatedField(queryset=agg_com_colleague.objects.all(),many=False)
    class Meta:
        model = models.agg_hhc_payment_details
        # fields = ['pay_dt_id','eve_id', 'Total_cost', 'paid_by', 'amount_paid', 'amount_remaining', 'date','mode', 'utr','pay_recived_by','cheque_number','cheque_date',
        #           'cheque_image',
        #           'Remark','online_payment_by','srv_prof_id', 'last_modified_by','overall_status']
        fields = ['pay_dt_id','eve_id', 'Total_cost', 'paid_by', 'amount_paid', 'amount_remaining', 'date','mode','utr', 'pay_recived_by','cheque_number','cheque_date','bank_name',
                #   'cheque_image',
                  'Remark','online_payment_by','srv_prof_id', 'last_modified_by','overall_status', 'payment_to_desk_date']

class PaymentDetailcardSerializer(serializers.ModelSerializer):
    # pay_recived_by = serializers.PrimaryKeyRelatedField(queryset=agg_com_colleague.objects.all(),many=False)
    class Meta:
        model = models.agg_hhc_payment_details
        # fields = ['pay_dt_id','eve_id', 'Total_cost', 'paid_by', 'amount_paid', 'amount_remaining', 'date','mode', 'utr','pay_recived_by','card_no','transaction_id', 'Remark', 'srv_prof_id', 'last_modified_by','overall_status']
        fields = ['pay_dt_id','eve_id', 'Total_cost', 'paid_by', 'amount_paid', 'amount_remaining', 'date','mode','utr', 'pay_recived_by','card_no','transaction_id', 'Remark', 'srv_prof_id', 'last_modified_by','overall_status', 'payment_to_desk_date']


class PaymentDetailQRSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_payment_details
        # fields = ['pay_dt_id','eve_id', 'Total_cost', 'paid_by', 'amount_paid', 'amount_remaining', 'date','mode','utr', 'pay_recived_by','transaction_id', 'Remark', 'srv_prof_id', 'last_modified_by','overall_status']
        fields = ['pay_dt_id','eve_id', 'Total_cost', 'paid_by', 'amount_paid', 'amount_remaining', 'date','mode', 'utr','pay_recived_by','transaction_id', 'Remark', 'srv_prof_id', 'last_modified_by','overall_status', 'payment_to_desk_date']


class PaymentDetailNEFTSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_payment_details
        # fields = ['pay_dt_id','eve_id', 'Total_cost', 'paid_by', 'amount_paid', 'amount_remaining', 'date','mode','utr', 'pay_recived_by','transaction_id', 'Remark', 'srv_prof_id', 'last_modified_by','overall_status']
        fields = ['pay_dt_id','eve_id', 'Total_cost', 'paid_by', 'amount_paid', 'amount_remaining', 'date','mode','utr', 'pay_recived_by','transaction_id', 'Remark', 'srv_prof_id', 'last_modified_by','overall_status', 'payment_to_desk_date']





class collectAmtProfSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_professional_track_payment_details
        # fields = ['eve_id', 'Total_cost', 'paid_by', 'amount_paid', 'amount_remaining', 'date','mode', 'Remark', 'pay_recived_by','srv_prof_id', 'last_modified_by','overall_status']

        fields = ["eve_id","srv_prof_id","Total_cost","paid_by" ,"amount_paid" ,"amount_remaining"  ,"pay_recived_by","receipt_no" ,"mode" ,"bank_name" ,"cheque_number",
                  "cheque_status","bank_name","cheque_date","card_no","transaction_id" ,"note","order_id" ,"order_currency" ,"order_note" ,"customer_email",
                  'customer_phone' ,"payment_status","utr","transaction_status" ,"overall_status" ,"cf_token" ,"online_payment_by" ,"Remark","status","added_by","last_modified_by"]









class GetPaymentDetailSerializer(serializers.ModelSerializer):  
    class Meta:
        model = models.agg_hhc_payment_details
        fields = ['eve_id', 'Total_cost', 'amount_paid', 'amount_remaining','overall_status']

class GetEventPaymentDetailSerializer(serializers.ModelSerializer):  
    class Meta:
        model = models.agg_hhc_events
        fields = ['eve_id', 'final_amount']
#--------------------------------------agg_hhc_service_professionals------------------

class agg_hhc_service_professionals_zone_serializer(serializers.ModelSerializer):
    fullname=serializers.SerializerMethodField()
    class Meta:
        model=models.agg_hhc_service_professionals
        fields=('fullname','skill_set')
    def get_fullname(self,obj): 
        return f"{obj.first_name} {obj.last_name}".strip()
    

#--------------------------------agg_hhc_feedback_answers----------------------------

class agg_hhc_feedback_answers_serializer(serializers.ModelSerializer):
    class Meta:
        model=models.agg_hhc_service_professionals
        fields=['srv_prof_id','professional_code','clg_ref_id','reference_type','title','skill_set','Job_type','prof_fullname','email_id','phone_no','alt_phone_no','eme_contact_no','eme_contact_relation','eme_conact_person_name','dob','doj','address','work_email_id','work_phone_no','work_address','prof_zone_id','set_location','status','isDelStatus','lattitude','langitude','google_home_location','google_work_location','Physio_Rate','police_varification','apron_charges','document_status','OTP','OTP_count','otp_expire_time','Profile_pic','Ratings','Reviews','OTP_verification','availability_status','mode_of_service','location_status','srv_id','prof_sub_srv_id','Calendar','certificate_registration_no','Experience','gender','Education_level','pin_code_id','prof_address','city','state_name','prof_address','cv_file','profile_file','prof_registered','prof_interviewed','prof_doc_verified','designation','availability','professinal_status','last_modified_by']
        # fields='__all__'

#---------------------------------------agg_hhc_event_plan_of_care------------------

class agg_hhc_event_plan_of_care_serializer(serializers.ModelSerializer):
    class Meta:
        model=models.agg_hhc_event_plan_of_care
        fields=['eve_poc_id','eve_id','srv_id','sub_srv_id','hosp_id','doct_cons_id','srv_prof_id','No_session_dates','start_date','end_date','start_time','end_time','initail_final_amount','service_reschedule','prof_prefered','status','remark','service_status']



#---------------------------------------------Nikita P---------------------------------------------------------

class agg_hhc_professional_location_serializer(serializers.ModelSerializer):

    srv_prof_id = serializers.PrimaryKeyRelatedField(queryset=agg_hhc_service_professionals.objects.all(),many=False)

    class Meta:
        model  = models.agg_hhc_professional_location

        fields = ['prof_loc_id','srv_prof_id', 'location_name', 'last_modified_by']
        
    def validate(self, data):
        return data
    
    def create(self, validated_data):
        srv_prof_id = validated_data.pop('srv_prof_id')

        validated_data['srv_prof_id'] = srv_prof_id

        pro_loc = models.agg_hhc_professional_location.objects.create(**validated_data)
        pro_loc.save(force_insert=False)
        return pro_loc
    
class agg_hhc_professional_location_details_serializer(serializers.ModelSerializer):

    prof_loc_id = serializers.PrimaryKeyRelatedField(queryset=models.agg_hhc_professional_location.objects.all(),many=False)

    class Meta:
        model  = models.agg_hhc_professional_location_details

        fields = ['prof_loc_dt_id','lattitude', 'longitude', 'location_name', 'prof_loc_id', 'last_modified_by']
        
    def validate(self, data):
        return data
    
    def create(self, validated_data):
        prof_loc_id = validated_data.pop('prof_loc_id')

        validated_data['prof_loc_id'] = prof_loc_id

        pro_loc_details = models.agg_hhc_professional_location_details.objects.create(**validated_data)
        pro_loc_details.save(force_insert=False)
        return pro_loc_details
    
class agg_hhc_professional_location_zones_serializer(serializers.ModelSerializer):

    prof_loc_dtl_id = serializers.PrimaryKeyRelatedField(queryset=models.agg_hhc_professional_location_details.objects.all(),many=False)
    prof_zone_id = serializers.PrimaryKeyRelatedField(queryset=agg_hhc_professional_zone.objects.all(),many=False)
    srv_prof_id = serializers.PrimaryKeyRelatedField(queryset=agg_hhc_service_professionals.objects.all(),many=False)

    class Meta:
        model  = models.agg_hhc_professional_locations_as_per_zones

        fields = ['prof_loc_zone_id','prof_loc_dtl_id', 'prof_zone_id', 'srv_prof_id', 'last_modified_by']
        
    def validate(self, data):
        return data
    
    def create(self, validated_data):
        prof_loc_dtl_id = validated_data.pop('prof_loc_dtl_id')
        prof_zone_id = validated_data.pop('prof_zone_id')
        srv_prof_id = validated_data.pop('srv_prof_id')

        validated_data['prof_loc_dtl_id'] = prof_loc_dtl_id
        validated_data['prof_zone_id'] = prof_zone_id
        validated_data['srv_prof_id'] = srv_prof_id

        pro_loc_zone_details = models.agg_hhc_professional_locations_as_per_zones.objects.create(**validated_data)
        pro_loc_zone_details.save(force_insert=False)
        return pro_loc_zone_details
    
    
class agg_hhc_prof_availability_serializer(serializers.ModelSerializer):

    srv_prof_id = serializers.PrimaryKeyRelatedField(queryset=agg_hhc_service_professionals.objects.all(),many=False)

    class Meta:
        model  = models.agg_hhc_professional_availability

        fields = ['professional_avaibility_id','srv_prof_id', 'day', 'last_modified_by']

    # def get_date(self,obj):
    #     if(obj.date!=None):
    #         return obj.date.strftime("%d-%m-%Y")
    #     else:
    #         return None
        
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


class agg_hhc_professional_availability_detail_serializer123(serializers.ModelSerializer):

    prof_avaib_id = serializers.PrimaryKeyRelatedField(queryset=agg_hhc_professional_availability.objects.all(),many=False)
    prof_loc_zone_id = serializers.PrimaryKeyRelatedField(queryset=agg_hhc_professional_locations_as_per_zones.objects.all(),many=False)

    class Meta:
        model  = agg_hhc_professional_availability_detail

        fields = ['prof_avaib_dt_id','prof_avaib_id', 'start_time', 'end_time', 'prof_loc_zone_id','last_modified_by', 'prof_zone_id']



class agg_hhc_professional_availability_detail_serializer(serializers.ModelSerializer):

    prof_avaib_id = serializers.PrimaryKeyRelatedField(queryset=models.agg_hhc_professional_availability.objects.all(),many=False)
    prof_loc_zone_id = serializers.PrimaryKeyRelatedField(queryset=models.agg_hhc_professional_locations_as_per_zones.objects.all(),many=False)

    class Meta:
        model  = models.agg_hhc_professional_availability_detail

        fields = ['prof_avaib_dt_id','prof_avaib_id', 'start_time', 'end_time', 'prof_loc_zone_id','last_modified_by']

    
    def is_time_slot_available(self, requested_start, requested_end, occupied_slots):

        for start, end in occupied_slots:
            start = datetime.strptime(str(start), "%H:%M:%S")
            end = datetime.strptime(str(end), "%H:%M:%S")

            # if requested_start < end and requested_end > start: #This condition will not allow double entry for same time slot in availability_detail table.
            #     return False
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
        prof_loc_zone_id = validated_data.pop('prof_loc_zone_id')

        validated_data['prof_avaib_id'] = prof_avaib_id
        validated_data['prof_loc_zone_id'] = prof_loc_zone_id

        pro_loc_details = models.agg_hhc_professional_availability_detail.objects.create(**validated_data)
        pro_loc_details.save(force_insert=False)
        return pro_loc_details 
    
class agg_hhc_professional_availability_detail_serializer2(serializers.ModelSerializer):

    prof_avaib_id = serializers.PrimaryKeyRelatedField(queryset=models.agg_hhc_professional_availability.objects.all(),many=False)
    prof_zone_id = serializers.PrimaryKeyRelatedField(queryset=agg_hhc_professional_zone.objects.all(),many=False)
    

    class Meta:
        model  = models.agg_hhc_professional_availability_detail

        fields = ['prof_avaib_dt_id','prof_avaib_id', 'start_time', 'end_time','prof_zone_id' , 'last_modified_by']

    
    def is_time_slot_available(self, requested_start, requested_end, occupied_slots):

        for start, end in occupied_slots:
            start = datetime.strptime(str(start), "%H:%M:%S")
            end = datetime.strptime(str(end), "%H:%M:%S")

            # if requested_start < end and requested_end > start: #This condition will not allow double entry for same time slot in availability_detail table.
            #     return False
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
        prof_zone_id = validated_data.pop('prof_zone_id')

        validated_data['prof_avaib_id'] = prof_avaib_id
        validated_data['prof_zone_id'] = prof_zone_id

        pro_loc_details = models.agg_hhc_professional_availability_detail.objects.create(**validated_data)
        pro_loc_details.save(force_insert=False)
        return pro_loc_details 






class agg_hhc_sos_dtl_serializer(serializers.ModelSerializer):
    # srv_prof_id = serializers.PrimaryKeyRelatedField(queryset=agg_hhc_service_professionals.objects.all(),many=False)

    class Meta:
        model  = sos_details
        fields = ['sos_id','srv_prof_id','dtl_eve_id','sos_remark','status','action_status','last_modified_by', 'last_modified_date']
        # fields = '__all__'
        
    def validate(self, data):
        return data
    
class agg_hhc_sos_dtl_serializer_get(serializers.ModelSerializer):
    # srv_prof_id = serializers.PrimaryKeyRelatedField(queryset=agg_hhc_service_professionals.objects.all(),many=False)

    class Meta:
        model  = sos_details
        fields = ['sos_id','srv_prof_id','dtl_eve_id','sos_remark','status','action_status','last_modified_by', 'last_modified_date', 'added_date']
        # fields = '__all__'
        
    def validate(self, data):
        return data
    
class hd_remark_sos_dtls_serializer(serializers.ModelSerializer):
    class Meta:
        model  = sos_details
        fields = ['sos_id', 'sos_remark', 'action_status', 'last_modified_by']
        # fields = ['sos_id', 'sos_remark', 'action_status', 'last_modified_by', 'last_modified_date']

    def validate(self, data):
        return data
    
    # def create(self, validated_data):
    #     srv_prof_id = validated_data.pop('srv_prof_id')
    #     dtl_eve_id = validated_data.pop('dtl_eve_id')

    #     validated_data['srv_prof_id'] = srv_prof_id
    #     validated_data['dtl_eve_id'] = dtl_eve_id

    #     sos_dtl = sos_details.objects.create(**validated_data)
    #     sos_dtl.save(force_insert=False)
    #     return sos_dtl
    
class agg_hhc_professional_zone_serializer(serializers.ModelSerializer):
    class Meta:
        model  = agg_hhc_professional_zone
        fields = ['prof_zone_id','city_id','Name','last_modified_by']
        # fields = '__all__'
        
    def validate(self, data):
        return data
    
class agg_hhc_service_professional_serializer(serializers.ModelSerializer):
    # bg_status = serializers.SerializerMethodField()
    class Meta:
        model  = agg_hhc_service_professionals
        fields = ['srv_prof_id','professional_code','clg_ref_id','reference_type','title','skill_set','Job_type','prof_fullname','email_id','phone_no','dob','doj','address','work_email_id','work_phone_no','work_address','prof_zone_id','set_location','status','isDelStatus','lattitude','langitude','google_home_location','google_work_location','Physio_Rate','police_varification_charges','document_status','Profile_pic','Ratings','Reviews','availability_status','mode_of_service','location_status','srv_id','prof_sub_srv_id','Experience','gender','Education_level','pin_code_id','prof_address','city','state_name','profile_file','prof_registered','prof_interviewed','prof_doc_verified','designation','professinal_status','last_modified_by']
        # 'prof_zone_id2'
        # fields = '__all__'
        
    def validate(self, data):
        print("Validated data--- ", data)
        return data
    
class agg_hhc_service_professional_serializer2(serializers.ModelSerializer):
    # bg_status = serializers.SerializerMethodField()
    class Meta:
        model  = agg_hhc_service_professionals
        fields = ['srv_prof_id','prof_fullname']
        
    def validate(self, data):
        return data
    

    
class all_dtl_evnts_serializer(serializers.ModelSerializer):
    class Meta:
        model  = agg_hhc_detailed_event_plan_of_care
        fields = ['agg_sp_dt_eve_poc_id','eve_poc_id','eve_id','index_of_Session','srv_prof_id_id','actual_StartDate_Time','actual_EndDate_Time','start_time','end_time','service_cost','amount_received','emp_id','Session_status','Session_jobclosure_status','session_note','Reason_for_no_serivce','Comment_for_no_serivce','OTP','OTP_count','otp_expire_time','Reschedule_status','is_convinance','convinance_charges','is_cancelled','remark','status','last_modified_from','last_modified_by', 'prof_session_start_date', 'prof_session_end_date', 'prof_session_start_time', 'prof_session_end_time']
        #fields = ['srv_prof_id_id']
        # fields = ['agg_sp_dt_eve_poc_id', 'eve_poc_id', 'eve_id', 'srv_prof_id', 'actual_StartDate_Time', 'actual_EndDate_Time', 'remark']

class agg_hhc_detailed_event_plan_of_care_serializer(serializers.ModelSerializer):
    class Meta:
        model  = agg_hhc_detailed_event_plan_of_care

        fields = ['agg_sp_dt_eve_poc_id','eve_poc_id','eve_id','index_of_Session','srv_prof_id','actual_StartDate_Time','actual_EndDate_Time','start_time','end_time','service_cost','amount_received','emp_id','Session_status','Session_jobclosure_status','session_note','Reason_for_no_serivce','Comment_for_no_serivce','OTP','OTP_count','otp_expire_time','Reschedule_status','is_convinance','convinance_charges','is_cancelled','remark','status','last_modified_from','last_modified_by']
        # fields = '__all__'
        # fields = ['agg_sp_dt_eve_poc_id', 'eve_poc_id', 'eve_id', 'srv_prof_id', 'actual_StartDate_Time', 'actual_EndDate_Time', 'remark']
        
    def is_time_slot_available(self, requested_start, requested_end, occupied_slots):
        for start, end in occupied_slots:
            start = datetime.strptime(str(start), "%H:%M:%S")
            end = datetime.strptime(str(end), "%H:%M:%S")

            if requested_start < end and requested_end > start:
                return False
        return True
    
        
    def validate(self, data):
        srv_prof_id = data['srv_prof_id']
        actual_date = data['actual_StartDate_Time']
        st = data['actual_StartDate_Time']
        ed = data['actual_EndDate_Time']
        st_date = st.strftime('%Y-%m-%d')
        std = st.strftime('%H:%M:%S')
        edd = ed.strftime('%H:%M:%S')
        
        st_time = datetime.strptime(str(std), "%H:%M:%S")
        ed_time = datetime.strptime(str(edd), "%H:%M:%S")
        day = actual_date.strftime('%d')

        prof_avaib = models.agg_hhc_professional_availability.objects.filter(srv_prof_id=srv_prof_id, day=day)
        prof_avaib_id = prof_avaib[0].professional_avaibility_id
        
        occupied_time1 =  models.agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=prof_avaib_id)
        
        occupied_time2 =  agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id=srv_prof_id,actual_StartDate_Time__icontains =st_date,status=1 )
        print("occupied_time2--- ",occupied_time2)

        occupied_time_slots1 = []
        for i in occupied_time1:
            start_time = i.start_time
            end_time = i.end_time
            print("Occu1 ---------- ",start_time, end_time)
            occupied_time_slots1.append((start_time, end_time))

        occupied_time_slots2 = []
        for i in occupied_time2:
            start_time = i.actual_StartDate_Time
            end_time = i.actual_EndDate_Time
            std = start_time.strftime('%H:%M:%S')
            edd = end_time.strftime('%H:%M:%S')

            print("Occu2 ---------- ",std, edd)
            occupied_time_slots2.append((std, edd))


        is_available_slots1 = self.is_time_slot_available(st_time, ed_time, occupied_time_slots1)
        is_available_slots2 = self.is_time_slot_available(st_time, ed_time, occupied_time_slots2)

        print(is_available_slots1)
        print(is_available_slots2)
        if is_available_slots1 == True and is_available_slots2 == True: 
            return data
        else:
            raise serializers.ValidationError("Time Slot Is Already Taken.")


#--------------------mohin------------------------------------------------------------------


class agg_hhc_events_serializers1(serializers.ModelSerializer):
    class Meta:
        model=models.agg_hhc_events
        fields = ['event_code','eve_id','caller_id','added_from_hosp','agg_sp_pt_id','purp_call_id','bill_no_ref_no','event_date','note','enquiry_added_date','enquiry_status','enquiry_cancellation_reason','enquiry_cancel_date','Total_cost','discount_type','discount_value','final_amount','status','day_convinance','total_convinance','isArchive','isConvertedService','Invoice_narration','invoice_narration_desc','branch_code','Suffered_from','OTP','OTP_count','otp_expire_time','address_id','enq_spero_srv_status','event_status','refer_by','Patient_status_at_present','patient_service_status','last_modified_by']
        # fields="__all__"
    

#--------------------------------------ongoing service------------------


class get_prof_zone_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_professional_zone
        fields = ['prof_zone_id','Name']

class PatientSerializer(serializers.ModelSerializer):
    prof_zone_id = get_prof_zone_serializer()
    class Meta:
        model = models.agg_hhc_patients
        fields = ['name', 'phone_no','patient_email_id','prof_zone_id']

class Patient_by_HHCID_Serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_patients
        fields=['agg_sp_pt_id','doct_cons_id','caller_id','caller_rel_id','hhc_code','name','Age','gender_id','patient_email_id','state_id','city_id','address','google_address','prof_zone_id','pincode','otp','otp_expire_time','Suffered_from','hospital_name','preferred_hosp_id','phone_no','dob','status','isVIP','lattitude','langitude','Profile_pic','last_modified_by']


class ProfessionalDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_service_professionals
        fields = ['prof_fullname','srv_prof_id']

        
class ServiceSerilaizer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_services
        fields = ['srv_id','service_title']

class sbuserviceid(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_sub_services
        fields = ['sub_srv_id','recommomded_service']

        
class ProfesNameSerializer(serializers.ModelSerializer):
    sub_srv_id = sbuserviceid()
    srv_prof_id = serializers.SerializerMethodField()
    srv_id = ServiceSerilaizer()
    class Meta:
        model = models.agg_hhc_event_plan_of_care
        fields = ['start_date','end_date','prof_prefered','eve_id','srv_id','sub_srv_id','srv_prof_id','service_status']
    
    def get_srv_prof_id(self, obj):
        get_all_prof = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id, status=1)
                
        if get_all_prof.exists():
            today_dtl_poc = get_all_prof.filter(actual_StartDate_Time=timezone.now().date()).first()
            last_dtl_poc = get_all_prof.latest('actual_StartDate_Time')
            first_dtl_poc = get_all_prof.order_by('actual_StartDate_Time').first()
            selected_dtl_poc = today_dtl_poc or first_dtl_poc or last_dtl_poc
            if selected_dtl_poc:
                serializer = ProfessionalDataSerializer(selected_dtl_poc.srv_prof_id)
                return serializer.data

        return None
        
            
class agg_hhc_event_Serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_events
        fields=['eve_id','event_code','caller_id','added_from_hosp','agg_sp_pt_id','purp_call_id','bill_no_ref_no','event_date','note','enquiry_added_date','enquiry_status','enquiry_cancellation_reason','enquiry_cancel_date','Total_cost','discount_type','discount_value','final_amount','status','day_convinance','total_convinance','isArchive','isConvertedService','Invoice_narration','invoice_narration_desc','branch_code','Suffered_from','OTP','OTP_count','otp_expire_time','address_id','enq_spero_srv_status','event_status','refer_by','Patient_status_at_present','patient_service_status','last_modified_by']
  
class agg_hhc_event_plan_of_care_H_T_Serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_event_plan_of_care_history_tracker
        fields = ['eve_poc_id', 'eve_id', 'srv_id', 'sub_srv_id', 'hosp_id', 'doct_cons_id', 'srv_prof_id', 'No_session_dates', 'start_date', 'end_date', 'start_time', 'end_time', 'initail_final_amount', 'prof_prefered', 'status', 'remark', 'service_status', 'last_modified_by']


class SessionStatusSerializer(serializers.ModelSerializer):
    Total_case_count = serializers.SerializerMethodField()
    session_done = serializers.SerializerMethodField()
    Session_jobclosure_status = serializers.SerializerMethodField()

    class Meta:
        model = models.agg_hhc_detailed_event_plan_of_care
        fields = ['eve_id', 'Session_status', 'Total_case_count','session_done','Session_jobclosure_status']
    
    # def get_Session_jobclosure_status(self, obj):
    #     queryset = models.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id, Session_jobclosure_status=1,  status=1)
    #     return queryset.count()
       
    # def get_Total_case_count(self, obj):
    #     # queryset = models.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id)
    #     queryset = models.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id, status=status_enum.Active)
    #     return queryset.count()

    # def get_session_done(self, obj):
    #     queryset = models.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id, Session_status=9,status=1)
    #     return queryset.count()

    def get_session_data(self, obj):
        return models.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id, status=1)

    def get_Session_jobclosure_status(self, obj):
        session_data = self.get_session_data(obj)
        return session_data.filter(Session_jobclosure_status=1).count()

    def get_Total_case_count(self, obj):
        session_data = self.get_session_data(obj)
        return session_data.count()

    def get_session_done(self, obj):
        session_data = self.get_session_data(obj)
        return session_data.filter(Session_status=9).count()
        

class AggHhcPaymentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_payments
        fields = ['event_id', 'amount']


from django.db.models import Sum
from decimal import Decimal
class OngoingServiceSerializer(serializers.ModelSerializer):
    agg_sp_pt_id = PatientSerializer()
    srv_prof_id = ProfesNameSerializer(many=True, source = 'event_id')
    Pending_amount = serializers.SerializerMethodField()
    session_status = SessionStatusSerializer(many=True, source='event_id')  
    added_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = models.agg_hhc_events
        fields = ('eve_id','event_code','final_amount','agg_sp_pt_id','srv_prof_id','Pending_amount','session_status',
                   'status','event_status','added_by','added_by_name')
    

    
    def to_representation(self, instance):
        event_status = instance.event_status
        status = instance.status
        if status == 1 and event_status == 2 or 3:
        
            event_id = instance.eve_id
            
            payment_sum = models.agg_hhc_payment_details.objects.filter(eve_id=event_id, status=1,overall_status="SUCCESS").aggregate(
                    total_amount_paid=Sum('amount_paid')
                )['total_amount_paid']

          
            final_amt = Decimal(instance.final_amount)
            
            if payment_sum is not None:
                payment_sum_decimal = Decimal(payment_sum)
                if final_amt is not None:
                   
                    amt = float(final_amt - payment_sum_decimal)
                    
                    if amt < 0:
                        instance.final_amount = float(final_amt) + abs(amt)
                
            return super().to_representation(instance)

           

    
    def get_Pending_amount(self, instance):
        event_id = instance.eve_id
        try:
            payment_sum = models.agg_hhc_payment_details.objects.filter(eve_id=event_id, status=1,overall_status="SUCCESS").aggregate(
                total_amount_paid=Sum('amount_paid')
            )['total_amount_paid']
            final_amt_eve = models.agg_hhc_events.objects.get(eve_id = event_id, status=1)
            total_cost = Decimal(final_amt_eve.final_amount)
            if payment_sum is not None:
                payment_sum_decimal = Decimal(payment_sum)
                if total_cost is not None:
                    total_cost_decimal = Decimal(total_cost)
                    pending_amount = float(total_cost_decimal - payment_sum_decimal)
                    print(pending_amount,"pending_amount ", final_amt_eve.eve_id," eve_id")
                    return pending_amount
                else:
                    return None
            else:
                if total_cost is not None:
                    return float(total_cost)  
                else:
                    return None  
        except models.agg_hhc_payment_details.DoesNotExist:
            if total_cost is not None:
                return float(total_cost) 
            else:
                return None


    def get_added_by_name(self, obj):
        clg_ref_id = obj.added_by
        if clg_ref_id is not None:
            colleague = models.agg_com_colleague.objects.filter(clg_ref_id=clg_ref_id).first()
            if colleague is not None:
                first_name = colleague.clg_first_name if colleague.clg_first_name else ""
                last_name = colleague.clg_last_name if colleague.clg_last_name else ""
                return first_name + " " + last_name
        return None

        
      
# -------------------------------------Amit Rasale------------------------------------------------------------
class agg_hhc_enquiry_previous_follow_up_serializer(serializers.ModelSerializer):
    added_by_name = serializers.SerializerMethodField()

    class Meta:
        model = models.agg_hhc_enquiry_follow_up
        fields = (
            'enq_follow_up_id', 'event_id', 'follow_up_date_time', 
            'previous_follow_up_remark', 'follow_up_count', 'added_by', 'added_by_name'
        )

    def get_added_by_name(self, instance):
        clg_data = agg_com_colleague.objects.filter(clg_ref_id=instance.added_by)
        full_name = ''
        if clg_data.exists():  # Ensure that the queryset is not empty
            if clg_data[0].clg_first_name:
                full_name += clg_data[0].clg_first_name
            if clg_data[0].clg_mid_name:
                full_name += ' ' + clg_data[0].clg_mid_name
            if clg_data[0].clg_last_name:
                full_name += ' ' + clg_data[0].clg_last_name
        return full_name

    def to_representation(self, instance):
        """Override this method to modify the serialized output."""
        representation = super().to_representation(instance)
        
        # Convert follow_up_date_time from datetime to date
        if isinstance(instance.follow_up_date_time, datetime):
            representation['follow_up_date_time'] = instance.follow_up_date_time.date()
        
        return representation
# class agg_hhc_enquiry_previous_follow_up_serializer(serializers.ModelSerializer):   
#     added_by_name=serializers.SerializerMethodField()
#     class Meta:
#         model=models.agg_hhc_enquiry_follow_up
#         fields=('enq_follow_up_id', 'event_id', 'follow_up_date_time', 'previous_follow_up_remark','follow_up_count','added_by','added_by_name')
#     def get_added_by_name(self, instance):
#         clg_data = agg_com_colleague.objects.filter(clg_ref_id = instance.added_by)
#         # print(clg_data, ';;;ddddddd')
#         full_name = ''
#         if clg_data[0].clg_first_name:
#             full_name=full_name+' '+clg_data[0].clg_first_name
#         if clg_data[0].clg_mid_name:
#             full_name=full_name+' '+clg_data[0].clg_mid_name
#         if clg_data[0].clg_last_name:
#             full_name+ ' '+clg_data[0].clg_last_name
#         return full_name
    
#     def to_representation(self, instance):
#         """Override this method to modify the serialized output."""
#         representation = super().to_representation(instance)
        
#         # Convert follow_up_date_time from datetime to date
#         if isinstance(instance.follow_up_date_time, datetime):
#             representation['follow_up_date_time'] = instance.follow_up_date_time.date()
        
#         return representation
    
        # id=models.agg_hhc_enquiry_follow_up.objects.get(enq_follow_up_id=instance.enq_follow_up_id)
        # id=id.added_by

        # if id:
        #     # print(id,';;l;;')
        #     f_name=id.clg_ref_id.clg_first_name
        #     m_name=id.clg_ref_id.clg_mid_name
        #     l_name=id.clg_ref_id.clg_last_name
        #     # data = {'clg_ref_id':id.clg_ref_id,'name':f_name+' '+m_name+' '+l_name}
        
        # # print(instance.enq_follow_up_id,'demo1')
        #     return data
        # else: return None





# -------------------------------------Amit Rasale---------------------------------------------------------------


class group_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_mas_group
        fields = ['grp_name', 'grp_code', 'grp_level', 'grp_status', 'added_by', 'last_modified_by']
class module_serializer(serializers.ModelSerializer):
    # group = group_serializer()
    group = serializers.PrimaryKeyRelatedField(queryset=agg_mas_group.objects.all())
    class Meta:
        model = models.Permission_module
        fields = ['name', 'added_by', 'modify_by', 'group']


class permission_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.permission
        fields = ['name', 'module', 'added_by', 'modify_by']







class agg_hhc_service_previous_follow_up_serializer(serializers.ModelSerializer):   
    added_by_name=serializers.SerializerMethodField()
    class Meta:
        model=models.agg_hhc_service_follow_up
        fields=('srv_follow_up_id', 'event_id', 'follow_up_date_time', 'previous_follow_up_remark','follow_up_count','added_by','added_by_name')
    def get_added_by_name(self, instance):
        clg_data = agg_com_colleague.objects.filter(clg_ref_id = instance.added_by)
        # print(clg_data, ';;;ddddddd')
        full_name = ''
        if clg_data[0].clg_first_name:
            full_name=full_name+' '+clg_data[0].clg_first_name
        if clg_data[0].clg_mid_name:
            full_name=full_name+' '+clg_data[0].clg_mid_name
        if clg_data[0].clg_last_name:
            full_name+ ' '+clg_data[0].clg_last_name
        return full_name
    
    
    


class User_Edit_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_com_colleague
        fields = ['clg_ref_id', 'clg_first_name', 'grp_id', 'clg_hos_id', 'clg_email', 'clg_work_email_id', 'clg_Emplyee_code', 'clg_mobile_no', 'clg_Work_phone_number', 'clg_Date_of_birth', 'clg_marital_status', 'clg_gender', 'clg_state', 'clg_division', 'clg_district', 'clg_address', 'clg_joining_date', 'added_by', 'added_date', 'last_modified_by', 'last_modified_date', 'is_active', 'clg_status']

class Create_User_serializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()

    class Meta:
        model = agg_com_colleague
        fields = ['pk', 'clg_ref_id', 'clg_first_name', 'grp_id', 'type', 'clg_hos_id', 'clg_marital_status', 'clg_gender', 'clg_email', 'clg_work_email_id', 'clg_Emplyee_code', 'clg_mobile_no', 'clg_Work_phone_number', 'clg_Date_of_birth', 'clg_state', 'clg_division', 'clg_district', 'clg_address', 'clg_joining_date', 'added_by', 'added_date', 'last_modified_by', 'last_modified_date', 'is_active', 'clg_status']

    def get_type(self, obj):
        if obj.grp_id:
            return obj.grp_id.grp_name
        else:
            return "None"
   

class group_and_type_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_mas_group
        fields = ['grp_id', 'grp_name']



class Create_User_POST_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_com_colleague
        fields = ['clg_ref_id', 'clg_first_name', 'grp_id', 'clg_hos_id', 'clg_email', 'clg_work_email_id', 'clg_Emplyee_code', 'clg_mobile_no', 'clg_Work_phone_number', 'clg_Date_of_birth', 'clg_marital_status', 'clg_gender', 'clg_state', 'clg_division', 'clg_district', 'clg_address', 'clg_joining_date', 'added_by', 'added_date', 'last_modified_by', 'last_modified_date', 'is_active', 'clg_status']

    def create(self, validated_data):
        user = agg_com_colleague(**validated_data)
        user.set_password('1234')  # Set the default password here
        user.save()
        return user
    

class active_inActive_User_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_com_colleague
        fields = ['pk', 'clg_ref_id', 'is_active', 'clg_status']    

# ------------------------------------- Amit Rasale------------------------------------------------------------

class agg_hhc_ongoing_Add_follow_up_serializer(serializers.ModelSerializer):   
    class Meta:
        model=models.agg_hhc_enquiry_follow_up
        fields=['enq_follow_up_id', 'event_id', 'follow_up', 'follow_up_date_time', 'previous_follow_up_remark','follow_up_count']
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if data.get('follow_up_count') == 5:
            return data
        else:
            return {}

class agg_hhc_enquiry_Add_follow_up_serializer(serializers.ModelSerializer):   
    class Meta:
        model=models.agg_hhc_enquiry_follow_up
        fields=['enq_follow_up_id', 'event_id', 'follow_up', 'follow_up_date_time', 'previous_follow_up_remark','follow_up_count','last_modified_by']
        # fields = '__all__'
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if data.get('follow_up_count') != 5:
            return data
        else:
            return {}



class agg_hhc_service_Add_follow_up_serializer(serializers.ModelSerializer):   
    class Meta:
        model=models.agg_hhc_service_follow_up
        fields=['srv_follow_up_id', 'event_id', 'follow_up', 'follow_up_date_time', 'previous_follow_up_remark','follow_up_count','last_modified_by']
        # fields = '__all__'
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if data.get('follow_up_count') != 5:
            return data
        else:
            return {}
        

class agg_hhc_enquiry_create_follow_up_serializer(serializers.ModelSerializer):   
    class Meta:
        model=models.agg_hhc_enquiry_follow_up
        fields=('enq_follow_up_id', 'event_id','follow_up', 'last_modified_by')

class agg_hhc_enquiry_follow_up_cancellation_reason_spero_serializer(serializers.ModelSerializer):   
    class Meta:
        model=models.agg_hhc_enquiry_follow_up_cancellation_reason
        fields = ['cancelation_reason_id','cancelation_reason','cancel_by_id']

class agg_hhc_enquiry_follow_up_cancellation_reason_patent_serializer(serializers.ModelSerializer):   
    class Meta:
        model=models.agg_hhc_enquiry_follow_up_cancellation_reason
        fields=('canclation_reason_id', 'canclation_reason_patent')

class agg_hhc_enquiry_Add_follow_up_Cancel_by_serializer(serializers.ModelSerializer):   
    class Meta:
        model=models.agg_hhc_enquiry_follow_up
        fields=('enq_follow_up_id', 'event_id', 'follow_up', 'cancel_by', 'canclation_reason', 'previous_follow_up_remark', 'follow_up_date_time','follow_up_count', 'last_modified_by')


class agg_hhc_service_Add_follow_up_Cancel_by_serializer(serializers.ModelSerializer):   
    class Meta:
        model=models.agg_hhc_service_follow_up
        fields=('srv_follow_up_id', 'event_id', 'follow_up', 'cancel_by', 'canclation_reason', 'previous_follow_up_remark', 'follow_up_date_time','follow_up_count', 'last_modified_by')


class agg_hhc_enquiry_Add_follow_up_create_service_serializer(serializers.ModelSerializer):   
    class Meta:
        model=models.agg_hhc_enquiry_follow_up
        fields=('enq_follow_up_id', 'event_id', 'follow_up',  'previous_follow_up_remark', 'follow_up_date_time','follow_up_count')



class enquiries_service_serializer(serializers.ModelSerializer):   
    class Meta:
        model= models.agg_hhc_enquiry_follow_up
        fields=('enq_follow_up_id', 'event_id', 'follow_up')
class services(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_services
        fields = ['service_title']
class ServiceNameSerializer(serializers.ModelSerializer):
    srv_id = services()
    class Meta:
        model = models.agg_hhc_event_plan_of_care
        fields = ['eve_id','srv_id','start_date']

class patient_professional_zone_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_professional_zone
        fields = ['prof_zone_id','city_id', 'Name']

class AggHhcPatientListEnquirySerializer(serializers.ModelSerializer):
    prof_zone_id = patient_professional_zone_serializer()
    class Meta: 
        model = models.agg_hhc_patient_list_enquiry
        fields = [ 'pt_id',  'name', 'phone_no', 'Suffered_from', 'prof_zone_id']    #sandip

class AggHhcPatientListSerializer(serializers.ModelSerializer): #used for get enquiry api
    prof_zone_id = patient_professional_zone_serializer()
    class Meta: 
        model = models.agg_hhc_patients
        fields = [ 'agg_sp_pt_id',  'name', 'phone_no', 'Suffered_from', 'prof_zone_id','address']


from django.db.models import Max, Q
class agg_hhc_service_enquiry_list_serializer(serializers.ModelSerializer):
    srv_id = ServiceNameSerializer(many=True, source = 'event_id')
    agg_sp_pt_id = AggHhcPatientListSerializer()#AggHhcPatientListEnquirySerializer()
    folloup_id = serializers.SerializerMethodField() 
    follow_up = serializers.SerializerMethodField()
    caller_no = serializers.SerializerMethodField()
    sub_service = serializers.SerializerMethodField()

    class Meta:
        model=models.agg_hhc_events
        fields = ('eve_id','event_code', 'patient_service_status', 'agg_sp_pt_id','srv_id','sub_service', 'folloup_id','Suffered_from', 'follow_up','caller_no')     #amit

    def get_folloup_id(self, obj):
        # latest_follow_up_date = models.agg_hhc_enquiry_follow_up.objects.filter(
        #     event_id=obj.eve_id
        # ).aggregate(latest_date=Max('follow_up_date_time'))['latest_date']

        # has_follow_up_1 = models.agg_hhc_enquiry_follow_up.objects.filter(
        #     event_id=obj.eve_id,
        #     follow_up='2'
        # ).exists()
        # if has_follow_up_1:
        #     return []
        # if latest_follow_up_date is None:
        #     return []

        # # Additional filter to get only one record (latest)
        # queryset = models.agg_hhc_enquiry_follow_up.objects.filter(
        #     event_id=obj.eve_id
        # ).exclude(Q(follow_up='2') | Q(follow_up_date_time__lt=latest_follow_up_date))
        # latest_follow_up = queryset.latest('follow_up_date_time')
        # serializer = enquiries_service_serializer(instance=latest_follow_up)
        
        # return serializer.data
        queryset = models.agg_hhc_enquiry_follow_up.objects.filter(event_id=obj.eve_id, follow_up=1).last()
        if queryset:
            return queryset.follow_up_date_time
        else: return None
        
        
    def get_follow_up(self,obj):
        event_id=obj.eve_id
        follow_up= models.agg_hhc_enquiry_follow_up.objects.filter(event_id=event_id ,follow_up_status=1)
        if follow_up.count():    
            # print(follow_up.count())
            if follow_up.count()<=1:
                return '4'
            elif follow_up.count()>1:
                status= follow_up.last().follow_up
                # print(status,';;status;;')
                return status
        else:
            return '4'         
        
    def get_caller_no(self,obj):
        return obj.caller_id.phone if hasattr(obj.caller_id,'phone') else None
    
    def get_sub_service(self, obj):
        dt_eve=models.agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.eve_id, status=1).last()
        if dt_eve is not None:
            service=dt_eve.sub_srv_id.recommomded_service if hasattr(dt_eve.sub_srv_id,'recommomded_service') else None
            return service
        else:
            return None



# --------------------------------------------------- Sandip Shimpi -------------------------------------------------
class agg_hhc_callers_createService_serializer(serializers.ModelSerializer):#20
    class Meta:
        model=models.agg_hhc_callers
        fields=['caller_id','clg_ref_id','phone','otp','otp_expire_time','caller_fullname','purp_call_id','Age','gender','email','alter_contact','Address','city','locality','state','pincode','emp_id','profile_pic','status','service_taken','last_modified_by']
        # fields='__all__'

class agg_hhc_patient_list_serializer(serializers.ModelSerializer):#6
    class Meta:
        model=models.agg_hhc_patient_list_enquiry
        fields=['pt_id','doct_cons_id','caller_id','name','phone_no','call_type','relation','preferred_hosp_id','Age','patient_date_of_birth','gender_id','Suffered_from','hospital_name','patient_add','google_location','patient_Locality','patient_contact','patient_email_id','srv_id','Patient_status_at_present','Start_Date_and_Time','enquiry_status','enquiry_from','address','city_id','state_id','pincode','refer_by','sub_location','prof_zone_id','last_modified_by']
        # fields='__all__'

class DateTimeFieldTZ(serializers.DateTimeField):
    def to_representation(self, value):
        return value.strftime('%Y-%m-%d %H:%M:%S')

class agg_hhc_add_detail_service_serializer(serializers.ModelSerializer):
    # actual_StartDate_Time = DateFieldTZ()
    # actual_EndDate_Time = DateFieldTZ()
    class Meta:
        model = models.agg_hhc_detailed_event_plan_of_care
        fields = ['eve_poc_id','eve_id','index_of_Session','srv_prof_id','Session_status','actual_StartDate_Time','actual_EndDate_Time','start_time','end_time', 'last_modified_by']
        # fields = '__all__'

class agg_hhc_doctors_consultants_serializer(serializers.ModelSerializer):
    class Meta:
        model=models.agg_hhc_doctors_consultants
        fields=['doct_cons_id','cons_fullname','mobile_no']

# -----------------------------------------------------------------------------------------------
class agg_hhc_doctors_consultants_HD_serializer(serializers.ModelSerializer):
    class Meta:
        model=models.agg_hhc_doctors_consultants
        fields=['doct_cons_id','cons_fullname','mobile_no']
# -----------------------------------------------------------------------------------------------

class agg_hhc_doctors_consultants_add_serializer(serializers.ModelSerializer):
    class Meta:
        model=models.agg_hhc_doctors_consultants
        fields=['doct_cons_id','cons_fullname','mobile_no', 'last_modified_by']

    # coupon_code serializer
class agg_hhc_coupon_code_serializers(serializers.ModelSerializer):
    class Meta:
        model=models.agg_hhc_coupon_codes
        fields=['coupon_id','coupon_code','coupon_code_discount_Percentage','coupon_code_status','is_used','last_modified_by']
        # fields="__all__"

class agg_hhc_get_city_serializer(serializers.ModelSerializer):    
    class Meta:
        model = models.agg_hhc_city
        fields = ['city_id','city_name','state_id']
# ---------------- service reschedule --------------

class Detailed_EPOC_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_detailed_event_plan_of_care
        # fields = ['agg_sp_dt_eve_poc_id','eve_id', 'start_date', 'end_date']
        # fields = ['eve_id', 'start_date', 'end_date','remark']
        fields = ['eve_id', 'actual_StartDate_Time', 'actual_EndDate_Time','remark']

class AggservicedetailSerializer(serializers.ModelSerializer):
    dtl_epoc_data = serializers.SerializerMethodField()  # Use SerializerMethodField

    class Meta:
        model = models.agg_hhc_event_plan_of_care
        fields = ['eve_id', 'start_date', 'end_date', 'dtl_epoc_data','remark']

    def get_dtl_epoc_data(self, instance):
        related_dtl_instances = models.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=instance.eve_id,status=1)
        dtl_serializer = Detailed_EPOC_serializer(related_dtl_instances, many=True)
        return dtl_serializer.data
    


# ---------------- Session reschedule --------------

class Detailed_EPOC_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_detailed_event_plan_of_care
        fields = ['eve_id','index_of_Session', 'actual_StartDate_Time', 'actual_EndDate_Time','remark', 'last_modified_by']





# ------------------ Professional Reschedule -------------------

# class Prof_Reschedule_serializer(serializers.ModelSerializer):
#     class Meta:
#         model = models.agg_hhc_detailed_event_plan_of_care
#         fields = ['eve_id','start_date','end_date','srv_prof_id','Session_status']

class Prof_Reschedule_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_detailed_event_plan_of_care
        # fields = ['agg_sp_dt_eve_poc_id','eve_id','index_of_Session','start_date','end_date','srv_prof_id','Session_status']
        # fields = ['agg_sp_dt_eve_poc_id','eve_id','start_date','end_date','srv_prof_id','remark']
        fields = ['agg_sp_dt_eve_poc_id','eve_id','actual_StartDate_Time','actual_EndDate_Time','srv_prof_id','remark', 'last_modified_by']

# ----------------- prof avail ------------

# class prof_name(serializers.ModelSerializer):
#     class Meta:
#         model = models.agg_hhc_service_professionals
#         fields = ['srv_prof_id','professional_code','prof_fullname']
# class avail_prof_serializer(serializers.ModelSerializer):
#     srv_prof_id = prof_name()
#     class Meta:
#         model=models.agg_hhc_professional_sub_services
#         fields = ('srv_id','srv_prof_id')


# ----------- cancellation service ----------
from .models import status_enum
from django.utils import timezone
from datetime import timedelta

class get_dtl_epoc_data_for_canc_session(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_detailed_event_plan_of_care
        fields = ['eve_id', 'srv_prof_id','actual_StartDate_Time','start_time','service_cost']

class post_in_cancellation_history(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_cancellation_history
        fields = ['event_id','agg_sp_dt_eve_poc_id','cancellation_by','can_amt', 'convineance_chrg', 'remark', 'reason', 'last_modified_by']


class get_event_data_for_canc_session(serializers.ModelSerializer):
    per_session_amt = serializers.SerializerMethodField()
    class Meta:
        model = models.agg_hhc_events
        fields = ['eve_id', 'final_amount','per_session_amt']
    
    def get_per_session_amt(self,obj):
        dtl_sesn = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id, status=1).count()
        return obj.final_amount/dtl_sesn

class Detail_Event_Plan_of_Care_Staus(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_detailed_event_plan_of_care
        fields = ['status']
    
class Event_Plan_of_Care_Staus(serializers.ModelSerializer):

    class Meta:
        model = models.agg_hhc_event_plan_of_care
        fields = ['start_date','status']
    

class Event_Staus(serializers.ModelSerializer):
    Total_session = serializers.SerializerMethodField()
    per_session_cost = serializers.SerializerMethodField()
    completed_session_amt = serializers.SerializerMethodField()
    refund_amt = serializers.SerializerMethodField()
    

    class Meta:
        model = models.agg_hhc_events
        fields = ['eve_id','Total_cost','status','Total_session','per_session_cost','completed_session_amt','refund_amt']
       

    def get_Total_session(self, obj):
        # queryset = models.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id, Session_status=1)
        queryset = models.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id,status=1)
        return queryset.count()

    def get_per_session_cost(self, obj):
        Total_cost = obj.Total_cost  # Access Total_cost field of the obj
        Total_session = self.get_Total_session(obj)  # Call the previously defined method
        return int(Total_cost / Total_session) if Total_session > 0 else 0
    
    def get_completed_session_amt(self, obj):
        queryset = models.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id, Session_status=2,status=1)
        # return queryset.count()
        completed_session = queryset.count()
        per_session = self.get_per_session_cost(obj)
        return int(per_session * completed_session)
    
    def get_refund_amt(self,obj):
        # total_cost = obj.Total_cost
        # com_ses_amt = self.get_completed_session_amt(obj)
        # ref_amt = total_cost - com_ses_amt
        current_date = timezone.now().date() 
        previous_24_hours = timezone.now() - timedelta(hours=24)
        previous_48_hours = timezone.now() - timedelta(hours=48)
        previous_24_hours_date = previous_24_hours.date()
        previous_48_hours_date = previous_48_hours.date()

        refaund_amt = 0
        cancelation_charge = models.cancelation_charges.objects.filter(status=1).latest('added_date')
        srv_start_date = models.agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.eve_id,status=1)
        for srv_start_dates in srv_start_date:
            # if srv_start_dates.start_date.date() <= current_date:
            #     refaund_amt = 200
            # elif srv_start_dates.start_date.date() >= previous_24_hours_date:
            #     refaund_amt = 200
            # elif srv_start_dates.start_date.date() >= previous_48_hours_date:
            #     refaund_amt = 0

            if srv_start_dates.start_date <= current_date:
                refaund_amt = cancelation_charge
            elif srv_start_dates.start_date >= previous_24_hours_date:
                refaund_amt = cancelation_charge
            elif srv_start_dates.start_date >= previous_48_hours_date:
                refaund_amt = 0
        
        # return int(ref_amt - refaund_amt)
        return int(refaund_amt)
            


# class ServiceCancellationSerializer(serializers.ModelSerializer):
#     DetaileventStaus = Detail_Event_Plan_of_Care_Staus(source='event_id',read_only=True)
#     eventPlanStaus = Event_Plan_of_Care_Staus(source='event_id',read_only=True)
#     eventStaus = Event_Staus(source='event_id',read_only=True)
 

#     class Meta:
#         model = models.agg_hhc_cancellation_history
#         # fields = ['canc_his_id','event_id','cancellation_by','reason','cancelled_date','DetaileventStaus','eventPlanStaus','eventStaus','cost_per_session']
#         fields = ['canc_his_id','event_id','cancellation_by','reason','remark','DetaileventStaus','eventPlanStaus','eventStaus', 'last_modified_by']

    
#     def finds(self, pros, eve_id):
#             tokn=[j.token for j in models.DeviceToken.objects.filter(clg_id__in=agg_com_colleague.objects.filter(clg_ref_id__in=[pro.clg_ref_id for pro in pros]), is_login=True)]
#             eve_poc_id=models.agg_hhc_event_plan_of_care.objects.filter(eve_id=eve_id, status=1).last() 
#             body=f'Patient: {eve_id.agg_sp_pt_id.name}\nService: {eve_poc_id.sub_srv_id.recommomded_service}\nStart DateTime:\n {eve_poc_id.start_date} {eve_poc_id.start_time}\nEnd DateTime:\n {eve_poc_id.end_date} {eve_poc_id.end_time}'
#             notification={ 'title': 'Approved request for service cancellation.', 'body': body }
#             for tk in tokn:    
#                 response = (requests.post('https://fcm.googleapis.com/fcm/send', json={'to': tk,'notification': notification}, headers={'Authorization': f'key={SERVER_KEY}', 'Content-Type': 'application/json'})).json()
        

#     def create(self, validated_data):
#         event = validated_data.get('event_id')
#         if event:
           
#             try:
               

#                 detail_event_poc=models.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=event,status=1)
#                 event_poc=models.agg_hhc_event_plan_of_care.objects.filter(eve_id=event,status=1)
#                 event_model=models.agg_hhc_events.objects.filter(eve_id=event.eve_id,status=1)
#                 pro=set([i.srv_prof_id for i in detail_event_poc])
#                 for detail_event_poc_queryset in detail_event_poc:
#                     detail_event_poc_queryset.status= status_enum.Inactive.value
#                     detail_event_poc_queryset.is_cancelled = 1
#                     detail_event_poc_queryset.save()
                
#                 for event_poc_queryset in event_poc:
#                     event_poc_queryset.status= status_enum.Inactive.value
#                     event_poc_queryset.save()
                
#                 for event_queryset in event_model:
#                     event_queryset.status= status_enum.Inactive.value
#                     event_queryset.srv_cancelled= 1
#                     event_queryset.save()
#                 self.finds(pro,event)
#             except models.agg_hhc_detailed_event_plan_of_care.DoesNotExist:
#                 print("this is not available")
#                 pass  
#         cancellation_history = models.agg_hhc_cancellation_history.objects.create(**validated_data)
#         return cancellation_history
    
# ==============================================================================================================
           
class post_in_session_cancellation_history(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_cancellation_history
        fields = ['event_id','agg_sp_dt_eve_poc_id','cancellation_by','can_amt', 'convineance_chrg', 'remark', 'reason', 'last_modified_by']


class ServiceCancellationSerializer(serializers.ModelSerializer):
    DetaileventStaus = Detail_Event_Plan_of_Care_Staus(source='event_id',read_only=True)
    eventPlanStaus = Event_Plan_of_Care_Staus(source='event_id',read_only=True)
    eventStaus = Event_Staus(source='event_id',read_only=True)
 

    class Meta:
        model = models.agg_hhc_cancellation_history
        # fields = ['canc_his_id','event_id','cancellation_by','reason','cancelled_date','DetaileventStaus','eventPlanStaus','eventStaus','cost_per_session']
        fields = ['canc_his_id','event_id','cancellation_by','reason','remark','DetaileventStaus','eventPlanStaus','eventStaus', 'last_modified_by']

    
    def finds(self, pros, eve_id,event_poc_queryset):
            tokn=[j.token for j in models.DeviceToken.objects.filter(clg_id__in=agg_com_colleague.objects.filter(clg_ref_id__in=[pro.clg_ref_id for pro in pros]), is_login=True)]
            # eve_poc_id=models.agg_hhc_event_plan_of_care.objects.filter(eve_id=eve_id.eve_id, status=1).last() 
            # print(eve_id.eve_id, ';;...................')
            # print(eve_poc_id, ';;...................')
            body=f'Patient: {eve_id.agg_sp_pt_id.name}\nService: {event_poc_queryset.sub_srv_id.recommomded_service}\nStart DateTime:\n {event_poc_queryset.start_date} {event_poc_queryset.start_time}\nEnd DateTime:\n {event_poc_queryset.end_date} {event_poc_queryset.end_time}'
            notification={ 'title': 'Approved request for service cancellation.', 'body': body }
            for tk in tokn:    
                response = (requests.post('https://fcm.googleapis.com/fcm/send', json={'to': tk,'notification': notification}, headers={'Authorization': f'key={SERVER_KEY}', 'Content-Type': 'application/json'})).json()
                     
    # def create(self, validated_data):
    #     event = validated_data.get('event_id')
    #     if event:
    #         try:

    #             detail_event_poc=models.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=event,status=1)
    #             event_poc=models.agg_hhc_event_plan_of_care.objects.filter(eve_id=event,status=1)
    #             event_model=models.agg_hhc_events.objects.filter(eve_id=event.eve_id,status=1)
    #             pro=set([i.srv_prof_id for i in detail_event_poc])
    #             for detail_event_poc_queryset in detail_event_poc:
    #                 detail_event_poc_queryset.status= status_enum.Inactive.value
    #                 detail_event_poc_queryset.is_cancelled = 1
    #                 detail_event_poc_queryset.save()
                
    #             for event_poc_queryset in event_poc:
    #                 event_poc_queryset.status= status_enum.Inactive.value
    #                 event_poc_queryset.save()
                
    #             for event_queryset in event_model:
    #                 event_queryset.status= status_enum.Inactive.value
    #                 event_queryset.srv_cancelled= 1
    #                 event_queryset.save()
    #             self.finds(pro,event)
    #             print('5')
    #         except models.agg_hhc_detailed_event_plan_of_care.DoesNotExist:
    #             print("this is not available")
    #             pass  
    #     cancellation_history = models.agg_hhc_cancellation_history.objects.create(**validated_data)
    #     return cancellation_history

    def create(self, validated_data):
        event = validated_data.get('event_id')
        prof = validated_data.get('srv_prof_id')
        patient = validated_data.get('agg_sp_pt_id')
        if prof:
            if event:
                try:

                    detail_event_poc=models.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=event,status=1)
                    prof_eve=detail_event_poc.filter(srv_prof_id=prof)
                    if detail_event_poc.count()==prof_eve.count():
                        event_poc=models.agg_hhc_event_plan_of_care.objects.filter(eve_id=event,status=1)
                        event_model=models.agg_hhc_events.objects.filter(eve_id=event.eve_id,status=1)
                        # pro=set([i.srv_prof_id for i in detail_event_poc])
                        pro=prof
                        for detail_event_poc_queryset in detail_event_poc:
                            detail_event_poc_queryset.status= status_enum.Inactive.value
                            detail_event_poc_queryset.is_cancelled = 1
                            detail_event_poc_queryset.save()
                        
                        for event_poc_queryset in event_poc:
                            event_poc_queryset.status= status_enum.Inactive.value
                            event_poc_queryset.save()
                        
                        for event_queryset in event_model:
                            event_queryset.status= status_enum.Inactive.value
                            event_queryset.srv_cancelled= 1
                            event_queryset.save()
                        self.finds(pro,event,event_poc_queryset)

                    else:
                        event_poc=models.agg_hhc_event_plan_of_care.objects.filter(eve_id=event,status=1)
                        event_model=models.agg_hhc_events.objects.filter(eve_id=event.eve_id,status=1)
                        # pro=set([i.srv_prof_id for i in detail_event_poc])
                        pro=prof
                        for detail_event_poc_queryset in prof_eve:
                            detail_event_poc_queryset.status= status_enum.Inactive.value
                            detail_event_poc_queryset.is_cancelled = 1
                            detail_event_poc_queryset.save()
                            cancel_history = {
                            'event_id': event,
                            'cancellation_by': validated_data.data.get("cancellation_by"),
                            'can_amt': event_poc.sub_srv_id.cost,
                            'convineance_chrg':detail_event_poc_queryset.convinance_charges,
                            'remark': validated_data.data.get('reason'),
                            'agg_sp_dt_eve_poc_id':detail_event_poc_queryset.agg_sp_dt_eve_poc_id,
                            'reason': validated_data.data.get('reason'),
                            'last_modified_by': validated_data.data.get('last_modified_by')
                        }
                        serialized2_data = post_in_session_cancellation_history(data=cancel_history)  

                        if serialized2_data.is_valid():
                            serialized2_data.save()
                        
                        
                        for event_poc_queryset in event_poc:
                            # event_poc_queryset.status= status_enum.Inactive.value
                            f_eve=sorted(detail_event_poc.exclude(prof_eve), key='actual_StartDate_Time')
                            if f_eve:
                                event_poc_queryset.start_date=f_eve[0].actual_StartDate_Time
                                event_poc_queryset.end_date=f_eve[-1].actual_StartDate_Time
                                event_poc_queryset.save()

                            
                        for i in detail_event_poc:
                            if i.convinance_charges:
                                conv=i.convinance_charges
                            else:
                                conv=0 
                            tot_conv=int(tot_conv)+conv
                        single_session_charge=(event_queryset.final_amount-tot_conv)/detail_event_poc.count()
                        f_eve=sorted(detail_event_poc.exclude(prof_eve), key='actual_StartDate_Time')
                        result = [0 if i.convinance_charges is None else i.convinance_charges for i in f_eve]
                        final=(f_eve*single_session_charge)+result

                        for event_queryset in event_model:
                            # event_queryset.status= status_enum.Inactive.value
                            # event_queryset.srv_cancelled= 1
                            event_queryset.final_amount=round(final)
                            event_queryset.save()
                        self.finds(pro,event,event_poc_queryset)
                    # print('5')
                except models.agg_hhc_detailed_event_plan_of_care.DoesNotExist:
                    # print("this is not available")
                    pass  
            cancellation_history = models.agg_hhc_cancellation_history.objects.create(**validated_data)
            return cancellation_history
        else:
            if event:
                try:

                    detail_event_poc=models.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=event,status=1)
                    event_poc=models.agg_hhc_event_plan_of_care.objects.filter(eve_id=event,status=1)
                    event_model=models.agg_hhc_events.objects.filter(eve_id=event.eve_id,status=1)
                    pro=set([i.srv_prof_id for i in detail_event_poc])
                    for detail_event_poc_queryset in detail_event_poc:
                        detail_event_poc_queryset.status= status_enum.Inactive.value
                        detail_event_poc_queryset.is_cancelled = 1
                        detail_event_poc_queryset.save()
                    
                    for event_poc_queryset in event_poc:
                        event_poc_queryset.status= status_enum.Inactive.value
                        event_poc_queryset.save()
                    
                    for event_queryset in event_model:
                        event_queryset.status= status_enum.Inactive.value
                        event_queryset.srv_cancelled= 1
                        event_queryset.save()
                    self.finds(pro,event,event_poc_queryset)
                    # print('5')
                except models.agg_hhc_detailed_event_plan_of_care.DoesNotExist:
                    # print("this is not available")
                    pass  
            cancellation_history = models.agg_hhc_cancellation_history.objects.create(**validated_data)
            return cancellation_history
# ==============================================================================================================

class Cancelllation_session(serializers.ModelSerializer):
    
    class Meta:
        model = models.agg_hhc_sub_services
        fields = ['sub_srv_id','recommomded_service','srv_id','cost']
    


#-------------------------------------- professional availibility for cancellation---------------------------------------------------------------------------

# class prof_name(serializers.ModelSerializer):
#     class Meta:
#         model = models.agg_hhc_service_professionals
#         fields = ['srv_prof_id','prof_fullname']
# class avail_prof_serializer(serializers.ModelSerializer):
#     srv_prof_id = prof_name()
#     class Meta:
#         model=models.agg_hhc_professional_sub_services
#         fields=('srv_prof_id','srv_id')         

class prof_name(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_service_professionals
        fields = ['srv_prof_id','prof_fullname']

class avail_prof_serializer(serializers.ModelSerializer):
    srv_prof_id = prof_name()
    class Meta:
        model=models.agg_hhc_professional_sub_services
        fields=('srv_prof_id','sub_srv_id','sub_srv_id')         
   


#-----------------------------------------------------------------------------------------------------------------
class get_gender(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_gender
        fields = ['gender_id','name']

class get_doctor_consultant(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_doctors_consultants
        fields = ['doct_cons_id','cons_fullname','mobile_no']

class add_enquiry_patient_by_form_serializer(serializers.ModelSerializer):
    # gender_id = get_gender()
    # doct_cons_id = get_doctor_consultant()
    class Meta:
        model = models.agg_hhc_patients
        fields = ['agg_sp_pt_id','name','caller_id','phone_no','Age','gender_id','doct_cons_id','address','Suffered_from','preferred_hosp_id']

class add_caller_by_form_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_callers
        fields = ['caller_id','caller_fullname','phone','purp_call_id']


class create_plane_of_care_serializer(serializers.ModelSerializer):
    # srv_id = get_service
    class Meta:
        model = models.agg_hhc_event_plan_of_care
      
        fields = ['eve_poc_id','eve_id','srv_id','start_date','start_time','serivce_dates','hosp_id', 'doct_cons_id', 'last_modified_by']
class add_service_get_event_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_events
        fields=['eve_id','event_code','caller_id','added_from_hosp','agg_sp_pt_id','purp_call_id','bill_no_ref_no','event_date','note','enquiry_added_date','enquiry_status','enquiry_cancellation_reason','enquiry_cancel_date','Total_cost','discount_type','discount_value','final_amount','status','day_convinance','total_convinance','isArchive','isConvertedService','Invoice_narration','invoice_narration_desc','branch_code','Suffered_from','OTP','OTP_count','otp_expire_time','address_id','enq_spero_srv_status','event_status','refer_by','Patient_status_at_present','patient_service_status','last_modified_by']
        # fields = '__all__'

class SubService_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_sub_services
        fields = ['sub_srv_id','recommomded_service', 'cost', 'Service_Time']
class add_service_get_POC_serializer(serializers.ModelSerializer):
    sub_srv_id = SubService_serializer()
    class Meta:
        model = models.agg_hhc_event_plan_of_care
        # fields = ['eve_poc_id','srv_id']#,'sub_srv_id','actual_StartDate_Time','actual_EndDate_Time','prof_prefered','remark']
        fields = ['eve_poc_id','srv_id','sub_srv_id','start_date','end_date','prof_prefered','remark','start_time', 'end_time','serivce_dates','No_session_dates' ] 

class Purpose_of_call(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_purpose_call
        fields = ['purp_call_id','name']

class add_service_get_caller_serializer(serializers.ModelSerializer):
    purp_call_id = Purpose_of_call()
    class Meta:
        model = models.agg_hhc_callers
        fields = ['caller_id','caller_fullname','purp_call_id','phone']

class agg_hhc_get_state_serializers(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_state
        fields = ['state_id','state_name']

class agg_hhc_get_city(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_city
        fields = ['city_id','city_name']

class add_service_get_patient_serializer(serializers.ModelSerializer):
    gender_id = get_gender()
    preferred_hosp_id=hospital_serializer()
    doct_cons_id = agg_hhc_doctors_consultants_serializer()
    state_id = agg_hhc_get_state_serializers()
    city_id = agg_hhc_get_city()
    prof_zone_id = patient_professional_zone_serializer()
    class Meta:
        model = models.agg_hhc_patients
        fields = ['agg_sp_pt_id','name','gender_id','Age','preferred_hosp_id','Suffered_from','phone_no','patient_email_id','doct_cons_id','state_id','city_id','prof_zone_id','google_address','address','lattitude','langitude']
        # fields = ['pt_id','name','gender_id','Age','preferred_hosp_id']#,'Suffered_from','phone_no','patient_email','doct_cons_id','state_id','city_id','prof_zone_id','address']
# -------------------------------------------get add service details------------------------------------------------
# ==========================================
        

class add_service_get_patient_form_serializer(serializers.ModelSerializer):
    gender_id = get_gender()
    doct_cons_id = agg_hhc_doctors_consultants_serializer()
    class Meta:
        model = models.agg_hhc_patients
        # fields = ['agg_sp_pt_id','name','gender_id','Age','preferred_hosp_id','Suffered_from','phone_no','patient_email_id','doct_cons_id','state_id','city_id','prof_zone_id','google_address','address','lattitude','langitude']
        fields = ['agg_sp_pt_id','name','gender_id','Age','Suffered_from','phone_no','doct_cons_id','google_address','address','lattitude','langitude']
        # fields = ['pt_id','name','gender_id','Age','preferred_hosp_id']#,'Suffered_from','phone_no','patient_email','doct_cons_id','state_id','city_id','prof_zone_id','address']

class add_service_get_caller_form_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_callers
        fields = ['caller_id','caller_fullname','phone']

class add_service_get_POC_form_serializer(serializers.ModelSerializer):
    # sub_srv_id = SubService_serializer()
    class Meta:
        model = models.agg_hhc_event_plan_of_care
        # fields = ['eve_poc_id','srv_id']#,'sub_srv_id','actual_StartDate_Time','actual_EndDate_Time','prof_prefered','remark']
        fields = ['eve_poc_id','srv_id','start_date','start_time',] 

class agg_get_event_detail_form_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_events
        fields = ['eve_id', 'refer_by', 'Patient_status_at_present','Suffered_from']



# ==========================================
    
class prof_allocate_get_callerID_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_callers
        fields = ['caller_id']     

class prof_allocate_get_patientID_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_patients
        fields = ['agg_sp_pt_id','city_id']

class prof_allocate_get_POCID_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_event_plan_of_care
        fields = ['eve_poc_id']

class find_payments_by_event(serializers.ModelSerializer):
    Total_cost = serializers.SerializerMethodField()
    class Meta:
        model = models.agg_hhc_events
        fields = ['eve_id', 'Total_cost', 'discount_type', 'discount_value', 'final_amount', 'day_convinance', 'total_convinance','Suffered_from']

    def get_Total_cost(self, obj):
        data=obj.Total_cost
        if data:
            data1=int(data)
        else:
            data1=0
        return data1
class patient_data_serializer(serializers.ModelSerializer):
    caller_id = serializers.SerializerMethodField()
    agg_sp_pt_id = serializers.SerializerMethodField()
    POC = serializers.SerializerMethodField()
    eve_id = serializers.SerializerMethodField()

    class Meta:
        model = models.agg_hhc_events
        fields = ['eve_id','caller_id','agg_sp_pt_id','POC']

    def get_caller_id(self,obj): 
        ids = obj.caller_id
        print(ids)
        # caller_data=models.agg_hhc_events.objects.get(eve_id=ids)
        if ids:
            data1 = add_service_get_caller_serializer(ids)
            # data1.data['purp_call_id']['purp_call_id']=1
            return data1.data
        return None
    
    def get_agg_sp_pt_id(self,obj):
        ids = obj.agg_sp_pt_id
        # patient_data=models.agg_hhc_events.objects.get(eve_id=ids)
        if ids:
            patient_data1 = add_service_get_patient_serializer(ids)
            return patient_data1.data
        return None
    
    def get_POC(self,obj):
        ids = obj.eve_id
        if ids:
            poc = models.agg_hhc_event_plan_of_care.objects.filter(eve_id=ids,status=1).last()
            poc1 = add_service_get_POC_serializer(poc)
            poc1.data
            return poc1.data
        return None
    
    def get_eve_id(self,obj):
        ids = obj.eve_id
        if ids:
            events = models.agg_hhc_events.objects.get(eve_id=ids,status=1)       
            event_data = find_payments_by_event(events)
            return event_data.data
        return None

class patient_data_serializer_form(serializers.ModelSerializer):
    caller_id = serializers.SerializerMethodField()
    agg_sp_pt_id = serializers.SerializerMethodField()
    POC = serializers.SerializerMethodField()
    eve_id = serializers.SerializerMethodField()

    class Meta:
        model = models.agg_hhc_events
        fields = ['eve_id','caller_id','agg_sp_pt_id','POC']

    def get_caller_id(self,obj): 
        ids = obj.caller_id
        print(ids)
        # caller_data=models.agg_hhc_events.objects.get(eve_id=ids)
        data1 = add_service_get_caller_form_serializer(ids)
        return data1.data
    
    def get_agg_sp_pt_id(self,obj):
        ids = obj.agg_sp_pt_id
        # patient_data=models.agg_hhc_events.objects.get(eve_id=ids)
        patient_data1 = add_service_get_patient_form_serializer(ids)
        return patient_data1.data
    
    def get_POC(self,obj):
        ids = obj.eve_id
        poc = models.agg_hhc_event_plan_of_care.objects.filter(eve_id=ids,status=1).last()
        poc1 = add_service_get_POC_form_serializer(poc)
        poc1.data
        return poc1.data
    
    def get_eve_id(self,obj):
        ids = obj.eve_id
        events = models.agg_hhc_events.objects.get(eve_id=ids,status=1)       
        event_data = agg_get_event_detail_form_serializer(events)
        return event_data.data
# ----------------------------------------------------------------------------------------------------------------
                                            # add service
# ----------------------------------------------------------------------------------------------------------------

# class agg_hhc_callers_serializer1(serializers.ModelSerializer):#20
#     # fullname=serializers.SerializerMethodField()
#     class Meta:
#         model=models.agg_hhc_callers
#         # fields=('caller_fullname','caller_id','phone','caller_rel_id','gender','email','Address','profile_pic','purp_call_id')
#         fields=('caller_fullname','caller_id','phone','caller_rel_id','purp_call_id')
    
# class create_service_serializer(serializers.ModelSerializer):
#     caller_id = serializers.SerializerMethodField()
#     agg_sp_pt_id = serializers.SerializerMethodField()
#     # event_status = serializers.SerializerMethodField()
#     # patient_service_status = serializers.SerializerMethodField()
#     class Meta:
#         model = models.agg_hhc_events
#         fields = ['eve_id', 'caller_id','agg_sp_pt_id']#,'event_status','patient_service_status']
#     def get_caller_id(self,obj):
#         print(obj,';;;;')
#         for field in obj._meta.fields:
#             field_name = field.name
#             field_value = getattr(obj, field_name)
#             print(f"{field_name}: {field_value}")
#         phoneno=obj['phone']
#         try:
#             caller = models.agg_hhc_callers.objects.get(phone=phoneno)
#             callerSerializer= agg_hhc_callers_serializer1(caller,data=obj)
#         except:
#             callerSerializer = agg_hhc_callers_serializer1(data=obj.data)
#         if callerSerializer.is_valid():
#             callerID=callerSerializer.save().caller_id
#             return callerID
#         else:
#             return callerSerializer.errors
    
#     def get_agg_sp_pt_id(self, obj):
#         patient_phone = obj.data['phone_no']
#         callerID=self.get_caller_id(obj)
#         obj.data['caller_id']=callerID
#         try:
#             patient_no = models.agg_hhc_patients.objects.get(phone_no=patient_phone)
#             patientserializer =agg_hhc_patients_serializer(patient_no, data=obj.data)
#         except:
#             patientserializer = agg_hhc_patients_serializer(data=obj.data)
#         if patientserializer.is_valid():
#             patientID=patientserializer.save().agg_sp_pt_id
#             # print(patientserializer.data)

#             return patientID
#         else:
#             return PatientSerializer.errors
        
#     # def get_event_status(self, obj):
#     #     if obj.data['purp_call_id']==1:
#     #         return 1
    
#     # def get_patient_service_status(self, obj):
#     #     if obj.data:
#     #         return 3

class get_professional_by_sub_service_serializer(serializers.ModelSerializer):
    class Meta:
        model=models.agg_hhc_professional_sub_services
        fields = ['prof_sub_srv_id','srv_prof_id','sub_srv_id']

class agg_hhc_professional_availability_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_professional_availability
        fields = ['professional_avaibility_id','srv_prof_id','date']

class agg_hhc_professional_detail_availability_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_professional_availability_detail
        fields = ['prof_avaib_dt_id','prof_avaib_id','start_time','end_time','prof_loc_id']

# from fcm_django.models import FCMDevice
# from .models import DeviceToken

# class FCMDeviceSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = FCMDevice
#         fields = ('registration_id',)

# class DeviceTokenSerializer(serializers.ModelSerializer):
#     fcm_device = FCMDeviceSerializer()

#     class Meta:
#         model = DeviceToken
#         fields = ('user', 'fcm_device')

class NotificationList_serializer(serializers.ModelSerializer):
    class Meta: 
        model = models.NotificationList
        fields = ['noti_id', 'noti_title', 'noti_body', 'eve_id']

class Professional_notification_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.Professional_notification
        fields = ['prof_noti','noti_id','srv_prof_id']



class DischargeFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.DischargeFile
        fields = ('id', 'file')

class agg_hhc_concent_form_detailsSerializer(serializers.ModelSerializer):
    Discharge_summ_docs = DischargeFileSerializer(many=True)

    class Meta:
        model = models.agg_hhc_concent_form_details
        fields = ('con_id', 'eve_id', 'is_aggree', 'Discharge_summ_docs','sign') 
                #   'last_modified_by')
    
    def create(self, validated_data):
        # validated_data['added_date'] = timezone.now()
        return super().create(validated_data)


class get_doctor_consultant_for_concent(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_doctors_consultants
        fields = ['doct_cons_id','cons_fullname','email_id','mobile_no']

class get_caller_data(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_callers
        fields=['caller_id','clg_ref_id','phone','otp','otp_expire_time','caller_fullname','purp_call_id','Age','gender','email','alter_contact','Address','city','locality','state','pincode','emp_id','profile_pic','status','service_taken','last_modified_by']
        # fields = '__all__'

class get_patient_data(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_patients
        fields=['agg_sp_pt_id','doct_cons_id','caller_id','caller_rel_id','hhc_code','name','Age','gender_id','patient_email_id','state_id','city_id','address','google_address','prof_zone_id','pincode','otp','otp_expire_time','Suffered_from','hospital_name','preferred_hosp_id','phone_no','dob','status','isVIP','lattitude','langitude','Profile_pic','last_modified_by']
        # fields = '__all__'


class get_event_data_for_concent(serializers.ModelSerializer):
    caller_id = get_caller_data()
    agg_sp_pt_id = get_patient_data()

    class Meta:
        model = models.agg_hhc_events
        fields = ['eve_id','event_code','caller_id','agg_sp_pt_id']

class get_ptn_data_for_concent(serializers.ModelSerializer):
    eve_id = get_event_data_for_concent()
    doct_cons_id = get_doctor_consultant_for_concent()
    class Meta:
        model = models.agg_hhc_event_plan_of_care
        fields = ['eve_id','doct_cons_id']

class inactive_session(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_detailed_event_plan_of_care
        fields = ['eve_poc_id','status']


class professional_call_back_serializer(serializers.ModelSerializer):
    class Meta:
        model=models.professional_call_back
        fields=['cb_id','clg_id','remark','status','call_back_done_by','last_modified_by']
        # fields="__all__"

class demoserializer(serializers.ModelSerializer):
    class Meta:
        model=models.demo1
        fields = ['demo_id', 'data', 'added_by', 'last_modified_by']

# ------------------------------------------- singel record ---------------------------------------------
class single_session_caller_serializer(serializers.ModelSerializer):
    class Meta:
        model=models.agg_hhc_callers
        fields=['caller_id','caller_fullname','phone']

class single_session_hospital_serializer(serializers.ModelSerializer):
    class Meta:
        model=models.agg_hhc_hospitals
        fields=['hosp_id','hospital_name']

class single_record_get_gender(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_gender
        fields = ['gender_id','name']

class single_session_patients_serializer(serializers.ModelSerializer):
    gender_id = single_record_get_gender()
    class Meta:
        model=models.agg_hhc_patients
        fields=['agg_sp_pt_id','name','Age','gender_id','phone_no','patient_email_id', 'address', 'google_address']

class agg_hhc_single_state(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_state
        fields = ['state_id','state_name']

class agg_hhc_single_city(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_city
        fields = ['city_id','city_name']

class patient_get_single_zone_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_professional_zone
        fields = ['prof_zone_id', 'Name']
class single_session_address_serializer(serializers.ModelSerializer):
    city_id=agg_hhc_single_city()
    state_id=agg_hhc_single_state()
    prof_zone_id=patient_get_single_zone_serializer()
    class Meta:
        model=models.agg_hhc_app_add_address
        fields=['address_id','address','google_address','city_id','locality','state_id','prof_zone_id','pincode']

class agg_hhc_single_sub_services_serializer(serializers.ModelSerializer): 
    class Meta:
        model = models.agg_hhc_sub_services
        fields = ['sub_srv_id','recommomded_service']

class agg_hhc_single_services_serializer(serializers.ModelSerializer): 
    class Meta:
        model = models.agg_hhc_services
        fields = ['srv_id','service_title']

class Single_preffered_proffesional(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_doctors_consultants
        fields = ['doct_cons_id','cons_fullname','mobile_no']

class single_hospital_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_hospitals
        fields = ['hosp_id', 'hospital_name']
        
class singel_session_plan_of_care_serializer(serializers.ModelSerializer):
    # hosp_id=single_hospital_serializer()
    # doct_cons_id=Single_preffered_proffesional()
    srv_id=serializers.SerializerMethodField()
    sub_srv_id=serializers.SerializerMethodField()
    class Meta:
        model=models.agg_hhc_event_plan_of_care
        fields=['eve_poc_id','srv_id','sub_srv_id']
        # fields=['eve_poc_id','srv_id','sub_srv_id','hosp_id','doct_cons_id','start_date','end_date','start_time','end_time']
    def get_srv_id(self, obj):
        return agg_hhc_single_services_serializer(obj.srv_id).data  
    def get_sub_srv_id(self, obj):
        return agg_hhc_single_sub_services_serializer(obj.sub_srv_id).data  

class singel_session_detail_plan_of_care_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_detailed_event_plan_of_care
        fields = ['eve_poc_id','srv_prof_id','actual_StartDate_Time','actual_EndDate_Time','start_time','end_time']


class single_recod_serializer(serializers.ModelSerializer):
    caller_id = serializers.SerializerMethodField()
    added_from_hosp = serializers.SerializerMethodField()
    agg_sp_pt_id = serializers.SerializerMethodField()
    prof = serializers.SerializerMethodField()
    price_record = serializers.SerializerMethodField()
    # address_id = serializers.SerializerMethodField()
    event_poc= serializers.SerializerMethodField()
    # event_detail_poc= serializers.SerializerMethodField()
    
    class Meta:
        model=models.agg_hhc_events
        fields =['eve_id','agg_sp_pt_id','caller_id','added_from_hosp','event_poc','prof','price_record']#,'event_code','caller_id','added_from_hosp','agg_sp_pt_id','Total_cost','discount_type','discount_value','final_amount','Suffered_from','address_id','event_poc','event_detail_poc']

    def sort_prof(self,events):
        eventss=events
        profs=[prof.srv_prof_id.srv_prof_id for prof in eventss]
        singel_prof=set(profs)
        print(singel_prof,';;dd;;')
        return singel_prof
    def get_caller_id(self, obj):
        return single_session_caller_serializer(obj.caller_id).data  
    def get_added_from_hosp(self, obj):
        return single_session_hospital_serializer(obj.added_from_hosp).data
    def get_agg_sp_pt_id(self, obj):
        return single_session_patients_serializer(obj.agg_sp_pt_id).data
    def get_prof(self, obj):
        detail_events=models.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id, status=1)
        if detail_events.count():
            event=models.agg_hhc_events.objects.get(eve_id=obj.eve_id)
            print(event,';;;;')
            if event.Total_cost:
                total_cost=event.Total_cost
            else:
                total_cost=0
            singlecharge=total_cost/detail_events.count()
            # print(detail_events.count(), ';;sdsd;;;;')
            single_Prof=self.sort_prof(detail_events)
            cost=[]
            for i in single_Prof:   
                record=detail_events.filter(srv_prof_id=i)
                data={
                    "prof_name":record[0].srv_prof_id.prof_fullname,
                    "session_count":len(record),
                    "dates":[j.actual_StartDate_Time  for j in record],
                    "price":singlecharge*len(record),
                    "convinance":event.day_convinance*len(record),
                    "total cost":(singlecharge+event.day_convinance)*len(record)
                }
                cost.append(data)
        else:
            cost={'error':'no active sessions'}
        return cost
    def get_price_record(self, obj):
        obj.eve_id
        event=models.agg_hhc_events.objects.get(eve_id=obj.eve_id, status=1)
        sessions=models.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id, status=1)
        payment = models.agg_hhc_payment_details.objects.filter(eve_id=obj.eve_id,overall_status="SUCCESS")
        if event.Total_cost:
            eve_cost=event.Total_cost
        else:
            eve_cost=0
        if payment.count():
            pay_mode=payment[0].mode
            pay_date=payment[0].added_date
        else:
            pay_mode=None
            pay_date=None
        data={
            "singel session cost": eve_cost/sessions.count(),
            "discount type": event.discount_type,
            "discount amount": event.discount_value,
            "total cost": eve_cost,
            "day convinance": event.day_convinance,
            "final amount":event.final_amount,
            "Payment Type":pay_mode,
            "Payment Date":pay_date
        }
            
        return data
    # def get_address_id(self, obj):
    #     return single_session_address_serializer(obj.address_id).data
    def get_event_poc(self, obj):
        return singel_session_plan_of_care_serializer(models.agg_hhc_event_plan_of_care.objects.get(eve_id=obj.eve_id, status=1)).data
    # def get_event_detail_poc(self, obj):
    #     return singel_session_detail_plan_of_care_serializer(models.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id, status=1), many=True).data
# ---------------------------------------------------------------------------------------------------------
    

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
    actual_StartDate_Time=serializers.SerializerMethodField()
    srv_prof_id = prof_data_to_recan()
    class Meta:
        model = models.agg_hhc_detailed_event_plan_of_care
        fields = ['agg_sp_dt_eve_poc_id','index_of_Session','srv_prof_id','actual_StartDate_Time','actual_EndDate_Time',
                  'start_time','end_time']
    def get_actual_StartDate_Time(self, obj):
        try:
            dates=models.agg_hhc_detailed_event_plan_of_care.objects.get(agg_sp_dt_eve_poc_id=obj.agg_sp_dt_eve_poc_id)
            date=f'{dates.actual_StartDate_Time} {dates.start_time}'
            return date
        except:
            return None
        
class get_srv_data_ser(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_services
        fields = ['srv_id','service_title']
class get_epoc_dta_ser(serializers.ModelSerializer):
    srv_id = get_srv_data_ser()
    class Meta:
        model = models.agg_hhc_event_plan_of_care
        fields = ['eve_poc_id','srv_id']


# class reschedule_cancle_request_pro_seri(serializers.ModelSerializer):
#     dtl_eve_id = dtl_epoc_data_recan_re()
#     eve_id = eve_data_recan_re()
#     epoc_id = get_epoc_dta_ser()

#     class Meta:
#         model = models.agg_hhc_cancellation_and_reschedule_request
#         fields = ['req_id','eve_id','epoc_id','dtl_eve_id','is_canceled','is_srv_sesn','is_reschedule',
#                   'req_resson','remark','added_by','added_date']


class reschedule_cancle_request_pro_seri(serializers.ModelSerializer):
    dtl_eve_id = dtl_epoc_data_recan_re()
    eve_id = eve_data_recan_re()
    epoc_id = get_epoc_dta_ser()
    prof_name = serializers.SerializerMethodField()
    prof_no = serializers.SerializerMethodField()
    class Meta:
        model = models.agg_hhc_cancellation_and_reschedule_request
        fields = ['req_id','eve_id','epoc_id','dtl_eve_id','srv_prof_id','prof_name','prof_no','is_canceled','is_srv_sesn','is_reschedule',
                  'req_resson','remark','reschedule_date','added_by','added_date']
    def get_prof_name(self, obj):
        return obj.srv_prof_id.prof_fullname if obj.srv_prof_id else None

    def get_prof_no(self, obj):
        return obj.srv_prof_id.phone_no if obj.srv_prof_id else None













# class reschedule_cancle_request_pro_seri(serializers.ModelSerializer):
#     class Meta:
#         model = models.agg_hhc_cancellation_and_reschedule_request
#         fields = ['req_id','eve_id','epoc_id','dtl_eve_id','is_canceled','is_srv_sesn','is_reschedule',
#                   'req_resson','remark','added_by','added_date']

# from.models import *

#-------------------mayank permission module---------------
# class SubmoduleSerializer(serializers.Serializer):  
#     submoduleId = serializers.IntegerField()
#     submoduleName = serializers.CharField()
class Mmoduleserializer(serializers.ModelSerializer):
     group_name = serializers.CharField(source='group.grp_name', allow_null=True)

     class Meta:
          model = models.Permission_module
          fields = ['module_id', 'name', 'group','group_name']
          
class permission_sub_Serializer(serializers.ModelSerializer):
    class Meta:
        model = models.permission
        fields = '__all__'
# class ModuleSerializer(serializers.Serializer):
#     moduleId = serializers.IntegerField()
#     moduleName = serializers.CharField()
#     selectedSubmodules = SubmoduleSerializer(many=True)
# class SavePermissionSerializer(serializers.ModelSerializer):
#     modules_submodule = serializers.ListField(child=ModuleSerializer())

#     class Meta:
#         model = models.agg_save_permissions
#         fields = ['id', 'modules_submodule', 'role', 'permission_status']
        
        
class HHC_Module(serializers.ModelSerializer):
    class Meta:
        model = models.agg_mas_group
        fields = '__all__'


class SubmoduleSerializer(serializers.Serializer):
    Permission_id = serializers.IntegerField()  # Remove source='Permission_id'
    name = serializers.CharField(source='submoduleName')
    
class ModuleSerializer(serializers.Serializer):
    module_id = serializers.IntegerField()  # Remove source='module_id'
    name = serializers.CharField()
    submodules = SubmoduleSerializer(many=True, source='selectedSubmodules')

class SavePermissionSerializer(serializers.ModelSerializer):
    modules_submodule = ModuleSerializer(many=True)

    class Meta:
        model = models.agg_save_permissions
        fields = ['id', 'modules_submodule', 'role', 'permission_status']



# class jc_qustions_serializer(serializers.ModelSerializer):
#     class Meta:
#         model = models.agg_hhc_job_closure_questions
#         fields = ['jcq_id','jcq_question','srv_id']

class jc_qustions_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_job_closure_questions
        fields = ['jcq_id','jcq_question','srv_id','que_shrt_name','date_time_remark_q_wise_name']




class deteailed_session_st_ed_time_date(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_detailed_event_plan_of_care
        fields = ['agg_sp_dt_eve_poc_id','prof_session_start_date','prof_session_end_date','prof_session_start_time','prof_session_end_time']





class get_selected_job_clousre_que_serializer(serializers.ModelSerializer):
    jcq_id = jc_qustions_serializer()
    class Meta:
        model = models.agg_hhc_events_wise_jc_question
        fields = ['eve_jcq_id','eve_id','srv_id','jcq_id','is_srv_enq_q']
        





class ptn_r_data(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_patients
        fields = ['agg_sp_pt_id','name']
        
class epoc_data_re_pro(serializers.ModelSerializer):
    srv_id = get_service_name()
    sub_srv_id = get_sub_service_name()
    
    class Meta :
        model = models.agg_hhc_event_plan_of_care
        fields = ['eve_poc_id','eve_id','srv_id','sub_srv_id','start_date','end_date']


class get_prof_requested_data_from_cr(serializers.ModelSerializer): 
    class Meta :
        model = models.agg_hhc_cancellation_and_reschedule_request
        fields = ['req_id','eve_id','epoc_id','dtl_eve_id','is_canceled','is_srv_sesn','is_reschedule','reschedule_date','req_resson','remark','added_by','added_date']

class request_approval_event_data(serializers.ModelSerializer):
    epoc_data = serializers.SerializerMethodField()
    # prof_requested_data = serializers.SerializerMethodField()
    agg_sp_pt_id = ptn_r_data()
    
    class Meta:
        model = models.agg_hhc_events
        # fields = ['eve_id','event_code','caller_id','added_from_hosp','agg_sp_pt_id','epoc_data','prof_requested_data']
        fields = ['eve_id','event_code','caller_id','added_from_hosp','agg_sp_pt_id','epoc_data']

    def get_epoc_data(self, obj):
        epoc_dt = models.agg_hhc_event_plan_of_care.objects.filter(eve_id = obj.eve_id)
        seria =  epoc_data_re_pro(epoc_dt,many=True)
        return seria.data
    
    # def get_prof_requested_data(self, obj):
    #     prof_requested_data = models.agg_hhc_cancellation_and_reschedule_request.objects.filter(eve_id = obj.eve_id).last()
    #     seria =  get_prof_requested_data_from_cr(prof_requested_data)
    #     return seria.data


class jc_qustions_serializerM(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_job_closure_questions
        fields = ['jcq_id','jcq_question_mar','srv_id','que_shrt_name','date_time_remark_q_wise_name']

class get_selected_job_clousre_que_serializerM(serializers.ModelSerializer):
    jcq_id = jc_qustions_serializerM()
    class Meta:
        model = models.agg_hhc_events_wise_jc_question
        fields = ['eve_jcq_id','eve_id','srv_id','jcq_id','is_srv_enq_q']

class jc_qustions_serializerH(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_job_closure_questions
        fields = ['jcq_id','jcq_question_hindi','srv_id','que_shrt_name','date_time_remark_q_wise_name']

class get_selected_job_clousre_que_serializerH(serializers.ModelSerializer):
    jcq_id = jc_qustions_serializerH()
    class Meta:
        model = models.agg_hhc_events_wise_jc_question
        fields = ['eve_jcq_id','eve_id','srv_id','jcq_id','is_srv_enq_q']


class Ongoing_Eve_serializer(serializers.ModelSerializer):
    agg_sp_pt_id=serializers.SerializerMethodField()
    service=serializers.SerializerMethodField()
    payment=serializers.SerializerMethodField()
    job_closure=serializers.SerializerMethodField()
    class Meta:
        model=models.agg_hhc_events
        fields = ['eve_id', 'event_code', 'agg_sp_pt_id', 'service', 'payment', 'job_closure', 'added_by']

    def get_service(self, obj):
        plan_of_care = models.agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.eve_id,status=1).values('eve_poc_id','sub_srv_id','sub_srv_id__recommomded_service','srv_id','srv_id__service_title','start_date','end_date','start_time','end_time').last()
        if plan_of_care:
            data={
                "eve_poc_id":plan_of_care['eve_poc_id'],
                "sub_service_id":plan_of_care['sub_srv_id'],
                "sub_service_start_time":str(plan_of_care['start_time']),
                "sub_service_end_time":str(plan_of_care['end_time']),
                "sub_service":plan_of_care['sub_srv_id__recommomded_service'],
                "service_id":plan_of_care['srv_id'],
                "service": plan_of_care['srv_id__service_title'],
                "start_date": str(plan_of_care['start_date']),
                "end_date": str(plan_of_care['end_date']),
            }
            return data
        else: return None
    
    # def get_payment(self, obj):
    #     final_amount = obj.final_amount
    #     paid=models.agg_hhc_payment_details.objects.filter(eve_id=obj.eve_id,overall_status='SUCCESS', status=1).values('amount_paid').aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0
    #     data = {
    #         "final_amount":final_amount,
    #         "paid_amount":round(paid),
    #         "pending_amount":round(final_amount-float(paid)),
    #     }   
    #     return data

    def get_payment(self, obj):
        final_amount = obj.final_amount
        # paid=models.agg_hhc_payment_details.objects.filter(eve_id=obj.eve_id,overall_status='SUCCESS', status=1).values('amount_paid').aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0
        ammt=models.agg_hhc_payment_details.objects.filter(eve_id=obj.eve_id,overall_status='SUCCESS', status=1)
        paid = ammt.values('amount_paid').aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0
        # dt = []
        # for i in ammt:
        #     print(i.payment_status.value,"ammtammtammtammtammt")
        #     dt.append(i.payment_status.value)
        ammt_dtl = ammt.order_by('date')
        last_payment = ammt.last()
        payment_status = last_payment.payment_status.value if last_payment else None

        # last_amt= ammt.first()
        # print(last_amt.payment_status.value)
        data = {
            "final_amount":final_amount,
            "paid_amount":round(paid),
            "pending_amount":round(final_amount-float(paid)),
            "payment_status":payment_status
        }   
        return data

    def get_job_closure(self, obj):
        detail_eve=models.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id, status=1).order_by('actual_StartDate_Time')
        # for i in detail_eve:
        #     print(i.eve_poc_id,i.agg_sp_dt_eve_poc_id,obj.eve_id, ';.................')
        total_session=detail_eve.count()
        count=0
        job_closure_count = sum(1 for i in detail_eve if i.Session_jobclosure_status == 1)
        today = timezone.now().date()
        if detail_eve:
            if detail_eve[0].actual_StartDate_Time <today:
                prof_data=detail_eve[0].srv_prof_id
                # print(prof_data,"prof_data")
                if prof_data:
                    prof=prof_data.prof_fullname
                    prof_id=prof_data.srv_prof_id
                else:
                    prof=None
                    prof_id=None
            elif detail_eve[0].actual_StartDate_Time >today:
                prof_data=detail_eve.last().srv_prof_id
                prof=prof_data.prof_fullname
                prof_id=prof_data.srv_prof_id
            else:
                prof_data=detail_eve.get(actual_StartDate_Time=today).srv_prof_id
                prof=prof_data.prof_fullname
                prof_id=prof_data.srv_prof_id
            detail_eve
            # print(today)
            # actual_StartDate_Time
            data = {
                "srv_prof_id":prof_id,
                "service_professional":prof,
                "total_session":total_session,
                "job_closure_count":job_closure_count,
                "job_closure_pending":total_session-job_closure_count
            }
            return data
        else: return 'no_data_available_for this event'

    def get_agg_sp_pt_id(self, obj):
        patient=obj.agg_sp_pt_id
        caller=obj.caller_id
        data={
            "patient_id":patient.agg_sp_pt_id,
            "name":patient.name,
            "phone":patient.phone_no,
            "caller_phone":caller.phone,
            "patient_email_id":patient.patient_email_id,
            "zone_id":patient.prof_zone_id.prof_zone_id if hasattr(patient.prof_zone_id,'prof_zone_id') else None,
            "zone":patient.prof_zone_id.Name if hasattr(patient.prof_zone_id,'Name') else None,
        }
        return data







class dash_complaint_counts_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.dash_complaint_feedback_counts
        fields = ["comp_total_sch","comp_completed","comp_pending","comp_positive","comp_negative","is_feed_comp"]


class dash_feedback_counts_serializer(serializers.ModelSerializer):
    class Meta:
        model = models.dash_complaint_feedback_counts
        fields = ["feed_excellent","feed_good","feed_poor","is_feed_comp"]


class AggHHCAttendanceSerializer(serializers.ModelSerializer):
    srv_name = serializers.CharField(source='srv_id.service_title', allow_null=True)
    class Meta:
        model  = agg_hhc_service_professionals
        fields = ['srv_prof_id','prof_fullname','phone_no','Job_type','srv_id','srv_name']
        
    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data
    
#class POST_AggHHCAttendanceSerializer(serializers.ModelSerializer):
    # class Meta:
    #     model  = models.agg_hhc_attendance
    #     fields = ['Professional_iid','mobile_no','service','attnd_date','job_type','attnd_status','attnd_type','attnd_Note','from_avail', 'to_avail']
        
    # def validate(self, data):
    #     Professional_iid = data.get('Professional_iid')
    #     attnd_date = data.get('attnd_date')

    #     if models.agg_hhc_attendance.objects.filter(Professional_iid=Professional_iid, attnd_date=attnd_date).exists():
    #         # Instead of raising an error, we set a flag
    #         data['attendance_exists'] = True
    #     else:
    #         data['attendance_exists'] = False
        
    #     return data
    
    # def create(self, validated_data):
    #     validated_data.pop('attendance_exists', None)
    #     return super().create(validated_data)
    
class TimeFieldWithEmptyHandling(serializers.TimeField):
    def to_internal_value(self, value):
        if value == "":
            return None
        return super().to_internal_value(value)

class POST_AggHHCAttendanceSerializer(serializers.ModelSerializer):
    from_avail = TimeFieldWithEmptyHandling(required=False, allow_null=True)
    to_avail = TimeFieldWithEmptyHandling(required=False, allow_null=True)

    class Meta:
        model = models.agg_hhc_attendance
        fields = ['Professional_iid', 'mobile_no', 'service', 'attnd_date', 'job_type', 'attnd_status', 'attnd_type', 'attnd_Note', 'from_avail', 'to_avail']
    
    def validate(self, data):
        Professional_iid = data.get('Professional_iid')
        attnd_date = data.get('attnd_date')

        if models.agg_hhc_attendance.objects.filter(Professional_iid=Professional_iid, attnd_date=attnd_date).exists():
            data['attendance_exists'] = True
        else:
            data['attendance_exists'] = False

        return data
    
    def create(self, validated_data):
        validated_data.pop('attendance_exists', None)
        return super().create(validated_data)
    
    class Meta:
        model = models.agg_hhc_attendance
        fields = ['Professional_iid', 'mobile_no', 'service', 'attnd_date', 'job_type', 'attnd_status', 'attnd_type', 'attnd_Note', 'from_avail', 'to_avail']
    
    def validate(self, data):
        Professional_iid = data.get('Professional_iid')
        attnd_date = data.get('attnd_date')
        from_avail = data.get('from_avail')
        to_avail = data.get('to_avail')

        if models.agg_hhc_attendance.objects.filter(Professional_iid=Professional_iid, attnd_date=attnd_date).exists():
            data['attendance_exists'] = True
        else:
            data['attendance_exists'] = False
        
        # Handle empty string for time fields
        if from_avail == "":
            data['from_avail'] = None
        if to_avail == "":
            data['to_avail'] = None

        # Validate time fields only if they are provided and not None
        # if data.get('from_avail') and not self.is_valid_time(data['from_avail']):
        #     raise serializers.ValidationError({"from_avail": "Time has wrong format. Use one of these formats instead: hh:mm[:ss[.uuuuuu]]."})
        # if data.get('to_avail') and not self.is_valid_time(data['to_avail']):
        #     raise serializers.ValidationError({"to_avail": "Time has wrong format. Use one of these formats instead: hh:mm[:ss[.uuuuuu]]."})

        return data
    
    def is_valid_time(self, time_str):
        try:
            datetime.datetime.strptime(time_str, '%H:%M:%S')
            return True
        except ValueError:
            try:
                datetime.datetime.strptime(time_str, '%H:%M')
                return True
            except ValueError:
                return False
    
    def create(self, validated_data):
        validated_data.pop('attendance_exists', None)
        return super().create(validated_data)

    
class GET_AggHHCAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model  = models.agg_hhc_attendance
        fields = ['att_id','Professional_iid','mobile_no','service','attnd_date','job_type','attnd_status','attnd_type','attnd_Note','approve_status']
        
class Put_AggHHCAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model  = models.agg_hhc_attendance
        fields = ['Professional_iid','mobile_no','service','attnd_date','job_type','attnd_status','attnd_type','attnd_Note']
        
class ServiceCountSaveForWebsiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.service_count_save_for_website
        fields = '__all__'







class GetCallerDetails(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_callers
        fields = ['caller_id', 'caller_fullname', 'phone']

class GetPatientDetails(serializers.ModelSerializer):
    caller_rel_id=serializers.SerializerMethodField()
    gender_id=serializers.SerializerMethodField()
    state_id=serializers.SerializerMethodField()
    city_id=serializers.SerializerMethodField()
    prof_zone_id=serializers.SerializerMethodField()
    class Meta:
        model = models.agg_hhc_patients
        fields = ['agg_sp_pt_id', 'caller_rel_id', 'name', 'gender_id', 'state_id', 'city_id', 'address', 'google_address', 'prof_zone_id', 'pincode','Age', 'lattitude', 'langitude', 'Suffered_from', 'phone_no', 'patient_email_id']

    def get_caller_rel_id(self, obj):
        if obj.caller_rel_id:
            relation = {
                'caller_rel_id':obj.caller_rel_id.caller_rel_id,
                'rel_name':obj.caller_rel_id.relation
            }
        return None

    def get_gender_id(self, obj):
        if obj.gender_id:
            gender = {
                'gender_id': obj.gender_id.gender_id,
                'name': obj.gender_id.name
                }
            return gender
        else:
            return None

    def get_state_id(self, obj):
        if obj.state_id:
            state = {
                'state_id': obj.state_id.state_id,
                'state':obj.state_id.state_name
            }
            return state
        else:
            return None

    def get_city_id(self, obj):
        if obj.city_id:
            city = {
                'city_id': obj.city_id.city_id,
                'city': obj.city_id.city_name
            }
            return city
        else:
            return None

    def get_prof_zone_id(self, obj):
        if obj.prof_zone_id:
            prof_zone = {
                'id': obj.prof_zone_id.prof_zone_id,
                'zone_name':obj.prof_zone_id.Name
                }
            return prof_zone
        else:
            return None

class GetPlaneofCareDetails(serializers.ModelSerializer):
    srv_id=serializers.SerializerMethodField()
    sub_srv_id=serializers.SerializerMethodField()
    end_date=serializers.SerializerMethodField()
    # hosp_id=serializers.SerializerMethodField()
    # doct_cons_id=serializers.SerializerMethodField()
    class Meta:
        model = models.agg_hhc_event_plan_of_care
        fields = ['eve_poc_id', 'srv_id', 'sub_srv_id', 'end_date']

    def get_srv_id(self, obj):
        if obj.srv_id:
            service = {
                "srv_id":obj.srv_id.srv_id,
                "service_name":obj.srv_id.service_title
            }
            return service
        else:
            return None
    def get_sub_srv_id(self, obj):
        if obj.sub_srv_id:
            sub_service={
                "sub_srv_id":obj.sub_srv_id.sub_srv_id,
                "sub_service_name":obj.sub_srv_id.recommomded_service,
                "Service_Time":obj.sub_srv_id.Service_Time,
                "cost":obj.sub_srv_id.cost,
            }
            return sub_service
        else:
            return None
        
    def get_end_date(self, obj):
        if obj.end_date:
            date=str(obj.end_date)
            return date
        return None
    # def get_hosp_id(self, obj):
    #     if obj.hosp_id:
    #         service={
    #             "hosp_id":obj.hosp_id.hosp_id,
    #             "hospital_name":obj.hosp_id.hospital_name
    #         }
    #         return service
    #     else:
    #         return None
    # def get_doct_cons_id(self, obj):
    #     if obj.doct_cons_id:
    #         doctor={
    #             "doct_cons_id":obj.doct_cons_id.doct_cons_id,
    #             "consultant_name": obj.doct_cons_id.cons_fullname,
    #             "consultant_phone": obj.doct_cons_id.mobile_no 
    #         }
    #         return doctor
    #     else:
    #         return None

class GetEventDetailsSetializer(serializers.ModelSerializer):
    patient=serializers.SerializerMethodField()
    caller=serializers.SerializerMethodField()
    eve_poc_dt=serializers.SerializerMethodField()
    class Meta:
        model = models.agg_hhc_events
        fields = ['eve_id', 'patient', 'caller', 'eve_poc_dt']

    def get_patient(self, obj):
        # patient=obj.agg_sp_pt_id.agg_sp_pt_id
        patients = GetPatientDetails(obj.agg_sp_pt_id).data
        evepoc=models.agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.eve_id, status=1).last()
        if evepoc.doct_cons_id:
            docconn=evepoc.doct_cons_id
            doccon={}
            doccon['doct_cons_id']=docconn.doct_cons_id
            doccon['cons_fullname']=docconn.cons_fullname
            doccon['mobile_no']=docconn.mobile_no
        else:
            doccon=None
        if evepoc.hosp_id:   
            hospt=evepoc.hosp_id
            hosp={}
            hosp['hosp_id']=hospt.hosp_id
            hosp['hospital_name']=hospt.hospital_name
        else:
            hosp=None
        patients['hosp_id']=hosp
        patients['doct_cons_id']=doccon
        return patients
    
    def get_caller(self, obj):
        caller=obj.caller_id.caller_id
        caller= GetCallerDetails(obj.caller_id).data
        return caller


    def get_eve_poc_dt(self, obj):
        poc=models.agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.eve_id, status=1).last()
        data1=GetPlaneofCareDetails(poc).data
        return data1


class PostFile(serializers.ModelSerializer):
    file_type = serializers.SerializerMethodField()
    files = serializers.SerializerMethodField()

    class Meta:
        model = models.HeplFiles
        fields=['file_id', 'file_name', 'files', 'file_type']

    def get_file_type(self, obj):
        ob=obj.file_type
        if ob==1:
            return 'video'
        elif ob==2:
            return 'txt'
        elif ob==3:
            return 'image'
        elif ob==4:
            return 'ppt'
        else:
            return None
        
    def get_files (self, obj):
        ob=obj.files
        cors_allowed_origins = getattr(settings, 'CORS_ALLOWED_ORIGINS', [])
        if ob:
            file_path=str(cors_allowed_origins[1])+ "/media/" + str(obj.files)
            return file_path
        else:
            return None
        

class PostFile1(serializers.ModelSerializer):
    # file_type = serializers.SerializerMethodField()
    # files = serializers.SerializerMethodField()

    class Meta:
        model = models.HeplFiles
        fields=['file_id', 'file_name', 'files', 'file_type']
    def get_file_type(self, obj):
        ob=obj.file_type
        if ob==1:
            return 'video'
        elif ob==2:
            return 'document'
        elif ob==3:
            return 'image'
        elif ob==4:
            return 'pdf'
        else:
            return None   
        
        
class Deallocate_and_POST_AggHHCAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model  = models.agg_hhc_attendance
        fields = ['Professional_iid','mobile_no','service','attnd_date','job_type','attnd_status','attnd_type','attnd_Note','approve_status']
        
class AggHHCCancellationAndRescheduleRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_cancellation_and_reschedule_request
        fields = '__all__'
class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_hhc_attendance
        fields = '__all__'
        
        
class FeedBackQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.FeedBack_Questions
        fields = ('F_questions', 'Question_eng', 'Question_hin', 'Question_mar')

class FeedBackQuestionWithLangAndOptionsSerializer(serializers.ModelSerializer):
    question = serializers.SerializerMethodField()
    answer_options = serializers.SerializerMethodField()

    class Meta:
        model = models.FeedBack_Questions
        fields = ('F_questions', 'question', 'answer_options')

    def get_question(self, obj):
        request = self.context.get('request')
        lang = request.query_params.get('lang', 'eng')  # Default to English if lang param is missing
        
        if lang == 'eng':
            return obj.Question_eng
        elif lang == 'hin':
            return obj.Question_hin
        elif lang == 'mar':
            return obj.Question_mar
        else:
            return obj.Question_eng  # Default to English if lang param is invalid

    def get_answer_options(self, obj):
        request = self.context.get('request')
        lang = request.query_params.get('lang', 'eng')  # Default to English if lang param is missing
        
        # if obj.F_questions == 17:
        #     if lang == 'hin':
        #         return ['हाँ', 'नहीं']
        #     elif lang == 'mar':
        #         return ['होय', 'नाही']
        #     else:  # Default to English options
        #         return ['yes', 'No']
        if obj.F_questions == 16:
            if lang == 'hin':
                # return ['बुरा', 'अच्छा', 'मानक']
                return ['अच्छा', 'औसत', 'उत्कृष्ट']
            elif lang == 'mar':
                return ['चांगलं', 'सरासरी', 'उत्कृष्ट']
            else:  # Default to English options
                return ['Good', 'Average', 'Excellent']
            
        elif obj.F_questions == 17:
            if lang == 'hin':
                return ['हाँ', 'नहीं']
            elif lang == 'mar':
                return ['होय', 'नाही']
            else:  # Default to English options
                return ['yes', 'No']
            
        elif obj.F_questions == 18:
            return [{'star': 5}]
        else:
            return []  # Default case, if needed
        

class FeedBackQuestionWithLangAndOptionsss(serializers.ModelSerializer):
    question = serializers.SerializerMethodField()
    answer_options = serializers.SerializerMethodField()

    class Meta:
        model = models.FeedBack_Questions
        fields = ('F_questions', 'question', 'answer_options')

    def get_question(self, obj):
        request = self.context.get('request')
        lang = request.query_params.get('lang', 'eng')  # Default to English if lang param is missing
        
        if lang == 'eng':
            return obj.Question_eng
        elif lang == 'hin':
            return obj.Question_hin
        elif lang == 'mar':
            return obj.Question_mar
        else:
            return obj.Question_eng  # Default to English if lang param is invalid

    def get_answer_options(self, obj):
        request = self.context.get('request')
        lang = request.query_params.get('lang', 'eng')  # Default to English if lang param is missing
        
        # if obj.F_questions == 17:
        #     if lang == 'hin':
        #         return ['हाँ', 'नहीं']
        #     elif lang == 'mar':
        #         return ['होय', 'नाही']
        #     else:  # Default to English options
        #         return ['yes', 'No']
        if obj.F_questions == 16:
            if lang == 'hin':
                # return ['बुरा', 'अच्छा', 'मानक']
                return ['अच्छा', 'औसत', 'उत्कृष्ट']
            elif lang == 'mar':
                return ['चांगलं', 'सरासरी', 'उत्कृष्ट']
            else:  # Default to English options
                return ['Good', 'Average', 'Excellent']
            
        elif obj.F_questions == 17:
            if lang == 'hin':
                return ['हाँ', 'नहीं']
            elif lang == 'mar':
                return ['होय', 'नाही']
            else:  # Default to English options
                return ['yes', 'No']
            
        elif obj.F_questions == 18:
            return ['star']
        else:
            return []  # Default case, if needed

class AggSavePatientFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_save_patient_feedback_table
        fields = ['feedback_id', 'eve_id', 'ptn_id', 'prof_id', 'f_questions', 'answer']




class prof_names_eve_wise_serializer(serializers.ModelSerializer):
    prof_name = serializers.SerializerMethodField()
    class Meta:
        model= models.agg_hhc_detailed_event_plan_of_care
        fields=['agg_sp_dt_eve_poc_id', 'eve_id', 'eve_poc_id', 'srv_prof_id','prof_name']
    def get_prof_name(self, obj):
        if obj.srv_prof_id:
            return obj.srv_prof_id.prof_fullname
        else:
            return ""
        

######### Website Chatbot ###########
#chatbot serializer
class ChatbotConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ChatbotConversation
        fields = '__all__'

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.agg_Discount_Coupon_Code
        fields = ['coupon_id', 'Code', 'discount_type', 'discount_value']