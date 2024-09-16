from rest_framework import serializers
from hhcweb.models import *
from django.db.models import Q
from datetime import datetime, timedelta
from django.db.models import Sum, F, ExpressionWrapper, DecimalField
from decimal import Decimal
from rest_framework import status
from datetime import time
import pytz

class UserRegistrationSerializer3(serializers.ModelSerializer):
    class Meta:
        model  = agg_com_colleague
        # fields = '__all__'
        fields = ['pk', 'clg_ref_id']

    def validate(self, data):
        return data
    

class UserLoginInfoSerializer(serializers.ModelSerializer):

    class Meta:
        model = ems_colleague_login_logout_info
        # fields = ['id', 'clg_id']
        fields = ['clg_id', 'clg_login_time', 'device_os_name']
        # fields = '__all__'
    

class agg_hhc_service_professionals_serializer2(serializers.Serializer):
    #clg_ref_id = serializers.PrimaryKeyRelatedField(queryset=agg_com_colleague.objects.all(),many=False)

    class Meta:
        model = agg_hhc_service_professionals
        fields = ['srv_prof_id', 'clg_ref_id', 'phone_no', 'work_phone_no', 'OTP', 'OTP_count', 'otp_expire_time']

    def validate(self, data):
        return data
        
    def create(self,validated_data):
        ref_id_data = validated_data.pop('clg_ref_id')
        validated_data['clg_ref_id'] = ref_id_data
        pro_obj = agg_hhc_service_professionals.objects.create(**validated_data)
        return pro_obj
    

class UserRegistrationSerializer2(serializers.ModelSerializer):
    class Meta:
        model  = agg_com_colleague
        fields = ['pk', 'clg_Work_phone_number', 'clg_otp', 'clg_otp_expire_time', 'clg_otp_count', 'grp_id']

    def validate(self, data):
        return data
    
class UserCallerSerializer2(serializers.ModelSerializer):
    class Meta:
        model  = agg_hhc_callers
        fields = ['caller_id', 'clg_ref_id', 'phone', 'otp', 'otp_expire_time']

    def validate(self, data):
        return data
    
class agg_hhc_sos_dtl_serializer(serializers.ModelSerializer):
    srv_prof_id = serializers.PrimaryKeyRelatedField(queryset=agg_hhc_service_professionals.objects.all(),many=False)
    dtl_eve_id = serializers.PrimaryKeyRelatedField(queryset=agg_hhc_detailed_event_plan_of_care.objects.all(),many=False)
    class Meta:
        model  = sos_details
        fields = ['sos_id', 'srv_prof_id', 'dtl_eve_id', 'last_modified_by']

    def validate(self, data):
        return data
    
    def create(self, validated_data):
        srv_prof_id = validated_data.pop('srv_prof_id')
        dtl_eve_id = validated_data.pop('dtl_eve_id')

        validated_data['srv_prof_id'] = srv_prof_id
        validated_data['dtl_eve_id'] = dtl_eve_id

        sos_dtl = sos_details.objects.create(**validated_data)
        sos_dtl.save(force_insert=False)
        return sos_dtl


class UserProfileSerializer2(serializers.ModelSerializer):
    class Meta:
        model = agg_com_colleague
        # fields = '__all__'
        fields = ['clg_first_name', 'clg_mid_name', 'clg_last_name', 'clg_designation', 'clg_email', 'clg_gender', 'clg_address', 'clg_state', 'clg_district', 'clg_Date_of_birth', 'clg_Work_phone_number', 'clg_mobile_no', 'clg_profile_photo_path']

        def update(self, instance, validated_data):
            if self.context['request'].method == "POST":
                self.fields.pop('password')
                instance.clg_first_name = validated_data.get('clg_first_name', instance.clg_first_name)
                instance.clg_mid_name = validated_data.get('clg_mid_name', instance.clg_mid_name)
                instance.clg_last_name = validated_data.get('clg_last_name', instance.clg_last_name)
                instance.clg_email = validated_data.get('clg_email', instance.clg_email)
                instance.clg_gender = validated_data.get('clg_gender', instance.clg_gender)
                instance.clg_address = validated_data.get('clg_address', instance.clg_address)
                instance.clg_designation = validated_data.get('clg_designation', instance.clg_designation)
                instance.clg_state = validated_data.get('clg_state', instance.clg_state)
                instance.clg_district = validated_data.get('clg_district', instance.clg_district)
                instance.clg_Date_of_birth = validated_data.get('clg_Date_of_birth', instance.clg_Date_of_birth)
                instance.clg_Work_phone_number = validated_data.get('clg_Work_phone_number', instance.clg_Work_phone_number)
                instance.clg_profile_photo_path = validated_data.get('clg_profile_photo_path', instance.clg_profile_photo_path)
                instance.clg_mobile_no = validated_data.get('clg_mobile_no', instance.clg_mobile_no)

                print(instance)
                instance.save()
                return instance
            
        def validate(self, data):
            return data
