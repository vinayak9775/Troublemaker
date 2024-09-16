from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
import requests
from django.conf import settings
from hhcweb.renders import UserRenderer
from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers
from hhcweb import models

import jwt

def index(request):
    return render(request, 'index.html')


def get_prof(request):
    # print("Hiee==1")
    auth_header = request.headers.get('Authorization')
    token = str(auth_header).split()[1]

    decoded_token = jwt.decode(token, key='django-insecure-gelhauh(a&-!e01zl$_ic4l07frx!1qx^h(zjitk(c57w(n6ry', algorithms=['HS256'])

    clg_id = decoded_token.get('user_id')
    # print("CLG_ID______________ ", clg_id)
    clg_ref = models.agg_com_colleague.objects.get(id=clg_id)

   
    # print("Professional id - ", pro)
    return clg_id


class SMS_sent_details_serializer(serializers.ModelSerializer):
   

    class Meta:
        model = models.SMS_sent_details
        # fields = ['patient_name', 'contact_number', 'sent_status','added_by']
        fields = ['patient_name', 'contact_number', 'srv_id','sent_status','added_by']


class SendSMSView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        api_key = settings.TEXTLOCAL_API_KEY
        phone_number = request.data.get('phone_number')
        # sender = request.data.get('sender')
        # message = request.data.get('message')
        sender = "SPEROO"
        fronturl = "hhc"
        userpage = "user"
        helpline_number = 7620400100
        # message = "Thank you for enquiring at SPERO Healthcare For Home Healthcare Services. Please use http://hhc.hospitalguru.in/$var/$var for availing our services or call help line no $var"
        message = f"Thank you for enquiring at SPERO Healthcare For Home Healthcare Services. Please use http://hhc.hospitalguru.in/{fronturl}/{userpage} for availing our services or call help line no {helpline_number}"


        # Validate inputs (You might want to add more validation here)

        # Sending SMS
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

            

            # if response.status_code == 200:
            #     return Response({'message': 'SMS sent successfully.', 'response': response.json()})
            # else:
            #     return Response({'error': response.text}, status=500)

            
            clg_id = get_prof(request)
            print("TOKEN___________ ", clg_id)
            if response.status_code == 200:
                
                data = {
                    'patient_name':request.data.get('patient_name'), 
                    'contact_number':phone_number,
                    'sent_status':1,
                    'added_by':clg_id
                }
                serializer = SMS_sent_details_serializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                  
                return Response({'message': 'SMS sent successfully.','SMS':serializer.data, 'response': response.json()})
            else:
                data = {
                    'patient_name':request.data.get('patient_name'), 
                    'contact_number':phone_number,
                    'sent_status':2,
                    'added_by':clg_id
                }
                serializer = SMS_sent_details_serializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                return Response({'error': response.text}, status=500)

        except Exception as e:
            return Response({'error': str(e)}, status=500)
        














class SMS_sent_details_concent_serializer(serializers.ModelSerializer):
   
    class Meta:
        model = models.SMS_sent_details
        fields = ['eve_id','patient_name', 'contact_number','sms_type','sent_status','added_by']


class ConcentSendSMSView(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]

    def post(self, request,eve_id):
        # eve_id = request.data.get('eve_id', None)
        if eve_id is not None:
            api_key = settings.TEXTLOCAL_API_KEY
            patient_event = models.agg_hhc_events.objects.get(eve_id=eve_id)
            ptn_id = patient_event.agg_sp_pt_id.agg_sp_pt_id
            ptn_data = models.agg_hhc_patients.objects.get(agg_sp_pt_id=ptn_id)

            sender = "SPEROO"
            fronturl = "hhc"
            userpage = "concent"
            helpline_number = 1212121212
            eve_id = ":" + str(eve_id)
            # eve_id = eve_id
            # message = "Thank you for enquiring at SPERO Healthcare For Home Healthcare Services. Please use http://hhc.hospitalguru.in/$var/$var for availing our services or call help line no $var"
            # message = f"Dear {ptn_data.name}, Please go through the consent form & kindly revert on https://hhc.hospitalguru.in/consent/{eve_id}/ Team SPERO"
            # message = f"Thank you for enquiring at SPERO Healthcare For Home Healthcare Services. Please use http://hhc.hospitalguru.in/{fronturl}/{userpage} for availing our services or call help line no {':'+str(eve_id)}"
            message = f"Dear {ptn_data.name}, Please go through the consent form %26 kindly revert on https://hhc.hospitalguru.in/consent/{eve_id}/ Team SPERO"



            try:
                response = requests.post(
                    "https://api.textlocal.in/send/",
                    data={
                        'apikey': api_key,
                        'numbers': ptn_data.phone_no,
                        # 'numbers': 9264936672,
                        # 'numbers': 9975063761,
                        # 'numbers': 7057807841,
                        'message': message,
                        'sender': sender
                    }
                )
                if response.status_code == 200:

                    data = {
                        'eve_id': eve_id,
                        'patient_name': ptn_data.name,
                        'contact_number': ptn_data.phone_no,
                        'sms_type': 2,
                        'sent_status': 1,
                        'added_by': 1
                    }

                    serializer = SMS_sent_details_concent_serializer(data=data)
                    if serializer.is_valid():
                        serializer.save()
                    print(message)
                    print(response.json())
                    return Response({'message': 'SMS sent successfully.','SMS':serializer.data, 'response': response.json()})
                
                else:
                    data = {
                        'eve_id': eve_id,
                        'patient_name': ptn_data.name,
                        'contact_number': ptn_data.phone_no,
                        'sms_type': 2,
                        'sent_status': 1,
                        'added_by': 1
                    }
                    serializer = SMS_sent_details_concent_serializer(data=data)
                    if serializer.is_valid():
                        serializer.save()

                    return Response({'error': response.text}, status=500)
            
            except Exception as e:
                return Response({'error': str(e)}, status=500)
                
        else:
            return Response({'message': 'Error: eve_id not found in request data.'})
        

