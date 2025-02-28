from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.parsers import JSONParser
from django.core.exceptions import ObjectDoesNotExist
from . import serializer

from hhc_account.serializer import *

from hhcweb.models import*
from hhcspero.settings import AUTH_KEY, SERVER_KEY
import random
from django.db.models import Q
import requests,random,pytz,io
from hhc_professional_app.renders import UserRenderer
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import date, timedelta, datetime
from django.http import JsonResponse
from django.conf import settings
import jwt
from rest_framework.exceptions import NotFound
import math
from django.db.models import Sum, Value
from django.db.models.functions import Coalesce
# from .models import OutstandingToken, BlacklistToken





# ------------------------- Pending Payment from Patients  ----------------------------------
class pend_pay_frm_ptn(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, start_date_str, end_date_str):
        start_date = datetime.datetime.strptime(start_date_str, '%Y-%m-%d').date()
        end_date = datetime.datetime.strptime(end_date_str, '%Y-%m-%d').date()        
        end_date += timedelta(days=1)
        pay = agg_hhc_payment_details.objects.filter(overall_status="SUCCESS",status = 1)

        existing_eve_ids = pay.values_list('eve_id', flat=True)
        get_eve_without_payment = agg_hhc_events.objects.filter(
            (Q(event_status=2) | Q(event_status=3)),
            added_date__range=(start_date, end_date),status = 1
        ).exclude(eve_id__in=existing_eve_ids)
        
        serializer_data = serializer.pend_pay_frm_ptn_serializer(get_eve_without_payment, many=True)
        return Response(serializer_data.data)








# ------------------------- Pending Payment from Professional  ----------------------------------
# class pend_pay_frm_prof(APIView):
#     # renderer_classes = [UserRenderer]
#     # permission_classes = [IsAuthenticated]
#     def get(self, request, start_date_str, end_date_str):
#         # start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
#         # end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
#         start_date = datetime.datetime.strptime(start_date_str, '%Y-%m-%d').date()
#         end_date = datetime.datetime.strptime(end_date_str, '%Y-%m-%d').date()


#         end_date += timedelta(days=1)
#         pend_prof_payment = agg_hhc_payment_details.objects.filter(overall_status="SUCCESS",payment_status = 1,mode = 1, status = 1)
#         # pend_prof_payment_with_srv_prof_id = pend_prof_payment.exclude(srv_prof_id__isNone=True)
        
#         existing_eve_ids = pend_prof_payment.values_list('eve_id', flat=True)
#         print(existing_eve_ids,'existing_eve_ids')
#         get_eve_with_payment = agg_hhc_events.objects.filter(
#             (Q(enq_spero_srv_status=1) | Q(enq_spero_srv_status=2)),
#             eve_id__in=existing_eve_ids,
#             added_date__range=(start_date, end_date),
#             status=1
#         )
#         print(get_eve_with_payment,'get_eve_with_payment')
#         get_valid_pay = agg_hhc_payment_details.objects.filter(eve_id__in=get_eve_with_payment.values_list('eve_id', flat=True),overall_status= "SUCCESS", )
#         serilaizers = serializer.pend_pay_frm_prof_serializer(get_valid_pay, many=True)

       
#         return Response(serilaizers.data)



