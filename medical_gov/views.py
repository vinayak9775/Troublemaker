from datetime import datetime
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from hhcweb.serializers import *
from hhcweb.models import *
from hhcweb.serializers import *
from .serializers import *
from hhc_professional_app.views import get_prof
from hhc_professional_app.serializer import *
from collections import Counter
from django.db.models import Q,F
from rest_framework import status,permissions
from django.utils import timezone
from django.contrib.auth import authenticate
from hhcweb.renders import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
import medical_gov.serializers as mgs




class datewise_job_closure_dtls(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, from_date=None, to_date=None):
        if not from_date:
            from_date = (datetime.today() - timedelta(days=30)).strftime('%Y-%m-%d')
        if not to_date:
            to_date = datetime.today().strftime('%Y-%m-%d')

        from_date = datetime.strptime(from_date, '%Y-%m-%d')
        to_date = datetime.strptime(to_date, '%Y-%m-%d')
        dicttts = []
    
        pc = agg_hhc_event_plan_of_care.objects.filter(Q(eve_id__event_status=2) | Q(eve_id__event_status=3),start_date__gte=from_date, end_date__lte=to_date, status=1)       
        for i in pc:
            dt = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id, status=1)
            if dt.filter(job_closure_medical_gevournance=2).count() == dt.count():
                continue
            # jdc = dt.filter(Session_jobclosure_status=1).count()
            # if dt.count() == jdc:
            ddt = {
                'eve_id': i.eve_id.eve_id if i.eve_id else None, 
                'event_code': i.eve_id.event_code if i.eve_id else None,
                'pt_id': i.eve_id.agg_sp_pt_id.agg_sp_pt_id if i.eve_id and i.eve_id.agg_sp_pt_id else None,
                'pt_name': i.eve_id.agg_sp_pt_id.name if i.eve_id and i.eve_id.agg_sp_pt_id else None,
                'cl_id': i.eve_id.caller_id.caller_id if i.eve_id and i.eve_id.caller_id else None,
                'cl_name': i.eve_id.caller_id.caller_fullname if i.eve_id and i.eve_id.caller_id else None,
                'cl_no': i.eve_id.caller_id.phone if i.eve_id and i.eve_id.caller_id else None,
                'srv_id': i.srv_id.srv_id if i.srv_id else None, 
                'srv_name': i.srv_id.service_title if i.srv_id else None,
                'srv_start_date': i.start_date.isoformat() if i.start_date else None, 
                'srv_end_date': i.end_date.isoformat() if i.end_date else None  
            }
            dicttts.append(ddt)
              
        
        return Response(dicttts, status=status.HTTP_200_OK)

