from django.shortcuts import render
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from rest_framework.views import APIView
from rest_framework.response import Response
from hhc_reports.serializers import *
from hhcweb.models import *
from django.db.models import Q
import json
from datetime import datetime, timedelta
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
from hhcapp.views import whatsapp_sms
# _________________ Amit Rasale _____________________
from hhcweb.renders import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
from django.db.models import Count
# _________________ End Amit Rasale _____________________


# Create your views here.
class EventReportView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def follow_up(self, event):
            try:
                flw_dtl = agg_hhc_enquiry_follow_up.objects.get(event_id = event)
                Follow_datetime = flw_dtl.follow_up_date_time.strftime("%Y-%m-%d %H:%M:%S")
                Follow_by_HD = flw_dtl.added_by
                return 
            except:
                pass
    def get(self, request):
        # st_dt = (datetime.strptime(request.GET.get("st_date"), '%Y-%m-%d'))
        # ed_dt = (datetime.strptime(request.GET.get("ed_date"), '%Y-%m-%d'))

        st_date_str = request.GET.get("st_date")
        ed_date_str = request.GET.get("ed_date")

        if not st_date_str or not ed_date_str:
            return Response({"error": "Both start date and end date are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            st_dt = datetime.strptime(st_date_str, '%Y-%m-%d')
            ed_dt = datetime.strptime(ed_date_str, '%Y-%m-%d')
        except ValueError:
            return Response({"error": "Invalid date format. Please use YYYY-MM-DD format."}, status=status.HTTP_400_BAD_REQUEST)

        hos = request.GET.get("hos_id")

        if hos:
            # event_info = agg_hhc_event_plan_of_care.objects.filter(start_date__gte = st_dt, end_date__lte = ed_dt, eve_id__agg_sp_pt_id__preferred_hosp_id=hos,eve_id__status=1,eve_id__event_status=3, status=1).order_by('eve_poc_id')

            event_info = agg_hhc_event_plan_of_care.objects.filter(start_date__gte = st_dt, end_date__lte = ed_dt, hosp_id=hos, eve_id__status=1,eve_id__event_status=3, status=1).order_by('eve_poc_id')


            print("event info------** ",event_info)
            [print(info) for info in event_info]
        else:
            event_info = agg_hhc_event_plan_of_care.objects.filter(start_date__gte = st_dt, end_date__lte = ed_dt,eve_id__status=1,eve_id__event_status=3, status=1).order_by('eve_id')
            # event_info = agg_hhc_events.objects.filter(added_date__gte = st_dt, added_date__lte = ed_dt).order_by('eve_id')
            print("event_info without hos", event_info)
            # print(event_info.count())
            # [print(info.eve_id.agg_sp_pt_id.preferred_hosp_id) for info in event_info]

        eve_repo_arr = []
        for eve in event_info:
            flw_dtl = agg_hhc_enquiry_follow_up.objects.filter(event_id = eve.eve_id, follow_up=3).last()
            if flw_dtl:
                Follow_datetime = flw_dtl.added_date
                previous_follow_up=flw_dtl.previous_follow_up_remark
                Follow_by_HD = flw_dtl.added_by
            else:
                Follow_datetime =None
                Follow_by_HD=None

            service_date_time = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=eve.eve_id, status=1).distinct().first()
            if service_date_time:
                service_time=service_date_time.added_date
                service_by=service_date_time.added_by
            else:
                service_time=None
                service_by=None

            print("eve.start_date---", eve.start_date)
            print("eve.eve_id---",eve.eve_id.eve_id)
            data = {
                # "Date":eve.start_date,
                "Date":eve.start_date.strftime('%Y-%m-%d') if eve.start_date else None,
                "Event_ID":eve.eve_id.eve_id,
                "Customer_Name":eve.eve_id.caller_id.caller_fullname if hasattr(eve.eve_id.caller_id,'caller_fullname') else None,
                "Customer_Mobile_No":eve.eve_id.caller_id.phone if hasattr(eve.eve_id.caller_id,'phone') else None,
                "Email_ID":eve.eve_id.caller_id.email if hasattr(eve.eve_id.caller_id,'email') else None,
                "Relationship_with_Patient": eve.eve_id.agg_sp_pt_id.caller_rel_id.relation if hasattr(eve.eve_id.agg_sp_pt_id.caller_rel_id,'relation') else None,
                "Patient_Name":eve.eve_id.agg_sp_pt_id.name if hasattr(eve.eve_id.agg_sp_pt_id, 'name') else None,
                "Patient_Approx Age":eve.eve_id.Age if hasattr(eve.eve_id, 'Age') else None,
                "Patient_Dignosis":eve.eve_id.agg_sp_pt_id.Suffered_from if hasattr(eve.eve_id.agg_sp_pt_id, 'Suffered_from') else None,
                "Consultant_name":eve.eve_id.agg_sp_pt_id.doct_cons_id.cons_fullname if hasattr(eve.eve_id.agg_sp_pt_id.doct_cons_id,'cons_fullname') else None,
                "preffered_professional":eve.prof_prefered if hasattr(eve, 'prof_prefered') else None,
                "Patient_Gender":eve.eve_id.agg_sp_pt_id.gender_id.name if hasattr(eve.eve_id.agg_sp_pt_id.gender_id, 'name') else None,
                "Patient_Address":eve.eve_id.agg_sp_pt_id.address if hasattr(eve.eve_id.agg_sp_pt_id, 'address') else None,
                "Patient_Zone":eve.eve_id.agg_sp_pt_id.prof_zone_id.Name if hasattr(eve.eve_id.agg_sp_pt_id.prof_zone_id, 'Name') else None,
                "Service_Type":eve.srv_id.service_title if hasattr(eve.srv_id, 'service_title') else None,
                "Sub_Service_Type":eve.sub_srv_id.recommomded_service if hasattr(eve.sub_srv_id, 'recommomded_service') else None,
                # "Enquiry_Date_&_Time":eve.eve_id.added_date if hasattr(eve.eve_id, 'added_date') else None,
                "Enquiry_Date_&_Time":eve.eve_id.added_date.strftime('%Y-%m-%d %H:%M:%S') if eve.eve_id.added_date else None,
                "Mode_of_Enquiry":eve.eve_id.patient_service_status if hasattr(eve.eve_id, 'patient_service_status') else None,
                "Enquiry_Added by":eve.eve_id.added_by if hasattr(eve.eve_id, 'added_by') else None,
                "Type_of_Enquirer":'NAN',
                "Discount_Type":eve.eve_id.discount_type if hasattr(eve.eve_id, 'discount_type') else None,
                # "Follow_datetime" : Follow_datetime,
                "Follow_datetime" : Follow_datetime.strftime('%Y-%m-%d %H:%M:%S') if Follow_datetime else None,
                "Follw_Up_by_HD_Name" :Follow_by_HD,
                "Follw_Up_Remarks":previous_follow_up,
                # "Service_Created_Date_&_Time":service_time,
                "Service_Created_Date_&_Time": service_time.strftime('%Y-%m-%d %H:%M:%S') if service_time else None,
                "Service_Created_by_HD":service_by,
                "start_date": eve.start_date.strftime('%Y-%m-%d %H:%M:%S') if service_time else None,
                "end_date": eve.end_date.strftime('%Y-%m-%d %H:%M:%S') if service_time else None,
                "Cancelations_by_HD":'NAN',
                # "Type of Cancelations":
            }
            eve_repo_arr.append(data)

        return Response({'Record': eve_repo_arr} , status=status.HTTP_200_OK)
        # return Response({'Record': data})




class ProfsReportView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        prof_repo_arr = []
        st_dt = (datetime.strptime(request.GET.get("st_date"), '%Y-%m-%d')).date()
        ed_dt = (datetime.strptime(request.GET.get("ed_date"), '%Y-%m-%d')).date()
        print("st_dt, ed_dt", st_dt, ed_dt)
        profs = agg_hhc_service_professionals.objects.all().order_by('prof_fullname')

        for i in profs:
            try:
                eve_dtl_offers = agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id = i.srv_prof_id, actual_StartDate_Time__gte=st_dt, actual_EndDate_Time__lte=ed_dt).count()
                # print("Session Offered --", eve_dtl_offers)

                eve_dtl_complete = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(Session_status=2) | Q(Session_status=9), srv_prof_id = i.srv_prof_id, actual_StartDate_Time__gte=st_dt, actual_EndDate_Time__lte=ed_dt).count()
                # print("Session Completed --", eve_dtl_complete)

                eve_dtl_pen = agg_hhc_detailed_event_plan_of_care.objects.filter(Session_status=1, status=1, srv_prof_id = i.srv_prof_id, actual_StartDate_Time__gte=st_dt, actual_EndDate_Time__lte=ed_dt).count()
                # print("Session Pending --", eve_dtl_pen)

                eve_dtl_jc_cl = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(Session_status=2) | Q(Session_status=9), Session_jobclosure_status=1, status=1, srv_prof_id = i.srv_prof_id, actual_StartDate_Time__gte=st_dt, actual_EndDate_Time__lte=ed_dt).count()
                # print("No of Session Closed (Jc completed) --", eve_dtl_jc_cl)

                eve_dtl_jc_pen = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(Session_status=2) | Q(Session_status=9), Session_jobclosure_status=2, status=1, srv_prof_id = i.srv_prof_id, actual_StartDate_Time__gte=st_dt, actual_EndDate_Time__lte=ed_dt).count()
                # print("No of Session Opened (Jc pending) --", eve_dtl_jc_pen)

                eve_dtl_jc_re = agg_hhc_detailed_event_plan_of_care.objects.filter(Reschedule_status=1, status=2, srv_prof_id = i.srv_prof_id, actual_StartDate_Time__gte=st_dt, actual_EndDate_Time__lte=ed_dt).count()
                # print("No of Session Rescheduled --", eve_dtl_jc_re)

                # prof_charge = agg_hhc_professional_sub_services.objects.get(srv_prof_id = i.srv_prof_id)
                # print("Professional charges-- ", prof_charge.prof_cost)

                # print("Revenue-- ")
                # print("Total session(service) accepted-- ")
                # print("Total session(service) performed-- ")
                # print("Total sessions(Services) Denied-- ")
                # print("Total session(Services) Rescheduled-- ")
                # print("Postive Feedbacks (Patient app dependancy)-- ")
                # print("Negative Feedbacks (Patient app dependancy)-- ")
                # print("Complaints (Patient app dependancy)-- ")
                
                Prof_id = None
                Prof_full_name = None
                Prof_type = None
                Gender = None
                Prof_reviews = None
                Prof_ratings = None
                Type_of_employement = None
                Session_Offered = None
                Session_Completed = None
                Session_Pending = None
                Session_Closed = None
                Session_Opened = None
                Session_Resch = None


                if i.gender == 1:
                    Gender = "Male"
                elif i.gender == 2:
                    Gender = "Female"
                elif i.gender == 3:
                    Gender = "Transgender"

                Prof_id = i.srv_prof_id
                Prof_full_name = i.prof_fullname
                Prof_type = i.srv_id.service_title
                Gender = Gender
                Prof_reviews = i.Reviews
                Prof_ratings = i.Ratings
                Type_of_employement = i.Job_type
                Session_Offered = eve_dtl_offers
                Session_Completed = eve_dtl_complete
                Session_Pending = eve_dtl_pen
                Session_Closed = eve_dtl_jc_cl
                Session_Opened = eve_dtl_jc_pen
                Session_Resch = eve_dtl_jc_re


                Prof_repo = {
                    "Prof_id" : Prof_id,
                    "Prof_full_name" : Prof_full_name,
                    "Prof_type" : Prof_type,
                    "Gender" : Gender,
                    "Prof_reviews" : Prof_reviews,
                    "Prof_ratings" : Prof_ratings,
                    "Type_of_employement" : Type_of_employement,
                    "Session_Offered" : Session_Offered,
                    "Session_Completed" : Session_Completed,
                    "Session_Pending" : Session_Pending,
                    "Session_Closed" : Session_Closed,
                    "Session_Opened" : Session_Opened,
                    "Session_Resch" : Session_Resch
                }
                
                prof_repo_arr.append(Prof_repo)
            except:
                pass
        return Response({'Record': prof_repo_arr})

