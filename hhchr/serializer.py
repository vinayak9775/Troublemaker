from rest_framework import serializers
from hhcweb.models import *
from datetime import date 
from hhcspero.settings import SERVER_KEY

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


# _____________ Onbording Date Of Joining Amit _____________________- 
class ex_prof(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_EX_professional_Records
        fields = ['srv_prof_id','Join_Date','last_modified_by', 'added_by']
class hr_Onbording_doj_add_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_service_professionals
        fields = ['srv_prof_id', 'doj', 'last_modified_by']

# _____________ Onbording Date Of Joining Amit _____________________-


# ______________ Manage Profile Get All data HR Interviw Amit ______________________

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
            'alt_phone_no', 'manage_Profiles_status', 'Job_type',
        ]

    def get_manage_Profiles_status(self, obj):
        profiles_status = agg_hhc_prof_interview_details.objects.filter(srv_prof_id=obj.srv_prof_id, status=1)
        if profiles_status.exists():
            first_profile = profiles_status.last()
            return first_profile.int_status if first_profile.int_status else None
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
# ______________ Manage Profile Get All data HR Interviw Amit ______________________




# ___________________________ External Professional _____________- Amit

class extr_prof_aprov_reject_serializer(serializers.ModelSerializer):
    
    class Meta: 
        model = external_prof_approve_reject
        fields = ['extr_pro_ap_re', 'srv_prof_id', 'Remark', 'approve_reject', 'last_modified_by', 'added_by']
class srv_prof_data_get(serializers.ModelSerializer):
    # srv_prof_id = extr_prof_aprov_reject_serializer()
    class Meta: 
        model = agg_hhc_service_professionals
        fields = ['srv_prof_id', 'prof_compny']




# ___________________________ External Professional _____________- Amit


class agg_hhc_srv_prof_serializer(serializers.ModelSerializer):
    class Meta:
        model  = agg_hhc_service_professionals
        # fields=['srv_prof_id','professional_code','clg_ref_id','reference_type','title','skill_set','Job_type','prof_fullname','email_id','phone_no','alt_phone_no','eme_contact_no','eme_contact_relation','eme_conact_person_name','dob','doj','address','work_email_id','work_phone_no','work_address','prof_zone_id','set_location','status','isDelStatus','lattitude','langitude','google_home_location','google_work_location','Physio_Rate','police_varification','apron_charges','document_status','OTP','OTP_count','otp_expire_time','Profile_pic','Ratings','Reviews','OTP_verification','availability_status','mode_of_service','location_status','srv_id','prof_sub_srv_id','Calendar','certificate_registration_no','Experience','gender','Education_level','pin_code_id','prof_address','city','state_name','prof_address','cv_file','profile_file','prof_registered','prof_interviewed','prof_doc_verified','designation','availability','professinal_status', 'induction', 'traning', 'id_card','last_modified_by']
        # fields=['srv_prof_id','prof_fullname']
        # fields = '__all__'

        fields=['srv_prof_id','professional_code','clg_ref_id','reference_type','title','skill_set','Job_type','prof_fullname','email_id','phone_no','alt_phone_no','eme_contact_no','eme_contact_relation','eme_conact_person_name','dob','doj','address','work_email_id','work_phone_no','work_address','prof_zone_id','set_location','status','isDelStatus','lattitude','langitude','google_home_location','google_work_location','Physio_Rate','police_varification_charges','apron_charges','document_status','OTP','OTP_count','otp_expire_time','Profile_pic','Ratings','Reviews','OTP_verification','availability_status','mode_of_service','location_status','srv_id','prof_sub_srv_id','Calendar','certificate_registration_no','Experience','gender','Education_level','pin_code_id','prof_address','city','state_name','prof_address','cv_file','profile_file','prof_registered','prof_interviewed','prof_doc_verified','designation','availability','professinal_status', 'induction', 'training', 'id_card','last_modified_by']        
        
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

#  -------------------------------------- Our Employee List ---------------------------------------------------
# class Our_EMPLOYEE_List_serializer(serializers.ModelSerializer):
#     class Meta:
#         model = agg_hhc_service_professionals
#         fields = [
#             'srv_prof_id', 'professional_code', 'prof_fullname', 'srv_id', 'phone_no', 
#             'alt_phone_no', 'role', 'status', 'dob', 'doj', 'doe', 'google_home_location'
#         ]

class Our_EMPLOYEE_List_serializer(serializers.ModelSerializer):
    Job_type = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()      
    class Meta:
        model = agg_hhc_service_professionals
        fields = [
            # 'srv_prof_id', 'prof_fullname', 'srv_id', 'phone_no', 
            # 'alt_phone_no', 'role', 'Job_type'
            'srv_prof_id', 'professional_code', 'prof_fullname', 'srv_id', 'phone_no', 
            'alt_phone_no', 'role', 'Job_type', 'status', 'dob', 'doj', 'doe', 'google_home_location'            
        ]
    def get_Job_type(self, obj):
        job_type_mapping = {
            1: 'On Call',
            2: 'Full Time',
            3: 'Part Time'
        }
        return job_type_mapping.get(obj.Job_type, '')

    def get_role(self, obj):
        role_mapping = {
            1: 'Professional',
            2: 'Vendor'
        }
        return role_mapping.get(obj.role, '')    



class Our_EMPLOYEE_Active_Inactive_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_service_professionals
        fields = [
            'srv_prof_id', 'srv_id', 'status', 'doj', 'doe', 'last_modified_by']

