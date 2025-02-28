from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from hhc_hcm.serializers import *
from hhcweb.models import *
from rest_framework.permissions import IsAuthenticated
from hhcweb.renders import UserRenderer
import jwt
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

# Create your views here.


def get_prof(request):
    pro = ""
    clg_id = ""
    caller_id = ""
    auth_header = request.headers.get('Authorization')
    token = str(auth_header).split()[1]

    decoded_token = jwt.decode(token, key='django-insecure-gelhauh(a&-!e01zl$_ic4l07frx!1qx^h(zjitk(c57w(n6ry', algorithms=['HS256'])

    clg_id = decoded_token.get('user_id')
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


class manage_hos(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pk = request.GET.get('hos')
        if pk is not None:
            hospital = agg_hhc_hospitals.objects.get(hosp_id=pk)
            serializer = NewHospitalRegistrationSerializer(hospital)
            return Response(serializer.data)
        else:
            snippets = agg_hhc_hospitals.objects.all()
            serializer = NewHospitalRegistrationSerializer(snippets, many=True)
            return Response(serializer.data)
    
    def post(self, request):
        serializer = NewHospitalRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self,request): 
        pk=request.data.get('hosp_id')
        try:
            obj=agg_hhc_hospitals.objects.get(hosp_id=pk)
            serialized= NewHospitalRegistrationSerializer(obj,data=request.data)
            if(serialized.is_valid()):
                serialized.save()
                return Response(serialized.data)
            return Response(serialized.errors,status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'error': 'Please provide a valid hospital ID.'}, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request):  
        pk=request.data.get('hosp_id')
        try:
            hospital = agg_hhc_hospitals.objects.get(pk=pk)
            hospital.status = 2
            hospital.save()
            return Response({'message': 'Delete Hospital Successfully'}, status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({'error': 'Please provide a valid hospital ID.'}, status=status.HTTP_400_BAD_REQUEST)
        
class manage_srv(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pk = request.GET.get('srv')
        if pk is not None:
            service = agg_hhc_services.objects.get(srv_id=pk)
            serializer = ServicesSerializer(service)
            return Response(serializer.data)
        else:
            snippets = agg_hhc_services.objects.filter().order_by('srv_id')
            serializer = ServicesSerializer(snippets, many=True)
            return Response(serializer.data)
    
    def post(self, request):
        clgref_id = get_prof(request)[3]
        request.data['last_modified_by'] = clgref_id
        serializer = ServicesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self,request): 
        clgref_id = get_prof(request)[3]
        request.data['last_modified_by'] = clgref_id
        pk=request.data.get('srv_id')
        try:
            obj=agg_hhc_services.objects.get(pk=pk)
            serialized= ServicesSerializer(obj,data=request.data)
            if(serialized.is_valid()):
                serialized.save()
                return Response(serialized.data)
            return Response(serialized.errors,status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'error': 'Please provide a valid service ID.'}, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request):  
        clgref_id = get_prof(request)[3]
        request.data['last_modified_by'] = clgref_id
        pk=request.data.get('srv_id')
        try:
            service = agg_hhc_services.objects.get(pk=pk)
            service.status = 2
            service.save()
            return Response({'message': 'Delete Service Successfully'}, status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({'error': 'Please provide a valid service ID.'}, status=status.HTTP_400_BAD_REQUEST)
    

class Prof_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            pro = request.GET.get('pro')
            if pro:
                profs = agg_hhc_service_professionals.objects.filter(srv_prof_id = pro)
            else:
                profs = agg_hhc_service_professionals.objects.all()
            serializer = Profs_serializer(profs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'Records not found'}, status=status.HTTP_400_BAD_REQUEST)
        
