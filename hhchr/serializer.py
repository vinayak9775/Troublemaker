from rest_framework import serializers
from hhcweb.models import *
from datetime import date 

class event_Ids_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_events
        fields = []


class DayPrintSerializer(serializers.ModelSerializer):
    # eve_id = serializers.SerializerMethodField()
    pay_recived_by = serializers.SerializerMethodField()
    mode = serializers.SerializerMethodField()
    patient_name = serializers.SerializerMethodField()
    event_code = serializers.SerializerMethodField()
    hhcid = serializers.SerializerMethodField()
    invoice = serializers.SerializerMethodField()
    hospital_name=serializers.SerializerMethodField()
    added_date=serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_payment_details
        fields = ['pay_dt_id', 'eve_id','event_code','hhcid','amount_paid','added_date','mode','pay_recived_by', 'patient_name','invoice','hospital_name']

    def get_added_date(self,obj):
        if obj.added_date:
            date=dt = datetime.datetime.fromisoformat(str(obj.added_date))
            date_part = dt.date()
            time_part = dt.time().replace(microsecond=0)
            return str(date_part)+" "+str(time_part)
        return None

    def get_pay_recived_by(self,obj):
        # doctor=obj.pay_recived_by
        # prof = obj.srv_prof_id
        # if prof:
        #     return f'{obj.srv_prof_id.prof_fullname}'

        # else:
        #     if obj.pay_recived_by:
        #         return f'{obj.pay_recived_by.clg_last_name} {obj.pay_recived_by.clg_first_name} {obj.pay_recived_by.clg_mid_name}'
        #     else:
        #         return None
        if obj.added_by:
            if obj.added_by:

                return obj.added_by
                # return f'{obj.added_by.clg_last_name} {obj.added_by.clg_first_name} {obj.added_by.clg_mid_name}'
            else:
                return None
        else:
            prof = obj.srv_prof_id
            if prof:
                return f'{obj.srv_prof_id.prof_fullname}'

    # def get_hospital_name(self,obj):
    #     try:
    #         return obj.eve_id.agg_sp_pt_id.preferred_hosp_id.hospital_name
    #     except:
    #         return None

    def get_hospital_name(self,obj):
        try:
            # return obj.eve_id.agg_sp_pt_id.preferred_hosp_id.hospital_name
            epoc = agg_hhc_event_plan_of_care.objects.filter(eve_id = obj.eve_id, status = 1).last()
            print(epoc.hosp_id,'epoc')
            if epoc.hosp_id:
                return epoc.hosp_id.hospital_name
            else:
                return 'Test'
        except Exception as e:
            print(str(e))
            return None
        

    def get_patient_name(self, obj):
        try:
            return obj.eve_id.agg_sp_pt_id.name
        except:
            return None
        
    def get_event_code(self, obj):
        try:
            return obj.eve_id.event_code
        except:
            return None
        
    def get_hhcid(self, obj):
        try:
            return obj.eve_id.agg_sp_pt_id.hhc_code
        except:
            return None
        
    def get_hhcid(self, obj):
        try:
            return obj.eve_id.agg_sp_pt_id.preferred_hosp_id.hospital_short_code
        except:
            return None
        
    def get_mode(self, obj):
        mode = obj.mode
        if mode==1:
            return 'Cash'
        elif mode==2:
            return 'Cheque'
        elif mode==3:
            return 'Online'
        elif mode==4:
            return 'Card'
        elif mode==5:
            return 'Qr_code'
        elif mode==6:
            return 'NEFT'

    def get_invoice(self, obj):
        if obj.eve_id.Invoice_ID:
            return obj.eve_id.Invoice_ID
        else:
            return None

        