class EX_professional_Records_keeping(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_EX_professional_Records
        fields = ['srv_prof_id', 'Remark', 'Join_Date', 'Black_list', 'Exit_Date', 'added_by', 'last_modified_by']



#  -------------------------------------- Onboarding - SELECTED CANDIDATES - DOCUMENT VERIFICATION ---------------------------------------------------
class Get_Document_list_names_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_documents_list
        fields = ['doc_li_id', 'Documents_name']


# ---------------------------------------- Onboarding - SELECTED CANDIDATES - DOCUMENT VERIFICATION Uploded -------------------------------------------

class post_documtnet_serializer(serializers.ModelSerializer):
    class Meta:
        model  = agg_hhc_professional_documents
        fields=['srv_prof_id', 'doc_li_id', 'professional_document', 'rejection_reason', 'status', 'isVerified','added_by', 'last_modified_by']





class check_file_API(serializers.ModelSerializer):
    professional_document = serializers.SerializerMethodField()
    status_name = serializers.SerializerMethodField()
    isVerified_name = serializers.SerializerMethodField()
    doc_li_id_name = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_professional_documents
        fields = ['prof_doc_id', 'srv_prof_id', 'doc_li_id', 'doc_li_id_name', 'professional_document', 'rejection_reason', 'status', 'status_name', 'isVerified', 'isVerified_name']


    def get_doc_li_id_name(self, obj):
        try:
            return obj.doc_li_id.Documents_name
        except:
            return None
        
    def get_status_name(self, obj):
        status_mapping = {
            1: 'Verified',
            2: 'Need More Details',
            3: 'Rejected',
            4: 'In Progress'
        }
        return status_mapping.get(obj.status, '') 
    

    def get_isVerified_name(self, obj):
        isVerified_mapping = {
            1: 'True',
            2: 'False'
        }
        return isVerified_mapping.get(obj.isVerified, '') 
    

    # def get_professional_document(self, obj):
    #     request = self.context.get('request')
    #     if request:
    #         sign_url = request.build_absolute_uri(obj.professional_document.url)
    #         logger.info(f"Generated sign URL: {sign_url}")
    #         return sign_url
    #     logger.info(f"Relative sign URL: {obj.professional_document.url}")
    #     return obj.professional_document.url

    def get_professional_document(self, obj):
        request = self.context.get('request')
        if obj.professional_document:
            if request:
                # This ensures that the URL is fully qualified, including the domain and protocol.
                return request.build_absolute_uri(obj.professional_document.url)
            # In case request context is not available, return the relative URL
            return obj.professional_document.url
        return None 





import logging

logger = logging.getLogger(__name__)






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
        fields=['srv_prof_int_id', 'int_round', 'int_mode', 'int_schedule_with', 'int_schedule_date', 'int_schedule_time', 'srv_prof_id', 'int_status']


	 
	 
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


class InterviewScheduleProfStatusSerializer(serializers.ModelSerializer):
    status_name = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_prof_interview_details
        fields = ['srv_prof_int_id', 'srv_prof_id', 'int_status', 'status_name', 'last_modified_by']

    def get_status_name(self, obj):
        status_mapping = {
            1: 'Select',
            2: 'Reject',
            3: 'OnHold',
            4: 'Pending',
            5: 'Shortlisted'

        }
        return status_mapping.get(obj.int_status, '')




class EX_professional_Records_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_EX_professional_Records
        fields = ['srv_prof_id', 'Remark', 'Join_Date', 'Exit_Date', 'Black_list'], 

class Professionals_Not_Qualified_for_Interview_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_Records_of_Professionals_Not_Qualified_for_Interview
        fields = ['srv_prof_id', 'Remark', 'last_modified_by']



class SelectedCandidatesIndTraiIDSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_service_professionals
        fields = ['srv_prof_id', 'induction', 'training', 'id_card', 'last_modified_by'] 


# ___________________________________ External Professional LIST API Get Amit _______________________


class Exte_Prof_get_Prof_service11_serializers(serializers.ModelSerializer):
    
    sub_srv_name = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_professional_sub_services
        fields = ['prof_sub_srv_id', 'srv_prof_id', 'sub_srv_id', 'sub_srv_name', 'prof_cost' ]

    def get_sub_srv_name(self, obj):
        try:
            return obj.sub_srv_id.recommomded_service
        except AttributeError:
            return None 

class exter_prof_Aproved_Rejected_status(serializers.ModelSerializer):
    approve_reject_name = serializers.SerializerMethodField()
    class Meta:
        model = external_prof_approve_reject
        fields = [ 'extr_pro_ap_re', 'srv_prof_id', 'Remark', 'approve_reject', 'approve_reject_name']

    def get_approve_reject_name(self, obj):
        status_mapping = {
            1: 'Approved',
            2: 'Rejected',

        }
        return status_mapping.get(obj.approve_reject, '')       


class External_Prof_List_Get_Serializer_API(serializers.ModelSerializer):
    sub_srv_name = serializers.SerializerMethodField()
    prof_compny = serializers.SerializerMethodField()
    
    prof_service_details = Exte_Prof_get_Prof_service11_serializers(
        source='agg_hhc_professional_sub_services_set', many=True
    )        

    prof_service_Aproved_Rejected = exter_prof_Aproved_Rejected_status(
        source='external_prof_approve_reject_set', many=True
    ) 
    class Meta:
        model = agg_hhc_service_professionals
        fields = ['srv_prof_id', 'role', 'Job_type', 'prof_fullname', 'phone_no', 'email_id', 'srv_id', 'prof_sub_srv_id', 'prof_service_details', 'prof_service_Aproved_Rejected', 'sub_srv_name', 'prof_compny']

    def get_sub_srv_name(self, obj):
        try:
            return obj.prof_sub_srv_id.recommomded_service
        except AttributeError:
            return None

    def get_prof_compny(self, obj):
        try:
            return obj.prof_compny.company_name
        except AttributeError:
            return None          
                

# ___________________________________ External Professional LIST API Get Amit _______________________
   
# ___________________________________ External_Professional Prof get API ________________________________
class External_Professional_get_sub_service_serializers(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_sub_services
        fields = ['srv_id', 'sub_srv_id', 'recommomded_service']

class Exte_Prof_get_Prof_service_serializers(serializers.ModelSerializer):
    
    sub_srv_name = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_professional_sub_services
        fields = ['prof_sub_srv_id', 'srv_prof_id', 'sub_srv_id', 'sub_srv_name', 'prof_cost' ]

    def get_sub_srv_name(self, obj):
        try:
            return obj.sub_srv_id.recommomded_service
        except AttributeError:
            return None   

from django.conf import settings


class Exte_Prof_get_Prof_interview_details_serializer(serializers.ModelSerializer):
    qualification_name = serializers.SerializerMethodField()
    specialization_name = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_service_professional_details
        fields = ['srv_prof_id', 'qualification', 'specialization', 'qualification_name', 'specialization_name', 'prof_CV', 'availability_for_interview', 'skill_set', 'work_experience']

    def get_qualification_name(self, obj):
        try:
            return obj.qualification.qualification if obj.qualification else None
        except AttributeError:
            return None 
    def get_specialization_name(self, obj):
        try:
            return obj.specialization.specialization if obj.specialization else None
        except AttributeError:
            return None         


    # def get_sign(self, obj):
        # request = self.context.get('request')
        # print(obj.prof_CV)
        # if request:
        #     prof_CV = request.build_absolute_uri(obj.prof_CV.url)
        #     logger.info(f"Generated prof_CV URL: {prof_CV}")
        #     return prof_CV
        # logger.info(f"Relative prof_CV URL: {obj.prof_CV.url}")
        # return obj.prof_CV.url if obj.prof_CV else None
    def to_representation(self, instance):        
        representation = super().to_representation(instance)
        request = self.context.get('request')
        if request and instance.prof_CV:
            representation['prof_CV'] = request.build_absolute_uri(instance.prof_CV.url)
        return representation      

class ExternalProfDocumentSerializer(serializers.ModelSerializer):
    doc_li_id = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_professional_documents
        fields = ['srv_prof_id', 'doc_li_id', 'professional_document', 'rejection_reason', 'status', 'isVerified']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')
        if request and instance.professional_document:
            representation['professional_document'] = request.build_absolute_uri(instance.professional_document.url)
        return representation
    
    def get_doc_li_id(self, obj):
        try:
            return obj.doc_li_id.Documents_name
        except AttributeError:
            return None    
        
class exter_prof_zone_locations_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_professional_location
        fields = ['srv_prof_id', 'location_name']



class Exter_Prof_Action_Get_Serializer(serializers.ModelSerializer):
    prof_compny = serializers.SerializerMethodField()
    sub_serv_name = serializers.SerializerMethodField()
    quelification = serializers.SerializerMethodField()
    specialization = serializers.SerializerMethodField()
    availability_for_interview = serializers.SerializerMethodField()
    Job_type = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    prof_service_details = Exte_Prof_get_Prof_service_serializers(
        source='agg_hhc_professional_sub_services_set', many=True
    )    
    exter_prof_Interview = Exte_Prof_get_Prof_interview_details_serializer(
        source='agg_hhc_service_professional_details_set', many=True
    )
    exter_prof_document = ExternalProfDocumentSerializer(
        source='agg_hhc_professional_documents_set', many=True, required=False
    ) 
    exter_prof_zone_location = exter_prof_zone_locations_serializer(
        source = 'agg_hhc_professional_location_set', many = True
    )

    class Meta:
        model = agg_hhc_service_professionals
        fields = ['srv_prof_id', 'role', 'Job_type', 'prof_fullname', 'phone_no', 'cv_file', 'email_id', 'dob', 'address', 'srv_id', 'prof_sub_srv_id', 'sub_serv_name', 'prof_compny', 'quelification', 'specialization', 'availability_for_interview', 'prof_service_details', 'exter_prof_Interview', 'exter_prof_document', 'prof_zone_id', 'exter_prof_zone_location', 'certificate_registration_no', 'status']
        # fields = ['srv_prof_id', 'role', 'Job_type', 'prof_fullname', 'phone_no', 'email_id', 'dob', 'address', 'srv_id']



    def get_Job_type(self, obj):
        status_mapping = {
            1: 'On call',
            2: 'Full Time',
            3: 'Part Time'

        }
        return status_mapping.get(obj.Job_type, '') 
    

    def get_prof_compny(self, obj):
        try:
            return obj.prof_compny.company_name
        except AttributeError:
            return None  

    def get_sub_serv_name(self, obj):
        try:
            return obj.prof_sub_srv_id.recommomded_service
        except AttributeError:
            return None
        
    def get_status(self,obj):
        try:
            hr_status1 = agg_hhc_prof_interview_details.objects.filter(srv_prof_id=obj.srv_prof_id, status=1).last()

            if hr_status1 and hr_status1.hr_status:
                return hr_status1.hr_status
            else:
                return None
        except Exception:
            return "Error fetching HR_status"            
        
    def get_quelification(self, obj):
        try:
            professional_detail = agg_hhc_service_professional_details.objects.filter(srv_prof_id=obj.srv_prof_id, status=1).last()

            if professional_detail and professional_detail.qualification:
                return professional_detail.qualification.qualification
            else:
                return None
                
        except Exception:
            return "Error fetching qualification"
        
    def get_specialization(self, obj):  
        try:
            professional_detail = agg_hhc_service_professional_details.objects.filter(srv_prof_id=obj.srv_prof_id, status=1).last()

            if professional_detail and professional_detail.specialization:
                return professional_detail.specialization.specialization
            else:
                return None
                
        except Exception:
            return "Error fetching specialization"
        
    def get_availability_for_interview(self, obj):
        try:
            professional_details = agg_hhc_service_professional_details.objects.filter(srv_prof_id=obj.srv_prof_id, status=1)
            return [
                {"availability_date": detail.availability_for_interview.date().strftime("%Y-%m-%d")} 
                for detail in professional_details if detail.availability_for_interview
            ]
        except Exception:
            return [{"availability_date": "Error fetching interview availabilities"}]


# ___________________________________ External_Professional Prof get API ________________________________
# ___________________________________ External Professional Ongoing Service API ________________________________
from django.db.models import Sum
class Ongoing_Eve_serializer(serializers.ModelSerializer):
    agg_sp_pt_id=serializers.SerializerMethodField()
    service=serializers.SerializerMethodField()
    payment=serializers.SerializerMethodField()
    job_closure=serializers.SerializerMethodField()
    class Meta:
        model=agg_hhc_events
        fields = ['eve_id', 'event_code', 'agg_sp_pt_id', 'service', 'payment','discount_type', 'job_closure', 'added_by']

    def get_service(self, obj):
        plan_of_care = agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.eve_id,status=1).values('eve_poc_id','sub_srv_id','sub_srv_id__recommomded_service','srv_id','srv_id__service_title','start_date','end_date','start_time','end_time').last()
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
                # "Compny_id": str(plan_of_care['srv_prof_id'])
            }
            return data
        else: return None
    
    def get_payment(self, obj):
        final_amount = obj.final_amount
        # paid=models.agg_hhc_payment_details.objects.filter(eve_id=obj.eve_id,overall_status='SUCCESS', status=1).values('amount_paid').aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0
        ammt = agg_hhc_payment_details.objects.filter(eve_id=obj.eve_id,overall_status='SUCCESS', status=1)
        paid = ammt.values('amount_paid').aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0
        # dt = []
        # for i in ammt:
        #     print(i.payment_status.value,"ammtammtammtammtammt")
        #     dt.append(i.payment_status.value)
        ammt_dtl = ammt.order_by('date')
        last_payment = ammt.last()

        # payment_status = last_payment.payment_status.value if last_payment else None
        if obj.discount_type == 3:
            payment_status = 100
        else:
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
        detail_eve = agg_hhc_detailed_event_plan_of_care.objects.exclude(srv_prof_id__prof_compny = 1).filter(eve_id=obj.eve_id, status=1).order_by('actual_StartDate_Time')
        total_session = detail_eve.count()
        job_closure_count = sum(1 for i in detail_eve if i.Session_jobclosure_status == 1)
        today = timezone.now().date()

        if detail_eve:
            if detail_eve[0].actual_StartDate_Time < today:
                prof_data = detail_eve[0].srv_prof_id
            elif detail_eve[0].actual_StartDate_Time > today:
                prof_data = detail_eve.last().srv_prof_id
            else:
                prof_data = detail_eve.filter(actual_StartDate_Time=today).last().srv_prof_id

            if prof_data:
                prof = prof_data.prof_fullname
                prof_id = prof_data.srv_prof_id
                company = prof_data.prof_compny
                pro_compny = {
                "id": company.company_pk_id if company else None,
                "name": company.company_name if company else None,
                # "address": company.address if company else None,
                }
            else:
                prof = ""
                prof_id = None

                pro_compny = ""

            data = {
                "srv_prof_id": prof_id,
                "service_professional": prof,
                "Compny_name": pro_compny,
                "total_session": total_session,
                "job_closure_count": job_closure_count,
                "job_closure_pending": total_session - job_closure_count,
                
            }
            return data
        else:
            return 'no_data_available_for this event'


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

