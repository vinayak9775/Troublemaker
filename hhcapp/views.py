from django.shortcuts import render
# from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime, timedelta
import requests,random,pytz,io
from hhcweb import models as webmodels
from rest_framework.parsers import JSONParser
from hhcspero.settings import AUTH_KEY
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.utils import timezone
from django.core.cache import cache
from . serializer import *
from hhc_professional_app.views import get_prof
from hhc_professional_app.renders import UserRenderer
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from django.db.models import Q
import http



##################################################### Whatsapp otp function ##################################

def whatsapp_sms(to_number,template_name,placeholders):
    base_url = "xl6mjq.api-in.infobip.com"
    api_key = "af099554a7f804d8fd234e3226241101-da0d6970-19a8-4e0a-9154-9da1fb64d858"  # Replace with your actual API key
    from_number = "918956193883"
    to_number = to_number
    template_name = template_name#"professional_name_sms"
    placeholders = placeholders#request.data.get('placeholders', [])
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
    
################################################ Whatsapp otp function Ends  ##############################################


def cancellation_charges(event_id):
    try:
        event_plan_care_data=webmodels.agg_hhc_event_plan_of_care.objects.get(eve_id=event_id,status=1)
        start_date_is = datetime.combine(event_plan_care_data.start_date,event_plan_care_data.start_time)
        print("this is start date ",start_date_is)
        print("this is now date",datetime.now())
        today=start_date_is-datetime.now()
        print("date after calculation",today.total_seconds() // 3600)
        if (today.total_seconds() // 3600>=48):
            return 0
        else:
            return 200
    except:
        return 0


def send_otp(mobile,msg):
    url=(f"https://wa.chatmybot.in/gateway/waunofficial/v1/api/v1/sendmessage?access-token={AUTH_KEY}&phone={mobile}&content={msg}&fileName&caption&contentType=1")
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for 4xx and 5xx status codes
        # print("URL successfully hit!")
    except requests.exceptions.RequestException as e:
        print("Error occurred while hitting the URL:", e)

class agg_hhc_callers_register_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self,request):
        caller_id =get_prof(request)[2]
        print("caller id-- ", caller_id)
        try:
            request.data['last_modified_date']=timezone.now()
            request.data['last_modified_by']=get_prof(request)[1]
            caller=webmodels.agg_hhc_callers.objects.get(caller_id=caller_id)
        except:
            return Response({"error":"This caller not Found"})
        request.data['caller_fullname']=request.data.get('first_name')+" "+request.data.get('last_name')
        print("full name of caller is ",request.data.get('caller_fullname'))
        request.data['state']=request.data.get('state_id')
        register=agg_hhc_callers_Serializer(caller,data=request.data)
        if register.is_valid():
            r=register.save()
            request.data['caller_id']=r.caller_id
            address_serializer=multiple_address_serializer(data=request.data)
            if address_serializer.is_valid():
                address_serializer.save()
                return Response(register.data,status=status.HTTP_201_CREATED)
            return Response({"error":register.errors},status=status.HTTP_400_BAD_REQUEST)
        return Response({"error":register.errors},status=status.HTTP_400_BAD_REQUEST)
    def get(self,request):
        caller_id =get_prof(request)[2]
        reg=webmodels.agg_hhc_callers.objects.get(caller_id=caller_id)
        image_is=None
        cors_allowed_origins = getattr(settings, 'CORS_ALLOWED_ORIGINS', [])
        if reg.profile_pic:
            image_is=str(cors_allowed_origins[1])+"/media/"+str(reg.profile_pic)
        # ref=agg_hhc_callers_Serializer(reg)
        return Response({'caller_id':reg.caller_id,'phone':reg.phone,'caller_fullname':reg.caller_fullname,'Age':reg.Age,'email':reg.email,'profile_pic':image_is})
    
class caller_profile_pic(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user_id=get_prof(request)[2]
        try:
            caller=webmodels.agg_hhc_callers.objects.get(caller_id=user_id)
            image_is=None
            cors_allowed_origins = getattr(settings, 'CORS_ALLOWED_ORIGINS', [])
            if caller.profile_pic:
                image_is=str(cors_allowed_origins[1])+"/media/"+str(caller.profile_pic)
            # img_serializer=agg_hhc_callers_Serializer(caller)
        except Exception:
            return Response({"error":"No Caller found"},status=status.HTTP_404_NOT_FOUND)
        return Response({"profile_pic":image_is})
    def post(self,request):
        user_id=get_prof(request)[2]
        try:
            request.data['last_modified_date']=timezone.now()
            request.data['last_modified_by']=get_prof(request)[1]
            caller=webmodels.agg_hhc_callers.objects.get(caller_id=user_id)
        except Exception:
            return Response({"error":"No Caller found"},status=status.HTTP_404_NOT_FOUND)        
        img_serializer=agg_hhc_callers_Serializer(caller,data=request.data)
        if img_serializer.is_valid():
            img_serializer.save()
            return Response({"profile_pic":img_serializer.data.get('profile_pic')})
        return Response({"error":img_serializer.errors},status=status.HTTP_400_BAD_REQUEST)



class agg_hhc_app_services_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        event=[]
        call=webmodels.agg_hhc_services.objects.filter(status=1)
        # service=agg_hhc_app_services_serializer(call,many=True)
        cors_allowed_origins = getattr(settings, 'CORS_ALLOWED_ORIGINS', [])
        for i in call:
            image_file=None
            if i.image_path:
                image_file=str(cors_allowed_origins[1])+"/media/"+str(i.image_path)
            even = {'srv_id': i.srv_id,'service_title': i.service_title,'discription': i.discription,'image_path':image_file}
            event.append(even)
        # return Response(service.data)
        return Response({'data':event})

class add_family_member(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self,request):
        user_id=get_prof(request)[2]
        request.data['caller_id']=user_id
        request.data['name']=request.data.get('first_name')+" "+request.data.get('last_name')
        request.data['last_modified_by']=get_prof(request)[1]
        request.data['last_modified_date']=timezone.now()
        serilized =agg_hhc_patient_serializer(data = request.data)
        if serilized.is_valid():
            serilized.save()
            return Response({'data':serilized.data}, status=status.HTTP_201_CREATED)
        return Response({'error':serilized.errors},status=status.HTTP_400_BAD_REQUEST)
    def get(self,request):
        user_id=get_prof(request)[2]
        patients=webmodels.agg_hhc_patients.objects.filter(caller_id=user_id,status=1).order_by("name")
        patient_serialize=agg_hhc_patient_serializer(patients,many=True)
        return Response({'data':patient_serialize.data})

class get_family_list(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user_id=get_prof(request)[2]
        patients=webmodels.agg_hhc_patients.objects.filter(caller_id=user_id,status=1).order_by("name")
        patient_serialize=agg_hhc_patient_serializer(patients,many=True)
        caller=webmodels.agg_hhc_callers.objects.get(caller_id=user_id)
        if caller.service_taken==2:
            new_record = {"agg_sp_pt_id":0,"name": "Self"}
            patient_serialize_list=patient_serialize.data+[new_record]
        else:
            patient_serialize_list=patient_serialize.data
        return Response({'data':patient_serialize_list})


class add_multiple_address_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self,request):
        try:
            caller_id =get_prof(request)[2]
            request.data['caller_id']=caller_id
            serilized =add_multiple_address_serializer(data = request.data)
            # print(serilized)
            if serilized.is_valid():
                serilized.save()
                return Response({'address_list':serilized.data}, status=status.HTTP_201_CREATED)
            return Response({'address_list':serilized.errors},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"address_list":str(e)},status=status.HTTP_400_BAD_REQUEST)
    # def get(self,request):
    #         address_list=[]
    #         caller_id =get_prof(request)[2]
    #         callers_record=webmodels.agg_hhc_app_add_address.objects.filter(caller_id=caller_id,status=1)
    #         print(callers_record)
    #         for i in callers_record:
    #             print(i)
    #             all_address={'address_id':i.address_id,'address':i.address,'pincode':i.pincode,'locality':i.locality,'google_address':i.google_address,'zone':i.prof_zone_id.Name,'state':i.state_id.state_name,'city':i.city_id.city_name}
    #             address_list.append(all_address)
    #         return Response({'address_list':address_list})
    
    def get(self, request):
        address_list = []
        caller_id = get_prof(request)[2]
        callers_record = webmodels.agg_hhc_app_add_address.objects.filter(caller_id=caller_id, status=1)
        print(callers_record)
        for i in callers_record:
            print(i)
            zone_name = i.prof_zone_id.Name if i.prof_zone_id else None
            all_address = {
                'address_id': i.address_id,
                'address': i.address,
                'pincode': i.pincode,
                'locality': i.locality,
                'google_address': i.google_address,
                'zone': zone_name,
                'state': i.state_id.state_name,
                'city': i.city_id.city_name
            }
            address_list.append(all_address)
        return Response({'address_list': address_list})


################################################_______get patients record from caller id____###############    
class agg_hhc_app_patient_by_caller_api(APIView):
    def get_object(self,pk):
        try:
            #print("this is my id ",pk)
            #print("this is my data",webmodelss.agg_hhc_patients.objects.filter(caller_id=pk))
            return webmodels.agg_hhc_patients.objects.filter(caller_id=pk,status=1)
        except webmodels.agg_hhc_patients.DoesNotExist:
            raise status.HTTP_404_NOT_FOUND
    def get(self, request, pk, format=None):
        #print("this is inside get",pk)
        snippet= self.get_object(pk)
        serialized =agg_hhc_app_patient_by_caller_id(snippet,many=True)
        return Response(serialized.data)
    

#####____________________get All Address from caller id_____________####
class agg_hhc_app_address_by_caller_api(APIView):
    def get_object(self,pk):
        try:
            return  
        except webmodels.agg_hhc_app_add_address.DoesNotExist:
            raise status.HTTP_404_NOT_FOUND
    def get(self,request,pk,format=None):
        address=self.get_object(pk)
        serialized=agg_hhc_app_address_by_caller_id(address,many=True) 
        return Response(serialized.data) 
    
###_____________________get All Address from caller id_____________####
class agg_hhc_app_address_by_caller_api(APIView):
    def get_object(self,pk):
        try:
            return webmodels.agg_hhc_app_add_address.objects.filter(app_call_reg_id=pk)
        except webmodels.agg_hhc_app_add_address.DoesNotExist:
            raise status.HTTP_404_NOT_FOUND
    def get(self,request,pk,format=None):
        address=self.get_object(pk)
        serialized=agg_hhc_app_address_by_caller_id(address,many=True) 
        return Response(serialized.data)

class agg_hhc_app_befered_by(APIView):
    
    def get(self,request):
        hospitals=webmodels.agg_hhc_hospitals.objects.filter(status=1)
        serializers=agg_hhc_app_refered_by_serializer(hospitals,many=True)
        return Response(serializers.data)
    
class agg_hhc_app_prefered_consultant(APIView):

    def get(self, request):
        consultants = webmodels.agg_hhc_doctors_consultants.objects.filter(status=1)
        serializers=agg_hhc_prefered_consultants_serializer(consultants, many=True)
        return Response(serializers.data)

# class agg_hhc_app_
###____________________________put_request_agg_hhc_callers_________###
class agg_hhc_callers_put_api(APIView):
    def get_object(self,pk):
        try:
            return webmodels.agg_hhc_callers.objects.get(caller_id=pk)
        except webmodels.agg_hhc_callers.DoesNotExist:
            return status.HTTP_400_BAD_REQUEST
    def put(self,request,pk,format=None):
        record=self.get_object(pk)
        serialized=agg_hhc_callers_Serializer(record,data=request.data)
        if(serialized.is_valid()):
            serialized.save()
            return Response(serialized.data)
        return Response(serialized.errors,status=status.HTTP_400_BAD_REQUEST)
    def get(self,request,pk):
        record=self.get_object(pk)
        serialized=agg_hhc_callers_Serializer(record)
        return Response(serialized.data)

#__________________________________state api________________

class agg_hhc_state_api(APIView):
    def get(self,request):
        state=webmodels.agg_hhc_state.objects.all()
        serialized=agg_hhc_state_serializer(state,many=True)
        return Response(serialized.data)
    

class agg_hhc_app_address_get_put_delete_api(APIView):
    def get_object(self,pk):
        try:
            return webmodels.agg_hhc_app_add_address.objects.get(address_id=pk)
        except webmodels.agg_hhc_app_add_address.DoesNotExist:
            raise status.HTTP_404_NOT_FOUND
    def get(self,request,pk,format=None):
        address=self.get_object(pk)
        serialized=add_multiple_address_serializer(address) 
        return Response(serialized.data)
    def put(self,request,pk,format=None):
        record=self.get_object(pk)
        serialized=add_multiple_address_serializer(record,data=request.data)
        if(serialized.is_valid()):
            serialized.save()
            return Response(serialized.data)
        return Response(serialized.errors,status=status.HTTP_400_BAD_REQUEST)
    def delete(self,request,pk,format=None):
        record = self.get_object(pk)
        record.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    


# class agg_hhc_sub_services_from_service(APIView):
#     def get_object(self,pk):
#         try:
#             return webmodels.agg_hhc_sub_services.objects.filter(srv_id=pk)
#         except webmodels.agg_hhc_sub_services.DoesNotExist:
#             raise status.HTTP_404_NOT_FOUND
#     def get(self,request,pk,format=None):
#         record=self.get_object(pk)
#         serialized=agg_hhc_sub_services_serializer(record,many=True)
#         return Response(serialized.data)
        
class agg_hhc_patient_doc_detail(APIView):
    def post(self,request):
        # print(request.data)
        serilized = agg_hhc_patient_doc_details_serializer(data = request.data)
        # print(serilized)
        if serilized.is_valid():
            serilized.save()
            return Response(serilized.data, status=status.HTTP_201_CREATED)
        return Response(serilized.errors,status=status.HTTP_400_BAD_REQUEST)

#__________________________________OTP API_________________________________________________
def send_otp(mobile,otp):
    msg = f"Use {otp} as your verification code on Spero Application. The OTP expires within 10 mins, {otp} Team Spero"
    url=(f"https://wa.chatmybot.in/gateway/waunofficial/v1/api/v1/sendmessage?access-token={AUTH_KEY}&phone={mobile}&content={msg}&fileName&caption&contentType=1")
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for 4xx and 5xx status codes
        # print("URL successfully hit!")
    except requests.exceptions.RequestException as e:
        print("Error occurred while hitting the URL:", e)

# class VerifyPhoneNo(APIView):
#     def post(self, request):
#         number=request.body
#         otp=str(random.randint(1000 , 9999))
#         ja=io.BytesIO(number)
#         da=JSONParser().parse(ja)
#         user_available=webmodels.agg_hhc_callers.objects.filter(caller_id=da['caller_id']).first()
#         if(user_available):
#             # print(user_available)
#             send_otp(da['caller_id'], otp)
#             return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
#         else:
#             webmodels.agg_hhc_callers.objects.create(caller_id=da['caller_id'],otp=otp)
#             se=serializer.CreatePhoneNo(data=da)
#             send_otp(da['caller_id'], otp)
#             return Response(status=status.HTTP_201_CREATED)
        
# class VerifyOTPAPIView(APIView):
#     def get_object(self, pk):
#         try:
#             return webmodelss.agg_hhc_callers.objects.get(caller_id=pk)
#         except webmodelss.agg_hhc_callers.DoesNotExist:
#             return None
        
#     def put(self, request, pk):
#         caller = self.get_object(pk)
#         otp = request.data.get('otp')
#         if not caller or not webmodelss.agg_hhc_callers.check_password(caller,otp):
#             return Response(status=status.HTTP_200_OK)
#         else:
#             return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class VerifyPhoneNo(APIView):
    def post(self, request):
        number=request.body
        otp=str(random.randint(1000 , 9999))
        ja=io.BytesIO(number)
        da=JSONParser().parse(ja)
        user_available=webmodels.agg_hhc_callers.objects.filter(caller_id=da['caller_id']).first()
        if(user_available):
            send_otp(da['caller_id'], otp)
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        else:
            webmodels.agg_hhc_callers.objects.create(caller_id=da['caller_id'],otp=otp)
            se=CreatePhoneNo(data=da)
            send_otp(da['caller_id'], otp)
            return Response(status=status.HTTP_201_CREATED)

class ResendOTP(APIView):
    def post(self, request, format=None):
        caller_id = request.data.get('caller_id')
        user = webmodels.agg_hhc_callers.objects.filter(caller_id=caller_id).first()
        if user:
            otp=str(random.randint(1000 , 9999))
            user.otp = otp
            user.save()
            send_otp(caller_id,otp)
            # print(user.otp)
            # user
            # user.save()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        else:
            return Response(status=status.HTTP_204_NO_CONTENT)

class RegisterAPIView(APIView):
    def get_object(self, pk):
        try:
            return webmodels.agg_hhc_callers.objects.get(caller_id=pk)
        except webmodels.agg_hhc_callers.DoesNotExist:
            return None
        
    def put(self, request, pk):
        caller = self.get_object(pk)
        otp = request.data.get('otp')
        if not caller or not webmodels.agg_hhc_callers.check_password(caller,otp): 
            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)  
        if caller is not None:
            serializers = colleagueRegistersSerializer(caller, data=request.data)  
            if serializers.is_valid():
                serializers.save()
                return Response(serializers.data)
            return Response(serializers.errors, status=400)
        return Response({'error': 'Calleague not found.'}, status=404)

    # def put(self, request, pk):
    #     caller = self.get_object(pk)
    #     otp = request.data.get('otp')
    #     if caller is not None:
    #         serializers = serializer.colleagueRegistersSerializer(caller, data=request.data)
    #         if serializers.is_valid():
    #             serializers.save()
    #             return Response(serializers.data)
    #         return Response(serializers.errors, status=400)
    #     return Response({'error': 'Caller not found.'}, status=404)
    
