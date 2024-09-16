from django.shortcuts import render
from rest_framework.views import APIView
from hhcweb.models import *
from hhchr.serializer import *
from django.db.models import Q
import jwt
from rest_framework.response import Response
from hhc_professional_app.renders import UserRenderer
from rest_framework.permissions import IsAuthenticated


def get_prof(request):
    clg_id = ""
    auth_header = request.headers.get('Authorization')
    token = str(auth_header).split()[1]

    decoded_token = jwt.decode(token, key='django-insecure-gelhauh(a&-!e01zl$_ic4l07frx!1qx^h(zjitk(c57w(n6ry', algorithms=['HS256'])

    clg_id = decoded_token.get('user_id')
    clg_ref = agg_com_colleague.objects.get(id=clg_id)

    return clg_id, clg_ref.clg_ref_id


from django.utils import timezone
from datetime import timedelta
# Create your views here.
# class DayPrint(APIView):
#     def get(self, request):
#         start_date=request.data['start_date']
#         end_date=request.data['end_date']
#         hosp_id = request.data['hosp_id']
#         payment_entries=agg_hhc_payment_details.objects.filter( Q(payment_status=2) | Q(payment_status=3),added_date__range=(start_date, end_date), eve_id__agg_sp_pt_id__preferred_hosp_id=hosp_id)
#         for i in payment_entries:
#             print(i.eve_id.agg_sp_pt_id.preferred_hosp_id,';;;;')
#         day_print = DayPrintSerializer(payment_entries, many=True)
#         return Response(day_print.data) 