class hd_report(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    
    def get(self,request):
        try:
            all_hd=agg_com_colleague.objects.filter(grp_id=1)
            hd_recored_list=[]
            for i in all_hd:
                hd_name=i.clg_first_name+" "+i.clg_mid_name+" "+i.clg_last_name
                login_time=None
                log_out_time=None
                total_duration=None
                enquiry_added=agg_hhc_events.objects.filter(Q(enq_spero_srv_status=1)|Q(enq_spero_srv_status=2),added_by=i.clg_ref_id).count()
                service_created=agg_hhc_events.objects.filter(enq_spero_srv_status=2,added_by=i.clg_ref_id).count()
                follow_up_taken=agg_hhc_enquiry_follow_up.objects.filter(added_by=i.clg_ref_id).count()
                deallocation_performed=agg_hhc_professional_Denial_reason.objects.filter(added_by=i.clg_ref_id).count()
                cancelations_done=agg_hhc_cancellation_history.objects.filter(added_by=i.clg_ref_id).count()
                #----------count------------------start
                event_rescheduled_table=agg_hhc_detailed_event_plan_of_care.objects.filter(last_modified_by=i.clg_ref_id,status=2)
                set={}
                for i in event_rescheduled_table:
                    set.add(i.eve_id)
                count=0
                for j in set:
                    count=count+1
                revent_rescheduled_count=count
                #----------count-------------------stop-
                
                # event_reschedule=agg_hhc_detailed_event_plan_of_care.objects.filter()
                # print("count ",enquiry_added)
                data={'hd_name':hd_name,'login_time':login_time,'log_out_time':log_out_time,'total_duration':total_duration,'enquiry_added':enquiry_added,'service_created':service_created,'follow_up_taken':follow_up_taken,'deallocation_performed':deallocation_performed,'cancelations_done':cancelations_done,'revent_rescheduled_count':revent_rescheduled_count}
                hd_recored_list.append(data)
            print(all_hd)
            return Response({'Record':hd_recored_list})
        except:
            return Response({"error":"Error in getting data"},status=400)


# class ConsentReport(APIView):
#     renderer_classes = [UserRenderer]
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         pen = request.GET.get('pen')
#         # start_date = (datetime.strptime(request.GET.get("st_date"), '%Y-%m-%d'))
#         # end_date = (datetime.strptime(request.GET.get("ed_date"), '%Y-%m-%d'))
#         # end_date += timedelta(days=1)
#         start_date = datetime.strptime(request.GET.get("st_date"), '%Y-%m-%d').date()
#         end_date = datetime.strptime(request.GET.get("ed_date"), '%Y-%m-%d').date()
#         end_date += timedelta(days=1)
#         eve_poc_arr = []
#         print(pen, start_date, end_date)

#         if pen:
#             eve_ids_in_agg = agg_hhc_concent_form_details.objects.values_list('eve_id', flat=True)
#             print("eve ids in agg--", eve_ids_in_agg)
#             filtered_sms = SMS_sent_details.objects.filter(sent_status=1, sms_type=2).exclude(eve_id__in=eve_ids_in_agg)
#             print("filtered sms-", filtered_sms)

#             eve_arr = []
#             for p in filtered_sms:
#                 eve_arr.append(p.eve_id)

#             eve_poc = agg_hhc_event_plan_of_care.objects.filter(start_date__range = (start_date, end_date), consent_submited = 2 , eve_id__in = eve_arr)
            
#         else:
#             # print("In pen loop")
#             # eve_poc = agg_hhc_event_plan_of_care.objects.filter(start_date__range = (start_date, end_date), consent_submited = 1)
#             # print("In pen loop")

#             eve_ids_in_agg = agg_hhc_concent_form_details.objects.values_list('eve_id', flat=True)

#             eve_poc = agg_hhc_event_plan_of_care.objects.filter(start_date__range = (start_date, end_date), eve_id__in = eve_ids_in_agg)
            
            

#         for i in eve_poc:
         
            
#             eve = None
#             eve_poc_id = None
#             srv_id = None
#             sub_srv_id = None
#             prof_name = None
#             patient_name = None
#             patient_number = None
#             caller_name = None
#             caller_number = None
#             is_aggree = None
#             sign = None
#             added_date = None
#             Discharge_summ_docs = None

#             try:
#                 eve = i.eve_id.eve_id
#                 eve_poc_id = i.eve_poc_id
#                 srv_id = i.srv_id.service_title
#                 sub_srv_id = i.sub_srv_id.recommomded_service
#                 prof_name = i.srv_prof_id.prof_fullname
#                 patient_name = i.eve_id.agg_sp_pt_id.name
#                 patient_number = i.eve_id.agg_sp_pt_id.phone_no
#                 caller_name = i.eve_id.caller_id.caller_fullname
#                 caller_number = i.eve_id.caller_id.phone

#                 try:
#                     cd = agg_hhc_concent_form_details.objects.get(eve_id=eve)
#                     is_aggree = cd.is_aggree
#                     sign = cd.sign
#                     added_date = cd.added_date
#                     Discharge_summ_docs = cd.Discharge_summ_docs
#                 except:
#                     pass
#             except:
#                 pass

#             cons_repo = {
#                 "eve" : eve,
#                 "eve_poc_id" : eve_poc_id,
#                 "srv_id" : srv_id,
#                 "sub_srv_id" : sub_srv_id,
#                 "prof_name" : prof_name,
#                 "patient_name" : patient_name,
#                 "patient_number" : patient_number,
#                 "caller_name" : caller_name,
#                 "caller_number" : caller_number,
#                 "is_aggree" : is_aggree,
#                 "sign" : sign,
#                 "added_date" : added_date,
#                 "Discharge_summ_docs" : Discharge_summ_docs,
#             }
#             eve_poc_arr.append(cons_repo)

#         return Response({'Record': eve_poc_arr} , status=status.HTTP_200_OK)


class ConsentReport(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pen = request.GET.get('pen')
        start_date = datetime.strptime(request.GET.get("st_date"), '%Y-%m-%d').date()
        end_date = datetime.strptime(request.GET.get("ed_date"), '%Y-%m-%d').date()
        end_date += timedelta(days=1)
        eve_poc_arr = []
        print(pen, start_date, end_date)

        eve_ids_in_agg = agg_hhc_concent_form_details.objects.values_list('eve_id', flat=True)

        eve_poc = agg_hhc_event_plan_of_care.objects.filter(
            start_date__range=(start_date, end_date),  # Event start date within range
            eve_id__in=eve_ids_in_agg  # eve_id in eve_ids_in_agg list
        )   
        for i in eve_poc:
            # prof = agg_hhc_detailed_event_plan_of_care.objects.first(eve_id = i.eve_id, status = 1).first()
            eve = i.eve_id.eve_id
            eve_poc_id = i.eve_poc_id
            srv_id = i.srv_id.service_title
            sub_srv_id = i.sub_srv_id.recommomded_service
            # prof_name = prof.srv_prof_id.prof_fullname
            patient_name = i.eve_id.agg_sp_pt_id.name
            patient_number = i.eve_id.agg_sp_pt_id.phone_no
            caller_name = i.eve_id.caller_id.caller_fullname
            caller_number = i.eve_id.caller_id.phone

            # cd = agg_hhc_concent_form_details.objects.get(eve_id=eve)
            # is_aggree = cd.is_aggree
            # sign = cd.sign
            added_date = i.eve_id.added_date.strftime('%Y-%m-%d %H:%M:%S')
            # Discharge_summ_docs = cd.Discharge_summ_docs
            
            cons_repo = {
                "eve" : eve,
                "eve_poc_id" : eve_poc_id,
                "srv_id" : srv_id,
                "sub_srv_id" : sub_srv_id,
                "prof_name" : "prof_name",
                "patient_name" : patient_name,
                "patient_number" : patient_number,
                "caller_name" : caller_name,
                "caller_number" : caller_number,
                # "is_aggree" : is_aggree,
                # "sign" : sign,
                "added_date" : added_date,
                # "Discharge_summ_docs" : Discharge_summ_docs,
            }
            eve_poc_arr.append(cons_repo)

        return Response({'Record': eve_poc_arr} , status=status.HTTP_200_OK)
    

class ServiceReport(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def count_zone(self, obj):
        
        # --------------------------------------------------------
        data1=[]
        for name in obj:
            data={}
            s=set(name)
            for i in s:
                data[str(i)]=name.count(i)
            data1.append(data)   
        return data1
        # --------------------------------------------------------
        
    def get(self, request):
        # start_date=request.GET.get['st_date']
        # end_date=request.GET.get['ed_date']
        hos=request.data['hos']
        start_date = (datetime.strptime(request.GET.get("st_date"), '%Y-%m-%d'))
        end_date = (datetime.strptime(request.GET.get("ed_date"), '%Y-%m-%d'))

        print(start_date, end_date)
        if start_date and end_date and hos:
            Doctor_Visit=agg_hhc_event_plan_of_care.objects.filter(srv_id=1, start_date__range=(start_date, end_date), hosp_id=hos)
            print("doctor visit-- ", Doctor_Visit)
            # Nursing=agg_hhc_event_plan_of_care.objects.filter(srv_id=5, start_date__range=(start_date, end_date), hosp_id=hos).count()
            # Physio=agg_hhc_event_plan_of_care.objects.filter(srv_id=7, start_date__range=(start_date, end_date), hosp_id=hos).count()
            # Equipment=agg_hhc_event_plan_of_care.objects.filter(srv_id=13, start_date__range=(start_date, end_date), hosp_id=hos).count()
            # X_Ray=agg_hhc_event_plan_of_care.objects.filter(srv_id=11, start_date__range=(start_date, end_date), hosp_id=hos).count()
            Hca=agg_hhc_event_plan_of_care.objects.filter(srv_id=2, start_date__range=(start_date, end_date), hosp_id=hos)
            print("HCA-- ", Hca)
        elif start_date and end_date:
            Doctor_Visit=agg_hhc_event_plan_of_care.objects.filter(srv_id=1, start_date__range=(start_date, end_date))
            print("doctor visit-- ", Doctor_Visit)
            # Nursing=agg_hhc_event_plan_of_care.objects.filter(srv_id=5, start_date__range=(start_date, end_date)).count()
            # Physio=agg_hhc_event_plan_of_care.objects.filter(srv_id=7, start_date__range=(start_date, end_date)).count()
            # Equipment=agg_hhc_event_plan_of_care.objects.filter(srv_id=13, start_date__range=(start_date, end_date)).count()
            # X_Ray=agg_hhc_event_plan_of_care.objects.filter(srv_id=11, start_date__range=(start_date, end_date)).count()
            Hca=agg_hhc_event_plan_of_care.objects.filter(srv_id=2, start_date__range=(start_date, end_date))
            print("HCA-- ", Hca)
        else:
            # print(datetime.datetime.now().date())
            Doctor_Visit=agg_hhc_event_plan_of_care.objects.filter(srv_id=1, start_date=datetime.datetime.now().date())
            # Nursing=agg_hhc_event_plan_of_care.objects.filter(srv_id=5, start_date=datetime.datetime.now().date())
            # Physio=agg_hhc_event_plan_of_care.objects.filter(srv_id=7, start_date=datetime.datetime.now().date())
            # Equipment=agg_hhc_event_plan_of_care.objects.filter(srv_id=13, start_date=datetime.datetime.now().date())
            # X_Ray=agg_hhc_event_plan_of_care.objects.filter(srv_id=11, start_date=datetime.datetime.now().date())
            Hca=agg_hhc_event_plan_of_care.objects.filter(srv_id=2, start_date=datetime.datetime.now().date())

        # lists=[Doctor_Visit,Nursing, Physio, Equipment, X_Ray, Hca]
        lists=[Doctor_Visit, Hca]
        obj=[]
        for l in lists:
            if l:
                obj.append([i.eve_id.agg_sp_pt_id.prof_zone_id.Name for i in l])
            else: obj.append([])   
        count_zones= self.count_zone(obj)
        data=(
            {"Doctor_Visit":Doctor_Visit.count(),"zone_wise_service_count":count_zones[0]},
            # {"Nursing":Nursing.count(),"zone_wise_service_count":count_zones[1]},
            # {"Physio":Physio.count(),"zone_wise_service_count":count_zones[2]},
            # {"Equipment":Equipment.count(),"zone_wise_service_count":count_zones[3]},
            # {"X_Ray":X_Ray.count(),"zone_wise_service_count":count_zones[4]},
            # {"Hca":Hca.count(),"zone_wise_service_count":count_zones[5]}
            {"Hca":Hca.count(),"zone_wise_service_count":count_zones[1]}
        )
        print("data-------", data)
        return Response({"data":data})
        # return Response("data")
        # print(Doctor_Visit)
        # print(Nursing)
        # print(Physio)
        # print(Equipment)
        # print(X_Ray)
        # print(Hca)

































# ___________________________________ Amit Rasale ___________________________________________

from rest_framework_simplejwt.tokens import OutstandingToken
from rest_framework_simplejwt.tokens import BlacklistedToken

class Login_Logout_ReportAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request): 

        Fromstart_date = request.query_params.get('fromdate')
        Toend_date = request.query_params.get('todate')
        prof_id = request.query_params.get('prof')

        if prof_id:
            source_obj=agg_hhc_service_professionals.objects.filter(srv_prof_id=prof_id, status=1)
        else:
            source_obj=agg_hhc_service_professionals.objects.filter(isDelStatus=1)

        serialized=Login_Logout_professionals_Serializers(source_obj,many=True)
        start_date_str = Fromstart_date
        end_date_str = Toend_date
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d')

        filtered_data = []
        for item in serialized.data:
            out_std_token = item.get('out_std_token', [])
            if not out_std_token:  # Check if out_std_token is empty
                continue  # Skip this item if out_std_token is empty

            filtered_tokens = []
            for token in out_std_token:
                # created_at = datetime.strptime(token['created_at'], '%Y-%m-%dT%H:%M:%S.%fZ')
                created_at = datetime.strptime(token['created_at'], '%Y-%m-%dT%H:%M:%S.%f')
                blacklisted_at = None
                if token['block']:
                    blacklisted_at = datetime.strptime(token['block'][0]['blacklisted_at'], '%Y-%m-%dT%H:%M:%S.%fZ')
                # Check if blacklisted_at is not None before comparison
                if blacklisted_at is not None and (start_date is None or created_at >= start_date) and (end_date is None or blacklisted_at <= end_date):
                    filtered_tokens.append(token)
            
            # Add item only if filtered_tokens is not empty
            if filtered_tokens:
                item['out_std_token'] = filtered_tokens
                filtered_data.append(item)

        return Response(filtered_data)
        # return Response(serialized.data)



from rest_framework.decorators import api_view    
from rest_framework.response import Response
from django.contrib.auth.models import Permission

# ____ Amit ______

class hospital_patient_count_ReportAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        form_date_str = request.query_params.get('form_date')
        end_date_str = request.query_params.get('end_date')
        hospital_name = request.query_params.get('hospital_name')
        
        if form_date_str:
            form_date = datetime.strptime(form_date_str, '%Y-%m-%d')
        else:
            form_date = None
        
        if end_date_str:
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
        else:
            end_date = None
        
        events = agg_hhc_events.objects.filter(status=1, event_status=3)
        
        if hospital_name:
            events = events.filter(agg_sp_pt_id__preferred_hosp_id__hosp_id=hospital_name)
        
        if form_date and end_date:
            events = events.filter(last_modified_date__date__range=[form_date, end_date])
        
        events = events.values('agg_sp_pt_id__preferred_hosp_id__hosp_id',
                               'agg_sp_pt_id__preferred_hosp_id__hospital_name').annotate(
                                    patient_count=Count('agg_sp_pt_id'))
        
        if not form_date and not end_date:
            if not hospital_name:
                # If no filters are provided, get all hospital names and counts
                all_hospitals = agg_hhc_events.objects.values_list(
                    'agg_sp_pt_id__preferred_hosp_id__hospital_name', flat=True).distinct()
                
                serialized_data = []
                for hospital_name in all_hospitals:
                    hospital_data = {
                        'hospital_name': hospital_name,
                        'patient_count': 0
                    }
                    for event in events:
                        if event['agg_sp_pt_id__preferred_hosp_id__hospital_name'] == hospital_name:
                            hospital_data['patient_count'] = event['patient_count']
                            break
                    serialized_data.append(hospital_data)
                
                return Response(serialized_data)
            
        if form_date and end_date:
            if not hospital_name:
                # If no filters are provided, get all hospital names and counts
                all_hospitals = agg_hhc_events.objects.values_list(
                    'agg_sp_pt_id__preferred_hosp_id__hospital_name', flat=True).distinct()
                
                serialized_data = []
                for hospital_name in all_hospitals:
                    hospital_data = {
                        'hospital_name': hospital_name,
                        'patient_count': 0
                    }
                    for event in events:
                        if event['agg_sp_pt_id__preferred_hosp_id__hospital_name'] == hospital_name:
                            hospital_data['patient_count'] = event['patient_count']
                            break
                    serialized_data.append(hospital_data)
                
                return Response(serialized_data)
    
        else:
            serialized_data = []
            for event in events:
                hospital_data = {
                    'hospital_name': event['agg_sp_pt_id__preferred_hosp_id__hospital_name'],
                    'patient_count': event['patient_count']
                }
                serialized_data.append(hospital_data)

            return Response(serialized_data)
    
# ____ Amit ______

class Session_Refound_Amount_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # fromdate = datetime.strptime(request.query_params.get('fromdate'), '%Y-%m-%d').date()
        # todate = datetime.strptime(request.query_params.get('todate'), '%Y-%m-%d').date()

        fromdate = request.query_params.get('fromdate')
        todate = request.query_params.get('todate')

        if fromdate and todate is not None:
            print('1233')
            fromdate = datetime.strptime(fromdate, '%Y-%m-%d').date()
            todate = datetime.strptime(todate, '%Y-%m-%d').date()+timedelta(days=1)
            service_record = agg_hhc_cancellation_history.objects.filter(Q(added_date__range=(fromdate, todate))).exclude(can_amt=None)

        elif fromdate or todate is not None:
            return Response({'error':'please enter both date'})
        else:
            fromdate= None
            todate= None
            service_record = agg_hhc_cancellation_history.objects.exclude(can_amt=None)
            print('asdf')
        
        services=set()
        sessions=set()
        events=[]
        service_events=[]
        session_events=[]
        for data in service_record:
            if data.agg_sp_dt_eve_poc_id:
                sessions.add(data)
                service_events.append(data.event_id)
            else:
                services.add(data)
                session_events.append(data.event_id)
            events.append(data.event_id)

        events1=set(events)
        datas_list = []
        for data in events1:
            total_sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=data.eve_id).count()
            data1=service_record.filter(event_id=data)[0]
            if data1.agg_sp_dt_eve_poc_id:
                cancelled_sessions = events.count(data)
                dates = [date_obj.cancelled_date.date() for date_obj in service_record.filter(event_id=data) if date_obj.cancelled_date]

            else:
                sessions=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=data.eve_id)
                cancelled_sessions=sessions.count()
                dates = [date_obj.actual_StartDate_Time for date_obj in sessions if date_obj.actual_StartDate_Time]
            if total_sessions==cancelled_sessions:
                status='service_cancel'
            else: status='session_cancel'
            try:
                event_plan=agg_hhc_event_plan_of_care.objects.get(eve_id=data.eve_id)
            except event_plan.DoesNotExist:
                return Response({"error": 'event plan of care does not exist'})
            srv= event_plan.srv_id.service_title
            sub_srv= event_plan.sub_srv_id.recommomded_service
            service_start_date = event_plan.start_date
            service_end_date = event_plan.end_date
            datas = {
                # 'event_id':data.eve_id,
                'event_id':data.event_code,
                'srvice':srv,
                'sub_service':sub_srv,
                'service_total_amount': data.Total_cost,
                'service_start_date':service_start_date,
                'service_end_date':service_end_date,
                'cancellation_charges': sum([data.can_amt for data in service_record.filter(event_id=data.eve_id)]),
                'total_sessions': total_sessions,
                'cancelled_sessions': cancelled_sessions,
                'dates': dates,
                'cancelation_staus':status
            }
            datas_list.append(datas)

        data_serializer = Session_Refound_Amount_serializer(datas_list, many=True)
        return Response(data_serializer.data)