class LoginAPIView(APIView):
    def post(self, request, format=None):

        caller_id = request.data.get('caller_id')
        # password = request.data.get('password')
        otp = request.data.get('otp')
        user = webmodels.agg_hhc_callers.objects.filter(caller_id=caller_id).first()

        if caller_id:
            if cache.get(f'user:{caller_id}:token') is not None:
                return Response({'error': 'You are already logged in'}, status=status.HTTP_400_BAD_REQUEST)

            if not user or not user.check_password(otp):
                return Response({'error': 'user does not exist'}, status=status.HTTP_401_UNAUTHORIZED)
            
            
            user.last_login = timezone.now()  # set last_login field
            user.save()
            
            refresh = RefreshToken.for_user(user)
            response_data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'ref_id':str(caller_id),
                'colleague': {
                    'id': user.id,
                    'first_name': user.fname,
                    'last_name': user.lname,
                    'email': user.email,
                }
            }
            token = str(refresh.access_token)
            cache.set(f'user:{caller_id}:token', token)
            return Response(response_data,status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_204_NO_CONTENT)
        
class LogoutAPIView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            
            # Get the user associated with the refresh token
            user_id = token.payload['user_id']
            user = webmodels.agg_hhc_callers.objects.get(id=user_id)
            
            # Update the last logout time
            user.last_logout = timezone.now()
            user.save()
            
            token.blacklist()
            return Response(status=status.HTTP_200_OK)
        except KeyError:
            return Response({'error': 'No "refresh" token provided in the request body.'},
                            status=status.HTTP_400_BAD_REQUEST)
        except TokenError:
            return Response({'error': 'The provided token is invalid or expired.'},
                            status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({'error': str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
def calculate_days(start_date,end_date):
    start_date = datetime.strptime(str(start_date), '%Y-%m-%d').date()
    end_date = datetime.strptime(str(end_date), '%Y-%m-%d').date()
    if start_date>end_date :
        message=False
        return message
    day = (end_date - start_date).days
    day+=1
    return day 



class create_service(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self,request):
        try:
            request.data['added_by']=get_prof(request)[1]
            # caller=get_prof(request)[2]
            #-----------------------------------------if caller is selecting self option----start----------------------
            if(request.data.get('agg_sp_pt_id')==0):
                caller=webmodels.agg_hhc_callers.objects.get(caller_id=request.data.get('caller_id'))
                print("this is enum",caller.service_taken)
                if caller.service_taken==1:
                    return Response({'message':'select name from list'})
                else:

                    patient=webmodels.agg_hhc_patients.objects.create()
                    patient.save()
                    print(patient.agg_sp_pt_id)
                    request.data["caller_id"]=request.data.get('caller_id')
                    request.data["name"]=caller.caller_fullname
                    request.data["state_id"]=caller.state.state_id
                    request.data["city_id"]=caller.city.city_id
                    request.data["address"]=caller.Address
                    request.data["pincode"]=caller.pincode
                    patient_serializer=agg_hhc_patient_serializer(patient,data=request.data)
                    if(patient_serializer.is_valid()):
                        # patient_serializer.validated_data['phone_no']=int(caller.phone)
                        print("record is saved in data")
                        patient_serializer.save()
                        print("data not getting")
                    print("caller",patient_serializer.data)
                    patient.name=caller.caller_fullname
                    patient.Age=caller.Age
                    patient.gender_id=caller.gender
                    patient.patient_email_id=caller.email
                    patient.phone_no=caller.phone
                    patient.save()
                    ("workoing on api",patient.caller_id)
                    request.data['agg_sp_pt_id']=patient.agg_sp_pt_id
                    caller.service_taken=1
                    caller.save()
            #-----------------------------------------if caller is selecting self option----end----------------------

            total_days=calculate_days(request.data.get("start_date"),request.data.get("end_date"))
            #---------------get address from agg_hhc_app_add_address table and save it to agg_hhc_patient table---- start---
            addres=webmodels.agg_hhc_app_add_address.objects.get(address_id=request.data.get('address_id'))
            patient=webmodels.agg_hhc_patients.objects.get(agg_sp_pt_id=request.data.get("agg_sp_pt_id"))
            patient.address=addres.address
            patient.google_address=addres.google_address
            patient.city_id=addres.city_id
            patient.state_id=addres.state_id
            patient.prof_zone_id=addres.prof_zone_id
            patient.pincode=addres.pincode
            patient.save()
            #---------------get address from agg_hhc_app_add_address table and save it to agg_hhc_patient table---- end---
            if(total_days is False):
                return Response({'error':"select right date"})
            event_data=agg_hhc_event_serializer(data=request.data)
            if(event_data.is_valid()):
                a=event_data.save()
            else:
                return Response({'error':event_data.errors}, status=status.HTTP_400_BAD_REQUEST)
            request.data['eve_id']=a.eve_id
            event_plan_of_care_data=agg_hhc_event_plan_of_care_serializer(data=request.data)
            if(event_plan_of_care_data.is_valid()):
                epc_id=event_plan_of_care_data.save()
            else:
                return Response({'error':event_data.errors}, status=status.HTTP_400_BAD_REQUEST)
            request.data['eve_poc_id']=epc_id.eve_poc_id
            #___________________working or detail event plan _of care
            request.data['actual_StartDate_Time']=datetime.strptime(str(request.data.get("start_date")), '%Y-%m-%d').date()
            request.data['actual_EndDate_Time']=datetime.strptime(str(request.data.get("start_date")), '%Y-%m-%d').date()
            print("this is total days",total_days)
            for i in range(int(total_days)):
                request.data['index_of_Session']=i+1
                request.data['Reason_for_no_serivce']=1
                detail=detail_event_plan_of_care_serializer(data=request.data)
                if (detail.is_valid()):
                    detail.save()
                    request.data['actual_StartDate_Time']=datetime.strptime(str(request.data.get("actual_StartDate_Time")), '%Y-%m-%d').date()+timedelta(days=1)
                    request.data['actual_EndDate_Time']=datetime.strptime(str(request.data.get("actual_EndDate_Time")), '%Y-%m-%d').date()+timedelta(days=1)
            patient_doc_seri=patient_document_serializer(data=request.data)
            if(patient_doc_seri.is_valid()):
                patient_doc_seri.save()
            return Response({"message":"Service created","eve_id":a.eve_id})
        except Exception as e:
            return Response({'message':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

class completed_services(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        caller=get_prof(request)[2]
        # caller=1
        completed_list=[]
        record=webmodels.agg_hhc_events.objects.filter(caller_id=caller,event_status=3,status=1)
        for i in record:
            event_p_c=webmodels.agg_hhc_event_plan_of_care.objects.get(eve_id=i.eve_id)
            event_p_c_serializer=agg_hhc_event_plan_of_care_serializer(event_p_c)
            services_name=webmodels.agg_hhc_services.objects.get(srv_id=event_p_c_serializer.data.get("srv_id")).service_title
            sub_service_name=webmodels.agg_hhc_sub_services.objects.get(sub_srv_id=event_p_c_serializer.data.get("sub_srv_id")).recommomded_service
            patient=webmodels.agg_hhc_events.objects.get(eve_id=i.eve_id).agg_sp_pt_id
            payment_details=webmodels.agg_hhc_payment_details.objects.filter(eve_id=i.eve_id,status=1,overall_status="SUCCESS")

            todays_date=timezone.now().date()
            detail_event_p_c=None
            event_start_date=webmodels.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id,status=1).first().actual_StartDate_Time
            event_end_date=webmodels.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id,status=1).last().actual_StartDate_Time
            if(event_start_date>todays_date):
                detail_event_p_c=webmodels.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id,status=1).first().srv_prof_id
                detail_event_p_c=detail_event_p_c.prof_fullname
            elif(event_end_date<todays_date):
                detail_event_p_c=webmodels.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id,status=1).last().srv_prof_id
                detail_event_p_c=detail_event_p_c.prof_fullname
            else:
                detail_event_p_c=webmodels.agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=todays_date,eve_id=i.eve_id,status=1).last().srv_prof_id
                detail_event_p_c=detail_event_p_c.prof_fullname
       
            paid_amount=0
            for j in payment_details:
                paid_amount+=int(j.amount_paid)
            record={"services_name":services_name,"sub_service_name":sub_service_name,"professional_name":detail_event_p_c,"start_date":str(event_p_c_serializer.data.get("start_date")),"start_time":str(event_p_c_serializer.data.get("start_time")),"end time":str(event_p_c_serializer.data.get("end_time")),"paid_amount":paid_amount,"eve_id":i.eve_id}
            completed_list.append(record)
        return Response({'data':completed_list})
    

class completed_sessions(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,event_id):
        caller=get_prof(request)[2]
        completed_session=[]
        agg_detail_event=webmodels.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=event_id)
        agg_hhc_event_plan=webmodels.agg_hhc_event_plan_of_care.objects.get(eve_id=event_id)
        for i in agg_detail_event:
            if(i.status==1):
                agg_sp_dt_eve_poc_id=i.agg_sp_dt_eve_poc_id
                patient_name=agg_hhc_event_plan.agg_sp_pt_id.name
                service_name=agg_hhc_event_plan.srv_id.service_title
                sub_service_name=agg_hhc_event_plan.sub_srv_id.recommomded_service
                date=str(i.actual_StartDate_Time)
                start_time=str(i.start_time)
                end_time=str(i.end_time)
                record={'agg_sp_dt_eve_poc_id':agg_sp_dt_eve_poc_id,'patient_name':patient_name,'service_name':service_name,'sub_service_name':sub_service_name,'date':date,'start_time':start_time,'end_time':end_time}
                completed_session.append(record)
            else:
                record={}

        return Response({''})