class UserProfileSerializer3(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_service_professionals
        # fields = '__all__'
        fields = ['profile_file', 'prof_fullname', 'Ratings', 'Reviews', 'srv_id', 'Experience', 'professional_code','email_id']
            
        def validate(self, data):
            return data
class UserProfileSerializer4(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_service_professionals
        # fields = '__all__'
        fields = ['profile_file']

        def update(self, instance, validated_data):
            if self.context['request'].method == "PUT":
                instance.profile_file = validated_data.get('profile_file', instance.profile_file)
                print("Instance------------", instance)
                instance.save()
                return instance
            
        def validate(self, data):
            return data
    
class agg_hhc_professional_location_serializer(serializers.ModelSerializer):

    srv_prof_id = serializers.PrimaryKeyRelatedField(queryset=agg_hhc_service_professionals.objects.all(),many=False)

    class Meta:
        model  = agg_hhc_professional_location

        fields = ['prof_loc_id','srv_prof_id', 'location_name', 'last_modified_by']
        
    def validate(self, data):
        return data
    
    def create(self, validated_data):
        srv_prof_id = validated_data.pop('srv_prof_id')

        validated_data['srv_prof_id'] = srv_prof_id

        pro_loc = agg_hhc_professional_location.objects.create(**validated_data)
        pro_loc.save(force_insert=False)
        return pro_loc
    
class agg_hhc_professional_location_details_serializer(serializers.ModelSerializer):

    prof_loc_id = serializers.PrimaryKeyRelatedField(queryset=agg_hhc_professional_location.objects.all(),many=False)

    class Meta:
        model  = agg_hhc_professional_location_details

        fields = ['prof_loc_dt_id','lattitude', 'longitude', 'location_name', 'prof_loc_id', 'last_modified_by']
        
    def validate(self, data):
        return data
    
    def create(self, validated_data):
        prof_loc_id = validated_data.pop('prof_loc_id')

        validated_data['prof_loc_id'] = prof_loc_id

        pro_loc_details = agg_hhc_professional_location_details.objects.create(**validated_data)
        pro_loc_details.save(force_insert=False)
        return pro_loc_details
    
class agg_hhc_professional_location_zones_serializer(serializers.ModelSerializer):

    prof_loc_dtl_id = serializers.PrimaryKeyRelatedField(queryset=agg_hhc_professional_location_details.objects.all(),many=False)
    prof_zone_id = serializers.PrimaryKeyRelatedField(queryset=agg_hhc_professional_zone.objects.all(),many=False)
    srv_prof_id = serializers.PrimaryKeyRelatedField(queryset=agg_hhc_service_professionals.objects.all(),many=False)

    class Meta:
        model  = agg_hhc_professional_locations_as_per_zones

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

        pro_loc_zone_details = agg_hhc_professional_locations_as_per_zones.objects.create(**validated_data)
        pro_loc_zone_details.save(force_insert=False)
        return pro_loc_zone_details

    
class agg_hhc_prof_availability_serializer(serializers.ModelSerializer):

    srv_prof_id = serializers.PrimaryKeyRelatedField(queryset=agg_hhc_service_professionals.objects.all(),many=False)

    class Meta:
        model  = agg_hhc_professional_availability

        fields = ['professional_avaibility_id','srv_prof_id', 'day', 'last_modified_by']
        
    def validate(self, data):
        return data
    
    def create(self, validated_data):
        srv_prof_id = validated_data.pop('srv_prof_id')

        validated_data['srv_prof_id'] = srv_prof_id

        pro_loc = agg_hhc_professional_availability.objects.create(**validated_data)
        pro_loc.save(force_insert=False)
        return pro_loc
    
    def update(self, instance, validated_data):
        return instance


class agg_hhc_professional_availability_detail_serializer(serializers.ModelSerializer):

    prof_avaib_id = serializers.PrimaryKeyRelatedField(queryset=agg_hhc_professional_availability.objects.all(),many=False)
    prof_loc_zone_id = serializers.PrimaryKeyRelatedField(queryset=agg_hhc_professional_locations_as_per_zones.objects.all(),many=False)

    class Meta:
        model  = agg_hhc_professional_availability_detail

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

        
        occupied_time = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=prof_avaib_id)
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

        pro_loc_details = agg_hhc_professional_availability_detail.objects.create(**validated_data)
        pro_loc_details.save(force_insert=False)
        return pro_loc_details 
    
class agg_hhc_professional_availability_detail_serializer2(serializers.ModelSerializer):

    prof_avaib_id = serializers.PrimaryKeyRelatedField(queryset=agg_hhc_professional_availability.objects.all(),many=False)
    prof_zone_id = serializers.PrimaryKeyRelatedField(queryset=agg_hhc_professional_zone.objects.all(),many=False)
    

    class Meta:
        model  = agg_hhc_professional_availability_detail

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

        
        occupied_time = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=prof_avaib_id)
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

        pro_loc_details = agg_hhc_professional_availability_detail.objects.create(**validated_data)
        pro_loc_details.save(force_insert=False)
        return pro_loc_details   






class professional_otp_dtl(serializers.ModelSerializer):
    class Meta:
        model  = SMS_sent_details
        fields = ["professional_name","contact_number","sent_status","sms_type","status","added_by"]




# ---------------------------------------- Professional Register ---------------------------
from hhcweb.models import Professional_status
class colleage_add_prof_data(serializers.ModelSerializer):
    class Meta:
        model = agg_com_colleague
        # fields = ['','clg_email','']
        fields = ['clg_email', 'clg_first_name', 'clg_gender', 'clg_mobile_no', 'clg_Work_phone_number','clg_Date_of_birth',
        'clg_address', 'clg_state','clg_district']

class reg_prof_api_serializer(serializers.ModelSerializer):

    class Meta:
        model = agg_hhc_service_professionals
        fields = ['srv_id', 'title','prof_fullname','dob','gender','email_id','phone_no','alt_phone_no','eme_contact_no','eme_contact_relation',
                  'eme_conact_person_name','mode_of_service','availability_status','prof_zone_id','lattitude','langitude','state_name','prof_address','city','pin_code_id',
                  'prof_sub_srv_id','Education_level','cv_file','certificate_registration_no','availability']
                  
    
    def create(self, validated_data):
        # You can set the enum value you want here
        validated_data['professinal_status'] = Professional_status.Info_Submitted
        instance = super(reg_prof_api_serializer, self).create(validated_data)
        return instance
    