class pend_pay_frm_prof(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    def get(self, request, start_date_str, end_date_str):
        # start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        # end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
        start_date = datetime.datetime.strptime(start_date_str, '%Y-%m-%d').date()
        end_date = datetime.datetime.strptime(end_date_str, '%Y-%m-%d').date()


        end_date += timedelta(days=1)
        pend_prof_payment = agg_hhc_payment_details.objects.filter(overall_status="SUCCESS",payment_status = 1,mode = 1, status = 1)
        print(pend_prof_payment,'pend_prof_payment')
        # pend_prof_payment_with_srv_prof_id = pend_prof_payment.exclude(srv_prof_id__isNone=True)
        
        existing_eve_ids = pend_prof_payment.values_list('eve_id', flat=True)
        print(existing_eve_ids,'existing_eve_ids')
        get_eve_with_payment = agg_hhc_events.objects.filter(
            # (Q(enq_spero_srv_status=1) | Q(enq_spero_srv_status=2)),
            (Q(event_status=2) | Q(event_status=3)),
            eve_id__in=existing_eve_ids,
            added_date__range=(start_date, end_date),
            status=1
        )
        print(get_eve_with_payment,'get_eve_with_payment')
        get_valid_pay = agg_hhc_payment_details.objects.filter(eve_id__in=get_eve_with_payment.values_list('eve_id', flat=True),overall_status= "SUCCESS")
        serilaizers = serializer.pend_pay_frm_prof_serializer(get_valid_pay, many=True)
        return Response(serilaizers.data)



# --------------------------------------------------------------------------------------------------------------------------------------------




class Day_wise_payment_list(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        print('1')
        start_date=datetime.strptime(request.data['start_date'], "%Y-%m-%d")
        end_date=datetime.strptime(request.data['end_date'], "%Y-%m-%d")+timedelta(days=1)
        payment_done=agg_hhc_payment_details.objects.filter(date__range=(start_date, end_date),overall_status="SUCCESS")
        payment_serializer = serializer.Day_wise_payment_list_serializer(payment_done, many=True)
        return Response(payment_serializer.data)

class Service_Wise_Pending_Payment(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        payment_done1=agg_hhc_events.objects.filter(Q(enq_spero_srv_status=1) or Q(enq_spero_srv_status=2), status=1)
        paid_events = agg_hhc_payment_details.objects.filter(status=1,overall_status="SUCCESS")
        print(paid_events.count())
        payment_done = payment_done1.exclude(eve_id__in=paid_events.values_list('eve_id', flat=True))
        print(payment_done.count())
        payment_serializer = serializer.Service_Wise_Pending_Payment_Serializer(payment_done, many=True)
        return Response(payment_serializer.data)
    


class Service_Wise_Pending_Payment1(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, start_date, end_date, hosp_id):
        payment_done1=agg_hhc_events.objects.filter(Q(enq_spero_srv_status=1) or Q(enq_spero_srv_status=2), 
                                                    agg_sp_pt_id__preferred_hosp_id=hosp_id, 
                                                    status=1, added_date__range = (start_date, end_date))

        paid_events = agg_hhc_payment_details.objects.filter(status=1)
        print(paid_events.count())
        payment_done = payment_done1.exclude(eve_id__in=paid_events.values_list('eve_id', flat=True))
        print(payment_done.count())
        payment_serializer = serializer.Service_Wise_Pending_Payment_Serializer(payment_done, many=True)
        return Response(payment_serializer.data)
    

    
class Acutal_salary_professionals(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,find_id,start_dat=None,end_dat=None):
        professional_list=[]
        data=[]
        if(find_id==1):
            current_year = datetime.now().date()
            previous_year = current_year.replace(month=1,day=1)
            event_plan=agg_hhc_event_plan_of_care.objects.filter(start_date__gte=previous_year,status=1)# 1 year data
        elif(find_id==2):#2 for date_wise
            print("start date ",start_dat,"end date",end_dat)
            event_plan=agg_hhc_event_plan_of_care.objects.filter(start_date__gte=start_dat,start_date__lte=end_dat,status=1)# 1 year data
            print("data is ",event_plan)
        else:
            event_plan=None
        for i in event_plan:
            if (i.eve_id.enq_spero_srv_status==1 or 2 and i.eve_id.event_status==2 or 3):
                eve_id=i.eve_id
            #_________________________________________________discount type and given discount start__________________
                if(i.eve_id.discount_type==1 or i.eve_id.discount_type==2):
                    discount_value = int(i.eve_id.discount_value) if i.eve_id.discount_value is not None else None
                else:
                    discount_value=None
            #_________________________________________________discount type and given discount end__________________
                detaile_event_plan_of_care=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id,status=1)
                try:
                    per_prof_amount=int(i.eve_id.Total_cost)//detaile_event_plan_of_care.filter().count()
                    # per_prof_amount= int(detaile_event_plan_of_care.last().eve_poc_id.sub_srv_id.cost)
                except:
                    per_prof_amount=0
                for j in detaile_event_plan_of_care:
                    if j.srv_prof_id is not None:
                        if(str(j.srv_prof_id.prof_fullname) in professional_list):
                            pass
                        else:
                            get_dtl_data=detaile_event_plan_of_care.filter(eve_id=i.eve_id,srv_prof_id=j.srv_prof_id,status=1)
                            professional_list.append(j.srv_prof_id.prof_fullname)
                            convience_amount=0
                            for k in get_dtl_data:
                                if k.is_convinance==True:
                                    convience_amount+=int(k.convinance_charges)
                            payments=agg_hhc_payment_details.objects.filter(eve_id=i.eve_id,status=1,overall_status="SUCCESS").last()
                            if payments:
                                recive_session_amount=int(get_dtl_data.count())
                                pending_session_amount=0
                            else:
                                recive_session_amount=0
                                pending_session_amount=int(get_dtl_data.count())
                            print("findal")
                            final_dict={'event_id':i.eve_id_id,'event_start_date':i.start_date,'patient_name':i.eve_id.agg_sp_pt_id.name,'service':i.srv_id.service_title,'session_count':int(get_dtl_data.count()),'recive_session_amount':recive_session_amount,'pending_session_amount':pending_session_amount,'service_Amount':int(get_dtl_data.count()*per_prof_amount),'convience_amount':convience_amount}
                            data.append(final_dict)
        return Response({"data":data})
    




class Accout_invoice_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, find_id, start_dat=None, end_dat=None, hospt_id=None):
        completed_payment_list=[]
        professional=[]
        current_year = datetime.datetime.now().year
        previous_year = current_year - 1
        start_date = datetime.datetime.strptime(start_dat, '%Y-%m-%d').date()
        end_date = datetime.datetime.strptime(end_dat, '%Y-%m-%d').date()#+timedelta(days=1)
        print("we are inside of for loop   111111111111")
        if find_id == 1:
            current_year = datetime.now().date()
            previous_year = current_year.replace(month=1, day=1)
            event_plan=agg_hhc_detailed_event_plan_of_care.objects.filter(status=1,actual_StartDate_Time__gte=previous_year)
            events_id=event_plan.distinct('eve_id')
        elif find_id == 2:  # 2 for date_wise
            if(start_dat==end_dat):
                event_plan=agg_hhc_detailed_event_plan_of_care.objects.filter(status=1,actual_StartDate_Time=start_date,eve_poc_id__hosp_id=hospt_id)
                events_id=event_plan.distinct('eve_id')
            else:
                event_plan=agg_hhc_detailed_event_plan_of_care.objects.filter(status=1,actual_StartDate_Time__range=(start_date, end_date),eve_poc_id__hosp_id=hospt_id)
                print("different dates found ")
                events_id=event_plan.distinct('eve_id')
        else:
            event_plan = None
            events_id=[]
        print("we are inside of for loop")
        for jt in events_id:
            if jt.eve_id.discount_type==1:
                disc_amt=round((int(jt.eve_id.Total_cost)/100)*jt.eve_id.discount_value)
            elif jt.eve_id.discount_type==2:
                disc_amt=int(jt.eve_id.discount_value)
            else: 
                disc_amt=0
            professional_list=None
            professional_list=[]
            # detaile_event_plan_of_care=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id,status=1).order_by('actual_StartDate_Time')
            print("this is jt varable from for loop",jt)
            # time.sleep(8)
            detaile_event_plan_of_care=event_plan.filter(eve_id=jt.eve_id).order_by('actual_StartDate_Time')
            per_prof_amount= int(detaile_event_plan_of_care.last().eve_poc_id.sub_srv_id.cost)
            sessions=0
            first_dt_plan=detaile_event_plan_of_care.first()
            try:
                hospital_code=first_dt_plan.eve_poc_id.hosp_id.hospital_short_code
                hospital_code_sale=hospital_code
                voucher_number=str(hospital_code+"/"+serializer.financial_year(first_dt_plan.actual_EndDate_Time)+"/"+str(first_dt_plan.eve_id.Invoice_ID))#i.start_date
            except:
                hospital_code = None
                hospital_code_sale = " "
                voucher_number = None


            for j in detaile_event_plan_of_care:
                professional_name_date=[]
                if j.srv_prof_id is not None:
                    if(str(j.srv_prof_id.prof_fullname) in professional_list):
                        pass
                    else:
                        get_dtl_data=detaile_event_plan_of_care.filter(eve_id=jt.eve_id,srv_prof_id=j.srv_prof_id,status=1)
#----------------------------all dates is appended to the list -------------------------------------
                        for k in get_dtl_data:
                            professional_name_date.append(str(k.actual_StartDate_Time))
#----------------------------all dates is appended to the list end -------------------------------------
                        if len(professional_name_date)==1:
                                per_prof_amount_is=(per_prof_amount*1)#+(conv_first*1)
                                professiona_proper_info1={'Branch':hospital_code,'voucher_number':voucher_number,'Voucher_Type':str("Sales -"+str(hospital_code_sale)),'Voucher_Date':str(datetime.datetime.strptime(str(professional_name_date[0]), '%Y-%m-%d').strftime('%d-%m-%Y')),'Voucher_Ref':f'{first_dt_plan.eve_id.agg_sp_pt_id.agg_sp_pt_id}/{first_dt_plan.eve_id.event_code}','Party_Name':first_dt_plan.eve_id.agg_sp_pt_id.name,'Address_1':first_dt_plan.eve_id.agg_sp_pt_id.address,'Address_2':first_dt_plan.eve_id.agg_sp_pt_id.address,'Address3/Phone_No.':str(first_dt_plan.eve_id.agg_sp_pt_id.google_address)+"/"+str(first_dt_plan.eve_id.agg_sp_pt_id.phone_no),'Stock_Item':first_dt_plan.eve_poc_id.sub_srv_id.recommomded_service,'Qty':1,'Rate':per_prof_amount,'Amount':per_prof_amount_is,'From_Date': str(datetime.datetime.strptime(professional_name_date[0], '%Y-%m-%d').strftime('%d-%m-%Y')),'To_Date': str(datetime.datetime.strptime(professional_name_date[0], '%Y-%m-%d').strftime('%d-%m-%Y')),'Name_OF_Professional':j.srv_prof_id.prof_fullname,'Narration':f'{first_dt_plan.eve_id.agg_sp_pt_id.agg_sp_pt_id}/{first_dt_plan.eve_id.event_code} -- Service Actual Cost - {first_dt_plan.eve_id.Total_cost+int(disc_amt)} - Discount Amount - {disc_amt} -- Service Final Cost -- {first_dt_plan.eve_id.final_amount}','UOM':'Service','Category':first_dt_plan.eve_poc_id.srv_id.service_title}#'service':i.srv_id.service_title,'recive_session_amount':recive_session_amount,'pending_session_amount':pending_session_amount,'convience_amount':convience_amount},'event_id':i.eve_id_id,
                                professional.append(professiona_proper_info1)
                                if j.is_convinance is True:
                                    if(int(j.convinance_charges)!=0):
                                        professiona_proper_info11={'Branch':hospital_code,'voucher_number':voucher_number,'Voucher_Type':str("Sales -"+str(hospital_code_sale)),'Voucher_Date':str(datetime.datetime.strptime(str(professional_name_date[0]), '%Y-%m-%d').strftime('%d-%m-%Y')),'Voucher_Ref':f'{first_dt_plan.eve_id.agg_sp_pt_id.agg_sp_pt_id}/{first_dt_plan.eve_id.event_code}','Party_Name':first_dt_plan.eve_id.agg_sp_pt_id.name,'Address_1':first_dt_plan.eve_id.agg_sp_pt_id.address,'Address_2':first_dt_plan.eve_id.agg_sp_pt_id.address,'Address3/Phone_No.':str(first_dt_plan.eve_id.agg_sp_pt_id.google_address)+"/"+str(first_dt_plan.eve_id.agg_sp_pt_id.phone_no),'Stock_Item':'Conveyance','Qty':1,'Rate':j.convinance_charges,'Amount':j.convinance_charges,'From_Date': str(datetime.datetime.strptime(professional_name_date[0], '%Y-%m-%d').strftime('%d-%m-%Y')),'To_Date': str(datetime.datetime.strptime(professional_name_date[0], '%Y-%m-%d').strftime('%d-%m-%Y')),'Name_OF_Professional':'Conveyance_Cost','Narration':f'{first_dt_plan.eve_id.agg_sp_pt_id.agg_sp_pt_id}/{first_dt_plan.eve_id.event_code} -- Service Actual Cost - {first_dt_plan.eve_id.Total_cost+int(disc_amt)} - Discount Amount - {disc_amt} -- Service Final Cost -- {first_dt_plan.eve_id.final_amount}','UOM':'day','Category':'Conveyance1'}#'service':i.srv_id.service_title,'recive_session_amount':recive_session_amount,'pending_session_amount':pending_session_amount,'convience_amount':convience_amount},'event_id':i.eve_id_id,
                                        professional.append(professiona_proper_info11) 

                        else:
                            len_count=1#len(professional_name_date)
                            new_start_date=professional_name_date[0]
                            session_count=1
                            for l in professional_name_date:
                                start_date_name=str(datetime.datetime.strptime(l, '%Y-%m-%d').date()+datetime.timedelta(days=1))
                                print(len_count,"new",len(professional_name_date))
                                if(len_count==len(professional_name_date)):
                                    per_prof_amount_is2=(per_prof_amount*session_count)#+(conv_first*session_count)
                                    professiona_proper_info2={'Branch':hospital_code,'voucher_number':voucher_number,'Voucher_Type':str("Sales -"+hospital_code_sale),'Voucher_Date':str(datetime.datetime.strptime(str(new_start_date), '%Y-%m-%d').strftime('%d-%m-%Y')),'Voucher_Ref':f'{first_dt_plan.eve_id.agg_sp_pt_id.agg_sp_pt_id}/{first_dt_plan.eve_id.event_code}','Party_Name':first_dt_plan.eve_id.agg_sp_pt_id.name,'Address_1':first_dt_plan.eve_id.agg_sp_pt_id.address,'Address_2':first_dt_plan.eve_id.agg_sp_pt_id.address,'Address3/Phone_No.':str(first_dt_plan.eve_id.agg_sp_pt_id.google_address)+"/"+str(first_dt_plan.eve_id.agg_sp_pt_id.phone_no),'Stock_Item':first_dt_plan.eve_poc_id.sub_srv_id.recommomded_service,'Qty':session_count,'Rate':per_prof_amount,'Amount':per_prof_amount_is2,'From_Date': str(datetime.datetime.strptime(new_start_date, '%Y-%m-%d').strftime('%d-%m-%Y')),'To_Date': str(datetime.datetime.strptime(professional_name_date[-1], '%Y-%m-%d').strftime('%d-%m-%Y')),'Name_OF_Professional':j.srv_prof_id.prof_fullname,'Narration':f'{first_dt_plan.eve_id.agg_sp_pt_id.agg_sp_pt_id}/{first_dt_plan.eve_id.event_code} -- Service Actual Cost - {first_dt_plan.eve_id.Total_cost+disc_amt} - Discount Amount - {disc_amt} -- Service Final Cost -- {first_dt_plan.eve_id.final_amount}','UOM':'Service','Category':first_dt_plan.eve_poc_id.srv_id.service_title}#'service':i.srv_id.service_title,'recive_session_amount':recive_session_amount,'pending_session_amount':pending_session_amount,'convience_amount':convience_amount},'event_id':i.eve_id_id,
                                    professional.append(professiona_proper_info2)
                                    if j.is_convinance is True:
                                        if(int(j.convinance_charges)!=0):
                                            professiona_proper_info22={'Branch':hospital_code,'voucher_number':voucher_number,'Voucher_Type':str("Sales -"+str(hospital_code_sale)),'Voucher_Date':str(datetime.datetime.strptime(str(new_start_date), '%Y-%m-%d').strftime('%d-%m-%Y')),'Voucher_Ref':f'{first_dt_plan.eve_id.agg_sp_pt_id.agg_sp_pt_id}/{first_dt_plan.eve_id.event_code}','Party_Name':first_dt_plan.eve_id.agg_sp_pt_id.name,'Address_1':first_dt_plan.eve_id.agg_sp_pt_id.address,'Address_2':first_dt_plan.eve_id.agg_sp_pt_id.address,'Address3/Phone_No.':str(first_dt_plan.eve_id.agg_sp_pt_id.google_address)+"/"+str(first_dt_plan.eve_id.agg_sp_pt_id.phone_no),'Stock_Item':'Conveyance','Qty':session_count,'Rate':j.convinance_charges,'Amount':int(j.convinance_charges)*session_count,'From_Date': str(datetime.datetime.strptime(new_start_date, '%Y-%m-%d').strftime('%d-%m-%Y')),'To_Date': str(datetime.datetime.strptime(professional_name_date[-1], '%Y-%m-%d').strftime('%d-%m-%Y')),'Name_OF_Professional':'Conveyance_Cost','Narration':f'{first_dt_plan.eve_id.agg_sp_pt_id.agg_sp_pt_id}/{first_dt_plan.eve_id.event_code} -- Service Actual Cost - {first_dt_plan.eve_id.Total_cost+int(disc_amt)} - Discount Amount - {disc_amt} -- Service Final Cost -- {first_dt_plan.eve_id.final_amount}','UOM':'day','Category':'Conveyance1'}#'service':i.srv_id.service_title,'recive_session_amount':recive_session_amount,'pending_session_amount':pending_session_amount,'convience_amount':convience_amount},'event_id':i.eve_id_id,
                                            professional.append(professiona_proper_info22) 



                                elif(start_date_name==professional_name_date[len_count]):
                                    session_count+=1
                                else:
                                    per_prof_amount_is3=(per_prof_amount*session_count)#+(conv_first*session_count)
                                    professiona_proper_info3={'Branch':hospital_code,'voucher_number':voucher_number,'Voucher_Type':str("Sales -"+hospital_code_sale),'Voucher_Date':str(datetime.datetime.strptime(str(new_start_date), '%Y-%m-%d').strftime('%d-%m-%Y')),'Voucher_Ref':f'{first_dt_plan.eve_id.agg_sp_pt_id.agg_sp_pt_id}/{first_dt_plan.eve_id.event_code}','Party_Name':first_dt_plan.eve_id.agg_sp_pt_id.name,'Address_1':first_dt_plan.eve_id.agg_sp_pt_id.address,'Address_2':first_dt_plan.eve_id.agg_sp_pt_id.address,'Address3/Phone_No.':str(first_dt_plan.eve_id.agg_sp_pt_id.google_address)+"/"+str(first_dt_plan.eve_id.agg_sp_pt_id.phone_no),'Stock_Item':first_dt_plan.eve_poc_id.sub_srv_id.recommomded_service,'Qty':session_count,'Rate':per_prof_amount,'Amount':per_prof_amount_is3,'From_Date': str(datetime.datetime.strptime(new_start_date, '%Y-%m-%d').strftime('%d-%m-%Y')),'To_Date':str(datetime.datetime.strptime(l, '%Y-%m-%d').strftime('%d-%m-%Y')),'Name_OF_Professional':j.srv_prof_id.prof_fullname,'Narration':f'{first_dt_plan.eve_id.agg_sp_pt_id.agg_sp_pt_id}/{first_dt_plan.eve_id.event_code} -- Service Actual Cost - {first_dt_plan.eve_id.Total_cost+int(disc_amt)} - Discount Amount - {disc_amt} -- Service Final Cost -- {first_dt_plan.eve_id.final_amount}','UOM':'Service','Category':first_dt_plan.eve_poc_id.srv_id.service_title}#'service':i.srv_id.service_title,'recive_session_amount':recive_session_amount,'pending_session_amount':pending_session_amount,'convience_amount':convience_amount},'event_id':i.eve_id_id,
                                    professional.append(professiona_proper_info3)
                                    if j.is_convinance is True:
                                        if(int(j.convinance_charges)!=0):
                                            professiona_proper_info33={'Branch':hospital_code,'voucher_number':voucher_number,'Voucher_Type':str("Sales -"+str(hospital_code_sale)),'Voucher_Date':str(datetime.datetime.strptime(str(new_start_date), '%Y-%m-%d').strftime('%d-%m-%Y')),'Voucher_Ref':f'{first_dt_plan.eve_id.agg_sp_pt_id.agg_sp_pt_id}/{first_dt_plan.eve_id.event_code}','Party_Name':first_dt_plan.eve_id.agg_sp_pt_id.name,'Address_1':first_dt_plan.eve_id.agg_sp_pt_id.address,'Address_2':first_dt_plan.eve_id.agg_sp_pt_id.address,'Address3/Phone_No.':str(first_dt_plan.eve_id.agg_sp_pt_id.google_address)+"/"+str(first_dt_plan.eve_id.agg_sp_pt_id.phone_no),'Stock_Item':'Conveyance','Qty':session_count,'Rate':j.convinance_charges,'Amount':int(j.convinance_charges)*session_count,'From_Date': str(datetime.datetime.strptime(new_start_date, '%Y-%m-%d').strftime('%d-%m-%Y')),'To_Date': str(datetime.datetime.strptime(l, '%Y-%m-%d').strftime('%d-%m-%Y')),'Name_OF_Professional':'Conveyance_Cost','Narration':f'{first_dt_plan.eve_id.agg_sp_pt_id.agg_sp_pt_id}/{first_dt_plan.eve_id.event_code} -- Service Actual Cost - {first_dt_plan.eve_id.Total_cost+int(disc_amt)} - Discount Amount - {disc_amt} -- Service Final Cost -- {first_dt_plan.eve_id.final_amount}','UOM':'day','Category':'Conveyance1'}#'service':i.srv_id.service_title,'recive_session_amount':recive_session_amount,'pending_session_amount':pending_session_amount,'convience_amount':convience_amount},'event_id':i.eve_id_id,
                                            professional.append(professiona_proper_info33)

                                    new_start_date=professional_name_date[len_count]
                                    session_count=1
                                len_count+=1
                        professional_list.append(str(j.srv_prof_id.prof_fullname))
                sessions+=1
        return Response({"data":professional})
#---------------------------------------------------excel api started--------------------------------------------------



from django.http import StreamingHttpResponse
import csv
class Accout_invoice_excel_api(APIView):    
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    def get(self,request,find_id,start_dat=None,end_dat=None,hospt_id=None):
        professional_list=[]
        professional=[]
        data=[]
        if(find_id==1):
            current_year = datetime.datetime.now().date()
            previous_year = current_year.replace(month=1,day=1)
            event_plan=agg_hhc_event_plan_of_care.objects.filter(start_date__gte=previous_year,status=1)# 1 year data
        elif(find_id==2):#2 for date_wise
            if(hospt_id!=None):
                event_plan=agg_hhc_event_plan_of_care.objects.filter(start_date__gte=start_dat,start_date__lte=end_dat,hosp_id=hospt_id,status=1)# 1 year data
            else:
                event_plan=agg_hhc_event_plan_of_care.objects.filter(start_date__gte=start_dat,start_date__lte=end_dat,status=1)# 1 year data
        else:
            event_plan=None
        for i in event_plan:
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>New logic imported start>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                #just to store useless data start
            try:
                hospital_code=i.eve_id.agg_sp_pt_id.preferred_hosp_id.hospital_short_code
                hospital_code_sale=hospital_code
                voucher_number=str(hospital_code+"/"+serializer.financial_year(i.start_date)+"/"+str(i.eve_id.Invoice_ID))#i.start_date
            except:
                hospital_code=None
                hospital_code_sale=" "
                voucher_number=None
                #just to store useless data ends
            detaile_event_plan_of_care=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id,status=1)
            try:
                per_prof_amount=int(i.eve_id.Total_cost)//detaile_event_plan_of_care.filter().count()
            except:
                per_prof_amount=0
            sessions=0
            for j in detaile_event_plan_of_care:
                professional_name_date=[]
                if j.srv_prof_id is not None:
                    if(str(j.srv_prof_id.prof_fullname) in professional_list):
                        pass
                    else:
                        get_dtl_data=detaile_event_plan_of_care.filter(eve_id=i.eve_id,srv_prof_id=j.srv_prof_id,status=1)