class active_services(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        caller=get_prof(request)[2]
        # caller=1
        completed_list=[]
        event=webmodels.agg_hhc_events.objects.filter(caller_id=caller,status=1,event_status=2)
        for i in event:
            event_p_c=webmodels.agg_hhc_event_plan_of_care.objects.get(eve_id=i.eve_id)
            event_p_c_serializer=agg_hhc_event_plan_of_care_serializer(event_p_c)
            services_name=webmodels.agg_hhc_services.objects.get(srv_id=event_p_c_serializer.data.get("srv_id")).service_title
            sub_service_name=webmodels.agg_hhc_sub_services.objects.get(sub_srv_id=event_p_c_serializer.data.get("sub_srv_id")).recommomded_service
            patient=webmodels.agg_hhc_events.objects.get(eve_id=i.eve_id).agg_sp_pt_id
            payment_details=webmodels.agg_hhc_payment_details.objects.filter(eve_id=i.eve_id,status=1,overall_status="SUCCESS")
            paid_amount=0
            for j in payment_details:
                paid_amount+=int(j.amount_paid)
            todays_date=timezone.now().date()
            print("todays date is ",todays_date)
            detail_event_p_c=None
            event_start_date=webmodels.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id,status=1).first().actual_StartDate_Time
            event_end_date=webmodels.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id,status=1).last().actual_StartDate_Time
            if(event_start_date>todays_date):
                detail_event_p_c=webmodels.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id,status=1).first().srv_prof_id
                detail_event_p_c=detail_event_p_c.prof_fullname
            elif(event_end_date<todays_date):
                detail_event_p_c=webmodels.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id,status=1).last().srv_prof_id
                detail_event_p_c=detail_event_p_c.prof_fullname
            else:
                detail_event_p_c=webmodels.agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=todays_date,eve_id=i.eve_id,status=1).last().srv_prof_id
                detail_event_p_c=detail_event_p_c.prof_fullname
            patient_address=webmodels.agg_hhc_events.objects.get(eve_id=i.eve_id).agg_sp_pt_id
            patient_address=patient_address.address
            record={"services_name":services_name,"sub_service_name":sub_service_name,"patient_name":patient.name,"start_date":event_p_c_serializer.data.get("start_date"),"start_time":event_p_c_serializer.data.get("start_time"),"end time":event_p_c_serializer.data.get("end_time"),"paid_amount":paid_amount,"professional_name":detail_event_p_c,"patient_address":patient_address,"eve_id":i.eve_id}
            completed_list.append(record)
        return Response({'data':completed_list})