# class Manage_enquiry_ReportAPIView(APIView):
#     def get(self, request):
#         manage = agg_hhc_enquiry_follow_up.objects.get()
#         manage_ser = Manage_enquiry_Report_serializers(manage, many=True)
#         return Response(manage_ser.data)
    

class Test_APIView(APIView):
    def get(self, request):
        manages = agg_hhc_patients.objects.all()  # or .filter() with specific conditions
        manage_ser = ConsultantPatientsSerializer(manages, many=True)
        count = len(manage_ser.data)
        data_with_count = {
            'data': manage_ser.data,
            'count': count
        }
        return Response(data_with_count)




from rest_framework.exceptions import ValidationError
class Manage_enquiry_ReportAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # fromdate = request.query_params.get('fromdate')
        # todate = request.query_params.get('todate')
        # fromdate = datetime.strptime(fromdate, '%Y-%m-%d').date()
        # todate = datetime.strptime(todate, '%Y-%m-%d').date()+timedelta(days=1)
        # select_report_type = request.query_params.get('select_report_type')

        fromdate = request.query_params.get('fromdate')
        todate = request.query_params.get('todate')
        select_report_type = request.query_params.get('select_report_type')

        # Check if fromdate, todate, and select_report_type are provided
        if not (fromdate and todate):
            raise ValidationError("Both start date and end date are required. Please use YYYY-MM-DD format.")

        if not select_report_type:
            raise ValidationError("Please provide select_report_type parameter. use this select_report_type=pass_id ")

        fromdate = datetime.strptime(fromdate, '%Y-%m-%d').date()
        todate = datetime.strptime(todate, '%Y-%m-%d').date() + timedelta(days=1)

        # manage = agg_hhc_enquiry_follow_up.objects.all()
        # if fromdate and todate:
        #     manage = manage.filter(
        #         event_id__added_date__gte=fromdate,
        #         event_id__last_modified_date__lt=todate
        #     )

        if select_report_type == '1':     # Cancle Enquery
            if fromdate and todate:
                objects = agg_hhc_enquiry_follow_up.objects.filter(Q(added_date__range=(fromdate, todate)), follow_up='2', event_id__status=2)
            else:
                objects = agg_hhc_enquiry_follow_up.objects.filter(follow_up='2')
            serialized = Canceled_enquiry_serializer(objects, many=True)
        elif select_report_type == '2':     # Convert Into Service
            objects =  agg_hhc_event_plan_of_care.objects.filter(Q(eve_id__added_date__range=(fromdate, todate)) & (Q(eve_id__enq_spero_srv_status=1)|Q(eve_id__enq_spero_srv_status=3)), status=1)
            serialized = source_of_enquiry(objects, many=True)
        elif select_report_type == '4':     # Total Converted To Service
            objects1 = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(added_date__range=(fromdate, todate)),(Q(eve_id__enq_spero_srv_status=1) & Q(eve_id__status=1)), status=1).distinct('eve_id')
            # objects1 = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(eve_id__added_date__range=(fromdate, todate)) & (Q(eve_id__enq_spero_srv_status=1) | Q(eve_id__status=1)), status=1)
            d=[i.eve_poc_id.eve_poc_id for i in objects1]
            objects=agg_hhc_event_plan_of_care.objects.filter(status=1,eve_poc_id__in=d)
            serialized = enquiry_Convert_Into_Service(objects, many=True)

        elif select_report_type == '3':     # Enquiry Within 2 hr
            eve_poc = agg_hhc_event_plan_of_care.objects.filter(Q(eve_id__added_date__range=(fromdate, todate)) & (Q(eve_id__enq_spero_srv_status=1) | Q(eve_id__enq_spero_srv_status=2)) & Q(eve_id__status=1), status=1).order_by('eve_id')
            events = [i.eve_id for i in eve_poc]
            de_eve_poc_subquery = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id__in=events).order_by('eve_id', 'agg_sp_dt_eve_poc_id').distinct('eve_id')

            objects = []
            two_hours = timedelta(hours=2)
            for i in range(min(len(eve_poc), len(de_eve_poc_subquery))):
                if (two_hours >= (eve_poc[i].added_date) - (de_eve_poc_subquery[i].added_date)):
                    objects.append(eve_poc[i])
            serialized = enquiry_within_two_hr_serializer(objects, many=True)        
        else:
            return Response({'error': 'enter valid choice'})
        return Response(serialized.data)