# ___________________________________ External Professional Ongoing Service API ________________________________




# ___________________________________ Manage Professionals LIST API Get _______________________


class Manage_Prof_List_Get_Serializer_API(serializers.ModelSerializer):
    # sub_srv_name = serializers.SerializerMethodField()
    status_name = serializers.SerializerMethodField()
    HR_status_remark = serializers.SerializerMethodField()
    # notification = serializers.SerializerMethodField()
    
    class Meta:
        model = agg_hhc_service_professionals
        fields = ['srv_prof_id', 'Job_type', 'prof_compny', 'prof_fullname', 'phone_no', 'email_id', 'srv_id', 'status', 'status_name', 'HR_status_remark']


    # def get_notification(self, obj):
    #     # Count records based on hr_status values
    #     approved_count = agg_hhc_prof_interview_details.objects.filter(
    #         srv_prof_id=obj.srv_prof_id, hr_status=1
    #     ).count()


    #     if approved_count:
    #             return {

    #                 "Approved_Count": approved_count,

    #             }

    #         # Return counts with default values if no latest interview exists
    #     return {
    #         "Approved_Count": approved_count,

    #     }



    def get_status_name(self, obj):
        role_mapping = {
            1: 'Active',
            2: 'Inactive',
            3: 'Delete',
        }
        return role_mapping.get(obj.status, '')
    
    def get_HR_status_remark(self, obj):
        latest_interview = agg_hhc_prof_interview_details.objects.filter(
            srv_prof_id=obj.srv_prof_id
        ).order_by('srv_prof_int_id').last()

        if latest_interview:
            return {
                "hr_status": latest_interview.hr_status,
                "int_round_Remark": latest_interview.int_round_Remark,
            }
        return {
            "hr_status": None,
            "int_round_Remark": None,
        }
    

    # def get_prof_compny(self, obj):
    #     try:
    #         return obj.prof_compny.company_name
    #     except AttributeError:
    #         return None   
# ___________________________________ Manage Professionals LIST API Get _______________________
# ___________________________________ Professional Interview Round ___________________________

