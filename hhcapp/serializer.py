from rest_framework import serializers
#from hhcapp import models
from hhcweb import models as webmodels

#-------------------------------------sandip------------------------------------------------------------------- 
class agg_hhc_app_services_serializer(serializers.ModelSerializer):
    class Meta:
        model=webmodels.agg_hhc_services
        fields = ['srv_id','service_title','discription','image_path'] 

class webserializers(serializers.ModelSerializer):
    class Meta:
        model=webmodels.agg_hhc_patients
        fields=['phone_no']
    def create(self,validated_data):
        return webmodels.agg_hhc_callers.objects.create(**validated_data)
    
#-------------------------------------------------------------------------------------------------
class colleagueRegistersSerializer(serializers.ModelSerializer):
    # otp = serializers.CharField(write_only=True)

    class Meta:
        model = webmodels.agg_hhc_callers
        fields = ('id', 'caller_id', 'email', 'fname', 'lname','otp')

class colleagueVerifyPhoneOTPSerializer(serializers.ModelSerializer):
    model = webmodels.agg_hhc_callers
    fields = ('id', 'caller_id','otp')
    
class colleagueRegistersSerializer(serializers.ModelSerializer):
    # otp = serializers.CharField(write_only=True)

    class Meta:
        model = webmodels.agg_hhc_callers
        fields = ('caller_id', 'email', 'fname', 'lname','otp')

class verifyPhoneSerializer(serializers.ModelSerializer):
    otp = serializers.CharField(write_only=True)

    class Meta:
        model = webmodels.agg_hhc_callers
        fields = ('id', 'caller_id')
        # extra_kwargs = {'otp': {'write_only': True}}

    def create(self, validated_data):
        otp = validated_data['otp']
        # otp = validated_data['otp']
        user = webmodels.agg_hhc_callers.objects.create_user(password=otp, **validated_data)
        return user
    
class CreatePhoneNo(serializers.ModelSerializer):
    class Meta:
        model=webmodels.agg_hhc_callers
        fields=['caller_id', 'otp']
    def create(self,validated_data):
        return webmodels.agg_hhc_callers.objects.create(**validated_data)
    

#========================================================================================================
class agg_hhc_patient_serializer(serializers.ModelSerializer):
    class Meta:
        model=webmodels.agg_hhc_patients
        fields=['agg_sp_pt_id','name','Age','gender_id','patient_email_id','caller_id','caller_rel_id','phone_no','pincode','address','google_address','state_id','city_id']

class add_multiple_address_serializer(serializers.ModelSerializer):
    class Meta:
        model=webmodels.agg_hhc_app_add_address
        fields=['address_id','address','google_address','city_id','locality','state_id','prof_zone_id','pincode','Address_type','caller_id','status','patient_id','last_modified_by']
        # fields="__all__"
class agg_hhc_app_refered_by_serializer(serializers.ModelSerializer):
    class Meta:
        model = webmodels.agg_hhc_hospitals
        fields=['hospital_name', 'hosp_id']

class agg_hhc_prefered_consultants_serializer(serializers.ModelSerializer):
    class Meta:
        model = webmodels.agg_hhc_doctors_consultants
        fields=[ 'doct_cons_id','first_name', 'last_name', 'middle_name']

          
class agg_hhc_patient_doc_details_serializer(serializers.ModelSerializer):
    class Meta:
        model = webmodels.agg_hhc_patient_documents
        fields = ['agg_sp_pt_id', 'doc_name', 'doucment', 'added_at_time']



#-----------------------------------vishal--------------------------------------------------------------------



class agg_hhc_callers_Serializer(serializers.ModelSerializer):
    class Meta:
        model=webmodels.agg_hhc_callers
        fields=['caller_id','clg_ref_id','phone','otp','otp_expire_time','caller_fullname','purp_call_id','Age','gender','email','alter_contact','Address','city','locality','state','pincode','emp_id','profile_pic','status','service_taken','last_modified_by']
        # fields='__all__'

class caller_serializers(serializers.ModelSerializer):
    class Meta:
        model=webmodels.agg_hhc_callers
        fields=['phone']
    def create(self,validated_data):
        return webmodels.agg_hhc_callers.objects.create(**validated_data)
    
class agg_hhc_app_patient_by_caller_id(serializers.ModelSerializer):
    class Meta:
        model=webmodels.agg_hhc_patients
        fields=['agg_sp_pt_id','doct_cons_id','caller_id','caller_rel_id','hhc_code','name','Age','gender_id','patient_email_id','state_id','city_id','address','google_address','prof_zone_id','pincode','otp','otp_expire_time','Suffered_from','hospital_name','preferred_hosp_id','phone_no','dob','status','isVIP','lattitude','langitude','Profile_pic','last_modified_by']
        # fields='__all__'