#----------------------------all dates is appended to the list -------------------------------------
                        for k in get_dtl_data:
                            professional_name_date.append(str(k.actual_StartDate_Time))
#----------------------------all dates is appended to the list end -------------------------------------
                        if len(professional_name_date)==1:
                                per_prof_amount_is=(per_prof_amount*1)#+(conv_first*1) 
                                final_dict1={'Branch':hospital_code,'voucher_number':voucher_number,'Voucher_Type':str("Sales -"+hospital_code_sale),'Voucher_Date':str(i.start_date),'Voucher_Ref':f'{j.eve_id.agg_sp_pt_id.agg_sp_pt_id}/{j.eve_id.event_code}','Party_Name':i.eve_id.agg_sp_pt_id.name,'Address_1':i.eve_id.agg_sp_pt_id.address,'Address_2':i.eve_id.agg_sp_pt_id.address,'Address3/Phone_No.':str(i.eve_id.agg_sp_pt_id.google_address)+"/"+str(i.eve_id.agg_sp_pt_id.phone_no),'Stock_Item':i.sub_srv_id.recommomded_service,'Qty':1,'Rate':per_prof_amount,'Amount':per_prof_amount_is,'From_Date':professional_name_date[0],'To_Date':professional_name_date[0],'Name_OF_Professional':j.srv_prof_id.prof_fullname,'Narration':'narration id','UOM':'Service','Category':i.srv_id.service_title}#'service':i.srv_id.service_title,'recive_session_amount':recive_session_amount,'pending_session_amount':pending_session_amount,'convience_amount':convience_amount},'event_id':i.eve_id_id,
                                data.append(final_dict1)
                                if j.is_convinance is True:
                                    final_dict11={'Branch':hospital_code,'voucher_number':voucher_number,'Voucher_Type':str("Sales -"+hospital_code_sale),'Voucher_Date':str(i.start_date),'Voucher_Ref':f'{j.eve_id.agg_sp_pt_id.agg_sp_pt_id}/{j.eve_id.event_code}','Party_Name':i.eve_id.agg_sp_pt_id.name,'Address_1':i.eve_id.agg_sp_pt_id.address,'Address_2':i.eve_id.agg_sp_pt_id.address,'Address3/Phone_No.':str(i.eve_id.agg_sp_pt_id.google_address)+"/"+str(i.eve_id.agg_sp_pt_id.phone_no),'Stock_Item':i.sub_srv_id.recommomded_service,'Qty':1,'Rate':j.convinance_charges,'Amount':int(j.convinance_charges)*1,'From_Date':professional_name_date[0],'To_Date':professional_name_date[0],'Name_OF_Professional':'Conveyance_Cost','Narration':'narration id','UOM':'Service','Category':'Conveyance'}#'service':i.srv_id.service_title,'recive_session_amount':recive_session_amount,'pending_session_amount':pending_session_amount,'convience_amount':convience_amount},'event_id':i.eve_id_id,
                                    data.append(final_dict11)
                        else:
                            len_count=1#len(professional_name_date)
                            new_start_date=professional_name_date[0]
                            session_count=1
                            for l in professional_name_date:
                                start_date_name=str(datetime.datetime.strptime(l, '%Y-%m-%d').date()+timedelta(days=1))
                                if(len_count==len(professional_name_date)):
                                    per_prof_amount_is2=(per_prof_amount*session_count)#+(conv_first*session_count)
                                    final_dict2={'Branch':hospital_code,'voucher_number':voucher_number,'Voucher_Type':str("Sales -"+hospital_code_sale),'Voucher_Date':str(i.start_date),'Voucher_Ref':f'{j.eve_id.agg_sp_pt_id.agg_sp_pt_id}/{j.eve_id.event_code}','Party_Name':i.eve_id.agg_sp_pt_id.name,'Address_1':i.eve_id.agg_sp_pt_id.address,'Address_2':i.eve_id.agg_sp_pt_id.address,'Address3/Phone_No.':str(i.eve_id.agg_sp_pt_id.google_address)+"/"+str(i.eve_id.agg_sp_pt_id.phone_no),'Stock_Item':i.sub_srv_id.recommomded_service,'Qty':session_count,'Rate':per_prof_amount,'Amount':per_prof_amount_is2,'From_Date':new_start_date,'To_Date':professional_name_date[-1],'Name_OF_Professional':j.srv_prof_id.prof_fullname,'Narration':'narration id','UOM':'Service','Category':i.srv_id.service_title}#'service':i.srv_id.service_title,'recive_session_amount':recive_session_amount,'pending_session_amount':pending_session_amount,'convience_amount':convience_amount},'event_id':i.eve_id_id,
                                    data.append(final_dict2)
                                    if j.is_convinance is True:
                                        final_dict22={'Branch':hospital_code,'voucher_number':voucher_number,'Voucher_Type':str("Sales -"+hospital_code_sale),'Voucher_Date':str(i.start_date),'Voucher_Ref':f'{j.eve_id.agg_sp_pt_id.agg_sp_pt_id}/{j.eve_id.event_code}','Party_Name':i.eve_id.agg_sp_pt_id.name,'Address_1':i.eve_id.agg_sp_pt_id.address,'Address_2':i.eve_id.agg_sp_pt_id.address,'Address3/Phone_No.':str(i.eve_id.agg_sp_pt_id.google_address)+"/"+str(i.eve_id.agg_sp_pt_id.phone_no),'Stock_Item':i.sub_srv_id.recommomded_service,'Qty':session_count,'Rate':j.convinance_charges,'Amount':int(j.convinance_charges)*session_count,'From_Date':professional_name_date[0],'To_Date':professional_name_date[0],'Name_OF_Professional':'Conveyance_Cost','Narration':'narration id','UOM':'Service','Category':'Conveyance'}#'service':i.srv_id.service_title,'recive_session_amount':recive_session_amount,'pending_session_amount':pending_session_amount,'convience_amount':convience_amount},'event_id':i.eve_id_id,
                                        data.append(final_dict22)
                                elif(start_date_name==professional_name_date[len_count]):
                                    session_count+=1
                                else:
                                    per_prof_amount_is3=(per_prof_amount*session_count)#+(conv_first*session_count)
                                    final_dict3={'Branch':hospital_code,'voucher_number':voucher_number,'Voucher_Type':str("Sales -"+hospital_code_sale),'Voucher_Date':str(i.start_date),'Voucher_Ref':f'{j.eve_id.agg_sp_pt_id.agg_sp_pt_id}/{j.eve_id.event_code}','Party_Name':i.eve_id.agg_sp_pt_id.name,'Address_1':i.eve_id.agg_sp_pt_id.address,'Address_2':i.eve_id.agg_sp_pt_id.address,'Address3/Phone_No.':str(i.eve_id.agg_sp_pt_id.google_address)+"/"+str(i.eve_id.agg_sp_pt_id.phone_no),'Stock_Item':i.sub_srv_id.recommomded_service,'Qty':session_count,'Rate':per_prof_amount,'Amount':per_prof_amount_is3,'From_Date':new_start_date,'To_Date':l,'Name_OF_Professional':j.srv_prof_id.prof_fullname,'Narration':'narration id','UOM':'Service','Category':i.srv_id.service_title}#'service':i.srv_id.service_title,'recive_session_amount':recive_session_amount,'pending_session_amount':pending_session_amount,'convience_amount':convience_amount},'event_id':i.eve_id_id,
                                    data.append(final_dict3)
                                    if j.is_convinance is True:
                                        final_dict33={'Branch':hospital_code,'voucher_number':voucher_number,'Voucher_Type':str("Sales -"+hospital_code_sale),'Voucher_Date':str(i.start_date),'Voucher_Ref':f'{j.eve_id.agg_sp_pt_id.agg_sp_pt_id}/{j.eve_id.event_code}','Party_Name':i.eve_id.agg_sp_pt_id.name,'Address_1':i.eve_id.agg_sp_pt_id.address,'Address_2':i.eve_id.agg_sp_pt_id.address,'Address3/Phone_No.':str(i.eve_id.agg_sp_pt_id.google_address)+"/"+str(i.eve_id.agg_sp_pt_id.phone_no),'Stock_Item':i.sub_srv_id.recommomded_service,'Qty':session_count,'Rate':j.convinance_charges,'Amount':int(j.convinance_charges)*session_count,'From_Date':professional_name_date[0],'To_Date':professional_name_date[0],'Name_OF_Professional':'Conveyance_Cost','Narration':'narration id','UOM':'Service','Category':'Conveyance'}#'service':i.srv_id.service_title,'recive_session_amount':recive_session_amount,'pending_session_amount':pending_session_amount,'convience_amount':convience_amount},'event_id':i.eve_id_id,
                                        data.append(final_dict33)
                                    new_start_date=professional_name_date[len_count]
                                    session_count=1
                                len_count+=1
                        professional_list.append(str(j.srv_prof_id.prof_fullname))
                sessions+=1
        csv_data = self.serialize_to_csv(data)
        # Prepare response
        response = StreamingHttpResponse(csv_data, content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="Accout_invoice.csv"'
        return response
        # return Response(day_print.data) 

    def serialize_to_csv(self, data):
        header = ['Branch', 'voucher_number','Voucher_Type','Voucher_Date','Voucher_Ref','Party_Name','Address_1','Address_2','Address3/Phone_No.','Stock_Item','Qty','Rate','Amount','From_Date','To_Date','Name_OF_Professional','Narration','UOM','Category']  # Add other fields here #  CSV file header name of table fields names 
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
    # return Response({"data":data})
#------------------------------Account_invoice_excel_api in excel-------------------------ends----------------------------------------------------
# class Manage_Receipt(APIView):
#     def get(self, request):
#         record_list=[]
#         hosp_id=request.query_params.get('hosp_id')
#         start_date = datetime.datetime.strptime(request.query_params.get('start_date'), '%Y-%m-%d').date()
#         # end_date = datetime.datetime.strptime(request.query_params.get('end_date'), '%Y-%m-%d').date()+timedelta(days=1)
#         end_date = datetime.datetime.strptime(request.query_params.get('end_date'), '%Y-%m-%d').date()
#         # if hosp_id:
#         #     event_plan_of_care = list(agg_hhc_event_plan_of_care.objects.filter(status=1, hosp_id=hosp_id, eve_id__srv_cancelled=2).values_list('eve_id', flat=True))
#         #     payment_entries = agg_hhc_payment_details.objects.filter(Q(payment_status=2) | Q(payment_status=3),added_date__range=(start_date, end_date), eve_id__in=event_plan_of_care, status=1,overall_status= "SUCCESS")
#         # else:
#         #     payment_entries=agg_hhc_payment_details.objects.filter(Q(payment_status=2) | Q(payment_status=3),added_date__range=(start_date, end_date),status=1,overall_status= "SUCCESS")

#         if hosp_id:
#             event_plan_of_care = list(agg_hhc_event_plan_of_care.objects.filter(status=1, hosp_id=hosp_id, eve_id__srv_cancelled=2).values_list('eve_id', flat=True))
#             # payment_entries = agg_hhc_payment_details.objects.filter(Q(payment_status=2) | Q(payment_status=3),added_date__range=(start_date, end_date), eve_id__in=event_plan_of_care, status=1,overall_status= "SUCCESS")
#             payment_entries = agg_hhc_payment_details.objects.filter(Q(payment_status=2) | Q(payment_status=3),payment_to_desk_date__range=(start_date, end_date), eve_id__in=event_plan_of_care, status=1,overall_status= "SUCCESS")
#         else:
#             payment_entries=agg_hhc_payment_details.objects.filter(Q(payment_status=2) | Q(payment_status=3),payment_to_desk_date__range=(start_date, end_date),status=1,overall_status= "SUCCESS")
#         for i in payment_entries:
#             event_plan=agg_hhc_event_plan_of_care.objects.filter(eve_id=i.eve_id,status=1).last()
#             detail=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id,status=1).first()
#             try:
#                 hospital_code=event_plan.hosp_id.hospital_short_code if event_plan.hosp_id.hospital_short_code else None 
#                 next_year = str(serializer.financial_year(i.added_date.date()))
#                 invoice = i.eve_id.Invoice_ID
#                 Branch= f'{hospital_code}/{next_year}/{invoice}'
#                 recept_no= f'{hospital_code}/{next_year}/{i.receipt_no}'
#             except:
#                 Branch= None
#                 recept_no=None
#             try:
#                 # Payment_Receipt_Date = str(datetime.datetime.strptime(str(i.added_date), '%Y-%m-%d %H:%M:%S.%f').strftime('%d-%m-%Y'))
#                 Payment_Receipt_Date = str(datetime.datetime.strptime(str(i.payment_to_desk_date), '%Y-%m-%d').strftime('%d-%m-%Y'))
#             except:
#                 Payment_Receipt_Date= None
#             if i.eve_id.discount_type==1:
#                 if not i.eve_id.discount_value:
#                     discount_value=1
#                 else:discount_value=i.eve_id.discount_value
#                 disc_amt=round((float(i.eve_id.Total_cost)/100)*discount_value)
#             elif i.eve_id.discount_type==2:
#                 disc_amt=i.eve_id.discount_value
#             else: 
#                 disc_amt=0
#             try:
#                 professional_name=agg_hhc_service_professionals.objects.filter(srv_prof_id=detail.srv_prof_id.srv_prof_id).last()
#                 professional_name=professional_name.prof_fullname
#             except :
#                 professional_name=""
#             # try:
#             #     pay_done_date=i.transaction_status
#             #     pay_done_date=pay_done_date['data']['payment']['payment_time']
#             #     pay_done_date = datetime.datetime.strptime(pay_done_date, '%Y-%m-%dT%H:%M:%S%z')
#             #     pay_done_date = pay_done_date.strftime('%d-%m-%Y')
#             #     order_id=str(i.order_id)[9:]
#             # except:
#             if not disc_amt:
#                 disc_amt=0
#             pay_done_date=Payment_Receipt_Date
#             if i.mode==1:
#                 order_id="Cash"
#                 Bank_or_cash="Cash - Services -"+hospital_code 
#             else:   
#                 order_id=i.utr
#                 Bank_or_cash="HDFC BANK C.C A/C - 50200010027418"
#             prof_record={'pay_dt_id':i.pay_dt_id, 'Branch':hospital_code,'Payment_Receipt_No':recept_no,'Payment_Receipt_Date':Payment_Receipt_Date,'Bill_No':Branch, 'Customer_Name':i.eve_id.agg_sp_pt_id.name, 'Email_ID':i.eve_id.agg_sp_pt_id.patient_email_id, 'Amount':i.amount_paid, 'Professional':professional_name, 'Bank_or_cash':Bank_or_cash, 'Check_No':order_id, 'Cheque_Date':pay_done_date, 'Payment_Bank_Name':'', 'Narration':f'{i.eve_id.agg_sp_pt_id.agg_sp_pt_id}/{i.eve_id.event_code} -- Service Actual Cost - {float(i.eve_id.Total_cost)+float(disc_amt)} - Discount Amount - {disc_amt} -- Service Final Cost -- {i.eve_id.final_amount}'}
#             record_list.append(prof_record)
#         return Response(record_list)#{'data':record_list}


# from collections import defaultdict

# class Manage_Receipt(APIView):
#     def get(self, request):
#         record_list = []
#         total_convenience = []
#         eve_convenience_totals = defaultdict(float)

#         hosp_id = request.query_params.get('hosp_id')
#         start_date = datetime.datetime.strptime(request.query_params.get('start_date'), '%Y-%m-%d').date()
#         end_date = datetime.datetime.strptime(request.query_params.get('end_date'), '%Y-%m-%d').date()

#         if hosp_id:
#             event_plan_of_care = list(agg_hhc_event_plan_of_care.objects.filter(
#                 status=1, hosp_id=hosp_id, eve_id__srv_cancelled=2).values_list('eve_id', flat=True))
#             payment_entries = agg_hhc_payment_details.objects.filter(
#                 Q(payment_status=2) | Q(payment_status=3),
#                 payment_to_desk_date__range=(start_date, end_date),
#                 eve_id__in=event_plan_of_care,
#                 status=1, overall_status="SUCCESS"
#             )
#         else:
#             payment_entries = agg_hhc_payment_details.objects.filter(
#                 Q(payment_status=2) | Q(payment_status=3),
#                 payment_to_desk_date__range=(start_date, end_date),
#                 status=1, overall_status="SUCCESS"
#             )

#         for i in payment_entries:
#             event_plan = agg_hhc_event_plan_of_care.objects.filter(eve_id=i.eve_id, status=1).last()
#             detail = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id, status=1).first()

#             convinance_charges = detail.convinance_charges if detail else 0
#             is_convinance = detail.is_convinance if detail else False

#             try:
#                 hospital_code = event_plan.hosp_id.hospital_short_code if event_plan.hosp_id.hospital_short_code else None
#                 next_year = str(serializer.financial_year(i.added_date.date()))
#                 invoice = i.eve_id.Invoice_ID
#                 Branch = f'{hospital_code}/{next_year}/{invoice}'
#                 recept_no = f'{hospital_code}/{next_year}/{i.receipt_no}'
#             except:
#                 Branch = None
#                 recept_no = None

#             try:
#                 Payment_Receipt_Date = str(datetime.datetime.strptime(
#                     str(i.payment_to_desk_date), '%Y-%m-%d').strftime('%d-%m-%Y'))
#             except:
#                 Payment_Receipt_Date = None

#             if i.eve_id.discount_type == 1:
#                 if not i.eve_id.discount_value:
#                     discount_value = 1
#                 else:
#                     discount_value = i.eve_id.discount_value
#                 disc_amt = round((float(i.eve_id.Total_cost) / 100) * discount_value)
#             elif i.eve_id.discount_type == 2:
#                 disc_amt = i.eve_id.discount_value
#             else:
#                 disc_amt = 0

#             try:
#                 professional_name = agg_hhc_service_professionals.objects.filter(
#                     srv_prof_id=detail.srv_prof_id.srv_prof_id).last()
#                 professional_name = professional_name.prof_fullname
#             except:
#                 professional_name = ""

#             if not disc_amt:
#                 disc_amt = 0

#             pay_done_date = Payment_Receipt_Date
#             if i.mode == 1:
#                 order_id = "Cash"
#                 Bank_or_cash = "Cash - Services -" + hospital_code
#             else:
#                 order_id = i.utr
#                 Bank_or_cash = "HDFC BANK C.C A/C - 50200010027418"

#             prof_record = {
#                 'pay_dt_id': i.pay_dt_id,
#                 'Branch': hospital_code,
#                 'Payment_Receipt_No': recept_no,
#                 'Payment_Receipt_Date': Payment_Receipt_Date,
#                 'Bill_No': Branch,
#                 'Customer_Name': i.eve_id.agg_sp_pt_id.name,
#                 'Email_ID': i.eve_id.agg_sp_pt_id.patient_email_id,
#                 'Amount': i.amount_paid,
#                 'Professional': professional_name,
#                 'Bank_or_cash': Bank_or_cash,
#                 'Check_No': order_id,
#                 'Cheque_Date': pay_done_date,
#                 'Payment_Bank_Name': '',
#                 'Narration': f'{i.eve_id.agg_sp_pt_id.agg_sp_pt_id}/{i.eve_id.event_code} -- Service Actual Cost - {float(i.eve_id.Total_cost) + float(disc_amt)} - Discount Amount - {disc_amt} -- Service Final Cost -- {i.eve_id.final_amount}',
#                 'Convinance_Charges': convinance_charges, 
#                 'Is_Convinance': is_convinance, 
#                 'Eve_id': i.eve_id.eve_id  
#             }
#             record_list.append(prof_record)


#             if is_convinance:
#                 convenience_record = prof_record.copy()
#                 convenience_record['total_conv_amt'] = eve_convenience_totals[i.eve_id.eve_id] + convinance_charges
#                 total_convenience.append(convenience_record)

#             eve_convenience_totals[i.eve_id.eve_id] += convinance_charges

#         return Response({"data": record_list, "total_convenience": total_convenience})


class Manage_Receipt(APIView):
    def get(self, request):
        record_list = []
        hosp_id = request.query_params.get('hosp_id')
        start_date = datetime.datetime.strptime(request.query_params.get('start_date'), '%Y-%m-%d').date()
        end_date = datetime.datetime.strptime(request.query_params.get('end_date'), '%Y-%m-%d').date()

        if hosp_id:
            event_plan_of_care = list(agg_hhc_event_plan_of_care.objects.filter(
                status=1, hosp_id=hosp_id, eve_id__srv_cancelled=2).values_list('eve_id', flat=True))
            payment_entries = agg_hhc_payment_details.objects.filter(
                Q(payment_status=2) | Q(payment_status=3),
                payment_to_desk_date__range=(start_date, end_date),
                eve_id__in=event_plan_of_care,
                status=1, overall_status="SUCCESS"
            )
        else:
            payment_entries = agg_hhc_payment_details.objects.filter(
                Q(payment_status=2) | Q(payment_status=3),
                payment_to_desk_date__range=(start_date, end_date),
                status=1, overall_status="SUCCESS"
            )

        for i in payment_entries:
            event_plan = agg_hhc_event_plan_of_care.objects.filter(eve_id=i.eve_id, status=1).last()
            detail = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id, status=1).first()

            convinance_charges = detail.convinance_charges if detail else 0
            is_convinance = detail.is_convinance if detail else False

            try:
                hospital_code = event_plan.hosp_id.hospital_short_code if event_plan.hosp_id.hospital_short_code else None
                next_year = str(serializer.financial_year(i.added_date.date()))
                invoice = i.eve_id.Invoice_ID
                Branch = f'{hospital_code}/{next_year}/{invoice}'
                recept_no = f'{hospital_code}/{next_year}/{i.receipt_no}'
            except:
                Branch = None
                recept_no = None

            try:
                Payment_Receipt_Date = str(datetime.datetime.strptime(
                    str(i.payment_to_desk_date), '%Y-%m-%d').strftime('%d-%m-%Y'))
            except:
                Payment_Receipt_Date = None

            if i.eve_id.discount_type == 1:
                if not i.eve_id.discount_value:
                    discount_value = 1
                else:
                    discount_value = i.eve_id.discount_value
                disc_amt = round((float(i.eve_id.Total_cost) / 100) * discount_value)
            elif i.eve_id.discount_type == 2:
                disc_amt = i.eve_id.discount_value
            else:
                disc_amt = 0

            try:
                professional_name = agg_hhc_service_professionals.objects.filter(
                    srv_prof_id=detail.srv_prof_id.srv_prof_id).last()
                professional_name = professional_name.prof_fullname
            except:
                professional_name = ""

            if not disc_amt:
                disc_amt = 0

            pay_done_date = Payment_Receipt_Date
            if i.mode == 1:
                order_id = "Cash"
                Bank_or_cash = "Cash - Services -" + hospital_code
            else:
                order_id = i.utr
                Bank_or_cash = "HDFC BANK C.C A/C - 50200010027418"
            

            nn=0
                                
            ddllj=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id, status=1)
            if ddllj:
                for j in ddllj:
                    if j.convinance_charges is not None:
                        nn+=int(j.convinance_charges)
                            
            prof_record = {
                'pay_dt_id': i.pay_dt_id,
                'Branch': hospital_code,
                'Payment_Receipt_No': recept_no,
                'Payment_Receipt_Date': Payment_Receipt_Date,
                'Bill_No': Branch,
                'Customer_Name': i.eve_id.agg_sp_pt_id.name,
                'Email_ID': i.eve_id.agg_sp_pt_id.patient_email_id,
                # 'Amount': i.amount_paid,
                'Amount': i.amount_paid - nn,
                'Professional': professional_name,
                'Bank_or_cash': Bank_or_cash,
                'Check_No': order_id,
                'Cheque_Date': pay_done_date,
                'Payment_Bank_Name': '',
                'Narration': f'{i.eve_id.agg_sp_pt_id.agg_sp_pt_id}/{i.eve_id.event_code} -- Service Actual Cost - {float(i.eve_id.Total_cost) + float(disc_amt)} - Discount Amount - {disc_amt} -- Service Final Cost -- {i.eve_id.final_amount}',
                'Convinance_Charges': convinance_charges, 
                'Is_Convinance': is_convinance, 
                'Eve_id': i.eve_id.eve_id  
            }
            record_list.append(prof_record)

            if convinance_charges is not None and convinance_charges != 0:
                # nn=0
                                
                # ddllj=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id, status=1)
                # if ddllj:
                #     for j in ddllj:
                #         if j.convinance_charges is not None:
                #             nn+=int(j.convinance_charges)
                        
                    adjusted_amount = i.amount_paid - nn
                            
                    profffff_record = {
                    'pay_dt_id': i.pay_dt_id,
                    'Branch': hospital_code,
                    'Payment_Receipt_No': recept_no,
                    'Payment_Receipt_Date': Payment_Receipt_Date,
                    'Bill_No': Branch,
                    'Customer_Name': i.eve_id.agg_sp_pt_id.name,
                    'Email_ID': i.eve_id.agg_sp_pt_id.patient_email_id,
                    'Amount': nn,
                    'Professional': "Conveyance_Cost",
                    'Bank_or_cash': Bank_or_cash,
                    'Check_No': order_id,
                    'Cheque_Date': pay_done_date,
                    'Payment_Bank_Name': '',
                    'Narration': f'{i.eve_id.agg_sp_pt_id.agg_sp_pt_id}/{i.eve_id.event_code} -- Service Actual Cost - {float(i.eve_id.Total_cost) + float(disc_amt)} - Discount Amount - {disc_amt} -- Service Final Cost -- {i.eve_id.final_amount}',
                    'Convinance_Charges': convinance_charges, 
                    'Is_Convinance': is_convinance, 
                    'Eve_id': i.eve_id.eve_id  
                        }
                    record_list.append(profffff_record)
            

        return Response(record_list)






   

