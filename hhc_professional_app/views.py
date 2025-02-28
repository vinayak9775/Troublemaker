import json
from django.shortcuts import render
from hhcweb import models as webmodel
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.parsers import JSONParser
from django.core.exceptions import ObjectDoesNotExist
from hhc_professional_app.serializer import *
from hhcweb.models import*
from hhcspero.settings import AUTH_KEY, SERVER_KEY
import random
import requests,random,pytz,io
from hhc_professional_app.renders import UserRenderer
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
# from .serializers import *
from django.shortcuts import get_object_or_404
from django.db.models import Q
from datetime import date, timedelta,datetime
from hhcweb.models import*
from hhcweb.serializers import *
from django.http import JsonResponse
from django.conf import settings
import jwt
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from datetime import time
import http.client


##################################################### Whatsapp otp function ##################################
def whatsapp_sms(to_number,template_name,placeholders):
    base_url = "xl6mjq.api-in.infobip.com"
    api_key = "af099554a7f804d8fd234e3226241101-da0d6970-19a8-4e0a-9154-9da1fb64d858"  # Replace with your actual API key
    from_number = "918956193883"
    to_number = to_number
    template_name = template_name
    placeholders = placeholders
    order_id = "SPERO_W_ID" + timezone.now().strftime("%d%m%Y%H%M%S")

    if not to_number:
        return Response({"error": "Destination number is required"}, status=status.HTTP_400_BAD_REQUEST)
    if not placeholders:
        return Response({"error": "Placeholders are required"}, status=status.HTTP_400_BAD_REQUEST)
    if(template_name=='login_otp'):
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

##################################################### Whatsapp otp function ends ##################################




def date_conveter(date):
    # return str(date.strftime("%d-%m-%Y"))
    return str(date)


def Pending_amount(eve_id):
    event_id = eve_id
    total_amt_agg = agg_hhc_events.objects.filter(eve_id=event_id,status=1).aggregate(Sum('final_amount'))
    total_paid_agg = agg_hhc_payment_details.objects.filter(eve_id=event_id,status=1,overall_status="SUCCESS").aggregate(Sum('amount_paid'))
    total_amt = total_amt_agg['final_amount__sum'] or Decimal('0.0')
    total_paid = total_paid_agg['amount_paid__sum'] or Decimal('0.0')
    Pending_amt = float(total_amt) - float(total_paid)
    return Pending_amt


# Generate Token Manually
def get_tokens_for_user(user, clg_lng_id):
    refresh = RefreshToken.for_user(user)
    prof = None
    caller = None
    srv_prof_id = 0
    prof_registered = False
    prof_interviewed = False
    prof_doc_verified = False
    caller_registered=False
    caller_id = 0
    
    ref_id = str(user.clg_ref_id)
    prof_id = agg_com_colleague.objects.get(clg_ref_id=ref_id)
    clg_ref_id = str(prof_id.clg_ref_id)

    if prof_id.grp_id.grp_id == 2:
        prof = agg_hhc_service_professionals.objects.get(clg_ref_id=clg_ref_id)
        a=prof.srv_prof_id
        b=prof.prof_registered
        srv_prof_id = a #srv_prof_id
        prof_registered = b
        prof_interviewed = prof.prof_interviewed
        prof_doc_verified = prof.prof_doc_verified

    elif prof_id.grp_id.grp_id == 3:
        print("Print 3")
        caller = agg_hhc_callers.objects.get(clg_ref_id=clg_ref_id)
        if(caller.state!=None):
            caller_registered = True
        caller_id = caller.caller_id
        caller_state = caller.state
        print("caller state id-- ",caller_state)

    return {
        "refresh" : str(refresh),
        "access" : str(refresh.access_token),
        "colleague": {
                'clg_ref_id' : clg_ref_id,
                'srv_prof_id' : srv_prof_id,
                'prof_registered' : prof_registered,
                'prof_interviewed' : prof_interviewed,
                'prof_doc_verified' : prof_doc_verified,
                'caller_id': caller_id,
                'caller_registred': caller_registered,
                'clg_login_id' : clg_lng_id
            }
    }

# Assuming you're in a Django view or a Django REST Framework API view
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

# Create your views here.

def send_otp(mobile,msg):
    url=(f"https://wa.chatmybot.in/gateway/waunofficial/v1/api/v1/sendmessage?access-token={AUTH_KEY}&phone={mobile}&content={msg}&fileName&caption&contentType=1")
    try:
        response = requests.get(url)
        response.raise_for_status()
        # print(response.raise_for_status())
        # status = response.json().get('status')
        if response.status_code == 200:
            print("Message sent successfully")
        else:
            print("Failed to send message. Status code:", response.status_code)  # Raise an exception for 4xx and 5xx status codes
    except requests.exceptions.RequestException as e:
        print("Error occurred while hitting the URL:", e)
        return e





# ---------------------- Text local sms send fun ---------------------------------------------
def send_test_otp(number,otp):
    api_key = settings.TEXTLOCAL_API_KEY
    phone_number = number
    sender = "SPEROO"
    otp_int = otp
    # message = f"Use {otp_int} as your verification code on Spero Application. The OTP expires within 10 mins,{otp_int} Team Spero"
    message = f"Use {otp_int} as your verification code on Spero Application. The OTP expires within 10 mins, {otp_int} Team Spero"
    # Use %%|otp^{"inputtype" : "text", "maxlength" : "5"}%% as your verification code on Spero Application. The OTP expires within 10 mins, %%|otp^{"inputtype" : "text", "maxlength" : "5"}%% Team Spero

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
        # clg_id = get_clg(request)
        # print("TOKEN___________ ", clg_id)
        prof_data = agg_hhc_service_professionals.objects.get(phone_no=phone_number)
        if prof_data is not None:
            prof_name = prof_data.prof_fullname
        else:
            prof_name = ""
        
        if response.status_code == 200:
            
            data = {
                    "professional_name":prof_name,
                    "contact_number":phone_number,
                    "sent_status":1,
                    "sms_type":3,
                    "status":1,
                    "added_by":prof_name
            }
            serializer = professional_otp_dtl(data=data)
            if serializer.is_valid():
                serializer.save()
            
            # return Response({'message': 'SMS sent successfully.','SMS':serializer.data, 'response': response.json()})
        else:
            data = {
                    "professional_name":prof_name,
                    "contact_number":phone_number,
                    "sent_status":2,
                    "sms_type":3,
                    "status":1,
                "added_by":prof_name
            }
            serializer = professional_otp_dtl(data=data)
            if serializer.is_valid():
                serializer.save()
            # return Response({'error': response.text}, status=500)
    except Exception as e:
        print("msg not send",str(e))
        

    

class ProfessionalOTPLogin(APIView):
    
    def post(self, request):
        try:
            number = request.data.get('phone_no')
            grp_id = int(request.data.get('grp_id'))
            otp = str(random.randint(1000, 9999))
            template_name="login_otp"
            placeholders=[otp]
            otp_expire_time = timezone.now() + timezone.timedelta(minutes=10)
            msg = f"Use {otp} as your verification code on Spero Application. The OTP expires within 10 mins, {otp} Team Spero"
            professional_found = webmodel.agg_com_colleague.objects.filter(clg_Work_phone_number=number,grp_id=grp_id).first()
            if professional_found == None and request.data.get('grp_id')==3:
                caller=webmodel.agg_hhc_callers.objects.filter(phone=number).first()
                if caller:
                    professional_colleague_serializer = UserRegistrationSerializer2(data=request.data)
                    if professional_colleague_serializer.is_valid():
                        grp_obj = agg_mas_group.objects.get(grp_id=grp_id)
                        professional_colleague_serializer.validated_data['clg_Work_phone_number'] = number
                        professional_colleague_serializer.validated_data['clg_otp'] = otp
                        professional_colleague_serializer.validated_data['clg_otp_expire_time'] = otp_expire_time
                        professional_colleague_serializer.validated_data['clg_otp_count'] = 1
                        professional_colleague_serializer.validated_data['grp_id'] = grp_obj
                        pro_col = professional_colleague_serializer.save()
                        custom_ref_id = pro_col.id
                        self.put(request, custom_ref_id)
                        print("new eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeemmmmmmmmmmmmmmmmppppppppppppppppppp")
                        print("customer id is ",custom_ref_id)
                        print("profes",custom_ref_id)
                        professional_found = webmodel.agg_com_colleague.objects.filter(clg_Work_phone_number=number,grp_id=grp_id).first()
                        caller.clg_ref_id=professional_found
                        caller.save()
            print("hiiii",professional_found)
            if number != None:
                if professional_found:
                    try:
                        if(professional_found.is_active==False):
                            res_data = {'msg':"This user is inactive"}
                            response_data={
                            'Res_Data': res_data,
                            }
                            return Response(response_data ,status=status.HTTP_200_OK)
                        device_token = DeviceToken.objects.get(clg_id=professional_found.id,token=request.data.get('token'))
                        serializer = DeviceToken_serializer(device_token)
                        # print("this is device token ",device_token)
                        # if device_token==None:
                        #     print("new colleagueage found ")
                        #     serializer = DeviceToken_serializer(data=request.data)
                        #     if serializer.is_valid():
                        #         serializer.validated_data['clg_id']=professional_found.id
                        #         serializer.save() 
                    except DeviceToken.DoesNotExist:
                        request.data['clg_id']=professional_found.id
                        serializer = DeviceToken_serializer(data=request.data)
                        if serializer.is_valid():
                            serializer.save()
                    professional_found.clg_otp = otp
                    professional_found.clg_otp_count += 1
                    professional_found.clg_otp_expire_time = otp_expire_time
                    grp_obj = agg_mas_group.objects.get(grp_id=grp_id)
                    professional_found.grp_id = grp_obj
                    professional_found.save()
                    
                    if grp_id == 2:
                        # print("grp id-- ", grp_id)
                        # try:
                        #     send_otp(number,msg)  
                        # except Exception as e:
                        #     print({"otp error": str(e)})

                        service_professional = webmodel.agg_hhc_service_professionals.objects.filter(phone_no=number).first()
                        if service_professional:
                            service_professional.OTP = otp
                            service_professional.OTP_count += 1
                            service_professional.otp_expire_time = otp_expire_time
                            service_professional.save()

                            # id=service_professional.save().id
                            # id
                            # try:
                            # send_otp(number,msg)  
                            # except Exception as e:
                            #     print({"otp error": str(e)})#This is otp send function 
                            send_test_otp(number,otp)

                    elif grp_id == 3:
                        caller_customer = webmodel.agg_hhc_callers.objects.get(phone=number)

                        if caller_customer:
                            caller_customer.otp = otp
                            caller_customer.otp_expire_time = otp_expire_time
                            caller_customer.save()
                    # send_otp(number,msg)
                    # send_test_otp(number,otp)
#----------------------------------------------------otp--------------------------------------------- #########
                    to_number='91'+str(number)
                    print("this is my number",to_number)
                    whatsapp_sms(to_number,template_name,placeholders)
#----------------------------------------------------otp--------------------------------------------- #########
                    res_data = {'phone_no': number, 'OTP': otp, 'msg':"This Phone Number Is Already Register"}
                    # print("we are not in production")
                    response_data={
                    'Res_Data': res_data,
                    'token status':serializer.data
                    }
                    # print("we are inside of serializer")
                    return Response(response_data , status=status.HTTP_200_OK)
                else:
                    professional_colleague_serializer = UserRegistrationSerializer2(data=request.data)
                    if professional_colleague_serializer.is_valid():
                        grp_obj = agg_mas_group.objects.get(grp_id=grp_id)
                        professional_colleague_serializer.validated_data['clg_Work_phone_number'] = number
                        professional_colleague_serializer.validated_data['clg_otp'] = otp
                        professional_colleague_serializer.validated_data['clg_otp_expire_time'] = otp_expire_time
                        professional_colleague_serializer.validated_data['clg_otp_count'] = 1
                        professional_colleague_serializer.validated_data['grp_id'] = grp_obj
                        # professional_colleague_serializer.validated_data['grp_id'] = grp_id

                        pro_col = professional_colleague_serializer.save()
                        custom_ref_id = pro_col.id
                        self.put(request, custom_ref_id)

                    clgref = agg_com_colleague.objects.get(clg_Work_phone_number=number,grp_id=grp_id)
                    # clgref_id = clgref.id
                    # clgref_id = clgref.clg_ref_id                    
                    # request.data['clg_ref_id'] = clgref_id
                    request.data['clg_id']=clgref.id
                    serializer = DeviceToken_serializer(data=request.data)
                    if serializer.is_valid():
                        serializer.save()

                    if grp_id == 2:
                        print("#########  ", request.data['clg_id'])
                        professional_serializer = agg_hhc_service_professionals_serializer2(data=request.data)
                        request.data['clg_id']=clgref.id

                        if professional_serializer.is_valid():
                            # print("this si clgref is ",clgref)
                            professional_serializer.validated_data['clg_ref_id'] = clgref
                            professional_serializer.validated_data['phone_no'] = number
                            professional_serializer.validated_data['work_phone_no'] = number
                            professional_serializer.validated_data['OTP'] = otp
                            professional_serializer.validated_data['otp_expire_time'] = otp_expire_time
                            professional_serializer.validated_data['OTP_count'] = 1
                            id=professional_serializer.save()
                            request.data['pid']=id

                    elif grp_id == 3:
                        caller_serializer = UserCallerSerializer2(data=request.data)
                        request.data['clg_id'] = clgref.id

                        if caller_serializer.is_valid():
                            # print("this si clgref is ",clgref)
                            caller_serializer.validated_data['clg_ref_id'] = clgref
                            caller_serializer.validated_data['phone'] = number
                            caller_serializer.validated_data['otp'] = otp
                            caller_serializer.validated_data['otp_expire_time'] = otp_expire_time
                            id=caller_serializer.save()
                            print("ID)))))))))))  -  ", id)
                            request.data['pid']=id
                        
                    # send_otp(number,msg)     #this function will be used to send otp 
                    send_test_otp(number,otp)