class Prof_interview_round_serializers(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_prof_interview_details
        fields = ['srv_prof_id', 'int_round', 'int_mode', 'int_schedule_with', 'int_schedule_date', 'int_status', 'int_round_Remark', 'Schedule_Selected', 'added_by', 'last_modified_by']




# ___________________________________ Professional Interview Round ___________________________
    

# ___________________________________ External Added New Professionals Active/Inactive Delete API _____________________
class ExProfessionalRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_EX_professional_Records
        fields = ['srv_prof_id', 'Remark', 'status', 'added_by', 'last_modified_by']


class External_clg_prof_Active_inactive_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_com_colleague
        fields = [ 'clg_ref_id', 'is_active', 'last_modified_by' ]
class External_prof_Active_Inactive_serializer(serializers.ModelSerializer):
    clg_details = External_clg_prof_Active_inactive_serializer(source='clg_ref_id', read_only=True)
        
    class Meta:
        model = agg_hhc_service_professionals
        fields = ['srv_prof_id', 'status', 'last_modified_by', 'clg_ref_id', 'clg_details']


# ___________________________________ External Added New Professionals Active/Inactive Delete API _____________________






# __________________________________ Closure Revalidate Amit ______________________________________________________
import requests

from datetime import timedelta

class Closure_Revalidate_serializer(serializers.ModelSerializer):
    agg_sp_pt_id=serializers.SerializerMethodField()
    service=serializers.SerializerMethodField()
    payment=serializers.SerializerMethodField()
    job_closure=serializers.SerializerMethodField()
    class Meta:
        model=agg_hhc_events
        fields = ['eve_id', 'event_code', 'agg_sp_pt_id', 'service', 'payment','discount_type', 'job_closure', 'added_by']

    def get_service(self, obj):
        plan_of_care = agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.eve_id,status=1).values('eve_poc_id','sub_srv_id','sub_srv_id__recommomded_service','srv_id','srv_id__service_title','start_date','end_date','start_time','end_time').last()
        if plan_of_care:
            data={
                "eve_poc_id": plan_of_care.get('eve_poc_id'),
                "sub_service_id": plan_of_care.get('sub_srv_id'),
                "sub_service_start_time": str(plan_of_care.get('start_time')) if plan_of_care.get('start_time') else None,
                "sub_service_end_time": str(plan_of_care.get('end_time')) if plan_of_care.get('end_time') else None,
                "sub_service": plan_of_care.get('sub_srv_id__recommomded_service'),
                "service_id": plan_of_care.get('srv_id'),
                "service": plan_of_care.get('srv_id__service_title'),
                "start_date": str(plan_of_care.get('start_date')) if plan_of_care.get('start_date') else None,
                "end_date": str(plan_of_care.get('end_date')) if plan_of_care.get('end_date') else None,
            }
            return data
        else: return None
    
    def get_payment(self, obj):
        final_amount = obj.final_amount
        # paid=agg_hhc_payment_details.objects.filter(eve_id=obj.eve_id,overall_status='SUCCESS', status=1).values('amount_paid').aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0
        ammt = agg_hhc_payment_details.objects.filter(eve_id=obj.eve_id,overall_status='SUCCESS', status=1)
        paid = ammt.values('amount_paid').aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0
        # dt = []
        # for i in ammt:
        #     print(i.payment_status.value,"ammtammtammtammtammt")
        #     dt.append(i.payment_status.value)
        ammt_dtl = ammt.order_by('date')
        last_payment = ammt.last()

        # payment_status = last_payment.payment_status.value if last_payment else None
        if obj.discount_type == 3:
            payment_status = 100
        else:
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
        detail_eve = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id, status=1).order_by('actual_StartDate_Time')
        total_session = detail_eve.count()
        job_closure_count = sum(1 for i in detail_eve if i.Session_jobclosure_status == 1)
        today = timezone.now().date()

        if detail_eve:
            if detail_eve[0].actual_StartDate_Time < today:
                prof_data = detail_eve[0].srv_prof_id
            elif detail_eve[0].actual_StartDate_Time > today:
                prof_data = detail_eve.last().srv_prof_id
            else:
                prof_data = detail_eve.get(actual_StartDate_Time=today).srv_prof_id

            # Ensure prof_data is not None before accessing its attributes
            if prof_data:
                prof = prof_data.prof_fullname
                prof_id = prof_data.srv_prof_id
            else:
                prof = None
                prof_id = None

            data = {
                "srv_prof_id": prof_id,
                "service_professional": prof,
                "total_session": total_session,
                "job_closure_count": job_closure_count,
                "job_closure_pending": total_session - job_closure_count
            }
            return data
        else:
            return "no_data_available_for this event"



    def get_agg_sp_pt_id(self, obj):
        patient=obj.agg_sp_pt_id
        caller=obj.caller_id
        data={
            "patient_id": patient.agg_sp_pt_id if patient else None,
            "name": patient.name if patient else None,
            "phone": patient.phone_no if patient else None,
            "caller_phone": caller.phone if caller else None,
            "patient_email_id": patient.patient_email_id if patient else None,
            "zone_id": patient.prof_zone_id.prof_zone_id if patient and hasattr(patient.prof_zone_id, 'prof_zone_id') else None,
            "zone": patient.prof_zone_id.Name if patient and hasattr(patient.prof_zone_id, 'Name') else None,
        }
        return data


class Event_Plan_of_Care_Staus(serializers.ModelSerializer):

    class Meta:
        model = agg_hhc_event_plan_of_care
        fields = ['start_date','status','serivce_dates']


class Detail_Event_Plan_of_Care_Staus(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_detailed_event_plan_of_care
        fields = ['status']


class Event_Staus(serializers.ModelSerializer):
    Total_session = serializers.SerializerMethodField()
    per_session_cost = serializers.SerializerMethodField()
    completed_session_amt = serializers.SerializerMethodField()
    refund_amt = serializers.SerializerMethodField()
    
    class Meta:
        model = agg_hhc_events
        fields = ['eve_id','Total_cost','status','Total_session','per_session_cost','completed_session_amt','refund_amt']
       

    def get_Total_session(self, obj):
        queryset = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id,status=1)
        return queryset.count()

    def get_per_session_cost(self, obj):
        Total_cost = obj.Total_cost  
        Total_session = self.get_Total_session(obj) 
        return int(Total_cost / Total_session) if Total_session > 0 else 0
    
    def get_completed_session_amt(self, obj):
        queryset = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id, Session_status=2,status=1)
      
        completed_session = queryset.count()
        per_session = self.get_per_session_cost(obj)
        return int(per_session * completed_session)
    
    def get_refund_amt(self,obj):
        current_date = timezone.now().date() 
        previous_24_hours = timezone.now() - timedelta(hours=24)
        previous_48_hours = timezone.now() - timedelta(hours=48)
        previous_24_hours_date = previous_24_hours.date()
        previous_48_hours_date = previous_48_hours.date()

        refaund_amt = 0
        cancelation_charge = cancelation_charges.objects.filter(status=1)
        print(cancelation_charge.latest('added_date'),';ll;l;l;ll;')
        cancelation_charge = cancelation_charges.objects.filter(status=1).latest('added_date')
        srv_start_date = agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.eve_id,status=1)
        for srv_start_dates in srv_start_date:
        
            print(cancelation_charge,'cancelation_charge')
            if srv_start_dates.start_date <= current_date:
                refaund_amt = cancelation_charge.charges
            elif srv_start_dates.start_date >= previous_24_hours_date:
                refaund_amt = cancelation_charge.charges
            elif srv_start_dates.start_date >= previous_48_hours_date:
                refaund_amt = 0
            
        print(refaund_amt, ';;;;;;;;;;;;;;;;;;')
        return int(refaund_amt)
    