class job_closure_report_ptn_wise(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, start_date_str, end_date_str):

        start_date = datetime.datetime.strptime(start_date_str, '%Y-%m-%d').date()
        end_date = datetime.datetime.strptime(end_date_str, '%Y-%m-%d').date()
        
        eve_poc = agg_hhc_event_plan_of_care.objects.filter(start_date__range=(start_date, end_date),status=1)
        eve_poc_eve_ids = eve_poc.values_list('eve_id', flat=True) 

        print("eve_poc", eve_poc[0].srv_id)
        
        # eve_data = agg_hhc_events.objects.filter(Q(event_status=2) | Q(event_status=3), eve_id__in=eve_poc_eve_ids, status=1)

        data = []
        for p in eve_poc:
            eve_data = agg_hhc_events.objects.filter(Q(event_status=2) | Q(event_status=3), eve_id=p.eve_id.eve_id, status=1)

            for i in eve_data:
                sesson_count = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id, status=1).count()
                close_sesson = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id, status=1, Session_jobclosure_status=1).count()
                pending_sesson = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id, status=1, Session_jobclosure_status=2).count()

                data.append({
                    "ptn_name": i.agg_sp_pt_id.name,
                    "mobile_no": i.agg_sp_pt_id.phone_no,
                    "events_id": i.eve_id,
                    "events_code": i.event_code,
                    "caller_number":i.caller_id.phone,
                    "service_name" : p.srv_id.service_title,
                    "sub_srv_name": p.sub_srv_id.recommomded_service,
                    "total_session": sesson_count,
                    "closed_session": close_sesson,
                    "pending_session": pending_sesson
                })
        return Response(data)
    