class manage_sub_srv(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pk = request.GET.get('srv')
        if pk is not None:
            try:
                service = agg_hhc_sub_services.objects.filter(srv_id=pk)
                serializer = SubServicesSerializer(service, many=True)
                if serializer.data: 
                    return Response(serializer.data)
                else:
                    return Response({'error': 'Records not found'}, status=status.HTTP_200_OK)
            except:
                return Response({'error': 'Records not found'}, status=status.HTTP_200_OK)
        else:
            try:
                snippets = agg_hhc_sub_services.objects.filter(status=1).order_by('recommomded_service')
                serializer = SubServicesSerializer(snippets, many=True)
                if serializer.data: 
                    return Response(serializer.data)
                else:
                    return Response({'error': 'Records not found'}, status=status.HTTP_200_OK)
            except:
                return Response({'error': 'Records not found'}, status=status.HTTP_200_OK)
        
    def post(self, request):
        serializer = SubServicesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Add Sub Service Successfully'}, status=status.HTTP_201_CREATED)
    
    # def put(self,request): 
    #     pk=request.data.get('sub_srv_id')
    #     try:
    #         obj=agg_hhc_sub_services.objects.get(pk=pk)
    #         print(obj,"obj")
    #         serialized= SubServicesSerializer(obj,data=request.data)
    #         if(serialized.is_valid()):
    #             serialized.save()
    #             print(serialized.data,"serialized.data")
    #             return Response({'message': 'Update Sub Service Successfully'}, status=status.HTTP_201_CREATED)
    #     # except:
    #     #         return Response({'error': 'Please provide a valid sub service ID.'}, status=status.HTTP_400_BAD_REQUEST)

    #     except agg_hhc_sub_services.DoesNotExist:
    #         print("Object does not exist.")
    #         return Response({'error': 'Please provide a valid sub service ID.'}, status=status.HTTP_400_BAD_REQUEST)


    def put(self, request): 
        pk = request.data.get('sub_srv_id')
        print("Received sub_srv_id:", pk)
        try:
            obj = agg_hhc_sub_services.objects.get(pk=pk)
            print("Retrieved object:", obj)
            serialized = SubServicesSerializer(obj, data=request.data)
            if serialized.is_valid():
                serialized.save()
                print("Serialized data:", serialized.data)
                return Response({'message': 'Update Sub Service Successfully'}, status=status.HTTP_201_CREATED)
            else:
                print("Validation errors:", serialized.errors)
                return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)
        except agg_hhc_sub_services.DoesNotExist:
            print("Object does not exist.")
        return Response({'error': 'Please provide a valid sub service ID.'}, status=status.HTTP_400_BAD_REQUEST)



        
    def delete(self, request):  
        pk=request.data.get('sub_srv_id')
        try:
            service = agg_hhc_sub_services.objects.get(pk=pk)
            service.status = 2
            service.save()
            return Response({'message': 'Delete Sub Service Successfully'}, status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({'error': 'Please provide a valid sub service ID.'}, status=status.HTTP_400_BAD_REQUEST)
        
class manage_cons(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pk = request.GET.get('doc_cons')
        if pk is not None:
            try:
                service = agg_hhc_doctors_consultants.objects.get(doct_cons_id=pk)
                serializer = ConsultantSerializer(service)
                if serializer.data: 
                    return Response(serializer.data)
                else:
                    return Response({'error': 'Records not found'}, status=status.HTTP_200_OK)
            except:
                return Response({'error': 'Records not found'}, status=status.HTTP_200_OK)
        else:
            try:
                snippets = agg_hhc_doctors_consultants.objects.filter(status=1).order_by('cons_fullname')
                print("cons list-", snippets)
                serializer = ConsultantSerializer(snippets, many=True)
                if serializer.data: 
                    return Response(serializer.data)
                else:
                    return Response({'error': 'Records not found'}, status=status.HTTP_200_OK)
            except:
                return Response({'error': 'Records not found'}, status=status.HTTP_200_OK)
            
    def post(self, request):
        serializer = ConsultantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Add Constant Successfully'}, status=status.HTTP_204_NO_CONTENT)
        return Response({"error":"Something went wrong"})
    def put(self,request): 
        pk=request.data.get('doct_cons_id')
        try:
            obj=agg_hhc_doctors_consultants.objects.get(pk=pk)
            serialized= ConsultantSerializer(obj,data=request.data)
            if(serialized.is_valid()):
                serialized.save()
                return Response({'message': 'Update Consultant Successfully'}, status=status.HTTP_204_NO_CONTENT)
        except:
                return Response({'error': 'Please provide a valid sub seconsutantvice ID.'}, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request):  
        pk=request.data.get('doct_cons_id')
        try:
            service = agg_hhc_doctors_consultants.objects.get(pk=pk)
            service.status = 2
            service.save()
            return Response({'message': 'Delete Consultant Successfully'}, status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({'error': 'Please provide a valid sub consutant ID.'}, status=status.HTTP_400_BAD_REQUEST)
        
class CallBackButton(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, pk=None):  # Add 'pk=None' to the get method
        serializer = CallBackBtnSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Add Constant Successfully'}, status=status.HTTP_204_NO_CONTENT)
        return Response({"error":"Something went wrong"})
    
class Prof_aval_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            pro = request.GET.get('pro')
            if pro:
                profs = agg_hhc_professional_availability.objects.filter(srv_prof_id = pro)
                print("Professional avalabililty-- ",profs)
                k=0
                for i in profs:
                    prof_aval = profs[k].professional_avaibility_id
                    print("Prof aval-- ",prof_aval)
                    prof_aval_dtls = agg_hhc_professional_availability_detail.objects.filter(prof_avaib_id=prof_aval)
                    print("Prof aval dtl-- ",prof_aval_dtls)
                    k = k+1
                    print("k-- ",k)
                serializer = Prof_aval_serializer(profs, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'Records not found'}, status=status.HTTP_400_BAD_REQUEST)
        

    def post(self, request, format=None):
        try:
            dates = request.data['date']
            prof = request.data['srv_prof_id']
            time_slots = request.data['time']

            print("dates: ", dates)
            print("profs: ", prof)
            print("time_slots: ", time_slots)

            for pro in prof:
                request.data['srv_prof_id'] = pro
                for i in dates:
                    aval = agg_hhc_professional_availability.objects.filter(srv_prof_id=pro, date=i)
                    request.data['date'] = i
                    for p in aval:
                        aval_id = p.professional_avaibility_id
                    
                    if aval:
                        aval_serializer = agg_hhc_prof_avail_serializer(aval, data=request.data)
                    else:
                        aval_serializer = agg_hhc_prof_avail_serializer(data=request.data)
                    
                    if aval_serializer.is_valid(raise_exception=True):
                        if aval:
                            prof_aval_id = aval[0].professional_avaibility_id
                        else:
                            prof_aval = aval_serializer.save()
                            prof_aval_id = prof_aval.professional_avaibility_id

                        print("prof aval id", prof_aval_id)

                        request.data['prof_avaib_id'] = prof_aval_id

                        for j in time_slots:
                            request.data['start_time'] = j[0]
                            prof_aval_detail_serializer = agg_hhc_professional_avail_detail_serializer(data=request.data)
                            request.data['end_time'] = j[1]

                            if prof_aval_detail_serializer.is_valid(raise_exception=True):
                                prof_aval_detail_serializer.save()

                            # else:        
                            #     return Response({'Res_Data': {'msg':'Professional Availability Already Exist.'}}, status=status.HTTP_200_OK)
            response_data={
            'Res_Data': {'msg':'Professional Availability Added Successfully'}
            }
            return Response(response_data,status=status.HTTP_200_OK)
            
        except:
            return Response({'Res_Data': {'msg':'Professional Availability Already Exist.'}}, status=status.HTTP_200_OK)

class VIPPatients_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        events = agg_hhc_events.objects.filter(status=1, discount_type=4)
        event_serializer = VIPPatient_serializer(events, many=True)
        return Response(event_serializer.data)
    
class VIPConvert_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    
    def post(self, request, event):
        events = agg_hhc_events.objects.get(eve_id=event, status=1)
        data={'discount_type':5}
        event_serializer=VIP_event_update_serailzer(events,data=data )
        if event_serializer.is_valid():
            event_serializer.save()
        # events.discount_type=5
        # events.save()
        convert_serializer=VIPConvert_serializer(data={'eve_id':event})
        if convert_serializer.is_valid():
            convert_serializer.save()
            return Response(convert_serializer.data, status=status.HTTP_201_CREATED)
        return Response(convert_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

# ---------------------------- (vinayak) Reschdeule and Cancellation service/session Request API -------------------------------------

class get_reschedule_cancle_request(APIView):
    def get(self, request, res_can, srv_sess):
        if res_can == 1 and srv_sess == 1:
            get_all_req = agg_hhc_cancellation_and_reschedule_request.objects.filter(is_deleted=2,is_srv_sesn=1, is_canceled=1)
        elif res_can == 1 and srv_sess == 2:
            get_all_req = agg_hhc_cancellation_and_reschedule_request.objects.filter(is_deleted=2,is_srv_sesn=2, is_canceled=1)
        elif res_can == 2 and srv_sess == 1:
            get_all_req = agg_hhc_cancellation_and_reschedule_request.objects.filter(is_deleted=2, is_srv_sesn=1, is_reschedule=1)
        elif res_can == 2 and srv_sess == 2:
            get_all_req = agg_hhc_cancellation_and_reschedule_request.objects.filter(is_deleted=2, is_srv_sesn=1, is_reschedule=1)
        

        serializer_req = reschedule_cancle_request_pro_seri(get_all_req, many= True)
        return Response(serializer_req.data)
    











class inactive_service(APIView):
    def post(self,request, srv_id, id):
        try:
            service = agg_hhc_services.objects.filter(srv_id = srv_id).first()
            if id == 1:
                service.status = 1
                service.save()
                return Response({"msg": "Service Activated"})
            else:
                service.status = 2
                service.save()
                return Response({"msg": "Service Inactivate"})
        
        except Exception as e:        
            return Response({"msg": "Service not Found", "error":str(e)})








class inactive_sub_service(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self,request, sub_srv_id, id):
        try:
            sub_service = agg_hhc_sub_services.objects.filter(sub_srv_id = sub_srv_id).first()
            if id == 1:
                sub_service.status = 1
                sub_service.save()
                return Response({"msg": "Sub_Service Activated"})
            else:
                sub_service.status = 2
                sub_service.save()
                return Response({"msg": "Sub_Service Inactivate"})
        except Exception as e:        
            return Response({"msg": "Sub Service not Found", "error":str(e)})
from rest_framework_simplejwt.tokens import RefreshToken
class forcefully_logout_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        hds=agg_com_colleague.objects.filter(grp_id=1,is_active=True,clg_is_login=True)
        login_prof=logedin_prof_serializer(hds, many=True)
        return Response(login_prof.data)
    
    def post(self, request):
        clg_id=request.query_params.get('id')
        clg = agg_com_colleague.objects.get(id=clg_id)
        clg.clg_is_login = False
        clg.save()
        # clg = agg_com_colleague.objects.filter(grp_id=1)
        d=OutstandingToken.objects.filter(user_id=clg_id)
        # print(d, 'sfdgjk')
        # token = RefreshToken(d)
        for tokens in d:
            try:
                tokens.blacklist()

                # BlacklistedToken.objects.create(token=tokens)
            except:
                pass
        return Response({"token":"logout sucessful"})
    


class Get_professional_otp_data(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            profs = agg_hhc_service_professionals.objects.filter(prof_registered=True,prof_interviewed=True,prof_doc_verified=True,status=1)
            prof_otp_dt = []
            for prof in profs:
                clg_ref = prof.clg_ref_id
                data = {
                    'prof_name': prof.prof_fullname or None,
                    'phone_no': clg_ref.clg_Work_phone_number if clg_ref else None,
                    'job_type': (
                        'On Call' if prof.Job_type == 1 else 
                        'Full Time' if prof.Job_type == 2 else 
                        'Part Time' if prof.Job_type == 3 else 
                        None
                    ),
                    'professional_service': prof.srv_id.service_title or None,
                    'OTP': prof.OTP or None,
                    'OTP_count': prof.OTP_count or None,
                    # 'OTP_expire_time': prof.otp_expire_time or None
                }

                prof_otp_dt.append(data)
            
            return Response(prof_otp_dt, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error':str(e)}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)

        