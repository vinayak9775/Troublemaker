# ____________________ Amit Rasale _______________________
# from hhcweb.models import agg_hhc_service_professionals, agg_com_colleague
from hhcweb.models import *
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import OutstandingToken
from rest_framework_simplejwt.tokens import BlacklistedToken
from django.db.models import Count
from datetime import datetime, timedelta



class agg_com_colleague_serializers(serializers.ModelSerializer):
    class Meta:
        model = agg_com_colleague
        fields = ['pk','clg_ref_id', 'clg_first_name','grp_id']

class BlacklistedTokenSerializer(serializers.ModelSerializer):
    # token_id = OutstandingTokenSerializer()
    class Meta:
        model = BlacklistedToken
        fields = ['id', 'blacklisted_at', 'token_id']


class OutstandingTokenSerializer(serializers.ModelSerializer): 
    block = serializers.SerializerMethodField()
    class Meta:
        model = OutstandingToken
        fields = ['id', 'user_id', 'created_at','expires_at','block']
    
    def get_block(self,obj):
        get_bl_dt = BlacklistedToken.objects.filter(token_id= obj.id)
        bl_ser = BlacklistedTokenSerializer(instance=get_bl_dt, many=True)
        return bl_ser.data


class Login_Logout_professionals_Serializers(serializers.ModelSerializer):
    clg_ref_id = agg_com_colleague_serializers()
    out_std_token = serializers.SerializerMethodField()
    # Black_listed = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_service_professionals
        fields = ['srv_prof_id','Job_type','prof_fullname','phone_no','clg_ref_id','out_std_token']

    def get_out_std_token(self,obj):
        clg_pk = obj.clg_ref_id
        get_outstd_obj = OutstandingToken.objects.filter(user=clg_pk.pk)
        out_seri = OutstandingTokenSerializer(instance=get_outstd_obj, many=True)
        # data = {'clg_ref_id':id.clg_ref_id,'name':f_name+' '+m_name+' '+l_name}
        return out_seri.data






# class Patent_hospitals_name_serializers(serializers.ModelSerializer):
#     class Meta:
#         model = agg_hhc_hospitals
#         fields = ['hosp_id','hospital_name']