class update_job_closure(APIView):
    # def put(self, request, dt_eve_ids):
    def put(self, request, jc_id):
        if jc_id:
            # dt_events=[int(i) for i in dt_eve_ids.split(',')]
            # for ids in dt_events:
            dteve=agg_hhc_jobclosure_detail.objects.filter(jcolse_id=jc_id).first()
            if not dteve:  # Check if the queryset is empty
                return Response({"error": f"No details found for event ID {jc_id}"}, status=status.HTTP_404_NOT_FOUND)
            dteve = agg_hhc_detailed_event_plan_of_care.objects.filter(agg_sp_dt_eve_poc_id=dteve.agg_sp_dt_eve_poc_id, status=1).first()
            dteve.medical_goernance_ramark=request.data['medical_goernance_ramark']
            dteve.save()
            print(dteve,"dteve")
            dt_eve_serializer = mgs.agg_hhc_session_job_closure_serializer(dteve)
            print(dt_eve_serializer.data,"dt_eve_serializer.data")
            seri=mgs.agg_hhc_session_job_closure_H_serializer(data=dt_eve_serializer.data,many=True)
            if seri.is_valid():
                # print(seri)
                seri.save()
            else: 
                return Response(seri.errors, status=status.HTTP_400_BAD_REQUEST)
            up_seri = mgs.agg_hhc_session_job_closure_serializer(dteve,data=request.data)
            if up_seri.is_valid():
                # print(up_seri) 
                up_seri.save()
            else: 
                return Response(up_seri.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response('None')
        


class event_wise_job_clouser_dtls(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, eve_id):
        dd = []
        pc = agg_hhc_event_plan_of_care.objects.filter(eve_id = eve_id, status = 1)
        for i in pc:
            if i.eve_id:
                jcd_dt = []
                form_no_dt = agg_hhc_jobclosure_form_numbering.objects.filter(prof_sub_srv_id=i.sub_srv_id.sub_srv_id, status = 1)
                form_number = form_no_dt[0].form_number 
                ddtl = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id, status=1,  actual_StartDate_Time__lte=datetime.today(), job_closure_medical_gevournance=1)
                for j in ddtl:
                    jc = agg_hhc_jobclosure_detail.objects.filter(dtl_eve_id=j.agg_sp_dt_eve_poc_id, status=1)
                    last_jc = jc.last()
                    if form_no_dt.exists():
                        if form_number == 2:
                            get_que = agg_hhc_events_wise_jc_question.objects.filter(eve_id = i.eve_id, status = 1)   
                            if jc.exists():
                                qq_dt = []
                                for qq in get_que: 
                                    value = getattr(last_jc, qq.jcq_id.date_time_remark_q_wise_name)
                                    if value:
                                        try:    
                                            # datedet = value.split(" ")
                                            if 'T' in value:
                                                datedet = value.split('T')
                                            else:
                                                datedet = value.split(" ")
                                            datetime.strptime(datedet[0], "%Y-%m-%d")
                                            date_or_remark = "Datetime"
                                        except (ValueError, TypeError):
                                            date_or_remark = "Remark"
                                    else:
                                        date_or_remark = "Remark"
                                    dddttt = {
                                        "hca_que": qq.jcq_id.jcq_question,
                                        qq.jcq_id.que_shrt_name : getattr(last_jc, qq.jcq_id.que_shrt_name ),
                                        "remark_type":date_or_remark,
                                        qq.jcq_id.date_time_remark_q_wise_name:getattr(last_jc, qq.jcq_id.date_time_remark_q_wise_name)  
                                    }
                                    qq_dt.append(dddttt)
                                    dateeee = j.actual_StartDate_Time.isoformat() if j.actual_StartDate_Time else None
                                    s_timeeeee = j.start_time.isoformat() if j.start_time else None
                                    e_timeeeee = j.end_time.isoformat() if j.end_time else None
                                    datetimeeeee = f'{dateeee} -- {s_timeeeee} - {e_timeeeee}'
                                ddtl = {
                                        "jcolse_id":last_jc.jcolse_id if last_jc else None,
                                        "srv_prof_id":last_jc.srv_prof_id.srv_prof_id if last_jc.srv_prof_id else None,
                                        "prof_name":{
                                            "prof_name":last_jc.srv_prof_id.prof_fullname if last_jc.srv_prof_id else None,
                                            "prof_no":last_jc.srv_prof_id.phone_no if last_jc.srv_prof_id else None
                                            },
                                        "dtl_eve_id":last_jc.dtl_eve_id.agg_sp_dt_eve_poc_id,
                                        # "session_date":last_jc.dtl_eve_id.actual_StartDate_Time.isoformat() if last_jc.dtl_eve_id else None,
                                        "session_date":datetimeeeee,
                                        "prof_sub_srv_id":i.sub_srv_id.sub_srv_id if i.sub_srv_id else None,
                                        "sub_srv_name":i.sub_srv_id.recommomded_service if i.sub_srv_id else None,
                                        "added_by":last_jc.added_by,
                                        "last_modified_by":last_jc.last_modified_by,
                                        "is_job_closure_done":True,
                                        "hca_jc":qq_dt
                                    }
                                jcd_dt.append(ddtl)
                            else:
                                qq_dt = []
                                dateeee = j.actual_StartDate_Time.isoformat() if j.actual_StartDate_Time else None
                                s_timeeeee = j.start_time.isoformat() if j.start_time else None
                                e_timeeeee = j.end_time.isoformat() if j.end_time else None
                                datetimeeeee = f'{dateeee} -- {s_timeeeee} - {e_timeeeee}'
                                for qq in get_que: 
                                    dddttt = {
                                        "hca_que": qq.jcq_id.jcq_question,
                                        qq.jcq_id.que_shrt_name : qq.jcq_id.que_shrt_name,
                                        qq.jcq_id.date_time_remark_q_wise_name:qq.jcq_id.date_time_remark_q_wise_name
                                    }
                                    qq_dt.append(dddttt)
                                ddtl = {
                                        "jcolse_id":None,
                                        "srv_prof_id":j.srv_prof_id.srv_prof_id if j.srv_prof_id else None,
                                        "prof_name":{
                                            "prof_name":j.srv_prof_id.prof_fullname if j.srv_prof_id else None,
                                            "prof_no":j.srv_prof_id.phone_no if j.srv_prof_id else None
                                        },
                                        "dtl_eve_id":j.agg_sp_dt_eve_poc_id,
                                        # "session_date":j.actual_StartDate_Time.isoformat() if j.actual_StartDate_Time else None,
                                        "session_date":datetimeeeee,
                                        "sess_s_date":dateeee,
                                        "sess_e_date":dateeee,
                                        "sess_s_time":s_timeeeee,
                                        "sess_e_time":e_timeeeee,
                                        "prof_sub_srv_id":i.sub_srv_id.sub_srv_id if i.sub_srv_id else None,
                                        "sub_srv_name":i.sub_srv_id.recommomded_service if i.sub_srv_id else None,
                                        "added_by":None,
                                        "last_modified_by":None,
                                        "is_job_closure_done":False,
                                        "hca_jc":qq_dt
                                    }
                                jcd_dt.append(ddtl)
                               
                        else:
                            jcdddd = globals().get(f'mg_agg_hhc_session_job_closure_serializer_form_{form_number}', None)
                            dateeee = j.actual_StartDate_Time.isoformat() if j.actual_StartDate_Time else None
                            s_timeeeee = j.start_time.isoformat() if j.start_time else None
                            e_timeeeee = j.end_time.isoformat() if j.end_time else None
                            datetimeeeee = f'{dateeee} -- {s_timeeeee} - {e_timeeeee}'
                            if jcdddd and jc.exists():
                                last_jc = jc.last() 
                                jcddddttt = jcdddd(last_jc, many=False)
                                jc_data = jcddddttt.data.copy()  
                                jc_data['is_job_closure_done'] = True
                                # jc_data['session_date']=j.actual_StartDate_Time.isoformat() if j.actual_StartDate_Time else None
                                jc_data['session_date']= datetimeeeee
                                jc_data['sess_s_date']=dateeee
                                jc_data['sess_e_date']=dateeee
                                jc_data['sess_s_time']=s_timeeeee
                                jc_data['sess_e_time']=e_timeeeee
                                jcd_dt.append(jc_data)
                            else:
                                serializer_instance = jcdddd()
                                keys_with_none = {field: None for field in serializer_instance.fields.keys()}
                                keys_with_none['is_job_closure_done'] = False
                                print(keys_with_none)
                                updates = {
                                    "srv_prof_id": j.srv_prof_id.srv_prof_id if j.srv_prof_id else None,
                                    "prof_name": {
                                        "prof_name": j.srv_prof_id.prof_fullname if j.srv_prof_id else None,
                                        "prof_no": j.srv_prof_id.phone_no if j.srv_prof_id else None
                                    },
                                    "dtl_eve_id": j.agg_sp_dt_eve_poc_id if j.agg_sp_dt_eve_poc_id else None,
                                    # "session_date":j.actual_StartDate_Time.isoformat() if j.actual_StartDate_Time else None,
                                    "session_date":datetimeeeee,
                                    "sess_s_date":dateeee,
                                    "sess_e_date":dateeee,
                                    "sess_s_time":s_timeeeee,
                                    "sess_e_time":e_timeeeee,
                                    "prof_sub_srv_id": i.sub_srv_id.sub_srv_id if i.sub_srv_id else None,
                                    "sub_srv_name": i.sub_srv_id.recommomded_service if i.sub_srv_id else None
                                }
                                keys_with_none.update(updates)

                                jcd_dt.append(keys_with_none)
                           

                srd = {
                    'eve_id':i.eve_id.eve_id if i.eve_id else None,
                    'event_code':i.eve_id.event_code if i.eve_id else None,
                    'pt_dtt':patient_detail_serializer(i.eve_id.agg_sp_pt_id).data if i.eve_id and i.eve_id.agg_sp_pt_id else None,
                    'cl_dtt':agg_hhc_callers_seralizer(i.eve_id.caller_id).data if i.eve_id and i.eve_id.caller_id else None,
                    'job_cl_fm_no':form_number,
                    'srv_start_date': i.start_date.isoformat() if i.start_date else None, 
                    'srv_end_date': i.end_date.isoformat() if i.end_date else None,  
                    'job_closure_dtl':jcd_dt

                }
                dd.append(srd)
        return Response(dd)

    

    