class can_services(APIView):
    def get(self,request):
        caller=get_prof(request)[2]
        # caller=1
        try:
            completed_list=[]
            event=webmodels.agg_hhc_events.objects.filter(caller_id=caller,status=2,event_status=2)
            print("after event")
            for i in event:
                try:
                    cancel_event=webmodels.agg_hhc_cancellation_history.objects.filter(event_id=i.eve_id).last()
                    print("cancel_event",cancel_event)
                except Exception as e:
                    cancel_event=None
                if cancel_event!=None:
                    print("event fount")
                    event_p_c=webmodels.agg_hhc_event_plan_of_care.objects.get(eve_id=cancel_event.event_id)
                    print("event fount 1")
                    event_p_c_serializer=agg_hhc_event_plan_of_care_serializer(event_p_c)
                    print("event fount 2")
                    services_name=webmodels.agg_hhc_services.objects.get(srv_id=event_p_c_serializer.data.get("srv_id")).service_title
                    print("event fount 3")
                    sub_service_name=webmodels.agg_hhc_sub_services.objects.get(sub_srv_id=event_p_c_serializer.data.get("sub_srv_id")).recommomded_service
                    print("event fount 4")
                    patient=webmodels.agg_hhc_events.objects.get(eve_id=i.eve_id).agg_sp_pt_id
                    payment_details=webmodels.agg_hhc_payment_details.objects.filter(eve_id=cancel_event.event_id,status=1,overall_status="SUCCESS")
                    paid_amount=0
                    print("payment")
                    for j in payment_details:
                        try:
                            paid_amount+=int(j.amount_paid)
                        except Exception as e:
                            paid_amount+=0
                    print("payment 2")
                    todays_date=timezone.now().date()
                    print("payment 3",i.eve_id)
                    detail_event_p_c=None
                    print("working stoped")
                    event_start_date=webmodels.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id).first().actual_StartDate_Time
                    print("payment 12")
                    event_end_date=webmodels.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id).last().actual_StartDate_Time
                    print("payment 2")
                    if(event_start_date>todays_date):
                        detail_event_p_c=webmodels.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id).first().srv_prof_id
                        detail_event_p_c=detail_event_p_c.prof_fullname
                    elif(event_end_date<todays_date):
                        detail_event_p_c=webmodels.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id).last().srv_prof_id
                        detail_event_p_c=detail_event_p_c.prof_fullname
                    else:
                        detail_event_p_c=webmodels.agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=todays_date,eve_id=i.eve_id).last().srv_prof_id
                        detail_event_p_c=detail_event_p_c.prof_fullname
                    print("dont know")
                    patient_address=webmodels.agg_hhc_events.objects.get(eve_id=i.eve_id).agg_sp_pt_id
                    patient_address=patient_address.address
                    print("payment 4")
                    record={"services_name":services_name,"sub_service_name":sub_service_name,"patient_name":patient.name,"start_date":event_p_c_serializer.data.get("start_date"),"start_time":event_p_c_serializer.data.get("start_time"),"end time":event_p_c_serializer.data.get("end_time"),"paid_amount":paid_amount,"professional_name":detail_event_p_c,"patient_address":patient_address,"eve_id":i.eve_id}
                    completed_list.append(record)
            return Response({'data':completed_list})
        except Exception as e:
            return Response({"data":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class agg_hhc_consultant_api_android(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        consultant= webmodels.agg_hhc_doctors_consultants.objects.filter(status=1).order_by('cons_fullname')
        consultantSerializer= agg_hhc_doctors_consultants_android_serializer(consultant,many=True)
        other={
            "doct_cons_id": 0,
            "cons_fullname": "Other",
            "mobile_no": 0000
            }
        consultants=[other]+list(consultantSerializer.data)

        return Response(consultants)
    






class create_service_new(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self,request, *args, **kwargs):
        try:
            # request.data['added_by']=get_prof(request)[1]
            # caller=get_prof(request)[2]
            a=dict(request.data)
            agg_sp_pt_id=int(a['agg_sp_pt_id'][0])
            caller_id=int(a['caller_id'][0])
            caller=webmodels.agg_hhc_callers.objects.get(caller_id=caller_id)
            print("caller found")
            # return Response({'message':'select name from list'})
            #-----------------------------------------if caller is selecting self option----start----------------------
            if(agg_sp_pt_id==0):
                print("this is enum",caller.service_taken)
                if caller.service_taken==1:
                    print("service taken")
                    return Response({'message':'select name from list'})
                else:
                    patient=webmodels.agg_hhc_patients.objects.create()
                    patient.save()
                    print(patient.agg_sp_pt_id)
                    patient.caller_id=caller
                    patient.name=caller.caller_fullname
                    patient.state_id=caller.state
                    patient.city_id=caller.city
                    patient.address=caller.Address
                    patient.pincode=caller.pincode
                    patient.phone_no=caller.phone
                    patient.Age=caller.Age
                    patient.gender_id=caller.gender
                    patient.patient_email_id=caller.email
                    patient.save()
                    print("new patient created")
                    agg_sp_pt_id=patient.agg_sp_pt_id
                    caller.service_taken=1
                    caller.save()
            #-----------------------------------------if caller is selecting self option----end----------------------

            total_days=calculate_days(request.data.get("start_date"),request.data.get("end_date"))
            print("date calculation done")
            #---------------get address from agg_hhc_app_add_address table and save it to agg_hhc_patient table---- start---
            address_id=int(a['address_id'][0])
            addres=webmodels.agg_hhc_app_add_address.objects.get(address_id=address_id)
            patient=webmodels.agg_hhc_patients.objects.get(agg_sp_pt_id=agg_sp_pt_id)
            patient.address=addres.address
            patient.google_address=addres.google_address
            patient.city_id=addres.city_id
            patient.state_id=addres.state_id
            # patient.prof_zone_id=addres.prof_zone_id
            patient.pincode=addres.pincode
            patient.save()
            print("patient updated")
            #---------------get address from agg_hhc_app_add_address table and save it to agg_hhc_patient table---- end---
            if(total_days is False):
                return Response({'error':"select right dates"})
            event_data=webmodels.agg_hhc_events.objects.create(agg_sp_pt_id=patient,caller_id=caller,Suffered_from=a['Suffered_from'][0],address_id=addres,purp_call_id=int(a['purp_call_id'][0]),enquiry_status=1,Total_cost=int(a['Total_cost'][0]),final_amount=int(a['final_amount'][0]),enq_spero_srv_status=int(a['enq_spero_srv_status'][0]),event_status=int(a['event_status'][0]),refer_by=int(a['refer_by'][0]),patient_service_status=int(a['patient_service_status'][0]))
            event_data.save()
            # request.data['eve_id']=a.eve_id
            service=webmodels.agg_hhc_services.objects.get(srv_id=request.data.get("srv_id"))
            sub_service=webmodels.agg_hhc_sub_services.objects.get(sub_srv_id=request.data.get("sub_srv_id"))
            # def get_dates_between(start_date, end_date):
#-------------------------------------------------------convert date into date list -------------------------------
            dates = []
            start_date = datetime.strptime(request.data.get("start_date"), '%Y-%m-%d')
            end_date = datetime.strptime(request.data.get("end_date"), '%Y-%m-%d')
            current_date=start_date
            while current_date <= end_date:
                dates.append(current_date.strftime('%Y-%m-%d'))
                current_date += timedelta(days=1)
#--------------------------------------------------------convert date into date list end-----------------------------
            if int(a['doct_cons_id'][0])==0:
                event_plan_of_care=webmodels.agg_hhc_event_plan_of_care.objects.create(eve_id=event_data,srv_id=service,sub_srv_id=sub_service,start_date=request.data.get("start_date"),end_date=request.data.get("end_date"),start_time=request.data.get("start_time"),end_time=request.data.get("end_time"),initail_final_amount=request.data.get("initail_final_amount"),serivce_dates=dates)
                event_plan_of_care.save()
            else:
                doctor=webmodels.agg_hhc_doctors_consultants.objects.get(doct_cons_id=request.data.get("doct_cons_id"))
                event_plan_of_care=webmodels.agg_hhc_event_plan_of_care.objects.create(eve_id=event_data,srv_id=service,sub_srv_id=sub_service,doct_cons_id=doctor,start_date=request.data.get("start_date"),end_date=request.data.get("end_date"),start_time=request.data.get("start_time"),end_time=request.data.get("end_time"),initail_final_amount=request.data.get("initail_final_amount"),serivce_dates=dates)
                event_plan_of_care.save()
            print("createdd event plan of care")
            agg_hhc_enquiry_follow_up=webmodels.agg_hhc_enquiry_follow_up.objects.create(event_id=event_data,follow_up=4)
            agg_hhc_enquiry_follow_up.save()
#this is used to store data of question start ----------------------------------------------     
            try:
                if(a['question'][0]=='yes'):
                    print("this is my question list")
                    for i in eval(a['question_list'][0]):
                        iq=webmodels.agg_hhc_job_closure_questions.objects.get(jcq_id=i)
                        webmodels.agg_hhc_events_wise_jc_question.objects.create(eve_id=event_data,srv_id=service,is_srv_enq_q=2,jcq_id=iq)#jcq_id=i
                    print("yes")
            except:
                pass
#this is used to store data of question end   -----------------------------------------
            try:
                discharge_summary=a['discharge_summary'][0]
            except:
                discharge_summary=None
            try:
                prescription=a['prescription'][0]
            except:
                prescription=None
            try:
                lab_reports=a['lab_reports'][0]
            except:
                lab_reports=None
            try:
                dressing=a['dressing'][0]
            except:
                dressing=None
            if(discharge_summary!=None or prescription!=None or lab_reports!=None or dressing!=None):
                patient_doc=webmodels.agg_hhc_patient_documents.objects.create(agg_sp_pt_id=patient,eve_id=event_data,discharge_summary=discharge_summary,prescription=prescription,lab_reports=lab_reports,dressing=dressing)
                patient_doc.save()
            print("agg_hhc_patient_documents")
            return Response({'message':'service created',"eve_id":event_data.eve_id})
        except Exception as e:
            return Response({'message':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# class payment_completed(APIView):
#     renderer_classes = [UserRenderer]
#     permission_classes = [IsAuthenticated]
#     def get(self,request):
#         caller=get_prof(request)[2]
#         completed_payment_list=[]
#         incompleted_payment_list=[]
#         professional_list=[]
#         professional=[]
#         professional_amount={}
#         try:
#             events=webmodels.agg_hhc_events.objects.filter(Q(event_status=2) | Q(event_status=3),Q(enq_spero_srv_status=1)|Q(enq_spero_srv_status=2),caller_id=caller,status=1)
#             for i in events:
#                 eve_id=i.eve_id
#                 Total_amount=int(i.Total_cost)
#                 Final_amount=int(i.final_amount)
#                 discount_type=i.discount_type
#             #_________________________________________________discount type and given discount start__________________
#                 if(i.discount_type==1 or 2):
#                     discount_value=i.discount_value
#                 else:
#                     discount_value=None
#             #_________________________________________________discount type and given discount end__________________
#                 payment_date=None
#                 Tran_number=None
#                 detaile_event_plan_of_care=webmodels.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id,status=1)
#                 total_detaile_eve=webmodels.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id,status=1).count()
#                 per_prof_amount=Final_amount//total_detaile_eve

#                 conveniance_charges=0
#                 sessions=0
#                 for j in detaile_event_plan_of_care:
#                     if j.srv_prof_id !=None:
#                         print("in\t")
#                         if(str(j.srv_prof_id.prof_fullname) in professional_list):
#                             print("n0")
#                         else:
#                             print("in else")
#                             total_services=webmodels.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id,srv_prof_id=j.srv_prof_id,status=1).count()
#                             if j.is_convinance==True:
#                                 con=j.convinance_charges*total_services
#                                 amount=abs((per_prof_amount*total_services)-con)
#                             else:
#                                 amount=per_prof_amount*total_services
#                             professional_amount['service_amount']=per_prof_amount
#                             professional_list.append(str(j.srv_prof_id.prof_fullname))
#                             prof={'professional_name':str(j.srv_prof_id.prof_fullname),'sessions':int(total_services),'amount':amount}
#                             professional.append(prof)
#                     try:
#                         sessions+=1
#                         conveniance_charges=int(j.convinance_charges+conveniance_charges)
#                     except:
#                         conveniance_charges=conveniance_charges
#                 payments=webmodels.agg_hhc_payment_details.objects.filter(eve_id=i.eve_id,status=1,overall_status="SUCCESS").last()
#                 if payments:
#                     print("paid")
#                     amount_paid=int(payments.amount_paid)
#                     amount_remaining=int(payments.amount_remaining)
#                     payment_mode=payments.mode
#                     payment_date=str(payments.added_date)
#                 else:
#                     amount_paid=0
#                     amount_remaining=int(i.final_amount)
#                     payment_mode=None
#                 patient_name=i.agg_sp_pt_id.name
#                 patient_number=i.agg_sp_pt_id.phone_no
#                 patient_address=i.agg_sp_pt_id.address
#                 print("finding event ",i.eve_id)
#                 event_plan_of_care=webmodels.agg_hhc_event_plan_of_care.objects.get(eve_id=i.eve_id)
#                 print("event_plan_of_care.start_date")
#                 event_date=event_plan_of_care.start_date
#                 service_name=event_plan_of_care.srv_id.service_title
#                 sub_service_name=event_plan_of_care.sub_srv_id.recommomded_service
#                 print("service_professional_list",professional_list)
#                 print("professional",professional_amount)
#                 if(amount_remaining<=0):
#                     print("here",i.eve_id)
#                     payment_details={'Total_amount':Total_amount,'Final_amount':Final_amount,'payment_date':payment_date,'payment_mode':payment_mode,'amount_paid':amount_paid,'patient_name':patient_name,'service_name':service_name,'sub_service_name':sub_service_name,'Tran_number':Tran_number,'eve_id':eve_id,'event_code':i.event_code,'event_date':str(event_date),'patient_number':patient_number,'conveniance_charges':conveniance_charges,'sessions':sessions,'patient_address':patient_address,'amount_remaining':amount_remaining,'professional_amount':professional,'discount_value':discount_value,'discount_type':discount_type}#,'professional':professional}
#                     completed_payment_list.append(payment_details)
#                 else:
#                     payment_details={'Total_amount':Total_amount,'Final_amount':Final_amount,'payment_date':payment_date,'payment_mode':payment_mode,'amount_paid':amount_paid,'patient_name':patient_name,'service_name':service_name,'sub_service_name':sub_service_name,'Tran_number':Tran_number,'eve_id':eve_id,'event_code':i.event_code,'event_date':str(event_date),'patient_number':patient_number,'conveniance_charges':conveniance_charges,'sessions':sessions,'patient_address':patient_address,'amount_remaining':amount_remaining,'professional_amount':professional,'discount_value':discount_value,'discount_type':discount_type}#,'professional':professional}   
#                     incompleted_payment_list.append(payment_details)
#             return Response({'data':{"completed_payment_list":completed_payment_list,"incompleted_payment_list":incompleted_payment_list}})
#         except Exception as e:
#             return Response({"data":str(e)})





class payment_completed(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        caller=get_prof(request)[2]
        completed_payment_list=[]
        incompleted_payment_list=[]
        professional_list=[]
        professional=[]
        try:
            events=webmodels.agg_hhc_events.objects.filter(Q(event_status=2) | Q(event_status=3),Q(enq_spero_srv_status=1)|Q(enq_spero_srv_status=2),caller_id=caller,status=1)
            for i in events:
                professional_amount={}
                try:
                    discount_type=i.discount_type
                except Exception as e:
                    discount_type=5
            #_________________________________________________discount type and given discount start__________________
                if(discount_type==1 or 2):
                    discount_value=i.discount_value
                else:
                    discount_value=0
            #_________________________________________________discount type and given discount end__________________
                payment_date=None
                Tran_number=None
                detaile_event_plan_of_care=webmodels.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id,status=1).order_by('actual_StartDate_Time')
                # total_detaile_eve=webmodels.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id,status=1).count()
                # per_prof_amount=Final_amount//total_detaile_eve
                per_prof_amount= int(detaile_event_plan_of_care.last().eve_poc_id.sub_srv_id.cost)

                conveniance_charges=0
                sessions=0
                for j in detaile_event_plan_of_care:
                    if j.srv_prof_id !=None:
                        print("in\t")
                        if(str(j.srv_prof_id.prof_fullname) in professional_list):
                            pass
                        else:
                            print("in else")
                            total_services=webmodels.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id,srv_prof_id=j.srv_prof_id,status=1).count()
                            if j.is_convinance==True:
                                con=j.convinance_charges*total_services
                                # amount=abs((per_prof_amount*total_services)-con)
                                amount=per_prof_amount*total_services#+con
                            else:
                                amount=per_prof_amount*total_services
                            professional_amount['service_amount']=per_prof_amount
                            professional_list.append(str(j.srv_prof_id.prof_fullname))
                            prof={'professional_name':str(j.srv_prof_id.prof_fullname),'sessions':int(total_services),'amount':amount}
                            professional.append(prof)
                    try:
                        sessions+=1
                        conveniance_charges=int(j.convinance_charges+conveniance_charges)
                    except:
                        conveniance_charges=conveniance_charges
                payments=webmodels.agg_hhc_payment_details.objects.filter(eve_id=i.eve_id,status=1,overall_status="SUCCESS").last()
                if payments:
                    print("paid")
                    amount_paid=int(payments.amount_paid)
                    amount_remaining=int(payments.amount_remaining)
                    payment_mode=payments.mode
                    payment_date=str(payments.added_date)
                else:
                    amount_paid=0
                    amount_remaining=int(i.final_amount)
                    payment_mode=None
                event_plan_of_care=webmodels.agg_hhc_event_plan_of_care.objects.get(eve_id=i.eve_id)
                if(amount_remaining<=0):
                    print("here",i.eve_id)
                    payment_details={'Total_amount':int(i.Total_cost),'Final_amount':int(i.final_amount),'payment_date':payment_date,'payment_mode':payment_mode,'amount_paid':amount_paid,'patient_name':i.agg_sp_pt_id.name,'service_name':event_plan_of_care.srv_id.service_title,'sub_service_name':event_plan_of_care.sub_srv_id.recommomded_service,'Tran_number':Tran_number,'eve_id':i.eve_id,'event_code':i.event_code,'event_date':str(event_plan_of_care.start_date),'patient_number':i.agg_sp_pt_id.phone_no,'conveniance_charges':conveniance_charges,'sessions':detaile_event_plan_of_care.count(),'patient_address':i.agg_sp_pt_id.address,'amount_remaining':amount_remaining,'professional_amount':professional,'discount_value':discount_value,'discount_type':discount_type}#,'professional':professional}
                    completed_payment_list.append(payment_details)
                else:
                    payment_details={'Total_amount':int(i.Total_cost),'Final_amount':int(i.final_amount),'payment_date':payment_date,'payment_mode':payment_mode,'amount_paid':amount_paid,'patient_name':i.agg_sp_pt_id.name,'service_name':event_plan_of_care.srv_id.service_title,'sub_service_name':event_plan_of_care.sub_srv_id.recommomded_service,'Tran_number':Tran_number,'eve_id':i.eve_id,'event_code':i.event_code,'event_date':str(event_plan_of_care.start_date),'patient_number':i.agg_sp_pt_id.phone_no,'conveniance_charges':conveniance_charges,'sessions':detaile_event_plan_of_care.count(),'patient_address':i.agg_sp_pt_id.address,'amount_remaining':amount_remaining,'professional_amount':professional,'discount_value':discount_value,'discount_type':discount_type}#,'professional':professional}   
                    incompleted_payment_list.append(payment_details)
            return Response({'data':{"completed_payment_list":completed_payment_list,"incompleted_payment_list":incompleted_payment_list}})
        except Exception as e:
            return Response({"data":str(e)})




class event_status_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def  get(self,request):
        patient_list=[]
        # patient_info={}
        caller=get_prof(request)[2]
        try:
            event=webmodels.agg_hhc_events.objects.filter(caller_id=caller,status=1)
            print(event)
            for i in event:
                cancel_data=webmodels.agg_hhc_cancellation_and_reschedule_request.objects.filter(eve_id=i.eve_id).last()
                if cancel_data:
                    cancel=True
                else:
                    cancel=False
                # try:
                payments=webmodels.agg_hhc_payment_details.objects.filter(eve_id=i.eve_id,status=1,overall_status="SUCCESS").last()
                # except:
                if not payments:
                    try:
                        payment=i.final_amount
                    except:
                        payment=None
                    if payment:
                        if i.event_status==2:
                            eve_status=True
                        else:
                            eve_status=False
                        eve_plan_care=webmodels.agg_hhc_event_plan_of_care.objects.get(eve_id=i.eve_id)
                        address=i.agg_sp_pt_id.address
                        try:
                            service=eve_plan_care.srv_id.service_title
                            sub_service=eve_plan_care.sub_srv_id.recommomded_service
                            start_date=str(eve_plan_care.start_date)
                        except:
                            service=None
                            sub_service=None
                            start_date=None
                        patient_info={'patinet_name':i.agg_sp_pt_id.name,'event_status':eve_status,'payment':payment,'eve_id':i.eve_id,'service_name':service,'sub_service_name':sub_service,'service_date':start_date,'service_location':address,'cancel':cancel}
                        patient_list.append(patient_info)
            return Response({'patient_status':patient_list})
        except Exception as e:
            return Response({'patient_status':str(e)})
        
class event_status_event_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def  get(self,request,event_id):
        patient_list={}
        # patient_info={}
        caller=get_prof(request)[2]
        try:
            event=webmodels.agg_hhc_events.objects.filter(caller_id=caller,status=1,eve_id=event_id)
            
            print(event)
            for i in event:
                cancel_data=webmodels.agg_hhc_cancellation_and_reschedule_request.objects.filter(eve_id=i.eve_id).last()
                if cancel_data:
                    cancel=True
                else:
                    cancel=False
                # try:
                payments=webmodels.agg_hhc_payment_details.objects.filter(eve_id=i.eve_id,status=1,overall_status="SUCCESS").last()
                # except:
                if not payments:
                    try:
                        payment=i.final_amount
                    except:
                        payment=None
                    if payment:
                        if i.event_status==2:
                            eve_status=True
                        else:
                            eve_status=False
                        eve_plan_care=webmodels.agg_hhc_event_plan_of_care.objects.get(eve_id=i.eve_id)
                        address=i.agg_sp_pt_id.address
                        try:
                            service=eve_plan_care.srv_id.service_title
                            sub_service=eve_plan_care.sub_srv_id.recommomded_service
                            start_date=str(eve_plan_care.start_date)
                        except:
                            service=None
                            sub_service=None
                            start_date=None
                        patient_info={'patinet_name':i.agg_sp_pt_id.name,'event_status':eve_status,'payment':payment,'eve_id':i.eve_id,'service_name':service,'sub_service_name':sub_service,'service_date':start_date,'service_location':address,'cancel':cancel}
                        return Response({'patient_status':patient_info})
            return Response({'patient_status':patient_list})
        except Exception as e:
            return Response({'patient_status':str(e)})

class cancellation_service_get_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,event_id):
        caller=get_prof(request)[2]
        try:
            if(event_id):
                print(event_id)
                event=webmodels.agg_hhc_events.objects.get(eve_id=event_id)
                data=webmodels.agg_hhc_event_plan_of_care.objects.get(eve_id=event_id)
                patient_name=event.agg_sp_pt_id.name
                service_name=data.srv_id.service_title
                sub_service_name=data.sub_srv_id.recommomded_service
                eve_id=event.eve_id
                start_date=str(data.start_date)
                final_amount=int(event.final_amount)
                record={'eve_id':eve_id,'patient_name':patient_name,'service_name':service_name,'sub_service_name':sub_service_name,'start_date':start_date,'final_amount':final_amount,'start_time':str(data.start_time),'end_time':str(data.end_time)}
                return Response({'data':record})
            record={}
            return Response({'data':record})
        except Exception as e:
            return Response({'data':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def post(self,request,event_id):
            try:
                caller=get_prof(request)[2]
                # request.data['']
                event=webmodels.agg_hhc_events.objects.filter(eve_id=event_id,caller_id=caller).last()
                if event:
                    request.data['eve_id']=event.eve_id
                    request.data['epoc_id']=webmodels.agg_hhc_event_plan_of_care.objects.get(eve_id=event.eve_id).eve_poc_id
                    request.data['is_srv_sesn']=1
                    cancel_serializer=agg_hhc_cancel_request_serializer(data=request.data)
                    if cancel_serializer.is_valid():
                        cancel_serializer.save()
                        return Response({"data":"cancellation completed"})
                    return Response({"data":serializers.errors}, status=400)
                return Response({"data":"event not found"}, status=400)
            except Exception as e:
                return Response({"data":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class Active_Api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,event_id):
        Completed=[]
        Active=[]
        Cancelled=[]
        # event=webmodels.agg_hhc_events.objects.get(eve_id=event_id)
        eve_plan_ca=webmodels.agg_hhc_event_plan_of_care.objects.get(eve_id=event_id)
        # patient=eve_plan_ca.eve_id.agg_sp_pt_id.name
        service=eve_plan_ca.srv_id.service_title
        detial_eve_plan=webmodels.agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=eve_plan_ca.eve_id)
        for i in detial_eve_plan:
            try:
                professional_name=i.srv_prof_id.prof_fullname
            except:
                professional_name=None
            event={'dt_eve_poc_id':i.agg_sp_dt_eve_poc_id,'professional_name':professional_name,'service':service,'date':str(i.actual_StartDate_Time),'start_time':str(i.start_time),'end_time':str(i.end_time)}
            if(i.status==1 and i.Session_status==9):
                Completed.append(event)
            elif(i.status==1 and i.Session_status==1 or  i.Session_status==3 or i.Session_status==7 or i.Session_status==8):
                if i.Session_status==8:
                    event={'dt_eve_poc_id':i.agg_sp_dt_eve_poc_id,'professional_name':professional_name,'service':service,'date':str(i.actual_StartDate_Time),'start_time':str(i.start_time),'end_time':str(i.end_time),'Active':True}
                else:
                    event={'dt_eve_poc_id':i.agg_sp_dt_eve_poc_id,'professional_name':professional_name,'service':service,'date':str(i.actual_StartDate_Time),'start_time':str(i.start_time),'end_time':str(i.end_time),'Active':False}
                Active.append(event)
            elif(i.status==2):
                Cancelled.append(event)
        return Response({'sessions':{'Completed':Completed,'Active':Active,'Cancelled':Cancelled}})
    

#--------------------------------mayank payment  integration code -------------------------------- 
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
from datetime import datetime, timedelta
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt # mayank

# from .models import agg_hhc_payment_details, agg_hhc_events

def generate_cf_token(order_id, amount, order_currency):
    shame_url = "https://api.cashfree.com/api/v2/cftoken/order"
    app_id = "2045315bd01ed984f26100c6fd135402"
    secret_key = "5b0b3b4ed9b879b2864796aaf2c320867591e3c4"

    payload = {
        "appId": app_id,
        "orderId": order_id,
        "orderAmount": amount,
        "orderCurrency": order_currency,
    }

    headers = {
        "Content-Type": "application/json",
        "x-client-id": app_id,
        "x-client-secret": secret_key,
    }

    response = requests.post(shame_url, data=json.dumps(payload), headers=headers)
    response_data = response.json()

    if response_data["status"] == "OK":
        return response_data["cftoken"]
    else:
        return None
@csrf_exempt
@api_view(['POST'])
def create_cf_token(request):
    order_id = "order_id_SPERO" + timezone.now().strftime("%d%m%Y%H%M%S")
    phone_no = request.data['customerPhone'][-10:]
    amount = request.data['orderAmount']
    name = request.data['customerName']
    email = request.data['customeremail']
    eve_id = request.data.get('eve_id')
    mode = request.data.get('mode')
    total_amount = request.data.get('total_amount')
    app_id = "2045315bd01ed984f26100c6fd135402"


    # expiration_time = datetime.now() + timedelta(minutes=5)

    cf_token = generate_cf_token(order_id=order_id, amount=amount, order_currency="INR")
    event_id=webmodels.agg_hhc_events.objects.get(eve_id=eve_id)
    if cf_token is not None:
        # Save CF token in your database
        payment_record = webmodels.agg_hhc_cashfree_online_payment.objects.create(
            order_id=order_id,
            cf_token=cf_token,
            amount_paid=amount,
            amount_remaining=0,
            Total_cost=total_amount,
            order_currency="INR",
            order_note="HII",
            paid_by=name,
            customer_email=email,
            customer_phone=phone_no,
            eve_id=event_id,
            mode=mode,
        )

        data = {
            'cf_token': cf_token,
            'order_id': order_id,
            'amount': amount,
            'app_id': app_id,
        }
        return Response(data)
    else:
        return Response({'error': 'CF token generation failed'})
    
#--------------------------------------------------------------------mayank payment api ends-----------------------------------------


class professional_details(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,dt_eve_id):
        try:
            detial_eve_p=webmodels.agg_hhc_detailed_event_plan_of_care.objects.get(agg_sp_dt_eve_poc_id=dt_eve_id)
            service_name=detial_eve_p.eve_poc_id.srv_id.service_title
            # print("working",detial_eve_p.srv_prof_id.srv_prof_id)
            prof_det=webmodels.agg_hhc_service_professionals.objects.get(srv_prof_id=detial_eve_p.srv_prof_id.srv_prof_id)
            print(prof_det)
            try:
                rating=prof_det.Ratings
                exprience=prof_det.Experience
            except:
                rating=None
                exprience=None
            data={'professional_name':prof_det.prof_fullname,'service_name':service_name,'phone_no':prof_det.phone_no,'rating':rating,'exprience':exprience}
            return Response({'data':data})
        except Exception as e:
            return Response({'data':str(e)})

        
class feedback(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
            questions=webmodels.FeedBack_Questions.objects.filter(status=1,question_for=1)#1=patient
            question_serializer=question_feedback_serializer(questions,many=True)
            return Response({"message":question_serializer.data})
    def post(self,request):
        try:
            unused=['[','{',']','}','(',')']
            # request.data['feedback_by']=2#2 is for patient and 1 is for professional
            rating_data=request.data.get('question_answers')
            new_list=''
            for i in rating_data:
                if i in unused:
                    pass
                else:
                    new_list=new_list+i
            new_list=new_list.split(',')
            print("final list is ",new_list)
            dictionary=dict(request.data)
            if 'additional_comment' in dictionary:
                del dictionary['additional_comment']
            if 'image' in dictionary:
                del dictionary['image']
            if 'vedio' in dictionary:
                del dictionary['vedio']
            if 'audio' in dictionary:
                del dictionary['audio']
            event_id_is=int(dictionary['eve_id'][0])
            feedback_by_is=2 #1 for professional = 1
            del dictionary['eve_id']
            del  dictionary['feedback_by']
            print("list is not ",dictionary)
            question_data=webmodels.FeedBack_Questions.objects.filter(status=1,question_for=1)#.values('F_questions')
            list_comp = [k.F_questions for k in question_data]
            print(list_comp)
#------------------------------------save feedback media--------------------
            feed_serializer=feedback_media_serializer(data=request.data)
            if feed_serializer.is_valid():
                feed_serializer.save()
            feedback_obj=webmodels.agg_hhc_feedback_media_note.objects.get(feedbk_med_id=feed_serializer.data['feedbk_med_id']) # this is feedback id
            t=0
            for i in list_comp:
                try:
                    question=question_data.filter(F_questions=int(list_comp[t])).last()
                    event_record=webmodels.agg_hhc_events.objects.filter(eve_id=event_id_is).last()
                    webmodels.agg_hhc_Professional_app_feedback.objects.create(eve_id=event_record,q1=question,rating=new_list[t],feedback_by=int(feedback_by_is),feedbk_med_id=feedback_obj)#,
                    t=t+1
                except:
                    t=t+1
            return Response({'message':"Feedback submited "})
        except Exception as e:
            return Response({"message":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class feedback_status(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        caller=get_prof(request)[2]
        try:
            data=webmodels.agg_hhc_events.objects.filter(status=1,event_status=3,caller_id=caller)
            for i in data:
                feedback=webmodels.agg_hhc_Professional_app_feedback.objects.filter(eve_id=i.eve_id,feedback_by=2).last()
                if feedback:
                    feedback=True
                else:
                    feedback=False
                    return Response({'feedback':{'event_id':i.eve_id,'feedback':feedback}})
            return Response({'feedback':None})
        except Exception as e:
            return Response({'feedback':str(e)})
    
        

class cancellation_charges_for_all_app(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    def get(self,request,eve_id):
        # caller=get_prof(request)[2]
        try:
            cancel_char=cancellation_charges(eve_id)
            return Response({'cancellation_charges':cancel_char})
        except Exception as e:
            return Response({'cancel':str(e)})
        





#update check#
class update_check(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,device_type,version_number,build_number,App):
        if device_type==1:
            and_latest_version=webmodels.Android_updates.objects.filter(device=1,Application=App).last()
            if version_number==and_latest_version.version and and_latest_version.Build_number==build_number:
                update_status=False
            else:
                update_status=True
        elif  device_type==2:
            ios_latest_version=webmodels.Android_updates.objects.filter(device=2,Application=App).last()
            if version_number==ios_latest_version.version and ios_latest_version.Build_number==build_number:
                update_status=False
            else:
                update_status=True
        else:
            update_status="dont know"
        return Response({'update_status':update_status})


class change(APIView):
    def get(self,request):
        events=webmodels.agg_hhc_events.objects.filter(Q(enq_spero_srv_status=1)|Q(enq_spero_srv_status=2),status=1)
        unwanted=[]
        added_list=[]
        for i in events:
            if(i.agg_sp_pt_id.preferred_hosp_id!=None):
                try:
                    a=i.agg_sp_pt_id.preferred_hosp_id
                    print(a.hosp_id)
                    hospital=webmodels.agg_hhc_hospitals.objects.get(hosp_id=a.hosp_id)
                    event_plan=webmodels.agg_hhc_event_plan_of_care.objects.get(eve_id=i.eve_id)
                    event_plan.hosp_id=hospital
                    print("hi")
                    event_plan.save()
                    print("done id ")
                    added_list.append(i.eve_id)
                except:
                    unwanted.append(i.eve_id)
        print("event id is ",unwanted)
        print("events are ",added_list)
        return Response({'done':'done message'})