class Job_closure_report_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        fromdate = request.query_params.get('fromdate')
        todate = request.query_params.get('todate')
        if fromdate and todate:
            fromdate = datetime.strptime(fromdate, '%Y-%m-%d').date()
            todate = datetime.strptime(todate, '%Y-%m-%d').date()

        epoc_data = agg_hhc_event_plan_of_care.objects.filter(start_date__gte=fromdate,end_date__lte=todate,status = 1)
        eve_idsss = [i.eve_id.eve_id for i in epoc_data]
        obj = agg_hhc_events.objects.filter(Q(event_status=2) or Q(event_status=3),eve_id__in= eve_idsss, status=1)

        serializer= Job_closure_serializer(obj, many=True)
     
        return Response(serializer.data) 
 










from django.db.models import Subquery, OuterRef
class consultant_Report_APIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        fromdate = request.query_params.get('fromdate')
        todate = request.query_params.get('todate')
        select_report_type = request.query_params.get('select_report_type')
        # cons_fullname = request.query_params.get('cons_fullname')        
        manage = agg_hhc_events.objects.all()

        if fromdate and todate:
            fromdate = datetime.strptime(fromdate, '%Y-%m-%d').date()
            todate = datetime.strptime(todate, '%Y-%m-%d').date()
            # todate += timedelta(days=1)
            # manage = manage.filter(
            #     # added_date__gte=fromdate,
            #     # last_modified_date__lt=todate
            #     # added_date__gte = fromdate,
            #     # added_date__lt = todate 
            #     agg_hhc_detailed_event_plan_of_care__start_date__range=(fromdate, todate)
            # )
            event_ids = agg_hhc_event_plan_of_care.objects.filter(
                start_date__range=(fromdate, todate),
                eve_id=OuterRef('eve_id')
            ).values('eve_id')

            manage = manage.filter(
                eve_id__in=Subquery(event_ids)
            )            

        if select_report_type == select_report_type:     # Cancel Enquiry
            manage = manage.filter(enq_spero_srv_status__in=['1', '2'], event_status__in = ['2', '3'], status='1', agg_sp_pt_id__doct_cons_id__doct_cons_id=select_report_type)
            serialized = consultant_Report_serializers(
                manage,
                many=True,
                context={'select_report_type': select_report_type}
            )
        # elif select_report_type == '2':     # Cancel Enquiry
        #     manage = manage.filter(enq_spero_srv_status='3', status='1')
        #     serialized = consultant_Report_serializers(
        #         manage,
        #         many=True,
        #         context={'select_report_type': select_report_type}
        #     )     
        # elif select_report_type == '3':     # Cancel Enquiry
        #     manage = manage.filter(enq_spero_srv_status__in=['1', '2'], status='1')
        #     serialized = consultant_Report_serializers(
        #         manage,
        #         many=True,
        #         context={'select_report_type': select_report_type}
        #     )    
        # elif select_report_type == '4':     # Cancel Enquiry
        #     manage = manage.filter(status='1', agg_hhc_enquiry_follow_up__follow_up=2)
        #     serialized = consultant_Report_serializers(
        #         manage,
        #         many=True,
        #         context={'select_report_type': select_report_type}
        #     )
        # elif select_report_type == '5':     # Cancel Enquiry
        #     manage = manage.filter(status='1', agg_hhc_cancellation_history__cancellation_by__in=['1', '2'])
        #     serialized = consultant_Report_serializers(
        #         manage,
        #         many=True,
        #         context={'select_report_type': select_report_type}
        #     )
        else:
            # serialized = consultant_Report_serializers(manage, many=True)
            return Response({"message":"consultantNot found"})

        # count = len(serialized.data)
        # data_with_count = {
        #     'data': serialized.data,
        #     'count': count
        # }
        return Response(serialized.data)