#------------------------------------------------otp -------------------#####################
                    to_number='91'+str(number)
                    whatsapp_sms(to_number,template_name,placeholders)
#------------------------------------------------otp -------------------#####################
                    res_data = {"phone_no": number, "OTP": otp, 'msg':"This Phone Number Is Newly Added And Registration Is Pending."}
                    response_data={
                    'Res_Data': res_data,
                    'token status':serializer.data
                    }
                    return Response(response_data ,status=status.HTTP_200_OK)
            else:
                response_data={
                'Res_Data': {'msg':'Phone number is not valid. Please enter valid phone number.'}
                }
                return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)
        

    def put(self, request, custom_ref_id):
        try:
            rdata = request.data
            def_ref_id = "clg_" + str(custom_ref_id)
            rdata['clg_ref_id'] = def_ref_id

            user = agg_com_colleague.objects.get(id=custom_ref_id)
            if user:
                serializer = UserRegistrationSerializer3(user, data=rdata)
                if serializer.is_valid():
                    serializer.save()
                    res_data = {'msg':'User registrated successfully.'}
                    response_data={
                    'Res_Data': res_data
                    }
                    return Response(response_data, status=status.HTTP_200_OK)
                return Response({"Res_Data" : {'msg':'No Data Found'}}, serializer.errors, status=status.HTTP_200_OK)
            return Response({'Res_Data': None }, status=status.HTTP_200_OK)
        except:
            return Response({'Res_Data': {'msg':'Record not found'}}, status=status.HTTP_200_OK)
       

class OTPCHECK(APIView):
    def post(self, request):
        try:
            number = request.data.get('phone_no')
            otp = request.data.get('otp')
            device_os_name = request.data.get('device_name')

            grp_id = int(request.data.get('grp_id'))
            time = timezone.now()

            try:
                user_available = webmodel.agg_com_colleague.objects.get(clg_Work_phone_number=number,grp_id=grp_id,is_active=True)
                print("User AVailable--- ", user_available)
            except ObjectDoesNotExist:
                return Response({"message": 'User not found with this number'}, status=status.HTTP_200_OK)
            if user_available.clg_otp == otp and user_available.clg_otp_expire_time > time:
                print("user_available.id ",user_available.id)
                device_token=DeviceToken.objects.filter(clg_id=user_available.id,is_login=True)#user_available.clg_ref_id)
                print("Device token-- ", device_token)
                if device_token:
                    for i in device_token:
                        i.is_login=False
                        i.save()
                # print("not found in this also ",type(request.data.get('token')))
                device_login_token=DeviceToken.objects.get(clg_id=user_available.id,token=request.data.get('token'))
                print("no working with this",device_login_token)
                device_login_token.is_login=True
                if(device_login_token.login_count>=1):
                    print("hiiiiiiiiiiiiiii")
                    device_login_token.last_modify_date=timezone.now()#this was giving error
                device_login_token.login_count=device_login_token.login_count+1
                device_login_token.save()
                print("data")

                login_dtl = {
                    "device_os_name" : device_os_name,
                    "clg_id" : str(user_available.clg_ref_id),
                    "clg_login_time" : str(timezone.now())
                }

                clg_login_dtl_serializer = UserLoginInfoSerializer(data=login_dtl)
                print("clg login dtl-- ", clg_login_dtl_serializer)
                if clg_login_dtl_serializer.is_valid():
                    clg_lng = clg_login_dtl_serializer.save()
                    clg_lng_id = clg_lng.id


                token = get_tokens_for_user(user_available, clg_lng_id)
    
                user_available.clg_is_login=True
                user_available.save()
                return Response({'token':token, "message": "Login successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Wrong OTP"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"message": "An error occurred: {}".format(str(e))})
        

class LogoutView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        clgref_id = get_prof(request)[3]
        try:
            clg_login_id = request.data["clg_login_id"]
        except Exception as e:
            clg_login_id=0
        request.data['last_modified_by'] = clgref_id

        try:
            refresh_token = request.data["refresh"]
            clgid = get_prof(request)[1]
            try:
                token = RefreshToken(refresh_token)
            except Exception as e:
                try:
                    device_token_list=OutstandingToken.objects.filter(token=refresh_token).last()
                    token_list=BlacklistedToken.objects.get(token_id=device_token_list.id)
                    return Response({'msg':'Token is blacklisted successfully.'},status=status.HTTP_200_OK)
                except Exception as e:
                    return Response({'msg':'Token is not correct. Please try again with correct token.'},status=status.HTTP_200_OK)
            logout_from_device_token=DeviceToken.objects.get(clg_id=clgid,token=request.data.get('Device_token'))
            logout_from_device_token.is_login=False
            logout_from_device_token.last_modified_by=clgref_id
            logout_from_device_token.save()
            if (clg_login_id!=0):
                clg_login_dtl = ems_colleague_login_logout_info.objects.get(id=clg_login_id)
                if clg_login_dtl.clg_logout_time == None:
                    clg_login_dtl.clg_logout_time = datetime.now()
                    clg_login_dtl.save()
                    # print("2345432 ",clg_login_dtl.clg_logout_time)
                else:
                    print("Is Not NULL")
                    return Response({'msg':'User is already logged out successfully'},status=status.HTTP_200_OK)
            token.blacklist()
            return Response({'msg':'Token is blacklisted successfully.'},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'msg':'Token is not correct. Please try again with correct token.'},status=status.HTTP_200_OK)
                
class SosDtlView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        clgref_id = get_prof(request)[3] 
        request.data['last_modified_by'] = clgref_id

        try:
            dtl_id = request.data['dtl_eve_id']
            dtl_obj = agg_hhc_detailed_event_plan_of_care.objects.get(agg_sp_dt_eve_poc_id=dtl_id)
            try:
                dtl_exist = sos_details.objects.get(dtl_eve_id=dtl_obj.agg_sp_dt_eve_poc_id)
                return Response({'msg':'This request is already added for this session.'},status=status.HTTP_200_OK)
            except:
                pass

            serializer= agg_hhc_sos_dtl_serializer(data=request.data)

            if serializer.is_valid():
                serializer.save()
                # Send WhatsApp message start----------------------------------------
                name_number=dtl_obj.srv_prof_id.prof_fullname+" ("+str(dtl_obj.srv_prof_id.phone_no)+")"
                placeholders = [name_number]
                phone_numbers=('918956193882','919130029103','919975063761','918097077998')
                for i in phone_numbers:
                    whatsapp_sms(i,"sos_button",placeholders)
                # Send WhatsApp message end-------------------------------------------
                return Response({'msg':'Sos details added successfully.'},status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'msg':'Something went wrong.'},status=status.HTTP_200_OK) 

        

