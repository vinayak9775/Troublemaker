from datetime import datetime
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from hhcweb.serializers import *
from hhcweb.models import *
import pandas as pd
import json
import math
from hhc_professional_app.views import get_prof
from hhc_professional_app.serializer import *
from collections import Counter
from django.db.models import Q
from rest_framework import status,permissions
from django.utils import timezone
# from hhcweb.serializers import UserRegistrationSerializer,UserLoginSerializer
from django.contrib.auth import authenticate
from hhcweb.renders import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
# from .models import agg_hhc_service_professionals, agg_hhc_professional_sub_services
# from .serializers import AggHHCServiceProfessionalSerializer
# from .serializers import *
# import haversine as hs #added by vishal to calculate distance from lat long 
# from haversine import Unit #added by vishal to find distance from lat long 
from rest_framework import generics
# from .models import agg_hhc_service_professionals
# from .serializers import AggHHCServiceProfessionalSerializer
from rest_framework.decorators import api_view  # mayank
from django.views.decorators.csrf import csrf_exempt # mayank
from django.http import JsonResponse  # mayank
from urllib.parse import quote # mayank
import requests as Req #mayank
# from django.views.decorators.cache import cache_page #mayank
from rest_framework.exceptions import NotFound
# import math
from math import radians, sin, cos, sqrt, atan2, ceil
from shapely.geometry import Point, Polygon        
from hhcspero.settings import SERVER_KEY, GOOGLE_KEY
from itertools import chain
from django.conf import settings
from decimal import Decimal, InvalidOperation
import jwt
import googlemaps

def whatsapp_sms(to_number,template_name,placeholders):
    base_url = "xl6mjq.api-in.infobip.com"
    api_key = "af099554a7f804d8fd234e3226241101-da0d6970-19a8-4e0a-9154-9da1fb64d858"  # Replace with your actual API key
    from_number = "918956193883"
    to_number = f'91{to_number}'
    template_name = template_name
    placeholders = placeholders
    # order_id = "SPERO_W_ID" + timezone.now().strftime("%d%m%Y%H%M%S")

    if not to_number:
        return {"error": "Destination number is required"}
    if not placeholders:
        return {"error": "Placeholders are required"}
    if(template_name=='login_otp'):
        payload = json.dumps({})
        payload = json.dumps({
            "messages": [
                {
                    "from": from_number,
                    "to": to_number,
                    # "messageId": order_id,
                    "content": {
                        "templateName": template_name,
                        "templateData": {
                            "body": {
                                "placeholders": placeholders
                            },
                            "buttons": [
                                {
                                    "type": "URL",
                                    "parameter": placeholders[0]
                                }
                            ]
                        },
                        "language": "en"
                    }
                }
            ]
        })
    else:
        payload = json.dumps({
            "messages": [
                {
                    "from": from_number,
                    "to": to_number,
                    # "messageId": order_id,
                    "content": {
                        "templateName": template_name,
                        "templateData": {
                            "body": {
                                "placeholders": placeholders
                            },
                        },
                        "language": "en"
                    }
                }
            ]
        })
    headers = {
        'Authorization': f'App {api_key}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    conn = http.client.HTTPSConnection(base_url)
    conn.request("POST", "/whatsapp/1/message/template", payload, headers)
    res = conn.getresponse()
    data = res.read()
    conn.close()
    print('hii')
    print('hii22')
    print('hii22')
    print('hii22')
    if res.status == 200:
        return Response({"status": "Message sent successfully", "response": json.loads(data.decode("utf-8"))})
    else:
        return Response({"error": data.decode("utf-8")})


def send_payment_sms(number, smstmp):
    api_key = settings.TEXTLOCAL_API_KEY
    phone_number = number
    sender = "SPEROO"
    # otp_int = otp
    message = smstmp
    
    try:
        response = requests.post(
            "https://api.textlocal.in/send/",
            data={
                'apikey': api_key,
                'numbers': phone_number,
                'message': message,
                'sender': sender
            }
        )
        print(response.text)
        print(phone_number,"phone_number")
        
        
        if response.status_code == 200:
            
            data = {
                    "patient_name":"",
                    "contact_number":phone_number,
                    "sent_status":1,
                    "sms_type":4,
                    "status":1,
                    "added_by":""
            }
            serializer = cf_payment_otp_details(data=data)
            if serializer.is_valid():
                serializer.save()
            
            # return Response({'message': 'SMS sent successfully.','SMS':serializer.data, 'response': response.json()})
        else:
            data = {
                    "patient_name":"",
                    "contact_number":phone_number,
                    "sent_status":2,
                    "sms_type":4,
                    "status":1,
                    "added_by":""
            }
            serializer = cf_payment_otp_details(data=data)
            if serializer.is_valid():
                serializer.save()
            # return Response({'error': response.text}, status=500)
    except Exception as e:
        print("msg not send",str(e))
# Create your views here.

def get_prof(request):
    # print("Hiee==1")
    pro = ""
    clg_id = ""
    caller_id = ""
    auth_header = request.headers.get('Authorization')
    token = str(auth_header).split()[1]

    decoded_token = jwt.decode(token, key='django-insecure-gelhauh(a&-!e01zl$_ic4l07frx!1qx^h(zjitk(c57w(n6ry', algorithms=['HS256'])

    clg_id = decoded_token.get('user_id')
    print("CLG_ID______________ ", clg_id)
    clg_ref = agg_com_colleague.objects.get(id=clg_id)

    try:
        prof = agg_hhc_service_professionals.objects.get(clg_ref_id=clg_ref.clg_ref_id)
        pro = prof.srv_prof_id
    except:
        pass

    try:
        caller = agg_hhc_callers.objects.get(clg_ref_id=clg_ref.clg_ref_id)
        caller_id = caller.caller_id
    except:
        pass

    return pro, clg_id, caller_id, clg_ref.clg_ref_id



#-----------------------------------------------jwt login and register api---------------------------

# Generate Token Manually
# def get_tokens_for_user(user):
#     refresh = RefreshToken.for_user(user)
#     group = str(user.grp_id)
#     if group:
#             incs= agg_mas_group.objects.get(grp_id=group)
#             group = incs.grp_name
#     return {
#         "refresh" : str(refresh),
#         "access" : str(refresh.access_token),
#         "colleague": {
#                 'id': user.id,
#                 'first_name': user.clg_first_name,
#                 'last_name': user.clg_last_name,
#                 'email': user.clg_work_email_id,
#                 'phone_no': user.clg_mobile_no,
#                 'profile_photo_path':user.clg_profile_photo_path,
#                 'address':user.clg_address,
#                 'designation':user.clg_designation,
#                 'clg_group': group
#             },
#         "user_group" :group,
#     } 
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    group = str(user.grp_id)
    permissions_data = []
    if group:
            incs= agg_mas_group.objects.get(grp_id=group)
            pers = agg_save_permissions.objects.filter(role=group)
            group = incs.grp_name
            for permission in pers:
                permission_info = {
                    'modules_submodule': permission.modules_submodule,
                    'permission_status': permission.permission_status,
                    # 'source_id': permission.source.source_pk_id,
                    # 'source_name': permission.source.source,  
                    'role_id': permission.role.grp_id,
                    'role_id': permission.role.grp_name,  
    }   
                permissions_data.append(permission_info)
    else:
        group = None
            
    return {
        "refresh" : str(refresh),
        "access" : str(refresh.access_token),
        "permissions": permissions_data,
        "colleague": {
                'id': user.id,
                'first_name': user.clg_first_name,
                'last_name': user.clg_last_name,
                'email': user.clg_work_email_id,
                'phone_no': user.clg_mobile_no,
                'profile_photo_path':user.clg_profile_photo_path,
                'address':user.clg_address,
                'designation':user.clg_designation,
                'clg_group': group,
                'clg_hosp_id':user.clg_hos_id.hosp_id 
            },
        "user_group" :group,
    } 
class UserRegistrationView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, format=None):

        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            token = get_tokens_for_user(user)
            # print(token)
            return Response({'token':token,'msg':'Registration Successful'},status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class UserLoginView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            clg_ref_id = serializer.data.get('clg_ref_id')
            password = serializer.data.get('password')
            # print(clg_ref_id, password)
            user = authenticate(clg_ref_id=clg_ref_id, password=password)
            if user is not None:
                clg = agg_com_colleague.objects.get(clg_ref_id=user.clg_ref_id)
                if clg.clg_is_login == False:
                    clg.clg_is_login = True
                    clg.save()
                    token = get_tokens_for_user(user)
                    return Response({'token':token,'msg':'Logged in Successfully'},status=status.HTTP_200_OK)
                else:
                    return Response({'msg':'User Already Logged In. Please check.'},status=status.HTTP_200_OK)
            else:
                return Response({'errors':{'non_field_errors':['UserId or Password is not valid']}},status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


#---------------------------------------------------Api's Starts------------------------------     
class agg_hhc_caller_relation_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        courses =  agg_hhc_caller_relation.objects.filter(status=1)
        serializer = agg_hhc_caller_relation_serializer(courses, many=True)
        return Response(serializer.data)    

class agg_hhc_locations_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        courses =  agg_hhc_locations.objects.filter(status=1)
        serializer = agg_hhc_locations_serializer(courses, many=True)
        return Response(serializer.data)

class agg_hhc_services_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        call= agg_hhc_services.objects.filter(status=1).order_by('service_title')
        serializer=get_service_name(call,many=True)
        return Response(serializer.data)

class agg_hhc_services_api_web_form(APIView):

    def get(self,request):
        call= agg_hhc_services.objects.filter(status=1).order_by('service_title')
        serializer=get_service_name(call,many=True)
        return Response(serializer.data)

class agg_hhc_sub_services_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,pk,format=None):
        sub_service= agg_hhc_sub_services.objects.filter(srv_id=pk,status=1).order_by('recommomded_service')
        serializer= agg_hhc_sub_services_serializer(sub_service,many=True)
        return Response(serializer.data)
    

#------------------------------------------------------------------------------
class agg_hhc_purpose_call_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        call= agg_hhc_purpose_call.objects.filter(status=1) 
        serializer= agg_hhc_purpose_call_serializer(call,many=True)
        return Response(serializer.data)
    

class agg_hhc_gender_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        ge= agg_hhc_gender.objects.filter(status=1)
        serializer= agg_hhc_gender_serializer(ge,many=True)
        return Response(serializer.data)

class agg_hhc_gender_api_web_form(APIView):
    def get(self,request):
        ge= agg_hhc_gender.objects.filter(status=1)
        serializer= agg_hhc_gender_serializer(ge,many=True)
        return Response(serializer.data)
    

class agg_hhc_patients_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self,request):
        clgref_id = get_prof(request)[3]
        
        request.data['last_modified_by'] = clgref_id
        

        phone = request.data.get('phone_no')
        # print("this is my phone_no",phone)
        old_patient= agg_hhc_patients.objects.filter(phone_no=phone).first()
        # print("this is old patients",old_patient)
        if(old_patient is None):
            serializer= agg_hhc_patients_serializer(data=request.data)
            if serializer.is_valid():
                
                serializer.save()
                return Response(serializer.data,status=status.HTTP_201_CREATED)
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        else:
            # print(" patient is not available ")
            #print("old patient hhc_no",old_patient.hhc_code)
            # agg_hhc_patients.objects.create(phonehhc_code=old_patient.hhc_code,name=request.data.get('name'),first_name=request.data.get('first_name'),middle_name=request.data.get('middle_name'),Age=request.data.get('Age'),Gender=request.data.get('Gender'),email_id=request.data.get('email_id')otp_expire_time=datetime.now()+timedelta(minutes=2))
            se= agg_hhc_patients_serializer(data=request.data)
            if(se.is_valid()):
                se.validated_data['hhc_code'] =old_patient.hhc_code #old_patient.hhc_code
                se.save()
                return Response(se.data)
            return Response({'patient available with that number':phone})
    def get(self,request):
        reg= agg_hhc_patients.objects.filter(status=1)
        ref= agg_hhc_patients_serializer(reg,many=True)
        return Response(ref.data)
    

#_________________________________________get_latest_patient_record_from_caller_id__________________
class get_latest_patient_record_from_caller_id_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_object(self, pk):
        try:
            a = agg_hhc_patients.objects.filter(caller_id=pk,status=1).latest('pk')
            return a
        except agg_hhc_patients.DoesNotExist:
            raise Http404("Patient record not found for the given caller_id")

    def get(self, request, pk, format=None):
        try:
            snippet = self.get_object(pk)
            serialized = get_latest_patient_record_from_caller_id(snippet)
            return Response(serialized.data)
        except Http404 as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
######___________________________agg_hhc_callers_Api__________________#########

class agg_hhc_callers_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        record= agg_hhc_callers.objects.filter(status=1)
        serailized= agg_hhc_callers_seralizer(record,many=True)
        return Response(serailized.data)
    def post(self,request):
        clgref_id = get_prof(request)[3]
        
        request.data['last_modified_by'] = clgref_id

        serialized= agg_hhc_callers_serializer(data=request.data)
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data,status=status.HTTP_201_CREATED)
        return Response(serialized.errors,status=status.HTTP_400_BAD_REQUEST)
    
# class AddPatientOrCheckCallerExist(APIView):
#     def post(self, request):
#         serialized =  serializers.AddPatientOrCheckCallerExistSerializer.model1
####_______________________________agg_hhc_patinet_list_enquiry_______________##

# class agg_hhc_patinet_list_enquiry_api(APIView):
#     def post(self,request):
#         serialized= agg_hhc_patinet_list_enquiry_serializer(data=request.data)
#         if(serialized.is_valid()):
#             serialized.save()
#             return Response(serialized.data,status=status.HTTP_201_CREATED)
#         return Response(serialized.errors,status=status.HTTP_400_BAD_REQUEST)
#     def get(self,request):
#         record= agg_hhc_patient_list_enquiry.objects.all()
#         serialized= agg_hhc_patinet_list_enquiry_serializer(record,many=True)
#         return Response(serialized.data)
    
class agg_hhc_patinet_list_enquiry_put(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_object(self,request,pk):
        try:
            return  agg_hhc_patient_list_enquiry.objects.filter(pk=pk)
        except  agg_hhc_patient_list_enquiry.DoesNotExist:
            raise status.HTTP_404_NOT_FOUND
    def get(self,request,pk):
        obj=self.get_object(pk)
        serialized= agg_hhc_patinet_list_enquiry_serializer(obj)
        return Response(serialized.data)
    def put(self,request,pk):
        clgref_id = get_prof(request)[3]
        request.data['last_modified_by'] = clgref_id

        obj=self.get_object(pk)
        serialized= agg_hhc_patinet_list_enquiry_serializer(obj,data=request.data)
        if(serialized.is_valid()):
            serialized.save()
            return Response(serialized.data)
        return Response(serialized.errors,status=status.HTTP_400_BAD_REQUEST)

# ------------------------------ Sandip Shimpi ---------------------------------------------- 
class agg_hhc_patient_by_HHCID(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get_patient(self,pk):
        try:
            return agg_hhc_patients.objects.get(hhc_code=pk)
        except agg_hhc_patients.DoesNotExist:
            return status.HTTP_404_NOT_FOUND        

    def get(self,request,pk):
        patient = self.get_patient(pk)
        patient=Patient_by_HHCID_Serializer(patient)
        return Response(patient.data)

class agg_hhc_srv_req_prof_allocate(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get_event(self,pk):
        try:
            event = agg_hhc_events.objects.get(eve_id=pk)
            return Response(event)
        except agg_hhc_events.DoesNotExist:
            return Response('please enter valid event id',status.HTTP_404_NOT_FOUND)

    def get(self,request,pk):
        event = self.get_event(pk)
        if not event:
            return Response(status.HTTP_404_NOT_FOUND)
        callerserializer = prof_allocate_get_callerID_serializer(event.data.caller_id)
        patientserializer = prof_allocate_get_patientID_serializer(event.data.agg_sp_pt_id)
        plan_of_care = agg_hhc_event_plan_of_care.objects.filter(eve_id=pk,status=1)
        plan_of_care_serializer = prof_allocate_get_POCID_serializer(plan_of_care,many=True)
        return Response({'Event_ID':pk,'caller_details':callerserializer.data,'patient_details':patientserializer.data,'POC':plan_of_care_serializer.data})

from django.db import connection
# class agg_hhc_add_service_details_api(APIView):
#     renderer_classes = [UserRenderer]
#     permission_classes = [IsAuthenticated]
    
#     def get_event(self,pk):
#         try:
#             event = agg_hhc_events.objects.get(eve_id=pk)
#             return event
#         except agg_hhc_events.DoesNotExist:
#             return Response('please enter valid event id',status.HTTP_404_NOT_FOUND)
        
        
#     def get_caller(self,phone):
#         try:
#             return agg_hhc_callers.objects.get(phone=phone)
#         except agg_hhc_callers.DoesNotExist:
#             return Response('please enter valid event id',status.HTTP_404_NOT_FOUND)

#     def get_patient(self,agg_sp_pt_id):
#         try:
#             return agg_hhc_patients.objects.get(agg_sp_pt_id=agg_sp_pt_id)
#         except agg_hhc_patients.DoesNotExist:
#             return Response('please enter valid event id',status.HTTP_404_NOT_FOUND)

#     def get(self, request, pk):
#         event = self.get_event(pk)
#         # enquiry_from = is_web_form
#         if not event:
#             return Response({'not found'},status.HTTP_404_NOT_FOUND)
#         # if enquiry_from:
#             # patient_details = patient_data_serializer_form(event)
#         # else: 
#         patient_details = patient_data_serializer(event)
#         return Response(patient_details.data)

#     # def get(self,request,pk):
#     #     event = self.get_event(pk)
#     #     if not event:
#     #         return Response({'no data'},status.HTTP_404_NOT_FOUND)
#     #     print(event.caller_id,'dddddddddddd')
#     #     print(event.eve_id)
    
#     #     callerserializer = add_service_get_caller_serializer(event.caller_id)
#     #     patientserializer = add_service_get_patient_serializer(event.pt_id)
#     #     plan_of_care = agg_hhc_event_plan_of_care.objects.filter(eve_id=pk)
#     #     plan_of_care_serializer = add_service_get_POC_serializer(plan_of_care,many=True)
#     #     query_count = len(connection.queries)
#     #     return Response({'caller_details':callerserializer.data,'patient_details':patientserializer.data,'POC':plan_of_care_serializer.data[-1]})
#     # #     return Response({'patient_data':patient_data.data})

#     # def post(self, request):
#     #     create_service = create_service_serializer(data=request.data)
#     #     if create_service.is_valid():
#     #         create_service.save()
#     #         return Response(create_service.data)
#     #     else:
#     #         return Response(create_service.errors)
#     def strings_to_dates(self,date_strings):
#         date_objects = []
#         for date_string in date_strings:
#             try:
#                 date_object = datetime.strptime(date_string, '%Y-%m-%d')
#                 date_objects.append(date_object)
#             except ValueError as e:
#                 return {"error": "Please check if the date format is proper."}

#         sorted_dates = sorted(date_objects)
#         check_date = sorted_dates[0]
#         off_days = []

#         while check_date < sorted_dates[-1]:
#             check_date += timedelta(days=1)
#             if check_date not in sorted_dates:
#                 # off_days.append(check_date.strftime('%Y-%m-%d'))
#                 off_days.append(check_date)

#         # return [date.strftime('%Y-%m-%d') for date in sorted_dates], off_days
#         return [sorted_dates, off_days]
#     def post(self,request): 
#         clgref_id = get_prof(request)[3]
#         request.data['last_modified_by'] = clgref_id
#         should_null=['caller_rel_id','agg_sp_pt_id','pincode','prof_prefered','remark','discount_type','discount_value','final_amount','discount_value','day_convinance','total_convinance', 'jb_cl_que']
#         for key, value in request.data.items():
#             if key not in should_null:
#                 if not value :
#                     print(key, 'asd;fglhk')
#                     # return Response({'error':f'"{key}" this field should not to be empty'})
#                     return Response({'error':'fill all required fields'})
#         patientID=None  
#         # print(';;demo;;')
        
#         caller = agg_hhc_callers.objects.filter(phone=request.data['phone'],status=1).first()
#         if caller:
#             callerSerializer= agg_hhc_callers_serializer(caller,data= request.data)
#             if callerSerializer.is_valid():
#                 callerID=callerSerializer.save()
#                 callerID=callerID.caller_id
#                 # print('2')
#             else:
#                 return Response(callerSerializer.errors)
#             # caller.update(caller_fullname=request.data['caller_fullname'], caller_rel_id=request.data['caller_rel_id'], purp_call_id=request.data['purp_call_id'], caller_status=3)
#             # callerID = caller.first().caller_id 
#         else:  
#             callers= agg_hhc_callers_serializer(data= request.data)
#             if callers.is_valid():
#                 # callers.validated_data['caller_status']=3
#                 callerID=callers.save().caller_id
#                 # print('3')
#             else:
#                 return Response([callers.errors])
#         # print(callerID,'llllsecond')
#         if request.data['purp_call_id']==1:
#             # print('4')
#             request.data['enq_spero_srv_status']=2
#         else: request.data['enq_spero_srv_status']=3
#         request.data['event_status']=1 
#         # patient= agg_hhc_patients.objects.filter(phone_no=request.data['phone_no']).first()  
#         patient = request.data['agg_sp_pt_id']
#         if patient:
#             patient= agg_hhc_patients.objects.get(agg_sp_pt_id=request.data['agg_sp_pt_id']) 
#             # patient.update(name=request.data['name'], phone_no=request.data['phone_no'],caller_id=callerID,Age=request.data['Age'] )
#             # patientID=patient.first().agg_sp_pt_id 
#             request.data['caller_id']=callerID
#             patientSerializer = agg_hhc_patients_serializer(patient,data=request.data)
#             if patientSerializer.is_valid():
#                 # patientSerializer.validated_data['caller_id']=callerID
#                 patientID=patientSerializer.save().agg_sp_pt_id
#             else: return Response(patientSerializer.errors)
#         else:
#             Patient = agg_hhc_patients_serializer(data=request.data)
            
#             request.data['caller_id']=callerID
#             if Patient.is_valid():
#                 # print(patient,'pppppppppppppp')
#                 patientID=Patient.save().agg_sp_pt_id
#                 # Patient.save()
#                 # print(patient.data)
#                 # patientID=patientID.agg_sp_pt_id
#             else:
#                 return Response([Patient.errors])
#                 # print('4.6')   
#         # elif request.data['purp_call_id']==2:
#         #     patient= agg_hhc_patient_list_enquiry.objects.filter(phone_no=request.data['phone_no']).first()
#         #     request.data['caller_id']=callerID
#         #     if patient:
#         #         # print(patient,'7')
#         #         patientSerializer = agg_hhc_patient_list_serializer(patient,data=request.data)
#         #         if patientSerializer.is_valid():
#         #             # patientSerializer.validated_data['caller_id']=callerID
#         #             # print(patientSerializer)
#         #             # print('pppppppppppppppppppppppppp')
#         #             patientID=patientSerializer.save().pt_id
#         #             # for items in patientID:

#         #             # print(patientID.eve_id)
#         #             #     items.pt_id
#         #             # patientID=patientID.pt_id

#         #             # saved_patients = []
#         #             # for patient_instance in patientSerializer.save():
#         #             #     saved_patients.append(patient_instance)
#         #         else:
#         #             # print(';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;')
#         #             return Response(patientSerializer.errors)
#         #         # patient.update(name=request.data['name'], phone_no=request.data['phone_no'],caller_id=callerID,Age=request.data['Age'] )
#         #         # patientID=patient.first().pt_id 
#         #     else:
#         #         request.data['caller_id']=callerID
#         #         patient = agg_hhc_patient_list_serializer(data=request.data)
#         #         # print('9')
#         #         if patient.is_valid():
#         #             patientID=patient.save()
#         #             patientID=patientID.pt_id
#         #             # print('10')
#         #         else:
#         #             return Response([patient.errors])

#         # else:
#         #     patient=models.agg_hhc_patient_list_enquiry.objects.filter(phone_no=request.data['phone_no'])
#         # # if patient:
#         # #     patient.update(name=request.data['name'], phone_no=request.data['phone_no'],caller_id=callerID )
#         # #     patientID=patient.first().agg_sp_pt_id 
#         # else:
#         #     patient = serializers.agg_hhc_patients_serializer(data=request.data)
#         #         # patient = serializers.agg_hhc_patient_list_serializer(data=request.data)
#         #     if patient.is_valid():
#         #         # patient.validated_data['caller_id']=callerID
#         #         # print(patient.validated_data['caller_id'],';;;;;;;;;;;;;;;;;;;;;;;;')
#         #         patientID=patient.save()
#         #         patientID=patientID.agg_sp_pt_id

#         #     else:
#         #         return Response(patient.errors)
#         # print(callerID,'ll;;;l')
#         # print(patientID,'ll;;;l')
#         # request.data['event_status']=1
#         event= agg_hhc_event_serializer(data=request.data)
#         if event.is_valid():
#             eventID=event.save().eve_id
#         else:
#             return Response([event.errors])
#         event= agg_hhc_events.objects.filter(eve_id=eventID,status=1)
#         # if request.data['purp_call_id']==1:
#             # print('spero service')
#         event.update(agg_sp_pt_id=patientID,caller_id=callerID,patient_service_status=3)
#         # elif request.data['purp_call_id']==2:
#         #     # print('enquiry')
#         #     event.update(pt_id=patientID,caller_id=callerID,patient_service_status=3)
#         # data=request.data['sub_srv_id']
#         # dates = datetime.strptime(str(request.data['dates']), '%Y-%m-%d')
#         # dates=request.data['dates']
#         # dates = self.strings_to_dates(dates)
        
#         # start_date = datetime.strptime(request.data['start_date'], '%Y-%m-%d')
#         # end_date = datetime.strptime(request.data['end_date'], '%Y-%m-%d')
#         # start_date = dates[0][0]
#         # end_date = dates[0][-1]
#         # print(start_date, end_date)



#         # diff = ((end_date.date() - start_date.date()).days)
#         # # diff =len(dates[0])
#         # # print(diff, 'difference')
#         # a=[request.data['sub_srv_id']]
#         # # for sub_srv in request.data['sub_srv_id']:    for multiple sub services
#         # event_plane_of_care=[]
#         # for sub_srv in a:
#         #     request.data['sub_srv_id']=sub_srv 
#         #     request.data['initail_final_amount']=request.data['final_amount'] 
#         #     # datess=[date.strftime('%Y-%m-%d') for date in dates[1]]
#         #     # strdates=",".join(datess)
#         #     # request.data['No_session_dates']=strdates
#         #     # request.data['start_date']=start_date.date()
#         #     # print(start_date.date(),end_date.date())
#         #     # request.data['end_date']=end_date.date()
#         #     if request.data['preferred_hosp_id']:
#         #         request.data['hosp_id']=request.data['preferred_hosp_id']
#         #     add_service= agg_hhc_create_service_serializer(data=request.data)
#         #     if add_service.is_valid():
#         #         service=add_service.save().eve_poc_id
#         #         # print(service)
#         #     else:
#         #         return Response([add_service.errors])
#         #     # print('demo')
#         #     plan_O_C= agg_hhc_event_plan_of_care.objects.filter(eve_poc_id=service,status=1)
#         #     plan_O_C.update(eve_id=eventID)
#         #     event_plane_of_care.append(service)
#         #     if request.data['purp_call_id']==1:
#         #         # for i in range(0,(diff)):
#         #         for i in range(0,(diff+1)):
#         #             start_date_string=(start_date+timedelta(days=i))
#         #             # d=dates[0][i]
#         #             # print(start_date_string)
#         #             # request.data['actual_StartDate_Time']=(d.date())
#         #             # request.data['actual_EndDate_Time']=(d.date())
#         #             request.data['actual_StartDate_Time']=start_date_string.date()
#         #             # request.data['actual_EndDate_Time']=datetime.combine(start_date_string.date(),end_date.time())
#         #             request.data['actual_EndDate_Time']=start_date_string.date()
#         #             detailPlaneofcare= agg_hhc_add_detail_service_serializer(data=request.data)
#         #             if detailPlaneofcare.is_valid():
#         #                 # detailPlaneofcare.eve_poc_id=service
#         #                 # detailPlaneofcare.eve_id=eventID
#         #                 # detailPlaneofcare.index_of_Session=(i+1)
#         #                 detail_plan=detailPlaneofcare.save().agg_sp_dt_eve_poc_id
#         #             else:
#         #                 return Response([detailPlaneofcare.errors])
#         #             data1= agg_hhc_detailed_event_plan_of_care.objects.filter(agg_sp_dt_eve_poc_id=detail_plan,status=1)
#         #             data1.update(eve_poc_id=service,eve_id=eventID,index_of_Session=(i+1))

        
#         # Input array
#         # date_ranges = [['2024-05-18, 2024-05-20'], ['2024-05-23, 2024-05-24'], ['2024-05-27, 2024-05-27']]
#         # date_ranges = request.data.get('date_ranges', [])

#         # def get_dates_between(start_date, end_date):
#         #     dates = []
#         #     current_date = start_date
#         #     while current_date <= end_date:
#         #         dates.append(current_date.strftime('%Y-%m-%d'))
#         #         current_date += timedelta(days=1)
#         #     return dates

#         # all_dates = []

#         # for date_range in date_ranges:
#         #     start_str, end_str = date_range[0].split(', ')
#         #     start_date = datetime.strptime(start_str, '%Y-%m-%d')
#         #     end_date = datetime.strptime(end_str, '%Y-%m-%d')
#         #     all_dates.extend(get_dates_between(start_date, end_date))

#         # print(all_dates,"all_dates")
#         # print(len(all_dates))

#         date_ranges = request.data.get('date_ranges', [])

#         def get_dates_between(start_date, end_date):
#             dates = []
#             current_date = start_date
#             while current_date <= end_date:
#                 dates.append(current_date.strftime('%Y-%m-%d'))
#                 current_date += timedelta(days=1)
#             return dates

#         all_dates = []

#         for date_range in date_ranges:
#             start_str, end_str = date_range  # Adjusting to unpack list of two date strings
#             start_date = datetime.strptime(start_str, '%Y-%m-%d')
#             end_date = datetime.strptime(end_str, '%Y-%m-%d')
#             all_dates.extend(get_dates_between(start_date, end_date))

#         print(all_dates, "all_dates")
#         print(len(all_dates))






#         diff = ((end_date.date() - start_date.date()).days)
#         # diff =len(dates[0])
#         # print(diff, 'difference')
#         a=[request.data['sub_srv_id']]
#         # for sub_srv in request.data['sub_srv_id']:    for multiple sub services
#         event_plane_of_care=[]
#         request.data['start_date']= all_dates[0] if all_dates else None
#         request.data['end_date']= all_dates[-1] if all_dates else None
#         for sub_srv in a:
#             request.data['sub_srv_id']=sub_srv 
#             request.data['initail_final_amount']=request.data['final_amount'] 
#             # datess=[date.strftime('%Y-%m-%d') for date in dates[1]]
#             # strdates=",".join(datess)
#             # request.data['No_session_dates']=strdates
#             # request.data['start_date']=start_date.date()
#             # print(start_date.date(),end_date.date())
#             # request.data['end_date']=end_date.date()
#             if request.data['preferred_hosp_id']:
#                 request.data['hosp_id']=request.data['preferred_hosp_id']
#             add_service= agg_hhc_create_service_serializer(data=request.data)
#             if add_service.is_valid():
#                 service=add_service.save().eve_poc_id
#                 # print(service)
#             else:
#                 return Response([add_service.errors])
#             # print('demo')
#             plan_O_C= agg_hhc_event_plan_of_care.objects.filter(eve_poc_id=service,status=1)
#             plan_O_C.update(eve_id=eventID)
#             event_plane_of_care.append(service)
#             if request.data['purp_call_id']==1:
#                 # for i in range(0,(diff)):
#                 # for i in range(0,(diff+1)):
#                 #     start_date_string=(start_date+timedelta(days=i))
#                 #     # d=dates[0][i]
#                 #     # print(start_date_string)
#                 #     # request.data['actual_StartDate_Time']=(d.date())
#                 #     # request.data['actual_EndDate_Time']=(d.date())
#                 #     request.data['actual_StartDate_Time']=start_date_string.date()
#                 #     # request.data['actual_EndDate_Time']=datetime.combine(start_date_string.date(),end_date.time())
#                 #     request.data['actual_EndDate_Time']=start_date_string.date()
#                 #     # print(request.data,"dtl ",i)
                    
#                 #     detailPlaneofcare= agg_hhc_add_detail_service_serializer(data=request.data)
#                 #     if detailPlaneofcare.is_valid():
#                 #         # detailPlaneofcare.eve_poc_id=service
#                 #         # detailPlaneofcare.eve_id=eventID
#                 #         # detailPlaneofcare.index_of_Session=(i+1)
#                 #         detail_plan=detailPlaneofcare.save().agg_sp_dt_eve_poc_id
#                 #     else:
#                 #         return Response([detailPlaneofcare.errors])
#                 #     data1= agg_hhc_detailed_event_plan_of_care.objects.filter(agg_sp_dt_eve_poc_id=detail_plan,status=1)
#                 #     data1.update(eve_poc_id=service,eve_id=eventID,index_of_Session=(i+1))

#                 for i in range(0,(len(all_dates))):
#                     # start_date_string=(start_date+timedelta(days=i))
#                     start_date_string = all_dates[i]
#                     print(start_date_string,"start_date_string")
#                     # d=dates[0][i]
#                     # print(start_date_string)
#                     # request.data['actual_StartDate_Time']=(d.date())
#                     # request.data['actual_EndDate_Time']=(d.date())
#                     # request.data['actual_StartDate_Time']=start_date_string.date()
#                     request.data['actual_StartDate_Time']=start_date_string
#                     # request.data['actual_EndDate_Time']=datetime.combine(start_date_string.date(),end_date.time())
#                     request.data['actual_EndDate_Time']=start_date_string
#                     # print(request.data,"dtl ",i)
                    
#                     detailPlaneofcare= agg_hhc_add_detail_service_serializer(data=request.data)
#                     if detailPlaneofcare.is_valid():
#                         # detailPlaneofcare.eve_poc_id=service
#                         # detailPlaneofcare.eve_id=eventID
#                         # detailPlaneofcare.index_of_Session=(i+1)
#                         detail_plan=detailPlaneofcare.save().agg_sp_dt_eve_poc_id
#                     else:
#                         return Response([detailPlaneofcare.errors])
#                     data1= agg_hhc_detailed_event_plan_of_care.objects.filter(agg_sp_dt_eve_poc_id=detail_plan,status=1)
#                     data1.update(eve_poc_id=service,eve_id=eventID,index_of_Session=(i+1))



#         jb_cl_que = request.data.get('jb_cl_que', [])  
#         r_srv_id = request.data.get('srv_id')

#         get_enq_que = agg_hhc_events_wise_jc_question.objects.filter(eve_id = eventID, is_srv_enq_q = 2, status = 1)
#         get_enq_que.update(status=2)
         
#         if jb_cl_que:
#             print(jb_cl_que,'jb_cl_que')
#             r_srv_id = request.data.get('srv_id')
#             print(r_srv_id,'r_srv_id')
#             for q_id in jb_cl_que:
#                 print(q_id,'q_id')
#                 inst = agg_hhc_job_closure_questions.objects.get(jcq_id=int(q_id))
#                 print(inst, 'inst')
#                 data = {
#                         'eve_id':eventID,
#                         'srv_id':r_srv_id,
#                         'jcq_id':inst.jcq_id,
#                         'is_srv_enq_q':1
#                     }
                    
#                 serializer_val = agg_hhc_job_cl_questions_eventwise(data=data)
#                 if serializer_val.is_valid():
#                     serializer_val.save()
#                     print(serializer_val.data,'serializer_val')
#                 else:
#                     print('serializer_val not')


#         if request.data['purp_call_id']==1: 
#             # return Response({"Service Created Event Code":[eventID,eventID.agg_sp_pt_id]})
#             event=agg_hhc_events.objects.get(eve_id=eventID)
#             events=agg_hhc_event_response_serializer(event)
            
            
#             # jb_cl_que = request.data.get('jb_cl_que', [])  
#             # r_srv_id = request.data.get('srv_id')
         
#             # if jb_cl_que:
#             #     print(jb_cl_que,'jb_cl_que')
#             #     r_srv_id = request.data.get('srv_id')
#             #     print(r_srv_id,'r_srv_id')
#             #     for q_id in jb_cl_que:
#             #         print(q_id,'q_id')
#             #         inst = agg_hhc_job_closure_questions.objects.get(jcq_id=int(q_id))
#             #         print(inst, 'inst')
#             #         data = {
#             #             'eve_id':eventID,
#             #             'srv_id':r_srv_id,
#             #             'jcq_id':inst.jcq_id
#             #         }
#             #         serializer_val = agg_hhc_job_cl_questions_eventwise(data=data)
#             #         if serializer_val.is_valid():
#             #             serializer_val.save()
#             #             print(serializer_val.data,'serializer_val')
#             #         else:
#             #             print('serializer_val not')
                                

#                     # abc = agg_hhc_events_wise_jc_question.objects.create(
#                     #     srv_id_id=r_srv_id,
#                     #     jcq_id=inst  # Assign the instance directly, not its jcq_id attribute
#                     # )

#             return Response({"Service Created Event Code":[{"event_id":eventID},events.data,{"event_plan_of_care_id":event_plane_of_care}]})

#         # else:
#         elif request.data['purp_call_id']==2:
#             request.data['event_id']=eventID
#             request.data['follow_up']=4

#             create_follow_up= agg_hhc_enquiry_create_follow_up_serializer(data= request.data)
#             if create_follow_up.is_valid():
#                 # callers.validated_data['caller_status']=3
#                 create_follow_up.save()
#             else:               
#                 return Response([create_follow_up.errors])
            
            
            
            
#             # jb_cl_que = request.data.get('jb_cl_que', [])  
#             # r_srv_id = request.data.get('srv_id')
         
#             # if jb_cl_que:
#             #     print(jb_cl_que,'jb_cl_que')
#             #     r_srv_id = request.data.get('srv_id')
#             #     print(r_srv_id,'r_srv_id')
#             #     for q_id in jb_cl_que:
#             #         print(q_id,'q_id')
#             #         inst = agg_hhc_job_closure_questions.objects.get(jcq_id=int(q_id))
#             #         print(inst, 'inst')
#             #         data = {
#             #             'eve_id':eventID,
#             #             'srv_id':r_srv_id,
#             #             'jcq_id':inst.jcq_id
#             #         }
#             #         serializer_val = agg_hhc_job_cl_questions_eventwise(data=data)
#             #         if serializer_val.is_valid():
#             #             serializer_val.save()
#             #             print(serializer_val.data,'serializer_val')
#             #         else:
#             #             print('serializer_val not')

#             return Response({"Service Created Event Code":eventID})
#         else:
#             return Response('something went wrong')
        
#     # def put(self,request,pk):    
#     #     clgref_id = get_prof(request)[3]
#     #     request.data['last_modified_by'] = clgref_id
#     #     # event=self.get_event(pk)
#     #     should_null=['caller_rel_id','agg_sp_pt_id','pincode','prof_prefered','remark','discount_type','discount_value','final_amount','discount_value','day_convinance','total_convinance','jb_cl_que']
#     #     for key, value in request.data.items():
#     #         # print(f'"{key}", values are {value}')
#     #         if key not in should_null:
#     #             if not value :
#     #                 print({'error':f'"{key}" this field should not to be empty'})
#     #                 # return Response({'error':f'"{key}" this field should not to be empty'})
#     #                 return Response({'error':'fill all required fields'})
#     #     request.data['purp_call_id']=1
#     #     caller = self.get_caller(phone=request.data['phone'])
#     #     # print(caller.__dict__.items(),'llklll')
        
#     #     print(';')
#     #     if caller:
#     #         # caller.update(caller_fullname=request.data['caller_fullname'], caller_rel_id=request.data['caller_rel_id'], purp_call_id=request.data['purp_call_id'], caller_status=3)
#     #         # caller.update(caller_fullname=request.data['caller_fullname'], caller_rel_id=request.data['caller_rel_id'], purp_call_id=request.data['purp_call_id'], caller_status=3)
#     #         # callerID = caller.first().caller_id 
#     #         callerSerializer= agg_hhc_callers_serializer(caller,data= request.data)
#     #         if callerSerializer.is_valid():
#     #             # print(';;;;;;;;;;;')
#     #             callerID=callerSerializer.save().caller_id
#     #         else:
#     #             return Response(callerSerializer.errors)
#     #     else:  
#     #         callers= agg_hhc_callers_serializer(data= request.data)
#     #         if callers.is_valid():
#     #             # callers.validated_data['caller_status']=3
#     #             callerID=callers.save().caller_id
#     #         else:
#     #             return Response([callers.errors])       
#     #     # # print(callerID,'llllsecond')
#     #     # if request.data['purp_call_id']==1:
#     #     # print('l')
#     #     patient=request.data['agg_sp_pt_id']
#     #     if patient:
#     #         patient=self.get_patient(agg_sp_pt_id=patient)

#     #         # patient.update(name=request.data['name'], phone_no=request.data['phone_no'],caller_id=callerID,Age=request.data['Age'] )
#     #         # patientID=patient.first().agg_sp_pt_id 
#     #         patientSerializer= agg_hhc_patients_serializer(patient,data=request.data)
#     #         if patientSerializer.is_valid():
#     #             patientID=patientSerializer.save().agg_sp_pt_id
#     #             # print(patientID,';;;;;;;;;;;;;;;;;;')
#     #             # return Response(patientSerializer.data)
#     #         else:
#     #             return Response(patientSerializer.errors)
#     #     else:
#     #         patient = agg_hhc_patients_serializer(data=request.data)
#     #         try:
#     #             caller_id = agg_hhc_callers.objects.get(caller_id=callerID)
#     #         except agg_hhc_callers.DoesNotExist:
#     #             return Response({'error':'caller not fount'})
#     #         if patient.is_valid():
#     #             patient.validated_data['caller_id']=caller_id
#     #             patientID=patient.save()
#     #             patientID=patientID.agg_sp_pt_id
#     #         else:
#     #             return Response([patient.errors])
#     #     # else:
#     #     #     patient=models.agg_hhc_patient_list_enquiry.objects.filter(Q(phone_no=request.data['phone_no'])|Q())
#     #     #     if patient:
#     #     #         patient.update(name=request.data['name'], phone_no=request.data['phone_no'],caller_id=callerID,Age=request.data['Age'] )
#     #     #         patientID=patient.first().pt_id 
#     #     #     else:
#     #     #         patient = serializers.agg_hhc_patient_list_serializer(data=request.data)
#     #     #         if patient.is_valid():
#     #     #             patientID=patient.save()
#     #     #             patientID=patientID.pt_id
#     #     #         else:
#     #     #             return Response([patient.errors,'7'])

#     #     # if event.is_valid():
#     #     #     eventID=event.save().eve_id
#     #     # else:
#     #     #     return Response([event.errors,'8'])
#     #     # print(pk,'llllllllllll')
#     #     if request.data['preferred_hosp_id']:
#     #         request.data['hosp_id']=request.data['preferred_hosp_id']
#     #     event=self.get_event(pk)
#     #     # if request.data['purp_call_id']==1:
#     #     eventSerializer= agg_hhc_updateID_event_serializer(event,data=request.data)
#     #     if eventSerializer.is_valid():
#     #         eventID=eventSerializer.save().eve_id
#     #     else:
#     #         return Response(eventSerializer.errors)
#     #     data={'agg_sp_pt_id':patientID,'caller_id':callerID,'status':1,'enq_spero_srv_status':1,'last_modified_by':clgref_id,'added_by':clgref_id}
#     #     eventSerializer= agg_hhc_updateIDs_event_serializer(event,data=data)
#     #     if eventSerializer.is_valid():
#     #         eventID=eventSerializer.save().eve_id
#     #         # print(eventSerializer.validated_data)
#     #         # eventSerializer.save()
#     #     else:
#     #         return Response(eventSerializer.errors)

#     #     # event.update(agg_sp_pt_id=patientID,caller_id=callerID)
#     #     # eventID=event.first().eve_id
#     #     # print(eventID)
#     #     # print(callerID)
#     #     # else:
#     #     #     event.update(pt_id=patientID,caller_id=callerID)
#     #     # dates=request.data['dates']
#     #     # dates = self.strings_to_dates(dates)
        
#     #     # start_date = dates[0][0]
#     #     # end_date = dates[0][-1]
#     #     start_date = datetime.strptime(str(request.data['start_date']), '%Y-%m-%d')
#     #     end_date = datetime.strptime(str(request.data['end_date']), '%Y-%m-%d')
#     #     diff = ((end_date.date() - start_date.date()).days)
#     #     # diff =len(dates[0])
#     #     a=[request.data['sub_srv_id']]
#     #     event_plane_of_care=[]
#     #     for sub_srv in a:
#     #         print(eventID,'id')
#     #         plan_O_C= agg_hhc_event_plan_of_care.objects.filter(eve_id=eventID,status=1).last()
#     #         print(plan_O_C,'demo')
#     #         request.data['sub_srv_id']=sub_srv 
#     #         request.data['initail_final_amount']=request.data['final_amount'] 
#     #         # datess=[date.strftime('%Y-%m-%d') for date in dates[1]]
#     #         # strdates=",".join(datess)
#     #         # request.data['No_session_dates']=strdates
            
#     #         add_service= agg_hhc_create_service_serializer(plan_O_C,data=request.data)
#     #         if add_service.is_valid():
#     #             print(start_date)
#     #             print(end_date)
#     #             # add_service.validated_data['start_date']=start_date.date()
#     #             # add_service.validated_data['end_date']=end_date.date()
#     #             service=add_service.save().eve_poc_id
#     #         else:
#     #             return Response([add_service.errors])
#     #         # plan_O_C.update(eve_id=eventID)
#     #         plan_O_C= agg_hhc_event_plan_of_care.objects.filter(eve_poc_id=service,status=1)
#     #         plan_O_C.update(eve_id=eventID)
#     #         event_plane_of_care.append(service)
#     #         if request.data['purp_call_id']==1:
#     #             # for i in range(0,(diff)):
#     #             for i in range(0,(diff+1)):
#     #                 # start_date_string=start_date+timedelta(days=i)
#     #                 # d=dates[0][i]
#     #                 # request.data['actual_StartDate_Time']=(d.date())
#     #                 # request.data['actual_EndDate_Time']=(d.date())
#     #                 start_date_string=start_date+timedelta(days=i)
#     #                 # request.data['actual_StartDate_Time']=start_date_string
#     #                 # request.data['actual_EndDate_Time']=datetime.combine(start_date_string.date(),end_date.time())
#     #                 request.data['actual_StartDate_Time']=start_date_string.date()
#     #                 request.data['actual_EndDate_Time']=start_date_string.date()
#     #                 detailPlaneofcare= agg_hhc_add_detail_service_serializer(data=request.data)
#     #                 if detailPlaneofcare.is_valid():
#     #                     detailPlaneofcare.eve_poc_id=service
#     #                     detailPlaneofcare.eve_id=eventID
#     #                     detail_plan=detailPlaneofcare.save().agg_sp_dt_eve_poc_id
#     #                 else:
#     #                     return Response([detailPlaneofcare.errors,'000'])
#     #                 data1= agg_hhc_detailed_event_plan_of_care.objects.filter(agg_sp_dt_eve_poc_id=detail_plan,status=1)
#     #                 data1.update(eve_poc_id=service,eve_id=eventID,index_of_Session=(i+1))                
#     #     # return Response({"Service Created Event Code"})
        
#     #     jb_cl_que = request.data.get('jb_cl_que', [])  
#     #     r_srv_id = request.data.get('srv_id')

#     #     get_enq_que = agg_hhc_events_wise_jc_question.objects.filter(eve_id = eventID, status = 1)
#     #     # get_enq_que.update(status=2)
#     #     for eves in get_enq_que:
#     #         eves.status = 2
#     #         eves.save()
         
#     #     if jb_cl_que:
#     #         print(jb_cl_que,'jb_cl_que')
#     #         r_srv_id = request.data.get('srv_id')
#     #         print(r_srv_id,'r_srv_id')
#     #         for q_id in jb_cl_que:
#     #             print(q_id,'q_id')
#     #             inst = agg_hhc_job_closure_questions.objects.get(jcq_id=int(q_id))
#     #             print(inst, 'inst')
#     #             data = {
#     #                     'eve_id':eventID,
#     #                     'srv_id':r_srv_id,
#     #                     'jcq_id':inst.jcq_id,
#     #                     'is_srv_enq_q':1
#     #                 }
                    
#     #             serializer_val = agg_hhc_job_cl_questions_eventwise(data=data)
#     #             if serializer_val.is_valid():
#     #                 serializer_val.save()
#     #                 print(serializer_val.data,'serializer_val')
#     #             else:
#     #                 print('serializer_val not')


#     #     if request.data['purp_call_id']==1: 
#     #         event=agg_hhc_events.objects.get(eve_id=eventID)
#     #         events=agg_hhc_event_response_serializer(event)

            
#     #         return Response({"Service Created Event Code":[{"event_id":eventID},events.data,{"event_plan_of_care_id":event_plane_of_care}]})
#     #     else:
#     #         # agg_hhc_enquiry_create_follow_up_serializer
#     #         return Response({"Service Created Event Code":eventID})

#     def put(self,request,pk):    
#         clgref_id = get_prof(request)[3]
#         request.data['last_modified_by'] = clgref_id
#         # event=self.get_event(pk)
#         should_null=['caller_rel_id','agg_sp_pt_id','pincode','prof_prefered','remark','discount_type','discount_value','final_amount','discount_value','day_convinance','total_convinance','jb_cl_que']
#         for key, value in request.data.items():
#             # print(f'"{key}", values are {value}')
#             if key not in should_null:
#                 if not value :
#                     print({'error':f'"{key}" this field should not to be empty'})
#                     # return Response({'error':f'"{key}" this field should not to be empty'})
#                     return Response({'error':'fill all required fields'})
#         request.data['purp_call_id']=1
#         caller = self.get_caller(phone=request.data['phone'])
#         # print(caller.__dict__.items(),'llklll')
        
#         print(';')
#         if caller:
#             # caller.update(caller_fullname=request.data['caller_fullname'], caller_rel_id=request.data['caller_rel_id'], purp_call_id=request.data['purp_call_id'], caller_status=3)
#             # caller.update(caller_fullname=request.data['caller_fullname'], caller_rel_id=request.data['caller_rel_id'], purp_call_id=request.data['purp_call_id'], caller_status=3)
#             # callerID = caller.first().caller_id 
#             callerSerializer= agg_hhc_callers_serializer(caller,data= request.data)
#             if callerSerializer.is_valid():
#                 # print(';;;;;;;;;;;')
#                 callerID=callerSerializer.save().caller_id
#             else:
#                 return Response(callerSerializer.errors)
#         else:  
#             callers= agg_hhc_callers_serializer(data= request.data)
#             if callers.is_valid():
#                 # callers.validated_data['caller_status']=3
#                 callerID=callers.save().caller_id
#             else:
#                 return Response([callers.errors])       
#         # # print(callerID,'llllsecond')
#         # if request.data['purp_call_id']==1:
#         # print('l')
#         patient=request.data['agg_sp_pt_id']
#         if patient:
#             patient=self.get_patient(agg_sp_pt_id=patient)

#             # patient.update(name=request.data['name'], phone_no=request.data['phone_no'],caller_id=callerID,Age=request.data['Age'] )
#             # patientID=patient.first().agg_sp_pt_id 
#             patientSerializer= agg_hhc_patients_serializer(patient,data=request.data)
#             if patientSerializer.is_valid():
#                 patientID=patientSerializer.save().agg_sp_pt_id
#                 # print(patientID,';;;;;;;;;;;;;;;;;;')
#                 # return Response(patientSerializer.data)
#             else:
#                 return Response(patientSerializer.errors)
#         else:
#             patient = agg_hhc_patients_serializer(data=request.data)
#             try:
#                 caller_id = agg_hhc_callers.objects.get(caller_id=callerID)
#             except agg_hhc_callers.DoesNotExist:
#                 return Response({'error':'caller not fount'})
#             if patient.is_valid():
#                 patient.validated_data['caller_id']=caller_id
#                 patientID=patient.save()
#                 patientID=patientID.agg_sp_pt_id
#             else:
#                 return Response([patient.errors])
#         # else:
#         #     patient=models.agg_hhc_patient_list_enquiry.objects.filter(Q(phone_no=request.data['phone_no'])|Q())
#         #     if patient:
#         #         patient.update(name=request.data['name'], phone_no=request.data['phone_no'],caller_id=callerID,Age=request.data['Age'] )
#         #         patientID=patient.first().pt_id 
#         #     else:
#         #         patient = serializers.agg_hhc_patient_list_serializer(data=request.data)
#         #         if patient.is_valid():
#         #             patientID=patient.save()
#         #             patientID=patientID.pt_id
#         #         else:
#         #             return Response([patient.errors,'7'])

#         # if event.is_valid():
#         #     eventID=event.save().eve_id
#         # else:
#         #     return Response([event.errors,'8'])
#         # print(pk,'llllllllllll')
#         if request.data['preferred_hosp_id']:
#             request.data['hosp_id']=request.data['preferred_hosp_id']
#         event=self.get_event(pk)
#         # if request.data['purp_call_id']==1:
#         eventSerializer= agg_hhc_updateID_event_serializer(event,data=request.data)
#         if eventSerializer.is_valid():
#             eventID=eventSerializer.save().eve_id
#         else:
#             return Response(eventSerializer.errors)
#         data={'agg_sp_pt_id':patientID,'caller_id':callerID,'status':1,'enq_spero_srv_status':1,'last_modified_by':clgref_id,'added_by':clgref_id}
#         eventSerializer= agg_hhc_updateIDs_event_serializer(event,data=data)
#         if eventSerializer.is_valid():
#             eventID=eventSerializer.save().eve_id
#             # print(eventSerializer.validated_data)
#             # eventSerializer.save()
#         else:
#             return Response(eventSerializer.errors)

#         # event.update(agg_sp_pt_id=patientID,caller_id=callerID)
#         # eventID=event.first().eve_id
#         # print(eventID)
#         # print(callerID)
#         # else:
#         #     event.update(pt_id=patientID,caller_id=callerID)
#         # dates=request.data['dates']
#         # dates = self.strings_to_dates(dates)
        
#         # start_date = dates[0][0]
#         # end_date = dates[0][-1]

#         date_ranges = request.data.get('date_ranges', [])

#         all_dates = []

#         for date_range in date_ranges:
#             start_str, end_str = date_range[0].split(', ')
#             start_date = datetime.strptime(start_str, '%Y-%m-%d')
#             end_date = datetime.strptime(end_str, '%Y-%m-%d')
#             all_dates.extend(self.get_dates_between(start_date, end_date))

#         print(all_dates,"all_dates")
#         print(len(all_dates))


#         # start_date = datetime.strptime(str(request.data['start_date']), '%Y-%m-%d')
#         # end_date = datetime.strptime(str(request.data['end_date']), '%Y-%m-%d')
#         # diff = ((end_date.date() - start_date.date()).days)
#         # diff =len(dates[0])
#         a=[request.data['sub_srv_id']]
#         event_plane_of_care=[]

#         request.data['start_date']= all_dates[0] if all_dates else None
#         request.data['end_date']= all_dates[-1] if all_dates else None

#         for sub_srv in a:
#             print(eventID,'id')
#             plan_O_C= agg_hhc_event_plan_of_care.objects.filter(eve_id=eventID,status=1).last()
#             print(plan_O_C,'demo')
#             request.data['sub_srv_id']=sub_srv 
#             request.data['initail_final_amount']=request.data['final_amount'] 
#             # datess=[date.strftime('%Y-%m-%d') for date in dates[1]]
#             # strdates=",".join(datess)
#             # request.data['No_session_dates']=strdates
            
#             add_service= agg_hhc_create_service_serializer(plan_O_C,data=request.data)
#             if add_service.is_valid():
#                 print(start_date)
#                 print(end_date)
#                 # add_service.validated_data['start_date']=start_date.date()
#                 # add_service.validated_data['end_date']=end_date.date()
#                 service=add_service.save().eve_poc_id
#             else:
#                 return Response([add_service.errors])
#             # plan_O_C.update(eve_id=eventID)
#             plan_O_C= agg_hhc_event_plan_of_care.objects.filter(eve_poc_id=service,status=1)
#             plan_O_C.update(eve_id=eventID)
#             event_plane_of_care.append(service)
#             if request.data['purp_call_id']==1:
#                 # for i in range(0,(diff)):
#                 # for i in range(0,(diff+1)):
#                 for i in range(0,(len(all_dates))):
#                     # start_date_string=start_date+timedelta(days=i)
#                     # d=dates[0][i]
#                     # request.data['actual_StartDate_Time']=(d.date())
#                     # request.data['actual_EndDate_Time']=(d.date())
#                     # start_date_string=start_date+timedelta(days=i)
#                     start_date_string = all_dates[i]
#                     # request.data['actual_StartDate_Time']=start_date_string
#                     # request.data['actual_EndDate_Time']=datetime.combine(start_date_string.date(),end_date.time())
#                     # request.data['actual_StartDate_Time']=start_date_string.date()
#                     request.data['actual_StartDate_Time']=start_date_string
#                     # request.data['actual_EndDate_Time']=start_date_string.date()
#                     request.data['actual_EndDate_Time']=start_date_string
#                     detailPlaneofcare= agg_hhc_add_detail_service_serializer(data=request.data)
#                     if detailPlaneofcare.is_valid():
#                         detailPlaneofcare.eve_poc_id=service
#                         detailPlaneofcare.eve_id=eventID
#                         detail_plan=detailPlaneofcare.save().agg_sp_dt_eve_poc_id
#                     else:
#                         return Response([detailPlaneofcare.errors,'000'])
#                     data1= agg_hhc_detailed_event_plan_of_care.objects.filter(agg_sp_dt_eve_poc_id=detail_plan,status=1)
#                     data1.update(eve_poc_id=service,eve_id=eventID,index_of_Session=(i+1))                
#         # return Response({"Service Created Event Code"})
        
#         jb_cl_que = request.data.get('jb_cl_que', [])  
#         r_srv_id = request.data.get('srv_id')

#         get_enq_que = agg_hhc_events_wise_jc_question.objects.filter(eve_id = eventID, status = 1)
#         # get_enq_que.update(status=2)
#         for eves in get_enq_que:
#             eves.status = 2
#             eves.save()
         
#         if jb_cl_que:
#             print(jb_cl_que,'jb_cl_que')
#             r_srv_id = request.data.get('srv_id')
#             print(r_srv_id,'r_srv_id')
#             for q_id in jb_cl_que:
#                 print(q_id,'q_id')
#                 inst = agg_hhc_job_closure_questions.objects.get(jcq_id=int(q_id))
#                 print(inst, 'inst')
#                 data = {
#                         'eve_id':eventID,
#                         'srv_id':r_srv_id,
#                         'jcq_id':inst.jcq_id,
#                         'is_srv_enq_q':1
#                     }
                    
#                 serializer_val = agg_hhc_job_cl_questions_eventwise(data=data)
#                 if serializer_val.is_valid():
#                     serializer_val.save()
#                     print(serializer_val.data,'serializer_val')
#                 else:
#                     print('serializer_val not')


#         if request.data['purp_call_id']==1: 
#             event=agg_hhc_events.objects.get(eve_id=eventID)
#             events=agg_hhc_event_response_serializer(event)

            
#             return Response({"Service Created Event Code":[{"event_id":eventID},events.data,{"event_plan_of_care_id":event_plane_of_care}]})
#         else:
#             # agg_hhc_enquiry_create_follow_up_serializer
#             return Response({"Service Created Event Code":eventID})



class agg_hhc_add_service_details_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    
    def get_event(self,pk):
        try:
            event = agg_hhc_events.objects.get(eve_id=pk)
            return event
        except agg_hhc_events.DoesNotExist:
            return Response('please enter valid event id',status.HTTP_404_NOT_FOUND)
        
        
    def get_caller(self,phone):
        try:
            return agg_hhc_callers.objects.get(phone=phone)
        except agg_hhc_callers.DoesNotExist:
            return Response('please enter valid event id',status.HTTP_404_NOT_FOUND)

    def get_patient(self,agg_sp_pt_id):
        try:
            return agg_hhc_patients.objects.get(agg_sp_pt_id=agg_sp_pt_id)
        except agg_hhc_patients.DoesNotExist:
            return Response('please enter valid event id',status.HTTP_404_NOT_FOUND)

    def get(self, request, pk):
        event = self.get_event(pk)
        # enquiry_from = is_web_form
        if not event:
            return Response({'not found'},status.HTTP_404_NOT_FOUND)
        # if enquiry_from:
            # patient_details = patient_data_serializer_form(event)
        # else: 
        patient_details = patient_data_serializer(event)
        return Response(patient_details.data)

    # def get(self,request,pk):
    #     event = self.get_event(pk)
    #     if not event:
    #         return Response({'no data'},status.HTTP_404_NOT_FOUND)
    #     print(event.caller_id,'dddddddddddd')
    #     print(event.eve_id)
    
    #     callerserializer = add_service_get_caller_serializer(event.caller_id)
    #     patientserializer = add_service_get_patient_serializer(event.pt_id)
    #     plan_of_care = agg_hhc_event_plan_of_care.objects.filter(eve_id=pk)
    #     plan_of_care_serializer = add_service_get_POC_serializer(plan_of_care,many=True)
    #     query_count = len(connection.queries)
    #     return Response({'caller_details':callerserializer.data,'patient_details':patientserializer.data,'POC':plan_of_care_serializer.data[-1]})
    # #     return Response({'patient_data':patient_data.data})

    # def post(self, request):
    #     create_service = create_service_serializer(data=request.data)
    #     if create_service.is_valid():
    #         create_service.save()
    #         return Response(create_service.data)
    #     else:
    #         return Response(create_service.errors)
    def strings_to_dates(self,date_strings):
        date_objects = []
        for date_string in date_strings:
            try:
                date_object = datetime.strptime(date_string, '%Y-%m-%d')
                date_objects.append(date_object)
            except ValueError as e:
                return {"error": "Please check if the date format is proper."}

        sorted_dates = sorted(date_objects)
        check_date = sorted_dates[0]
        off_days = []

        while check_date < sorted_dates[-1]:
            check_date += timedelta(days=1)
            if check_date not in sorted_dates:
                # off_days.append(check_date.strftime('%Y-%m-%d'))
                off_days.append(check_date)

        # return [date.strftime('%Y-%m-%d') for date in sorted_dates], off_days
        return [sorted_dates, off_days]
    
   
    
    def post(self,request): 
        clgref_id = get_prof(request)[3]
        request.data['last_modified_by'] = clgref_id
        should_null=['caller_rel_id','agg_sp_pt_id','pincode','prof_prefered','remark','discount_type','discount_value','final_amount','discount_value','day_convinance','total_convinance', 'jb_cl_que','coupon_id']
        for key, value in request.data.items():
            if key not in should_null:
                if not value :
                    print(key, 'asd;fglhk')
                    # return Response({'error':f'"{key}" this field should not to be empty'})
                    return Response({'error':'fill all required fields'})
        patientID=None  
        # print(';;demo;;')
        
        caller = agg_hhc_callers.objects.filter(phone=request.data['phone'],status=1).first()
        if caller:
            callerSerializer= agg_hhc_callers_serializer(caller,data= request.data)
            if callerSerializer.is_valid():
                callerID=callerSerializer.save()
                callerID=callerID.caller_id
                # print('2')
            else:
                return Response(callerSerializer.errors)
            # caller.update(caller_fullname=request.data['caller_fullname'], caller_rel_id=request.data['caller_rel_id'], purp_call_id=request.data['purp_call_id'], caller_status=3)
            # callerID = caller.first().caller_id 
        else:  
            callers= agg_hhc_callers_serializer(data= request.data)
            if callers.is_valid():
                # callers.validated_data['caller_status']=3
                callerID=callers.save().caller_id
                # print('3')
            else:
                return Response([callers.errors])
        # print(callerID,'llllsecond')
        if request.data['purp_call_id']==1:
            # print('4')
            request.data['enq_spero_srv_status']=2
        else: request.data['enq_spero_srv_status']=3
        request.data['event_status']=1 
        # patient= agg_hhc_patients.objects.filter(phone_no=request.data['phone_no']).first()  
        patient = request.data['agg_sp_pt_id']
        if patient:
            patient= agg_hhc_patients.objects.get(agg_sp_pt_id=request.data['agg_sp_pt_id']) 
            # patient.update(name=request.data['name'], phone_no=request.data['phone_no'],caller_id=callerID,Age=request.data['Age'] )
            # patientID=patient.first().agg_sp_pt_id 
            request.data['caller_id']=callerID
            patientSerializer = agg_hhc_patients_serializer(patient,data=request.data)
            if patientSerializer.is_valid():
                # patientSerializer.validated_data['caller_id']=callerID
                patientID=patientSerializer.save().agg_sp_pt_id
            else: return Response(patientSerializer.errors)
        else:
            Patient = agg_hhc_patients_serializer(data=request.data)
            
            request.data['caller_id']=callerID
            if Patient.is_valid():
                # print(patient,'pppppppppppppp')
                patientID=Patient.save().agg_sp_pt_id
                # Patient.save()
                # print(patient.data)
                # patientID=patientID.agg_sp_pt_id
            else:
                return Response([Patient.errors])
                # print('4.6')   
        # elif request.data['purp_call_id']==2:
        #     patient= agg_hhc_patient_list_enquiry.objects.filter(phone_no=request.data['phone_no']).first()
        #     request.data['caller_id']=callerID
        #     if patient:
        #         # print(patient,'7')
        #         patientSerializer = agg_hhc_patient_list_serializer(patient,data=request.data)
        #         if patientSerializer.is_valid():
        #             # patientSerializer.validated_data['caller_id']=callerID
        #             # print(patientSerializer)
        #             # print('pppppppppppppppppppppppppp')
        #             patientID=patientSerializer.save().pt_id
        #             # for items in patientID:

        #             # print(patientID.eve_id)
        #             #     items.pt_id
        #             # patientID=patientID.pt_id

        #             # saved_patients = []
        #             # for patient_instance in patientSerializer.save():
        #             #     saved_patients.append(patient_instance)
        #         else:
        #             # print(';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;')
        #             return Response(patientSerializer.errors)
        #         # patient.update(name=request.data['name'], phone_no=request.data['phone_no'],caller_id=callerID,Age=request.data['Age'] )
        #         # patientID=patient.first().pt_id 
        #     else:
        #         request.data['caller_id']=callerID
        #         patient = agg_hhc_patient_list_serializer(data=request.data)
        #         # print('9')
        #         if patient.is_valid():
        #             patientID=patient.save()
        #             patientID=patientID.pt_id
        #             # print('10')
        #         else:
        #             return Response([patient.errors])

        # else:
        #     patient=models.agg_hhc_patient_list_enquiry.objects.filter(phone_no=request.data['phone_no'])
        # # if patient:
        # #     patient.update(name=request.data['name'], phone_no=request.data['phone_no'],caller_id=callerID )
        # #     patientID=patient.first().agg_sp_pt_id 
        # else:
        #     patient = serializers.agg_hhc_patients_serializer(data=request.data)
        #         # patient = serializers.agg_hhc_patient_list_serializer(data=request.data)
        #     if patient.is_valid():
        #         # patient.validated_data['caller_id']=callerID
        #         # print(patient.validated_data['caller_id'],';;;;;;;;;;;;;;;;;;;;;;;;')
        #         patientID=patient.save()
        #         patientID=patientID.agg_sp_pt_id

        #     else:
        #         return Response(patient.errors)
        # print(callerID,'ll;;;l')
        # print(patientID,'ll;;;l')
        # request.data['event_status']=1
        event= agg_hhc_event_serializer(data=request.data)
        if event.is_valid():
            eventID=event.save().eve_id
        else:
            return Response([event.errors])
        event= agg_hhc_events.objects.filter(eve_id=eventID,status=1)
        # if request.data['purp_call_id']==1:
            # print('spero service')
        event.update(agg_sp_pt_id=patientID,caller_id=callerID,patient_service_status=3)
        # elif request.data['purp_call_id']==2:
        #     # print('enquiry')
        #     event.update(pt_id=patientID,caller_id=callerID,patient_service_status=3)
        # data=request.data['sub_srv_id']
        # dates = datetime.strptime(str(request.data['dates']), '%Y-%m-%d')
        # dates=request.data['dates']
        # dates = self.strings_to_dates(dates)
        
        # start_date = datetime.strptime(request.data['start_date'], '%Y-%m-%d')
        # end_date = datetime.strptime(request.data['end_date'], '%Y-%m-%d')
        # start_date = dates[0][0]
        # end_date = dates[0][-1]
        # print(start_date, end_date)



        # diff = ((end_date.date() - start_date.date()).days)
        # # diff =len(dates[0])
        # # print(diff, 'difference')
        # a=[request.data['sub_srv_id']]
        # # for sub_srv in request.data['sub_srv_id']:    for multiple sub services
        # event_plane_of_care=[]
        # for sub_srv in a:
        #     request.data['sub_srv_id']=sub_srv 
        #     request.data['initail_final_amount']=request.data['final_amount'] 
        #     # datess=[date.strftime('%Y-%m-%d') for date in dates[1]]
        #     # strdates=",".join(datess)
        #     # request.data['No_session_dates']=strdates
        #     # request.data['start_date']=start_date.date()
        #     # print(start_date.date(),end_date.date())
        #     # request.data['end_date']=end_date.date()
        #     if request.data['preferred_hosp_id']:
        #         request.data['hosp_id']=request.data['preferred_hosp_id']
        #     add_service= agg_hhc_create_service_serializer(data=request.data)
        #     if add_service.is_valid():
        #         service=add_service.save().eve_poc_id
        #         # print(service)
        #     else:
        #         return Response([add_service.errors])
        #     # print('demo')
        #     plan_O_C= agg_hhc_event_plan_of_care.objects.filter(eve_poc_id=service,status=1)
        #     plan_O_C.update(eve_id=eventID)
        #     event_plane_of_care.append(service)
        #     if request.data['purp_call_id']==1:
        #         # for i in range(0,(diff)):
        #         for i in range(0,(diff+1)):
        #             start_date_string=(start_date+timedelta(days=i))
        #             # d=dates[0][i]
        #             # print(start_date_string)
        #             # request.data['actual_StartDate_Time']=(d.date())
        #             # request.data['actual_EndDate_Time']=(d.date())
        #             request.data['actual_StartDate_Time']=start_date_string.date()
        #             # request.data['actual_EndDate_Time']=datetime.combine(start_date_string.date(),end_date.time())
        #             request.data['actual_EndDate_Time']=start_date_string.date()
        #             detailPlaneofcare= agg_hhc_add_detail_service_serializer(data=request.data)
        #             if detailPlaneofcare.is_valid():
        #                 # detailPlaneofcare.eve_poc_id=service
        #                 # detailPlaneofcare.eve_id=eventID
        #                 # detailPlaneofcare.index_of_Session=(i+1)
        #                 detail_plan=detailPlaneofcare.save().agg_sp_dt_eve_poc_id
        #             else:
        #                 return Response([detailPlaneofcare.errors])
        #             data1= agg_hhc_detailed_event_plan_of_care.objects.filter(agg_sp_dt_eve_poc_id=detail_plan,status=1)
        #             data1.update(eve_poc_id=service,eve_id=eventID,index_of_Session=(i+1))

        
        # Input array
        # date_ranges = [['2024-05-18, 2024-05-20'], ['2024-05-23, 2024-05-24'], ['2024-05-27, 2024-05-27']]
        # date_ranges = request.data.get('date_ranges', [])

        # def get_dates_between(start_date, end_date):
        #     dates = []
        #     current_date = start_date
        #     while current_date <= end_date:
        #         dates.append(current_date.strftime('%Y-%m-%d'))
        #         current_date += timedelta(days=1)
        #     return dates

        # all_dates = []

        # for date_range in date_ranges:
        #     start_str, end_str = date_range[0].split(', ')
        #     start_date = datetime.strptime(start_str, '%Y-%m-%d')
        #     end_date = datetime.strptime(end_str, '%Y-%m-%d')
        #     all_dates.extend(get_dates_between(start_date, end_date))

        # print(all_dates,"all_dates")
        # print(len(all_dates))

        date_ranges = request.data.get('date_ranges', [])

        def get_dates_between(start_date, end_date):
            dates = []
            current_date = start_date
            while current_date <= end_date:
                dates.append(current_date.strftime('%Y-%m-%d'))
                current_date += timedelta(days=1)
            return dates

        all_dates = []

        for date_range in date_ranges:
            start_str, end_str = date_range  # Adjusting to unpack list of two date strings
            start_date = datetime.strptime(start_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_str, '%Y-%m-%d')
            all_dates.extend(get_dates_between(start_date, end_date))
            all_dates=sorted(all_dates)

        print(all_dates, "all_dates")
        print(len(all_dates))






        diff = ((end_date.date() - start_date.date()).days)
        # diff =len(dates[0])
        # print(diff, 'difference')
        a=[request.data['sub_srv_id']]
        # for sub_srv in request.data['sub_srv_id']:    for multiple sub services
        event_plane_of_care=[]
        request.data['start_date']= all_dates[0] if all_dates else None
        request.data['end_date']= all_dates[-1] if all_dates else None
        for sub_srv in a:
            request.data['sub_srv_id']=sub_srv 
            request.data['initail_final_amount']=request.data['final_amount'] 
            # datess=[date.strftime('%Y-%m-%d') for date in dates[1]]
            # strdates=",".join(datess)
            # request.data['No_session_dates']=strdates
            # request.data['start_date']=start_date.date()
            # print(start_date.date(),end_date.date())
            # request.data['end_date']=end_date.date()
            if request.data['preferred_hosp_id']:
                request.data['hosp_id']=request.data['preferred_hosp_id']
            add_service= agg_hhc_create_service_serializer(data=request.data)
            if add_service.is_valid():
                service=add_service.save().eve_poc_id
                # print(service)
            else:
                return Response([add_service.errors])
            # print('demo')
            plan_O_C= agg_hhc_event_plan_of_care.objects.filter(eve_poc_id=service,status=1)
            plan_O_C.update(eve_id=eventID)
            event_plane_of_care.append(service)
            if request.data['purp_call_id']==1:
                # for i in range(0,(diff)):
                # for i in range(0,(diff+1)):
                #     start_date_string=(start_date+timedelta(days=i))
                #     # d=dates[0][i]
                #     # print(start_date_string)
                #     # request.data['actual_StartDate_Time']=(d.date())
                #     # request.data['actual_EndDate_Time']=(d.date())
                #     request.data['actual_StartDate_Time']=start_date_string.date()
                #     # request.data['actual_EndDate_Time']=datetime.combine(start_date_string.date(),end_date.time())
                #     request.data['actual_EndDate_Time']=start_date_string.date()
                #     # print(request.data,"dtl ",i)
                    
                #     detailPlaneofcare= agg_hhc_add_detail_service_serializer(data=request.data)
                #     if detailPlaneofcare.is_valid():
                #         # detailPlaneofcare.eve_poc_id=service
                #         # detailPlaneofcare.eve_id=eventID
                #         # detailPlaneofcare.index_of_Session=(i+1)
                #         detail_plan=detailPlaneofcare.save().agg_sp_dt_eve_poc_id
                #     else:
                #         return Response([detailPlaneofcare.errors])
                #     data1= agg_hhc_detailed_event_plan_of_care.objects.filter(agg_sp_dt_eve_poc_id=detail_plan,status=1)
                #     data1.update(eve_poc_id=service,eve_id=eventID,index_of_Session=(i+1))
                if request.data['srv_id'] != 11:
                    for i in range(0,(len(all_dates))):
                        # start_date_string=(start_date+timedelta(days=i))
                        start_date_string = all_dates[i]
                        print(start_date_string,"start_date_string")
                        # d=dates[0][i]
                        # print(start_date_string)
                        # request.data['actual_StartDate_Time']=(d.date())
                        # request.data['actual_EndDate_Time']=(d.date())
                        # request.data['actual_StartDate_Time']=start_date_string.date()
                        request.data['actual_StartDate_Time']=start_date_string
                        # request.data['actual_EndDate_Time']=datetime.combine(start_date_string.date(),end_date.time())
                        request.data['actual_EndDate_Time']=start_date_string
                        # print(request.data,"dtl ",i)
                        
                        detailPlaneofcare= agg_hhc_add_detail_service_serializer(data=request.data)
                        if detailPlaneofcare.is_valid():
                            # detailPlaneofcare.eve_poc_id=service
                            # detailPlaneofcare.eve_id=eventID
                            # detailPlaneofcare.index_of_Session=(i+1)
                            detail_plan=detailPlaneofcare.save().agg_sp_dt_eve_poc_id
                        else:
                            return Response([detailPlaneofcare.errors])
                        data1= agg_hhc_detailed_event_plan_of_care.objects.filter(agg_sp_dt_eve_poc_id=detail_plan,status=1)
                        data1.update(eve_poc_id=service,eve_id=eventID,index_of_Session=(i+1))
                else:
                        # start_date_string=(start_date+timedelta(days=i))
                        # start_date_string = all_dates[i]
                        # print(start_date_string,"start_date_string")
                        # d=dates[0][i]
                        # print(start_date_string)
                        # request.data['actual_StartDate_Time']=(d.date())
                        # request.data['actual_EndDate_Time']=(d.date())
                        # request.data['actual_StartDate_Time']=start_date_string.date()
                        request.data['actual_StartDate_Time']=all_dates[0]
                        # request.data['actual_EndDate_Time']=datetime.combine(start_date_string.date(),end_date.time())
                        request.data['actual_EndDate_Time']=all_dates[0]
                        # print(request.data,"dtl ",i)
                        
                        detailPlaneofcare= agg_hhc_add_detail_service_serializer(data=request.data)
                        if detailPlaneofcare.is_valid():
                            # detailPlaneofcare.eve_poc_id=service
                            # detailPlaneofcare.eve_id=eventID
                            # detailPlaneofcare.index_of_Session=(i+1)
                            detail_plan=detailPlaneofcare.save().agg_sp_dt_eve_poc_id
                        else:
                            return Response([detailPlaneofcare.errors])
                        data1= agg_hhc_detailed_event_plan_of_care.objects.filter(agg_sp_dt_eve_poc_id=detail_plan,status=1)
                        data1.update(eve_poc_id=service,eve_id=eventID,index_of_Session=(i+1))


        jb_cl_que = request.data.get('jb_cl_que', [])  
        r_srv_id = request.data.get('srv_id')

        get_enq_que = agg_hhc_events_wise_jc_question.objects.filter(eve_id = eventID, is_srv_enq_q = 2, status = 1)
        get_enq_que.update(status=2)
         
        if jb_cl_que:
            print(jb_cl_que,'jb_cl_que')
            r_srv_id = request.data.get('srv_id')
            print(r_srv_id,'r_srv_id')
            for q_id in jb_cl_que:
                print(q_id,'q_id')
                inst = agg_hhc_job_closure_questions.objects.get(jcq_id=int(q_id))
                print(inst, 'inst')
                data = {
                        'eve_id':eventID,
                        'srv_id':r_srv_id,
                        'jcq_id':inst.jcq_id,
                        'is_srv_enq_q':1
                    }
                    
                serializer_val = agg_hhc_job_cl_questions_eventwise(data=data)
                if serializer_val.is_valid():
                    serializer_val.save()
                    print(serializer_val.data,'serializer_val')
                else:
                    print('serializer_val not')

        print(event_plane_of_care,"event_plane_of_care")

        get_epoc_dt = agg_hhc_event_plan_of_care.objects.get(eve_poc_id = event_plane_of_care[0])
        get_epoc_dt.serivce_dates = all_dates
        get_epoc_dt.save()
        if request.data['purp_call_id']==1: 
            # return Response({"Service Created Event Code":[eventID,eventID.agg_sp_pt_id]})
            event=agg_hhc_events.objects.get(eve_id=eventID)
            events=agg_hhc_event_response_serializer(event)
            
            
            # jb_cl_que = request.data.get('jb_cl_que', [])  
            # r_srv_id = request.data.get('srv_id')
         
            # if jb_cl_que:
            #     print(jb_cl_que,'jb_cl_que')
            #     r_srv_id = request.data.get('srv_id')
            #     print(r_srv_id,'r_srv_id')
            #     for q_id in jb_cl_que:
            #         print(q_id,'q_id')
            #         inst = agg_hhc_job_closure_questions.objects.get(jcq_id=int(q_id))
            #         print(inst, 'inst')
            #         data = {
            #             'eve_id':eventID,
            #             'srv_id':r_srv_id,
            #             'jcq_id':inst.jcq_id
            #         }
            #         serializer_val = agg_hhc_job_cl_questions_eventwise(data=data)
            #         if serializer_val.is_valid():
            #             serializer_val.save()
            #             print(serializer_val.data,'serializer_val')
            #         else:
            #             print('serializer_val not')
                                

                    # abc = agg_hhc_events_wise_jc_question.objects.create(
                    #     srv_id_id=r_srv_id,
                    #     jcq_id=inst  # Assign the instance directly, not its jcq_id attribute
                    # )

            return Response({"Service Created Event Code":[{"event_id":eventID},events.data,{"event_plan_of_care_id":event_plane_of_care}]})

        # else:
        elif request.data['purp_call_id']==2:
            request.data['event_id']=eventID
            request.data['follow_up']=4

            create_follow_up= agg_hhc_enquiry_create_follow_up_serializer(data= request.data)
            if create_follow_up.is_valid():
                # callers.validated_data['caller_status']=3
                create_follow_up.save()
            else:               
                return Response([create_follow_up.errors])
            
            
            
            
            # jb_cl_que = request.data.get('jb_cl_que', [])  
            # r_srv_id = request.data.get('srv_id')
         
            # if jb_cl_que:
            #     print(jb_cl_que,'jb_cl_que')
            #     r_srv_id = request.data.get('srv_id')
            #     print(r_srv_id,'r_srv_id')
            #     for q_id in jb_cl_que:
            #         print(q_id,'q_id')
            #         inst = agg_hhc_job_closure_questions.objects.get(jcq_id=int(q_id))
            #         print(inst, 'inst')
            #         data = {
            #             'eve_id':eventID,
            #             'srv_id':r_srv_id,
            #             'jcq_id':inst.jcq_id
            #         }
            #         serializer_val = agg_hhc_job_cl_questions_eventwise(data=data)
            #         if serializer_val.is_valid():
            #             serializer_val.save()
            #             print(serializer_val.data,'serializer_val')
            #         else:
            #             print('serializer_val not')

            return Response({"Service Created Event Code":eventID})
        else:
            return Response('something went wrong')
        
    def put(self,request,pk):    
        clgref_id = get_prof(request)[3]
        request.data['last_modified_by'] = clgref_id
        # event=self.get_event(pk)
        should_null=['caller_rel_id','agg_sp_pt_id','pincode','prof_prefered','remark','discount_type','discount_value','final_amount','discount_value','day_convinance','total_convinance','jb_cl_que','coupon_id']
        for key, value in request.data.items():
            # print(f'"{key}", values are {value}')
            if key not in should_null:
                if not value :
                    # print({'error':f'"{key}" this field should not to be empty'})
                    # return Response({'error':f'"{key}" this field should not to be empty'})
                    return Response({'error':'fill all required fields'})
        request.data['purp_call_id']=1
        caller = self.get_caller(phone=request.data['phone'])
        # print(caller.__dict__.items(),'llklll')
        
        print(';')
        if caller:
            # caller.update(caller_fullname=request.data['caller_fullname'], caller_rel_id=request.data['caller_rel_id'], purp_call_id=request.data['purp_call_id'], caller_status=3)
            # caller.update(caller_fullname=request.data['caller_fullname'], caller_rel_id=request.data['caller_rel_id'], purp_call_id=request.data['purp_call_id'], caller_status=3)
            # callerID = caller.first().caller_id 
            callerSerializer= agg_hhc_callers_serializer(caller,data= request.data)
            if callerSerializer.is_valid():
                # print(';;;;;;;;;;;')
                callerID=callerSerializer.save().caller_id
            else:
                return Response(callerSerializer.errors)
        else:  
            callers= agg_hhc_callers_serializer(data= request.data)
            if callers.is_valid():
                # callers.validated_data['caller_status']=3
                callerID=callers.save().caller_id
            else:
                return Response([callers.errors])       
        # # print(callerID,'llllsecond')
        # if request.data['purp_call_id']==1:
        # print('l')
        patient=request.data['agg_sp_pt_id']
        if patient:
            patient=self.get_patient(agg_sp_pt_id=patient)

            # patient.update(name=request.data['name'], phone_no=request.data['phone_no'],caller_id=callerID,Age=request.data['Age'] )
            # patientID=patient.first().agg_sp_pt_id 
            patientSerializer= agg_hhc_patients_serializer(patient,data=request.data)
            if patientSerializer.is_valid():
                patientID=patientSerializer.save().agg_sp_pt_id
                # print(patientID,';;;;;;;;;;;;;;;;;;')
                # return Response(patientSerializer.data)
            else:
                return Response(patientSerializer.errors)
        else:
            patient = agg_hhc_patients_serializer(data=request.data)
            try:
                caller_id = agg_hhc_callers.objects.get(caller_id=callerID)
            except agg_hhc_callers.DoesNotExist:
                return Response({'error':'caller not fount'})
            if patient.is_valid():
                patient.validated_data['caller_id']=caller_id
                patientID=patient.save()
                patientID=patientID.agg_sp_pt_id
            else:
                return Response([patient.errors])
        # else:
        #     patient=models.agg_hhc_patient_list_enquiry.objects.filter(Q(phone_no=request.data['phone_no'])|Q())
        #     if patient:
        #         patient.update(name=request.data['name'], phone_no=request.data['phone_no'],caller_id=callerID,Age=request.data['Age'] )
        #         patientID=patient.first().pt_id 
        #     else:
        #         patient = serializers.agg_hhc_patient_list_serializer(data=request.data)
        #         if patient.is_valid():
        #             patientID=patient.save()
        #             patientID=patientID.pt_id
        #         else:
        #             return Response([patient.errors,'7'])

        # if event.is_valid():
        #     eventID=event.save().eve_id
        # else:
        #     return Response([event.errors,'8'])
        # print(pk,'llllllllllll')
        if request.data['preferred_hosp_id']:
            request.data['hosp_id']=request.data['preferred_hosp_id']
        event=self.get_event(pk)
        # if request.data['purp_call_id']==1:
        eventSerializer= agg_hhc_updateID_event_serializer(event,data=request.data)
        if eventSerializer.is_valid():
            eventID=eventSerializer.save().eve_id
        else:
            return Response(eventSerializer.errors)
        data={'agg_sp_pt_id':patientID,'caller_id':callerID,'status':1,'enq_spero_srv_status':1,'last_modified_by':clgref_id,'added_by':clgref_id}
        eventSerializer= agg_hhc_updateIDs_event_serializer(event,data=data)
        if eventSerializer.is_valid():
            eventID=eventSerializer.save().eve_id
            # print(eventSerializer.validated_data)
            # eventSerializer.save()
        else:
            return Response(eventSerializer.errors)

        # event.update(agg_sp_pt_id=patientID,caller_id=callerID)
        # eventID=event.first().eve_id
        # print(eventID)
        # print(callerID)
        # else:
        #     event.update(pt_id=patientID,caller_id=callerID)
        # dates=request.data['dates']
        # dates = self.strings_to_dates(dates)
        
        # start_date = dates[0][0]
        # end_date = dates[0][-1]

        date_ranges = request.data.get('date_ranges', [])

        def get_dates_between(start_date, end_date):
            dates = []
            current_date = start_date
            while current_date <= end_date:
                dates.append(current_date.strftime('%Y-%m-%d'))
                current_date += timedelta(days=1)
            return dates

        all_dates = []

        for date_range in date_ranges:
            start_str, end_str = date_range  # Adjusting to unpack list of two date strings
            start_date = datetime.strptime(start_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_str, '%Y-%m-%d')
            all_dates.extend(get_dates_between(start_date, end_date))
            all_dates=sorted(all_dates)

        print(all_dates, "all_dates")
        print(len(all_dates))


        # start_date = datetime.strptime(str(request.data['start_date']), '%Y-%m-%d')
        # end_date = datetime.strptime(str(request.data['end_date']), '%Y-%m-%d')
        # diff = ((end_date.date() - start_date.date()).days)
        # diff =len(dates[0])
        a=[request.data['sub_srv_id']]
        event_plane_of_care=[]

        request.data['start_date']= all_dates[0] if all_dates else None
        request.data['end_date']= all_dates[-1] if all_dates else None

        for sub_srv in a:
            print(eventID,'id')
            plan_O_C= agg_hhc_event_plan_of_care.objects.filter(eve_id=eventID,status=1).last()
            print(plan_O_C,'demo')
            request.data['sub_srv_id']=sub_srv 
            request.data['initail_final_amount']=request.data['final_amount'] 
            # datess=[date.strftime('%Y-%m-%d') for date in dates[1]]
            # strdates=",".join(datess)
            # request.data['No_session_dates']=strdates
            
            add_service= agg_hhc_create_service_serializer(plan_O_C,data=request.data)
            if add_service.is_valid():
                print(start_date)
                print(end_date)
                # add_service.validated_data['start_date']=start_date.date()
                # add_service.validated_data['end_date']=end_date.date()
                service=add_service.save().eve_poc_id
            else:
                return Response([add_service.errors])
            # plan_O_C.update(eve_id=eventID)
            plan_O_C= agg_hhc_event_plan_of_care.objects.filter(eve_poc_id=service,status=1)
            plan_O_C.update(eve_id=eventID)
            event_plane_of_care.append(service)
            if request.data['purp_call_id']==1:
                # for i in range(0,(diff)):
                # for i in range(0,(diff+1)):
                if request.data['srv_id'] != 11:
                    for i in range(0,(len(all_dates))):
                        # start_date_string=(start_date+timedelta(days=i))
                        start_date_string = all_dates[i]
                        print(start_date_string,"start_date_string")
                        # d=dates[0][i]
                        # print(start_date_string)
                        # request.data['actual_StartDate_Time']=(d.date())
                        # request.data['actual_EndDate_Time']=(d.date())
                        # request.data['actual_StartDate_Time']=start_date_string.date()
                        request.data['actual_StartDate_Time']=start_date_string
                        # request.data['actual_EndDate_Time']=datetime.combine(start_date_string.date(),end_date.time())
                        request.data['actual_EndDate_Time']=start_date_string
                        # print(request.data,"dtl ",i)
                        
                        detailPlaneofcare= agg_hhc_add_detail_service_serializer(data=request.data)
                        if detailPlaneofcare.is_valid():
                            # detailPlaneofcare.eve_poc_id=service
                            # detailPlaneofcare.eve_id=eventID
                            # detailPlaneofcare.index_of_Session=(i+1)
                            detail_plan=detailPlaneofcare.save().agg_sp_dt_eve_poc_id
                        else:
                            return Response([detailPlaneofcare.errors])
                        data1= agg_hhc_detailed_event_plan_of_care.objects.filter(agg_sp_dt_eve_poc_id=detail_plan,status=1)
                        data1.update(eve_poc_id=service,eve_id=eventID,index_of_Session=(i+1))
                else:
                        # start_date_string=(start_date+timedelta(days=i))
                        # start_date_string = all_dates[i]
                        # print(start_date_string,"start_date_string")
                        # d=dates[0][i]
                        # print(start_date_string)
                        # request.data['actual_StartDate_Time']=(d.date())
                        # request.data['actual_EndDate_Time']=(d.date())
                        # request.data['actual_StartDate_Time']=start_date_string.date()
                        request.data['actual_StartDate_Time']=all_dates[0]
                        # request.data['actual_EndDate_Time']=datetime.combine(start_date_string.date(),end_date.time())
                        request.data['actual_EndDate_Time']=all_dates[0]
                        # print(request.data,"dtl ",i)
                        
                        detailPlaneofcare= agg_hhc_add_detail_service_serializer(data=request.data)
                        if detailPlaneofcare.is_valid():
                            # detailPlaneofcare.eve_poc_id=service
                            # detailPlaneofcare.eve_id=eventID
                            # detailPlaneofcare.index_of_Session=(i+1)
                            detail_plan=detailPlaneofcare.save().agg_sp_dt_eve_poc_id
                        else:
                            return Response([detailPlaneofcare.errors])
                        data1= agg_hhc_detailed_event_plan_of_care.objects.filter(agg_sp_dt_eve_poc_id=detail_plan,status=1)
                        data1.update(eve_poc_id=service,eve_id=eventID,index_of_Session=(i+1))
        # return Response({"Service Created Event Code"})
        
        jb_cl_que = request.data.get('jb_cl_que', [])  
        r_srv_id = request.data.get('srv_id')

        get_enq_que = agg_hhc_events_wise_jc_question.objects.filter(eve_id = eventID, status = 1)
        # get_enq_que.update(status=2)
        for eves in get_enq_que:
            eves.status = 2
            eves.save()
         
        if jb_cl_que:
            print(jb_cl_que,'jb_cl_que')
            r_srv_id = request.data.get('srv_id')
            print(r_srv_id,'r_srv_id')
            for q_id in jb_cl_que:
                print(q_id,'q_id')
                inst = agg_hhc_job_closure_questions.objects.get(jcq_id=int(q_id))
                print(inst, 'inst')
                data = {
                        'eve_id':eventID,
                        'srv_id':r_srv_id,
                        'jcq_id':inst.jcq_id,
                        'is_srv_enq_q':1
                    }
                    
                serializer_val = agg_hhc_job_cl_questions_eventwise(data=data)
                if serializer_val.is_valid():
                    serializer_val.save()
                    print(serializer_val.data,'serializer_val')
                else:
                    print('serializer_val not')

        get_epoc_dt = agg_hhc_event_plan_of_care.objects.get(eve_poc_id = event_plane_of_care[0])
        get_epoc_dt.serivce_dates = all_dates
        get_epoc_dt.save()
        if request.data['purp_call_id']==1: 
            event=agg_hhc_events.objects.get(eve_id=eventID)
            events=agg_hhc_event_response_serializer(event)

            
            return Response({"Service Created Event Code":[{"event_id":eventID},events.data,{"event_plan_of_care_id":event_plane_of_care}]})
        else:

            # agg_hhc_enquiry_create_follow_up_serializer
            return Response({"Service Created Event Code":eventID})




# =================================================================================================================
# @csrf_exempt
class agg_hhc_add_service_form_api(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]

    def get_event(self,pk):
        try:
            event = agg_hhc_events.objects.get(eve_id=pk)
            return event
        except agg_hhc_events.DoesNotExist:
            return Response('please enter valid event id',status.HTTP_404_NOT_FOUND)
        
    def get(self, request, eve_id):
        event = self.get_event(eve_id)
        # enquiry_from = is_web_form
        if not event:
            return Response({'not found'},status.HTTP_404_NOT_FOUND)
        # if enquiry_from:
        patient_details = patient_data_serializer_form(event)
        # else: 
        # patient_details = patient_data_serializer(event)
        return Response(patient_details.data)
    
    # def post(self,request):  
    #     # clgref_id = get_prof(request)[3]
    #     # request.data['last_modified_by'] = clgref_id
    #     # should_null=['caller_rel_id','agg_sp_pt_id','pincode','prof_prefered','remark','discount_type','discount_value','final_amount','discount_value','day_convinance','total_convinance', 'preferred_hosp_id','doct_cons_id']
    #     # should_null=['agg_sp_pt_id','doct_cons_id']
    #     # for key, value in request.data.items():
    #     #     if key not in should_null:
    #     #         if not value :
    #     #             # return Response({'error':f'"{key}" this field should not to be empty'})
    #     #             return Response({'error':'fill all required fields'})
    #     request.data['serivce_dates']= [request.data['start_date']]
    #     patientID=None  
    #     caller = agg_hhc_callers.objects.filter(phone=request.data['phone'],status=1).first()
    #     request.data['purp_call_id']=2
    #     if caller:
    #         callerSerializer= add_caller_by_form_serializer(caller,data= request.data)
    #         if callerSerializer.is_valid():
    #             callerID=callerSerializer.save()
    #             callerID=callerID.caller_id
    #         else:
    #             return Response(callerSerializer.errors)
    #     else:  
    #         callers= add_caller_by_form_serializer(data= request.data)
    #         if callers.is_valid():
    #             callerID=callers.save().caller_id
    #         else:
    #             return Response([callers.errors])
    #     patient= agg_hhc_patients.objects.filter(agg_sp_pt_id=request.data['agg_sp_pt_id']).first()
    #     request.data['caller_id']=callerID
    #     if patient:
    #         patientSerializer = add_enquiry_patient_by_form_serializer(patient,data=request.data)
    #         if patientSerializer.is_valid():
    #             # patientID=patientSerializer.save().pt_id
    #             patientID=patientSerializer.save().agg_sp_pt_id 
    #         else:
    #             return Response(patientSerializer.errors)
    #     else:
    #         request.data['caller_id']=callerID
    #         # print(request.data)
    #         patient = add_enquiry_patient_by_form_serializer(data=request.data)
    #         if patient.is_valid():
    #             patientID=patient.save()
    #             patientID=patientID.agg_sp_pt_id
    #         else:
    #             return Response([patient.errors])
            
    #     request.data['event_status']=1
    #     request.data['enq_spero_srv_status']=3
    #     event= agg_hhc_event_serializer(data=request.data)
         
    #     if event.is_valid():
    #         eventID=event.save().eve_id
    #         eventID
    #         # request.data.pop('event_status')
    #     else:
    #         return Response([event.errors])
    #     event= agg_hhc_events.objects.filter(eve_id=eventID,status=1) 
    #     event.update(agg_sp_pt_id=patientID,caller_id=callerID,patient_service_status=2)
    #     # start_date = datetime.strptime(str(request.data['start_date']), '%Y-%m-%d %H:%M:%S')
    #     # end_date = datetime.strptime(str(request.data['end_date']), '%Y-%m-%d %H:%M:%S')
    #     # diff = ((end_date.date() - start_date.date()).days)
    #     # a=[request.data['sub_srv_id']]
    #     if request.data['preferred_hosp_id']:
    #         request.data['hosp_id']=request.data['preferred_hosp_id']
    #     add_service= create_plane_of_care_serializer(data=request.data)
    #     if add_service.is_valid():
    #     #     print('121121')
    #         service=add_service.save().eve_poc_id
    #     else:
    #         return Response([add_service.errors])
    #     request.data['event_id']=eventID
    #     request.data['follow_up']=4

    #     create_follow_up= agg_hhc_enquiry_create_follow_up_serializer(data= request.data)
    #     if create_follow_up.is_valid():
    #         # callers.validated_data['caller_status']=3
    #         create_follow_up.save()
    #     plan_O_C= agg_hhc_event_plan_of_care.objects.filter(eve_poc_id=service,status=1)
    #     plan_O_C.update(eve_id=eventID)
    #     return Response({"Service Created Event Code":eventID})

    def post(self,request):  
        # clgref_id = get_prof(request)[3]
        # request.data['last_modified_by'] = clgref_id
        # should_null=['caller_rel_id','agg_sp_pt_id','pincode','prof_prefered','remark','discount_type','discount_value','final_amount','discount_value','day_convinance','total_convinance','preferred_hosp_id']
        # should_null=['agg_sp_pt_id','preferred_hosp_id']
        # for key, value in request.data.items():
        #     if key not in should_null:
        #         if not value :
        #             # return Response({'error':f'"{key}" this field should not to be empty'})
        #             return Response({'error':'fill all required fields'})
        patientID=None  
        caller = agg_hhc_callers.objects.filter(phone=request.data['phone'],status=1).first()
        request.data['serivce_dates']= [request.data['start_date']]
        request.data['purp_call_id']=2
        if caller:
            callerSerializer= add_caller_by_form_serializer(caller,data= request.data)
            if callerSerializer.is_valid():
                callerID=callerSerializer.save()
                callerID=callerID.caller_id
            else:
                return Response(callerSerializer.errors)
        else:  
            callers= add_caller_by_form_serializer(data= request.data)
            if callers.is_valid():
                callerID=callers.save().caller_id
            else:
                return Response([callers.errors])
        patient= agg_hhc_patients.objects.filter(agg_sp_pt_id=request.data['agg_sp_pt_id']).first()
        request.data['caller_id']=callerID
        if patient:
            patientSerializer = add_enquiry_patient_by_form_serializer(patient,data=request.data)
            if patientSerializer.is_valid():
                # patientID=patientSerializer.save().pt_id
                patientID=patientSerializer.save().agg_sp_pt_id 
            else:
                return Response(patientSerializer.errors)
        else:
            request.data['caller_id']=callerID
            patient = add_enquiry_patient_by_form_serializer(data=request.data)
            if patient.is_valid():
                patientID=patient.save()
                patientID=patientID.agg_sp_pt_id
            else:
                return Response([patient.errors])
            
        request.data['event_status']=1
        request.data['enq_spero_srv_status']=3
        event= agg_hhc_event_serializer(data=request.data)
         
        if event.is_valid():
            eventID=event.save().eve_id
            eventID
            # request.data.pop('event_status')
        else:
            return Response([event.errors])
        event= agg_hhc_events.objects.filter(eve_id=eventID,status=1) 
        event.update(agg_sp_pt_id=patientID,caller_id=callerID,patient_service_status=2)
        # start_date = datetime.strptime(str(request.data['start_date']), '%Y-%m-%d %H:%M:%S')
        # end_date = datetime.strptime(str(request.data['end_date']), '%Y-%m-%d %H:%M:%S')
        # diff = ((end_date.date() - start_date.date()).days)
        # a=[request.data['sub_srv_id']]
        if request.data['preferred_hosp_id']:
            request.data['hosp_id']=request.data['preferred_hosp_id']
        add_service= create_plane_of_care_serializer(data=request.data)
        if add_service.is_valid():
            service=add_service.save().eve_poc_id
        else:
            return Response([add_service.errors])
        request.data['event_id']=eventID
        request.data['follow_up']=4

        create_follow_up= agg_hhc_enquiry_create_follow_up_serializer(data= request.data)
        if create_follow_up.is_valid():
            # callers.validated_data['caller_status']=3
            create_follow_up.save()
        plan_O_C= agg_hhc_event_plan_of_care.objects.filter(eve_poc_id=service,status=1)
        plan_O_C.update(eve_id=eventID)


        jb_cl_que = request.data.get('jb_cl_que', [])  
        r_srv_id = request.data.get('srv_id')

        get_enq_que = agg_hhc_events_wise_jc_question.objects.filter(eve_id = eventID, is_srv_enq_q = 2, status = 1)
        get_enq_que.update(status=2)
         
        if jb_cl_que:
            print(jb_cl_que,'jb_cl_que')
            r_srv_id = request.data.get('srv_id')
            print(r_srv_id,'r_srv_id')
            for q_id in jb_cl_que:
                print(q_id,'q_id')
                inst = agg_hhc_job_closure_questions.objects.get(jcq_id=int(q_id))
                print(inst, 'inst')
                data = {
                        'eve_id':eventID,
                        'srv_id':r_srv_id,
                        'jcq_id':inst.jcq_id,
                        'is_srv_enq_q':1
                    }
                    
                serializer_val = agg_hhc_job_cl_questions_eventwise(data=data)
                if serializer_val.is_valid():
                    serializer_val.save()
                    print(serializer_val.data,'serializer_val')
                else:
                    print('serializer_val not')
        print(request.data)
        return Response({"Service Created Event Code":eventID})
# =================================================================================================================

    
class agg_hhc_state_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,format=None):
        reason= agg_hhc_state.objects.all().order_by('state_name')
        serializer= agg_hhc_get_state_serializer(reason,many=True)
        return Response(serializer.data)
    
class agg_hhc_city_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,pk,format=None):
        reason= agg_hhc_city.objects.filter(state_id=pk).order_by('city_name')
        serializer= agg_hhc_get_city_serializer(reason,many=True)
        return Response(serializer.data)

class agg_hhc_consultant_api(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    def get(self,request):
        consultant= agg_hhc_doctors_consultants.objects.filter(status=1).order_by('cons_fullname')
        consultantSerializer= agg_hhc_doctors_consultants_serializer(consultant,many=True)
        other={
            "doct_cons_id": 0,
            "cons_fullname": "Other",
            "mobile_no": 0000
            }
        consultants=[other]+list(consultantSerializer.data)

        return Response(consultants)
    
# ------------------------------------------------------------------------------------------------------
class agg_hhc_consultant_HD_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        consultant= agg_hhc_doctors_consultants.objects.filter(status=1).order_by('cons_fullname')
        consultantSerializer= agg_hhc_doctors_consultants_HD_serializer(consultant,many=True)
        other={
            "doct_cons_id": 0,
            "cons_fullname": "Other",
            "mobile_no": 0000
            }
        consultants=[other]+list(consultantSerializer.data)

        return Response(consultants)
# ------------------------------------------------------------------------------------------------------

class agg_hhc_consultant_api_web_form(APIView):

    def get(self,request):
        consultant= agg_hhc_doctors_consultants.objects.filter(status=1).order_by('cons_fullname')
        consultantSerializer= agg_hhc_doctors_consultants_serializer(consultant,many=True)
        other={
            "doct_cons_id": 0,
            "cons_fullname": "Other",
            "mobile_no": 0000
            }
        consultants=[other]+list(consultantSerializer.data)

        return Response(consultants)
# ---------------------------------------------------------------------------------------------------- 

class agg_hhc_service_professional_details(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        records= agg_hhc_service_professional_details.all()
        serializer= agg_hhc_service_professional_details_serializer(records,many=True)
        return Response(serializer.data)
    
#--------------------------get all patients from caller id -----------------------------

class agg_hhc_callers_phone_no_web_form(APIView):
    def get_object(self, pk):
        try:
            queryset = agg_hhc_callers.objects.filter(phone=pk).last()
            query_id = queryset.caller_id
            return query_id
        except agg_hhc_callers.DoesNotExist:
            raise Http404("Caller record not found for the given phone number")



class agg_hhc_callers_phone_no(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_object(self, pk):
        try:
            queryset = agg_hhc_callers.objects.filter(phone=pk).last()
            query_id = queryset.caller_id
            return query_id
        except agg_hhc_callers.DoesNotExist:
            raise Http404("Caller record not found for the given phone number")

    def get(self, request, pk, format=None):
        try:
            snippet = self.get_object(pk)
            caller_record = agg_hhc_callers.objects.get(pk=snippet)
            record = agg_hhc_patients.objects.filter(caller_id=snippet).order_by('name')
            serialized_caller = agg_hhc_callers_details_serializer(caller_record)
            serialized = agg_hhc_app_patient_by_caller_phone_no(record, many=True)
            # for i in serialized.data:
            #     print(i)
            return Response({"caller": serialized_caller.data, "patients": serialized.data,'user':'New'})
        except Http404 as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)


class agg_hhc_callers_form_phone_no(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_object(self, pk):
        try:
            queryset = agg_hhc_callers.objects.get(phone=pk)
            query_id = queryset.caller_id
            return query_id
        except agg_hhc_callers.DoesNotExist:
            raise Http404("Caller record not found for the given phone number")

    def get(self, request, pk, format=None):
        try:
            snippet = self.get_object(pk)
            caller_record = agg_hhc_callers.objects.get(pk=snippet)
            record = agg_hhc_patients.objects.filter(caller_id=snippet).order_by('name')
            serialized_caller = agg_hhc_form_callers_details_serializer(caller_record)
            serialized = agg_hhc_app_patient_by_caller_phone_no(record, many=True)
            # for i in serialized.data:
            #     print(i)
            return Response({"caller": serialized_caller.data, "patients": serialized.data,'user':'New'})
        except Http404 as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        


#---------------------------get all hospital names-----------------------------------

class agg_hhc_hospitals_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        hospital= agg_hhc_hospitals.objects.filter(status=1).order_by('hospital_name')
        hospital_names=agg_hhc_hospitals_serializer(hospital,many=True)
        return Response(hospital_names.data)

class agg_hhc_hospitals_api_web_form(APIView):
    
    def get(self,request):
        hospital= agg_hhc_hospitals.objects.filter(status=1).order_by('hospital_name')
        hospital_names=agg_hhc_hospitals_serializer(hospital,many=True)
        return Response(hospital_names.data)
    



class select_hospital_name(APIView):
    def get(self,request):
        hospital= agg_hhc_hospitals.objects.filter(status=1).order_by('hospital_name')
        hospital_names=agg_hhc_hospitals_serializer(hospital,many=True)
        new_record = {"hosp_id":0,"hospital_name": "Spero"}
        hospital_list=hospital_names.data+[new_record]
        return Response(hospital_list)
    def post(self,request):
        # clgref_id = get_prof(request)[3]

        hospital_id=int(request.data.get('hosp_id'))
        if hospital_id==0:
            return Response({'hospital_name':"Spero",'hosp_id':0})
        else:
            try:
                selected_hospital=agg_hhc_hospitals.objects.get(hosp_id=hospital_id,status=1)
                return Response({'hospital_name':selected_hospital.hospital_name,'hosp_id':selected_hospital.hosp_id})
            except agg_hhc_hospitals.DoesNotExist:
                return Response({"Error":"hospital not found"})#None# status.HTTP_404_NOT_FOUND

#-------------------------get address by pincode-------------------------------------
class agg_hhc_city_from_state_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_object(self,state,formate=None):
        try:
            return  agg_hhc_city.objects.get(state_id=state)
        except agg_hhc_city.DoesNotExist:
            #return Response({"message":e})
            raise status.HTTP_404_NOT_FOUND
        
    def get(self,request,state):
        try:
            state_obj=self.get_object(state)
            serialized= agg_hhc_get_city_serializer(state_obj)
            return Response(serialized.data)
        except Exception as e:
            return Response({"not found":str(e)})

class agg_hhc_pincode_from_city_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_object(self,city,formate=None):
        try:
            a= agg_hhc_pincode.objects.filter(city_name=city)
            return  agg_hhc_pincode.objects.filter(city_name=city)
        except  agg_hhc_pincode.DoesNotExist:
            raise status.HTTP_404_NOT_FOUND
    def get(self,request,city):
        pincode_obj=self.get_object(city)
        serialized= agg_hhc_pincode_serializer(pincode_obj,many=True)
        
        return Response(serialized.data)
class Caller_details_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_object(self,pk):
        return  agg_hhc_callers.objects.get(caller_id=pk)
             
    def get(self,request,pk):  
        caller = self.get_object(pk)
        if caller:
            serializer =  Caller_details_serializer(caller)
            # relation=(self.get_relation(serializer.data['caller_rel_id']))
            # relations= relation_serializer(relation)
            return Response({"caller":serializer.data})
        else:
            return Response({"error": 'user not found'})
        
    def put(self,request,pk):
        clgref_id = get_prof(request)[3]
        request.data['last_modified_by'] = clgref_id

        caller = self.get_object(pk)
        callerSerializer =  Update_Caller_details_serializer(caller,data = request.data)
        if callerSerializer.is_valid():
            callerSerializer.validated_data['last_modified_date']=timezone.now()
            callerSerializer.save()
            return Response(callerSerializer.data)
        return Response(callerSerializer.errors)
    
class patient_detail_info_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_patient(self,pk):
        try:
            patient = agg_hhc_patients.objects.get(agg_sp_pt_id=pk)
            return patient
        except  agg_hhc_patients.DoesNotExist:
            return None
    
    def get_hospital(self, pk):
        return  agg_hhc_hospitals.objects.get(hosp_id=pk)
    
    def get(self, request, pk):
        patient = self.get_patient(pk)
        if patient:
            serializer =  patient_detail_serializer(patient)
            # hospital = self.get_hospital(serializer.data['preferred_hosp_id'])
            # if hospital:
            #     hospitals =  hospital_serializer(hospital)
            return Response({"patient": serializer.data})

        return HttpResponse({"service not found"},status=status.HTTP_404_NOT_FOUND)
        
    def put(self, request, pk):
        clgref_id = get_prof(request)[3]
        request.data['last_modified_by'] = clgref_id

        patient = self.get_patient(pk)
        request.data['last_modified_date'] = timezone.now()
        serializer =  update_patient_detail_serializer(patient, data=request.data)
        # serializer.is_valid(raise_exception=True)
        # serializer.validated_data['last_modified_date'] = timezone.now() #old_patient.hhc_code
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else: return Response(serializer.errors)

# ------------------------------------------professional availability details name and skills ------------------
class  agg_hhc_service_professionals_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,formate=None):
        professional= agg_hhc_service_professionals.objects.filter(status=1)
        serialized= agg_hhc_service_professionals_serializer(professional,many=True)
        return Response(serialized.data)
    
class calculate_discount_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    
    def get(self, request,dtype=0,damount=0,total_amt=0):#dtype,amount,total_amt
        # dtype=dtype
        amount=damount
        # total_amt=total_amt
        # total_convinance=int(request.GET.get('total_convinance'))
        total_convinance = 0
        if dtype == 1:
            # if amount >= 20 and amount < 0:
            if  amount > 40 or 0 >=amount:
                return Response({"final_amount":round(total_amt+total_convinance)},status=status.HTTP_406_NOT_ACCEPTABLE)
            # print(amount)           
            final= (total_amt-(total_amt*amount)/100)
            return Response({"final_amount":round(final+total_convinance)})
        elif dtype == 2:
            # if amount >= ((total_amt/20)*100) and amount < 0:
            if amount > ((total_amt * 40)/ 100) or amount <= 0:
            # if 0 <= amount > ((total_amt/20)*100):
                return Response({"final_amount":round(total_amt+total_convinance)},status=status.HTTP_406_NOT_ACCEPTABLE)
            final = (total_amt-amount)
            return Response({"final_amount":round(final+total_convinance)})
        elif dtype == 3:
            return Response({"final_amount":round(0)})
        else: return Response({"final_amount":round(total_amt+total_convinance)})


# ------------------------------------------------------------------------------------------------------


class calculate_total_amount(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    # def get(self,request,cost=0,start_date=None,end_date=None):
        # start_date_string = request.data['start_date']
        # end_date_string = request.data['end_date'] 
    def calculate_distance(self,lat1, lon1, lat2, lon2):
        # radius = 6371.0
        # lat1 = radians(lat1)
        # lon1 = radians(lon1)
        # lat2 = radians(lat2)
        # lon2 = radians(lon2)
        # dlon = lon2 - lon1
        # dlat = lat2 - lat1
        # a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
        # c = 2 * atan2(sqrt(a), sqrt(1 - a))
        # distance = radius * c
        
        # lat=18.589296
        # lat=18.502230
        # long= 73.813550
        # long=73.831780
        googel_client=googlemaps.Client(key=GOOGLE_KEY)
        now=datetime.now()
        # source='18.502000,73.832200'
        source=f'{lat2},{lon2}'
        destination=f'{lat1},{lon1}'
        direction_result=googel_client.directions(source, destination, mode='driving', avoid='ferries', departure_time=now, transit_mode='bus')
        distance=float(direction_result[0]['legs'][0]['distance']['text'].split(' ')[0])
        # print((float(direction_result[0]['legs'][0]['distance']['text'].split(' ')[0])))
        final_distance=0
        if distance >5:
            final_distance=ceil((distance-5)/3)
        return final_distance

   
    def find_sub_srv(self, sub_srv):
        try:
            service = agg_hhc_sub_services.objects.get(sub_srv_id=sub_srv)
            return service
        except  agg_hhc_patients.DoesNotExist:
            return None       
    # def get(self,request,cost=0,start_date=None,end_date=None):
      
    #     # p_lat=float(request.GET.get('latitude'))
    #     # p_long=float(request.GET.get('longitude'))
    #     # print(type(p_lat),';;;;')
    #     # h_lat=18.502230
    #     # h_long=73.831780
    #     # distance=ceil(self.calculate_distance(p_lat,p_long,h_lat,h_long))
    #     # day_convinance = distance*50
       
    #     try:
           
    #         start_date = datetime.strptime(str(start_date), '%Y-%m-%d').date()
          
    #         end_date = datetime.strptime(str(end_date), '%Y-%m-%d').date() 
           
    #         if start_date>end_date :
    #             # return Response({'days_difference':0,'total_convinance':0}, status.HTTP_400_BAD_REQUEST)
    #             return Response({'days_difference':0}, status.HTTP_400_BAD_REQUEST)
                  
    #         day = (end_date - start_date).days
           
    #         total = (cost)*(day+1)
    #         # total_convinance= day_convinance*(day+1)
            
    #         # return Response({'days_difference': total,'day_convinance':day_convinance,'total_convinance':total_convinance})
    #         return Response({'days_difference': total})
    #     except ValueError:
    #         return Response({'error': 'Invalid date format'}, status=400)

    def get(self,request,cost=0,day_count=0):
      
        # p_lat=float(request.GET.get('latitude'))
        # p_long=float(request.GET.get('longitude'))
        # print(type(p_lat),';;;;')
        # h_lat=18.502230
        # h_long=73.831780
        # distance=ceil(self.calculate_distance(p_lat,p_long,h_lat,h_long))
        # day_convinance = distance*50
       
        try:
           
            # start_date = datetime.datetime.strptime(str(start_date), '%Y-%m-%d').date()
          
            # end_date = datetime.datetime.strptime(str(end_date), '%Y-%m-%d').date() 
           
            # if start_date>end_date :
            #     # return Response({'days_difference':0,'total_convinance':0}, status.HTTP_400_BAD_REQUEST)
            #     return Response({'days_difference':0}, status.HTTP_400_BAD_REQUEST)
                  
            # day = (end_date - start_date).days
           
            # total = (cost)*(day+1)
            total_cost = (cost)*(day_count)
            # total_convinance= day_convinance*(day+1)
            
            # return Response({'days_difference': total,'day_convinance':day_convinance,'total_convinance':total_convinance})
            return Response({'days_difference': total_cost})
        except ValueError:
            return Response({'error': 'Invalid date format'}, status=400)
        



# ------------------------------------------------------------------------------------------------------




# class calculate_total_amount(APIView):
    
#     def get(self,request, sub_srv=0,cost=0,start_date=None,end_date=None):
#     # def get(self,request,cost=0,start_date=None,end_date=None):

#         start_date_string = start_date
#         end_date_string = end_date
#         start_date_string = start_date_string.replace('T',' ') 
#         end_date_string = end_date.replace('T',' ')
#         # print(start_date_string)     
#         try:            
#             start_date = datetime.strptime(str(start_date_string), '%Y-%m-%d %H:%M').date()
#             start_time = datetime.strptime(str(start_date_string), '%Y-%m-%d %H:%M').time()
#             end_date = datetime.strptime(str(end_date_string), '%Y-%m-%d %H:%M').date() 
#             end_time = datetime.strptime(str(end_date_string), '%Y-%m-%d %H:%M').time() 
#             if start_date>end_date or (start_date==end_date and start_time>=end_time):
#                 return Response({'days_difference':0})      
#             diff = (end_time.hour)-(start_time.hour)
#             day = (end_date - start_date).days
#             total = (diff*cost)*(day+1)

#             # if start_date>end_date:
#             #     return Response({'days_difference':0})           
#             # diff = (end_date - start_date).days 
#             # total = (diff+1) * cost          
#             return Response({'days_difference': total})
#         except ValueError:
#             return Response({'error': 'Invalid date format'}, status=400)
        
class Service_requirment_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_service(self,pk):
        return  agg_hhc_event_plan_of_care.objects.get(eve_poc_id=pk,status=1)
    def get(self,request,pk):
        service = self.get_service(pk)
        if service:
            services =  agg_hhc_add_service_serializer(service)
            return Response({"services":services.data})
        else:
            return Response({"error":"user service not found"})
        
    def put(self, request, pk):
        clgref_id = get_prof(request)[3]
        request.data['last_modified_by'] = clgref_id

        service = self.get_service(pk)
        serializer =  put_agg_hhc_add_service_put_serializer(service, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

#------------------------------agg_hhc_professional_scheduled---used to display professional booked services --this will be used to display professiona record in calander


class agg_hhc_professional_scheduled_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_object(self,prof_sche_id,formate=None):
        try:
            return  agg_hhc_professional_scheduled.objects.filter(srv_prof_id=prof_sche_id,status=1)
        except  agg_hhc_professional_scheduled.DoesNotExist:
            raise status.HTTP_404_NOT_FOUND
    def get(self,request,prof_sche_id):
        timeobject=self.get_object(prof_sche_id)
        serialized= agg_hhc_professional_scheduled_serializer(timeobject,many=True)
        return Response(serialized.data)

#--------------------------agg_hhc_professional_scheduled_api---used to display professional booked services in professional Avalibility

class agg_hhc_professional_time_availability_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_object(self,prof_sche_id,formate=None):
        try:
            return  agg_hhc_professional_scheduled.objects.filter(srv_prof_id=prof_sche_id,status=1,scheduled_date=timezone.now())
        except  agg_hhc_professional_scheduled.DoesNotExist:
            raise status.HTTP_404_NOT_FOUND
    def get(self,request,prof_sche_id):
        dateobject=self.get_object(prof_sche_id)
        serialized= agg_hhc_professional_scheduled_serializer(dateobject,many=True)
        return Response(serialized.data)
    
#-------------------------agg_hhc_feedback_answers----------------------------

class agg_hhc_feedback_answers_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_obj(self,agg_sp_pt_id):
        try:
            obj= agg_hhc_events.objects.get(agg_sp_pt_id=agg_sp_pt_id,status=1)
            return  agg_hhc_feedback_answers.objects.get(eve_id=obj.eve_id)
        except  agg_hhc_feedback_answers.DoesNotExist:
            raise Response(status.HTTP_404_NOT_FOUND)
    def get(self,request,agg_sp_pt_id):
        feedback_answer=self.get_obj(agg_sp_pt_id)
        serialized= agg_hhc_feedback_answers_serializer(feedback_answer)
        return Response(serialized.data)



#------------------------agg_hhc_state_and_city from zone id----------------------

class agg_hhc_city_state_from_zone_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_object(self,city_id):
        return  agg_hhc_city.objects.filter(status=1,city_id=city_id)
    def get(self,request,city_id):
        city_state=self.get_object(city_id)
        serialized= agg_hhc_city(city_state,many=True)
        return Response(serialized.data)
    

#-----------------------------------agg_hhc_event_plan_of_care--------------------------------

class service_details_today_total_services(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
       total_services =  agg_hhc_event_plan_of_care.objects.filter(status=1,added_date=timezone.now().date()).count()
       return Response({'total_services': total_services})


#----------------------------------last patient service name and start date end date--------------------------

class last_patient_service_info(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_object(self, pt_id):
        try:
            return agg_hhc_events.objects.filter(agg_sp_pt_id=pt_id,status=1)
        except Exception as e:
            return None
    def get(self, request, pt_id):
        try:
            patient_objects = self.get_object(pt_id)
            if patient_objects is None:
                return Response({"error": "Error fetching patient data"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            if not patient_objects:
                return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)
            latest_patient_object = patient_objects.last()  # Get the latest object from the queryset
            eve_id = latest_patient_object.eve_id
            # print("this is patient_object",eve_id)
            try:
                patient_date = agg_hhc_event_plan_of_care.objects.filter(eve_id=eve_id,status=1).last()
                # print("patient data",patient_date)
            except agg_hhc_event_plan_of_care.DoesNotExist:
                return Response({"error": "Patient date not found"}, status=status.HTTP_404_NOT_FOUND)
            try:
                patient_date_serialized = agg_hhc_event_plan_of_care_serializer(patient_date)
                # print("patient_date_serialized",patient_date_serialized.data.get('srv_id'))
            except Exception as e:
                return Response({"error": "Error serializing patient date"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            try:
                patient_service = agg_hhc_services.objects.filter(srv_id=patient_date_serialized.data.get('srv_id')).last()
            except agg_hhc_services.DoesNotExist:
                return Response({"error": "Service not found"}, status=status.HTTP_404_NOT_FOUND)
            return Response({'Date': patient_date_serialized.data, 'service': patient_service.service_title})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class previous_patient_pending_amount(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_object(self, pt_id):
        try:
            event = agg_hhc_events.objects.filter(agg_sp_pt_id=pt_id,status=1).last()
            if event is not None:
                return event
            else:
                raise agg_hhc_events.DoesNotExist
        except agg_hhc_events.DoesNotExist:
            return None
    def get(self, request, pt_id):
        try:
            patient_objects = self.get_object(pt_id)
            if patient_objects is None:
                return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)
            eve_id = patient_objects.eve_id
            patient_remaining_payment = agg_hhc_payment_details.objects.filter(eve_id=eve_id,status=1,overall_status="SUCCESS").last()
            if patient_remaining_payment:
                return Response({'Remaining_payment': patient_remaining_payment.amount_remaining})
            else:
                return Response({"Remaining_payment":patient_objects.final_amount}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#---------------------------------------------------mayank------------------------------------------------------
#---------------------------------------------------------------------------------------------------------------

# @api_view(['GET'])
# def total_services1(request, service_professional_id):  # Adjust the parameter name here
#     try:
#         total_services =  agg_hhc_event_plan_of_care.objects.filter(srv_prof_id=service_professional_id).count()  # Adjust the field name here
#         return Response({"total_services": total_services}, status=status.HTTP_200_OK)
#     except agg_hhc_event_plan_of_care.DoesNotExist:
#         return Response({"error": "Service Professional not found."}, status=status.HTTP_404_NOT_FOUND)
    
class AggHHCServiceProfessionalListAPIView(generics.ListAPIView):
    queryset = agg_hhc_service_professionals.objects.all()
    serializer_class = AggHHCServiceProfessionalSerializer

class CalculateConvinanceCharge(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]


# ============================================= 11/04/2024 =========================================================
    
    def get(self, request, eve_id, paid_amount):
        try:
            event1 = agg_hhc_events.objects.get(eve_id=eve_id)
        except agg_hhc_events.DoesNotExist:
            return Response({"error":"event not fount"})
        sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=eve_id,status=1)
        if event1.final_amount==paid_amount:
            return Response({'total_sessions':sessions.count(),'no_of_serssion':sessions.count(), 'total_cahrge':round(event1.final_amount), 'amount_return':0})

        if not sessions.exists():
            return Response('no active sessions')
        tot_conv=0
        tot=0
        for i in sessions:
            if i.convinance_charges:
                conv=i.convinance_charges
            else:
                conv=0 
            tot_conv=int(tot_conv)+conv
        single_session_charge=(event1.final_amount-tot_conv)/sessions.count()
        s_count=0 
        c=0
        for i in sessions:
            if i.convinance_charges:
                conv=i.convinance_charges
            else:
                conv=0
            # temp=temp+1
            tot_conv=int(tot_conv)+conv
            # while paid_amount>=single_session_charge+conv:
            #     paid_amount=paid_amount-(single_session_charge+conv)
            #     tot=tot+single_session_charge+conv
            #     s_count=s_count+1
            if paid_amount >= single_session_charge+conv or (int(paid_amount)==int(single_session_charge+conv) and paid_amount != 0):
                # print(paid_amount)
                # print(single_session_charge+conv)
                paid_amount -= single_session_charge+conv
                tot += single_session_charge+conv
                # print(tot)
                s_count +=1
                c=c+1
            else:
                # print(paid_amount)
                # print(single_session_charge+conv)
                break
        # print(c)
        # print(round(tot))
        # print(paid_amount)
        # (single_session_charge+conv)
        # tot=0
        # count=0
        # for i in sessions:
        #     if i.convinance_charges:
        #         conv=i.convinance_charges
        #     else: 
        #         conv=0
        #     if paid_amount>=tot:
        #         count+=1
        #         tot = tot+single_session_charge+conv
        #     else:
        #         break
        return Response({'total_sessions':sessions.count(),'no_of_serssion':s_count, 'total_cahrge':round(tot), 'amount_return':round(paid_amount)})


# ============================================= 11/04/2024 =========================================================
# ============================================= 05/01/2024 =========================================================
    # def get(self, request, eve_id, paid_amount):
    #     sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=eve_id,status=1)
    #     try:
    #         event1 = agg_hhc_events.objects.get(eve_id=eve_id)
    #     except agg_hhc_events.DoesNotExist:
    #         return Response({"error":"event not fount"})
    #     single_session_charge = int(event1.Total_cost)/sessions.count()
    #     # print('single_session_charge', single_session_charge)
    #     a1=0
    #     s1=0
    #     b=0
    #     final_disc=0
    #     refound = 0
    #     session_charges=0
    #     for i in sessions:
    #         if i.convinance_charges:
    #             conv=i.convinance_charges
        
    #         else:
    #             conv=0
    #         # print('single_session_charge ', single_session_charge)
    #         # print('convinance ', conv)
    #         # print('paid_amount ', paid_amount)
    #         if paid_amount>=(single_session_charge+conv):
    #             # print('if cons ', 1)
    #             a1=paid_amount - (single_session_charge+conv)
    #             paid_amount = paid_amount - (single_session_charge+conv)
    #             # print(a1,'a1')
    #             b=b+(single_session_charge+conv)
    #             print(b,'b')
    #             s1=s1+1
    #             session_charges=session_charges+single_session_charge
    #             # a1=a1+(single_session_charge+conv)
    #         else:
    #             refound = paid_amount
        
    #     total_charges = b
    #     day_conv=total_charges-session_charges
    #     print('paid_amount',paid_amount)
    #     print('session', s1)
    #     print('total_charges', total_charges)
    #     # print('refound',a1 )
    #     print('refund',a1)
    #     disc1=event1.discount_value
    #     if disc1:
    #         disc1=event1.discount_value
    #     else:
    #         disc1=0
    #     if event1.discount_type==1:
    #         final_disc = int((int(disc1)/100)*int(s1*single_session_charge))
    #         # print(disc1, ';per1')
    #         # print(tot, ';per2')
    #         # print(final_disc, ';per3')
    #     elif event1.discount_type==2:
    #         final_disc = int(disc1)
    #         # print(final_disc, ';amt')
    #     else:
    #         final_disc = 0
    #     print(final_disc,'final_disc')
    #     final_amt = (session_charges-final_disc)+day_conv
    #     user_refound = a1+final_disc

    #     print(final_amt,'final_amt')
    #     print(user_refound,'user_refound')
    #     return Response({'total_sessions':sessions.count(),'no_of_serssion':s1, 'total_cahrge':final_amt, 'amount_return':user_refound})
# ============================================= 05/01/2024 =========================================================
# ============================================= 06/01/2024 =========================================================
    # def get(self, request, eve_id, paid_amount):
    #     sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=eve_id,status=1)
    #     try:
    #         event1 = agg_hhc_events.objects.get(eve_id=eve_id)
    #     except agg_hhc_events.DoesNotExist:
    #         return Response({"error":"event not fount"})
    #     single_session_charge = int(event1.Total_cost)/sessions.count()
    #     print('single_session_charge', single_session_charge)
    #     static_paid_amt=paid_amount
    #     a1=0
    #     s1=0
    #     b=0
    #     final_disc=0
    #     refound = 0
    #     session_charges=0
    #     disc1=event1.discount_value
    #     if disc1:
    #         disc1=event1.discount_value
    #     else:
    #         disc1=0
    #     print(disc1, ';;;;;;;;;;;;;;;;;;;;;;')

    #     if event1.discount_type==1:
    #         # final_disc = int((int(disc1)/100)*int((sessions.count())*single_session_charge))
    #         # paid_amount=paid_amount+final_disc
    #         paid_amount = paid_amount+(paid_amount)/100*disc1
    #         print(paid_amount,';per1')

    #     elif event1.discount_type==2:
    #         final_disc = int(disc1)
    #         # paid_amount=paid_amount+final_disc
    #     else:
    #         final_disc = 0
    #         # paid_amount=paid_amount+final_disc
    #     total_charges=0
    #     day_conv=0
    #     print(final_disc,'final_disc1')
    #     for i in sessions:
    #         if i.convinance_charges:
    #             conv=i.convinance_charges
    #         else:
    #             conv=0
    #         print('single_session_charge ', single_session_charge)
    #         print('convinance ', conv)
    #         print('paid_amount ', paid_amount)
    #         if paid_amount>=(single_session_charge+conv):
    #             print('if cons ', 1)
    #             a1=paid_amount - (single_session_charge+conv)
    #             paid_amount = paid_amount - (single_session_charge+conv)
    #             print(a1,'a1')
    #             b=b+(single_session_charge+conv)
    #             print(b,'b')
    #             s1=s1+1
    #             session_charges=session_charges+single_session_charge
    #             # a1=a1+(single_session_charge+conv)
    #             total_charges = b
    #             day_conv=day_conv+conv
    #             # day_conv=total_charges-session_charges
    #         else:
    #             refound = paid_amount
    #     print(refound,'refound111')
    #     disc1=event1.discount_value
    #     if disc1:
    #         disc1=event1.discount_value
    #     else:
    #         disc1=0
    #     print(disc1, ';;;;;;;;;;;;;;;;;;;;;;')
    #     if event1.discount_type==1:
    #         sess_disc = int((int(disc1)/100)*int(s1*single_session_charge))
    #         refound = refound
    #         # paid_amount=paid_amount+final_disc
    #         print((int(s1*single_session_charge)),'sess_amt')
    #         print(sess_disc,'sess_disc')
    #         print(refound,'refound')

    #     elif event1.discount_type==2:
    #         sess_disc = int(disc1)
    #         # paid_amount=paid_amount+final_disc
    #     else:
    #         sess_disc = 0
    #         # paid_amount=paid_amount+final_disc
    #     print('paid_amount',paid_amount)
    #     print('session_charges', session_charges)
    #     print('total_charges', total_charges)
    #     print('conv',conv )
    #     print('refund',a1)
        
    #     print(final_disc,'final_disc')
    #     if(session_charges==0):
    #         final_amt=0
    #     else:
    #         final_amt = (session_charges-sess_disc)+day_conv
    #     user_refound = static_paid_amt-final_amt
    #     # user_refound = refound
    #     print(final_disc,'sess_disc')
    #     print(final_amt,'final_amt')
    #     print(user_refound,'user_refound')
    #     return Response({'total_sessions':sessions.count(),'no_of_serssion':s1, 'total_cahrge':final_amt, 'amount_return':user_refound})
          # ============================================= 06/01/2024 =========================================================
#     def get(self, request, eve_id,paid_amount):
#         # pk=request.data['eve_id']
#         sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=eve_id,status=1)
#         # print(sessions.count(),'ssessionss')
#         try:
#             event1 = agg_hhc_events.objects.get(eve_id=eve_id)
#         except agg_hhc_events.DoesNotExist:
#             return Response({"error":"event not fount"})
#         # print(event1.day_convinance, 'day convinanve')
#         convinance=0
#         if event1.day_convinance:
#             convinance=event1.day_convinance
#         else: convinance =0
#         final_amount = event1.final_amount
#         # print(final_amount, 'final amount')
#         # print(event1.Total_cost, 'total cost')
#         total_conv = 0 
#         single_session=int(int(event1.Total_cost)/sessions.count())
#         # print(single_session, 'singel session charge')
#         tot=0
#         refound_amt=0
#         eve_sess_cost = 0
#         eve_sess_cov=0
#         session_count=0
#         for s in sessions:
#             # if s.convinance_charges:
                
#             if s.convinance_charges:
#                 total_conv=single_session+s.convinance_charges
#             else:
#                 total_conv=0
#             # print(total_conv, 'total conv')
#             # print(paid_amount, 'pppaid amount')
#             if int(paid_amount)>=int(total_conv):
#                 session_count = session_count + 1
#                 eve_sess_cost = eve_sess_cost+single_session
#                 eve_sess_cov = eve_sess_cov+s.convinance_charges
#                 tot= tot + int(int(paid_amount)-int(total_conv))
#                 paid_amount=int(int(paid_amount)-int(total_conv))
#             else:
#                 refound_amt=int(paid_amount)
        

#         disc1=event1.discount_value
#         if disc1:
#             disc1=event1.discount_value
#         else:
#             disc1=0
#         if event1.discount_type==1:
#             final_disc = int((int(disc1)/100)*int(eve_sess_cost))
#             # print(disc1, ';per1')
#             # print(tot, ';per2')
#             # print(final_disc, ';per3')
#         elif event1.discount_type==2:
#             final_disc = int(disc1)
#             # print(final_disc, ';amt')
#         else:
#             final_disc = 0
#         final_cost = (eve_sess_cost-final_disc)+eve_sess_cov
#         refound_amt=refound_amt+final_disc
#         refound_amt1=refound_amt
#         print('total session',sessions.count())
#         print('no of session',session_count)
#         print('total charges',tot)
#         print('refund',refound_amt)     
#         print('final cost',final_cost)
# # ========================================================================================
        
#         # single_session=int(int(event1.Total_cost)/sessions.count())
#         # print(single_session, 'singel session charge')
#         # no_s = 0
#         # s_charge = 0
#         # while (s_charge+single_session)<=tot:
#         #     if single_session<=tot:
#         #         s_charge = s_charge+single_session
#         #         no_s=no_s+1
#         #     else:
#         #         return Response({'no session can be created in this amount'})
        
#         # # print(no_s)

#         # rem_sess = sessions.count() - no_s
#         # # print(rem_sess)
#         # # event1.day_convinance
#         # refound_amount=0
#         # added_convi=0
#         # # print(no_s,'no_sno_s')
#         # for i in range(sessions.count()):
#         #     if sessions[i].convinance_charges:
#         #         session_con=sessions[i].convinance_charges
#         #     else:
#         #         session_con = 0
#         #     if i<no_s:
#         #         added_convi=int(int(added_convi)+int(session_con))
#         #     else:
#         #         refound_amount=refound_amount+session_con
#         # # print(session_con, 'added convinance')
#         # # print(refound_amount, 'refound convinance')
#         # disc1=event1.discount_value
#         # if disc1:
#         #     disc1=event1.discount_value
#         # else:
#         #     disc1=0
#         # if event1.discount_type==1:
            
#         #     final_disc = int((int(disc1)/100)*int(tot))
#         #     # print(disc1, ';per1')
#         #     # print(tot, ';per2')
#         #     # print(final_disc, ';per3')
#         # elif event1.discount_type==2:
#         #     final_disc = int(disc1)
#         #     # print(final_disc, ';amt')
#         # else:
#         #     final_disc = 0
#         #     # print('other')
#         # total_cost_session = (no_s*single_session)-final_disc
#         # # print(total_cost_session)
#         # # refound = tot-s_charge + (refound_amount)
#         # refound = (tot-(no_s*single_session) )+refound_amount
#         # # print(refound, 'customer refound')
#         # final_amount = (total_cost_session+added_convi)
#         # # return Response({'single session charge':})
#         return Response({'total_sessions':sessions.count(),'no_of_serssion':session_count, 'total_cahrge':final_cost, 'amount_return':refound_amt})
# ======================================================================================================
# ======================================================================================================

# ===============================================================================================
     
    
    # def get(self, request, eve_id,paid_amount):
    #     # pk=request.data['eve_id']
    #     sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=eve_id,status=1)
    #     print(sessions.count(),'ssessionss')
    #     try:
    #         event1 = agg_hhc_events.objects.get(eve_id=eve_id)
    #     except agg_hhc_events.DoesNotExist:
    #         return Response({"error":"event not fount"})
    #     print(event1.day_convinance, 'day convinanve')
    #     convinance=0
    #     if event1.day_convinance:
    #         convinance=event1.day_convinance
    #     else: convinance =0
    #     final_amount = event1.final_amount
    #     print(final_amount, 'final amount')
    #     print(event1.Total_cost, 'total cost')
    #     total_conv = 0 
    #     for s in sessions:
    #         if s.convinance_charges:
    #             total_conv=total_conv+s.convinance_charges
    #     tot=int(int(paid_amount)-int(total_conv))
    #     print(tot, 'total amount')
    #     print(paid_amount, 'paid amount')
    #     print(total_conv, 'total convance charge')
    #     single_session=int(int(event1.Total_cost)/sessions.count())
    #     print(single_session, 'singel session charge')
    #     no_s = 0
    #     s_charge = 0
    #     while (s_charge+single_session)<=tot:
    #         if single_session<=tot:
    #             s_charge = s_charge+single_session
    #             no_s=no_s+1
    #         else:
    #             return Response({'no session can be created in this amount'})
        
    #     print(no_s)

    #     rem_sess = sessions.count() - no_s
    #     print(rem_sess)
    #     # event1.day_convinance
    #     refound_amount=0
    #     added_convi=0
    #     print(no_s,'no_sno_s')
    #     for i in range(sessions.count()):
    #         if sessions[i].convinance_charges:
    #             session_con=sessions[i].convinance_charges
    #         else:
    #             session_con = 0
    #         if i<no_s:
    #             added_convi=int(int(added_convi)+int(session_con))
    #         else:
    #             refound_amount=refound_amount+session_con
    #     print(session_con, 'added convinance')
    #     print(refound_amount, 'refound convinance')
    #     disc1=event1.discount_value
    #     if disc1:
    #         disc1=event1.discount_value
    #     else:
    #         disc1=0
    #     if event1.discount_type==1:
            
    #         final_disc = int((int(disc1)/100)*int(tot))
    #         print(disc1, ';per1')
    #         print(tot, ';per2')
    #         print(final_disc, ';per3')
    #     elif event1.discount_type==2:
    #         final_disc = int(disc1)
    #         print(final_disc, ';amt')
    #     else:
    #         final_disc = 0
    #         print('other')
    #     total_cost_session = (no_s*single_session)-final_disc
    #     print(total_cost_session)
    #     # refound = tot-s_charge + (refound_amount)
    #     refound = (tot-(no_s*single_session) )+refound_amount
    #     print(refound, 'customer refound')
    #     final_amount = (total_cost_session+added_convi)
    #     # return Response({'single session charge':})
    #     # return Response({'total_sessions':sessions.count(),'no_of_serssion':no_s, 'total_cahrge':total_cost_session, 'amount_return':refound})
    #     return Response({'total_sessions':sessions.count(),'no_of_serssion':no_s, 'total_cahrge':final_amount, 'amount_return':refound})
# ======================================== payment details ========================================================

#     def get(self,request,pk):
#         event = self.get_payment(pk)

#         sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=pk,status=1)
#         # if 
#         # session_with_convinance =list((sessions.order_by('actual_StartDate_Time')).is_convinance)
#         session_with_convinance =[s.is_convinance for s in (sessions.order_by('actual_StartDate_Time'))]
#         # print(sessions.order_by('actual_StartDate_Time'),'session')
# # --------------------------------------------------------------------------------------
#         try:
#             event1 = agg_hhc_events.objects.get(eve_id=pk)
#         except agg_hhc_events.DoesNotExist:
#             return Response({"error":"event not fount"})
#         day_convinance=event1.day_convinance
#         prof_take_conv=0
#         tot_conv_charge=0
#         for prof in sessions:
#             if prof.is_convinance:
#                 prof_take_conv = prof_take_conv+1
#                 tot_conv_charge=tot_conv_charge+day_convinance
#         # print(tot_conv_charge,'lkklkkl')   
#         # print(day_convinance,'lkklkkl')   
#         # print(tot_conv_charge,'asdfgh')
#         print(sessions.count(), ';;;;')
#         if sessions.count()>=0:
#             print('llddss')
#             session_charge = int(int(event1.final_amount-tot_conv_charge)/(sessions.count()))
#         else :
#             return Response({'error':'no active session'})
# # --------------------------------------------------------------------------------------
#         for s in sessions:
#             if s.is_convinance:
#                 charge=s.convinance_charges
#                 break
#             else: 
#                 charge = 0
#         if event.data:
#             payment_serializer=GetPaymentDetailSerializer(event.data,many=True)
#             paid_amt = sum(float(item['amount_paid']) for item in payment_serializer.data)
#             data={
#                 "eve_id" : payment_serializer.data[-1]['eve_id'], 
#                 "Total_Amount" : float(payment_serializer.data[-1]['Total_cost']), 
#                 "Paid_Amount" : paid_amt, 
#                 # "Pending_Amount" : float(payment_serializer.data[-1]['Total_cost']) - paid_amt,
#                 "Pending_Amount" : event1.final_amount - paid_amt,
#                 "singel_session_charge":session_charge,
#                 "day_convinance":charge,
#                 "session_with_convinance":session_with_convinance
#             }
#             # print(payment_serializer.data['amount_paid'])
#             return Response(data)

#         else :
#             event = self.get_event(pk)
#             payment_serializer = GetEventPaymentDetailSerializer(event.data, many=True)
#             data={
#                 "eve_id" : payment_serializer.data[-1]['eve_id'],
#                 "Total_Amount":payment_serializer.data[-1]['final_amount'],
#                 "Paid_Amount" : 0, 
#                 "Pending_Amount" : payment_serializer.data[-1]['final_amount'],
#                 "convinance_charge":charge 
#             }
#             return Response(data)
# ================================================================================================


# ================================================================================================




# class PaymentDetailAPIView(APIView):
#     @csrf_exempt
#     def post(self, request, format=None):
#         clgref_id = get_prof(request)[3]
#         request.data['last_modified_by']=clgref_id


#         sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=request.data['eve_id'],status=1).order_by('actual_StartDate_Time')
#         if sessions.count()==0:
#             return Response({'error':'no active sessions'})
# # # --------------------------------------------------------------------------------------------------
#         try:
#             event = agg_hhc_events.objects.get(eve_id=request.data['eve_id'])
#         except agg_hhc_events.DoesNotExist:
#             return Response({"error":"event not fount"})
#         count=request.data['no_of_session']
#         for s in range(0,sessions.count()):
#             if s<int(count):
#                 continue
#             else: 
#                 session=sessions[s]
#                 session.status=2
#                 session.save()
#         session=sessions[0]
#         try:
#             request.data['srv_prof_id']=session.srv_prof_id.srv_prof_id
#         except:
#             request.data['srv_prof_id']=None
#         request.data['overall_status']='SUCCESS'
#         print(request.data,"request_data_of cash payment")
#         serializer = PaymentDetailSerializer(data=request.data)
#         if serializer.is_valid():
#             print(serializer,';;;;;demo;;;;;;')
#             serializer.save()
#             print('111111;;;;;demo;;;;;;')
# # --------------------------- update final amount in event ---------------------------
#             event.final_amount=request.data['amount_paid']
#             event.save()
            
# # ----------------------------------- Update event poc -------------------------------------- 
            
#             dtl = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=event.eve_id, status=1)

#             min_actual_StartDate_Time = dtl.aggregate(min_actual_StartDate_Time=Min('actual_StartDate_Time'))
#             max_actual_StartDate_Time = dtl.aggregate(max_actual_StartDate_Time=Max('actual_StartDate_Time'))

#             epoc = agg_hhc_event_plan_of_care.objects.get(eve_id=event.eve_id, status=1)

#             epoc.start_date = min_actual_StartDate_Time['min_actual_StartDate_Time']
#             epoc.end_date = max_actual_StartDate_Time['max_actual_StartDate_Time']

#             epoc.save()

# # --------------------------- update final amount in event ---------------------------
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PaymentDetailAPIView(APIView):
    def post(self, request, format=None):
        clgref_id = get_prof(request)[3]
        request.data['last_modified_by'] = clgref_id

        # Retrieve sessions
        sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=request.data['eve_id'], status=1).order_by('actual_StartDate_Time')
        if sessions.count() == 0:
            return Response({'error': 'no active sessions'}, status=status.HTTP_404_NOT_FOUND)

        # Try to get the event
        try:
            event = agg_hhc_events.objects.get(eve_id=request.data['eve_id'])
        except agg_hhc_events.DoesNotExist:
            return Response({"error": "event not found"}, status=status.HTTP_404_NOT_FOUND)

        count = request.data['no_of_session']
        # Check if sessions count is less than the required count
        if sessions.count() < count:
            return Response({'error': 'not enough sessions available'}, status=status.HTTP_400_BAD_REQUEST)

        # Update session statuses
        for s in range(0, sessions.count()):
            if s < int(count):
                continue
            else:
                session = sessions[s]
                session.status = 2
                session.save()

        # Ensure there is at least one session to proceed
        if sessions.count() == 0:
            return Response({'error': 'no sessions available'}, status=status.HTTP_404_NOT_FOUND)
        
        session = sessions[0]
        
        try:
            request.data['srv_prof_id'] = session.srv_prof_id.srv_prof_id
        except AttributeError:
            request.data['srv_prof_id'] = None

        request.data['overall_status'] = 'SUCCESS'
        request.data['payment_to_desk_date']=timezone.now().date()


        serializer = None
        if request.data['mode'] == 1:
            serializer = PaymentDetailSerializercash(data=request.data)
        elif request.data['mode'] == 2:
            serializer = PaymentDetailchequeSerializer(data=request.data)
        elif request.data['mode'] == 4:
            serializer = PaymentDetailcardSerializer(data=request.data)
        elif request.data['mode'] == 5:
            serializer = PaymentDetailQRSerializer(data=request.data)
        elif request.data['mode'] == 6:
            serializer = PaymentDetailNEFTSerializer(data=request.data)

        if serializer is not None:
            if serializer.is_valid():
                serializer.save()

                # Update final amount in event
                event.final_amount = request.data['amount_paid']
                event.save()

                # Update event plan of care
                dtl = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=event.eve_id, status=1)

                min_actual_StartDate_Time = dtl.aggregate(min_actual_StartDate_Time=Min('actual_StartDate_Time'))
                max_actual_StartDate_Time = dtl.aggregate(max_actual_StartDate_Time=Max('actual_StartDate_Time'))

                epoc = agg_hhc_event_plan_of_care.objects.get(eve_id=event.eve_id, status=1)

                epoc.start_date = min_actual_StartDate_Time['min_actual_StartDate_Time']
                epoc.end_date = max_actual_StartDate_Time['max_actual_StartDate_Time']

                epoc.save()

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            error_message = "Invalid mode provided"
            return Response({"error": error_message}, status=status.HTTP_400_BAD_REQUEST)

    # @csrf_exempt
#     def post(self, request, format=None):
#         clgref_id = get_prof(request)[3]
#         request.data['last_modified_by']=clgref_id
        
#         # # request.data['amount_remaining']=request.data['Total_cost']-request.data['amount_paid']
#         # plan_of_care = (agg_hhc_event_plan_of_care.objects.get(eve_id=request.data['eve_id'],status=1))
#         # # print('cost of sub_service ')
        
#         # amount = Decimal(request.data['amount_paid'])
#         # # active_session=amount/plan_of_care.sub_srv_id.cost
#         # try:
#         #     # amount = Decimal(request.data['amount_paid'])
#         #     cost_per_session = Decimal(plan_of_care.sub_srv_id.cost)
#         #     active_session = amount / cost_per_session
#         # except InvalidOperation as e:
#         #     # Handle exceptions raised during the conversion or division process
#         #     return Response(f"Error: {str(e)}", status=status.HTTP_400_BAD_REQUEST)

#         sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=request.data['eve_id'],status=1).order_by('actual_StartDate_Time')
#         if sessions.count()==0:
#             return Response({'error':'no active sessions'})
# # # --------------------------------------------------------------------------------------------------
#         try:
#             event = agg_hhc_events.objects.get(eve_id=request.data['eve_id'])
#         except agg_hhc_events.DoesNotExist:
#             return Response({"error":"event not fount"})
# #         day_convinance=event.day_convinance
# #         prof_take_conv=0
# #         tot_conv_charge=0
# #         for prof in sessions:
# #             if prof.is_convinance:
# #                 prof_take_conv = prof_take_conv+1
# #                 tot_conv_charge=tot_conv_charge+day_convinance
# #         # print(tot_conv_charge,'lkklkkl')   
# #         # print(day_convinance,'lkklkkl')   
# #         # print(tot_conv_charge,'asdfgh')
        
# #         session_charge = int(int(event.final_amount-tot_conv_charge)/(sessions.count()))
# #         # session_charge = request.data['singel_session_charge']
# #         # paid_amt=request.data['amount_paid']
# #         # day_convinance= request.data['day_convinance']
# #         tot=0
# #         count=0
# #         for s in sessions:
# #             if s.is_convinance:
# #                 # print(tot, day_convinance, session_charge,'sdfg')
# #                 # tot=tot+(day_convinance+session_charge)
# #                 conv=day_convinance
# #             else:
# #                 # tot=tot+session_charge
# #                 conv=0
# #             if amount >= (tot+(conv+session_charge)):
# #             # print(tot)
# #                 tot=tot+(conv+session_charge)
# #                 count=count+1
# #             else:
# #                 break
        
# #         # print(tot,'total',session_charge, 'counts',count)
# #         # print(event.final_amount, tot_conv_charge, session_charge)
# #         # sorted_session=sessions.order_by('actual_StartDate_Time')
# #         # tot_session=event.final_amount
# #         # conv=0
# #         # tot=0
# #         # for ss in sorted_session:
# #         #     if not ss.convinance_charges:
# #         #         conv=0
# #             # if ss.convinance_charges+
# # # --------------------------------------------------------------------------------------------------
# #         # print(sessions.count())
#         count=request.data['no_of_session']
#         for s in range(0,sessions.count()):
#             if s<int(count):
#                 continue
#             else: 
#                 # sessions[s].update(status=2)
#                 session=sessions[s]
#                 session.status=2
#                 session.save()
#                 # print(session.status)
#         session=sessions[0]
#         # print(count-1)
#         # print(sessions[count-1].actual_StartDate_Time, ';;;asdf;;;')
#         # sessions[count-1].eve_poc_id.start_date=sessions[count-1].actual_StartDate_Time
#         try:
#             request.data['srv_prof_id']=session.srv_prof_id.srv_prof_id
#         except:
#             request.data['srv_prof_id']=None
#         # print(request.data['srv_prof_id'],' ;;;;;')
#         request.data['overall_status']='SUCCESS'
#         serializer = None
#         # print(request.data['mode'])
#         if request.data['mode'] == 1:
#             serializer = PaymentDetailSerializer(data=request.data)
#         elif request.data['mode'] == 2:
#             serializer = PaymentDetailchequeSerializer(data=request.data)
#         elif request.data['mode'] == 4:
#             serializer = PaymentDetailcardSerializer(data=request.data)
#         elif request.data['mode'] == 5:
#             serializer = PaymentDetailQRSerializer(data=request.data)
#         elif request.data['mode'] == 6:
#             serializer = PaymentDetailNEFTSerializer(data=request.data)

#         if serializer is not None:
#             print(request.data['mode'])
#             if serializer.is_valid():
#                 print(request.data['mode'])
#                 # Save the data to the database
#                 print(serializer,';;;;;demo;;;;;;')
#                 serializer.save()
#                 print('111111;;;;;demo;;;;;;')
#     # --------------------------- update final amount in event ---------------------------
#                 event.final_amount=request.data['amount_paid']
#                 event.save()

#     # ----------------------------------- Update event poc -------------------------------------- 
                
#                 dtl = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=event.eve_id, status=1)

#                 min_actual_StartDate_Time = dtl.aggregate(min_actual_StartDate_Time=Min('actual_StartDate_Time'))
#                 max_actual_StartDate_Time = dtl.aggregate(max_actual_StartDate_Time=Max('actual_StartDate_Time'))

#                 epoc = agg_hhc_event_plan_of_care.objects.get(eve_id=event.eve_id, status=1)

#                 epoc.start_date = min_actual_StartDate_Time['min_actual_StartDate_Time']
#                 epoc.end_date = max_actual_StartDate_Time['max_actual_StartDate_Time']

#                 epoc.save()


#     # --------------------------- update final amount in event ---------------------------
#                 return Response(serializer.data, status=status.HTTP_201_CREATED)
#             else:
#                 print(f"Serializer errors: {serializer.errors}")
#                 return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
#             # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#         else:
#             print(request.data)
#             error_message = "Invalid mode provided"
#             print(f"Error: {error_message}")
#             return Response({"error": error_message}, status=status.HTTP_400_BAD_REQUEST)
    
class get_payment_details(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_payment(self,pk):
        try:
            event = agg_hhc_payment_details.objects.filter(eve_id=pk,status=1,overall_status="SUCCESS")
            return Response(event)
        except agg_hhc_payment_details.DoesNotExist:
            # return Response('please enter valid event id',status.HTTP_404_NOT_FOUND)
            return None
        
    def get_event(self,pk):
        try:
            event = agg_hhc_events.objects.filter(eve_id=pk,status=1)
            return Response(event)
        except agg_hhc_events.DoesNotExist:
            # return Response('please enter valid event id',status.HTTP_404_NOT_FOUND)
            return None 
        
    def get(self,request,pk):
        event = self.get_payment(pk)

        sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=pk,status=1)
        # if 
        print(sessions, ';sessions..........')
        # session_with_convinance =list((sessions.order_by('actual_StartDate_Time')).is_convinance)
        session_with_convinance =[s.is_convinance for s in (sessions.order_by('actual_StartDate_Time'))]
        # print(sessions.order_by('actual_StartDate_Time'),'session')
# --------------------------------------------------------------------------------------
        try:
            event1 = agg_hhc_events.objects.get(eve_id=pk)
        except agg_hhc_events.DoesNotExist:
            return Response({"error":"event not fount"})
        # if event1.day_convinance:
        #     day_convinance=event1.day_convinance
        # else:
        #     day_convinance=0
        con_ch = 0
        for i in sessions:
            if i.convinance_charges:
                con_ch += i.convinance_charges
                
        day_convinance= con_ch        
        prof_take_conv=0
        tot_conv_charge=0
        for prof in sessions:
            if prof.is_convinance:
                prof_take_conv = prof_take_conv+1
                tot_conv_charge=tot_conv_charge+day_convinance
        # print(tot_conv_charge,'lkklkkl')   
        # print(day_convinance,'lkklkkl')   
        # print(tot_conv_charge,'asdfgh')
        print(sessions.count(), ';;;;')
        event1_final_amount = event1.final_amount or 0
        tot_conv_charge_value = tot_conv_charge or 0
        if sessions.count()>0:
            print('llddss')
            # session_charge = int(int(event1.final_amount-tot_conv_charge)/(sessions.count()))
            session_charge = int((event1_final_amount - tot_conv_charge_value) / sessions.count())
        else :
            return Response({'error':'no active session'})
# --------------------------------------------------------------------------------------
        for s in sessions:
            if s.is_convinance:
                charge=s.convinance_charges
                break
            else: 
                charge = 0
        if event.data:
            payment_serializer=GetPaymentDetailSerializer(event.data,many=True)
            paid_amt = sum(float(item['amount_paid']) for item in payment_serializer.data)
            data={
                "eve_id" : payment_serializer.data[-1]['eve_id'], 
                "Total_Amount" : float(payment_serializer.data[-1]['Total_cost']), 
                "Paid_Amount" : paid_amt, 
                # "Pending_Amount" : float(payment_serializer.data[-1]['Total_cost']) - paid_amt,
                "Pending_Amount" : event1.final_amount - paid_amt,
                # "singel_session_charge":session_charge,
                # "day_convinance":charge,
                # "session_with_convinance":session_with_convinance
            }
            # print(payment_serializer.data['amount_paid'])
            # return Response('payment already done')
            return Response(data)

        else :
            event = self.get_event(pk)
            payment_serializer = GetEventPaymentDetailSerializer(event.data, many=True)
            print(payment_serializer.data)
            print(payment_serializer.data[-1], 'ddddd;;;;')
            total_amount = payment_serializer.data[-1]['final_amount'] or 0
            pending_amount = payment_serializer.data[-1]['final_amount'] or 0
            print(payment_serializer.data[-1]['final_amount'], 'total amount')
            # data={
            #     "eve_id" : payment_serializer.data[-1]['eve_id'],
            #     "Total_Amount":payment_serializer.data[-1]['final_amount'],
            #     "Paid_Amount" : 0, 
            #     "Pending_Amount" : payment_serializer.data[-1]['final_amount'],
            #     "convinance_charge":charge 
            # }
            data = {
                "eve_id": payment_serializer.data[-1]['eve_id'],
                "Total_Amount": total_amount,
                "Paid_Amount": 0,
                "Pending_Amount": pending_amount,
                "convinance_charge": charge
            }
            return Response(data)
        
#------------------------dashboard(mayank)------------------
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from .models import agg_hhc_service_professionals
from collections import Counter
from django.utils import timezone
from datetime import timedelta

# @method_decorator(cache_page(60 * 15), name='dispatch')
class JjobTypeCountAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        try:
            # Define a list of job types to include in the response
            job_type_list = ['ONCALL', 'FULLTIME', 'PARTTIME']

            # Query the database to get job types with status=1
            job_type_integers = agg_hhc_service_professionals.objects.filter(status=1).values_list('Job_type', flat=True)

            # Count the occurrences of each job type using Counter
            job_type_counts = dict(Counter(job_type_integers))

            # Create a response dictionary with counts for each job type
            response_data = {job_type: job_type_counts.get(JOB_type[job_type].value, 0) for job_type in job_type_list}

            return Response(response_data)
        except Exception as e:
            # Handle any exceptions or errors
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    # def get(self, request, id):
    #     try:
            

    #         if id == 1 :
    #             get_prof_aval = agg_hhc_professional_availability.objects.filter(date = timezone.now().date() ,status=1)
    #             get_prof_id = get_prof_aval.values_list('srv_prof_id', flat=True)
    #             get_srv_prof_obj = agg_hhc_service_professionals.objects.filter(srv_prof_id__in = get_prof_id)
    #             oncall = get_srv_prof_obj.filter(Job_type=1).count()
    #             fulltime = get_srv_prof_obj.filter(Job_type=2).count()
    #             parttime = get_srv_prof_obj.filter(Job_type=3).count()
    #             response_data = {
    #                     "ONCALL": oncall,
    #                     "FULLTIME": fulltime,
    #                     "PARTTIME": parttime
    #                 }
    #         elif id == 2 :
    #             seven_days_ago = timezone.now().date() - timedelta(days=7)

    #             # Filter the queryset for the last 7 days until today's date
    #             get_prof_aval = agg_hhc_professional_availability.objects.filter(
    #                 date__range=[seven_days_ago, timezone.now().date()],
    #                 status=1
    #             )

    #             get_prof_id = get_prof_aval.values_list('srv_prof_id', flat=True)
    #             get_srv_prof_obj = agg_hhc_service_professionals.objects.filter(srv_prof_id__in = get_prof_id)
    #             oncall = get_srv_prof_obj.filter(Job_type=1).count()
    #             fulltime = get_srv_prof_obj.filter(Job_type=2).count()
    #             parttime = get_srv_prof_obj.filter(Job_type=3).count()
    #             response_data = {
    #                     "ONCALL": oncall,
    #                     "FULLTIME": fulltime,
    #                     "PARTTIME": parttime
    #                 }
            
    #         elif id == 3 :
    #             first_day_of_month = timezone.now().replace(day=1)
    #             get_prof_aval = agg_hhc_professional_availability.objects.filter(
    #                 date__range=[first_day_of_month.date(), timezone.now().date()],
    #                 status=1
    #             )
    #             get_prof_id = get_prof_aval.values_list('srv_prof_id', flat=True)
    #             get_srv_prof_obj = agg_hhc_service_professionals.objects.filter(srv_prof_id__in = get_prof_id)
    #             oncall = get_srv_prof_obj.filter(Job_type=1).count()
    #             fulltime = get_srv_prof_obj.filter(Job_type=2).count()
    #             parttime = get_srv_prof_obj.filter(Job_type=3).count()
    #             response_data = {
    #                     "ONCALL": oncall,
    #                     "FULLTIME": fulltime,
    #                     "PARTTIME": parttime
    #                 }
    #         return Response(response_data)
    #     except Exception as e:
    #         # Handle any exceptions or errors
    #         return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



#----------------------------------------------Payment----------------------------------------------------
import requests
from urllib.parse import quote  # Import the quote function for URL encoding
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
import re 
# from .models import PaymentRecord  # Import the PaymentRecord model
@csrf_exempt
@api_view(['POST'])
def create_payment_url(request):
    url = "https://api.cashfree.com/api/v1/order/create"

    # Auto-generate the order ID date-wise
    # order_id = "order_id_SPERO" + datetime.now().strftime("%d%m%Y%H%M%S")
    order_id = "order_id_SPERO" + timezone.now().strftime("%d%m%Y%H%M%S")
    phone_no = request.data['customerPhone'][-10:]
    ammount = request.data['orderAmount']
    name = request.data['customerName']
    email = request.data['customeremail']
    remaining = request.data['Remaining_amount']

    eve_id = request.data.get('eve_id')
    mode = 3
    total_amount = request.data.get('total_amount')
    expiration_time = timezone.now() + timezone.timedelta(minutes=5)

    # print(phone_no)
    payload = {
        "appId": "2045315bd01ed984f26100c6fd135402",
        "secretKey": "5b0b3b4ed9b879b2864796aaf2c320867591e3c4",
        "orderId": order_id,
        "orderAmount": ammount,
        "Remainingamount":remaining,
        "orderCurrency": "INR",
        "orderNote": "HII",
        "customerName": name,
        "customeremail": email,
        "customerPhone": phone_no,  
        "returnUrl": "https://payments-test.cashfree.com/links/response",  
        "notifyUrl": "https://hhc.hospitalguru.in/web/update_transaction_status/",
        "expTime": int(expiration_time.timestamp()),  # Convert expiration_time to timestamp
    }

    response = requests.request("POST", url, data=payload)
    s = response.text
    json_acceptable_string = s.replace("'", "\"")
    d = json.loads(json_acceptable_string)

    # Assuming the response contains the payment link and payment status, you can extract them from the response.
    payment_link = d.get('paymentLink')

    # Send the payment link via SMS using Cashfree's SMS API
    # sms_url = "https://sandbox.cashfree.com/api/v1/sms"
    # sms_payload = {
    #     "appId": "2045315bd01ed984f26100c6fd135402",
    #     "secretKey": "5b0b3b4ed9b879b2864796aaf2c320867591e3c4",
    #     "to": phone_no,
    #     "message": f"Hello {name},\n\nPlease find the payment link below:\n\n{payment_link}",
    #     "sender": "CFPG",
    #     "type": "OTP"
    # }
    # sms_response = requests.request("POST", sms_url, data=sms_payload)
    # sms_d = json.loads(sms_response.text)
    
    # sms_url = " https://api.cashfree.com/pg/links"
    # sms_payload = {
    #     "x-client-id": "20453165a737ebd97e430fcabc135402",
    #     "x-client-secret": "cfsk_ma_prod_172c08ceff37119b1cf5ff4fa593b4bd_a2adc215",
    #     "customerPhone": phone_no,
    #     "send_sms": True,
    #     "message": f"Spero Healthcare Innovations Pvt.Ltd is requesting payment of INR {ammount}.Click on this link to pay-:{payment_link}"
    # }

    # sms_response = requests.post(sms_url, json=sms_payload)

    # # Print the SMS API response
    # print("SMS API response:", sms_response.text)

    # # Parse the response JSON
    # try:
    #     sms_d = sms_response.json()
    # except json.JSONDecodeError:
    #     sms_d = {"status": sms_response.text}

    # api_key = "c27d7fa6-292c-4534-8dc4-a0dd28e7d7e3"
    unique_identifier = re.search(r'#([^/]*)', payment_link).group(1)
    fixed_msg_part = "this is your payment link: https://payments.cashfree.com/order/"

    smstmp = f'Spero Healthcare Innovations Pvt.Ltd is requesting payment of INR {ammount}. Click on this link to pay-: https://payments.cashfree.com/order/#{unique_identifier}'
    send_payment_sms(phone_no, smstmp)
    
    # msg = f"Spero Healthcare Innovations Pvt.Ltd is requesting payment of INR {ammount}.Click on this link to pay-: {payment_link}"
    msg = f"{fixed_msg_part}{payment_link}"
    # Properly encode the content parameter for the WhatsApp API request
    encoded_msg = quote(msg)
    
    # url = f"https://wa.chatmybot.in/gateway/waunofficial/v1/api/v1/sendmessage?access-token={api_key}&phone={phone_no}&content={encoded_msg}&fileName&caption&contentType=1"
    
    # try:
    #     # response = requests.get(url)
    #     response.raise_for_status()  # Raise an exception for 4xx and 5xx status codes
    #     # print("URL successfully hit!")
    #     # print("WhatsApp API Response:", response.text)
    # except requests.exceptions.RequestException as e:
    #     print("Error occurred while hitting the URL:", e)

    # ... Your existing code ...
    # transaction_status = d.get('paymentStatus') if d else None


    # if eve_id is not None:
    #     event_instance, created = agg_hhc_events.objects.get_or_create(eve_id=eve_id,status=1)
    # else:
    #     event_instance = None
    
    event_instance = agg_hhc_events.objects.get(eve_id=eve_id)


    # Save payment record to the database
    payment_record = agg_hhc_cashfree_online_payment.objects.create(
        order_id=order_id,
        amount_paid=payload['orderAmount'],
        amount_remaining=payload['Remainingamount'],
        Total_cost=total_amount,
        order_currency=payload['orderCurrency'],
        order_note=payload['orderNote'],
        paid_by=payload['customerName'],
        customer_email=payload['customeremail'],
        customer_phone=payload['customerPhone'],
        # transaction_status=transaction_status,
        # signature=computed_signature,
        eve_id=event_instance,
        mode=mode,
    )

    # Return the payment link and payment status in the API response
    data = {
        'payment_link': payment_link,
        # 'SMS': sms_d.get("status"),
        # 'payload_json':payload_json
    }
    return Response(data)


# import requests
# from urllib.parse import quote
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# import json
# import base64
# import hashlib
# import hmac
# from django.utils import timezone  # Import timezone for date handling
# from .models import agg_hhc_payment_details, agg_hhc_events  # Import your models

# @api_view(['POST'])
# def create_payment_url(request):
#     url = "https://api.cashfree.com/api/v1/order/create"

#     # Auto-generate the order ID date-wise
#     order_id = "order_id_SPERO" + timezone.now().strftime("%d%m%Y%H%M%S")
#     phone_no = request.data['customerPhone'][-10:]
#     amount = request.data['orderAmount']
#     name = request.data['customerName']
#     email = request.data['customeremail']
#     remaining = request.data['Remaining_amount']

#     eve_id = request.data.get('eve_id')
#     mode = request.data.get('mode')
#     total_amount = request.data.get('total_amount')

#     payload = {
#         "appId": "20453456789987654402",
#         "secretKey": "cfsk_ma_prod_172c0asdfghjlkjhgfds93b4bd_a2adc215",
#         "orderId": order_id,
#         "orderAmount": amount,
#         "Remainingamount": remaining,
#         "orderCurrency": "INR",
#         "orderNote": "HII",
#         "customerName": name,
#         "customeremail": email,
#         "customerPhone": phone_no,
#         "returnUrl": "https://payments-test.cashfree.com/links/response",
#         "notifyUrl": "https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=",
#     }

#     # Generate the signature
#     timestamp = str(int(timezone.now().timestamp()))
#     payload_str = json.dumps(payload)
#     signature_data = timestamp + payload_str
#     message = bytes(signature_data, 'utf-8')
#     secret_key = bytes("Your_Secret_Key", 'utf-8')  # Replace with your actual secret key
#     signature = base64.b64encode(hmac.new(secret_key, message, digestmod=hashlib.sha256).digest())
#     computed_signature = str(signature, encoding='utf-8')

#     response = requests.request("POST", url, data=json.dumps(payload), headers={'Content-Type': 'application/json'})

#     s = response.text
#     json_acceptable_string = s.replace("'", "\"")
#     d = json.loads(json_acceptable_string)

#     # Assuming the response contains the payment link and payment status, you can extract them from the response.
#     payment_link = d.get('paymentLink')

#     api_key = "c27d234567890987654dfghj7d7e3"
#     msg = f"this is your payment link: {payment_link}"

#     # Properly encode the content parameter for the WhatsApp API request
#     encoded_msg = quote(msg)

#     url = f"https://wa.chatmybot.in/gateway/waunofficial/v1/api/v1/sendmessage?access-token={api_key}&phone={phone_no}&content={encoded_msg}&fileName&caption&contentType=1"

#     try:
#         response = requests.get(url)
#         response.raise_for_status()  # Raise an exception for 4xx and 5xx status codes
#     except requests.exceptions.RequestException as e:
#         print("Error occurred while hitting the URL:", e)

#     if eve_id is not None:
#         event_instance, created = agg_hhc_events.objects.get_or_create(eve_id=eve_id, status=1)
#     else:
#         event_instance = None

#     # Save payment record to the database with the signature
#     payment_record = agg_hhc_payment_details.objects.create(
#         order_id=order_id,
#         amount_paid=payload['orderAmount'],
#         amount_remaining=payload['Remainingamount'],
#         Total_cost=total_amount,
#         order_currency=payload['orderCurrency'],
#         order_note=payload['orderNote'],
#         paid_by=payload['customerName'],
#         customer_email=payload['customeremail'],
#         customer_phone=payload['customerPhone'],
#         signature=computed_signature,
#         eve_id=event_instance,
#         mode=mode,
#     )

#     # Return the payment link and payment status in the API response
#     data = {
#         'payment_link': payment_link,
#     }
#     return Response(data)



#--------------------------------------------------------------------------------

# @csrf_exempt
# def cashfree_webhook(request):
#     if request.method == 'POST':
#         try:
#             # Parse the JSON data sent by Cashfree
#             payload = json.loads(request.body.decode('utf-8'))

#             # Extract relevant information from the Cashfree payload
#             transaction_status = payload.get('event')
#             order_id = payload.get('requestId')

#             # Update the payment record in your database based on the extracted information
#             try:
#                 payment_record = agg_hhc_payment_details.objects.get(order_id=order_id)
#                 payment_record.transaction_status = transaction_status
#                 payment_record.save()
#             except agg_hhc_payment_details.DoesNotExist:
#                 # Handle the case where the order ID is not found in your database
#                 pass

#             # Send a response to acknowledge receipt of the webhook
#             return JsonResponse({'message': 'Webhook received and processed'}, status=200)
#         except json.JSONDecodeError:
#             # Handle JSON decoding error
#             return JsonResponse({'message': 'Invalid JSON payload'}, status=400)
#     else:
#         # Handle non-POST requests (e.g., GET)
#         return JsonResponse({'message': 'Invalid request method'}, status=405)



# import requests
# from urllib.parse import quote
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# import json
# import hashlib
# import hmac

# # ... (your existing imports)

# # Signature verification function
# import json
# import hashlib
# import hmac
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.views.decorators.http import require_POST
# from .models import agg_hhc_payment_details

# def vvverify_cashfree_signature(data, signature):
#     secret_key = "cfsk_ma_prod_172c08ceff37119b1cf5ff4fa593b4bd_a2adc215"  # Replace with your actual secret key
#     data_string = ""
#     for key, value in sorted(data.items()):
#         data_string += f"{key}={value}&"
#     data_string = data_string[:-1]  # Remove trailing '&'

#     # Generate the expected signature
#     expected_signature = hmac.new(
#         secret_key.encode(),
#         data_string.encode(),
#         hashlib.sha256
#     ).hexdigest()

#     # Compare the received signature with the expected signature
#     return hmac.compare_digest(expected_signature, signature)




# @api_view(['POST'])
# def payment_status_webhook(request):
#     data = request.data
#     signature = request.headers.get('X-Cashfree-Signature')

#     if not vvverify_cashfree_signature(data, signature):
#         return Response(status=400)  # Invalid signature

#     order_id = data['orderId']
#     payment_status = data['paymentStatus']
    

#     try:
#         payment_record = agg_hhc_payment_details.objects.get(order_id=order_id)
#         payment_record.transaction_status = payment_status
#         payment_record.save()
#         return Response(status=200)
#     except agg_hhc_payment_details.DoesNotExist:
#         return Response(status=404)  # Order not found

# @api_view(['GET'])
# def check_payment_status(request, order_id):
#     url = "https://api.cashfree.com/api/v1/order/status"
#     payload = {
#         "appId": "20453165a737ebd97e430fcabc135402",  # Replace with your app ID
#         "secretKey": "cfsk_ma_prod_172c08ceff37119b1cf5ff4fa593b4bd_a2adc215",  # Replace with your secret key
#         "orderId": order_id
#     }
#     response = requests.post(url, json=payload)

#     if response.status_code == 200:
#         data = response.json()
#         payment_status = data['paymentStatus']

#         try:
#             payment_record = agg_hhc_payment_details.objects.get(order_id=order_id)
#             payment_record.transaction_status = payment_status
#             payment_record.save()
#             return Response({'payment_status': payment_status})
#         except agg_hhc_payment_details.DoesNotExist:
#             return Response(status=404)  # Order not found
#     else:
#         return Response(status=500, data={'error': 'Failed to fetch payment status from Cashfree'})
    
    
import json
import base64
import hashlib
import hmac
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
# def generateSignature(timestamp, payload):
#     signatureData = timestamp + payload
#     message = bytes(signatureData, 'utf-8')
#     secret_key = bytes("cfsk_ma_prod_172c08ceff37119b1cf5ff4fa593b4bd_a2adc215", 'utf-8')  # Replace with your actual secret key from Cashfree Merchant Dashboard
#     signature = base64.b64encode(hmac.new(secret_key, message, digestmod=hashlib.sha256).digest())
#     computed_signature = str(signature, encoding='utf8')
#     return computed_signature

# @csrf_exempt
# @require_POST
# def update_transaction_status(request):
#     try:
#         # Load JSON content from the request body
#         request_data = json.loads(request.body)

#         # Extract order_id from the JSON content
#         order_id = request_data.get('data', {}).get('order', {}).get('order_id')

#         if order_id is None:
#             raise ValueError('Order ID not found in the request payload')

#         # Fetch the corresponding payment record based on the order_id
#         try:
#             payment_record = agg_hhc_payment_details.objects.get(order_id=order_id)
#         except agg_hhc_payment_details.DoesNotExist:
#             return JsonResponse({'error': 'Payment record not found for the given order_id'}, status=404)
        
#         status = request_data.get('data', {}).get('payment', {}).get('payment_status')
#         if not status:
#             raise ValueError('Status not found in the request payload')



#         # Save the entire request_data in the transaction_status field
#         transaction_status = payment_record.transaction_status or {}  # Initialize as an empty dictionary if None
#         transaction_status.update(request_data)
#         payment_record.transaction_status = transaction_status
#         payment_record.overall_status = status
#         payment_record.save()

#         return JsonResponse({'message': 'Transaction status updated successfully'}, status=200)

#     except ValueError as ve:
#         return JsonResponse({'error': str(ve), 'request_data': json.loads(request.body)}, status=400)
#     except Exception as e:
#         return JsonResponse({'error': str(e), 'request_data': json.loads(request.body)}, status=500)

@csrf_exempt
@require_POST
def update_transaction_status(request):
    try:
        # Load JSON content from the request body
        request_data = json.loads(request.body)

        # Extract order_id from the JSON content
        order_id = request_data.get('data', {}).get('order', {}).get('order_id')
        if order_id is None:
            raise ValueError('Order ID not found in the request payload')

        # Fetch the corresponding payment record based on the order_id
        try:
            payment_record = agg_hhc_payment_details.objects.get(order_id=order_id)
        except agg_hhc_payment_details.DoesNotExist:
            return JsonResponse({'error': 'Payment record not found for the given order_id'}, status=404)
        
        # Extract payment status
        payment_status = request_data.get('data', {}).get('payment', {}).get('payment_status')
        if not payment_status:
            raise ValueError('Payment status not found in the request payload')

        # Update transaction status and save to the database
        transaction_status = payment_record.transaction_status or {}
        transaction_status.update(request_data)
        payment_record.transaction_status = transaction_status
        payment_record.overall_status = payment_status  # Update overall status
        payment_record.save()

        return JsonResponse({'message': 'Transaction status updated successfully'}, status=200)

    except ValueError as ve:
        return JsonResponse({'error': str(ve), 'request_data': json.loads(request.body)}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e), 'request_data': json.loads(request.body)}, status=500)
    
# def verify_webhook_signature(request):
#     webhook_signature = request.headers.get('x-webhook-signature')
#     webhook_timestamp = request.headers.get('x-webhook-timestamp')
#     webhook_version = request.headers.get('x-webhook-version')
#     secret_key = "cfsk_ma_prod_172c08ceff37119b1cf5ff4fa593b4bd_a2adc215"  # Replace with your actual secret key

#     if not webhook_signature or not webhook_timestamp or not webhook_version:
#         raise ValueError('Webhook signature headers not provided')

#     # Reconstruct the expected signature
#     expected_signature = hmac.new(
#         key=bytes(secret_key, 'utf-8'),
#         msg=f'{webhook_timestamp}.{request.body.decode("utf-8")}'.encode('utf-8'),
#         digestmod=hashlib.sha256
#     ).hexdigest()

#     # Compare the expected signature with the received signature
#     if not hmac.compare_digest(expected_signature, webhook_signature):
#         raise ValueError('Invalid webhook signature')







#---------------------------------------------------------------------------------------------------------------
#---------------------------------------------------------------------------------------------------------------




#--------------------------------------Nikita P-----------------------------------------------

class GetDtlAvalView(APIView):
    def post(self, request, format=None):
        start_time = request.data['start_time']
        end_time = request.data['end_time']
        day = request.data['day']
        pro = request.data['prof']

        try:
            response_data_arr = []
            
            try:
                aval = agg_hhc_professional_availability.objects.get(srv_prof_id=pro, day=day)
                print("aval--", aval)
                print("day--", day)
                aval_id = aval.professional_avaibility_id
                aval_detls = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=aval_id, start_time=start_time, end_time=end_time)
            
                unique_date_obj = []

                if aval_detls:
                    unique_date_obj = []

                    for p in aval_detls:
                        st = p.start_time
                        et = p.end_time

                        if len(unique_date_obj) == 0:
                            stt = st
                            ett = et
                            unique_date_obj.append(p.prof_avaib_dt_id)
                        elif stt == st and ett == et:
                            pass
                        else:
                            stt = st
                            ett = et
                            unique_date_obj.append(p.prof_avaib_dt_id)
                            

                    aval_unique_detls = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_dt_id__in=list(unique_date_obj))


                    loc_arr = []
                    
                    for i in aval_detls:
                        try:
                            loc_name = i.prof_zone_id.Name
                            loc_data = {
                                "loc_zone_id" : i.prof_zone_id.prof_zone_id,
                                "loc_zone_name" : loc_name
                            }
                            loc_arr.append(loc_data)
                        except:
                            pass

                        try:
                            loc_name = i.prof_loc_zone_id.prof_loc_dtl_id.location_name
                            loc_data = {
                                "loc_id" : i.prof_loc_zone_id.prof_loc_dtl_id.prof_loc_id.prof_loc_id,
                                "loc_name" : loc_name
                            }
                            loc_arr.append(loc_data)
                        except:
                            pass
                    
                    if aval_detls:
                        
                        serializer = agg_hhc_professional_availability_detail_serializer123(aval_unique_detls, many=True)
                        
                        
                    
                    for i in serializer.data:

                        loc_arr_objs = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=i['prof_avaib_id'],start_time=i['start_time'],end_time=i['end_time'])

                        loc_obj_zone_nm_arr = []
                        loc_id_arr = []
                        zone_id_arr = []
                        for loc in loc_arr_objs:
                            try:
                                loc_id_arr.append(loc.prof_loc_zone_id.prof_loc_zone_id)
                                if loc.prof_loc_zone_id.prof_loc_dtl_id.location_name not in loc_obj_zone_nm_arr:
                                    loc_obj_zone_nm_arr.append(loc.prof_loc_zone_id.prof_loc_dtl_id.location_name)
                            except:
                                zone_id_arr.append(loc.prof_zone_id.prof_zone_id)
                                loc_obj_zone_nm_arr.append(loc.prof_zone_id.Name)

                        i["prof_loc_zone_name"] = loc_obj_zone_nm_arr
                        i["prof_loc_zone_id"] = loc_id_arr
                        i["prof_zone_id"] = zone_id_arr
                        

                    response_data_obj={
                        'Day': day,
                        'Res_Data': serializer.data
                    }
                    response_data_arr.append(response_data_obj)
                else:
                    response_data_obj={
                    'Day': day,
                    'Res_Data': {}
                    }
                    response_data_arr.append(response_data_obj)
            except:
                response_data_obj={
                    'Day': day,
                    'Res_Data': {}
                }
                response_data_arr.append(response_data_obj)
                print("in else loop")
                pass
            return Response(response_data_arr, status=status.HTTP_200_OK)
        except:
            return Response({'Res_Data':[]}, status=status.HTTP_200_OK)
        


class DelAvalView(APIView):
    def post(self, request, format=None):
        pro_detl_id_arr = request.data['pro_detl_id_arr']
        pro = request.GET.get('pro')

        try:
            if pro_detl_id_arr: # to delete all the records contaning different zone or locations for selected time slots
                print("pro_detl_id_arr--", pro_detl_id_arr)
                for dt in pro_detl_id_arr:
                    avaldetls = agg_hhc_professional_availability_detail.objects.get(prof_avaib_dt_id=dt)
                    print("avaldetals---", avaldetls)
                
                    aval_detls_max = agg_hhc_professional_availability_detail.objects.filter(start_time=avaldetls.start_time, end_time=avaldetls.end_time, prof_avaib_id=avaldetls.prof_avaib_id)
                    print("aval_detls_max--", aval_detls_max)

                    for aval_detls in aval_detls_max:
                        if aval_detls:
                            prof_avai_id = aval_detls.prof_avaib_id.professional_avaibility_id
                            aval = agg_hhc_professional_availability.objects.get(professional_avaibility_id=prof_avai_id)

                            avaldt = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=prof_avai_id)

                            aval_day = int(aval.day)

                            try:
                                detail_events = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__week_day=aval_day, start_time__gte=avaldt[0].start_time, end_time__lte=avaldt[0].end_time, srv_prof_id=pro, status=1 | Q(Session_status=1) | Q(Session_status=3) | Q(Session_status= 8))
                                
                                if detail_events:
                                    return Response({'Res_Data':{'msg':'Please contact with Healthcare Dispatcher regarding time updation or deletion.'}}, status=status.HTTP_200_OK)
                            except:
                                pass
                            

                        if aval_detls:
                            print("Finally")
                            aval_detls.delete()
                            # pass

            
            return Response({'Res_Data':{'msg':'Time slot deleted successfully.'}}, status=status.HTTP_200_OK)            
        except:
            return Response({'Res_Data':{'msg': 'Record not found'}}, status=status.HTTP_200_OK)

class AddAvalView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    # def get(self, request, format=None):
    #     try:
    #         day = request.GET.get('day')
            
    #         # pro = get_prof(request)[0]
    #         pro = request.GET.get('pro')
    #         aval_id_arr = []
    #         # print("pro, day--", pro, day)

    #         if day:
    #             aval = agg_hhc_professional_availability.objects.get(srv_prof_id=pro, day=day)
    #             aval_id = aval.professional_avaibility_id
    #             aval_detls = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=aval_id)
    #         else:
    #             aval = agg_hhc_professional_availability.objects.filter(srv_prof_id=pro)
    #             for i in aval:
    #                 aval_id = i.professional_avaibility_id
    #                 aval_id_arr.append(aval_id)
    #             # print("aval id arr-- ", aval_id_arr)
    #             aval_detls = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id__in=aval_id_arr)

    #         # print("aval-- ", aval)    


    #         # print("aval_detls--", aval_detls)

    #         unique_date_obj = []
    #         for p in aval_detls:
    #             st = p.start_time
    #             et = p.end_time

    #             if len(unique_date_obj) == 0:
    #                 stt = st
    #                 ett = et
    #                 unique_date_obj.append(p.prof_avaib_dt_id)
    #             elif stt == st and ett == et:
    #                 print("Common time slot objs ids---", p.prof_avaib_dt_id)
    #                 try:
    #                     print("Common time slot objs zone---", p.prof_zone_id)
    #                 except:
    #                     print("Common time slot objs zone---", p.prof_loc_zone_id)
    #             else:
    #                 stt = st
    #                 ett = et
    #                 unique_date_obj.append(p.prof_avaib_dt_id)

    #         aval_unique_detls = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_dt_id__in=list(unique_date_obj))

    #         # print("unique_date_obj--", unique_date_obj)
    #         # print("aval_unique_detls--", aval_unique_detls)

    #         loc_arr = []
    #         for i in aval_unique_detls:
    #             try:
    #                 loc_name = i.prof_zone_id.Name
    #                 loc_data = {
    #                     "loc_zone_id" : i.prof_zone_id.prof_zone_id,
    #                     "loc_zone_name" : loc_name
    #                 }
    #                 loc_arr.append(loc_data)
    #             except:
    #                 pass

    #             try:
    #                 loc_name = i.prof_loc_zone_id.prof_loc_dtl_id.location_name
    #                 loc_data = {
    #                     "loc_id" : i.prof_loc_zone_id.prof_loc_dtl_id.prof_loc_id.prof_loc_id,
    #                     "loc_name" : loc_name
    #                 }
    #                 loc_arr.append(loc_data)
    #             except:
    #                 pass


    #         if aval_unique_detls:
    #             serializer = agg_hhc_professional_availability_detail_serializer(aval_unique_detls, many=True)
                
    #             for j in loc_arr:
    #                 try:
    #                     for i in serializer.data:
    #                         i['prof_loc_zone_id'] = j['loc_zone_id']
    #                         i["prof_loc_zone_name"] = j['loc_zone_name']
    #                 except:
    #                     pass

    #                 try:
    #                     for i in serializer.data:
    #                         loc_id = j['loc_id']

    #                         loc_zone = agg_hhc_professional_locations_as_per_zones.objects.get(prof_loc_zone_id=i['prof_loc_zone_id'])

    #                         i['main_zone_name'] = loc_zone.prof_zone_id.Name
    #                         i['prof_loc_id'] = loc_id
    #                         i["prof_loc_name"] = j['loc_name']

    #                         # if loc_id == i['prof_loc_id']:
    #                         #     i["prof_loc_name"] = j['loc_name']
    #                 except:
    #                     pass

    #             response_data={
    #             'Res_Data': serializer.data
    #             }
    #             # print("final data--", response_data)
    #             return Response(response_data, status=status.HTTP_200_OK)
    #         return Response(serializer.errors, status=status.HTTP_200_OK)
    #     except:
    #         return Response({'Res_Data':[]}, status=status.HTTP_200_OK)


    def get(self, request, format=None):
        try:
            day_arr = ["0","1","2","3","4","5","6"]            
            pro = request.GET.get('pro')
            aval_id_arr = []
            response_data_arr = []


            
            for day in day_arr:
                try:
                # if day:
                    aval = agg_hhc_professional_availability.objects.get(srv_prof_id=pro, day=day)
                    print("aval--", aval)
                    print("day--", day)
                    aval_id = aval.professional_avaibility_id
                    aval_detls = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=aval_id)
                    print("aval_detlsggggggg--", aval_detls)
                # else:
                #     aval = agg_hhc_professional_availability.objects.filter(srv_prof_id=pro).order_by('day')
                #     for i in aval:
                #         print("day--", i.day)
                #         aval_id = i.professional_avaibility_id
                #         aval_id_arr.append(aval_id)
                #     aval_detls = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id__in=aval_id_arr)

                    if aval_detls:
                        unique_date_obj = []

                        for p in aval_detls:
                            st = p.start_time
                            et = p.end_time

                            if len(unique_date_obj) == 0:
                                stt = st
                                ett = et
                                unique_date_obj.append(p.prof_avaib_dt_id)
                            elif stt == st and ett == et:
                                pass
                            else:
                                stt = st
                                ett = et
                                unique_date_obj.append(p.prof_avaib_dt_id)
                                

                        aval_unique_detls = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_dt_id__in=list(unique_date_obj))

                        # print("unique_loc_name----", unique_loc_name)
                        # print("unique_date_loc_zon_obj----", unique_date_loc_zon_obj)

                        # print("unique_date_obj--", unique_date_obj)
                        # print("aval_unique_detls--", aval_unique_detls)

                        loc_arr = []
                        # for i in aval_unique_detls:
                        for i in aval_detls:
                            try:
                                loc_name = i.prof_zone_id.Name
                                loc_data = {
                                    "loc_zone_id" : i.prof_zone_id.prof_zone_id,
                                    "loc_zone_name" : loc_name
                                }
                                loc_arr.append(loc_data)
                            except:
                                pass

                            try:
                                loc_name = i.prof_loc_zone_id.prof_loc_dtl_id.location_name
                                loc_data = {
                                    "loc_id" : i.prof_loc_zone_id.prof_loc_dtl_id.prof_loc_id.prof_loc_id,
                                    "loc_name" : loc_name
                                }
                                loc_arr.append(loc_data)
                            except:
                                pass
                        # print("loc arr---", loc_arr)

                        # if aval_unique_detls:
                        if aval_detls:
                            # serializer = agg_hhc_professional_availability_detail_serializer123(aval_detls, many=True)

                            serializer = agg_hhc_professional_availability_detail_serializer123(aval_unique_detls, many=True)
                            
                            
                        
                        for i in serializer.data:
                            # print("serializer.data time", i['start_time'], i['end_time'])

                            loc_arr_objs = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=i['prof_avaib_id'],start_time=i['start_time'],end_time=i['end_time'])

                            # print("loc_arr_objs---", loc_arr_objs)
                            loc_obj_zone_nm_arr = []
                            loc_id_arr = []
                            zone_id_arr = []
                            for loc in loc_arr_objs:
                                try:
                                    # print(loc.prof_loc_zone_id.prof_loc_dtl_id.location_name)
                                    loc_id_arr.append(loc.prof_loc_zone_id.prof_loc_zone_id)
                                    if loc.prof_loc_zone_id.prof_loc_dtl_id.location_name not in loc_obj_zone_nm_arr:
                                        # loc_obj_zone_nm_arr.append(loc.prof_loc_zone_id.prof_loc_dtl_id.location_name)
                                        loc_obj_zone_nm_arr.append(loc.prof_loc_zone_id.prof_zone_id.Name)
                                except:
                                    # print(loc.prof_zone_id.Name)
                                    zone_id_arr.append(loc.prof_zone_id.prof_zone_id)
                                    loc_obj_zone_nm_arr.append(loc.prof_zone_id.Name)

                            i["prof_loc_zone_name"] = loc_obj_zone_nm_arr
                            i["prof_loc_zone_id"] = loc_id_arr
                            i["prof_zone_id"] = zone_id_arr
                            

                            # if i['prof_zone_id'] != None:
                            #     profzoneid = i['prof_zone_id']
                            #     profzoneobj = agg_hhc_professional_zone.objects.get(prof_zone_id = profzoneid)
                            #     # print("serializer i---", profzoneobj)
                            #     # i['prof_zone_id'] = profzoneobj.prof_zone_id
                            #     i["prof_loc_zone_name"] = profzoneobj.Name
                            #     # i['prof_loc_zone_id'] = profzoneobj.prof_zone_id
                            #     # i["prof_loc_zone_name"] = profzoneobj.Name
                            # else:
                            #     profloczoneid = i['prof_loc_zone_id']
                            #     profloczoneobj = agg_hhc_professional_locations_as_per_zones.objects.get(prof_loc_zone_id = profloczoneid)
                            #     # print("serializer j---", profloczoneobj)
                            #     # i['prof_loc_zone_id'] = profloczoneobj.prof_loc_dtl_id.prof_loc_id
                            #     i["prof_loc_zone_name"] = profloczoneobj.prof_loc_dtl_id.location_name
                            #     # i['prof_loc_zone_id'] = profloczoneobj.prof_loc_dtl_id.prof_loc_id
                            #     # i["prof_loc_zone_name"] = profloczoneobj.prof_loc_dtl_id.location_name

                        # print("serializer data---",serializer.data)

                            #     try:
                            #         for i in serializer.data:
                            #             # loc_id = j['loc_id']

                            #             # loc_zone = agg_hhc_professional_locations_as_per_zones.objects.get(prof_loc_zone_id=i['prof_loc_zone_id'])

                            #             # i['prof_loc_id'] = loc_id

                            #             # # i['main_zone_name'] = loc_zone.prof_zone_id.Name
                            #             # # i["prof_loc_name"] = j['loc_name']

                            #             # i['prof_zone_name'] = loc_zone.prof_zone_id.Name
                            #             # i["prof_loc_zone_name"] = j['loc_name']

                            #             # print("!!!!!!!!!!!!!!!!!!!!!!---", i['prof_zone_name'], i["prof_loc_zone_name"])

                            #             # # if loc_id == i['prof_loc_id']:
                            #             # #     i["prof_loc_name"] = j['loc_name']

                            #             i['prof_loc_zone_id'] = j['loc_id']
                            #             i["prof_loc_zone_name"] = j['loc_name']
                            #     except:
                            #         pass
                        # print("dddddddddaaaaaaaaaayyyyyyyyyy----", day)
                        response_data_obj={
                            'Day': day,
                            'Res_Data': serializer.data
                        }
                        # print("response_data_obj--", type(response_data_obj))
                        response_data_arr.append(response_data_obj)
                        # print("appending", response_data_arr)
                    else:
                        response_data_obj={
                        'Day': day,
                        'Res_Data': {}
                        }
                        # print("response_data_obj--", type(response_data_obj))
                        response_data_arr.append(response_data_obj)
                except:
                    response_data_obj={
                        'Day': day,
                        'Res_Data': {}
                    }
                    # print("response_data_obj--", type(response_data_obj))
                    response_data_arr.append(response_data_obj)
                    # print("in else loop")
                    pass
            # print("whats wrong")
            # print("response_data_arr---", response_data_arr)
            return Response(response_data_arr, status=status.HTTP_200_OK)
        # return Response(serializer.errors, status=status.HTTP_200_OK)
        except:
            return Response({'Res_Data':[]}, status=status.HTTP_200_OK)





    # def delete(self, request, format=None):
    #     pro_detl_id_arr = request.data['pro_detl_id_arr']
    #     pro = request.GET.get('pro')

    #     try:
    #         if pro_detl_id_arr: # to delete all the records contaning different zone or locations for selected time slots
    #             print("pro_detl_id_arr--", pro_detl_id_arr)
    #             for dt in pro_detl_id_arr:
    #                 avaldetls = agg_hhc_professional_availability_detail.objects.get(prof_avaib_dt_id=dt)
    #                 print("avaldetals---", avaldetls)
                
    #                 aval_detls_max = agg_hhc_professional_availability_detail.objects.filter(start_time=avaldetls.start_time, end_time=avaldetls.end_time, prof_avaib_id=avaldetls.prof_avaib_id)
    #                 print("aval_detls_max--", aval_detls_max)

    #                 for aval_detls in aval_detls_max:
    #                     if aval_detls:
    #                         prof_avai_id = aval_detls.prof_avaib_id.professional_avaibility_id
    #                         aval = agg_hhc_professional_availability.objects.get(professional_avaibility_id=prof_avai_id)

    #                         avaldt = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=prof_avai_id)

    #                         aval_day = int(aval.day)

    #                         try:
    #                             detail_events = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__week_day=aval_day, start_time__gte=avaldt[0].start_time, end_time__lte=avaldt[0].end_time, srv_prof_id=pro, status=1 | Q(Session_status=1) | Q(Session_status=3) | Q(Session_status= 8))
                                
    #                             if detail_events:
    #                                 return Response({'Res_Data':{'msg':'Please contact with Healthcare Dispatcher regarding time updation or deletion.'}}, status=status.HTTP_200_OK)
    #                         except:
    #                             pass
                            

    #                     if aval_detls:
    #                         print("Finally")
    #                         # aval_detls.delete()
    #                         # pass

            
    #         return Response({'Res_Data':{'msg':'Time slot deleted successfully.'}}, status=status.HTTP_200_OK)            
    #     except:
    #         return Response({'Res_Data':{'msg': 'Record not found'}}, status=status.HTTP_200_OK)

            
    def post(self, request, format=None):

        clgref_id = get_prof(request)[3]
        request.data['last_modified_by'] = clgref_id
        try:
            # dates = request.data['date']
            days = request.data['day']
            # prof = request.data['srv_prof_id']
            time_slots = request.data['time']
            # prof = get_prof(request)[0]
            prof = request.data['srv_prof_id']
            
            # prof = 155
            # request.data['srv_prof_id'] = prof
            print("days--", days)
            print("time_slots--", time_slots)
            print("prof--", prof)
            prof_loc_zone = None
            prof_zone_id = None

            try:
                prof_loc_zone = request.data['prof_loc_zone_id']
            except:
                pass
            try:
                prof_zone_id = request.data['prof_zone_id']
            except:
                pass

            for i in days:
                aval = 0
                try:
                    aval = agg_hhc_professional_availability.objects.get(srv_prof_id=prof, day=i)
                    print("aval prof- ", aval)
                except:
                    pass

                request.data['day'] = i
                
                if aval != 0:
                    aval_serializer = agg_hhc_prof_availability_serializer(aval, data=request.data)
                else:
                    aval_serializer = agg_hhc_prof_availability_serializer(data=request.data)
                
                # print("aval_serializer------", aval_serializer)
                if aval_serializer.is_valid(raise_exception=True):
                    if aval:
                        prof_aval_id = aval.professional_avaibility_id
                        aval_serializer.save()
                        # prof_aval_id = aval[0].professional_avaibility_id
                    else:
                        prof_aval = aval_serializer.save()
                        prof_aval_id = prof_aval.professional_avaibility_id

                    print("prof_aval_id---", prof_aval_id)
                    request.data['prof_avaib_id'] = prof_aval_id

                    for j in time_slots:

                        print("start --- end--- ", j[0], j[1])

                        try:
                            # prof_aval_dtl_exts = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=prof_aval_id, end_time__gte=j[0], start_time__lte=j[1])
                            prof_aval_dtl_exts = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=prof_aval_id, end_time__gt=j[0], start_time__lt=j[1])

                            if prof_aval_dtl_exts:
                            
                                response_data={
                                'Res_Data': {'msg':f'Professional availability already exists for {j[0]} to {j[1]} time slot.'}
                                }
                                return Response(response_data,status=status.HTTP_200_OK)
                            
                            else:
                                pass

                        except:
                            pass
                        


                        if prof_loc_zone != None:
                            
                            for loc_zone in prof_loc_zone:
                                request.data['start_time'] = j[0]
                                request.data['end_time'] = j[1]
                                request.data['prof_loc_zone_id'] = loc_zone
                                
                                prof_aval_detail_serializer = agg_hhc_professional_availability_detail_serializer(data=request.data)
                                print("prof_aval_detail_serializer---", prof_aval_detail_serializer)
                                if prof_aval_detail_serializer.is_valid(raise_exception=True):
                                    prof_aval_detail_serializer.save()

                        else:
                            for z_id in prof_zone_id:
                                request.data['start_time'] = j[0]
                                request.data['end_time'] = j[1]
                                request.data['prof_zone_id'] = z_id
                            
                                prof_aval_detail_serializer1 = agg_hhc_professional_availability_detail_serializer2(data=request.data)
                                if prof_aval_detail_serializer1.is_valid(raise_exception=True):
                                    prof_aval_detail_serializer1.save()

                            
            response_data={
            'Res_Data': {'msg':'Professional Availability Added Successfully'}
            }
            return Response(response_data,status=status.HTTP_201_CREATED)
            
        except:
            return Response({'Res_Data': {'msg':'Professional Availability Already Exist.'}}, status=status.HTTP_200_OK)
        

    def put(self, request, format=None):

        clgref_id = get_prof(request)[3]
        request.data['last_modified_by'] = clgref_id
        try:
            day = request.data['day']
            time_slots = request.data['time']
            prof = request.data['srv_prof_id']
            pro_detl_id = request.data['pro_detl_id']
            

            print("day--", day)
            print("time_slots--", time_slots)
            print("prof--", prof)
            print("pro_detl_id--", pro_detl_id)
            prof_loc_zone = None
            prof_zone_id = None

            if pro_detl_id: # to delete all the records contaning different zone or locations for selected time slots
                print("pro_detl_id--", pro_detl_id)
                avaldetls = agg_hhc_professional_availability_detail.objects.get(prof_avaib_dt_id=pro_detl_id)
                print("avaldetalsLLLLLLLLLLLL---", avaldetls.start_time, avaldetls.end_time)

                aval_detls_max = agg_hhc_professional_availability_detail.objects.filter(start_time=avaldetls.start_time, end_time=avaldetls.end_time, prof_avaib_id=avaldetls.prof_avaib_id)
                print("aval_detls_max--", aval_detls_max)

                for aval_detls in aval_detls_max:
                    if aval_detls:
                        prof_avai_id = aval_detls.prof_avaib_id.professional_avaibility_id
                        aval = agg_hhc_professional_availability.objects.get(professional_avaibility_id=prof_avai_id)

                        avaldt = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=prof_avai_id)

                        aval_day = int(aval.day)

                        try:
                            detail_events = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__week_day=aval_day, start_time__gte=avaldt[0].start_time, end_time__lte=avaldt[0].end_time, srv_prof_id=prof, status=1 | Q(Session_status=1) | Q(Session_status=3) | Q(Session_status= 8))
                            
                            if detail_events:
                                return Response({'Res_Data':{'msg':'Please contact with Healthcare Dispatcher regarding time updation or deletion.'}}, status=status.HTTP_200_OK)
                        except:
                            pass
                        

                    if aval_detls:
                        print("Finally")
                        aval_detls.delete()
                        # pass



            try:
                prof_loc_zone = request.data['prof_loc_zone_id']
            except:
                pass
            try:
                prof_zone_id = request.data['prof_zone_id']
            except:
                pass

            
            aval = 0
            try:
                aval = agg_hhc_professional_availability.objects.get(srv_prof_id=prof, day=day)
                print("aval prof- ", aval)
            except:
                pass

            
            if aval != 0:
                aval_serializer = agg_hhc_prof_availability_serializer(aval, data=request.data)
            else:
                aval_serializer = agg_hhc_prof_availability_serializer(data=request.data)
            
            # print("aval_serializer------", aval_serializer)
            if aval_serializer.is_valid(raise_exception=True):
                if aval:
                    prof_aval_id = aval.professional_avaibility_id
                    aval_serializer.save()
                    # prof_aval_id = aval[0].professional_avaibility_id
                else:
                    prof_aval = aval_serializer.save()
                    prof_aval_id = prof_aval.professional_avaibility_id

                print("prof_aval_id---", prof_aval_id)
                request.data['prof_avaib_id'] = prof_aval_id

                for j in time_slots:

                    print("start --- end--- ", j[0], j[1])

                    # There is no need to check if there is any same time slot is available or not as we are updating here

                    # try:
                    #     # prof_aval_dtl_exts = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=prof_aval_id, end_time__gte=j[0], start_time__lte=j[1])
                    #     prof_aval_dtl_exts = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=prof_aval_id, end_time__gt=j[0], start_time__lt=j[1])

                    #     if prof_aval_dtl_exts:
                        
                    #         response_data={
                    #         'Res_Data': {'msg':f'Professional availability already exists for {j[0]} to {j[1]} time slot.'}
                    #         }
                    #         return Response(response_data,status=status.HTTP_200_OK)
                        
                    #     else:
                    #         pass

                    # except:
                    #     pass
                    


                    if prof_loc_zone != None:
                        
                        for loc_zone in prof_loc_zone:
                            request.data['start_time'] = j[0]
                            request.data['end_time'] = j[1]
                            request.data['prof_loc_zone_id'] = loc_zone
                            
                            prof_aval_detail_serializer = agg_hhc_professional_availability_detail_serializer(data=request.data)
                            print("prof_aval_detail_serializer---", prof_aval_detail_serializer)
                            if prof_aval_detail_serializer.is_valid(raise_exception=True):
                                prof_aval_detail_serializer.save()

                    else:
                        for z_id in prof_zone_id:
                            request.data['start_time'] = j[0]
                            request.data['end_time'] = j[1]
                            request.data['prof_zone_id'] = z_id
                        
                            prof_aval_detail_serializer1 = agg_hhc_professional_availability_detail_serializer2(data=request.data)
                            if prof_aval_detail_serializer1.is_valid(raise_exception=True):
                                prof_aval_detail_serializer1.save()

                            
            response_data={
            'Res_Data': {'msg':'Professional Availability Added Successfully'}
            }
            return Response(response_data,status=status.HTTP_200_OK)
            
        except:
            return Response({'Res_Data': {'msg':'Professional Availability Already Exist.'}}, status=status.HTTP_200_OK)

         

class LocListView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        loc = request.GET.get('loc')
        try:
            locs = agg_hhc_professional_location_details.objects.filter(prof_loc_dt_id=loc)
            if locs:
                serializer = agg_hhc_professional_location_details_serializer(locs, many=True)
                response_data={
                'Res_data': serializer.data
                }
                return Response(response_data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_200_OK)
        except:
            return Response({'Res_data': []}, status=status.HTTP_200_OK)
        
class AvalZoneView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        # pro = get_prof(request)[0]
        pro = request.data['srv_prof_id']

        try:
            # locs = agg_hhc_professional_location.objects.filter(srv_prof_id=pro)
            # print(locs)

            zon_loc = agg_hhc_professional_locations_as_per_zones.objects.filter(srv_prof_id=pro)
            zon_loc_arr = []
            for zl in zon_loc:
                locdtid = zl.prof_loc_dtl_id
                zon_locid = agg_hhc_professional_locations_as_per_zones.objects.filter(prof_loc_dtl_id=locdtid)

                zh_arr = []
                for zh in zon_locid:
                    zh_arr.append(zh.prof_loc_zone_id)

                if len(zon_loc_arr) == 0:
                    locdtid2 = zl.prof_loc_dtl_id
                    zon_obj ={
                        "prof_loc_zone_id": zh_arr,
                        "prof_loc_id": zl.prof_loc_dtl_id.prof_loc_id.prof_loc_id,
                        "srv_prof_id": pro,
                        "location_name": zl.prof_loc_dtl_id.location_name,
                        "last_modified_by": zl.prof_loc_dtl_id.prof_loc_id.last_modified_by
                    }
                    zon_loc_arr.append(zon_obj)
                elif locdtid == locdtid2:
                    pass
                else:
                    locdtid2 = zl.prof_loc_dtl_id
                    zon_obj ={
                        "prof_loc_zone_id": zh_arr,
                        "prof_loc_id": zl.prof_loc_dtl_id.prof_loc_id.prof_loc_id,
                        "srv_prof_id": pro,
                        "location_name": zl.prof_loc_dtl_id.location_name,
                        "last_modified_by": zl.prof_loc_dtl_id.prof_loc_id.last_modified_by
                    }
                    zon_loc_arr.append(zon_obj)

            
            # if locs:
            #     serializer = agg_hhc_professional_location_serializer(locs, many=True)
                # for i in locs:
                #     loc_dtls = agg_hhc_professional_location_details.objects.filter(prof_loc_id = i.prof_loc_id)
                #     print("loc_dtls########## ",loc_dtls)
                # response_data={
                # 'Res_data': serializer.data
                # }
            response_data={
            'Res_data': zon_loc_arr
            }
            return Response(response_data, status=status.HTTP_200_OK)
            # return Response(serializer.errors, status=status.HTTP_200_OK)
        except:
            return Response({'Res_data': []}, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        print("in post req")
        clgref_id = get_prof(request)[3]
        print("clgref id--",clgref_id)
        request.data['last_modified_by'] = clgref_id

        # pro_id = request.data['srv_prof_id']
        pro_loc_name = request.data['location_name']
        # t_pro = get_prof(request)[0]
        # request.data['srv_prof_id'] = t_pro
        t_pro = request.data['srv_prof_id']
        print("TOKEN____t pro_______ ", t_pro)
        try:
            if t_pro:
                try:
                    rec = agg_hhc_professional_location.objects.filter(srv_prof_id=t_pro, location_name=pro_loc_name)
                    print("rec ", rec)
                except:
                    pass

                if rec:
                    response_data={
                    'Res_data': {'msg':'Professional Availability Zone Already Exists.'}
                    }
                    return Response(response_data, status=status.HTTP_200_OK)
                else:
                    print("request data-- ", request.data)
                    loc_serializer = agg_hhc_professional_location_serializer(data=request.data)
                    print("loc serializer--", loc_serializer)

                    if loc_serializer.is_valid(raise_exception=True):
                        print("serializer valid ")
                        lat_long = request.data['lat_long']
                        print("lat long-- ", lat_long[0][0])
                        # loc_serializer.save()
                        location = loc_serializer.save()

                        # print("location---------------loc-- ")
                        # prof_loc_id = 1
                        # pro_loc_name = "Dehu"
                        prof_loc_id = location.prof_loc_id
                        pro_loc_name = location.location_name
                        # lat_long = request.data['lat_long']
                        

                        inc = 0
                        for i in lat_long:
                            inc = inc+1
                            latitude = i[0]
                            longitude = i[1]
                            obj = {
                                "lattitude":latitude,
                                "longitude":longitude,
                                "prof_loc_id":prof_loc_id,
                                "location_name":pro_loc_name,
                                "last_modified_by":clgref_id
                            }
                            
                            loc_details_serializer = agg_hhc_professional_location_details_serializer(data=obj)
                            if loc_details_serializer.is_valid(raise_exception=True):
                                loc_dtl_obj = loc_details_serializer.save()
                            else:        
                                return Response({'Res_data': {'msg':'Something went wrong'}}, status=status.HTTP_200_OK)

                        # Add entries in "agg_hhc_professional_locations_as_per_zones" table as per zone in request data
                        loc_zon_arr = []
                        prof_loc_dtl_id = None
                        try:
                            prof_loc_dtl_id = loc_dtl_obj.prof_loc_dt_id
                        except:
                            pass
                        for zone in request.data['zones']:
                            
                            obj2 = {
                                'prof_loc_dtl_id': prof_loc_dtl_id, 
                                'prof_zone_id': zone, 
                                'srv_prof_id': t_pro,
                                "last_modified_by":clgref_id
                            }
                            
                            loc_zone_serializer = agg_hhc_professional_location_zones_serializer(data=obj2)
                            if loc_zone_serializer.is_valid(raise_exception=True):
                                loc_zon_obj = loc_zone_serializer.save()
                                loc_zon_arr.append(loc_zon_obj.prof_loc_zone_id)
                                
                            else:        
                                return Response({'Res_data': {'msg':'Something went wrong'}}, status=status.HTTP_200_OK)
                        
                        res_data = {'id':prof_loc_id, 'zone_name':pro_loc_name, 'main_zone_id':loc_zon_arr , 'msg':'Professional Availability Zone Added Successfully'}
                        
                        response_data={
                        'Res_data': res_data
                        }
                        
                        return Response(response_data,status=status.HTTP_200_OK)
                    else:        
                        return Response({'Res_data': {'msg':'Record not found'}}, status=status.HTTP_200_OK)
        except:
            return Response({'Res_data': {'msg':'Record not found'}}, status=status.HTTP_200_OK)




class sos_dtls_api(APIView): # List of SOS Details
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        try:
            sos_dtl =  sos_details.objects.filter(action_status=1, status=1).order_by('added_date')
            print("sos dtls--", sos_dtl)
            try:
                if sos_dtl:
                    serializer = agg_hhc_sos_dtl_serializer_get(sos_dtl, many=True)
                    j=0
                    for i in serializer.data:
                        prf_nm = agg_hhc_service_professionals.objects.get(srv_prof_id = serializer.data[j]['srv_prof_id'])
                        serializer.data[j]['srv_prof_id'] = prf_nm.prof_fullname
                        serializer.data[j]['srv_prof_con'] = prf_nm.phone_no
                        j = j + 1
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({'msg':'No Data Found'}, status=status.HTTP_200_OK)
            except:
                return Response({'msg':'No Data Found'}, status=status.HTTP_200_OK)
        except:
            return Response({'not found': 'Record not found'}, status=status.HTTP_200_OK)
        
    def put(self, request):
        clgref_id = get_prof(request)[3]
        request.data['last_modified_by'] = clgref_id

        sos_id = request.data['sos_id']
        sosdetls = sos_details.objects.get(sos_id = sos_id)
        print("sos details-- ", sosdetls)
        
        serializer =  hd_remark_sos_dtls_serializer(sosdetls, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class agg_hhc_zone_api(APIView): # List of Zones
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, pk, format=None):
        try:
            groups =  agg_hhc_professional_zone.objects.filter(city_id=pk).order_by('Name')
            if groups:
                serializer = agg_hhc_professional_zone_serializer(groups, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({'msg':'No Data Found'}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'not found': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)


class agg_hhc_all_zone_api(APIView): # List of Zones
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            groups =  agg_hhc_professional_zone.objects.all().order_by('Name')
            if groups:
                serializer = agg_hhc_professional_zone_serializer(groups, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({'msg':'No Data Found'}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'not found': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)


class agg_hhc_sub_srv(APIView): # List of Sub-Services
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        try: 
            sub_srvs =  agg_hhc_sub_services.objects.all()
            if sub_srvs:
                serializer = agg_hhc_sub_services_serializer(sub_srvs, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({'msg':'No Data Found'}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'not found': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)
        
class agg_hhc_sub_srv_jc_form_num(APIView): # List of Sub-Services
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        try: 
            sub_srv = request.GET.get('sub_srv')
            sub_srvs =  agg_hhc_jobclosure_form_numbering.objects.get(prof_sub_srv_id=sub_srv)
            if sub_srvs:
                serializer = agg_hhc_sub_services_jc_form_serializer(sub_srvs)
                response_data={
                'record': serializer.data,
                'success' : 'True'
                }
                return Response(response_data, status=status.HTTP_200_OK)
            response_data={
            'record': None,
            'success' : 'False',
            'msg':'No Data Found.'
            }
            return Response(response_data , status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({
            'record': None,
            'success' : 'False',
            'msg':'No Data Found'
            } , status=status.HTTP_404_NOT_FOUND)

class agg_hhc_session_job_closure(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    # def post(self, request):
    #     print("Here not working")
    #     print("detail envent",request.GET.get('dtl_eve'))
    #     dtl_eve = request.GET.get('dtl_eve')
    #     form_num = request.data['form_number']
    #     for i in range(20):
    #         print(i)
    #     is_exist_jc_dtl_eve = 0
    #     try:
    #         is_exist_jc_dtl_eve = agg_hhc_jobclosure_detail.objects.get(dtl_eve_id=dtl_eve, status=1)
    #         print("is_exist_jc_dtl_eve", is_exist_jc_dtl_eve)
    #         if is_exist_jc_dtl_eve is not 0:
    #             is_exist_jc_dtl_eve.status = 2
    #             is_exist_jc_dtl_eve.save()
    #     except:
    #         pass

    #     prof_sub_srv = agg_hhc_detailed_event_plan_of_care.objects.get(agg_sp_dt_eve_poc_id=dtl_eve)
    #     clgref_id = get_prof(request)[3]
    #     # pro = get_prof(request)[0]

    #     # print("pro-- ", pro)
    #     print("clgref_id-- ", clgref_id)
    #     request.data['srv_prof_id'] = prof_sub_srv.srv_prof_id.srv_prof_id
    #     request.data['last_modified_by'] = clgref_id
    #     # request.data['last_modified_by'] = 1
    #     print('clgref_id---', type(clgref_id))
    #     print("Type od clgref_id", type(clgref_id))
    #     request.data['dtl_eve_id'] = int(dtl_eve)
    #     request.data['prof_sub_srv_id'] = prof_sub_srv.eve_poc_id.sub_srv_id.sub_srv_id
    #     print("request data-- ", request.data)
    #     try:
    #         if form_num == 1:
    #             print("1")
    #             serializer =  agg_hhc_session_job_closure_serializer_form_1(data=request.data)
    #         elif form_num == 2:
    #             print("2")
    #             serializer =  agg_hhc_session_job_closure_serializer_form_2(data=request.data)
    #         elif form_num == 3:
    #             print("3")
    #             serializer =  agg_hhc_session_job_closure_serializer_form_3(data=request.data)
    #         elif form_num == 4:
    #             print("4")
    #             serializer =  agg_hhc_session_job_closure_serializer_form_4(data=request.data)
    #         elif form_num == 5:
    #             print("5")
    #             serializer =  agg_hhc_session_job_closure_serializer_form_5(data=request.data)
    #         elif form_num == 6:
    #             print("6")
    #             serializer =  agg_hhc_session_job_closure_serializer_form_6(data=request.data)
    #         elif form_num == 7:
    #             print("7")
    #             serializer =  agg_hhc_session_job_closure_serializer_form_7(data=request.data)
    #         elif form_num == 8:
    #             print("8")
    #             serializer =  agg_hhc_session_job_closure_serializer_form_8(data=request.data)
    #         elif form_num == 9:
    #             print("9")
    #             serializer =  agg_hhc_session_job_closure_serializer_form_9(data=request.data)
    #         elif form_num == 10:
    #             print("10")
    #             serializer =  agg_hhc_session_job_closure_serializer_form_10(data=request.data)

    #         print("serializer-- ")
    #         # print("serializer-- ", serializer.data)
    #         print("dtl_eve--", dtl_eve)
    #         dtl_eves = agg_hhc_detailed_event_plan_of_care.objects.get(agg_sp_dt_eve_poc_id=dtl_eve,status=1)
    #         print("dtl_eves--", dtl_eves)
    #         dtl_eves.Session_jobclosure_status = 1
    #         dtl_eves.Session_status = 9
    #         try:
    #             dtl_eves.prof_session_start_date = request.data['prof_st_dt']
    #             dtl_eves.prof_session_end_date = request.data['prof_ed_dt']
    #             dtl_eves.prof_session_start_time = request.data['prof_st_time']
    #             dtl_eves.prof_session_end_time = request.data['prof_ed_time']
    #         except:
    #             pass
    #         dtl_eves.save()

    #         all_detail_event_plan=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=dtl_eves.eve_id,status=1).count()
    #         print("all detail event plan--count ",all_detail_event_plan)
    #         detail_event=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=dtl_eves.eve_id,status=1,Session_jobclosure_status=1).count()
    #         print("detail_event-- count",detail_event)
            
    #         if (all_detail_event_plan==detail_event):
    #             event_plan_care=agg_hhc_event_plan_of_care.objects.get(eve_id=dtl_eves.eve_id)
    #             print("event plan care-- " )
    #             event_plan_care.service_status=4
    #             event_plan_care.save()
    #             print("event plan care-- ")
    #             print("dtl_eves.eve_id-- ",dtl_eves.eve_id.eve_id)
    #             event=agg_hhc_events.objects.get(eve_id=dtl_eves.eve_id.eve_id)
    #             print("event-- ")           
    #             event.event_status=3
    #             event.save()
    #             print("out")
    #         try:
    #             if serializer.is_valid():
    #                 # print("in seriii", serializer.data)
    #                 print("out")
    #                 serializer.save()
    #                 response_data={
    #                 'record': serializer.data,
    #                 'success' : 'True'
    #                 }
    #                 print("serializer-- ", serializer.data)
    #                 return Response(response_data, status=status.HTTP_201_CREATED)
    #                 # return Response({'msg':"done"}, status=status.HTTP_201_CREATED)
    #         except Exception as e:
    #             return Response({"error":str(e)})
    #         response_data={
    #         'record': None,
    #         'success' : 'False',
    #         'msg':'No Data Found.'
    #         }
    #         return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
    #     except:
    #         return Response({
    #         'record': None,
    #         'success' : 'False',
    #         'msg':'No Data Found'
    #         }, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        dtl_eve = request.GET.get('dtl_eve')
        form_num = request.data.get('form_number')

        try:
            try:
                is_exist_jc_dtl_eve = agg_hhc_jobclosure_detail.objects.get(dtl_eve_id=dtl_eve, status=1)
                is_exist_jc_dtl_eve.status = 2
                is_exist_jc_dtl_eve.save()
            except agg_hhc_jobclosure_detail.DoesNotExist:
                is_exist_jc_dtl_eve = None

            prof_sub_srv = agg_hhc_detailed_event_plan_of_care.objects.get(agg_sp_dt_eve_poc_id=dtl_eve)
            clgref_id = get_prof(request)[3]
            
            request.data['srv_prof_id'] = prof_sub_srv.srv_prof_id.srv_prof_id
            request.data['last_modified_by'] = clgref_id
            request.data['dtl_eve_id'] = int(dtl_eve)
            request.data['prof_sub_srv_id'] = prof_sub_srv.eve_poc_id.sub_srv_id.sub_srv_id

            try:
                dtl_eves = agg_hhc_detailed_event_plan_of_care.objects.get(agg_sp_dt_eve_poc_id=dtl_eve, status=1)
                dtl_eves.prof_session_start_date = request.data.get('prof_st_dt')
                dtl_eves.prof_session_end_date = request.data.get('prof_ed_dt')
                dtl_eves.prof_session_start_time = request.data.get('prof_st_time')
                dtl_eves.prof_session_end_time = request.data.get('prof_ed_time')
                dtl_eves.Session_jobclosure_status = 1
                dtl_eves.Session_status = 9
                dtl_eves.save()
            except agg_hhc_detailed_event_plan_of_care.DoesNotExist:
                pass     
            for key, value in request.data.items():
                if isinstance(value, str) and value.strip() == '':
                    request.data[key] = None 
            serializer = None
            serializer_class = globals().get(f'agg_hhc_session_job_closure_serializer_form_{form_num}', None)
            if serializer_class:
                serializer = serializer_class(data=request.data)
                   
            if serializer is not None:
                if serializer.is_valid():
                    serializer.save()
                    response_data = {
                        'record': serializer.data,
                        'success': 'True'
                    }
                    return Response(response_data, status=status.HTTP_201_CREATED)
                else:
                    response_data = {
                        'record': None,
                        'success': 'False',
                        'msg': 'Invalid data.',
                        'errors': serializer.errors
                    }
                    return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

            response_data = {
                'record': None,
                'success': 'False',
                'msg': 'No serializer matched the form number.'
            }
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                'record': None,
                'success': 'False',
                'msg': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class agg_hhc_service_professional_loc_dtl(APIView): # List of professionals availability location dtls
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        pro = request.GET.get('pro')
        # print("pro..",pro)
        loc_dtl_arr = []
        try:
            loc = agg_hhc_professional_location.objects.filter(srv_prof_id=pro)
            # print("loc--", loc)
            # prof_avail_dtl_arr = []

            for lc in loc:
                # print("lc--",lc)
                try:
                    loc_dtls = agg_hhc_professional_location_details.objects.filter(prof_loc_id=lc.prof_loc_id)
                    loc_latlong_arr = []
                    
                    for locdtl in loc_dtls:
                        lat_long_obj = {
                            "prof_loc_dt_id" : locdtl.prof_loc_dt_id,
                            "latitude" : locdtl.lattitude,
                            "longitude" : locdtl.longitude
                        }
                        loc_latlong_arr.append(lat_long_obj)
                        prof_avail_dtl_arr = []
                        # Find prof location in which zone appears
                        try:
                            loc_as_per_zone = agg_hhc_professional_locations_as_per_zones.objects.filter(prof_loc_dtl_id= locdtl.prof_loc_dt_id)
                            print("loc_as_per_zone-----------locdtl.prof_loc_dt_id-----",loc_as_per_zone,locdtl.prof_loc_dt_id)
                            loc_as_per_zone_arr = []
                            
                            for loc_pr in loc_as_per_zone:
                                # loc_pr_obj = {
                                #     # "prof_loc_zone_id" : loc_pr.prof_loc_zone_id,
                                #     "prof_main_zone_name" : loc_pr.prof_zone_id.Name
                                # }
                                loc_as_per_zone_arr.append(loc_pr.prof_zone_id.Name)
                                print("loc_pr.prof_loc_zone_id----",loc_pr.prof_loc_zone_id)
                                try:
                                    prof_avail_dtls = agg_hhc_professional_availability_detail.objects.filter(prof_loc_zone_id=loc_pr.prof_loc_zone_id)
                                    print("prof_avail_dtls---",prof_avail_dtls)
                                    if len(prof_avail_dtls) != 0:
                                        for avdtl in prof_avail_dtls:
                                            # print("avdtl333-----",avdtl.prof_avaib_id.professional_avaibility_id)
                                            day_dtl = agg_hhc_professional_availability.objects.get(professional_avaibility_id=avdtl.prof_avaib_id.professional_avaibility_id)
                                            # print("avdtl.start_time--",type(avdtl.start_time))

                                            day = day_dtl.day
                                            # print("day--", day)
                                            avdtl_obj = {
                                                "day": day,
                                                "start_time" : (avdtl.start_time).strftime("%H:%M:%S"),
                                                "end_time" : (avdtl.end_time).strftime("%H:%M:%S")
                                            }
                                            prof_avail_dtl_arr.append(avdtl_obj)
                                            print("prof_avail_dtl_arr-----",prof_avail_dtl_arr)
                                    else:
                                        print("is zero")
                                except:
                                    continue
                        except:
                            pass
                    # print("prof_avail_dtl_arr2-----",prof_avail_dtl_arr)
                    loc_dtl_obj = {
                        "prof_loc_lat_long" : loc_latlong_arr,
                        "prof_loc_name_as_per_zone" : loc_as_per_zone_arr,
                        "prof_avail_dtl_arr" : prof_avail_dtl_arr
                    }
                    loc_dtl_arr.append(loc_dtl_obj)
                except:
                    pass

            # print("loc_dtl_obj--", loc_dtl_obj)
            # return Response({"msg" : "hii"} , status=status.HTTP_200_OK)
            return Response(loc_dtl_arr , status=status.HTTP_200_OK)
        except:
            return Response({'not found':'Record not found'}, status=status.HTTP_200_OK)






class agg_hhc_service_professional_list_api(APIView): # List of professionals
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        zones = request.GET.get('zone')
        title = request.GET.get('title')
        pro = request.GET.get('pro')
        srv_id = request.GET.get('srv')
        eve_poc_id = request.GET.get('eve_poc_id')
        try:
            if zones:
                zones_name = agg_hhc_professional_zone.objects.get(prof_zone_id=zones)
        
            if eve_poc_id and zones:
                # print("Inside eve_poc_id and zone block", eve_poc_id, zones)
                zones_nm = agg_hhc_professional_zone.objects.get(prof_zone_id=zones)
                sub_srv_nm = agg_hhc_event_plan_of_care.objects.get(eve_poc_id=eve_poc_id)
                # print("serv nm--", sub_srv_nm.srv_id.service_title)
                # print("zone nm--", zones_nm.Name)

                # This below code is to get list of professional id's based on location zone table
                # zone_profs_list = agg_hhc_professional_location.objects.filter(Q(location_name__icontains= zones_nm.Name) | Q(location_name = 'All')) #this query to fetch related zone name not exactly same
                zone_profs_list = agg_hhc_professional_location.objects.filter(Q(location_name = zones_nm.Name) | Q(location_name = 'All'))
                zone_prof = []
                # print("Zone professionals list33%-- ", zone_profs_list)
                for i in zone_profs_list:
                    # print("Zone professionals list 1st-- ", i.location_name)
                    # print("Zone professionals -- ", i.srv_prof_id)
                    # print("Zone service id-- ", sub_srv_nm.srv_id)
                    try:
                        # print("In try block")
                        zone = agg_hhc_service_professionals.objects.get(Q(srv_prof_id=i.srv_prof_id.srv_prof_id), prof_registered=True, prof_interviewed=True, prof_doc_verified=True, professinal_status=4, status=1, srv_id=sub_srv_nm.srv_id)
                        # print("didnt work")
                    except:
                        pass
                    # print("Out try block")
                    try:
                        if zone.srv_prof_id in zone_prof:
                            # print("This item already exists in list.")
                            pass
                        else:
                            # print("in zone prof--", zone.srv_prof_id)
                            # print("in zone prof--", zone.srv_id)
                            zone_prof.append(zone.srv_prof_id)
                    except:
                        pass
                # print("Zone of profs with zone and all type--", zone_prof)
                if len(zone_prof) == 0:
                    return Response({'Not found': 'Professionals for this service is not available for now.'}, status=status.HTTP_200_OK)

                all_dates = []
                st_times = []
                ed_times = []
                
                dtl_evts = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_poc_id=eve_poc_id)
                for evt in dtl_evts:
                    # print("dtl event-- ", evt.eve_id)
                    all_dates.append(evt.actual_StartDate_Time)
                    st_times.append(evt.start_time)
                    ed_times.append(evt.end_time)

                busy_profs = []
                aval_zone_prof = []
                sort_profs = []
                # print("all_dates--", all_dates)
                # print("st_times--", st_times)
                # print("ed_times--", ed_times)
                i = -1
                bus_prof = 0
                for d in all_dates:
                    i = i + 1
                    try:
                        busy_prof = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(actual_StartDate_Time=all_dates[i]), Q(start_time__gte = st_times[i]), Q(end_time__lte = ed_times[i]))
                        # print("busy_prof--",bus_profs)
                        bus_prof = 1
                        bp = busy_prof[0].srv_prof_id.srv_prof_id
                        busy_profs.append(bp)
                    except:
                        pass

                
                # sorted_profs = agg_hhc_service_professionals.objects.filter(Q(srv_prof_id__in=list(busy_profs))| Q(prof_zone_id=zones_nm), prof_registered=1, prof_interviewed=1, prof_doc_verified=1)
                if bus_prof == 0:
                    # print("In busy prof block")
                    sorted_profs = agg_hhc_service_professionals.objects.filter(prof_registered=True, prof_interviewed=True, prof_doc_verified=True, srv_id=sub_srv_nm.srv_id).order_by("prof_fullname")
                else:
                    # print("In else busy prof block")
                    sorted_profs = agg_hhc_service_professionals.objects.filter(srv_prof_id__in=list(busy_profs), prof_registered=True, prof_interviewed=True, prof_doc_verified=True, srv_id=sub_srv_nm.srv_id).order_by("prof_fullname")

                # print('In sorted#$#$#$')
                # print('In sorted#$#$#$', sorted_profs)
                
                for i in sorted_profs:
                    sort_profs.append(i.srv_prof_id)
                # print("Sorted busy professionals-- ", sort_profs)

                aval_profs = agg_hhc_service_professionals.objects.exclude(Q(srv_prof_id__in=list(sort_profs)) | Q(prof_registered=False) | Q(prof_interviewed=False) | Q(prof_doc_verified=False)| Q(status=2)| ~Q(professinal_status=4))

                for i in aval_profs:
                    aval_zone_prof.append(i.srv_prof_id)
                # print("AVAL ZONee-- ", aval_zone_prof)

                common_elements = [value for value in aval_zone_prof if value in zone_prof]
                # print("Common elements--- ",common_elements)

                not_common_elements = [value for value in aval_zone_prof + zone_prof if value not in aval_zone_prof or value not in zone_prof]
                # print("Not Common elements--- ",not_common_elements)


                

                zone_pr = agg_hhc_service_professionals.objects.filter(srv_prof_id__in=list(common_elements)).order_by("prof_fullname")
                # print("ZONEEEE-- ", zone_pr)

                zone_nt_pr = agg_hhc_service_professionals.objects.filter(~Q(srv_prof_id__in=list(zone_prof))).order_by("prof_fullname")
                # print("NOTTT ZONEE-- ", zone_nt_pr)


                bus_profs = agg_hhc_service_professionals.objects.filter(srv_prof_id__in=list(sort_profs))
                # print("BUSY Prof-- ", bus_profs)

                # prof_list = list(chain(zone_pr, zone_nt_pr, bus_profs))
                prof_list = list(chain(zone_pr, bus_profs))
                zone = prof_list
                # zone = zone_pr
                # print("Final List----------  ", zone)

            elif zones and title:
                # print("Inside zones and title if statement---")
                zones_nm = agg_hhc_professional_zone.objects.get(prof_zone_id=zones)
                # print("zone id-- ", zones)
                # print("zone name-- ", zones_nm.Name)
                zone_profs_list = agg_hhc_professional_location.objects.filter(Q(location_name__icontains= zones_nm.Name) | Q(location_name = 'All'))

                # print("Zone professionals list-- ", zone_profs_list)
                zone_prof = []
                for i in zone_profs_list:
                    # print("prof-- ", i.srv_prof_id.srv_prof_id)

                    # zone = agg_hhc_service_professionals.objects.get(Q(srv_prof_id=i.srv_prof_id.srv_prof_id) | Q(title=title) | Q(srv_id=sub_srv), prof_registered=True, prof_interviewed=True, prof_doc_verified=True, professinal_status=4, status=1)

                    zone = agg_hhc_service_professionals.objects.get(srv_prof_id=i.srv_prof_id.srv_prof_id, prof_registered=1, prof_interviewed=1, prof_doc_verified=1, professinal_status=4, status=1)

                    # print("zonnne ", zone)

                    if zone.srv_prof_id in zone_prof:
                        # print("This item already exists in list.")
                        pass
                    else:
                        zone_prof.append(zone.srv_prof_id)
                # print("Name of profs--", zone_prof)
                zone = agg_hhc_service_professionals.objects.filter(srv_prof_id__in=list(zone_prof), prof_registered=True, prof_interviewed=True, prof_doc_verified=True).order_by("prof_fullname")
                # print("List of zone profs--", zone)

            elif pro:
                # print("Inside pro")
                zone = agg_hhc_service_professionals.objects.filter(srv_prof_id=pro, prof_registered=True, prof_interviewed=True, prof_doc_verified=True, professinal_status=4, status=1).order_by("prof_fullname")

            elif zones and srv_id:
                # print("Inside srv_id and zone block")
                srv_obj = agg_hhc_services.objects.get(srv_id=srv_id)
                # print("Srv!@!@!@!--", srv_obj)
                zones_nm = agg_hhc_professional_zone.objects.get(prof_zone_id=zones)

                zone_profs_list = agg_hhc_professional_location.objects.filter(Q(location_name = zones_nm.Name) | Q(location_name = 'All'))
                zone_prof = []
                # print("Zone professionals list33%-- ", zone_profs_list)
                for i in zone_profs_list:
                    # print("Zone professionals list 1st-- ", i.location_name)
                    # print("service id-- ", srv_id)
                    # print("prof id-- ", i.srv_prof_id.srv_prof_id)

                    try:
                        zone = agg_hhc_service_professionals.objects.get(srv_prof_id=i.srv_prof_id.srv_prof_id, prof_registered=True, prof_interviewed=True, prof_doc_verified=True, professinal_status=4, status=1, srv_id=srv_obj)
                        # zone = agg_hhc_service_professionals.objects.get(Q(srv_prof_id=i.srv_prof_id.srv_prof_id), prof_registered=True, prof_interviewed=True, prof_doc_verified=True, professinal_status=4, status=1, srv_id=srv_obj)
                        # print("zone!@!@!@!--", zone)
                    except:
                        pass
                    try:
                        if zone in zone_prof:
                            # print("This item already exists in list.")
                            pass
                        else:
                            # print("in zone prof--", zone.srv_prof_id)
                            zone_prof.append(zone)
                            # zone_prof.append(zone.srv_prof_id)
                    except:
                        pass
                zone = zone_prof
                # print("Zone of profs with zone and all type--", zone_prof)
                if len(zone_prof) == 0:
                    return Response({'Not found': 'Professionals for this service is not available for now.'}, status=status.HTTP_200_OK)

                aval_zone_prof = []

            else:
                print("Inside else block")
                zone = agg_hhc_service_professionals.objects.filter(prof_registered=True, prof_interviewed=True, prof_doc_verified=True, professinal_status=4, status=1).order_by("prof_fullname")
                
            if zone:
                # print("All filtered prof--%-- ", zone)
                # for j in zone:
                #     print("j value", j.srv_prof_id)
                #     try:
                #         loc_nm = agg_hhc_professional_location.objects.filter(srv_prof_id = j['srv_prof_id'])
                #         zone_list_arr = []
                #         for pkb in loc_nm:
                #             print("pkb-- ", pkb.location_name)
                #             zone_list_arr.append(pkb.location_name)
                #         print("zone_list_arr-------+++++++++________--", zone_list_arr)
                #         # j.prof_zone_id = zone_list_arr
                #         # j.prof_zone_id = loc_nm.location_name
                #         print("locnm - ", j.prof_zone_id)
                #     except:
                #         pass

                serializer = agg_hhc_service_professional_serializer(zone, many=True)
                # print("serializer data--", serializer)
                for j in serializer.data:
                    try:
                        loc_nm = agg_hhc_professional_location.objects.filter(Q(location_name = zones_name.Name) | Q(location_name = 'All'), srv_prof_id = j['srv_prof_id'])
                        if loc_nm:
                            # print("loc nm-", loc_nm)
                            zone_list_arr = []
                            for pkb in loc_nm:
                                # print("pkb-- ", pkb.location_name)
                                zone_list_arr.append(pkb.location_name)
                            # print("zone_list_arr-------+++++++++________--", zone_list_arr)
                            j['prof_zone_id'] = zone_list_arr
                            # j.prof_zone_id = loc_nm.location_name
                            # print("locnm - ", j['prof_zone_id'])
                        else:
                            # print("Serializer data--",serializer.data)
                            pass
                    except:
                        pass
                print("here")
                return Response(serializer.data , status=status.HTTP_200_OK)
            return Response({'msg':'No Data Found'}, status=status.HTTP_200_OK)
        except:
            return Response({'not found': 'Record not found'}, status=status.HTTP_200_OK)
        

# Function to get busy or leave days of professional
class agg_hhc_busy_days_of_profs_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    # def post(self, request, format=None):
    #     pro = request.GET.get('pro')
    #     eve_poc_id = request.GET.get('eve_poc_id')
    #     all_days = []
    #     all_days1 = []
    #     Unavailable_days = []

    #     eve_poc_obj = agg_hhc_event_plan_of_care.objects.get(eve_poc_id=eve_poc_id)

    #     # date_range = pd.date_range(start=eve_poc_obj.start_date, end=eve_poc_obj.end_date)
    #     # date_list = date_range.strftime('%Y-%m-%d').tolist() 

    #     date_list = request.data['data'] 

    #     datetime_obj_e = datetime.combine(datetime.today(), eve_poc_obj.end_time)
    #     end_time_added_15 =  datetime_obj_e + timedelta(minutes=15)

    #     datetime_obj_s = datetime.combine(datetime.today(), eve_poc_obj.start_time)
    #     start_time_added_15 =  datetime_obj_s - timedelta(minutes=15)

    #     # print("start_date--", eve_poc_obj.start_date)
    #     # print("end_date--", eve_poc_obj.end_date)
    #     # print("start_time--", eve_poc_obj.start_time)
    #     # print("end_time--", eve_poc_obj.end_time)
    #     # print("start_time_added_15--", start_time_added_15)
    #     # print("end_time_added_15--", end_time_added_15)

    #     extra_added_dates = []
    #     extra_weeknm = []
    #     prof_leaves_arr = []
    #     ed_time_f = None
    #     st_time_s = None
        
    #     # extra_added_dates.append(date_list[0])
    #     for dt in date_list:
    #         if eve_poc_obj.start_time >= eve_poc_obj.end_time:

    #             # st_time_f = eve_poc_obj.start_time
    #             ed_time_f = "23:59:00"
    #             st_time_s = "00:00:00"
    #             # ed_time_s = eve_poc_obj.end_time
                
    #             dt_obj = datetime.strptime(dt, "%Y-%m-%d")
    #             dt_next_day = dt_obj + timedelta(days=1)
    #             extra_weeknm.append(dt_obj.weekday())
    #             extra_weeknm.append(dt_next_day.weekday())
                
    #             if dt in extra_added_dates:
    #                 pass
    #             else:
    #                 extra_added_dates.append(dt)

    #             if dt_next_day in extra_added_dates:
    #                 pass
    #             else:
    #                 extra_added_dates.append(dt_next_day.strftime("%Y-%m-%d"))

    #         else:
    #             dt_obj = datetime.strptime(dt, "%Y-%m-%d")
    #             extra_weeknm.append(dt_obj.weekday())
    #             if dt in extra_added_dates:
    #                 pass
    #             else:
    #                 extra_added_dates.append(dt)

            
    #         try:
    #             prof_leaves = agg_hhc_attendance.objects.get(Q(Professional_iid=pro, attnd_date=dt, status=1), ~Q(attnd_status="Present"))
    #             print("prof leaves-++++++++++++++++++++++-", prof_leaves)
    #             prof_leaves_arr.append(prof_leaves)
    #         except:
    #             Unavailable_days.append(dt)

    #     Leave_days = []
    #     Leave_days1 = []

    #     try:
    #         for lv in prof_leaves_arr:
    #             if lv in Leave_days:
    #                 pass
    #             else:
    #                 Leave_days.append(str(lv.attnd_date.date()))
    #             all_days.append(str(lv.attnd_date.date()))
    #     except:
    #         pass


    #     # Half day leave handling----------------------started-------------------------------
        
    #     allowed_attn_sts2 = ["First Half", "Second Half"]
    #     prof_H_leaves = agg_hhc_attendance.objects.filter(Q(Professional_iid=pro, attnd_date__range=(eve_poc_obj.start_date, eve_poc_obj.end_date), status=1, attnd_status__in=allowed_attn_sts2))
    #     print("Prof half day leavehhhhhhhh--------------", prof_H_leaves)

    #     try:
    #         for lv in prof_H_leaves:
    #             print("in hlf for lv.from_avail", lv.from_avail)
    #             print("in hlf for lv.to_avail", lv.to_avail)
    #             print("in hlf for eve_poc_obj.start_time", eve_poc_obj.start_time)
    #             print("in hlf for eve_poc_obj.end_time", eve_poc_obj.end_time)
    #             if lv.from_avail <= eve_poc_obj.start_time and lv.to_avail >= eve_poc_obj.end_time:
    #                 print("In if continue")
    #                 Leave_days.remove(str(lv.attnd_date.date()))
    #                 print("after removing---", Leave_days)
    #             else:
    #                 print("else")
    #                 Leave_days1.append(str(lv.attnd_date.date()))
    #                 all_days1.append(str(lv.attnd_date.date()))
    #     except:
    #         pass

    #     # -----------------------ended---------------------------- 



        

    #     session_st = ['2','6','9']

    #     Busy_days = []
    #     for dt in date_list:
    #         dtl_eve_objs_busy_intime1 = None
    #         dtl_eve_objs_busy_intime2 = None
    #         # dtl_eve_objs_busy_intime1 = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(actual_StartDate_Time=dt, srv_prof_id=pro, status=1, end_time__gte = start_time_added_15.time(), start_time__lte = end_time_added_15.time()), ~Q(Session_status__in=session_st)).order_by('actual_StartDate_Time')

    #         dt_obj = datetime.strptime(dt, "%Y-%m-%d")
    #         dt_prev = (dt_obj - timedelta(days=1)).strftime("%Y-%m-%d")
    #         dt_next = (dt_obj + timedelta(days=1)).strftime("%Y-%m-%d")

    #         if eve_poc_obj.start_time >= eve_poc_obj.end_time:
    #             dtl_eve_objs_busy_intime1 = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(actual_StartDate_Time=dt), Q(srv_prof_id=pro, status=1, end_time__gte = start_time_added_15.time(), start_time__lte = end_time_added_15.time()), ~Q(Session_status__in=session_st)).order_by('actual_StartDate_Time')

    #             # dtl_eve_objs_busy_intime2 = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(actual_StartDate_Time=dt_prev), Q(srv_prof_id=pro, status=1, end_time__gte = start_time_added_15.time(), start_time__lte = end_time_added_15.time()), ~Q(Session_status__in=session_st)).order_by('actual_StartDate_Time')

    #             dtl_eve_objs_busy_intime2 = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(actual_StartDate_Time=dt_prev), Q(srv_prof_id=pro, status=1), Q(end_time__lte = start_time_added_15.time()), ~Q(Session_status__in=session_st)).order_by('actual_StartDate_Time')

    #         else:
    #             dtl_eve_objs_busy_intime1 = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(actual_StartDate_Time=dt), Q(srv_prof_id=pro, status=1, end_time__gte = start_time_added_15.time(), start_time__lte = end_time_added_15.time()), ~Q(Session_status__in=session_st)).order_by('actual_StartDate_Time')

    #             # dtl_eve_objs_busy_intime2 = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(actual_StartDate_Time=dt_next), Q(srv_prof_id=pro, status=1, end_time__gte = start_time_added_15.time(), start_time__lte = end_time_added_15.time()), ~Q(Session_status__in=session_st)).order_by('actual_StartDate_Time')
    #             # if end_time_added_15.time() > "23:59:00":
    #             #     dtl_eve_objs_busy_intime2 = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(actual_StartDate_Time=dt_next), Q(srv_prof_id=pro, status=1, start_time__gte = end_time_added_15.time()), ~Q(Session_status__in=session_st)).order_by('actual_StartDate_Time')


    #         if dtl_eve_objs_busy_intime2 != None:
    #             Busy_days.append(dt)
    #             all_days.append(dt)
    #             # for i in dtl_eve_objs_busy_intime1:
    #             #     # dt_obj = {
    #             #     #     'date': str(i.actual_StartDate_Time),
    #             #     #     # 'start_time': str(i.start_time),
    #             #     #     # 'end_time': str(i.end_time)
    #             #     # }
    #             #     Busy_days.append(str(i.actual_StartDate_Time))
    #             #     all_days.append(str(i.actual_StartDate_Time))


    #     print("busy days--", Busy_days)

    #     # Avble_days = []
    #     # avls_day_obj = agg_hhc_professional_availability.objects.filter(srv_prof_id=pro)
    #     # for i in avls_day_obj:
    #     #     # avls_in_day = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=i.professional_avaibility_id, start_time__gte = "18:30:00", end_time__lte = "18:30:00")
    #     #     avls_in_day = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=i.professional_avaibility_id, start_time__gte = str(eve_poc_obj.start_time), end_time__lte = str(eve_poc_obj.end_time))

    #     Avble_days = []
    #     for wk in extra_weeknm:
    #         avls_day_obj = agg_hhc_professional_availability.objects.filter(srv_prof_id=pro,day=wk)
    #         for i in avls_day_obj:
    #             # avls_in_day = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=i.professional_avaibility_id, start_time__gte = "18:30:00", end_time__lte = "18:30:00")
    #             if eve_poc_obj.start_time >= eve_poc_obj.end_time: 
    #                 avls_in_day = agg_hhc_professional_availability_detail.objects.filter(Q(prof_avaib_id=i.professional_avaibility_id), Q(start_time__gte = str(eve_poc_obj.start_time), end_time__lte = ed_time_f) | Q(start_time__gte = st_time_s, end_time__lte = ed_time_f))
    #             else:
    #                 avls_in_day = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=i.professional_avaibility_id, start_time__gte = str(eve_poc_obj.start_time), end_time__lte = str(eve_poc_obj.end_time))


    #             unique_time = []
    #             for p in avls_in_day:
    #                 st = p.start_time
    #                 et = p.end_time

    #                 if len(unique_time) == 0:
    #                     stt = st
    #                     ett = et
    #                     obj = {
    #                         "start_time":str(p.start_time),
    #                         "end_time":str(p.end_time)
    #                     }
    #                     unique_time.append(obj)
    #                 elif stt == st and ett == et:
    #                     pass
    #                 else:
    #                     stt = st
    #                     ett = et
    #                     obj = {
    #                         "start_time":str(p.start_time),
    #                         "end_time":str(p.end_time)
    #                     }
    #                     unique_time.append(obj)
    #             # day_obj = {
    #             #     "day" : i.day,
    #             #     "time_slots" : unique_time
    #             # }
    #             # Avble_days.append(day_obj)
    #             Avble_days.append(i.day)
        
            

    #     free_dates = []
    #     for i in date_list:
    #         if i in Busy_days:
    #             pass
    #         elif i in Leave_days:
    #             pass
    #         elif i in Unavailable_days:
    #             pass
    #         else:
    #             free_dates.append(i)

    #     free_days = []
    #     for i in free_dates:
    #         date_object = datetime.strptime(i, '%Y-%m-%d')
    #         # Get the weekday as an integer (Monday=0, Sunday=6)
    #         wk_nm = date_object.weekday()
    #         if wk_nm in Avble_days:
    #             free_days.append(i)
    #             all_days.append(i)
    #         else:
    #             pass

    #     # all_days = []
    #     # all_days.append(Leave_days)
    #     # all_days.append(Busy_days)
    #     # all_days.append(free_days)

        
    #     # for i in date_list:
    #     #     if i in all_days:
    #     #         pass
    #     #     elif i in Unavailable_days:
    #     #         pass
    #     #     else:
    #     #         Unavailable_days.append(i)

    #     print("Leave_days - ", Leave_days)
    #     # print("all days - ", all_days)
    #     # print("available days - ", free_days)
    #     # print("busy days - ", Busy_days)
    #     # print("Unavailable days - ", Unavailable_days)

    #     data = {
    #         'leave_days':Leave_days,
    #         'busy_days':Busy_days,
    #         # 'available_days':Avble_days
    #         'available_days':free_days,
    #         'unavailable_days': Unavailable_days
    #     }
    #     return Response({'Data':data}, status=status.HTTP_200_OK)

    

    def post(self, request, format=None):
        pro = request.GET.get('pro')
        eve_poc_id = request.GET.get('eve_poc_id')
        all_days = []
        Unavailable_days = []
        free_dates = []

        eve_poc_obj = agg_hhc_event_plan_of_care.objects.get(eve_poc_id=eve_poc_id)

        # date_range = pd.date_range(start=eve_poc_obj.start_date, end=eve_poc_obj.end_date)
        # date_list = date_range.strftime('%Y-%m-%d').tolist() 
        # print("start_date--", eve_poc_obj.start_date)
        # print("end_date--", eve_poc_obj.end_date)
        print("start_time--", eve_poc_obj.start_time)
        print("end_time--", eve_poc_obj.end_time)
        # print("start_time_added_15--", start_time_added_15)
        # print("end_time_added_15--", end_time_added_15)


        date_list = request.data['data'] 

        datetime_obj_e = datetime.combine(datetime.today(), eve_poc_obj.end_time)
        end_time_added_15 =  datetime_obj_e + timedelta(minutes=15)

        datetime_obj_s = datetime.combine(datetime.today(), eve_poc_obj.start_time)
        start_time_added_15 =  datetime_obj_s - timedelta(minutes=15)

        extra_added_dates = []
        extra_weeknm = []
        prof_leaves_arr = []
        ed_time_f = None
        st_time_s = None
        avls_in_day111 = None
        avls_in_day112 = None
        
        print("date_list-------------", date_list)
        for dt in date_list:
            print("dt--", dt)
            if eve_poc_obj.start_time >= eve_poc_obj.end_time:
                print("start time is greater than end time")

                # st_time_f = eve_poc_obj.start_time
                ed_time_f = "23:59:00"
                st_time_s = "00:00:00"
                st_time_s_obj = datetime.strptime(st_time_s, "%H:%M:%S").time()
                ed_time_f_obj = datetime.strptime(ed_time_f, "%H:%M:%S").time()
                # ed_time_s = eve_poc_obj.end_time
                
                dt_obj = datetime.strptime(dt, "%Y-%m-%d")
                dt_next_day = dt_obj + timedelta(days=1)
                print("Day--",dt_obj.weekday())
                print("Tommorow--",dt_next_day.weekday())


                try:
                    avls_day_obj1 = agg_hhc_professional_availability.objects.get(srv_prof_id=pro,day=dt_obj.weekday())
                except:
                    pass
                if eve_poc_obj.start_time >= eve_poc_obj.end_time: 
                    try:
                        # avls_in_day111 = agg_hhc_professional_availability_detail.objects.filter(Q(prof_avaib_id=avls_day_obj1.professional_avaibility_id), Q(start_time__gte = str(eve_poc_obj.start_time), end_time__lte = ed_time_f))
                        avls_in_day111 = agg_hhc_professional_availability_detail.objects.filter(Q(prof_avaib_id=avls_day_obj1.professional_avaibility_id), Q(start_time__lte = str(eve_poc_obj.start_time), end_time__gte = ed_time_f))
                    except:
                        pass
                    

                    # Checking the next day availability for remaining time from 00:00:00
                    try:
                        avls_day_obj12 = agg_hhc_professional_availability.objects.get(srv_prof_id=pro,day=dt_next_day.weekday())
                        if eve_poc_obj.start_time >= eve_poc_obj.end_time: 
                            # avls_in_day112 = agg_hhc_professional_availability_detail.objects.filter(Q(prof_avaib_id=avls_day_obj12.professional_avaibility_id), Q(start_time__gte = st_time_s, end_time__lte = eve_poc_obj.end_time))
                            avls_in_day112 = agg_hhc_professional_availability_detail.objects.filter(Q(prof_avaib_id=avls_day_obj12.professional_avaibility_id), Q(start_time__lte = st_time_s, end_time__gte = eve_poc_obj.end_time))
                    except:
                        pass

                else:
                    # avls_in_day111 = agg_hhc_professional_availability_detail.objects.filter(Q(prof_avaib_id=avls_day_obj1.professional_avaibility_id), Q(start_time__gte = str(eve_poc_obj.start_time), end_time__lte = eve_poc_obj.end_time))
                    try:
                        avls_in_day111 = agg_hhc_professional_availability_detail.objects.filter(Q(prof_avaib_id=avls_day_obj1.professional_avaibility_id), Q(start_time__lte = str(eve_poc_obj.start_time), end_time__gte = eve_poc_obj.end_time))
                    except:
                        pass


                print("avls_in_day111_________________-----",avls_in_day111)
                print("avls_in_day112_________________-----",avls_in_day112)

                try:
                    print('trying_____________')
                    # print('len(avls_in_day111)_____________',len(avls_in_day111))
                    print('avls_in_day111_____________',avls_in_day111)
                    print('avls_in_day112_____________',avls_in_day112)
                    # print('len(avls_in_day112)_____________',len(avls_in_day112))
                    # if len(avls_in_day111) == 0 and avls_in_day111 == None:
                    if avls_in_day111 == None or len(avls_in_day111) == 0:
                        print("11111111")
                        Unavailable_days.append(dt)
                    # elif len(avls_in_day111) != 0 and avls_in_day112 == None and len(avls_in_day112) == 0:
                    elif (avls_in_day111 != None or len(avls_in_day111) == 0) and (len(avls_in_day112) == 0 or avls_in_day112 == None):
                        print("222222222")
                        Unavailable_days.append(dt)
                    else:
                        print("33333333")
                        free_dates.append(dt)

                    print("free_dates-________-----____--",free_dates)
                    print("Unavailable_days-________-----____--",Unavailable_days)

                except:
                    pass





                extra_weeknm.append(dt_obj.weekday())
                extra_weeknm.append(dt_next_day.weekday())
                
                if dt in extra_added_dates:
                    pass
                else:
                    extra_added_dates.append(dt)

                if dt_next_day in extra_added_dates:
                    pass
                else:
                    extra_added_dates.append(dt_next_day.strftime("%Y-%m-%d"))

            else:
                # dt_obj = datetime.strptime(dt, "%Y-%m-%d")
                # extra_weeknm.append(dt_obj.weekday())
                # if dt in extra_added_dates:
                #     pass
                # else:
                #     extra_added_dates.append(dt)


                # Else block...

                print("end time is greater than start time")
                
                dt_obj = datetime.strptime(dt, "%Y-%m-%d")
                print("Day--",dt_obj.weekday())
                print("pro--",pro)
                try:
                    avls_day_obj1 = None
                    avls_in_day111 = None
                    try:
                        avls_day_obj1 = agg_hhc_professional_availability.objects.get(srv_prof_id=pro,day=dt_obj.weekday())
                    except:
                        pass
                    print("avls_day_obj1_________________-----",type(avls_day_obj1))
                    
                    try:
                        avls_in_day111 = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=avls_day_obj1.professional_avaibility_id, start_time__lte = eve_poc_obj.start_time.strftime("%H:%M:%S"), end_time__gte = eve_poc_obj.end_time.strftime("%H:%M:%S"))
                    except:
                        pass


                    # print("avls_day_obj1_________________-----",avls_day_obj1.professional_avaibility_id)
                    # print("avls_in_day111_________________-----",avls_in_day111)
                    print("type(avls_in_day111)_________________-----",type(avls_in_day111))


                    # if len(avls_in_day111) == 0 or avls_day_obj1 == None or avls_in_day111 == None:
                    if avls_day_obj1 == None or avls_in_day111 == None:
                        print("everything is null")
                        Unavailable_days.append(dt)
                    else:
                        free_dates.append(dt)

                    print("free_dates-________-----____--",free_dates)
                    print("Unavailable_days-________-----____--",Unavailable_days)





                    extra_weeknm.append(dt_obj.weekday())
                    # extra_weeknm.append(dt_next_day.weekday())
                    
                    if dt in extra_added_dates:
                        pass
                    else:
                        extra_added_dates.append(dt)

                    # if dt_next_day in extra_added_dates:
                    #     pass
                    # else:
                    #     extra_added_dates.append(dt_next_day.strftime("%Y-%m-%d"))

                except:
                    pass




            # try:
            #     prof_not_avail = agg_hhc_attendance.objects.get(Professional_iid=pro, attnd_date=dt, status=1)
            # except:
            #     Unavailable_days.append(dt)
            #     print("prof unavailable days in attendance-++++++++++++++++++++++-", Unavailable_days)
            
            try:
                prof_leaves = agg_hhc_attendance.objects.get(Q(Professional_iid=pro, attnd_date=dt, status=1), ~Q(attnd_status="Present"))
                print("prof leaves-++++++++++++++++++++++-", prof_leaves)
                prof_leaves_arr.append(dt)
            except:
                # free_dates.append(dt)
                pass

            # try:
            #     prof_attend = agg_hhc_attendance.objects.get(Q(Professional_iid=pro, attnd_date=dt, status=1,attnd_status="Present"))
            #     print("prof attendance-++++++++++++++++++++++-", prof_attend)
            #     free_dates.append(dt)
            # except:
            #     pass

        Leave_days = []
        Leave_days1 = []

        try:
            for lv in prof_leaves_arr:
                if lv in Leave_days:
                    pass
                else:
                #     Leave_days.append(str(lv.attnd_date.date()))
                # all_days.append(str(lv.attnd_date.date()))
                    Leave_days.append(lv)
                all_days.append(lv)
        except:
            pass


        # Half day leave handling----------------------started-------------------------------
        
        allowed_attn_sts2 = ["First Half", "Second Half"]
        prof_H_leaves = agg_hhc_attendance.objects.filter(Q(Professional_iid=pro, attnd_date__range=(eve_poc_obj.start_date, eve_poc_obj.end_date), status=1, attnd_status__in=allowed_attn_sts2))
        print("Prof half day leavehhhhhhhh--------------", prof_H_leaves)

        try:
            for lv in prof_H_leaves:
                print("lvvvvvvv------",lv.attnd_date.date())
                
                if eve_poc_obj.start_time >= eve_poc_obj.end_time:
                    
                    if lv.from_avail <= eve_poc_obj.start_time and lv.to_avail >= ed_time_f_obj:
                        print("In if continue")

                        lv_obj1d = datetime.strptime(str(lv.attnd_date.date()), "%Y-%m-%d")
                        lv_next_day1d = lv_obj1d + timedelta(days=1)
                        print("lv_obj1d---", lv_obj1d)
                        print("lv_next_day1d---", lv_next_day1d)
                        try:
                            prof_HF_leaves = agg_hhc_attendance.objects.get(Q(Professional_iid=pro, attnd_date=lv_next_day1d, status=1,attnd_status__in=allowed_attn_sts2))

                            print("HHHHHHLLLLLLLLFFFFFF=___________", prof_HF_leaves)
                            if prof_HF_leaves.from_avail <= st_time_s_obj and prof_HF_leaves.to_avail >= eve_poc_obj.end_time:
                                print("availability is checked for next day")
                                Leave_days.remove(str(lv.attnd_date.date()))
                                if lv.attnd_date.date() is not free_dates:
                                    free_dates.append(str(lv.attnd_date.date()))
                        except:
                            pass
     

                elif lv.from_avail <= eve_poc_obj.start_time and lv.to_avail >= eve_poc_obj.end_time: 
                    print("In else continue")
                    Leave_days.remove(str(lv.attnd_date.date()))
                    free_dates.append(str(lv.attnd_date.date()))

    
        except:
            pass

        # -----------------------ended---------------------------- 



        

        session_st = ['2','6','9']

        Busy_days = []
        for dt in date_list:
            dtl_eve_objs_busy_intime1 = None
            dtl_eve_objs_busy_intime2 = None
            # dtl_eve_objs_busy_intime1 = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(actual_StartDate_Time=dt, srv_prof_id=pro, status=1, end_time__gte = start_time_added_15.time(), start_time__lte = end_time_added_15.time()), ~Q(Session_status__in=session_st)).order_by('actual_StartDate_Time')

            dt_obj = datetime.strptime(dt, "%Y-%m-%d")
            dt_prev = (dt_obj - timedelta(days=1)).strftime("%Y-%m-%d")
            dt_next = (dt_obj + timedelta(days=1)).strftime("%Y-%m-%d")

            if eve_poc_obj.start_time >= eve_poc_obj.end_time:
                dtl_eve_objs_busy_intime1 = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(actual_StartDate_Time=dt), Q(srv_prof_id=pro, status=1, end_time__gte = start_time_added_15.time(), start_time__lte = end_time_added_15.time()), ~Q(Session_status__in=session_st)).order_by('actual_StartDate_Time')
                # print("dtl_eve_objs_busy_intime111-------------", dtl_eve_objs_busy_intime1)

                # dtl_eve_objs_busy_intime2 = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(actual_StartDate_Time=dt_prev), Q(srv_prof_id=pro, status=1, end_time__gte = start_time_added_15.time(), start_time__lte = end_time_added_15.time()), ~Q(Session_status__in=session_st)).order_by('actual_StartDate_Time')

                dtl_eve_objs_busy_intime2 = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(actual_StartDate_Time=dt_prev), Q(srv_prof_id=pro, status=1), Q(end_time__lte = start_time_added_15.time()), ~Q(Session_status__in=session_st)).order_by('actual_StartDate_Time')
                # print("dtl_eve_objs_busy_intime112-------------", dtl_eve_objs_busy_intime2)

            else:
                dtl_eve_objs_busy_intime1 = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(actual_StartDate_Time=dt), Q(srv_prof_id=pro, status=1, end_time__gte = start_time_added_15.time(), start_time__lte = end_time_added_15.time()), ~Q(Session_status__in=session_st)).order_by('actual_StartDate_Time')
                # print("dtl_eve_objs_busy_intime221-------------", dtl_eve_objs_busy_intime1)

                # dtl_eve_objs_busy_intime2 = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(actual_StartDate_Time=dt_next), Q(srv_prof_id=pro, status=1, end_time__gte = start_time_added_15.time(), start_time__lte = end_time_added_15.time()), ~Q(Session_status__in=session_st)).order_by('actual_StartDate_Time')
                # if end_time_added_15.time() > "23:59:00":
                #     dtl_eve_objs_busy_intime2 = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(actual_StartDate_Time=dt_next), Q(srv_prof_id=pro, status=1, start_time__gte = end_time_added_15.time()), ~Q(Session_status__in=session_st)).order_by('actual_StartDate_Time')


            if len(dtl_eve_objs_busy_intime1) != 0 and dtl_eve_objs_busy_intime1 != None:
                Busy_days.append(dt)
                all_days.append(dt)
                # for i in dtl_eve_objs_busy_intime1:
                #     # dt_obj = {
                #     #     'date': str(i.actual_StartDate_Time),
                #     #     # 'start_time': str(i.start_time),
                #     #     # 'end_time': str(i.end_time)
                #     # }
                #     Busy_days.append(str(i.actual_StartDate_Time))
                #     all_days.append(str(i.actual_StartDate_Time))

            # if len(dtl_eve_objs_busy_intime2) != 0 and dtl_eve_objs_busy_intime2 != None:
            #     Busy_days.append(dt)
            #     all_days.append(dt)
                # for i in dtl_eve_objs_busy_intime1:
                #     # dt_obj = {
                #     #     'date': str(i.actual_StartDate_Time),
                #     #     # 'start_time': str(i.start_time),
                #     #     # 'end_time': str(i.end_time)
                #     # }
                #     Busy_days.append(str(i.actual_StartDate_Time))
                #     all_days.append(str(i.actual_StartDate_Time))


        print("busy days--", Busy_days)

        # Avble_days = []
        # avls_day_obj = agg_hhc_professional_availability.objects.filter(srv_prof_id=pro)
        # for i in avls_day_obj:
        #     # avls_in_day = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=i.professional_avaibility_id, start_time__gte = "18:30:00", end_time__lte = "18:30:00")
        #     avls_in_day = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=i.professional_avaibility_id, start_time__gte = str(eve_poc_obj.start_time), end_time__lte = str(eve_poc_obj.end_time))


        print("Week day names----*****_____----", extra_weeknm)
        
        Avble_days = []
        for wk in extra_weeknm:
            avls_day_obj = agg_hhc_professional_availability.objects.filter(srv_prof_id=pro,day=wk)
            for i in avls_day_obj:
                # avls_in_day = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=i.professional_avaibility_id, start_time__gte = "18:30:00", end_time__lte = "18:30:00")
                if eve_poc_obj.start_time >= eve_poc_obj.end_time: 
                    avls_in_day = agg_hhc_professional_availability_detail.objects.filter(Q(prof_avaib_id=i.professional_avaibility_id), Q(start_time__gte = str(eve_poc_obj.start_time), end_time__lte = ed_time_f) | Q(start_time__gte = st_time_s, end_time__lte = ed_time_f))
                else:
                    avls_in_day = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=i.professional_avaibility_id, start_time__gte = str(eve_poc_obj.start_time), end_time__lte = str(eve_poc_obj.end_time))


                unique_time = []
                for p in avls_in_day:
                    st = p.start_time
                    et = p.end_time

                    if len(unique_time) == 0:
                        stt = st
                        ett = et
                        obj = {
                            "start_time":str(p.start_time),
                            "end_time":str(p.end_time)
                        }
                        unique_time.append(obj)
                    elif stt == st and ett == et:
                        pass
                    else:
                        stt = st
                        ett = et
                        obj = {
                            "start_time":str(p.start_time),
                            "end_time":str(p.end_time)
                        }
                        unique_time.append(obj)
                # day_obj = {
                #     "day" : i.day,
                #     "time_slots" : unique_time
                # }
                # Avble_days.append(day_obj)
                Avble_days.append(i.day)
        

        
        free_days = []
        for i in free_dates:
            date_object = datetime.strptime(i, '%Y-%m-%d')
            # Get the weekday as an integer (Monday=0, Sunday=6)
            wk_nm = date_object.weekday()
            if wk_nm in Avble_days:
                free_days.append(i)
                all_days.append(i)
        

        print("Leave_days - ", Leave_days)
        # print("all days - ", all_days)
        print("available days - ", free_days)
        print("busy days - ", Busy_days)
        print("Unavailable days - ", Unavailable_days)

        data = {
            'leave_days':Leave_days,
            'busy_days':Busy_days,
            # 'available_days':Avble_days
            'available_days':free_days,
            'unavailable_days': Unavailable_days
        }
        return Response({'Data':data}, status=status.HTTP_200_OK)


class new_api(APIView):
    def get(self,request,eve_poc_id):
        eve_p= eve_poc_id
        eve_poc_obj = agg_hhc_event_plan_of_care.objects.filter(eve_poc_id=eve_p,status=1).first()
        print("find out event ")
        detail_eve_plan_c=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_poc_id=eve_p,status=1,actual_StartDate_Time=eve_poc_obj.start_date).first()
        # time_gap=detail_eve_plan_c.start_time-detail_eve_plan_c.end_time

        # start_time_dt = datetime.combine(datetime.min, detail_eve_plan_c.start_time)
        time_list=['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24']
        start_time_dt = datetime.combine(detail_eve_plan_c.actual_StartDate_Time,detail_eve_plan_c.start_time)
        for i in time_list:
            print(i)
        end_time_dt =2
        time_gap =abs(start_time_dt-end_time_dt )
        print("total time gap is",time_gap)
        convert_date_time_pair = datetime.combine(detail_eve_plan_c.actual_StartDate_Time,detail_eve_plan_c.start_time)
        print("old date time ",convert_date_time_pair)
        ouput_date_time=convert_date_time_pair+time_gap
        print("new date time is ",ouput_date_time)
        return Response({'Data':'Hello'}, status=status.HTTP_200_OK)

# Function to filter professionals with multiple zones
class agg_hhc_service_professional_list_api(APIView): # List of professionals
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        zones = request.GET.get('zone')
        title = request.GET.get('title')
        pro = request.GET.get('pro')
        srv_id = request.GET.get('srv')
        eve_poc_id = request.GET.get('eve_poc_id')
        pro_name = request.GET.get('prof_name')
        home_loc = request.GET.get('home_loc')
        print("pro_name..",pro_name)

        try:
            zone = agg_hhc_service_professionals.objects.filter(prof_registered=True, prof_interviewed=True, prof_doc_verified=True, professinal_status=4, status=1).order_by("prof_fullname")


            if zones:
                zones_name = agg_hhc_professional_zone.objects.get(prof_zone_id=zones)

            if pro_name:
                print("Inside pro name")
                zone = agg_hhc_service_professionals.objects.filter(prof_fullname__icontains = pro_name).order_by('prof_fullname')

            if srv_id:
                print("Inside srv id")
                srv_obj = agg_hhc_services.objects.get(srv_id=srv_id)
                zone = agg_hhc_service_professionals.objects.filter(srv_id=srv_obj.service_title).order_by('prof_fullname')


            if pro_name and srv_id:
                print("Inside pro_name and srv id")
                srv_obj = agg_hhc_services.objects.get(srv_id=srv_id)
                zone = agg_hhc_service_professionals.objects.filter(prof_fullname__icontains = pro_name, srv_id=srv_obj.service_title).order_by('prof_fullname')
                
            if eve_poc_id and zones:
                print("Inside eve_poc_id and zone block", eve_poc_id, zones)
                zones_nm = agg_hhc_professional_zone.objects.get(prof_zone_id=zones)
                sub_srv_nm = agg_hhc_event_plan_of_care.objects.get(eve_poc_id=eve_poc_id)
                print("serv nm--", sub_srv_nm.srv_id.service_title)
                print("zone nm--", zones_nm.Name)

                # This below code is to get list of professional id's based on location zone table
                # zone_profs_list = agg_hhc_professional_location.objects.filter(Q(location_name__icontains= zones_nm.Name) | Q(location_name = 'All')) #this query to fetch related zone name not exactly same

                # changed here
                # zone_profs_list = agg_hhc_professional_location.objects.filter(Q(location_name = zones_nm.Name) | Q(location_name = 'All')) 
                zone_profs_list = agg_hhc_professional_locations_as_per_zones.objects.filter(Q(prof_zone_id = zones_nm.prof_zone_id) | Q(prof_zone_id = 9))

                zone_prof = []
                # print("Zone professionals list33%-- ", zone_profs_list)
                for i in zone_profs_list:
                    # print("Zone professionals list 1st-- ", i.location_name)
                    # print("Zone professionals -- ", i.srv_prof_id)
                    # print("Zone service id-- ", sub_srv_nm.srv_id)
                    try:
                        zone = agg_hhc_service_professionals.objects.get(Q(srv_prof_id=i.srv_prof_id.srv_prof_id), prof_registered=True, prof_interviewed=True, prof_doc_verified=True, professinal_status=4, status=1, srv_id=sub_srv_nm.srv_id)
                    except:
                        pass
                    # print("Out try block")
                    try:
                        if zone.srv_prof_id in zone_prof:
                            # print("This item already exists in list.")
                            pass
                        else:
                            # print("in zone prof--", zone.srv_prof_id)
                            # print("in zone prof--", zone.srv_id)
                            zone_prof.append(zone.srv_prof_id)
                    except:
                        pass
                # print("Zone of profs with zone and all type--", zone_prof)
                if len(zone_prof) == 0:
                    return Response({'Not found': 'Professionals for this service is not available for now.'}, status=status.HTTP_200_OK)


                all_dates = []
                st_times = []
                ed_times = []
                
                dtl_evts = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_poc_id=eve_poc_id)
                for evt in dtl_evts:
                    # print("dtl event-- ", evt.eve_id)
                    all_dates.append(evt.actual_StartDate_Time)
                    st_times.append(evt.start_time)
                    ed_times.append(evt.end_time)

                busy_profs = []
                aval_zone_prof = []
                sort_profs = []
                # print("all_dates--", all_dates)
                # print("st_times--", st_times)
                # print("ed_times--", ed_times)
                i = -1
                bus_prof = 0
                for d in all_dates:
                    i = i + 1
                    try:
                        busy_prof = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(actual_StartDate_Time=all_dates[i]), Q(start_time__gte = st_times[i]), Q(end_time__lte = ed_times[i]))
                        # print("busy_prof--",bus_profs)
                        bus_prof = 1
                        bp = busy_prof[0].srv_prof_id.srv_prof_id
                        busy_profs.append(bp)
                    except:
                        pass

                
                # sorted_profs = agg_hhc_service_professionals.objects.filter(Q(srv_prof_id__in=list(busy_profs))| Q(prof_zone_id=zones_nm), prof_registered=1, prof_interviewed=1, prof_doc_verified=1)
                if bus_prof == 0:
                    print("In busy prof block")
                    sorted_profs = agg_hhc_service_professionals.objects.filter(prof_registered=True, prof_interviewed=True, prof_doc_verified=True, srv_id=sub_srv_nm.srv_id).order_by("prof_fullname")
                else:
                    print("In else busy prof block")
                    sorted_profs = agg_hhc_service_professionals.objects.filter(srv_prof_id__in=list(busy_profs), prof_registered=True, prof_interviewed=True, prof_doc_verified=True, srv_id=sub_srv_nm.srv_id).order_by("prof_fullname")

                # print('In sorted#$#$#$')
                # print('In sorted#$#$#$', sorted_profs)
                
                for i in sorted_profs:
                    sort_profs.append(i.srv_prof_id)
                # print("Sorted busy professionals-- ", sort_profs)

                aval_profs = agg_hhc_service_professionals.objects.exclude(Q(srv_prof_id__in=list(sort_profs)) | Q(prof_registered=False) | Q(prof_interviewed=False) | Q(prof_doc_verified=False)| Q(status=2)| ~Q(professinal_status=4))

                for i in aval_profs:
                    aval_zone_prof.append(i.srv_prof_id)
                # print("AVAL ZONee-- ", aval_zone_prof)

                common_elements = [value for value in aval_zone_prof if value in zone_prof]
                # print("Common elements--- ",common_elements)

                not_common_elements = [value for value in aval_zone_prof + zone_prof if value not in aval_zone_prof or value not in zone_prof]
                # print("Not Common elements--- ",not_common_elements)


                

                zone_pr = agg_hhc_service_professionals.objects.filter(srv_prof_id__in=list(common_elements)).order_by("prof_fullname")
                # print("ZONEEEE-- ", zone_pr)

                zone_nt_pr = agg_hhc_service_professionals.objects.filter(~Q(srv_prof_id__in=list(zone_prof))).order_by("prof_fullname")
                # print("NOTTT ZONEE-- ", zone_nt_pr)


                bus_profs = agg_hhc_service_professionals.objects.filter(srv_prof_id__in=list(sort_profs))
                # print("BUSY Prof-- ", bus_profs)

                # prof_list = list(chain(zone_pr, zone_nt_pr, bus_profs))
                prof_list = list(chain(zone_pr, bus_profs))
                zone = prof_list
                # zone = zone_pr
                print("Final List----------  ", zone)

            if zones and title:
                print("Inside zones and title if statement---")
                zones_nm = agg_hhc_professional_zone.objects.get(prof_zone_id=zones)
                

                # changed here
                # zone_profs_list = agg_hhc_professional_location.objects.filter(Q(location_name__icontains= zones_nm.Name) | Q(location_name = 'All'))

                zone_profs_list = agg_hhc_professional_locations_as_per_zones.objects.filter(Q(prof_zone_id = zones_nm.prof_zone_id) | Q(prof_zone_id = 9))

                # print("Zone professionals list-- ", zone_profs_list)
                zone_prof = []
                for i in zone_profs_list:
                    # print("prof-- ", i.srv_prof_id.srv_prof_id)

                    # zone = agg_hhc_service_professionals.objects.get(Q(srv_prof_id=i.srv_prof_id.srv_prof_id) | Q(title=title) | Q(srv_id=sub_srv), prof_registered=True, prof_interviewed=True, prof_doc_verified=True, professinal_status=4, status=1)

                    zone = agg_hhc_service_professionals.objects.get(srv_prof_id=i.srv_prof_id.srv_prof_id, prof_registered=1, prof_interviewed=1, prof_doc_verified=1, professinal_status=4, status=1)

                    # print("zonnne ", zone)

                    if zone.srv_prof_id in zone_prof:
                        # print("This item already exists in list.")
                        pass
                    else:
                        zone_prof.append(zone.srv_prof_id)
                # print("Name of profs--", zone_prof)
                zone = agg_hhc_service_professionals.objects.filter(srv_prof_id__in=list(zone_prof), prof_registered=True, prof_interviewed=True, prof_doc_verified=True).order_by("prof_fullname")
                # print("List of zone profs--", zone)

            if pro:
                print("Inside pro")
                zone = agg_hhc_service_professionals.objects.filter(srv_prof_id=pro, prof_registered=True, prof_interviewed=True, prof_doc_verified=True, professinal_status=4, status=1).order_by("prof_fullname")

            if zones and srv_id:
                
                print("Inside srv_id and zone block")
                srv_obj = agg_hhc_services.objects.get(srv_id=srv_id)
                # print("Srv obj--", srv_obj.service_title)
                zones_nm = agg_hhc_professional_zone.objects.get(prof_zone_id=zones)
                # print("Zone name--", zones_nm)

                # changed here
                # zone_profs_list = agg_hhc_professional_location.objects.filter(Q(location_name = zones_nm.Name) | Q(location_name = 'All'), srv_prof_id__srv_id = srv_obj.service_title)

                zone_profs_list = agg_hhc_professional_locations_as_per_zones.objects.filter(Q(prof_zone_id = zones_nm.prof_zone_id) | Q(prof_zone_id = 9), srv_prof_id__srv_id = srv_obj.service_title)


                zone_prof = []
                # print("Profs list based selected zone-- ", zone_profs_list)

                for i in zone_profs_list:
                    # print("loc nm-- ", i.location_name)
                    # print("service id-- ", srv_id)
                    # print("prof id-- ", i.srv_prof_id.srv_prof_id)
                    # print("Srv id-- ", i.srv_prof_id.srv_id)

                    try:
                        zone = agg_hhc_service_professionals.objects.get(Q(srv_prof_id=i.srv_prof_id.srv_prof_id), prof_registered=True, prof_interviewed=True, prof_doc_verified=True, professinal_status=4, status=1, srv_id=srv_obj)
                        # print("zone!@!@!@!--", zone)
                        try:
                            if zone in zone_prof:
                                # print("This item already exists in list.")
                                continue
                            else:
                                # print("in zone prof--", zone.srv_prof_id)
                                # print("Zone professionals list 1st-- ", i.location_name)
                                zone_prof.append(zone)
                        except:
                            pass
                    except:
                        pass 
                # print("Zone of profs with zone and all type--", zone_prof)
                if len(zone_prof) == 0:
                    return Response({'Not available': 'Professionals for this service is not available for now.'}, status=status.HTTP_200_OK)
                else:
                    zone = zone_prof
                # print("zone&*&7--", zone)
                # aval_zone_prof = []

            # else:
            #     print("Inside else block")
            #     zone = agg_hhc_service_professionals.objects.filter(prof_registered=True, prof_interviewed=True, prof_doc_verified=True, professinal_status=4, status=1).order_by("prof_fullname")
                
            if zone:
                print("Inside zone+++++=")
                serializer = agg_hhc_service_professional_serializer(zone, many=True)
                # print("serializer data--", serializer.data)
                for j in serializer.data:
                    try:
                        # changed here
                        # loc_nm = agg_hhc_professional_location.objects.filter(Q(location_name = zones_name.Name) | Q(location_name = 'All'), srv_prof_id = j['srv_prof_id'])
                        
                        loc_nm = agg_hhc_professional_locations_as_per_zones.objects.filter(Q(prof_zone_id = zones_nm.prof_zone_id) | Q(prof_zone_id = 9), srv_prof_id = j['srv_prof_id'])


                        if loc_nm:
                            # print("loc nm-", loc_nm)
                            zone_list_arr = []
                            for pkb in loc_nm:

                                # changed here
                                # zone_list_arr.append(pkb.location_name)
                                zone_list_arr.append(pkb.prof_zone_id.Name)
                                
                            # print("zone_list_arr-------+++++++++________--", zone_list_arr)
                            j['prof_zone_id'] = zone_list_arr
                            # j.prof_zone_id = loc_nm.location_name
                            # print("locnm - ", j['prof_zone_id'])

                        if home_loc and eve_poc_id and zones:
                            eve_poc_id_dtl = agg_hhc_event_plan_of_care.objects.get(eve_poc_id=eve_poc_id)
                            patient_lat1 = eve_poc_id_dtl.eve_id.agg_sp_pt_id.lattitude
                            patient_long1 = eve_poc_id_dtl.eve_id.agg_sp_pt_id.langitude

                            srv_prof = agg_hhc_service_professionals.objects.get(srv_prof_id=j['srv_prof_id'])
                            srv_home_lat21 = srv_prof.lattitude
                            srv_home_long22 = srv_prof.langitude

                            zone_mid_latlong = agg_hhc_professional_zone.objects.get(prof_zone_id=zones)
                            zone_lat21 = zone_mid_latlong.midpoint_latitude
                            zone_long22 = zone_mid_latlong.midpoint_longitude


                            # print("patient_lat----patient_long----srv_home_lat----srv_home_long----zone_lat21--zone_long22--", patient_lat1, patient_long1, srv_home_lat21, srv_home_long22, zone_lat21, zone_long22)

                            if home_loc == '1':
                                try:
                                    if srv_home_lat21 != None and srv_home_long22 != None:
                                        dlat = srv_home_lat21 - patient_lat1
                                        dlon = srv_home_long22 - patient_long1
                                        a = math.sin(dlat / 2)**2 + math.cos(patient_lat1) * math.cos(srv_home_lat21) * math.sin(dlon / 2)**2
                                        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
                                        
                                        # Radius of the Earth in kilometers. Use 3956 for miles. 
                                        R = 6371
                                        distance = R * c

                                        print("distance111111---", distance)
                                        j['home_distance'] = round(distance, 2)
                                    else:
                                        print("This prof doesn't have home location....")
                                except:
                                    pass

                            elif home_loc == '2':
                                try:
                                    if zone_lat21 != None and zone_long22 != None:
                                        dlat = zone_lat21 - patient_lat1
                                        dlon = zone_long22 - patient_long1
                                        a = math.sin(dlat / 2)**2 + math.cos(patient_lat1) * math.cos(zone_lat21) * math.sin(dlon / 2)**2
                                        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
                                        
                                        # Radius of the Earth in kilometers. Use 3956 for miles. 
                                        R = 6371
                                        distance = R * c

                                        print("distance2222222---", distance)
                                        j['zone_distance'] = round(distance, 2)

                                    else:
                                        print("This prof doesn't have zone location..")

                                except:
                                    pass
                                
                                

                        else:
                            pass
                    except:
                        pass
                return Response(serializer.data , status=status.HTTP_200_OK)
        #     return Response({'msg':'Professionals are not available for now'}, status=status.HTTP_200_OK)
        # except:
        #     return Response({'msg': 'Professionals are not available for now'}, status=status.HTTP_200_OK)    

            return Response({'not found':'Record not found'}, status=status.HTTP_200_OK)
        except:
            return Response({'not found': 'Record not found'}, status=status.HTTP_200_OK)    





class agg_hhc_service_professional_reschdl_list_api(APIView): # List of professionals
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        zones = request.GET.get('zone')
        actual_StartDate_Time = request.GET.get('actual_StartDate_Time')
        actual_EndDate_Time = request.GET.get('actual_EndDate_Time')
        start_time = request.GET.get('start_time')
        end_time = request.GET.get('end_time') 
        srv_id = request.GET.get('srv')       

        try:
            if zones:
                srv_obj = agg_hhc_services.objects.get(srv_id=srv_id)
                zones_nm = agg_hhc_professional_zone.objects.get(prof_zone_id=zones)
                # print("zones_nm-- ", zones_nm.Name) # To get the name of zone from zone id

                # This below code is to get list of professional id's based on location zone table
                # zone_profs_list = agg_hhc_professional_location.objects.filter(Q(location_name__icontains= zones_nm.Name) | Q(location_name = 'All')) #this query to fetch related zone name not exactly same
                
                zone_profs_list = agg_hhc_professional_location.objects.filter(Q(location_name = zones_nm.Name) | Q(location_name = 'All')) # To get exact same zone name profs and "all" name type
                # zone_prof_list_arr = []

                zone_prof = []
                sorted_zone_profs = []
                for i in zone_profs_list:
                    try:
                        zone = agg_hhc_service_professionals.objects.get(Q(srv_prof_id=i.srv_prof_id.srv_prof_id), prof_registered=True, prof_interviewed=True, prof_doc_verified=True, professinal_status=4, status=1, srv_id=srv_obj)
                    except:
                        pass
                    try:
                        if zone in zone_prof:
                            # print("This item already exists in list.")
                            pass
                        else:
                            zone_prof.append(zone)
                            # zone_prof.append(zone.srv_prof_id)
                    except:
                        pass

                print("Zone of profs with zone and all type**--", type(zone_prof))
                if len(zone_prof) == 0:
                    return Response({'Not found': 'Professionals for this service is not available for now.'}, status=status.HTTP_200_OK)
                else:
                    print("Nothing")
                    sorted_zone_profs = 0
                    # sorted_zone_profs = agg_hhc_service_professionals.objects.filter(Q(srv_prof_id__in=list(zone_prof))).order_by("prof_fullname")

                    print("Sorted zone profs--", sorted_zone_profs)

                busy_profs = []
                aval_zone_prof = []
                aval_zone_prof2 = []
                sort_profs = []
                bus_prof = 0
                busyy_profs = []
                zone_nt_pr = []
                zone_pr = []
                # i = -1
                # for d in all_dates:
                #     i = i + 1
                try:
                    busy_prof = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(actual_StartDate_Time__gte= actual_StartDate_Time), Q(actual_EndDate_Time__lte=actual_EndDate_Time), Q(start_time__gte = start_time), Q(end_time__lte = end_time))
                    bp = busy_prof[0].srv_prof_id.srv_prof_id
                    busy_profs.append(bp)
                    bus_prof = 1
                except:
                    pass

                print('Busy Profs--', busy_prof)

                if bus_prof == 0:
                    # sorted_profs = agg_hhc_service_professionals.objects.filter(prof_registered=True, prof_interviewed=True, prof_doc_verified=True, srv_id=srv_id).order_by("prof_fullname")
                    pass
                else:
                    sorted_profs = agg_hhc_service_professionals.objects.filter(srv_prof_id__in=list(busy_profs), prof_registered=True, prof_interviewed=True, prof_doc_verified=True, srv_id=srv_id).order_by("prof_fullname")

                    print('Sorted312321 Profs--', sorted_profs)

                aval_profs = 0
                try:
                    for i in sorted_profs:
                        sort_profs.append(i.srv_prof_id)
                    print("Sorted BUSY professionals-- ", sort_profs)
                except:
                    pass

                if len(sort_profs) == 0:
                    pass
                else:
                    aval_profs = sort_profs
                    # aval_profs = agg_hhc_service_professionals.objects.exclude(Q(srv_prof_id__in=list(sort_profs)) | Q(prof_registered=False) | Q(prof_interviewed=False) | Q(prof_doc_verified=False)| Q(status=2)| ~Q(professinal_status=4))

                # print("avalzone--", aval_profs)

                
                

                try:
                    for i in zone_prof:
                        aval_zone_prof.append(i.srv_prof_id)

                    zone_pr = agg_hhc_service_professionals.objects.filter(srv_prof_id__in=list(aval_zone_prof)).order_by("prof_fullname")
                    print("ZONEEEE-- ", zone_pr)
                    
                    zone_nt_pr = agg_hhc_service_professionals.objects.filter(~Q(srv_prof_id__in=list(aval_zone_prof)), srv_id=srv_id).order_by("prof_fullname")
                    print("NOTTT ZONEE1-- ", zone_nt_pr) #working correctly fetcing professional not in zone
                except:
                    pass

                try:
                    for i in aval_profs:
                        aval_zone_prof2.append(i.srv_prof_id)

                    busyy_profs = agg_hhc_service_professionals.objects.filter(srv_prof_id__in=list(aval_zone_prof2))
                    print("BUSY Prof-- ", busyy_profs)
                except:
                    pass

                print("Zone pr--", zone_pr)
                print("Zone not pr--", zone_nt_pr)
                print(" bus_profs --", busyy_profs)
                try:
                    prof_list = list(chain(zone_pr, zone_nt_pr, busyy_profs))
                    print("Final prof list-- ", prof_list)
                    zone = prof_list
                except:
                    zone = zone_prof

            
            else:
                zone = agg_hhc_service_professionals.objects.filter(prof_registered=True, prof_interviewed=True, prof_doc_verified=True, professinal_status=4, status=1).order_by("prof_fullname")
                
            if zone:
                serializer = agg_hhc_service_professional_serializer2(zone, many=True)

                return Response(serializer.data , status=status.HTTP_200_OK)
            return Response({'msg':'No Data Found'}, status=status.HTTP_200_OK)
        except:
            return Response({'not found': 'Record not found'}, status=status.HTTP_200_OK)
        
        
class all_dtl_evnts(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        eve = request.GET.get('eve')
        print("eve--", eve)
        today_dt = date.today()
        print("today-- ", type(today_dt))
        try:
            dtl_events =  agg_hhc_detailed_event_plan_of_care.objects.filter(Q(eve_id=eve, is_cancelled=2, Session_jobclosure_status=2, status=1, actual_StartDate_Time__lte=today_dt)).order_by('index_of_Session').values()# To display all detailed events against event.)
            print("data from models ",dtl_events.filter(status=1).last())
            if dtl_events:
                serializer = all_dtl_evnts_serializer(dtl_events, many=True)
                print("dtl events-- ",serializer.data)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({'msg':'No Data Found'}, serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'not found': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)
        
class agg_hhc_detailed_event_plan_of_care_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        pro = request.GET.get('pro')
        try:
            current_datetime = timezone.now()
            time = current_datetime.strftime("%Y-%m-%d")
            pro =  agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id=pro, actual_StartDate_Time__gte = time,status=1)# To display all present & upcoming events.
            # for i in pro:
            #     print(i.actual_StartDate_Time)
            if pro:
                serializer = agg_hhc_detailed_event_plan_of_care_serializer(pro, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({'msg':'No Data Found'}, serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'not found': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)
    

# class agg_hhc_detailed_event_plan_of_care_each_event(APIView):
#     renderer_classes = [UserRenderer]
#     permission_classes = [IsAuthenticated]
#     def get(self, request, format=None):
#         poc = request.GET.get('poc')
#         print("poc", poc)
#         try:
#             pro =  agg_hhc_detailed_event_plan_of_care.objects.filter(agg_sp_dt_eve_poc_id=poc,status=1)
#             for i in pro:
#                 evets = agg_hhc_events.objects.get(eve_id = i.eve_id.eve_id)
#                 final_amount = evets.final_amount
#                 caller_number = evets.caller_id.phone
#                 srv_prfid = i.eve_poc_id.srv_prof_id
#                 eve_id = i.eve_id.agg_sp_pt_id
#                 srv_id = i.eve_poc_id.srv_id
#                 sub_srv_id = i.eve_poc_id.sub_srv_id

#             srvprofid = srv_prfid.srv_prof_id
#             patient_add = eve_id.address
#             patient_name = eve_id.name
#             prof = agg_hhc_service_professionals.objects.get(srv_prof_id = srvprofid)
#             profnm = prof.prof_fullname

#             serializer = agg_hhc_detailed_event_plan_of_care_serializer(pro, many=True)
#             if pro:
#                 return Response({"prof_name": profnm, "srv_name": srv_id.service_title, "sub_srv_id": sub_srv_id.recommomded_service , "patient_name": patient_name, "patient_add": patient_add, "Service_final_amount" : final_amount, "caller_number" : caller_number,"data" : serializer.data}, status=status.HTTP_200_OK)
#             return Response({'msg':'No Data Found'}, serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#         except:
#             return Response({'msg':'No Data Found'}, status=status.HTTP_404_NOT_FOUND)

# class agg_hhc_detailed_event_plan_of_care_each_event(APIView):
#     renderer_classes = [UserRenderer]
#     permission_classes = [IsAuthenticated]
#     def get(self, request, format=None):
#         poc = request.GET.get('poc')
#         print("poc", poc)
#         try:
#             pro =  agg_hhc_detailed_event_plan_of_care.objects.filter(agg_sp_dt_eve_poc_id=poc,status=1)
#             for i in pro:
#                 evets = agg_hhc_events.objects.get(eve_id = i.eve_id.eve_id)
#                 final_amount = evets.final_amount
#                 caller_number = evets.caller_id.phone
#                 srv_prfid = i.eve_poc_id.srv_prof_id
#                 eve_id = i.eve_id.agg_sp_pt_id
#                 srv_id = i.eve_poc_id.srv_id
#                 sub_srv_id = i.eve_poc_id.sub_srv_id

#             srvprofid = srv_prfid.srv_prof_id
#             patient_add = eve_id.address
#             patient_name = eve_id.name
#             prof = agg_hhc_service_professionals.objects.get(srv_prof_id = srvprofid)
#             profnm = prof.prof_fullname

#             serializer = agg_hhc_detailed_event_plan_of_care_serializer(pro, many=True)
#             if pro:
#                 return Response({"prof_name": profnm, "srv_name": srv_id.service_title, "sub_srv_id": sub_srv_id.recommomded_service , "patient_name": patient_name, "patient_add": patient_add, "Service_final_amount" : final_amount, "caller_number" : caller_number,"data" : serializer.data}, status=status.HTTP_200_OK)
#             return Response({'msg':'No Data Found'}, serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#         except:
#             return Response({'msg':'No Data Found'}, status=status.HTTP_404_NOT_FOUND)
    

class agg_hhc_detailed_event_plan_of_care_each_event(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        poc = request.GET.get('poc')
        print("poc", poc)

        profnm = None
        srv_id_service_title = None
        sub_srv_id_recommomded_service = None
        patient_name = None
        patient_add = None
        final_amount = None
        caller_number = None

        try:
            pro =  agg_hhc_detailed_event_plan_of_care.objects.filter(agg_sp_dt_eve_poc_id=poc,status=1)
            print("dtls eves-- ", pro)
            for i in pro:
                evets = agg_hhc_events.objects.get(eve_id = i.eve_id.eve_id)
                final_amount = evets.final_amount
                caller_number = evets.caller_id.phone
                # srv_prfid = i.eve_poc_id.srv_prof_id
                srv_prfid = i.srv_prof_id
                eve_id = i.eve_id.agg_sp_pt_id
                srv_id = i.eve_poc_id.srv_id
                sub_srv_id = i.eve_poc_id.sub_srv_id

            srvprofid = srv_prfid.srv_prof_id
            patient_add = eve_id.address
            patient_name = eve_id.name
            prof = agg_hhc_service_professionals.objects.get(srv_prof_id = srvprofid)
            profnm = prof.prof_fullname

            serializer = agg_hhc_detailed_event_plan_of_care_serializer(pro, many=True)
            srv_id_service_title = srv_id.service_title
            sub_srv_id_recommomded_service = sub_srv_id.recommomded_service
            if pro:
                return Response({"prof_name": profnm, "srv_name": srv_id_service_title, "sub_srv_id": sub_srv_id_recommomded_service , "patient_name": patient_name, "patient_add": patient_add, "Service_final_amount" : final_amount, "caller_number" : caller_number,"data" : serializer.data}, status=status.HTTP_200_OK)
            return Response({'msg':'No Data Found'}, serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'msg':'No Data Found'}, status=status.HTTP_404_NOT_FOUND)

    
class agg_hhc_detailed_event_plan_of_care_per_day_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        pro = request.GET.get('pro')
        current_datetime = timezone.now()
        time = current_datetime.strftime("%Y-%m-%d")
        try:
            pro =  agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id=pro, service_status=2, actual_StartDate_Time__icontains=time,status=1)
            if pro:
                serializer = agg_hhc_detailed_event_plan_of_care_serializer(pro, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({'msg':'No Data Found'},serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'not found': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)
    
    
    def put(self, request, format=None):
        clgref_id = get_prof(request)[3]
        request.data['last_modified_by'] = clgref_id
        

        json_data = json.loads(request.body)
        dt_evt_id = json_data['agg_sp_dt_eve_poc_id']
        
        try:
            if dt_evt_id is not None:
                dt_evt =  agg_hhc_detailed_event_plan_of_care.objects.get(agg_sp_dt_eve_poc_id=dt_evt_id,status=1)
                serializer = agg_hhc_detailed_event_plan_of_care_serializer(dt_evt, data=json_data)

                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({'msg':'No Data Found'}, serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'msg': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)
    

class CashfreeCreateOrder(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        clgref_id = get_prof(request)[3]
        
        request.data['last_modified_by'] = clgref_id

        # serializer = PatientSerializer(data=request.data)
        # if serializer.is_valid(raise_exception=True):
        #     patient = serializer.save()
        if request.data:
            # print(request.data)
            return Response({'msg':'Payment Successfully added'},status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)


    # def post(self, request):
    #     url = f"{settings.CASHFREE_API_URL}/payout/v1/order/create"
    #     # url = f"https://api.cashfree.com/payout/v1/order/create"
    #     payload = {
    #     "orderId": "0001",
    #     "orderAmount": "1",
    #     "orderCurrency": "INR",
    #     "orderNote": "Your order description or note",
    #     "customerName": "Nikita Pawar",
    #     "customerPhone": "7057662056",
    #     "customerEmail": "john.doe@example.com",
    #     "returnUrl": "https://example.com/payment-success",  # URL to redirect after successful payment
    #     "notifyUrl": "https://example.com/payment-notify",  # URL to receive payment notifications (webhooks)
    #     "source": "web",  # The source of the payment (web, mobile, etc.)
    #     "paymentModes": "card,upi,netbanking",  # Supported payment modes for the order
    #     # Add other required parameters specific to your use case here
    # }
    #     headers = {
    #         "Content-Type": "application/json",
    #         "Authorization": f"Bearer {settings.CASHFREE_SECRET_KEY}",
    #     }

    #     response = requests.post(url, json=payload, headers=headers)

    #     if response.status_code == status.HTTP_200_OK:
    #         # Successful response from Cashfree API
    #         data = response.json()
    #         # Process the data and return a success response to the client
    #         return Response(data, status=status.HTTP_200_OK)
    #     else:
    #         # Handle error response from Cashfree API
    #         error_data = response.json()
    #         # Handle the error data and return an error response to the client
    #         return Response(error_data, status=status.HTTP_400_BAD_REQUEST)

#--------------------------------------------#######-----------------------------------------------








#---------------------------Mohin-----------------------


class combined_info(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request,hosp_id):
        # print('demo1')
        try:
            # print(';;;llll;;1')
            if request.method == 'GET':
                if(hosp_id==0):
                    # print('1')
                    event_data = agg_hhc_events.objects.filter(Q(event_status=1) | Q(event_status=4),Q(enq_spero_srv_status=1)|Q(enq_spero_srv_status=2),status=1)
                else:
                    # print('2')
                    event_data = agg_hhc_events.objects.filter(Q(event_status=1) | Q(event_status=4),Q(enq_spero_srv_status=1)|Q(enq_spero_srv_status=2),status=1,added_from_hosp=hosp_id)
                agg_hhc_eve = agg_hhc_events_serializers1(event_data, many=True)
                # print(';;;ll;;;')
                # print(agg_hhc_eve.data,';;;llll;;2')
                event = []
                for i in agg_hhc_eve.data:
                    # print(';;;llll;;3')
                    event_code = i.get('event_code')
                    if event_code is None:
                        raise Exception("event_code is missing",i.get('event_code'))
                    # print(';;;llll;;4')
                    patient_no = i.get('agg_sp_pt_id')
                    if patient_no is None:
                        raise Exception("agg_sp_pt_id is missing",i.get('agg_sp_pt_id'))
                    try:
                        patient = agg_hhc_patients.objects.get(agg_sp_pt_id=patient_no)
                        pat_ser = agg_hhc_patients_serializer(patient)
                    except Exception as e:
                         raise Exception("patient does not found with this event id",i.get('event_code'))
                    patient_name = pat_ser.data.get('name')
                    # print(';;;llll;;5')
                    if patient_name is None:
                        raise Exception("patient_name does not found with agg_sp_pt id",i.get('agg_sp_pt_id'))
                    patient_number = pat_ser.data.get('phone_no')
                    # print(';;;llll;;6')
                    if patient_name is None:
                        raise Exception("patient_number does not found with agg_sp_pt id",i.get('agg_sp_pt_id'))
                    patient_zone_id = pat_ser.data.get('prof_zone_id')
                    # print(';;;llll;;7')
                    if patient_zone_id is None:
                        raise Exception("patient_zone does not found with agg_sp_pt id",i.get('agg_sp_pt_id'))
                    try:
                        patient_zone = agg_hhc_professional_zone.objects.get(prof_zone_id=patient_zone_id)
                    except Exception as e:
                        return Response({'patient zone not found with patient id ':i.get('agg_sp_pt_id')}, status=500)
                    caller_id = pat_ser.data.get('caller_id')
                    caller_status = agg_hhc_callers.objects.get(caller_id=caller_id)
                    caller_seri = agg_hhc_callers_seralizer(caller_status)
                    caler_status = i.get('patient_service_status')
                    try:
                        event_plan_of_care = agg_hhc_event_plan_of_care.objects.filter(eve_id=i.get('eve_id'),status=1).latest('eve_id')
                    except Exception as e:
                        return Response({'not found event_plan_of_care id in event id ':i.get('eve_id')}, status=500)
                    # print("event plan of care",event_plan_of_care)
                    event_plan_of_care_serialzer = agg_hhc_create_service_serializer(event_plan_of_care)
                    event_start_date = event_plan_of_care_serialzer.data.get('start_date')
                    event_end_date = event_plan_of_care_serialzer.data.get('end_date')
                    professional_prefered = event_plan_of_care_serialzer.data.get('prof_prefered')
                    service_id = event_plan_of_care_serialzer.data.get('srv_id')
                    service = agg_hhc_services.objects.get(srv_id=service_id)
                    service_serializer = agg_hhc_services_serializer(service)
                    service_name = service_serializer.data.get('service_title')

                    get_eve_dt = agg_hhc_events.objects.get(eve_id=i.get('eve_id'))
                    pay_dtls = agg_hhc_payment_details.objects.filter(eve_id=get_eve_dt, overall_status='SUCCESS')

                    if pay_dtls.exists():  
                        srv_payment_status = True  
                    else:
                        srv_payment_status = False  


                    even = {
                        'event_id': i.get('eve_id'),
                        'event_code': event_code,
                        'patient_name': patient_name,
                        'patient_number': patient_number,
                        'patient_zone': patient_zone.Name,
                        'event_start_date': event_start_date,
                        'event_end_date': event_end_date,
                        'service_name': service_name,
                        'caller_status': caler_status,
                        'professional_prefered': professional_prefered,
                        'patient_googel_address':pat_ser.data.get('google_address'),
                        'caller_phone_number':caller_seri.data.get('phone'),
                        'patient_address':pat_ser.data.get('address'),
                        'payment_is_done': srv_payment_status,
                        'sub_service': event_plan_of_care.sub_srv_id.recommomded_service if event_plan_of_care.sub_srv_id.recommomded_service else None,

                    }
                    event.append(even)
                return Response({'event_code': event})
        except Exception as e:
            return Response({'error': str(e)}, status=500)#'patient_name':patient.name,'patient_number':patient.phone_no,'service_name':service_name.service_title})#add zone from agg_hhc_patient_table




#####--------------------------------------logout------------------------------------------#
class LogoutView(APIView):
    
    def post(self, request):
        # clgref_id = get_prof(request)[3]
        try:
            refresh_token = request.data["refresh"]
            clgid = request.data["clg_id"]
            int(clgid)
            clg = agg_com_colleague.objects.get(id=clgid)
            clg.clg_is_login = False
            clg.save()
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'msg':'Token is blacklisted successfully.'},status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'msg':'Bad Request'},status=status.HTTP_200_OK)


#--------------------------------mayank--------------------------------------------

# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework import status
# from .models import agg_hhc_service_professionals, agg_hhc_event_plan_of_care
# from .serializers import AggHHCServiceProfessionalSerializer
@api_view(['GET'])
# @cache_page(60 * 15)
def total_services(request):
    try:
        service_professionals = agg_hhc_service_professionals.objects.filter(prof_registered=True,prof_interviewed=True,prof_doc_verified=True,professinal_status=4, status=1).order_by("prof_fullname")
        print("Profs list-- ", service_professionals)
        data = []
        for professional in service_professionals:
            total_services_count = agg_hhc_event_plan_of_care.objects.filter(srv_prof_id=professional.srv_prof_id,status=1).count()
            serializer = AggHHCServiceProfessionalSerializer(professional)
            professional_data = serializer.data
            professional_data['total_services'] = total_services_count
            data.append(professional_data)
        return Response(data, status=status.HTTP_200_OK)
    except agg_hhc_service_professionals.DoesNotExist:
        return Response({"error": "Service Professionals not found."}, status=status.HTTP_404_NOT_FOUND)
    



#---------------- ongoing service ------------------------


import logging

class OngoingServiceView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    serializer_class = OngoingServiceSerializer
    logger = logging.getLogger(__name__)

    def get(self, request,hosp_id, format=None):
        if(int(hosp_id)==0):
            data =  agg_hhc_events.objects.filter(Q(event_status=2) | Q(event_status=3),status=1)
        else:
            data =  agg_hhc_events.objects.filter(Q(event_status=2) | Q(event_status=3),status=1,added_from_hosp=hosp_id)
        serializer = self.serializer_class(data, many=True)  
        filtered_data = [item for item in serializer.data if item is not None]
        # # filtered_data_sorted_by_date = sorted(filtered_data, key=lambda x: x['srv_prof_id'][0]['start_date'] if x['srv_prof_id'] else '')
        filtered_data_sorted_by_date = sorted(filtered_data, key=lambda x: x['srv_prof_id'][0]['start_date'] if x['srv_prof_id'] and x['srv_prof_id'][0]['start_date'] else '')

       
        return Response(filtered_data_sorted_by_date)
        return Response(serializer.data)

# from django.http import StreamingHttpResponse

# class OngoingServiceView(APIView):
#     renderer_classes = [UserRenderer]
#     permission_classes = [IsAuthenticated]
#     serializer_class = OngoingServiceSerializer
#     logger = logging.getLogger(__name__)

#     def stream_data(self, queryset):
#         serializer = self.serializer_class(queryset, many=True)
#         for item in serializer.data:
#             if item is not None:
#                 yield dict(item)  # Convert ordered dictionary to dictionary

#     def get(self, request, hosp_id, format=None):
#         queryset = agg_hhc_events.objects.filter(Q(event_status=2) | Q(event_status=3), status=1)
#         if int(hosp_id) != 0:
#             queryset = queryset.filter(added_from_hosp=hosp_id)

#         response = StreamingHttpResponse(self.stream_data(queryset), content_type='application/json')
#         response['Content-Disposition'] = 'attachment; filename="ongoing_services.json"'
#         return response
    

# -------------------------------------Amit Rasale---------------------------------------------------------------
class create_group_module_Views(APIView):
    def get(self, request, *args, **kwargs):
        modules = Permission_module.objects.all()
        serializer = module_serializer(modules, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        group_data = request.data.get('group')

        group_serializer_instance = group_serializer(data=group_data)
        if group_serializer_instance.is_valid():
            group = group_serializer_instance.save() 
        else:
            return Response(group_serializer_instance.errors, status=status.HTTP_400_BAD_REQUEST)

        module_data = request.data.copy()
        module_data['group'] = group.grp_id

        module_serializer_instance = module_serializer(data=module_data)
        if module_serializer_instance.is_valid():
            module_serializer_instance.save()
            return Response(module_serializer_instance.data, status=status.HTTP_201_CREATED)
        else:
            return Response(module_serializer_instance.errors, status=status.HTTP_400_BAD_REQUEST)


from django.db import IntegrityError

class create_permission_Views(APIView):
    def get(self, request, *args, **kwargs):
        modules = permission.objects.all()
        serializer = permission_serializer(modules, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        try:
            serializer = permission_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                raise ValidationError(serializer.errors)
        except ValidationError as ve:
            return Response({"error": "Validation Error", "details": ve.detail}, status=status.HTTP_400_BAD_REQUEST)
        except IntegrityError as ie:
            return Response({"error": "Integrity Error", "details": str(ie)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "An unexpected error occurred", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)              



class agg_hhc_enquiry_previous_follow_up_APIView(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    def get(self, request, flag, event_id):
        if flag == 1:
            queryset = agg_hhc_enquiry_follow_up.objects.filter(event_id=event_id).last()
            serializer = agg_hhc_enquiry_previous_follow_up_serializer(queryset)
        elif flag == 2:
            queryset = agg_hhc_service_follow_up.objects.filter(event_id=event_id).last()
            serializer = agg_hhc_service_previous_follow_up_serializer(queryset)
        
        return Response([serializer.data])



    # def get(self, request, flag, event_id):
    #     # queryset =  agg_hhc_enquiry_follow_up.objects.all()
    #     # if event_id is not None:
    #     #     queryset = queryset.filter(event_id=event_id)
    #     # serializer =  agg_hhc_enquiry_previous_follow_up_serializer(queryset, many=True)
    #     # return Response(serializer.data[::-1]) # edit as per frontend requirment shwo only last record
    #     # queryset = agg_hhc_enquiry_follow_up.objects.filter(event_id=event_id, follow_up=1).last()
    #     # print(queryset, 'dtyjxfgh') 
    #     # # print(queryset.count())
    #     # serializer =  agg_hhc_enquiry_previous_follow_up_serializer(queryset)
    #     if flag == 1:
    #         queryset = agg_hhc_enquiry_follow_up.objects.filter(event_id=event_id).last()
    #         print(queryset,'queryset')
    #         serializer =  agg_hhc_enquiry_previous_follow_up_serializer(queryset)
    #     elif flag == 2:
    #         queryset = agg_hhc_service_follow_up.objects.filter(event_id=event_id).last()
    #         print(queryset,'queryset')
    #         serializer =  agg_hhc_service_previous_follow_up_serializer(queryset)
        
    #     print(serializer.data)
    #     return Response([serializer.data])          
    
class agg_hhc_enquiry_Add_follow_up_APIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        clgref_id = get_prof(request)[3]
        # clgref_id = 'abc'
        iddd = request.data.get('flag_id')
        request.data['last_modified_by'] = clgref_id
        request.data['follow_up_count']= int(request.data['follow_up_count'])+1
        if iddd == 1:
            serializer =  agg_hhc_enquiry_Add_follow_up_serializer(data=request.data)
        elif iddd == 2:
            serializer =  agg_hhc_service_Add_follow_up_serializer(data=request.data)
        if serializer.is_valid():
            if serializer.validated_data['follow_up'] == 3:
                serializer.validated_data['follow_up_status'] = 2
            serializer.save()
            return Response({"msg": "Follow up added","data":serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # def post(self, request):
    #     clgref_id = get_prof(request)[3]
    #     request.data['last_modified_by'] = clgref_id
    #     request.data['follow_up_count']= int(request.data['follow_up_count'])+1
    #     serializer =  agg_hhc_enquiry_Add_follow_up_serializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
# --------------------------------------ongoing followup------------------------------------------------
class agg_hhc_ongoing_Add_follow_up_APIView(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    def post(self, request):
        # clgref_id = get_prof(request)[3]

        request.data['follow_up_count']= int(request.data['follow_up_count'])+1
        request.data['follow_up']=5
        serializer =  agg_hhc_enquiry_Add_follow_up_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# --------------------------------------ongoing followup------------------------------------------------
    
class agg_hhc_enquiry_Add_follow_up_Cancel_by_Spero_APIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,pk,format=None):
        reason= agg_hhc_enquiry_follow_up_cancellation_reason.objects.filter(cancel_by_id=pk).order_by('cancelation_reason')
        serializer= agg_hhc_enquiry_follow_up_cancellation_reason_spero_serializer(reason,many=True)
        return Response(serializer.data)
    
class agg_hhc_enquiry_followUp_cancellation_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,pk,format=None):
        reason= agg_hhc_enquiry_follow_up_cancellation_reason.objects.filter(cancel_by_id=pk).order_by('cancelation_reason')
        serializer= agg_hhc_enquiry_follow_up_cancellation_reason_spero_serializer(reason,many=True)
        return Response(serializer.data)
   
class agg_hhc_enquiry_Add_follow_up_Cancel_by_APIView(APIView):   
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        iddd = request.data.get('flag_id')
        data = request.data.copy()
        clgref_id = get_prof(request)[3]
        # clgref_id='abc'
        data['last_modified_by'] = clgref_id
        eve_id=request.data.get('event_id')

        if iddd == 1:
            serializer = agg_hhc_enquiry_Add_follow_up_Cancel_by_serializer(data=data)
        elif iddd == 2:
            serializer = agg_hhc_service_Add_follow_up_Cancel_by_serializer(data=data)
            # all_sess = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id = eve_id,  status=1)
            # all_sess.status = 2
            # all_sess.eve_poc_id.status = 2
            # all_sess.save()

        else:
            return JsonResponse({"error": "Invalid flag_id"}, status=400)
        
        # Check if the follow-up status is 2 (canceled)
        if int(data.get('follow_up')) == 2:
            try:
                event = agg_hhc_events.objects.get(eve_id=eve_id)
                event.status = 2
                event.save()
            except agg_hhc_events.DoesNotExist:
                return JsonResponse({"error": "Event not found"}, status=404)
        
        # Validate and save the data using the serializer
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    
class agg_hhc_enquiry_Add_follow_up_create_service_APIView(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    def post(self, request):
        # clgref_id = get_prof(request)[3]

        serializer = agg_hhc_enquiry_Add_follow_up_create_service_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            # Get the event_id from the saved instance
            event_id = serializer.data.get('event_id')
            return Response({'event_id': event_id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class agg_hhc_service_enquiry_list_combined_table_view(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    def get(self, request,hosp_id,eve_id=None,event_id=None, *args, **kwargs):
        if(hosp_id==0):
            queryset = agg_hhc_events.objects.filter(purp_call_id=2,enq_spero_srv_status=3,status=1)
        else:
            queryset = agg_hhc_events.objects.filter(purp_call_id=2,enq_spero_srv_status=3,status=1,added_from_hosp=hosp_id)
        # print(queryset, ';;;;;;;;;kj;;')
        if eve_id is not None:
            try:
                eve_id = int(eve_id)
                queryset = queryset.filter(eve_id=eve_id)
            except (TypeError, ValueError):
                pass
        queryset = queryset.exclude(agg_hhc_enquiry_follow_up__follow_up='2')
        serializer = agg_hhc_service_enquiry_list_serializer(queryset, many=True)
        eve_pending = [items for items in serializer.data if items.get('follow_up') in ('4', '3')]
        eve_reschedule = [items for items in serializer.data if items.get('follow_up')=='1']
        data=sorted(eve_reschedule, key=lambda x: x['folloup_id'])
        data=eve_pending+data
        # for d in data:
        #     print(d['folloup_id'])
        # print(data[0]['folloup_id'], ';;;;;;;;;;;;;')
        # print(eve_pending.follow_up_id)
        if not data:
            return Response({"detail": "No matching records found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(data, status=status.HTTP_200_OK)
        # if not serializer.data:
        #     return Response({"detail": "No matching records found"}, status=status.HTTP_404_NOT_FOUND)
        # return Response(serializer.data, status=status.HTTP_200_OK)
    
#------------------------------------coupon--code----------------------------------------------------------
 
class coupon_code_post_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_object(self,code,format=None):
        try:
            return  agg_hhc_coupon_codes.objects.filter(coupon_code=code,coupon_code_status=1).first()
        except  agg_hhc_coupon_codes.DoesNotExist:
            raise status.HTTP_404_NOT_FOUND
    def get(self,request,code,total_amt,format=None):
        queryset=self.get_object(code)
        if(queryset==None):
            return Response({'total_amt':total_amt})
        else:
            serialized= agg_hhc_coupon_code_serializers(queryset)
            percentage=serialized.data.get('coupon_code_discount_Percentage')
            amount=percentage
            total_amt=total_amt
            final= (total_amt-(total_amt*amount)/100)
            return Response({"final_amount":final})
        #return Response(serialized.data.get('coupon_code_discount_Percentage'))

class coupon_code_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        codes= agg_hhc_coupon_codes.objects.filter(coupon_code_status=1,coupon_code_discount_Percentage__lte=10)
        serializered= agg_hhc_coupon_code_serializers(codes,many=True)
        return Response(serializered.data)





# ------------------ service reschedule  -------------

# from . serializers import Detailed_EPOC_serializer

class service_reschedule_view(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    def get(self, request, eve_id, format=None):
        queryset =  agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=eve_id,status=1).order_by('actual_StartDate_Time')
        serializer = Detailed_EPOC_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
   
    def patch(self, request, eve_id):
        # clgref_id = get_prof(request)[3]
        clgref_id = 'abc'
        selected_dates = request.data.get('dates', [])
        remark = request.data.get('remark')
        start_time = request.data.get('start_time')
        end_time = request.data.get('end_time')

        all_dates = []
        for date_list in selected_dates:
            sorted_dates = sorted(date_list, key=lambda date: datetime.strptime(date, '%Y-%m-%d'))
            s_date = datetime.strptime(sorted_dates[0], '%Y-%m-%d')
            e_date = datetime.strptime(sorted_dates[-1], '%Y-%m-%d')
            start_time_obj = datetime.strptime(start_time, '%H:%M')
            end_time_obj = datetime.strptime(end_time, '%H:%M')
            while s_date <= e_date:
                all_dates.append(s_date.strftime('%Y-%m-%d'))
                s_date += timedelta(days=1)

        reschedule_dates = sorted(all_dates)
        print(reschedule_dates, 'reschedule_dates')
        dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=eve_id, status=1).order_by('agg_sp_dt_eve_poc_id')
        eve_id=dtl_data.values_list('eve_id', flat=True)
        evepoc=dtl_data[0].eve_poc_id
        clousre_count = dtl_data.filter(Session_jobclosure_status=1).count()
        if len(reschedule_dates) == len(dtl_data):
            if clousre_count == 0:
            
                agg_hhc_event_plan_of_care_history_tracker.objects.create(
                    eve_poc_id=evepoc,
                    eve_id=evepoc.eve_id,
                    srv_id=evepoc.srv_id,
                    sub_srv_id=evepoc.sub_srv_id,
                    hosp_id=evepoc.hosp_id,
                    doct_cons_id=evepoc.doct_cons_id,
                    srv_prof_id=evepoc.srv_prof_id,
                    No_session_dates=evepoc.No_session_dates,
                    start_date=evepoc.start_date,
                    end_date=evepoc.end_date,
                    start_time=evepoc.start_time,
                    end_time=evepoc.end_time,
                    serivce_dates=evepoc.serivce_dates,
                    initail_final_amount=evepoc.initail_final_amount,
                    service_reschedule=1,
                    prof_prefered=evepoc.prof_prefered,
                    remark=evepoc.remark,
                    service_status=evepoc.service_status,
                    last_modified_by=evepoc.last_modified_by
                )
                try:
                    ids=[i.agg_sp_dt_eve_poc_id for i in dtl_data]
                    for i in range(0,len(ids)):
                        da=dtl_data.filter(agg_sp_dt_eve_poc_id=ids[i]).last()
                        da.actual_StartDate_Time=datetime.strptime(reschedule_dates[i], '%Y-%m-%d').date()
                        da.actual_EndDate_Time = datetime.strptime(reschedule_dates[i], '%Y-%m-%d').date()
                        da.start_time = start_time_obj
                        da.end_time = end_time_obj
                        da.srv_prof_id = None
                        da.save()


                    evepoc.start_date = reschedule_dates[0]
                    evepoc.end_date = reschedule_dates[-1]
                    evepoc.service_reschedule = 1
                    evepoc.last_modified_by = clgref_id
                    evepoc.remark = remark
                    evepoc.save()

                    eveid = agg_hhc_events.objects.get(eve_id =evepoc.eve_id.eve_id)
                    eveid.event_status = 1
                    eveid.enq_spero_srv_status = 2
                    eveid.save()
                    
                    return Response({"Msg": 'Rescheduling successful.'}, status=status.HTTP_200_OK)
                except Exception as e:
                    print(str(e))
                    return Response({"Msg": 'Rescheduling not successful.'}, status=status.HTTP_200_OK)
            else:
                return Response({"Msg": "Cannot reschedule due to job closure already done for session."}, status=status.HTTP_424_FAILED_DEPENDENCY)
        else:
            return Response({"Msg": "Selected dates do not match the session count."}, status=status.HTTP_424_FAILED_DEPENDENCY)





        # ------------------------- Session Reschedule -------------------------
class Reschedule_session_view(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        clgref_id = get_prof(request)[3]
        request.data['last_modified_by'] = clgref_id

        eve_id = request.data.get('eve_id')
        session_date_str = request.data.get('session_date')
        session_reschedule_date_str = request.data.get('reschedule_date')
        start_time_str = request.data.get('reschedule_start_time')
        end_time_str = request.data.get('reschedule_end_time')
        
        # Parsing the date and time fields
        if start_time_str and end_time_str:
            start_time = datetime.strptime(start_time_str, "%H:%M").time()
            end_time = datetime.strptime(end_time_str, "%H:%M").time()

        session_date = datetime.strptime(session_date_str, '%Y-%m-%d')
        session_reschedule_date = datetime.strptime(session_reschedule_date_str, '%Y-%m-%d')
        
        session_date_component = session_date.date()
        resch_session_date_component = session_reschedule_date.date()
        resch_session_start_time_component = start_time
        resch_session_end_time_component = end_time

        remark = request.data.get('remark')

        try:
            # Retrieve the current session data
            get_session_data = agg_hhc_detailed_event_plan_of_care.objects.get(
                eve_id=eve_id, actual_StartDate_Time=session_date_component, status=1
            )
            
            # Check for any conflicting sessions
            get_next_session_data = agg_hhc_detailed_event_plan_of_care.objects.filter(
                Q(start_time__lte=resch_session_start_time_component, end_time__gte=resch_session_end_time_component) |
                Q(start_time__gte=resch_session_start_time_component, end_time__lte=resch_session_end_time_component),
                srv_prof_id=get_session_data.srv_prof_id,
                actual_StartDate_Time=resch_session_date_component, status=1
            )

            if get_next_session_data.exists():
                dtl_dates_nxt_sch = []
                for i in get_next_session_data:
                    data = {
                        'eve_id': int(i.eve_id.eve_id),
                        'eve_code': str(i.eve_id.event_code),  # Convert to string for serialization
                        'session_start_date': i.actual_StartDate_Time.strftime('%Y-%m-%d'),  # Convert date to string
                        'session_end_date': i.actual_EndDate_Time.strftime('%Y-%m-%d'),  # Convert date to string
                        'start_time': i.start_time.strftime('%H:%M'),  # Convert time to string
                        'end_time': i.end_time.strftime('%H:%M'),  # Convert time to string
                        'patient_name': i.eve_id.agg_sp_pt_id.name,
                        'caller_name': i.eve_id.caller_id.caller_fullname,
                        'srv_name': i.eve_poc_id.srv_id.service_title
                    }
                   
                    print(data,'data')
                    dtl_dates_nxt_sch.append(data)
                print(dtl_dates_nxt_sch,'dtl_dates_nxt_sch')
                return Response({'msg': 'Professional has already a session',
                                'Schedule_session': dtl_dates_nxt_sch,
                                'current_sess_dtl':{
                                    'session_date':str(session_date),
                                    'Reschedule_date':str(session_reschedule_date),
                                    'resch_start_time':str(start_time),
                                    'resch_end_time':str(end_time)
                                }
                                })

            # Update the status of the current session
            get_session_data.status = 2
            get_session_data.save()

            # Create a new session
            new_session = agg_hhc_detailed_event_plan_of_care(
                eve_poc_id=get_session_data.eve_poc_id,
                eve_id=get_session_data.eve_id,
                index_of_Session=get_session_data.index_of_Session,
                srv_prof_id=get_session_data.srv_prof_id,
                actual_StartDate_Time=resch_session_date_component,
                actual_EndDate_Time=resch_session_date_component,
                start_time=resch_session_start_time_component,
                end_time=resch_session_end_time_component,
                service_cost=get_session_data.service_cost,
                amount_received=get_session_data.amount_received,
                status=1,
                remark=remark,
                Reschedule_status=1,
                last_modified_by=clgref_id
            )
            new_session.save()

            # Update the EPOC model dates
            get_sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(
                eve_id=eve_id, status=1
            )
            epoc_model = agg_hhc_event_plan_of_care.objects.get(eve_id=eve_id, status=1)

            depoc_start_date = get_sessions.aggregate(
                min_actual_StartDate_Time=Min('actual_StartDate_Time')
            )['min_actual_StartDate_Time']
            depoc_end_date = get_sessions.aggregate(
                max_actual_StartDate_Time=Max('actual_StartDate_Time')
            )['max_actual_StartDate_Time']

            epoc_model.start_date = depoc_start_date
            epoc_model.end_date = depoc_end_date
            epoc_model.last_modified_by = clgref_id
            epoc_model.save()

            return Response("Success: Record updated and new record created", status=status.HTTP_200_OK)

        except agg_hhc_detailed_event_plan_of_care.DoesNotExist:
            # Handle the case where the existing session record does not exist
            return Response("Message: Record with given session not found", status=status.HTTP_200_OK)
        except Exception as e:
            # Handle other exceptions that might occur during this process
            return Response(f"Error: {str(e)}", status=status.HTTP_500_INTERNAL_SERVER_ERROR)



        # clgref_id = get_prof(request)[3]
        # # clgref_id = 'abc'
        
        # request.data['last_modified_by'] = clgref_id
        
        # eve_id = request.data.get('eve_id')
        # session_date_str = request.data.get('session_date')
        # session_reschedule_date_str = request.data.get('reschedule_date')
        # start_time_str = request.data.get('reschedule_start_time')
        # end_time_str = request.data.get('reschedule_end_time')
        # if start_time_str and end_time_str:
        #     start_time = datetime.strptime(start_time_str, "%H:%M").time()
        #     end_time = datetime.strptime(end_time_str, "%H:%M").time()

        # session_date = datetime.strptime(session_date_str, '%Y-%m-%d')
        # session_reschedule_date = datetime.strptime(session_reschedule_date_str, '%Y-%m-%d')
    
        # session_date_component = session_date.date()
        # session_time_component = session_date.time()

        # resch_session_date_component = session_reschedule_date.date()
        # resch_session_start_time_component = start_time
        # resch_session_end_time_component = end_time

        # remark = request.data.get('remark')
  
        # try:
          
        #     get_session_data = agg_hhc_detailed_event_plan_of_care.objects.get(eve_id=eve_id,actual_StartDate_Time=session_date_component,status=1)
   
        #     get_next_session_data = agg_hhc_detailed_event_plan_of_care.objects.filter(
        #         Q(start_time__lte=resch_session_start_time_component, end_time__gte=resch_session_end_time_component) |
        #         Q(start_time__gte=resch_session_start_time_component, end_time__lte=resch_session_end_time_component), srv_prof_id = get_session_data.srv_prof_id,
        #         actual_StartDate_Time=resch_session_date_component, status=1
        #     )

        #     if get_next_session_data.exists():
        #         dtl_dates_nxt_sch = []
        #         for i in get_next_session_data:
        #             data = {
        #                 'eve_id': i.eve_id,
        #                 'eve_code': str(i.eve_id.event_code),
        #                 'session_start_date': i.actual_StartDate_Time,
        #                 'session_end_date': i.actual_EndDate_Time,
        #                 'start_time': i.start_time,
        #                 'end_time': i.end_time,
        #                 'patient_name': i.eve_id.agg_sp_pt_id.name,
        #                 'caller_name': i.eve_id.caller_id.caller_fullname,
        #                 'srv_name': i.eve_poc_id.srv_id.service_title
        #             }
        #             dtl_dates_nxt_sch.append(data)

        #         return Response({'msg': 'Professional has already a session',
        #                         'Schedule_session': dtl_dates_nxt_sch})
            
        #     get_session_data.status = 2
        #     get_session_data.save()

        #     new_session = agg_hhc_detailed_event_plan_of_care(
        #         eve_poc_id = get_session_data.eve_poc_id,
        #         eve_id = get_session_data.eve_id,
        #         index_of_Session = get_session_data.index_of_Session,
        #         srv_prof_id = get_session_data.srv_prof_id,
        #         actual_StartDate_Time = resch_session_date_component,
        #         actual_EndDate_Time = resch_session_date_component,
        #         start_time = resch_session_start_time_component,
        #         end_time = resch_session_end_time_component,
        #         service_cost = get_session_data.service_cost,
        #         amount_received = get_session_data.amount_received,
        #         status=1,
        #         remark = remark,
        #         Reschedule_status=1,
        #         last_modified_by = clgref_id
        #     )
        #     new_session.save()
            
        #     get_sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(
        #         eve_id=eve_id,
        #         status=1  
        #     )
        #     epoc_model = agg_hhc_event_plan_of_care.objects.get(eve_id=eve_id, status=1)

        #     depoc_start_date = get_sessions.aggregate(min_actual_StartDate_Time=Min('actual_StartDate_Time'))['min_actual_StartDate_Time']

        #     # Retrieve the maximum actual start date
        #     depoc_end_date = get_sessions.aggregate(max_actual_StartDate_Time=Max('actual_StartDate_Time'))['max_actual_StartDate_Time']

        #     epoc_model.start_date = depoc_start_date
        #     epoc_model.end_date = depoc_end_date
        #     epoc_model.last_modified_by = clgref_id
        #     epoc_model.save()
        #     return Response("Success: Record updated and new record created", status=status.HTTP_200_OK)

        # except agg_hhc_detailed_event_plan_of_care.DoesNotExist:
        #     # Handle the case where the existing session record does not exist
        #     return Response("Message: Record with given session not found", status=status.HTTP_200_OK)
        # except Exception as e:
        #     # Handle other exceptions that might occur during this process
        #     return Response(f"Error: {str(e)}", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ------------------ Professional Reschedule ------------------
from . models import Session_status_enum
class Professional_Reschedule_Apiview(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    serializer_class =  Prof_Reschedule_serializer

    # def get(self, request, eve_id,index_of_session):
        
    #     data = models.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=eve_id,Session_status=Session_status_enum.Pending)
    #     serializer = self.serializer_class(data, many=True)
    #     return Response(serializer.data)
    
    # def get(self, request, eve_id, index_of_session):
    def get(self, request,eve_id):
        try:
            # record =  agg_hhc_detailed_event_plan_of_care.objects.get(eve_id=eve_id, index_of_Session=index_of_session,Session_status=Session_status_enum.Pending)
            record =  agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=eve_id,Session_status=Session_status_enum.Pending,status=1)
            serializer = self.serializer_class(record, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        # except  agg_hhc_detailed_event_plan_of_care.DoesNotExist:
        #     return Response({'error': 'No record found for the given eve_id and index_of_session'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=500)




    def patch(self, request, eve_id):
        clgref_id = get_prof(request)[3]
        request.data['last_modified_by'] = clgref_id
        
        try:
            # start_date_str = request.data.get('start_date')
            # end_date_str = request.data.get('end_date')

            start_date_str = request.data.get('actual_StartDate_Time')
            end_date_str = request.data.get('actual_EndDate_Time')
            # print('hii',end_date_str)

            srv_prof_id = request.data.get('srv_prof_id')

            # Convert date strings to datetime objects
            # start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            # end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d')

            # print('ny',start_date)

            # If start_date and end_date are the same, update the specific record
            if start_date == end_date:
                # record = agg_hhc_detailed_event_plan_of_care.objects.get(
                #     eve_id=eve_id, start_date__date=start_date, end_date__date=end_date
                # )

                # record = agg_hhc_detailed_event_plan_of_care.objects.get(
                #     eve_id=eve_id, actual_StartDate_Time__date=start_date, actual_EndDate_Time__date=end_date
                # )

                record = agg_hhc_detailed_event_plan_of_care.objects.get(
                    eve_id=eve_id, actual_StartDate_Time=start_date, actual_EndDate_Time=end_date,status=1
                )
                # print(record)

                serializer = self.serializer_class(record, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
            else:
                service_professional = agg_hhc_service_professionals.objects.get(pk=srv_prof_id,status=1)

                # records_to_update = agg_hhc_detailed_event_plan_of_care.objects.filter(
                #     eve_id=eve_id, start_date__date__gte=start_date, end_date__date__lte=end_date
                # )

                # records_to_update = agg_hhc_detailed_event_plan_of_care.objects.filter(
                #     eve_id=eve_id, actual_StartDate_Time__gte=start_date, actual_EndDate_Time__date__lte=end_date
                # )
                

                records_to_update = agg_hhc_detailed_event_plan_of_care.objects.filter(
                    eve_id=eve_id, actual_StartDate_Time__gte=start_date, actual_EndDate_Time__lte=end_date,status=1
                )
               

                if not records_to_update.exists():
                    return JsonResponse({'error': 'No matching records found'}, status=404)

                records_to_update.update(srv_prof_id=service_professional, last_modified_by=clgref_id)

                
                # records_to_update.update(actual_StartDate_Time=start_date_str,
                #                          actual_EndDate_Time=end_date_str)

            return JsonResponse({'message': 'Records updated successfully'}, status=200)
        except agg_hhc_detailed_event_plan_of_care.DoesNotExist:
            return JsonResponse({'error': 'No matching session found or session is less than date'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)








# def patch(self, request, eve_id):
#         try:
            
#             start_date_str = request.data.get('actual_StartDate_Time')
#             end_date_str = request.data.get('actual_EndDate_Time')

#             srv_prof_id = request.data.get('srv_prof_id')

           
#             # start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
#             # end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()

#             if start_date_str == end_date_str:
#                 # record = agg_hhc_detailed_event_plan_of_care.objects.get(
#                 #     eve_id=eve_id, actual_StartDate_Time__date=start_date, actual_EndDate_Time__date=end_date
#                 # )

#                 record = agg_hhc_detailed_event_plan_of_care.objects.get(
#                     eve_id=eve_id, actual_StartDate_Time__date=start_date_str, actual_EndDate_Time__date=end_date_str
#                 )
#                 serializer = self.serializer_class(record, data=request.data, partial=True)
#                 if serializer.is_valid():
#                     serializer.save()
#             else:
#                 service_professional = agg_hhc_service_professionals.objects.get(pk=srv_prof_id)

#                 records_to_update = agg_hhc_detailed_event_plan_of_care.objects.filter(
#                     eve_id=eve_id, actual_StartDate_Time__gte=start_date_str, actual_EndDate_Time__date__lte=end_date_str
#                 )

#                 if not records_to_update.exists():
#                     return JsonResponse({'error': 'No matching records found'}, status=404)

#                 records_to_update.update(srv_prof_id=service_professional)

#                 records_to_update.update(actual_StartDate_Time=start_date_str,
#                                          actual_EndDate_Time=end_date_str)

#             return JsonResponse({'message': 'Records updated successfully'}, status=200)
#         except agg_hhc_detailed_event_plan_of_care.DoesNotExist:
#             return JsonResponse({'error': 'No matching session found or session is less than date'}, status=404)
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)



# -------------- Professional Allocation ----------

# class get_all_avail_professionals(APIView):
#     serializer_class =  avail_prof_serializer
#     def get(self,request,srv_id):

#         data =  agg_hhc_professional_sub_services.objects.filter(srv_id=srv_id)
#         serializer =  self.serializer_class(data,many=True)
#         return Response(serializer.data) 



#--------------------------------------cancellation service------------------

class ServiceCancellationView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    serializer_class = ServiceCancellationSerializer
    serilizer_class2 = Event_Staus
    ev_serializer_class = Event_Plan_of_Care_Staus
    def get(self, request, eve_id):
        data = agg_hhc_events.objects.get(eve_id=eve_id)
        event_serializer = self.serilizer_class2(data)

        event_plan_data = agg_hhc_event_plan_of_care.objects.get(eve_id=eve_id,status=1)
        event_plan_serializer = self.ev_serializer_class(event_plan_data)

        response_data = {
            "event_data": event_serializer.data,
            "Service_date": event_plan_serializer.data
        }

        return Response(response_data)



    def post(self, request, eve_id):
        clgref_id = get_prof(request)[3]
        
        request.data['last_modified_by'] = clgref_id

        data1 = agg_hhc_events.objects.get(eve_id=eve_id)

        print('request.data : ',request.data)
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# ----------------------- session Cancellation ------------------

class get_session_data(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    serializer_class = get_event_data_for_canc_session
    def get(self, request, eve_id,sub_srv_id, start_date_time, end_date_time):
        try:
            epoc_model = agg_hhc_event_plan_of_care.objects.get(eve_id=eve_id, status=1)

            get_total_cancel_sessions_now = agg_hhc_detailed_event_plan_of_care.objects.filter(
                eve_id=eve_id,
                actual_StartDate_Time__gte=start_date_time,
                actual_EndDate_Time__lte=end_date_time,
                status=1
            ).count()

            # get_sub_srv_data = agg_hhc_sub_services.objects.get(recommomded_service=epoc_model.sub_srv_id)
            get_sub_srv_data = agg_hhc_sub_services.objects.get(sub_srv_id=sub_srv_id)
            
            
            per_session_amt = get_sub_srv_data.cost
            total_cancel_amt = per_session_amt * get_total_cancel_sessions_now

            return Response(total_cancel_amt, status=status.HTTP_200_OK)

        except agg_hhc_event_plan_of_care.DoesNotExist as e:
            return JsonResponse({'error': 'Event plan of care does not exist'}, status=404)
        except agg_hhc_sub_services.DoesNotExist as e:
            return JsonResponse({'error': 'Sub services data does not exist'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

from django.db.models import Min, Max, Sum, Value
from django.db.models.functions import Coalesce

class SessionCancellationView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    serializer_class = get_dtl_epoc_data_for_canc_session
    serializer_class2 = post_in_cancellation_history
    def post(self, request):
        clgref_id = get_prof(request)[3]
        
        request.data['last_modified_by'] = clgref_id

        eve_id = request.data.get('eve_id')
        # actual_start_date_time = request.data.get('actual_StartDate_Time')
        start_date_time = request.data.get('start_date_time')
        end_date_time = request.data.get('end_date_time')
        sub_srv_id = request.data.get('sub_srv_id')
        remark = request.data.get('remark')

        # if eve_id is None or actual_start_date_time is None:
        if eve_id is None or start_date_time is None:
            return Response({'error': 'Please provide eve_id and start_date_time'}, status=status.HTTP_200_OK)
    

        get_event_data = agg_hhc_events.objects.get(eve_id=eve_id, status=1)
            # print(get_event_data)
        epoc_model = agg_hhc_event_plan_of_care.objects.get(eve_id=eve_id, status=1)
        try:
            # if start_date_time != end_date_time:
            if end_date_time:
                
                record = agg_hhc_detailed_event_plan_of_care.objects.filter(
                    eve_id=eve_id,
                    actual_StartDate_Time__range=(start_date_time, end_date_time),status=1
                )
                active_sessionns = agg_hhc_detailed_event_plan_of_care.objects.filter(
                    eve_id=eve_id,
                    status=1
                )
                if record.count() == active_sessionns.count():
                    return Response({'msg': "Don't cancel the entire session.If you want to cancel the entire session, please use the Service Cancellation option."}, status=status.HTTP_200_OK)
                
                closuer_data = record.filter(Session_jobclosure_status=1)
                if closuer_data.exists():
                    closure_dates = []
                    for cl_date in closuer_data:
                        closure_dates.append((cl_date.actual_StartDate_Time).strftime('%Y-%m-%d'))
                    return Response({
                        'date': closure_dates,
                        'msg':f"Do not close the sessions, because job closure is done for that day."
                        }, status=status.HTTP_200_OK)
                
           
        except agg_hhc_detailed_event_plan_of_care.DoesNotExist:
            return Response({'error': 'Record not found'}, status=status.HTTP_200_OK)
        except agg_hhc_events.DoesNotExist:
            return Response({'error': 'agg_hhc_events Record not found'}, status=status.HTTP_200_OK)
        except agg_hhc_event_plan_of_care.DoesNotExist:
            return Response({'error': 'agg_hhc_event_plan_of_care Record not found'}, status=status.HTTP_200_OK)

        

        # epoc_model.initail_final_amount = get_event_data.final_amount
        # epoc_model.save() # for initial amount saving.
        get_total_dtl_sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(
                eve_id=eve_id,
                status = 1
        )


        get_total_cancel_sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(
                eve_id=eve_id,
                # actual_StartDate_Time = start_date_time,
                # actual_EndDate_Time = end_date_time,
                actual_StartDate_Time__range=(start_date_time, end_date_time),
                status = 1
        )

        get_total_wout_cancel_session = agg_hhc_detailed_event_plan_of_care.objects.filter(
                eve_id=eve_id,
                status = 1
        ).exclude(actual_StartDate_Time__range=(start_date_time, end_date_time))

        get_sub_srv_data = agg_hhc_sub_services.objects.get(sub_srv_id=sub_srv_id)
        per_session_amt = int(get_sub_srv_data.cost)
        print(per_session_amt,'per_session_amt')
        
        get_total_cancel_sessions_now = get_total_cancel_sessions.count() * per_session_amt
        wout_cancel_ses = get_total_wout_cancel_session.count() * per_session_amt
        print(get_total_cancel_sessions_now,'get_total_cancel_sessions_now')
        print(wout_cancel_ses,'wout_cancel_ses')

        con_charge = get_total_cancel_sessions.aggregate(total_convinance_charges=Coalesce(Sum('convinance_charges'), Value(0)))['total_convinance_charges']
        con_chrg_wot_cancl = get_total_wout_cancel_session.aggregate(total_convinance_charges=Coalesce(Sum('convinance_charges'), Value(0)))['total_convinance_charges']
        print(con_charge,'con_charge')
        print(con_chrg_wot_cancl,'con_chrg_wot_cancl')

        eve_total_cost = get_event_data.Total_cost
        print(eve_total_cost,'eve_total_cost')

        cancl_ses_amt = (eve_total_cost - get_total_cancel_sessions_now) + con_charge
        wout_cancl_ses_amt = eve_total_cost - wout_cancel_ses

        print(cancl_ses_amt,'cancl_ses_amt')
        print(wout_cancl_ses_amt,'wout_cancl_ses_amt')

        disc_type = get_event_data.discount_type
        disc_value = get_event_data.discount_value

        if disc_value is not None:
            disc_value = Decimal(disc_value)
            # print(disc_value)
        else:
            disc_value = 0

        # disc_value = Decimal(disc_value)
        # print(disc_value)

        # if disc_type == 1:
        #     discounted_amt_wout_cncel = int((disc_value/100)*wout_cancl_ses_amt)

        # elif disc_type == 2:
        #     discounted_amt_wout_cncel = int(wout_cancl_ses_amt - disc_value)
            
        # else:
        #     discounted_amt_wout_cncel = int(wout_cancl_ses_amt)

        
        # with_con_chrg = discounted_amt_wout_cncel + con_chrg_wot_cancl

        if disc_type == 1:
            discounted_amt_wout_cncel = int(((disc_value)/100)*int(wout_cancel_ses))

        elif disc_type == 2:
            # discounted_amt_wout_cncel = int(disc_value)
            # sess_cnt_dtl = get_total_dtl_sessions.count()
            sess_cnt_dtl = int(get_total_dtl_sessions.count()) - int(record.count())
            total_disc_amt = disc_value/sess_cnt_dtl
            toal_disc_value_amt = (int(get_total_wout_cancel_session.count())*total_disc_amt)
            discounted_amt_wout_cncel = round(toal_disc_value_amt)


        else:
            discounted_amt_wout_cncel = 0
        
        discounted_amt_wout_cncel1 = int(wout_cancel_ses) - discounted_amt_wout_cncel

        
        with_con_chrg = discounted_amt_wout_cncel1 + con_chrg_wot_cancl

        final_amt_w_con_charge = discounted_amt_wout_cncel1 + con_chrg_wot_cancl
        print(final_amt_w_con_charge,'final_amt_w_con_charge')
      
        get_event_data.final_amount = final_amt_w_con_charge
        

        get_event_data.last_modified_by = clgref_id
        # get_event_data.Total_cost = wout_cancel_ses
        get_event_data.save()




        

        # ongoing_ses_amt = per_session_amt * wout_cancel_ses

        # disc_type = get_event_data.discount_type
        # disc_value = get_event_data.discount_value

        # if disc_type == 1:
        #     discounted_amt_wout_cncel = int((disc_value/100)*ongoing_ses_amt)

        # elif disc_type == 2:
        #     discounted_amt_wout_cncel = int(ongoing_ses_amt - disc_value)
            
        # else:
        #     discounted_amt_wout_cncel = int(ongoing_ses_amt)
        

        # get_total_cancel_sessions_now = get_total_cancel_sessions.count()
        # con_charge = get_total_cancel_sessions.aggregate(total_convinance_charges=Sum('convinance_charges'))['total_convinance_charges']

        # con_charge = get_total_cancel_sessions.aggregate(total_convinance_charges=Coalesce(Sum('convinance_charges'), Value(0)))['total_convinance_charges']

        # con_chrg_wot_cancl = get_total_wout_cancel_session.aggregate(total_convinance_charges=Coalesce(Sum('convinance_charges'), Value(0)))['total_convinance_charges']

        if con_charge is None:
            con_charge = 0
        
        if con_chrg_wot_cancl is None:
            con_chrg_wot_cancl = 0

        
        # print(epoc_model.sub_srv_id)
        # get_sub_srv_data = agg_hhc_sub_services.objects.get(recommomded_service=epoc_model.sub_srv_id)
            
        # get_sub_srv_data = agg_hhc_sub_services.objects.get(sub_srv_id=sub_srv_id)
        # per_session_amt = int(get_sub_srv_data.cost)
            
        # per_session_amt = 100
        total_cancel_amt = int(per_session_amt * get_total_cancel_sessions_now)



        # print(get_total_sessions)
        # per_session_amt = get_event_data.final_amount/get_total_sessions
        
        f_amount  = int(get_event_data.final_amount - total_cancel_amt)
        print(con_charge)
        amount = int(f_amount - con_charge)

        # final_amt_w_con_charge = discounted_amt_wout_cncel + con_chrg_wot_cancl
        # print(final_amt_w_con_charge,'final_amt_w_con_charge')
        # # print(amount)
        # # get_event_data.final_amount = amount
        # # get_event_data.final_amount = final_amt_w_con_charge
        # get_event_data.final_amount = final_amt_w_con_charge
        

        # get_event_data.last_modified_by = clgref_id
        # get_event_data.save() # for saving cancelled sessions diffrence amount.

         
        get_payment_status = agg_hhc_payment_details.objects.filter(eve_id = eve_id, 
                                                                    overall_status = 'SUCCESS', 
                                                                    status = 1)
        if get_payment_status.count() != 0:
            sesson_amt = per_session_amt
        else:
            sesson_amt = 0

        dtl_ids = []
        for dtl_id in record:
            con_chrg_fron_dtl = agg_hhc_detailed_event_plan_of_care.objects.get(agg_sp_dt_eve_poc_id = dtl_id.agg_sp_dt_eve_poc_id)
            cancel_history = {
                'event_id': eve_id,
                'cancellation_by': request.data.get("cancellation_by"),
                'can_amt': sesson_amt,
                'convineance_chrg':con_chrg_fron_dtl.convinance_charges,
                'remark': remark,
                'agg_sp_dt_eve_poc_id':dtl_id.agg_sp_dt_eve_poc_id,
                'reason': request.data.get('reason'),
                'last_modified_by': clgref_id
            }
            serialized2_data = self.serializer_class2(data=cancel_history)  

            if serialized2_data.is_valid():
                serialized2_data.save()
            else:
                return Response(serialized2_data.errors, status=status.HTTP_400_BAD_REQUEST)
            
        for records in record:
            records.status = 2
            records.is_cancelled = 1
            records.remark = remark 
            records.last_modified_by = clgref_id
            records.save()
        

        get_sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(
            eve_id=eve_id,
            status=1  
        )

        depoc_start_date = get_sessions.aggregate(min_actual_StartDate_Time=Min('actual_StartDate_Time'))['min_actual_StartDate_Time']

        # Retrieve the maximum actual start date
        depoc_end_date = get_sessions.aggregate(max_actual_StartDate_Time=Max('actual_StartDate_Time'))['max_actual_StartDate_Time']

        epoc_model.start_date = depoc_start_date
        epoc_model.end_date = depoc_end_date
        epoc_model.last_modified_by = clgref_id
        
        epoc_model.save()
      
        event_cost_data = agg_hhc_events.objects.get(eve_id=eve_id, status=1)
        event_cost_data.Total_cost = int(get_sessions.count()*per_session_amt)
        event_cost_data.save()

        # event_dt = agg_hhc_events.objects.get(eve_id=eve_id)
        # event_dt.final_amount = amount

        # record.status = 2
        # record.remark = remark 
        # record.save() # for inactive status in detail plan of care

        



        # cancel_history = {
        #     'event_id': eve_id,
        #     'cancellation_by': request.data.get("cancellation_by"),
        #     'can_amt': per_session_amt,
        #     'remark': remark,
        #     'reason': request.data.get('reason'),
        #     'last_modified_by': clgref_id
        # }
        # serialized2_data = self.serializer_class2(data=cancel_history)  

        # if serialized2_data.is_valid():
        #     serialized2_data.save()
        # else:
        #     return Response(serialized2_data.errors, status=status.HTTP_400_BAD_REQUEST)



        serialized_data = self.serializer_class(record).data

        data = {
            'dtl_data': serialized_data,
            'cancel_data': serialized2_data.data
        }

        
        return Response({"msg":"ok"}, status=status.HTTP_200_OK)
        






# ------------------------------------- Professional Availibilty for cancellation according to srv id -------------------
class get_all_avail_professionals(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    serializer_class = avail_prof_serializer
    

    def get(self, request, sub_srv_id, actual_StartDate_Time, actual_EndDate_Time):
    
        srv_prof_data = agg_hhc_professional_sub_services.objects.filter(sub_srv_id=sub_srv_id)

      
        srv_prof_ids = srv_prof_data.values_list('srv_prof_id', flat=True)

        existing_records = agg_hhc_detailed_event_plan_of_care.objects.filter(
            srv_prof_id__in=srv_prof_ids,
            actual_StartDate_Time__gte=actual_StartDate_Time,
            actual_EndDate_Time__lte=actual_EndDate_Time
        )

        if existing_records.exists():
            existing_srv_prof_ids = existing_records.values_list('srv_prof_id', flat=True)
        
        # Exclude existing records from srv_prof_data
            srv_prof_data = srv_prof_data.exclude(srv_prof_id__in=existing_srv_prof_ids)
            # return Response({"message": "At least one srv_prof_id found in agg_hhc_detailed_event_plan_of_care"},
            #                 status=status.HTTP_200_OK)

        if not srv_prof_data.exists():
            return Response({'msg': "Professional Not Available"}, status=status.HTTP_200_OK)
        serializer = self.serializer_class(srv_prof_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ----- ----------------------------------------------------------------------
class add_convinance_charges(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]  
    # def calculate_distance(self,lat1, lon1, lat2, lon2):
    #     radius = 6371.0
    #     lat1 = radians(lat1)
    #     lon1 = radians(lon1)
    #     lat2 = radians(lat2)
    #     lon2 = radians(lon2)
    #     dlon = lon2 - lon1
    #     dlat = lat2 - lat1
    #     a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    #     c = 2 * atan2(sqrt(a), sqrt(1 - a))
    #     distance = radius * c
    #     print(distance, ';;dfga;;')
    #     final_distance=0
    #     if distance >5:
    #         final_distance=ceil((distance-5)/3)
    #     return final_distance

# ---------------------------------------------------------------------------------------
    def calculate_distance(self, lat1, lon1, lat2, lon2):
        # earth_radius = 6371
        # lat1_rad = radians(lat1)
        # lon1_rad = radians(lon1)
        # lat2_rad = radians(lat2)
        # lon2_rad = radians(lon2)
        # dlon = lon2_rad - lon1_rad
        # dlat = lat2_rad - lat1_rad

        # a = sin(dlat / 2)**2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon / 2)**2
        # c = 2 * atan2(sqrt(a), sqrt(1 - a))
        # distance = earth_radius * c

        # # If the distance is less than or equal to 5 km, set final_distance to 0
        # if distance <= 5:
        #     final_distance = 0
        # else:
        #     # Calculate the final distance based on your formula
        #     final_distance = ceil((distance - 5) / 3)

        # return final_distance
        googel_client=googlemaps.Client(key=GOOGLE_KEY)
        now=datetime.now()
        # source='18.502000,73.832200'
        source=f'{lat2},{lon2}'
        destination=f'{lat1},{lon1}'
        direction_result=googel_client.directions(source, destination, mode='driving', avoid='ferries', departure_time=now, transit_mode='bus')
        distance=float(direction_result[0]['legs'][0]['distance']['text'].split(' ')[0].replace(',',''))
        print((float(direction_result[0]['legs'][0]['distance']['text'].split(' ')[0].replace(',',''))))
        final_distance=0
        if distance >5:
            final_distance=ceil((distance-5)/3)
        return final_distance
# ---------------------------------------------------------------------------------------
    

    # def get(self, request, eve_id):
    #         events = agg_hhc_events.objects.get(eve_id=eve_id)
    #         # print(events)
    #         event_poc = agg_hhc_event_plan_of_care.objects.filter(eve_id=eve_id,status=1).first()
    #         # print(event_poc,'dddd')
    #         try:    
    #             p_lat=events.agg_sp_pt_id.lattitude
    #             p_long=events.agg_sp_pt_id.langitude
    #             h_lat=18.502230
    #             h_long=73.831780
    #             distance=ceil(self.calculate_distance(p_lat,p_long,h_lat,h_long))
    #             day_convinance = distance*50
    #             s_date=event_poc.start_date
    #             e_date=event_poc.end_date
    #             # cost = events.Total_cost
    #             day = (e_date - s_date).days

    #             # total = (cost)*(day+1)
    #             total_convinance = (day_convinance)*(day+1)
    #             Total_cost = events.Total_cost
    #             final_cost = Total_cost+total_convinance
    #             data = {
    #                 "day_convinance":day_convinance,
    #                 "total_convinance":total_convinance,
    #                 "Total_cost":int(Total_cost),
    #                 "final_cost":int(final_cost)
    #             }
    #         except agg_hhc_patients.DoesNotExist():
    #             return None
    #         return Response(data)
# ===================================== prof wise day_convinance ==========================================================================

    def get(self, request, eve_id, prof_id):
            events = agg_hhc_events.objects.get(eve_id=eve_id)
            # print(events)
            # prof= agg_hhc_service_professionals.objects.filter(srv_prof_id=prof_id).last()
            event_poc = agg_hhc_event_plan_of_care.objects.filter(eve_id=eve_id,status=1).first()
            # print(event_poc,'dddd')
            try:    
                p_lat=events.agg_sp_pt_id.lattitude
                p_long=events.agg_sp_pt_id.langitude
                # try:
                #     prof = agg_hhc_service_professionals.objects.get(srv_prof_id=prof_id)
                #     h_lat=prof.lattitude
                #     h_long=prof.langitude
                # except agg_hhc_service_professionals.DoesNotExist:
                #     print('professional has no lat, long passed')
                # #     return Response('professional has no lat, long passed')
                # if prof.langitude is not None and prof.lattitude is not None:
                #     h_long=prof.langitude
                #     h_lat=prof.lattitude
                # else:
                h_lat=18.502230
                h_long=73.831780
                # print(prof.langitude)
                distance=ceil(self.calculate_distance(p_lat,p_long,h_lat,h_long))
                print(distance,'distance,,,,,,,,,,,,,,,')
                day_convinance = distance*80
                # s_date=event_poc.start_date
                # e_date=event_poc.end_date
                # cost = events.Total_cost
                # day = (e_date - s_date).days

                # total = (cost)*(day+1)
                # total_convinance = (day_convinance)*(day+1)
                # Total_cost = events.Total_cost
                # final_cost = Total_cost+total_convinance
                data = {
                    "day_convinance":day_convinance,
                    # "total_convinance":total_convinance,
                    # "Total_cost":int(Total_cost),
                    # "final_cost":int(final_cost)
                }
            except agg_hhc_patients.DoesNotExist:
                return None
            return Response(data)

# ===================================== prof wise day_convinance ==========================================================================
    

# This is allocation api .     
class allocate_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self,request):
        clgref_id = get_prof(request)[3]
        
        request.data['last_modified_by'] = clgref_id

        professional_id=request.data.get('srv_prof_id')
        try:
            event_id=agg_hhc_events.objects.get(eve_id=request.data.get('eve_id'),status=1)
            event_serializer=agg_hhc_updateIDs_event_serializer(event_id)

            event_id_is=event_serializer.data.get('eve_id')
            caller_id_is=event_serializer.data.get('caller_id')
            patient_id_is=event_serializer.data.get('agg_sp_pt_id')
        except:
            return Response({'message':'event not found'},status=404)
        try:
            service_id=agg_hhc_services.objects.get(srv_id=request.data.get('srv_id'))
        except:
            return Response({'message': 'Service not found'}, status=404)
        try:
            professional_instance = agg_hhc_service_professionals.objects.get(srv_prof_id=professional_id)
        except agg_hhc_service_professionals.DoesNotExist:
            return Response({'message': 'Professional not found'}, status=404)
        try:
            event_plan_of_care=agg_hhc_event_plan_of_care.objects.filter(eve_id=event_id).first()
            
        except agg_hhc_event_plan_of_care.DoesNotExist:
            return Response({'message': 'event_plan_of_care does not found'}, status=404)
        event_plan_of_care_serializer=agg_hhc_event_plan_of_care_serializer(event_plan_of_care)
        event_plan_of_care_id_is=event_plan_of_care_serializer.data.get('eve_poc_id')
        event_plan_of_care.srv_prof_id=professional_instance##professional_instance.srv_prof_id #to update and save new field here
        event_plan_of_care.last_modified_by = clgref_id
        event_plan_of_care.save()
        try:
            detailed_event_poc=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=request.data.get('eve_id'),status=1)
            # print("detailed event plan of care",detailed_event_poc)
        except:
            return Response({'message':"detailed_event_plan_of_care not found"},status=404)
        for i in detailed_event_poc:
            if i.srv_prof_id!=None:
                return Response({'message':'professional already Allocated','date':i.actual_StartDate_Time},status=404)
            i.srv_prof_id=professional_instance
            # i.is_convinance = request.data['is_convinance']
            # i.convinance_charges = day_convinance
            i.status=1
            i.last_modified_by=clgref_id
            i.save()
        event_id.event_status=2
        event_id.status=1
        event_id.last_modified_by=clgref_id
        event_id.save()
        if request.data.get('andriod_status')==1:
            Notificationlist=NotificationList.objects.filter(is_active=True,is_accepted=False,noti_id=request.data.get('noti_id'))
            for i in Notificationlist:
                i.is_active=False
                i.is_accepted=True
                i.accepted_by=professional_instance
                i.last_modified_by=clgref_id
                i.save()
                # print("we are working on andriod api ")
        return Response({'eve_id':event_id_is,'caller_id_is':caller_id_is,'agg_sp_pt_id':patient_id_is,'eve_poc_id':event_plan_of_care_id_is,'message':'professional Allocated sucessfully'})




class conveniance_charges_count(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,start_date,end_date,conve_charge):
        try:
            record=date.fromisoformat(start_date)
            print("record")
            print(record)
            if(start_date==end_date):
                conve_charge=conve_charge
            else:
                print(start_date,type(start_date))
                first_date = date.fromisoformat(start_date)
                last_date= date.fromisoformat(end_date)
                print(first_date)
                if(first_date<last_date):
                    first_date,last_date=last_date,first_date
                count=first_date-last_date
                conve_charge=(int(count.days)+1)*conve_charge
            return Response ({'conve_charge':conve_charge})
        except Exception as e:
            return Response({'error':'Invalid date format'})#,status=Http404)





def dates_list(start_date,end_date):
        # print((start_date))
        # print(start_date, ';;;;;;;;;;;;;;')
        # print(end_date, ';;;;;;;;;;;;;;')
        lst=[]
        first_date=date.fromisoformat(start_date)
        last_date=date.fromisoformat(end_date)
        base_date=first_date
        count=last_date-first_date
        count=count.days
        lst.append(str(base_date))
        for k in range(1,int(count)+1):
            s=str(base_date + timedelta(days=k))
            lst.append(s)
        return lst


def date_function(record):
    dictionary={}
    for i in record:
        list=record[str(i)]
        list.pop()
        if(list[0]==list[-1]):
            # print("single day service")
            list.pop()
            # print(list)
            dictionary[i]=list
        else:
            # print("multiple day service ")
            first_date=date.fromisoformat(list[0])
            last_date=date.fromisoformat(list[-1])
            base_date=first_date
            if(first_date<last_date):
                first_date,last_date=last_date,first_date
            count=first_date-last_date
            count=count.days
            for k in range(1,int(count)+1):
                s=str(base_date + timedelta(days=k))
                if(2<=k):
                    list.append(s)
                list[k]=s
            dictionary[i]=list
    return dictionary
    # print(dictionary)
        #print(i,"this is professional",k,"this is date")

from hhcspero.settings import AUTH_KEY
def send_otp(mobile,msg):
    url=(f"https://wa.chatmybot.in/gateway/waunofficial/v1/api/v1/sendmessage?access-token={AUTH_KEY}&phone={mobile}&content={msg}&fileName&caption&contentType=1")
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for 4xx and 5xx status codes
    except requests.exceptions.RequestException as e:
        print("Error occurred while hitting the URL:", e)
        return e




# class multiple_allocate_api(APIView):
#     renderer_classes = [UserRenderer]
#     permission_classes = [IsAuthenticated]
#     def post(self,request):
#         print('w3r')
#         clgref_id = get_prof(request)[3]
#         request.data['last_modified_by'] = clgref_id
#         # try:
#         event_id=agg_hhc_events.objects.get(eve_id=request.data.get('eve_id'),status=1)
#         event_serializer=agg_hhc_updateIDs_event_serializer(event_id)
#         event_id_is=event_serializer.data.get('eve_id')
#         caller_id_is=event_serializer.data.get('caller_id')
#         patient_id_is=event_serializer.data.get('agg_sp_pt_id')
#         # except Exception as e:
#         #     return Response({'message':str(e)},status=404)
#         srv_prof_date_and_id_list=request.data.get('srv_prof_date_and_id')
#         # print(srv_prof_date_and_id_list.values())
#         # print(srv_prof_date_and_id_list)
#         # ==========================================================================================================
#         # ==========================================================================================================
#         all_dates=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=event_id_is, status=1).values_list('actual_StartDate_Time',flat=True)
#         d=[l[0] for l in srv_prof_date_and_id_list.values()]
#         dates1=[]
#         for x in d:
#             dates1+=x
#         dictionary=[]
#         for i in dates1:
#             # i=i.split(',')
#         #     print(i, 'aSDF')
#         # i=dates1
#             all_dates1 = dates_list(i[0],i[1])
#             dictionary+=all_dates1
#         # print(dates1)
#         # print(dictionary)
#         dictionary = [datetime.strptime(date_str, '%Y-%m-%d').date() for date_str in dictionary]
#         # print(dictionary)
#         # print(all_dates)
#         if(int(len(all_dates))==len(dictionary)):
#             print(all_dates, 'all_dates.................')
#             print(dictionary, 'dictionary.................')
#             for i in all_dates:
#                 if i in dictionary:
#                     pass
#                 else:
#                     # print(i, 'asdf')
#                     return Response({'message':'Select proper dates'})
#         else:
#             # print(len(dictionary))
#             # print(int(len(all_dates)))
#             return Response({'message':'Select proper dates'})
#         # print('1')
#         detailed_event_poc_round=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=request.data.get('eve_id'),status=1)
#         for j in dictionary:
#             detailed_event_poc=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=request.data.get('eve_id'),actual_StartDate_Time=j,status=1).first()
#             if(detailed_event_poc.srv_prof_id!=None):
#                 # date={}
#                 date_list=[]
#                 for dates in detailed_event_poc_round:
#                     if(dates.srv_prof_id!=None):
#                         # date[j]=str(dates.actual_StartDate_Time)
#                         date_list.append(str(dates.actual_StartDate_Time))
#                 return Response({'message':'professional already Allocated','date':date_list},status=404)
#         # print('2')
#         for prof, dates in srv_prof_date_and_id_list.items():
#             # print(dates[0], 'lk')
#             prof_dates=dates[0]
#             dates1=[]
#             # print(prof_dates, 'dates')
#             # for x in prof_dates:
#             #     print(x)
#             #     dates1+=x
#             dictionary=[]
#             for i in prof_dates:
#             #     print(i)
#             # i=prof_dates
#                 # i=i[0].split(',')
#                 # print(i, 'aSDF')
#                 all_dates1 = dates_list(i[0],i[1])
#                 dictionary+=all_dates1
#             professional=None
#             try:
#                 professional=agg_hhc_service_professionals.objects.get(srv_prof_id=int(prof)) 
#                 # professional=agg_hhc_service_professional_serializer(professional)
#             except:
#                 return Response({'message':'professional not found'},status=404)
#                             # print("this is professional id",professional.request.data.get('srv_prof_id'))
#             print(professional, '..........')
#             if professional:
#                 # prof_mo=professional.clg_ref_id.clg_Work_phone_number
#                 base_url = "xl6mjq.api-in.infobip.com"
#                 api_key = "af099554a7f804d8fd234e3226241101-da0d6970-19a8-4e0a-9154-9da1fb64d858"  # Replace with your actual API key
#                 # from_number = "918956193883"
#                 # template_name = "professional_name_sms"
#                 # order_id = "SPERO_W_ID" + timezone.now().strftime("%d%m%Y%H%M%S")
#                 pt=agg_hhc_patients.objects.filter(agg_sp_pt_id=patient_id_is, status=1).last()
#                 payload = json.dumps({
#                     "messages": [
#                         {
#                             "from": "918956193883",
#                             "to": f'91{professional.clg_ref_id.clg_Work_phone_number}',
#                             "messageId": "SPERO_W_ID" + timezone.now().strftime("%d%m%Y%H%M%S"),
#                             "content": {
#                                 "templateName": "professional_name_sms",
#                                 "templateData": {
#                                     "body": {
#                                         "placeholders": [
#                                             professional.prof_fullname,
#                                             pt.name,
#                                             pt.caller_id.phone,
#                                             pt.phone_no,
#                                             pt.address,
#                                             detailed_event_poc.eve_id.event_code,
#                                             detailed_event_poc.eve_poc_id.srv_id.service_title,
#                                             detailed_event_poc.eve_poc_id.sub_srv_id.recommomded_service,
#                                             f'{detailed_event_poc.eve_poc_id.start_date} to {detailed_event_poc.eve_poc_id.end_date}',
#                                             f'{detailed_event_poc.eve_poc_id.start_time} to {detailed_event_poc.eve_poc_id.end_time}'
#                                         ]
#                                     },                   
#                                 },
#                                 "language": "en"
#                             }
#                         }
#                     ]
#                 })
#                 headers = {
#                     'Authorization': f'App {api_key}',
#                     'Content-Type': 'application/json',
#                     'Accept': 'application/json'
#                 }

#                 conn = http.client.HTTPSConnection(base_url)
#                 conn.request("POST", "/whatsapp/1/message/template", payload, headers)
#                 res = conn.getresponse()
#                 data = res.read()
#                 conn.close()
#                 print('yes')
#             print(dictionary, 'dictionary')
#             for j in dictionary:
#                 detailed_event_poc=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=request.data.get('eve_id'),actual_StartDate_Time=j,status=1).first()
#                 detailed_event_poc.convinance_charges=int(dates[1])
#                 detailed_event_poc.is_convinance=True
                
#                 detailed_event_poc.srv_prof_id=professional#.srv_prof_id
#                 detailed_event_poc.status=1
#                 detailed_event_poc.last_modified_by=clgref_id
#                 detailed_event_poc.save()
#                 event_id.event_status=2
#                 event_id.status=1
#                 event_id.last_modified_by=clgref_id
#                 event_id.save()
        
#         event_plan_care=agg_hhc_event_plan_of_care.objects.get(eve_id=event_id, status=1)

#         try:
#             msg = f"Dear  {professional.prof_fullname}\n\n Patient : {event_id.agg_sp_pt_id.name} \n\n Caller No: {event_id.caller_id.caller_fullname}\n Mob No: {event_id.agg_sp_pt_id.phone_no}\n\n Address: {event_id.agg_sp_pt_id.address}\n\n Event No:{event_id.event_code}\n Service : {event_plan_care.srv_id.service_title} \nSub-Service : {event_plan_care.sub_srv_id.recommomded_service}\n\n Date: {prof_dates} \n\n Reporting time: {event_plan_care.start_time}\n\n Message: Attend call\n\nSpero"
#             # send_otp(service_professional.phone_no,msg)
#             # print(msg)
#         except:
#             pass
# #         # ==========================================================================================================
# #         # ==========================================================================================================
# #         conve_list=[]
# #         for i in srv_prof_date_and_id_list:
# #             if(srv_prof_date_and_id_list[i][-1]=="yes"):
# #                 conve_list.append(int(i))
# # #--------------------------------------------------------------------------------------message to professional start -------------------------------------
# #             service_professional=agg_hhc_service_professionals.objects.get(srv_prof_id=int(i))
# #             service_start_date=srv_prof_date_and_id_list[i][0]
# #             service_end_date=srv_prof_date_and_id_list[i][1]
# #             event_plan_care=agg_hhc_event_plan_of_care.objects.get(eve_id=event_id)
# #             try:
# #                 msg = f"Dear  {service_professional.prof_fullname}\n\n Patient : {event_id.agg_sp_pt_id.name} \n\n Caller No: {event_id.caller_id.caller_fullname}\n Mob No: {event_id.agg_sp_pt_id.phone_no}\n\n Address: {event_id.agg_sp_pt_id.address}\n\n Event No:{event_id.event_code}\n Service : {event_plan_care.srv_id.service_title} \nSub-Service : {event_plan_care.sub_srv_id.recommomded_service}\n\n Date: {service_start_date} to {service_end_date}\n\n Reporting time: {event_plan_care.start_time}\n\n Message: Attend call\n\nSpero"
# #                 # send_otp(service_professional.phone_no,msg)
# #             except:
# #                 pass
# # #--------------------------------------------------------------------------------------message to professional end -------------------------------------
# #         # conve_list=request.data.get('conve_list')
# #         # dictionary=date_function(srv_prof_date_and_id_list)
# #         # [print(l[0], 'hg') for l in srv_prof_date_and_id_list.values()]
# #         # dates11=[k[0] for k in srv_prof_date_and_id_list.values()]
# #         # [[['2024-04-08, 2024-04-09'], ['2024-03-10, 2024-03-10']], [['2024-03-11, 2024-03-11']]]
# #         # dates1=[item for sublist in dates11 for sublist2 in sublist for item in sublist2]
# #         d=[l[0] for l in srv_prof_date_and_id_list.values()]
# #         dates1=[]
# #         for x in d:
# #             dates1+=x
# #         # print(dates1)
# #         # print(dates1, ',jyf')
# #         # print(len(dates1[0]), ',jyf1')
# #         dictionary=[]
# #         for i in dates1:
# #             i=i[0].split(',')
# #             all_dates1 = dates_list(i[0],i[1][1:])
# #             dictionary+=all_dates1
# #         # print(dates1)
# #         # dictionary=[element for sublist in dates1 for element in sublist]
# #         print(dictionary)
# #         # print(len(dictionary))
# #         # all_dates=dates_list(request.data.get('start_date'),request.data.get('end_date'))
# #         all_dates=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=event_id_is, status=1).values_list('actual_StartDate_Time',flat=True)
# #         date_count=0
# #         # for i in dictionary:
# #         #     date_count+=int(len(dictionary[str(i)]))
# #         dictionary = [datetime.strptime(date_str, '%Y-%m-%d').date() for date_str in dictionary]
# #         # print(dictionary)
# #         # print(all_dates)
# #         # print(len(dictionary))
# #         # print(int(len(all_dates)))
# #         if(int(len(all_dates))==len(dictionary)):
# #             for i in all_dates:
# #                 if i in dictionary:
# #                     pass
# #                 else:
# #                     print(i, 'asdf')
# #                     return Response({'message':'Select proper dates1'})
# #         else:
# #             print(len(dictionary))
# #             print(int(len(all_dates)))
# #             return Response({'message':'Select proper dates2'})
        
# #         # print("hi i am ",dictionary)
# #         # for i in dictionary:
# #         #     list=dictionary[str(i)]
# #         #     for j in list:
# #         #         detailed_event_poc=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=request.data.get('eve_id'),actual_StartDate_Time=j,status=1).first()
# #         #         if(detailed_event_poc.srv_prof_id!=None):
# #         #             detailed_event_poc_round=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=request.data.get('eve_id'),status=1)
# #         #             # date={}
# #         #             date_list=[]
# #         #             for dates in detailed_event_poc_round:
# #         #                 if(dates.srv_prof_id!=None):
# #         #                     # date[j]=str(dates.actual_StartDate_Time)
# #         #                     date_list.append(str(dates.actual_StartDate_Time))
# #         #             return Response({'message':'professional already Allocated','date':date_list},status=404)
# #         #         if(int(i) in conve_list):
# #         #             detailed_event_poc.convinance_charges=int(request.data.get('conve_charge'))
# #                        # detailed_event_poc.is_convinance=True
# #         #             event_id.final_amount+=int(request.data.get('conve_charge'))
# #         #             event_id.save()
# #         #         try:
# #         #             professional=agg_hhc_service_professionals.objects.get(srv_prof_id=int(i))
# #         #             # professional=agg_hhc_service_professional_serializer(professional)
# #         #         except:
# #         #             return Response({'message':'professional not found'},status=404)
# #         #         # print("this is professional id",professional.request.data.get('srv_prof_id'))
# #         #         detailed_event_poc.srv_prof_id=professional#.srv_prof_id
# #         #         detailed_event_poc.status=1
# #         #         detailed_event_poc.last_modified_by=clgref_id
# #         #         detailed_event_poc.save()
# #                 # print(i,"this is professional",j,"this is date")
# #     # ===========================================================================================================
# #         # list(srv_prof_date_and_id_list.items())[1]
        
# #         print("hi i am ",srv_prof_date_and_id_list)
# #         for prof_id,selected_dates in srv_prof_date_and_id_list.items():
# #             # list=dictionary[str(i)]
# #             print(selected_dates)
# #             applied_dates=selected_dates[0]
# #             all_dates_record=[]
# #             for i in applied_dates:
# #                 i=i[0].split(',')
# #                 all_dates = dates_list(i[0],i[1][1:])
# #                 all_dates_record+=all_dates
# #             for j in all_dates_record:
# #                 detailed_event_poc=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=request.data.get('eve_id'),actual_StartDate_Time=j,status=1).first()
# #                 if(detailed_event_poc.srv_prof_id!=None):
# #                     detailed_event_poc_round=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=request.data.get('eve_id'),status=1)
# #                     # date={}
# #                     date_list=[]
# #                     for dates in detailed_event_poc:
# #                         if(dates.srv_prof_id!=None):
# #                             # date[j]=str(dates.actual_StartDate_Time)
# #                             date_list.append(str(dates.actual_StartDate_Time))
# #                     return Response({'message':'professional already Allocated','date':date_list},status=404)
# #                 print(applied_dates[1], 'asfg')
# #                 if applied_dates[1]:
# #                     detailed_event_poc.convinance_charges=selected_dates[1]
# #                     detailed_event_poc.is_convinance=True
# #                     # event_id.final_amount+=int(request.data.get('conve_charge'))
# #                     # event_id.save()
# #                 try:
# #                     professional=agg_hhc_service_professionals.objects.get(srv_prof_id=int(prof_id))
# #                     # professional=agg_hhc_service_professional_serializer(professional)
# #                 except:
# #                     return Response({'message':'professional not found'},status=404)
# #                 # print("this is professional id",professional.request.data.get('srv_prof_id'))
# #                 detailed_event_poc.srv_prof_id=professional#.srv_prof_id
# #                 detailed_event_poc.status=1
# #                 detailed_event_poc.last_modified_by=clgref_id
# #                 detailed_event_poc.save()
# #                 detailed_event_poc_round.remove()
# #     # ===========================================================================================================
# #         # event_id.day_convinance=int(request.data.get('conve_charge'))
# #         event_id.event_status=2
# #         event_id.status=1
# #         event_id.last_modified_by=clgref_id
# #         event_id.save()
# #         """if request.data.get('andriod_status')==1:
# #             Notificationlist=NotificationList.objects.filter(is_active=True,is_accepted=False,noti_id=request.data.get('noti_id'))
# #             for i in Notificationlist:
# #                 i.is_active=False
# #                 i.is_accepted=True
# #                 i.accepted_by=professional_id
# #                 i.save()
# #                 # print("we are working on andriod api ")"""
#         return Response({'eve_id':event_id_is,'caller_id_is':caller_id_is,'agg_sp_pt_id':patient_id_is,'message':'professional Allocated sucessfully'})

from rest_framework.request import Request
from django.http import HttpRequest
import json

class CustomHttpRequest(HttpRequest):
    def __init__(self, body, **kwargs):
        super().__init__(**kwargs)
        self._body = body
        self._headers = kwargs.get('headers', {})

    def get_body(self):
        return self._body

    def get_headers(self):
        return self._headers

from django.test import RequestFactory
import http.client 

class multiple_allocate_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self,request):
        flag_id = request.data.get('flag_id')
        clgref_id = get_prof(request)[3]
            # clgref_id = "abc"
        if flag_id == 1:
            print('w3r')
            # clgref_id = get_prof(request)[3]
            clgref_id = "abc"
            request.data['last_modified_by'] = clgref_id
            # try:
            event_id=agg_hhc_events.objects.get(eve_id=request.data.get('eve_id'),status=1)
            event_serializer=agg_hhc_updateIDs_event_serializer(event_id)
            event_id_is=event_serializer.data.get('eve_id')
            caller_id_is=event_serializer.data.get('caller_id')
            patient_id_is=event_serializer.data.get('agg_sp_pt_id')
            # except Exception as e:
            #     return Response({'message':str(e)},status=404)
            srv_prof_date_and_id_list=request.data.get('srv_prof_date_and_id')
            # print(srv_prof_date_and_id_list.values())
            # print(srv_prof_date_and_id_list)
            # ==========================================================================================================
            # ==========================================================================================================
            all_dates=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=event_id_is, status=1).values_list('actual_StartDate_Time',flat=True)
            d=[l[0] for l in srv_prof_date_and_id_list.values()]
            dates1=[]
            for x in d:
                dates1+=x
            dictionary=[]
            for i in dates1:
                # i=i.split(',')
            #     print(i, 'aSDF')
            # i=dates1
                all_dates1 = dates_list(i[0],i[1])
                dictionary+=all_dates1
            # print(dates1)
            # print(dictionary)
            dictionary = [datetime.strptime(date_str, '%Y-%m-%d').date() for date_str in dictionary]
            # print(dictionary)
            # print(all_dates)
            if(int(len(all_dates))==len(dictionary)):
                for i in all_dates:
                    if i in dictionary:
                        pass
                    else:
                        print(i, 'asdf')
                        return Response({'message':'Select proper dates'})
            else:
                # print(len(dictionary))
                # print(int(len(all_dates)))
                return Response({'message':'Select proper dates'})
            # print('1')
            detailed_event_poc_round=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=request.data.get('eve_id'),status=1)
            for j in dictionary:
                detailed_event_poc=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=request.data.get('eve_id'),actual_StartDate_Time=j,status=1).first()
                if(detailed_event_poc.srv_prof_id!=None):
                    # date={}
                    date_list=[]
                    for dates in detailed_event_poc_round:
                        if(dates.srv_prof_id!=None):
                            # date[j]=str(dates.actual_StartDate_Time)
                            date_list.append(str(dates.actual_StartDate_Time))
                    return Response({'message':'professional already Allocated','date':date_list},status=404)
            # print('2')
            for prof, dates in srv_prof_date_and_id_list.items():
                # print(dates[0], 'lk')
                prof_dates=dates[0]
                dates1=[]
                # print(prof_dates, 'dates')
                # for x in prof_dates:
                #     print(x)
                #     dates1+=x
                dictionary=[]
                for i in prof_dates:
                #     print(i)
                # i=prof_dates
                    # i=i[0].split(',')
                    # print(i, 'aSDF')
                    all_dates1 = dates_list(i[0],i[1])
                    dictionary+=all_dates1
                professional=None
                try:
                    professional=agg_hhc_service_professionals.objects.get(srv_prof_id=int(prof)) 
                    # professional=agg_hhc_service_professional_serializer(professional)
                except:
                    return Response({'message':'professional not found'},status=404)
                                # print("this is professional id",professional.request.data.get('srv_prof_id'))
                print(professional, '..........')
                if professional:
                    # prof_mo=professional.clg_ref_id.clg_Work_phone_number
                    base_url = "xl6mjq.api-in.infobip.com"
                    api_key = "af099554a7f804d8fd234e3226241101-da0d6970-19a8-4e0a-9154-9da1fb64d858"  # Replace with your actual API key
                    # from_number = "918956193883"
                    # template_name = "professional_name_sms"
                    # order_id = "SPERO_W_ID" + timezone.now().strftime("%d%m%Y%H%M%S")
                    pt=agg_hhc_patients.objects.filter(agg_sp_pt_id=patient_id_is, status=1).last()
                    payload = json.dumps({
                        "messages": [
                            {
                                "from": "918956193883",
                                "to": f'91{professional.clg_ref_id.clg_Work_phone_number}',
                                "messageId": "SPERO_W_ID" + timezone.now().strftime("%d%m%Y%H%M%S"),
                                "content": {
                                    "templateName": "professional_name_sms",
                                    "templateData": {
                                        "body": {
                                            "placeholders": [
                                                professional.prof_fullname,
                                                pt.name,
                                                pt.caller_id.phone,
                                                pt.phone_no,
                                                pt.address,
                                                detailed_event_poc.eve_id.event_code,
                                                detailed_event_poc.eve_poc_id.srv_id.service_title,
                                                detailed_event_poc.eve_poc_id.sub_srv_id.recommomded_service,
                                                f'{detailed_event_poc.eve_poc_id.start_date} to {detailed_event_poc.eve_poc_id.end_date}',
                                                f'{detailed_event_poc.eve_poc_id.start_time} to {detailed_event_poc.eve_poc_id.end_time}'
                                            ]
                                        },                   
                                    },
                                    "language": "en"
                                }
                            }
                        ]
                    })
                    headers = {
                        'Authorization': f'App {api_key}',
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }

                    conn = http.client.HTTPSConnection(base_url)
                    conn.request("POST", "/whatsapp/1/message/template", payload, headers)
                    res = conn.getresponse()
                    data = res.read()
                    conn.close()
                    print('yes')
                print(dictionary, 'dictionary')
                for j in dictionary:
                    detailed_event_poc=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=request.data.get('eve_id'),actual_StartDate_Time=j,status=1).first()
                    detailed_event_poc.convinance_charges=int(dates[1])
                    detailed_event_poc.is_convinance=True
                    
                    detailed_event_poc.srv_prof_id=professional#.srv_prof_id
                    detailed_event_poc.status=1
                    detailed_event_poc.last_modified_by=clgref_id
                    detailed_event_poc.save()
                    event_id.event_status=2
                    event_id.status=1
                    event_id.last_modified_by=clgref_id
                    event_id.save()
            
            event_plan_care=agg_hhc_event_plan_of_care.objects.get(eve_id=event_id, status=1)
            try:
                msg = f"Dear  {professional.prof_fullname}\n\n Patient : {event_id.agg_sp_pt_id.name} \n\n Caller No: {event_id.caller_id.caller_fullname}\n Mob No: {event_id.agg_sp_pt_id.phone_no}\n\n Address: {event_id.agg_sp_pt_id.address}\n\n Event No:{event_id.event_code}\n Service : {event_plan_care.srv_id.service_title} \nSub-Service : {event_plan_care.sub_srv_id.recommomded_service}\n\n Date: {prof_dates} \n\n Reporting time: {event_plan_care.start_time}\n\n Message: Attend call\n\nSpero"
            except:
                pass
            print('demos;;;;;;;;;;;;;;')
            poc=event_plan_care
            eve=event_id
            request_body={
                "eve_id": event_id.eve_id,
                "total_amount": event_id.final_amount,
                "customerName": event_id.agg_sp_pt_id.name,
                "customeremail": event_id.agg_sp_pt_id.patient_email_id,
                "customerPhone": str(event_id.agg_sp_pt_id.phone_no),
                "orderAmount": event_id.final_amount,
                "Remaining_amount": 0
            }
            print(request_body,'request_body;;;;;;;;')
            factory = RequestFactory()
            request = factory.post('/web/multiple_allocate_api', data=json.dumps(request_body), content_type='application/json')

            # Pass the request to create_payment_url
            response  = create_payment_url(request)
            print(response ,',,,,,,,,,,,,,,,,,,,,,,')
            # placeholder=[event_id.caller_id.caller_fullname,event_plan_care.srv_id.service_title,event_plan_care.sub_srv_id.recommomded_service,links['payment_link']]
            if isinstance(response, Response):
            # Decode the response content and parse as JSON
                response_content = response.data
                payment_link = response_content.get('payment_link')

                if payment_link:
                    placeholder = [event_id.caller_id.caller_fullname, f'{event_plan_care.srv_id.service_title}({event_plan_care.sub_srv_id.recommomded_service})', event_id.event_code, payment_link]
                else:
                    placeholder = [event_id.caller_id.caller_fullname, f'{event_plan_care.srv_id.service_title}({event_plan_care.sub_srv_id.recommomded_service})', event_id.event_code,'Payment Link is not Available. Please contact to Desk']

            whatsapp_sms(eve.caller_id.phone, 'caller_no',placeholder)

            return Response({'eve_id':event_id_is,'caller_id_is':caller_id_is,'agg_sp_pt_id':patient_id_is,'message':'professional Allocated sucessfully'})
        

        elif flag_id == 2:
            eve_id = request.data.get('eve_id')
            caller_id = request.data.get('caller_id')
            pt_id = request.data.get('agg_sp_pt_id')
            srv_prof_date_and_id = request.data.get('srv_prof_date_and_id',{})
            remark =  request.data.get('remark')
            
            for srv_prof_id, date_range_list in srv_prof_date_and_id.items():
                print(srv_prof_id,'srv_prof_id - keys')
                print(date_range_list,'date_range_list -- values')

                all_dates = []
                for date_list in date_range_list:
                    if not date_list:
                        continue
                    sorted_dates = sorted(date_list, key=lambda date: datetime.strptime(date, '%Y-%m-%d'))
                    s_date = datetime.strptime(sorted_dates[0], '%Y-%m-%d')
                    e_date = datetime.strptime(sorted_dates[-1], '%Y-%m-%d')
                    while s_date <= e_date:
                        all_dates.append(s_date.strftime('%Y-%m-%d'))
                        s_date += timedelta(days=1)
                
                # print(all_dates,'all_dates')
                # print(type(int(srv_prof_id)),srv_prof_id)
                prof_inst = agg_hhc_service_professionals.objects.get(srv_prof_id=int(srv_prof_id))
                all_sessons = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=eve_id, actual_StartDate_Time__in = all_dates, status = 1)
                for i in all_sessons:
                    i.srv_prof_id = prof_inst
                    i.remark=remark
                    i.save()
                last_dtl = all_sessons.last()
                if prof_inst:
                 
                    base_url = "xl6mjq.api-in.infobip.com"
                    api_key = "af099554a7f804d8fd234e3226241101-da0d6970-19a8-4e0a-9154-9da1fb64d858"  # Replace with your actual API key
                    pt=agg_hhc_patients.objects.filter(agg_sp_pt_id=pt_id, status=1).last()
                    payload = json.dumps({
                        "messages": [
                            {
                                "from": "918956193883",
                                "to": f'91{prof_inst.clg_ref_id.clg_Work_phone_number}',
                                "messageId": "SPERO_W_ID" + timezone.now().strftime("%d%m%Y%H%M%S"),
                                "content": {
                                    "templateName": "professional_name_sms",
                                    "templateData": {
                                        "body": {
                                            "placeholders": [
                                                prof_inst.prof_fullname,
                                                pt.name,
                                                pt.caller_id.phone,
                                                pt.phone_no,
                                                pt.address,
                                                last_dtl.eve_id.event_code,
                                                last_dtl.eve_poc_id.srv_id.service_title,
                                                last_dtl.eve_poc_id.sub_srv_id.recommomded_service,
                                                f'{last_dtl.eve_poc_id.start_date} to {last_dtl.eve_poc_id.end_date}',
                                                f'{last_dtl.eve_poc_id.start_time} to {last_dtl.eve_poc_id.end_time}'
                                            ]
                                        },                   
                                    },
                                    "language": "en"
                                }
                            }
                        ]
                    })
                    headers = {
                        'Authorization': f'App {api_key}',
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }

                    conn = http.client.HTTPSConnection(base_url)
                    conn.request("POST", "/whatsapp/1/message/template", payload, headers)
                    res = conn.getresponse()
                    data = res.read()
                    conn.close()
                    print('yes')
            
             

            
            return Response({"msg":"Professional Rescheduled"})



        elif flag_id == 3:
            eve_id = request.data.get('eve_id')
            ref_date = request.data.get('session_date')
            session_date = datetime.strptime(ref_date, '%Y-%m-%d')
            ref_s_time = request.data.get('start_time')
            ref_e_time = request.data.get('end_time')
            sess_time = datetime.strptime(ref_s_time, "%H:%M").time()
            sese_time = datetime.strptime(ref_e_time, "%H:%M").time()
            
            
            srv_prof_date_and_id = request.data.get('srv_prof_date_and_id',{})
            remark =  request.data.get('remark')
            
            for srv_prof_id, date_range_list in srv_prof_date_and_id.items():
                print(srv_prof_id,'srv_prof_id - keys')
                print(date_range_list,'date_range_list -- values')

                all_dates = []
                for date_list in date_range_list:
                    if not date_list:
                        continue
                    sorted_dates = sorted(date_list, key=lambda date: datetime.strptime(date, '%Y-%m-%d'))
                    s_date = datetime.strptime(sorted_dates[0], '%Y-%m-%d')
                    e_date = datetime.strptime(sorted_dates[-1], '%Y-%m-%d')
                    while s_date <= e_date:
                        all_dates.append(s_date.strftime('%Y-%m-%d'))
                        s_date += timedelta(days=1)
                
                # print(all_dates,'all_dates')
                # print(type(int(srv_prof_id)),srv_prof_id)
                prof_inst = agg_hhc_service_professionals.objects.get(srv_prof_id=int(srv_prof_id))
                all_sessons = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=eve_id, actual_StartDate_Time = session_date, status = 1)
                if all_sessons:
                    # for index,i in all_sessons:
                    #     i.srv_prof_id = prof_inst
                    #     i.actual_StartDate_Time = all_dates[index]
                    #     i.remark=remark
                    #     i.save()
                    for index, i in enumerate(all_sessons):
                        if index < len(all_dates):
                            i.srv_prof_id = prof_inst
                            i.actual_StartDate_Time = all_dates[index]
                            i.start_time = sess_time
                            i.end_time = sese_time
                            i.remark = remark
                            i.save()

                    last_dtl = all_sessons.last()
                    if prof_inst and last_dtl:
                    
                        base_url = "xl6mjq.api-in.infobip.com"
                        api_key = "af099554a7f804d8fd234e3226241101-da0d6970-19a8-4e0a-9154-9da1fb64d858"  # Replace with your actual API key
                        pt=agg_hhc_patients.objects.filter(agg_sp_pt_id=last_dtl.eve_id.agg_sp_pt_id.agg_sp_pt_id, status=1).last()
                        payload = json.dumps({
                            "messages": [
                                {
                                    "from": "918956193883",
                                    # "to": f'91{prof_inst.clg_ref_id.clg_Work_phone_number}',
                                    "to": f'917057807841',
                                    "messageId": "SPERO_W_ID" + timezone.now().strftime("%d%m%Y%H%M%S"),
                                    "content": {
                                        "templateName": "professional_name_sms",
                                        "templateData": {
                                            "body": {
                                                "placeholders": [
                                                    prof_inst.prof_fullname,
                                                    pt.name,
                                                    pt.caller_id.phone,
                                                    pt.phone_no,
                                                    pt.address,
                                                    last_dtl.eve_id.event_code,
                                                    last_dtl.eve_poc_id.srv_id.service_title,
                                                    last_dtl.eve_poc_id.sub_srv_id.recommomded_service,
                                                    f'{last_dtl.eve_poc_id.start_date} to {last_dtl.eve_poc_id.end_date}',
                                                    f'{last_dtl.eve_poc_id.start_time} to {last_dtl.eve_poc_id.end_time}'
                                                ]
                                            },                   
                                        },
                                        "language": "en"
                                    }
                                }
                            ]
                        })
                        headers = {
                            'Authorization': f'App {api_key}',
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }

                        conn = http.client.HTTPSConnection(base_url)
                        conn.request("POST", "/whatsapp/1/message/template", payload, headers)
                        res = conn.getresponse()
                        data = res.read()
                        conn.close()
                        print('yes')
                    get_dtl_all_eve = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=eve_id, status = 1)
                    print(get_dtl_all_eve)
                    dates = get_dtl_all_eve.aggregate(
                        max_date=Max('actual_StartDate_Time'),
                        min_date=Min('actual_StartDate_Time')
                    )
                    epoccccc= agg_hhc_event_plan_of_care.objects.filter(eve_id=eve_id,status=1).last()
                    print(dates['max_date'],"dates['max_date']")
                    print(dates['min_date'],"ates['min_date']")
                    epoccccc.end_date = dates['max_date']
                    epoccccc.start_date = dates['min_date']
                    if epoccccc.save():
                        print("data save to eve poc")

                else:
                    return Response({"msg":"Given Date has no any session"}, status = status.HTTP_404_NOT_FOUND)
            
            

            
            return Response({"msg":"Session and Professional Rescheduled"})



class temp_multiple_allocation_api(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    def post(self,request):
        # clgref_id = get_prof(request)[3]
        # request.data['last_modified_by'] = clgref_id
        try:
            event_id=agg_hhc_events.objects.get(eve_id=request.data.get('eve_id'),status=1)
            event_serializer=agg_hhc_updateIDs_event_serializer(event_id)
            event_id_is=event_serializer.data.get('eve_id')
            caller_id_is=event_serializer.data.get('caller_id')
            patient_id_is=event_serializer.data.get('agg_sp_pt_id')
        except:
            return Response({'message':'event not found'},status=404)
        srv_prof_date_and_id_list=request.data.get('srv_prof_date_and_id')
        conve_list=[]
        for i in srv_prof_date_and_id_list:
            if(srv_prof_date_and_id_list[i][-1]=="yes"):
                conve_list.append(int(i))
#--------------------------------------------------------------------------------------message to professional start -------------------------------------
            service_professional=agg_hhc_service_professionals.objects.get(srv_prof_id=int(i))
            service_start_date=srv_prof_date_and_id_list[i][0]
            service_end_date=srv_prof_date_and_id_list[i][1]
            event_plan_care=agg_hhc_event_plan_of_care.objects.get(eve_id=event_id)
            try:
                msg = f"Dear  {service_professional.prof_fullname}\n\n Patient : {event_id.agg_sp_pt_id.name} \n\n Caller No: {event_id.caller_id.caller_fullname}\n Mob No: {event_id.agg_sp_pt_id.phone_no}\n\n Address: {event_id.agg_sp_pt_id.address}\n\n Event No:{event_id.event_code}\n Service : {event_plan_care.srv_id.service_title} \nSub-Service : {event_plan_care.sub_srv_id.recommomded_service}\n\n Date: {service_start_date} to {service_end_date}\n\n Reporting time: {event_plan_care.start_time}\n\n Message: Attend call\n\nSpero"
                send_otp(service_professional.phone_no,msg)
            except:
                pass
#--------------------------------------------------------------------------------------message to professional end -------------------------------------
        dictionary=date_function(srv_prof_date_and_id_list)
        all_dates=dates_list(request.data.get('start_date'),request.data.get('end_date'))
        pr=[i for i in srv_prof_date_and_id_list]
        date_count=0
        for i in dictionary:
            date_count+=int(len(dictionary[str(i)]))
        if(int(len(all_dates))!=date_count):
            return Response({'message':'Select proper dates'})
        print("hi i am ",dictionary)
        for i in dictionary:
            list=dictionary[str(i)]
            for j in list:
                detailed_event_poc=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=request.data.get('eve_id'),actual_StartDate_Time=j,status=1).first()
                if(detailed_event_poc.srv_prof_id!=None):
                    detailed_event_poc_round=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=request.data.get('eve_id'),status=1)
                    # date={}
                    date_list=[]
                    for dates in detailed_event_poc_round:
                        if(dates.srv_prof_id!=None):
                            # date[j]=str(dates.actual_StartDate_Time)
                            date_list.append(str(dates.actual_StartDate_Time))
                    return Response({'message':'professional already Allocated','date':date_list},status=404)
                if(int(i) in conve_list):
                    detailed_event_poc.convinance_charges=int(request.data.get('conve_charge'))
                    detailed_event_poc.is_convinance=True
                    event_id.final_amount+=int(request.data.get('conve_charge'))
                    event_id.save()
                try:
                    professional=agg_hhc_service_professionals.objects.get(srv_prof_id=int(i))
                    # professional=agg_hhc_service_professional_serializer(professional)
                except:
                    return Response({'message':'professional not found'},status=404)
                # print("this is professional id",professional.request.data.get('srv_prof_id'))
                detailed_event_poc.srv_prof_id=professional#.srv_prof_id
                detailed_event_poc.status=1
                detailed_event_poc.last_modified_by=clgref_id
                detailed_event_poc.save()
                # print(i,"this is professional",j,"this is date")
        event_id.day_convinance=int(request.data.get('conve_charge'))
        event_id.event_status=2
        event_id.status=1
        event_id.last_modified_by=clgref_id
        event_id.save()
        print('1........')
        event_id=agg_hhc_event_plan_of_care.objects.filter(eve_id=request.data.get('eve_id'),status=1)
        print('2........')
        token=[d.token for d in [DeviceToken.objects.filter(clg_id__in=agg_com_colleague.objects.filter(clg_ref_id__in=[j.clg_ref_id for j in agg_hhc_service_professionals.objects.filter(srv_prof_id__in=pr,status=1)], status=1),is_login=True)]]
        print(token, ';;;;;;..........')
        for z in token:
        # detail=agg_hhc_detailed_event_plan_of_care.objects.filter(agg_sp_dt_eve_poc_id=sess_pk).last()
            body=f'Patient: {event_id.last().eve_id.agg_sp_pt_id.name}\nService: {event_id.last().sub_srv_id.recommomded_service}'
            notification={ 'title': 'Approved request for session cancellation', 'body': body }
            response = (requests.post('https://fcm.googleapis.com/fcm/send', json={'to': token,'notification': notification}, headers={'Authorization': f'key={SERVER_KEY}', 'Content-Type': 'application/json'})).json()
            print(response, 'response............')
        """if request.data.get('andriod_status')==1:
            Notificationlist=NotificationList.objects.filter(is_active=True,is_accepted=False,noti_id=request.data.get('noti_id'))
            for i in Notificationlist:
                i.is_active=False
                i.is_accepted=True
                i.accepted_by=professional_id
                i.save()
                # print("we are working on andriod api ")"""
        return Response({'eve_id':event_id_is,'caller_id_is':caller_id_is,'agg_sp_pt_id':patient_id_is,'message':'professional Allocated sucessfully'})





class Dashboard_enquiry_count_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, id):
        try:

            now = timezone.now()
            today = timezone.now().date()
            start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
            start_of_week = now - timezone.timedelta(days=now.weekday())
            start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
            last_day = calendar.monthrange(today.year, today.month)[1]
            month_end_date = today.replace(day=last_day)
            start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
            if id == 1:
                td_all_event = agg_hhc_enquiry_follow_up.objects.filter(last_modified_date__gte=start_of_day,follow_up_status=1)
                
                td_eve_ids = td_all_event.values_list('event_id', flat=True)
                td_all_eves = list(set(td_eve_ids))
                td_enq_id = []
                for i in td_all_eves:
                    td_get_enq = td_all_event.filter(event_id=i).order_by('last_modified_date').last()
                    td_enq_id.append(td_get_enq.enq_follow_up_id)
                ts_all_follow_up_enq = td_all_event.filter(enq_follow_up_id__in=td_enq_id)
                event_ids = ts_all_follow_up_enq.values_list('event_id', flat=True).distinct()
                enquiry=agg_hhc_events.objects.filter(eve_id__in=event_ids)
            elif id == 2:
                start_date = timezone.now().date()
                start_datetime = datetime.combine(start_date - timedelta(days=start_date.weekday()), datetime.min.time())                
                end_datetime = datetime.combine(start_date, datetime.max.time())
                ws_all_event = agg_hhc_enquiry_follow_up.objects.filter(last_modified_date__range=(start_datetime,end_datetime),follow_up_status=1)
                
                ts_eve_ids = ws_all_event.values_list('event_id', flat=True)
                ts_all_eves = list(set(ts_eve_ids))
                ts_enq_id = []
                for i in ts_all_eves:
                    ts_get_enq = ws_all_event.filter(event_id=i).order_by('last_modified_date').last()
                    ts_enq_id.append(ts_get_enq.enq_follow_up_id)
                ts_all_follow_up_enq = ws_all_event.filter(enq_follow_up_id__in=ts_enq_id)
                event_ids = ts_all_follow_up_enq.values_list('event_id', flat=True).distinct()
                enquiry=agg_hhc_events.objects.filter(eve_id__in=event_ids)
            elif id == 3:
                ts_all_event = agg_hhc_enquiry_follow_up.objects.filter(last_modified_date__range=(start_of_month,month_end_date),follow_up_status=1)
                
                ts_eve_ids = ts_all_event.values_list('event_id', flat=True)
                ts_all_eves = list(set(ts_eve_ids))
                ts_enq_id = []
                for i in ts_all_eves:
                    ts_get_enq = ts_all_event.filter(event_id=i).order_by('last_modified_date').last()
                    ts_enq_id.append(ts_get_enq.enq_follow_up_id)
                ts_all_follow_up_enq = ts_all_event.filter(enq_follow_up_id__in=ts_enq_id)
                event_ids = ts_all_follow_up_enq.values_list('event_id', flat=True)
                enquiry=agg_hhc_events.objects.filter(eve_id__in=event_ids)
            else:
                raise Http404("Invalid ID")

            enquiry_count = enquiry.count()
            App = enquiry.filter(patient_service_status=1).count()
            Social = enquiry.filter(patient_service_status=2).count()
            Calls = enquiry.filter(patient_service_status=4).count()
            Walk_in = enquiry.filter(patient_service_status=3).count()
            
            if enquiry_count > 0:
                App_percentage = (Walk_in / enquiry_count) * 100 if App > 0 else 0
                Social_percentage = (Social / enquiry_count) * 100 if Social > 0 else 0
                Calls_percentage = (Calls / enquiry_count) * 100 if Calls > 0 else 0
                Walk_in_percentage = (Walk_in / enquiry_count) * 100 if Walk_in > 0 else 0
            else:
                App_percentage = 0
                Social_percentage = 0
                Calls_percentage = 0
                Walk_in_percentage = 0

            return Response({
                'Total_enquiries': enquiry_count,
                'App': App,
                'Social': Social,
                'Calls': Calls,
                'Walk_in': Walk_in,
                "App_percentage": round(App_percentage),
                "Social_percentage": round(Social_percentage),
                "Calls_percentage": round(Calls_percentage),
                "Walk_in_percentage": round(Walk_in_percentage)
            })

        except Http404 as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        





# class Dashboard_enquiry_count_api(APIView):
#     renderer_classes = [UserRenderer]
#     permission_classes = [IsAuthenticated]
#     def get(self, request, id):
#         try:
#             if id == 1:
#                 print('1')
#                 times = timezone.now().date()
#                 print(times,"feegegahjklorgkgljljlf")
#                 enquiry = agg_hhc_events.objects.filter(added_date__gte=times, status=1, enq_spero_srv_status=3)
#                 # enquiry = agg_hhc_events.objects.all()#added_date=times
#                 print("enquiry",enquiry)
#                 for i in enquiry:
#                     print(i.added_date, ';;;dates;;;')
#                     print('t',type(i.added_date))
#                     print('t',type(times))
#                   # print(enquiry[0].added_date, ';;;;enquiry obj date')
#             elif id == 2:
#                 week_days = timezone.now().date() - timedelta(days=7)
#                 print(week_days, 'date1')
#                 enquiry = agg_hhc_events.objects.filter(added_date__gte=week_days,status=1,enq_spero_srv_status=3)
#                 print(enquiry, ';;;;enquiry11')
#             elif id == 3:
#                 month = timezone.now().date()
#                 month = month.replace(day=1)
#                 print(month, 'date12')

#                 enquiry = agg_hhc_events.objects.filter(added_date__gte=month,status=1,enq_spero_srv_status=3)
#                 print(enquiry, ';;;;enquiry22')
#             else:
#                 raise Http404("Invalid ID")

#             enquiry_count = len(enquiry)
#             App = 0
#             Social = 0
#             Calls = 0
#             Walk_in = 0
#             for i in enquiry:
#                 # caller_id = agg_hhc_events.objects.filter(pt_id=i.pt_id).first()
#                 if i.patient_service_status == 1:
#                     App += 1
#                 elif i.patient_service_status == 2:
#                     Social += 1
#                 elif i.patient_service_status == 3:
#                     Walk_in += 1
#                 elif i.patient_service_status == 4:
#                     Calls += 1

#             if enquiry_count > 0:
#                 App_percentage = (Walk_in / enquiry_count) * 100 if App > 0 else 0
#                 Social_percentage = (Social / enquiry_count) * 100 if Social > 0 else 0
#                 Calls_percentage = (Calls / enquiry_count) * 100 if Calls > 0 else 0
#                 Walk_in_percentage = (Walk_in / enquiry_count) * 100 if Walk_in > 0 else 0
#             else:
#                 App_percentage = 0
#                 Social_percentage = 0
#                 Calls_percentage = 0
#                 Walk_in_percentage = 0

#             return Response({
#                 'Total_enquiries': enquiry_count,
#                 'App': App,
#                 'Social': Social,
#                 'Calls': Calls,
#                 'Walk_in': Walk_in,
#                 "App_percentage": round(App_percentage),
#                 "Social_percentage": round(Social_percentage),
#                 "Calls_percentage": round(Calls_percentage),
#                 "Walk_in_percentage": round(Walk_in_percentage)
#             })

#         except Http404 as e:
#             return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)









         
class Dashboard_enquiry_status_count_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,id):
        now = timezone.now()
        today = timezone.now().date()
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        start_of_week = now - timezone.timedelta(days=now.weekday())
        start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
        last_day = calendar.monthrange(today.year, today.month)[1]
        month_end_date = today.replace(day=last_day)
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        if(id==1):
            ts_all_event = agg_hhc_enquiry_follow_up.objects.filter(last_modified_date__gte=start_of_day,follow_up_status=1)
            ts_eve_ids = ts_all_event.values_list('event_id', flat=True)
            ts_all_eves = list(set(ts_eve_ids))
            ts_enq_id = []
            for i in ts_all_eves:
                ts_get_enq = ts_all_event.filter(event_id=i).order_by('last_modified_date').last()
                ts_enq_id.append(ts_get_enq.enq_follow_up_id)
            ts_all_follow_up_enq = ts_all_event.filter(enq_follow_up_id__in=ts_enq_id)
            ts_three = ts_all_follow_up_enq.filter(follow_up=3).count()
            ts_one = ts_all_follow_up_enq.filter(follow_up=1).count()
            return Response({'in_follow_up':ts_one,'converted_to_service':ts_three})  
        elif(id==2):
            start_date = timezone.now().date()
            start_datetime = datetime.combine(start_date - timedelta(days=start_date.weekday()), datetime.min.time())                
            end_datetime = datetime.combine(start_date, datetime.max.time())
            ts_all_event = agg_hhc_enquiry_follow_up.objects.filter(last_modified_date__range=(start_datetime,end_datetime),follow_up_status=1)
            ts_eve_ids = ts_all_event.values_list('event_id', flat=True)
            ts_all_eves = list(set(ts_eve_ids))
            ts_enq_id = []
            for i in ts_all_eves:
                ts_get_enq = ts_all_event.filter(event_id=i).order_by('last_modified_date').last()
                ts_enq_id.append(ts_get_enq.enq_follow_up_id)
            ts_all_follow_up_enq = ts_all_event.filter(enq_follow_up_id__in=ts_enq_id)
            ts_three = ts_all_follow_up_enq.filter(follow_up=3).count()
            ts_one = ts_all_follow_up_enq.filter(follow_up=1).count()
            return Response({'in_follow_up':ts_one,'converted_to_service':ts_three})  
        
        elif(id==3):
            ts_all_event = agg_hhc_enquiry_follow_up.objects.filter(last_modified_date__range=(start_of_month,month_end_date),follow_up_status=1)
            ts_eve_ids = ts_all_event.values_list('event_id', flat=True)
            ts_all_eves = list(set(ts_eve_ids))
            ts_enq_id = []
            for i in ts_all_eves:
                ts_get_enq = ts_all_event.filter(event_id=i).order_by('last_modified_date').last()
                ts_enq_id.append(ts_get_enq.enq_follow_up_id)
            ts_all_follow_up_enq = ts_all_event.filter(enq_follow_up_id__in=ts_enq_id)
            ts_three = ts_all_follow_up_enq.filter(follow_up=3).count()
            ts_one = ts_all_follow_up_enq.filter(follow_up=1).count()
            return Response({'in_follow_up':ts_one,'converted_to_service':ts_three})    
              
# class Dashboard_enquiry_status_count_api(APIView):
#     renderer_classes = [UserRenderer]
#     permission_classes = [IsAuthenticated]
#     def get(self,request,id):
#         id=id
#         if(id==1):
#             enquiry_follow_up=agg_hhc_enquiry_follow_up.objects.filter(last_modified_date__date=timezone.now().date())
#             print('jjjjjjjjjjjjjj-------',enquiry_follow_up)
#             in_follow_up=0
#             converted_to_service=0
#             for i in enquiry_follow_up:
#                 if(i.follow_up=='1'):
#                     in_follow_up+=1
#                 elif(i.follow_up=='3'):
#                     converted_to_service+=1
#             total=in_follow_up+converted_to_service
#             if(total>0):
#                 if(in_follow_up>0):
#                     in_follow_up_percentage=in_follow_up/total
#                     in_follow_up_percentage*=100
#                 else:
#                     in_follow_up_percentage=0
#                 if(converted_to_service>0):
#                     converted_to_service_percentage=converted_to_service/total
#                     converted_to_service_percentage*=100
#                 else:
#                     converted_to_service_percentage=0
#             else:
#                 in_follow_up_percentage=0
#                 converted_to_service_percentage=0
#             return Response({'in_follow_up':in_follow_up,'converted_to_service':converted_to_service,'in_follow_up_percentage':round(in_follow_up_percentage),'converted_to_service_percentage':round(converted_to_service_percentage)})    
            
#         elif(id==2):
#             week=timezone.now().date()-timedelta(days=7)
#             enquiry_follow_up=agg_hhc_enquiry_follow_up.objects.filter(last_modified_date__date__gte=week)
#             print(enquiry_follow_up)
#             in_follow_up=0
#             converted_to_service=0
#             for i in enquiry_follow_up:
#                 if(i.follow_up=='1'):
#                     in_follow_up+=1
#                 elif(i.follow_up=='3'):
#                     converted_to_service+=1
#             total=in_follow_up+converted_to_service
#             if(total>0):
#                 if(in_follow_up>0):
#                     in_follow_up_percentage=in_follow_up/total
#                     in_follow_up_percentage*=100
#                 else:
#                     in_follow_up_percentage=0
#                 if(converted_to_service>0):
#                     converted_to_service_percentage=converted_to_service/total
#                     converted_to_service_percentage*=100
#                 else:
#                     converted_to_service_percentage=0
#             else:
#                 in_follow_up_percentage=0
#                 converted_to_service_percentage=0
#             return Response({'in_follow_up':in_follow_up,'converted_to_service':converted_to_service,'in_follow_up_percentage':round(in_follow_up_percentage),'converted_to_service_percentage':round(converted_to_service_percentage)})    
            
#         elif(id==3):
#             month=timezone.now().date()
#             month=month.replace(day=1)
#             enquiry_follow_up=agg_hhc_enquiry_follow_up.objects.filter(last_modified_date__date__gte=month)
#             in_follow_up=0
#             converted_to_service=0
#             for i in enquiry_follow_up:
#                 if(i.follow_up=='1'):
#                     in_follow_up+=1
#                 elif(i.follow_up=='3'):
#                     converted_to_service+=1
#             total=in_follow_up+converted_to_service
#             if(total>0):
#                 if(in_follow_up>0):
#                     in_follow_up_percentage=in_follow_up/total
#                     in_follow_up_percentage*=100
#                 else:
#                     in_follow_up_percentage=0
#                 if(converted_to_service>0):
#                     converted_to_service_percentage=converted_to_service/total
#                     converted_to_service_percentage*=100
#                 else:
#                     converted_to_service_percentage=0
#             else:
#                 in_follow_up_percentage=0
#                 converted_to_service_percentage=0
#             return Response({'in_follow_up':in_follow_up,'converted_to_service':converted_to_service,'in_follow_up_percentage':round(in_follow_up_percentage),'converted_to_service_percentage':round(converted_to_service_percentage)})    
            
#vinayak api for dashboard

class srv_canc_count(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    #serializer_class = srv_cancel_serializer
    def get(self, request, id):
        if id == 1:
            
            today_datetime = timezone.now()
            today_date = today_datetime.date()
            # print("Today's Date:", today_date)
            
            # Get the total count of records for today's date
            # queryset = agg_hhc_cancellation_history.objects.filter(cancelled_date__date=today_date)

            current_date = date.today()
            # Create a queryset to filter records with cancelled_date equal to today
            # queryset = agg_hhc_cancellation_history.objects.filter(cancelled_date__date=current_date).order_by('cancelation_reason')
            queryset = agg_hhc_cancellation_history.objects.filter(cancelled_date__date=current_date)

            print(queryset, ';;;;;queryset')
            # Count the number of records in the queryset
            queryset_count = queryset.count()

            # cancel_by_spero_count = queryset.filter(cancellation_by=cancel_from.Cancel_By_Spero).count()
            cancel_by_spero_count = queryset.filter(cancellation_by=1).count()
            cancel_by_customer_count = queryset.filter(cancellation_by=2).count()

            # print(queryset)
            cancell_by = {
                 'cancel_by_spero_count': cancel_by_spero_count if 'cancel_by_spero_count' in locals() else 0,
                'cancel_by_customer_count': cancel_by_customer_count if 'cancel_by_customer_count' in locals() else 0
            }
            # response_data = {
            #     'today_cancel_data': queryset_count
            # }
            # return Response(response_data)

            response_data = {
                'Total_service_cancelled_count' : queryset_count,
                'today_cancel_data': cancell_by
            }

        if id == 2:
            current_date = date.today()
            seven_days_ago = current_date - timedelta(days=7)

            queryset = agg_hhc_cancellation_history.objects.filter( 
                Q(cancelled_date__date__range=(seven_days_ago, current_date))
            )

            queryset_count = queryset.count()

            cancel_by_spero_count = queryset.filter(cancellation_by=1).count()
            cancel_by_customer_count = queryset.filter(cancellation_by=2).count()

            cancell_by = {
                 'cancel_by_spero_count': cancel_by_spero_count if 'cancel_by_spero_count' in locals() else 0,
                'cancel_by_customer_count': cancel_by_customer_count if 'cancel_by_customer_count' in locals() else 0
            }

            response_data = {
                'Total_service_cancelled_count' : queryset_count,
                'today_cancel_data': cancell_by
            }
        
        if id == 3:
            current_date = date.today()
            start_date = date(current_date.year, current_date.month, 1)

            queryset = agg_hhc_cancellation_history.objects.filter( 
                cancelled_date__date__range=(start_date, current_date)
            )

            queryset_count = queryset.count()

            cancel_by_spero_count = queryset.filter(cancellation_by=1).count()
            cancel_by_customer_count = queryset.filter(cancellation_by=2).count()

            cancell_by = {
                 'cancel_by_spero_count': cancel_by_spero_count if 'cancel_by_spero_count' in locals() else 0,
                'cancel_by_customer_count': cancel_by_customer_count if 'cancel_by_customer_count' in locals() else 0
            }

            response_data = {
                'Total_service_cancelled_count' : queryset_count,
                'today_cancel_data': cancell_by
            }
        return Response(response_data)





# ------------------------ Service Details API for dashboard --------
    



# ---------------- Old Vinayak Code -------------------------

# class srv_dtl_dash(APIView):
#     renderer_classes = [UserRenderer]
#     permission_classes = [IsAuthenticated]
#     # serializer_class = srv_dtl_dash_serializer
#     def get(self, request, id, format=None):
#         try:
   
#             if id == 1:
#                 print(timezone.now())
#                 today_data = agg_hhc_events.objects.filter(last_modified_date__date=timezone.now().date(),status=1).exclude(enq_spero_srv_status=3)
#                 com_srv = pend_srv = on_srv = agg_hhc_events.objects.none()
#                 schd_srv = agg_hhc_event_plan_of_care.objects.none().count()
#                 print("i am inside")
#                 if today_data:
                    
#                     com_srv = today_data.filter(event_status=3)
                    
#                     pend_srv = today_data.filter(Q(event_status=1) | Q(event_status=4),Q(enq_spero_srv_status=1)|Q(enq_spero_srv_status=2))

#                     tomorrow = timezone.now() + timezone.timedelta(days=1)
            

#                     eve_ids = today_data.values_list('eve_id', flat=True)
#                     sch_srv = agg_hhc_event_plan_of_care.objects.filter(eve_id__in = eve_ids, start_date__gte=tomorrow, status=1)

#                     on_srv = agg_hhc_detailed_event_plan_of_care.objects.filter(status=1,actual_StartDate_Time=timezone.now().date())
#                     #today_data.filter(event_status=2)
                
#                     tatal_count = today_data.count()
#                     # -------------- Completed Services -----------
#                     completed_srv = com_srv.count()
                    

#                     # -------------- Pending Services -----------
#                     pending_srv = pend_srv.count()
                    

#                     # -------------- Ongoing Services -----------
#                     ong_srv = on_srv.count()
                
#                     # -------------- Schedule Services -----------
#                     schd_srv = sch_srv.count()

#                 com_srv_fk_list = com_srv.values_list('eve_id', flat=True)
#                 com_srv_epoc = agg_hhc_event_plan_of_care.objects.filter(eve_id__in=com_srv_fk_list,status=1)
#                 print("i am inside 2 ")
#                 comp_srv_dtl={
#                     'count_physio': com_srv_epoc.filter(srv_id=1).count(),
#                     'count_physician'  : com_srv_epoc.filter(srv_id=2).count(),
#                     'count_heal_attend' : com_srv_epoc.filter(srv_id=3).count(),
#                     'count_X_ray' : com_srv_epoc.filter(srv_id=4).count(),
#                     'count_nurse' : com_srv_epoc.filter(srv_id=5).count(),
                    
#                     'count_patheylogy' : com_srv_epoc.filter(srv_id=6).count()

#                 }
#                 print("i am inside 4 ")

#                 pend_srv_fk_list = pend_srv.values_list('eve_id', flat=True)
#                 pend_srv_epoc = agg_hhc_event_plan_of_care.objects.filter(eve_id__in=pend_srv_fk_list,status=1)
#                 pend_srv_dtl={
#                     'count_physio': pend_srv_epoc.filter(srv_id=1).count(),
#                     'count_physician'  : pend_srv_epoc.filter(srv_id=2).count(),
#                     'count_heal_attend' : pend_srv_epoc.filter(srv_id=3).count(),
#                     'count_X_ray' : pend_srv_epoc.filter(srv_id=4).count(),
#                     'count_nurse' : pend_srv_epoc.filter(srv_id=5).count(),
#                     'count_patheylogy' : pend_srv_epoc.filter(srv_id=6).count()

#                 }
        
#                 print("i am inside 3 ")
#                 ong_srv_fk_list = pend_srv.values_list('eve_id', flat=True)
#                 ong_srv_epoc = agg_hhc_event_plan_of_care.objects.filter(eve_id__in=ong_srv_fk_list,status=1)

#                 ong_srv_dtl = {
#                     'count_physio': ong_srv_epoc.filter(srv_id=1).count(),
#                     'count_physician': ong_srv_epoc.filter(srv_id=2).count(),
#                     'count_heal_attend': ong_srv_epoc.filter(srv_id=3).count(),
#                     'count_X_ray': ong_srv_epoc.filter(srv_id=4).count(),
#                     'count_nurse': ong_srv_epoc.filter(srv_id=5).count(),
#                     'count_patheylogy': ong_srv_epoc.filter(srv_id=6).count()
#                 }

#                 print("i am inside 22 ")
#                 Completed_services = {
#                     'completed_srv': completed_srv if 'completed_srv' in locals() else 0,
#                     'comp_srv_dtl': comp_srv_dtl
                    
#                 }

#                 Pending_services = {
#                     'Pending_srv': pending_srv if 'pending_srv' in locals() else 0,
#                     'pend_srv_dtl': pend_srv_dtl
#                 }

                

#                 Ongoing_services = {
#                     'Ongoing_srv': ong_srv if 'ong_srv' in locals() else 0,
                    
#                     'ong_srv_dtl' : ong_srv_dtl
#                 }

#                 today = timezone.now().date()
#                 count_dtl = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=today,status=1).count()
#                 print("i am inside 23 ")
#                 response_data = {
#                     # 'Total_services': tatal_count if 'tatal_count' in locals() else 0,
#                     'Total_services':agg_hhc_detailed_event_plan_of_care.objects.filter(status=1,actual_StartDate_Time=today).count(),
#                     'Completed_services': Completed_services,
#                     'Pending_services': Pending_services,
#                     'ongoing_services': Ongoing_services,
#                     'schedule_services' :schd_srv
#                 }
#                 print("the end ")

#             elif id == 2 :
#                 seven_days_ago = timezone.now().date() - timedelta(days=7)

            
#                 this_week_data = agg_hhc_events.objects.filter(
                    
#                     last_modified_date__date__range=[seven_days_ago, timezone.now().date()],
#                     status=1
#                 ).exclude(enq_spero_srv_status=3)
                
#                 com_srv = pend_srv = on_srv = agg_hhc_events.objects.none()
#                 schd_srv = agg_hhc_event_plan_of_care.objects.none().count()
#                 if this_week_data:
#                     com_srv = this_week_data.filter(event_status=3)
                    
#                     pend_srv = this_week_data.filter(Q(event_status=1) | Q(event_status=4),Q(enq_spero_srv_status=1)|Q(enq_spero_srv_status=2))

#                     tomorrow = timezone.now() + timezone.timedelta(days=7)

#                     eve_ids = this_week_data.values_list('eve_id', flat=True)
#                     sch_srv = agg_hhc_event_plan_of_care.objects.filter(eve_id__in = eve_ids, start_date__gte=tomorrow,status=1)

#                     on_srv = this_week_data.filter(event_status=2)
                    
#                     tatal_count = this_week_data.count()

#                     # -------------- Completed Services -----------
#                     completed_srv = com_srv.count()
                    
#                     # -------------- Pending Services -----------
#                     pending_srv = pend_srv.count()
                   
#                     # -------------- Ongoing Services -----------
#                     ong_srv = on_srv.count()
                
#                     # # -------------- Schedule Services -----------
#                     schd_srv = sch_srv.count()
                   
                

#                 com_srv_fk_list = com_srv.values_list('eve_id', flat=True)
#                 com_srv_epoc = agg_hhc_event_plan_of_care.objects.filter(eve_id__in=com_srv_fk_list,status=1)

#                 comp_srv_dtl={
#                     'count_physio': com_srv_epoc.filter(srv_id=1).count(),
#                     'count_physician'  : com_srv_epoc.filter(srv_id=2).count(),
#                     'count_heal_attend' : com_srv_epoc.filter(srv_id=3).count(),
#                     'count_X_ray' : com_srv_epoc.filter(srv_id=4).count(),
#                     'count_nurse' : com_srv_epoc.filter(srv_id=5).count(),
                    
#                     'count_patheylogy' : com_srv_epoc.filter(srv_id=6).count()

#                 }

#                 pend_srv_fk_list = pend_srv.values_list('eve_id', flat=True)
#                 pend_srv_epoc = agg_hhc_event_plan_of_care.objects.filter(eve_id__in=pend_srv_fk_list,status=1)
#                 pend_srv_dtl={
#                     'count_physio': pend_srv_epoc.filter(srv_id=1).count(),
#                     'count_physician'  : pend_srv_epoc.filter(srv_id=2).count(),
#                     'count_heal_attend' : pend_srv_epoc.filter(srv_id=3).count(),
#                     'count_X_ray' : pend_srv_epoc.filter(srv_id=4).count(),
#                     'count_nurse' : pend_srv_epoc.filter(srv_id=5).count(),
#                     'count_patheylogy' : pend_srv_epoc.filter(srv_id=6).count()

#                 }
        
                
#                 ong_srv_fk_list = pend_srv.values_list('eve_id', flat=True)
#                 ong_srv_epoc = agg_hhc_event_plan_of_care.objects.filter(eve_id__in=ong_srv_fk_list,status=1)

#                 ong_srv_dtl = {
#                     'count_physio': ong_srv_epoc.filter(srv_id=1).count(),
#                     'count_physician': ong_srv_epoc.filter(srv_id=2).count(),
#                     'count_heal_attend': ong_srv_epoc.filter(srv_id=3).count(),
#                     'count_X_ray': ong_srv_epoc.filter(srv_id=4).count(),
#                     'count_nurse': ong_srv_epoc.filter(srv_id=5).count(),
#                     'count_patheylogy': ong_srv_epoc.filter(srv_id=6).count()
#                 }


#                 Completed_services = {
#                     'completed_srv': completed_srv if 'completed_srv' in locals() else 0,
#                     'comp_srv_dtl': comp_srv_dtl
#                 }

#                 Pending_services = {
#                     'Pending_srv': pending_srv if 'pending_srv' in locals() else 0,
#                     'pend_srv_dtl' : pend_srv_dtl
#                 }

#                 Ongoing_services = {
#                     'Ongoing_srv': ong_srv if 'ong_srv' in locals() else 0,
                    
#                     'ong_srv_dtl' : ong_srv_dtl
#                 }

#                 response_data = {
#                     'Total_services': tatal_count if 'tatal_count' in locals() else 0,#ch
#                     'Completed_services': Completed_services,
#                     'Pending_services': Pending_services,
#                     'ongoing_services': Ongoing_services,
#                     'schedule_services' : schd_srv
#                 } 

#             elif id == 3 :
#                 # end_date = datetime.now().date()
#                 end_date = datetime.datetime.now().date()
#                 start_date = end_date.replace(day=1)
#                 this_month_data = agg_hhc_events.objects.filter(
#                     last_modified_date__date__range=[start_date.isoformat(), end_date.isoformat()],status=1
                    
#                 ).exclude(enq_spero_srv_status=3)
                            
#                 com_srv = pend_srv = on_srv = agg_hhc_events.objects.none()
#                 schd_srv = agg_hhc_event_plan_of_care.objects.none()
#                 print(this_month_data, 'this month data')
#                 if this_month_data:
#                     com_srv = this_month_data.filter(event_status=3)

#                     pend_srv = this_month_data.filter(event_status=1)

#                     eve_ids = this_month_data.values_list('eve_id', flat=True)
#                     tomorrow = timezone.now() + timezone.timedelta(days=7)

#                     sch_srv = agg_hhc_event_plan_of_care.objects.filter(
#                         Q(start_date__gte=tomorrow) & Q(eve_id__in=eve_ids),status=1)
                    
#                     print(sch_srv, 'service charges')

#                     on_srv = this_month_data.filter(event_status=2)
                  
#                     tatal_count = this_month_data.count()

#                     # -------------- Completed Services -----------
#                     completed_srv = com_srv.count()
                   

#                     # -------------- Pending Services -----------
#                     pending_srv = pend_srv.count()
                   
#                     # -------------- Ongoing Services -----------
#                     ong_srv = on_srv.count()
                   

#                     # -------------- Schedule Services -----------
#                     schd_srv = sch_srv.count()
                    
                

#                 com_srv_fk_list = com_srv.values_list('eve_id', flat=True)
#                 com_srv_epoc = agg_hhc_event_plan_of_care.objects.filter(eve_id__in=com_srv_fk_list,status=1)

#                 comp_srv_dtl={
#                     'count_physio': com_srv_epoc.filter(srv_id=1).count(),
#                     'count_physician'  : com_srv_epoc.filter(srv_id=2).count(),
#                     'count_heal_attend' : com_srv_epoc.filter(srv_id=3).count(),
#                     'count_X_ray' : com_srv_epoc.filter(srv_id=4).count(),
#                     'count_nurse' : com_srv_epoc.filter(srv_id=5).count(),
                   
#                     'count_patheylogy' : com_srv_epoc.filter(srv_id=6).count()

#                 }

#                 pend_srv_fk_list = pend_srv.values_list('eve_id', flat=True)
#                 pend_srv_epoc = agg_hhc_event_plan_of_care.objects.filter(eve_id__in=pend_srv_fk_list,status=1)

#                 pend_srv_dtl={
#                     'count_physio': pend_srv_epoc.filter(srv_id=1).count(),
#                     'count_physician'  : pend_srv_epoc.filter(srv_id=2).count(),
#                     'count_heal_attend' : pend_srv_epoc.filter(srv_id=3).count(),
#                     'count_X_ray' : pend_srv_epoc.filter(srv_id=4).count(),
#                     'count_nurse' : pend_srv_epoc.filter(srv_id=5).count(),
#                     'count_patheylogy' : pend_srv_epoc.filter(srv_id=6).count()

#                 }
        
                
#                 ong_srv_fk_list = on_srv.values_list('eve_id', flat=True)
#                 ong_srv_epoc = agg_hhc_event_plan_of_care.objects.filter(eve_id__in=ong_srv_fk_list,status=1)
            
#                 ong_srv_dtl = {
#                     'count_physio': ong_srv_epoc.filter(srv_id=1).count(),
#                     'count_physician': ong_srv_epoc.filter(srv_id=2).count(),
#                     'count_heal_attend': ong_srv_epoc.filter(srv_id=3).count(),
#                     'count_X_ray': ong_srv_epoc.filter(srv_id=4).count(),
#                     'count_nurse': ong_srv_epoc.filter(srv_id=5).count(),
#                     'count_patheylogy': ong_srv_epoc.filter(srv_id=6).count()
#                 }


#                 Completed_services = {
#                     'completed_srv': completed_srv if 'completed_srv' in locals() else 0,
#                     'comp_srv_dtl': comp_srv_dtl
#                 }

#                 Pending_services = {
#                     'Pending_srv': pending_srv if 'pending_srv' in locals() else 0,
#                     'pend_srv_dtl': pend_srv_dtl
#                 }


#                 Ongoing_services = {
#                     'Ongoing_srv': ong_srv if 'ong_srv' in locals() else 0,
#                     'ong_srv_dtl': ong_srv_dtl
#                 }

#                 response_data = {
#                     'Total_services': tatal_count if 'tatal_count' in locals() else 0,
#                     # 'Total_services':agg_hhc_detailed_event_plan_of_care.objects.filter(status=1,actual_StartDate_Time=datetime.now()).count(),
#                     'Completed_services': Completed_services,
#                     'Pending_services': Pending_services,
#                     'ongoing_services': Ongoing_services,
#                     'schedule_services' : schd_srv
                    
#                 }

#             else:
#                 response_data = {
#                 'message': 'Invalid id provided. Please provide a valid id.'
#                 }
#             print("stop")
#             return Response(response_data)
#         except Exception as e:
#             import traceback
#             traceback.print_exc()
#             return Response({"error": str(e)})

# ---------------- Old Vinayak Code -------------------------

# ---------------- HD Dashboard New Amit Code -------------------------
class srv_dtl_dash(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, id, format=None):
        try:
            start_date = timezone.now().date()
            if id == 1:
                # Calculate the date for todays days
                # start_date = timezone.now().date()
                # start_datetime = datetime.combine(start_date, datetime.min.time())
                
                start_datetime = datetime.combine(start_date, datetime.min.time())
                end_datetime = datetime.combine(start_date, datetime.max.time())
                
                # today_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__range=(start_datetime, end_datetime), status=1)
                # on_going = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__range=(start_datetime, end_datetime), status=1, Session_jobclosure_status = 2, eve_id__event_status__in = [2])
                # completed_Services = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__range=(start_datetime, end_datetime), status=1, Session_jobclosure_status = 1)
                # Pending = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__range=(start_datetime, end_datetime), status=1, eve_id__event_status__in = [1])
                # print(start_date)
                today_data = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(eve_id__event_status = 2) | Q(eve_id__event_status = 3) , actual_StartDate_Time__range=(start_datetime, end_datetime), status=1)
                on_going = today_data.filter(Session_status__in=[8,2,9]).exclude(Session_jobclosure_status=1)
                completed_Services = today_data.filter(Session_jobclosure_status=1)
                Pending = today_data.filter(Session_jobclosure_status=2).exclude(Q(Session_status=8)|Q(Session_status=2)|Q(Session_status=9))


                # data = list(today_data.values())
                # data = list(on_going.values())                
                total_services_count = today_data.count()


                on_going_count = on_going.count()

                completed_Services_count = completed_Services.count()
                
                Pending_count = Pending.count()
                # response_data = {
                #     "Total_services": total_services_count,
                #     "ongoing_services": on_going_count,
                #     "Completed_services": completed_Services_count,
                #     "Pending_services":Pending_count,
                #     # "data": data
                # }
                response_data = {
                    "Total_services": total_services_count,
                    "Completed_services": {
                        "completed_srv": completed_Services_count
                    },
                    "Pending_services": {
                        "Pending_srv": Pending_count
                    },
                    "ongoing_services": {
                        "Ongoing_srv": on_going_count
                    }
                }
                
                return Response(response_data, status=status.HTTP_200_OK)
            
            elif id == 2:
                # Calculate the date for 7 days ago
                # start_date = timezone.now().date() - timedelta(days=7)
                # start_datetime = datetime.combine(start_date, datetime.min.time())
                start_datetime = datetime.combine(start_date - timedelta(days=start_date.weekday()), datetime.min.time())                
                end_datetime = datetime.combine(start_date, datetime.max.time())

                # seven_Days_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__range=(start_datetime, end_datetime), status=1)
                # on_going = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__range=(start_datetime, end_datetime), status=1, Session_jobclosure_status = 2, eve_id__event_status__in = [2])
                # completed_Services = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__range=(start_datetime, end_datetime), status=1, Session_jobclosure_status = 1)
                # Pending = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__range=(start_datetime, end_datetime), status=1, eve_id__event_status__in = [1])


                seven_Days_data = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(eve_id__event_status = 2) | Q(eve_id__event_status = 3) , actual_StartDate_Time__range=(start_datetime, end_datetime), status=1)
                on_going = seven_Days_data.filter(Session_status__in=[8,2,9]).exclude(Session_jobclosure_status=1)
                completed_Services = seven_Days_data.filter(Session_jobclosure_status=1)
                Pending = seven_Days_data.filter(Session_jobclosure_status=2).exclude(Q(Session_status=8)|Q(Session_status=2)|Q(Session_status=9))
            
                # data = list(seven_Days_data.values())

                total_services_count = seven_Days_data.count()

                completed_Services_count = completed_Services.count()
                on_going_count = on_going.count() 
                Pending_count = Pending.count()

                # response_data = {
                #     "Total_services": total_services_count,
                #     "ongoing_services": on_going_count,
                #     "Completed_services": completed_Services_count,
                #     "Pending_services":Pending_count,                                       
                #     # "data": data
                # }
                response_data = {
                    "Total_services": total_services_count,
                    "Completed_services": {
                        "completed_srv": completed_Services_count
                    },
                    "Pending_services": {
                        "Pending_srv": Pending_count
                    },
                    "ongoing_services": {
                        "Ongoing_srv": on_going_count
                    }
                }                 
                
                return Response(response_data, status=status.HTTP_200_OK)

            elif id == 3:
                # Calculate the date for 30 days ago
                # start_date = timezone.now().date() - timedelta(days=30)
                # start_datetime = datetime.combine(start_date, datetime.min.time())

                # start_datetime = datetime.combine(start_date.replace(day=1), datetime.min.time())                
                # end_datetime = datetime.combine(start_date, datetime.max.time())

                
                today = timezone.now().date()
                last_day = calendar.monthrange(today.year, today.month)[1]
                month_end_date = today.replace(day=last_day)
               
                start_datetime = datetime.combine(start_date.replace(day=1), datetime.min.time())                
                end_datetime = datetime.combine(month_end_date, datetime.max.time())
                
                
                # thirty_days_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__range=(start_datetime, end_datetime), status=1)
                # on_going = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__range=(start_datetime, end_datetime), status=1, Session_jobclosure_status = 10, eve_id__event_status__in = [2])
                # completed_Services = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__range=(start_datetime, end_datetime), status=1, Session_jobclosure_status = 2)
                # Pending = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__range=(start_datetime, end_datetime), status=1, eve_id__event_status__in = [1], Session_jobclosure_status = 1)

                thirty_days_data = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(eve_id__event_status = 2) | Q(eve_id__event_status = 3) , actual_StartDate_Time__range=(start_datetime, end_datetime), status=1)
                on_going = thirty_days_data.filter(Session_status__in=[8,2,9]).exclude(Session_jobclosure_status=1)
                completed_Services = thirty_days_data.filter(Session_jobclosure_status=1)
                Pending = thirty_days_data.filter(Session_jobclosure_status=2).exclude(Q(Session_status=8)|Q(Session_status=2)|Q(Session_status=9))

                # print(thirty_days_data.count())
                print(on_going.count())
                # print(completed_Services.count())

                # data = list(thirty_days_data.values())
                total_services_count = thirty_days_data.count()
                
                on_going_count = on_going.count()

                completed_Services_count = completed_Services.count()                
                Pending_count = Pending.count()                
                # response_data = {
                #     "Total_services": total_services_count,
                #     "ongoing_services": on_going_count,
                #     "Completed_services": completed_Services_count,
                #     "Pending_services":Pending_count,                                           
                #     # "data": data
                # }
                response_data = {
                    "Total_services": total_services_count,
                    "Completed_services": {
                        "completed_srv": completed_Services_count
                    },
                    "Pending_services": {
                        "Pending_srv": Pending_count
                    },
                    "ongoing_services": {
                        "Ongoing_srv": on_going_count
                    }
                }                
                
                return Response(response_data, status=status.HTTP_200_OK)                        
            else:
                return Response({"detail": "Invalid ID"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ---------------- HD Dashboard New Amit Code -------------------------



class Create_Get_User_Views(APIView):
    def get(self, request, format=None):
        users = agg_com_colleague.objects.all().exclude(Q(grp_id=2) | Q(grp_id=None)).order_by('pk')
        serializer = Create_User_serializer(users, many=True)
        return Response(serializer.data)

class group_and_type_Views(APIView):
    def get(self, request, format=None):
        users = agg_mas_group.objects.filter(grp_status=1)
        serializer = group_and_type_serializer(users, many=True)
        return Response(serializer.data)




class Create_Post_User_Views(APIView):
    # def get(self, request, format=None):
    #     users = agg_com_colleague.objects.all()
    #     serializer = Create_User_POST_serializer(users, many=True)
    #     return Response(serializer.data)
    
    def post(self, request, format=None):
        data = request.data
        mobile_no = data.get('clg_mobile_no')
        grp_id = data.get('grp_id')
        if agg_com_colleague.objects.filter(clg_mobile_no=mobile_no, grp_id=grp_id).exists():
            raise ValidationError("A user with the same mobile number and group ID already exists.")
                
        last_user = agg_com_colleague.objects.all().order_by('id').last()
        if last_user:
            last_code = last_user.clg_Emplyee_code
            if last_code and last_code.startswith('EMP') and last_code[3:].isdigit():
                new_code = 'EMP' + str(int(last_code[3:]) + 1).zfill(6)
            else:
                new_code = 'EMP000001'
        else:
            new_code = 'EMP000001'
        
        data['clg_Emplyee_code'] = new_code
        
        serializer = Create_User_POST_serializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            user.set_password('1234')  # Set the default password to "1234"
            user.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





class Edit_User_Views(APIView):
    def get(self, request, clg_id, format=None):
        users = agg_com_colleague.objects.get(pk=clg_id)
        serializer = User_Edit_serializer(users)
        return Response(serializer.data)
    
    def put(self, request, clg_id, format=None):
        try:
            user = agg_com_colleague.objects.get(pk=clg_id)
        except agg_com_colleague.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        data = request.data
        
        # Check if another user with the same mobile number and group ID already exists
        mobile_no = data.get('clg_mobile_no')
        grp_id = data.get('grp_id')
        if agg_com_colleague.objects.filter(clg_mobile_no=mobile_no, grp_id=grp_id).exclude(pk=clg_id).exists():
            raise ValidationError("Another user with the same mobile number and group ID already exists.")
        
        serializer = User_Edit_serializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class active_inActive_User_Views(APIView):
    def get(self, request, clg_id, format=None):
        users = agg_com_colleague.objects.get(pk=clg_id)
        serializer = active_inActive_User_serializer(users)
        return Response(serializer.data)
    
    def put(self, request, clg_id, format=None):
        try:
            user = agg_com_colleague.objects.get(pk=clg_id)
        except agg_com_colleague.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        data = request.data
        
        # Check if another user with the same mobile number and group ID already exists
        # mobile_no = data.get('clg_mobile_no')
        # grp_id = data.get('grp_id')
        # if agg_com_colleague.objects.filter( grp_id=grp_id).exclude(pk=clg_id).exists():
        #     raise ValidationError("Another user with the same mobile number and group ID already exists.")
        
        serializer = active_inActive_User_serializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# -------------------------------------Amit Rasale--------------------------------------------------------------- 



#--------------Transport api creted for professional transport charges created by vishal---------------------------------

class transport_charges_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,hosp_id,lat,long,start_date,end_date):
        try:
            # start_date_string = start_date
            # end_date_string = end_date
            # start_date_string = start_date_string.replace('T',' ') 
            # end_date_string = end_date_string.replace('T',' ')
            # start_date = datetime.strptime(str(start_date_string), '%Y-%m-%d %H:%M').date()
            start_date = datetime.strptime(str(start_date), '%Y-%m-%d').date()#converting string time in date datatype
            end_date=datetime.strptime(str(end_date),'%Y-%m-%d').date()
            total_days = (end_date - start_date).days
            # print("this is days remaning days",total_days)
            # print("this is end date string",type(start_date))
            hospital=agg_hhc_hospitals.objects.get(hosp_id=hosp_id,status=1)
            hosp_loc=(hospital.lattitude,hospital.langitude)
            # print(hosp_loc)
            patient_loc=(float(lat),float(long))
            result=hs.haversine(hosp_loc,patient_loc,unit=Unit.KILOMETERS)
            # print(result)
            remain_distance=abs((hospital.distance_km-math.ceil(result)))
            # print("total remaining distance is",remain_distance)
            remain_amount=0
            final_price=0
            if(remain_distance>0):
                remain_amount=remain_distance*1#
                # print(remain_amount)
                for i in range(remain_distance):
                    if i%int(hospital.price_change_km)==0:
                        final_price=final_price+int(hospital.km_price)
            if(start_date>end_date):
                return Response({"date error ":"plz select proper date"},status=200)
            final_price=final_price*total_days    
            return Response({"final_amount":final_price},status=200)
        except Exception as e:
            return Response({"error":str(e)},status=status.HTTP_200_OK)
    
class FindProfessionalSubService(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    # def get_professional(self, sub_service):
    #         professional = agg_hhc_professional_sub_services.objects.filter(sub_srv_id=sub_service)
    #         return professional

    def find_prof(self, lat,patient_loc):
        employee_zones = {
            "Employee1": Polygon(lat),
        }
        client_location = Point(patient_loc)
        for employee, zone in employee_zones.items():
            if zone.contains(client_location):
                # print(f"Client is present in {employee}'s zone.")
                return True
        else:
            # print("Client is not present in any employee's zone.")
            return False
        
    def send_notification(self,professional,sub_service, address,notif_id):
        # professional = request.data['srv_prof_id']
        self.sub_service=sub_service
        self.address=address
        self.notif_id=notif_id
        prof = agg_hhc_service_professionals.objects.get(srv_prof_id=professional)
        notification_data={'noti_id':self.notif_id , 'srv_prof_id':professional}
        notification_serializer=Professional_notification_serializer(data=notification_data)
        if notification_serializer.is_valid():
            notification_serializer.save()
        # print(sub_service, address)
        # print(prof, ';;prof;;')
        # print(prof.clg_ref_id.clg_is_login)
        # prof_noti_serializer=Professional_notification_serializer()
        url = 'https://fcm.googleapis.com/fcm/send'
        # print(prof.clg_ref_id,';1234')
        device_token = DeviceToken.objects.get(clg_id=prof.clg_ref_id,is_login=True)
        # print(device_token)
        server_key = SERVER_KEY
        # print(device_token.token,';;;;')
        # notificaqtion Body == 'you have assign new service of {sub_srv_name} for {patient_address} location'
        body=f'you have assign new service of {self.sub_service} for {self.address} location'
        notification = { 'title': 'New Service Request', 'body': body }
        payload = {'to': device_token.token,'notification': notification}
        headers = {'Authorization': f'key={server_key}', 'Content-Type': 'application/json'}
        response = (requests.post(url, json=payload, headers=headers)).json()
        # print(response,';;rooot')
        # print(response)
        #     return JsonResponse(response, safe=False)
        # else:
        #     return Response('professional is not login')

    def get(self, request, eve_id):
        # sub_service = request.data['sub_service']
        eve_id = agg_hhc_events.objects.get(eve_id=eve_id)
        # eve_id = agg_hhc_events.objects.get(eve_id=request.data['event_id'])
        poc=agg_hhc_event_plan_of_care.objects.get(eve_id=eve_id)
        sub_service=poc.sub_srv_id
        # print(poc.end_time, ';;startDate;;')
        prof_sub = agg_hhc_professional_sub_services.objects.filter(sub_srv_id=sub_service)
        Available_prof=[]
        # for prof in prof_sub:
        #     print(prof.srv_prof_id,'demo')
        # if prof_sub.count()==0:
        #     print('no session')
        # print(prof_sub,'\nprofessional_provided_sub_service')
        prof_sub
        for prof_available in prof_sub:
            # print(prof_available.srv_prof_id.clg_ref_id.clg_is_login,';;professional ids;;')
            if prof_available.srv_prof_id.clg_ref_id.clg_is_login:
                # print(prof_available.srv_prof_id.srv_prof_id, prof_available.srv_prof_id.prof_fullname,';;;;;')
                prof_date=agg_hhc_professional_availability.objects.filter(srv_prof_id=prof_available.srv_prof_id).order_by('date')
                # for dates in prof_date:
                #     print(dates,'dates')
                if prof_date.count()==0:
                    # print('no schedule, j')
                    pass
                else:
                    # start_date=(datetime.strptime(request.data['start_date'], '%Y-%m-%d')).date()
                    # end_date=(datetime.strptime(request.data['end_date'], '%Y-%m-%d')).date()
                    start_date=poc.start_date
                    end_date=poc.end_date
                    if len(prof_date)>=(((end_date-start_date).days)+1):
                        dates=[datess.date for datess in prof_date]
                        # print(dates)
                        i=0
                        # start_time=datetime.strptime(request.data['start_time'], '%H-%M').time()
                        # end_time=datetime.strptime(request.data['end_time'], '%H-%M').time()
                        start_time=poc.start_time
                        end_time=poc.end_time
                        while start_date <= end_date:
                            # print(start_date,';;;ll;;;')
                            if start_date in dates:
                                # print(prof_date[i].professional_avaibility_id)
                                # prof_time=agg_hhc_professional_availability_detail.objects.filter(prof_avaib_dt_id=prof_date[i].professional_avaibility_id)
                                prof_time=agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=prof_date[i].professional_avaibility_id)
                                for proft in prof_time:
                                    if proft.start_time<=start_time and proft.end_time>=end_time:
                                        prof_loc=agg_hhc_professional_location_details.objects.filter(prof_loc_id=proft.prof_loc_id)
                                        points=[[prof_locs.lattitude,prof_locs.longitude] for prof_locs in prof_loc]
                                        # print(points, 'points')
                                        is_present = self.find_prof(points,[eve_id.agg_sp_pt_id.lattitude,eve_id.agg_sp_pt_id.langitude])
                                        # is_present = self.find_prof(points,[request.data['lattitude'],request.data['longitude']])
                                        # print(is_present)
                                        if prof_available.srv_prof_id not in Available_prof:
                                            Available_prof.append(prof_available.srv_prof_id)
                                        # print(Available_prof,';;;;k;k;;;;')
                                    else:
                                        if prof_available.srv_prof_id in Available_prof:
                                            Available_prof.pop(prof_available.srv_prof_id)
                                            # print('nnnnnnnnnnnnnnnn')
                                        break
                                start_date = (start_date + timedelta(days=1))
                                # print(start_date)
                            elif start_date not in dates:
                                    # print('False')
                                    break
        # print(Available_prof,',;;;;llllllll')
        Broadcast_To=[]
        for aval_prof in Available_prof:
            start_date=poc.start_date
            end_date=poc.end_date
            # start_time=datetime.strptime(request.data['start_time'], '%H-%M').time()
            # end_time=datetime.strptime(request.data['end_time'], '%H-%M').time()
            # start_date=(datetime.strptime(request.data['start_date'], '%Y-%m-%d')).date()
            # end_date=(datetime.strptime(request.data['end_date'], '%Y-%m-%d')).date()
            # prof=agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id=aval_prof.srv_prof_id, actual_StartDate_Time__range=[start_date, end_date],start_time__gte=start_time,end_time__lte=end_time,status=1)
            start_time=poc.start_time
            end_time=poc.end_time
            start_date=poc.start_date
            end_date=poc.end_date
            prof=agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id=aval_prof.srv_prof_id, actual_StartDate_Time__range=[start_date, end_date],start_time__gte=start_time,end_time__lte=end_time,status=1)
            # prof=agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id=aval_prof.srv_prof_id)
            # prof=agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id=aval_prof.srv_prof_id, actual_StartDate_Time__range=[start_date, end_date],start_time__gte=start_time,end_time__lte=end_time,status=1)
            # prof=agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id=aval_prof.srv_prof_id,actual_StartDate_Time__gte=start_date,actual_StartDate_Time__lte=end_date)#, actual_StartDate_Time__range=[start_date, end_date])
            # data=[[[profs.actual_StartDate_Time],[profs.actual_EndDate_Time],[profs.start_time],[profs.end_time]] for profs in prof]
            # SDate=[profs.actual_StartDate_Time for profs in prof]
            # # EDate=[profs.actual_EndDate_Time for profs in prof]
            # STime=[profs.start_time for profs in prof]
            # ETime=[profs.end_time for profs in prof]
            # print(SDate)
            # print(STime)
            # print(ETime)
            # print(prof)
            # print('prof;kj.,')
            if not prof:
                Broadcast_To.append(aval_prof.srv_prof_id)
            # print(Broadcast_To,'lkl;;;lll')
        # eventId=request.data['event_id']
        eventId=eve_id.eve_id
        try:
            eve = agg_hhc_events.objects.get(eve_id=eventId)
        except agg_hhc_events.DoesNotExist:
            return Response({'error':'event ID does not exist'})
        address = eve_id.agg_sp_pt_id.address
        body=f'you have assign new service of {sub_service} for {address} location'
        data1={'noti_title':'New Service Request', 'noti_body':body, 'eve_id':eventId}
        notification_serializer=NotificationList_serializer(data=data1)
        if notification_serializer.is_valid():
            notif_id=notification_serializer.save().noti_id
            notif_id
        # print(notif_id)
        for broadcast in Broadcast_To:
            # print(broadcast)
            self.send_notification(broadcast,sub_service, address, notif_id)
        return Response({'b':Broadcast_To})        


# from fcm_django.models import FCMDevice
# from .models import DeviceToken
# from .serializers import DeviceTokenSerializer

# class DeviceTokenView(APIView):
#     def post(self, request):
#         user = request.user.id  # Assuming you have authentication set up
#         token = request.data.get('token')  # FCM device token sent from the client

#         if token:
#             fcm_device = FCMDevice.objects.create(registration_id=token)
#             device_token, created = DeviceToken.objects.get_or_create(user=user)
#             device_token.fcm_device = fcm_device
#             device_token.save()
#             serializer = DeviceTokenSerializer(device_token)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)

#         return Response({'error': 'Token not provided'}, status=status.HTTP_400_BAD_REQUEST)

class Store_Token(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def find_professional(self, prof_id):
        # print(prof_id,'abc')
        try:
            prof=DeviceToken.objects.get(srv_prof_id=prof_id)
            # print(prof)
            return prof
        except DeviceToken.DoesNotExist:
            return None
            
        
        
    # def post(self, request):
    #     prof_id = request.data['srv_prof_id']  # Assuming you have authentication set up
    #     token = request.data['token']  # FCM device token sent from the client
    #     prof= self.find_professional(prof_id)
    #     print(request.data)
    #     print(prof,';;;')
    #     if prof:
    #         print(';;;')
    #         prof_serializer = DeviceToken_serializer(data=request.data)
    #         print(prof_serializer.data,';;;;')
    #         if prof_serializer.is_valid():
    #             prof_serializer.save()   
    #         return Response(prof_serializer.data, status=status.HTTP_201_CREATED)
    #     else:
    #         prof_serializer = DeviceToken_serializer(prof,data=request.data,many=True)
    #         if prof_serializer.is_valid():
    #             prof_serializer.save()
    #             return Response(prof_serializer.data, status=status.HTTP_201_CREATED)
    #     return Response({'error': 'Token not provided'}, status=status.HTTP_400_BAD_REQUEST)

    # def post(self, request):
    #     prof_id = request.data['srv_prof_id']
    #     token = request.data['token']
        
    #     if prof_id is None or token is None:
    #         return Response({'error': 'prof_id or token not provided'}, status=status.HTTP_400_BAD_REQUEST)
    #     try:
    #         device_token = DeviceToken.objects.get(srv_prof_id=prof_id)
    #         serializer = DeviceToken_serializer(device_token, data=request.data)
    #     except DeviceToken.DoesNotExist:
    #         serializer = DeviceToken_serializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
      

# class SendNotificationView(APIView):
#     def post(self, request):
#         title = request.data.get('title')
#         body = request.data.get('body')
#         message = request.data.get('message')

#         if title and body:
#             devices = FCMDevice.objects.all()
#             print(devices,';;;;')

#             devices.send_message(title=title, body=body,message=message)
#             return Response({'message': 'Notification sent'}, status=status.HTTP_200_OK)

#         return Response({'error': 'Title or body missing'}, status=status.HTTP_400_BAD_REQUEST)
#----------------Enquiry get api --------------------------------------------

# class enquiry_get_api(APIView):
#     def get(self,request):
#         return Response({'record found':''})

class professional_Denial_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]  
    def get(self,request):
        try:
            denial_list=agg_hhc_professional_Denial_reason_list.objects.filter(status=1)
            serilize_denial=agg_hhc_professional_Denial_reason_list_serializer(denial_list,many=True)
            serilize_new_data={"Reason_lst_id":0,"reason": "Other"}
            serilize_denial=serilize_denial.data+[serilize_new_data]
            return Response(serilize_denial)
        except Exception as e:
            return Response({'error':e},status=400)
    def post(self,request):
        clgref_id = get_prof(request)[3]
        
        request.data['last_modified_by'] = clgref_id

        try:
            serializers=agg_hhc_professional_Denial_serializer(data=request.data)
            if serializers.is_valid():
                serializers.save()
                return Response(serializers.data)
        except Exception as e:
            return Response({'error':e},status=400)

class add_consultant(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]  
    def post(self,request):
        clgref_id = get_prof(request)[3]
        request.data['last_modified_by'] = clgref_id 
        phone=request.data['mobile_no']
        # consultant = agg_hhc_doctors_consultants.objects.filter(mobile_no=phone, status=1)
        # if consultant
        consultants=agg_hhc_doctors_consultants.objects.filter(mobile_no=phone,status=1)
        if consultants:
            return Response({'error':'consultant already exist'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            doc_counsultant = agg_hhc_doctors_consultants_add_serializer(data=request.data)
            try:
                if doc_counsultant.is_valid():
                    doc_counsultant.save()
                    return Response(doc_counsultant.data)
            except Exception as e:
                return Response({"error":e}, status=400)
   
# ------------------------------------------------------------------------------------------------------
class agg_hhc_consultant_HD_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        consultant= agg_hhc_doctors_consultants.objects.filter(status=1).order_by('cons_fullname')
        consultantSerializer= agg_hhc_doctors_consultants_HD_serializer(consultant,many=True)
        other={
            "doct_cons_id": 0,
            "cons_fullname": "Other",
            "mobile_no": 0000
            }
        consultants=[other]+list(consultantSerializer.data)

        return Response(consultants)
# ------------------------------------------------------------------------------------------------------

from django.core.files.uploadedfile import UploadedFile

class concent_upload_discharge_summery_document_signature(APIView):
    serializer_class = get_ptn_data_for_concent
    def get(self, request, eve_id):
        get_eve_id = agg_hhc_concent_form_details.objects.filter(eve_id=eve_id,status=1)
        if get_eve_id.exists():
            return Response({'message':'form already sumitted'})
        else:
            event_poc = agg_hhc_event_plan_of_care.objects.filter(eve_id=eve_id, status=1)
            serializer = self.serializer_class(event_poc, many=True)  
            return Response(serializer.data)



    def post(self, request, *args, **kwargs):
        # clgref_id = get_prof(request)[3]
        try:
            eve_id = request.data.get('eve_id')
            is_aggree = request.data.get('is_aggree')
            sign = request.data.get('sign')
            clg_id = request.data.get('clg_id')
            print(type(sign),"Type of signature")
            print(sign,"sign")
            if not isinstance(sign, UploadedFile):
                return Response("Signature file is missing or invalid", status=status.HTTP_400_BAD_REQUEST)


            # Retrieve agg_hhc_events instance based on eve_id
            try:
                event_instance = agg_hhc_events.objects.get(eve_id=eve_id)
            except agg_hhc_events.DoesNotExist:
                return Response("Event does not exist", status=status.HTTP_404_NOT_FOUND)

            # Retrieve multiple files sent in the request
            discharge_files = request.FILES.getlist('Discharge_summ_docs')
            print(discharge_files,"discharge_files")
            for file in discharge_files:
                if not isinstance(file, UploadedFile):
                    return Response("Discharge files contain non-file data", status=status.HTTP_400_BAD_REQUEST)

            for idx, discharge_file in enumerate(discharge_files):
                print(f"File {idx+1}: {type(discharge_file)}")
            

            # Create agg_hhc_concent_form_details instance
            form_instance = agg_hhc_concent_form_details.objects.create(eve_id=event_instance, is_aggree=is_aggree,
                                                                        sign=sign)

            # Loop through and create DischargeFile instances for each file
            for discharge_file in discharge_files:
                discharge_file_instance = DischargeFile.objects.create(file=discharge_file)
                form_instance.Discharge_summ_docs.add(discharge_file_instance)
            
            event_instance.consent_submited = 1
            event_instance.save()

            # data = {
            #     'eve_id': eve_id,
            #     'is_aggree': is_aggree,
            #     'sign': sign,
            #     'discharge_files': [file for file in discharge_files]  # Include file names in response
            # } 
            return Response("Data successfully created", status=status.HTTP_201_CREATED)
            # return Response({"data":data}, status=status.HTTP_201_CREATED)
        except:
            return Response({"error":"something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class call_back_notification_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        prf_list=[]
        record=professional_call_back.objects.filter(status=1).order_by('added_date')
        for i in record:
            professional=agg_hhc_service_professionals.objects.get(clg_ref_id=i.clg_id)
            eve={'cb_id':i.cb_id,'professional_Name':professional.prof_fullname,'phone_number':professional.phone_no,'time':str(i.added_date)}
            prf_list.append(eve)
        # serializer=professional_call_back_serializer(record,many=True)
        return Response(prf_list)
    def post(self,request):
        clgref_id = get_prof(request)[3]
        
        request.data['last_modified_by'] = clgref_id
        print("clg_refid", clgref_id)
        cal_back=professional_call_back.objects.get(cb_id=request.data.get('cb_id'))
        pro =request.data.get('clgs_id')
        request.data['status']=2
        request.data['call_back_done_by']=pro
        # request.data['last_modified_date']=timezone.now()
        # request.data['last_modified_by']=pro
        call_back_serializers=professional_call_back_serializer(cal_back,data=request.data)
        if call_back_serializers.is_valid():
            call_back_serializers.save()
            return Response({"message":"record is saved sucessfully","record":call_back_serializers.data})#serializer.data})     
        return Response(call_back_serializers.errors,status=status.HTTP_400_BAD_REQUEST)

class enquiry_Service_Notification_count(APIView):
    def get(self, request):
        service_request_count = agg_hhc_events.objects.filter(Q(enq_spero_srv_status=2)| Q(enq_spero_srv_status=1),status=1, event_status=1).count()
        # service_request_count1 = agg_hhc_events.objects.filter(Q(enq_spero_srv_status=2)| Q(enq_spero_srv_status=1),status=1, event_status=1)
        # service_request_count11 =agg_hhc_event_plan_of_care_Serializer(service_request_count1, many=True)
        # print(service_request_count11.data, ';;;;')
        # request=service_request_count11.data
        # destination_instances = []
        # for data in service_request_count11.data:
        #     destination_instance = agg_hhc_events1(**data)
        #     destination_instances.append(destination_instance)
        # print(destination_instance,';;')
        # model_meta=agg_hhc_events1._meta
        # field_names = [field.name for field in model_meta.get_fields()]
        # print("Field names:", field_names)
        # for f in field_names:


        # Bulk create destination instances for efficiency
        # agg_hhc_events1.objects.bulk_create(destination_instances)
# -------------------------------------------------------------------------------------------------------------
        # original_record = YourModel.objects.get(pk=your_record_id)  # Replace your_record_id with the actual ID of the record

        # # Step 2: Create a new instance with the same values
        # new_record = YourModel(**{field.name: getattr(original_record, field.name) for field in YourModel._meta.fields if field.name != 'id'})

        # # Step 3: Modify if necessary
        # # Example: Change the value of a field
        # new_record.field1 = 'New Value'

        # # Step 4: Save the new record
        # new_record.save()
        # data={}
       ## d1=agg_hhc_event_plan_of_care1_Serializer(data=service_request_count11.data, many=True)
       ## if d1.is_valid():
       ##     d1.save()
       ## print(d1.data)
# -------------------------------------------------------------------------------------------------------------
        enquiry = agg_hhc_events.objects.filter(Q(enq_spero_srv_status=3),Q(purp_call_id=2),status=1, event_status=1)
        
        enquiry=enquiry.order_by('eve_id')
        enquiry_count=0
        for i in enquiry:
            # print(i.eve_id, ';;;;;;fddffd;;;')
            follow_up_count=agg_hhc_enquiry_follow_up.objects.filter(event_id=i.eve_id).count()
            print(follow_up_count, ';;;;;;llll;;;;demo', i.eve_id)
            if follow_up_count == 1:
                enquiry_count=enquiry_count+1
        data={
            "service_request_count":service_request_count,
            "enquiry_notification_count":enquiry_count
        }
        return Response(data)
    
class Ongoing_Eve(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    # def get(self, request):
    #     # if(int(hosp_id)==0):
    #     data =  agg_hhc_events.objects.filter(Q(event_status=2) | Q(event_status=3),status=1)
    #     # else:
    #     #     data =  agg_hhc_events.objects.filter(Q(event_status=2) | Q(event_status=3),status=1,added_from_hosp=hosp_id)
    #     serialize_data=Ongoing_Eve_serializer(data, many=True) 
    #     return Response(serialize_data.data)

    
    def get(self, request):
        # if(int(hosp_id)==0):
        print('hiii')
        eve_ids = []
        print(eve_ids,'eve')

        if eve_code:= request.GET.get('eve_code'):
            eve_idss = agg_hhc_events.objects.filter(event_code=eve_code, status=1)
            for eve_id in eve_idss:
                eve_ids.append(eve_id.eve_id) 
        elif (cl_no:= request.GET.get('caller_no')):
            print('condition in cl number and date')
            if (date := request.GET.get('date')):
                
                dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=date, status = 1)
                eve_ids_lst = list(set(dtl_data.values_list('eve_id', flat=True)))
                cl_dt = agg_hhc_callers.objects.filter(phone__icontains=cl_no)
                eve_idss = agg_hhc_events.objects.filter(eve_id__in=eve_ids_lst, caller_id__in=cl_dt, status=1)
            else:
                cl_dt = agg_hhc_callers.objects.filter(phone__icontains=cl_no)
                eve_idss = agg_hhc_events.objects.filter(caller_id__in=cl_dt, status=1)
            for eve_id in eve_idss:
                eve_ids.append(eve_id.eve_id) 
        elif (cl_name:= request.GET.get('caller_name')):
            print('condition in cl name and date')
            if (date := request.GET.get('date')):
            
                dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=date, status = 1)
                cl_dt = agg_hhc_callers.objects.filter(caller_fullname__icontains=cl_name)
                eve_ids_lst = list(set(dtl_data.values_list('eve_id', flat=True)))
                eve_idss = agg_hhc_events.objects.filter(eve_id__in=eve_ids_lst, caller_id__in=cl_dt, status=1)
                dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=date, status = 1)
            else:
                cl_dt = agg_hhc_callers.objects.filter(caller_fullname__icontains=cl_name)
               
                eve_idss = agg_hhc_events.objects.filter( caller_id__in=cl_dt, status=1)

            for eve_id in eve_idss:
                eve_ids.append(eve_id.eve_id)
        elif (pt_no:= request.GET.get('patient_no')) :
            print('condition in patient no and date')
            if (date := request.GET.get('date')):
                dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=date, status = 1)
                pt_dt = agg_hhc_patients.objects.filter(phone_no__icontains=pt_no)
                eve_ids_lst = list(set(dtl_data.values_list('eve_id', flat=True)))
                eve_idss = agg_hhc_events.objects.filter(eve_id__in=eve_ids_lst, agg_sp_pt_id__in=pt_dt, status=1)
            else: 
                pt_dt = agg_hhc_patients.objects.filter(phone_no__icontains=pt_no)
                eve_idss = agg_hhc_events.objects.filter(agg_sp_pt_id__in=pt_dt, status=1)
            for eve_id in eve_idss:
                eve_ids.append(eve_id.eve_id)
        elif (pt_name:= request.GET.get('patient_name')):
            print('condition in patient name and date')
            if (date := request.GET.get('date')):
                dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=date, status = 1)
                pt_dt = agg_hhc_patients.objects.filter(name__icontains=pt_name)
                eve_ids_lst = list(set(dtl_data.values_list('eve_id', flat=True)))
                eve_idss = agg_hhc_events.objects.filter(eve_id__in=eve_ids_lst, agg_sp_pt_id__in=pt_dt, status=1)
            else:
                pt_dt = agg_hhc_patients.objects.filter(name__icontains=pt_name)
                eve_idss = agg_hhc_events.objects.filter(agg_sp_pt_id__in=pt_dt, status=1)
            for eve_id in eve_idss:
                eve_ids.append(eve_id.eve_id)
        elif (s_month:= request.GET.get('s_month')) and (e_month:= request.GET.get('e_month')):
            dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__range=(s_month,e_month), status = 1)
            eve_list = [i.eve_id for i in dtl_data]
            unique_eve = set(eve_list)
            for eve_id in unique_eve:
               eve_ids.append(eve_id.eve_id)
        elif (prof_name:=request.GET.get('prof_name')):
            print('condition in prof name and date')
            if (date := request.GET.get('date')):
                dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time = date,srv_prof_id__prof_fullname__icontains=prof_name, status = 1)
            else:
                dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id__prof_fullname__icontains=prof_name, status = 1)
            eve_list = [i.eve_id for i in dtl_data]
            unique_eve = set(eve_list)
            for eve_id in unique_eve:
               eve_ids.append(eve_id.eve_id)
        elif (srv_id:=request.GET.get('srv_id')) and (date := request.GET.get('date')):
            print('condition in service name and date')
            dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time = date, eve_poc_id__srv_id=srv_id, status = 1)
            eve_list = [i.eve_id for i in dtl_data]
            unique_eve = set(eve_list)
            for eve_id in unique_eve:
               eve_ids.append(eve_id.eve_id)
        elif date := request.GET.get('date'):
            print(date,'date')
            dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=date, status = 1)
            eve_list = [i.eve_id for i in dtl_data]
            unique_eve = set(eve_list)
            for eve_id in unique_eve:
                eve_ids.append(eve_id.eve_id)
        else:
            print('condition else')
            dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=timezone.now().date(), status = 1)
            eve_list = [i.eve_id for i in dtl_data]
            unique_eve = set(eve_list)
            for eve_id in unique_eve:
                eve_ids.append(eve_id.eve_id)
        
         
        print('hii2')
        if not eve_ids:
            return Response({"msg":"data not foundf"})
        else:
            print(eve_ids,'eve_ids')
            data =  agg_hhc_events.objects.filter(Q(event_status=2) | Q(event_status=3),eve_id__in=eve_ids,status=1)
            # else: 
            #     data =  agg_hhc_events.objects.filter(Q(event_status=2) | Q(event_status=3),status=1,added_from_hosp=hosp_id)
            serialize_data=Ongoing_Eve_serializer(data, many=True) 
            return Response(serialize_data.data)
      


    def post(self, request):
        serializer=demoserializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors)
    def put(self, request, pk):
        pk= demo1.objects.get(demo_id=pk)
        serializer=demoserializer(pk, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors)
        
        
class SingleRecord(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,eve_id):
        completed_payment_list=[]
        professional_list=[]
        professional=[]
        professional_amount={}
        try:
            get_event = agg_hhc_events.objects.filter(eve_id = eve_id)
            events=get_event.filter(Q(event_status=2) | Q(event_status=3),Q(enq_spero_srv_status=1)|Q(enq_spero_srv_status=2),status=1)
            print("data")
            print(events)
            for i in events:
                # eve_id=events.eve_id
                #---------------------------------------------caller information-----------------------
                caller_name=i.caller_id.caller_fullname if i.caller_id.caller_fullname else None
                caller_number=i.caller_id.phone if i.caller_id.phone else None
                caller={'caller_name':caller_name,'caller_number':caller_number}
                #---------------------------------------------caller information ends-----------------------
                #---------------------------------------patient information starts ------------------------
                patient_name=i.agg_sp_pt_id.name if i.agg_sp_pt_id.name else None
                patient_age=i.agg_sp_pt_id.Age if i.agg_sp_pt_id.Age else None
                patient_gender=i.agg_sp_pt_id.gender_id.name if i.agg_sp_pt_id.gender_id.name else None
                patient_contact=i.agg_sp_pt_id.phone_no if i.agg_sp_pt_id.phone_no else None
                patient_email=i.agg_sp_pt_id.patient_email_id if i.agg_sp_pt_id.patient_email_id else None
                patient_address=i.agg_sp_pt_id.address
                patient_Google_address=i.agg_sp_pt_id.google_address
                patient={'patient_name':patient_name,'patient_age':patient_age,'patient_gender':patient_gender,'patient_contact':patient_contact,'patient_email':patient_email,'patient_address':patient_address}
                #--------------------------------------patient information ends ----------------------------

                conv_data=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id,status=1,is_convinance=True).order_by('actual_StartDate_Time')
                if conv_data:
                    total_conv_charge_is=0
                    for o in conv_data:
                        total_conv_charge_is=total_conv_charge_is+o.convinance_charges
                else:
                    conv_first=0
                    total_conv_charge_is=0
                Total_amount=int(i.Total_cost)
                Final_amount=int(i.final_amount)
                discount_type=i.discount_type
            #_________________________________________________discount type and given discount start__________________
                if(i.discount_type==1 or i.discount_type==2):
                    discount_value = int(i.discount_value) if i.discount_value is not None else None
                else:
                    discount_value=None
            #_________________________________________________discount type and given discount end__________________
                payment_date=None
                Tran_number=None
                print("tr_num")
                detaile_event_plan_of_care=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id,status=1).order_by('actual_StartDate_Time')
                # per_prof_amount=Total_amount//detaile_event_plan_of_care.filter().count()
                per_prof_amount= int(detaile_event_plan_of_care.last().eve_poc_id.sub_srv_id.cost)
                sessions=0
                for j in detaile_event_plan_of_care:
                    professional_name_date=[]
                    if j.srv_prof_id is not None:
                        if(str(j.srv_prof_id.prof_fullname) in professional_list):
                            print("n0")
                        else:
                            get_dtl_data=detaile_event_plan_of_care.filter(eve_id=i.eve_id,srv_prof_id=j.srv_prof_id,status=1)
                            print(get_dtl_data.count(), ';;sdklj;l')
                            [print(i.srv_prof_id) for i in get_dtl_data ]
#----------------------------all dates is appended to the list -------------------------------------
                            for k in get_dtl_data:
                                professional_name_date.append(str(k.actual_StartDate_Time))
#----------------------------all dates is appended to the list end -------------------------------------
                            if len(professional_name_date)==1:
                                    per_prof_amount_is=(per_prof_amount*1)#+(conv_first*1)
                                    professiona_proper_info={'professional_name':j.srv_prof_id.prof_fullname,'start_time':str(j.start_time),'end_time':str(j.end_time),'start_date':professional_name_date[0],'end_date':professional_name_date[0],'sessions':1,'amount':per_prof_amount,'prof_tot_amt':per_prof_amount_is}
                                    professional.append(professiona_proper_info)
                            else:
                                len_count=1#len(professional_name_date)
                                new_start_date=professional_name_date[0]
                                session_count=1
                                for l in professional_name_date:
                                    start_date_name=str(datetime.strptime(l, '%Y-%m-%d').date()+timedelta(days=1))
                                    print(len_count,"new",len(professional_name_date))
                                    if(len_count==len(professional_name_date)):
                                        per_prof_amount_is2=(per_prof_amount*session_count)#+(conv_first*session_count)
                                        professiona_proper_info={'professional_name':j.srv_prof_id.prof_fullname,'start_time':str(j.start_time),'end_time':str(j.end_time),'start_date':new_start_date,'end_date':professional_name_date[-1],'sessions':session_count,'amount':per_prof_amount,'prof_tot_amt':per_prof_amount_is2}
                                        professional.append(professiona_proper_info)
                                    elif(start_date_name==professional_name_date[len_count]):
                                        session_count+=1
                                    else:
                                        per_prof_amount_is3=(per_prof_amount*session_count)#+(conv_first*session_count)
                                        professiona_proper_info={'professional_name':j.srv_prof_id.prof_fullname,'start_time':str(j.start_time),'end_time':str(j.end_time),'start_date':new_start_date,'end_date':l,'sessions':session_count,'amount':per_prof_amount,'prof_tot_amt':per_prof_amount_is3}
                                        professional.append(professiona_proper_info)
                                        new_start_date=professional_name_date[len_count]
                                        session_count=1
                                    len_count+=1
                            professional_list.append(str(j.srv_prof_id.prof_fullname))
                    sessions+=1
                payments=agg_hhc_payment_details.objects.filter(eve_id=i.eve_id,status=1,overall_status="SUCCESS").last()
                if payments:
                    print("paid")
                    amount_paid=int(payments.amount_paid)
                    amount_remaining=int(payments.amount_remaining)
                    payment_mode=payments.mode
                    payment_date=str(payments.added_date)
                    utr = str(payments.utr)
                else:
                    amount_paid=0
                    amount_remaining=i.final_amount
                    payment_mode=None
                    utr = None
                event_plan_of_care=agg_hhc_event_plan_of_care.objects.get(eve_id=i.eve_id)
                #--------------------------------------service information starts --------------------------
                consultant_name=event_plan_of_care.doct_cons_id.cons_fullname
                consultant_number=event_plan_of_care.doct_cons_id.mobile_no
                remark=event_plan_of_care.remark
                hospital_name = event_plan_of_care.hosp_id.hospital_name if hasattr(event_plan_of_care, 'hosp_id') and event_plan_of_care.hosp_id and hasattr(event_plan_of_care.hosp_id, 'hospital_name') else None
                #hospital_name=event_plan_of_care.hosp_id#hospital_name if event_plan_of_care.hosp_id.hospital_name else None
                preffered_proffesional=event_plan_of_care.prof_prefered
                suffer_from=i.Suffered_from
                sub_service_name=event_plan_of_care.sub_srv_id.recommomded_service if event_plan_of_care.sub_srv_id.recommomded_service else None
                service={'consultant_name':consultant_name,'consultant_number':consultant_number,'remark':remark,'hospital_name':hospital_name,'preffered_proffesional':preffered_proffesional,'suffer_from':suffer_from,'sub_service':sub_service_name}
                #--------------------------------------service information ends ----------------------------
                print("event_plan_of_care.start_date")
                event_date=event_plan_of_care.start_date
                last_modified_date = event_plan_of_care.last_modified_date
                service_name=event_plan_of_care.srv_id.service_title
                sub_service_name=event_plan_of_care.sub_srv_id.recommomded_service
                professional = sorted(professional, key=lambda x: x['start_date'] if x['start_date'] else '')
                # payment_details={'Total_amount':Total_amount,'Final_amount':Final_amount,'payment_date':payment_date,'payment_mode':payment_mode,'amount_paid':amount_paid,'service_name':service_name,'sub_service_name':sub_service_name,'Tran_number':Tran_number,'eve_id':eve_id,'event_code':i.event_code,'event_date':str(event_date),'last_modified_date':str(last_modified_date),'conveniance_charges':total_conv_charge_is,'sessions':sessions,'patient_address':patient_address,'amount_remaining':amount_remaining,'professional_amount':professional,'discount_value':discount_value,'discount_type':discount_type}
                payment_details={'Total_amount':Total_amount,'Final_amount':Final_amount,'payment_date':payment_date,'payment_mode':payment_mode,'amount_paid':amount_paid,'utr':utr,'service_name':service_name,'sub_service_name':sub_service_name,'Tran_number':Tran_number,'eve_id':eve_id,'event_code':i.event_code,'event_date':str(event_date),'last_modified_date':str(last_modified_date),'conveniance_charges':total_conv_charge_is,'sessions':sessions,'patient_address':patient_address,'patient_Google_address':patient_Google_address,'amount_remaining':amount_remaining,'professional_amount':professional,'discount_value':discount_value,'discount_type':discount_type,"caller":caller,"patient":patient,"service":service}
                completed_payment_list.append(payment_details)
            # return Response({"Event_Invoice":completed_payment_list,"caller":caller,"patient":patient,"service":service})
            return Response({"Event_Invoice":completed_payment_list})
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)})
            # return Response({"error": str(e)})











class hd_invoce_eventwise(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,eve_id):
        # caller=get_prof(request)[2]
        # caller=3
        completed_payment_list=[]
        professional_list=[]
        professional=[]
        professional_amount={}
        current_year = datetime.now().year
        previous_year = current_year - 1
        try:
            get_event = agg_hhc_events.objects.filter(eve_id = eve_id)
            events=get_event.filter(Q(event_status=2) | Q(event_status=3),Q(enq_spero_srv_status=1)|Q(enq_spero_srv_status=2),status=1)
            print("data")
            print(events)
            for i in events:
                eve_id=i.eve_id
                print("in for")
                conv_data=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id,status=1,is_convinance=True).order_by('actual_StartDate_Time')
                if conv_data:
                    total_conv_charge_is=0
                    for o in conv_data:
                        total_conv_charge_is=total_conv_charge_is+o.convinance_charges
                    # conv_first=conv_first.convinance_charges
                else:
                    conv_first=0
                    total_conv_charge_is=0
                Total_amount=int(i.Total_cost)
                Final_amount=int(i.final_amount)
                discount_type=i.discount_type
            #_________________________________________________discount type and given discount start__________________
                if(i.discount_type==1 or i.discount_type==2):
                    discount_value = int(i.discount_value) if i.discount_value is not None else None
                else:
                    discount_value=None
            #_________________________________________________discount type and given discount end__________________
                payment_date=None
                Tran_number=None
                print("tr_num")
                detaile_event_plan_of_care=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id,status=1).order_by('actual_StartDate_Time')
                # per_prof_amount=Total_amount//detaile_event_plan_of_care.filter().count()
                per_prof_amount= int(detaile_event_plan_of_care.last().eve_poc_id.sub_srv_id.cost)
                sessions=0
                for j in detaile_event_plan_of_care:
                    professional_name_date=[]
                    if j.srv_prof_id is not None:
                        if(str(j.srv_prof_id.prof_fullname) in professional_list):
                            print("n0")
                        else:
                            get_dtl_data=detaile_event_plan_of_care.filter(eve_id=i.eve_id,srv_prof_id=j.srv_prof_id,status=1).order_by('actual_StartDate_Time')
#----------------------------all dates is appended to the list -------------------------------------
                            for k in get_dtl_data:
                                professional_name_date.append(str(k.actual_StartDate_Time))
#----------------------------all dates is appended to the list end -------------------------------------
                            if len(professional_name_date)==1:
                                    per_prof_amount_is=(per_prof_amount*1)#+(conv_first*1)
                                    professiona_proper_info={'professional_name':j.srv_prof_id.prof_fullname,'start_time':str(j.start_time),'end_time':str(j.end_time),'start_date':str(datetime.strptime(professional_name_date[0], '%Y-%m-%d').strftime('%d-%m-%Y')),'end_date':str(datetime.strptime(professional_name_date[0], '%Y-%m-%d').strftime('%d-%m-%Y')),'sessions':1,'amount':per_prof_amount_is}
                                    professional.append(professiona_proper_info)
                            else:
                                len_count=1#len(professional_name_date)
                                new_start_date=professional_name_date[0]
                                session_count=1
                                for l in professional_name_date:
                                    start_date_name=str(datetime.strptime(l, '%Y-%m-%d').date()+timedelta(days=1))
                                    print(len_count,"new",len(professional_name_date))
                                    if(len_count==len(professional_name_date)):
                                        per_prof_amount_is2=(per_prof_amount*session_count)#+(conv_first*session_count)
                                        professiona_proper_info={'professional_name':j.srv_prof_id.prof_fullname,'start_time':str(j.start_time),'end_time':str(j.end_time),'start_date':str(datetime.strptime(new_start_date, '%Y-%m-%d').strftime('%d-%m-%Y')),'end_date':str(datetime.strptime(professional_name_date[-1], '%Y-%m-%d').strftime('%d-%m-%Y')),'sessions':session_count,'amount':per_prof_amount_is2}
                                        professional.append(professiona_proper_info)
                                    elif(start_date_name==professional_name_date[len_count]):
                                        session_count+=1
                                    else:
                                        per_prof_amount_is3=(per_prof_amount*session_count)#+(conv_first*session_count)
                                        professiona_proper_info={'professional_name':j.srv_prof_id.prof_fullname,'start_time':str(j.start_time),'end_time':str(j.end_time),'start_date':str(datetime.strptime(new_start_date, '%Y-%m-%d').strftime('%d-%m-%Y')),'end_date':str(datetime.strptime(l, '%Y-%m-%d').strftime('%d-%m-%Y')),'sessions':session_count,'amount':per_prof_amount_is3}
                                        professional.append(professiona_proper_info)
                                        new_start_date=professional_name_date[len_count]
                                        session_count=1
                                    len_count+=1
                            professional_list.append(str(j.srv_prof_id.prof_fullname))
                    sessions+=1
                payments=agg_hhc_payment_details.objects.filter(eve_id=i.eve_id,status=1,overall_status="SUCCESS").last()
                if payments:
                    print("paid")
                    amount_paid=int(payments.amount_paid)
                    amount_remaining=int(payments.amount_remaining)
                    payment_mode=payments.mode
                    payment_date=str(payments.added_date)
                else:
                    amount_paid=0
                    amount_remaining=i.final_amount
                    payment_mode=None
                patient_name=i.agg_sp_pt_id.name
                patient_number=i.agg_sp_pt_id.phone_no
                patient_address=i.agg_sp_pt_id.address
                patient_google_address=i.agg_sp_pt_id.google_address
                print("finding event ",i.eve_id)
                event_plan_of_care=agg_hhc_event_plan_of_care.objects.get(eve_id=i.eve_id)
                print("event_plan_of_care.start_date")
                event_date=event_plan_of_care.start_date
                last_modified_date = event_plan_of_care.last_modified_date
                service_name=event_plan_of_care.srv_id.service_title
                sub_service_name=event_plan_of_care.sub_srv_id.recommomded_service
                professional = sorted(professional, key=lambda x: x['start_date'] if x['start_date'] else '')
                if(amount_remaining<=0):
                    print("here",i.eve_id)
                    payment_details={'Total_amount':Total_amount,
                                     'Final_amount':Final_amount,
                                     'payment_date':payment_date,
                                     'payment_mode':payment_mode,
                                     'amount_paid':amount_paid,
                                     'patient_name':patient_name,
                                     'service_name':service_name,
                                     'sub_service_name':sub_service_name,
                                     'Tran_number':Tran_number,
                                     'eve_id':eve_id,

                                     'hospital_code':i.agg_sp_pt_id.preferred_hosp_id.hospital_short_code,
                                     'invoice_id':i.Invoice_ID,
                                     'years_range': f"{previous_year}-{current_year}",


                                     'event_code':i.event_code,
                                     'event_date':str(event_date),
                                     'last_modified_date':str(last_modified_date),
                                     'patient_number':patient_number,
                                     'conveniance_charges':total_conv_charge_is,
                                     'sessions':sessions,
                                     'patient_address':patient_address,
                                     'patient_google_address':patient_google_address,
                                     'amount_remaining':amount_remaining,
                                     'professional_amount':professional,
                                     'discount_value':discount_value,
                                     'discount_type':discount_type
                                     }
                    completed_payment_list.append(payment_details)
                else:
                    payment_details={'Total_amount':Total_amount,
                                     'Final_amount':Final_amount,
                                     'payment_date':payment_date,
                                     'payment_mode':payment_mode,
                                     'amount_paid':amount_paid,
                                     'patient_name':patient_name,
                                     'service_name':service_name,
                                     'sub_service_name':sub_service_name,
                                     'Tran_number':Tran_number,
                                     'eve_id':eve_id,
                                     
                                     'hospital_code':i.agg_sp_pt_id.preferred_hosp_id.hospital_short_code,
                                     'invoice_id':i.Invoice_ID,
                                     'years_range': f"{previous_year}-{current_year}",
                                     
                                     'event_code':i.event_code,
                                     'event_date':str(event_date),
                                     'last_modified_date':str(last_modified_date),
                                     'patient_number':patient_number,
                                     'conveniance_charges':total_conv_charge_is,
                                     'sessions':sessions,
                                     'patient_address':patient_address,
                                     'patient_google_address':patient_google_address,
                                     'amount_remaining':amount_remaining,
                                     'professional_amount':professional,
                                     'discount_value':discount_value,
                                     'discount_type':discount_type
                                     }
                    # incompleted_payment_list.append(payment_details)
                    completed_payment_list.append(payment_details)
            # return Response({'data':{"completed_payment_list":completed_payment_list,"incompleted_payment_list":incompleted_payment_list}})
            return Response({"Event_Invoice":completed_payment_list})
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)})
            # return Response({"error": str(e)})



        
class patient_last_feedback(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,pt_id):
        try:
            event = agg_hhc_events.objects.filter(agg_sp_pt_id=pt_id,status=1).order_by('-eve_id')
            for i in event:
                feed_back=agg_hhc_Professional_app_feedback.objects.filter(eve_id=i.eve_id,status=1,feedback_by=2).last()
                if feed_back:
                    try:
                        rating=feed_back.rating
                        comment=feed_back.comment
                    except:
                        rating=None
                        comment=None
                    return Response({'rating':rating,'comment':comment})
            return Response({'rating':None,'comment':None})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
















class get_reschedule_cancle_request(APIView):
    def get(self, request, res_can, srv_sess):
        if res_can == 1 and srv_sess == 1:
            get_all_req = agg_hhc_cancellation_and_reschedule_request.objects.filter(is_deleted=2,is_srv_sesn=1, is_canceled=1)
        elif res_can == 1 and srv_sess == 2:
            get_all_req = agg_hhc_cancellation_and_reschedule_request.objects.filter(is_deleted=2,is_srv_sesn=2, is_canceled=1)
        elif res_can == 2 and srv_sess == 1:
            get_all_req = agg_hhc_cancellation_and_reschedule_request.objects.filter(is_deleted=2, is_srv_sesn=1, is_reschedule=1)
        elif res_can == 2 and srv_sess == 2:
            get_all_req = agg_hhc_cancellation_and_reschedule_request.objects.filter(is_deleted=2, is_srv_sesn=2, is_reschedule=1)
        elif res_can == 2 and srv_sess == 3:
            get_all_req = agg_hhc_cancellation_and_reschedule_request.objects.filter(is_deleted=2, is_srv_sesn=3, is_reschedule=1)
            
        

        if not get_all_req:
            return Response({"message": "Data not found."}, status=status.HTTP_404_NOT_FOUND)
        # get_all_req = agg_hhc_cancellation_and_reschedule_request.objects.filter(is_deleted=2, last_modified_date__date=timezone.now().date())
        serializer_req = reschedule_cancle_request_pro_seri(get_all_req, many= True)
        return Response(serializer_req.data)


#-------------------mayank permission--------------------

# class CombinedAPIView(APIView):
#     def get(self, request, format=None):
#         permission_modules = Permission_module.objects.filter()
#         modules_serializer = Moduleserializer(permission_modules, many=True)

#         permission_objects = permission.objects.filter()
#         permission_serializer = permission_sub_Serializer(permission_objects, many=True)

#         combined_data = []
#         for module_data in modules_serializer.data:
#             module_id = module_data["module_id"]
#             module_name = module_data["name"]
#             group = module_data["group"]
#             group_name = module_data["group_name"]
#             # source_id = module_data["Source_id"]

#             submodules = [submodule for submodule in permission_serializer.data if submodule["module"] == module_id]

#             formatted_data = {
#                 "module_id": module_id,
#                 "name": module_name,
#                 "group": group,
#                 "group_name":group_name,
#                 # "Source_id": source_id,
#                 "submodules": submodules
#             }

#             combined_data.append(formatted_data)

#         final_data = combined_data

#         return Response(final_data)

class CombinedAPIView(APIView):
    def get(self, request, format=None):
        permission_modules = Permission_module.objects.filter()
        modules_serializer = Mmoduleserializer(permission_modules, many=True)

        permission_objects = permission.objects.filter()
        permission_serializer = permission_sub_Serializer(permission_objects, many=True)

        # Group modules by their group ID
        grouped_modules = {}
        for module_data in modules_serializer.data:
            group_id = module_data["group"]
            if group_id not in grouped_modules:
                grouped_modules[group_id] = {
                    "group": group_id,
                    "group_name": module_data["group_name"],
                    "modules": []
                }
            grouped_modules[group_id]["modules"].append({
                "module_id": module_data["module_id"],
                "name": module_data["name"],
                "submodules": []
            })

        # Add submodules to their respective modules
        for submodule_data in permission_serializer.data:
            module_id = submodule_data["module"]
            for group_data in grouped_modules.values():
                for module in group_data["modules"]:
                    if module["module_id"] == module_id:
                        module["submodules"].append(submodule_data)

        final_data = list(grouped_modules.values())

        return Response(final_data)


class CreatePermissionAPIView(APIView):
    serializer_class = SavePermissionSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdatePermissionAPIView(APIView):
    serializer_class = SavePermissionSerializer

    def put(self, request, id):
        try:
            permission = agg_save_permissions.objects.get(id=id)
        except agg_save_permissions.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(permission, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  

class GetPermissionAPIView(APIView):
    serializer_class = SavePermissionSerializer

    def get(self, request, group, *args, **kwargs):
        permissions = agg_save_permissions.objects.filter(role=group)
        serializer = self.serializer_class(permissions, many=True)
        return Response(serializer.data)
    
class HHC_Module_GetAPIView(APIView):
    def get(self, request, format=None):
        inventory_items = agg_mas_group.objects.all()
        # print(inventory_items)
        serializer = HHC_Module(inventory_items, many=True)
        return Response(serializer.data)




class job_closure_questions_web_form(APIView):
    def get(self, request, srv_id):
        questions = agg_hhc_job_closure_questions.objects.filter(srv_id = srv_id, status = 1)
        serialzer = jc_qustions_serializer(questions, many = True)
        return Response(serialzer.data)
        

class job_closure_questions(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, srv_id):
        questions = agg_hhc_job_closure_questions.objects.filter(srv_id = srv_id, status = 1)
        serialzer = jc_qustions_serializer(questions, many = True)
        return Response(serialzer.data)
        


class request_approvals_get_ptn(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, eve_id, dtl_eve_id=None):
        if dtl_eve_id is not None:
            eve_data = agg_hhc_events.objects.filter(eve_id = eve_id, status = 1)
            serialzer = request_approval_event_data(eve_data, many = True)
            if dtl_eve_id:
                prof_requested_data = agg_hhc_cancellation_and_reschedule_request.objects.filter(eve_id = eve_id, dtl_eve_id = dtl_eve_id).last()
                prof = get_prof_requested_data_from_cr(prof_requested_data)
            data = {
                "eve_data" :serialzer.data,
                "ses" : prof.data
            }  
            return Response(data)
          
        else:
            eve_data = agg_hhc_events.objects.filter(eve_id = eve_id, status = 1)
            serialzer = request_approval_event_data(eve_data, many = True)
            # if dtl_eve_id:
            prof_requested_data = agg_hhc_cancellation_and_reschedule_request.objects.filter(eve_id = eve_id).last()
            prof = get_prof_requested_data_from_cr(prof_requested_data)
            data = {
                "eve_data" :serialzer.data,
                "ses" : prof.data
            }  
            return Response(data)
           



# class request_approvals(APIView):
#     renderer_classes = [UserRenderer]
#     permission_classes = [IsAuthenticated]
#     serializer_class = ServiceCancellationSerializer
#     serializer_class2 = post_in_cancellation_history
#     def post(self, request, res_can, srv_sess):
#         clgref_id = get_prof(request)[3]
#         request.data['last_modified_by'] = clgref_id
#         eve_id = request.data.get('eve_id')
#         remark = request.data.get('remark')
#         sess_pk = request.data.get('session_id')
#         # eve_id = request.data.get('eve_id')


        
#         if res_can == 1 and srv_sess == 1:
#             get_all_req = agg_hhc_cancellation_and_reschedule_request.objects.filter(eve_id = eve_id, is_deleted=2,is_srv_sesn=1, is_canceled=1)
#             data = {
#                 "event_id": eve_id, 
#                 "cancellation_by": 1, 
#                 "reason": 2, 
#                 "remark": remark, 
#                 "last_modified_by": clgref_id
#                 # "last_modified_by": "abc5"
#                 }   
#             serializer = self.serializer_class(data=data)
#             if serializer.is_valid():
#                 serializer.save()
#                 for req in get_all_req:
#                     req.is_deleted = 1
#                     req.save()
#                 return Response({'msg':'Service cancelled Done'})

#         elif res_can == 1 and srv_sess == 2:
            
#             get_all_req = agg_hhc_cancellation_and_reschedule_request.objects.filter(eve_id = eve_id, dtl_eve_id = sess_pk, is_deleted=2,is_srv_sesn=2, is_canceled=1).first()
#             print(get_all_req,"get_all_req")
#             get_eve_poc = agg_hhc_event_plan_of_care.objects.get(eve_id = eve_id)
#             start_date_time = get_all_req.dtl_eve_id.actual_StartDate_Time
#             end_date_time = get_all_req.dtl_eve_id.actual_EndDate_Time
#             sub_srv_id = get_eve_poc.srv_id.srv_id

#             print(get_eve_poc,"get_eve_poc")
#             print(start_date_time,"start_date_time")
#             print(end_date_time,"end_date_time")
#             print(sub_srv_id,"sub_srv_id")

#             print("error 1")
           
            
#             if eve_id is None or start_date_time is None:
#                 return Response({'error': 'Please provide eve_id and start_date_time'}, status=status.HTTP_200_OK)
        

#             get_event_data = agg_hhc_events.objects.get(eve_id=eve_id, status=1)
#             epoc_model = agg_hhc_event_plan_of_care.objects.get(eve_id=eve_id, status=1)

#             try:
                
#                 if end_date_time:
                    
#                     record = agg_hhc_detailed_event_plan_of_care.objects.filter(
#                         eve_id=eve_id,
#                         actual_StartDate_Time__range=(start_date_time, end_date_time),status=1
#                     )
                    
            
#             except agg_hhc_detailed_event_plan_of_care.DoesNotExist:
#                 return Response({'error': 'Record not found'}, status=status.HTTP_200_OK)
#             except agg_hhc_events.DoesNotExist:
#                 return Response({'error': 'agg_hhc_events Record not found'}, status=status.HTTP_200_OK)
#             except agg_hhc_event_plan_of_care.DoesNotExist:
#                 return Response({'error': 'agg_hhc_event_plan_of_care Record not found'}, status=status.HTTP_200_OK)

            

#             get_total_cancel_sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(
#                     eve_id=eve_id,
#                     actual_StartDate_Time__range=(start_date_time, end_date_time),
#                     status = 1
#             )

#             get_total_wout_cancel_session = agg_hhc_detailed_event_plan_of_care.objects.filter(
#                     eve_id=eve_id,
#                     status = 1
#             ).exclude(actual_StartDate_Time__range=(start_date_time, end_date_time))

#             get_sub_srv_data = agg_hhc_sub_services.objects.get(sub_srv_id=sub_srv_id)
#             per_session_amt = int(get_sub_srv_data.cost)
#             get_total_cancel_sessions_now = get_total_cancel_sessions.count() * per_session_amt
#             wout_cancel_ses = get_total_wout_cancel_session.count() * per_session_amt
            
#             con_charge = get_total_cancel_sessions.aggregate(total_convinance_charges=Coalesce(Sum('convinance_charges'), Value(0)))['total_convinance_charges']
#             con_chrg_wot_cancl = get_total_wout_cancel_session.aggregate(total_convinance_charges=Coalesce(Sum('convinance_charges'), Value(0)))['total_convinance_charges']
        

#             eve_total_cost = get_event_data.Total_cost
          

#             cancl_ses_amt = (eve_total_cost - get_total_cancel_sessions_now) + con_charge
#             wout_cancl_ses_amt = eve_total_cost - wout_cancel_ses


#             disc_type = get_event_data.discount_type
#             disc_value = get_event_data.discount_value

#             if disc_value is not None:
#                 disc_value = Decimal(disc_value)
              
#             else:
#                 disc_value = 0

            
#             if disc_type == 1:
#                 discounted_amt_wout_cncel = int(((disc_value)/100)*int(wout_cancel_ses))

#             elif disc_type == 2:
#                 discounted_amt_wout_cncel = int(disc_value)
                
#             else:
#                 discounted_amt_wout_cncel = 0
            
#             discounted_amt_wout_cncel1 = int(wout_cancel_ses) - discounted_amt_wout_cncel

            
#             with_con_chrg = discounted_amt_wout_cncel1 + con_chrg_wot_cancl

#             final_amt_w_con_charge = discounted_amt_wout_cncel1 + con_chrg_wot_cancl
           
        
#             get_event_data.final_amount = final_amt_w_con_charge
            

#             get_event_data.last_modified_by = clgref_id
#             get_event_data.Total_cost = wout_cancel_ses
            
#             if con_charge is None:
#                 con_charge = 0
            
#             if con_chrg_wot_cancl is None:
#                 con_chrg_wot_cancl = 0

            
#             total_cancel_amt = int(per_session_amt * get_total_cancel_sessions_now)

#             f_amount  = int(get_event_data.final_amount - total_cancel_amt)
        

            
#             get_payment_status = agg_hhc_payment_details.objects.filter(eve_id = eve_id, 
#                                                                         overall_status = 'SUCCESS', 
#                                                                         status = 1)
#             if get_payment_status.count() != 0:
#                 sesson_amt = per_session_amt
#             else:
#                 sesson_amt = 0

#             for dtl_id in record:
#                 con_chrg_fron_dtl = agg_hhc_detailed_event_plan_of_care.objects.get(agg_sp_dt_eve_poc_id = dtl_id.agg_sp_dt_eve_poc_id)
#                 cancel_history = {
#                     'event_id': eve_id,
#                     'cancellation_by': 2,
#                     'can_amt': sesson_amt,
#                     'convineance_chrg':con_chrg_fron_dtl.convinance_charges,
#                     'remark': remark,
#                     'agg_sp_dt_eve_poc_id':dtl_id.agg_sp_dt_eve_poc_id,
#                     # 'reason': request.data.get('reason'),
#                     'reason': 1,
#                     'last_modified_by': clgref_id
#                 }
#                 serialized2_data = self.serializer_class2(data=cancel_history)  

#                 if serialized2_data.is_valid():
#                     serialized2_data.save()
#                 else:
#                     return Response(serialized2_data.errors, status=status.HTTP_400_BAD_REQUEST)
                
#             print("near to set dtl ")
#             for records in record:
#                 print("in dtl seting")
#                 records.status = 2
#                 records.is_cancelled = 1
#                 records.remark = remark 
#                 records.last_modified_by = clgref_id
#                 records.save()
            

#             get_sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(
#                 eve_id=eve_id,
#                 status=1  
#             )
#             print("near set epoc dates")      
#             depoc_start_date = get_sessions.aggregate(min_actual_StartDate_Time=Min('actual_StartDate_Time'))['min_actual_StartDate_Time']
          
#             # Retrieve the maximum actual start date
#             depoc_end_date = get_sessions.aggregate(max_actual_StartDate_Time=Max('actual_StartDate_Time'))['max_actual_StartDate_Time']

#             epoc_model.start_date = depoc_start_date
#             print("set start")
#             epoc_model.end_date = depoc_end_date
#             print("set end")
#             epoc_model.last_modified_by = clgref_id
#             epoc_model.save()
            
#             serialized_data = self.serializer_class(record).data

#             data = {
#                 'dtl_data': serialized_data,
#                 'cancel_data': serialized2_data.data
#             }

#             if get_sessions.count()==0:
#                 epoc_model.status=2
#                 get_event_data.status=2
#                 epoc_model.save()
#                 get_event_data.save()
#             get_event_data.save()
            
#             get_all_req.is_deleted = 1
#             get_all_req.save()
            

#             token = DeviceToken.objects.filter(clg_id=agg_com_colleague.objects.filter(clg_ref_id=agg_hhc_detailed_event_plan_of_care.objects.filter(agg_sp_dt_eve_poc_id=sess_pk).last().srv_prof_id.clg_ref_id).last(), is_login=True).last().token
#             detail=agg_hhc_detailed_event_plan_of_care.objects.filter(agg_sp_dt_eve_poc_id=sess_pk).last()
#             body=f'Patient: {detail.eve_id.agg_sp_pt_id.name}\nService: {detail.eve_poc_id.sub_srv_id.recommomded_service}\nDate: {detail.actual_StartDate_Time} {detail.start_time}'
#             notification={ 'title': 'Approved request for session cancellation', 'body': body }
#             response = (requests.post('https://fcm.googleapis.com/fcm/send', json={'to': token,'notification': notification}, headers={'Authorization': f'key={SERVER_KEY}', 'Content-Type': 'application/json'})).json()

#             return Response({"msg":"ok"}, status=status.HTTP_200_OK)
            


#         elif res_can == 2 and srv_sess == 1:

#             get_all_req = agg_hhc_cancellation_and_reschedule_request.objects.filter(eve_id = eve_id, is_deleted=2, is_srv_sesn=1, is_reschedule=1).first()
#             print(get_all_req)
#             date = get_all_req.reschedule_date
#             start_date_str = date.strftime('%Y-%m-%d')

#             start_time = date.strftime('%H:%M')

#             dtl_date_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=start_date_str,
#                                                                                start_time= start_time,
#                                                                                end_time = start_time,
#                                                                                srv_prof_id = get_all_req.dtl_eve_id.srv_prof_id,
#                                                                                status = 1)
#             if dtl_date_data.exists():
#                 return Response({"msg":"Professional has Already A session On that Time"}, stauts = status.HTTP_406_NOT_ACCEPTABLE)
            


#             start_time_obj_abc = datetime.strptime(start_time, '%H:%M')
#             end_time_obj_abc = start_time_obj_abc + timedelta(hours=2)
#             end_time = end_time_obj_abc.strftime('%H:%M')
#             # end_time = date.strftime('%H:%M')
    
#             try:
#                 start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
#                 start_time_obj = datetime.strptime(start_time, '%H:%M')
#                 end_time_obj = datetime.strptime(end_time, '%H:%M')

#                 queryset =  agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=eve_id,status=1)
#                 pros=set([i.srv_prof_id for i in queryset])
#                 get_count_dtl = queryset.count()
#                 queryset2 =  agg_hhc_event_plan_of_care.objects.filter(eve_id=eve_id,status=1)
                
#                 history_tracker=agg_hhc_event_plan_of_care_H_T_Serializer(data=queryset2, many=True)
#                 if history_tracker.is_valid():
#                     history_tracker.save()
           
#                 new_end_date = start_date + timedelta(days=get_count_dtl)
#                 new_end_date -= timedelta(days=1)
            
#                 queryset2.update(start_date=start_date_str, end_date=new_end_date, start_time=start_time_obj, end_time=end_time_obj, remark=remark, service_reschedule=1, last_modified_by=clgref_id)

#                 for i, obj in enumerate(queryset):
#                     new_start_date = start_date + timedelta(days=i)
#                     new_end_date = new_end_date + timedelta(days=i)
                
#                     obj.actual_StartDate_Time = new_start_date.date()
#                     obj.actual_EndDate_Time = new_start_date.date()
                
#                     obj.start_time = start_time_obj
#                     obj.end_time = end_time_obj
#                     obj.last_modified_by = clgref_id
#                     obj.save()
#                     get_all_req.is_deleted = 1
#                     get_all_req.save()
#                     # for req in get_all_req:
#                     #     req.is_deleted = 1
#                     #     req.save()
#                 tokn=[j.token for j in DeviceToken.objects.filter(clg_id__in=agg_com_colleague.objects.filter(clg_ref_id__in=[pro.clg_ref_id for pro in pros]), is_login=True)]
#                 eve_poc_id=agg_hhc_event_plan_of_care.objects.filter(eve_id=eve_id, status=1).last() 
#                 body=f'Patient: {eve_poc_id.eve_id.agg_sp_pt_id.name}\nService: {eve_poc_id.sub_srv_id.recommomded_service}\nStart DateTime:\n {eve_poc_id.start_date} {eve_poc_id.start_time}\nEnd DateTime:\n {eve_poc_id.end_date} {eve_poc_id.end_time}'
#                 notification={ 'title': 'Approved request for service rescheduling.', 'body': body }
#                 for tk in token:
#                     response = (requests.post('https://fcm.googleapis.com/fcm/send', json={'to': tk,'notification': notification}, headers={'Authorization': f'key={SERVER_KEY}', 'Content-Type': 'application/json'})).json()


#                 serializer = Detailed_EPOC_serializer(queryset, many=True)
#                 return Response(serializer.data, status=status.HTTP_200_OK)
#             except  agg_hhc_event_plan_of_care.DoesNotExist:
#                 return Response(status=status.HTTP_404_NOT_FOUND)



#         elif res_can == 2 and srv_sess == 2:
       
#             try:
#                 get_all_req = agg_hhc_cancellation_and_reschedule_request.objects.filter(eve_id = eve_id, dtl_eve_id = sess_pk, is_deleted=2, is_srv_sesn=2, is_reschedule=1).first()
#                 print(get_all_req,'get_all_req')
                
#                 session_date_str = get_all_req.dtl_eve_id.actual_StartDate_Time
#                 session_reschedule_date_str = get_all_req.reschedule_date
            
#                 session_date_component = session_date_str
            

#                 resch_session_date_component = session_reschedule_date_str.date()
#                 resch_session_time_component = session_reschedule_date_str.time()
#                 end_time = datetime.datetime.combine(resch_session_date_component, resch_session_time_component) + timedelta(hours=2)
#                 print(end_time.time(),'end_time')

                

#                 get_session_data = agg_hhc_detailed_event_plan_of_care.objects.get(eve_id=eve_id,actual_StartDate_Time=session_date_component,status=1)
#                 dtl_date_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=resch_session_date_component,
#                                                                                start_time= resch_session_time_component,
#                                                                                end_time = resch_session_time_component,
#                                                                                srv_prof_id = get_session_data.dtl_eve_id.srv_prof_id,
#                                                                                status = 1)
#                 if dtl_date_data.exists():
#                     return Response({"msg":"Professional has Already A session On that Time"}, stauts = status.HTTP_406_NOT_ACCEPTABLE)
                


#                 new_session = agg_hhc_detailed_event_plan_of_care(
#                     eve_poc_id = get_session_data.eve_poc_id,
#                     eve_id = get_session_data.eve_id,
#                     index_of_Session = get_session_data.index_of_Session,
#                     srv_prof_id = get_session_data.srv_prof_id,
#                     actual_StartDate_Time = resch_session_date_component,
#                     actual_EndDate_Time = resch_session_date_component,
#                     start_time = resch_session_time_component,
#                     end_time = end_time.time(),
#                     service_cost = get_session_data.service_cost,
#                     amount_received = get_session_data.amount_received,
#                     status=1,
#                     remark = remark,
#                     Reschedule_status=1,
#                     last_modified_by = clgref_id
#                 )
#                 new_session.save()
                
#                 get_sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(
#                     eve_id=eve_id,
#                     status=1  
#                 )
#                 epoc_model = agg_hhc_event_plan_of_care.objects.get(eve_id=eve_id, status=1)

#                 depoc_start_date = get_sessions.aggregate(min_actual_StartDate_Time=Min('actual_StartDate_Time'))['min_actual_StartDate_Time']

#                 # Retrieve the maximum actual start date
#                 depoc_end_date = get_sessions.aggregate(max_actual_StartDate_Time=Max('actual_StartDate_Time'))['max_actual_StartDate_Time']

#                 epoc_model.start_date = depoc_start_date
#                 epoc_model.end_date = depoc_end_date
#                 epoc_model.last_modified_by = clgref_id
#                 epoc_model.save()
                
#                 get_session_data.status = 2
#                 get_session_data.save()
#                 # for req in get_all_req:
#                 #     req.is_deleted = 1
#                 #     req.save()
#                 get_all_req.is_deleted = 1
#                 get_all_req.save()
#                 token = DeviceToken.objects.filter(clg_id=agg_com_colleague.objects.filter(clg_ref_id=agg_hhc_detailed_event_plan_of_care.objects.filter(agg_sp_dt_eve_poc_id=sess_pk).last().srv_prof_id.clg_ref_id).last(), is_login=True).last().token
#                 detail=agg_hhc_detailed_event_plan_of_care.objects.filter(agg_sp_dt_eve_poc_id=sess_pk).last()
#                 body=f'Patient: {detail.eve_id.agg_sp_pt_id.name}\nService: {detail.eve_poc_id.sub_srv_id.recommomded_service}\nDate: {detail.actual_StartDate_Time} {detail.start_time}'
#                 notification={ 'title': 'Approved request for session Reschedule', 'body': body }
#                 response = (requests.post('https://fcm.googleapis.com/fcm/send', json={'to': token,'notification': notification}, headers={'Authorization': f'key={SERVER_KEY}', 'Content-Type': 'application/json'})).json()

#                 return Response("Success: Record updated and new record created", status=status.HTTP_200_OK)

#             except agg_hhc_detailed_event_plan_of_care.DoesNotExist:
#                 # Handle the case where the existing session record does not exist
#                 return Response("Message: Record with given session not found", status=status.HTTP_200_OK)
#             except Exception as e:
#                 # Handle other exceptions that might occur during this process
#                 return Response(f"Error: {str(e)}", status=status.HTTP_500_INTERNAL_SERVER_ERROR)






class request_approvals(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    serializer_class = ServiceCancellationSerializer
    serializer_class2 = post_in_cancellation_history
    def post(self, request, req_id, res_can, srv_sess):
        clgref_id = get_prof(request)[3]
        request.data['last_modified_by'] = clgref_id
        eve_id = request.data.get('eve_id')
        remark = request.data.get('remark')
        sess_pk = request.data.get('session_id')
        
        # eve_id = request.data.get('eve_id')


        
        if res_can == 1 and srv_sess == 1:
            get_all_req = agg_hhc_cancellation_and_reschedule_request.objects.filter(req_id = req_id, eve_id = eve_id, is_deleted=2,is_srv_sesn=1, is_canceled=1)
            data = {
                "event_id": eve_id, 
                "cancellation_by": 1, 
                "reason": 2,
                "remark": remark, 
                "last_modified_by": clgref_id
                # "last_modified_by": "abc5"
                }   
            serializer = self.serializer_class(data=data)
            if serializer.is_valid():
                serializer.save()
                for req in get_all_req:
                    req.is_deleted = 1
                    req.save()

                
            return Response({'msg':'Service cancelled Done'})
                

        elif res_can == 1 and srv_sess == 2:
            
            get_all_req = agg_hhc_cancellation_and_reschedule_request.objects.filter(req_id = req_id, eve_id = eve_id, dtl_eve_id = sess_pk, is_deleted=2,is_srv_sesn=2, is_canceled=1).first()
            print(get_all_req,"get_all_req")
            get_eve_poc = agg_hhc_event_plan_of_care.objects.get(eve_id = eve_id)
            start_date_time = get_all_req.dtl_eve_id.actual_StartDate_Time
            end_date_time = get_all_req.dtl_eve_id.actual_EndDate_Time
            sub_srv_id = get_eve_poc.srv_id.srv_id

            print(get_eve_poc,"get_eve_poc")
            print(start_date_time,"start_date_time")
            print(end_date_time,"end_date_time")
            print(sub_srv_id,"sub_srv_id")

            print("error 1")
           
            
            if eve_id is None or start_date_time is None:
                return Response({'error': 'Please provide eve_id and start_date_time'}, status=status.HTTP_200_OK)
        

            get_event_data = agg_hhc_events.objects.get(eve_id=eve_id, status=1)
            epoc_model = agg_hhc_event_plan_of_care.objects.get(eve_id=eve_id, status=1)

            try:
                
                if end_date_time:
                    
                    record = agg_hhc_detailed_event_plan_of_care.objects.filter(
                        eve_id=eve_id,
                        actual_StartDate_Time__range=(start_date_time, end_date_time),status=1
                    )
                    
            
            except agg_hhc_detailed_event_plan_of_care.DoesNotExist:
                return Response({'error': 'Record not found'}, status=status.HTTP_200_OK)
            except agg_hhc_events.DoesNotExist:
                return Response({'error': 'agg_hhc_events Record not found'}, status=status.HTTP_200_OK)
            except agg_hhc_event_plan_of_care.DoesNotExist:
                return Response({'error': 'agg_hhc_event_plan_of_care Record not found'}, status=status.HTTP_200_OK)

            

            get_total_cancel_sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(
                    eve_id=eve_id,
                    actual_StartDate_Time__range=(start_date_time, end_date_time),
                    status = 1
            )

            get_total_wout_cancel_session = agg_hhc_detailed_event_plan_of_care.objects.filter(
                    eve_id=eve_id,
                    status = 1
            ).exclude(actual_StartDate_Time__range=(start_date_time, end_date_time))

            get_sub_srv_data = agg_hhc_sub_services.objects.get(sub_srv_id=sub_srv_id)
            per_session_amt = int(get_sub_srv_data.cost)
            get_total_cancel_sessions_now = get_total_cancel_sessions.count() * per_session_amt
            wout_cancel_ses = get_total_wout_cancel_session.count() * per_session_amt
            
            con_charge = get_total_cancel_sessions.aggregate(total_convinance_charges=Coalesce(Sum('convinance_charges'), Value(0)))['total_convinance_charges']
            con_chrg_wot_cancl = get_total_wout_cancel_session.aggregate(total_convinance_charges=Coalesce(Sum('convinance_charges'), Value(0)))['total_convinance_charges']
        

            eve_total_cost = get_event_data.Total_cost
          

            cancl_ses_amt = (eve_total_cost - get_total_cancel_sessions_now) + con_charge
            wout_cancl_ses_amt = eve_total_cost - wout_cancel_ses


            disc_type = get_event_data.discount_type
            disc_value = get_event_data.discount_value

            if disc_value is not None:
                disc_value = Decimal(disc_value)
              
            else:
                disc_value = 0

            
            if disc_type == 1:
                discounted_amt_wout_cncel = int(((disc_value)/100)*int(wout_cancel_ses))

            elif disc_type == 2:
                discounted_amt_wout_cncel = int(disc_value)
                
            else:
                discounted_amt_wout_cncel = 0
            
            discounted_amt_wout_cncel1 = int(wout_cancel_ses) - discounted_amt_wout_cncel

            
            with_con_chrg = discounted_amt_wout_cncel1 + con_chrg_wot_cancl

            final_amt_w_con_charge = discounted_amt_wout_cncel1 + con_chrg_wot_cancl
           
        
            get_event_data.final_amount = final_amt_w_con_charge
            

            get_event_data.last_modified_by = clgref_id
            get_event_data.Total_cost = wout_cancel_ses
            
            if con_charge is None:
                con_charge = 0
            
            if con_chrg_wot_cancl is None:
                con_chrg_wot_cancl = 0

            
            total_cancel_amt = int(per_session_amt * get_total_cancel_sessions_now)

            f_amount  = int(get_event_data.final_amount - total_cancel_amt)
        

            
            get_payment_status = agg_hhc_payment_details.objects.filter(eve_id = eve_id, 
                                                                        overall_status = 'SUCCESS', 
                                                                        status = 1)
            if get_payment_status.count() != 0:
                sesson_amt = per_session_amt
            else:
                sesson_amt = 0

            for dtl_id in record:
                con_chrg_fron_dtl = agg_hhc_detailed_event_plan_of_care.objects.get(agg_sp_dt_eve_poc_id = dtl_id.agg_sp_dt_eve_poc_id)
                cancel_history = {
                    'event_id': eve_id,
                    'cancellation_by': 2,
                    'can_amt': sesson_amt,
                    'convineance_chrg':con_chrg_fron_dtl.convinance_charges,
                    'remark': remark,
                    'agg_sp_dt_eve_poc_id':dtl_id.agg_sp_dt_eve_poc_id,
                    # 'reason': request.data.get('reason'),
                    'reason': 1,
                    'last_modified_by': clgref_id
                }
                serialized2_data = self.serializer_class2(data=cancel_history)  

                if serialized2_data.is_valid():
                    serialized2_data.save()
                else:
                    return Response(serialized2_data.errors, status=status.HTTP_400_BAD_REQUEST)
                
            print("near to set dtl ")
            for records in record:
                print("in dtl seting")
                records.status = 2
                records.is_cancelled = 1
                records.remark = remark 
                records.last_modified_by = clgref_id
                records.save()
            

            get_sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(
                eve_id=eve_id,
                status=1  
            )
            print("near set epoc dates")      
            depoc_start_date = get_sessions.aggregate(min_actual_StartDate_Time=Min('actual_StartDate_Time'))['min_actual_StartDate_Time']
          
            # Retrieve the maximum actual start date
            depoc_end_date = get_sessions.aggregate(max_actual_StartDate_Time=Max('actual_StartDate_Time'))['max_actual_StartDate_Time']

            epoc_model.start_date = depoc_start_date
            print("set start")
            epoc_model.end_date = depoc_end_date
            print("set end")
            epoc_model.last_modified_by = clgref_id
            epoc_model.save()
            
            serialized_data = self.serializer_class(record).data

            data = {
                'dtl_data': serialized_data,
                'cancel_data': serialized2_data.data
            }

            if get_sessions.count()==0:
                epoc_model.status=2
                get_event_data.status=2
                epoc_model.save()
                get_event_data.save()
            get_event_data.save()
            
            get_all_req.is_deleted = 1
            get_all_req.save()
            

            token = DeviceToken.objects.filter(clg_id=agg_com_colleague.objects.filter(clg_ref_id=agg_hhc_detailed_event_plan_of_care.objects.filter(agg_sp_dt_eve_poc_id=sess_pk).last().srv_prof_id.clg_ref_id).last(), is_login=True).last().token
            detail=agg_hhc_detailed_event_plan_of_care.objects.filter(agg_sp_dt_eve_poc_id=sess_pk).last()
            body=f'Patient: {detail.eve_id.agg_sp_pt_id.name}\nService: {detail.eve_poc_id.sub_srv_id.recommomded_service}\nDate: {detail.actual_StartDate_Time} {detail.start_time}'
            notification={ 'title': 'Approved request for session cancellation', 'body': body }
            response = (requests.post('https://fcm.googleapis.com/fcm/send', json={'to': token,'notification': notification}, headers={'Authorization': f'key={SERVER_KEY}', 'Content-Type': 'application/json'})).json()

            return Response({"msg":"ok"}, status=status.HTTP_200_OK)
            

            


        elif res_can == 2 and srv_sess == 1:

            get_all_req = agg_hhc_cancellation_and_reschedule_request.objects.filter(req_id=req_id, eve_id = eve_id, is_deleted=2, is_srv_sesn=1, is_reschedule=1).first()
            print(get_all_req, 'ge_all_req..............')
            date = get_all_req.reschedule_date
            start_date_str = date.strftime('%Y-%m-%d')

            start_time = date.strftime('%H:%M')

            dtl_date_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=start_date_str,
                                                                               start_time= start_time,
                                                                               end_time = start_time,
                                                                               srv_prof_id = get_all_req.dtl_eve_id.srv_prof_id,
                                                                               status = 1)
            if dtl_date_data.exists():
                return Response({"msg":"Professional has Already A session On that Time"}, stauts = status.HTTP_406_NOT_ACCEPTABLE)
            

            start_time_obj_abc = datetime.strptime(start_time, '%H:%M')
            end_time_obj_abc = start_time_obj_abc + timedelta(hours=2)
            end_time = end_time_obj_abc.strftime('%H:%M')
            # end_time = date.strftime('%H:%M')
    
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
                start_time_obj = datetime.strptime(start_time, '%H:%M')
                end_time_obj = datetime.strptime(end_time, '%H:%M')

                queryset =  agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=eve_id,status=1)
                pros=set([i.srv_prof_id for i in queryset])
                get_count_dtl = queryset.count()
                queryset2 =  agg_hhc_event_plan_of_care.objects.filter(eve_id=eve_id,status=1)
                
                history_tracker=agg_hhc_event_plan_of_care_H_T_Serializer(data=queryset2, many=True)
                if history_tracker.is_valid():
                    history_tracker.save()
           
                new_end_date = start_date + timedelta(days=get_count_dtl)
                new_end_date -= timedelta(days=1)
            
                queryset2.update(start_date=start_date_str, end_date=new_end_date, start_time=start_time_obj, end_time=end_time_obj, remark=remark, service_reschedule=1, last_modified_by=clgref_id)

                for i, obj in enumerate(queryset):
                    new_start_date = start_date + timedelta(days=i)
                    new_end_date = new_end_date + timedelta(days=i)
                
                    obj.actual_StartDate_Time = new_start_date.date()
                    obj.actual_EndDate_Time = new_start_date.date()
                
                    obj.start_time = start_time_obj
                    obj.end_time = end_time_obj
                    obj.last_modified_by = clgref_id
                    obj.save()
                    get_all_req.is_deleted = 1
                    get_all_req.save()
                    # for req in get_all_req:
                    #     req.is_deleted = 1
                    #     req.save()
                tokn=[j.token for j in DeviceToken.objects.filter(clg_id__in=agg_com_colleague.objects.filter(clg_ref_id__in=[pro.clg_ref_id for pro in pros]), is_login=True)]
                eve_poc_id=agg_hhc_event_plan_of_care.objects.filter(eve_id=eve_id, status=1).last() 
                body=f'Patient: {eve_poc_id.eve_id.agg_sp_pt_id.name}\nService: {eve_poc_id.sub_srv_id.recommomded_service}\nStart DateTime:\n {eve_poc_id.start_date} {eve_poc_id.start_time}\nEnd DateTime:\n {eve_poc_id.end_date} {eve_poc_id.end_time}'
                notification={ 'title': 'Approved request for service rescheduling.', 'body': body }
                for tk in tokn:
                    response = (requests.post('https://fcm.googleapis.com/fcm/send', json={'to': tk,'notification': notification}, headers={'Authorization': f'key={SERVER_KEY}', 'Content-Type': 'application/json'})).json()

                serializer = Detailed_EPOC_serializer(queryset, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except  agg_hhc_event_plan_of_care.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)



        elif res_can == 2 and srv_sess == 2:
       
            # try:
            get_all_req = agg_hhc_cancellation_and_reschedule_request.objects.filter(req_id=req_id, eve_id = eve_id, dtl_eve_id = sess_pk, is_deleted=2, is_srv_sesn=2, is_reschedule=1).first()
            print(get_all_req,'get_all_req')

            
            
            session_date_str = get_all_req.dtl_eve_id.actual_StartDate_Time
            session_reschedule_date_str = get_all_req.reschedule_date
        
            session_date_component = session_date_str
        

            resch_session_date_component = session_reschedule_date_str.date()
            resch_session_time_component = session_reschedule_date_str.time()
            end_time = datetime.combine(resch_session_date_component, resch_session_time_component) + timedelta(hours=2)
            print(end_time.time(),'end_time')

            
            # print(eve_id, 'eve_id..............')
            get_session_data = agg_hhc_detailed_event_plan_of_care.objects.get(eve_id=eve_id,actual_StartDate_Time=session_date_component,status=1)
            print(get_session_data,'get_session_data..........')
            dtl_date_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=resch_session_date_component,
                                                                            start_time= resch_session_time_component,
                                                                            end_time = resch_session_time_component,
                                                                            srv_prof_id = get_session_data.srv_prof_id,
                                                                            status = 1)
            if dtl_date_data.exists():
                return Response({"msg":"Professional has Already A session On that Time"}, stauts = status.HTTP_406_NOT_ACCEPTABLE)
            

            new_session = agg_hhc_detailed_event_plan_of_care(
                eve_poc_id = get_session_data.eve_poc_id,
                eve_id = get_session_data.eve_id,
                index_of_Session = get_session_data.index_of_Session,
                srv_prof_id = get_session_data.srv_prof_id,
                actual_StartDate_Time = resch_session_date_component,
                actual_EndDate_Time = resch_session_date_component,
                start_time = resch_session_time_component,
                end_time = end_time.time(),
                service_cost = get_session_data.service_cost,
                amount_received = get_session_data.amount_received,
                status=1,
                remark = remark,
                Reschedule_status=1,
                last_modified_by = clgref_id
            )
            new_session.save()
            
            get_sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(
                eve_id=eve_id,
                status=1  
            )
            epoc_model = agg_hhc_event_plan_of_care.objects.get(eve_id=eve_id, status=1)

            depoc_start_date = get_sessions.aggregate(min_actual_StartDate_Time=Min('actual_StartDate_Time'))['min_actual_StartDate_Time']

            # Retrieve the maximum actual start date
            depoc_end_date = get_sessions.aggregate(max_actual_StartDate_Time=Max('actual_StartDate_Time'))['max_actual_StartDate_Time']

            epoc_model.start_date = depoc_start_date
            epoc_model.end_date = depoc_end_date
            epoc_model.last_modified_by = clgref_id
            epoc_model.save()
            
            get_session_data.status = 2
            get_session_data.save()
            # for req in get_all_req:
            #     req.is_deleted = 1
            #     req.save()
            get_all_req.is_deleted = 1
            get_all_req.save()
            token = DeviceToken.objects.filter(clg_id=agg_com_colleague.objects.filter(clg_ref_id=agg_hhc_detailed_event_plan_of_care.objects.filter(agg_sp_dt_eve_poc_id=sess_pk).last().srv_prof_id.clg_ref_id).last(), is_login=True).last().token
            detail=agg_hhc_detailed_event_plan_of_care.objects.filter(agg_sp_dt_eve_poc_id=sess_pk).last()
            body=f'Patient: {detail.eve_id.agg_sp_pt_id.name}\nService: {detail.eve_poc_id.sub_srv_id.recommomded_service}\nDate: {detail.actual_StartDate_Time} {detail.start_time}'
            notification={ 'title': 'Approved request for session Reschedule', 'body': body }
            response = (requests.post('https://fcm.googleapis.com/fcm/send', json={'to': token,'notification': notification}, headers={'Authorization': f'key={SERVER_KEY}', 'Content-Type': 'application/json'})).json()
            return Response("Success: Record updated and new record created", status=status.HTTP_200_OK)

            # except agg_hhc_detailed_event_plan_of_care.DoesNotExist:
            #     # Handle the case where the existing session record does not exist
            #     return Response("Message: Record with given session not found", status=status.HTTP_200_OK)
            # except Exception as e:
            #     # Handle other exceptions that might occur during this process
            #     return Response(f"Error: {str(e)}", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        elif res_can == 2 and srv_sess == 3:
            try:
                get_all_req = agg_hhc_cancellation_and_reschedule_request.objects.filter(
                    req_id=req_id, eve_id=eve_id, dtl_eve_id=sess_pk, is_deleted=2, is_srv_sesn=3, is_reschedule=1
                ).first()

                srv_prof_id_id = request.data.get('srv_prof_id')
                prof_id = None
                if srv_prof_id_id is not None:
                    pro = agg_hhc_service_professionals.objects.get(srv_prof_id=srv_prof_id_id)
                    prof_id = pro
                print(get_all_req.dtl_eve_id,'get_all_req.dtl_eve_id')
                if get_all_req and get_all_req.dtl_eve_id:
                    dtl = agg_hhc_detailed_event_plan_of_care.objects.get(agg_sp_dt_eve_poc_id=get_all_req.dtl_eve_id.agg_sp_dt_eve_poc_id)
                    dtl.srv_prof_id = prof_id
                    dtl.save()
                    print(get_all_req,'get_all_req')
                    get_atn = agg_hhc_attendance.objects.get(att_id = get_all_req.atten_id.att_id)
                    get_atn.approve_status = 1
                    # get_all_req.atten_id.att_id = 1
                    get_all_req.is_deleted = 1
                    get_all_req.remark=remark
                    get_atn.save()
                    get_all_req.save()

                return Response("Success: Professional Rescheduled and leave approved", status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error':f'{str(e)} or session already reschdeule'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




      


        
class request_rejection(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self,request, req_id):
        # try:
        get_req = agg_hhc_cancellation_and_reschedule_request.objects.get(req_id = req_id)
        remark = request.data.get("remark")
        get_req.req_rejection_remark = remark
        get_req.professional_request_status = 2
        get_req.is_deleted = 1
        get_req.save()
        dteve=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=get_req.eve_id, status=1)
        token = DeviceToken.objects.filter(clg_id=agg_com_colleague.objects.filter(clg_ref_id=dteve.last().srv_prof_id.clg_ref_id).last(), is_login=True).last().token
        body=f'Patient: {dteve.last().eve_id.agg_sp_pt_id.name}\nService: {dteve.last().eve_poc_id.sub_srv_id.recommomded_service}\nDate: {dteve.last().actual_StartDate_Time} {dteve.last().start_time}'
        if get_req.is_canceled==1:
            s='Cancellation'
        elif get_req.is_reschedule==1:
            s='Reschedule'
        else:s=''
        if get_req.is_srv_sesn==1:
            notification={ 'title': f'Service {s} Request rejected.', 'body': body }
        elif get_req.is_srv_sesn==2:
            notification={ 'title': f'Session {s} Request rejected.', 'body': body }
        else:
            notification={ 'title': 'Request rejected.', 'body': body }


        response = (requests.post('https://fcm.googleapis.com/fcm/send', json={'to': token,'notification': notification}, headers={'Authorization': f'key={SERVER_KEY}', 'Content-Type': 'application/json'})).json()

        return Response({"done":"Professional request Rejected"}, status=status.HTTP_202_ACCEPTED)




class get_selected_job_closure_question(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, eve_id,lang_id=None):
        if lang_id:
                if lang_id==1:
                    data = agg_hhc_events_wise_jc_question.objects.filter(eve_id = eve_id, status = 1)
                    serialzier = get_selected_job_clousre_que_serializerM(data, many=True)
                    serialzier=list(serialzier.data)
                    for i in serialzier:
                        i['jcq_id']['jcq_question']=i['jcq_id']['jcq_question_mar']
                        i['jcq_id'].pop('jcq_question_mar')
                    # print(serialzier.data[0]['jcq_id']['jcq_question_hindi'])
                    return Response(serialzier)
                if lang_id==2:
                    data = agg_hhc_events_wise_jc_question.objects.filter(eve_id = eve_id, status = 1)
                    serialzier = get_selected_job_clousre_que_serializerH(data, many=True)
                    serialzier=list(serialzier.data)
                    for i in serialzier:
                        i['jcq_id']['jcq_question']=i['jcq_id']['jcq_question_hindi']
                        i['jcq_id'].pop('jcq_question_hindi')
                    # print(serialzier.data[0]['jcq_id']['jcq_question_hindi'])
                    return Response(serialzier)
                else:
                    data = agg_hhc_events_wise_jc_question.objects.filter(eve_id = eve_id, status = 1)
                    serialzier = get_selected_job_clousre_que_serializer(data, many=True)
                    return Response(serialzier.data)
        else:
            data = agg_hhc_events_wise_jc_question.objects.filter(eve_id = eve_id, status = 1)
            serialzier = get_selected_job_clousre_que_serializer(data, many=True)
            return Response(serialzier.data)



class get_selected_job_closure_question_prof_app(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, eve_id,lang_id):
        data = agg_hhc_events_wise_jc_question.objects.filter(eve_id = eve_id, status = 1)
        serialzier = get_selected_job_clousre_que_serializer(data, many=True)
        return Response(serialzier.data)



class job_closure_srv_sess_wise(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    serializer_class = agg_hhc_session_job_closure_serializer_form_2

    def post(self, request, srv_prof_id, dtl_eve_id):
        try:
            instance = agg_hhc_detailed_event_plan_of_care.objects.get(agg_sp_dt_eve_poc_id=dtl_eve_id)
            # instance.Session_jobclosure_status = 1
            # instance.Session_status = 9
            # instance.save()

            all_detail_event_plan = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=instance.eve_id, status=1).count()
            detail_event = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=instance.eve_id, status=1, Session_jobclosure_status=1).count()
            
            if all_detail_event_plan == detail_event:
                event_plan_care = agg_hhc_event_plan_of_care.objects.get(eve_id=instance.eve_id)
                event_plan_care.service_status = 4
                event_plan_care.save()
                
                event = agg_hhc_events.objects.get(eve_id=instance.eve_id.eve_id)
                event.event_status = 3
                event.save()
                print("donnnnnnneeeeeeeeeeeeeeeeeeeeeeeeeeeeeee job close")
            
            # def convert_date(date_str):
            #     return datetime.strptime(date_str, "%d-%m-%Y").strftime("%Y-%m-%d")

            # prof_session_start_date = request.data.get("prof_session_start_date")
            # prof_session_end_date = request.data.get("prof_session_end_date")

            # if prof_session_start_date:
            #     prof_session_start_date = convert_date(prof_session_start_date)
            # if prof_session_end_date:
            #     prof_session_end_date = convert_date(prof_session_end_date)
            serializer1 = deteailed_session_st_ed_time_date(instance=instance, data={
                "prof_session_start_date": request.data.get("prof_session_start_date"),
                "prof_session_end_date": request.data.get("prof_session_end_date"),
                "prof_session_start_time": request.data.get("prof_session_start_time"),
                "prof_session_end_time": request.data.get("prof_session_end_time")
            }, partial=True)
            
            if serializer1.is_valid():
                serializer1.save()
            else:
                return Response({'serializer1': serializer1.errors, 'success': 'False'})
            
            request_data = request.data
            prof_data = agg_hhc_service_professionals.objects.get(srv_prof_id=srv_prof_id)
            
            try:
                sub_srv_id = prof_data.prof_sub_srv_id.sub_srv_id
            except AttributeError:
                sub_srv_id = None
            
            keys_and_values = {
                "srv_prof_id": srv_prof_id,
                "dtl_eve_id": dtl_eve_id,
                "prof_sub_srv_id": sub_srv_id
            }
            
            if 'question_data' in request_data:
                question_data = request_data['question_data']
                for question in question_data:
                    for key, value in question.items():
                        keys_and_values[key] = value
            
            serializer = self.serializer_class(data=keys_and_values)
            
            if serializer.is_valid():
                serializer.save()
                instance.Session_jobclosure_status = 1
                instance.Session_status = 9
                instance.save()
                return Response({'serializer': serializer.data, 'success': 'True'})
            else:
                return Response({'serializer': serializer.errors, 'success': 'False'})
        except Exception as e:
            return Response({'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class job_closure_srv_sess_wise(APIView):
#     renderer_classes = [UserRenderer]
#     permission_classes = [IsAuthenticated]
#     serializer_class = agg_hhc_session_job_closure_serializer_form_2
#     def post(self, request, srv_prof_id, dtl_eve_id):
#         instance = agg_hhc_detailed_event_plan_of_care.objects.get(agg_sp_dt_eve_poc_id=dtl_eve_id)
#         instance.Session_jobclosure_status = 1
#         instance.Session_status = 9
#         instance.save()

#         all_detail_event_plan = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=instance.eve_id, status=1).count()
#         detail_event = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=instance.eve_id, status=1, Session_jobclosure_status=1).count()
        
#         if all_detail_event_plan == detail_event:
#             event_plan_care = agg_hhc_event_plan_of_care.objects.get(eve_id=instance.eve_id)
#             event_plan_care.service_status = 4
#             event_plan_care.save()
            
#             event = agg_hhc_events.objects.get(eve_id=instance.eve_id.eve_id)
#             event.event_status = 3
#             event.save()
#             print("donnnnnnneeeeeeeeeeeeeeeeeeeeeeeeeeeeeee job close")
#         def convert_date(date_str):
#             return datetime.strptime(date_str, "%d-%m-%Y").strftime("%Y-%m-%d")

#         prof_session_start_date = request.data.get("prof_session_start_date")
#         prof_session_end_date = request.data.get("prof_session_end_date")

#         if prof_session_start_date:
#             prof_session_start_date = convert_date(prof_session_start_date)
#         if prof_session_end_date:
#             prof_session_end_date = convert_date(prof_session_end_date)
#         serializer1 = deteailed_session_st_ed_time_date(instance=instance, data={
#             "prof_session_start_date": prof_session_start_date,
#             "prof_session_end_date": prof_session_end_date,
#             "prof_session_start_time": request.data.get("prof_session_start_time"),
#             "prof_session_end_time": request.data.get("prof_session_end_time")
#         }, partial=True)
        
#         if serializer1.is_valid():
#             serializer1.save()
#         else:
#             return Response({'serializer1': serializer1.errors, 'success': 'False'})
        
#         request_data = request.data
#         prof_data = agg_hhc_service_professionals.objects.get(srv_prof_id=srv_prof_id)
        
#         try:
#             sub_srv_id = prof_data.prof_sub_srv_id.sub_srv_id
#         except AttributeError:
#             sub_srv_id = None
        
#         keys_and_values = {
#             "srv_prof_id": srv_prof_id,
#             "dtl_eve_id": dtl_eve_id,
#             "prof_sub_srv_id": sub_srv_id
#         }
        
#         if 'question_data' in request_data:
#             question_data = request_data['question_data']
#             for question in question_data:
#                 for key, value in question.items():
#                     keys_and_values[key] = value
        
#         serializer = self.serializer_class(data=keys_and_values)
        
#         if serializer.is_valid():
#             serializer.save()
#             return Response({'serializer': serializer.data, 'success': 'True'})
#         else:
#             return Response({'serializer': serializer.errors, 'success': 'False'})
            
            






class feedback_complent_dashbord_count(APIView):
    complaint_counts_serializer = dash_complaint_counts_serializer
    feedback_count_serialzer = dash_feedback_counts_serializer

    def get(self, request, is_fc, is_twm):
        if is_fc == 1 and is_twm == 1:
            today = timezone.now().date()
            get_tday_feed_counts = dash_complaint_feedback_counts.objects.filter(is_feed_comp = 1, status = 1, added_date__date=today).first()
            serialize_feed = self.feedback_count_serialzer(get_tday_feed_counts)
            data = {
                "feedback_count":serialize_feed.data
            }
            return Response(data)
        
        elif is_fc == 1 and is_twm == 2:
            today = timezone.now().date()
            seven_days_ago = today - timedelta(days=7)
            get_lsvnday_feed_counts = dash_complaint_feedback_counts.objects.filter(is_feed_comp = 1, status = 1, added_date__date__range=(seven_days_ago, today))

            # ["feed_excellent","feed_good","feed_poor","is_feed_comp"]
            feed_excellent_sum = get_lsvnday_feed_counts.aggregate(total_feed_excellent=Sum('feed_excellent'))['total_feed_excellent'] or 0
            feed_good_sum = get_lsvnday_feed_counts.aggregate(total_feed_good=Sum('feed_good'))['total_feed_good'] or 0
            feed_poor_sum = get_lsvnday_feed_counts.aggregate(total_feed_poor=Sum('feed_poor'))['total_feed_poor'] or 0
            data = {
                        "feedback_count":{
                            "feed_excellent":feed_excellent_sum,
                            "feed_good":feed_good_sum,
                            "feed_poor":feed_poor_sum,
                            "is_feed_comp":1
                        }
                    }
            return Response(data)
        
        elif is_fc == 1 and is_twm == 3:
            today = timezone.now().date()
            first_day_of_month = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            get_month_feed_counts = dash_complaint_feedback_counts.objects.filter(is_feed_comp = 1, status = 1, added_date__date__range=(first_day_of_month, today))

            # ["feed_excellent","feed_good","feed_poor","is_feed_comp"]
            feed_excellent_sum = get_month_feed_counts.aggregate(total_feed_excellent=Sum('feed_excellent'))['total_feed_excellent'] or 0
            feed_good_sum = get_month_feed_counts.aggregate(total_feed_good=Sum('feed_good'))['total_feed_good'] or 0
            feed_poor_sum = get_month_feed_counts.aggregate(total_feed_poor=Sum('feed_poor'))['total_feed_poor'] or 0
            data = {    
                        "feedback_count":{
                            "feed_excellent":feed_excellent_sum,
                            "feed_good":feed_good_sum,
                            "feed_poor":feed_poor_sum,
                            "is_feed_comp":1
                        }
                    }
            return Response(data)
        
        elif is_fc == 2 and is_twm == 1:
            today = timezone.now().date()
            get_tday_cpml_counts = dash_complaint_feedback_counts.objects.filter(is_feed_comp = 2, status = 1, added_date__date=today).first()
            serialize_comp = self.complaint_counts_serializer(get_tday_cpml_counts)
            data = {
                "complaint_count":serialize_comp.data
            }
            return Response(data)
        
        elif is_fc == 2 and is_twm == 2:
            today = timezone.now().date()
            seven_days_ago = today - timedelta(days=7)
            get_lsvnday_comp_counts = dash_complaint_feedback_counts.objects.filter(is_feed_comp = 2, status = 1, added_date__date__range=(seven_days_ago, today))

            # ["comp_total_sch","comp_completed","comp_pending","comp_positive","comp_negative","is_feed_comp"]
            comp_total_sch_sum = get_lsvnday_comp_counts.aggregate(total_comp_total_sch=Sum('comp_total_sch'))['total_comp_total_sch'] or 0
            comp_completed_sum = get_lsvnday_comp_counts.aggregate(total_comp_completed=Sum('comp_completed'))['total_comp_completed'] or 0
            comp_pending_sum = get_lsvnday_comp_counts.aggregate(total_comp_pending=Sum('comp_pending'))['total_comp_pending'] or 0
            comp_positive_sum = get_lsvnday_comp_counts.aggregate(total_comp_positive=Sum('comp_positive'))['total_comp_positive'] or 0
            comp_negative_sum = get_lsvnday_comp_counts.aggregate(total_comp_negative=Sum('comp_negative'))['total_comp_negative'] or 0
            data = {    
                        "complaint_count":{
                            "comp_total_sch":comp_total_sch_sum,
                            "comp_completed":comp_completed_sum,
                            "comp_pending":comp_pending_sum,
                            "comp_positive":comp_positive_sum,
                            "comp_negative":comp_negative_sum,
                            "is_feed_comp":1
                            }
                    }
            return Response(data)
        
        elif is_fc == 2 and is_twm == 3:
            today = timezone.now().date()
            first_day_of_month = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            get_month_comp_counts = dash_complaint_feedback_counts.objects.filter(is_feed_comp = 2, status = 1, added_date__date__range=(first_day_of_month, today))

            # ["comp_total_sch","comp_completed","comp_total_sch","comp_pending","comp_positive","comp_negative","is_feed_comp"]
            comp_total_sch_sum = get_month_comp_counts.aggregate(total_comp_total_sch=Sum('comp_total_sch'))['total_comp_total_sch'] or 0
            comp_completed_sum = get_month_comp_counts.aggregate(total_comp_completed=Sum('comp_completed'))['total_comp_completed'] or 0
            comp_pending_sum = get_month_comp_counts.aggregate(total_comp_pending=Sum('comp_pending'))['total_comp_pending'] or 0
            comp_positive_sum = get_month_comp_counts.aggregate(total_comp_positive=Sum('comp_positive'))['total_comp_positive'] or 0
            comp_negative_sum = get_month_comp_counts.aggregate(total_comp_negative=Sum('comp_negative'))['total_comp_negative'] or 0
            data = {    
                        "complaint_count":{
                            "comp_total_sch":comp_total_sch_sum,
                            "comp_completed":comp_completed_sum,
                            "comp_pending":comp_pending_sum,
                            "comp_positive":comp_positive_sum,
                            "comp_negative":comp_negative_sum,
                            "is_feed_comp":1

                        }
                    }
            return Response(data)
        
            


    # def post(self, request, is_fc,is_twm):
    #     today = timezone.now().date()

    #     # Check if a record with today's date already exists
    #     existing_record = None
    #     if is_fc == 1:
    #         existing_record = dash_complaint_feedback_counts.objects.filter(added_date__date=today).first()
    #     elif is_fc == 2:
    #         existing_record = dash_complaint_feedback_counts.objects.filter(added_date__date=today).first()

    #     # If record exists, return a message
    #     if existing_record:
    #         return Response({"msg": "Record for today already exists"})
        
    #     if is_fc == 1 :
    #         request.data['is_feed_comp'] = 1
    #         serialize_feed = self.feedback_count_serialzer(data = request.data)
    #         if serialize_feed.is_valid():
    #             serialize_feed.save()
    #         return Response({"msg":"Done, Today feedback count save"})
    #     if is_fc == 2 :
    #         request.data['is_feed_comp'] = 2
    #         serialize_com = self.complaint_counts_serializer(data = request.data)
    #         if serialize_com.is_valid():
    #             serialize_com.save()
    #         return Response({"msg":"Done, Today Complaint count save"})

    def post(self, request, is_fc,is_twm):

        today = timezone.now().date()

        
        existing_record = None
        if is_fc == 1:
            existing_record = dash_complaint_feedback_counts.objects.filter(added_date__date=today).first()
        elif is_fc == 2:
            existing_record = dash_complaint_feedback_counts.objects.filter(added_date__date=today).first()

      
        if existing_record:
           
            if is_fc == 1:
                request.data['is_feed_comp'] = 1
                serialize_feed = self.feedback_count_serialzer(existing_record, data=request.data, partial=True)
                if serialize_feed.is_valid():
                    serialize_feed.save()
                return Response({"msg": "Done, Today feedback count updated"})
            elif is_fc == 2:
                request.data['is_feed_comp'] = 2
                serialize_com = self.complaint_counts_serializer(existing_record, data=request.data, partial=True)
                if serialize_com.is_valid():
                    serialize_com.save()
                return Response({"msg": "Done, Today Complaint count updated"})
        else:
           
            if is_fc == 1:
                request.data['is_feed_comp'] = 1
                serialize_feed = self.feedback_count_serialzer(data=request.data)
                if serialize_feed.is_valid():
                    serialize_feed.save()
                return Response({"msg": "Done, Today feedback count saved"})
            elif is_fc == 2:
                request.data['is_feed_comp'] = 2
                serialize_com = self.complaint_counts_serializer(data=request.data)
                if serialize_com.is_valid():
                    serialize_com.save()
                return Response({"msg": "Done, Today Complaint count saved"})
            
class update_receipt_no(APIView):
    def get(self, request):
        last_receipt=agg_hhc_payment_details.objects.filter(overall_status='SUCCESS').order_by('pay_dt_id')
        print(last_receipt)
        for i in range(len(last_receipt)):
            last_receipt[i].receipt_no=i+1
            last_receipt[i].save()
            print(last_receipt[i].receipt_no)
            print(last_receipt[i].pay_dt_id,'done')
        return Response({'status':'success'})
    
class update_invoice_id(APIView):
    def get(self, request):
        eve = agg_hhc_events.objects.filter(purp_call_id=1).order_by('eve_id')
        # eve = agg_hhc_events.objects.all().order_by('eve_id')
        # [print(i.purp_call_id, i.eve_id, i.enq_spero_srv_status) for i in eve]
        # print(eve.last().eve_id,';;asdf')
        for i in range(len(eve)):
            eve[i].Invoice_ID=i+1
            # eve[i].Invoice_ID=None
            eve[i].save()
        return Response({'status':'done'})



class test_case_service_deactivate(APIView):
    def post(self, request):
        eve_ids = request.data.get('eve_ids',[])
        for  i in eve_ids:
            get_event = agg_hhc_events.objects.filter(eve_id = i)
            for e in get_event:
                e.status = 2
                e.save()
            get_event_plan = agg_hhc_event_plan_of_care.objects.filter(eve_id = i)
            for ep in get_event_plan:
                ep.status = 2
                ep.save()
            get_dtl_event = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id = i)
            for de in get_dtl_event:
                de.status = 2
                de.save()
            get_payment_dtl = agg_hhc_payment_details.objects.filter(eve_id = i)
            for pay in get_payment_dtl:
                pay.status = 2
                pay.save()
        
        return Response({'msg':"event deactivated from events, event plan of care, detailed event plan of care model"})
    
    
class AggHHCAttendanceAPIView(APIView):
    def get(self, request, format=None):
        
        # srv_filter = request.GET.get('srv_id')
        
        # if srv_filter:
        #     attendance_records = agg_hhc_service_professionals.objects.filter(srv_id=srv_filter)
        # else:
        attendance_records = agg_hhc_service_professionals.objects.filter(status=1, prof_registered=True, prof_interviewed=True, prof_doc_verified=True, professinal_status=4)  
                  
        serializer = AggHHCAttendanceSerializer(attendance_records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
from rest_framework.exceptions import ValidationError

from rest_framework.exceptions import ValidationError
from django.utils.dateparse import parse_date


# class PostAggHHCAttendanceAPIView(APIView):
#     def post(self, request, format=None):
#         serializer = POST_AggHHCAttendanceSerializer(data=request.data)
        
#         try:
#             if serializer.is_valid():
#                 attnd_status = request.data.get("attnd_status")
                
#                 if attnd_status != "Present":
#                     professional_id = request.data.get("Professional_iid")
#                     attnd_date = request.data.get("attnd_date")
                    
#                     attnd_date = parse_date(attnd_date)

#                     # Query the agg_hhc_detailed_event_plan_of_care table
#                     try:
#                         event_plans = agg_hhc_detailed_event_plan_of_care.objects.filter(
#                             srv_prof_id=professional_id,
#                             actual_StartDate_Time=attnd_date  # Assuming actual_StartDate_Time is a datetime field
#                         )
                        
#                         if event_plans.exists():
                        
#                             response_data =[ {
#                                 "eve_id": event_plan.eve_id.eve_id,
#                                 "service": event_plan.eve_poc_id.srv_id.service_title,
#                                 "sub_service": event_plan.eve_poc_id.sub_srv_id.recommomded_service,
#                                 "patient": event_plan.eve_id.agg_sp_pt_id.name,
#                                 "actual_StartDate_Time": event_plan.actual_StartDate_Time
#                             }  for event_plan in event_plans ]
#                         return Response(response_data, status=status.HTTP_200_OK)
#                     except agg_hhc_detailed_event_plan_of_care.DoesNotExist:
#                         serializer.save()
#                         return Response({"error": "No matching event found"}, status=status.HTTP_404_NOT_FOUND)
#                 else:
#                     # Save the data if attnd_status is "Present"
#                     serializer.save()
#                     return Response(serializer.data, status=status.HTTP_201_CREATED)
#             else:
#                 return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#         except ValidationError as e:
#             return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             return Response({'error': 'Something went wrong','msg':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PostAggHHCAttendanceAPIView(APIView):
     renderer_classes = [UserRenderer]
     permission_classes = [IsAuthenticated]
    # def post(self, request, format=None):
    #     serializer = POST_AggHHCAttendanceSerializer(data=request.data)

    #     try:
    #         if serializer.is_valid():
    #             attnd_status = request.data.get("attnd_status")
                
    #             if attnd_status != "Present":
    #                 professional_id = request.data.get("Professional_iid")
    #                 attnd_date = request.data.get("attnd_date")
                    
    #                 attnd_date = parse_date(attnd_date)
    #                 if not attnd_date:
    #                     return Response({"error": "Invalid date format"}, status=status.HTTP_400_BAD_REQUEST)
                    
    #                 # Query the agg_hhc_detailed_event_plan_of_care table
    #                 try:
    #                     event_plans = agg_hhc_detailed_event_plan_of_care.objects.filter(
    #                         srv_prof_id=professional_id,
    #                         actual_StartDate_Time=attnd_date
    #                     )
    #                     # event_plans_of_care = agg_hhc_event_plan_of_care.objects.filter(
    #                     #     srv_prof_id=professional_id,
    #                     #     start_date=attnd_date
    #                     # )
                        
    #                     if event_plans.exists():
    #                         response_data = [{
    #                             "eve_id": event_plan.eve_id.eve_id,
    #                             "service": event_plan.eve_poc_id.srv_id.service_title,
    #                             "sub_service": event_plan.eve_poc_id.sub_srv_id.recommomded_service,
    #                             "patient": event_plan.eve_id.agg_sp_pt_id.name,
    #                             "actual_StartDate_Time": event_plan.actual_StartDate_Time,
    #                             "eve_code": event_plan.eve_id.event_code,
    #                             "professional_name": event_plan.srv_prof_id.prof_fullname,
    #                             "actual_Time": event_plan.start_time,
    #                             "eve_poc_id": event_plan.eve_poc_id.eve_poc_id,
    #                             "dt_eve_poc_id":event_plan.agg_sp_dt_eve_poc_id
                                
    #                             # "eve_poc_id": event_plan_of_care.eve_poc_id
    #                         } for event_plan in event_plans]
    #                         return Response(response_data, status=status.HTTP_200_OK)
    #                     else:
    #                         # Save the data if no matching event is found
    #                         serializer.save()
    #                         return Response({"error": "No matching event found, but record saved"}, status=status.HTTP_201_CREATED)
    #                 except Exception as e:
    #                     return Response({'error': 'Query error', 'msg': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    #             else:
    #                 # Save the data if attnd_status is "Present"
    #                 serializer.save()
    #                 return Response(serializer.data, status=status.HTTP_201_CREATED)
    #         else:
    #             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    #     except ValidationError as e:
    #         return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    #     except Exception as e:
    #         return Response({'error': 'Something went wrong', 'msg': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

     def post(self, request, format=None):
        serializer = POST_AggHHCAttendanceSerializer(data=request.data)
        
        if serializer.is_valid():
            if serializer.validated_data.get('attendance_exists'):
                return Response({"message": "Attendance for this professional on this date already exists."}, status=status.HTTP_200_OK)
            
            attnd_status = request.data.get("attnd_status")

            if attnd_status != "Present":
                professional_id = request.data.get("Professional_iid")
                attnd_date = request.data.get("attnd_date")
                
                attnd_date = parse_date(attnd_date)

                event_plans = agg_hhc_detailed_event_plan_of_care.objects.filter(
                    srv_prof_id=professional_id,
                    actual_StartDate_Time=attnd_date
                )
                
                if event_plans.exists():
                    response_data = [{
                        "eve_id": event_plan.eve_id.eve_id,
                        "service": event_plan.eve_poc_id.srv_id.service_title,
                        "sub_service": event_plan.eve_poc_id.sub_srv_id.recommomded_service,
                        "patient": event_plan.eve_id.agg_sp_pt_id.name,
                        "actual_StartDate_Time": event_plan.actual_StartDate_Time.isoformat(),  # Ensure datetime is serialized
                        "eve_code": event_plan.eve_id.event_code,
                        "professional_name": event_plan.srv_prof_id.prof_fullname,
                        "actual_Time": event_plan.start_time.isoformat() if event_plan.start_time else None,  # Ensure time is serialized
                        "eve_poc_id": event_plan.eve_poc_id.eve_poc_id,
                        "dt_eve_poc_id": event_plan.agg_sp_dt_eve_poc_id
                    } for event_plan in event_plans]
                    return Response(response_data, status=status.HTTP_200_OK)
                else:
                    serializer.save()
                    return Response({"message": "No matching event found, but record saved."}, status=status.HTTP_201_CREATED)
            else:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
from django.shortcuts import get_object_or_404

class GetAggHHCAttendanceAPIView(APIView):
    def get(self, request, pro_id, format=None):
        # Retrieve the attendance record using the provided att_id
        attendance_records = agg_hhc_attendance.objects.filter(Professional_iid=pro_id)
        
        # Serialize the attendance record
        if attendance_records.exists():
            # Serialize the attendance records
            serializer = GET_AggHHCAttendanceSerializer(attendance_records, many=True)
            # Return the serialized data with a 200 OK response
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # If no records found, return a 404 Not Found response
            return Response({"error": "No attendance records found"}, status=status.HTTP_404_NOT_FOUND)
    
        
#=========================get transactions==================

import requests
import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import uuid

@csrf_exempt
@api_view(['POST'])
def get_settlement_reconciliation(request):
    url = "https://api.cashfree.com/pg/settlement/recon"
    headers = {
        "x-api-version": "2022-09-01",
        "appId": "20453165a737ebd97e430fcabc135402",
        "secretKey": "cfsk_ma_prod_172c08ceff37119b1cf5ff4fa593b4bd_a2adc215",
    }
    
    # Extract the required filters from the request data
    
    pagination = request.data.get('pagination', {"cursor": None, "limit": 10})
    filters = request.data.get('filters', {})
    
    payload = {
        "pagination": pagination,
        "filters": filters
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()  # Raise an exception for HTTP errors

        if response.status_code == 200:
            data = response.json()
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Failed to fetch settlement details"}, status=response.status_code)
    except requests.exceptions.HTTPError as e:
        return Response({"error": f"HTTP error occurred: {str(e)}"}, status=response.status_code)
    except requests.exceptions.RequestException as e:
        return Response({"error": f"Request failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    



from django.http import StreamingHttpResponse
import csv




class service_count(APIView):
    def get(self, request, from_date, to_date, hos_id):
        # get_event_data = agg_hhc_event_plan_of_care.objects.filter(hosp_id = hosp_id, eve_id__added_date__range=(from_date,to_date),eve_id__status = 1, status = 1)
        get_session = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_poc_id__hosp_id = hos_id, actual_StartDate_Time__range = (from_date,to_date),eve_id__event_status=2 or 3, eve_id__status = 1, eve_poc_id__status = 1, status = 1)
        sub_service_wise_professional_services = []
        for index, i in enumerate(get_session, start=1):
            data = {
                "sr_no":index,
                "patient_name":i.eve_id.agg_sp_pt_id.name,
                "service_name":i.eve_poc_id.srv_id.service_title,
                "sub_service_name":i.eve_poc_id.sub_srv_id.recommomded_service,
                "service_time": i.start_time,
                "start_date":i.actual_StartDate_Time,
                "end_date":i.actual_EndDate_Time,
                "professional_name":i.srv_prof_id.prof_fullname
            }
            sub_service_wise_professional_services.append(data)
        # return Response({'data':sub_service_wise_professional_services})
        csv_data = self.serialize_to_csv(sub_service_wise_professional_services)
        response = StreamingHttpResponse(csv_data, content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="Accout_invoice.csv"'
        return response

    def serialize_to_csv(self, data):
        header = ['sr_no', 'patient_name','service_name','sub_service_name','service_time','start_date','end_date','professional_name']  # Add other fields here #  CSV file header name of table fields names 
        # Initialize the CSV writer
        csv_stream = (self.generate_csv_row(header, data_row) for data_row in data)
        # Yield header
        yield ','.join(header) + '\n'
        # Yield data
        for row in csv_stream:
            yield row + '\n'

    def generate_csv_row(self, header, data_row):
        # used to Generate a row of CSV data based on the serializer data
        row = []
        for field in header:
            print("record",field)
            if (',' in str(data_row.get(field, ''))):
                string_data=str(data_row.get(field, ''))
                string_data = string_data.replace(',', '')
                row.append(string_data)#str(data_row.get(field, ''))
            else:
                row.append(str(data_row.get(field, '')))
        return ','.join(row)


#==================QR code ===============================================

#==================QR code ===============================================
# create_QR_CODE


import requests
from urllib.parse import quote
from rest_framework.decorators import api_view
from rest_framework.response import Response
from io import BytesIO
import qrcode
import base64
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

# Ensure your model imports are correct
# from .models import agg_hhc_cashfree_online_payment, agg_hhc_events

@csrf_exempt
@api_view(['POST'])
def create_QR_CODE(request):
    url = "https://api.cashfree.com/api/v1/order/create"

    # Auto-generate the order ID date-wise
    order_id = "order_id_SPERO" + timezone.now().strftime("%d%m%Y%H%M%S")
    phone_no = request.data['customerPhone'][-10:]
    amount = request.data['orderAmount']
    name = request.data['customerName']
    email = request.data['customeremail']
    remaining = request.data['Remaining_amount']

    eve_id = request.data.get('eve_id')
    mode = 3
    total_amount = request.data.get('total_amount')
    payment_status = 3

    payload = {
        "appId": "2045315bd01ed984f26100c6fd135402",
        "secretKey": "5b0b3b4ed9b879b2864796aaf2c320867591e3c4",
        "orderId": order_id,
        "orderAmount": amount,
        "Remainingamount": remaining,
        "orderCurrency": "INR",
        "orderNote": "HII",
        "customerName": name,
        "customeremail": email,
        "customerPhone": phone_no,
        "returnUrl": "https://payments-test.cashfree.com/links/response",
    }

    response = requests.post(url, data=payload)
    d = response.json()

    # Assuming the response contains the payment link
    payment_link = d.get('paymentLink')

    # Generate QR code for the payment link
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(payment_link)
    qr.make(fit=True)
    img = qr.make_image(fill='black', back_color='white')

    # Save QR code image to a bytes buffer
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)

    # Encode the image to base64 for data URL
    img_base64 = base64.b64encode(buffer.getvalue()).decode()
    img_data_url = f"data:image/png;base64,{img_base64}"

    # Send QR code image via WhatsApp
    api_key = "c27d7fa6-292c-4534-8dc4-a0dd28e7d7e3"
    msg = f"Spero Healthcare Innovations Pvt.Ltd is requesting payment of INR {amount}."
    encoded_msg = quote(msg)
    whatsapp_url = f"https://wa.chatmybot.in/gateway/waunofficial/v1/api/v1/sendmessage?access-token={api_key}&phone={phone_no}&content={encoded_msg}&fileName&caption=Scan the QR code to pay&contentType=1"

    try:
        files = {
            'file': ('payment_qr.png', buffer.getvalue(), 'image/png')
        }
        response = requests.post(whatsapp_url, files=files)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error occurred while hitting the URL: {e}")

    # Save payment record to the database
    try:
        event_instance = agg_hhc_events.objects.get(eve_id=eve_id)
        payment_record = agg_hhc_cashfree_online_payment.objects.create(
            order_id=order_id,
            amount_paid=payload['orderAmount'],
            amount_remaining=payload['Remainingamount'],
            Total_cost=total_amount,
            order_currency=payload['orderCurrency'],
            order_note=payload['orderNote'],
            paid_by=payload['customerName'],
            customer_email=payload['customeremail'],
            customer_phone=payload['customerPhone'],
            eve_id=event_instance,
            mode=mode,
            payment_status=payment_status,
        )
    except Exception as e:
        print(f"Error saving payment record: {e}")

    # Return the payment link and QR code data URL in the API response
    data = {
        'payment_link': payment_link,
        'qr_code_data_url': img_data_url,
    }
    return Response(data)




from .models import Payment_mode_enum, payment_status_enum, status_enum
class collectamtprof(APIView):

    def post(self, request, format=None):
        print(';....................')
        clgref_id = get_prof(request)[3]
        eve_id = request.data.get('eve_id')
        print(eve_id)
        pt_dtl = agg_hhc_payment_details.objects.filter(eve_id=eve_id, status=status_enum.Active.value)
        last_record = pt_dtl.last()
        print(last_record)

        if last_record:
            eve_id_value = last_record.eve_id.eve_id if last_record.eve_id else None
            srv_prof_id_value = request.data.get('srv_prof_id')

            try:
                srv_prof_instance = agg_hhc_service_professionals.objects.get(srv_prof_id=srv_prof_id_value)
            except agg_hhc_service_professionals.DoesNotExist:
                raise Http404("Invalid srv_prof_id - object does not exist.")

            data = {
                "eve_id": eve_id_value,
                "srv_prof_id": srv_prof_instance.srv_prof_id if srv_prof_instance else None,
                "Total_cost": last_record.Total_cost,
                "paid_by": last_record.paid_by,
                "amount_paid": last_record.amount_paid,
                "amount_remaining": last_record.amount_remaining,
                # "pay_recived_by": last_record.pay_recived_by,
                "receipt_no": last_record.receipt_no,
                "mode": last_record.mode.value if last_record.mode else None,
                "bank_name": last_record.bank_name,
                "cheque_number": last_record.cheque_number,
                "cheque_status": last_record.cheque_status.value if last_record.cheque_status else None,
                "cheque_date": last_record.cheque_date,
                "card_no": last_record.card_no,
                "transaction_id": last_record.transaction_id,
                "note": last_record.note,
                "order_id": last_record.order_id,
                "order_currency": last_record.order_currency,
                "order_note": last_record.order_note,
                "customer_email": last_record.customer_email,
                "customer_phone": last_record.customer_phone,
                "payment_status": last_record.payment_status.value if last_record.payment_status else None,
                "transaction_status": last_record.transaction_status,
                "overall_status": last_record.overall_status,
                "cf_token": last_record.cf_token,
                "online_payment_by": last_record.online_payment_by.value if last_record.online_payment_by else None,
                "Remark": last_record.Remark,
                "status": last_record.status.value if last_record.status else None,
                "added_by": last_record.added_by,
                "last_modified_by": last_record.last_modified_by
            }
            print(data)
            serializer = collectAmtProfSerializer(data=data)

            if serializer.is_valid():
                serializer.save()

                if request.data['mode'] == Payment_mode_enum.Cheque.value:
                    last_record.cheque_number = request.data.get('cheque_number')
                    last_record.cheque_date = request.data.get('cheque_date')
                    last_record.bank_name = request.data.get('bank_name')
                elif request.data['mode'] == Payment_mode_enum.Card.value:
                    last_record.card_no = request.data.get('card_no')
                    last_record.transaction_id = request.data.get('transaction_id')
                elif request.data['mode'] == Payment_mode_enum.qr_code.value:
                    last_record.transaction_id = request.data.get('transaction_id')

                last_record.Total_cost = request.data.get('Total_cost')
                last_record.paid_by = request.data.get('paid_by')
                last_record.amount_paid = request.data.get('amount_paid')
                last_record.mode = Payment_mode_enum(request.data.get('mode'))
                last_record.Remark = request.data.get('Remark')
                # last_record.pay_recived_by = clgref_id
                last_record.srv_prof_id = srv_prof_instance
                last_record.last_modified_by = clgref_id
                last_record.payment_status = payment_status_enum.Amount_paid_from_Desk
                last_record.payment_to_desk_date=datetime.now().date()
                last_record.save()

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                print("error")
                print(f"Serializer errors: {serializer.errors}")
                return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "No record found"}, status=status.HTTP_404_NOT_FOUND)




from .models import Payment_mode_enum, payment_status_enum, status_enum
class collectamtprof1(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    # def post(self, request, format=None):
    #     clgref_id = get_prof(request)[3]
    #     eve_id = request.data.get('eve_id')
    #     print(eve_id)
    #     pt_dtl = agg_hhc_payment_details.objects.filter(eve_id = eve_id, status = 1)
    #     last_record = pt_dtl.last()
    #     print(last_record)

    #     # "cheque_image":last_record.cheque_image,
        
    #     data = {
    #             "eve_id":int(last_record.eve_id),"srv_prof_id":int(last_record.srv_prof_id),"Total_cost":last_record.Total_cost,"paid_by":last_record.paid_by ,"amount_paid":last_record.amount_paid ,
    #             "amount_remaining":last_record.amount_remaining ,"pay_recived_by":last_record.pay_recived_by,"receipt_no":last_record.receipt_no ,"mode":last_record.mode ,"bank_name":last_record.bank_name,
    #             "cheque_number":last_record.cheque_number,"cheque_status":last_record.cheque_status,"bank_name":last_record.bank_name,"cheque_date":last_record.cheque_date,"card_no":last_record.card_no,"transaction_id":last_record.transaction_id,
    #             "note":last_record.note,"order_id":last_record.order_id ,"order_currency":last_record.order_currency,"order_note":last_record.order_note,
    #             "customer_email":last_record.customer_email,"customer_phone":last_record.customer_phone,"payment_status":last_record.payment_status,"transaction_status":last_record.transaction_status,
    #             "overall_status":last_record.overall_status,"cf_token":last_record.cf_token,"online_payment_by":last_record.online_payment_by,"Remark":last_record.Remark,"status":last_record.status,
    #             "added_by":last_record.added_by,"last_modified_by":last_record.last_modified_by
    #         }
    #     print(data)
    #     serializer = collectAmtProfSerializer(data=data)
    #     # elif request.data['mode'] == 2:
    #     #     serializer = collectAmtProfchequeSerializer(data=request.data)
    #     # elif request.data['mode'] == 4:
    #     #     serializer = collectAmtProfcardSerializer(data=request.data)
    #     # elif request.data['mode'] == 5:
    #     #     serializer = collectAmtProfQRSerializer(data=request.data)
    #     # ['eve_id', 'Total_cost', 'paid_by', 'amount_paid', 'amount_remaining', 'date','mode', 'Remark', 'pay_recived_by','srv_prof_id', 'last_modified_by','overall_status']
    #     if serializer.is_valid():
    #         serializer.save()
    #         if request.data['mode'] == 2:
    #             last_record.cheque_number = request.data.get('cheque_number')
    #             last_record.cheque_date = request.data.get('cheque_date')
    #             last_record.bank_name = request.data.get('bank_name')
    #         elif request.data['mode'] == 4: 
    #             'card_no','transaction_id',
    #             last_record.card_no = request.data.get('card_no')
    #             last_record.transaction_id = request.data.get('transaction_id')
            
    #         elif request.data['mode'] == 5:
    #             last_record.transaction_id = request.data.get('transaction_id')
            
            

    #         last_record.Total_cost = request.data.get('Total_cost')
    #         last_record.paid_by = request.data.get('paid_by')
    #         last_record.amount_paid = request.data.get('amount_paid')
    #         last_record.mode = request.data.get('mode')
    #         last_record.Remark = request.data.get('Remark')
    #         last_record.pay_recived_by = request.data.get('pay_recived_by')
    #         last_record.srv_prof_id = request.data.get('srv_prof_id')
    #         last_record.last_modified_by = clgref_id
    #         last_record.payment_status = 3
    #         last_record.save()


    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     else:
    #         print("error")
    #         print(f"Serializer errors: {serializer.errors}")
    #         return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    # def post(self, request, format=None):
    #     clgref_id = get_prof(request)[3]
    #     eve_id = request.data.get('eve_id')
    #     print(eve_id)
    #     pt_dtl = agg_hhc_payment_details.objects.filter(eve_id=eve_id, status=status_enum.Active.value)
    #     last_record = pt_dtl.last()
    #     print(last_record)

    #     if last_record:
    #         eve_id_value = last_record.eve_id.eve_id if last_record.eve_id else None
    #         srv_prof_id_value = request.data.get('srv_prof_id')

    #         data = {
    #             "eve_id": eve_id_value,
    #             "srv_prof_id": srv_prof_id_value,
    #             "Total_cost": last_record.Total_cost,
    #             "paid_by": last_record.paid_by,
    #             "amount_paid": last_record.amount_paid,
    #             "amount_remaining": last_record.amount_remaining,
    #             "pay_recived_by": last_record.pay_recived_by,
    #             "receipt_no": last_record.receipt_no,
    #             "mode": last_record.mode.value if last_record.mode else None,
    #             "bank_name": last_record.bank_name,
    #             "cheque_number": last_record.cheque_number,
    #             "cheque_status": last_record.cheque_status.value if last_record.cheque_status else None,
    #             "cheque_date": last_record.cheque_date,
    #             "card_no": last_record.card_no,
    #             "transaction_id": last_record.transaction_id,
    #             "note": last_record.note,
    #             "order_id": last_record.order_id,
    #             "order_currency": last_record.order_currency,
    #             "order_note": last_record.order_note,
    #             "customer_email": last_record.customer_email,
    #             "customer_phone": last_record.customer_phone,
    #             "payment_status": last_record.payment_status.value if last_record.payment_status else None,
    #             "transaction_status": last_record.transaction_status,
    #             "overall_status": last_record.overall_status,
    #             "cf_token": last_record.cf_token,
    #             "online_payment_by": last_record.online_payment_by.value if last_record.online_payment_by else None,
    #             "Remark": last_record.Remark,
    #             "status": last_record.status.value if last_record.status else None,
    #             "added_by": last_record.added_by,
    #             "last_modified_by": last_record.last_modified_by
    #         }
    #         print(data)
    #         serializer = collectAmtProfSerializer(data=data)

    #         if serializer.is_valid():
    #             serializer.save()

    #             if request.data['mode'] == Payment_mode_enum.Cheque.value:
    #                 last_record.cheque_number = request.data.get('cheque_number')
    #                 last_record.cheque_date = request.data.get('cheque_date')
    #                 last_record.bank_name = request.data.get('bank_name')
    #             elif request.data['mode'] == Payment_mode_enum.Card.value:
    #                 last_record.card_no = request.data.get('card_no')
    #                 last_record.transaction_id = request.data.get('transaction_id')
    #             elif request.data['mode'] == Payment_mode_enum.qr_code.value:
    #                 last_record.transaction_id = request.data.get('transaction_id')

    #             last_record.Total_cost = request.data.get('Total_cost')
    #             last_record.paid_by = request.data.get('paid_by')
    #             last_record.amount_paid = request.data.get('amount_paid')
    #             last_record.mode = Payment_mode_enum(request.data.get('mode'))
    #             last_record.Remark = request.data.get('Remark')
    #             last_record.pay_recived_by = request.data.get('pay_recived_by')
    #             last_record.srv_prof_id = srv_prof_id_value
    #             last_record.last_modified_by = clgref_id
    #             last_record.payment_status = payment_status_enum.Amount_paid_from_Desk
    #             last_record.save()

    #             return Response(serializer.data, status=status.HTTP_201_CREATED)
    #         else:
    #             print("error")
    #             print(f"Serializer errors: {serializer.errors}")
    #             return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    #     else:
    #         return Response({"error": "No record found"}, status=status.HTTP_404_NOT_FOUND)


    def post(self, request, format=None):
        print(';....................')
        clgref_id = get_prof(request)[3]
        eve_id = request.data.get('eve_id')
        print(eve_id)
        pt_dtl = agg_hhc_payment_details.objects.filter(eve_id=eve_id, status=status_enum.Active.value)
        last_record = pt_dtl.last()
        print(last_record)

        if last_record:
            eve_id_value = last_record.eve_id.eve_id if last_record.eve_id else None
            srv_prof_id_value = request.data.get('srv_prof_id')

            try:
                srv_prof_instance = agg_hhc_service_professionals.objects.get(srv_prof_id=srv_prof_id_value)
            except agg_hhc_service_professionals.DoesNotExist:
                raise Http404("Invalid srv_prof_id - object does not exist.")

            data = {
                "eve_id": eve_id_value,
                "srv_prof_id": srv_prof_instance.srv_prof_id if srv_prof_instance else None,
                "Total_cost": last_record.Total_cost,
                "paid_by": last_record.paid_by,
                "amount_paid": last_record.amount_paid,
                "amount_remaining": last_record.amount_remaining,
                # "pay_recived_by": last_record.pay_recived_by,
                "receipt_no": last_record.receipt_no,
                "mode": last_record.mode.value if last_record.mode else None,
                "bank_name": last_record.bank_name,
                "cheque_number": last_record.cheque_number,
                "cheque_status": last_record.cheque_status.value if last_record.cheque_status else None,
                "cheque_date": last_record.cheque_date,
                "card_no": last_record.card_no,
                "transaction_id": last_record.transaction_id,
                "note": last_record.note,
                "order_id": last_record.order_id,
                "order_currency": last_record.order_currency,
                "order_note": last_record.order_note,
                "customer_email": last_record.customer_email,
                "customer_phone": last_record.customer_phone,
                "payment_status": last_record.payment_status.value if last_record.payment_status else None,
                "transaction_status": last_record.transaction_status,
                "overall_status": last_record.overall_status,
                "cf_token": last_record.cf_token,
                "online_payment_by": last_record.online_payment_by.value if last_record.online_payment_by else None,
                "Remark": last_record.Remark,
                "status": last_record.status.value if last_record.status else None,
                "added_by": last_record.added_by,
                "last_modified_by": last_record.last_modified_by
            }
            print(data)
            serializer = collectAmtProfSerializer(data=data)

            if serializer.is_valid():
                serializer.save()

                if request.data['mode'] == Payment_mode_enum.Cheque.value:
                    last_record.cheque_number = request.data.get('cheque_number')
                    last_record.cheque_date = request.data.get('cheque_date')
                    last_record.bank_name = request.data.get('bank_name')
                elif request.data['mode'] == Payment_mode_enum.Card.value:
                    last_record.card_no = request.data.get('card_no')
                    last_record.transaction_id = request.data.get('transaction_id')
                elif request.data['mode'] == Payment_mode_enum.qr_code.value:
                    last_record.transaction_id = request.data.get('transaction_id')

                last_record.Total_cost = request.data.get('Total_cost')
                last_record.paid_by = request.data.get('paid_by')
                last_record.amount_paid = request.data.get('amount_paid')
                last_record.mode = Payment_mode_enum(request.data.get('mode'))
                last_record.Remark = request.data.get('Remark')
                # last_record.pay_recived_by = clgref_id
                last_record.srv_prof_id = srv_prof_instance
                last_record.last_modified_by = clgref_id
                last_record.payment_status = payment_status_enum.Amount_paid_from_Desk
                last_record.save()

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                print("error")
                print(f"Serializer errors: {serializer.errors}")
                return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "No record found"}, status=status.HTTP_404_NOT_FOUND)

class hospital_dashboard_srv_count(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, hosp_id, id):
        # clg=agg_com_colleague.objects.filter(clg_ref_id=clg_id, is_active=True).last()
        # print(clg.clg_hos_id.hospital_name)
        if  id==1:
            start_datetime=datetime.now().date()
            end_datetime=datetime.now().date()
        elif id==2:
            start_datetime=datetime.now().date() - timedelta(days=7)
            end_datetime=datetime.now().date()
        elif id==3:
            start_datetime=datetime.now().date() - timedelta(days=30)
            end_datetime=datetime.now().date() 
        else:return Response({'error':'please select correct id'})
        # print(s_date)
        # eve_poc=agg_hhc_event_plan_of_care.objects.filter((Q(start_date__gte=s_date) | Q(end_date__lte=e_date)),hosp_id=clg.clg_hos_id, status=1).values_list('eve_poc_id')
        # d=[j[0] for j in eve_poc]
        # # d1=[j[1] for j in eve_poc] 
        # print(d)
        # # for i in d:
        # #     print(i)
        # dt_eve=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_poc_id__in=d,status=1)
        # print(dt_eve)

        try:
            today_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__range=(start_datetime, end_datetime),eve_poc_id__hosp_id=hosp_id, status=1).count()
            on_going = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__range=(start_datetime, end_datetime),eve_poc_id__hosp_id=hosp_id, status=1, Session_jobclosure_status = 2, eve_id__event_status = 2).count()
            completed_Services = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__range=(start_datetime, end_datetime),eve_poc_id__hosp_id=hosp_id, status=1, Session_jobclosure_status = 1).count()
            Pending = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__range=(start_datetime, end_datetime),eve_poc_id__hosp_id=hosp_id, status=1, eve_id__event_status = 1).count()


            response_data = {
                    "Total_services": today_data,
                    "Completed_services": {
                        "completed_srv": completed_Services
                    },
                    "Pending_services": {
                        "Pending_srv": Pending
                    },
                    "ongoing_services": {
                        "Ongoing_srv": on_going
                    }
                }

            return Response(response_data)
        except:
            return Response({'error':'something went wrong'})

class hospital_dashboard_enquiry_count(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, hosp_id, id):
        # clg=agg_com_colleague.objects.filter(clg_ref_id=clg_id, is_active=True).last()
        # print(clg.clg_hos_id.hospital_name)
        if  id==1:
            start_datetime=datetime.now().date()
        elif id==2:
            start_datetime=datetime.now().date() - timedelta(days=7)
        elif id==3:
            start_datetime=datetime.now().date() - timedelta(days=30)

        enquiry = agg_hhc_event_plan_of_care.objects.filter(eve_id__added_date__gte=start_datetime,hosp_id=hosp_id,status=1,eve_id__enq_spero_srv_status=3)
        # print(enquiry[0].eve_id.added_date)
        App = 0
        Social = 0
        Calls = 0
        Walk_in = 0
        for i in enquiry:
            # caller_id = agg_hhc_events.objects.filter(pt_id=i.pt_id).first()
            if i.eve_id.patient_service_status == 1:
                App += 1
            elif i.eve_id.patient_service_status == 2:
                Social += 1
            elif i.eve_id.patient_service_status == 3:
                Walk_in += 1
            elif i.eve_id.patient_service_status == 4:
                Calls += 1
        # print()
        return Response({'Total_enquiries': enquiry.count(),'App': App,'Social': Social,'Calls': Calls,'Walk_in': Walk_in})
    
class hospital_dashboard_enquiry_follow_up_count(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated] 
    def get(self, request, hosp_id, id):
        # clg=agg_com_colleague.objects.filter(clg_ref_id=clg_id, is_active=True).last()
        if  id==1:
            start_datetime=datetime.now().date()
        elif id==2:
            start_datetime=datetime.now().date() - timedelta(days=7)
        elif id==3:
            start_datetime=datetime.now().date() - timedelta(days=30)
        # enq = agg_hhc_enquiry_follow_up.objects.filter(follow_up__in=[1,3,4], status=1)
        enq = agg_hhc_event_plan_of_care.objects.filter(eve_id__added_date__gte=start_datetime,hosp_id=hosp_id,eve_id__enq_spero_srv_status=3,status=1).count()
        conv_enq = agg_hhc_event_plan_of_care.objects.filter(eve_id__added_date__gte=start_datetime,hosp_id=hosp_id,eve_id__enq_spero_srv_status=1,status=1).count()
        result={
            "enquiry_converted":conv_enq,
            "enquiry_in_follow_up":enq
        }
        return Response(result)
    
class hospital_dashboard_service_details(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated] 
    def get(self, request, hosp_id, id):
        # clg=agg_com_colleague.objects.filter(clg_ref_id=clg_id, is_active=True).last()

        if  id==1:
            start_datetime=datetime.now().date()
            end_datetime=datetime.now().date()
        elif id==2:
            start_datetime=datetime.now().date() - timedelta(days=7)
            end_datetime=datetime.now().date()
        elif id==3:
            start_datetime=datetime.now().date() - timedelta(days=30)
            end_datetime=datetime.now().date() 
        else:return Response({'error':'please select correct id'})

        # srv = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__range=(start_datetime, end_datetime),eve_poc_id__hosp_id=hosp_id,eve_id__enq_spero_srv_status__in=[1,2],status=1).values('eve_id__agg_sp_pt_id__name', 'eve_poc_id__srv_id__service_title','eve_poc_id__sub_srv_id__recommomded_service','eve_poc_id__start_date', 'eve_poc_id__end_date', 'eve_poc_id__start_time','eve_poc_id__end_time').order_by('eve_poc_id')

        srv = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__range=(start_datetime, end_datetime),eve_poc_id__hosp_id=hosp_id,eve_id__enq_spero_srv_status__in=[1,2],status=1,srv_prof_id__isnull=False).values(('eve_poc_id'),patient_name=F('eve_id__agg_sp_pt_id__name'),service_name=F('eve_poc_id__srv_id__service_title'),sub_service_name=F('eve_poc_id__sub_srv_id__recommomded_service'),s_start_date=F('eve_poc_id__start_date'),s_end_date=F('eve_poc_id__end_date'),s_start_time=F('eve_poc_id__start_time'),s_end_time=F('eve_poc_id__end_time')).order_by('eve_poc_id').distinct()
        # data1=DashboardSerializer(srv,many=True)
        print(srv)
        data = []
        for item in srv:
            record = {
                'eve_poc_id': item['eve_poc_id'],
                'patient_name': str(item['patient_name']),  # Cast datetime to string
                'service_name': item['service_name'],
                'sub_service_name': item['sub_service_name'],
                's_start_date': str(item['s_start_date']),  # Cast datetime to string
                's_end_date': str(item['s_end_date']),      # Cast datetime to string
                's_start_time': str(item['s_start_time']),  # Cast datetime to string
                's_end_time': str(item['s_end_time']),      # Cast datetime to string
            }
            data.append(record)
        print(data)
        # d=list(set([i['eve_poc_id'] for i in srv]))
        # d1=[i['eve_id__agg_sp_pt_id__name'] for i in srv]
        # plan=agg_hhc_event_plan_of_care.objects.filter(eve_poc_id__in=d, status=1).order_by('eve_poc_id')
        # result={}
        # for i in range(0,len(plan)+1):
        #     data= {
        #         "patient_name":d[i],
        #         "service":plan[i],
        #         "sub_service":plan[i],
        #         "start_date":plan[i],
        #         "end_date":plan[i]
        #     }
        #     result.['data']
        # print(result)
        # print(d1) 

        # return Response(srv)
        # serialized_data = list(srv)

        # Serialize the data to JSON
        # json_data = DjangoJSONEncoder().encode(serialized_data)

        # Return the response
        return Response(data)
    
    
#================ professional count================================

class CountProfessionals(APIView):
    def get(self, request, format=None):
        try:
            # Count the professionals with status 1
            professional_count = agg_hhc_service_professionals.objects.filter(status=1, prof_registered=True, prof_interviewed=True, prof_doc_verified=True, professinal_status=4).count()
            return Response({'count': professional_count}, status=status.HTTP_200_OK)
        except agg_hhc_service_professionals.DoesNotExist:
            return Response({"error": "Professionals do not exist"}, status=status.HTTP_404_NOT_FOUND)


#=================== professional Present \\ absent\\ week-of  Count==========================
import calendar

class CountProfessionalsAttendanceStatus(APIView):
    def get(self, request, format=None):
        try:
            # Get today's date
            today = timezone.now().date()

            # Get the start of the current month
            month_start_date = today.replace(day=1)
            
            last_day = calendar.monthrange(today.year, today.month)[1]
            month_end_date = today.replace(day=last_day)

            # Count for today
            professional_A_count_today = agg_hhc_attendance.objects.filter(attnd_status='Absent', attnd_date__date=today).count()
            professional_P_count_today = agg_hhc_attendance.objects.filter(attnd_status='Present', attnd_date__date=today).count()
            professional_WO_count_today = agg_hhc_attendance.objects.filter(attnd_status='Week Off', attnd_date__date=today).count()

            # Count for the current month
            professional_A_count_month = agg_hhc_attendance.objects.filter(attnd_status='Absent', attnd_date__date__gte=month_start_date, attnd_date__date__lte=month_end_date).count()
            professional_P_count_month = agg_hhc_attendance.objects.filter(attnd_status='Present', attnd_date__date__gte=month_start_date, attnd_date__date__lte=month_end_date).count()
            professional_WO_count_month = agg_hhc_attendance.objects.filter(attnd_status='Week Off', attnd_date__date__gte=month_start_date, attnd_date__date__lte=month_end_date).count()

            return Response({
                'professional_A_count_today': professional_A_count_today,
                'professional_P_count_today': professional_P_count_today,
                'professional_WO_count_today': professional_WO_count_today,
                'professional_A_count_month': professional_A_count_month,
                'professional_P_count_month': professional_P_count_month,
                'professional_WO_count_month': professional_WO_count_month
            }, status=status.HTTP_200_OK)

        except agg_hhc_attendance.DoesNotExist:
            return Response({"error": "Attendance records do not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        
#=============== deallocate and save attendance =======================================

from django.db.models import F

class Deallocate_AggHHCAttendanceAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    # def post(self, request, *args, **kwargs):
    #     attendance_serializer = Deallocate_and_POST_AggHHCAttendanceSerializer(data=request.data)
    #     if attendance_serializer.is_valid():
    #         attendance_record = attendance_serializer.save()

    #         # Create data for the cancellation and reschedule request
    #         cancellation_data = {
    #             'eve_id': request.data.get('eve_id'),
    #             'epoc_id': request.data.get('epoc_id'),
    #             'dtl_eve_id': request.data.get('dtl_eve_id'),
    #             'is_canceled': 2,
    #             'is_srv_sesn': 3,
    #             'is_reschedule': 1,
    #             'reschedule_date': attendance_record.attnd_date,
    #             'req_resson': 'urgent leave',
    #             'remark': 'Apply for professional resqudule',
    #             'professional_request_status': 3,
    #             'atten_id': attendance_record.att_id,
    #             'req_rejection_remark': 'urgent leave',
    #             'is_deleted': 2,
    #             'added_by': request.data.get('added_by'),
    #             'last_modified_by': request.data.get('added_by'),
    #         }
            

    #         cancellation_serializer = AggHHCCancellationAndRescheduleRequestSerializer(data=cancellation_data)
    #         if cancellation_serializer.is_valid():
    #             cancellation_serializer.save()
    #         else:
    #             return Response(cancellation_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    #         return Response(attendance_serializer.data, status=status.HTTP_201_CREATED)

    #     return Response(attendance_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request, *args, **kwargs):
        if not isinstance(request.data, list):
            return Response({"error": "Expected a list of objects"}, status=status.HTTP_400_BAD_REQUEST)

        first_object = request.data[0]  # Assuming the attendance record should be created based on the first object
        attendance_serializer = Deallocate_and_POST_AggHHCAttendanceSerializer(data=first_object)
        
        if attendance_serializer.is_valid():
            attendance_record = attendance_serializer.save()
            
            print(request.data, 'isdijiwdkj')

            for obj in request.data:
                cancellation_data = {
                    'eve_id': obj.get('eve_id'),
                    'epoc_id': obj.get('eve_poc_id'),
                    'dtl_eve_id': obj.get('dt_eve_poc_id'),
                    'is_canceled': 2,
                    'is_srv_sesn': 3,
                    'is_reschedule': 1,
                    'reschedule_date': attendance_record.attnd_date,
                    'req_resson': 'urgent leave',
                    'remark': 'Apply for professional reschedule',
                    'professional_request_status': 3,
                    'atten_id': attendance_record.att_id,
                    'req_rejection_remark': 'urgent leave',
                    'is_deleted': 2,
                    'added_by': obj.get('added_by', first_object.get('added_by')),
                    'last_modified_by': obj.get('added_by', first_object.get('added_by')),
                }

                cancellation_serializer = AggHHCCancellationAndRescheduleRequestSerializer(data=cancellation_data)
                if cancellation_serializer.is_valid():
                    cancellation_serializer.save()
                else:
                    return Response(cancellation_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response(attendance_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(attendance_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#============================================Update saved details================================

class UpdateAggHHCAttendanceAPIView(APIView):
    def put(self, request, format=None):
        try:
            # Get the att_id from query params
            att_id = request.query_params.get("att_id")
            if not att_id:
                return Response({"error": "att_id query parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Try to get the instance to update
            try:
                instance = agg_hhc_attendance.objects.get(att_id=att_id)
            except agg_hhc_attendance.DoesNotExist:
                return Response({"error": "Attendance record does not exist for att_id: " + str(att_id)}, status=status.HTTP_404_NOT_FOUND)
            
            # Serialize the updated data
            serializer = Put_AggHHCAttendanceSerializer(instance, data=request.data)
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Something went wrong','msg': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class get_payment_with_prof_eve_detail(APIView):
    def get(self,request, eve_id):
        event=agg_hhc_events.objects.filter(eve_id=eve_id, status=1).last()
        # payment_dt= agg_hhc_payment_details.objects.filter(eve_id=event).last().srv_prof_id.prof_fullname
        payment_dt = getattr(agg_hhc_payment_details.objects.filter(eve_id=event, status=1, overall_status='SUCCESS').last(), 'pay_recived_by', None)
        prof_id=agg_hhc_service_professionals.objects.filter(clg_ref_id=payment_dt, status=1).last()
        prof_id_id = getattr(prof_id, 'srv_prof_id', None)
        prof_name=getattr(prof_id, 'prof_fullname', None)
        # if payment_dt:
        #     payment_dt_Fname=payment_dt.clg_first_name
        #     payment_dt_Mname=payment_dt.clg_mid_name
        #     payment_dt_Lname=payment_dt.clg_last_name
        #     name=None
        #     if payment_dt_Fname:
        #         name=payment_dt_Fname
        #     if payment_dt_Mname:
        #         name=f'{name} {payment_dt_Mname}'
        #     if payment_dt_Lname:
        #         name=f'{name} {payment_dt_Lname}'
        # else:return Response({"pay_recived_by":prof_name, "prof_id":prof_id})
        # print(payment_dt)
        return Response({"pay_recived_by":prof_name, "prof_id":prof_id_id})
    
    
#============================ session count for spero website======================================

class session_count_view(APIView):
    @csrf_exempt
    def post(self, request, *args, **kwargs):
        try:
            # Count the professionals with status 1
            old_count = 249055
            service_count = agg_hhc_detailed_event_plan_of_care.objects.filter(status=1).count()
            total_count = old_count + service_count
            
            # Save the total_count into the service_count_save_for_website table
            service_count_entry = service_count_save_for_website.objects.create(today_session_count=total_count)
            service_count_entry.save()
            
            return Response({"total_count": total_count}, status=status.HTTP_200_OK)

        except agg_hhc_detailed_event_plan_of_care.DoesNotExist:
            return Response({"error": "Data not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class LatestServiceCountView(APIView):
    def get(self, request, format=None):
        latest_record = service_count_save_for_website.objects.order_by('-added_date').first()
        if latest_record:
            serializer = ServiceCountSaveForWebsiteSerializer(latest_record)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'No records found'}, status=status.HTTP_404_NOT_FOUND)
    
class TotalAmountReceivedView(APIView):

    def get(self, request, format=None):
        
        hospital_id = request.GET.get('hosp_id')
        # Current time
        now = timezone.now()
        today = timezone.now().date()
        # Start of the day
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Start of the week (assuming week starts on Monday)
        start_of_week = now - timezone.timedelta(days=now.weekday())
        start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Start of the month
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day = calendar.monthrange(today.year, today.month)[1]
        month_end_date = today.replace(day=last_day)
        first_day_of_current_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day_of_previous_month = first_day_of_current_month - timezone.timedelta(days=1)
        start_of_previous_month = last_day_of_previous_month.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end_of_previous_month = last_day_of_previous_month.replace(hour=23, minute=59, second=59, microsecond=999999)
        
        # Base query
        payment_details = agg_hhc_payment_details.objects.all()
        
        if hospital_id:
            payment_details = payment_details.filter(
                eve_id__in=agg_hhc_event_plan_of_care.objects.filter(hosp_id=hospital_id).values_list('eve_id', flat=True)
            )
        
        # Calculate totals
        total_today = payment_details.filter(date__gte=start_of_day).aggregate(total_amount=Sum('amount_paid'))['total_amount'] or 0
        total_week = payment_details.filter(date__gte=start_of_week).aggregate(total_amount=Sum('amount_paid'))['total_amount'] or 0
        total_month = payment_details.filter(date__range=(start_of_month,month_end_date)).aggregate(total_amount=Sum('amount_paid'))['total_amount'] or 0
        total_till_date = payment_details.filter(date__gte=start_of_previous_month, date__lte=end_of_previous_month).aggregate(total_amount=Sum('amount_paid'))['total_amount'] or 0
        
        return Response({
            'total_amount_received_today': total_today,
            # 'total_amount_received_week': total_week,
            'total_amount_received_month': total_month,
            'total_amount_received_tll_date': total_till_date
        }, status=status.HTTP_200_OK)
        
        
        
class PendingAmountReceivedView(APIView):

    def get(self, request, format=None):
        
        hospital_id = request.GET.get('hosp_id')
        # Current time
        now = timezone.now()
        today = timezone.now().date()
        # Start of the day
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Start of the week (assuming week starts on Monday)
        start_of_week = now - timezone.timedelta(days=now.weekday())
        start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Start of the month
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day = calendar.monthrange(today.year, today.month)[1]
        month_end_date = today.replace(day=last_day)
        first_day_of_current_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day_of_previous_month = first_day_of_current_month - timezone.timedelta(days=1)
        start_of_previous_month = last_day_of_previous_month.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end_of_previous_month = last_day_of_previous_month.replace(hour=23, minute=59, second=59, microsecond=999999)
        
        # Base query
        payment_details = agg_hhc_payment_details.objects.all()
        
        if hospital_id:
            payment_details = payment_details.filter(
                eve_id__in=agg_hhc_event_plan_of_care.objects.filter(hosp_id=hospital_id).values_list('eve_id', flat=True)
            )
        
        # Calculate totals
        total_today = payment_details.filter(date__gte=start_of_day, payment_status=1).aggregate(total_amount=Sum('amount_paid'))['total_amount'] or 0
        total_week = payment_details.filter(date__gte=start_of_week, payment_status=1).aggregate(total_amount=Sum('amount_paid'))['total_amount'] or 0
        total_month = payment_details.filter(date__range=(start_of_month,month_end_date)).aggregate(total_amount=Sum('amount_paid'))['total_amount'] or 0
        total_till_date = payment_details.filter(date__gte=start_of_previous_month, date__lte=end_of_previous_month, payment_status=1).aggregate(total_amount=Sum('amount_paid'))['total_amount'] or 0
        
        return Response({
            'total_amount_received_today': total_today,
            # 'total_amount_received_week': total_week,
            'total_amount_received_month': total_month,
            'total_amount_received_tll_date': total_till_date
        }, status=status.HTTP_200_OK)
    
class get_event_dates(APIView):
    def get(self, request, eve_id):
        c_dates=sorted([i.actual_StartDate_Time for i in agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=eve_id, status=1)])
        # d=[]
        # dd=[]
        # for i in c_dates:
        #     if not d:
        #         d.append(i)
        #     else:
        #         if d[-1] == i - timedelta(days=1):
        #             d.append(i)
        #         else:
        #             dd.append(d)
        #             d = [i]
        # if d:
        #     dd.append(d)
        # d1 = [f'{i[0]},{i[-1]}' for i in dd]
        # result = [d1]
        # print(result)
        return Response({'dates':c_dates})
    
class get_service_details(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated] 
    def get(self, request, eve_id):
        event=agg_hhc_events.objects.filter(eve_id=eve_id, status=1).last()
        if event:
            details=GetEventDetailsSetializer(event)
        else: return Response({'status':'event does not exist'})
        return Response({"data":details.data})
    
    
    
    
#============================ unpaid ammount conunt ======================================

class CalculateUNpaidAmount(APIView):
    def get(self, request, *args, **kwargs):
        
        hospital_id = request.GET.get('hosp_id')
        # Current time
        now = timezone.now()
        today = timezone.now().date()
        # Start of the day
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        last_day = calendar.monthrange(today.year, today.month)[1]
        month_end_date = today.replace(day=last_day)
        # Start of the week (assuming week starts on Monday)
        start_of_week = now - timezone.timedelta(days=now.weekday())
        start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Start of the month
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        first_day_of_current_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day_of_previous_month = first_day_of_current_month - timezone.timedelta(days=1)
        start_of_previous_month = last_day_of_previous_month.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end_of_previous_month = last_day_of_previous_month.replace(hour=23, minute=59, second=59, microsecond=999999)
        
        # Get all event ids that are in the payment details table
        paid_event_ids = agg_hhc_payment_details.objects.values_list('eve_id', flat=True)
        
        all_event = agg_hhc_events.objects.filter(status=1)
        
        if hospital_id:
            all_event = all_event.filter(
                eve_id__in=agg_hhc_event_plan_of_care.objects.filter(hosp_id=hospital_id).values_list('eve_id', flat=True)
            )

        # Filter out these event ids from the events table and sum the final_amount
        # total_amount1 = all_event.filter(event_date__gte=start_of_day, status=1).exclude(eve_id__in=paid_event_ids).aggregate(Sum('final_amount'))['final_amount__sum'] or 0
        # total_amount2 = all_event.filter(event_date__gte=start_of_week, status=1).exclude(eve_id__in=paid_event_ids).aggregate(Sum('final_amount'))['final_amount__sum'] or 0
        # total_amount3 = all_event.filter(event_date__gte=start_of_month, status=1).exclude(eve_id__in=paid_event_ids).aggregate(Sum('final_amount'))['final_amount__sum'] or 0
        # total_amount4 = all_event.filter(status=1).exclude(eve_id__in=paid_event_ids).aggregate(Sum('final_amount'))['final_amount__sum'] or 0
        total_amount1 = all_event.filter(
            eve_id__in=agg_hhc_event_plan_of_care.objects.filter(start_date__gte=start_of_day).values_list('eve_id', flat=True),
            status=1
        ).exclude(eve_id__in=paid_event_ids).aggregate(Sum('final_amount'))['final_amount__sum'] or 0

        total_amount2 = all_event.filter(
            eve_id__in=agg_hhc_event_plan_of_care.objects.filter(start_date__gte=start_of_week).values_list('eve_id', flat=True),
            status=1
        ).exclude(eve_id__in=paid_event_ids).aggregate(Sum('final_amount'))['final_amount__sum'] or 0

        total_amount3 = all_event.filter(
            eve_id__in=agg_hhc_event_plan_of_care.objects.filter(start_date__range=(start_of_month, month_end_date)).values_list('eve_id', flat=True),
            status=1
        ).exclude(eve_id__in=paid_event_ids).aggregate(Sum('final_amount'))['final_amount__sum'] or 0

        total_amount4 = all_event.filter(
            eve_id__in=agg_hhc_event_plan_of_care.objects.filter(start_date__gte=start_of_previous_month, start_date__lte=end_of_previous_month).values_list('eve_id', flat=True),
            status=1
        ).exclude(eve_id__in=paid_event_ids).aggregate(Sum('final_amount'))['final_amount__sum'] or 0


        return Response({
            'total_Unpaid_amount_today': total_amount1,
            # 'total_Unpaid_amount_week': total_amount2,
            'total_Unpaid_amount_month': total_amount3,
            'total_Unpaid_amount_last_month':total_amount4
        }, status=status.HTTP_200_OK)
        
        
        
#============================ dashboard ======================================

#===================================== Totral enquiry count===========================

class Calculate_Total_enquiry(APIView):
    def get(self, request, *args, **kwargs):
        now = timezone.now()
        today = timezone.now().date()
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        start_of_week = now - timezone.timedelta(days=now.weekday())
        start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
        last_day = calendar.monthrange(today.year, today.month)[1]
        month_end_date = today.replace(day=last_day)
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)    
        first_day_of_current_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day_of_previous_month = first_day_of_current_month - timezone.timedelta(days=1)
        start_of_previous_month = last_day_of_previous_month.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end_of_previous_month = last_day_of_previous_month.replace(hour=23, minute=59, second=59, microsecond=999999)
        
# ----------------- Last month
        ls_all_event = agg_hhc_enquiry_follow_up.objects.filter(last_modified_date__range=(start_of_previous_month, end_of_previous_month),follow_up_status=1)
        hospital_id = request.GET.get('hosp_id')
        if hospital_id:
            ls_all_event = ls_all_event.filter(
                event_id__in=agg_hhc_event_plan_of_care.objects.filter(hosp_id=hospital_id).values_list('eve_id', flat=True)
            )
        ls_eve_ids = ls_all_event.values_list('event_id', flat=True)
        ls_all_eves = list(set(ls_eve_ids))
        ls_enq_id = []
        for i in ls_all_eves:
            ls_get_enq = ls_all_event.filter(event_id=i).order_by('last_modified_date').last()
            ls_enq_id.append(ls_get_enq.enq_follow_up_id)
        ls_all_follow_up_enq = ls_all_event.filter(enq_follow_up_id__in=ls_enq_id)

# ------------------ This month

        ts_all_event = agg_hhc_enquiry_follow_up.objects.filter(last_modified_date__range=(start_of_month,month_end_date),follow_up_status=1)
        if hospital_id:
            ls_all_event = ls_all_event.filter(
                event_id__in=agg_hhc_event_plan_of_care.objects.filter(hosp_id=hospital_id).values_list('eve_id', flat=True)
            )
        ts_eve_ids = ts_all_event.values_list('event_id', flat=True)
        ts_all_eves = list(set(ts_eve_ids))
        ts_enq_id = []
        for i in ts_all_eves:
            ts_get_enq = ts_all_event.filter(event_id=i).order_by('last_modified_date').last()
            ts_enq_id.append(ts_get_enq.enq_follow_up_id)
        ts_all_follow_up_enq = ts_all_event.filter(enq_follow_up_id__in=ts_enq_id)


# ----------------- today
    
        td_all_event = agg_hhc_enquiry_follow_up.objects.filter(last_modified_date__gte=start_of_day,follow_up_status=1)
        if hospital_id:
            ls_all_event = ls_all_event.filter(
                event_id__in=agg_hhc_event_plan_of_care.objects.filter(hosp_id=hospital_id).values_list('eve_id', flat=True)
            )
        td_eve_ids = td_all_event.values_list('event_id', flat=True)
        td_all_eves = list(set(td_eve_ids))
        td_enq_id = []
        for i in td_all_eves:
            td_get_enq = td_all_event.filter(event_id=i).order_by('last_modified_date').last()
            td_enq_id.append(td_get_enq.enq_follow_up_id)
        td_all_follow_up_enq = td_all_event.filter(enq_follow_up_id__in=td_enq_id)

    
        return Response({
            'total_enq_today': td_all_follow_up_enq.count(),
            'total_enq_week': 0,
            'total_enq_month': ts_all_follow_up_enq.count(),
            'total_enq_till_date': ls_all_follow_up_enq.count()
        }, status=status.HTTP_200_OK)
    
#================================== Total infollow up count ==========================================

class Calculate_infollow_up_service(APIView):
    def get(self, request, *args, **kwargs):
        hospital_id = request.GET.get('hosp_id')
        now = timezone.now()
        today = timezone.now().date()
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        start_of_week = now - timezone.timedelta(days=now.weekday())
        start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
        last_day = calendar.monthrange(today.year, today.month)[1]
        month_end_date = today.replace(day=last_day)
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        first_day_of_current_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day_of_previous_month = first_day_of_current_month - timezone.timedelta(days=1)
        start_of_previous_month = last_day_of_previous_month.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end_of_previous_month = last_day_of_previous_month.replace(hour=23, minute=59, second=59, microsecond=999999)
        

# ----------------- Last month
        ls_all_event = agg_hhc_enquiry_follow_up.objects.filter(last_modified_date__range=(start_of_previous_month, end_of_previous_month),follow_up_status=1)
        hospital_id = request.GET.get('hosp_id')
        if hospital_id:
            ls_all_event = ls_all_event.filter(
                event_id__in=agg_hhc_event_plan_of_care.objects.filter(hosp_id=hospital_id).values_list('eve_id', flat=True)
            )
        ls_eve_ids = ls_all_event.values_list('event_id', flat=True)
        ls_all_eves = list(set(ls_eve_ids))
        ls_enq_id = []
        for i in ls_all_eves:
            ls_get_enq = ls_all_event.filter(event_id=i).order_by('last_modified_date').last()
            ls_enq_id.append(ls_get_enq.enq_follow_up_id)
        ls_all_follow_up_enq = ls_all_event.filter(enq_follow_up_id__in=ls_enq_id)

        ls_one = ls_all_follow_up_enq.filter(follow_up=1)
# ------------------ This month

        ts_all_event = agg_hhc_enquiry_follow_up.objects.filter(last_modified_date__range=(start_of_month,month_end_date),follow_up_status=1)
        if hospital_id:
            ls_all_event = ls_all_event.filter(
                event_id__in=agg_hhc_event_plan_of_care.objects.filter(hosp_id=hospital_id).values_list('eve_id', flat=True)
            )
        ts_eve_ids = ts_all_event.values_list('event_id', flat=True)
        ts_all_eves = list(set(ts_eve_ids))
        ts_enq_id = []
        for i in ts_all_eves:
            ts_get_enq = ts_all_event.filter(event_id=i).order_by('last_modified_date').last()
            ts_enq_id.append(ts_get_enq.enq_follow_up_id)
        ts_all_follow_up_enq = ts_all_event.filter(enq_follow_up_id__in=ts_enq_id)

        ts_one = ts_all_follow_up_enq.filter(follow_up=1)

# ----------------- today
    
        td_all_event = agg_hhc_enquiry_follow_up.objects.filter(last_modified_date__gte=start_of_day,follow_up_status=1)
        if hospital_id:
            ls_all_event = ls_all_event.filter(
                event_id__in=agg_hhc_event_plan_of_care.objects.filter(hosp_id=hospital_id).values_list('eve_id', flat=True)
            )
        td_eve_ids = td_all_event.values_list('event_id', flat=True)
        td_all_eves = list(set(td_eve_ids))
        td_enq_id = []
        for i in td_all_eves:
            td_get_enq = td_all_event.filter(event_id=i).order_by('last_modified_date').last()
            td_enq_id.append(td_get_enq.enq_follow_up_id)
        td_all_follow_up_enq = td_all_event.filter(enq_follow_up_id__in=td_enq_id)
        td_one = td_all_follow_up_enq.filter(follow_up=1)

        return Response({
            'total_follow_today': td_one.count(),
            'total_follow_week': 0,
            'total_follow_month': ts_one.count(),
            'total_follow_tll_date': ls_one.count()
        }, status=status.HTTP_200_OK)

        
#========================== Total cancelled enq ==============================

class Calculate_cancelled_service(APIView):
    def get(self, request, *args, **kwargs):   
        hospital_id = request.GET.get('hosp_id')
        now = timezone.now()
        today = timezone.now().date()
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        start_of_week = now - timezone.timedelta(days=now.weekday())
        start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
        last_day = calendar.monthrange(today.year, today.month)[1]
        month_end_date = today.replace(day=last_day)
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        first_day_of_current_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day_of_previous_month = first_day_of_current_month - timezone.timedelta(days=1)
        start_of_previous_month = last_day_of_previous_month.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end_of_previous_month = last_day_of_previous_month.replace(hour=23, minute=59, second=59, microsecond=999999)
        ls_all_event = agg_hhc_enquiry_follow_up.objects.filter(last_modified_date__range=(start_of_previous_month, end_of_previous_month),follow_up_status=1)
        hospital_id = request.GET.get('hosp_id')
        if hospital_id:
            ls_all_event = ls_all_event.filter(
                event_id__in=agg_hhc_event_plan_of_care.objects.filter(hosp_id=hospital_id).values_list('eve_id', flat=True)
            )
        ls_eve_ids = ls_all_event.values_list('event_id', flat=True)
        ls_all_eves = list(set(ls_eve_ids))
        ls_enq_id = []
        for i in ls_all_eves:
            ls_get_enq = ls_all_event.filter(event_id=i).order_by('last_modified_date').last()
            ls_enq_id.append(ls_get_enq.enq_follow_up_id)
        ls_all_follow_up_enq = ls_all_event.filter(enq_follow_up_id__in=ls_enq_id)

      
        ls_two = ls_all_follow_up_enq.filter(follow_up=2)
# ------------------ This month

        ts_all_event = agg_hhc_enquiry_follow_up.objects.filter(last_modified_date__range=(start_of_month,month_end_date),follow_up_status=1)
        if hospital_id:
            ls_all_event = ls_all_event.filter(
                event_id__in=agg_hhc_event_plan_of_care.objects.filter(hosp_id=hospital_id).values_list('eve_id', flat=True)
            )
        ts_eve_ids = ts_all_event.values_list('event_id', flat=True)
        ts_all_eves = list(set(ts_eve_ids))
        ts_enq_id = []
        for i in ts_all_eves:
            ts_get_enq = ts_all_event.filter(event_id=i).order_by('last_modified_date').last()
            ts_enq_id.append(ts_get_enq.enq_follow_up_id)
        ts_all_follow_up_enq = ts_all_event.filter(enq_follow_up_id__in=ts_enq_id)

        ts_two = ts_all_follow_up_enq.filter(follow_up=2)
       

# ----------------- today
    
        td_all_event = agg_hhc_enquiry_follow_up.objects.filter(last_modified_date__gte=start_of_day,follow_up_status=1)
        if hospital_id:
            ls_all_event = ls_all_event.filter(
                event_id__in=agg_hhc_event_plan_of_care.objects.filter(hosp_id=hospital_id).values_list('eve_id', flat=True)
            )
        td_eve_ids = td_all_event.values_list('event_id', flat=True)
        td_all_eves = list(set(td_eve_ids))
        td_enq_id = []
        for i in td_all_eves:
            td_get_enq = td_all_event.filter(event_id=i).order_by('last_modified_date').last()
            td_enq_id.append(td_get_enq.enq_follow_up_id)
        td_all_follow_up_enq = td_all_event.filter(enq_follow_up_id__in=td_enq_id)

        td_two = td_all_follow_up_enq.filter(follow_up=2)
    

        return Response({
            'total_cancelled_today': td_two.count(),
            'total_cancelled_week': 0,
            'total_cancelled_month': ts_two.count(),
            'total_cancelled_last_month': ls_two.count()
            
        }, status=status.HTTP_200_OK)


#==================== Total_services__ongoing___pending___Completed ===========================================================



class TotalServicesOngoingPendingCompleted(APIView):
    def get(self, request, *args, **kwargs):
        
        hospital_id = request.GET.get('hosp_id')
        # Current time
        now = timezone.now()
        today = timezone.now().date()
        # Start of the day
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Start of the week (assuming week starts on Monday)
        start_of_week = now - timezone.timedelta(days=now.weekday())
        start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
        last_day = calendar.monthrange(today.year, today.month)[1]
        month_end_date = today.replace(day=last_day)
        # Start of the month
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        print(start_of_month,'start_of_month')
        
        first_day_of_current_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day_of_previous_month = first_day_of_current_month - timezone.timedelta(days=1)
        start_of_previous_month = last_day_of_previous_month.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        print(start_of_previous_month, 'start_of_previous_month')
        # End of the previous month
        end_of_previous_month = last_day_of_previous_month.replace(hour=23, minute=59, second=59, microsecond=999999)
        # Get all event ids that are in the payment details table
        # paid_event_ids = agg_hhc_payment_details.objects.values_list('eve_id', flat=True)
        print(end_of_previous_month,'end_of_previous_month')
        all_event = agg_hhc_detailed_event_plan_of_care.objects.filter(status=1, eve_id__event_status__in=[2,3])
        
        if hospital_id:
            all_event = all_event.filter(
                eve_id__in=agg_hhc_event_plan_of_care.objects.filter(hosp_id=hospital_id).values_list('eve_id', flat=True)
            )

        # Filter out these event ids from the events table and sum the final_amount
        # total_enq1 = all_event.filter(last_modified_date__gte=start_of_day,  follow_up=3)
        # total_enq2 = all_event.filter(last_modified_date__gte=start_of_week,  follow_up=3)
        # total_enq3 = all_event.filter(last_modified_date__gte=start_of_month,  follow_up=3)
        total_services = all_event.filter().count()
        total_services_l = all_event.filter(actual_StartDate_Time__gte=start_of_previous_month, actual_StartDate_Time__lte=start_of_previous_month).count()
        total_services1 = all_event.filter(actual_StartDate_Time=start_of_day).count()
        total_services2 = all_event.filter(actual_StartDate_Time=start_of_week).count()
        total_services3 = all_event.filter(actual_StartDate_Time__range=(start_of_month,month_end_date)).count()

        
        Completed_Session = all_event.filter(actual_StartDate_Time__gte=start_of_previous_month, actual_StartDate_Time__lte=end_of_previous_month,Session_jobclosure_status=1).count()
        Completed_Session1 = all_event.filter(actual_StartDate_Time__gte=start_of_day ,Session_jobclosure_status=1).count()
        Completed_Session2 = all_event.filter(actual_StartDate_Time__gte=start_of_week ,Session_jobclosure_status=1).count()
        Completed_Session3 = all_event.filter(actual_StartDate_Time__range=(start_of_month,month_end_date) ,Session_jobclosure_status=1).count()

        pending_session = all_event.filter(actual_StartDate_Time__gte=start_of_previous_month, actual_StartDate_Time__lte=end_of_previous_month,Session_status=1).exclude(Session_status__in=[8,2,9]).count()
        pending_sessio1 = all_event.filter(actual_StartDate_Time=start_of_day, Session_status=1).exclude(Session_status__in=[8,2,9]).count()
        pending_sessio2 = all_event.filter(actual_StartDate_Time=start_of_week, Session_status=1).exclude(Session_status__in=[8,2,9]).count()
        pending_sessio3 = all_event.filter(actual_StartDate_Time__range=(start_of_month,month_end_date), Session_status=1).exclude(Session_status__in=[8,2,9]).count()


        ongoing_status = all_event.filter(actual_StartDate_Time__gte=start_of_previous_month, actual_StartDate_Time__lte=start_of_previous_month,Session_status__in=[8,2,9]).exclude(Session_jobclosure_status=1).count()
        ongoing_status1 = all_event.filter(actual_StartDate_Time=start_of_day, Session_status__in=[8,2,9]).exclude(Session_jobclosure_status=1).count()
        ongoing_status2 = all_event.filter(actual_StartDate_Time=start_of_week, Session_status__in=[8,2,9]).exclude(Session_jobclosure_status=1).count()
        ongoing_status3 = all_event.filter(actual_StartDate_Time__range=(start_of_month,month_end_date), Session_status__in=[8,2,9]).exclude(Session_jobclosure_status=1).count()




        return Response({
            # 'total_converted_today': total_enq1,
            # 'total_converted_week': total_enq2,
            # 'total_converted_month': total_enq3,
            'total_servces_till_date': total_services,
            'total_service_today': total_services1,
            'total_service_this_month': total_services3,
            'total_service_last_month': total_services_l,
            
            'total_completed_servces_till_date': Completed_Session,
            'total_completed_servces_today': Completed_Session1,
            'total_completed_servces_till_this_week': Completed_Session2,
            'total_completed_servces_this_month': Completed_Session3,
            
            'total_pending_service_till_date': pending_session,
            'total_pending_service_today': pending_sessio1,
            'total_pending_service_this_week': pending_sessio2,
            'total_pending_service_this_month': pending_sessio3,
            
            'total_ongoing_till_date': ongoing_status,
            'total_ongoing_today': ongoing_status1,
            'total_ongoing_this_week': ongoing_status2,
            'total_ongoing_this_month': ongoing_status3
            
            
        }, status=status.HTTP_200_OK)



    
#=================================================Total converted count =====================


class Calculate_converted_service(APIView):
    def get(self, request, *args, **kwargs):
        now = timezone.now()
        today = timezone.now().date()
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        start_of_week = now - timezone.timedelta(days=now.weekday())
        start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
        last_day = calendar.monthrange(today.year, today.month)[1]
        month_end_date = today.replace(day=last_day)
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        first_day_of_current_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day_of_previous_month = first_day_of_current_month - timezone.timedelta(days=1)
        start_of_previous_month = last_day_of_previous_month.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end_of_previous_month = last_day_of_previous_month.replace(hour=23, minute=59, second=59, microsecond=999999)
        

# ----------------- Last month
        ls_all_event = agg_hhc_enquiry_follow_up.objects.filter(last_modified_date__range=(start_of_previous_month, end_of_previous_month),follow_up_status=1)
        hospital_id = request.GET.get('hosp_id')
        if hospital_id:
            ls_all_event = ls_all_event.filter(
                event_id__in=agg_hhc_event_plan_of_care.objects.filter(hosp_id=hospital_id).values_list('eve_id', flat=True)
            )
        ls_eve_ids = ls_all_event.values_list('event_id', flat=True)
        ls_all_eves = list(set(ls_eve_ids))
        ls_enq_id = []
        for i in ls_all_eves:
            ls_get_enq = ls_all_event.filter(event_id=i).order_by('last_modified_date').last()
            ls_enq_id.append(ls_get_enq.enq_follow_up_id)
        ls_all_follow_up_enq = ls_all_event.filter(enq_follow_up_id__in=ls_enq_id)

        ls_three = ls_all_follow_up_enq.filter(follow_up=3)


       

# ------------------ This month

        ts_all_event = agg_hhc_enquiry_follow_up.objects.filter(last_modified_date__range=(start_of_month,month_end_date),follow_up_status=1)
        if hospital_id:
            ls_all_event = ls_all_event.filter(
                event_id__in=agg_hhc_event_plan_of_care.objects.filter(hosp_id=hospital_id).values_list('eve_id', flat=True)
            )
        ts_eve_ids = ts_all_event.values_list('event_id', flat=True)
        ts_all_eves = list(set(ts_eve_ids))
        ts_enq_id = []
        for i in ts_all_eves:
            ts_get_enq = ts_all_event.filter(event_id=i).order_by('last_modified_date').last()
            ts_enq_id.append(ts_get_enq.enq_follow_up_id)
        ts_all_follow_up_enq = ts_all_event.filter(enq_follow_up_id__in=ts_enq_id)
        ts_three = ts_all_follow_up_enq.filter(follow_up=3)


# ----------------- today
    
        td_all_event = agg_hhc_enquiry_follow_up.objects.filter(last_modified_date__gte=start_of_day,follow_up_status=1)
        if hospital_id:
            ls_all_event = ls_all_event.filter(
                event_id__in=agg_hhc_event_plan_of_care.objects.filter(hosp_id=hospital_id).values_list('eve_id', flat=True)
            )
        td_eve_ids = td_all_event.values_list('event_id', flat=True)
        td_all_eves = list(set(td_eve_ids))
        td_enq_id = []
        for i in td_all_eves:
            td_get_enq = td_all_event.filter(event_id=i).order_by('last_modified_date').last()
            td_enq_id.append(td_get_enq.enq_follow_up_id)
        td_all_follow_up_enq = td_all_event.filter(enq_follow_up_id__in=td_enq_id)

        td_three = td_all_follow_up_enq.filter(follow_up=3)
      
        return Response({
            'total_converted_today': td_three.count(),
            'total_converted_week': 0,
            'total_converted_month': ts_three.count(),
            'total_converted_till_date': ls_three.count()
            
        }, status=status.HTTP_200_OK)


#============ total assin and unassin professional ======================================
from django.utils.timezone import now

class ProfessionalCountView(APIView):
    def get(self, request, *args, **kwargs):
        today = now().date()
        current_time = now()

        start_of_month = current_time.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day = calendar.monthrange(today.year, today.month)[1]
        month_end_date = today.replace(day=last_day)
        
        first_day_of_current_month = current_time.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day_of_previous_month = first_day_of_current_month - timezone.timedelta(days=1)
        start_of_previous_month = last_day_of_previous_month.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end_of_previous_month = last_day_of_previous_month.replace(hour=23, minute=59, second=59, microsecond=999999)


        hospital_id = request.GET.get('hosp_id')
        
        all_events = agg_hhc_detailed_event_plan_of_care.objects.filter(status=1)
        if hospital_id:
            all_events = all_events.filter(
                eve_poc_id__in=agg_hhc_event_plan_of_care.objects.filter(hosp_id=hospital_id).values_list('eve_id', flat=True)
            )

        total_professionals = agg_hhc_service_professionals.objects.filter(status=1, prof_registered=True, prof_interviewed=True, prof_doc_verified=True, professinal_status=4).count()

        assigned_professionals_today = all_events.filter(
            actual_StartDate_Time=today,
            srv_prof_id__isnull=False
        ).values('srv_prof_id').distinct().count()

        assigned_professionals_month = all_events.filter(
            actual_StartDate_Time__range=(start_of_month,month_end_date),
            srv_prof_id__isnull=False
        ).values('srv_prof_id').distinct().count()

        assigned_professionals_total = all_events.filter(
            actual_StartDate_Time__gte=start_of_previous_month, actual_StartDate_Time__lte=end_of_previous_month,
            srv_prof_id__isnull=False
        ).values_list('srv_prof_id', flat=True).distinct().count()

        unassigned_professionals_today = total_professionals - assigned_professionals_today
        unassigned_professionals_month = total_professionals - assigned_professionals_month
        unassigned_professionals_total = total_professionals - assigned_professionals_total

        data = {
            "total_professionals": total_professionals,
            "assigned_professionals": {
                "today": assigned_professionals_today,
                "this_month": assigned_professionals_month,
                "total": assigned_professionals_total,
            },
            "unassigned_professionals": {
                "today": unassigned_professionals_today,
                "this_month": unassigned_professionals_month,
                "total": unassigned_professionals_total,
            }
        }
        return Response(data)


class get_help(APIView):
    def post(self, request):
        datas=PostFile1(data=request.data)
        if datas.is_valid():
            datas.save()
            return Response({'status':'done'})
        else:
            return Response({'status':'not done'})

    def get(self, request):
        file=HeplFiles.objects.filter(is_active=True)
        fileserializer=PostFile(file, many=True)
        return Response({'appuse':fileserializer.data})  
    
    
    
class cancelled_inq_detail(APIView):
    def get(self, request, *args, **kwargs):
        
        hospital_id = request.GET.get('hosp_id')
        # Current time
        now = timezone.now()
        today = timezone.now().date()
        # Start of the day
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        last_day = calendar.monthrange(today.year, today.month)[1]
        month_end_date = today.replace(day=last_day)
        # Start of the week (assuming week starts on Monday)
        start_of_week = now - timezone.timedelta(days=now.weekday())
        start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Start of the month
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        # Get all event ids that are in the payment details table
        # paid_event_ids = agg_hhc_payment_details.objects.values_list('eve_id', flat=True)
        
        first_day_of_current_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day_of_previous_month = first_day_of_current_month - timezone.timedelta(days=1)
        start_of_previous_month = last_day_of_previous_month.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # End of the previous month
        end_of_previous_month = last_day_of_previous_month.replace(hour=23, minute=59, second=59, microsecond=999999)
        
        all_event = agg_hhc_enquiry_follow_up.objects.all()
        
        if hospital_id:
            all_event = all_event.filter(
                event_id__in=agg_hhc_event_plan_of_care.objects.filter(hosp_id=hospital_id).values_list('eve_id', flat=True)
            )

        # Filter out these event ids from the events table and sum the final_amount
        total_enq1 = all_event.filter(last_modified_date__gte=start_of_day,  follow_up=2, event_id__status=2)
        total_enq2 = all_event.filter(last_modified_date__gte=start_of_week,  follow_up=2, event_id__status=2)
        total_enq3 = all_event.filter(last_modified_date__range=(start_of_month,month_end_date),  follow_up=2, event_id__status=2)
        total_last_mnth = all_event.filter(last_modified_date__gte=start_of_previous_month, last_modified_date__lte=end_of_previous_month, follow_up=2, event_id__status=2)

        def extract_details(queryset):
            cancel_mapping = {1: 'Spero', 2: 'Customer', 3: 'Professional'}
            # return list(queryset.values(
            #     'event_id',
            #     'event_id__agg_sp_pt_id__name',
            #     'event_id__agg_sp_pt_id__phone_no',
            #     'event_id__caller_id__phone',
            #     'canclation_reason__cancel_by_id': cancel_mapping,
            #     'canclation_reason__cancelation_reason',
            # ))
            return [
                {
                    'event_id': item['event_id'],
                    'event_id__agg_sp_pt_id__name': item['event_id__agg_sp_pt_id__name'],
                    'event_id__agg_sp_pt_id__phone_no': item['event_id__agg_sp_pt_id__phone_no'],
                    'event_id__caller_id__phone': item['event_id__caller_id__phone'],
                    'canclation_reason__cancel_by_id': cancel_mapping.get(item['canclation_reason__cancel_by_id'], 'unknown'),
                    'canclation_reason__cancelation_reason': item['canclation_reason__cancelation_reason']
                } for item in queryset.values(
                    'event_id',
                    'event_id__agg_sp_pt_id__name',
                    'event_id__agg_sp_pt_id__phone_no',
                    'event_id__caller_id__phone',
                    'canclation_reason__cancel_by_id',
                    'canclation_reason__cancelation_reason',
                )
            ]
        return Response({
            'total_cancelled_today': extract_details(total_enq1),
            # 'total_cancelled_week': extract_details(total_enq2),
            'total_cancelled_month': extract_details(total_enq3),
            'total_cancelled_last_month': extract_details(total_last_mnth)
            
        }, status=status.HTTP_200_OK)
        
   
   
   
        
class PendingAmountReceiveddetailed(APIView):

    def get(self, request, format=None):
        
        hospital_id = request.GET.get('hosp_id')
        # Current time
        now = timezone.now()
        today = timezone.now().date()
        # Start of the day
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Start of the week (assuming week starts on Monday)
        start_of_week = now - timezone.timedelta(days=now.weekday())
        start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Start of the month
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day = calendar.monthrange(today.year, today.month)[1]
        month_end_date = today.replace(day=last_day)
        # Start and end of the previous month
        first_day_of_current_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day_of_previous_month = first_day_of_current_month - timezone.timedelta(days=1)
        start_of_previous_month = last_day_of_previous_month.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end_of_previous_month = last_day_of_previous_month.replace(hour=23, minute=59, second=59, microsecond=999999)
        
        # Base query
        payment_details = agg_hhc_payment_details.objects.all()
        
        if hospital_id:
            payment_details = payment_details.filter(
                eve_id__in=agg_hhc_event_plan_of_care.objects.filter(hosp_id=hospital_id).values_list('eve_id', flat=True)
            )
        
        # Calculate totals
        total_today = payment_details.filter(date__gte=start_of_day, payment_status=1)
        total_week = payment_details.filter(date__gte=start_of_week, payment_status=1)
        total_month = payment_details.filter(date__range=(start_of_month,month_end_date), payment_status=1)
        total_till_date = payment_details.filter(date__gte=start_of_previous_month, date__lte=end_of_previous_month, payment_status=1)
        
        def extract_details(queryset):
            mode_mapping = {1: 'Cash', 2: 'Cheque', 3: 'Online', 4: 'Card', 5: 'QR Code', 6: 'NEFT'}
            return [
                {
                    'eve_id': item['eve_id'],
                    'pay_recived_by__clg_first_name': f"{item['pay_recived_by__clg_first_name']} {item['pay_recived_by__clg_last_name']}".strip() if item['pay_recived_by__clg_last_name'] else item['pay_recived_by__clg_first_name'],
                    'mode': mode_mapping.get(item['mode'], 'unknown'),
                    'amount_paid': item['amount_paid']
                } for item in queryset.values(
                    'eve_id',
                    'pay_recived_by__clg_first_name',
                    'pay_recived_by__clg_last_name',
                    'mode',
                    'amount_paid'
                )
            ]
        
        return Response({
            'total_amount_received_today': extract_details(total_today),
            # 'total_amount_received_week': extract_details(total_week), # Uncomment this line if you need the weekly data
            'total_amount_received_month': extract_details(total_month),
            'total_amount_received_last_month': extract_details(total_till_date)
        }, status=status.HTTP_200_OK)
        

class UNpaidAmount_details(APIView):
    def get(self, request, *args, **kwargs):
        
        hospital_id = request.GET.get('hosp_id')
        # Current time
        now = timezone.now()
        today = timezone.now().date()
        # Start of the day
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Start of the week (assuming week starts on Monday)
        start_of_week = now - timezone.timedelta(days=now.weekday())
        start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Start of the month
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day = calendar.monthrange(today.year, today.month)[1]
        month_end_date = today.replace(day=last_day)
        first_day_of_current_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day_of_previous_month = first_day_of_current_month - timezone.timedelta(days=1)
        start_of_previous_month = last_day_of_previous_month.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end_of_previous_month = last_day_of_previous_month.replace(hour=23, minute=59, second=59, microsecond=999999)
        
        # Get all event ids that are in the payment details table
        paid_event_ids = agg_hhc_payment_details.objects.values_list('eve_id', flat=True)
        
        all_event = agg_hhc_events.objects.all()
        
        if hospital_id:
            all_event = all_event.filter(
                eve_id__in=agg_hhc_event_plan_of_care.objects.filter(hosp_id=hospital_id).values_list('eve_id', flat=True)
            )

        # Filter out these event ids from the events table and sum the final_amount
        total_amount1 = all_event.filter(
            eve_id__in=agg_hhc_event_plan_of_care.objects.filter(start_date__gte=start_of_day).values_list('eve_id', flat=True),
            status=1
        ).exclude(eve_id__in=paid_event_ids)

        total_amount2 = all_event.filter(
            eve_id__in=agg_hhc_event_plan_of_care.objects.filter(start_date__gte=start_of_week).values_list('eve_id', flat=True),
            status=1
        ).exclude(eve_id__in=paid_event_ids)

        total_amount3 = all_event.filter(
            eve_id__in=agg_hhc_event_plan_of_care.objects.filter(start_date__range=(start_of_month,month_end_date)).values_list('eve_id', flat=True),
            status=1
        ).exclude(eve_id__in=paid_event_ids)

        total_amount4 = all_event.filter(
            eve_id__in=agg_hhc_event_plan_of_care.objects.filter(start_date__gte=start_of_previous_month, start_date__lte=end_of_previous_month).values_list('eve_id', flat=True),
            status=1
        ).exclude(eve_id__in=paid_event_ids)

        def extract_details(queryset):
            return list(queryset.values(
                'eve_id',
                'agg_sp_pt_id__name',
                'final_amount',
            ))


        return Response({
            'total_Unpaid_amount_today': extract_details(total_amount1),
            # 'total_Unpaid_amount_week': total_amount2,
            'total_Unpaid_amount_month': extract_details(total_amount3),
            'total_Unpaid_amount_last_month':extract_details(total_amount4)
        }, status=status.HTTP_200_OK)
        

class UNassign_ProfessionalView(APIView):
    def get(self, request, *args, **kwargs):
        today = now().date()
        current_time = now()

        start_of_month = current_time.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day = calendar.monthrange(today.year, today.month)[1]
        month_end_date = today.replace(day=last_day)
        
        first_day_of_current_month = current_time.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day_of_previous_month = first_day_of_current_month - timezone.timedelta(days=1)
        start_of_previous_month = last_day_of_previous_month.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end_of_previous_month = last_day_of_previous_month.replace(hour=23, minute=59, second=59, microsecond=999999)

        hospital_id = request.GET.get('hosp_id')
        
        all_events = agg_hhc_detailed_event_plan_of_care.objects.filter(status=1)
        if hospital_id:
            all_events = all_events.filter(
                eve_poc_id__in=agg_hhc_event_plan_of_care.objects.filter(hosp_id=hospital_id).values_list('eve_id', flat=True)
            )

        total_professionals = agg_hhc_service_professionals.objects.filter(status=1, prof_registered=True, prof_interviewed=True, prof_doc_verified=True, professinal_status=4)
        total_professionals_ids = total_professionals.values_list('srv_prof_id', flat=True)

        assigned_professionals_today_ids = all_events.filter(
            actual_StartDate_Time=today,
            srv_prof_id__isnull=False
        ).values_list('srv_prof_id', flat=True).distinct()

        assigned_professionals_month_ids = all_events.filter(
            actual_StartDate_Time__range=(start_of_month,month_end_date),
            srv_prof_id__isnull=False
        ).values_list('srv_prof_id', flat=True).distinct()

        assigned_professionals_total_ids = all_events.filter(
            actual_StartDate_Time__gte=start_of_previous_month, actual_StartDate_Time__lte=end_of_previous_month,
            srv_prof_id__isnull=False
        ).values_list('srv_prof_id', flat=True).distinct()

        unassigned_professionals_today = total_professionals.exclude(srv_prof_id__in=assigned_professionals_today_ids)
        unassigned_professionals_month = total_professionals.exclude(srv_prof_id__in=assigned_professionals_month_ids)
        unassigned_professionals_total = total_professionals.exclude(srv_prof_id__in=assigned_professionals_total_ids)

        # def get_professionals_details(professionals):
        #     return professionals.values('prof_fullname', 'srv_id__service_title', 'google_home_location')
        
        def extract_details(queryset):
            return [
                {
                    'prof_fullname': item['prof_fullname'],
                    'service_title': item['srv_id__service_title'],
                    'google_home_location': item['google_home_location'],
                } for item in queryset.values(
                    'prof_fullname',
                    'srv_id__service_title',
                    'google_home_location'
                )
            ]

        # data = {
        #     "unassigned_professionals": {
        #         "today": extract_details(unassigned_professionals_today),
        #         "this_month": extract_details(unassigned_professionals_month),
        #         "last_month": extract_details(unassigned_professionals_total),
        #     }
        # }
        return Response({
                "today": extract_details(unassigned_professionals_today),
                "this_month": extract_details(unassigned_professionals_month),
                "last_month": extract_details(unassigned_professionals_total),
            }, status=status.HTTP_200_OK)
        
        
        
class TotalServicesOngoingPendingCompleted_counts_service_wise(APIView):
    def get(self, request, *args, **kwargs):
        hospital_id = request.GET.get('hosp_id')
        now = timezone.now()
        today = timezone.now().date()
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        start_of_week = now - timezone.timedelta(days=now.weekday())
        start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        last_day = calendar.monthrange(today.year, today.month)[1]
        month_end_date = today.replace(day=last_day)
        
        first_day_of_current_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day_of_previous_month = first_day_of_current_month - timezone.timedelta(days=1)
        start_of_previous_month = last_day_of_previous_month.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end_of_previous_month = last_day_of_previous_month.replace(hour=23, minute=59, second=59, microsecond=999999)
        
        all_event = agg_hhc_detailed_event_plan_of_care.objects.filter(status=1, eve_id__event_status__in=[2,3])
        
        if hospital_id:
            all_event = all_event.filter(
                eve_poc_id__in=agg_hhc_event_plan_of_care.objects.filter(hosp_id=hospital_id).values_list('eve_poc_id', flat=True)
            )

        services = agg_hhc_services.objects.all()
        
        response_data = {
            'total_services': all_event.count()
        }
        
        res_data = []
        for service in services:
            service_events = all_event.filter(eve_poc_id__srv_id=service.srv_id)
            
            if service.service_title:
                service_title_key = service.service_title.replace(" ", "_")
            else:
                service_title_key = 'unknown_service'
            
            # response_data[service.service_title] = {
            #     'total_completed_till_date': service_events.filter(last_modified_date__gte=start_of_previous_month, last_modified_date__lte=end_of_previous_month, Session_jobclosure_status=1).count(),
            #     'total_completed_today': service_events.filter(last_modified_date__gte=start_of_day, Session_jobclosure_status=1).count(),
            #     # 'total_completed_this_week': service_events.filter(last_modified_date__gte=start_of_week, Session_jobclosure_status=1).count(),
            #     'total_completed_this_month': service_events.filter(last_modified_date__range=(start_of_month,start_of_day), Session_jobclosure_status=1).count(),
                
            #     'total_pending_till_date': service_events.filter(actual_StartDate_Time__gte=start_of_previous_month, actual_StartDate_Time__lte=end_of_previous_month, Session_status=1, eve_id__event_status=2).count(),
            #     'total_pending_today': service_events.filter(actual_StartDate_Time=start_of_day, Session_status=1, eve_id__event_status=2).count(),
            #     # 'total_pending_this_week': service_events.filter(actual_StartDate_Time=start_of_week, Session_status=1).count(),
            #     'total_pending_this_month': service_events.filter(actual_StartDate_Time__range=(start_of_month,start_of_day), Session_status=1, eve_id__event_status=2).count(),
                
            #     'total_ongoing_till_date': service_events.filter(actual_StartDate_Time__gte=start_of_previous_month, actual_StartDate_Time__lte=end_of_previous_month, Session_status=8, eve_id__event_status=2).count(),
            #     'total_ongoing_today': service_events.filter(actual_StartDate_Time=start_of_day, Session_status=8, eve_id__event_status=2).count(),
            #     # 'total_ongoing_this_week': service_events.filter(actual_StartDate_Time=start_of_week, Session_status=8).count(),
            #     'total_ongoing_this_month': service_events.filter(actual_StartDate_Time__range=(start_of_month,start_of_day), Session_status=8, eve_id__event_status=2).count()
            # }
            
            
            
            response_data_obj  = {
                "srv_name" : service.service_title,
                "data" : {
                    'total_completed_till_date': service_events.filter(actual_StartDate_Time__gte=start_of_previous_month, actual_StartDate_Time__lte=end_of_previous_month, Session_jobclosure_status=1).count(),
                    'total_completed_today': service_events.filter(actual_StartDate_Time__gte=start_of_day, Session_jobclosure_status=1).count(),
                    # 'total_completed_this_week': service_events.filter(last_modified_date__gte=start_of_week, Session_jobclosure_status=1).count(),
                    'total_completed_this_month': service_events.filter(actual_StartDate_Time__range=(start_of_month,month_end_date), Session_jobclosure_status=1).count(),
                    
                    'total_pending_till_date': service_events.filter(actual_StartDate_Time__gte=start_of_previous_month, actual_StartDate_Time__lte=end_of_previous_month, Session_status=1).exclude(Session_status__in=[8,2,9]).count(),
                    'total_pending_today': service_events.filter(actual_StartDate_Time=start_of_day, Session_status=1).exclude(Session_status__in=[8,2,9]).count(),
                    # 'total_pending_this_week': service_events.filter(actual_StartDate_Time=start_of_week, Session_status=1).count(),
                    'total_pending_this_month': service_events.filter(actual_StartDate_Time__range=(start_of_month,month_end_date), Session_status=1).exclude(Session_status__in=[8,2,9]).count(),
                    
                    'total_ongoing_till_date': service_events.filter(actual_StartDate_Time__gte=start_of_previous_month, actual_StartDate_Time__lte=end_of_previous_month, Session_status__in=[8,2,9]).exclude(Session_jobclosure_status=1).count(),
                    'total_ongoing_today': service_events.filter(actual_StartDate_Time=start_of_day, Session_status__in=[8,2,9]).exclude(Session_jobclosure_status=1).count(),
                    # 'total_ongoing_this_week': service_events.filter(actual_StartDate_Time=start_of_week, Session_status=8).count(),
                    'total_ongoing_this_month': service_events.filter(actual_StartDate_Time__range=(start_of_month,month_end_date), Session_status__in=[8,2,9]).exclude(Session_jobclosure_status=1).count()
                }
            }
            
            
            res_data.append(response_data_obj)
            
            
            
            
            
        
        return Response(res_data, status=status.HTTP_200_OK)
    
    
    
    
class AttendanceReportView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        from_date = request.GET.get('from_date')
        to_date = request.GET.get('to_date')

        if from_date:
            try:
                from_date = datetime.strptime(from_date, '%Y-%m-%d')
            except ValueError:
                return Response({'error': 'Incorrect from_date format, should be YYYY-MM-DD'}, status=status.HTTP_400_BAD_REQUEST)
        if to_date:
            try:
                to_date = datetime.strptime(to_date, '%Y-%m-%d')
            except ValueError:
                return Response({'error': 'Incorrect to_date format, should be YYYY-MM-DD'}, status=status.HTTP_400_BAD_REQUEST)
        
        if from_date and to_date:
            date_range = (to_date - from_date).days + 1
        else:
            date_range = None

        professionals = agg_hhc_service_professionals.objects.all()
        report = []

        for professional in professionals:
            professional_id = professional.srv_prof_id
            professional_name = professional.prof_fullname
            job_type = professional.Job_type
            
            attendance_entries = []

            if date_range:
                for i in range(date_range):
                    current_date = from_date + timedelta(days=i)
                    attendance = agg_hhc_attendance.objects.filter(
                        Professional_iid=professional_id,
                        attnd_date__date=current_date.date()
                    ).first()
                    if attendance:
                        attendance_data = AttendanceSerializer(attendance).data
                        attendance_entries.append(attendance_data)
                    else:
                        attendance_entries.append({
                            'Professional_iid': professional_id,
                            'attnd_date': current_date.strftime('%Y-%m-%d'),  # Convert date to string
                            'attnd_status': 'No Entry'
                        })
            else:
                attendances = agg_hhc_attendance.objects.filter(
                    Professional_iid=professional_id
                ).order_by('attnd_date')
                attendance_entries = AttendanceSerializer(attendances, many=True).data

            report.append({
                'Professional_iid': professional_id,
                'professional_name': professional_name,
                'job_type': job_type,
                'attendance': attendance_entries
            })

        return Response(report)
    
    
    
import http.client
import json

class SendMessageView(APIView):
    # def post(self, request):
    #     base_url = "xl6mjq.api-in.infobip.com"
    #     api_key = "af099554a7f804d8fd234e3226241101-da0d6970-19a8-4e0a-9154-9da1fb64d858"  # Replace with your actual API key
    #     from_number = "918956193883"
    #     to_number = request.data.get('to_number', '')
    #     template_name = "professional_name"
    #     placeholders = request.data.get('placeholders', [])
    #     order_id = "SPERO_W_ID" + timezone.now().strftime("%d%m%Y%H%M%S")
    #     if not to_number:
    #         return Response({"error": "Destination number is required"}, status=status.HTTP_400_BAD_REQUEST)
    #     if not placeholders:
    #         return Response({"error": "Placeholders are required"}, status=status.HTTP_400_BAD_REQUEST)

    #     payload = json.dumps({
    #         "messages": [
    #             {
    #                 "from": from_number,
    #                 "to": to_number,
    #                 "messageId": order_id,
    #                 "content": {
    #                     "templateName": template_name,
    #                     "templateData": {
    #                         "body": {
    #                             "placeholders": [
    #                                 "mayank",  # Placeholder 1: Dear {{1}}
    #                                 "vinayak",  # Placeholder 2: Patient : {{2}}
    #                                 "9131982332",  # Placeholder 3: Caller No : {{3}}
    #                                 "442333272",  # Placeholder 4: Mobile No : {{4}}
    #                                 "123 anand nagar, pune, MH",  # Placeholder 5: Address : {{5}}
    #                                 "EVT12345",  # Placeholder 6: Event No : {{6}}
    #                                 "Health Checkup",  # Placeholder 7: Service : {{7}}
    #                                 "Blood Test",  # Placeholder 8: Sub-Service : {{8}}
    #                                 "2024-07-11",  # Placeholder 9: Date : {{9}}
    #                                 "10:00 AM"  # Placeholder 10: Reporting Time : {{10}}
    #                             ]
    #                         }
    #                     },
    #                     "language": "en",
    #                     "buttons": [
    #                         {
    #                             "type": "REPLY",
    #                             "parameter": "confirm",
    #                             "text": "Confirm"
    #                         },
    #                         {
    #                             "type": "REPLY",
    #                             "parameter": "not_confirm",
    #                             "text": "Not Confirm"
    #                         }
    #                     ]
    #                 }
    #             }
    #         ]
    #     })

    #     headers = {
    #         'Authorization': f'App {api_key}',
    #         'Content-Type': 'application/json',
    #         'Accept': 'application/json'
    #     }

    #     conn = http.client.HTTPSConnection(base_url)
    #     conn.request("POST", "/whatsapp/1/message/template", payload, headers)
    #     res = conn.getresponse()
    #     data = res.read()
    #     conn.close()

    #     if res.status == 200:
    #         return Response({"status": "Message sent successfully", "response": json.loads(data.decode("utf-8"))}, status=status.HTTP_200_OK)
    #     else:
    #         return Response({"error": data.decode("utf-8")}, status=res.status)
    def post(self, request):
        base_url = "xl6mjq.api-in.infobip.com"
        api_key = "af099554a7f804d8fd234e3226241101-da0d6970-19a8-4e0a-9154-9da1fb64d858"  # Replace with your actual API key
        from_number = "918956193883"
        to_number = request.data.get('to_number', '')
        template_name = "professional_name1"
        placeholders = request.data.get('placeholders', [])
        order_id = "SPERO_W_ID" + timezone.now().strftime("%d%m%Y%H%M%S")

        if not to_number:
            return Response({"error": "Destination number is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not placeholders:
            return Response({"error": "Placeholders are required"}, status=status.HTTP_400_BAD_REQUEST)

        payload = json.dumps({
            "messages": [
                {
                    "from": from_number,
                    "to": to_number,
                    "messageId": order_id,
                    "content": {
                        "templateName": template_name,
                        "templateData": {
                            "body": {
                                "placeholders": placeholders
                            },
                            #"header": {
                            #    "type": "IMAGE",
                            #    "mediaUrl": "https://hhc.hospitalguru.in/media/sign_sepro.jpeg"
                            #},
                            "buttons": [
                                {
                                    "type": "QUICK_REPLY",
                                    "parameter": "confirm",  # Add a parameter for the button
                                    "text": "Confirm"
                                },
                                {
                                    "type": "QUICK_REPLY",
                                    "parameter": "not_confirm",  # Add a parameter for the button
                                    "text": "Not Confirm"
                                }
                            ]
                        },
                        "language": "en"
                    }
                }
            ]
        })

        headers = {
            'Authorization': f'App {api_key}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

        conn = http.client.HTTPSConnection(base_url)
        conn.request("POST", "/whatsapp/1/message/template", payload, headers)
        res = conn.getresponse()
        data = res.read()
        conn.close()

        if res.status == 200:
            return Response({"status": "Message sent successfully", "response": json.loads(data.decode("utf-8"))}, status=status.HTTP_200_OK)
        else:
            return Response({"error": data.decode("utf-8")}, status=res.status)

class FeedbackQuestionsAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        question_ids = [16, 17, 18, 19]  
        questions = FeedBack_Questions.objects.filter(F_questions__in=question_ids).order_by('F_questions')
        serializer = FeedBackQuestionWithLangAndOptionsSerializer(questions, many=True, context={'request': request})
        
       
        data = {
            'data': serializer.data
        }
        
        return Response(data)
    


class FeedbackQuestionsAPIView_for_app(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        question_ids = [16, 17, 18, 19]  
        questions = FeedBack_Questions.objects.filter(F_questions__in=question_ids).order_by('F_questions')
        serializer = FeedBackQuestionWithLangAndOptionsss(questions, many=True, context={'request': request})
        
       
        data = {
            'data': serializer.data
        }
        
        return Response(data)




from rest_framework.parsers import MultiPartParser, FormParser
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction

class SsavePatientFeedbackAPIView(APIView):
    
    # parser_classes = (MultiPartParser, FormParser)
    
    # def post(self, request, *args, **kwargs):
    #     try:
    #         eve_id = request.data.get('eve_id')
    #         ptn_id = request.data.get('ptn_id')
    #         media = request.FILES.get('media')
    #         feedback_data = request.data.get('feedback')
            
    #         # Ensure eve_id and ptn_id are provided
    #         if not eve_id or not ptn_id:
    #             return Response({"error": "eve_id and ptn_id are required"}, status=status.HTTP_400_BAD_REQUEST)
            
    #         # Fetch the related model instances
    #         try:
    #             event_instance = agg_hhc_events.objects.get(eve_id=eve_id)
    #         except ObjectDoesNotExist:
    #             return Response({"error": "Invalid eve_id"}, status=status.HTTP_400_BAD_REQUEST)
            
    #         try:
    #             patient_instance = agg_hhc_patients.objects.get(agg_sp_pt_id=ptn_id)
    #         except ObjectDoesNotExist:
    #             return Response({"error": "Invalid ptn_id"}, status=status.HTTP_400_BAD_REQUEST)

    #         # Parse feedback data if provided
    #         if feedback_data:
    #             try:
    #                 feedback_data = json.loads(feedback_data)
    #                 if not isinstance(feedback_data, list):
    #                     raise ValueError
    #             except (json.JSONDecodeError, ValueError):
    #                 return Response({"error": "Feedback data must be a list of objects"}, status=status.HTTP_400_BAD_REQUEST)

    #         feedback_entries = []
    #         if feedback_data:
    #             for entry in feedback_data:
    #                 question_id = entry.get('que')
    #                 answer = entry.get('ans')

    #                 if question_id is None or answer is None:
    #                     return Response({"error": "Each feedback entry must have 'que' and 'ans' fields"}, status=status.HTTP_400_BAD_REQUEST)

    #                 try:
    #                     question_instance = FeedBack_Questions.objects.get(F_questions=question_id)
    #                 except ObjectDoesNotExist:
    #                     return Response({"error": f"Invalid question ID: {question_id}"}, status=status.HTTP_400_BAD_REQUEST)

    #                 feedback_entry = agg_save_patient_feedback_table(
    #                     eve_id=event_instance,
    #                     ptn_id=patient_instance,
    #                     f_questions=question_instance,
    #                     answer=answer,
    #                     media=media
    #                 )
    #                 feedback_entries.append(feedback_entry)
    #         else:
    #             # Create a single entry with no feedback data if feedback is not provided
    #             feedback_entry = agg_save_patient_feedback_table(
    #                 eve_id=event_instance,
    #                 ptn_id=patient_instance,
    #                 media=media
    #             )
    #             feedback_entries.append(feedback_entry)

    #         agg_save_patient_feedback_table.objects.bulk_create(feedback_entries)

    #         return Response({"message": "Feedback saved successfully"}, status=status.HTTP_201_CREATED)

    #     except Exception as e:
    #         return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, *args, **kwargs):
        try:
            eve_id = request.data.get('eve_id')
            ptn_id = request.data.get('ptn_id')
            media = request.FILES.get('media')
            video = request.FILES.get('video')
            prof_id = request.data.get('prof_id')
            feedback_data = request.data.get('feedback')
    
            # Ensure eve_id, ptn_id, and prof_id are provided
            if not eve_id or not ptn_id or not prof_id:
                return Response({"error": "eve_id, ptn_id, and prof_id are required"}, status=status.HTTP_400_BAD_REQUEST)
    
            # Fetch the related model instances
            try:
                event_instance = agg_hhc_events.objects.get(eve_id=eve_id)
            except ObjectDoesNotExist:
                return Response({"error": "Invalid eve_id"}, status=status.HTTP_400_BAD_REQUEST)
    
            try:
                patient_instance = agg_hhc_patients.objects.get(agg_sp_pt_id=ptn_id)
            except ObjectDoesNotExist:
                return Response({"error": "Invalid ptn_id"}, status=status.HTTP_400_BAD_REQUEST)
    
            try:
                profile_instance = agg_hhc_service_professionals.objects.get(srv_prof_id=prof_id)
            except ObjectDoesNotExist:
                return Response({"error": "Invalid prof_id"}, status=status.HTTP_400_BAD_REQUEST)
            record = agg_save_patient_feedback_table.objects.filter(eve_id=event_instance,ptn_id=patient_instance,prof_id=profile_instance).last()
            # Use a transaction to ensure atomicity
            with transaction.atomic():
                # Check if a media entry already exists
                media_entry, created = agg_save_feedback_medias.objects.update_or_create(
                    eve_id=event_instance,
                    ptn_id=patient_instance,
                    prof_id=profile_instance,
                    defaults={'images': media, 'video': video}
                )
    
                # Parse feedback data if provided
                if feedback_data:
                    try:
                        feedback_data = json.loads(feedback_data)
                        if not isinstance(feedback_data, list):
                            raise ValueError
                    except (json.JSONDecodeError, ValueError):
                        return Response({"error": "Feedback data must be a list of objects"}, status=status.HTTP_400_BAD_REQUEST)
    
                feedback_entries = []
                if feedback_data:
                    for entry in feedback_data:
                        question_id = entry.get('que')
                        answer = entry.get('ans')
    
                        if question_id is None or answer is None:
                            return Response({"error": "Each feedback entry must have 'que' and 'ans' fields"}, status=status.HTTP_400_BAD_REQUEST)
    
                        try:
                            question_instance = FeedBack_Questions.objects.get(F_questions=question_id)
                        except ObjectDoesNotExist:
                            return Response({"error": f"Invalid question ID: {question_id}"}, status=status.HTTP_400_BAD_REQUEST)
    
                        feedback_entry, created = agg_save_patient_feedback_table.objects.update_or_create(
                            eve_id=event_instance,
                            ptn_id=patient_instance,
                            f_questions=question_instance,
                            prof_id=profile_instance,
                            defaults={'answer': answer}
                        )
                        feedback_entries.append(feedback_entry)
                else:
                    # Create or update a single entry with no feedback data if feedback is not provided
                    feedback_entry, created = agg_save_patient_feedback_table.objects.update_or_create(
                        eve_id=event_instance,
                        ptn_id=patient_instance,
                        prof_id=profile_instance,
                        defaults={}
                    )
                    feedback_entries.append(feedback_entry)
                print(record,'record..........')
                if record:
                    return Response({"message": "Feedback updated successfully"}, status=status.HTTP_201_CREATED)
                else:
                    return Response({"message": "Feedback saved successfully"}, status=status.HTTP_201_CREATED)

    
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request, *args, **kwargs):
        eve_id = request.query_params.get('eve_id')
        ptn_id = request.query_params.get('ptn_id')
        prof_id = request.query_params.get('prof_id')

        if not eve_id or not ptn_id or not prof_id:
            return Response({"error": "eve_id, ptn_id and prof_id are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        feedback_entries = agg_save_patient_feedback_table.objects.filter(eve_id=eve_id, ptn_id=ptn_id, prof_id=prof_id)
        if not feedback_entries.exists():
            return Response({"error": "No feedback found for the given eve_id and ptn_id"}, status=status.HTTP_200_OK)
        
        serializer = AggSavePatientFeedbackSerializer(feedback_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



class SendMessageView2(APIView):
    def post(self, request):
        base_url = "xl6mjq.api-in.infobip.com"
        api_key = "af099554a7f804d8fd234e3226241101-da0d6970-19a8-4e0a-9154-9da1fb64d858"  # Replace with your actual API key
        from_number = "918956193883"
        to_number = "917517631674"
        template_name = "sos_button"
        placeholders = request.data.get('placeholders', [])
        order_id = "SPERO_W_ID" + timezone.now().strftime("%d%m%Y%H%M%S")

        if not to_number:
            return Response({"error": "Destination number is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not placeholders:
            return Response({"error": "Placeholders are required"}, status=status.HTTP_400_BAD_REQUEST)

        payload = json.dumps({
            "messages": [
                {
                    "from": from_number,
                    "to": to_number,
                    "messageId": order_id,
                    "content": {
                        "templateName": template_name,
                        "templateData": {
                            "body": {
                                "placeholders": placeholders
                            },
                            # "header": {
                            #     "type": "LOCATION",
                            #     "latitude": 18.595961327299644,
                            #     "longitude": 73.7588712015471
                            # }
                            # "buttons": [
                            #     {
                            #         "type": "CALL_BUTTON",
                            #         "parameter": "919131982332",  # Add a parameter for the button
                            #         "text": "call"
                            #     },
                            #     {
                            #         "type": "DYNAMIC_URL",
                            #         "parameter": "https://www.sperohealthcare.in/",  # Add a parameter for the button
                            #         "text": "Visit Website"
                            #     }
                            # ],
                            
                            # "footer": {
                            #     "text": "Spero Healthcare Innovation Pvt Ltd"
                            # }                           
                        },
                        "language": "en"
                    }
                }
            ]
        })

        headers = {
            'Authorization': f'App {api_key}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

        conn = http.client.HTTPSConnection(base_url)
        conn.request("POST", "/whatsapp/1/message/template", payload, headers)
        res = conn.getresponse()
        data = res.read()
        conn.close()

        if res.status == 200:
            return Response({"status": "Message sent successfully", "response": json.loads(data.decode("utf-8"))}, status=status.HTTP_200_OK)
        else:
            return Response({"error": data.decode("utf-8")}, status=res.status)





class Prof_names_eve_wise_view(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request,eve_id):
        daily_Report = agg_hhc_detailed_event_plan_of_care.objects.filter(
            (Q(eve_id__event_status = 2) | Q(eve_id__event_status = 3)) , eve_id=eve_id,
            eve_id__status=1).order_by('srv_prof_id').distinct('srv_prof_id')
        if not daily_Report:
            return Response({"detail": "No data found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = prof_names_eve_wise_serializer(daily_Report, many=True)
        return Response(serializer.data)            



class SendMessageView_for_allocation(APIView):
    def post(self, request):
        base_url = "xl6mjq.api-in.infobip.com"
        api_key = "af099554a7f804d8fd234e3226241101-da0d6970-19a8-4e0a-9154-9da1fb64d858"  # Replace with your actual API key
        from_number = "918956193883"
        to_number = request.data.get('to_number', '')
        template_name = "professional_name_sms"
        placeholders = request.data.get('placeholders', [])
        order_id = "SPERO_W_ID" + timezone.now().strftime("%d%m%Y%H%M%S")

        if not to_number:
            return Response({"error": "Destination number is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not placeholders:
            return Response({"error": "Placeholders are required"}, status=status.HTTP_400_BAD_REQUEST)

        payload = json.dumps({
            "messages": [
                {
                    "from": from_number,
                    "to": to_number,
                    "messageId": order_id,
                    "content": {
                        "templateName": template_name,
                        "templateData": {
                            "body": {
                                "placeholders": placeholders
                            },                   
                        },
                        "language": "en"
                    }
                }
            ]
        })

        headers = {
            'Authorization': f'App {api_key}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

        conn = http.client.HTTPSConnection(base_url)
        conn.request("POST", "/whatsapp/1/message/template", payload, headers)
        res = conn.getresponse()
        data = res.read()
        conn.close()

        if res.status == 200:
            return Response({"status": "Message sent successfully", "response": json.loads(data.decode("utf-8"))}, status=status.HTTP_200_OK)
        else:
            return Response({"error": data.decode("utf-8")}, status=res.status)


# from rest_framework.permissions import IsAuthenticated
class CombinedAPIView_for_feedback_questions(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        eve_id = request.query_params.get('eve_id', None)

        # Part 1: Prof_names_eve_wise_view logic
        if eve_id:
            daily_Report = agg_hhc_detailed_event_plan_of_care.objects.filter(
                (Q(eve_id__event_status=2) | Q(eve_id__event_status=3)), 
                eve_id=eve_id, eve_id__status=1
            ).order_by('srv_prof_id').distinct('srv_prof_id')
            
            if not daily_Report:
                prof_data = {"detail": "No data found"}
            else:
                prof_serializer = prof_names_eve_wise_serializer(daily_Report, many=True)
                prof_data = prof_serializer.data
        else:
            prof_data = {"detail": "eve_id not provided"}

        # Part 2: FeedbackQuestionsAPIView_for_app logic
        question_ids = [16, 17, 18, 19]  
        questions = FeedBack_Questions.objects.filter(F_questions__in=question_ids).order_by('F_questions')
        feedback_serializer = FeedBackQuestionWithLangAndOptionsss(questions, many=True, context={'request': request})

        # Combined response
        data = {
            'prof_names': prof_data,
            'feedback_questions': feedback_serializer.data
        }

        return Response(data, status=status.HTTP_200_OK)


class SendMessageView_for_total_session_count(APIView):
    def post(self, request):
        base_url = "xl6mjq.api-in.infobip.com"
        api_key = "af099554a7f804d8fd234e3226241101-da0d6970-19a8-4e0a-9154-9da1fb64d858"  # Replace with your actual API key
        from_number = "918956193883"
        to_number = request.data.get('to_number', '')
        template_name = "total_session_count"
        placeholders = request.data.get('placeholders', [])
        order_id = "SPERO_W_ID" + timezone.now().strftime("%d%m%Y%H%M%S")

        if not to_number:
            return Response({"error": "Destination number is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not placeholders:
            return Response({"error": "Placeholders are required"}, status=status.HTTP_400_BAD_REQUEST)

        payload = json.dumps({
            "messages": [
                {
                    "from": from_number,
                    "to": to_number,
                    "messageId": order_id,
                    "content": {
                        "templateName": template_name,
                        "templateData": {
                            "body": {
                                "placeholders": placeholders
                            },                   
                        },
                        "language": "en"
                    }
                }
            ]
        })

        headers = {
            'Authorization': f'App {api_key}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

        conn = http.client.HTTPSConnection(base_url)
        conn.request("POST", "/whatsapp/1/message/template", payload, headers)
        res = conn.getresponse()
        data = res.read()
        conn.close()

        if res.status == 200:
            return Response({"status": "Message sent successfully", "response": json.loads(data.decode("utf-8"))}, status=status.HTTP_200_OK)
        else:
            return Response({"error": data.decode("utf-8")}, status=res.status)



class pending1_Total_enquiry(APIView):
    def get(self, request, *args, **kwargs):
        
        hospital_id = request.GET.get('hosp_id')
        # Current time
        now = timezone.now()
        today = timezone.now().date()
        # Start of the day
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        last_day = calendar.monthrange(today.year, today.month)[1]
        month_end_date = today.replace(day=last_day)
        # Start of the week (assuming week starts on Monday)
        start_of_week = now - timezone.timedelta(days=now.weekday())
        start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
        
        first_day_of_current_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day_of_previous_month = first_day_of_current_month - timezone.timedelta(days=1)
        start_of_previous_month = last_day_of_previous_month.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end_of_previous_month = last_day_of_previous_month.replace(hour=23, minute=59, second=59, microsecond=999999)
        
        # Start of the month
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        # Get all event ids that are in the payment details table
        # paid_event_ids = agg_hhc_payment_details.objects.values_list('eve_id', flat=True)
        
        all_event = agg_hhc_enquiry_follow_up.objects.all()
        
        if hospital_id:
            all_event = all_event.filter(
                eve_id__in=agg_hhc_event_plan_of_care.objects.filter(hosp_id=hospital_id).values_list('eve_id', flat=True)
            )

        # Filter out these event ids from the events table and sum the final_amount
        total_enq1 = all_event.filter(added_date__gte=start_of_day, follow_up=None).count()
        total_enq2 = all_event.filter(added_date__gte=start_of_week, follow_up=None).count()
        total_enq3 = all_event.filter(added_date__range=(start_of_month,month_end_date), follow_up=None).count()
        total_enq4 = all_event.filter(added_date__gte=start_of_previous_month ,added_date__lte=end_of_previous_month, follow_up=None).count()




        return Response({
            'total_enq_today': total_enq1,
            'total_enq_week': total_enq2,
            'total_enq_month': total_enq3,
            'total_enq_till_date': total_enq4
        }, status=status.HTTP_200_OK)
    




class Calculate_pending_service(APIView):
    def get(self, request, *args, **kwargs):
        hospital_id = request.GET.get('hosp_id')
        now = timezone.now()
        today = timezone.now().date()
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        start_of_week = now - timezone.timedelta(days=now.weekday())
        start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
        last_day = calendar.monthrange(today.year, today.month)[1]
        month_end_date = today.replace(day=last_day)
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        first_day_of_current_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day_of_previous_month = first_day_of_current_month - timezone.timedelta(days=1)
        start_of_previous_month = last_day_of_previous_month.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end_of_previous_month = last_day_of_previous_month.replace(hour=23, minute=59, second=59, microsecond=999999)
        

# ----------------- Last month
        ls_all_event = agg_hhc_enquiry_follow_up.objects.filter(last_modified_date__range=(start_of_previous_month, end_of_previous_month),follow_up_status=1)
        hospital_id = request.GET.get('hosp_id')
        if hospital_id:
            ls_all_event = ls_all_event.filter(
                event_id__in=agg_hhc_event_plan_of_care.objects.filter(hosp_id=hospital_id).values_list('eve_id', flat=True)
            )
        ls_eve_ids = ls_all_event.values_list('event_id', flat=True)
        ls_all_eves = list(set(ls_eve_ids))
        ls_enq_id = []
        for i in ls_all_eves:
            ls_get_enq = ls_all_event.filter(event_id=i).order_by('last_modified_date').last()
            ls_enq_id.append(ls_get_enq.enq_follow_up_id)
        ls_all_follow_up_enq = ls_all_event.filter(enq_follow_up_id__in=ls_enq_id)
        ls_four = ls_all_follow_up_enq.filter(follow_up=4)

# ------------------ This month

        ts_all_event = agg_hhc_enquiry_follow_up.objects.filter(last_modified_date__range=(start_of_month,month_end_date),follow_up_status=1)
        if hospital_id:
            ls_all_event = ls_all_event.filter(
                event_id__in=agg_hhc_event_plan_of_care.objects.filter(hosp_id=hospital_id).values_list('eve_id', flat=True)
            )
        ts_eve_ids = ts_all_event.values_list('event_id', flat=True)
        ts_all_eves = list(set(ts_eve_ids))
        ts_enq_id = []
        for i in ts_all_eves:
            ts_get_enq = ts_all_event.filter(event_id=i).order_by('last_modified_date').last()
            ts_enq_id.append(ts_get_enq.enq_follow_up_id)
        ts_all_follow_up_enq = ts_all_event.filter(enq_follow_up_id__in=ts_enq_id)
        ts_four = ts_all_follow_up_enq.filter(follow_up=4)

# ----------------- today
    
        td_all_event = agg_hhc_enquiry_follow_up.objects.filter(last_modified_date__gte=start_of_day,follow_up_status=1)
        if hospital_id:
            ls_all_event = ls_all_event.filter(
                event_id__in=agg_hhc_event_plan_of_care.objects.filter(hosp_id=hospital_id).values_list('eve_id', flat=True)
            )
        td_eve_ids = td_all_event.values_list('event_id', flat=True)
        td_all_eves = list(set(td_eve_ids))
        td_enq_id = []
        for i in td_all_eves:
            td_get_enq = td_all_event.filter(event_id=i).order_by('last_modified_date').last()
            td_enq_id.append(td_get_enq.enq_follow_up_id)
        td_all_follow_up_enq = td_all_event.filter(enq_follow_up_id__in=td_enq_id)

        td_four = td_all_follow_up_enq.filter(follow_up=4)

    
        return Response({
            'total_pending_today': td_four.count(),
            'total_pending_week': 0,
            'total_pending_month': ts_four.count(),
            'total_pending_last_month': ls_four.count()
            
        }, status=status.HTTP_200_OK)


#chatbot post api

class ChatbotConversationView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ChatbotConversationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class Get_Coupons(APIView):
    def get(self, request):

        coupon = agg_Discount_Coupon_Code.objects.filter(status=1)
        coupons=CouponSerializer(coupon, many=True)
        return Response(coupons.data)


class Send_casgfree_link_in_whatsapp(APIView):
    def post(self, request):
        base_url = "xl6mjq.api-in.infobip.com"
        api_key = "af099554a7f804d8fd234e3226241101-da0d6970-19a8-4e0a-9154-9da1fb64d858"  # Replace with your actual API key
        from_number = "918956193883"
        to_number = request.data.get('to_number', '')
        template_name = "cashfree_payment"
        placeholders = request.data.get('placeholders', [])
        order_id = "SPERO_W_ID" + timezone.now().strftime("%d%m%Y%H%M%S")

        if not to_number:
            return Response({"error": "Destination number is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not placeholders:
            return Response({"error": "Placeholders are required"}, status=status.HTTP_400_BAD_REQUEST)

        payload = json.dumps({
            "messages": [
                {
                    "from": from_number,
                    "to": to_number,
                    "messageId": order_id,
                    "content": {
                        "templateName": template_name,
                        "templateData": {
                            "body": {
                                "placeholders": placeholders
                            },
                        },
                        "language": "en"
                    }
                }
            ]
        })

        headers = {
            'Authorization': f'App {api_key}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

        conn = http.client.HTTPSConnection(base_url)
        conn.request("POST", "/whatsapp/1/message/template", payload, headers)
        res = conn.getresponse()
        data = res.read()
        conn.close()

        if res.status == 200:
            return Response({"status": "Message sent successfully", "response": json.loads(data.decode("utf-8"))}, status=status.HTTP_200_OK)
        else:
            return Response({"error": data.decode("utf-8")}, status=res.status)
        
        
        
@api_view(['POST'])
def create_payment_url_whatsapp(request):
    url = "https://api.cashfree.com/api/v1/order/create"

    # Auto-generate the order ID date-wise
    # order_id = "order_id_SPERO" + datetime.now().strftime("%d%m%Y%H%M%S")
    order_id = "order_id_SPERO" + timezone.now().strftime("%d%m%Y%H%M%S")
    phone_no = request.data['customerPhone'][-10:]
    ammount = request.data['orderAmount']
    name = request.data['customerName']
    email = request.data['customeremail']
    remaining = request.data['Remaining_amount']

    eve_id = request.data.get('eve_id')
    mode = 3
    payment_status = 3
    total_amount = request.data.get('total_amount')
    expiry_time = (timezone.now() + timedelta(hours=24)).isoformat()

    # print(phone_no)
    payload = {
        "appId": "2045315bd01ed984f26100c6fd135402",
        "secretKey": "5b0b3b4ed9b879b2864796aaf2c320867591e3c4",
        "orderId": order_id,
        "orderAmount": ammount,
        "Remainingamount":remaining,
        "orderCurrency": "INR",
        "orderNote": "HII",
        "customerName": name,
        "customeremail": email,
        "customerPhone": phone_no,
        "link_expiry_time": expiry_time, 
        
    }

    response = requests.request("POST", url, data=payload)
    s = response.text
    json_acceptable_string = s.replace("'", "\"")
    d = json.loads(json_acceptable_string)

    # Assuming the response contains the payment link and payment status, you can extract them from the response.
    payment_link = d.get('paymentLink')
    
    whatsapp_api_key = "af099554a7f804d8fd234e3226241101-da0d6970-19a8-4e0a-9154-9da1fb64d858"
    from_number = "918956193883"
    to_number = f"91{phone_no}"
    template_name = "cashfree_payment"
    order_id = "order_id_SPERO" + timezone.now().strftime("%d%m%Y%H%M%S")

    whatsapp_payload = json.dumps({
        "messages": [
            {
                "from": from_number,
                "to": to_number,
                "messageId": order_id,
                "content": {
                    "templateName": template_name,
                    "templateData": {
                        "body": {
                            "placeholders": [ammount, payment_link]
                        },
                    },
                    "language": "en"
                }
            }
        ]
    })

    whatsapp_headers = {
        'Authorization': f'App {whatsapp_api_key}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    base_url = "xl6mjq.api-in.infobip.com"
    conn = http.client.HTTPSConnection(base_url)
    conn.request("POST", "/whatsapp/1/message/template", whatsapp_payload, whatsapp_headers)
    res = conn.getresponse()
    data = res.read()
    conn.close()

    if res.status != 200:
        return Response({"error": data.decode("utf-8")}, status=res.status)


    api_key = "c27d7fa6-292c-4534-8dc4-a0dd28e7d7e3"
    unique_identifier = re.search(r'#([^/]*)', payment_link).group(1)
    fixed_msg_part = "this is your payment link: https://payments.cashfree.com/order/"

    smstmp = f'Spero Healthcare Innovations Pvt.Ltd is requesting payment of INR {ammount}. Click on this link to pay-: https://payments.cashfree.com/order/#{unique_identifier}'
    send_payment_sms(phone_no, smstmp)
    
    # msg = f"Spero Healthcare Innovations Pvt.Ltd is requesting payment of INR {ammount}.Click on this link to pay-: {payment_link}"
    msg = f"Spero Healthcare Innovations Pvt.Ltd is requesting payment of INR {ammount}.Click on this link to pay-: {payment_link}"
    # Properly encode the content parameter for the WhatsApp API request
    encoded_msg = quote(msg)
    
    url = f"https://wa.chatmybot.in/gateway/waunofficial/v1/api/v1/sendmessage?access-token={api_key}&phone={phone_no}&content={encoded_msg}&fileName&caption&contentType=1"
    
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for 4xx and 5xx status codes
    except requests.exceptions.RequestException as e:
        print("Error occurred while hitting the URL:", e)




    event_instance = agg_hhc_events.objects.get(eve_id=eve_id)


    # Save payment record to the database
    payment_record = agg_hhc_cashfree_online_payment.objects.create(
        order_id=order_id,
        amount_paid=payload['orderAmount'],
        amount_remaining=payload['Remainingamount'],
        Total_cost=total_amount,
        order_currency=payload['orderCurrency'],
        order_note=payload['orderNote'],
        paid_by=payload['customerName'],
        customer_email=payload['customeremail'],
        customer_phone=payload['customerPhone'],
        # transaction_status=transaction_status,
        # signature=computed_signature,
        eve_id=event_instance,
        mode=mode,
        payment_status=payment_status,

    )

    # Return the payment link and payment status in the API response
    data = {
        'payment_link': payment_link,
    }
    return Response(data)



#----------------------------------------------Payment----------------------------------------------------
import requests
from urllib.parse import quote  # Import the quote function for URL encoding
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
import re 
# from .models import PaymentRecord  # Import the PaymentRecord model
@api_view(['POST'])
def create_link(request):
    url = "https://api.cashfree.com/api/v1/order/create"

    # Auto-generate the order ID date-wise
    # order_id = "order_id_SPERO" + datetime.now().strftime("%d%m%Y%H%M%S")
    order_id = "order_id_SPERO" + timezone.now().strftime("%d%m%Y%H%M%S")
    phone_no = request.data['customerPhone'][-10:]
    ammount = request.data['orderAmount']
    name = request.data['customerName']
    email = request.data['customeremail']
    remaining = request.data['Remaining_amount']

    eve_id = request.data.get('eve_id')
    mode = 3
    payment_status = 3
    total_amount = request.data.get('total_amount')
    # expiration_time = timezone.now() + timezone.timedelta(minutes=5)

    # print(phone_no)
    payload = {
        "appId": "2045315bd01ed984f26100c6fd135402",
        "secretKey": "5b0b3b4ed9b879b2864796aaf2c320867591e3c4",
        "orderId": order_id,
        "orderAmount": ammount,
        "Remainingamount":remaining,
        "orderCurrency": "INR",
        "orderNote": "HII",
        "customerName": name,
        "customeremail": email,
        "customerPhone": phone_no,  
        # "returnUrl": "https://payments-test.cashfree.com/links/response",  
        # "notifyUrl": "https://hhc.hospitalguru.in/web/update_transaction_status/",
        # "expTime": int(expiration_time.timestamp()),  # Convert expiration_time to timestamp
    }

    response = requests.request("POST", url, data=payload)
    s = response.text
    json_acceptable_string = s.replace("'", "\"")
    d = json.loads(json_acceptable_string)

    # Assuming the response contains the payment link and payment status, you can extract them from the response.
    payment_link = d.get('paymentLink')

    # Send the payment link via SMS using Cashfree's SMS API
    # sms_url = "https://sandbox.cashfree.com/api/v1/sms"
    # sms_payload = {
    #     "appId": "2045315bd01ed984f26100c6fd135402",
    #     "secretKey": "5b0b3b4ed9b879b2864796aaf2c320867591e3c4",
    #     "to": phone_no,
    #     "message": f"Hello {name},\n\nPlease find the payment link below:\n\n{payment_link}",
    #     "sender": "CFPG",
    #     "type": "OTP"
    # }
    # sms_response = requests.request("POST", sms_url, data=sms_payload)
    # sms_d = json.loads(sms_response.text)
    
    # sms_url = " https://api.cashfree.com/pg/links"
    # sms_payload = {
    #     "x-client-id": "20453165a737ebd97e430fcabc135402",
    #     "x-client-secret": "cfsk_ma_prod_172c08ceff37119b1cf5ff4fa593b4bd_a2adc215",
    #     "customerPhone": phone_no,
    #     "send_sms": True,
    #     "message": f"Spero Healthcare Innovations Pvt.Ltd is requesting payment of INR {ammount}.Click on this link to pay-:{payment_link}"
    # }

    # sms_response = requests.post(sms_url, json=sms_payload)

    # # Print the SMS API response
    # print("SMS API response:", sms_response.text)

    # # Parse the response JSON
    # try:
    #     sms_d = sms_response.json()
    # except json.JSONDecodeError:
    #     sms_d = {"status": sms_response.text}

    api_key = "c27d7fa6-292c-4534-8dc4-a0dd28e7d7e3"
    unique_identifier = re.search(r'#([^/]*)', payment_link).group(1)
    fixed_msg_part = "this is your payment link: https://payments.cashfree.com/order/"

    smstmp = f'Spero Healthcare Innovations Pvt.Ltd is requesting payment of INR {ammount}. Click on this link to pay-: https://payments.cashfree.com/order/#{unique_identifier}'
    send_payment_sms(phone_no, smstmp)
    
    # msg = f"Spero Healthcare Innovations Pvt.Ltd is requesting payment of INR {ammount}.Click on this link to pay-: {payment_link}"
    msg = f"Spero Healthcare Innovations Pvt.Ltd is requesting payment of INR {ammount}.Click on this link to pay-: {payment_link}"
    # Properly encode the content parameter for the WhatsApp API request
    encoded_msg = quote(msg)
    
    url = f"https://wa.chatmybot.in/gateway/waunofficial/v1/api/v1/sendmessage?access-token={api_key}&phone={phone_no}&content={encoded_msg}&fileName&caption&contentType=1"
    
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for 4xx and 5xx status codes
        # print("URL successfully hit!")
        # print("WhatsApp API Response:", response.text)
    except requests.exceptions.RequestException as e:
        print("Error occurred while hitting the URL:", e)

    # ... Your existing code ...
    # transaction_status = d.get('paymentStatus') if d else None


    event_instance = agg_hhc_events.objects.get(eve_id=eve_id)


    # Save payment record to the database
    payment_record = agg_hhc_cashfree_online_payment.objects.create(
        order_id=order_id,
        amount_paid=payload['orderAmount'],
        amount_remaining=payload['Remainingamount'],
        Total_cost=total_amount,
        order_currency=payload['orderCurrency'],
        order_note=payload['orderNote'],
        paid_by=payload['customerName'],
        customer_email=payload['customeremail'],
        customer_phone=payload['customerPhone'],
        # transaction_status=transaction_status,
        # signature=computed_signature,
        eve_id=event_instance,
        mode=mode,
        payment_status=payment_status,

    )

    # Return the payment link and payment status in the API response
    data = {
        'payment_link': payment_link,
        # 'SMS': sms_d.get("status"),
        # 'payload_json':payload_json
    }
    return Response(data)





@api_view(['POST'])
def create_payment_url_sms_new(request):
    url = "https://api.cashfree.com/api/v1/order/create"

    # Auto-generate the order ID date-wise
    # order_id = "order_id_SPERO" + datetime.now().strftime("%d%m%Y%H%M%S")
    order_id = "order_id_SPERO" + timezone.now().strftime("%d%m%Y%H%M%S")
    phone_no = request.data['customerPhone'][-10:]
    ammount = request.data['orderAmount']
    name = request.data['customerName']
    email = request.data['customeremail']
    remaining = request.data['Remaining_amount']

    eve_id = request.data.get('eve_id')
    mode = 3
    payment_status = 3
    total_amount = request.data.get('total_amount')
    # expiration_time = timezone.now() + timezone.timedelta(minutes=5)

    # print(phone_no)
    payload = {
        "appId": "2045315bd01ed984f26100c6fd135402",
        "secretKey": "5b0b3b4ed9b879b2864796aaf2c320867591e3c4",
        "orderId": order_id,
        "orderAmount": ammount,
        "Remainingamount":remaining,
        "orderCurrency": "INR",
        "orderNote": "HII",
        "customerName": name,
        "customeremail": email,
        "customerPhone": phone_no,  
        # "returnUrl": "https://payments-test.cashfree.com/links/response",  
        # "notifyUrl": "https://hhc.hospitalguru.in/web/update_transaction_status/",
        # "expTime": int(expiration_time.timestamp()),  # Convert expiration_time to timestamp
    }

    response = requests.request("POST", url, data=payload)
    s = response.text
    json_acceptable_string = s.replace("'", "\"")
    d = json.loads(json_acceptable_string)

    # Assuming the response contains the payment link and payment status, you can extract them from the response.
    payment_link = d.get('paymentLink')

    # Send the payment link via SMS using Cashfree's SMS API
    # sms_url = "https://sandbox.cashfree.com/api/v1/sms"
    # sms_payload = {
    #     "appId": "2045315bd01ed984f26100c6fd135402",
    #     "secretKey": "5b0b3b4ed9b879b2864796aaf2c320867591e3c4",
    #     "to": phone_no,
    #     "message": f"Hello {name},\n\nPlease find the payment link below:\n\n{payment_link}",
    #     "sender": "CFPG",
    #     "type": "OTP"
    # }
    # sms_response = requests.request("POST", sms_url, data=sms_payload)
    # sms_d = json.loads(sms_response.text)
    
    # sms_url = " https://api.cashfree.com/pg/links"
    # sms_payload = {
    #     "x-client-id": "20453165a737ebd97e430fcabc135402",
    #     "x-client-secret": "cfsk_ma_prod_172c08ceff37119b1cf5ff4fa593b4bd_a2adc215",
    #     "customerPhone": phone_no,
    #     "send_sms": True,
    #     "message": f"Spero Healthcare Innovations Pvt.Ltd is requesting payment of INR {ammount}.Click on this link to pay-:{payment_link}"
    # }

    # sms_response = requests.post(sms_url, json=sms_payload)

    # # Print the SMS API response
    # print("SMS API response:", sms_response.text)

    # # Parse the response JSON
    # try:
    #     sms_d = sms_response.json()
    # except json.JSONDecodeError:
    #     sms_d = {"status": sms_response.text}

    api_key = "c27d7fa6-292c-4534-8dc4-a0dd28e7d7e3"
    # unique_identifier = re.search(r'(pg/view/sessions/checkout/web/)', payment_link).group(1)
    session_id = re.search(r'web/([^/]*)', payment_link).group(1)
    fixed_msg_part = "this is your payment link: https://payments.cashfree.com/order/"

    print("link2:", session_id)

    smstmp = f'Spero Healthcare Innovations Pvt.Ltd is requesting payment of INR {ammount}. Click on this link to pay-: https://api.cashfree.com/pg/view/sessions/checkout/web/{session_id}'
    send_payment_sms(phone_no, smstmp)
    
    # msg = f"Spero Healthcare Innovations Pvt.Ltd is requesting payment of INR {ammount}.Click on this link to pay-: {payment_link}"
    msg = f"Spero Healthcare Innovations Pvt.Ltd is requesting payment of INR {ammount}.Click on this link to pay-: {payment_link}"
    # Properly encode the content parameter for the WhatsApp API request
    encoded_msg = quote(msg)
    
    url = f"https://wa.chatmybot.in/gateway/waunofficial/v1/api/v1/sendmessage?access-token={api_key}&phone={phone_no}&content={encoded_msg}&fileName&caption&contentType=1"
    
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for 4xx and 5xx status codes
        # print("URL successfully hit!")
        # print("WhatsApp API Response:", response.text)
    except requests.exceptions.RequestException as e:
        print("Error occurred while hitting the URL:", e)

    # ... Your existing code ...
    # transaction_status = d.get('paymentStatus') if d else None


    event_instance = agg_hhc_events.objects.get(eve_id=eve_id)


    # Save payment record to the database
    payment_record = agg_hhc_cashfree_online_payment.objects.create(
        order_id=order_id,
        amount_paid=payload['orderAmount'],
        amount_remaining=payload['Remainingamount'],
        Total_cost=total_amount,
        order_currency=payload['orderCurrency'],
        order_note=payload['orderNote'],
        paid_by=payload['customerName'],
        customer_email=payload['customeremail'],
        customer_phone=payload['customerPhone'],
        # transaction_status=transaction_status,
        # signature=computed_signature,
        eve_id=event_instance,
        mode=mode,
        payment_status=payment_status,

    )

    # Return the payment link and payment status in the API response
    data = {
        'payment_link': payment_link,
        # 'SMS': sms_d.get("status"),
        # 'payload_json':payload_json
    }
    return Response(data)
