from rest_framework import serializers
from hhcweb.models import *
from django.contrib.auth.hashers import make_password, check_password
from datetime import datetime, timedelta
from django.utils import timezone



class get_ptn_data_seri(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_patients
        fields = ['agg_sp_pt_id','name','phone_no']
class pend_pay_frm_ptn_serializer(serializers.ModelSerializer):
    agg_sp_pt_id = get_ptn_data_seri()
    pending_amt = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_events
        fields = ['eve_id','event_code','caller_id','agg_sp_pt_id','final_amount','pending_amt']
    
    def get_pending_amt(self, obj):
        return obj.final_amount
    


class get_srv_prof_data_pppeve(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_service_professionals
        fields = ['srv_prof_id', 'professional_code',
                  'prof_fullname', 'phone_no']


class get_eve_pppeve(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_events
        fields = ['eve_id', 'event_code','final_amount']

class recived_name_serializer (serializers.ModelSerializer):
    class Meta:
        model = agg_com_colleague
        fields = ['clg_first_name', 'clg_mobile_no', 'clg_Work_phone_number']

class pend_pay_frm_prof_serializer(serializers.ModelSerializer):
    eve_id = get_eve_pppeve()
    # srv_prof_id = get_srv_prof_data_pppeve()
    srv_prof_id = serializers.SerializerMethodField()
    pay_recived_by = recived_name_serializer()

    class Meta:
        model = agg_hhc_payment_details
        # fields = ['pay_dt_id', 'eve_id', 'srv_prof_id', 'Total_cost', 'amount_paid',
        #           'amount_remaining', 'pay_recived_by', 'date', 'mode', 'overall_status']
        
        fields = ['pay_dt_id', 'eve_id', 'srv_prof_id', 'Total_cost', 'amount_paid',
                  'amount_remaining', 'pay_recived_by', 'date', 'mode', 'overall_status']
    
    def get_srv_prof_id(self, obj):
        # prof_data = agg_hhc_service_professionals.objects.filter(clg_ref_id = obj.pay_recived_by, status=1)
        # data =  get_srv_prof_data_pppeve(prof_data)
        # return data.data
        data = {
            "professional_code": 'null',
            "prof_fullname":obj.pay_recived_by.clg_first_name,
            "phone_no": obj.pay_recived_by.clg_Work_phone_number
        }
        # return data.data
        return data








class Day_wise_payment_list_serializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    srv_prof_id = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_payment_details
        fields = ['pay_dt_id', 'eve_id','patient_name', 'srv_prof_id', 'amount_paid', 'mode']

    def get_patient_name(self, obj):
        # event = agg_hhc_events.objects.get(eve_id=obj.eve_id)
        event = obj.eve_id
        return event.agg_sp_pt_id.name

    def get_srv_prof_id(self, obj):
        # name = agg_hhc_service_professionals.objects.get(srv_prof_id=obj.srv_prof_id).prof_fullname
        if obj.srv_prof_id:
            name = obj.srv_prof_id.prof_fullname
        else:
            name = None 
        return name
    
class Service_Wise_Pending_Payment_Serializer(serializers.ModelSerializer):
    service = serializers.SerializerMethodField()
    sub_service = serializers.SerializerMethodField()
    agg_sp_pt_id = serializers.SerializerMethodField()
    paid_amount = serializers.SerializerMethodField()
    discount_in = serializers.SerializerMethodField()

    class Meta:
        model = agg_hhc_events
        fields = ['eve_id', 'event_code','discount_type','discount_in','discount_value', 'service', 'sub_service',
                  'agg_sp_pt_id', 'final_amount','Total_cost', 'paid_amount']
        
    def get_discount_in(self,obj):
        if obj.discount_type == 1:
            return "Percentage"
        elif obj.discount_type == 2:
            return "Amount"
        elif obj.discount_type == 3:
            return "complimentary"
        elif obj.discount_type == 4:
            return "VIP"
        else:
            return "No_discount"
        

    def get_service(self, obj):
        poc = agg_hhc_event_plan_of_care.objects.get(
            eve_id=obj.eve_id, status=1)
        return poc.srv_id.service_title

    def get_sub_service(self, obj):
        poc = agg_hhc_event_plan_of_care.objects.get(
            eve_id=obj.eve_id, status=1)
        return poc.sub_srv_id.recommomded_service

    def get_agg_sp_pt_id(self, obj):
        return obj.agg_sp_pt_id.name

    def get_paid_amount(self, obj):
        return 0
def financial_year(date):
    if date.month < 4:
        return f'{date.year-1}-{date.year}'
    else :
        return f'{date.year}-{date.year+1}'
class payment_detail_serializer(serializers.ModelSerializer):
    Branch = serializers.SerializerMethodField()
    Payment_Receipt_No = serializers.SerializerMethodField()
    Payment_Receipt_Date = serializers.SerializerMethodField()
    Bill_No = serializers.SerializerMethodField()
    Customer_Name = serializers.SerializerMethodField()
    Email_ID = serializers.SerializerMethodField()
    Amount = serializers.SerializerMethodField()
    Professional = serializers.SerializerMethodField()
    Bank_or_cash = serializers.SerializerMethodField()
    Check_No = serializers.SerializerMethodField()
    Payment_Bank_Name = serializers.SerializerMethodField()
    Narration = serializers.SerializerMethodField()
    Cheque_Date = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_payment_details
        fields = ['pay_dt_id', 'Branch','Payment_Receipt_No','Payment_Receipt_Date','Bill_No', 'Customer_Name', 'Email_ID', 'Amount', 'Professional', 'Bank_or_cash', 'Check_No', 'Cheque_Date', 'Payment_Bank_Name', 'Narration']
        # fields = ['pay_dt_id', 'eve_id', 'Branch','Customer_Name','Email_ID','Amount','Professional']

    def get_Branch(self, obj):
        try:
            code1 = agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.eve_id, status=1).last()
            code=code1.hosp_id.hospital_short_code if hasattr(code1.hosp_id, 'hospital_short_code') else None
            return code
        except:
            return None
    
    def get_Payment_Receipt_No(self, obj):
        try:
            # print(obj.eve_id.eve_id,'1')
            code1 = agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.eve_id, status=1).last()
            code=code1.hosp_id.hospital_short_code if hasattr(code1.hosp_id, 'hospital_short_code') else None
            next_year = str(financial_year(obj.added_date.date()))
            # print('3')
            invoice = obj.eve_id.Invoice_ID
            # print('4')
            return f'{code}/{next_year}/{invoice}'
        except:
            return None
        
    def get_Payment_Receipt_Date(self, obj):
        dates=str(obj.added_date)
        try:
            return str(datetime.strptime(dates, '%Y-%m-%d %H:%M:%S.%f').strftime('%d-%m-%Y'))
        except:
            return None
    
    def get_Bill_No(self, obj):
        try:
            # print(obj.eve_id,'  ',obj.eve_id.Invoice_ID)
            code = agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.eve_id, status=1).last()
            code1=code.hosp_id.hospital_short_code if hasattr(code.hosp_id, 'hospital_short_code') else None
            next_year = str(financial_year(obj.added_date.date()))
            # print('3')
            # invoice = obj.eve_id.Invoice_ID
            payment_id=agg_hhc_payment_details.objects.filter(eve_id=obj.eve_id, overall_status='SUCCESS', status=1).last()
            
            if payment_id:
                return f'{code1}/{next_year}/{payment_id.receipt_no}'
            else: return None
            # return obj.eve_id.Invoice_ID
        except:
            return None
    
    def get_Customer_Name(self, obj):
        try:
            return obj.eve_id.agg_sp_pt_id.name
        except:
            return None

    def get_Email_ID(self, obj):
        try:
            return obj.eve_id.agg_sp_pt_id.patient_email_id
        except:
            return None

    def get_Amount(self, obj):
        try:
            return obj.eve_id.final_amount
        
        except:
            return None

    def get_Professional(self, obj):
        try:
            dt_eve = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id, status=1)
            prof=set([i.srv_prof_id.srv_prof_id for i in dt_eve])
            prof_name ="/".join([agg_hhc_service_professionals.objects.get(srv_prof_id=i).prof_fullname for i in prof])
            return prof_name
        except:
            return None


    def get_Bank_or_cash(self, obj):
        return "HDFC BANK C.C A/C - 50200010027418" #its static as per account 

    def get_Check_No(self, obj):
        return ''
    

    def get_Payment_Bank_Name(self, obj):
        return ''

    def get_Narration(self, obj):
        if obj.eve_id.discount_type==1:
            disc_amt=round((float(obj.eve_id.Total_cost)/100)*obj.eve_id.discount_value)
        elif obj.eve_id.discount_type==2:
            disc_amt=obj.eve_id.discount_value
        else: disc_amt=None
        i=agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.eve_id,status=1).last()
        return f'{i.eve_id.agg_sp_pt_id.agg_sp_pt_id}/{i.eve_id.event_code} -- Service Actual Cost - {i.eve_id.Total_cost} - Discount Amount - {disc_amt} -- Service Final Cost -- {i.eve_id.final_amount}'
         

    def get_Cheque_Date(self, obj):
        return ''
    























