class job_closure_report_prof_wise(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, start_date_str, end_date_str):

        start_date = datetime.datetime.strptime(start_date_str, '%Y-%m-%d').date()
        end_date = datetime.datetime.strptime(end_date_str, '%Y-%m-%d').date()
        
        get_all_session = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__range=(start_date,end_date), status = 1)
        prof_list = get_all_session.values_list('srv_prof_id', flat=True)
        prof_ids = list(set(prof_list))
        prof_ids = [prof_id for prof_id in prof_ids if prof_id is not None]

        Prof_wise_total_services = []
        for prof_id in prof_ids:
            print(prof_id)
            prof_data = agg_hhc_service_professionals.objects.get(srv_prof_id = prof_id)
            clg_data = agg_com_colleague.objects.get(clg_ref_id=prof_data.clg_ref_id)
            prof_dtl_data = get_all_session.filter(srv_prof_id=prof_id)
            eve_ids = list(set(prof_dtl_data.values_list('eve_id', flat=True)))


            prof_wise_data = {
                'prof_id':prof_data.srv_prof_id,
                'Prof_name':prof_data.prof_fullname,
                'prof_number':clg_data.clg_Work_phone_number,
                'Total_services':len(eve_ids),
                'total_session':prof_dtl_data.count(),
                'closed_session':prof_dtl_data.filter(Session_jobclosure_status=1).count() or 0,
                'Pending_session':prof_dtl_data.filter(Session_jobclosure_status=2).count() or 0
            }

            Prof_wise_total_services.append(prof_wise_data)
        return Response(Prof_wise_total_services, status = status.HTTP_200_OK)
    