# class consent_view_image_Sign (APIView):
#     def get(self, request, eveid):
#         consent = agg_hhc_concent_form_details.objects.filter(eve_id=eveid, status=1).order_by('eve_id', '-added_date').distinct('eve_id')
#         serialized = Consent_view_documents_sign_serializer(consent, many=True)
#         return Response(serialized.data)

import logging
from .serializers import Consent_view_documents_sign_serializer
logger = logging.getLogger(__name__)

class ConsentViewImageSign(APIView):
    def get(self, request, eveid):
        consent = agg_hhc_concent_form_details.objects.filter(eve_id=eveid, status=1).order_by('eve_id', '-added_date').distinct('eve_id')
        serialized = Consent_view_documents_sign_serializer(consent, many=True, context={'request': request})
        logger.info(f"Serialized data: {serialized.data}")
        return Response(serialized.data)







# ____ Amit ______

class hospital_wise_session_count(APIView):
    def get(self,request):
        service_count=[]
        date=timezone.now().date()
        hospital=agg_hhc_hospitals.objects.filter(status=1)
        details_event=agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=date,status=1)
        services=agg_hhc_services.objects.filter(status=1)
        for i in hospital:
            new_dt=details_event.filter(eve_id__agg_sp_pt_id__preferred_hosp_id=i).count()
            if  new_dt >0 :
                service_count.append(str("\n\n"+i.hospital_name+"\n"))
            else:
                continue
            ct=0
            counter=1
            for k in services:
                new_dt=details_event.filter(eve_poc_id__srv_id=k,eve_id__agg_sp_pt_id__preferred_hosp_id=i).count()
                new={k.service_title:new_dt}
                new_str=str(str(counter)+"."+k.service_title+":"+str(new_dt)+"\n")
                if new_dt<=0:
                    pass
                else:
                    ct=ct+new_dt
                    counter+=1
                    service_count.append(new_str)
            service_count.append(str("Total "+i.hospital_name+" Services ="+str(ct)+"\n"))
            print("name of hospital is ",)
            print(service_count)
        list_string=str("Spero Home Healthcare pune\n Total Services Count For Date "+str(date)+"\n")    
        for l in service_count:
            list_string=list_string+l