class agg_hhc_app_address_by_caller_id(serializers.ModelSerializer):
    class Meta:
        model=webmodels.agg_hhc_app_add_address
        fields=['address_id','address','google_address','city_id','locality','state_id','prof_zone_id','pincode','Address_type','caller_id','status','patient_id','last_modified_by']
        # fields="__all__"
#___________________________________________state______________
class agg_hhc_state_serializer(serializers.ModelSerializer):
    class Meta:
        model=webmodels.agg_hhc_state
        fields=['state_id','state_name','last_modified_by']
        # fields="__all__"

#______________________________sub_services_from_service_id__________________________
class agg_hhc_sub_services_serializer(serializers.ModelSerializer):
    class Meta:
        model=webmodels.agg_hhc_sub_services
        fields=['sub_srv_id','recommomded_service','srv_id','cost','tax','deposit','supplied_by','UOM','status','tf','Instruction','Specimen','last_modified_by']
        # fields="__all__"


#----------------App_device_token---------------------------------

class community_device_token_serializer(serializers.ModelSerializer):
    class Meta:
        model=webmodels.community_device_token
        fields=['caller_id','token']

#------------------create_service-------------------------------------
        
class agg_hhc_event_serializer(serializers.ModelSerializer):
    class Meta:
        model=webmodels.agg_hhc_events
        fields=['eve_id','event_code','caller_id','added_from_hosp',"agg_sp_pt_id",'purp_call_id','bill_no_ref_no','event_date','note','enquiry_added_date','enquiry_status','enquiry_cancellation_reason','enquiry_cancel_date','Total_cost','discount_type','discount_value','final_amount','status','day_convinance','total_convinance','isArchive','isConvertedService','Invoice_narration','invoice_narration_desc','branch_code','Suffered_from','OTP','OTP_count','otp_expire_time','address_id','enq_spero_srv_status','event_status','refer_by','Patient_status_at_present','patient_service_status','last_modified_by']
    
class agg_hhc_event_plan_of_care_serializer(serializers.ModelSerializer):
    class Meta:
        model=webmodels.agg_hhc_event_plan_of_care
        fields=["eve_poc_id","eve_id","srv_id","sub_srv_id","hosp_id","doct_cons_id","srv_prof_id","No_session_dates","start_date","end_date","start_time","end_time","initail_final_amount","service_reschedule","prof_prefered","remark"]

class detail_event_plan_of_care_serializer(serializers.ModelSerializer):
    class Meta:
        model=webmodels.agg_hhc_detailed_event_plan_of_care
        fields=['agg_sp_dt_eve_poc_id','eve_poc_id','eve_id','index_of_Session','srv_prof_id','actual_StartDate_Time','actual_EndDate_Time','start_time','end_time','service_cost','amount_received','emp_id','Session_status','Session_jobclosure_status','session_note','Reason_for_no_serivce','Comment_for_no_serivce','OTP','OTP_count','otp_expire_time','Reschedule_status','is_convinance','convinance_charges','is_cancelled','remark','status','last_modified_from','last_modified_by']
        # fields="__all__"

class patient_document_serializer(serializers.ModelSerializer):
    class Meta:
        model=webmodels.agg_hhc_patient_documents
        fields=['doc_id','agg_sp_pt_id','eve_id','discharge_summary','prescription','lab_reports','dressing','verification_status','status','last_modified_by']
        # fields="__all__"
    
class multiple_address_serializer(serializers.ModelSerializer):
    class Meta:
        model=webmodels.agg_hhc_app_add_address
        fields=['address_id','address','google_address','city_id','locality','state_id','prof_zone_id','pincode','Address_type','caller_id','status','patient_id','last_modified_by']
        # fields="__all__"

class agg_hhc_doctors_consultants_android_serializer(serializers.ModelSerializer):
    class Meta:
        model=webmodels.agg_hhc_doctors_consultants
        fields=['doct_cons_id','cons_fullname','mobile_no']

class agg_hhc_cancel_request_serializer(serializers.ModelSerializer):
    class Meta:
        model=webmodels.agg_hhc_cancellation_and_reschedule_request
        fields=['req_id','eve_id','epoc_id','is_canceled','is_srv_sesn','is_reschedule','req_resson','remark']
    
class feedback_serializer(serializers.ModelSerializer):
    class Meta:
        model=webmodels.agg_hhc_Professional_app_feedback
        fields=['feedbk_id','srv_prof_id','eve_id','rating','q1']

class feedback_media_serializer(serializers.ModelSerializer):
    class Meta:
        model=webmodels.agg_hhc_feedback_media_note
        fields=['feedbk_med_id','eve_id','image','vedio','audio','feedback_by','additional_comment']

class question_feedback_serializer(serializers.ModelSerializer):
    class Meta:
        model=webmodels.FeedBack_Questions
        fields="__all__"