class patients_name_serializers(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_patients
        fields = ['agg_sp_pt_id', 'name','preferred_hosp_id']

class hospital_patient_count_serializers(serializers.ModelSerializer):
    agg_sp_pt_id = patients_name_serializers()
    class Meta:
        model = agg_hhc_events
        fields = ['eve_id', 'agg_sp_pt_id', 'event_status', 'added_from_hosp', 'added_date', 'last_modified_date']









class patients_name (serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_patients
        fields = ['agg_sp_pt_id', 'name', 'Age', 'Suffered_from', 'phone_no', 'address']

class event_plan_of_care_Patients_name (serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_event_plan_of_care
        fields = ['eve_poc_id', 'srv_id', 'sub_srv_id']

class detailed_event_plan_of_care_serializers(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_detailed_event_plan_of_care
        fields = ['agg_sp_dt_eve_poc_id', 'eve_id', 'added_date']

class event_manage_enquiry_serializers(serializers.ModelSerializer):
    # detailed_event_plan_of_care = serializers.SerializerMethodField()
    event_plan_of_care = serializers.SerializerMethodField()
    # agg_sp_pt_id = patients_name()
    agg_sp_pt_id = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()

    class Meta:
        model = agg_hhc_events
        # fields = ['eve_id', 'event_code', 'patient_service_status', 'enq_spero_srv_status', 'added_date', 'added_by', 'last_modified_date', 'last_modified_by', 'last_modified_date', 'agg_sp_pt_id', 'event_plan_of_care', 'detailed_event_plan_of_care']
        fields = ['eve_id', 'event_code', 'agg_sp_pt_id', 'added_by', 'added_date', 'last_modified_by', 'last_modified_date', 'address','event_plan_of_care']

    def get_agg_sp_pt_id(self, obj):
        print(obj.agg_sp_pt_id.name)
        return obj.agg_sp_pt_id.name
    
    def get_address(self, obj):
        return obj.agg_sp_pt_id.address

    def get_detailed_event_plan_of_care(self, obj):
        detailed_plan_records = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id)
        serialized_data = detailed_event_plan_of_care_serializers(detailed_plan_records, many=True).data
        return serialized_data      

    # def get_event_plan_of_care(self, obj):
    #     detailed_plan_records = agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.eve_id)
    #     serialized_data = event_plan_of_care_Patients_name(detailed_plan_records, many=True).data
    #     return serialized_data   

    def get_event_plan_of_care(self, obj):
        detailed_plan_records = agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.eve_id).first()
        # print(detailed_plan_records.count())
        if detailed_plan_records:
        # serialized_data = event_plan_of_care_Patients_name(detailed_plan_records, many=True)
            data={
                "service":detailed_plan_records.srv_id.service_title,
                "sub_service":detailed_plan_records.sub_srv_id.recommomded_service
            }
            return data   
        return None

class Manage_enquiry_Report_serializers(serializers.ModelSerializer):
    event_id = event_manage_enquiry_serializers()
    follow_up = serializers.SerializerMethodField()
    cancel_by = serializers.SerializerMethodField()
    service_created_date = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_enquiry_follow_up
        fields = ['enq_follow_up_id', 'follow_up', 'cancel_by', 'added_date', 'event_id','previous_follow_up_remark','service_created_date']

    def get_follow_up(self, obj):
        if obj.follow_up=='1':
            return "Follow_up_Reschedule"
        elif obj.follow_up=='2':
            return "Cancel"
        elif obj.follow_up=='3':
            return "Create_Service"
        elif obj.follow_up=='4':
            return "follow_up_pending"
        elif obj.follow_up=='5':
            return "ongoing"
        
    def get_cancel_by(self, obj):
        if obj.cancel_by=='1':
            return "From_Spero"
        if obj.cancel_by=='2':
            return "From_Patient"
        if obj.cancel_by=='3':
            return "Other"
    
    def get_service_created_date(self, obj):
        detailed_plan_records = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id).first()
        if detailed_plan_records:
            return detailed_plan_records.actual_StartDate_Time
    # def to_representation(self, instance):
    #     representation = super().to_representation(instance)
    #     select_report_type = self.context.get('select_report_type')
    #     added_date = instance.event_id.added_date

    #     if select_report_type == '1':
    #         if instance.follow_up != '2':
    #             return None
    #         # Customize the fields to be returned for select_report_type 1
    #         representation['event_id'] = {
    #             key: representation['event_id'][key] for key in ['eve_id', 'event_code', 'added_date', 'added_by', 'last_modified_date', 'last_modified_by', 'last_modified_date']
    #         }
    #     if select_report_type == '2':    
    #         if instance.follow_up != '3':
    #             return None
    #         # Fetch patient details from event_id
    #         patient_details = representation['event_id']['agg_sp_pt_id']
    #         representation['patient_details'] = {
    #             'name': patient_details['name'],
    #             'Age': patient_details['Age'],
    #             'Suffered_from': patient_details['Suffered_from'],
    #             'phone_no': patient_details['phone_no'],
    #             'address': patient_details['address'],
    #         }
    #         # Fetch additional details from event_plan_of_care_Patients_name
    #         event_plan_details_list = representation['event_id'].get('event_plan_of_care', [{}])
    #         if event_plan_details_list:
    #             event_plan_details = event_plan_details_list[0]
    #         else:
    #             event_plan_details = {}
    #         del representation['event_id']['event_plan_of_care']  # Remove the field from the representation
    #         # Customize the fields to be returned for select_report_type 2
    #         representation['event_id'].update({
    #             key: event_plan_details.get(key, '') for key in ['eve_id', 'start_date', 'srv_id', 'sub_srv_id', 'srv_prof_id', 'remark']
    #         })

    #     elif select_report_type == '3':
    #         # Filter records based on patient_service_status
    #         if instance.event_id.patient_service_status == '1' \
    #                 or instance.event_id.patient_service_status == '2' \
    #                 or instance.event_id.patient_service_status == '3' \
    #                 or instance.event_id.patient_service_status == '4':
    #             # Customize the fields to be returned for select_report_type 3
    #             representation['event_id'] = {
    #                 key: representation['event_id'][key] for key in ['event_code', 'eve_id', 'patient_service_status']
    #             }
    #             # Add patient details
    #             patient_details = representation['event_id']['agg_sp_pt_id']
    #             representation['patient_details'] = {
    #                 'name': patient_details['name'],
    #                 'patent_id': patient_details['agg_sp_pt_id'],
    #                 # Include other patient details as needed
    #             }
    #     elif select_report_type == '4':
    #         # Filter records based on a 2-hour window between added_date fields
    #         if instance.follow_up != '3':
    #             return None
    #         event = instance.event_id
    #         if event and hasattr(event, 'added_date') and hasattr(event, 'detailed_event_plan_of_care'):
    #             added_date = event.added_date
    #             detailed_event_plan_of_care = event.detailed_event_plan_of_care
    #             if detailed_event_plan_of_care:
    #                 detailed_added_date = detailed_event_plan_of_care[0]['added_date']
    #                 time_difference = detailed_added_date - added_date
    #                 if timedelta(hours=2) >= time_difference >= timedelta(seconds=0):
    #                     # Fetch patient details from event_id
    #                     patient_details = event.agg_sp_pt_id
    #                     representation['patient_details'] = {
    #                         'name': patient_details.name,
    #                         'Age': patient_details.Age,
    #                         'Suffered_from': patient_details.Suffered_from,
    #                         'phone_no': patient_details.phone_no,
    #                         'address': patient_details.address,
    #                     }
    #                     # Fetch additional details from event_plan_of_care_Patients_name
    #                     event_plan_details_list = event.event_plan_of_care
    #                     if event_plan_details_list:
    #                         event_plan_details = event_plan_details_list[0]
    #                     else:
    #                         event_plan_details = {}
    #                     del representation['event_id']['event_plan_of_care']  # Remove the field from the representation
    #                     # Customize the fields to be returned for select_report_type 4
    #                     representation['event_id'].update({
    #                         key: event_plan_details.get(key, '') for key in ['eve_id', 'start_date', 'srv_id', 'sub_srv_id', 'srv_prof_id', 'remark']
    #                     })
    #     return representation
    









class Consultants_cancellation_historySerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_cancellation_history
        fields = ['canc_his_id', 'event_id', 'cancellation_by', 'cancelled_date']

class consultants_Report_serializers(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_enquiry_follow_up
        fields = ['enq_follow_up_id', 'event_id', 'follow_up', 'cancel_by']

class Srv_name_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_services
        fields = ['srv_id', 'service_title'] 

class Sub_Srv_name_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_sub_services
        fields = ['sub_srv_id', 'recommomded_service']

class professionals_name_serializers(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_service_professionals
        fields = ['srv_prof_id', 'prof_fullname']
class detailed_event_plan_of_care_p_name_serializers(serializers.ModelSerializer):
    srv_prof_id = professionals_name_serializers()
    class Meta:
        model = agg_hhc_detailed_event_plan_of_care
        fields = ['agg_sp_dt_eve_poc_id', 'eve_id', 'srv_prof_id']

class DoctorsConsultants_event_plan_of_care_Patients_name (serializers.ModelSerializer):
    srv_id = Srv_name_Serializer()
    sub_srv_id = Sub_Srv_name_Serializer()
    # srv_prof_id = professionals_name_serializers()
    det_prof_id = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_event_plan_of_care
        fields = ['eve_poc_id', 'eve_id', 'start_date', 'srv_id', 'sub_srv_id', 'det_prof_id']

    def get_det_prof_id(self, obj):
        detailed_plan_records = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id).last()
        serialized_data = detailed_event_plan_of_care_p_name_serializers(detailed_plan_records).data
        return serialized_data 
class DoctorsConsultantsSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_doctors_consultants
        fields = ['doct_cons_id', 'cons_fullname']

class ConsultantPatientsSerializer(serializers.ModelSerializer):
    doct_cons_id = DoctorsConsultantsSerializer()  # Nested Serializer field
    
    class Meta:
        model = agg_hhc_patients
        fields = ['agg_sp_pt_id', 'name', 'doct_cons_id']

class consultant_Report_serializers(serializers.ModelSerializer):
    agg_sp_pt_id = ConsultantPatientsSerializer()
    event_plan_of_care = serializers.SerializerMethodField()
    consultants_Report = serializers.SerializerMethodField()
    cancellation_history = serializers.SerializerMethodField()

    class Meta:
        model = agg_hhc_events
        fields = ['eve_id', 'event_code', 'agg_sp_pt_id', 'enq_spero_srv_status', 'event_status', 'added_date', 'last_modified_date', 'srv_cancelled', 'event_plan_of_care', 'consultants_Report', 'cancellation_history']

    def get_event_plan_of_care(self, obj):
        detailed_plan_records = agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.eve_id)
        serialized_data = DoctorsConsultants_event_plan_of_care_Patients_name(detailed_plan_records, many=True).data
        return serialized_data 
    
    def get_consultants_Report(self, obj):
        consultantsReport_records = agg_hhc_enquiry_follow_up.objects.filter(event_id=obj.eve_id, follow_up='2')  # Assuming 'follow_up' is the related_name
        serialized_data = consultants_Report_serializers(consultantsReport_records, many=True).data
        return serialized_data
    
    def get_cancellation_history(self, obj):
        consultantsReport_records = agg_hhc_cancellation_history.objects.filter(event_id=obj.eve_id)  # Assuming 'follow_up' is the related_name
        serialized_data = Consultants_cancellation_historySerializer(consultantsReport_records, many=True).data
        return serialized_data
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        select_report_type = self.context.get('select_report_type')
        # cons_fullname = self.context.get('cons_fullname')

        if select_report_type == select_report_type:
            if instance.enq_spero_srv_status == ['2', '1']:
                return None
            if instance.agg_sp_pt_id.doct_cons_id.doct_cons_id == select_report_type:
                return None
            representation = {
                key: representation[key] for key in ['eve_id', 'event_code', 'agg_sp_pt_id', 'event_status', 'added_date', 'last_modified_date', 'event_plan_of_care']
            }

            if isinstance(representation['agg_sp_pt_id'], dict):
                patent_details = representation['agg_sp_pt_id']
            else:
                patent_details = {}
                
            del representation['agg_sp_pt_id']  # Remove the field from the representation
            # Customize the fields to be returned for select_report_type 2
            representation.update({
                'agg_sp_pt_id': {
                    'agg_sp_pt_id': patent_details.get('agg_sp_pt_id', ''),
                    'name': patent_details.get('name', ''),
                    'doct_cons_id': patent_details.get('doct_cons_id', '')
                }
            })
        return representation   



        # if select_report_type == '1':
        #     if instance.event_status == '3':
        #         return None
        #     representation = {
        #         key: representation[key] for key in ['eve_id', 'event_code', 'agg_sp_pt_id', 'event_status', 'added_date', 'last_modified_date', 'event_plan_of_care']
        #     }

        #     if isinstance(representation['agg_sp_pt_id'], dict):
        #         patent_details = representation['agg_sp_pt_id']
        #     else:
        #         patent_details = {}
                
        #     del representation['agg_sp_pt_id']  # Remove the field from the representation
        #     # Customize the fields to be returned for select_report_type 2
        #     representation.update({
        #         'agg_sp_pt_id': {
        #             'agg_sp_pt_id': patent_details.get('agg_sp_pt_id', ''),
        #             'name': patent_details.get('name', ''),
        #             'doct_cons_id': patent_details.get('doct_cons_id', '')
        #         }
        #     })
        # # if select_report_type == '2':
        # #     if instance.enq_spero_srv_status == '3':
        # #         return None
        # #     representation = {
        # #         key: representation[key] for key in ['eve_id', 'event_code', 'agg_sp_pt_id', 'enq_spero_srv_status', 'event_status', 'added_date', 'last_modified_date', 'event_plan_of_care']
        # #     }

        # #     if isinstance(representation['agg_sp_pt_id'], dict):
        # #         patent_details = representation['agg_sp_pt_id']
        # #     else:
        # #         patent_details = {}
                
        # #     del representation['agg_sp_pt_id']  # Remove the field from the representation
        # #     # Customize the fields to be returned for select_report_type 2
        # #     representation.update({
        # #         'agg_sp_pt_id': {
        # #             'agg_sp_pt_id': patent_details.get('agg_sp_pt_id', ''),
        # #             'name': patent_details.get('name', ''),
        # #             'doct_cons_id': patent_details.get('doct_cons_id', '')
        # #         }
        # #     })     
        # # elif select_report_type == '3':
        # #     if instance.enq_spero_srv_status == '1':
        # #         return None
        # #     if instance.enq_spero_srv_status == '2':
        # #         return None
        # #     representation = {
        # #         key: representation[key] for key in ['eve_id', 'event_code', 'agg_sp_pt_id', 'enq_spero_srv_status', 'event_status', 'added_date', 'last_modified_date', 'event_plan_of_care']
        # #     }

        # #     if isinstance(representation['agg_sp_pt_id'], dict):
        # #         patent_details = representation['agg_sp_pt_id']
        # #     else:
        # #         patent_details = {}
                
        # #     del representation['agg_sp_pt_id']  # Remove the field from the representation
        # #     # Customize the fields to be returned for select_report_type 2
        # #     representation.update({
        # #         'agg_sp_pt_id': {
        # #             'agg_sp_pt_id': patent_details.get('agg_sp_pt_id', ''),
        # #             'name': patent_details.get('name', ''),
        # #             'doct_cons_id': patent_details.get('doct_cons_id', '')
        # #         }
        # #     })      

        # # elif select_report_type == '4':
        # #     # if instance.event_status == '2':    
        # #     #     return None

        # #     representation = {
        # #         key: representation[key] for key in ['eve_id', 'event_code', 'agg_sp_pt_id', 'enq_spero_srv_status', 'event_status', 'added_date', 'last_modified_date', 'event_plan_of_care', 'consultants_Report']
        # #     }

        # #     if isinstance(representation['agg_sp_pt_id'], dict):
        # #         patent_details = representation['agg_sp_pt_id']
        # #     else:
        # #         patent_details = {}
                
        # #     del representation['agg_sp_pt_id']  # Remove the field from the representation
        # #     # Customize the fields to be returned for select_report_type 2
        # #     representation.update({
        # #         'agg_sp_pt_id': {
        # #             'agg_sp_pt_id': patent_details.get('agg_sp_pt_id', ''),
        # #             'name': patent_details.get('name', ''),
        # #             'doct_cons_id': patent_details.get('doct_cons_id', '')
        # #         }
        # #     })
        # # elif select_report_type == '5':
        # #     # if instance.event_status == '2':    
        # #     #     return None

        # #     representation = {
        # #         key: representation[key] for key in ['eve_id', 'event_code', 'agg_sp_pt_id', 'enq_spero_srv_status', 'event_status', 'added_date', 'last_modified_date', 'event_plan_of_care', 'cancellation_history']
        # #     }

        # #     if isinstance(representation['agg_sp_pt_id'], dict):
        # #         patent_details = representation['agg_sp_pt_id']
        # #     else:
        # #         patent_details = {}
                
        # #     del representation['agg_sp_pt_id']  # Remove the field from the representation
        # #     # Customize the fields to be returned for select_report_type 2
        # #     representation.update({
        # #         'agg_sp_pt_id': {
        # #             'agg_sp_pt_id': patent_details.get('agg_sp_pt_id', ''),
        # #             'name': patent_details.get('name', ''),
        # #             'doct_cons_id': patent_details.get('doct_cons_id', '')
        # #         }
        # #     })

        # return representation  





# class Consultants_cancellation_historySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = agg_hhc_cancellation_history
#         fields = ['canc_his_id', 'event_id', 'cancellation_by', 'cancelled_date']

# class consultants_Report_serializers(serializers.ModelSerializer):
#     class Meta:
#         model = agg_hhc_enquiry_follow_up
#         fields = ['enq_follow_up_id', 'event_id', 'follow_up', 'cancel_by']

# class DoctorsConsultants_event_plan_of_care_Patients_name (serializers.ModelSerializer):
#     class Meta:
#         model = agg_hhc_event_plan_of_care
#         fields = ['eve_poc_id', 'eve_id', 'start_date', 'srv_id', 'sub_srv_id', 'srv_prof_id']

# class DoctorsConsultantsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = agg_hhc_doctors_consultants
#         fields = ['doct_cons_id', 'cons_fullname']

# class ConsultantPatientsSerializer(serializers.ModelSerializer):
#     doct_cons_id = DoctorsConsultantsSerializer()  # Nested Serializer field
    
#     class Meta:
#         model = agg_hhc_patients
#         fields = ['agg_sp_pt_id', 'name', 'doct_cons_id']

# class consultant_Report_serializers(serializers.ModelSerializer):
#     agg_sp_pt_id = ConsultantPatientsSerializer()
#     event_plan_of_care = serializers.SerializerMethodField()
#     consultants_Report = serializers.SerializerMethodField()
#     cancellation_history = serializers.SerializerMethodField()

#     class Meta:
#         model = agg_hhc_events
#         fields = ['eve_id', 'event_code', 'agg_sp_pt_id', 'enq_spero_srv_status', 'event_status', 'added_date', 'last_modified_date', 'event_plan_of_care', 'consultants_Report', 'cancellation_history']

#     def get_event_plan_of_care(self, obj):
#         detailed_plan_records = agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.eve_id)
#         serialized_data = DoctorsConsultants_event_plan_of_care_Patients_name(detailed_plan_records, many=True).data
#         return serialized_data 
    
#     def get_consultants_Report(self, obj):
#         consultantsReport_records = agg_hhc_enquiry_follow_up.objects.filter(event_id=obj.eve_id, follow_up='2')  # Assuming 'follow_up' is the related_name
#         serialized_data = consultants_Report_serializers(consultantsReport_records, many=True).data
#         return serialized_data
    
#     def get_cancellation_history(self, obj):
#         consultantsReport_records = agg_hhc_cancellation_history.objects.filter(event_id=obj.eve_id)  # Assuming 'follow_up' is the related_name
#         serialized_data = Consultants_cancellation_historySerializer(consultantsReport_records, many=True).data
#         return serialized_data
        
#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         select_report_type = self.context.get('select_report_type')

#         if select_report_type == '1':
#             if instance.event_status == '3':
#                 return None
#             representation = {
#                 key: representation[key] for key in ['eve_id', 'event_code', 'agg_sp_pt_id', 'event_status', 'added_date', 'last_modified_date', 'event_plan_of_care']
#             }

#             if isinstance(representation['agg_sp_pt_id'], dict):
#                 patent_details = representation['agg_sp_pt_id']
#             else:
#                 patent_details = {}
                
#             del representation['agg_sp_pt_id']  # Remove the field from the representation
#             # Customize the fields to be returned for select_report_type 2
#             representation.update({
#                 'agg_sp_pt_id': {
#                     'agg_sp_pt_id': patent_details.get('agg_sp_pt_id', ''),
#                     'name': patent_details.get('name', ''),
#                     'doct_cons_id': patent_details.get('doct_cons_id', '')
#                 }
#             })
#         if select_report_type == '2':
#             if instance.enq_spero_srv_status == '3':
#                 return None
#             representation = {
#                 key: representation[key] for key in ['eve_id', 'event_code', 'agg_sp_pt_id', 'enq_spero_srv_status', 'event_status', 'added_date', 'last_modified_date', 'event_plan_of_care']
#             }

#             if isinstance(representation['agg_sp_pt_id'], dict):
#                 patent_details = representation['agg_sp_pt_id']
#             else:
#                 patent_details = {}
                
#             del representation['agg_sp_pt_id']  # Remove the field from the representation
#             # Customize the fields to be returned for select_report_type 2
#             representation.update({
#                 'agg_sp_pt_id': {
#                     'agg_sp_pt_id': patent_details.get('agg_sp_pt_id', ''),
#                     'name': patent_details.get('name', ''),
#                     'doct_cons_id': patent_details.get('doct_cons_id', '')
#                 }
#             })     
#         elif select_report_type == '3':
#             if instance.enq_spero_srv_status == '1':
#                 return None
#             if instance.enq_spero_srv_status == '2':
#                 return None
#             representation = {
#                 key: representation[key] for key in ['eve_id', 'event_code', 'agg_sp_pt_id', 'enq_spero_srv_status', 'event_status', 'added_date', 'last_modified_date', 'event_plan_of_care']
#             }

#             if isinstance(representation['agg_sp_pt_id'], dict):
#                 patent_details = representation['agg_sp_pt_id']
#             else:
#                 patent_details = {}
                
#             del representation['agg_sp_pt_id']  # Remove the field from the representation
#             # Customize the fields to be returned for select_report_type 2
#             representation.update({
#                 'agg_sp_pt_id': {
#                     'agg_sp_pt_id': patent_details.get('agg_sp_pt_id', ''),
#                     'name': patent_details.get('name', ''),
#                     'doct_cons_id': patent_details.get('doct_cons_id', '')
#                 }
#             })      

#         elif select_report_type == '4':
#             # if instance.event_status == '2':    
#             #     return None

#             representation = {
#                 key: representation[key] for key in ['eve_id', 'event_code', 'agg_sp_pt_id', 'enq_spero_srv_status', 'event_status', 'added_date', 'last_modified_date', 'event_plan_of_care', 'consultants_Report']
#             }

#             if isinstance(representation['agg_sp_pt_id'], dict):
#                 patent_details = representation['agg_sp_pt_id']
#             else:
#                 patent_details = {}
                
#             del representation['agg_sp_pt_id']  # Remove the field from the representation
#             # Customize the fields to be returned for select_report_type 2
#             representation.update({
#                 'agg_sp_pt_id': {
#                     'agg_sp_pt_id': patent_details.get('agg_sp_pt_id', ''),
#                     'name': patent_details.get('name', ''),
#                     'doct_cons_id': patent_details.get('doct_cons_id', '')
#                 }
#             })
#         elif select_report_type == '5':
#             # if instance.event_status == '2':    
#             #     return None

#             representation = {
#                 key: representation[key] for key in ['eve_id', 'event_code', 'agg_sp_pt_id', 'enq_spero_srv_status', 'event_status', 'added_date', 'last_modified_date', 'event_plan_of_care', 'cancellation_history']
#             }

#             if isinstance(representation['agg_sp_pt_id'], dict):
#                 patent_details = representation['agg_sp_pt_id']
#             else:
#                 patent_details = {}
                
#             del representation['agg_sp_pt_id']  # Remove the field from the representation
#             # Customize the fields to be returned for select_report_type 2
#             representation.update({
#                 'agg_sp_pt_id': {
#                     'agg_sp_pt_id': patent_details.get('agg_sp_pt_id', ''),
#                     'name': patent_details.get('name', ''),
#                     'doct_cons_id': patent_details.get('doct_cons_id', '')
#                 }
#             })

#         return representation   
# ____________________ Amit Rasale _______________________


# class refound_amount_serializer(serializers.ModelSerializer):
#     class Meta:
#         model = agg_hhc_cancellation_history
#         fields = ['canc_his_id', '']

# class Session_Refound_Amount_serializer(serializers.ModelSerializer):
#     class Meta:
#         fields=['total_sessions', 'cancelled_sessions', 'dates']
        
class Session_Refound_Amount_serializer(serializers.Serializer):  
    event_id = serializers.IntegerField()
    total_sessions = serializers.IntegerField()
    service_total_amount = serializers.IntegerField()
    cancellation_charges = serializers.IntegerField()
    cancelled_sessions = serializers.IntegerField()
    dates = serializers.ListField(child=serializers.DateField())
    cancelation_staus = serializers.CharField()
    srvice = serializers.CharField()
    sub_service = serializers.CharField()
    service_start_date = serializers.DateField()
    service_end_date = serializers.DateField()




# class Consultants_enquiry_serializers(serializers.ModelSerializer):
#     class Meta:
#         model = agg_hhc_enquiry_follow_up
#         fields = ['enq_follow_up_id', 'event_id', 'follow_up', 'cancel_by']

# class Consultants_cancellation_historySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = agg_hhc_cancellation_history
#         fields = ['canc_his_id', 'event_id', 'cancellation_by', 'cancelled_date']

# class DoctorsConsultants_event_plan_of_care_Patients_name (serializers.ModelSerializer):
#     class Meta:
#         model = agg_hhc_event_plan_of_care
#         fields = ['eve_poc_id', 'eve_id', 'start_date', 'srv_id', 'sub_srv_id', 'srv_prof_id']

# class DoctorsConsultantsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = agg_hhc_doctors_consultants
#         fields = ['doct_cons_id', 'cons_fullname']

# class ConsultantPatientsSerializer(serializers.ModelSerializer):
#     doct_cons_id = DoctorsConsultantsSerializer()  # Nested Serializer field
    
#     class Meta:
#         model = agg_hhc_patients
#         fields = ['agg_sp_pt_id', 'name', 'doct_cons_id']

# class consultant_Report_serializers(serializers.ModelSerializer):
#     agg_sp_pt_id = ConsultantPatientsSerializer()
#     event_plan_of_care = serializers.SerializerMethodField()
#     cancellation_history = serializers.SerializerMethodField()
#     enqueiry_followup = serializers.SerializerMethodField()
    
#     class Meta:
#         model = agg_hhc_events
#         fields = ['eve_id', 'event_code', 'agg_sp_pt_id', 'enq_spero_srv_status', 'event_status', 'added_date', 'last_modified_date', 'event_plan_of_care', 'cancellation_history', 'enqueiry_followup']

#     def get_event_plan_of_care(self, obj):
#         detailed_plan_records = agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.eve_id)
#         serialized_data = DoctorsConsultants_event_plan_of_care_Patients_name(detailed_plan_records, many=True).data
#         return serialized_data 
    
#     def get_event_plan_of_care(self, obj):
#         detailed_plan_records = agg_hhc_cancellation_history.objects.filter(eve_id=obj.event_id)
#         serialized_data = Consultants_cancellation_historySerializer(detailed_plan_records, many=True).data
#         return serialized_data 
    
#     def get_event_plan_of_care(self, obj):
#         detailed_plan_records = agg_hhc_enquiry_follow_up.objects.filter(eve_id=obj.event_id)
#         serialized_data = Consultants_enquiry_serializers(detailed_plan_records, many=True).data
#         return serialized_data 

#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         select_report_type = self.context.get('select_report_type')

#         if select_report_type == '1':
#             if instance.event_status == '3':
#                 return None
#             representation = {
#                 key: representation[key] for key in ['eve_id', 'event_code', 'agg_sp_pt_id', 'event_status', 'added_date', 'last_modified_date', 'event_plan_of_care']
#             }

#             if isinstance(representation['agg_sp_pt_id'], dict):
#                 patent_details = representation['agg_sp_pt_id']
#             else:
#                 patent_details = {}
                
#             del representation['agg_sp_pt_id']  # Remove the field from the representation
#             # Customize the fields to be returned for select_report_type 2
#             representation.update({
#                 'agg_sp_pt_id': {
#                     'agg_sp_pt_id': patent_details.get('agg_sp_pt_id', ''),
#                     'name': patent_details.get('name', ''),
#                     'doct_cons_id': patent_details.get('doct_cons_id', '')
#                 }
#             })
#         if select_report_type == '2':
#             if instance.enq_spero_srv_status == '3':
#                 return None
#             representation = {
#                 key: representation[key] for key in ['eve_id', 'event_code', 'agg_sp_pt_id', 'enq_spero_srv_status', 'event_status', 'added_date', 'last_modified_date', 'event_plan_of_care']
#             }

#             if isinstance(representation['agg_sp_pt_id'], dict):
#                 patent_details = representation['agg_sp_pt_id']
#             else:
#                 patent_details = {}
                
#             del representation['agg_sp_pt_id']  # Remove the field from the representation
#             # Customize the fields to be returned for select_report_type 2
#             representation.update({
#                 'agg_sp_pt_id': {
#                     'agg_sp_pt_id': patent_details.get('agg_sp_pt_id', ''),
#                     'name': patent_details.get('name', ''),
#                     'doct_cons_id': patent_details.get('doct_cons_id', '')
#                 }
#             })     
#         elif select_report_type == '3':
#             if instance.enq_spero_srv_status == '1':
#                 return None
#             if instance.enq_spero_srv_status == '2':
#                 return None
#             representation = {
#                 key: representation[key] for key in ['eve_id', 'event_code', 'agg_sp_pt_id', 'enq_spero_srv_status', 'event_status', 'added_date', 'last_modified_date', 'event_plan_of_care']
#             }

#             if isinstance(representation['agg_sp_pt_id'], dict):
#                 patent_details = representation['agg_sp_pt_id']
#             else:
#                 patent_details = {}
                
#             del representation['agg_sp_pt_id']  # Remove the field from the representation
#             # Customize the fields to be returned for select_report_type 2
#             representation.update({
#                 'agg_sp_pt_id': {
#                     'agg_sp_pt_id': patent_details.get('agg_sp_pt_id', ''),
#                     'name': patent_details.get('name', ''),
#                     'doct_cons_id': patent_details.get('doct_cons_id', '')
#                 }
#             })       
#         elif select_report_type == '4':
#             if instance.enq_spero_srv_status == '1':
#                 return None
#             if instance.enq_spero_srv_status == '2':
#                 return None
#             representation = {
#                 key: representation[key] for key in ['eve_id', 'event_code', 'agg_sp_pt_id', 'enq_spero_srv_status', 'event_status', 'added_date', 'last_modified_date', 'event_plan_of_care']
#             }

#             if isinstance(representation['agg_sp_pt_id'], dict):
#                 patent_details = representation['agg_sp_pt_id']
#             else:
#                 patent_details = {}
                
#             del representation['agg_sp_pt_id']  # Remove the field from the representation
#             # Customize the fields to be returned for select_report_type 2
#             representation.update({
#                 'agg_sp_pt_id': {
#                     'agg_sp_pt_id': patent_details.get('agg_sp_pt_id', ''),
#                     'name': patent_details.get('name', ''),
#                     'doct_cons_id': patent_details.get('doct_cons_id', '')
#                 }
#             })                              
#         return representation  

class Canceled_enquiry_serializer(serializers.ModelSerializer):
    event_code = serializers.SerializerMethodField()
    patient_name = serializers.SerializerMethodField()
    enquiry_added_date = serializers.SerializerMethodField()
    enquiry_added_by = serializers.SerializerMethodField()
    enquiry_last_modified_by = serializers.SerializerMethodField()
    service = serializers.SerializerMethodField()
    recomanded_service = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    event_stert_date = serializers.SerializerMethodField()    
    cancel_by = serializers.SerializerMethodField()
    caller_no =  serializers.SerializerMethodField()     
    canclation_reason =  serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_enquiry_follow_up
        # fields = ['enq_follow_up_id', 'event_code', 'patient_name', 'enquiry_added_date', 'enquiry_added_by', 'enquiry_last_modified_by','previous_follow_up_remark', 'service', 'recomanded_service', 'cancel_by', 'address']
        fields = ['enq_follow_up_id', 'event_code', 'event_id', 'patient_name', 'enquiry_added_date', 'enquiry_added_by', 'enquiry_last_modified_by', 
                    'event_stert_date', 
                    'previous_follow_up_remark', 'service', 'recomanded_service', 'cancel_by', 'caller_no', 'address', 'canclation_reason']

    def get_canclation_reason(self, obj):
        if hasattr(obj, 'canclation_reason'):
            event = obj.canclation_reason
            if event:
                return event.cancelation_reason
        return None

    def get_caller_no(self, obj):
        if hasattr(obj, 'event_id'):
            event = obj.event_id
            if event:
                return event.caller_id.phone
        return None
    
    
    def get_event_stert_date(self, obj):
        if hasattr(obj, 'event_id'):
            event_id = obj.event_id
            event_plan_of_care = agg_hhc_event_plan_of_care.objects.filter(eve_id=event_id).first()
            if event_plan_of_care:
                return event_plan_of_care.start_date.strftime('%Y-%m-%d')
        return None
    
    def get_event_code(self, obj):
        # data=obj.enq_follow_up_id.event_id.event_code 1 
        # data=obj.event_id.event_code  2
        # if data:
        #     return data
        # return None
        if hasattr(obj, 'event_id'):   # 3
            event = obj.event_id
            if event:
                return event.event_code
        return None        
    
    def get_patient_name(self, obj):
        # data = obj.enq_follow_up_id.event_id.agg_hhc_eve_id   # 1
        # data = obj.event_id.eve_id        2 
        # if data:
        #     return data
        # return data
        if hasattr(obj, 'event_id'):    # 3
            event = obj.event_id
            if event:
                return event.agg_sp_pt_id.name
            return None        

    def get_enquiry_added_date(self, obj):
        # data = str(obj.event_id.added_date)   1
        # if data:
        #     return data
        # return data
        if hasattr(obj, 'enq_follow_up_id') and hasattr(obj.event_id, 'event_id'):      # 2 Amit
            added_date = obj.event_id.added_date
            if added_date:
                return added_date.strftime('%Y-%m-%d')            
        return None          
    
    def get_enquiry_added_by(self, obj):
        # data = obj.event_id.added_by  1
        # if data:
        #     return data
        # return data
        if hasattr(obj, 'added_by') and hasattr(obj.event_id, 'event_id'):  # 2     Amit 
            # return obj.event_id.added_by
            added_date = obj.event_id.added_by
            if added_date:
                return added_date           
        return None          
    
    def get_enquiry_last_modified_by(self, obj):
        # data = obj.enq_follow_up_id.event_id.last_modified_by     1 
        # if data:
        #     return data
        # return data
        if hasattr(obj, 'last_modified_by') and hasattr(obj.event_id, 'event_id'):      # 2 Amit
            last_modified_by = obj.event_id.last_modified_by
            if last_modified_by:
                return last_modified_by             
        return None        
    
    def get_enquiry_last_modified_by(self, obj):
        # data=str(agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.event_id, status=1).first().start_date)   1 
        # if data:
        #     return data
        # return data

        plan_of_care = agg_hhc_enquiry_follow_up.objects.filter(event_id=obj.event_id, follow_up_status=1).first()      # 2 Amit
        if plan_of_care:
            return plan_of_care.last_modified_by
        return None   
        
    def get_service(self, obj):
        # data=agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.event_id, status=1).first().srv_id.service_title    # 1
        # if data:
        #     return data
        # return data
    
        plan_of_care = agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.event_id, status=1).first()     # 2 Amit
        if plan_of_care and plan_of_care.srv_id:
            return plan_of_care.srv_id.service_title
        return None    

    def get_recomanded_service(self, obj):
        # data=agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.event_id, status=1).first().sub_srv_id.recommomded_service  1
        # if data:
        #     return data
        # return data

        plan_of_care = agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.event_id, status=1).first()     # 2  Amit
        if plan_of_care and plan_of_care.sub_srv_id:
            return plan_of_care.sub_srv_id.recommomded_service
        return None
        
    def get_cancel_by(self, obj):
        if obj.cancel_by=='1':
            return "From Spero"
        if obj.cancel_by=='2':
            return "From Patient"
        if obj.cancel_by=='3':
            return "Other"
        
    def get_address(self, obj):
        # data =  obj.event_id.agg_sp_pt_id.address     1
        # if data:
        #     return data
        # return data

        if hasattr(obj, 'event_id'):        # 2 Amit
            event = obj.event_id
            if event:
                return event.agg_sp_pt_id.address
            return None         