class register_prof_sub_services(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_professional_sub_services
        fields = ['srv_prof_id','sub_srv_id']
# ------------------------------Professional document upload -------------------------------------------
class agg_hhc_add_document_serializer(serializers.ModelSerializer):
    # doc_li_id = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_professional_documents
        fields = ['prof_doc_id','srv_prof_id','doc_li_id','professional_document', 'last_modified_by']

    # def validate(self, data):
    #     doc_li_id = data.get('doc_li_id')
    #     if doc_li_id != None: 
    #         return data
    #     else:
    #         errors = {"doc_li_id": "doc_li_id cannot be null."}
    #         # raise serializers.ValidationError(errors)
    #         try:
    #             raise serializers.ValidationError('Name must be John Doe')
    #         except serializers.ValidationError as e:
    #            print(e)
class professional_role(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_services
        fields = ['service_title','srv_id']

class agg_hhc_document_list_serializer(serializers.ModelSerializer):
    professional_role = professional_role()
    class Meta:
        model = agg_hhc_documents_list
        fields = ['doc_li_id','Documents_name','professional_role']

class agg_hhc_add_location_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_professional_location
        fields = ['prof_loc_id','srv_prof_id','location_name', 'last_modified_by']

class agg_hhc_add_dtl_location_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_professional_location_details
        fields = ['prof_loc_dt_id','lattitude','longitude','prof_loc_id', 'last_modified_by']
# -----------------------mayank-----------------------------app----------------------
from rest_framework import serializers
from django.db.models import Sum
from decimal import Decimal

class get_ongoing_sesson(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_detailed_event_plan_of_care
        fields = ['eve_id', 'index_of_Session', 'srv_prof_id', 'actual_StartDate_Time', 'actual_EndDate_Time','start_time','end_time',
                  'status']
class get_ptn_dtl(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_patients
        fields = ['agg_sp_pt_id', 'name', 'address']

class UpcomingServiceAppSerializer(serializers.ModelSerializer):
    Total_amount = serializers.SerializerMethodField()
    Pending_amount = serializers.SerializerMethodField()
    patient_dtl = serializers.SerializerMethodField()
    ongoing_sesson = serializers.SerializerMethodField()
    upcomming_sesson = serializers.SerializerMethodField()
    completed_sesson = serializers.SerializerMethodField()
    requested_cancel = serializers.SerializerMethodField()
    requested_reschedule = serializers.SerializerMethodField()
    # Use ForeignKey or OneToOneField to access related fields
    # address = serializers.CharField(source='agg_hhc_patients.address')
    # name = serializers.CharField(source='agg_hhc_patients.name')

    class Meta:
        model = agg_hhc_event_plan_of_care
        fields = ['eve_poc_id', 'eve_id', 'start_date', 'end_date','start_time','end_time', 'srv_prof_id','patient_dtl','status','service_status', 'srv_id', 'Total_amount', 'Pending_amount' ,'requested_cancel','requested_reschedule','ongoing_sesson','upcomming_sesson','completed_sesson']
    

    def get_requested_reschedule(self, obj):
        get_request = agg_hhc_cancellation_and_reschedule_request.objects.filter(eve_id = obj.eve_id, epoc_id=obj.eve_poc_id, is_reschedule=1,professional_request_status=3)
        if get_request.exists():  
            return True
        else:
            return False
        
    def get_requested_cancel(self, obj):
        get_request = agg_hhc_cancellation_and_reschedule_request.objects.filter(eve_id = obj.eve_id, epoc_id=obj.eve_poc_id, is_canceled=1,professional_request_status=3)
        if get_request.exists():  
            return True
        else:
            return False
        
    def to_representation(self, instance):
       # Serialize the instance using the default representation
       data = super().to_representation(instance)
       
       # Add the "service_title" field from the related "agg_hhc_services" instance
       data['service_title'] = instance.srv_id.service_title
       return data

    def get_Total_amount(self, obj):
        event_id = obj.eve_id_id 
        total_amt = agg_hhc_events.objects.filter(eve_id=event_id,status=1).aggregate(Sum('final_amount'))['final_amount__sum']
        return total_amt if total_amt is not None else 0

    def get_Pending_amount(self, obj):
        event_id = obj.eve_id_id
        total_amt_agg = agg_hhc_events.objects.filter(eve_id=event_id,status=1).aggregate(Sum('final_amount'))
        total_paid_agg = agg_hhc_payment_details.objects.filter(eve_id=event_id,status=1,overall_status="SUCCESS").aggregate(Sum('amount_paid'))
        total_amt = total_amt_agg['final_amount__sum'] or Decimal('0.0')
        total_paid = total_paid_agg['amount_paid__sum'] or Decimal('0.0')
        Pending_amt = float(total_amt) - float(total_paid)
        return Pending_amt
    
    def get_ongoing_sesson(self, obj):
        
        eve_id = obj.eve_id
        today_date = timezone.now().date()
        ongoing_sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(
            eve_id=eve_id,
            actual_StartDate_Time=today_date,status=1
            ) 

        serialized_sessions = get_ongoing_sesson(ongoing_sessions, many=True)

        return serialized_sessions.data
    
    def get_upcomming_sesson(self, obj):

        eve_id = obj.eve_id
        tomorrow_date = timezone.now().date() + timedelta(days=1)
        ongoing_sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(
            eve_id=eve_id,
            actual_StartDate_Time__gte=tomorrow_date,status=1
            )

        serialized_sessions = get_ongoing_sesson(ongoing_sessions, many=True)

        return serialized_sessions.data
    
    def get_completed_sesson(self, obj):

        eve_id = obj.eve_id
        
        ongoing_sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(
            eve_id=eve_id,
            Session_status=Session_status_enum.Completed,status=1
            )

        serialized_sessions = get_ongoing_sesson(ongoing_sessions, many=True)

        return serialized_sessions.data
    def get_patient_dtl(self, obj):
      eve_id_instance = obj.eve_id
      serialized_sessions = get_ptn_dtl(eve_id_instance.agg_sp_pt_id)
      return serialized_sessions.data
# ----------------------------PROfessional app feedback----------------------

class agg_hhc_get_role_serializer(serializers.ModelSerializer):
   class Meta:
        model = agg_hhc_services
        fields = ['srv_id','service_title']

class Pro_app_feedback_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_Professional_app_feedback
        fields = ['feedbk_id', 'srv_prof_id', 'pt_id', 'eve_id', 'rating', 'comment', 'date_time', 'q1', 'q2', 'q3', 'image', 'vedio', 'audio']







# ----------------------------  Professional Ongoing service and session  --------------
class get_ongoing_sesson(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_detailed_event_plan_of_care
        fields = ['eve_id', 'index_of_Session', 'srv_prof_id', 'actual_StartDate_Time', 'actual_EndDate_Time','start_time','end_time',
                  'status']

class get_ptn_dtl(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_patients
        fields = ['agg_sp_pt_id', 'name', 'address','lattitude','langitude']


class Ongoing_srv_sess_serializer(serializers.ModelSerializer):
    srv_id = professional_role()
    Total_amount = serializers.SerializerMethodField()
    Pending_amount = serializers.SerializerMethodField()
    ongoing_sesson = serializers.SerializerMethodField()
    patient_dtl = serializers.SerializerMethodField()
    requested_cancel = serializers.SerializerMethodField()
    requested_reschedule = serializers.SerializerMethodField()

    class Meta:
        model = agg_hhc_event_plan_of_care
        fields = ['eve_poc_id','srv_prof_id', 'eve_id', 'patient_dtl', 'srv_id', 'start_date', 'end_date','start_time','end_time', 'Total_amount',
                  'Pending_amount','requested_cancel','requested_reschedule','ongoing_sesson']
    
    def get_requested_reschedule(self, obj):
        get_request = agg_hhc_cancellation_and_reschedule_request.objects.filter(eve_id = obj.eve_id, epoc_id=obj.eve_poc_id, is_reschedule=1)
        if get_request.exists():  
            return True
        else:
            return False
        
    def get_requested_cancel(self, obj):
        get_request = agg_hhc_cancellation_and_reschedule_request.objects.filter(eve_id = obj.eve_id, epoc_id=obj.eve_poc_id, is_canceled=1)
        if get_request.exists():  
            return True
        else:
            return False


    def get_Total_amount(self, obj):
       
        event_id = obj.eve_id_id 
        total_amt = agg_hhc_events.objects.filter(eve_id=event_id,status=1).aggregate(Sum('final_amount'))['final_amount__sum']

        return total_amt if total_amt is not None else 0
    
    def get_Pending_amount(self, obj):
      
        event_id = obj.eve_id_id

        total_amt_agg = agg_hhc_events.objects.filter(eve_id=event_id,status=1).aggregate(Sum('final_amount'))
        total_paid_agg = agg_hhc_payment_details.objects.filter(eve_id=event_id,status=1,overall_status="SUCCESS").aggregate(Sum('amount_paid'))

        total_amt = total_amt_agg['final_amount__sum'] or Decimal('0.0')
        total_paid = total_paid_agg['amount_paid__sum'] or Decimal('0.0')

        Pending_amt = float(total_amt) - float(total_paid)
        return Pending_amt
    
    def get_ongoing_sesson(self, obj):
        
        eve_id = obj.eve_id
        today_date = timezone.now().date()
        ongoing_sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(
            eve_id=eve_id,
            actual_StartDate_Time=today_date,status=1
            ) 

        serialized_sessions = get_ongoing_sesson(ongoing_sessions, many=True)

        return serialized_sessions.data
    
    def get_patient_dtl(self, obj):
        eve_id_instance = obj.eve_id
        serialized_sessions = get_ptn_dtl(eve_id_instance.agg_sp_pt_id)
        return serialized_sessions.data

#==========-------------Cancel services------(mayank)-------===================
class get_ptn_dtl(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_patients
        fields = ['agg_sp_pt_id', 'name','phone_no', 'address','lattitude','langitude']
class EVEPLANOFCARE(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_event_plan_of_care
        fields = ('srv_id','srv_prof_id',)
class cancellation_history(serializers.ModelSerializer):
    patient_dtl = serializers.SerializerMethodField()
    srv = EVEPLANOFCARE()

#-----------------------------vishal is using this serializer so don't touch it #----------------------------------

class service_closure_serializer(serializers.ModelSerializer):
    # patient=serializers.SerializerMethodField()
    class Meta:
        model=agg_hhc_events
        fields=['eve_id','event_code','caller_id','added_from_hosp','agg_sp_pt_id','purp_call_id','event_date','note','enquiry_added_date','enquiry_status','enquiry_cancellation_reason','enquiry_cancel_date','Total_cost','discount_type','discount_value','final_amount','day_convinance','total_convinance','isConvertedService','Suffered_from','address_id','enq_spero_srv_status','event_status','refer_by','Patient_status_at_present','patient_service_status']
    # def get_patient(self, instance):
    #     patient_id_is = instance.patient
    #     state_name_serializer = agg_hhc_patients(patient_id_is)
    #     return state_name_serializer.data

class agg_hhc_caller_number_serializer(serializers.ModelSerializer):
    class Meta:
        model=agg_hhc_callers
        fields=['phone']


class preffered_proffesional(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_doctors_consultants
        fields = ['doct_cons_id','cons_fullname','mobile_no']


class agg_hhc_patients_serializer_from_pro_app(serializers.ModelSerializer):
    doct_cons=serializers.SerializerMethodField()
    class Meta:
        model=agg_hhc_patients
        fields=['agg_sp_pt_id','doct_cons','caller_id','caller_rel_id','hhc_code','name','Age','gender_id','patient_email_id','state_id','city_id','address','google_address','prof_zone_id','pincode','otp','otp_expire_time','Suffered_from','hospital_name','preferred_hosp_id','phone_no','dob','status','isVIP','lattitude','langitude','Profile_pic','last_modified_by']
        # fields='__all__'
    def get_doct_cons(self,instance):
        doct_cons_id_is=instance.doct_cons_id
        gender_id_serializer=preffered_proffesional(doct_cons_id_is)
        return gender_id_serializer.data
    def get_dob(self,obj):
        if obj.dob!=None:
            return obj.dob.strftime("%d-%m-%Y")
        else:
            return None


class patient_serializer_to_select_number_to_send_opt(serializers.ModelSerializer):
    numbers=serializers.SerializerMethodField()
    #number2=serializers.SerializerMethodField()
    class Meta:
        model=agg_hhc_patients
        fields=['numbers']
    def get_numbers(self, instance):
        patient_id_is=instance.agg_sp_pt_id
        patient_serializer=agg_hhc_patients_serializer_from_pro_app(patient_id_is)
        caller_id_is = instance.caller_id
        caller_name_serializer =agg_hhc_caller_number_serializer(caller_id_is)
        return [{'phone_no':caller_name_serializer.data.get('phone')},{'phone_no':instance.phone_no}]
    

class agg_hhc_payment_details_serializer(serializers.ModelSerializer):
    class Meta:
        model=agg_hhc_payment_details
        fields=['pay_dt_id','eve_id','srv_prof_id','Total_cost','paid_by','amount_paid','amount_remaining','pay_recived_by','date','mode','cheque_number','bank_name','cheque_date','note','cheque_image','order_id','order_currency','order_note','customer_email','customer_phone','payment_status','online_payment_by','status','last_modified_by','overall_status','added_by','last_modified_by']
        # fields='__all__'
    def validate(self, data):
        return data
    def get_date(self,obj):
        if obj.date!=None:
            return obj.date.strftime("%d-%m-%Y")
        else:
            return None
    def get_cheque_date(self,obj):
        if(obj.cheque_date!=None):
            return obj.cheque_date.strftime("%d-%m-%Y")
        else:
            return None

    


class agg_hhc_patients_serializer_for_Patient_detail(serializers.ModelSerializer):
    class Meta:
        model=agg_hhc_patients
        fields=['agg_sp_pt_id','name','address','phone_no','Profile_pic']

class agg_hhc_event_plan_of_care_serializer(serializers.ModelSerializer):
    class Meta:
        model=agg_hhc_event_plan_of_care
        fields=['eve_poc_id','eve_id','srv_id','sub_srv_id','hosp_id','doct_cons_id','srv_prof_id','No_session_dates','start_date','end_date','start_time','end_time','initail_final_amount','service_reschedule','prof_prefered','status','remark','service_status']



class agg_hhc_events_serializers1(serializers.ModelSerializer): 
    class Meta:
        model=agg_hhc_events
        fields=['eve_id','event_code','caller_id','added_from_hosp','agg_sp_pt_id','purp_call_id','bill_no_ref_no','event_date','note','enquiry_added_date','enquiry_status','enquiry_cancellation_reason','enquiry_cancel_date','Total_cost','discount_type','discount_value','final_amount','status','day_convinance','total_convinance','isArchive','isConvertedService','Invoice_narration','invoice_narration_desc','branch_code','Suffered_from','OTP','OTP_count','otp_expire_time','address_id','enq_spero_srv_status','event_status','refer_by','Patient_status_at_present','patient_service_status','last_modified_by']
        # fields="__all__"

class list_pays_serializer(serializers.ModelSerializer):
    class Meta:
        model=agg_hhc_payment_details
        fields=['pay_dt_id', 'eve_id', 'Total_cost', 'amount_paid', 'amount_remaining','overall_status','pay_recived_by']


class agg_hhc_transport_serializer(serializers.ModelSerializer):
    class Meta:
        model=agg_hhc_transport
        fields=['srv_prof_id', 'pass_number', 'Transport_type', 'start_date', 'end_date', 'vehicle_type']
    def get_start_date(self,obj):
        return obj.start_date.strftime('%d-%m-%Y')
    def get_end_date(self,obj):
        return obj.end_date.strftime('%d-%m-%Y')

        # fields='__all__'

class agg_hhc_transport_serializer1(serializers.ModelSerializer):
    srv_prof_id = serializers.PrimaryKeyRelatedField(queryset=agg_hhc_service_professionals.objects.all(),many=False)
    class Meta:
        model=agg_hhc_transport
        fields=['srv_prof_id', 'pass_number', 'Transport_type', 'start_date', 'end_date', 'vehicle_type', 'last_modified_by']

    def create(self, validated_data):
        srv_prof_id = validated_data.pop('srv_prof_id')
        validated_data['srv_prof_id'] = srv_prof_id

        trans = agg_hhc_transport.objects.create(**validated_data)
        trans.save(force_insert=False)
        return trans 

class agg_hhc_transport_serializer2(serializers.ModelSerializer):
    srv_prof_id = serializers.PrimaryKeyRelatedField(queryset=agg_hhc_service_professionals.objects.all(),many=False)
    class Meta:
        model=agg_hhc_transport
        fields=['srv_prof_id', 'Transport_type', 'vehicle_type']

    def create(self, validated_data):
        srv_prof_id = validated_data.pop('srv_prof_id')
        validated_data['srv_prof_id'] = srv_prof_id

        trans = agg_hhc_transport.objects.create(**validated_data)
        trans.save(force_insert=False)
        return trans 
















#----------------------------------------sessions---(mayank)-----------------------
class srv_sess_serializer(serializers.ModelSerializer):
    patient_dtl = serializers.SerializerMethodField()
    Total_amount = serializers.SerializerMethodField()
    Pending_amount = serializers.SerializerMethodField()
    requested_cancel = serializers.SerializerMethodField()
    requested_reschedule = serializers.SerializerMethodField()
    total_session_count = serializers.SerializerMethodField()
    event_discount=serializers.SerializerMethodField()
    session_start_status=serializers.SerializerMethodField()
    vip_status=serializers.SerializerMethodField()
    last_session=serializers.SerializerMethodField()
    professional_last_session=serializers.SerializerMethodField()
    rechedule_status=serializers.SerializerMethodField()
    previous_session_remain=serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_detailed_event_plan_of_care
        fields = ['eve_id', 'eve_poc_id', 'agg_sp_dt_eve_poc_id', 'agg_sp_dt_eve_poc_id', 'index_of_Session', 'srv_prof_id', 'actual_StartDate_Time',
                  'Total_amount','Pending_amount','actual_EndDate_Time','start_time','end_time', 'patient_dtl', 'Session_status', 'requested_cancel',
                  'requested_reschedule','status','total_session_count','Session_jobclosure_status','event_discount','session_start_status','vip_status','last_session','professional_last_session','payment_skip','rechedule_status','previous_session_remain']
    def get_event_discount(self,obj):
        event_id = obj.eve_id_id
        discount=agg_hhc_events.objects.get(eve_id=event_id)
        return discount.discount_type

    def get_actual_StartDate_Time(self,obj):
        if obj.actual_StartDate_Time!=None:
            # return obj.actual_StartDate_Time.strftime("%d-%m-%Y")
            return obj.actual_StartDate_Time
        else:
            return None
    def get_actual_EndDate_Time(self,obj):
        if obj.actual_EndDate_Time!=None:
            # return obj.actual_EndDate_Time.strftime("%d-%m-%Y")
            return obj.actual_EndDate_Time
        else:
            return None

    def get_total_session_count(self, obj):
        get_total_session = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_poc_id=obj.eve_poc_id, eve_id=obj.eve_id, status=1).count()
        return get_total_session
             
    def get_requested_reschedule(self, obj):
        get_request = agg_hhc_cancellation_and_reschedule_request.objects.filter(eve_id = obj.eve_id, epoc_id=obj.eve_poc_id,dtl_eve_id=obj.agg_sp_dt_eve_poc_id,is_reschedule=1,professional_request_status=3)
        if get_request.exists():  
            return True
        else:
            return False
        
    def get_requested_cancel(self, obj):
        get_request = agg_hhc_cancellation_and_reschedule_request.objects.filter(eve_id = obj.eve_id, epoc_id=obj.eve_poc_id,dtl_eve_id=obj.agg_sp_dt_eve_poc_id, is_canceled=1,professional_request_status=3)
        if get_request.exists():  
            return True
        else:
            return False
        
    def get_patient_dtl(self, obj):
        eve_id_instance = obj.eve_id
        serialized_sessions = get_ptn_dtl(eve_id_instance.agg_sp_pt_id)
        return serialized_sessions.data
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # data['recommomded_service'] = instance.eve_poc_id.sub_srv_id.recommomded_service
        # data['sub_service_id'] = instance.eve_poc_id.sub_srv_id
        recommomded_service_name = None
        recommomded_service_id = None
        if instance.eve_poc_id:
            event_plan_of_care = instance.eve_poc_id
            if event_plan_of_care.sub_srv_id:
                recommomded_service_name = event_plan_of_care.sub_srv_id.recommomded_service
                recommomded_service_id = event_plan_of_care.sub_srv_id.sub_srv_id
        data['recommomded_service_name'] = recommomded_service_name
        data['recommomded_service_id'] = recommomded_service_id
        return data

    def get_Total_amount(self, obj):
        event_id = obj.eve_id_id 
        total_amt = agg_hhc_events.objects.filter(eve_id=event_id,status=1).aggregate(Sum('final_amount'))['final_amount__sum']
        return total_amt if total_amt is not None else 0
    
    def get_Pending_amount(self, obj):  
        event_id = obj.eve_id_id
        total_amt_agg = agg_hhc_events.objects.filter(eve_id=event_id,status=1).aggregate(Sum('final_amount'))
        total_paid_agg = agg_hhc_payment_details.objects.filter(eve_id=event_id,status=1,overall_status="SUCCESS").aggregate(Sum('amount_paid'))
        total_amt = total_amt_agg['final_amount__sum'] or Decimal('0.0')
        total_paid = total_paid_agg['amount_paid__sum'] or Decimal('0.0')
        Pending_amt = float(total_amt) - float(total_paid)
        return Pending_amt
    def get_session_start_status(self,obj):
        hr1add=(timezone.now() + timedelta(hours=1)).time()
        if(obj.start_time<hr1add):
            return True
        else:
            return False


    def get_vip_status(self,obj):
        event_id = obj.eve_id_id
        total_amt_agg = agg_hhc_events.objects.filter(eve_id=event_id,status=1).last()
        discount_type=None
        try:
            if (int(total_amt_agg.discount_type)==1):
                discount_type="In_Percentage"
            elif(int(total_amt_agg.discount_type)==2):
                discount_type="In_amount"
            elif(int(total_amt_agg.discount_type)==3):
                discount_type="complimentary"
            elif(int(total_amt_agg.discount_type)==4):
                discount_type="VIP"
            else:
                discount_type="No_discount"
            return discount_type
        except Exception as e:
            discount_type="No_discount"
            return discount_type
    
    def get_last_session(self,obj):
        event_id = obj.eve_id_id
        session = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=event_id,status=1).last()
        if(session.actual_StartDate_Time==timezone.now().date()):
            last_session=True
        else:
            last_session=False
        return last_session
           
    def get_professional_last_session(self,obj):
        if(obj.srv_prof_id):
            detail_event=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id_id,status=1,srv_prof_id=obj.srv_prof_id_id).last()
            if obj.agg_sp_dt_eve_poc_id==detail_event.agg_sp_dt_eve_poc_id:
                return True
            else:
                return False
           

    def get_rechedule_status(self, obj):
        if obj.start_time and obj.actual_StartDate_Time:
            start_time = time.fromisoformat(str(obj.start_time))
            start_datetime_naive = datetime.combine(obj.actual_StartDate_Time, start_time)
            start_datetime_aware = timezone.make_aware(start_datetime_naive, timezone.get_current_timezone())
            adjusted_datetime_aware = start_datetime_aware + timedelta(hours=2)
            utc_datetime = adjusted_datetime_aware.astimezone(pytz.utc)
            final_datetime_aware = utc_datetime - timedelta(hours=1, minutes=24, seconds=45)
            target_datetime = final_datetime_aware.replace(tzinfo=None)
            if start_datetime_naive > datetime.now():
                return True
            else:
                return False
        return False
    def get_previous_session_remain(self,obj):
        if(obj.srv_prof_id):
        #     # detial_event_count=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id,srv_prof_id=obj.srv_prof_id,status=1,Session_jobclosure_status=2,actual_StartDate_Time__lte=datetime.now().date(),start_time__lte=datetime.now().time()).count()
        #     if(detial_event_count>=3):
        #         return True
        #     else:
        #         return False
        # return False
            detail_event=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id,srv_prof_id=obj.srv_prof_id,status=1,actual_StartDate_Time__lte=datetime.now().date(),start_time__lte=datetime.now().time()).order_by('actual_StartDate_Time')
            try:
                if(detail_event.count()<=2):
                    return False
                elif(detail_event.count()>=3):
                    dic={}
                    lis=[]
                    for i in detail_event:
                        if(i.Session_jobclosure_status==1):
                            s='yes'
                        else:
                            s='no'
                        dic[str(i.actual_StartDate_Time)]=s
                        lis.append(str(i.actual_StartDate_Time))
                    index_no=lis.index(str(obj.actual_StartDate_Time))
                    if(index_no>=2):
                        new_index=index_no-2
                        if(dic[lis[new_index]]=='no'):
                            return True
                        else:
                            return False
                    else:
                        return False
                else:
                    return False
            except Exception as e:
                return False

    # def get_rechedule_status(self, obj):
    #     if obj.start_time and obj.actual_StartDate_Time:
    #         start_time = time.fromisoformat(str(obj.start_time))
    #         start_datetime = timezone.make_aware(
    #             datetime.combine(obj.actual_StartDate_Time, start_time), 
    #             timezone.get_current_timezone()
    #         )+timedelta(hours=2)
    #         original_datetime = datetime.fromisoformat(str(start_datetime))
    #         # Convert to UTC
    #         utc_datetime = original_datetime.astimezone(pytz.utc)
    #         adjusted_datetime = utc_datetime - timedelta(hours=1, minutes=24, seconds=45) #+ timedelta(microseconds=666700)
    #         target_datetime = adjusted_datetime.replace(tzinfo=None)
    #         print("now time is ================",target_datetime)
    #         if target_datetime > timezone.now():
    #             return True
    #         else:
    #             return False
    #     return False





# --------------------------- professional service cancellation APi --------------------

class get_state(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_state
        fields = ['state_name']

class get_city(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_city
        fields = ['city_name']

class get_ptn_data(serializers.ModelSerializer):
    state_id = get_state()
    city_id = get_city()
    class Meta:
        model = agg_hhc_patients
        fields = ['agg_sp_pt_id', 'name','state_id','city_id','address','pincode']
    

class get_event_data(serializers.ModelSerializer):
    agg_sp_pt_id = get_ptn_data()
    class Meta:
        model = agg_hhc_events
        fields = ['eve_id', 'event_code', 'agg_sp_pt_id']

class get_srv_data(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_services
        fields = ['srv_id', 'service_title']

class get_sub_service_data(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_sub_services
        fields = ['sub_srv_id','recommomded_service']

class get_event_poc_data(serializers.ModelSerializer):
    srv_id = get_srv_data()
    eve_id = get_event_data()
    sub_srv_id = get_sub_service_data()
    canceled_date = serializers.SerializerMethodField()
    # cancelled_date = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', required=False)
    class Meta:
        model = agg_hhc_event_plan_of_care
        fields = ['eve_poc_id','eve_id','srv_id','sub_srv_id','canceled_date','start_date']
    
    # def get_canceled_date(self, obj):
    #     date = agg_hhc_cancellation_history.objects.get(event_id=obj.eve_id)
    #     return date.cancelled_date.isoformat()
    # def get_canceled_date(self,obj):
    #     # print(obj.canceled_date,';;;........')
    #     if obj.canceled_date!=None:
    #         return obj.canceled_date.strftime('%d-%m-%Y')
    #     else:
    #         return None
    def get_start_date(self,obj):
        if obj.start_date!=None:
            return obj.start_date.strftime('%d-%m-%Y')
        else:
            return None
    
    def get_canceled_date(self, obj):
        cancellation_history = agg_hhc_cancellation_history.objects.filter(event_id=obj.eve_id)
        if cancellation_history.exists():
            # Choose one object as per your logic, for example, the latest one
            latest_cancellation = cancellation_history.latest('cancelled_date')
            return latest_cancellation.cancelled_date.isoformat()
        return None




# --------------------------- professional session cancellation serializer --------------------

class get_epoce_data_prof(serializers.ModelSerializer):
    sub_srv_id = get_sub_service_data()
    class Meta:
        model = agg_hhc_event_plan_of_care
        fields = ['eve_poc_id','sub_srv_id']

class get_canceled_data_prof(serializers.ModelSerializer):
   
    eve_id = get_event_data()
    eve_poc_id = get_epoce_data_prof()
    canceled_date = serializers.SerializerMethodField()

    class Meta:
        model = agg_hhc_detailed_event_plan_of_care
        fields = ['agg_sp_dt_eve_poc_id','eve_poc_id','eve_id','index_of_Session','srv_prof_id','is_cancelled','canceled_date','actual_StartDate_Time']
    
    def get_canceled_date(self, obj):
        cancellation_history = agg_hhc_cancellation_history.objects.filter(event_id=obj.eve_id).first()
        if cancellation_history:
            return cancellation_history.cancelled_date.isoformat()
        else:
            return "Not yet Cancelled"

#-----------------------------------------patient detail----------mayank--------
class Patient_feedback(serializers.ModelSerializer):
    Pending_amount = serializers.SerializerMethodField()

    class Meta:
        model = agg_hhc_Professional_app_feedback
        fields = ['feedbk_id', 'rating', 'Pending_amount', 'pt_id','eve_id']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['pt_name'] = instance.pt_id.name
        data['pt_address'] = instance.pt_id.address
        data['pt_phone'] = instance.pt_id.phone_no
        data['lattitude'] = instance.pt_id.lattitude
        data['langitude'] = instance.pt_id.langitude
        data['Consultation Detail'] = instance.eve_id.suffer_from
        return data
    
    def get_Total_amount(self, obj):
        event_id = obj.eve_id_id 
        total_amt = agg_hhc_events.objects.filter(eve_id=event_id,status=1).aggregate(Sum('final_amount'))['final_amount__sum']
        return total_amt if total_amt is not None else 0

    def get_Pending_amount(self, obj):
        event_id = obj.eve_id_id
        total_amt_agg = agg_hhc_events.objects.filter(eve_id=event_id,status=1).aggregate(Sum('final_amount'))
        total_paid_agg = agg_hhc_payment_details.objects.filter(eve_id=event_id,status=1,overall_status="SUCCESS").aggregate(Sum('amount_paid'))
        total_amt = total_amt_agg['final_amount__sum'] or Decimal('0.0')
        total_paid = total_paid_agg['amount_paid__sum'] or Decimal('0.0')
        Pending_amt = float(total_amt) - float(total_paid)
        return Pending_amt


class Patient_detail_page(serializers.ModelSerializer):
    feedback = Patient_feedback(many=True, read_only=True)

    class Meta:
        model = agg_hhc_detailed_event_plan_of_care
        fields = ['agg_sp_dt_eve_poc_id', 'srv_prof_id', 'eve_poc_id', 'eve_id', 'index_of_Session', 'actual_StartDate_Time','start_time','end_time', 'actual_EndDate_Time', 'status', 'feedback']

    
class event_count(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_events
        fields = ['eve_id','agg_sp_pt_id', 'enq_spero_srv_status']

    # def get_feedback(self, obj):
    #     feedback = agg_hhc_Professional_app_feedback.objects.filter(pt_id=obj.eve_id.agg_sp_pt_id)
    #     if feedback.exists():
    #         serializer = Patient_feedback(feedback, many=True)
    #         return serializer.data
    #     else:
    #         return None

# -----------------------------------------
class CustomSerializer(serializers.Serializer):
    # field1 = serializers.SerializerMethodField()
    field2 = serializers.SerializerMethodField()
    field3 = serializers.SerializerMethodField()

    # def get_field1(self, obj):
    #     serialized_data = Patient_feedback(obj.get("field1")).data if obj.get("field1") else None
    #     #write your code in this serializer if you would like to make chages in this api 
    #     return serialized_data
    
    # def get_field1(self,obj):
    #     patient_id = instance.pt_id
    #     patient_id_serializer = get_ptn_dtl(patinet_id)
    #     return patient_id_serializer.data

    def get_field2(self, obj):
        serialized_data = Patient_detail_page(obj.get("field2")).data if obj.get("field2") else None
        return serialized_data

    def get_field3(self, obj):
        return obj.get("field3")




    




# ------------------------- Cancellation Request - (Vinayak) -----------------------


class canellation_service_request_from_prof(serializers.ModelSerializer):
    class Meta:
        # model = agg_hhc_cancellation_request
        model = agg_hhc_cancellation_and_reschedule_request
        fields = ['req_id','eve_id','epoc_id','is_srv_sesn','is_canceled','req_resson','srv_prof_id','last_modified_by']
        # fields = ['canc_req_id','eve_id','epoc_id','dtl_eve_id','is_srv_sesn','cncel_req_resson']
        # fields = ['req_id','eve_id','epoc_id','is_srv_sesn','req_resson','remark','is_canceled', 'last_modified_by','srv_prof_id', 'dtl_eve_id']


class canellation_session_request_from_prof(serializers.ModelSerializer):
    class Meta:
        # model = agg_hhc_cancellation_request
        # fields = ['canc_req_id','eve_id','epoc_id','is_srv_sesn','cncel_req_resson']
        model = agg_hhc_cancellation_and_reschedule_request
        fields = ['req_id','eve_id','epoc_id','dtl_eve_id','is_srv_sesn','req_resson','remark','is_canceled', 'last_modified_by']



# --------------------- Reschedule requests - (Vinayak)  -------------------

class Reschedule_service_request_from_prof(serializers.ModelSerializer):
    class Meta:
        
        model = agg_hhc_cancellation_and_reschedule_request
        # fields = ['req_id','eve_id','epoc_id','is_srv_sesn','req_resson','is_reschedule','reschedule_date', 'last_modified_by']
        fields = ['req_id','eve_id','epoc_id','is_srv_sesn','req_resson','is_reschedule','reschedule_date', 'last_modified_by','srv_prof_id']
    def get_reschedule_date(self,obj):
        return obj.reschedule_date.strftime('%d-%m-%Y')

class Reschedule_session_request_from_prof(serializers.ModelSerializer):
    class Meta:
       
        model = agg_hhc_cancellation_and_reschedule_request
        fields = ['req_id','eve_id','epoc_id','dtl_eve_id','is_srv_sesn','req_resson','is_reschedule','reschedule_date', 'last_modified_by']
    def get_reschedule_date(self,obj):
        return obj.reschedule_date.strftime('%d-%m-%Y')
    
class DeviceToken_serializer(serializers.ModelSerializer):
    class Meta:
        model=DeviceToken
        fields = ['clg_id','token']

class Notif_details_serializer(serializers.ModelSerializer):
    eve_id = serializers.SerializerMethodField()
    class Meta:
        model = NotificationList
        fields = ['noti_id','noti_title', 'noti_body', 'is_accepted', 'eve_id', 'is_active']

    def get_eve_id(self,obj):
        # print(obj.eve_id.eve_id)
        try:
            event=agg_hhc_events.objects.get(eve_id=obj.eve_id.eve_id,status=1)
        except agg_hhc_events.DoesNotExist:
            return {'error': f'{obj.eve_id.eve_id} event_id does not exist '}
        name=event.agg_sp_pt_id.name
        address=event.agg_sp_pt_id.address
        try:
            poc=agg_hhc_event_plan_of_care.objects.get(eve_id=event.eve_id,status=1)
        except agg_hhc_event_plan_of_care.DoesNotExist:
            return {'error': f'no plane of care exist of this event_id {obj.eve_id.eve_id} '}
        sub_service=poc.sub_srv_id.recommomded_service
        sub_id=poc.sub_srv_id.sub_srv_id
        survice_id=poc.srv_id.srv_id
        start_date=poc.start_date
        start_time=poc.start_time
        new_data ={
            'event_id':obj.eve_id.eve_id,
            'name':name,
            'address':address,
            'service_id':survice_id,
            'sub_service_id':sub_id,
            'sub_service':sub_service,
            'start_date':start_date,
            'start_time':start_time
        }
        return new_data

class professional_list_serializer(serializers.ModelSerializer):
    noti_id=Notif_details_serializer()
    class Meta:
        model=Professional_notification
        fields = ['prof_noti','noti_id','srv_prof_id',]


class professional_call_back_serializer(serializers.ModelSerializer):
    class Meta:
        model=professional_call_back
        fields=['cb_id','clg_id','remark','status','call_back_done_by','last_modified_by']
        # fields='__all__'

class feedback_serializer(serializers.ModelSerializer):
    class Meta:
        model=agg_hhc_Professional_app_feedback
        fields=['feedbk_id','srv_prof_id','eve_id','rating','q1']

class feedback_media_serializer(serializers.ModelSerializer):
    class Meta:
        model=agg_hhc_feedback_media_note
        fields=['feedbk_med_id','eve_id','image','vedio','audio','feedback_by','additional_comment']

class question_feedback_serializer(serializers.ModelSerializer):
    class Meta:
        model=FeedBack_Questions
        fields="__all__"