class Manage_emp_serializer(serializers.ModelSerializer):
    class Meta:
        model= agg_com_colleague
        fields=['clg_ref_id','clg_email','clg_work_email_id','clg_hos_id','clg_agency_id','clg_Emplyee_code','clg_avaya_agentid','clg_first_name','clg_mid_name','clg_last_name','grp_id','clg_gender','clg_mobile_no','clg_Work_phone_number','clg_Date_of_birth','clg_Aadhar_no','clg_designation','clg_qualification','clg_specialization','clg_address','clg_state','clg_division','clg_district','clg_senior','clg_break_type','clg_status','clg_profile_photo_path','clg_joining_date','clg_marital_status','clg_otp','clg_otp_count','clg_otp_expire_time','is_active','clg_is_login','is_admin','created_at','updated_at','last_modified_by']
        # fields = '__all__'
        # fields = ['clg_hos_id']

    def validate(self, data):
        return data
    
class InvoiceSerializer(serializers.ModelSerializer):
    agg_sp_pt_id = serializers.SerializerMethodField()
    service_details = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_events
        fields = ['eve_id', 'agg_sp_pt_id','service_details']

    def get_agg_sp_pt_id(self, obj):
        print(obj.agg_sp_pt_id, ';;1;;')
        patient = obj.agg_sp_pt_id
        p_hhcid = patient.hhc_code
        p_name = patient.name
        p_phone = patient.phone_no
        p_address = patient.address
        data = {
            "patient" : patient.agg_sp_pt_id,
            "p_hhcid" : p_hhcid,
            "p_name" : p_name,
            "p_phone" : p_phone,
            "p_address" : p_address
        }
        return data
    
    def get_service_details(self, obj):
        try:
            poc = agg_hhc_event_plan_of_care.objects.get(eve_id=obj.eve_id)
        except agg_hhc_event_plan_of_care.DoesNotExist:
            return None

        return 1





class manage_Profiles_status_serializers(serializers.ModelSerializer):
    int_status = serializers.CharField(source='get_int_status_display')

    class Meta:
        model = agg_hhc_prof_interview_details
        fields = ['int_status']

class agg_hhc_srv_prof_all_data_serializer(serializers.ModelSerializer):
    # manage_Profiles_status = manage_Profiles_status_serializers(source='agg_hhc_prof_interview_details_set', many=True, read_only=True)
    manage_Profiles_status = serializers.SerializerMethodField()
    Job_type = serializers.SerializerMethodField()    
    class Meta:
        model = agg_hhc_service_professionals
        fields = [
            'srv_prof_id', 'prof_fullname', 'srv_id', 'phone_no', 
            'alt_phone_no', 'manage_Profiles_status', 'Job_type'
        ]

    def get_manage_Profiles_status(self, obj):
        profiles_status = agg_hhc_prof_interview_details.objects.filter(srv_prof_id=obj.srv_prof_id, status=1)
        if profiles_status.exists():
            return profiles_status.first().get_int_status_display()
        return None

    def get_Job_type(self, obj):
        # Define the mapping dictionary for Job_type within the method
        job_type_mapping = {
            1: 'On Call',
            2: 'Full Time',
            3: 'Part Time'
        }
        # Return the corresponding job type name
        return job_type_mapping.get(obj.Job_type, '')
    
    def validate(self, data):
        return data
    



class agg_hhc_srv_prof_serializer(serializers.ModelSerializer):
    class Meta:
        model  = agg_hhc_service_professionals
        fields=['srv_prof_id','professional_code','clg_ref_id','reference_type','title','skill_set','Job_type','prof_fullname','email_id','phone_no','alt_phone_no','eme_contact_no','eme_contact_relation','eme_conact_person_name','dob','doj','address','work_email_id','work_phone_no','work_address','prof_zone_id','set_location','status','isDelStatus','lattitude','langitude','google_home_location','google_work_location','Physio_Rate','police_varification','apron_charges','document_status','OTP','OTP_count','otp_expire_time','Profile_pic','Ratings','Reviews','OTP_verification','availability_status','mode_of_service','location_status','srv_id','prof_sub_srv_id','Calendar','certificate_registration_no','Experience','gender','Education_level','pin_code_id','prof_address','city','state_name','prof_address','cv_file','profile_file','prof_registered','prof_interviewed','prof_doc_verified','designation','availability','professinal_status','last_modified_by']
        # fields = '__all__'
        
    def validate(self, data):
        return data
    