# ________________________________ Amit Rasale ________________________________________

# __________ UTR pending_UTR_Payment_Details_serializer ______________________________

class callers_info_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_callers
        fields = ['caller_id', 'phone', 'caller_fullname']

class patients_name_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_patients
        fields = ['agg_sp_pt_id', 'name', 'phone_no']

class eveId_wise_call_serializer(serializers.ModelSerializer):
    event_date = serializers.SerializerMethodField()
    caller_id = callers_info_serializer()
    agg_sp_pt_id = patients_name_serializer()
    class Meta:
        model = agg_hhc_events
        fields = ['eve_id', 'event_code', 'agg_sp_pt_id', 'event_date', 'caller_id', 'agg_sp_pt_id']

    def get_event_date(self, obj):
        if isinstance(obj, dict):
            event_date = obj.get('event_date')
        else:
            event_date = getattr(obj, 'event_date', None)
        if event_date:
            return event_date.strftime('%Y-%m-%d')
        return None

class service_name_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_services
        fields = ['srv_id', 'service_title']

class sub_service_name(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_sub_services
        fields = ['sub_srv_id', 'recommomded_service']

class service_subSer_Ester_serilizer(serializers.ModelSerializer):
    srv_id = service_name_serializer()
    sub_srv_id = sub_service_name()
    class Meta:
        model = agg_hhc_event_plan_of_care
        fields = ['eve_poc_id', 'eve_id', 'start_date', 'end_date', 'srv_id', 'sub_srv_id']

class pending_UTR_Payment_Details_serializer(serializers.ModelSerializer):
    Payment_mode = serializers.SerializerMethodField()
    added_date = serializers.SerializerMethodField()
    eve_id = eveId_wise_call_serializer()
    ser_subSer_sd_ed = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_payment_details
        fields = ['pay_dt_id', 'utr', 'transaction_id', 'Remark', 'added_date', 'Payment_mode', 'eve_id', 'ser_subSer_sd_ed']

    def get_ser_subSer_sd_ed(self, obj):
        ser_subSer_sd_ed = agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.eve_id)
        serialized_data = service_subSer_Ester_serilizer(ser_subSer_sd_ed, many=True).data
        return serialized_data

    def get_Payment_mode(self, obj):
        Payment_mode = {
            1: 'Cash',
            2: 'Cheque',
            3: 'Online',
            4: 'Card',
            5: 'QR Code',
            6: 'NEFT',
            None: 'NULL',
        }
        if isinstance(obj, dict):
            mode = obj.get('mode')
        else:
            mode = getattr(obj, 'mode', None)
        if mode is None:
            return 'NULL'
        return Payment_mode.get(mode, 'NULL')

    def get_added_date(self, obj):
        if isinstance(obj, dict):
            added_date = obj.get('added_date')
        else:
            added_date = getattr(obj, 'added_date', None)
        if added_date:
            return added_date.strftime('%Y-%m-%d')
        return None
    
    

class eveId_wise_call_POST_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_events
        fields = ['eve_id', 'event_code']

class pending_UTR_Payment_Details_POST_serializer(serializers.ModelSerializer):
    eve_id = eveId_wise_call_POST_serializer()
    class Meta:
        model = agg_hhc_payment_details
        fields = ['pay_dt_id', 'eve_id', 'utr', 'transaction_id', 'mode', 'last_modified_by', 'last_modified_date']
        extra_kwargs = {
            'pay_dt_id': {'required': False},
            'eve_id': {'required': False},
        }

    def update(self, instance, validated_data):
        validated_data.pop('pay_dt_id', None)  # Ignore pay_dt_id if it is in the validated data
        validated_data.pop('eve_id', None)  # Ignore eve_id if it is in the validated data

        return super().update(instance, validated_data)
# __________ UTR pending_UTR_Payment_Details_serializer ______________________________





# ________________________________ Amit Rasale ________________________________________