class job_closure_report_prof_id(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, prof_id, start_date_str, end_date_str):
        
        start_date = datetime.datetime.strptime(start_date_str, '%Y-%m-%d').date()
        # end_date = datetime.datetime.strptime(end_date_str, '%Y-%m-%d').date()+timedelta(days=1)
        end_date = datetime.datetime.strptime(end_date_str, '%Y-%m-%d').date()
        if (start_date_str==end_date_str):
            get_all_session = agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id = prof_id, actual_StartDate_Time=start_date,status = 1)
        else:
            get_all_session = agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id = prof_id, actual_StartDate_Time__range=(start_date,end_date), status = 1)
        evnt = list(set(get_all_session.values_list('eve_id', flat=True)))
        prof_events = []
        cunt = 0
        for i in get_all_session:
            print(i.eve_id)
            cunt+=1
        print(cunt,'cunt')
        for eve_id in evnt:
            get_prof_dtl_event = get_all_session.filter(eve_id=eve_id)
            last_dtl_eve = get_prof_dtl_event.last()
            date_list = get_prof_dtl_event.values_list('actual_StartDate_Time', flat=True)
            eve_min_date = min(date_list)
            if get_prof_dtl_event:
                prof_event = {
                    'event_date': eve_min_date.strftime('%Y-%m-%d'),
                    'event_code': last_dtl_eve.eve_id.event_code,
                    'patient_name':last_dtl_eve.eve_id.agg_sp_pt_id.name,
                    'service_name': last_dtl_eve.eve_poc_id.srv_id.service_title,
                    'sessions': get_prof_dtl_event.count() or 0,
                    'closed_sessions': get_prof_dtl_event.filter(Session_jobclosure_status=1).count()

                }
                prof_events.append(prof_event)
        
        return Response(prof_events)










import datetime      #😂🤣🤣🤣🤣🤣🤣
class job_closure_report_event_wise(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get_closure_count(self, sdt, edt, eve_id):
        print("start dateeee--", sdt)
        print("end dateeeee--", edt)

        jc_count = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=eve_id,status=1, actual_StartDate_Time__range = (sdt, edt), Session_jobclosure_status=1).count()

        print("Jccccccccccccc count--",jc_count)

        return jc_count


    def get(self, request, eve_id):

        professional=[]
        professional_list=[]
        try:
            detaile_event_plan_of_care=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=eve_id,status=1)

            epoc = agg_hhc_event_plan_of_care.objects.filter(eve_id = eve_id, status = 1).last()

            sessions=0

            for j in detaile_event_plan_of_care:

                professional_name_date=[]

                if j.srv_prof_id is not None:
                    if(str(j.srv_prof_id.prof_fullname) in professional_list):
                        # print("n0")
                        pass
                    else:
                        get_dtl_data=detaile_event_plan_of_care.filter(eve_id=eve_id,srv_prof_id=j.srv_prof_id,status=1)

                        # get_dtl_data2 = detaile_event_plan_of_care.filter(eve_id=eve_id,srv_prof_id=j.srv_prof_id,status=1,Session_jobclosure_status=1)



                        for k in get_dtl_data:
                            professional_name_date.append(str(k.actual_StartDate_Time))
                        if len(professional_name_date)==1:
                                jc_count = self.get_closure_count(professional_name_date[0],professional_name_date[0],eve_id)
                                print("jc_count = ", jc_count)
                                professiona_proper_info={
                                    'professional_name':j.srv_prof_id.prof_fullname,
                                    'start_date':professional_name_date[0],
                                    'end_date':professional_name_date[0],
                                    'sessions':1,
                                    'closed_sessions': jc_count
                                    }
                                professional.append(professiona_proper_info)
                        else:
                            len_count=1
                            new_start_date=professional_name_date[0]
                            session_count=1

                            for l in professional_name_date:
                                start_date_name=str(datetime.datetime.strptime(l, '%Y-%m-%d').date()+datetime.timedelta(days=1))

                                # print(len_count,"new",len(professional_name_date))

                                if(len_count==len(professional_name_date)):
                                    jc_count = self.get_closure_count(new_start_date,professional_name_date[-1],eve_id)
                                    print("jc_count = ", jc_count)
                                    professiona_proper_info={
                                        "professional_id":j.srv_prof_id_id,
                                        'professional_name':j.srv_prof_id.prof_fullname,
                                        'start_date':new_start_date,
                                        'end_date':professional_name_date[-1],
                                        'service':epoc.srv_id.service_title,
                                        'sub_service':epoc.sub_srv_id.recommomded_service,
                                        'total_sessions':session_count,
                                        # 'closed_sessions': get_dtl_data.filter(Session_jobclosure_status=1).count()
                                        'closed_sessions': jc_count
                                        }
                                    professional.append(professiona_proper_info)

                                elif(start_date_name==professional_name_date[len_count]):
                                    session_count+=1

                                else:
                                    jc_count = self.get_closure_count(new_start_date,l,eve_id)
                                    print("jc_count = ", jc_count)
                                    professiona_proper_info={
                                        "professional_id":j.srv_prof_id_id,
                                        'professional_name':j.srv_prof_id.prof_fullname,
                                        'start_date':new_start_date,
                                        'end_date':l,
                                        'service':epoc.srv_id.service_title,
                                        'sub_service':epoc.sub_srv_id.recommomded_service,
                                        'total_sessions':session_count,
                                        'closed_sessions':jc_count
                                        # 'closed_sessions': get_dtl_data.filter(Session_jobclosure_status=1).count()
                                        }
                                   
                                    professional.append(professiona_proper_info)
                                    new_start_date=professional_name_date[len_count]
                                    session_count=1

                                len_count+=1
                        professional_list.append(str(j.srv_prof_id.prof_fullname))
                sessions+=1
            data = {
                'job_cl_eve_data' : professional,
            
            }
            return Response(data)
        except Exception as e:
            return Response({"data": str(e)})
#  ---------------------------------------------------------------------------------------------------------------------------------------
         
class Manage_professional_unit_report(APIView):
    def get(self, request):
        print('asdflkj')
        dt_profs=[
            i for i in agg_hhc_detailed_event_plan_of_care.objects.filter(Q(Session_status=2) | Q(Session_status=9),actual_StartDate_Time__range=(request.query_params.get('start_date'), request.query_params.get('end_date')),eve_id__in = sorted(list(set([prof.eve_id for prof in agg_hhc_events.objects.filter(Q(enq_spero_srv_status=1) | Q(enq_spero_srv_status=2),status=1)]))), status=1) 
            ]
        profs =[[i.srv_prof_id.prof_fullname,i.srv_prof_id.email_id, i.eve_poc_id.srv_id.service_title,i.srv_prof_id.phone_no,i.srv_prof_id.srv_prof_id ] if i.srv_prof_id.srv_prof_id else None for i in dt_profs]
        # for k in dt_profs:
        #     if k.srv_prof_id.srv_prof_id==5:
        #         print(k.srv_prof_id.srv_prof_id, 'srv_prof_id...............')
        srv_ids=[i.srv_prof_id.srv_prof_id for i in dt_profs]
        profs =[[i.srv_prof_id.prof_fullname,i.srv_prof_id.email_id, i.eve_poc_id.srv_id.service_title,i.srv_prof_id.phone_no,srv_ids.count(i.srv_prof_id.srv_prof_id),i.srv_prof_id.srv_prof_id ] if i.srv_prof_id.srv_prof_id else None for i in dt_profs]
        # for p in profs:
        #     if p[0]=='Chaitali Sameer Gandhe':
        #         print(p, 'profs...............')
        prof=set(map(tuple, profs))
        keys = ["Prof_name", "email", "Service", "mobile", "unit", "prof_id"]
        p=[dict(zip(keys, tpl)) for tpl in prof]
        return Response(p)
    