#--------------------------------------------phone numbrer list-----------------------------##############
        num=[9552594108,8698989880,9741805533,7218774942,7774091977,7760997743,8956193882,9881098290,7775832657,9371123405]
        msg = list_string
        for sen in num:
            # send_otp(sen,msg)
            pass
        return Response({"message":service_count})
    


from django.http import StreamingHttpResponse
import csv

class hospital_wise_session_count_excel(APIView):
    def get(self,request,start_date,end_date):
        service_count=[]
        # date=timezone.now().date()
        start_dates = datetime.strptime(start_date, '%Y-%m-%d').date()
        end_dates = str(datetime.strptime(end_date, '%Y-%m-%d').date()+timedelta(days=1))
        hospital=agg_hhc_hospitals.objects.filter(status=1)
        if(start_date==end_date):
            details_event=agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=start_dates,status=1)
        else:            
            details_event=agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__range=(start_dates,end_dates),status=1)
        services=agg_hhc_services.objects.filter(status=1)
        for i in hospital:
            new_dt=details_event.filter(eve_id__agg_sp_pt_id__preferred_hosp_id=i).count()
            if  new_dt >0 :
                service_count.append(str(i.hospital_name))
            else:
                continue
            ct=0
            counter=1
            for k in services:
                new_dt=details_event.filter(eve_poc_id__srv_id=k,eve_id__agg_sp_pt_id__preferred_hosp_id=i).count()
                new={k.service_title:new_dt}
                new_str=str(str(counter)+"."+k.service_title+":"+str(new_dt))
                if new_dt<=0:
                    pass
                else:
                    ct=ct+new_dt
                    counter+=1
                    service_count.append(new_str)
            service_count.append(str("Total "+i.hospital_name+" Services ="+str(ct)))
        return Response({"message":service_count})
    #     csv_data = self.serialize_to_csv(service_count[0])
    #     # Prepare response
    #     response = StreamingHttpResponse(csv_data, content_type='text/csv')
    #     response['Content-Disposition'] = 'attachment; filename="hhc_dayprint.csv"'
    #     return response
    #     # return Response(day_print.data) 

    # def serialize_to_csv(self, data):
    #     header = ['pay_dt_id','hospital_name']  # Add other fields here #  CSV file header name of table fields names 
    #     # Initialize the CSV writer
    #     csv_stream = (self.generate_csv_row(data_row) for data_row in data)#        csv_stream = (self.generate_csv_row(header, data_row) for data_row in data)
    #     # Yield header
    #     # yield ','.join(header) + '\n'
    #     # Yield data
    #     for row in csv_stream:
    #         yield row + '\n'

    # def generate_csv_row(self, header, data_row):
    #     # used to Generate a row of CSV data based on the serializer data
    #     row = []
    #     for field in header:
    #         row.append(str(data_row.get(field, '')))
    #     return ','.join(row)