class post_in_session_cancellation_history(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_cancellation_history
        fields = ['event_id','agg_sp_dt_eve_poc_id','cancellation_by','can_amt', 'convineance_chrg', 'remark', 'reason', 'last_modified_by']



class ServiceCancellationSerializer(serializers.ModelSerializer):
    DetaileventStaus = Detail_Event_Plan_of_Care_Staus(source='event_id',read_only=True)
    eventPlanStaus = Event_Plan_of_Care_Staus(source='event_id',read_only=True)
    eventStaus = Event_Staus(source='event_id',read_only=True)
 
    class Meta:
        model = agg_hhc_cancellation_history
        fields = ['canc_his_id','event_id','cancellation_by','reason','remark','DetaileventStaus','eventPlanStaus','eventStaus', 'last_modified_by']

    
    def finds(self, pros, eve_id,event_poc_queryset):
            tokn=[j.token for j in DeviceToken.objects.filter(clg_id__in=agg_com_colleague.objects.filter(clg_ref_id__in=[pro.clg_ref_id for pro in pros]), is_login=True)]
          
            body=f'Patient: {eve_id.agg_sp_pt_id.name}\nService: {event_poc_queryset.sub_srv_id.recommomded_service}\nStart DateTime:\n {event_poc_queryset.start_date} {event_poc_queryset.start_time}\nEnd DateTime:\n {event_poc_queryset.end_date} {event_poc_queryset.end_time}'
            notification={ 'title': 'Approved request for service cancellation.', 'body': body }
            for tk in tokn:    
                response = (requests.post('https://fcm.googleapis.com/fcm/send', json={'to': tk,'notification': notification}, headers={'Authorization': f'key={SERVER_KEY}', 'Content-Type': 'application/json'})).json()


    def create(self, validated_data):
        print(validated_data,"validated_data")
        event = validated_data.get('event_id')
        prof = validated_data.get('srv_prof_id')
        patient = validated_data.get('agg_sp_pt_id')
        if prof:
            print('1')
            if event:
                print('2')
                try:
                    print('3')
                    detail_event_poc=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=event,status=1)
                    prof_eve=detail_event_poc.filter(srv_prof_id=prof)
                    if detail_event_poc.count()==prof_eve.count():
                        print('4')
                        event_poc=agg_hhc_event_plan_of_care.objects.filter(eve_id=event,status=1)
                        event_model=agg_hhc_events.objects.filter(eve_id=event.eve_id,status=1)
                        # pro=set([i.srv_prof_id for i in detail_event_poc])
                        pro=prof
                        for detail_event_poc_queryset in detail_event_poc:
                            print(';')
                            detail_event_poc_queryset.status= status_enum.Inactive.value
                            detail_event_poc_queryset.is_cancelled = 1
                            detail_event_poc_queryset.save()
                        d=''
                        for event_poc_queryset in event_poc:
                            print(';;')
                            event_poc_queryset.status= status_enum.Inactive.value
                            d=event_poc_queryset
                            event_poc_queryset.save()
                        
                        for event_queryset in event_model:
                            print(';;;')
                            event_queryset.status= status_enum.Inactive.value
                            event_queryset.srv_cancelled= 1
                            event_queryset.save()
                        self.finds(pro,event,event_poc_queryset)

                    else:
                        print('5')
                        event_poc=agg_hhc_event_plan_of_care.objects.filter(eve_id=event,status=1)
                        event_model=agg_hhc_events.objects.filter(eve_id=event.eve_id,status=1)
                        # pro=set([i.srv_prof_id for i in detail_event_poc])
                        print('6')
                        pro=prof
                        for detail_event_poc_queryset in prof_eve:
                            print('7')
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
                            print('8')
                            serialized2_data.save()
                        print('9')
                        
                        for event_poc_queryset in event_poc:
                            print('10')
                            # event_poc_queryset.status= status_enum.Inactive.value
                            f_eve=sorted(detail_event_poc.exclude(prof_eve), key='actual_StartDate_Time')
                            if f_eve:
                                print('11')
                                event_poc_queryset.start_date=f_eve[0].actual_StartDate_Time
                                event_poc_queryset.end_date=f_eve[-1].actual_StartDate_Time
                                event_poc_queryset.save()
                                print(';;;')

                        for i in detail_event_poc:
                            print('{"}')
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
                except agg_hhc_detailed_event_plan_of_care.DoesNotExist:
                    # print("this is not available")
                    pass  
            cancellation_history = agg_hhc_cancellation_history.objects.create(**validated_data)
            return cancellation_history
        else:
            if event:
                try:

                    detail_event_poc=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=event,status=1)
                    event_poc=agg_hhc_event_plan_of_care.objects.filter(eve_id=event,status=1)
                    event_model=agg_hhc_events.objects.filter(eve_id=event.eve_id,status=1)
                    pro=set([i.srv_prof_id for i in detail_event_poc])
                    for detail_event_poc_queryset in detail_event_poc:
                        detail_event_poc_queryset.status= status_enum.Inactive.value
                        detail_event_poc_queryset.is_cancelled = 1
                        detail_event_poc_queryset.save()
                    d=[]
                    print(event_poc,'event_poc')
                    print(detail_event_poc,'detail_event_poc')
                    print(event_model,'event_model')
                    for event_poc_queryset in event_poc:
                        event_poc_queryset.status= status_enum.Inactive.value
                        d=event_poc_queryset
                        event_poc_queryset.save()
                    
                    for event_queryset in event_model:
                        event_queryset.status= status_enum.Inactive.value
                        event_queryset.srv_cancelled= 1
                        event_queryset.save()
                    self.finds(pro,event,d)
                    # print('5')
                except agg_hhc_detailed_event_plan_of_care.DoesNotExist:
                    # print("this is not available")
                    pass  
            cancellation_history = agg_hhc_cancellation_history.objects.create(**validated_data)
            return cancellation_history