class ob_1_serializer(serializers.ModelSerializer):
    Job_type = serializers.SerializerMethodField()   
    class Meta:
        model  = agg_hhc_service_professionals
        fields = ['srv_prof_id', 'prof_fullname', 'srv_id', 'phone_no', 'Job_type', 'doj']
    
    def get_Job_type(self, obj):
        # Define the mapping dictionary for Job_type within the method
        job_type_mapping = {
            1: 'On Call',
            2: 'Full Time',
            3: 'Part Time'
        }
        # Return the corresponding job type name
        return job_type_mapping.get(obj.Job_type, '')
        
    def validate(self, data):
        return data
    
        
# class agg_hhc_srv_prof_int_dtls_serializer(serializers.ModelSerializer):
#     class Meta:
#         model  = agg_hhc_prof_interview_details
#         fields=['srv_prof_int_id','srv_prof_id', 'int_round', 'int_mode', 'int_schedule_with', 'int_schedule_datetime','int_status', 'status','last_modified_by']
        
#     def validate(self, data):
#         return data



class get_service_prof_details_serializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    Job_type = serializers.SerializerMethodField()  
    class Meta:
        model = agg_hhc_service_professionals
        fields = [
            'srv_prof_id', 'prof_fullname', 'srv_id', 'phone_no', 
            'alt_phone_no', 'role', 'Job_type'
        ]    
    def get_role(self, obj):
        # Define the mapping dictionary for Job_type within the method
        role_mapping = {
            1: 'Professional',
            2: 'Vendor'
        }
        # Return the corresponding job type name
        return role_mapping.get(obj.role, '')
    
    def get_Job_type(self, obj):
        # Define the mapping dictionary for Job_type within the method
        job_type_mapping = {
            1: 'On Call',
            2: 'Full Time',
            3: 'Part Time'
        }
        # Return the corresponding job type name
        return job_type_mapping.get(obj.Job_type, '')    

class agg_hhc_srv_prof_int_dtls_serializer(serializers.ModelSerializer):
    srv_prof_id = get_service_prof_details_serializer()
    int_mode = serializers.SerializerMethodField()  
    class Meta:
        model  = agg_hhc_prof_interview_details
        fields=['srv_prof_int_id', 'int_round', 'int_mode', 'int_schedule_with', 'int_schedule_date', 'int_schedule_time', 'srv_prof_id']


	 
	 
    def get_int_mode(self, obj):
        # Define the mapping dictionary for Job_type within the method
        int_mode_mapping = {
            1: 'Online',
            2: 'Offline'
        }
        # Return the corresponding job type name
        return int_mode_mapping.get(obj.int_mode, '')
    
        
    def validate(self, data):
        return data

    

class agg_hhc_srv_prof_doc_dtls_serializer(serializers.ModelSerializer):
    class Meta:
        model  = agg_hhc_professional_documents
        fields=['prof_doc_id','srv_prof_id', 'doc_li_id', 'professional_document', 'rejection_reason', 'status', 'isVerified', 'last_modified_by']
        
    def validate(self, data):
        return data
    
class agg_hhc_srv_prof_doc_list_serializer(serializers.ModelSerializer):
    class Meta:
        model  = agg_hhc_documents_list
        fields=['doc_li_id','professional_role', 'Documents_name', 'isManadatory']
        
    def validate(self, data):
        return data
    
class reg_prof_api_serializer(serializers.ModelSerializer):

    class Meta:
        model = agg_hhc_service_professionals
        fields = ['srv_id', 'title','prof_fullname','dob','gender','email_id','phone_no','alt_phone_no','eme_contact_no','eme_contact_relation',
                  'eme_conact_person_name','mode_of_service','availability_status','prof_zone_id','state_name','prof_address','city','pin_code_id',
                  'prof_sub_srv_id','Education_level','cv_file','certificate_registration_no','availability']
                  
    
    def create(self, validated_data):
        # You can set the enum value you want here
        validated_data['professinal_status'] = Professional_status.Info_Submitted
        instance = super(reg_prof_api_serializer, self).create(validated_data)
        return instance
    