class UserProfileView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        serializer = UserProfileSerializer2(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        clgref_id = get_prof(request)[3]
        
        request.data['last_modified_by'] = clgref_id
        
        data_to_change = json.loads(request.body)
        clg_id = data_to_change['id']
        user = agg_com_colleague.objects.get(id = clg_id)
        serializer = UserProfileSerializer2(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.update(user, request.data)
        return Response(serializer.data)
    
class updateprofprofile(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        # pro = request.GET.get('pro')
        pro = get_prof(request)[0]
        print("TOKEN___________ ", pro)
        file_path = None
        # Get CORS_ALLOWED_ORIGINS from settings
        cors_allowed_origins = getattr(settings, 'CORS_ALLOWED_ORIGINS', [])

        srvs = agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id = pro, is_cancelled = 2,status=1)
        srv_count = 0
        for i in srvs:
            srv_count = srv_count + 1
        user = agg_hhc_service_professionals.objects.get(srv_prof_id = int(pro))
        
        if user.profile_file:
            file_path = str(cors_allowed_origins[1])+ "/media/" + str(user.profile_file)
        serializer = UserProfileSerializer3(user)
        Res_data = {"data": serializer.data, "srv_count" : srv_count, "File_path" : file_path}
        return Response(Res_data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        clgref_id = get_prof(request)[3]
        
        # request.data['last_modified_by'] = clgref_id

        # pro = request.GET.get('pro')
        pro = get_prof(request)[0]
        print("TOKEN___________ ", pro)
        user = agg_hhc_service_professionals.objects.get(srv_prof_id = pro)
        print("hi i am profile")
        serializer = UserProfileSerializer4(user, data=request.data, partial=True)
        print("seri")
        print(request.data.get('profile_file'))
        if serializer.is_valid():
            print("in serializer")
            serializer.update(user, request.data)
            print("after serializer")
        print(serializer.data)
        return Response(serializer.data)


class DelAvalView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def delete(self, request, format=None):
        # pro_detl_id_arr = request.data['pro_detl_id_arr']
        dt = request.GET.get('pro_detl_id')
        pro = get_prof(request)[0]

        try:
            if dt: # to delete all the records contaning different zone or locations for selected time slots
                print("pro_detl_id--", dt)
                
                avaldetls = agg_hhc_professional_availability_detail.objects.get(prof_avaib_dt_id=dt, status=1)
                print("avaldetals---", avaldetls)
            
                aval_detls_max = agg_hhc_professional_availability_detail.objects.filter(start_time=avaldetls.start_time, end_time=avaldetls.end_time, prof_avaib_id=avaldetls.prof_avaib_id, status=1)
                print("aval_detls_max--", aval_detls_max)

                for aval_detls in aval_detls_max:
                    if aval_detls:
                        prof_avai_id = aval_detls.prof_avaib_id.professional_avaibility_id
                        aval = agg_hhc_professional_availability.objects.get(professional_avaibility_id=prof_avai_id, status=1)

                        avaldt = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=prof_avai_id, status=1)

                        aval_day = int(aval.day)

                        try:
                            detail_events = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__week_day=aval_day, start_time__gte=avaldt[0].start_time, end_time__lte=avaldt[0].end_time, srv_prof_id=pro, status=1 | Q(Session_status=1) | Q(Session_status=3) | Q(Session_status= 8))
                            
                            if detail_events:
                                return Response({'Res_Data':{'msg':'Please contact with Healthcare Dispatcher regarding time updation or deletion.'}}, status=status.HTTP_200_OK)
                        except:
                            pass
                        

                    if aval_detls:
                        print("Finally")
                        aval_detls.status = 2
                        aval_detls.save()
                        # aval_detls.delete()
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
            
    #         pro = get_prof(request)[0]

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
    #             print("aval id arr-- ", aval_id_arr)
    #             aval_detls = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id__in=aval_id_arr)

    #         print("aval-- ", aval)    


    #         print("aval_detls--", aval_detls)

    #         unique_date_obj = []
    #         for p in aval_detls:
    #             st = p.start_time
    #             et = p.end_time

    #             if len(unique_date_obj) == 0:
    #                 stt = st
    #                 ett = et
    #                 unique_date_obj.append(p.prof_avaib_dt_id)
    #             elif stt == st and ett == et:
    #                 pass
    #             else:
    #                 stt = st
    #                 ett = et
    #                 unique_date_obj.append(p.prof_avaib_dt_id)

    #         aval_unique_detls = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_dt_id__in=list(unique_date_obj))

    #         print("unique_date_obj--", unique_date_obj)
    #         print("aval_unique_detls--", aval_unique_detls)

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

    #                         i['prof_loc_id'] = loc_id

    #                         # i['main_zone_name'] = loc_zone.prof_zone_id.Name
    #                         # i["prof_loc_name"] = j['loc_name']

    #                         i['prof_zone_name'] = loc_zone.prof_zone_id.Name
    #                         i["prof_loc_zone_name"] = j['loc_name']

    #                         # if loc_id == i['prof_loc_id']:
    #                         #     i["prof_loc_name"] = j['loc_name']
    #                 except:
    #                     pass

    #             response_data={
    #             'Res_Data': serializer.data
    #             }
    #             return Response(response_data, status=status.HTTP_200_OK)
    #         return Response(serializer.errors, status=status.HTTP_200_OK)
    #     except:
    #         return Response({'Res_Data':[]}, status=status.HTTP_200_OK)


    def get(self, request, format=None):
        try:
            day = request.GET.get('day')
            
            pro = get_prof(request)[0]

            aval_id_arr = []
            print("pro, day--", pro, day)

            if day:
                aval = agg_hhc_professional_availability.objects.get(srv_prof_id=pro, day=day, status=1)
                aval_id = aval.professional_avaibility_id
                aval_detls = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=aval_id, status=1)
            else:
                aval = agg_hhc_professional_availability.objects.filter(srv_prof_id=pro, status=1)
                for i in aval:
                    aval_id = i.professional_avaibility_id
                    aval_id_arr.append(aval_id)
                # print("aval id arr-- ", aval_id_arr)
                aval_detls = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id__in=aval_id_arr, status=1)

            # print("aval-- ", aval)    


            # print("aval_detls--", aval_detls)

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
                # serializer = agg_hhc_professional_availability_detail_serializer(aval_unique_detls, many=True)
                serializer = agg_hhc_professional_availability_detail_serializer123(aval_detls, many=True)
                
                
            
            for i in serializer.data:
                # print("in for loop", i)
                if i['prof_zone_id'] != None:
                    profzoneid = i['prof_zone_id']
                    profzoneobj = agg_hhc_professional_zone.objects.get(prof_zone_id = profzoneid, status=1)
                    # print("serializer i---", profzoneobj)
                    # i['prof_zone_id'] = profzoneobj.prof_zone_id
                    i["prof_loc_zone_name"] = profzoneobj.Name
                    # i['prof_loc_zone_id'] = profzoneobj.prof_zone_id
                    # i["prof_loc_zone_name"] = profzoneobj.Name
                else:
                    profloczoneid = i['prof_loc_zone_id']
                    profloczoneobj = agg_hhc_professional_locations_as_per_zones.objects.get(prof_loc_zone_id = profloczoneid, status=1)
                    # print("serializer j---", profloczoneobj)
                    # i['prof_loc_zone_id'] = profloczoneobj.prof_loc_dtl_id.prof_loc_id
                    i["prof_loc_zone_name"] = profloczoneobj.prof_loc_dtl_id.location_name
                    # i['prof_loc_zone_id'] = profloczoneobj.prof_loc_dtl_id.prof_loc_id
                    # i["prof_loc_zone_name"] = profloczoneobj.prof_loc_dtl_id.location_name

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

            response_data={
            'Res_Data': serializer.data
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
        # return Response(serializer.errors, status=status.HTTP_200_OK)
        except:
            return Response({'Res_Data':[]}, status=status.HTTP_200_OK)
        

    # def get(self, request, format=None): #UPDATED GET API WITH COMPACT RESPONSE LIKE HCM
    #     try:
    #         day = request.GET.get('day')
            
    #         pro = get_prof(request)[0]

    #         aval_id_arr = []
    #         response_data_arr = []
    #         print("pro, day--", pro, day)

    #         try:
    #             if day:
    #                 aval = agg_hhc_professional_availability.objects.get(srv_prof_id=pro, day=day)
    #                 aval_id = aval.professional_avaibility_id
    #                 aval_detls = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=aval_id)
    #             # else:
    #             #     aval = agg_hhc_professional_availability.objects.filter(srv_prof_id=pro)
    #             #     for i in aval:
    #             #         aval_id = i.professional_avaibility_id
    #             #         aval_id_arr.append(aval_id)
    #             #     # print("aval id arr-- ", aval_id_arr)
    #             #     aval_detls = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id__in=aval_id_arr)

    #             # print("aval-- ", aval)    


    #             # print("aval_detls--", aval_detls)

    #                 if aval_detls:
    #                     unique_date_obj = []

    #                     for p in aval_detls:
    #                         st = p.start_time
    #                         et = p.end_time

    #                         if len(unique_date_obj) == 0:
    #                             stt = st
    #                             ett = et
    #                             unique_date_obj.append(p.prof_avaib_dt_id)
    #                         elif stt == st and ett == et:
    #                             pass
    #                         else:
    #                             stt = st
    #                             ett = et
    #                             unique_date_obj.append(p.prof_avaib_dt_id)
                                

    #                     aval_unique_detls = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_dt_id__in=list(unique_date_obj))

    #                     # print("unique_loc_name----", unique_loc_name)
    #                     # print("unique_date_loc_zon_obj----", unique_date_loc_zon_obj)

    #                     # print("unique_date_obj--", unique_date_obj)
    #                     # print("aval_unique_detls--", aval_unique_detls)

    #                     loc_arr = []
    #                     # for i in aval_unique_detls:
    #                     for i in aval_detls:
    #                         try:
    #                             loc_name = i.prof_zone_id.Name
    #                             loc_data = {
    #                                 "loc_zone_id" : i.prof_zone_id.prof_zone_id,
    #                                 "loc_zone_name" : loc_name
    #                             }
    #                             loc_arr.append(loc_data)
    #                         except:
    #                             pass

    #                         try:
    #                             loc_name = i.prof_loc_zone_id.prof_loc_dtl_id.location_name
    #                             loc_data = {
    #                                 "loc_id" : i.prof_loc_zone_id.prof_loc_dtl_id.prof_loc_id.prof_loc_id,
    #                                 "loc_name" : loc_name
    #                             }
    #                             loc_arr.append(loc_data)
    #                         except:
    #                             pass
    #                     # print("loc arr---", loc_arr)

    #                     # if aval_unique_detls:
    #                     if aval_detls:
    #                         # serializer = agg_hhc_professional_availability_detail_serializer123(aval_detls, many=True)

    #                         serializer = agg_hhc_professional_availability_detail_serializer123(aval_unique_detls, many=True)
                            
                            
                        
    #                     for i in serializer.data:
    #                         # print("serializer.data time", i['start_time'], i['end_time'])

    #                         loc_arr_objs = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=i['prof_avaib_id'],start_time=i['start_time'],end_time=i['end_time'])

    #                         # print("loc_arr_objs---", loc_arr_objs)
    #                         loc_obj_zone_nm_arr = []
    #                         loc_id_arr = []
    #                         zone_id_arr = []
    #                         for loc in loc_arr_objs:
    #                             try:
    #                                 # print(loc.prof_loc_zone_id.prof_loc_dtl_id.location_name)
    #                                 loc_id_arr.append(loc.prof_loc_zone_id.prof_loc_zone_id)
    #                                 if loc.prof_loc_zone_id.prof_loc_dtl_id.location_name not in loc_obj_zone_nm_arr:
    #                                     # loc_obj_zone_nm_arr.append(loc.prof_loc_zone_id.prof_loc_dtl_id.location_name)
    #                                     loc_obj_zone_nm_arr.append(loc.prof_loc_zone_id.prof_zone_id.Name)
    #                             except:
    #                                 # print(loc.prof_zone_id.Name)
    #                                 zone_id_arr.append(loc.prof_zone_id.prof_zone_id)
    #                                 loc_obj_zone_nm_arr.append(loc.prof_zone_id.Name)

    #                         i["prof_loc_zone_name"] = loc_obj_zone_nm_arr
    #                         i["prof_loc_zone_id"] = loc_id_arr
    #                         i["prof_zone_id"] = zone_id_arr
                            

    #                         # if i['prof_zone_id'] != None:
    #                         #     profzoneid = i['prof_zone_id']
    #                         #     profzoneobj = agg_hhc_professional_zone.objects.get(prof_zone_id = profzoneid)
    #                         #     # print("serializer i---", profzoneobj)
    #                         #     # i['prof_zone_id'] = profzoneobj.prof_zone_id
    #                         #     i["prof_loc_zone_name"] = profzoneobj.Name
    #                         #     # i['prof_loc_zone_id'] = profzoneobj.prof_zone_id
    #                         #     # i["prof_loc_zone_name"] = profzoneobj.Name
    #                         # else:
    #                         #     profloczoneid = i['prof_loc_zone_id']
    #                         #     profloczoneobj = agg_hhc_professional_locations_as_per_zones.objects.get(prof_loc_zone_id = profloczoneid)
    #                         #     # print("serializer j---", profloczoneobj)
    #                         #     # i['prof_loc_zone_id'] = profloczoneobj.prof_loc_dtl_id.prof_loc_id
    #                         #     i["prof_loc_zone_name"] = profloczoneobj.prof_loc_dtl_id.location_name
    #                         #     # i['prof_loc_zone_id'] = profloczoneobj.prof_loc_dtl_id.prof_loc_id
    #                         #     # i["prof_loc_zone_name"] = profloczoneobj.prof_loc_dtl_id.location_name

    #                     # print("serializer data---",serializer.data)

    #                         #     try:
    #                         #         for i in serializer.data:
    #                         #             # loc_id = j['loc_id']

    #                         #             # loc_zone = agg_hhc_professional_locations_as_per_zones.objects.get(prof_loc_zone_id=i['prof_loc_zone_id'])

    #                         #             # i['prof_loc_id'] = loc_id

    #                         #             # # i['main_zone_name'] = loc_zone.prof_zone_id.Name
    #                         #             # # i["prof_loc_name"] = j['loc_name']

    #                         #             # i['prof_zone_name'] = loc_zone.prof_zone_id.Name
    #                         #             # i["prof_loc_zone_name"] = j['loc_name']

    #                         #             # print("!!!!!!!!!!!!!!!!!!!!!!---", i['prof_zone_name'], i["prof_loc_zone_name"])

    #                         #             # # if loc_id == i['prof_loc_id']:
    #                         #             # #     i["prof_loc_name"] = j['loc_name']

    #                         #             i['prof_loc_zone_id'] = j['loc_id']
    #                         #             i["prof_loc_zone_name"] = j['loc_name']
    #                         #     except:
    #                         #         pass
    #                     # print("dddddddddaaaaaaaaaayyyyyyyyyy----", day)
    #                     response_data_obj={
    #                         'Day': day,
    #                         'Res_Data': serializer.data
    #                     }
    #                     # print("response_data_obj--", type(response_data_obj))
    #                     response_data_arr.append(response_data_obj)
    #                     # print("appending", response_data_arr)
    #                 else:
    #                     response_data_obj={
    #                     'Day': day,
    #                     'Res_Data': {}
    #                     }
    #                     # print("response_data_obj--", type(response_data_obj))
    #                     response_data_arr.append(response_data_obj)
    #         except:
    #                 response_data_obj={
    #                     'Day': day,
    #                     'Res_Data': {}
    #                 }
    #                 # print("response_data_obj--", type(response_data_obj))
    #                 response_data_arr.append(response_data_obj)
    #                 # print("in else loop")
    #                 pass
    #         return Response(response_data_arr, status=status.HTTP_200_OK)
        
    #     # return Response(serializer.errors, status=status.HTTP_200_OK)
    #     except:
    #         return Response({'Res_Data':[]}, status=status.HTTP_200_OK)


    # def delete(self, request, format=None):
    #     pro_detl_id = request.GET.get('pro_detl_id')
    #     pro = get_prof(request)[0]

    #     print("pro_detl_id-- ", pro_detl_id)
    #     print("pro-- ", pro)

    #     try:
    #         avaldetls = agg_hhc_professional_availability_detail.objects.get(prof_avaib_dt_id=pro_detl_id)

    #         print("avaldetals---", avaldetls)
        
    #         aval_detls_max = agg_hhc_professional_availability_detail.objects.filter(start_time=avaldetls.start_time, end_time=avaldetls.end_time, prof_avaib_id=avaldetls.prof_avaib_id)

    #         print("aval_detls_max--", aval_detls_max)

    #         for aval_detls in aval_detls_max:
    #             if aval_detls:
    #                 prof_avai_id = aval_detls.prof_avaib_id.professional_avaibility_id
    #                 aval = agg_hhc_professional_availability.objects.get(professional_avaibility_id=prof_avai_id)

    #                 avaldt = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=prof_avai_id)

    #                 aval_timeslot = aval.professional_avaibility_id
    #                 # pending from here
    #                 aval_day = int(aval.day)
    #                 # aval_day = int(aval.day) + 1
    #                 aval_st = aval

    #                 try:
    #                     # detail_events = agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id=pro, actual_StartDate_Time__week_day=aval_day,status=1)
    #                     detail_events = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__week_day=aval_day, start_time__gte=avaldt[0].start_time, end_time__lte=avaldt[0].end_time, srv_prof_id=pro, status=1 | Q(Session_status=1) | Q(Session_status=3) | Q(Session_status= 8))
    #                     # detail_events = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__week_day=aval_day, start_time__gte=avaldt[0].start_time, end_time__lte=avaldt[0].end_time, srv_prof_id=88)
    #                     print("detail_events---", detail_events)

    #                     print("Here")
    #                     if detail_events:
    #                         return Response({'Res_Data':{'msg':'Please contact with Healthcare Dispatcher regarding time updation or deletion.'}}, status=status.HTTP_200_OK)
    #                 except:
    #                     pass
                    

    #             if aval_detls:
    #                 print("Finally")
    #                 aval_detls.delete()
    #                 # pass
    #         return Response({'Res_Data':{'msg':'Time slot deleted successfully.'}}, status=status.HTTP_200_OK)            
    #     except:
    #         return Response({'Res_Data':{'msg': 'Record not found'}}, status=status.HTTP_200_OK)

    def delete(self, request, format=None):
        pro_detl_id = request.GET.get('pro_detl_id')
        pro = get_prof(request)[0]

        print("pro_detl_id-- ", pro_detl_id)
        print("pro-- ", pro)

        try:
            avaldetls = agg_hhc_professional_availability_detail.objects.get(prof_avaib_dt_id=pro_detl_id, status=1)

            print("avaldetals---", avaldetls)
        
            # aval_detls_max = agg_hhc_professional_availability_detail.objects.filter(start_time=avaldetls.start_time, end_time=avaldetls.end_time, prof_avaib_id=avaldetls.prof_avaib_id)

            # print("aval_detls_max--", aval_detls_max)

            # for aval_detls in aval_detls_max:
            #     if aval_detls:
            prof_avai_id = avaldetls.prof_avaib_id.professional_avaibility_id
            aval = agg_hhc_professional_availability.objects.get(professional_avaibility_id=prof_avai_id, status=1)

            #         # avaldt = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=prof_avai_id)

            #         aval_timeslot = aval.professional_avaibility_id
            #         # pending from here
                    
            aval_day = int(aval.day)
            # aval_day = int(aval.day) + 1
            aval_st = aval

            try:
                # detail_events = agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id=pro, actual_StartDate_Time__week_day=aval_day,status=1)

                detail_events = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__week_day=aval_day, start_time__gte=aval.start_time, end_time__lte=aval.end_time, srv_prof_id=pro, status=1 | Q(Session_status=1) | Q(Session_status=3) | Q(Session_status= 8))

                # detail_events = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__week_day=aval_day, start_time__gte=avaldt[0].start_time, end_time__lte=avaldt[0].end_time, srv_prof_id=pro, status=1 | Q(Session_status=1) | Q(Session_status=3) | Q(Session_status= 8)) # to delete all time slots

                # detail_events = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__week_day=aval_day, start_time__gte=avaldt[0].start_time, end_time__lte=avaldt[0].end_time, srv_prof_id=88)
                # print("detail_events---", detail_events)

                print("Here")
                if detail_events:
                    return Response({'Res_Data':{'msg':'Please contact with Healthcare Dispatcher regarding time updation or deletion.'}}, status=status.HTTP_200_OK)
            except:
                pass
                    

            if avaldetls:
                print("Finally")
                # avaldetls.delete()
                avaldetls.status = 2
                avaldetls.save()

            # if aval:
            #     print("Finally")
            #     aval.delete()
                    

                # if aval_detls:
                #     print("Finally")
                #     aval_detls.delete()
                
            return Response({'Res_Data':{'msg':'Time slot deleted successfully.'}}, status=status.HTTP_200_OK)            
        except:
            return Response({'Res_Data':{'msg': 'Record not found'}}, status=status.HTTP_200_OK)

            
    def post(self, request, format=None):

        clgref_id = get_prof(request)[3]
        request.data['last_modified_by'] = clgref_id
        try:
            # dates = request.data['date']
            days = request.data['day']
            # prof = request.data['srv_prof_id']
            time_slots = request.data['time']
            prof = get_prof(request)[0]
            # prof = 155
            request.data['srv_prof_id'] = prof
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
                    aval = agg_hhc_professional_availability.objects.get(srv_prof_id=prof, day=i, status=1)
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
                            prof_aval_dtl_exts = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=prof_aval_id, end_time__gt=j[0], start_time__lt=j[1], status=1)

                            print("prof_aval_dtl_exts-----  ", prof_aval_dtl_exts)

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
                                request.data['srv_prof_id'] = prof
                                
                                prof_aval_detail_serializer = agg_hhc_professional_availability_detail_serializer(data=request.data)
                                print("prof_aval_detail_serializer---", prof_aval_detail_serializer)
                                if prof_aval_detail_serializer.is_valid(raise_exception=True):
                                    prof_aval_detail_serializer.save()

                        else:
                            for z_id in prof_zone_id:
                                request.data['start_time'] = j[0]
                                request.data['end_time'] = j[1]
                                request.data['prof_zone_id'] = z_id
                                request.data['srv_prof_id'] = prof
                            
                                prof_aval_detail_serializer1 = agg_hhc_professional_availability_detail_serializer2(data=request.data)
                                if prof_aval_detail_serializer1.is_valid(raise_exception=True):
                                    prof_aval_detail_serializer1.save()
                                    # pass

                            
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
            locs = agg_hhc_professional_location_details.objects.filter(prof_loc_dt_id=loc, status=1)
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
        pro = get_prof(request)[0]

        try:
            # locs = agg_hhc_professional_location.objects.filter(srv_prof_id=pro)
            # print(locs)

            zon_loc = agg_hhc_professional_locations_as_per_zones.objects.filter(srv_prof_id=pro, status=1)
            zon_loc_arr = []
            for zl in zon_loc:
                locdtid = zl.prof_loc_dtl_id
                zon_locid = agg_hhc_professional_locations_as_per_zones.objects.filter(prof_loc_dtl_id=locdtid, status=1)

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
        
        clgref_id = get_prof(request)[3]
        request.data['last_modified_by'] = clgref_id

        # pro_id = request.data['srv_prof_id']
        pro_loc_name = request.data['location_name']
        t_pro = get_prof(request)[0]
        request.data['srv_prof_id'] = t_pro
        # print("TOKEN____t pro_______ ", t_pro)
        try:
            if t_pro:
                try:
                    rec = agg_hhc_professional_location.objects.filter(srv_prof_id=t_pro, location_name=pro_loc_name, status=1)
                    # print("rec ", rec)
                except:
                    pass

                if rec:
                    response_data={
                    'Res_data': {'msg':'Professional Availability Zone Already Exists.'}
                    }
                    return Response(response_data, status=status.HTTP_200_OK)
                else:
                    # print("request data-- ", request.data)
                    loc_serializer = agg_hhc_professional_location_serializer(data=request.data)
                    # print("loc serializer--", loc_serializer)

                    if loc_serializer.is_valid(raise_exception=True):
                        # print("serializer valid ")
                        lat_long = request.data['lat_long']
                        # print("lat long-- ", lat_long[0][0])
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