class View_professional_unit_report(APIView):

    # def get(self, request, srv_prof_id,start_date, end_date):
    #     # end_date_str = request.query_params.get('end_date')
    #     end_date1 = datetime.datetime.strptime(end_date, '%Y-%m-%d')
    #     end_date1 += timedelta(days=1)
    #     end_date_str = end_date1.strftime('%Y-%m-%d')


    #     srv_prof_data = agg_hhc_service_professionals.objects.get( srv_prof_id= srv_prof_id, status = 1)
    #     dt_events = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(Session_status=2) | Q(Session_status=9),
    #                                                                    added_date__range=(start_date, end_date_str),
    #                                                                 #    eve_id__in = sorted(list(set([prof.eve_id for prof in agg_hhc_events.objects.filter(Q(enq_spero_srv_status=1) | Q(enq_spero_srv_status=2),added_date__range=(start_date, end_date_str),status=1)]))), 
    #                                                                    srv_prof_id=srv_prof_id, status=1)
    #     unique_eve_ids = dt_events.values_list('eve_id', flat=True).distinct()
    #     get_dtl = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(Session_status=2) | Q(Session_status=9),eve_id__in=unique_eve_ids,
    #                                                                  added_date__range=(start_date, end_date_str), 
    #                                                                 #  eve_id__in = sorted(list(set([prof.eve_id for prof in agg_hhc_events.objects.filter(Q(enq_spero_srv_status=1) | Q(enq_spero_srv_status=2),added_date__range=(start_date, end_date_str),status=1)]))), 
    #                                                                  srv_prof_id=srv_prof_id, status=1)
    #     details_prof = []
    #     total_rate = 0
    #     total_prof_cost = 0 
    #     total_spero_rate = 0
     
    #     seen_eve_ids = set()

    #     for i in get_dtl:
    #         if i.eve_id.eve_id not in seen_eve_ids:  # Check if eve_id is already seen
    #             seen_eve_ids.add(i.eve_id.eve_id)
                
    #             print(i.eve_id)
    #             epoc = agg_hhc_event_plan_of_care.objects.get(eve_id=i.eve_id, status=1)
    #             total_sess = get_dtl.filter(eve_id=i.eve_id).count()
    #             rate = i.eve_id.final_amount / total_sess
    #             total_rate += math.ceil(rate)
    #             total_spero_rate += math.ceil(rate)*total_sess
    #             print(epoc.sub_srv_id.sub_srv_id,"epoc.sub_srv_id")
    #             prof_sub_srv_data = agg_hhc_professional_sub_services.objects.filter(srv_prof_id=srv_prof_id, sub_srv_id=epoc.sub_srv_id).last()
    #             print(prof_sub_srv_data, "prof_sub_srv_data")
               
    #             prof_cost = prof_sub_srv_data.prof_cost if hasattr(prof_sub_srv_data, 'prof_cost') else 0
    #             if prof_cost is not None: 
    #                 # total_prof_cost += prof_cost  

    #                 Prof_Total_Cost = prof_cost  * total_sess
    #                 total_prof_cost += Prof_Total_Cost
                
                
    #             data = {
    #                 "eve_id": i.eve_id.eve_id,
    #                 "Voucher_Date": i.eve_id.added_date.strftime('%Y-%m-%d %H:%M'),
    #                 "Party_Name": i.eve_id.agg_sp_pt_id.name,
    #                 "Stock_Item": epoc.sub_srv_id.recommomded_service,
    #                 "QTY": total_sess,
    #                 "Rate": math.ceil(rate),
    #                 # "Amount": i.eve_id.final_amount,
    #                 "Amount": math.ceil(rate)*total_sess,
    #                 "Prof_Cost": prof_cost,
    #                 "Prof_Total_Cost": Prof_Total_Cost ,
    #                 "Start_Date": epoc.start_date,
    #                 "End Date": epoc.end_date,
    #                 "UOM": "Service"
    #             }
    #             details_prof.append(data)
    #     print(total_rate, "total_rate")
    #     tds_main = total_prof_cost * 0.9
    #     TDS_10per = total_prof_cost - tds_main
    #     Gross_Total = total_prof_cost - TDS_10per
    #     print(get_dtl.count(),"get_dtl.count()")
    #     total_convinance_sum = get_dtl.aggregate(
    #         total_convinance_charges=Coalesce(Sum('convinance_charges'), Value(0))
    #     )['total_convinance_charges']
    #     today = datetime.datetime.now().date()
    #     first_day_of_month = today.replace(day=1)
    #     if srv_prof_data.added_date and first_day_of_month <= srv_prof_data.added_date.date() <= today:
    #         Approne = srv_prof_data.apron_charges if srv_prof_data.apron_charges is not None else 0
    #         Police_Varify = srv_prof_data.police_varification_charges if srv_prof_data.police_varification_charges is not None else 0
    #     else:
    #         Approne = 0
    #         Police_Varify = 0
     
    #     Net_Amount = int(int((Gross_Total+total_convinance_sum)-Approne) - Police_Varify)
    #     prof_cost_dtl = {
    #         "Total_Spero_Cost": total_spero_rate,
    #         "Total_Prof_Cost": total_prof_cost, 
    #         "TDS_10_%":TDS_10per,
    #         "Gross_Total": Gross_Total,
    #         "Conveyance": total_convinance_sum,
    #         "Approne": Approne,
    #         "Police_Varification": Police_Varify,
    #         "Net_Amount": Net_Amount
    #     }

    #     return Response({"details_prof": details_prof, "prof_cost_dtl": prof_cost_dtl})
    
    def get(self, request, srv_prof_id,start_date, end_date):
       
        end_date1 = datetime.datetime.strptime(end_date, '%Y-%m-%d')
        # end_date1 += timedelta(days=1)
        end_date_str = end_date1.strftime('%Y-%m-%d')


        srv_prof_data = agg_hhc_service_professionals.objects.get( srv_prof_id= srv_prof_id, status = 1)
        dt_events = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(Session_status=2) | Q(Session_status=9),
                                                                       actual_StartDate_Time__range=(start_date, end_date_str),
                                                                    #    eve_id__in = sorted(list(set([prof.eve_id for prof in agg_hhc_events.objects.filter(Q(enq_spero_srv_status=1) | Q(enq_spero_srv_status=2),added_date__range=(start_date, end_date_str),status=1)]))), 
                                                                       srv_prof_id=srv_prof_id, status=1)
        unique_eve_ids = dt_events.values_list('eve_id', flat=True).distinct()
        get_dtl = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(Session_status=2) | Q(Session_status=9),eve_id__in=unique_eve_ids,
                                                                     actual_StartDate_Time__range=(start_date, end_date_str), 
                                                                    #  eve_id__in = sorted(list(set([prof.eve_id for prof in agg_hhc_events.objects.filter(Q(enq_spero_srv_status=1) | Q(enq_spero_srv_status=2),added_date__range=(start_date, end_date_str),status=1)]))), 
                                                                     srv_prof_id=srv_prof_id, status=1)
        # print(get_dtl.count(),'fghjghjhjhj')
        details_prof = []
        total_rate = 0
        total_prof_cost = 0 
        total_spero_rate = 0
     
        seen_eve_ids = set()

        for i in get_dtl:
            if i.eve_id.eve_id not in seen_eve_ids:  # Check if eve_id is already seen
                seen_eve_ids.add(i.eve_id.eve_id)
                
                # print(i.eve_id)
                epoc = agg_hhc_event_plan_of_care.objects.get(eve_id=i.eve_id, status=1)
                total_sess = get_dtl.filter(eve_id=i.eve_id).count()
                rate = i.eve_id.final_amount / total_sess
                total_rate += math.ceil(rate)
                total_spero_rate += math.ceil(rate)*total_sess
                # print(epoc.sub_srv_id.sub_srv_id,"epoc.sub_srv_id")
                print(srv_prof_id)
                prof_sub_srv_data = agg_hhc_professional_sub_services.objects.filter(srv_prof_id=srv_prof_id, sub_srv_id=epoc.sub_srv_id).last()
                # print(prof_sub_srv_data, "prof_sub_srv_data")
               
                prof_cost = prof_sub_srv_data.prof_cost if hasattr(prof_sub_srv_data, 'prof_cost') else 0
                if prof_cost is not None: 
                    # total_prof_cost += prof_cost  

                    Prof_Total_Cost = prof_cost  * total_sess
                    total_prof_cost += Prof_Total_Cost
                else:
                    prof_cost = 0
                    Prof_Total_Cost = 0
                    total_prof_cost = 0
                
                
                data = {
                    "eve_id": i.eve_id.eve_id,
                    "Voucher_Date": i.eve_id.added_date.strftime('%Y-%m-%d %H:%M'),
                    "Party_Name": i.eve_id.agg_sp_pt_id.name,
                    "Stock_Item": epoc.sub_srv_id.recommomded_service,
                    "QTY": total_sess,
                    "Rate": math.ceil(rate),
                    # "Amount": i.eve_id.final_amount,
                    "Amount": math.ceil(rate)*total_sess,
                    "Prof_Cost": prof_cost,
                    "Prof_Total_Cost": Prof_Total_Cost ,
                    "Start_Date": epoc.start_date,
                    "End Date": epoc.end_date,
                    "UOM": "Service"
                }
                details_prof.append(data)
        # print(total_rate, "total_rate")
        tds_main = total_prof_cost * 0.9
        TDS_10per = total_prof_cost - tds_main
        Gross_Total = total_prof_cost - TDS_10per
        # print(get_dtl.count(),"get_dtl.count()")
        total_convinance_sum = get_dtl.aggregate(
            total_convinance_charges=Coalesce(Sum('convinance_charges'), Value(0))
        )['total_convinance_charges']
        today = datetime.datetime.now().date()
        first_day_of_month = today.replace(day=1)
        if srv_prof_data.added_date and first_day_of_month <= srv_prof_data.added_date.date() <= today:
            Approne = srv_prof_data.apron_charges if srv_prof_data.apron_charges is not None else 0
            Police_Varify = srv_prof_data.police_varification_charges if srv_prof_data.police_varification_charges is not None else 0
        else:
            Approne = 0
            Police_Varify = 0
     
        Net_Amount = int(int((Gross_Total+total_convinance_sum)-Approne) - Police_Varify)
        prof_cost_dtl = {
            "Total_Spero_Cost": total_spero_rate,
            "Total_Prof_Cost": total_prof_cost, 
            "TDS_10_%":TDS_10per,
            "Gross_Total": Gross_Total,
            "Conveyance": total_convinance_sum,
            "Approne": Approne,
            "Police_Varification": Police_Varify,
            "Net_Amount": Net_Amount
        }

        return Response({"details_prof": details_prof, "prof_cost_dtl": prof_cost_dtl})

    


from django.http import HttpResponse