class get_dtl_epoc_data_for_canc_session(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_detailed_event_plan_of_care
        fields = ['eve_id', 'srv_prof_id','actual_StartDate_Time','start_time','service_cost']

class post_in_cancellation_history(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_cancellation_history
        fields = ['event_id','agg_sp_dt_eve_poc_id','cancellation_by','can_amt', 'convineance_chrg', 'remark', 'reason', 'last_modified_by']


class agg_hhc_session_job_closure_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['jcolse_id','srv_prof_id','dtl_eve_id','prof_sub_srv_id','Baseline','Airway','Breathing','Circulation','Skin_Perfusion','Wound','Oozing','Discharge','Inj_site_IM','Procedure','Size_catheter','Size_RT','Temp_core','TBSL','Pulse','SpO2','RR','GCS_Total','BP','diastolic','Remark','Name_injection_fld','Dose_freq','Num_Sutures_staples','Dressing_status','Catheter_type','Sutures_type','Wound_dehiscence','Strength_exer','is_patient_death','Stretch_exer','Walk_indep','Walker_stick','Movin_or_moveout','Mobin_or_moveout_datetime_remark','Getin_or_getout','Getin_or_getout_datetime_remark','ChairTobed_or_bedTochair','ChairTobed_or_bedTochair_datetime_remark','Situp_onbed','Situp_onbed_datetime_remark','Unocp_or_ocp_bed','Unocp_or_ocp_bed_datetime_remark','Showershampoo','Showershampoo_datetime_remark','Incontinent_care','Incontinent_care_datetime_remark','Mouth_care','Mouth_care_datetime_remark','Shaving','Shaving_datetime_remark','Hand_care','Hand_care_datetime_remark','Foot_care','Foot_care_datetime_remark','Vital_care','vital_care_datetime_remark','motion_care','motion_care_datetime_remark','Grooming','Grooming_datetime_remark','Bed_bath','Bed_bath_datetime_remark','Feeding','Feeding_datetime_remark','Reposition_patient','Reposition_patient_datetime_remark','Bed_pan','Bed_pan_datetime_remark','added_by_type','status','last_modified_by']


    def validate(self, data):
        return data




class preffered_proffesional(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_doctors_consultants
        fields = ['doct_cons_id','cons_fullname','mobile_no']

class patient_get_zone_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_professional_zone
        fields = ['prof_zone_id', 'Name']

class agg_hhc_state(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_state
        fields = ['state_id','state_name']

class agg_hhc_city(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_city
        fields = ['city_id','city_name']

class hospital_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_hospitals
        fields = ['hosp_id', 'hospital_name']


class patient_detail_serializer(serializers.ModelSerializer):
    preferred_hosp_id=hospital_serializer()
    doct_cons_id=preffered_proffesional()
    prof_zone_id=patient_get_zone_serializer()
    state_id = agg_hhc_state()
    city_id = agg_hhc_city()
    gender_name = serializers.SerializerMethodField() 
    class Meta:
        model = agg_hhc_patients
        fields = ['agg_sp_pt_id','name', 'gender_id','gender_name', 'Suffered_from', 'preferred_hosp_id', 'phone_no', 'patient_email_id','doct_cons_id','Age', 'state_id' ,'city_id' ,'address' ,'google_address','pincode' ,'prof_zone_id']
    
    def get_gender_name(self, obj):
        return obj.gender_id.name if obj.gender_id else None


class agg_hhc_callers_seralizer(serializers.ModelSerializer):
    gender_name = serializers.SerializerMethodField()
    class Meta:
        model=agg_hhc_callers
        fields=['caller_id','clg_ref_id','phone','otp','otp_expire_time','caller_fullname','purp_call_id','Age','gender','gender_name','email','alter_contact','Address','city','locality','state','pincode','emp_id','profile_pic','status','service_taken','last_modified_by']

    def get_gender_name(self, obj):
        return obj.gender.name if obj.gender else None
    

class all_dtl_evnts_closure_Revalidate_serializer(serializers.ModelSerializer):
    class Meta:
        model  = agg_hhc_detailed_event_plan_of_care
        fields = ['agg_sp_dt_eve_poc_id','eve_poc_id','eve_id','index_of_Session','srv_prof_id_id','actual_StartDate_Time','actual_EndDate_Time','start_time','end_time','service_cost','amount_received','emp_id','Session_status','Session_jobclosure_status','session_note','Reason_for_no_serivce','Comment_for_no_serivce','OTP','OTP_count','otp_expire_time','Reschedule_status','is_convinance','convinance_charges','is_cancelled','remark','status','last_modified_from','last_modified_by', 'prof_session_start_date', 'prof_session_end_date', 'prof_session_start_time', 'prof_session_end_time']
        # fields = '__all__'
        # fields = ['agg_sp_dt_eve_poc_id', 'eve_poc_id', 'eve_id', 'srv_prof_id', 'actual_StartDate_Time', 'actual_EndDate_Time', 'remark']




class jc_qustions_serializerM(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_job_closure_questions
        fields = ['jcq_id','jcq_question_mar','srv_id','que_shrt_name','date_time_remark_q_wise_name']

class get_selected_job_Closure_Revalidate_que_serializerM(serializers.ModelSerializer):
    jcq_id = jc_qustions_serializerM()
    class Meta:
        model = agg_hhc_events_wise_jc_question
        fields = ['eve_jcq_id','eve_id','srv_id','jcq_id','is_srv_enq_q']


class jc_qustions_serializerH(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_job_closure_questions
        fields = ['jcq_id','jcq_question_hindi','srv_id','que_shrt_name','date_time_remark_q_wise_name']

class get_selected_job_Closure_Revalidate_que_serializerH(serializers.ModelSerializer):
    jcq_id = jc_qustions_serializerH()
    class Meta:
        model = agg_hhc_events_wise_jc_question
        fields = ['eve_jcq_id','eve_id','srv_id','jcq_id','is_srv_enq_q']


class jc_qustions_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_job_closure_questions
        fields = ['jcq_id','jcq_question','srv_id','que_shrt_name','date_time_remark_q_wise_name']

class get_selected_job_Closure_Revalidate_que_serializer(serializers.ModelSerializer):
    jcq_id = jc_qustions_serializer()
    class Meta:
        model = agg_hhc_events_wise_jc_question
        fields = ['eve_jcq_id','eve_id','srv_id','jcq_id','is_srv_enq_q']


class agg_hhc_sub_services_jc_form_Closure_Revalidate_serializer(serializers.ModelSerializer): 
    class Meta:
        model = agg_hhc_jobclosure_form_numbering
        fields = ['jc_form_id','prof_sub_srv_id','form_number','status']

    def validate(self, data):
        return data





class agg_hhc_session_job_closure_serializer_form_1(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id','Baseline','Airway', 'Breathing', 'Circulation', 'Temp_core','TBSL','Pulse','SpO2','RR','GCS_Total','BP','diastolic','Skin_Perfusion','Remark','diastolic','is_patient_death', 'last_modified_by', 'closure_revalidate', 'closure_revalidate_remark']

    def validate(self, data):
        return data

# class agg_hhc_session_job_closure_serializer_form_2(serializers.ModelSerializer):
#     class Meta:
#         model = models.agg_hhc_jobclosure_detail
#         fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id', 'Movin_or_moveout', 'Getin_or_getout', 'ChairTobed_or_bedTochair', 'Situp_onbed','Unocp_or_ocp_bed','Showershampoo','Incontinent_care','Mouth_care','Shaving','Hand_care','Foot_care','Vital_care', 'motion_care', 'Grooming', 'Bed_bath', 'Feeding', 'Reposition_patient', 'Bed_pan', 'last_modified_by']

#     def validate(self, data):
#         return data yes_no_enum


class agg_hhc_session_job_closure_serializer_form_2(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id', 'Movin_or_moveout','Mobin_or_moveout_datetime_remark', 'Getin_or_getout','Getin_or_getout_datetime_remark', 'ChairTobed_or_bedTochair','ChairTobed_or_bedTochair_datetime_remark', 'Situp_onbed','Situp_onbed_datetime_remark','Unocp_or_ocp_bed','Unocp_or_ocp_bed_datetime_remark','Showershampoo','Showershampoo_datetime_remark','Incontinent_care','Incontinent_care_datetime_remark','Mouth_care','Mouth_care_datetime_remark','Shaving','Shaving_datetime_remark','Hand_care','Hand_care_datetime_remark','Foot_care','Foot_care_datetime_remark','Vital_care','vital_care_datetime_remark', 'motion_care','motion_care_datetime_remark', 'Grooming','Grooming_datetime_remark', 'Bed_bath','Bed_bath_datetime_remark', 'Feeding','Feeding_datetime_remark', 'Reposition_patient','Reposition_patient_datetime_remark', 'Bed_pan','Bed_pan_datetime_remark', 'added_by','last_modified_by', 'closure_revalidate', 'closure_revalidate_remark']

    def validate(self, data):
        return data
    
class agg_hhc_session_job_closure_serializer_form_3(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id','Wound', 'Oozing', 'Discharge', 'Dressing_status', 'last_modified_by', 'closure_revalidate', 'closure_revalidate_remark']

    def validate(self, data):
        return data
class agg_hhc_session_job_closure_serializer_form_4(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id', 'Name_injection_fld', 'Inj_site_IM', 'Dose_freq', 'Remark', 'last_modified_by', 'closure_revalidate', 'closure_revalidate_remark']

    def validate(self, data):
        return data
class agg_hhc_session_job_closure_serializer_form_5(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id', 'Catheter_type', 'Size_catheter', 'Procedure', 'Remark', 'last_modified_by', 'closure_revalidate', 'closure_revalidate_remark']

    def validate(self, data):
        return data

class agg_hhc_session_job_closure_serializer_form_6(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id','prof_sub_srv_id','Baseline','Airway','Breathing','Circulation', 'Remark', 'last_modified_by', 'closure_revalidate', 'closure_revalidate_remark']

    def validate(self, data):
        return data

class agg_hhc_session_job_closure_serializer_form_7(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id', 'Temp_core', 'TBSL', 'Pulse', 'SpO2', 'RR', 'GCS_Total', 'BP','diastolic', 'last_modified_by', 'closure_revalidate', 'closure_revalidate_remark']

    def validate(self, data):
        return data

class agg_hhc_session_job_closure_serializer_form_8(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id', 'Sutures_type', 'Num_Sutures_staples', 'Wound_dehiscence', 'Wound', 'Remark', 'last_modified_by', 'closure_revalidate', 'closure_revalidate_remark']

    def validate(self, data):
        return data

class agg_hhc_session_job_closure_serializer_form_9(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id', 'Size_RT', 'Procedure', 'Remark', 'last_modified_by', 'closure_revalidate', 'closure_revalidate_remark']

    def validate(self, data):
        return data
class agg_hhc_session_job_closure_serializer_form_10(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id', 'Strength_exer', 'Stretch_exer', 'Walk_indep', 'Walker_stick' ,'Remark', 'last_modified_by', 'closure_revalidate', 'closure_revalidate_remark']

    def validate(self, data):
        return data


    
class deteailed_session_st_ed_time_date(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_detailed_event_plan_of_care
        fields = ['agg_sp_dt_eve_poc_id','prof_session_start_date','prof_session_end_date','prof_session_start_time','prof_session_end_time']












# __________________________________ Closure Revalidate Amit ______________________________________________________











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
        'clg_address', 'clg_state','clg_district', 'grp_id', 'is_active', 'added_by', 'last_modified_by']

    def create(self, validated_data):
        user = agg_com_colleague(**validated_data)
        user.set_password('1234')  # Set the default password here
        user.save()
        return user


class Register_professioanl_for_professional1(serializers.ModelSerializer):
    # srv_id = serializers.SerializerMethodField() 
    class Meta:
        model = agg_hhc_service_professionals
        fields = ['srv_prof_id','clg_ref_id','role', 'title','email_id','prof_fullname','gender','eme_contact_relation','phone_no','dob','address', 'pin_code_id','state_name','city','eme_contact_no', 'eme_conact_person_name','alt_phone_no','certificate_registration_no', 'mode_of_service', 'Job_type', 'srv_id', 'added_by',  'last_modified_by']
    # def get_srv_id(self, obj):
        # try:
        # print(obj)
        # return obj.srv_id.srv_id
        # except:
        #     return None

class Register_professioanl_for_professional11(serializers.ModelSerializer):
    # srv_id = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_service_professionals
        fields = ['srv_prof_id','clg_ref_id','role', 'title','email_id','prof_fullname','gender','eme_contact_relation','phone_no','dob','address', 'pin_code_id','state_name','city','eme_contact_no', 'eme_conact_person_name','alt_phone_no','certificate_registration_no', 'mode_of_service', 'Job_type', 'srv_id', 'added_by',  'last_modified_by']



class Register_professioanl_for_professional(serializers.ModelSerializer):
    srv_id=serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_service_professionals
        fields = ['srv_prof_id','clg_ref_id','role', 'title','email_id','prof_fullname','gender','eme_contact_relation','phone_no','dob','address', 'pin_code_id','state_name','city','eme_contact_no', 'eme_conact_person_name','alt_phone_no', 'work_phone_no', 'certificate_registration_no', 'mode_of_service', 'Job_type', 'srv_id', 'prof_compny',  'added_by', 'last_modified_by']

    # def get_srv_id(self, obj):
    #     try:
    #         return obj.srv_id
    #     except:
    #         return None
    def get_srv_id(self, obj):
        try:
            return obj.srv_id
        except:
            return None


class add_prof_sub_services_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_professional_sub_services
        fields = ['prof_sub_srv_id', 'srv_prof_id', 'sub_srv_id', 'last_modified_by', 'added_by']

class show_prof_sub_services_serializer(serializers.ModelSerializer):
    sub_srv_name = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_professional_sub_services
        fields = ['prof_sub_srv_id', 'srv_prof_id', 'sub_srv_id', 'sub_srv_name']
    def get_sub_srv_name(self, obj):
        if obj.sub_srv_id:
            return obj.sub_srv_id.recommomded_service
        else:
            return ""
                


#  ______________________ Professional Payment Details API __________________________________________
class Sub_srv_prof_details_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_sub_services
        fields = ['sub_srv_id', 'recommomded_service', 'srv_id']

class srv_prof_name_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_services
        fields = ['srv_id', 'service_title']
        
class get_prof_payment_details_serializer(serializers.ModelSerializer):
    srv_id = srv_prof_name_serializer()
    prof_sub_srv_id = Sub_srv_prof_details_serializer()
    class Meta:
        model = agg_hhc_service_professionals
        fields = ['srv_prof_id', 'srv_id', 'prof_sub_srv_id']

class Prof_payement_details_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_professional_sub_services
        fields = ['prof_sub_srv_id', 'prof_cost', 'last_modified_by']
    
    def to_internal_value(self, data):
        # Map `cost_prof_given` to `prof_cost` before validating the data
        if 'cost_prof_given' in data:
            data['prof_cost'] = data.pop('cost_prof_given')
        return super().to_internal_value(data)        


class add_service_prof_cost_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_professional_sub_services
        fields = ['srv_prof_id', 'sub_srv_id', 'prof_cost', 'last_modified_by' ]


#  ______________________ Professional Payment Details API __________________________________________


class add_prof_qualification_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_service_professional_details
        fields = ['srv_prof_dt_id', 'srv_prof_id', 'qualification', 'specialization', 'prof_CV', 'availability_for_interview']

class add_prof_schedule_interview(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_prof_interview_details
        fields = ['srv_prof_int_id','srv_prof_id','int_round','int_mode', 'int_schedule_with', 'int_schedule_date', 'int_schedule_time', 'last_modified_by', 'added_by']
    

class qualifications_serializer(serializers.ModelSerializer):
    class Meta:
        model=qualifications
        fields=['quali_id','qualification']
    
class qualification_specialization_serializer(serializers.ModelSerializer):
    class Meta:
        model=qualification_specialization
        fields=['quali_sp','specialization']

class add_prof_zones_serializer(serializers.ModelSerializer):
    location_name = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_professional_location
        fields = ['prof_loc_id', 'srv_prof_id', 'location_name', 'last_modified_by', 'added_by']

    def get_location_name(self, obj):
        print(obj.location_name, 'lkjh')
        existing_zone1 = agg_hhc_professional_zone.objects.filter(Name=obj.location_name).first()
        return existing_zone1.prof_zone_id
    
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
        fields = ['srv_prof_dt_id', 'srv_prof_id', 'qualification', 'specialization', 'prof_CV', 'availability_for_interview', 'added_by', 'last_modified_by']
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
    


#-------------------------Mohin Serializers Start--------------------------------------    
class register_company_post_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_company
        fields = ['company_name','company_mail','company_contact_person','company_contact_number','company_alt_contact_person','company_registration_number','company_agreement_validity_period','added_by','last_modified_by','username']


class Company_Documents_save_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_company_documents_save
        fields = ['doc_list_id', 'company_documents','company_id']


class company_details_get_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_company
        fields = '__all__'

class company_details_put_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_company
        fields = ['status','remark']
        

class company_details_update_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_company
        fields = '__all__'
        
     
class Get_Comapny_Documents_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_documents_list
        fields = ['doc_li_id','Documents_name']
        
        
class CompanyDetailSerializer(serializers.ModelSerializer):
    documents = Company_Documents_save_Serializer(many=True, read_only=True, source='agg_hhc_company_documents_save_set')
    class Meta:
        model = agg_hhc_company
        fields = ['company_pk_id','company_name','company_mail','company_contact_person','company_contact_number','company_alt_contact_person','company_registration_number','company_agreement_validity_period','documents']


class Company_Colleague_Details_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_com_colleague
        fields = ['clg_first_name', 'clg_email', 'clg_mobile_no', 'clg_Work_phone_number', 'password','clg_ref_id','prof_compny','grp_id','clg_hos_id']


class CompanyUpdateSerializer(serializers.ModelSerializer):
    documents = Company_Documents_save_Serializer(many=True, required=False, source='agg_hhc_company_documents_save_set')

    class Meta:
        model = agg_hhc_company
        fields = ['company_pk_id','company_name','company_mail','company_contact_person','company_contact_number','company_alt_contact_person','company_registration_number','company_agreement_validity_period','last_modified_by','username','documents']

    def update(self, instance, validated_data):
        document_data = validated_data.pop('agg_hhc_company_documents_save_set', [])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        for doc_data in document_data:
            doc_id = doc_data.get('doc_list_id')
            document = agg_hhc_company_documents_save.objects.filter(
                doc_list_id=doc_id, company_id=instance
            ).first()

            if document:
                document.company_documents = doc_data.get('company_documents', document.company_documents)
                document.save()
            else:
                agg_hhc_company_documents_save.objects.create(
                    company_id=instance,
                    **doc_data
                )
        return instance

class Add_Proffesional_Clg_Table_amit_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_com_colleague
        fields = ['clg_first_name','clg_gender','clg_Date_of_birth','clg_joining_date','clg_qualification','clg_specialization','clg_Work_phone_number','clg_work_email_id','clg_mobile_no','clg_state','clg_address', 'added_by','last_modified_by','password','grp_id','clg_hos_id','prof_compny']

class Add_Proffesional_Service_Professionals_amit_Table_Serializer(serializers.ModelSerializer):
    # srv_id = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_service_professionals
        fields = ['title', 'role', 'prof_fullname','gender','dob','doj','certificate_registration_no','cv_file','srv_id','Job_type','phone_no','email_id','alt_phone_no','eme_contact_no','eme_conact_person_name','eme_contact_relation','state_name','city', 'address', 'prof_address','pin_code_id','prof_zone_id','lattitude','langitude','added_by','last_modified_by','google_home_location','clg_ref_id','prof_compny','prof_registered','prof_interviewed','prof_doc_verified', 'work_phone_no']

class Professional_CV_Details_amit_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_service_professional_details
        fields = ['srv_prof_id','qualification','specialization', 'availability_for_interview', 'added_by','last_modified_by'] 


# class Add_Proffesional_Service_Professionals_Table_amit1111_Serializer(serializers.ModelSerializer):
#     srv_id = serializers.PrimaryKeyRelatedField(
#         queryset=agg_hhc_services.objects.all(),
#         source='srv_id.srv_id'
#     )
#     class Meta:
#         model = agg_hhc_service_professionals
#         fields = ['title','prof_fullname','gender','dob','doj','certificate_registration_no','cv_file','srv_id','Job_type','phone_no','email_id','alt_phone_no','eme_contact_no','eme_conact_person_name','eme_contact_relation','state_name','city','prof_address','pin_code_id','prof_zone_id','lattitude','langitude','added_by','last_modified_by','google_home_location','clg_ref_id','prof_compny','prof_registered','prof_interviewed','prof_doc_verified']





class Add_Proffesional_Service_Professionals_Table_amit11_Serializer(serializers.ModelSerializer):
    # srv_id = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_service_professionals
        fields = ['title','prof_fullname','gender','dob','doj','certificate_registration_no','cv_file','srv_id','Job_type','phone_no','email_id','alt_phone_no','eme_contact_no','eme_conact_person_name','eme_contact_relation','state_name','city','prof_address','pin_code_id','prof_zone_id','lattitude','langitude','added_by','last_modified_by','google_home_location','clg_ref_id','prof_compny','prof_registered','prof_interviewed','prof_doc_verified']
    def to_representation(self, instance):        
        representation = super().to_representation(instance)
        request = self.context.get('request')
        if request and instance.cv_file:
            representation['cv_file'] = request.build_absolute_uri(instance.cv_file.url)
        return representation  

    
class Add_Proffesional_Service_Professionals_Table_amit_Serializer(serializers.ModelSerializer):
    # srv_id = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_service_professionals
        fields = ['title', 'role', 'prof_fullname','gender','dob','certificate_registration_no','cv_file','srv_id','Job_type','phone_no','email_id','alt_phone_no','eme_contact_no','eme_conact_person_name','eme_contact_relation','state_name','city','prof_address', 'address', 'pin_code_id','prof_zone_id','lattitude','langitude','added_by','last_modified_by','google_home_location','clg_ref_id','prof_compny','prof_registered','prof_interviewed','prof_doc_verified', 'work_phone_no']

class Add_Proffesional_Service_Professionals_Table_amit_get_Serializer(serializers.ModelSerializer):
    srv_id = serializers.PrimaryKeyRelatedField(
        queryset=agg_hhc_services.objects.all(),
        source='srv_id.srv_id'
    )
    class Meta:
        model = agg_hhc_service_professionals
        fields = ['title','role', 'prof_fullname','gender','dob','certificate_registration_no','cv_file','srv_id','Job_type','phone_no','email_id','alt_phone_no','eme_contact_no','eme_conact_person_name','eme_contact_relation','state_name','city','prof_address','pin_code_id','prof_zone_id','lattitude','langitude','added_by','last_modified_by','google_home_location','clg_ref_id','prof_compny','prof_registered','prof_interviewed','prof_doc_verified']




class Add_Proffesional_Service_Professionals_Table_Serializer(serializers.ModelSerializer):
    # srv_id = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_service_professionals
        fields = ['title','prof_fullname','gender','dob','doj','Education_level','certificate_registration_no','cv_file','srv_id','Job_type','phone_no','email_id','alt_phone_no','eme_contact_no','eme_conact_person_name','eme_contact_relation','state_name','city','prof_address','pin_code_id','prof_zone_id','lattitude','langitude','added_by','last_modified_by','google_home_location','clg_ref_id','prof_compny','prof_registered','prof_interviewed','prof_doc_verified','work_phone_no','address']




       
class Add_Proffesional_Clg_Table_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_com_colleague
        fields = ['clg_first_name','clg_gender','clg_Date_of_birth','clg_joining_date','clg_qualification','clg_specialization','clg_Work_phone_number','clg_work_email_id','clg_mobile_no','clg_state','clg_address','added_by','last_modified_by','password','grp_id','clg_hos_id','prof_compny']


class Get_Proffesional_Documents_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_documents_list
        fields = ['doc_li_id','Documents_name']  
        
class Proffesional_Documents_save_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_professional_documents
        fields = ['doc_li_id', 'professional_document','srv_prof_id','added_by','last_modified_by'] 
        
class Professional_Sub_Services_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_professional_sub_services
        fields = ['srv_prof_id','sub_srv_id','prof_cost','added_by','last_modified_by'] 
        
class Professional_CV_Details_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_service_professional_details
        fields = ['srv_prof_id','qualification','specialization','added_by','last_modified_by'] 
        
class Profesional_status_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_service_professionals
        fields = '__all__'
        
class Profesional_Details_Get_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_service_professionals
        fields = ['srv_prof_id','prof_fullname','doj','email_id','srv_id','status']
        
        
# class Professional_Details_Get_Update_Serializer(serializers.ModelSerializer):
#     class Meta:
#         model = agg_hhc_service_professionals
#         fields = ['title','prof_fullname','gender','dob','doj','Education_level','certificate_registration_no','cv_file','srv_id','prof_sub_srv_id','Job_type','phone_no','email_id','alt_phone_no','eme_contact_no','eme_conact_person_name','eme_contact_relation','state_name','city','prof_address','pin_code_id','prof_zone_id','lattitude','langitude','added_by','last_modified_by','google_home_location','clg_ref_id']
        





class Proffesional_Documents_Details_Get_Update_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_professional_documents
        fields = ['prof_doc_id', 'professional_document','doc_li_id']
        
class Proffesional_sub_services_Details_Get_Update_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_professional_sub_services
        fields = ['srv_prof_id','sub_srv_id','prof_cost'] 

class Professional_Clg_Details_Get_Update_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_com_colleague
        fields = [ 'clg_specialization']
        

class Professional_Details_Get_Update_Serializer(serializers.ModelSerializer):
    # doc_details = Proffesional_Documents_Details_Get_Update_Serializer(source='agg_hhc_professional_documents_set', many=True, read_only=True)
    # sub_services_details = Proffesional_sub_services_Details_Get_Update_Serializer(source='agg_hhc_professional_sub_services_set', many=True, read_only=True)
    sub_services_details = serializers.SerializerMethodField()
    doc_details = serializers.SerializerMethodField()
    clg_details = Professional_Clg_Details_Get_Update_Serializer(source='clg_ref_id', read_only=True)    
    srv_id=serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_service_professionals
        fields = ['title', 'prof_fullname', 'gender', 'dob', 'doj', 'Education_level', 'certificate_registration_no', 
                  'cv_file', 'srv_id', 'prof_sub_srv_id', 'Job_type', 'phone_no', 'email_id', 'alt_phone_no', 
                  'eme_contact_no', 'eme_conact_person_name', 'eme_contact_relation', 'state_name', 'city', 
                  'prof_address', 'pin_code_id', 'prof_zone_id', 'lattitude', 'langitude', 'added_by', 
                  'last_modified_by', 'google_home_location','clg_details', 'doc_details','sub_services_details','work_phone_no','address']
        
    def get_sub_services_details(self, obj):
        sub_services = obj.agg_hhc_professional_sub_services_set.filter(status=1)
        return Proffesional_sub_services_Details_Get_Update_Serializer(sub_services, many=True).data
    
    def get_doc_details(self, obj):
        do = obj.agg_hhc_professional_documents_set.filter(srv_prof_id = obj)
        return Proffesional_Documents_Details_Get_Update_Serializer(do, many=True).data
    
    def get_srv_id(self, obj):
        try:
            return obj.srv_id.srv_id
        except:
            return None


class Professional_Details_Get_Update_Serializer1(serializers.ModelSerializer):
    # doc_details = Proffesional_Documents_Details_Get_Update_Serializer(source='agg_hhc_professional_documents_set', many=True, read_only=True)
    # sub_services_details = Proffesional_sub_services_Details_Get_Update_Serializer(source='agg_hhc_professional_sub_services_set', many=True, read_only=True)
    sub_services_details = serializers.SerializerMethodField()
    doc_details = serializers.SerializerMethodField()
    clg_details = Professional_Clg_Details_Get_Update_Serializer(source='clg_ref_id', read_only=True)    
    # srv_id=serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_service_professionals
        fields = ['title', 'prof_fullname', 'gender', 'dob', 'doj', 'Education_level', 'certificate_registration_no', 
                  'cv_file', 'srv_id', 'prof_sub_srv_id', 'Job_type', 'phone_no', 'email_id', 'alt_phone_no', 
                  'eme_contact_no', 'eme_conact_person_name', 'eme_contact_relation', 'state_name', 'city', 
                  'prof_address', 'pin_code_id', 'prof_zone_id', 'lattitude', 'langitude', 'added_by', 
                  'last_modified_by', 'google_home_location','clg_details', 'doc_details','sub_services_details','work_phone_no','address']
        
    def get_sub_services_details(self, obj):
        sub_services = obj.agg_hhc_professional_sub_services_set.filter(status=1)
        return Proffesional_sub_services_Details_Get_Update_Serializer(sub_services, many=True).data
    
    def get_doc_details(self, obj):
        do = obj.agg_hhc_professional_documents_set.filter(srv_prof_id = obj)
        return Proffesional_Documents_Details_Get_Update_Serializer(do, many=True).data
    
    def get_srv_id(self, obj):
        try:
            return obj.srv_id.srv_id
        except:
            return None

class cv_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_service_professional_details
        fields = ['prof_CV1']

        
#-------------------------Mohin Serializers End--------------------------------------    