class service_count_temp(APIView):
    def get(self,request):
        template_name='session_details'
        all_services=agg_hhc_detailed_event_plan_of_care.objects.filter(status=1,eve_id__event_status=2 or 3,actual_StartDate_Time=datetime.now().date())#.filter(Q(srv_prof_id__isnull=False)|Q(srv_prof_id=''))
        services_id=[3,9,11,10,5,6,1,2,7,4,12]
        placeholders=[0]
        t=0
        for i in services_id:
            count=all_services.filter(eve_poc_id__srv_id=i).count()
            t+=count
            placeholders.append(count)
        placeholders[0]=t
        phone_numbers=['919975063761','919960998794','918956193882','918097077998','919130029103','919552594108','919741805533','918888127149']#for test 
        for i in phone_numbers:
            whatsapp_sms(i,template_name,placeholders)
        return Response({'message':'message send sucessfully'})


class hospital_count_temp(APIView):
    def get(self,request):
        template_name='total_session_count'
        all_services=agg_hhc_detailed_event_plan_of_care.objects.filter(status=1,eve_id__event_status=2 or 3,actual_StartDate_Time=datetime.now().date())#.filter(Q(srv_prof_id__isnull=False)|Q(srv_prof_id=''))       
        services_id=[32,21,19,20,18,15,28,2,8,30,6,7,31,25,1,10,33,27,11,22,29,26]
        placeholders=[0]
        t=0
        for i in services_id:
            count=all_services.filter(eve_poc_id__hosp_id=i).count()
            t+=count
            placeholders.append(count)
        placeholders[0]=t
        phone_numbers=['919975063761','919960998794','918956193882','918097077998','919130029103','919552594108','919741805533','918888127149']#for test 
        for i in phone_numbers:
            whatsapp_sms(i,template_name,placeholders)
        return Response({'message':'message send sucessfully'})