class Dayprint(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    def get(self, request):
        start_date1=datetime.datetime.strptime(request.query_params.get('start_date'),'%Y-%m-%d').date()
        end_date1=datetime.datetime.strptime(request.query_params.get('end_date'),'%Y-%m-%d').date()
        hosp_id=request.query_params.get('hosp_id')
        if hosp_id:
            payment_entries=agg_hhc_payment_details.objects.filter( (Q(payment_status=2) | Q(payment_status=3)),overall_status='SUCCESS',payment_to_desk_date__range=(start_date1, end_date1), eve_id__agg_sp_pt_id__preferred_hosp_id=hosp_id)
        else:
            payment_entries=agg_hhc_payment_details.objects.filter((Q(payment_status=2)| Q(payment_status=3)),overall_status='SUCCESS',payment_to_desk_date__range=(start_date1,end_date1))

        print(payment_entries,';;;;') 
        day_print = DayPrintSerializer(payment_entries, many=True)
        return Response(day_print.data) 
# class Dayprint(APIView):
#     def get(self, request):
#         # start_date1=datetime.datetime.strptime(start_date, '%Y-%m-%d')
#         # end_date1=datetime.datetime.strptime(end_date, '%Y-%m-%d')+timedelta(days=1)
#         start_date1=datetime.datetime.strptime(request.query_params.get('start_date'),'%Y-%m-%d').date()
#         end_date1=(datetime.datetime.strptime(request.query_params.get('end_date'),'%Y-%m-%d')+timedelta(days=1)).date()
#         hosp_id=request.query_params.get('hosp_id')
#         print(start_date1, end_date1, hosp_id)
#         if hosp_id:
#             print('asdf')
#             # payment_entries=agg_hhc_payment_details.objects.filter(Q(payment_status=2)| Q(payment_status=3),added_date__range=(start_date1,end_date1), eve_id__agg_sp_pt_id__preferred_hosp_id=hosp_id)
#             # payment_entries=agg_hhc_payment_details.objects.filter( Q(payment_status=2) | Q(payment_status=3),added_date__range=(start_date1, end_date1), eve_id__agg_sp_pt_id__preferred_hosp_id=hosp_id)
#             payment_entries=agg_hhc_payment_details.objects.filter( Q(payment_status=2) | Q(payment_status=3),added_date__range=(start_date1, end_date1))
#             print(payment_entries.count(),'er')
#         else:
#             print('234')
#             payment_entries=agg_hhc_payment_details.objects.filter(Q(payment_status=2)| Q(payment_status=3),added_date__range=(start_date1,end_date1))
#             print('2353')
#             print(payment_entries.count(),'12er')

#         day_print= DayPrintSerializer(payment_entries, many=True)
#         print(';.,/')
#         return Response(day_print.data)

#------------------------------DayPrint in excel ------------------------start-----------------------------------------------------------------
from django.http import StreamingHttpResponse
import csv

class DayPrint_excel(APIView):
    def get(self, request,start_date,end_date,hosp_id):
        # start_date=start_date
        start_date=start_date
        end_dates=end_date
        end_date=end_date
        hosp_id=hosp_id
        end_date = datetime.datetime.strptime(end_date, '%Y-%m-%d')  # Convert string to datetime object
        end_date = end_date + timedelta(days=1) 
        if(hosp_id!=0 and start_date==end_dates):
            # payment_entries=agg_hhc_payment_details.objects.filter( Q(payment_status=2) | Q(payment_status=3),overall_status='SUCCESS',payment_to_desk_date=start_date, eve_id__agg_sp_pt_id__preferred_hosp_id=hosp_id,status=1)
            epoc = agg_hhc_event_plan_of_care.objects.filter(hosp_id=hosp_id, status=1)
            eve_ids = epoc.values_list('eve_id')
            payment_entries = agg_hhc_payment_details.objects.filter( Q(payment_status=2) | Q(payment_status=3), eve_id__in=eve_ids, overall_status='SUCCESS',payment_to_desk_date=start_date,status=1)


        elif hosp_id!=0:
            # payment_entries=agg_hhc_payment_details.objects.filter( Q(payment_status=2) | Q(payment_status=3),overall_status='SUCCESS',payment_to_desk_date__range=(start_date, end_date), eve_id__agg_sp_pt_id__preferred_hosp_id=hosp_id,status=1)
            epoc = agg_hhc_event_plan_of_care.objects.filter(hosp_id=hosp_id, status=1)
            eve_ids = epoc.values_list('eve_id')
            payment_entries=agg_hhc_payment_details.objects.filter( Q(payment_status=2) | Q(payment_status=3),eve_id__in=eve_ids, overall_status='SUCCESS',payment_to_desk_date__range=(start_date, end_date), status=1)
        elif(start_date==end_dates):
            payment_entries=agg_hhc_payment_details.objects.filter( Q(payment_status=2) | Q(payment_status=3),overall_status='SUCCESS',payment_to_desk_date=start_date,status=1)
        else:
            payment_entries=agg_hhc_payment_details.objects.filter(Q(payment_status=2)| Q(payment_status=3),overall_status='SUCCESS',payment_to_desk_date__range=(start_date,end_date),status=1)
        day_print = DayPrintSerializer(payment_entries, many=True)
        # Prepare CSV data
        csv_data = self.serialize_to_csv(day_print.data)
        # Prepare response
        response = StreamingHttpResponse(csv_data, content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="hhc_dayprint.csv"'
        return response
        # return Response(day_print.data) 

    def serialize_to_csv(self, data):
        header = ['pay_dt_id', 'eve_id','event_code','hhcid','amount_paid','added_date','mode','pay_recived_by','patient_name','hospital_name']  # Add other fields here #  CSV file header name of table fields names 
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
            row.append(str(data_row.get(field, '')))
        return ','.join(row)

#------------------------------Dayprint in excel-------------------------ends----------------------------------------------------






class Manage_emp(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]

    # def get(self, request):
    #     try:
    #         clg_id = request.GET.get('clg_id')
    #         if clg_id:
    #             emps = agg_com_colleague.objects.filter(id = clg_id)
    #         else:
    #             emps = agg_com_colleague.objects.all()
    #         serializers=Manage_emp_serializer(emps ,many=True)
    #         return Response(serializers.data, status=status.HTTP_200_OK)
    #     except:
    #         return Response({'Res_Data': {'msg':'Record not found'}}, status=status.HTTP_200_OK)
        
    def get(self, request, format=None):
        pro = request.GET.get('pro')
        ob = request.GET.get('ob') #ob = on board
        sl = request.GET.get('sl') #sl = selected
        print("sl", sl)
        try:
            if ob == '1':
                if pro:
                    zone = agg_hhc_service_professionals.objects.get(srv_prof_id=pro, prof_registered=True, prof_interviewed=True, prof_doc_verified=True).order_by('prof_fullname')
                else:
                    zone = agg_hhc_service_professionals.objects.filter(prof_registered=True, prof_interviewed=True, prof_doc_verified=True).order_by('prof_fullname')
                if zone:
                    serializer = ob_1_serializer(zone, many=True)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({'msg':'No Data Found'}, status=status.HTTP_400_BAD_REQUEST)
            elif sl == '1':
                Selected_prof_int = agg_hhc_prof_interview_details.objects.filter(int_status=1)
                
                selected_prof_arr = []
                for i in Selected_prof_int:
                    prof = agg_hhc_service_professionals.objects.get(srv_prof_id=i.srv_prof_id.srv_prof_id)
                    selected_prof_arr.append(prof)
                
                if selected_prof_arr:
                    serializer = agg_hhc_srv_prof_serializer(selected_prof_arr, many=True)
                    return Response(serializer.data ,status=status.HTTP_200_OK)
                return Response({'msg':'No Data Found'}, status=status.HTTP_400_BAD_REQUEST)

            elif not pro and not ob and not sl:
                # If no query parameters are provided, return all data
                zone = agg_hhc_service_professionals.objects.all().order_by('prof_fullname')
                
                # if zone.exists():
                serializer = agg_hhc_srv_prof_all_data_serializer(zone, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
                # return Response({'msg': 'No Data Found'}, status=status.HTTP_400_BAD_REQUEST)
            
            else:
                if pro:
                    zone = agg_hhc_service_professionals.objects.filter(srv_prof_id=pro)
                else:
                    zone = agg_hhc_service_professionals.objects.filter(status=1).order_by('prof_fullname')
                
                if zone.exists():
                    serializer = agg_hhc_srv_prof_all_data_serializer(zone, many=True)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({'msg': 'No Data Found'}, status=status.HTTP_400_BAD_REQUEST)

        except:
            return Response({'not found': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)
        


class Manage_emp_Edit_Views(APIView):

    def get(self, request, format=None):
        srv_prof_id = request.GET.get('srv_prof_id')
        
        try:
            if srv_prof_id:
                # Fetch a specific service professional based on srv_prof_id
                try:
                    prof = agg_hhc_service_professionals.objects.get(srv_prof_id=srv_prof_id)
                    serializer = agg_hhc_srv_prof_all_data_serializer(prof)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                except agg_hhc_service_professionals.DoesNotExist:
                    return Response({'msg': 'Service Professional not found'}, status=status.HTTP_404_NOT_FOUND)
            else:
                # If no srv_prof_id is provided, return all data
                zone = agg_hhc_service_professionals.objects.all().order_by('prof_fullname')
                
                if zone.exists():
                    serializer = agg_hhc_srv_prof_all_data_serializer(zone, many=True)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({'msg': 'No Data Found'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(f"Error: {e}")
            return Response({'msg': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request):
        srv_prof_id = request.data.get('srv_prof_id')
        if not srv_prof_id:
            return Response({'msg': 'srv_prof_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch the service professional using the srv_prof_id
            prof = agg_hhc_service_professionals.objects.get(srv_prof_id=srv_prof_id)
            
            # Create a copy of the request data and remove srv_prof_id to ensure it doesn't get updated
            update_data = request.data.copy()
            update_data.pop('srv_prof_id', None)  # This removes srv_prof_id from the update payload
            
            # Serialize with the modified data
            serializer = agg_hhc_srv_prof_serializer(prof, data=update_data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return Response({'msg': 'Service Professional updated successfully.'}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except agg_hhc_service_professionals.DoesNotExist:
            return Response({'msg': 'Service Professional not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Log the exception details for debugging
            print(f"Error: {e}")
            import traceback
            traceback.print_exc()  # This will print the traceback of the error for debugging
            return Response({'msg': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




        
#  ------------ Amit interview shedule __________________        
class Prof_int_dtls(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            Prof_int = agg_hhc_prof_interview_details.objects.all()
            print("Prof int dtls-- ", Prof_int)
            serializer = agg_hhc_srv_prof_int_dtls_serializer(Prof_int, many=True)
            # j = 0
            # for i in serializer.data:
            #     prof_id = serializer.data[j]['srv_prof_id']
            #     prof_dtls = agg_hhc_service_professionals.objects.get(srv_prof_id = prof_id)
            #     serializer.data[j]['prof_name'] = prof_dtls.prof_fullname
            #     serializer.data[j]['prof_number'] = prof_dtls.phone_no
            #     serializer.data[j]['prof_role'] = prof_dtls.designation
            #     if prof_dtls.Job_type == 1:
            #         serializer.data[j]['emp_type'] = "Oncall"
            #     elif prof_dtls.Job_type == 2:
            #         serializer.data[j]['emp_type'] = "Fulltime"
            #     else:
            #         serializer.data[j]['emp_type'] = "Parttime"
            #     j = j + 1
            #     # print("Prof id--", prof_id)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({'Res_Data': {'msg':'Record not found'}}, status=status.HTTP_200_OK)
        

    def put(self, request):
        clgref_id = get_prof(request)[1]
        request.data['last_modified_by'] = clgref_id
        try:
            rdata = request.data
            pro = rdata['srv_prof_id']

            prof_int = agg_hhc_prof_interview_details.objects.get(srv_prof_id = pro)

            if prof_int:
                serializer = agg_hhc_srv_prof_int_dtls_serializer(prof_int, data=rdata)
                if serializer.is_valid():
                    serializer.save()
                    res_data = {'msg':'Professional interview status updated successfully.'}
                    response_data={
                    'Res_Data': res_data
                    }
                    return Response(response_data, status=status.HTTP_200_OK)
                return Response({"Res_Data" : {'msg':'No Data Found'}}, serializer.errors, status=status.HTTP_200_OK)
            return Response({'Res_Data': None }, status=status.HTTP_200_OK)
        except:
            return Response({'Res_Data': {'msg':'Record not found'}}, status=status.HTTP_200_OK)
    
class Prof_doc_dtls(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            pro = request.GET.get('pro')
            print("pro--", pro)
            Prof_doc = agg_hhc_professional_documents.objects.filter(srv_prof_id=pro)
            if Prof_doc:
                print("Prof int dtls-- ", Prof_doc)
                serializer = agg_hhc_srv_prof_doc_dtls_serializer(Prof_doc, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({'Res_Data': {'msg':'Record not found'}}, status=status.HTTP_200_OK)
        except:
            return Response({'Res_Data': {'msg':'Record not found'}}, status=status.HTTP_200_OK)
        
    def post(self, request):
        clgref_id = get_prof(request)[1]
        request.data['last_modified_by'] = clgref_id
        try:
            rdata = request.data
            pro = rdata['srv_prof_id']
            doc = rdata['doc_li_id']
            try:
                print('in try block')
                exist_doc = agg_hhc_professional_documents.objects.get(srv_prof_id=pro, doc_li_id=doc)
                if exist_doc:
                    return Response({'msg':'Professional document already added.'}, status=status.HTTP_200_OK)
            except:
                pass

            serializer= agg_hhc_srv_prof_doc_dtls_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({'msg':'Professional document uploaded successfully.'},status=status.HTTP_200_OK)
        except:
            return Response({'msg':'Record not found'}, status=status.HTTP_200_OK)
        

    def put(self, request):
        clgref_id = get_prof(request)[1]
        mutable_data = request.data.copy()
        mutable_data['last_modified_by'] = clgref_id
        try:
            rdata = request.data
            pro = rdata['srv_prof_id']
            doc = rdata['doc_li_id']
            print("pro, doc", pro, doc)

            prof_int = agg_hhc_professional_documents.objects.get(srv_prof_id=pro, doc_li_id=doc)
            print("prof int", prof_int)
            if prof_int:
                serializer = 0
                serializer = agg_hhc_srv_prof_doc_dtls_serializer(prof_int, data=rdata)
                if serializer.is_valid():
                    serializer.save()
                    response_data={
                    'msg': 'Professional document updated successfully.'
                    }
                    return Response(response_data, status=status.HTTP_200_OK)
                return Response({'msg':'No Data Found'}, serializer.errors, status=status.HTTP_200_OK)
            return Response({'msg':'No Data Found'}, status=status.HTTP_200_OK)
        except:
            return Response({'msg':'Record not found'}, status=status.HTTP_200_OK)
        
        
class Prof_doc_list(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            srv_id = request.GET.get('srv_id')
            Prof_doc_list = agg_hhc_documents_list.objects.filter(professional_role=srv_id)
            if Prof_doc_list:
                print("Prof int dtls-- ", Prof_doc_list)
                serializer = agg_hhc_srv_prof_doc_list_serializer(Prof_doc_list, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({'Res_Data': {'msg':'Record not found'}}, status=status.HTTP_200_OK)
        except:
            return Response({'Res_Data': {'msg':'Record not found'}}, status=status.HTTP_200_OK)

        
class InvoiceApi(APIView):
    def get(self,request):
        eventID=request.data['eve_id']
        p_HHCID = agg_hhc_events.objects.get(eve_id=eventID)
        serialized_data = InvoiceSerializer(p_HHCID)
        return Response(serialized_data.data)
    

class Register_prof_int_schedule(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]

    serializer_class = reg_prof_api_serializer
    serializer_class2 = colleage_add_prof_data
    # def get_object(self, srv_prof_id):
    #     try:
    #         return agg_hhc_service_professionals.objects.get(srv_prof_id=srv_prof_id)
    #     except agg_hhc_service_professionals.DoesNotExist:
    #         return Response(status=status.HTTP_404_NOT_FOUND)
    
    def get_object(self, clg_ref_id):
        try:
            return agg_hhc_service_professionals.objects.get(clg_ref_id=clg_ref_id)
        except agg_hhc_service_professionals.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
    
    def get_object2(self, clg_ref_id):
        try:
            return agg_com_colleague.objects.get(clg_ref_id=clg_ref_id)
        except agg_com_colleague.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    # def put(self, request,srv_prof_id,clg_ref_id):
    def put(self, request,clg_ref_id):
        print("1st request data: ", request.data)


        instance = self.get_object(clg_ref_id)
       
        serializer = self.serializer_class(instance, data=request.data, partial=True)
     

        prof_fullname = request.data.get('prof_fullname', None)
        dob = request.data.get('dob', None)
        gender = request.data.get('gender', None)
        clg_email = request.data.get('email_id', None)
        phone_no = request.data.get('phone_no', None)
        eme_contact_no = request.data.get('eme_contact_no', None)
        prof_zone_id = request.data.get('prof_zone_id', None)
        state_name = request.data.get('state_name', None)
        prof_address = request.data.get('prof_address', None)

        is_exist_email_in_clg = agg_com_colleague.objects.filter(clg_work_email_id= clg_email)
        is_exist_phone_in_clg = agg_com_colleague.objects.filter(clg_Work_phone_number= eme_contact_no)

        print("&*&*&Email--  ", is_exist_email_in_clg)
        print("&*&*&Phone--  ", is_exist_phone_in_clg)

        # Commented for a while (imp)
        # if is_exist_email_in_clg.exists():
        #     return Response({"error":"Email Already Exists"})
        
        # if is_exist_phone_in_clg.exists():
        #     return Response({"error":"Phone Number Already Exists"})
        


       
        zone_id = agg_hhc_professional_zone.objects.get(prof_zone_id=prof_zone_id)
        print("Zone id is------ ", zone_id)
       

        data2 = {
            'clg_email': clg_email, 
            'clg_first_name':prof_fullname, 
            'clg_gender': gender, 
            # 'clg_mobile_no':phone_no, 
            'clg_Work_phone_number': phone_no,
            'clg_Date_of_birth': dob,
            'clg_address':prof_address, 
            'clg_state':state_name,
            'clg_district': zone_id.prof_zone_id
    }


        try:
            print("Request data***: ", request.data)
            if serializer.is_valid():
                # instance.prof_registered = True
                serializer.save()

            
            set_status_prof_registered = agg_hhc_service_professionals.objects.get(clg_ref_id=clg_ref_id)
            set_status_prof_registered.prof_registered = True
            set_status_prof_registered.save()

            instance2 = self.get_object2(clg_ref_id)
            serializer2 = self.serializer_class2(instance2, data=data2, partial=True)

            if serializer2.is_valid():
                serializer2.save()
                # return Response({ 'dataa2': serializer2.data}, status=status.HTTP_200_OK)
            else:
                print("Validation Errors:", serializer2.errors)
                
                return Response({'error': serializer2.errors}, status=status.HTTP_400_BAD_REQUEST)

            return Response({'Prof_data': serializer.data, 'Collegue_data': serializer2.data, "error":None}, status=status.HTTP_200_OK)
        # except ValidationError as e:
        #     return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Total_employee(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,da):
        try:
            if(da==1):
                onrole=agg_hhc_service_professionals.objects.filter(status=1,professinal_status=4)
            elif(da==2):
                week=timezone.now().date()-timedelta(days=7)
                onrole=agg_hhc_service_professionals.objects.filter(status=1,professinal_status=4,added_date__lt=week)
            elif(da==3):
                month=timezone.now().date()
                month=month.replace(day=1)
                onrole=agg_hhc_service_professionals.objects.filter(status=1,professinal_status=4,added_date__lt=month)
            total_emp=onrole.all().count()
            oncall=onrole.filter(Job_type=1 or 3).count()
            fulltime=onrole.filter(Job_type=2).count()
            if (total_emp>0):
                oncall_percentage = (oncall/total_emp)*100 if oncall > 0 else 0
                fulltime_percentage = (fulltime/total_emp)*100 if fulltime>0 else 0
            else:
                oncall_percentage=0
                fulltime_percentage=0
            return Response({'total_emp':total_emp,'oncall':oncall,'fulltime':fulltime,'oncall_percentage':round(oncall_percentage),'fulltime_percentage':round(fulltime_percentage)})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class male_female_employee(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,da):
        try:
            if(da==1):
                onrole=agg_hhc_service_professionals.objects.filter(status=1,professinal_status=4)    
            elif(da==2):
                week=timezone.now().date()-timedelta(days=7)
                onrole=agg_hhc_service_professionals.objects.filter(status=1,professinal_status=4,added_date__lt=week)
            elif(da==3):
                month=timezone.now().date()
                month=month.replace(day=1)
                onrole=agg_hhc_service_professionals.objects.filter(status=1,professinal_status=4,added_date__lt=month)
            return Response({'Male':onrole.filter(gender=1).count(),'Female':onrole.filter(gender=2).count()})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class new_manpower_status(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,da):
        try:
            if(da==1):
                interv=agg_hhc_service_professionals.objects.filter(status=1)
            elif(da==2):
                week=timezone.now().date()-timedelta(days=7)
                interv=agg_hhc_service_professionals.objects.filter(added_date__lt=week,status=1)
            elif(da==3):
                month=timezone.now().date()
                month=month.replace(day=1)
                interv=agg_hhc_service_professionals.objects.filter(added_date__lt=month,status=1)
            interview=interv.filter(professinal_status=3).count()
            Applicant=interv.filter(professinal_status=1 or 2 or 5).count()
            total=interview+Applicant
            if total >0:
                interview_percentage=(interview/total)*100 if interview > 0 else 0
                Applicant_percentage=(Applicant/total)*100 if Applicant >0 else 0
            else:
                interview_percentage=0
                Applicant_percentage=0
            return Response({"interview_scheduled":interview,"job_Applicant":Applicant,"interview_percentage":interview_percentage,"Applicant_percentage":Applicant_percentage})
        except Exception as e:
            return Response({'error':str(e)})
        

class post_interview(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,da):
        try:
            if(da==1):
                prof_inter_datils=agg_hhc_prof_interview_details.objects.filter(status=1)
            elif(da==2):
                week=timezone.now().date()
                week=week-timedelta(days=7)
                prof_inter_datils=agg_hhc_prof_interview_details.objects.filter(status=1,added_date__lt=week)
            elif(da==3):
                month=timezone.now().date()
                month=month.replace(day=1)
                prof_inter_datils=agg_hhc_prof_interview_details.objects.filter(status=1,added_date__lt=month)
            shortlisted=prof_inter_datils.filter(int_status=5).count()
            selection=prof_inter_datils.filter(int_status=1).count()
            rejection=prof_inter_datils.filter(int_status=2).count()
            total=shortlisted+selection+rejection
            if(total>0):
                shortlisted_perc=(shortlisted/total)*100 if shortlisted>0 else 0
                selection_perc=(selection/total)*100 if selection>0 else 0
                rejection_perc=(rejection/total)*100 if rejection>0 else 0
            else:
                shortlisted_perc=0
                selection_perc=0
                rejection_perc=0
            return Response({'shortlisted':shortlisted,'selection':selection,'rejection':rejection,'shortlisted_perc':shortlisted_perc,'selection_perc':selection_perc,'rejection_perc':rejection_perc})
        except Exception as e:
            return Response({'data':str(e)})
    
class onboarding(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,da):
        try:
            if(da==1):
                documt=agg_hhc_service_professionals.objects.filter(status=1)
            elif(da==2):
                week=timezone.now().date()-timedelta(days=7)
                documt=agg_hhc_service_professionals.objects.filter(status=1,added_date__lt=week)
            elif(da==3):
                month = timezone.now().date()
                month = month.replace(day=1)
                documt = agg_hhc_service_professionals.objects.filter(status=1, added_date__lt=month)
            document_verification=documt.filter(professinal_status=5).count()
            onboarding=documt.filter(professinal_status=4).count()
            return Response({'document_verification':document_verification,'onboarding':onboarding})
        except Exception as e:
            return Response({'error':str(e)})
        
        
class employee_roles(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,da):
        try:
            lst=[]
            services=agg_hhc_services.objects.filter(status=1)
#---------------------------------------------------working on api------------------------------------------------------------------------------
            if(da==1):
                active_emp_data=agg_hhc_service_professionals.objects.filter(status=1,professinal_status=4,srv_id__isnull=False)
            elif(da==2):
                week=timezone.now().date()-timedelta(days=7)
                active_emp_data=agg_hhc_service_professionals.objects.filter(added_date__lt=week,status=1,professinal_status=4,srv_id__isnull=False)
            elif(da==3):
                month=timezone.now().date()
                month=month.replace(day=1)
                active_emp_data=agg_hhc_service_professionals.objects.filter(added_date__lt=month,status=1,professinal_status=4,srv_id__isnull=False)
            else:
                return Response({"message":lst})
            active_emp=active_emp_data.filter(status=1).count()
            for i in services:
                print(i.srv_id)
                professional_count=active_emp_data.filter(srv_id=i.service_title).count()
                if active_emp>0:
                    # professional_percent=(active_emp/100)*professional_count if professional_count>0 else 0
                    # professional_percent=(active_emp/professional_count)*100 if professional_count>0 else 0
                    professional_percent=(professional_count/active_emp)*100 if professional_count>0 else 0

                else:
                    professional_percent=0
                info={'srv_id':i.srv_id,'service_title':i.service_title,'professional_count':professional_count,'professional_percent':round(professional_percent)}
                lst.append(info)
            return Response({"message":lst})
        except Exception as e:
            return Response({"error":str(e)})






from django.shortcuts import get_object_or_404



class edit_register_professional_from_hr(APIView):

    def get(self, request, prof_id):
        """
        Retrieve professional details by professional ID.
        """
        try:
            professional = agg_hhc_service_professionals.objects.get(srv_prof_id=prof_id)
        except agg_hhc_service_professionals.DoesNotExist:
            return Response({'error': 'Professional not found'}, status=404)

        serialized_data = Register_professioanl_for_professional(professional).data
        return Response(serialized_data)

    def put(self, request, prof_id):
        """
        Update professional details by professional ID.
        """
        try:
            professional = agg_hhc_service_professionals.objects.get(srv_prof_id=prof_id)
        except agg_hhc_service_professionals.DoesNotExist:
            return Response({'error': 'Professional not found'}, status=404)
        
        title = request.data.get('title')
        mapped_title = title_mapping.get(title, title)  
        # Update colleague information if needed
        colleague_data = {
            "clg_email": request.data.get('email_id'),
            "clg_first_name": (mapped_title  + ' ' + request.data.get('first_name') + ' ' + request.data.get('last_name')),
            "clg_gender": request.data.get('gender'),
            "clg_mobile_no": request.data.get('phone_no'),
            "clg_Work_phone_number": request.data.get('phone_no'),
            "clg_Date_of_birth": request.data.get('dob'),
            "clg_state": request.data.get('state_name'),
        }

        colleague = agg_com_colleague.objects.filter(clg_Work_phone_number=request.data.get('phone_no')).first()
        colleague_serializer = Register_professioanl_for_colleague(colleague, data=colleague_data)
        
        if colleague_serializer.is_valid():
            colleague_serializer.save()
        else:
            return Response({'error': colleague_serializer.errors})

        # Update professional data
        request.data['prof_fullname'] = mapped_title  + ' ' + request.data.get('first_name') + ' ' + request.data.get('last_name')
        professional_serializer = Register_professioanl_for_professional(professional, data=request.data)

        if professional_serializer.is_valid():
            professional_serializer.save()
        else:
            return Response({'error': professional_serializer.errors})

        # Update qualification details
        try:
            qualification = agg_hhc_service_professional_details.objects.get(srv_prof_id=prof_id)
            qualification_serializer = GET_prof_qualification_serializer(qualification, data=request.data)
        except agg_hhc_service_professional_details.DoesNotExist:
            qualification_serializer = GET_prof_qualification_serializer(data=request.data)

        if qualification_serializer.is_valid():
            qualification_serializer.save()
        else:
            return Response({'error': qualification_serializer.errors})

        # Update interview details
        try:
            interview = agg_hhc_prof_interview_details.objects.get(srv_prof_id=prof_id)
            interview_serializer = add_prof_schedule_interview(interview, data=request.data)
        except agg_hhc_prof_interview_details.DoesNotExist:
            interview_serializer = add_prof_schedule_interview(data=request.data)

        if interview_serializer.is_valid():
            interview_serializer.save()
        else:
            return Response({'error': interview_serializer.errors})

        # Update sub-services
        sub_services_ids = request.data.get('sub_services', [])
        saved_sub_services = []
        for sub_service_id in sub_services_ids:
            request.data['sub_srv_id'] = sub_service_id
            sub_services_serializer = add_prof_sub_services_serializer(data=request.data)
            if sub_services_serializer.is_valid():
                sub_service = sub_services_serializer.save()
                saved_sub_services.append(sub_service)

        # Update zones
        prof_zones_ids = request.data.get('prof_zones', [])
        saved_zones = []
        for zone_id in prof_zones_ids:
            try:
                zone = agg_hhc_professional_zone.objects.get(prof_zone_id=zone_id)
                prof_location = agg_hhc_professional_location.objects.filter(
                    srv_prof_id=prof_id,
                    location_name=zone.Name
                ).first()

                if prof_location:
                    zone_data = {"srv_prof_id": prof_id, "location_name": prof_location.location_name}
                    zone_serializer = add_prof_zones_serializer(prof_location, data=zone_data)
                else:
                    zone_data = {"srv_prof_id": prof_id, "location_name": zone.Name}
                    zone_serializer = add_prof_zones_serializer(data=zone_data)

                if zone_serializer.is_valid():
                    saved_zone = zone_serializer.save()
                    saved_zones.append(saved_zone)
                else:
                    return Response({"error": "Invalid zone data"}, status=400)

            except agg_hhc_professional_zone.DoesNotExist:
                return Response({'error': 'Invalid zone specified'})

        response_data = {
            "colleague": serialize_instance(colleague, Register_professioanl_for_colleague),
            "professional": serialize_instance(professional, Register_professioanl_for_professional),
            "qualification": serialize_instance(qualification, GET_prof_qualification_serializer) if qualification else None,
            "interview": serialize_instance(interview, add_prof_schedule_interview) if interview else None,
            "sub_services": [serialize_instance(sub_service, add_prof_sub_services_serializer) for sub_service in saved_sub_services],
            "zones": [serialize_instance(zone, add_prof_zones_serializer) for zone in saved_zones],
        }

        return Response(response_data, status=200)






        
# class Register_professioanl_for_HR(APIView):
#     # renderer_classes = [UserRenderer]
#     # permission_classes = [IsAuthenticated]
#     # professional = agg_hhc_service_professionals.get 
#     def post(self, request):
        
#         print('1')
#         data1 = {
#             "clg_email":request.data['email_id'],
#             "clg_first_name":(request.data['first_name']+request.data['last_name']),
#             "clg_gender":request.data['gender'],
#             "clg_mobile_no":request.data['phone_no'],
#             "clg_Work_phone_number":request.data['phone_no'],
#             "clg_Date_of_birth":request.data['dob'],
#             # "clg_address":request.data['address'],
#             "clg_state":request.data['state_name'],

#         }
#         print('2')
#         try:
#             print('3')
#             professional=agg_com_colleague.objects.get(clg_Work_phone_number=request.data['phone_no'])
#             serializer = Register_professioanl_for_colleague(professional,data=data1)
#         except agg_com_colleague.DoesNotExist:
#             print('4')
#             serializer = Register_professioanl_for_colleague(data=data1)
#             if serializer.is_valid():
#                 colleague=serializer.save().clg_ref_id
#                 request.data['']=colleague
#             else:
#                 return Response({'error':serializer.errors})
#         except:
#             print('5')
#             return Response({'error':'colleague please enter another phone no'})
#         print('11')
#         request.data['prof_fullname']=request.data['first_name']+request.data['last_name']
#         try:
#             print('12')
#             professional = agg_hhc_service_professionals.objects.get(phone_no=request.data['phone_no'])
#             print('12')
#             professional =Register_professioanl_for_professional(professional,data=request.data)
#             print('12')
#         except agg_hhc_service_professionals.DoesNotExist:
#             print('13')
#             professional =Register_professioanl_for_professional(data=request.data)
#         if professional.is_valid():
#             professional_id=professional.save().srv_prof_id

#         else: 
#             return Response({'error':professional.errors})
#         print('21')
#         request.data['srv_prof_id']=professional_id
#         try:
#             print('121')
#             qulific = agg_hhc_service_professional_details.objects.get(srv_prof_id=professional_id)
#             qualification = add_prof_qualification_serializer(qulific, data=request.data)
#         except agg_hhc_service_professional_details.DoesNotExist:
#             print('213')
#             qualification = add_prof_qualification_serializer(data=request.data)
#         except:
#             return Response({'error':'duplicate service professional found'})
#         if qualification.is_valid():
#             print('1111')
#             qualification.save()
#             print('1223')
#         else:
#             return Response({'error':'something went wrong2'})
        
#         try:
#             print(';;1')
#             interview = agg_hhc_prof_interview_details.objects.get(srv_prof_id=professional_id)
#             interviews = add_prof_schedule_interview(interview, data=request.data)
#             print(';;2')
#         except agg_hhc_prof_interview_details.DoesNotExist:
#             print(';;3')
#             interviews = add_prof_schedule_interview(data=request.data)
#             print(';;4')
#         except:
#             return Response({'error':'duplicate service professional found'})
#         print(interviews)
#         if interviews.is_valid():
#             print(interviews,'123321')

#             interviews.save()
#             print('4332')
#         else:
#             return Response({'error':interviews.errors})
        
#         sub_services=(((request.data['sub_services']).replace('[','')).replace(']','')).split(',')
#         for i in sub_services:
#             request.data['sub_srv_id']=i
#             sub_services=add_prof_sub_services_serializer(data=request.data)
#             if sub_services.is_valid():
#                 sub_services.save()

#         professional_zones = (((request.data['prof_zones']).replace('[','')).replace(']','')).split(',')
#         for profs1 in professional_zones:
#             try:
#                 zone = agg_hhc_professional_zone.objects.get(prof_zone_id=profs1)
#                 profs = agg_hhc_professional_location.objects.filter(srv_prof_id=request.data['srv_prof_id'], location_name=zone.Name).first()
#                 print(profs, 'klasdjfuklj,sh')
#                 if profs:
#                     data2 = {"srv_prof_id":request.data['srv_prof_id'], "location_name":profs.location_name}
#                     print('try prof2;;;;;;;;;;;;;;;;')
#                     zone_serialized = add_prof_zones_serializer(profs, data=data2)
#                 else:
#                     data2 = {"srv_prof_id":request.data['srv_prof_id'], "location_name":zone.Name}
#                     print(data2, 'try prof223;;;;;;;;;;;;;;;;')
#                     zone_serialized = add_prof_zones_serializer(data=data2)
#                 if zone_serialized.is_valid():
#                     print('valid;;;;;;;;;;;;;;')
#                     zone_serialized.save()
#                     # return Response({'error':'zone not found'})
#                 # zone_serialized = add_prof_zones_serializer(profs)
#                 else: return Response({"error":"invalid data"})
#             except agg_hhc_professional_zone.DoesNotExist():
#                 return Response({'error':'please enter proper zone, it\'s not found'})
#         return Response((professional_id))







def serialize_instance(instance, serializer_class):
    if instance:
        serializer = serializer_class(instance)
        return serializer.data
    return None
class Register_professioanl_for_HR(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    # professional = agg_hhc_service_professionals.get 
    # def get(self, request, prof_id):
    #     try:
    #         get_data = agg_hhc_service_professionals.objects.get(srv_prof_id=prof_id)
    #     except agg_hhc_service_professionals.DoesNotExist:
    #         return Response({'error':'something went wrong'})
    #     serialized_data = Get_Register_professioanl_for_professional(get_data)
    #     print(serialized_data.data, 'serialized_data..............')
    #     return Response({serialized_data.data})


    # def get(self, request, prof_id=None):
    #     if prof_id:
    #         try:
    #             get_data = agg_hhc_service_professionals.objects.get(srv_prof_id=prof_id)
    #         except agg_hhc_service_professionals.DoesNotExist:
    #             return Response({'error': 'Professional not found'}, status=404)

    #         serialized_data = Get_Register_professioanl_for_professional(get_data)
    #         print(serialized_data.data, 'serialized_data..............')

    #         # Returning data in a dictionary format
    #         return Response(serialized_data.data)
    #     else :
    #         # get_data = agg_hhc_service_professionals.objects.all()
    #         # serialized_data = Get_Register_professioanl_for_professional(get_data, many=True)
    #         # return Response(serialized_data.data)
    #         return Response(None)



    # def post(self, request):
    #     data1 = {
    #         "clg_email": request.data.get('email_id'),
    #         "clg_first_name": (request.data.get('first_name') + request.data.get('last_name')),
    #         "clg_gender": request.data.get('gender'),
    #         "clg_mobile_no": request.data.get('phone_no'),
    #         "clg_Work_phone_number": request.data.get('phone_no'),
    #         "clg_Date_of_birth": request.data.get('dob'),
    #         "clg_state": request.data.get('state_name'),
    #     }

    #     professionals = agg_com_colleague.objects.filter(clg_Work_phone_number=request.data.get('phone_no'))
    #     if professionals.exists():
    #         professional = professionals.first()
    #         serializer = Register_professioanl_for_colleague(professional, data=data1)
    #     else:
    #         serializer = Register_professioanl_for_colleague(data=data1)

    #     if serializer.is_valid():
    #         colleague = serializer.save().clg_ref_id
    #         request.data['clg_ref_id'] = colleague
    #     else:
    #         return Response({'error': serializer.errors})

    #     request.data['prof_fullname'] = request.data.get('first_name') + request.data.get('last_name')

    #     try:
    #         professional = agg_hhc_service_professionals.objects.get(phone_no=request.data.get('phone_no'))
    #         professional_serializer = Register_professioanl_for_professional(professional, data=request.data)
    #     except agg_hhc_service_professionals.DoesNotExist:
    #         professional_serializer = Register_professioanl_for_professional(data=request.data)

    #     if professional_serializer.is_valid():
    #         professional = professional_serializer.save()
    #         professional_id = professional.srv_prof_id
    #         print("Saved professional:", professional.Job_type)
    #     else:
    #         print("Serializer errors:", professional_serializer.errors)
    #         return Response({'error': professional_serializer.errors})

    #     request.data['srv_prof_id'] = professional_id

    #     try:
    #         qualification = agg_hhc_service_professional_details.objects.get(srv_prof_id=professional_id)
    #         qualification_serializer = GET_prof_qualification_serializer(qualification, data=request.data)
    #     except agg_hhc_service_professional_details.DoesNotExist:
    #         qualification_serializer = GET_prof_qualification_serializer(data=request.data)

    #     if qualification_serializer.is_valid():
    #         qualification_serializer.save()
    #     else:
    #         return Response({'error': qualification_serializer.errors})

    #     try:
    #         interview = agg_hhc_prof_interview_details.objects.get(srv_prof_id=professional_id)
    #         interview_serializer = add_prof_schedule_interview(interview, data=request.data)
    #     except agg_hhc_prof_interview_details.DoesNotExist:
    #         interview_serializer = add_prof_schedule_interview(data=request.data)

    #     if interview_serializer.is_valid():
    #         interview_serializer.save()
    #     else:
    #         return Response({'error': interview_serializer.errors})

    #     saved_sub_services = []
    #     sub_services_ids = request.data.get('sub_services', [])
    #     for sub_service_id in sub_services_ids:
    #         request.data['sub_srv_id'] = sub_service_id
    #         sub_services_serializer = add_prof_sub_services_serializer(data=request.data)
    #         if sub_services_serializer.is_valid():
    #             sub_service = sub_services_serializer.save()
    #             saved_sub_services.append(sub_service)

    #     saved_zones = []
    #     prof_zones_ids = request.data.get('prof_zones', [])
    #     for zone_id in prof_zones_ids:
    #         try:
    #             zone = agg_hhc_professional_zone.objects.get(prof_zone_id=zone_id)
    #             prof_location = agg_hhc_professional_location.objects.filter(
    #                 srv_prof_id=professional_id,
    #                 location_name=zone.Name
    #             ).first()

    #             if prof_location:
    #                 zone_data = {"srv_prof_id": professional_id, "location_name": prof_location.location_name}
    #                 zone_serializer = add_prof_zones_serializer(prof_location, data=zone_data)
    #             else:
    #                 zone_data = {"srv_prof_id": professional_id, "location_name": zone.Name}
    #                 zone_serializer = add_prof_zones_serializer(data=zone_data)

    #             # if zone_serializer.is_valid():
    #             #     zone_serializer.save()

    #             if zone_serializer.is_valid():
    #                 saved_zone = zone_serializer.save()
    #                 saved_zones.append(saved_zone)
    #             else:
    #                 return Response({"error": "Invalid zone data"}, status=400)


    #         except agg_hhc_professional_zone.DoesNotExist:
    #             return Response({'error': 'Invalid zone specified'})

    #     # return Response({"srv_prof_id": professional_id})
    #     response_data = {
    #         "colleague": serialize_instance(colleague, Register_professioanl_for_colleague),
    #         "professional": serialize_instance(professional, Register_professioanl_for_professional),
    #         "qualification": serialize_instance(qualification, GET_prof_qualification_serializer),
    #         "interview": serialize_instance(interview, add_prof_schedule_interview),
    #         "sub_services": [serialize_instance(sub_service, add_prof_sub_services_serializer) for sub_service in saved_sub_services],
    #         "zones": [serialize_instance(zone, add_prof_zones_serializer) for zone in saved_zones],
    #     }

    #     return Response(response_data, status=201)        




    def post(self, request):

        title_mapping = {
            '1': 'Dr',
            '2': 'Mr',
            '3': 'Mrs'
        }
        
        title = request.data.get('title')
        mapped_title = title_mapping.get(title, title)   
        
        data1 = {
            "clg_email": request.data.get('email_id'),
            "clg_first_name": (mapped_title  + ' ' + request.data.get('first_name') + ' ' + request.data.get('last_name')),
            "clg_gender": request.data.get('gender'),
            "clg_mobile_no": request.data.get('phone_no'),
            "clg_Work_phone_number": request.data.get('phone_no'),
            "clg_Date_of_birth": request.data.get('dob'),
            "clg_state": request.data.get('state_name'),
        }

        professionals = agg_com_colleague.objects.filter(clg_Work_phone_number=request.data.get('phone_no'))
        if professionals.exists():
            professional = professionals.first()
            serializer = Register_professioanl_for_colleague(professional, data=data1)
        else:
            serializer = Register_professioanl_for_colleague(data=data1)

        if serializer.is_valid():
            colleague = serializer.save().clg_ref_id
            request.data['clg_ref_id'] = colleague
        else:
            return Response({'error': serializer.errors})

        request.data['prof_fullname'] = mapped_title  + ' ' + request.data.get('first_name') + ' ' + request.data.get('last_name')

        try:
            professional = agg_hhc_service_professionals.objects.get(phone_no=request.data.get('phone_no'))
            professional_serializer = Register_professioanl_for_professional(professional, data=request.data)
        except agg_hhc_service_professionals.DoesNotExist:
            professional_serializer = Register_professioanl_for_professional(data=request.data)

        if professional_serializer.is_valid():
            professional = professional_serializer.save()
            professional_id = professional.srv_prof_id
        else:
            return Response({'error': professional_serializer.errors})

        request.data['srv_prof_id'] = professional_id

        try:
            qualification = agg_hhc_service_professional_details.objects.get(srv_prof_id=professional_id)
            qualification_serializer = GET_prof_qualification_serializer(qualification, data=request.data)
        except agg_hhc_service_professional_details.DoesNotExist:
            qualification = None
            qualification_serializer = GET_prof_qualification_serializer(data=request.data)

        if qualification_serializer.is_valid():
            qualification_serializer.save()
        else:
            return Response({'error': qualification_serializer.errors})

        try:
            interview = agg_hhc_prof_interview_details.objects.get(srv_prof_id=professional_id)
            interview_serializer = add_prof_schedule_interview(interview, data=request.data)
        except agg_hhc_prof_interview_details.DoesNotExist:
            interview = None
            interview_serializer = add_prof_schedule_interview(data=request.data)

        if interview_serializer.is_valid():
            interview_serializer.save()
        else:
            return Response({'error': interview_serializer.errors})

        saved_sub_services = []
        sub_services_ids = request.data.get('sub_services', [])
        for sub_service_id in sub_services_ids:
            request.data['sub_srv_id'] = sub_service_id
            sub_services_serializer = add_prof_sub_services_serializer(data=request.data)
            if sub_services_serializer.is_valid():
                sub_service = sub_services_serializer.save()
                saved_sub_services.append(sub_service)

        saved_zones = []
        prof_zones_ids = request.data.get('prof_zones', [])
        for zone_id in prof_zones_ids:
            try:
                zone = agg_hhc_professional_zone.objects.get(prof_zone_id=zone_id)
                prof_location = agg_hhc_professional_location.objects.filter(
                    srv_prof_id=professional_id,
                    location_name=zone.Name
                ).first()

                if prof_location:
                    zone_data = {"srv_prof_id": professional_id, "location_name": prof_location.location_name}
                    zone_serializer = add_prof_zones_serializer(prof_location, data=zone_data)
                else:
                    zone_data = {"srv_prof_id": professional_id, "location_name": zone.Name}
                    zone_serializer = add_prof_zones_serializer(data=zone_data)

                if zone_serializer.is_valid():
                    saved_zone = zone_serializer.save()
                    saved_zones.append(saved_zone)
                else:
                    return Response({"error": "Invalid zone data"}, status=400)

            except agg_hhc_professional_zone.DoesNotExist:
                return Response({'error': 'Invalid zone specified'})

        response_data = {
            "colleague": serialize_instance(colleague, Register_professioanl_for_colleague),
            "professional": serialize_instance(professional, Register_professioanl_for_professional),
            "qualification": serialize_instance(qualification, GET_prof_qualification_serializer) if qualification else None,
            "interview": serialize_instance(interview, add_prof_schedule_interview) if interview else None,
            "sub_services": [serialize_instance(sub_service, add_prof_sub_services_serializer) for sub_service in saved_sub_services],
            "zones": [serialize_instance(zone, add_prof_zones_serializer) for zone in saved_zones],
        }

        return Response(response_data, status=201)









class qualification_get_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        try:
            quali_data=qualifications.objects.filter(status=1)
            serializer=qualifications_serializer(quali_data,many=True)
            return Response({'qualification':serializer.data})
        except Exception as e:
            return Response({"error":str(e)})
    
class qualification_specialization_get_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,qs):
        try:
            qs_data=qualification_specialization.objects.filter(quali_id=qs,status=1).order_by('specialization')
            serializer=qualification_specialization_serializer(qs_data,many=True)
            return Response({'specialization':serializer.data})
        except Exception as e:
            return Response({"error":str(e)})
        
# class professional_begining_status_api(APIView):
#     def get(self, request,prof_id):
#         prof_id=agg_hhc_service_professionals.objects.get(srv_prof_id=prof_id)
#         status_serializer = prof_status_serializer(prof_id)
#         print(status_serializer.data)
#         return Response(status_serializer.data)
    
#     def post(self, request, prof_id):
#         prof_id=agg_hhc_service_professionals.objects.get(srv_prof_id=prof_id)
#         status_serializer = prof_status_serializer(prof_id, data=request.data)
#         if status_serializer.is_valid():
#             status_serializer.save()
#         else:
#             return Response(status_serializer.errors)
#         return Response(status_serializer.data)


class professional_begining_status_api(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    def get(self, request,prof_id):
        try:
            prof_id=agg_hhc_service_professionals.objects.get(srv_prof_id=prof_id, status=1)
            status_serializer = prof_status_serializer(prof_id)
            return Response(status_serializer.data)
        except agg_hhc_service_professionals.DoesNotExist:
            return Response({"error": "Professional not found"}, status=404)
    
    def post(self, request, prof_id):
        try:
            prof_id=agg_hhc_service_professionals.objects.get(srv_prof_id=prof_id, status=1)
            status_serializer = prof_status_serializer(prof_id, data=request.data)
            if status_serializer.is_valid():
                status_serializer.save()
                return Response(status_serializer.data)
            else: 
                return Response({"error":status_serializer.errors})
        except agg_hhc_service_professionals.DoesNotExist:
            return Response({"error": "Professional not found"}, status=404)