class View_professional_unit_report22(APIView):

    def get(self, request, srv_prof_id, start_date, end_date):
        end_date1 = datetime.datetime.strptime(end_date, '%Y-%m-%d')
        # end_date1 += timedelta(days=1)
        end_date_str = end_date1.strftime('%Y-%m-%d')


        srv_prof_data = agg_hhc_service_professionals.objects.get( srv_prof_id= srv_prof_id, status = 1)
        dt_events = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(Session_status=2) | Q(Session_status=9),
                                                                       actual_StartDate_Time__range=(start_date, end_date_str),
                                                                    #    eve_id__in = sorted(list(set([prof.eve_id for prof in agg_hhc_events.objects.filter(Q(enq_spero_srv_status=1) | Q(enq_spero_srv_status=2),added_date__range=(start_date, end_date_str),status=1)]))), 
                                                                       srv_prof_id=srv_prof_id, status=1)
        unique_eve_ids = dt_events.values_list('eve_id', flat=True).distinct()
        get_dtl = agg_hhc_detailed_event_plan_of_care.objects.filter(Q(Session_status=2) | Q(Session_status=9),eve_id__in=unique_eve_ids,
                                                                     actual_StartDate_Time__range=(start_date, end_date_str), 
                                                                    #  eve_id__in = sorted(list(set([prof.eve_id for prof in agg_hhc_events.objects.filter(Q(enq_spero_srv_status=1) | Q(enq_spero_srv_status=2),added_date__range=(start_date, end_date_str),status=1)]))), 
                                                                     srv_prof_id=srv_prof_id, status=1)
        details_prof = []
        total_rate = 0
        total_prof_cost = 0 
        total_spero_rate = 0
     
        seen_eve_ids = set()

        for i in get_dtl:
            if i.eve_id.eve_id not in seen_eve_ids:  # Check if eve_id is already seen
                seen_eve_ids.add(i.eve_id.eve_id)
                
                print(i.eve_id)
                epoc = agg_hhc_event_plan_of_care.objects.get(eve_id=i.eve_id, status=1)
                total_sess = get_dtl.filter(eve_id=i.eve_id).count()
                rate = i.eve_id.final_amount / total_sess
                total_rate += math.ceil(rate)
                total_spero_rate += math.ceil(rate)*total_sess
                print(epoc.sub_srv_id.sub_srv_id,"epoc.sub_srv_id")
                prof_sub_srv_data = agg_hhc_professional_sub_services.objects.filter(srv_prof_id=srv_prof_id, sub_srv_id=epoc.sub_srv_id).last()
                print(prof_sub_srv_data, "prof_sub_srv_data")
               
                prof_cost = prof_sub_srv_data.prof_cost if hasattr(prof_sub_srv_data, 'prof_cost') else 0
                if prof_cost is not None: 
                    # total_prof_cost += prof_cost  

                    Prof_Total_Cost = prof_cost  * total_sess
                    total_prof_cost += Prof_Total_Cost
                
                
                data = {
                    "eve_id": i.eve_id.eve_id,
                    "Voucher_Date": i.eve_id.added_date.strftime('%Y-%m-%d %H:%M'),
                    "Party_Name": i.eve_id.agg_sp_pt_id.name,
                    "Stock_Item": epoc.sub_srv_id.recommomded_service,
                    "QTY": total_sess,
                    "Rate": math.ceil(rate),
                    # "Amount": i.eve_id.final_amount,
                    "Amount": math.ceil(rate)*total_sess,
                    "Prof_Cost": prof_cost,
                    "Prof_Total_Cost": Prof_Total_Cost ,
                    "Start_Date": epoc.start_date,
                    "End_Date": epoc.end_date,
                    "UOM": "Service"
                }
                details_prof.append(data)
        print(total_rate, "total_rate")
        tds_main = total_prof_cost * 0.9
        TDS_10per = total_prof_cost - tds_main
        Gross_Total = total_prof_cost - TDS_10per
        print(get_dtl.count(),"get_dtl.count()")
        total_convinance_sum = get_dtl.aggregate(
            total_convinance_charges=Coalesce(Sum('convinance_charges'), Value(0))
        )['total_convinance_charges']
        today = datetime.datetime.now().date()
        first_day_of_month = today.replace(day=1)
        if srv_prof_data.added_date and first_day_of_month <= srv_prof_data.added_date.date() <= today:
            Approne = srv_prof_data.apron_charges if srv_prof_data.apron_charges is not None else 0
            Police_Varify = srv_prof_data.police_varification_charges if srv_prof_data.police_varification_charges is not None else 0
        else:
            Approne = 0
            Police_Varify = 0
     
        Net_Amount = int(int((Gross_Total+total_convinance_sum)-Approne) - Police_Varify)
        prof_cost_dtl = {
            "Total_Spero_Cost": total_spero_rate,
            "Total_Prof_Cost": total_prof_cost, 
            "TDS_10_%":TDS_10per,
            "Gross_Total": Gross_Total,
            "Conveyance": total_convinance_sum,
            "Approne": Approne,
            "Police_Varification": Police_Varify,
            "Net_Amount": Net_Amount
        }

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'''attachment; filename="Doctor {srv_prof_data.prof_fullname}_{format(datetime.datetime.now().strftime('%m/%d/%Y %I:%M:%S %p'))}.csv"'''

        writer = csv.writer(response)
        
        current_year = today.year
        if today.month < 4:
            financial_year = f"{current_year-1} - {current_year}"
        else:
            financial_year = f"{current_year} - {current_year+1}"

        writer.writerow(["Print on:{}".format(datetime.datetime.now().strftime('%m/%d/%Y %I:%M:%S %p'))])
        writer.writerow([f"Spero Healthcare Innovations Pvt. Ltd - {financial_year}"])
        writer.writerow([f"Details Of Professional: {srv_prof_data.prof_fullname}"])
        writer.writerow([])
       
        writer.writerow(["Voucher Date", "Party Name", "Stock Item", "QTY", "Prof Cost", "Prof Total Cost", "Start Date", "End Date", "UOM"])

        for detail in details_prof:
            writer.writerow([
                detail["Voucher_Date"],
                detail["Party_Name"],
                detail["Stock_Item"],
                detail["QTY"],
                detail["Prof_Cost"],
                detail["Prof_Total_Cost"],
                detail["Start_Date"],
                detail["End_Date"],
                detail["UOM"]
            ])

        # the total cost details
        writer.writerow([])
        writer.writerow(["Total (Prof. Cost)", "TDS 10 %", "Gross Total", "Conveyance", "Approne", "Police Varification", "Net Amount"])
        writer.writerow([
            prof_cost_dtl["Total_Prof_Cost"],
            prof_cost_dtl["TDS_10_%"],
            prof_cost_dtl["Gross_Total"],
            prof_cost_dtl["Conveyance"],
            prof_cost_dtl["Approne"],
            prof_cost_dtl["Police_Varification"],
            prof_cost_dtl["Net_Amount"]
        ])

        return response


class check_approval_account(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        check_record=[]
        data=agg_hhc_payment_details.objects.filter(mode=2,status=1,cheque_status=1)
        for i in data:
            check_recive_first_name=i.check_received_by.clg_first_name if i.check_received_by.clg_first_name is not None else ""
            check_recive_last_name=i.check_received_by.clg_last_name if i.check_received_by.clg_last_name is not None else ""
            final_json_data={'eve_id':i.eve_id,'patient_name':i.eve_id.agg_sp_pt_id.name,'phone_nmber':i.eve_id.agg_sp_pt_id.phone_no,'check_recived_by':str(check_recive_first_name+" "+check_recive_last_name),'date':i.date,'paid_amount':i.amount_paid,'amount_remaining':i.amount_remaining,'cheque_date':i.cheque_date,'check_number':i.cheque_number,'bank_name':i.bank_name,'cheque_image':i.cheque_image}
            check_record.append(final_json_data)
        return Response({'check':check_record})
    def post(self,request,pay_id,ra):
        if int(ra)==1: #1 Approved
            data=agg_hhc_payment_details.objects.filter(pay_dt_id=pay_id).last()
            data.cheque_status=2 #approve staus 
            data.save()
            return Response({'check':'check_approved'})
        elif int(ra)==2: #1 rejecetd
            data=agg_hhc_payment_details.objects.filter(pay_dt_id=pay_id).last()
            data.cheque_status=3 #rejecetd status
            data.overall_status="Rejected_by_Accounts"
            data.save()
            return Response({'check':'rejecetd'})
        else:
            return  Response({'check':'select_right_option'})
        













# from hhc_account.serializer import pending_UTR_Payment_Details_serializer
# ________________________________ Amit Rasale ________________________________________
# __________ UTR pending_UTR_Payment_Details_serializer ______________________________

class Pending_UTR_Number_in_Payment_Details_Views(APIView):
    def get(self, request, format=None):
        from_date_str = request.query_params.get('from_date')
        to_date_str = request.query_params.get('to_date')
        utr_id = request.query_params.get('UTRid')
        patient_name = request.query_params.get('patient_name')

        from_date = datetime.datetime.strptime(from_date_str, '%Y-%m-%d') if from_date_str else None
        to_date = datetime.datetime.strptime(to_date_str, '%Y-%m-%d') if to_date_str else None    

        Payment_d = agg_hhc_payment_details.objects.all().order_by('-added_date')
        if from_date and to_date:
            Payment_d = Payment_d.filter(added_date__range=(from_date, to_date))
        elif from_date:
            Payment_d = Payment_d.filter(added_date__gte=from_date)
        elif to_date:
            Payment_d = Payment_d.filter(added_date__lte=to_date)

        if utr_id == '1':
            Payment_d = Payment_d.exclude(utr__isnull=True).exclude(utr__exact='')
        elif utr_id == '2':
            Payment_d = Payment_d.filter(Q(utr__isnull=True) | Q(utr__exact=''))

        if patient_name:
            Payment_d = Payment_d.filter(eve_id__agg_sp_pt_id__name__icontains=patient_name)
        Payment_d = Payment_d.filter(status='1', eve_id__status='1', eve_id__caller_id__status='1', eve_id__agg_sp_pt_id__status='1').exclude(mode='1')
        serializer = pending_UTR_Payment_Details_serializer(
            Payment_d, 
            many=True,
            context={'from_date': from_date_str, 'to_date': to_date_str}
        )

        if not serializer.data:
            return Response({"detail": "No data found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.data)


class Pending_UTR_Number_in_Payment_Details_POST_Views(APIView):
    def get(self, request, pay_dt_id, eve_id,  format=None):
        payment_details = agg_hhc_payment_details.objects.filter(pay_dt_id=pay_dt_id, eve_id=eve_id).exclude(mode='1')
        serializer = pending_UTR_Payment_Details_POST_serializer(payment_details, many=True)
        return Response(serializer.data)

    def put(self, request, pay_dt_id, eve_id, format=None):
        try:
            payment_detail = agg_hhc_payment_details.objects.get(pay_dt_id=pay_dt_id, eve_id=eve_id)
        except agg_hhc_payment_details.DoesNotExist:
            return Response({"detail": "Payment detail does not exist"}, status=status.HTTP_404_NOT_FOUND)

        request.data.pop('pay_dt_id', None)
        request.data.pop('eve_id', None)

        serializer = pending_UTR_Payment_Details_POST_serializer(payment_detail, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# __________ UTR pending_UTR_Payment_Details_serializer ______________________________






# ________________________________ Amit Rasale ________________________________________