class enquiry_Convert_Into_Service(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    event_code = serializers.SerializerMethodField()
    srv_id = serializers.SerializerMethodField()
    sub_srv_id = serializers.SerializerMethodField()
    caller_no = serializers.SerializerMethodField()    
    class Meta:
        model = agg_hhc_event_plan_of_care
        fields = ['eve_poc_id', 'eve_id', 'start_date', 'end_date', 'srv_id', 'sub_srv_id','patient_name', 'event_code', 'caller_no']
    

    def get_caller_no(self, obj):
        if hasattr(obj, 'eve_id'):
            event = obj.eve_id
            if event:
                return event.caller_id.phone
        return None
        
    def get_sub_srv_id(self, obj):
        # return obj.sub_srv_id.recommomded_service
        return obj.sub_srv_id.recommomded_service if obj.sub_srv_id else None   # Amit 20-05-24
    
    def get_srv_id(self, obj):
        # return obj.srv_id.service_title
        return obj.srv_id.service_title if obj.srv_id else None     # Amit 20-05-24

    def get_patient_name(self, obj):
        # event = agg_hhc_events.objects.filter(eve_id=obj.eve_id)
        # return obj.eve_id.agg_sp_pt_id.name
        return obj.eve_id.agg_sp_pt_id.name if obj.eve_id else None         # Amit 20-05-24

    def get_event_code(self, obj):
        # return obj.eve_id.event_code
        return obj.eve_id.event_code if obj.eve_id else None        # Amit 20-05-24
    
class source_of_enquiry(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    event_code = serializers.SerializerMethodField()
    srv_id = serializers.SerializerMethodField()
    sub_srv_id = serializers.SerializerMethodField()
    source_of_enquity = serializers.SerializerMethodField()
    enquiry_status = serializers.SerializerMethodField()
    caller_no = serializers.SerializerMethodField()    
    class Meta:
        model = agg_hhc_event_plan_of_care
        fields = ['eve_poc_id', 'eve_id', 'srv_id', 'sub_srv_id','patient_name', 'event_code', 'source_of_enquity', 'enquiry_status', 'caller_no']
        
    def get_caller_no(self, obj):
        if hasattr(obj, 'eve_id'):
            event = obj.eve_id
            if event:
                return event.caller_id.phone
        return None
            
    def get_sub_srv_id(self, obj):
        # return obj.sub_srv_id.recommomded_service
        if obj.sub_srv_id:                              # Amit 20-05-24
            return obj.sub_srv_id.recommomded_service
        return None        
    
    def get_srv_id(self, obj):
        # return obj.srv_id.service_title
        if obj.srv_id:                                  # Amit 20-05-24
            return obj.srv_id.service_title
        return None        

    def get_patient_name(self, obj):
        # event = agg_hhc_events.objects.filter(eve_id=obj.eve_id)
        # return obj.eve_id.agg_sp_pt_id.name
        if obj.eve_id:                                  # Amit 20-05-24
            return obj.eve_id.agg_sp_pt_id.name
        return None
    
    def get_event_code(self, obj):
        # return obj.eve_id.event_code
        if obj.eve_id:                                  # Amit 20-05-24
            return obj.eve_id.event_code
        return None    
    
    def get_source_of_enquity(self, obj):
        data = obj.eve_id.patient_service_status
        print(data.value)
        if data == patient_richedBy_status_enum.mobile:
            return 'Mobile'
        elif data == patient_richedBy_status_enum.website:
            return 'Website'
        elif data == patient_richedBy_status_enum.walking:
            return 'Walking'
        elif data == patient_richedBy_status_enum.calling:
            return 'Calling'
        else:
            return 'Unknown'
        
    def get_enquiry_status(self, obj):
        # try:return obj.eve_id.enq_spero_srv_status
        # except:return None
        
        try:
            value = obj.eve_id.enq_spero_srv_status
            for enum_member in service_status_enum1:
                if enum_member.value == value:
                    return enum_member.name
        except:
            pass
        return None 


class source_of_enquiry_report_serializer(serializers.ModelSerializer):
    agg_sp_pt_id = serializers.SerializerMethodField()
    event_start_date = serializers.SerializerMethodField()
    service = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_events
        fields = ['eve_id', 'event_code', 'agg_sp_pt_id','added_date', 'event_start_date','service']
    
    def get_agg_sp_pt_id(self, obj):
        return obj.agg_sp_pt_id.name
    
    def get_event_start_date(self, obj):
        poc = agg_hhc_event_plan_of_care.objects.filter(status=1)
        if poc:
            return poc[0].start_date
        return None
    
    def get_event_start_date(self, obj):
        poc = agg_hhc_event_plan_of_care.objects.filter(status=1)
        if poc:
            return poc[0].srv_id.service_title
        return None
    
class enquiry_within_two_hr_serializer(serializers.ModelSerializer):
    event_code = serializers.SerializerMethodField()
    service_added_date = serializers.SerializerMethodField()
    service = serializers.SerializerMethodField()
    sub_service = serializers.SerializerMethodField()
    caller_no = serializers.SerializerMethodField()    
    class Meta:
        model = agg_hhc_event_plan_of_care
        fields = ['eve_poc_id', 'event_code', 'start_date', 'end_date', 'added_date', 'service_added_date', 'service', 'sub_service', 'caller_no']


    def get_caller_no(self, obj):
        if hasattr(obj, 'eve_id'):
            event = obj.eve_id
            if event:
                return event.caller_id.phone
        return None
    
    def get_event_code(self, obj):
        # return obj.eve_id.event_code
        if obj.eve_id:                                  # Amit 20-05-24
            return obj.eve_id.event_code
        return None        
    
    def get_service_added_date(self, obj):
        # dt_eve = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id = obj.eve_id).order_by('eve_id', 'agg_sp_dt_eve_poc_id').distinct('eve_id').first()
        # if dt_eve:
        #     return str(dt_eve.added_date)
        dt_eve = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id).order_by('eve_id', 'agg_sp_dt_eve_poc_id').distinct('eve_id').first()                                  # Amit 20-05-24        
        if dt_eve:
            return str(dt_eve.added_date.date())
        return None
            
    def get_service(self, obj):
        # return obj.srv_id.service_title
        if obj.srv_id:                                  # Amit 20-05-24
            return obj.srv_id.service_title
        return None        
    
    def get_sub_service(self, obj):
        # return obj.sub_srv_id.recommomded_service
        if obj.sub_srv_id:                                    # Amit 20-05-24
            return obj.sub_srv_id.recommomded_service
        return None        
    



#  Amit 

import logging

logger = logging.getLogger(__name__)

class consent_doc_serializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()

    class Meta:
        model = DischargeFile
        fields = ['ds_id', 'file', 'added_by', 'added_date']

    def get_file(self, obj):
        request = self.context.get('request')
        if request:
            file_url = request.build_absolute_uri(obj.file.url)
            logger.info(f"Generated file URL: {file_url}")
            return file_url
        logger.info(f"Relative file URL: {obj.file.url}")
        return obj.file.url

class Consent_view_documents_sign_serializer(serializers.ModelSerializer):
    sign = serializers.SerializerMethodField()
    Discharge_summ_docs = consent_doc_serializer(many=True)

    class Meta:
        model = agg_hhc_concent_form_details
        fields = ['con_id', 'eve_id', 'sign', 'Discharge_summ_docs']

    def get_sign(self, obj):
        request = self.context.get('request')
        if request:
            sign_url = request.build_absolute_uri(obj.sign.url)
            logger.info(f"Generated sign URL: {sign_url}")
            return sign_url
        logger.info(f"Relative sign URL: {obj.sign.url}")
        return obj.sign.url





class Job_closure_serializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    service_from = serializers.SerializerMethodField()
    service_to = serializers.SerializerMethodField()
    prof_name_session = serializers.SerializerMethodField()
    service_name = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_events
        fields = ['eve_id', 'event_code', 'patient_name','prof_name_session', 'service_from', 'service_to', 'service_name']

    def get_patient_name(self, obj):
        return obj.agg_sp_pt_id.name
    
    def get_service_from(self, obj):
        data = agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.eve_id, status=1).first()
        if data and data.start_date:
            return str(data.start_date)
        else: 
            return None
    
    def get_service_to(self, obj):
        data = agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.eve_id, status=1).first()
        if data and data.start_date:
            return str(data.end_date)
        else: 
            return None
        
    def get_service_name(self, obj):
        data = agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.eve_id, status=1).first()
        caller_data = agg_hhc_events.objects.get(eve_id=obj.eve_id)
        if data:
            info={
                "caller_number": caller_data.caller_id.phone,
                "service":data.srv_id.service_title,
                "sub_service": data.sub_srv_id.recommomded_service
                
            }
            return info   
        else:
            return None



    def get_prof_name_session(self, obj):
        data = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id, status = 1)
        # print('1')
        prof = set([d.srv_prof_id.srv_prof_id if d.srv_prof_id else None for d in data])
        # print('2')s
        professional={}
        # print('3')
        for d in prof:
            # print('4')
            # professional['name']=(data.filter(srv_prof_id=d).first()).srv_prof_id.prof_fullname
            filtered_data = data.filter(srv_prof_id=d).first()
        
            if filtered_data and filtered_data.srv_prof_id:
                professional['name'] = filtered_data.srv_prof_id.prof_fullname
            else:
                professional['name'] = None
            # print('5')
            professional['closure_completed'] = data.filter(srv_prof_id=d,Session_jobclosure_status=1 ).count()
            # print('6')
            professional['closure_pending'] = data.filter(srv_prof_id=d,Session_jobclosure_status=2 ).count()
            # print('7')
        # print(professional, ';;;;;;;;sdfa')
        return professional
    