# ------------------------------- professional register API view -------------------------------
import ast       
class Register_professioanl_for_interview(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    serializer_class = reg_prof_api_serializer
    serializer_class2 = colleage_add_prof_data
    serializer_class3 = register_prof_sub_services
    
    def get_object(self, clg_id):
        try:
          
            clg_ref_id = agg_com_colleague.objects.get(id=clg_id)
           
            print('1111',(agg_hhc_service_professionals.objects.get(clg_ref_id=clg_ref_id.clg_ref_id).clg_ref_id))
            return agg_hhc_service_professionals.objects.get(clg_ref_id=clg_ref_id.clg_ref_id)
        except agg_hhc_service_professionals.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
    def get_object2(self, clg_id):
        try:
            return agg_com_colleague.objects.get(id=clg_id)
        except agg_com_colleague.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    def put(self, request):
        mutable_data = request.data.copy()
        clgref_id = get_prof(request)[3]
        # print("Register_professioanl_for_interview data rrrrrrrrrrrrrrrrrrrrr\n",request.data)
        mutable_data['last_modified_by'] = clgref_id

        clg_id = get_prof(request)[1]
        # print("CLG ID___________ ", clg_id)
        instance = self.get_object(clg_id)
        print("instance",instance)
        # print(request.data,'request.data')
        serializer = self.serializer_class(instance, data=request.data, partial=True)
        prof_fullname = request.data.get('prof_fullname', None)
        # print("data of professional name is,",prof_fullname)
        dob = request.data.get('dob', None)
        gender = request.data.get('gender', None)
        clg_email = request.data.get('email_id', None)
        phone_no = request.data.get('phone_no', None)
        eme_contact_no = request.data.get('eme_contact_no', None)
        prof_zone_id = request.data.get('prof_zone_id', None)
        state_name = request.data.get('state_name', None)
        prof_address = request.data.get('prof_address', None)

        is_exist_email_in_clg = agg_com_colleague.objects.filter(clg_email= clg_email)
        is_exist_phone_in_clg = agg_com_colleague.objects.filter(clg_Work_phone_number= eme_contact_no)

        if is_exist_email_in_clg.exists():
            return Response({"error":"Email Already Exists"})
        
        if is_exist_phone_in_clg.exists():
            return Response({"error":"Phone Number Already Exists"})
        
        zone_id = agg_hhc_professional_zone.objects.get(Name=prof_zone_id) 
        data2 = {
            'clg_email': clg_email, 
            'clg_first_name':prof_fullname, 
            'clg_gender': gender, 
            'clg_mobile_no':phone_no, 
            # 'clg_Work_phone_number': phone_no,
            'clg_Date_of_birth': dob,
            'clg_address':prof_address, 
            'clg_state':state_name,
            'clg_district': zone_id.prof_zone_id
    }
        
        try:
            if serializer.is_valid():
                serializer.save()
            else:
                print(serializer.errors,"serializer.error")

            
            clg_ref_id = agg_com_colleague.objects.get(id=clg_id)
            set_status_prof_registered = agg_hhc_service_professionals.objects.get(clg_ref_id=clg_ref_id)
            set_status_prof_registered.prof_registered = True
            set_status_prof_registered.prof_interviewed = True
            set_status_prof_registered.prof_doc_verified = True
            set_status_prof_registered.professinal_status = 4
            set_status_prof_registered.save()
            print("half")
            
            instance2 = self.get_object2(clg_id)
            serializer2 = self.serializer_class2(instance2, data=data2, partial=True)
            if serializer2.is_valid():
                serializer2.save()
         
            else:
                print(serializer.errors,'serializer.errors')
                print(serializer2.errors,'serializer2.errors')
                return Response({'error': serializer2.errors,'error2':'serializer2-serializer2-serializer2-0serializer2'}, status=status.HTTP_400_BAD_REQUEST)
            
      

            multiple_zone_str = request.data.get('multile_zone')
            sub_srv_ids_str = request.data.get('sub_srv_ids')

            try:
                
                cleaned_ids_str = sub_srv_ids_str.strip('[]')
                cleaned_zone_str = multiple_zone_str.strip('[]')
            
                iiids = list(cleaned_ids_str.split(','))
                xones = list(cleaned_zone_str.split(','))

                received_ids = [int(idd) for idd in iiids]
                received_zone = [idd for idd in xones]

                print(received_ids,'received_ids')
                print(received_zone,'received_zone')

                for srv_id in received_ids:
                    # print(srv_id)
                    sub_service_instance = agg_hhc_sub_services.objects.get(sub_srv_id=srv_id)
                    agg_hhc_professional_sub_services.objects.create(
                        srv_prof_id_id=set_status_prof_registered.srv_prof_id,
                        sub_srv_id=sub_service_instance
                    )
                 
                for zone in received_zone:
                    cleaned_zone = zone.strip()
                    
                    agg_hhc_professional_location.objects.create(
                        srv_prof_id_id=set_status_prof_registered.srv_prof_id,
                        location_name=cleaned_zone
                    )
               
                sub_service_instance_first = agg_hhc_sub_services.objects.get(sub_srv_id=int(received_ids[0]))
                set_status_prof_registered.prof_sub_srv_id_id = sub_service_instance_first.sub_srv_id
                set_status_prof_registered.save()

            except (ValueError, TypeError) as e:
                print(f"Error: {e}")
                
            return Response({'Prof_data': serializer.data, 'Collegue_data': serializer2.data, "error":None}, status=status.HTTP_200_OK)
        
        except Exception as e:
            print(str(e))
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# --------------------------------- Sandip Shimpi -------------------------------------------------------------------------
# ---------------------------- Professional document upload and check ----------------------------------------------------

class agg_hhc_get_role(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return webmodel.agg_hhc_services.objects.filter(is_role=True)

    def get(self, request):
        role = self.get_queryset()
        # print(role)
        role_serializer = agg_hhc_get_role_serializer(role,many=True)
        return Response(role_serializer.data)
    
class agg_hhc_document_list(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self,request,pk):
        call= webmodel.agg_hhc_documents_list.objects.filter(professional_role=pk)
        serializers=agg_hhc_document_list_serializer(call,many=True)
        doc_list_ID = [{'doc_list_ID': item['doc_li_id'],'Documents_name':item['Documents_name'],'professional_role':item['professional_role']} for item in serializers.data]
        response_data={
            'doc_list_ID':doc_list_ID
        }
        return Response(response_data, status=status.HTTP_200_OK)

class agg_hhc_add_document(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]

    def match_lists(self, list1, list2):
        dict2 = {record["doc_li_id"]: record.get("professional_document") for record in list2}
        result = []
        for record in list1:
            doc_li_id = record["doc_li_id"]
            document_name = record["Documents_name"]
            professional_role = record["professional_role"]
            professional_document = dict2.get(doc_li_id, None)
            result.append({
                "doc_li_id": doc_li_id,
                "Documents_name": document_name,
                "professional_role": professional_role,
                "professional_document": professional_document
            })

        return result

    # def get(self, request, prof_id, role):
    def get(self, request, role):
        # prof_id = get_prof(request)[0]
        # print("TOKEN___________ ", prof_id)
        prof_id=224
        doc_list= webmodel.agg_hhc_documents_list.objects.filter(professional_role=role)
        serializers=agg_hhc_document_list_serializer(doc_list,many=True)
        doc= webmodel.agg_hhc_professional_documents.objects.filter(srv_prof_id=prof_id)
        doc_serializer = agg_hhc_add_document_serializer(doc, many=True)
        # print(doc_serializer.data)
        result = self.match_lists(serializers.data, doc_serializer.data)
        return Response({'data':result}, status=status.HTTP_200_OK)   # return response in dictionary as per frontend requirment
    
    def post(self,request):
        # clgref_id = get_prof(request)[3]
        
        # request.data['last_modified_by'] = clgref_id

        # try:
        #     is_exist = agg_hhc_professional_documents.objects.get(srv_prof_id=request.data['srv_prof_id'],doc_li_id=request.data['doc_li_id'])
        # except agg_hhc_professional_documents.DoesNotExist:
        #     pass
        serialized= agg_hhc_add_document_serializer(data=request.data)
        if serialized.is_valid():
            serialized.save()
            return Response({'message':'successful'},status=status.HTTP_201_CREATED)
        return Response(serialized.errors,status=status.HTTP_200_OK)

class date_wise_location_details(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get_data(self,da):
        date=webmodel
        return date
    def get(self,request,da):
        record=self.get_data(da)
        # print(record)
    
        serialized= agg_hhc_add_document_serializer(data=request.data)
        if serialized.is_valid():
            serialized.save()
            return Response({'message':'sucessful'},status=status.HTTP_201_CREATED)
        return Response(serialized.errors,status=status.HTTP_200_OK)
    
# --------------------------------------------------------------------------------------------------------------------------
# -------------------------------------------- add professional zone -------------------------------------------------------
class Add_Prof_location_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self,request):
        clgref_id = get_prof(request)[3]
        
        request.data['last_modified_by'] = clgref_id

        loc_serializer=agg_hhc_add_location_serializer(data=request.data)
        if loc_serializer.is_valid():
            loc_id=loc_serializer.save().prof_loc_id
            for i in range(len(request.data['lattitude'])):
                data={"lattitude":request.data['lattitude'][i],"longitude":request.data['longitude'][i],"prof_loc_id":loc_id}
                lat_long_serializer = agg_hhc_add_dtl_location_serializer(data=data)
                if lat_long_serializer.is_valid():
                    lat_long_serializer.save()
            return Response(loc_serializer.data, status=status.HTTP_200_OK)
        return Response(loc_serializer.errors, status=status.HTTP_200_OK)


#-------------------upcoming service( updated by vishal )-----------------------



class UpcomingServiceAPI(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        srv_prof_id = get_prof(request)[0]
        print("TOKEN___________ ", srv_prof_id)
        # Get tomorrow's date
        tomorrow = date.today() + timedelta(days=1)
        get_dtl_data_all = agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id=srv_prof_id,status=1)#.exclude(actual_StartDate_Time__lte=tomorrow)
        get_dtl_data = get_dtl_data_all.filter(srv_prof_id=srv_prof_id,actual_StartDate_Time__gte=date.today(),status=1)#.exclude(actual_StartDate_Time__lte=tomorrow)       
        # get_dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id=srv_prof_id,actual_StartDate_Time__gte=date.today(),status=1)#.exclude(actual_StartDate_Time__lte=tomorrow)
        print("all data is required ",get_dtl_data)
        ongoing_detail=get_dtl_data_all.filter(actual_StartDate_Time__lte=date.today()).values('eve_id').distinct()
        ongoing_detail=list(ongoing_detail)
        remove_event_list=[]
        for j in ongoing_detail:
            remove_event_list.append(j['eve_id'])
        get_dtl_data = get_dtl_data.filter(status=1).values('eve_id').distinct()#agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id=srv_prof_id,actual_StartDate_Time__gte=tomorrow,status=1).values('eve_id').distinct()
        unique_eve_ids = list(get_dtl_data)
        all_filtered_data = []
        for i in unique_eve_ids:
            if i['eve_id'] not in remove_event_list:
                print("record not found",i['eve_id'])
                filtered_records = agg_hhc_event_plan_of_care.objects.filter(eve_id=i['eve_id'],status=1,)
                serializer = UpcomingServiceAppSerializer(filtered_records, many=True)
                all_filtered_data.extend(serializer.data)
        return Response({'data':all_filtered_data},status=status.HTTP_200_OK)
    
#---------------------Completed services(updated by vishal)--------------------------------------


class CompletedServiceAPI(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    # def get(self, request, *args, **kwargs):
    #     srv_prof_id = get_prof(request)[0]
    #     print("TOKEN___________ ", srv_prof_id)     
    #     try:
    #         completed_services=[]
    #         # sessions = agg_hhc_event_plan_of_care.objects.filter(srv_prof_id=srv_prof_id, status=1, service_status=4)
    #         detail_event=agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id=srv_prof_id,status=1).values('eve_id').distinct()
    #         for i in detail_event:
    #             detail_sessions=agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id=srv_prof_id,eve_id=int(i['eve_id']),status=1)
    #             detail_session_total_count=detail_sessions.all().count()
    #             detail_sessions_completed_count=detail_sessions.filter(Session_jobclosure_status=1).count()
    #             print("total session is ",detail_session_total_count,"closed session is ",detail_sessions_completed_count)
    #             if detail_session_total_count==detail_sessions_completed_count:
    #                 detail_event_plan=agg_hhc_event_plan_of_care.objects.filter(eve_id=int(i['eve_id']),status=1).last()
    #                 completed_service={'patient_name':detail_event_plan.eve_id.agg_sp_pt_id.name,'service_name':detail_event_plan.srv_id.service_title,'address':detail_event_plan.eve_id.agg_sp_pt_id.address,'start_date':str(detail_event_plan.start_date),'event_id':int(i['eve_id'])}
    #                 print("service completed data is ",completed_service)
    #                 completed_services.append(completed_service)
    #         data = {"completed_service": completed_services}
    #         return Response(data, status=status.HTTP_200_OK)
    #     except agg_hhc_detailed_event_plan_of_care.DoesNotExist:
    #         return Response({'msg':"Does not found"},status=status.HTTP_200_OK)

    def get(self, request, *args, **kwargs):
        try:
            srv_prof_id = int(get_prof(request)[0])
            print("TOKEN___________ ", srv_prof_id)
            if not srv_prof_id:
                return Response({'msg': "Invalid service profile ID"}, status=status.HTTP_400_BAD_REQUEST)
        except (ValueError, TypeError):
            return Response({'msg': "Invalid service profile ID format"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            completed_services = []
            detail_event = agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id=srv_prof_id, status=1).values('eve_id').distinct()
            for i in detail_event:
                detail_sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id=srv_prof_id, eve_id=int(i['eve_id']), status=1)
                detail_session_total_count = detail_sessions.all().count()
                detail_sessions_completed_count = detail_sessions.filter(Session_jobclosure_status=1).count()
                print("total session is ", detail_session_total_count, "closed session is ", detail_sessions_completed_count)
                if detail_session_total_count == detail_sessions_completed_count:
                    detail_event_plan = agg_hhc_event_plan_of_care.objects.filter(eve_id=int(i['eve_id']), status=1).last()
                    if detail_event_plan:  # Check if detail_event_plan is not None
                        completed_service = {
                            'patient_name': detail_event_plan.eve_id.agg_sp_pt_id.name,
                            'service_name': detail_event_plan.srv_id.service_title,
                            'address': detail_event_plan.eve_id.agg_sp_pt_id.address,
                            'start_date':date_conveter(detail_event_plan.start_date),
                            'event_id': int(i['eve_id'])
                        }
                        print("service completed data is ", completed_service)
                        completed_services.append(completed_service)
                    else:
                        print(f"No detail_event_plan found for eve_id: {i['eve_id']}")
            data = {"completed_service": completed_services}
            return Response(data, status=status.HTTP_200_OK)
        except agg_hhc_detailed_event_plan_of_care.DoesNotExist:
            return Response({'msg': "Does not found"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'msg': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




#-------------------------cancel-----------------
class CancellationHistoryAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        srv_prof_id = get_prof(request)[0]
        print("TOKEN___________ ", srv_prof_id)
        cancellation_history_objects = agg_hhc_cancellation_history.objects.filter(srv__srv_prof_id=srv_prof_id)
        serializer = cancellation_history(cancellation_history_objects, many=True)
        data = {'data': serializer.data}
        return Response(data, status=status.HTTP_200_OK)


# ---------------------------- Vinayak - Professional Services and session  multiple updation made by vishal in api ---------------------------
class get_professional_srv_dtl_apiview(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    serializer_class = Ongoing_srv_sess_serializer
    def get(self, request):
        srv_prof_id = get_prof(request)[0]
        print("TOKEN___________ ", srv_prof_id)
        today = timezone.now().date()
        detail_event_plan_of_care_data=agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id=srv_prof_id,status=1).order_by('actual_StartDate_Time')
        detial_event_plan_of_care_ids=detail_event_plan_of_care_data.filter(status=1,actual_StartDate_Time__lte=today)
        remove_id=[]
#################################################################get all last detail_event_plan_of_care date and event_plan_of_care id  ########################################################################
        for dt in detial_event_plan_of_care_ids:
            last_detial=detail_event_plan_of_care_data.filter(status=1,eve_poc_id=dt.eve_poc_id).last()
            if last_detial:
                actual_start_datetime=datetime.strptime(str(last_detial.actual_StartDate_Time), "%Y-%m-%d").date()
                if(actual_start_datetime< timezone.now().date()):
                    remove_id.append(last_detial.eve_poc_id)
#################################################################get all last detail_event_plan_of_care date and event_plan_of_care id  Ends ########################################################################
        dtl_plan_data_prof = detail_event_plan_of_care_data.filter(status=1,actual_StartDate_Time__lte=today).values_list('eve_poc_id', flat=True).distinct()
        # dtl_plan_data_prof = detail_event_plan_of_care_data.filter(status=1,actual_StartDate_Time=today).values_list('eve_poc_id', flat=True).distinct()
        get_professional_srv_data1 = agg_hhc_event_plan_of_care.objects.filter(eve_poc_id__in=dtl_plan_data_prof,status=1).exclude(service_status=4)
        # print("data from event plan of care table",get_professional_srv_data1)
        ongoing_record=[]
        for i in get_professional_srv_data1:
            if i in remove_id:
                continue
            detail_event_plan_of_care_record=detail_event_plan_of_care_data.filter(eve_poc_id=i)
            detail_event_plan_of_care_record_completed=detail_event_plan_of_care_record.filter(Session_jobclosure_status=1).count()#total count of session
            if(detail_event_plan_of_care_record.count()!=detail_event_plan_of_care_record_completed):
                ongoing_record.append(i)
        serializer = self.serializer_class(ongoing_record, many=True)
        return Response({'message':serializer.data}, status=status.HTTP_200_OK)

#------------------------------------vishal send otp for patient before serice start------------------

class patient_start_service_otp_send(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        clgref_id = get_prof(request)[3]
        
        request.data['last_modified_by'] = clgref_id

        otp = random.randint(1000, 9999)
        number = request.data.get('phone')
        event_id=request.data.get('eve_id')
        otp_expire_time = timezone.now() + timezone.timedelta(minutes=10)
        msg = f"Use {otp} as your verification code on Spero Application. The OTP expires within 10 mins, {otp} Team Spero"
        try:
            # patient_info = agg_hhc_patients.objects.get(phone_no=number)
            detail_eve_plan_of_care=agg_hhc_detailed_event_plan_of_care.objects.get(agg_sp_dt_eve_poc_id=request.data.get('agg_sp_dt_eve_poc_id'))
            print("data found ")
            if detail_eve_plan_of_care:
                detail_eve_plan_of_care.OTP = otp
                if(detail_eve_plan_of_care.OTP_count is None):
                    detail_eve_plan_of_care.OTP_count = 0
                detail_eve_plan_of_care.OTP_count += 1
                detail_eve_plan_of_care.otp_expire_time = otp_expire_time
                detail_eve_plan_of_care.last_modified_by = clgref_id
                detail_eve_plan_of_care.save()
                # send_otp(number,msg)       #this function will be used to send otp 
                return Response({'phone_no': number, 'OTP': otp}, status=status.HTTP_200_OK)
        except agg_hhc_detailed_event_plan_of_care.DoesNotExist:
            return Response({'message': "Patient or caller with that number does not exist"}, status=status.HTTP_200_OK)
            
class patient_start_service_otp_check(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self,request):
        clgref_id = get_prof(request)[3]
        
        request.data['last_modified_by'] = clgref_id

        try:
            otp=request.data.get('otp')
            time = timezone.now()
            # print("now time is ",time)
            try:
                Detail_Event_Plan_of_Care=agg_hhc_detailed_event_plan_of_care.objects.get(agg_sp_dt_eve_poc_id=request.data.get('agg_sp_dt_eve_poc_id'),status=1)          
            except ObjectDoesNotExist:
                return Response({"User not found with this agg_sp_dt_eve_poc_id":request.data.get('agg_sp_dt_eve_poc_id')})
            # print("otp is ",type(Detail_Event_Plan_of_Care.OTP))
            # print("expire data ",Detail_Event_Plan_of_Care.otp_expire_time)
            # if(Detail_Event_Plan_of_Care.OTP == str(otp) and Detail_Event_Plan_of_Care.otp_expire_time > time):
            if("1234" == str(otp)):
                print(request.data.get('session_status')==1, ';sdfsdafdsd;;;;;;')
                if(request.data.get('session_status')==1):#this will start session for that day
                    print('1;;')
                    Detail_Event_Plan_of_Care.Session_status=8
                    print('2;;')
                    # Detail_Event_Plan_of_Care.start_time=timezone.now().time()
                    Detail_Event_Plan_of_Care.prof_session_start_time=(datetime.now().time()).strftime('%H:%M')
                    print('11;;;;')
                    Detail_Event_Plan_of_Care.prof_session_start_date=datetime.now().strftime('%Y-%m-%d')
                    print('3;;')
                    Detail_Event_Plan_of_Care.last_modified_by=clgref_id
                    print('4;;')
                    Detail_Event_Plan_of_Care.save()
                    print('5;;')
                    return Response( {"message": "Session started"},status=status.HTTP_200_OK)
                elif(request.data.get('session_status')==2):#this will complete the session
                    Detail_Event_Plan_of_Care.Session_status=9
                    # Detail_Event_Plan_of_Care.end_time=timezone.now().time()
                    Detail_Event_Plan_of_Care.prof_session_end_time=(datetime.now().time()).strftime('%H:%M')
                    Detail_Event_Plan_of_Care.prof_session_end_date=datetime.now().strftime('%Y-%m-%d')
                    Detail_Event_Plan_of_Care.last_modified_by=clgref_id
                    Detail_Event_Plan_of_Care.save()
                    return Response( {"message": "Session Completed"}, status=status.HTTP_200_OK) 
            else:
                return Response({"message": "Wrong OTP"}, status=status.HTTP_200_OK)
        except Exception as e:
           return Response({"message": "An error occurred: {}".format(str(e))}, status=status.HTTP_200_OK)
        
class patient_pending_amount(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self,request,eve_id):
        try:
            event_id=eve_id
            event_details=agg_hhc_events.objects.get(eve_id=event_id,status=1)
            # print("hi")
            payment_details=agg_hhc_payment_details.objects.filter(eve_id=event_id,status=1,overall_status="SUCCESS").last()
            if(payment_details is None):
                remaning_payment=int(event_details.final_amount)
                event_serializer=service_closure_serializer(event_details)
                patient=agg_hhc_patients.objects.get(agg_sp_pt_id=event_serializer.data.get('agg_sp_pt_id'))
                patient_serializer=agg_hhc_patients_serializer(patient)
                # print(patient_serializer.data)
                if(patient_serializer.data.get('patient_email_id')!=None):
                    patient_email=patient_serializer.data.get('patient_email_id')
                else:
                    patient_email="sperodesk@gmail.com"
                event_plan_of_care=agg_hhc_event_plan_of_care.objects.filter(eve_id=event_id,status=1).last()
                # print("hi4")
                # print(event_plan_of_care)
                plan_of_care_serializer=agg_hhc_event_plan_of_care_serializer(event_plan_of_care)
                # print(plan_of_care_serializer.data)
                # print("hi51")
                service=agg_hhc_services.objects.get(srv_id=plan_of_care_serializer.data.get('srv_id'))
                # print("hi6")
                service_serilizer=agg_hhc_services_serializer(service)
                # print("hi7")
                return Response({"patient_name":patient_serializer.data.get('name'),"patient_email":patient_email,"patient_number":patient_serializer.data.get('phone_no'),"patient_address":patient_serializer.data.get('address'),"remaining payment":remaning_payment,"service_cost":int(event_serializer.data.get('final_amount')),"service_title":service_serilizer.data.get('service_title'),"service_id":service_serilizer.data.get('srv_id'),"success":True,"event_id":plan_of_care_serializer.data.get('eve_id')}, status=status.HTTP_200_OK)
            else:
                remaning_payment=int(payment_details.amount_remaining)
                if(remaning_payment<=0):
                    return Response({"message":"not a single payment remain","success":False}, status=status.HTTP_200_OK)
                elif(remaning_payment>0):
                    # print("hi77")
                    event_serializer=service_closure_serializer(event_details)
                    patient=agg_hhc_patients.objects.get(agg_sp_pt_id=event_serializer.data.get('agg_sp_pt_id'))
                    patient_serializer=agg_hhc_patients_serializer(patient)
                    if(patient_serializer.data.get('patient_email_id')!=None):
                        patient_email=patient_serializer.data.get('patient_email_id')
                    else:
                        patient_email="sperodesk@gmail.com"
                    event_plan_of_care=agg_hhc_event_plan_of_care.objects.filter(eve_id=event_id,status=1).last()
                    plan_of_care_serializer=agg_hhc_event_plan_of_care_serializer(event_plan_of_care)
                    service=agg_hhc_services.objects.get(srv_id=plan_of_care_serializer.data.get('srv_id'))
                    service_serilizer=agg_hhc_services_serializer(service)
                    return Response({"patient_name":patient_serializer.data.get('name'),"patient_email":patient_email,"patient_number":patient_serializer.data.get('phone_no'),"patient_address":patient_serializer.data.get('address'),"remaining payment":remaning_payment,"service_cost":int(event_serializer.data.get('final_amount')),"service_title":service_serilizer.data.get('service_title'),"service_id":service_serilizer.data.get('srv_id'),"success":True,"event_id":plan_of_care_serializer.data.get('eve_id')}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "An error occurred: {}".format(str(e))}) 
        

class select_number_to_send_opt(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self,request,eve_id):
        try:
            event=agg_hhc_events.objects.filter(eve_id=eve_id,status=1).last()
            event_serializer=service_closure_serializer(event)
            patient=agg_hhc_patients.objects.get(agg_sp_pt_id=event_serializer.data.get('agg_sp_pt_id'))
            patient_serializer=patient_serializer_to_select_number_to_send_opt(patient)
            return Response(patient_serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "An error occurred: {}".format(str(e))})



class payment_recived_by_prof(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        # clgref_id = get_prof(request)[3]
        
        # request.data['last_modified_by'] = clgref_id
        print("hi")
        try:
           
            amount_paid = int(request.data.get('amount_paid'))
            cheque_image_file = request.data.get('cheque_image')
            clg_ref_id = request.data.get("pay_recived_by")
            # print(clg_ref_id)
            colleague = agg_com_colleague.objects.get(clg_ref_id=clg_ref_id)#w
            print("hi 2")
            if int(request.data.get('mode'))==2:
                print("hi 3")
                cheque_status=1
                payment_status=1
            else:
                payment_status=1
                cheque_status=None
                print("hi 4")
            # print(str(request.data.get("pay_recived_by")))
           
            data = {
                'amount_paid': amount_paid,
                'pay_recived_by': colleague.id,
                'eve_id': int(request.data.get('eve_id')),
                'Total_cost': int(request.data.get('Total_cost')),
                'amount_remaining': abs(int(request.data.get('amount_remaining'))-amount_paid),
                'mode': int(request.data.get('mode')),# 1 is cash 2 is cheque 3 is online
                'bank_name':request.data.get('bank_name'),
                'cheque_image': cheque_image_file,  
                'cheque_date':request.data.get('cheque_date'),
                'order_note':request.data.get('order_note'),
                'cheque_number':request.data.get('cheque_number'),
                'is_delete_status':2,
                'payment_status':payment_status,
                'overall_status':"SUCCESS",
                'cheque_status':cheque_status,
                'added_by':colleague.id,
                'last_modified_by':colleague.id
            }
            print("hi 5")            
            payment_details_serializer = agg_hhc_payment_details_serializer(data=data)
            print("h6")
            if payment_details_serializer.is_valid():
                print("working ")
                payment_details_serializer.save()
                print("data saved ")
                # print(payment_details_serializer.data)
                return Response({"message": payment_details_serializer.data}, status=status.HTTP_200_OK)
            print("record not saved")
            return Response({"message": "Invalid data provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"message": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class professional_dashboard_count(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    # def get(self,request,prof_id):
    def get(self,request):
        prof_id = get_prof(request)[0]
        print("TOKEN___________ ", prof_id)
        try:
            prof=agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id=prof_id,actual_StartDate_Time=timezone.now().date(),status=1)#actual_StartDate_Time__date get date out of date and time field
            Allocated_services=0
            Session_completed=0
            Session_incompleted=0
            Reschedule_count=0
            for i in prof:
                Allocated_services+=1
                if i.Session_status==9:
                    Session_completed+=1
                    if i.Reschedule_status==1:
                        Reschedule_count+=1
                else:
                    if i.Reschedule_status==1:
                        Reschedule_count+=1
                    Session_incompleted+=1                    
            return Response({'Allocated':Allocated_services,'Closed':Session_completed,'pending_for_closure':Session_incompleted,'Reschedule_count':Reschedule_count},status=200)
        except Exception as e:
            return Response({'error':e},status=500)










#------------------------------srv_sesson------------mayank-----------------------------------------------------

class SrvSessAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    # def get(self, request, srv_prof_id, eve_id):
    def get(self, request, eve_id):
        try:
            srv_prof_id = get_prof(request)[0]
            print("TOKEN___________ ", srv_prof_id)
            sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=eve_id, srv_prof_id=srv_prof_id, status=1)
            serializer = srv_sess_serializer(sessions, many=True)
            # ss = 9    
            #today_date = timezone.now().date()

            ongoing_sessions = []
            upcoming_sessions = []
            completed_sessions = []
          

            for session in serializer.data:
                start_date = datetime.strptime(session['actual_StartDate_Time'], "%Y-%m-%d").date()
                end_date = datetime.strptime(session['actual_EndDate_Time'], "%Y-%m-%d").date()

                cancelled = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=eve_id, srv_prof_id=srv_prof_id, is_cancelled=1, status=2)
                serializer_cancel = get_canceled_data_prof(cancelled, many=True)
                

                if session['Session_jobclosure_status'] == 1:
                    completed_sessions.append(session)
                elif start_date == timezone.now().date():
                    ongoing_sessions.append(session)
                elif start_date > timezone.now().date():
                    upcoming_sessions.append(session)
                elif(start_date == timezone.now().date()):
                    ongoing_sessions.append(session)
                # else:
                #     ongoing_sessions.append(session)

                # if cancelled.exists:
                #     

            data = {
                "ongoing_session": ongoing_sessions,
                "upcoming_session": upcoming_sessions,
                "completed_session": completed_sessions,
                "cancelled_sessions":serializer_cancel.data
            }

            return Response({"data": data}, status=status.HTTP_200_OK)

        except agg_hhc_detailed_event_plan_of_care.DoesNotExist:
            return Response({'msg': 'Data not found.'}, status=status.HTTP_200_OK)
        
#---------------------------------only today session -------mayank------------------

class TodaySessAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    # def get(self, request, srv_prof_id):
    def get(self, request):
        try:
            srv_prof_id = get_prof(request)[0]
            print("TOKEN___________ ", srv_prof_id)
            sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id=srv_prof_id, status=1,actual_StartDate_Time=timezone.now().date()).exclude(Session_jobclosure_status=1).order_by('start_time')
            print("Dtl Sess-- ",sessions)
            serializer = srv_sess_serializer(sessions, many=True)
            today = timezone.now().date()
            ongoing_session = []

            for session in serializer.data:
                # start_date = datetime.strptime(session['actual_StartDate_Time'], "%Y-%m-%d").date()
                # end_date = datetime.strptime(session['actual_EndDate_Time'], "%Y-%m-%d").date()
                # if start_date == today:
                ongoing_session.append(session)

            data = {
                'Ongoing Session': ongoing_session,
            }
            # print("Today's data-- ", data)
            return Response({'data': data}, status=status.HTTP_200_OK)
        except agg_hhc_detailed_event_plan_of_care.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
#----------------------------only current ongoing session--------------------------


class CurrentSessAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    # def get(self, request, srv_prof_id):
    def get(self, request):
        try:
            last_session=None
            srv_prof_id = get_prof(request)[0]
            print("TOKEN_______________", srv_prof_id)
            today = timezone.now()
            sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id=srv_prof_id, status=1,Session_jobclosure_status=2,actual_StartDate_Time=today.date()).order_by('start_time')
            lis=[]
            serializer = srv_sess_serializer(sessions, many=True)
            for i in serializer.data:
                lis.append(i['start_time'])
            all_sessions = []
            s=0
            for session in serializer.data:
                s=s+1
                if session['actual_StartDate_Time'] is None or session['actual_EndDate_Time'] is None \
                        or session['start_time'] is None or session['end_time'] is None:
                    continue  
                start_date = datetime.strptime(session['actual_StartDate_Time'], "%Y-%m-%d").date()
                time_string = session['start_time']
                format_string = '%H:%M:%S.%f' if '.' in time_string else '%H:%M:%S'
                start_time = datetime.strptime(time_string, format_string).time()
                end_date = datetime.strptime(session['actual_EndDate_Time'], "%Y-%m-%d").date()
                time_string = session['end_time']
                format_string = '%H:%M:%S.%f' if '.' in time_string else '%H:%M:%S'
                end_time = datetime.strptime(time_string,format_string).time()
                start_datetime = timezone.make_aware(datetime.combine(start_date, start_time), timezone.get_current_timezone())
                end_datetime = timezone.make_aware(datetime.combine(end_date, end_time), timezone.get_current_timezone())
                start_time=time.fromisoformat(session['start_time'])
                end_time=time.fromisoformat(session['end_time'])
                try:
                    hr1add = (datetime.now() + timedelta(hours=1)).time()
                    if start_time<=hr1add and  datetime.now().time()<time.fromisoformat(lis[s]):
                        # if datetime.now().time() in range(start_time,time.fromisoformat(lis[s])):
                        if start_time <= hr1add <= time.fromisoformat(lis[s]):
                            all_sessions.append((start_datetime, end_datetime, session))
                        elif(end_time<datetime.now().time() and end_time<time.fromisoformat(lis[s]) and start_time<datetime.now().time()):
                            continue
                        # if end_time<datetime.now().time():
                        #     print("not         tat     sfsdfjssdgssgggggggggggggggggg")
                        all_sessions.append((start_datetime, end_datetime, session))
                except:
                    if start_time<=hr1add:# and now_time<session['end_time']:
                        print("data added from this var")
                        all_sessions.append((start_datetime, end_datetime, session))
            all_sessions.sort(key=lambda x: x[0])
            #from this its useless code it just chages formate of code nothing else
            current_session = None
            if all_sessions:
                for sess in all_sessions:
                    # Find the first non-ended session or session with status != 9
                    if sess[2]['Session_status']:# != 9:
                        current_session = sess[2]
                        print("hi we are in loop")
                        break# till this its useless code
            data = {'Current Session':current_session}#"discount_type":discount_type}
            return Response(data, status=status.HTTP_200_OK)
        except agg_hhc_detailed_event_plan_of_care.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        





        
#-----------------------------payment_from_professional_to_spero----------------------------------

class payment_from_professional_to_spero(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self,request):
        try:
            # clg_id = request.GET.get('clg_id')

            clg_id = get_prof(request)[1]
            print("CLG ID___________ ", clg_id)

            # clgid = agg_com_colleague.objects.get(clg_ref_id = clg_id)
            clgid = agg_com_colleague.objects.get(id = clg_id)
            payments =agg_hhc_payment_details.objects.filter(status=1,pay_recived_by=clgid.id,payment_status=1,mode=1,overall_status="SUCCESS")
            # print(payments,"paymentssss")
            Total_amount=0
            res = []
            for i in payments:
                Total_amount+=i.amount_paid
            # print(Total_amount,"Total_amount")
            list_pays_ser = list_pays_serializer(payments, many=True)
            # print(Total_amount,"Total_amount")
            try:
                for i in list_pays_ser.data:
                    print("Hiiiiii")
                    eve_id = i['eve_id']
                    eve = agg_hhc_events.objects.get(eve_id = eve_id)
                    eve_plan = agg_hhc_event_plan_of_care.objects.get(eve_id=eve)
                    pay_dt_id = i['pay_dt_id']
                    Total_cost = float(i['Total_cost'])
                    amount_paid = float(i['amount_paid'])
                    amount_remaining = i['amount_remaining']

                    p_name = eve.agg_sp_pt_id.name
                    s_time = eve_plan.start_date
                    e_time = eve_plan.end_date
                    subsrv_id = eve_plan.sub_srv_id

                    # sub_srv = agg_hhc_sub_services.objects.get(recommomded_service=subsrv_id)
                    # sub_srv_name = sub_srv.recommomded_service
                    sub_srv_name = eve_plan.sub_srv_id.recommomded_service
                    
                    pay_dtl = {
                        "pay_dt_id": pay_dt_id,
                        "Total_cost": Total_cost,
                        "amount_paid": amount_paid,
                        # "amount_remaining": amount_remaining,
                        "p_name": p_name,
                        "s_time": str(s_time),
                        "e_time": str(e_time),
                        "sub_srv_name": sub_srv_name
                    }
                    res.append(pay_dtl)
            except Exception as e:
                return Response({"error":str(e)})

        
            
            # print("res+++++++= ", res)
            print(Total_amount,"Total_amount")
            return Response({"Record":res, "Total_amount":int(Total_amount)},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"Record":[], "Total_amount":int("0")},status=status.HTTP_200_OK)

    # def get(self,request):
    #     try:
    #         # clg_id = request.GET.get('clg_id')

    #         clg_id = get_prof(request)[1]
    #         print("CLG ID___________ ", clg_id)

    #         # clgid = agg_com_colleague.objects.get(clg_ref_id = clg_id)
    #         clgid = agg_com_colleague.objects.get(id = clg_id)
    #         payments =agg_hhc_payment_details.objects.filter(status=1,pay_recived_by=clgid.id,payment_status=1,mode=1,overall_status="SUCCESS")
    #         Total_amount=0
    #         res = []
    #         for i in payments:
    #             Total_amount+=i.amount_paid
                
    #         list_pays_ser = list_pays_serializer(payments, many=True)
    #         for i in list_pays_ser.data:
    #             eve_id = i['eve_id']
    #             eve = agg_hhc_events.objects.get(eve_id = eve_id)
    #             eve_plan = agg_hhc_event_plan_of_care.objects.get(eve_id=eve)
    #             pay_dt_id = i['pay_dt_id']
    #             Total_cost = float(i['Total_cost'])
    #             amount_paid = float(i['amount_paid'])
    #             amount_remaining = i['amount_remaining']

    #             p_name = eve.agg_sp_pt_id.name
    #             s_time = eve_plan.start_date
    #             e_time = eve_plan.end_date
    #             subsrv_id = eve_plan.sub_srv_id

    #             sub_srv = agg_hhc_sub_services.objects.get(recommomded_service=subsrv_id)
    #             sub_srv_name = sub_srv.recommomded_service

    #             pay_dtl = {
    #                 "pay_dt_id": pay_dt_id,
    #                 "Total_cost": Total_cost,
    #                 "amount_paid": amount_paid,
    #                 # "amount_remaining": amount_remaining,
    #                 "p_name": p_name,
    #                 "s_time": str(s_time),
    #                 "e_time": str(e_time),
    #                 "sub_srv_name": sub_srv_name
    #             }
    #             res.append(pay_dtl)
    #         # print("res+++++++= ", res)
    #         return Response({"Record":res, "Total_amount":int(Total_amount)},status=status.HTTP_200_OK)
    #     except Exception as e:
    #         return Response({"Record":[], "Total_amount":int("0")},status=status.HTTP_200_OK)





# ------------------- professional service cancellation api --------------------

class srv_cancelled_pro_app(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    serializer_class = get_event_poc_data
    # def get(self, request, srv_prof_id, format=None):  
    def get(self, request, format=None):  
        srv_prof_id_is = get_prof(request)[0]
        print("TOKEN___________ ", srv_prof_id_is)
        cancellation_history_data = []
        cancellation_history_objects = agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id=srv_prof_id_is).values('eve_poc_id').distinct().order_by('actual_StartDate_Time')
        for event_plan_of_care in cancellation_history_objects:
            cancellation_history_objects = agg_hhc_event_plan_of_care.objects.filter(eve_poc_id=event_plan_of_care['eve_poc_id'],status=2).order_by('start_date')#srv_prof_id = srv_prof_id_is,
            # print(cancellation_history_objects[0].canceled_date, ';..............')
            serialized_data = self.serializer_class(cancellation_history_objects, many=True).data

            if serialized_data:
                cancellation_history_data.extend(serialized_data)
          

        if cancellation_history_data:
            response_data = {
                'eopc': cancellation_history_data
            }
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            response_data = {
                'eopc': cancellation_history_data
            }
            return Response(response_data, status=status.HTTP_200_OK)



#feedback ---------------api-------created-----by---------vishal--🤣--------------------------next 
class feedback(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,lan):
            data_list=[]
            questions=FeedBack_Questions.objects.filter(status=1,question_for=2)#2=professional
            for i in questions:
                if(int(lan)==1):#marathi
                    mar_data={'F_questions':i.F_questions,'Question_mar':i.Question_mar}
                elif(int(lan)==2):#hindi
                    mar_data={'F_questions':i.F_questions,'Question_mar':i.Question_hin}
                else:#English
                    mar_data={'F_questions':i.F_questions,'Question_mar':i.Question_eng}
                data_list.append(mar_data)
            # question_serializer=question_feedback_serializer(questions,many=True)
            return Response({"message":data_list})

    def post(self,request):
        try:
            if(int(request.data.get('feedback_by'))==3):
                srv_prof_id_is=request.data.get('serv_prof_id')
            else:
                srv_prof_id_is = get_prof(request)[0]
            unused=['[','{',']','}']
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
            feedback_by_is=1 #1 for professional = 1
            del dictionary['eve_id']
            del  dictionary['feedback_by']
            print("list is not ",dictionary)
            question_data=FeedBack_Questions.objects.filter(status=1,question_for=2)#.values('F_questions')
            list_comp = [k.F_questions for k in question_data]
            print(list_comp)
# get professional object from professinoal id #
            professional=agg_hhc_service_professionals.objects.get(srv_prof_id=srv_prof_id_is)
#end get professional object from professinoal id #
#------------------------------------save feedback media--------------------
            feed_serializer=feedback_media_serializer(data=request.data)
            if feed_serializer.is_valid():
                feed_serializer.save()
            feedback_obj=agg_hhc_feedback_media_note.objects.get(feedbk_med_id=feed_serializer.data['feedbk_med_id']) # this is feedback id
            t=0
            for i in list_comp:
                try:
                    question=question_data.filter(F_questions=int(list_comp[t])).last()
                    event_record=agg_hhc_events.objects.filter(eve_id=event_id_is).last()
                    print("this is the professional ",professional)
                    agg_hhc_Professional_app_feedback.objects.create(eve_id=event_record,q1=question,rating=new_list[t],feedback_by=int(feedback_by_is),srv_prof_id=professional,feedbk_med_id=feedback_obj,added_by=get_prof(request)[1])#,
                    t=t+1
                except:
                    t=t+1
            return Response({'message':"Feedback submited "})
        except Exception as e:
            return Response({"message":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class MyView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]    
    def get(self, request, pt_id, eve_id, agg_sp_dt_eve_poc_id=None, *args, **kwargs):
        try:
            try:
                data_from_table1 = agg_hhc_Professional_app_feedback.objects.filter(pt_id=pt_id,eve_id=eve_id,status=1).first()                
                feeedback={'rating':data_from_table1.rating,'comment':data_from_table1.comment}
            except:
                feeedback={'rating':None,'comment':None}
            # Pending Amount ---suffer from ------------------------------------------------------------------------------------       
            try:
                events=agg_hhc_events.objects.filter(eve_id=eve_id,status=1).last()
                suffer_from=events.Suffered_from
            except:
                suffer_from="None"
            try:
                payment_details=agg_hhc_payment_details.objects.filter(eve_id=eve_id,status=1,overall_status="SUCCESS").last()
                pending_amount=int(payment_details.amount_remaining)
            except:
                pending_amount=events.final_amount
            data_from_table11=agg_hhc_patients.objects.filter(status=1,agg_sp_pt_id=pt_id).first()
            patient_serializer=agg_hhc_patients_serializer_from_pro_app(data_from_table11)
            # Apply filter conditionally based on agg_sp_dt_eve_poc_id presence in the URL
            if agg_sp_dt_eve_poc_id is not None:
                data_from_table2 = agg_hhc_detailed_event_plan_of_care.objects.filter(
                    eve_id__agg_sp_pt_id=pt_id, eve_id=eve_id, agg_sp_dt_eve_poc_id=agg_sp_dt_eve_poc_id,status=1
                ).first()
            else:
                data_from_table2 = agg_hhc_detailed_event_plan_of_care.objects.filter(
                    eve_id__agg_sp_pt_id=pt_id, eve_id=eve_id,status=1
                ).first()

            data_from_table3 = agg_hhc_events.objects.filter(agg_sp_pt_id=pt_id,status=1).exclude(enq_spero_srv_status=3).first()
            total_count = agg_hhc_events.objects.filter(agg_sp_pt_id=pt_id,status=1).exclude(enq_spero_srv_status=3).count()
            
            custom_serializer = CustomSerializer({
                'pt_id': pt_id,
                'eve_id': eve_id,
                # 'field1': data_from_table1,
                'field2': data_from_table2,
                'field3': total_count
            })

            response_data = {
                'custom_data': custom_serializer.data,
                'patient_data': patient_serializer.data,
                'feedback': feeedback,
                'pending_amount':pending_amount,
                'suffer_from':suffer_from,
            }

            return Response(response_data, status=status.HTTP_200_OK)

            # return Response(custom_serializer.data,patient_serializer.data,feeedback.data,status=status.HTTP_200_OK)
        except Exception as e:
            raise NotFound(detail=str(e))
            # raise e




class cancelled_request_professional(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    serializer_class_service = canellation_service_request_from_prof
    serializer_class_session = canellation_session_request_from_prof
    def get(self, request):
        data = agg_hhc_cancellation_and_reschedule_request.objects.filter(added_date=timezone.now().date(), is_canceled=2,is_deleted=1)
        serializer = self.serializer_class_service(data, many=True)
        return Response(serializer.data)
    def post(self, request):
        clgref_id = get_prof(request)[3]
        srv_prof = get_prof(request)[0]

        
        request.data['last_modified_by'] = clgref_id
        request.data['srv_prof_id'] = srv_prof

        try:
            res_idd = int(request.data.get('req_resson'))
            get_reson = agg_hhc_enquiry_follow_up_cancellation_reason.objects.get(
                cancelation_reason_id=res_idd
            )
            request.data['req_resson'] = get_reson.cancelation_reason

        except (ValueError, TypeError):
            request.data['req_resson'] = "error"

        except agg_hhc_enquiry_follow_up_cancellation_reason.DoesNotExist:
            request.data['req_resson'] = "error"

        try:
            srv_sen=request.data.get('is_srv_sesn')
            if srv_sen == 1:
                # request.data['dtl_eve_id']=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=request.data['eve_id'], srv_prof_id=srv_prof, status=1).last().agg_sp_dt_eve_poc_id if agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=request.data['eve_id'], srv_prof_id=srv_prof, status=1).last().agg_sp_dt_eve_poc_id else None
                serailizer = self.serializer_class_service(data=request.data)
                if serailizer.is_valid():
                    serailizer.save()

                    return Response({"Response":serailizer.data,"message":"Cancelled request send successfully"})
                else:
                    return Response({"Response":'not ok'})
            elif srv_sen == 2:
                serailizer = self.serializer_class_session(data=request.data)
                if serailizer.is_valid():
                    serailizer.save()
                    return Response({"Response":serailizer.data,"message":"Cancelled request send successfully"})
                else:
                    return Response({"Response":'not ok'})
        except Exception as e:
            return Response({"message": "An error occurred: {}".format(str(e))})
        



# ---------------- servie and session Reschedule Request --------------

class Reschedule_request_professional(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    serializer_class_service = Reschedule_service_request_from_prof
    serializer_class_session = Reschedule_session_request_from_prof
    def get(self, request):
        data = agg_hhc_cancellation_and_reschedule_request.objects.filter(added_date=timezone.now().date(), is_canceled=1,is_deleted=1)
        serializer = self.serializer_class_service(data, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        clgref_id = get_prof(request)[3]
        srv_prof = get_prof(request)[0]

        
        request.data['last_modified_by'] = clgref_id
        request.data['srv_prof_id'] = srv_prof



        try:
            srv_sen=request.data.get('is_srv_sesn')
            if srv_sen == 1:
                serailizer = self.serializer_class_service(data=request.data)
                if serailizer.is_valid():
                    serailizer.save()
                    return Response({"Response":serailizer.data})
                else:
                    return Response({"Response":'not ok','error':serailizer.errors})
            elif srv_sen == 2:
                serailizer = self.serializer_class_session(data=request.data)
                if serailizer.is_valid():
                    serailizer.save()
                    return Response({"Response":serailizer.data})
                else:
                    return Response({"Response":'not ok','error':serailizer.errors})
        except Exception as e:
            return Response({"message": "An error occurred: {}".format(str(e))})
        


class Transport_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    
    def get(self,request):
        # srv_prof_id = request.GET.get('pro')
        srv_prof_id = get_prof(request)[0]
        print("TOKEN___________ ", srv_prof_id)
        try:
            transport_get=agg_hhc_transport.objects.filter(status=1,srv_prof_id=srv_prof_id).last()
            transport_serializer=agg_hhc_transport_serializer(transport_get)
            if transport_serializer.data.get('Transport_type')==1:
                Transport_type="Public"
            elif(transport_serializer.data.get('Transport_type')==2):
                Transport_type="Private"
            else:
                Transport_type=None
            if(transport_serializer.data.get('vehicle_type')==1):
                vehicle_type='Car'
            elif(transport_serializer.data.get('vehicle_type')==2):
                vehicle_type='Bike'
            elif(transport_serializer.data.get('vehicle_type')==3):
                vehicle_type="Bus"
            elif(transport_serializer.data.get('vehicle_type')==4):
                vehicle_type="Metro"
            elif(transport_serializer.data.get('vehicle_type')==5):
                vehicle_type="Auto"
            elif(transport_serializer.data.get('vehicle_type')==6):
                vehicle_type="Train"
            else:
                vehicle_type=None
            return Response({'transp_id':transport_serializer.data.get('transp_id'),'srv_prof_id':transport_serializer.data.get('srv_prof_id'),'pass_number':transport_serializer.data.get('pass_number'),'Transport_type':Transport_type,'start_date':transport_serializer.data.get('start_date'),'end_date':transport_serializer.data.get('end_date'),'vehicle_no':transport_serializer.data.get('vehicle_no'),'vehicle_type':vehicle_type})
            #return Response({'record':transport_serializer.data,"Transport_type_name":"no"},status=200)
        except Exception as e:
            return Response({"message": "An error occurred: {}".format(str(e))})
        
    def post(self,request):
        clgref_id = get_prof(request)[3]
        
        request.data['last_modified_by'] = clgref_id
        types = int(request.GET.get('type'))
        srv_prof_id = get_prof(request)[0]
        request.data['srv_prof_id'] = srv_prof_id
        print("TOKEN___________ ", srv_prof_id)
        try:
            # if types == 1:
            #     transport_serializer=agg_hhc_transport_serializer1(data=request.data)
            # if types == 2:
            transport_serializer=agg_hhc_transport_serializer(data=request.data)

            if transport_serializer.is_valid():
                transport_serializer.save()
                return Response({"Response":"Successfully Added Record"}, status=status.HTTP_200_OK)
            else :
                return Response({"Response":"Not Added"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "An error occurred: {}".format(str(e))})




class last_login_check(APIView):
    def post(self,request):
        # clg_id=request.data.get('clg_id')
        device_token=request.data.get('token')
        try:
            clg_id=agg_com_colleague.objects.get(clg_ref_id=request.data.get('clg_id'))
            login_check=DeviceToken.objects.get(clg_id=clg_id.id,token=device_token)
            return Response({'is_login':login_check.is_login,"sucess":True})
        except Exception as e:
            return Response({"message": "An error occurred: {}".format(str(e)),"sucess":False},)
        
# class Send_Notification(APIView):
#     def post(self, request):
#         server_key = request.data['key']
#         url = 'https://fcm.googleapis.com/fcm/send'
#         device_token = request.data['token']
#         notification = { 'title': 'this is your notification', 'body': 'this is your body of notification'}
#         payload = {'to': device_token,'notification': notification}
#         headers = {'Authorization': f'key={server_key}', 'Content-Type': 'application/json'}
#         response = requests.post(url, json=payload, headers=headers)
#         print(response.status_code)
#         # print(.json())
#         return Response(response.status_code)
    
class Send_Notification(APIView):
    def post(self, request):
        # professional = request.data['srv_prof_id']
        professional = get_prof(request)[0]
        request.data['srv_prof_id'] = professional
        print("TOKEN___________ ", professional)
        prof = agg_hhc_service_professionals.objects.get(srv_prof_id=professional)
        # print(prof.clg_ref_id.clg_is_login)
        if prof.clg_ref_id.clg_is_login:
            url = 'https://fcm.googleapis.com/fcm/send'
            device_token = DeviceToken.objects.get(clg_ref_id=prof.clg_ref_id)
            # print(device_token)
            server_key = SERVER_KEY
            # print(device_token.token,';;;;')
            notification = { 'title': 'New Service Request', 'body': 'this is your body of notificationthis is your body of notificationthis is your body of notificationthis is your body of notificationthis is your body of notificationthis is your body of notificationthis is your body of notificationthis is your body of notificationthis is your body of notificationthis is your body of notificationthis is your body of notificationthis is your body of notificationthis is your body of notificationthis is your body of notificationthis is your body of notificationthis is your body of notificationthis is your body of notification1'}
            payload = {'to': device_token.token,'notification': notification}
            headers = {'Authorization': f'key={server_key}', 'Content-Type': 'application/json'}
            response = (requests.post(url, json=payload, headers=headers)).json()
            # print(response)
            # print(response)
            return JsonResponse(response, safe=False)
        else:
            return Response('professional is not login')

class Professional_Notification_List(APIView):
    # def get(self, request, prof):
    def get(self, request):
        prof = get_prof(request)[0]
        print("TOKEN___________ ", prof)
        professional = Professional_notification.objects.filter(srv_prof_id=prof)
        professional_serializer = professional_list_serializer(professional, many=True)
        return Response({'notification':professional_serializer.data})



class call_back_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self,request):
        clgref_id = get_prof(request)[3]
        
        request.data['last_modified_by'] = clgref_id

        try:
            request.data['clg_id']= get_prof(request)[1]
            serialized= professional_call_back_serializer(data=request.data)
            if serialized.is_valid():
                serialized.save()
                return Response({'message':serialized.data},status=status.HTTP_201_CREATED)
            return Response(serialized.errors,status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({"error":"Internal Server Error"}, status=500)
        

class feedback_status(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,eve_id,dt_event):
        try:
            prof = get_prof(request)[0]
            detail_event=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=eve_id,status=1,srv_prof_id=prof).order_by("actual_StartDate_Time")
            date_list=[]
            for j in detail_event:
                date_list.append(j.actual_StartDate_Time)
            perticular_data=detail_event.filter(agg_sp_dt_eve_poc_id=dt_event).last()
            perticular_date_updated=perticular_data.actual_StartDate_Time+timedelta(days=1)
            if str(perticular_date_updated) in date_list:
                feedback_value=False
            else:
                feedback_value=True
            return  Response({'feedback_value':str(feedback_value)})
        except Exception as e:
            return Response({"Error":str(e)})



class pending_services(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        try:
            pending_service_list=[]
            prof = get_prof(request)[0]
            today = timezone.now().date()
            all_detail_event=agg_hhc_detailed_event_plan_of_care.objects.filter(status=1,srv_prof_id=prof,Session_jobclosure_status=2,actual_StartDate_Time__lt=today).order_by('actual_StartDate_Time')
            # all_detail_event=agg_hhc_detailed_event_plan_of_care.objects.filter(status=1,srv_prof_id=prof,Session_jobclosure_status=2,actual_StartDate_Time__lt=today)
            event_list=all_detail_event.filter(Session_jobclosure_status=2).values_list('eve_poc_id', flat=True).distinct()
            for i in event_list:
                detail_event=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_poc_id=i,status=1,srv_prof_id=prof).last()
                if(detail_event.actual_StartDate_Time<timezone.now().date()):
                    last_detail_event=agg_hhc_detailed_event_plan_of_care.objects.filter(status=1,srv_prof_id=prof,eve_poc_id=i).first()
                    last_last_detail_event=agg_hhc_detailed_event_plan_of_care.objects.filter(status=1,srv_prof_id=prof,eve_poc_id=i).last()
                    # service={'patient_name':'name'}
                    if(last_last_detail_event.actual_StartDate_Time):
                        actural_EndDate=date_conveter(last_last_detail_event.actual_StartDate_Time)
                    else:
                        actural_EndDate=''
                    if(last_detail_event.actual_StartDate_Time):
                        actual_startdate=date_conveter(last_detail_event.actual_StartDate_Time)
                    else:
                        actual_startdate=''
                    service={'event_id':last_detail_event.eve_id if last_detail_event.eve_id else '','patient_name':last_detail_event.eve_id.agg_sp_pt_id.name if last_detail_event.eve_id.agg_sp_pt_id.name else '','event_id':last_detail_event.eve_id.eve_id if last_detail_event.eve_id.eve_id else '','sub_service':last_detail_event.eve_poc_id.sub_srv_id.recommomded_service if last_detail_event.eve_poc_id.sub_srv_id.recommomded_service else '','patient_goole_address':last_detail_event.eve_id.agg_sp_pt_id.google_address if last_detail_event.eve_id.agg_sp_pt_id.google_address else '','patient_address':last_detail_event.eve_id.agg_sp_pt_id.address if last_detail_event.eve_id.agg_sp_pt_id.address else '','agg_sp_pt_id':last_detail_event.eve_id.agg_sp_pt_id.agg_sp_pt_id,'start_time':str(last_detail_event.start_time),'end_time':str(last_detail_event.end_time),'actual_StartDate_Time':actual_startdate,'actural_EndDate':actural_EndDate}
                    pending_service_list.append(service)
            return Response({'pending_services':pending_service_list})
        except Exception as e:
            return Response({"Error":str(e)})



class pending_sessions(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,eve_id):
        try:
            pending_service_list=[]
            prof = get_prof(request)[0]
            all_detail_event=agg_hhc_detailed_event_plan_of_care.objects.filter(status=1,srv_prof_id=prof,Session_jobclosure_status=2,eve_id=eve_id,actual_StartDate_Time__lt=timezone.now().date()).order_by('actual_StartDate_Time')
            for i in all_detail_event:
                time= timezone.now()# + timedelta(hours=24)
                session_start=None
            # if (i.actual_StartDate_Time<timezone.now().date()):
                start_datetime_naive = datetime.combine(i.actual_StartDate_Time, i.start_time)
                start_datetime = timezone.make_aware(start_datetime_naive, timezone.get_default_timezone())#+timedelta(hours=24)
                start_datetime=start_datetime+timedelta(hours=24)
#------------------------current datetime foramte changed for test server-------------------------------------------------
                current_time = timezone.now().astimezone(pytz.utc)
                formatted_time = current_time.strftime('%Y-%m-%d %H:%M:%S.%f%z')
                formatted_time = formatted_time[:-2] + ':' + formatted_time[-2:]
                datetime_format = '%Y-%m-%d %H:%M:%S.%f%z'
                formatted_time = formatted_time[:-3] + formatted_time[-2:]
                parsed_datetime = datetime.strptime(formatted_time, datetime_format)
                print("Parsed datetime object:", parsed_datetime)
                print("timezone",timezone.now())
                print("new time",formatted_time,type(formatted_time))
#------------------------current datetime foramte changed end for test server-------------------------------------------------

                if start_datetime<parsed_datetime:
                    session_start=False
                else:
                    session_start=True
                if i.actual_StartDate_Time:
                    actual_EndDate_Time=date_conveter(i.actual_EndDate_Time)
                    actual_StartDate_Time= date_conveter(i.actual_StartDate_Time)#str(i.actual_StartDate_Time.strftime("%d-%m-%Y"))
                else:
                    actual_StartDate_Time=''
                    actual_EndDate_Time=''

#-------------------------------------------pending amount function call start----------------------------------------------
                pending=Pending_amount(i.eve_id.eve_id)
#-------------------------------------------pending amount ends----------------------------------------------
                total_session_data= agg_hhc_detailed_event_plan_of_care.objects.filter(eve_poc_id=i.eve_poc_id, eve_id=i.eve_id, status=1)
                end_session=total_session_data.filter(status=1).last()
                get_total_session=total_session_data.filter(status=1).count()
                professional_last_session_data=total_session_data.filter(srv_prof_id=prof).last()
#---------------------------------------------last session start-----------------------------------------------------------
                last_session=False
                professional_last_session=False
                if end_session.agg_sp_dt_eve_poc_id==i.agg_sp_dt_eve_poc_id:
                    last_session=True
                if(professional_last_session_data.agg_sp_dt_eve_poc_id==i.agg_sp_dt_eve_poc_id):
                    professional_last_session=True
#---------------------------------------------last session ends-----------------------------------------------------------
                service={'agg_sp_dt_eve_poc_id':i.agg_sp_dt_eve_poc_id,'patient_name':i.eve_id.agg_sp_pt_id.name if i.eve_id.agg_sp_pt_id.name else '','event_id':i.eve_id.eve_id if i.eve_id.eve_id else '','sub_service':i.eve_poc_id.sub_srv_id.recommomded_service if i.eve_poc_id.sub_srv_id.recommomded_service else '','actual_StartDate_Time':actual_StartDate_Time,'actual_EndDate_Time':actual_EndDate_Time,'patient_goole_address':i.eve_id.agg_sp_pt_id.google_address if i.eve_id.agg_sp_pt_id.google_address else '','patient_address':i.eve_id.agg_sp_pt_id.address if i.eve_id.agg_sp_pt_id.address else '','agg_sp_pt_id':i.eve_id.agg_sp_pt_id.agg_sp_pt_id,'start_time':str(i.start_time) if str(i.start_time) else '','end_time':str(i.end_time) if str(i.end_time) else '','Session_status':i.Session_status,'session_start':session_start,'get_total_session':get_total_session,'index_of_Session':i.index_of_Session,'recommomdedServiceId':i.eve_poc_id.sub_srv_id.sub_srv_id,'eventDiscount':i.eve_id.discount_type,'sessionJobclosureStatus':i.Session_jobclosure_status,'pendingAmount':pending,'last_session':last_session,'professional_last_session':professional_last_session,'payment_skip':i.payment_skip}#,'pendingAmount'}
                pending_service_list.append(service)
            return Response({'pending_services':pending_service_list})
        except Exception as e:
            return Response({"Error":str(e)})

        

########-----------------------------payment_skip_from_professional----------------------------------################

class payment_skip(APIView):
    def post(self,request,dt_ev):
        renderer_classes = [UserRenderer]
        permission_classes = [IsAuthenticated]
        try:
            Detail_Event_Plan_of_c=agg_hhc_detailed_event_plan_of_care.objects.get(agg_sp_dt_eve_poc_id=dt_ev)
            Detail_Event_Plan_of_c.payment_skip=True
            Detail_Event_Plan_of_c.save()
            return Response({'payment_skip':True})
        except Exception as e:
            return Response({'Error':str(e)})

        
class cancel_request(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        prof = get_prof(request)[0]
        clgref_id = get_prof(request)[3]
        can_session=[]
        can_services=[]
        reschedule_services=[]
        redchedule_session=[]
        try:
            rejected_cancel_session=agg_hhc_cancellation_and_reschedule_request.objects.filter(professional_request_status=2,added_by=str(clgref_id)).order_by('added_date')#dtl_eve_id__srv_prof_id=prof,
            for i in rejected_cancel_session:
                if i.is_srv_sesn==1:
                    try:
                        service_type="Service"
                        session_or_eve=i.eve_id.eve_id
                        patient_name=i.eve_id.agg_sp_pt_id.name
                        service_date=str(i.epoc_id.start_date)
                    except Exception as e:
                        service_type="Service"
                        session_or_eve=0
                        patient_name=''
                        service_date=''
                else:
                    try:
                        service_type="Session"
                        session_or_eve=i.dtl_eve_id.agg_sp_dt_eve_poc_id
                        patient_name=i.dtl_eve_id.eve_id.agg_sp_pt_id.name
                        service_date=str(i.dtl_eve_id.actual_StartDate_Time)
                    except Exception as e:
                        service_type="Session"
                        session_or_eve=0
                        patient_name=''
                        service_date=''
                service_detials={'req_id':i.req_id,'service_type':service_type,'patient_name':patient_name,'remark':i.req_rejection_remark,'session_or_eve':session_or_eve,'service_date':service_date}
                if (i.is_canceled==1):#cancel request 
                    if(i.is_srv_sesn==1):#service
                        can_services.append(service_detials)
                    else:#yes
                        can_session.append(service_detials)
                elif(i.is_reschedule==1):#reschedule request
                    if(i.is_srv_sesn==1):#service
                        reschedule_services.append(service_detials)
                    else:
                        redchedule_session.append(service_detials)
            return Response({'cancel_services':can_services,'cancel_sessions':can_session,'reschedule_services':reschedule_services,'redchedule_session':redchedule_session})
        except Exception as e:
            return Response({'Error':str(e)})
        