class colleage_add_prof_data(serializers.ModelSerializer):
    class Meta:
        model = agg_com_colleague
        # fields = ['','clg_email','']
        fields = ['clg_email', 'clg_first_name', 'clg_gender', 'clg_mobile_no', 'clg_Work_phone_number','clg_Date_of_birth','clg_address', 'clg_state','clg_district']

class Register_professioanl_for_colleague(serializers.ModelSerializer):
    class Meta:
        model = agg_com_colleague
        fields = ['clg_email', 'clg_first_name', 'clg_gender', 'clg_mobile_no', 'clg_Work_phone_number','clg_Date_of_birth',
        'clg_address', 'clg_state','clg_district']


class Register_professioanl_for_professional(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_service_professionals
        fields = ['srv_prof_id','clg_ref_id','role', 'title','email_id','prof_fullname','gender','eme_contact_relation','phone_no','dob','address','state_name','city','eme_contact_no', 'eme_conact_person_name','alt_phone_no','certificate_registration_no', 'mode_of_service', 'Job_type', 'srv_id', 'last_modified_by']

class add_prof_sub_services_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_professional_sub_services
        fields = ['prof_sub_srv_id', 'srv_prof_id', 'sub_srv_id']
class add_prof_qualification_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_service_professional_details
        fields = ['srv_prof_dt_id', 'srv_prof_id', 'qualification', 'specialization', 'prof_CV', 'availability_for_interview']

class add_prof_schedule_interview(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_prof_interview_details
        fields = ['srv_prof_int_id','srv_prof_id','int_round','int_mode', 'int_schedule_with', 'int_schedule_date', 'int_schedule_time']
    

class qualifications_serializer(serializers.ModelSerializer):
    class Meta:
        model=qualifications
        fields=['quali_id','qualification']
    
class qualification_specialization_serializer(serializers.ModelSerializer):
    class Meta:
        model=qualification_specialization
        fields=['quali_sp','specialization']

class add_prof_zones_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_professional_location
        fields = ['prof_loc_id', 'srv_prof_id', 'location_name']

class prof_status_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_service_professionals
        fields = ['srv_prof_id', 'induction', 'training', 'id_card']









class GET_prof_sub_services_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_professional_sub_services
        fields = ['prof_sub_srv_id', 'srv_prof_id', 'sub_srv_id']

class GET_prof_qualification_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_service_professional_details
        fields = ['srv_prof_dt_id', 'srv_prof_id', 'qualification', 'specialization', 'prof_CV', 'availability_for_interview']
        extra_kwargs = {
            'prof_CV': {'required': False}  # Make it optional if it's not always provided
        }        

class Get_Register_professioanl_for_professional(serializers.ModelSerializer):
    # qualification = GET_prof_qualification_serializer()
    qualification = serializers.SerializerMethodField()
    prof_sub_srv_id = GET_prof_sub_services_serializer()
    class Meta:
        model = agg_hhc_service_professionals
        fields = ['srv_prof_id','clg_ref_id','role', 'title','email_id','prof_fullname','gender','phone_no','dob','address','state_name','city','eme_contact_no', 'eme_conact_person_name','alt_phone_no','certificate_registration_no', 'mode_of_service', 'Job_type', 'srv_id','qualification','prof_sub_srv_id']




# class Get_Register_professioanl_for_professional(serializers.ModelSerializer):
#     qualifications = serializers.SerializerMethodField()
#     sub_services = serializers.SerializerMethodField()
#     class Meta:
#         model = agg_hhc_service_professionals
#         fields = ['srv_prof_id','clg_ref_id','role', 'title','email_id','prof_fullname','gender','phone_no','dob','address','state_name','city','eme_contact_no', 'eme_conact_person_name','alt_phone_no','certificate_registration_no', 'mode_of_service', 'Job_type', 'srv_id','qualifications','sub_services']

    def get_qualification(self, obj):
        qualifications = agg_hhc_service_professional_details.objects.filter(srv_prof_id=obj.srv_prof_id)
        print('qualification')
        seri0 =  GET_prof_qualification_serializer(qualifications)
        return seri0.data
    