class Medical_job_closure(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
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
                dtl_eves.job_closure_medical_gevournance=2
                dtl_eves.Session_status = 9
                dtl_eves.closure_by = 2
                dtl_eves.save()
                all_detail_event_plan=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=dtl_eves.eve_id,status=1).count()
                detail_event=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=dtl_eves.eve_id,status=1,Session_jobclosure_status=1).count()
                if (all_detail_event_plan==detail_event):
                    event_plan_care=agg_hhc_event_plan_of_care.objects.get(eve_id=dtl_eves.eve_id)
                    event_plan_care.service_status=4
                    event_plan_care.save()               
                    event=agg_hhc_events.objects.get(eve_id=dtl_eves.eve_id.eve_id)
                    event.event_status=3
                    event.save()
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
            # except Exception as e:
            #     return Response({"error":e})
            response_data={
            'record': None,
            'success' : 'False',
            'msg':'No Data Found.'
            }
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({    
                'record': None, 
                'success': 'False',
                'msg': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            

#---------------------------------------Mohin--------------------------------------------
class Vital_get_API(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        snippet = agg_hhc_vital.objects.all()
        serializers = vital_Get_Serializer(snippet,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)
    
class Vital_post_API(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request):
            clgref_id = get_prof(request)[3]
            print(clgref_id)
            request.data['added_by']=clgref_id
            request.data['last_modified_by']=clgref_id
            serializer = vital_Post_Serializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "General Examination Form sent successfully"},status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




# # Working code of the web-socket
# from channels.layers import get_channel_layer
# from asgiref.sync import async_to_sync
# from .serializers import vital_Post_Serializer
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from rest_framework import status

# class Vital_post_API(APIView):
#     renderer_classes = [UserRenderer]
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         # Extract vital data from request
#         clgref_id = get_prof(request)[3]
#         request.data['added_by'] = clgref_id
#         request.data['last_modified_by'] = clgref_id

#         serializer = vital_Post_Serializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()

#             # Trigger WebSocket update on successful save
#             vital_data = serializer.data  # Get the saved data to send via WebSocket

#             # Get the channel layer to send a message
#             channel_layer = get_channel_layer()

#             # Send the data to WebSocket clients in the "vital_updates" group
#             async_to_sync(channel_layer.group_send)(
#                 "vital_updates",  # Group name for WebSocket clients
#                 {
#                     "type": "send_vital_update",  # The method to call in your consumer
#                     "data": vital_data  # Data to send
#                 }
#             )

#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            
class Get_all_vital_data(APIView):
    def get(self,request,event_id):
        snippet = agg_hhc_vital.objects.filter(event_id=event_id)
        serializers = All_Data_Vital_Serializers(snippet,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)
    
class Post_Vital_remark_data(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self,request):
        clgref_id = get_prof(request)[3]
        print(clgref_id)
        request.data['added_by']=clgref_id
        request.data['last_modified_by']=clgref_id
        serializers = Vital_Remark_Post_Serializer(data=request.data)
        if serializers.is_valid(): 
            serializers.save()
            return Response(serializers.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)
        
        

from django.db.models import OuterRef, Subquery, Q
class Ongoing_Eve_Telemedicine(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # if(int(hosp_id)==0):
        print('hiii')
        eve_ids = []
        print(eve_ids,'eve')
        current_time = timezone.now().time()
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
        elif (s_month:= request.GET.get('start_date')) and (e_month:= request.GET.get('end_date')):
            print("mohin sayyad")
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
            dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=timezone.now().date(), start_time__gte=current_time, status = 1).order_by('-start_time')
            # eve_list = [i.eve_id fors i in dtl_data]
            print(timezone.now().time())
            for i in dtl_data:
                print(i.start_time, i.agg_sp_dt_eve_poc_id, i.eve_id)
            eve_list = [i.eve_id for i in dtl_data if i.eve_id is not None]
            unique_eve = set(eve_list)
            for eve_id in unique_eve:
                eve_ids.append(eve_id.eve_id)
        
        # print('hii2')
        # if not eve_ids:
        #     return Response({"msg":"data not foundf"})
        # else:
        #     print(eve_ids,'eve_ids')
        #     data =  agg_hhc_events.objects.filter(Q(event_status=2) | Q(event_status=3),eve_id__in=eve_ids,status=1)
        #     # else:
        #     #     data =  agg_hhc_events.objects.filter(Q(event_status=2) | Q(event_status=3),status=1,added_from_hosp=hosp_id)
        #     serialize_data=Ongoing_Eve_serializer(data, many=True) 
        #     return Response(serialize_data.data)
        
        print('hii2')
        if not eve_ids:
            return Response({"msg": "data not found"})
        else:
            print(eve_ids, 'eve_ids')

            # Subquery to fetch start_time from agg_hhc_detailed_event_plan_of_care
            subquery = agg_hhc_detailed_event_plan_of_care.objects.filter(
                eve_id=OuterRef('eve_id')
            ).values('start_time')[:1]
            
            
            # Fetch data and order by start_time
            data = agg_hhc_events.objects.filter(
                Q(event_status=2) | Q(event_status=3), eve_id__in=eve_ids, status=1
            ).annotate(start_time=Subquery(subquery)).order_by('start_time')

            # Serialize and return the response
            serialize_data = Ongoing_Eve_serializer(data, many=True)
            return Response(serialize_data.data)

        

class Telemedicine_videocall_data_save_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self,request):
        clgref_id = get_prof(request)[3]
        print(clgref_id)
        request.data['added_by']=clgref_id
        request.data['last_modified_by']=clgref_id
        serializers = Telemedicine_VideoCall_Data_Save_Serializer(data=request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)
        

# class GET_patients_details_Api(APIView):
#     def get(self,request):
#         snippet = agg_hhc_event_plan_of_care.objects.all()
#         serializers = patients_details_Serializer(snippet,many=True)
#         return Response(serializers.data,status=status.HTTP_200_OK)


class GET_patients_details_Api(APIView):
    def get(self, request, agg_sp_pt_id=None):
        snippet = agg_hhc_event_plan_of_care.objects.filter(eve_id__agg_sp_pt_id=agg_sp_pt_id)
        serializers = patients_details_Serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)

class GET_Caller_details_Api(APIView):
    def get(self,request,caller_id):
        snippet = agg_hhc_callers.objects.filter(caller_id=caller_id)
        serializers = caller_details_Serializer(snippet,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)
    


class Vital_Details_Update_Api(APIView):
    def get(self, request, vital_pk_id):
        try:
            vital = agg_hhc_vital.objects.get(pk=vital_pk_id)
        except agg_hhc_vital.DoesNotExist:
            return Response({"error": "Vital record not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = Vital_details_update_Serializer(vital)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, vital_pk_id):
        try:
            vital = agg_hhc_vital.objects.get(pk=vital_pk_id)
        except agg_hhc_vital.DoesNotExist:
            return Response({"error": "Vital record not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = Vital_details_update_Serializer(vital, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Vital record updated successfully", "data": serializer.data}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            
#---------------------------------------Mohin--------------------------------------------
