from django.shortcuts import render
from rest_framework.views import APIView
from hhcweb.models import *
from hhchr.serializer import *
from django.db.models import Q
import jwt
from rest_framework.response import Response
from hhc_professional_app.renders import UserRenderer
from rest_framework.permissions import IsAuthenticated




####################mohin working on this start  ########

class Add_company_Post_API(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        serializer = register_company_post_serializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class Get_Company_Details_Get_API(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        snippet = agg_hhc_company.objects.all()
        serializers = register_company_post_serializer(snippet,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)

####################mohin working on this ends  ########




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




# ----------------------------------------------------- Manage Profile Page Amit --------------------------------------------------------------


#  ______________________ Professional Payment Details API __________________________________________
class get_Prof_Payment_Detail_API(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]    
    def get(self, request, srv_prof_id=None):
        try:
            if srv_prof_id is None:
                raise ValidationError("srv_prof_id is required.")
            
            payment_detail = agg_hhc_service_professionals.objects.get(srv_prof_id=srv_prof_id)
            datttttaaa=[]
            sud =  agg_hhc_professional_sub_services.objects.filter(srv_prof_id=payment_detail.srv_prof_id, status=1)
            for i in sud:
                dt = {
                    'prof_sub_srv_id': i.prof_sub_srv_id if i.prof_sub_srv_id else None,
                    'srv_prof_id': i.srv_prof_id.srv_prof_id if i.srv_prof_id else None,
                    'srv_prof_email': i.srv_prof_id.email_id if i.srv_prof_id else None,
                    'Sub_srv_id':i.sub_srv_id.sub_srv_id if i.sub_srv_id else None,
                    'sub_srv_name':i.sub_srv_id.recommomded_service if i.sub_srv_id else None,
                    'prof_cost':i.sub_srv_id.cost if i.sub_srv_id else None,
                    'cost_prof_given': i.prof_cost if i.prof_cost else None,
                }

                datttttaaa.append(dt)

            data = {
                'prof_id':payment_detail.srv_prof_id if payment_detail else None,
                'prof_name':payment_detail.prof_fullname if payment_detail else None,
                'prof_email':payment_detail.email_id if payment_detail else None,
                'prof_code':payment_detail.professional_code if payment_detail else None,
                'prof_srv_id':payment_detail.srv_id.srv_id if payment_detail.srv_id else None,
                'prof_srv_name':payment_detail.srv_id.service_title if payment_detail.srv_id else None,
                'sub_srv_data':datttttaaa
            }
            # serializer = get_prof_payment_details_serializer(payment_detail, many=True)
            return Response(data, status=status.HTTP_200_OK)
        
        except ValidationError as val_error:
            logger.error(f"Validation error: {val_error}")
            return Response({'Res_Data': {'msg': 'Invalid data provided', 'error': str(val_error)}}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, srv_prof_id=None):
        # Check if data is a list of records
        if not isinstance(request.data, list):
            return Response(
                {"error": "Request data should be a list of objects"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        response_data = []
        errors = []
        
        # Iterate over each record in the list
        for record in request.data:
            prof_sub_srv_id = record.get('prof_sub_srv_id')
            record_srv_prof_id = record.get('srv_prof_id', srv_prof_id)  # Use srv_prof_id from URL if not in record

            # Validate presence of prof_sub_srv_id and srv_prof_id
            if not prof_sub_srv_id or not record_srv_prof_id:
                errors.append({
                    "prof_sub_srv_id": prof_sub_srv_id,
                    "srv_prof_id": record_srv_prof_id,
                    "error": "prof_sub_srv_id and srv_prof_id are required fields"
                })
                continue

            # Try to fetch the record by srv_prof_id and prof_sub_srv_id
            try:
                instance = agg_hhc_professional_sub_services.objects.get(
                    srv_prof_id=record_srv_prof_id,
                    prof_sub_srv_id=prof_sub_srv_id
                )
            except agg_hhc_professional_sub_services.DoesNotExist:
                errors.append({
                    "prof_sub_srv_id": prof_sub_srv_id,
                    "srv_prof_id": record_srv_prof_id,
                    "error": "Record not found"
                })
                continue

            # Update only allowed fields
            serializer = Prof_payement_details_serializer(
                instance, 
                data=record, 
                partial=True
            )
            
            if serializer.is_valid():
                serializer.save()
                response_data.append(serializer.data)
            else:
                errors.append({
                    "prof_sub_srv_id": prof_sub_srv_id,
                    "srv_prof_id": record_srv_prof_id,
                    "error": serializer.errors
                })
        
        # Prepare the final response
        return Response({
            "updated_records": response_data,
            "errors": errors
        }, status=status.HTTP_200_OK if response_data else status.HTTP_400_BAD_REQUEST)

#  ______________________ Professional Payment Details API __________________________________________






#  ___________________________ Onboarding Amit ___________________________________


class Onboarding_status_bar_API(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]    
    def get(self, request, srv_prof_id):
        try:
            # Initialize counts
            score = 0
            total = 0
            srv_pro_InTrId = {}

            # Fetch service professional data
            try:
                service_professional = agg_hhc_service_professionals.objects.get(srv_prof_id=srv_prof_id)
            except agg_hhc_service_professionals.DoesNotExist:
                return Response({
                    "error": "Service professional with the specified ID was not found."
                }, status=status.HTTP_404_NOT_FOUND)

            # srv_pro_InTrId_total will be the total count of fields in service_professional that require verification
            srv_pro_InTrId_total = 0

            # Collect each status and increment srv_pro_InTrId_total
            induction = service_professional.induction
            training = service_professional.training
            id_card = service_professional.id_card

            # Set the status for each field in srv_pro_InTrId
            srv_pro_InTrId["induction"] = induction
            srv_pro_InTrId["training"] = training
            srv_pro_InTrId["id_card"] = id_card

            # Calculate srv_pro_InTrId_total as count of fields that can be verified (either 1 or 2)
            srv_pro_InTrId_total = 3

            # Calculate verified statuses (where value is 1)
            score += int(induction == 1) + int(training == 1) + int(id_card == 1)

            # Fetch count of documents with prof_doc=1 from agg_hhc_documents_list
            try:
                document_list_prof = agg_hhc_documents_list.objects.filter(prof_doc=1).count()
            except Exception:
                return Response({
                    "error": "Unable to retrieve the list of documents with prof_doc set to 1."
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Get list of doc_li_id values from agg_hhc_documents_list
            try:
                document_list_ids = agg_hhc_documents_list.objects.values_list('doc_li_id', flat=True)
            except Exception:
                return Response({
                    "error": "Unable to retrieve document list IDs."
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Fetch count of professional documents for srv_prof_id that have matching doc_li_id in the document list
            try:
                document_prof_avalable = agg_hhc_professional_documents.objects.filter(
                    srv_prof_id=srv_prof_id,
                    doc_li_id__in=document_list_ids
                ).count()
            except Exception:
                return Response({
                    "error": "Unable to retrieve professional documents for the specified ID."
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Fetch verified documents in agg_hhc_professional_documents with matching doc_li_id
            try:
                verified_documents = agg_hhc_professional_documents.objects.filter(
                    srv_prof_id=srv_prof_id,
                    doc_li_id__in=document_list_ids,
                    isVerified=True
                ).count()
            except Exception:
                return Response({
                    "error": "Unable to retrieve verified documents for the specified ID."
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Add verified_documents to score
            score += verified_documents

            # Calculate total as sum of srv_pro_InTrId_total
            total = srv_pro_InTrId_total + document_list_prof

            # Calculate the completion percentage
            completion_percentage = (score / total) * 100 if total > 0 else 0

            # Return response with calculated values and detailed breakdown
            return Response({
                "srv_prof_id": srv_prof_id,
                "completion_percentage": round(completion_percentage, 2),
                "Total": total,
                "Score": score,
                "document_list_prof": document_list_prof,
                "document_prof_avalable": document_prof_avalable,
                "srv_pro_InTrId_total": srv_pro_InTrId_total,
                "srv_pro_InTrId": srv_pro_InTrId
            })

        except Exception:
            return Response({
                "error": "An unexpected error occurred while processing the request."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#  ___________________________ Onboarding Amit ___________________________________

# ___________________________________ External Professional LIST API Get _______________________
from django.utils.dateparse import parse_date
class external_prof_list_Views(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]    
    def get(self, request):
        prof_compny_filter = request.query_params.get('prof_compny', None)#added Filter Mohin
        from_date = request.query_params.get('from_date', None) #added Filter Mohin
        to_date = request.query_params.get('to_date', None)#added Filter Mohin
        try:
            Prof_int = agg_hhc_service_professionals.objects.filter(status = 1).exclude(Q(prof_compny=1) | Q(prof_compny=None)).order_by('-added_date')
            
            if prof_compny_filter:##added Filter Mohin
                Prof_int = Prof_int.filter(prof_compny=prof_compny_filter)##added Filter Mohin
                
            if from_date:
                parsed_from_date = parse_date(from_date)
                if parsed_from_date:
                    Prof_int = Prof_int.filter(added_date__gte=parsed_from_date)
                else:
                    return Response({"error": "Invalid from_date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

            if to_date:
                parsed_to_date = parse_date(to_date)
                if parsed_to_date:
                    Prof_int = Prof_int.filter(added_date__lte=parsed_to_date)
                else:
                    return Response({"error": "Invalid to_date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)
                
            serializer = External_Prof_List_Get_Serializer_API(Prof_int, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except ObjectDoesNotExist:
            return Response({"error": "Professional service data not found."},status=status.HTTP_404_NOT_FOUND)
        
        except ValidationError:
            return Response({"error": "Invalid data provided."},status=status.HTTP_400_BAD_REQUEST)
        
        except DatabaseError:
            return Response({"error": "Database error encountered."},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        except APIException as e:
            return Response({"error": "API error occurred."},status=e.status_code if hasattr(e, 'status_code') else status.HTTP_400_BAD_REQUEST)
        
        # except Exception:
        #     return Response({"error": "An unexpected error occurred."},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            error_message = "An unexpected error occurred."
            logger.error(f"{error_message}: {str(e)}")
            return Response({
                "error": error_message,
                "details": str(e),
                "traceback": traceback.format_exc()
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)   
        

class external_prof_list_id_wise_Views(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, srv_prf_id):
        print(srv_prf_id,'prof_instance')
        try:
            print(srv_prf_id,'prof_instance')
            prof_instance = agg_hhc_service_professionals.objects.get(srv_prof_id=srv_prf_id)
            # if prof_instance:
            #     print(prof_instance,'prof_instance')
            #     return Response({"error": "Professional service data not found."}, status=status.HTTP_404_NOT_FOUND)
            # else:
            #     return Response({"error": "ffffffffff."}, status=status.HTTP_404_NOT_FOUND)
            if not prof_instance.DoesNotExist():
                return Response({"error": "Professional service data not found."}, status=status.HTTP_404_NOT_FOUND)
            serializer = Exter_Prof_Action_Get_Serializer(prof_instance, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)            
        
        except ObjectDoesNotExist:
            return Response({"error": "Professional service data not found."},status=status.HTTP_404_NOT_FOUND)
        
        except ValidationError:
            return Response({"error": "Invalid data provided."},status=status.HTTP_400_BAD_REQUEST)
        
        except DatabaseError:
            return Response({"error": "Database error encountered."},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        except APIException as e:
            return Response({"error": "API error occurred."},status=e.status_code if hasattr(e, 'status_code') else status.HTTP_400_BAD_REQUEST)
        
        # except Exception:
        #     return Response({"error": "An unexpected error occurred."},status=status.HTTP_500_INTERNAL_SERVER_ERROR)        
        except Exception as e:
            error_message = "An unexpected error occurred."
            logger.error(f"{error_message}: {str(e)}")
            return Response({
                "error": error_message,
                "details": str(e),
                "traceback": traceback.format_exc()
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 

# ___________________________________ External Professional LIST API Get _______________________
# ___________________________________ External Professional Ongoing Service API ________________________________
class External_pro_Ongoing_Eve(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, prof_compny):
        try:
            try:
                prof_compny = int(prof_compny)
            except ValueError:
                return Response({"error": "Invalid company ID provided. It must be an integer."}, status=400)
            
            professionals = agg_hhc_service_professionals.objects.filter(prof_compny_id=prof_compny, prof_registered=True, prof_interviewed=True, prof_doc_verified=True )
            professionals = professionals.filter(external_prof_approve_reject__approve_reject=1)

            if not professionals.exists():
                return Response({"error": "No professionals found for the provided company ID."}, status=404)

            # if 'service_id' in request.query_params:
            #     service_id = request.query_params.get('service_id')
            #     print (service_id)
            #     gsd = agg_hhc_services.objects.get(srv_id=service_id)
            #     professionals = professionals.filter(srv_id=gsd)
            #     print(professionals)
            #     if not professionals.exists():
            #         return Response({"error": "Service ID data not found for the provided service."}, status=404)
            
            
            
            # epoc = agg_hhc_event_plan_of_care.objects.filter(status=1)
            if 'form_date' in request.query_params and 'end_date' in request.query_params:
                start_date_str = request.query_params.get('form_date')
                end_date_str = request.query_params.get('end_date')
                form_date = datetime.datetime.strptime(start_date_str, '%Y-%m-%d')
                end_date = datetime.datetime.strptime(end_date_str, '%Y-%m-%d')
                if 'service_id' in request.query_params:
                    service_id = request.query_params.get('service_id')
                    print (service_id)
                    gsd = agg_hhc_services.objects.get(srv_id=service_id)
                
                    epoc = agg_hhc_event_plan_of_care.objects.filter(srv_id=gsd,start_date__gte=form_date,end_date__lte=end_date)
                else:
                    epoc = agg_hhc_event_plan_of_care.objects.filter(start_date__gte=form_date,end_date__lte=end_date)
            else:
                today = datetime.datetime.today()
                form_date = datetime.datetime(today.year, today.month, 1)  
                next_month = datetime.datetime(today.year, today.month + 1, 1) if today.month < 12 else datetime.datetime(today.year + 1, 1, 1)
                end_date = next_month - timedelta(days=1)
                if 'service_id' in request.query_params:
                    service_id = request.query_params.get('service_id')
                    print (service_id)
                    gsd = agg_hhc_services.objects.get(srv_id=service_id)
                
                    epoc = agg_hhc_event_plan_of_care.objects.filter(srv_id=gsd,start_date__gte=form_date,end_date__lte=end_date)
                else:
                    epoc = agg_hhc_event_plan_of_care.objects.filter(start_date__gte=form_date,end_date__lte=end_date)

                # epoc = agg_hhc_event_plan_of_care.objects.filter(start_date__gte=form_date,end_date__lte=end_date)
                
            ev_idsss = epoc.values_list('eve_id', flat=True).distinct()
            lulu = []
            print(ev_idsss)
            for i in ev_idsss:
                dtl = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i,srv_prof_id__in=professionals, status=1)
                iiiid = dtl.values_list('eve_id', flat=True).distinct()
                lulu.append(iiiid)
            data = agg_hhc_events.objects.filter(Q(event_status=2) | Q(event_status=3), eve_id__in=lulu, status=1)
            
            # serialized_data = Ongoing_Eve_serializer(data, many=True)
            # return Response(serialized_data.data)
            amit = []
            for i in data:

                ddddtl = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i,srv_prof_id__in=professionals,actual_StartDate_Time__range=(form_date,end_date), status=1)
                dddddd = {
                    'eve_id':i.eve_id if i.eve_id else None,
                    'event_code':i.event_code if i else None,
                    'patient_name':i.agg_sp_pt_id.name if i.agg_sp_pt_id else None,
                    'caller_no':i.caller_id.phone if i.caller_id else None,
                    'professional_id':ddddtl[0].srv_prof_id.srv_prof_id if ddddtl[0].srv_prof_id else None,
                    'professional_name':ddddtl[0].srv_prof_id.prof_fullname if ddddtl[0].srv_prof_id else None,
                    'professional_email':ddddtl[0].srv_prof_id.email_id if ddddtl[0].srv_prof_id else None, # added New
                    'service_name':ddddtl[0].eve_poc_id.srv_id.service_title if ddddtl[0].eve_poc_id and ddddtl[0].eve_poc_id.srv_id else None,
                    'service_id':ddddtl[0].eve_poc_id.srv_id.srv_id if ddddtl[0].eve_poc_id and ddddtl[0].eve_poc_id.srv_id else None,
                    'st_date':ddddtl[0].actual_StartDate_Time if ddddtl[0].actual_StartDate_Time else None,
                    'en_date':ddddtl.last().actual_StartDate_Time if ddddtl[0].actual_StartDate_Time else None,
                }
                amit.append(dddddd)
            
            return Response(amit)


        except TypeError as e:
            return Response({"error": "Data type mismatch.", "details": str(e)}, status=400)
        
        except Exception as e:
            return Response({
                "error": "An unexpected error occurred.",
                "details": str(e),
                "traceback": traceback.format_exc()
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
        

# ___________________________________ External Professional Ongoing Service API ________________________________




# _____________ Onbording Date Of Joining Amit _____________________- 
class hr_Onbording_doj_add_Views(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]    
    def get(self, request, srv_prof):
        try:

            professional = agg_hhc_service_professionals.objects.filter(srv_prof_id=srv_prof).last()

            if not professional:
                raise NotFound("No professional found with the given srv_prof_id.")

            serializer = hr_Onbording_doj_add_serializer(professional, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)

        except ParseError as parse_error:
            return Response({'Res_Data': {'msg': 'Error parsing request data', 'error': str(parse_error)}}, status=status.HTTP_400_BAD_REQUEST)

        except NotFound as not_found_error:
            return Response({'Res_Data': {'msg': 'No data found', 'error': str(not_found_error)}}, status=status.HTTP_404_NOT_FOUND)

        except FieldError as field_error:
            return Response({'Res_Data': {'msg': 'Invalid field in query parameters', 'error': str(field_error)}}, status=status.HTTP_400_BAD_REQUEST)

        except DatabaseError as db_error:
            return Response({'Res_Data': {'msg': 'Database error occurred', 'error': str(db_error)}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            return Response({'Res_Data': {'msg': f'An unexpected error occurred: {str(e)}'}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, srv_prof):
        try:
            data = request.data
            try:
                professional_instance = agg_hhc_service_professionals.objects.get(srv_prof_id=srv_prof)
            except agg_hhc_service_professionals.DoesNotExist:
                return Response({
                    'Res_Data': {
                        'msg': f"No record found for srv_prof_id {srv_prof} in agg_hhc_service_professionals."
                    }
                }, status=status.HTTP_404_NOT_FOUND)
            professional_data = {
                'srv_prof_id': srv_prof, 
                'doj': data.get('doj', professional_instance.doj),
                'last_modified_by': data.get('last_modified_by', professional_instance.last_modified_by)
            }

            professional_serializer = hr_Onbording_doj_add_serializer(
                professional_instance, data=professional_data, partial=True
            )

            if not professional_serializer.is_valid():
                return Response({
                    'Res_Data': {
                        'msg': 'Validation error in agg_hhc_service_professionals data',
                        'errors': professional_serializer.errors
                    }
                }, status=status.HTTP_400_BAD_REQUEST)

            ex_professional_data = {
                'srv_prof_id': srv_prof,
                'Join_Date': data.get('Join_Date'),
                'last_modified_by': data.get('last_modified_by'),
                'added_by': data.get('added_by')
            }

            ex_professional_serializer = ex_prof(data=ex_professional_data)

            if not ex_professional_serializer.is_valid():
                return Response({
                    'Res_Data': {
                        'msg': 'Validation error in agg_hhc_EX_professional_Records data',
                        'errors': ex_professional_serializer.errors
                    }
                }, status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():
                professional_serializer.save()
                ex_professional_serializer.save()

            return Response({
                'Res_Data': {
                    'msg': 'Record updated successfully in agg_hhc_service_professionals and new entry added in agg_hhc_EX_professional_Records.',
                    'professional_data': professional_serializer.data,
                    'ex_professional_data': ex_professional_serializer.data
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'Res_Data': {
                    'msg': f'An unexpected error occurred: {str(e)}'
                }
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# _____________ Onbording Date Of Joining Amit _____________________- 


# ___________________________________ Manage Professionals LIST API Get _______________________
class Manage_prof_list_Views(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]    
    def get(self, request, prof_compny):

        try:
            # status_hr = request.query_params.get('HR_status', None)
            if not prof_compny:
                return Response({"error": "Please provide a company name or ID."}, status=status.HTTP_400_BAD_REQUEST)\

            if not agg_hhc_company.objects.filter(company_pk_id=prof_compny).exists():
                return Response({"error": "Company not registered."}, status=status.HTTP_404_NOT_FOUND)

            # Prof_int = agg_hhc_service_professionals.objects.filter(
            #     prof_compny=prof_compny,
            #     # status=1
            # ).order_by('-last_modified_date').distinct()

            if 'HR_status' in request.query_params:
                status_hr = int(request.query_params.get('HR_status'))
                print(status_hr, 'HR_status')

                if status_hr in [1, 2]:
                    # Professionals with specific HR status
                    Prof_int = agg_hhc_service_professionals.objects.filter(
                        prof_compny=prof_compny,
                        agg_hhc_prof_interview_details__hr_status=status_hr,
                        status=1
                    ).order_by('-last_modified_date').distinct()

                elif status_hr == 3:
                    # Fetch all service professionals for the given company and status 1
                    prof_int_all = agg_hhc_service_professionals.objects.filter(
                        prof_compny=prof_compny,
                        status=1
                    ).order_by('-last_modified_date').distinct()

                    print(f"Total professionals: {prof_int_all.count()}")

                    # Fetch IDs from the interview details table
                    srv_prof_ids_all = prof_int_all.values_list('srv_prof_id', flat=True)
                    srv_prof_ids_in_interviews = agg_hhc_prof_interview_details.objects.filter(
                        srv_prof_id__in=srv_prof_ids_all
                    ).values_list('srv_prof_id', flat=True)

                    # Exclude professionals present in the interview details table
                    Prof_int = prof_int_all.exclude(srv_prof_id__in=srv_prof_ids_in_interviews)

                    print(f"Pending professionals (not in interview details): {Prof_int.count()}")
                elif status_hr == 4:
                    Prof_int = agg_hhc_service_professionals.objects.filter(
                        prof_compny=prof_compny,
                        # status=1
                    ).order_by('-last_modified_date').distinct()
            else:
                Prof_int = agg_hhc_service_professionals.objects.filter(
                    prof_compny=prof_compny,
                    # status=1
                ).order_by('-last_modified_date').distinct()                
                # return Response({"error": "Please Select valid HR Status there are only 4 status 1 2 3 4","msg":str(e)},status=status.HTTP_404_NOT_FOUND)
                # Default case: all active service professionals for the given company
                # Prof_int = agg_hhc_service_professionals.objects.filter(
                #     prof_compny=prof_compny,
                #     status=1
                # ).order_by('-last_modified_date').distinct()

            # Calculate the counts for notifications
            srv_prof_ids = agg_hhc_service_professionals.objects.filter(
                prof_compny=prof_compny,
                status=1
            ).order_by('-last_modified_date').distinct()

            srv_prof_ids = agg_hhc_service_professionals.objects.filter(prof_compny = prof_compny).order_by('-last_modified_date').distinct()
            print(srv_prof_ids)
            all_count = srv_prof_ids.count()   

            int_cn = agg_hhc_prof_interview_details.objects.filter(srv_prof_id__in=srv_prof_ids)
            pidds = list(set(int_cn.values_list('srv_prof_id', flat=True)))
            pmkkint = []
            for i in pidds:
                allrin = agg_hhc_prof_interview_details.objects.filter(srv_prof_id=i).last()
                pmkkint.append(allrin)

            approved_count = sum(1 for obj in pmkkint if obj.hr_status == 1)
            rejected_count = sum(1 for obj in pmkkint if obj.hr_status == 2)                
            pending_count =int(all_count- len(pmkkint))
            
            serializer = Manage_Prof_List_Get_Serializer_API(Prof_int, many=True)
            
            response_data = {
                "notification": {
                    "Approved_Count": approved_count,
                    "Rejected_Count": rejected_count,
                    "All_Count": all_count,
                    "Pending_Count": pending_count,
                },
                "data": serializer.data, 
            }

            return Response(response_data, status=status.HTTP_200_OK)
        
        except Exception as e:
            error_message = "An unexpected error occurred."
            logger.error(f"{error_message}: {str(e)}")
            return Response({
                "error": error_message,
                "details": str(e),
                "traceback": traceback.format_exc()
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
        

# ___________________________________ Manage Professionals LIST API Get _______________________

from django.db import transaction
# ___________________________________ Professionals interview status _______________________
class prof_interview_round_view(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]    
    def get(self, request, srv_prof_id):
        try:

            prof_interview_round = agg_hhc_prof_interview_details.objects.filter(
                srv_prof_id=srv_prof_id, status=1
            ).last()

            # Check if data exists for the given srv_prof_id
            if not prof_interview_round:
                return Response({"error": "No interview data found for the given professional ID."}, status=status.HTTP_404_NOT_FOUND)
            
            # Serialize the latest record
            serializer = Prof_interview_round_serializers(prof_interview_round)
            return Response(serializer.data, status=status.HTTP_200_OK)


            # prof_interview_round = agg_hhc_prof_interview_details.objects.all()
            # serializer = Prof_interview_round_serializers(prof_interview_round, many=True)
            # return Response(serializer.data, status=status.HTTP_200_OK)
        
        except ObjectDoesNotExist:
            return Response({"error": "Professional service data not found."},status=status.HTTP_404_NOT_FOUND)
        
        except ValidationError:
            return Response({"error": "Invalid data provided."},status=status.HTTP_400_BAD_REQUEST)
        
        except DatabaseError:
            return Response({"error": "Database error encountered."},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        except APIException as e:
            return Response({"error": "API error occurred."},status=e.status_code if hasattr(e, 'status_code') else status.HTTP_400_BAD_REQUEST)
        
        except Exception:
            return Response({"error": "An unexpected error occurred."},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    # def post(self, request, srv_prof_id=None):
    #     try:
    #         serializer = Prof_interview_round_serializers(data=request.data)
    #         if serializer.is_valid():
    #             serializer.save()
    #             return Response(serializer.data, status=status.HTTP_201_CREATED)
    #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    #     except ValidationError:
    #         return Response({"error": "Invalid data provided."}, status=status.HTTP_400_BAD_REQUEST)
        
    #     except DatabaseError:
    #         return Response({"error": "Database error encountered."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    #     except APIException as e:
    #         return Response({"error": "API error occurred."}, status=e.status_code if hasattr(e, 'status_code') else status.HTTP_400_BAD_REQUEST)
        
    #     except Exception:
    #         return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




    def post(self, request, srv_prof_id=None):
        try:
            serializer = Prof_interview_round_serializers(data=request.data)
            if serializer.is_valid():
                with transaction.atomic():  # Ensure database operations are atomic
                    # Save the new interview detail
                    interview_detail = serializer.save()

                    # Check if Schedule_Selected = 2 and update the related service professional
                    if interview_detail.Schedule_Selected == 2:
                        srv_prof = interview_detail.srv_prof_id  # This returns the related instance
                        if isinstance(srv_prof, agg_hhc_service_professionals):
                            srv_prof = srv_prof.srv_prof_id  # Access the primary key `srv_prof_id`
                        
                        agg_hhc_service_professionals.objects.filter(
                            srv_prof_id=srv_prof
                        ).update(prof_interviewed=True, professinal_status = 4)

                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except ValidationError:
            return Response({"error": "Invalid data provided."}, status=status.HTTP_400_BAD_REQUEST)
        
        except DatabaseError:
            return Response({"error": "Database error encountered."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        except APIException as e:
            return Response({"error": "API error occurred."}, status=e.status_code if hasattr(e, 'status_code') else status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ___________________________________ Professionals interview status _______________________

# ___________________________________ External Added New Professionals Active/Inactive Delete API _____________________

class Exter_Prof_Action_Delete_Views(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]    
    def get(self, request, srv_prof_id):
        try:

            prof_interview_round = agg_hhc_service_professionals.objects.filter(
                srv_prof_id=srv_prof_id
            ).last()

            # Check if data exists for the given srv_prof_id
            if not prof_interview_round:
                return Response({"error": "No interview data found for the given professional ID."}, status=status.HTTP_404_NOT_FOUND)
            
            # Serialize the latest record
            serializer = External_prof_Active_Inactive_serializer(prof_interview_round)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response({"error": "Professional service data not found."},status=status.HTTP_404_NOT_FOUND)
        
        except ValidationError:
            return Response({"error": "Invalid data provided."},status=status.HTTP_400_BAD_REQUEST)
        
        except DatabaseError:
            return Response({"error": "Database error encountered."},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        except APIException as e:
            return Response({"error": "API error occurred."},status=e.status_code if hasattr(e, 'status_code') else status.HTTP_400_BAD_REQUEST)
        
        except Exception:
            return Response({"error": "An unexpected error occurred."},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, srv_prof_id):
        try:
            # Fetch the professional record
            prof_record = agg_hhc_service_professionals.objects.get(srv_prof_id=srv_prof_id)

            # Extract payload fields
            status_value = request.data.get('status')
            last_modified_by = request.data.get('last_modified_by')
            remark = request.data.get('Remark')  # New field
            added_by = request.data.get('added_by')  # New field
            
            # Update the professional record
            if status_value is not None:
                prof_record.status = status_value
            if last_modified_by is not None:
                prof_record.last_modified_by = last_modified_by
            prof_record.save()

            # Update colleague record if clg_ref_id exists
            if prof_record.clg_ref_id:
                colleague_record = agg_com_colleague.objects.get(clg_ref_id=prof_record.clg_ref_id)
                if status_value is not None:
                    colleague_record.is_active = True if status_value == 1 else False
                if last_modified_by is not None:
                    colleague_record.last_modified_by = last_modified_by
                colleague_record.save()

            # Create a new entry in the agg_hhc_EX_professional_Records table
            agg_hhc_EX_professional_Records.objects.create(
                srv_prof_id=prof_record,
                Remark=remark,
                status=status_value,
                added_by=added_by,
                last_modified_by=last_modified_by,
            )

            # Serialize and return the updated professional record
            serializer = External_prof_Active_Inactive_serializer(prof_record)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response({"error": "Professional service data not found."}, status=status.HTTP_404_NOT_FOUND)
        
        except ValidationError:
            return Response({"error": "Invalid data provided."}, status=status.HTTP_400_BAD_REQUEST)
        
        except DatabaseError:
            return Response({"error": "Database error encountered."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        except APIException as e:
            return Response({"error": "API error occurred."}, status=e.status_code if hasattr(e, 'status_code') else status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 




# ___________________________________ External Added New Professionals Active/Inactive Delete API _____________________


class Manage_emp(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

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
        pro = request.GET.get('pro', None)
        ob = request.GET.get('ob') #ob = on board
        sl = request.GET.get('sl') #sl = selected
        srv_prof = request.GET.get('srv_prof', None)
        print("sl", sl)
        try:
            # if ob == '1':
            #     if pro:
            #         zone = agg_hhc_service_professionals.objects.get(srv_prof_id=pro, prof_registered=True, prof_interviewed=True, prof_doc_verified=True).order_by('prof_fullname')
            #     else:
            #         zone = agg_hhc_service_professionals.objects.filter(prof_registered=True, prof_interviewed=True, prof_doc_verified=True).order_by('prof_fullname')
            #     if zone:
            #         serializer = ob_1_serializer(zone, many=True)
            #         return Response(serializer.data, status=status.HTTP_200_OK)
            #     return Response({'msg':'No Data Found'}, status=status.HTTP_400_BAD_REQUEST)

            if ob == '1':
                # if srv_prof: 
                #     zone = agg_hhc_service_professionals.objects.filter(srv_prof_id=srv_prof, prof_registered=True, prof_interviewed=True,prof_compny=1, status=1, agg_hhc_prof_interview_details__Schedule_Selected=2).distinct().order_by('-added_date')
                # else: 
                zone = agg_hhc_service_professionals.objects.filter(prof_registered=True, prof_interviewed=True, prof_doc_verified = False, prof_compny=1, status=1).distinct().order_by('-added_date')
                if zone.exists():  
                    serializer = ob_1_serializer(zone, many=True)
                    return Response(serializer.data, status=status.HTTP_200_OK)

                return Response({' msg': 'No Data Found'}, status=status.HTTP_400_BAD_REQUEST)
            
            elif ob == '2':
                if srv_prof: 
                    zone = agg_hhc_service_professionals.objects.filter(srv_prof_id=srv_prof, prof_registered=True, prof_interviewed=True).distinct().order_by('-added_date')
                # if srv_prof: 
                #     zone = agg_hhc_service_professionals.objects.filter(srv_prof_id=srv_prof, prof_registered=True, prof_interviewed=True,prof_compny=1, status=1, agg_hhc_prof_interview_details__Schedule_Selected=2).distinct().order_by('-added_date')
                # else: 
                #     zone = agg_hhc_service_professionals.objects.filter(prof_registered=True, prof_interviewed=True, prof_compny=1, status=1, agg_hhc_prof_interview_details__Schedule_Selected=2).distinct().order_by('-added_date')
                if zone.exists():  
                    serializer = ob_1_serializer(zone, many=True)
                    return Response(serializer.data, status=status.HTTP_200_OK)

                return Response({'msg': 'No Data Found'}, status=status.HTTP_400_BAD_REQUEST)

            # if ob == '1':
            #     if pro:
            #         print('uf')
            #         zone = agg_hhc_service_professionals.objects.filter(srv_prof_id=pro, prof_registered=True, prof_interviewed=True, prof_compny = 1, status = 1, agg_hhc_prof_interview_details__Schedule_Selected=2).distinct().order_by('-added_date')
            #     else:
            #         print('else')
            #         zone = agg_hhc_service_professionals.objects.filter(srv_prof_id=pro, prof_registered=True, prof_interviewed=True, prof_compny = 1, status = 1, agg_hhc_prof_interview_details__Schedule_Selected=2).distinct().order_by('-added_date')
            #     if zone:
            #         serializer = ob_1_serializer(zone, many=True)
            #         return Response(serializer.data, status=status.HTTP_200_OK)
            #     return Response({'msg':'No Data Found'}, status=status.HTTP_400_BAD_REQUEST)   
                
            elif sl == '1':
                Selected_prof_int = agg_hhc_prof_interview_details.objects.filter(int_status=1)
                
                selected_prof_arr = []
                for i in Selected_prof_int:
                    prof = agg_hhc_service_professionals.objects.get(srv_prof_id=i.srv_prof_id.srv_prof_id, prof_compny = 1, status = 1)
                    selected_prof_arr.append(prof)
                
                if selected_prof_arr:
                    serializer = agg_hhc_srv_prof_serializer(selected_prof_arr, many=True)
                    return Response(serializer.data ,status=status.HTTP_200_OK)
                return Response({'msg':'No Data Found'}, status=status.HTTP_400_BAD_REQUEST)

            elif not pro and not ob and not sl:
                print('3')
                # If no query parameters are provided, return all data
                # zone = agg_hhc_service_professionals.objects.all().order_by('prof_fullname')
                try:
                    jjjj = agg_hhc_prof_interview_details.objects.filter(
                    Schedule_Selected=2
                    )
                except Exception as e:
                    
                    return Response(str(e))
                print(jjjj,'jjjj')
                iddddd = []
                try:
                    for i in jjjj:
                        print(i)
                        if i.srv_prof_id:
                            iddddd.append(i.srv_prof_id.srv_prof_id)
                except Exception as e:
                    return Response(str(e))
                
                print(iddddd)
                # zone = agg_hhc_service_professionals.objects.filter(prof_registered=True, prof_compny = 1, status = 1).exclude(srv_prof_id__in =list(set(iddddd))).order_by('-added_date').distinct()
                if pro:
                    zone = agg_hhc_service_professionals.objects.filter(srv_prof_id=pro, prof_registered=True, prof_interviewed=False, prof_compny=1, status=1 ).exclude(srv_prof_id__in =list(set(iddddd))).order_by('-added_date').distinct()
                else:
                    zone = agg_hhc_service_professionals.objects.filter( prof_registered=True, prof_interviewed=False, prof_compny=1, status=1).exclude(srv_prof_id__in =list(set(iddddd))).order_by('-added_date').distinct()
                    
                
                # if zone.exists():
                serializer = agg_hhc_srv_prof_all_data_serializer(zone, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
                # return Response({'msg': 'No Data Found'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                if pro:
                    zone = agg_hhc_service_professionals.objects.filter(srv_prof_id=pro, prof_registered=True, prof_interviewed=False, prof_compny=1, status=1 ).order_by('-added_date').distinct()
                else:
                    zone = agg_hhc_service_professionals.objects.filter( prof_registered=True, prof_interviewed=False, prof_compny=1, status=1).order_by('-added_date').distinct()
                    
                if zone.exists():
                    serializer = agg_hhc_srv_prof_all_data_serializer(zone, many=True)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({'msg': 'No Data Found'}, status=status.HTTP_400_BAD_REQUEST)

        except:
            return Response({'not found': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)
        




from rest_framework import status
import traceback

class Manage_emp_Edit_Views(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
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
            prof = agg_hhc_service_professionals.objects.get(srv_prof_id=srv_prof_id)
            # print(f"Service Professional Object: {prof}")
            
            update_data = request.data.copy()
            update_data.pop('srv_prof_id', None)


            # print(f"Update Data: {update_data}")
            
            serializer = agg_hhc_srv_prof_serializer(prof, data=update_data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return Response({'msg': 'Service Professional updated successfully.', 'updated_data': serializer.data}, status=status.HTTP_200_OK)
            else:
                # print(f"Serializer Errors: {serializer.errors}")
                return Response({'msg': 'Serializer validation failed', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except agg_hhc_service_professionals.DoesNotExist:
            return Response({'msg': 'Service Professional not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            traceback_str = traceback.format_exc()
            print(f"Error Traceback: {traceback_str}")
            return Response({'msg': 'Internal Server Error', 'details': str(e), 'traceback': traceback_str}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ----------------------------------------------------- End Manage Profile Page Amit --------------------------------------------------------------


# ___________________________ External Professional _____________- Amit
class exter_prof_aprov_reject_remark_Views(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]    
    def get(self, request, srv_prof_id):
        try:
            # Fetch the latest record for the given `srv_prof_id` with status = 1
            prof_interview_round = external_prof_approve_reject.objects.filter(
                srv_prof_id=srv_prof_id
            ).last()

            if not prof_interview_round:
                return Response(
                    {"error": "External Professional Approved/Rejected data Not Present."},
                    status=status.HTTP_404_NOT_FOUND
                )

            serializer = extr_prof_aprov_reject_serializer(prof_interview_round)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response(
                {"error": "Professional service data not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except ValidationError:
            return Response(
                {"error": "Invalid data provided."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except DatabaseError:
            return Response(
                {"error": "Database error encountered."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except APIException as e:
            return Response(
                {"error": "API error occurred."},
                status=e.status_code if hasattr(e, 'status_code') else status.HTTP_400_BAD_REQUEST
            )
        except Exception:
            return Response(
                {"error": "An unexpected error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request, srv_prof_id=None):
        try:
            serializer = extr_prof_aprov_reject_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                pro = agg_hhc_service_professionals.objects.get(srv_prof_id=request.data.get('srv_prof_id'))
                
                # Check the approve_reject field
                if request.data.get('approve_reject') == 1:  # Rejected
                    agg_hhc_prof_interview_details.objects.create(
                        srv_prof_id=pro,
                        Schedule_Selected=2,
                        hr_status = 1,
                        
                        int_round_Remark = request.data.get('Remark'),
                        added_by=request.data.get('added_by'),
                        last_modified_by=request.data.get('last_modified_by')
                    )
                    # Update professional_status to 4 for rejected
                    pro.professinal_status = 4
                    pro.status = 1
                    pro.clg_ref_id.is_active = True
                    pro.save()
                    print(f"Updated professional_status to {pro.professinal_status} for srv_prof_id {pro.srv_prof_id}")
                    
                elif request.data.get('approve_reject') == 2:  # Approved
                    agg_hhc_prof_interview_details.objects.create(
                        srv_prof_id=pro,
                        Schedule_Selected=1,
                        hr_status = 2,
                        status=2,
                        
                        int_round_Remark = request.data.get('Remark'),
                        added_by=request.data.get('added_by'),
                        last_modified_by=request.data.get('last_modified_by')
                    )
                    # Update professional_status to 3 for approved
                    pro.professinal_status = 3
                    pro.status = 2  # Assuming 'status' is also updated
                    pro.clg_ref_id.is_active = False
                    pro.save()
                    print(f"Updated professional_status to {pro.professinal_status} for srv_prof_id {pro.srv_prof_id}")

                return Response(serializer.data, status=status.HTTP_201_CREATED)

                # if request.data.get('approve_reject') == 1:    # Rejected 
                #     agg_hhc_prof_interview_details.objects.create(
                #     srv_prof_id=pro,
                #     Schedule_Selected=2,
                #     added_by=request.data.get('added_by'),
                #     last_modified_by=request.data.get('last_modified_by')
                # )
                # elif request.data.get('approve_reject') == 2:  # Approved
                #     agg_hhc_prof_interview_details.objects.create(
                #         srv_prof_id=pro,
                #         Schedule_Selected=1,
                #         status=2,
                #         added_by=request.data.get('added_by'),
                #         last_modified_by=request.data.get('last_modified_by')
                #     )
                # return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except ValidationError:
            return Response(
                {"error": "Invalid data provided."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except DatabaseError:
            return Response(
                {"error": "Database error encountered."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except APIException as e:
            return Response(
                {"error": "API error occurred."},
                status=e.status_code if hasattr(e, 'status_code') else status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# ___________________________ External Professional _____________- Amit

# ---------------------------------------- Onboarding - SELECTED CANDIDATES - DOCUMENT VERIFICATION Uploded -------------------------------------------

import logging
logger = logging.getLogger(__name__)
import requests
from django.core.files.base import ContentFile
from urllib.parse import urlparse
import os

def download_file_from_url(url):
    """
    Downloads a file from the given URL and returns it as a Django ContentFile.
    """
    response = requests.get(url)
    if response.status_code == 200:
        # Extract the filename from the URL
        parsed_url = urlparse(url)
        filename = os.path.basename(parsed_url.path)
        return ContentFile(response.content, name=filename)
    return None



class check_file_API_VIew(APIView):
    def get(self, request, srv_prof_id):
        try:
            query_params = request.query_params
            if query_params:
                employees = agg_hhc_professional_documents.objects.filter(srv_prof_id=srv_prof_id)
            else:
                employees = agg_hhc_professional_documents.objects.filter(srv_prof_id=srv_prof_id)

            if not employees.exists():
                raise NotFound("No employees found matching the query.")

            serializer = check_file_API(employees, many=True, context={'request': request})
            logger.info(f"Serialized data: {serializer.data}")
            return Response({'Res_Data': serializer.data}, status=status.HTTP_200_OK)

        except ParseError as parse_error:
            logger.error(f"Parse error: {parse_error}")
            return Response({'Res_Data': {'msg': 'Error parsing request data', 'error': str(parse_error)}}, status=status.HTTP_400_BAD_REQUEST)
        
        except NotFound as not_found_error:
            logger.warning(f"Not found: {not_found_error}")
            return Response({'Res_Data': {'msg': 'No data found', 'error': str(not_found_error)}}, status=status.HTTP_404_NOT_FOUND)
        
        except DatabaseError as db_error:
            logger.error(f"Database error: {db_error}")
            return Response({'Res_Data': {'msg': 'Database error occurred', 'error': str(db_error)}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return Response({'Res_Data': {'msg': f'An unexpected error occurred', 'error': str(e)}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



    def put(self, request, srv_prof_id=None):
        try:
            data = request.data
            
            # Get all index keys from the request data
            index_keys = set(int(key[key.find("[")+1:key.find("]")]) for key in data.keys() if "[" in key)
            sorted_data = []
            
            # Loop through the request data
            for index in sorted(index_keys):
                entry = {
                    "doc_li_id": int(data.get(f'doc_li_id[{index}]', [''])[0] if isinstance(data.get(f'doc_li_id[{index}]', ['']), list) else data.get(f'doc_li_id[{index}]', '')),
                    "professional_document": request.FILES.getlist(f'professional_document[{index}]')[0] if request.FILES.getlist(f'professional_document[{index}]') else None,
                    # "prof_id": int(data.get(f'prof_id[{index}]', [''])[0] if isinstance(data.get(f'prof_id[{index}]', ['']), list) else data.get(f'prof_id[{index}]', '')),
                    "prof_id": int(data.get(f'prof_id[{index}]', [''])[0] if isinstance(data.get(f'prof_id[{index}]', ['']), list) else data.get(f'prof_id[{index}]', '')) if data.get(f'prof_id[{index}]') else None,
                    "srv_prof_id": int(data.get(f'srv_prof_id[{index}]', [''])[0] if isinstance(data.get(f'srv_prof_id[{index}]', ['']), list) else data.get(f'srv_prof_id[{index}]', '')),
                    "isVerified": int(data.get(f'isVerified[{index}]', [''])[0] if isinstance(data.get(f'isVerified[{index}]', ['']), list) else data.get(f'isVerified[{index}]', '')),
                    "rejection_reason": data.get(f'rejection_reason[{index}]', [None])[0] if isinstance(data.get(f'rejection_reason[{index}]', [None]), list) else data.get(f'rejection_reason[{index}]', None),
                    "added_by": data.get(f'added_by[{index}]', [None])[0] if isinstance(data.get(f'added_by[{index}]', [None]), list) else data.get(f'added_by[{index}]', None),
                    "last_modified_by": data.get(f'last_modified_by[{index}]', [None])[0] if isinstance(data.get(f'last_modified_by[{index}]', [None]), list) else data.get(f'last_modified_by[{index}]', None)
                }
                sorted_data.append(entry)
            
            reponse_data = []
            
            for entry in sorted_data:
                srv_prof = agg_hhc_service_professionals.objects.get(srv_prof_id=entry["srv_prof_id"])
                doc_li = agg_hhc_documents_list.objects.get(doc_li_id=entry["doc_li_id"])
                
                get_doc_data = agg_hhc_professional_documents.objects.filter(srv_prof_id=srv_prof, doc_li_id=doc_li)
                
                if get_doc_data.exists():
                    lst_entry = get_doc_data.last()
                    
                    lst_entry.professional_document = entry["professional_document"]
                    lst_entry.isVerified = entry["isVerified"]
                    lst_entry.rejection_reason = entry["rejection_reason"]
                    lst_entry.added_by = entry["added_by"]
                    lst_entry.status = 4
                    lst_entry.last_modified_by = entry["last_modified_by"]
                    lst_entry.save()

                    dataaaa = {
                        "msg": "Document updated successfully",
                        "data": {
                            "srv_prof_id": srv_prof.srv_prof_id,
                            "doc_li_id": doc_li.doc_li_id,
                            # "professional_document": entry["professional_document"].name,
                            "professional_document": entry["professional_document"].name if entry["professional_document"] else None,
                            "rejection_reason": entry["rejection_reason"],
                            "status": 4,
                            "prof_doc_verified": True,
                            "isVerified": entry["isVerified"],
                            "added_by": entry["added_by"],
                            "last_modified_by": entry["last_modified_by"]
                        }
                    }
                    reponse_data.append(dataaaa)

                else:
                    agg_hhc_professional_documents.objects.create(
                        doc_li_id=doc_li,
                        professional_document=entry["professional_document"],
                        srv_prof_id=srv_prof,
                        isVerified=entry["isVerified"],
                        rejection_reason=entry["rejection_reason"],
                        status=4,
                        added_by=entry["added_by"],
                        last_modified_by=entry["last_modified_by"]
                    )

                    dataaaa = {
                        "msg": "New document added successfully",
                        "data": {
                            "srv_prof_id": srv_prof.srv_prof_id,
                            "doc_li_id": doc_li.doc_li_id,
                            # "professional_document": entry["professional_document"].name,
                            "professional_document": entry["professional_document"].name if entry["professional_document"] else None,
                            "rejection_reason": entry["rejection_reason"],
                            "status": 4,
                            "isVerified": entry["isVerified"],
                            "added_by": entry["added_by"],
                            "last_modified_by": entry["last_modified_by"]
                        }
                    }
                    reponse_data.append(dataaaa)
            if reponse_data:
                srv_prof.prof_doc_verified = True
                srv_prof.save()                      

            return Response(reponse_data, status=status.HTTP_200_OK)

        except Exception as e:
            error_message = "An unexpected error occurred."
            logger.error(f"{error_message}: {str(e)}")
            return Response({
                "error": error_message,
                "details": str(e),
                "traceback": traceback.format_exc()
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)           



from django.db import transaction
class Edit_file_API_VIew(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]    
    def get(self, request, srv_prof_id=None):
        try:
            if srv_prof_id:
                # Retrieve all records with the given srv_prof_id
                employees = agg_hhc_professional_documents.objects.filter(srv_prof_id=srv_prof_id)
                if not employees.exists():
                    raise NotFound(f"No documents found with srv_prof_id {srv_prof_id}.")
                
                serializer = check_file_API(employees, many=True, context={'request': request})
                logger.info(f"Serialized data for srv_prof_id {srv_prof_id}: {serializer.data}")
                return Response({'Res_Data': serializer.data}, status=status.HTTP_200_OK)
            
            # If no srv_prof_id provided, retrieve based on query params or all data
            query_params = request.query_params
            if query_params:
                employees = agg_hhc_professional_documents.objects.filter(**query_params.dict())
            else:
                employees = agg_hhc_professional_documents.objects.all()

            if not employees.exists():
                raise NotFound("No employees found matching the query.")

            serializer = check_file_API(employees, many=True, context={'request': request})
            logger.info(f"Serialized data: {serializer.data}")
            return Response({'Res_Data': serializer.data}, status=status.HTTP_200_OK)

        except ParseError as parse_error:
            logger.error(f"Parse error: {parse_error}")
            return Response({'Res_Data': {'msg': 'Error parsing request data', 'error': str(parse_error)}}, status=status.HTTP_400_BAD_REQUEST)
        
        except NotFound as not_found_error:
            logger.warning(f"Not found: {not_found_error}")
            return Response({'Res_Data': {'msg': 'No data found', 'error': str(not_found_error)}}, status=status.HTTP_404_NOT_FOUND)
        
        except DatabaseError as db_error:
            logger.error(f"Database error: {db_error}")
            return Response({'Res_Data': {'msg': 'Database error occurred', 'error': str(db_error)}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return Response({'Res_Data': {'msg': f'An unexpected error occurred', 'error': str(e)}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



    def put(self, request, srv_prof_id=None):
        try:
            if srv_prof_id is None:
                raise ValidationError("srv_prof_id is required.")

            data_list = request.data
            if not isinstance(data_list, list):
                raise ValidationError("Expected a list of dictionaries.")

            response_data = []
            for item in data_list:
                doc_li_id = item.get('doc_li_id')

                if doc_li_id:
                    # Update existing records if doc_li_id is provided and exists
                    document_instances = agg_hhc_professional_documents.objects.filter(srv_prof_id=srv_prof_id, doc_li_id=doc_li_id)

                    if document_instances.exists():
                        # Update the existing records
                        for document_instance in document_instances:
                            serializer = post_documtnet_serializer(document_instance, data=item, partial=True)
                            if serializer.is_valid():
                                serializer.save()
                                response_data.append({'msg': f'Document with prof_doc_id {document_instance.prof_doc_id} updated successfully', 'data': serializer.data})
                            else:
                                logger.warning(f"Validation error: {serializer.errors}")
                                return Response({'Res_Data': {'msg': 'Validation error', 'errors': serializer.errors}}, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        # Handle the case where doc_li_id is provided but no matching record exists
                        return Response({'Res_Data': {'msg': f'Document with doc_li_id {doc_li_id} not found for srv_prof_id {srv_prof_id}'}}, status=status.HTTP_404_NOT_FOUND)
                else:
                    # Treat as a new entry if doc_li_id is not provided
                    item['srv_prof_id'] = srv_prof_id
                    serializer = post_documtnet_serializer(data=item)
                    if serializer.is_valid():
                        serializer.save()
                        response_data.append({'msg': 'New document created successfully', 'data': serializer.data})
                    else:
                        logger.warning(f"Validation error: {serializer.errors}")
                        return Response({'Res_Data': {'msg': 'Validation error', 'errors': serializer.errors}}, status=status.HTTP_400_BAD_REQUEST)

            return Response({'Res_Data': response_data}, status=status.HTTP_200_OK)

        except ValidationError as val_error:
            logger.error(f"Validation error: {val_error}")
            return Response({'Res_Data': {'msg': 'Invalid data provided', 'error': str(val_error)}}, status=status.HTTP_400_BAD_REQUEST)

        except NotFound as not_found_error:
            logger.warning(f"Not found: {not_found_error}")
            return Response({'Res_Data': {'msg': 'No document found', 'error': str(not_found_error)}}, status=status.HTTP_404_NOT_FOUND)

        except DatabaseError as db_error:
            logger.error(f"Database error: {db_error}")
            return Response({'Res_Data': {'msg': 'Database error occurred', 'error': str(db_error)}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return Response({'Res_Data': {'msg': f'An unexpected error occurred', 'error': str(e)}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)






        
#  ------------ Amit interview shedule __________________   
# 
# 

import logging
logger = logging.getLogger(__name__)
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from rest_framework.exceptions import APIException
from django.db import DatabaseError
from rest_framework.exceptions import ParseError




#  -------------------------------------- Our Employee List Amit ---------------------------------------------------

from rest_framework.exceptions import NotFound, ParseError

class Our_EMPLOYEE_List_VIew(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):


        try:
            query_params = request.query_params
            # selected_schedule = agg_hhc_prof_interview_details.objects.filter(
            #     Schedule_Selected=2
            # )
            # iddd = []
            # for i in selected_schedule:
            #     # print(i.srv_prof_id.srv_prof_id)
            #     if i.srv_prof_id:
            #         iddd.append(i.srv_prof_id.srv_prof_id )
            # print(iddd)
            # print(list(set(iddd)))
            # if query_params:
            #     employees = agg_hhc_service_professionals.objects.filter(srv_prof_id__in =list(set(iddd)), prof_registered= True, prof_interviewed = True, prof_doc_verified =  True,  **query_params.dict()).distinct().order_by('-agg_hhc_prof_interview_details__added_by', 'prof_fullname')
            # else:
            #     employees = agg_hhc_service_professionals.objects.filter(srv_prof_id__in =list(set(iddd)), prof_registered= True, prof_interviewed = True, prof_doc_verified =  True,  **query_params.dict()).distinct().order_by('-agg_hhc_prof_interview_details__added_by','prof_fullname')

            employees = agg_hhc_service_professionals.objects.filter(prof_registered= True, prof_interviewed = True, prof_doc_verified =  True,  **query_params.dict()).distinct().order_by('-agg_hhc_prof_interview_details__added_by','prof_fullname')

            print(employees,'employees')
            if not employees.exists():
                raise NotFound("No employees found matching the query.")

            serializer = Our_EMPLOYEE_List_serializer(employees, many=True)
            # res_data = {
            #     'data': serializer.data
            # }
            return Response(serializer.data, status=status.HTTP_200_OK)

        # try:
        #     query_params = request.query_params
        #     selected_schedule = agg_hhc_prof_interview_details.objects.filter(
        #         Schedule_Selected=2
        #     )
        #     iddd = []
        #     for i in selected_schedule:
        #         # print(i.srv_prof_id.srv_prof_id)
        #         if i.srv_prof_id:
        #             iddd.append(i.srv_prof_id.srv_prof_id )
        #     print(iddd)
        #     print(list(set(iddd)))
        #     if query_params:
        #         employees = agg_hhc_service_professionals.objects.filter(srv_prof_id__in =list(set(iddd)), prof_registered= True, prof_interviewed = True, prof_doc_verified =  True,  **query_params.dict()).distinct().order_by('-agg_hhc_prof_interview_details__added_by', 'prof_fullname')
        #     else:
        #         employees = agg_hhc_service_professionals.objects.filter(srv_prof_id__in =list(set(iddd)), prof_registered= True, prof_interviewed = True, prof_doc_verified =  True,  **query_params.dict()).distinct().order_by('-agg_hhc_prof_interview_details__added_by','prof_fullname')

        #     print(employees,'employees')
        #     if not employees.exists():
        #         raise NotFound("No employees found matching the query.")

        #     serializer = Our_EMPLOYEE_List_serializer(employees, many=True)
        #     # res_data = {
        #     #     'data': serializer.data
        #     # }
        #     return Response(serializer.data, status=status.HTTP_200_OK)

        except ParseError as parse_error:
            return Response({'Res_Data': {'msg': 'Error parsing request data', 'error': str(parse_error)}}, status=status.HTTP_400_BAD_REQUEST)
        
        except NotFound as not_found_error:
            return Response({'Res_Data': {'msg': 'No data found', 'error': str(not_found_error)}}, status=status.HTTP_404_NOT_FOUND)
        
        except DatabaseError as db_error:
            return Response({'Res_Data': {'msg': 'Database error occurred', 'error': str(db_error)}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        except Exception as e:
            return Response({'Res_Data': {'msg': f'An unexpected error occurred: {str(e)}'}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class Our_EMPLOYEE_Active_Inactive_Views(APIView):
    def get(self, request, srv_pro_id):
        try:
            interv_status = agg_hhc_service_professionals.objects.filter(srv_prof_id=srv_pro_id)
            serializer = Our_EMPLOYEE_Active_Inactive_serializer(interv_status, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except agg_hhc_service_professionals.DoesNotExist:
            return Response({'Res_Data': {'msg': 'Record not found'}}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Res_Data': {'msg': 'An error occurred', 'error': str(e)}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def put(self, request, srv_pro_id):
        try:
            interview_instance = agg_hhc_service_professionals.objects.get(srv_prof_id=srv_pro_id)
        except agg_hhc_service_professionals.DoesNotExist:
            return Response({'Res_Data': {'msg': 'Record not found'}}, status=status.HTTP_404_NOT_FOUND)

        serializer = Our_EMPLOYEE_Active_Inactive_serializer(interview_instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            response_data = {"updated_employee": serializer.data}

            if serializer.validated_data.get('status') == 2:
                not_qualified_data = {
                    "srv_prof_id": srv_pro_id,
                    "Remark": request.data.get('Remark', 'Not qualified for interview'),
                    "Black_list": request.data.get('Black_list'),
                    "Join_Date": request.data.get('Join_Date'),
                    "Exit_Date": request.data.get('Exit_Date'),
                    "added_by": request.data.get('added_by'),
                    "last_modified_by": request.data['last_modified_by']
                }

                not_qualified_serializer = EX_professional_Records_keeping(data=not_qualified_data)

                if not_qualified_serializer.is_valid():
                    not_qualified_serializer.save()
                    response_data["ex_professional_record_added"] = not_qualified_serializer.data
                else:
                    return Response(not_qualified_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response(response_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#  -------------------------------------- End Our Employee List Amit---------------------------------------------------        


# 
#  -------------------------------------- Onboarding - SELECTED CANDIDATES - DOCUMENT VERIFICATION ---------------------------------------------------
from django.core.exceptions import FieldError
class Get_Document_list_names_VIew(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]    
    def get(self, request):
    #     print('onses')
    #     document_list = agg_hhc_documents_list.objects.all()
    #     print(document_list, 'document_list')
    #     serializer=Get_Document_list_names_Serializer(document_list, many=True)
    #     return Response(serializer.data)

        try:
            query_params = request.query_params.dict()
            # Filter out invalid query params
            valid_query_params = {key: value for key, value in query_params.items() if hasattr(agg_hhc_documents_list, key)}

            if valid_query_params:
                document_list = agg_hhc_documents_list.objects.filter(**valid_query_params, prof_doc=1).order_by('doc_li_id')
            else:
                document_list = agg_hhc_documents_list.objects.filter(prof_doc=1).order_by('doc_li_id')

            if not document_list.exists():
                raise NotFound("No document list found matching the query.")

            serializer = Get_Document_list_names_Serializer(document_list, many=True, context={'request': request})
            logger.info(f"Serialized data: {serializer.data}")
            return Response(serializer.data, status=status.HTTP_200_OK)

        except ParseError as parse_error:
            return Response({'Res_Data': {'msg': 'Error parsing request data', 'error': str(parse_error)}}, status=status.HTTP_400_BAD_REQUEST)

        except NotFound as not_found_error:
            return Response({'Res_Data': {'msg': 'No data found', 'error': str(not_found_error)}}, status=status.HTTP_404_NOT_FOUND)

        except FieldError as field_error:
            return Response({'Res_Data': {'msg': 'Invalid field in query parameters', 'error': str(field_error)}}, status=status.HTTP_400_BAD_REQUEST)

        except DatabaseError as db_error:
            return Response({'Res_Data': {'msg': 'Database error occurred', 'error': str(db_error)}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            return Response({'Res_Data': {'msg': f'An unexpected error occurred: {str(e)}'}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


#  -------------------------------------- Onboarding - SELECTED CANDIDATES - DOCUMENT VERIFICATION ---------------------------------------------------





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
    



class interviews_schedule_prof_status_Views(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]    
    def get(self, request, srv_pro_id):
        try:
            interv_status = agg_hhc_prof_interview_details.objects.filter(srv_prof_id=srv_pro_id)
            serializer = InterviewScheduleProfStatusSerializer(interv_status, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except agg_hhc_prof_interview_details.DoesNotExist:
            return Response({'Res_Data': {'msg': 'Record not found'}}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Res_Data': {'msg': 'An error occurred', 'error': str(e)}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    
    def put(self, request, srv_pro_id):
        print("Request Data: ", request.data)
        try:
            interview_instance = agg_hhc_prof_interview_details.objects.get(srv_prof_id=srv_pro_id)
        except agg_hhc_prof_interview_details.DoesNotExist:
            return Response({'Res_Data': {'msg': 'Record not found'}}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = InterviewScheduleProfStatusSerializer(interview_instance, data=request.data, partial=True)
        print("Request Data:", request.data)
        
        if serializer.is_valid():
            print("Validation Errors: ", serializer.errors)
            serializer.save()
            print(request.data['last_modified_by'])
            
            updated_data = {'interview_data': serializer.data}

            if serializer.validated_data.get('int_status') == 1:
                try:
                    professional_instance = agg_hhc_service_professionals.objects.get(srv_prof_id=srv_pro_id)
                    professional_instance.doj = request.data.get('Date_Join', None)  # Replace with the actual field
                    professional_instance.last_modified_by = request.data['last_modified_by']
                    professional_instance.prof_interviewed = True
                    professional_instance.save()
                    print("Professional record updated successfully.")
                    updated_data['Service professional data'] = {
                        'srv_prof_id': professional_instance.srv_prof_id,
                        'doj': professional_instance.doj,
                        'last_modified_by': professional_instance.last_modified_by,
                        'prof_interviewed': professional_instance.prof_interviewed,
                    }

                except agg_hhc_service_professionals.DoesNotExist:
                    return Response({'Res_Data': {'msg': 'Professional record not found'}}, status=status.HTTP_404_NOT_FOUND)

            elif serializer.validated_data.get('int_status') == 2:
                not_qualified_data = {
                    "srv_prof_id": srv_pro_id,
                    "Remark": request.data.get('Remark', 'Not qualified for interview'),
                    "last_modified_by": request.data['last_modified_by']
                }
                
                not_qualified_serializer = Professionals_Not_Qualified_for_Interview_serializer(data=not_qualified_data)
                if not_qualified_serializer.is_valid():
                    not_qualified_serializer.save()
                    
                    updated_data['not_qualified_data'] = not_qualified_serializer.data
                else:
                    print("Serializer Errors:", serializer.errors)
                    return Response(not_qualified_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response({'Res_Data': updated_data}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    # def put(self, request, srv_pro_id):
    #     print("Request Data: ", request.data)
    #     try:
    #         interview_instance = agg_hhc_prof_interview_details.objects.get(srv_prof_id=srv_pro_id)
    #     except agg_hhc_prof_interview_details.DoesNotExist:
    #         return Response({'Res_Data': {'msg': 'Record not found'}}, status=status.HTTP_404_NOT_FOUND)
    #     serializer = InterviewScheduleProfStatusSerializer(interview_instance, data=request.data, partial=True)
    #     print("Request Data:", request.data)
    #     if serializer.is_valid():
    #         print("Validation Errors: ", serializer.errors)
    #         serializer.save()
    #         print(request.data['last_modified_by'])
    #         if serializer.validated_data.get('int_status') == 1:
    #             try:
    #                 professional_instance = agg_hhc_service_professionals.objects.get(srv_prof_id=srv_pro_id)
    #                 professional_instance.doj = request.data.get('Date_Join', None)  # Replace with the actual field
    #                 professional_instance.last_modified_by = request.data['last_modified_by']
    #                 professional_instance.save()
    #                 print("Professional record updated successfully.")

    #             except agg_hhc_service_professionals.DoesNotExist:
    #                 return Response({'Res_Data': {'msg': 'Professional record not found'}}, status=status.HTTP_404_NOT_FOUND)
    #         elif serializer.validated_data.get('int_status') == 2:
    #             not_qualified_data = {
    #                 "srv_prof_id": srv_pro_id,
    #                 "Remark": request.data.get('Remark', 'Not qualified for interview'),
    #                 "last_modified_by": request.data['last_modified_by']
    #             }
    #             not_qualified_serializer = Professionals_Not_Qualified_for_Interview_serializer(data=not_qualified_data)
    #             if not_qualified_serializer.is_valid():
    #                 not_qualified_serializer.save()
    #             else:
    #                 print("Serializer Errors:", serializer.errors)
    #                 return Response(not_qualified_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    #         return Response(serializer.data, status=status.HTTP_200_OK)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)        


class Selected_candidates_ind_Trai_id(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, srv_prof_id):
        try:
            ind_tari_idc = agg_hhc_service_professionals.objects.filter(srv_prof_id=srv_prof_id)
            if not ind_tari_idc.exists():
                raise NotFound("Record not found")
                
            serializer = SelectedCandidatesIndTraiIDSerializer(ind_tari_idc, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except NotFound:
            return Response({'Res_Data': {'msg': 'Record not found'}}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'Res_Data': {'msg': 'An error occurred', 'error': str(e)}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, srv_prof_id):
        try:
            ind_tari_idc = agg_hhc_service_professionals.objects.get(srv_prof_id=srv_prof_id)
        except agg_hhc_service_professionals.DoesNotExist:
            return Response({'Res_Data': {'msg': 'Record not found'}}, status=status.HTTP_404_NOT_FOUND)

        serializer = SelectedCandidatesIndTraiIDSerializer(ind_tari_idc, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            







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

import ast


class edit_register_professional_from_hr(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]    
    def get(self, request, srv_prof_id):
        try:
            # Fetch the service professional details
            service_professional_instance = agg_hhc_service_professionals.objects.filter(srv_prof_id=srv_prof_id).first()
            if not service_professional_instance:
                return Response({"error": f"Service professional with ID {srv_prof_id} not found."},
                                status=status.HTTP_404_NOT_FOUND)

            # Serialize service professional dataAdd_Proffesional_Service_Professionals_Table_amit_get_Serializer
            service_professional_data = Add_Proffesional_Service_Professionals_Table_amit_get_Serializer(
                service_professional_instance).data

            # Fetch colleague details
            colleague_instance = agg_com_colleague.objects.filter(clg_ref_id=service_professional_instance.clg_ref_id).first()
            if not colleague_instance:
                return Response({"error": "Associated colleague record not found."},
                                status=status.HTTP_404_NOT_FOUND)

            colleague_data = Add_Proffesional_Clg_Table_amit_Serializer(colleague_instance).data

            # Fetch sub-services
            sub_services = agg_hhc_professional_sub_services.objects.filter(srv_prof_id=service_professional_instance)
            sub_services_data = [
                {
                    "prof_sub_srv_id": sub_service.prof_sub_srv_id,
                    "srv_prof_id": sub_service.srv_prof_id.srv_prof_id,
                    "sub_srv_id": sub_service.sub_srv_id.sub_srv_id,
                    "added_by": sub_service.added_by,
                    "last_modified_by": sub_service.last_modified_by,
                }
                for sub_service in sub_services
            ]

            # Fetch zones
            zones = agg_hhc_professional_location.objects.filter(srv_prof_id=service_professional_instance)
            zo = agg_hhc_professional_zone.objects.filter(Name = service_professional_data.get("prof_zone_id"))
            print('==========', zo)
            zones_data = [
                {
                    "prof_loc_id": zone.prof_loc_id,
                    "srv_prof_id": zone.srv_prof_id.srv_prof_id,
                    # "prof_zone_id": zone.location_name,
                    "prof_zone_id": zo[0].prof_zone_id if zo else None,
                    "added_by": zone.added_by,
                    "last_modified_by": zone.last_modified_by,
                }
                for zone in zones
            ]

            # Fetch professional details from agg_hhc_service_professional_details
            inter_services = agg_hhc_service_professional_details.objects.filter(srv_prof_id=service_professional_instance)
            int_services_data = [
                {
                    "srv_prof_id": inter_service.srv_prof_id.srv_prof_id,
                    "qualification": inter_service.qualification.quali_id if inter_service.qualification else None,
                    "specialization": inter_service.specialization.quali_sp if inter_service.specialization else None,
                    "prof_CV_det": inter_service.prof_CV.url if inter_service.prof_CV else None,
                    "availability_for_interview": inter_service.availability_for_interview if inter_service.availability_for_interview else None,
                    # "skill_set": inter_service.skill_set,
                    # "work_experience": inter_service.work_experience,
                    # "hospital_attached_to": inter_service.hospital_attached_to,
                    # "reference_1": inter_service.reference_1,
                    # "reference_1_contact_num": inter_service.reference_1_contact_num,
                    # "reference_2": inter_service.reference_2,
                    # "reference_2_contact_num": inter_service.reference_2_contact_num,
                    "added_by": inter_service.added_by,
                    "last_modified_by": inter_service.last_modified_by,
                }
                for inter_service in inter_services
            ]
            # zonee = agg_hhc_professional_zone.objects.get(Name = service_professional_data.get("prof_zone_id"))
            # Prepare service professional details
            print("__________________-",service_professional_data.get("role"))
            service_professional_response = {
                "title": service_professional_data.get("title"),
                "role": service_professional_data.get("role"),
                # "role": service_professional_data.get("role"),
                "prof_fullname": service_professional_data.get("prof_fullname"),
                "gender": service_professional_data.get("gender"),
                "dob": service_professional_data.get("dob"),
                "certificate_registration_no": service_professional_data.get("certificate_registration_no"),
                "cv_file": service_professional_data.get("cv_file"),
                "srv_id": service_professional_data.get("srv_id"),
                "Job_type": service_professional_data.get("Job_type"),
                "phone_no": service_professional_data.get("phone_no"),
                "email_id": service_professional_data.get("email_id"),
                "alt_phone_no": service_professional_data.get("alt_phone_no"),
                "eme_contact_no": service_professional_data.get("eme_contact_no"),
                "eme_conact_person_name": service_professional_data.get("eme_conact_person_name"),
                "eme_contact_relation": service_professional_data.get("eme_contact_relation"),
                "state_name": service_professional_data.get("state_name"),
                "city": service_professional_data.get("city"),
                "prof_address": service_professional_data.get("prof_address"),
                "pin_code_id": service_professional_data.get("pin_code_id"),
                # "prof_zone_id": zonee.prof_zone_id,  # Replace if data exists
                "lattitude": service_professional_data.get("lattitude"),
                "langitude": service_professional_data.get("langitude"),
                "added_by": service_professional_data.get("added_by"),
                "last_modified_by": service_professional_data.get("last_modified_by"),
                "google_home_location": service_professional_data.get("google_home_location"),
                "clg_ref_id": service_professional_data.get("clg_ref_id"),
                "prof_compny": service_professional_data.get("prof_compny"),
                "prof_registered": service_professional_data.get("prof_registered"),
                "prof_interviewed": service_professional_data.get("prof_interviewed"),
                "prof_doc_verified": service_professional_data.get("prof_doc_verified"),
            }
            
            dob = colleague_data.get("clg_Date_of_birth")
            dob1 = colleague_data.get("clg_joining_date")
        

            # Prepare colleague details
            colleague_response = {
                "clg_first_name": colleague_data.get("clg_first_name"),
                "clg_gender": colleague_data.get("clg_gender"),
                # "clg_Date_of_birth": datetime.datetime.strptime(colleague_data.get("clg_Date_of_birth"),'%Y-%m-%d') if colleague_data.get("clg_Date_of_birth") else None,
                "clg_Date_of_birth": datetime.datetime.strptime(dob, '%Y-%m-%d').date() if dob else None,
                # "clg_joining_date": datetime.datetime.strptime(colleague_data.get("clg_joining_date"), '%Y-%m-%d') if colleague_data.get("clg_Date_of_birth") else None,
                "clg_joining_date": datetime.datetime.strptime(dob1, '%Y-%m-%d').date() if dob1 else None,
                "clg_qualification": colleague_data.get("clg_qualification"),
                "clg_specialization": colleague_data.get("clg_specialization"),
                "clg_Work_phone_number": colleague_data.get("clg_Work_phone_number"),
                "clg_work_email_id": colleague_data.get("clg_work_email_id"),
                "clg_mobile_no": colleague_data.get("clg_mobile_no"),
                "clg_state": colleague_data.get("clg_state"),
                "clg_address": colleague_data.get("clg_address"),
                "added_by": colleague_data.get("added_by"),
                "last_modified_by": colleague_data.get("last_modified_by"),
                "password": colleague_data.get("password"),
                "grp_id": colleague_data.get("grp_id"),
                "clg_hos_id": colleague_data.get("clg_hos_id"),
                "prof_compny": colleague_data.get("prof_compny"),
            }

            # Final response structure
            response_data = {
                "message": "Data retrieved successfully",
                "service_professional": service_professional_response,
                "colleague": colleague_response,
                "sub_services": sub_services_data,
                # prof_zone_id
                "Zone": zones_data,
                "int_services_data": int_services_data,
            }

            return Response(response_data, status=status.HTTP_200_OK)

        # except Exception as e:
        #     return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Log the exception with a full traceback for detailed error information
            error_trace = traceback.format_exc()
            logger.error(f"An error occurred: {str(e)}\nTraceback: {error_trace}")

            # Return the error response with both the message and traceback details
            return Response({
                'error1': str(e),
                'traceback': error_trace
            }, status=status.HTTP_400_BAD_REQUEST)        


    def put(self, request, srv_prof_id):
        data = request.data

        try:
            # Fetch the existing service professional record
            service_professional_instance = agg_hhc_service_professionals.objects.filter(srv_prof_id=srv_prof_id).first()
            if not service_professional_instance:
                return Response({"error": f"Service professional with ID {srv_prof_id} not found."},
                                status=status.HTTP_404_NOT_FOUND)
            # Extract the current cv_file for comparison
            current_cv_file = service_professional_instance.cv_file

            # Get the cv_file from the request data, keep old if not provided
            cv_file = data.get('cv_file', current_cv_file)  # Default to current cv_file

            # Extract current phone number and email for comparison
            current_phone_no = service_professional_instance.phone_no
            current_email_id = service_professional_instance.email_id

            # Get the phone number and email from the request data
            phone_no = data.get('contact_number')
            email_id = data.get('email')

            
            
            if phone_no and phone_no != current_phone_no:
                # Exclude the current professional's entry while checking for conflicts
                existing_colleague = agg_hhc_service_professionals.objects.filter(
                    phone_no=phone_no
                ).exclude(srv_prof_id=srv_prof_id).first()

                if existing_colleague:
                    # Throw an error if the phone number is already registered to another professional
                    return Response({
                        "error": f"This professional number is already registered under {existing_colleague.prof_fullname}. Please provide a different number."
                    }, status=status.HTTP_409_CONFLICT)

            # If no conflict, continue with the update
            phone_no = phone_no or current_phone_no


            # Check for email conflict and skip updating if there's a conflict
            if email_id and email_id != current_email_id:
                email_conflict = agg_hhc_service_professionals.objects.filter(
                    email_id=email_id
                ).exclude(srv_prof_id=srv_prof_id).first()
                if email_conflict:
                    return Response({
                        "error": f"This professional Email id is already registered under {email_conflict.prof_fullname}. Please provide a different Email."
                    }, status=status.HTTP_409_CONFLICT)

            email_id = current_email_id or  current_email_id# Keep the current email_id


            # # Check for phone number conflict and skip updating if there's a conflict
            # if phone_no and phone_no != current_phone_no:
            #     phone_conflict = agg_hhc_service_professionals.objects.filter(
            #         phone_no=phone_no
            #     ).exclude(srv_prof_id=srv_prof_id).exists()
            #     if phone_conflict:
            #         phone_no = current_phone_no  # Keep the current phone_no

            # # Check for email conflict and skip updating if there's a conflict
            # if email_id and email_id != current_email_id:
            #     email_conflict = agg_hhc_service_professionals.objects.filter(
            #         email_id=email_id
            #     ).exclude(srv_prof_id=srv_prof_id).exists()
            #     if email_conflict:
            #         email_id = current_email_id  # Keep the current email_id


            # Update colleague details
            colleague_instance = agg_com_colleague.objects.filter(clg_ref_id=service_professional_instance.clg_ref_id).first()
            if not colleague_instance:
                return Response({"error": "Associated colleague record not found."},
                                status=status.HTTP_404_NOT_FOUND)

            # Construct full colleague name from title and first/last name
            title_value = int(data.get('title', 0))
            title_name = Title(title_value).name if title_value in Title._value2member_map_ else ""

            # Fetch first name and last name
            fname = data.get('clg_first_name', '').strip()
            lname = data.get('clg_last_name', '').strip()

            # Check if the first name already starts with the title
            if fname.startswith(title_name):
                full_colleague_name = f"{fname} {lname}".strip()
            else:
                full_colleague_name = f"{title_name} {fname} {lname}".strip()

            def safe_get_int(value):
                """Utility function to safely convert a string to an integer, handling 'null' and invalid types."""
                if value and value != 'null' and value.isdigit():  # Check if value is a valid number (not 'null')
                    return int(value)  # Convert to integer
                return None  # Return None if invalid


            # Get the values from the request data
            qualification = data.get('qualification')
            clg_specialization = data.get('clg_specialization')
            emergency_relation = data.get('emergency_relation')

            # Use the utility function to safely convert values
            safe_qualification = safe_get_int(qualification)
            safe_clg_specialization = safe_get_int(clg_specialization)
            kkk = safe_get_int(emergency_relation)

            colleague_data = {
                'clg_first_name': full_colleague_name,
                'clg_gender': data.get('gender'),
                'clg_Date_of_birth': data.get('dob'),
                'clg_joining_date': data.get('doj'),

                # 'clg_qualification': int(data.get('qualification')),
                # 'clg_specialization': int(data.get('clg_specialization')),
                'clg_qualification': safe_qualification,
                'clg_specialization': safe_clg_specialization,                

                'clg_Work_phone_number': phone_no,  # Use the current or updated phone_no
                'clg_work_email_id': email_id,  # Use the current or updated email_id
                'clg_mobile_no': data.get('alternate_number'),
                'clg_state': data.get('state'),
                'clg_address': data.get('address'),
                'last_modified_by': data.get('last_modified_by'),
                'prof_compny': 1
            }

            colleague_serializer = Add_Proffesional_Clg_Table_amit_Serializer(colleague_instance, data=colleague_data, partial=True)
            if colleague_serializer.is_valid():
                colleague_serializer.save()
            else:
                return Response(colleague_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Validate and assign srv_id
            srvic = data.get('srv_id')
            if not agg_hhc_services.objects.filter(srv_id=srvic).exists():
                return Response({"srv_id": [f"Service ID {srvic} does not exist."]}, status=status.HTTP_400_BAD_REQUEST)

            # Update service professional data
            ccsc = int(request.data.get('prof_zone'))

            priddd = agg_hhc_professional_zone.objects.get(prof_zone_id=int(ccsc))

            print(type(data.get('emergency_relation')), '--------------', data.get('emergency_relation'))

            service_professional_data = {
                'title': title_value,
                'role': data.get('role'),
                'prof_fullname': full_colleague_name,
                'gender': data.get('gender'),
                'dob': data.get('dob'),
                # 'doj': data.get('doj'),
                'Education_level': data.get('qualification'),
                'certificate_registration_no': data.get('certificate_registration_no'),
                'srv_id': srvic,
                'Job_type': data.get('Job_type'),
                'phone_no': phone_no,  # Use the current or updated phone_no
                'work_phone_no': data.get('contact_number'),
                'email_id': email_id,  # Use the current or updated email_id
                'alt_phone_no': data.get('alternate_number'),
                'eme_contact_no': data.get('emergency_contact_number'),
                'eme_conact_person_name': data.get('emergency_name'),
                'eme_contact_relation': kkk,
                'state_name': data.get('state'),
                'city': data.get('city'),
                'address': data.get('address'),
                'prof_address': data.get('address'),
                'pin_code_id': data.get('pincode'),
                'prof_zone_id': priddd.Name,
                'langitude': data.get('langitude'),
                'lattitude': data.get('lattitude'),
                'last_modified_by': data.get('last_modified_by'),
                'cv_file': cv_file,
                'google_home_location': data.get('google_home_location'),
                'prof_compny': 1,
                
            }
            # Handle service ID
            srvic = data.get('srv_id')
            srv = None
            try:
                srv = agg_hhc_services.objects.get(srv_id=srvic)
            except agg_hhc_services.DoesNotExist:
                srv = None

            if srv:
                service_professional_data['srv_id'] = srv.service_title
            else:
                service_professional_data['srv_id'] = None     

            if 'cv_file' in data:
                service_professional_data['prof_CV'] = data.get('cv_file')

            service_professional_serializer = Add_Proffesional_Service_Professionals_Table_amit_Serializer(
                service_professional_instance, data=service_professional_data, partial=True)
            if service_professional_serializer.is_valid():
                service_professional_serializer.save()
            else:
                return Response(service_professional_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Update CV details
            cv_instance = agg_hhc_service_professional_details.objects.filter(srv_prof_id=service_professional_instance.pk).first()
            if cv_instance:
                cv_details_data = {
                    # 'qualification': data.get('qualification'),
                    'qualification': safe_qualification,
                    'specialization': safe_clg_specialization,
                    'prof_CV': cv_file,
                    'last_modified_by': data.get('last_modified_by')
                }
                if 'cv_file' in data:
                    cv_details_data['prof_CV'] = data.get('cv_file')

                cv_serializer = Professional_CV_Details_amit_Serializer(cv_instance, data=cv_details_data, partial=True)
                if cv_serializer.is_valid():
                    cv_serializer.save()
                else:
                    return Response(cv_serializer.errors, status=status.HTTP_400_BAD_REQUEST)



            # Handle sub-services and zones
            sub_services = request.data.get('sub_services')
            zones = request.data.get('prof_zone')

            sub = []
            znd = []


            if sub_services:
                sub_services_list = ast.literal_eval(sub_services)
                for sub_service_id in sub_services_list:
                    sub_service = agg_hhc_sub_services.objects.get(sub_srv_id=sub_service_id)
                    exists = agg_hhc_professional_sub_services.objects.filter(
                        srv_prof_id=service_professional_instance,
                        sub_srv_id=sub_service
                    ).exists()

                    if not exists:
                        psss = agg_hhc_professional_sub_services.objects.create(
                            srv_prof_id=service_professional_instance,
                            sub_srv_id=sub_service,
                            added_by=data.get('last_modified_by'),
                            last_modified_by=data.get('last_modified_by'),
                        )
                        sub.append({
                            'prof_sub_srv_id': psss.prof_sub_srv_id,
                            'srv_prof_id': service_professional_instance.srv_prof_id,
                            'sub_srv_id': sub_service.sub_srv_id,
                            'added_by': psss.added_by,
                            'last_modified_by': psss.last_modified_by
                        })
                    else:
                        print(f"Entry already exists for srv_prof_id: {service_professional_instance.srv_prof_id}, sub_srv_id: {sub_service.sub_srv_id}")



            # if sub_services:
            #     sub_services_list = ast.literal_eval(sub_services)
            #     for sub_service_id in sub_services_list:
            #         sub_service = agg_hhc_sub_services.objects.get(sub_srv_id=sub_service_id)
            #         psss = agg_hhc_professional_sub_services.objects.create(
            #             srv_prof_id=service_professional_instance,
            #             sub_srv_id=sub_service,
            #             added_by=data.get('last_modified_by'),
            #             last_modified_by=data.get('last_modified_by'),
            #         )
            #         sub.append({
            #             'prof_sub_srv_id': psss.prof_sub_srv_id,
            #             'srv_prof_id': service_professional_instance.srv_prof_id,
            #             'sub_srv_id': sub_service.sub_srv_id,
            #             'added_by': psss.added_by,
            #             'last_modified_by': psss.last_modified_by
            #         })

            # if zones:

            #     zone = agg_hhc_professional_zone.objects.get(prof_zone_id=ccsc)
            #     pli = agg_hhc_professional_location.objects.create(
            #         srv_prof_id=service_professional_instance,
            #         location_name=zone.Name,
            #         added_by=data.get('last_modified_by'),
            #         last_modified_by=data.get('last_modified_by'),
            #     )
            #     znd.append({
            #         "prof_loc_id": pli.prof_loc_id,
            #         "srv_prof_id": service_professional_instance.srv_prof_id,
            #         "location_name": zone.Name,
            #         "added_by": pli.added_by,
            #         "last_modified_by": pli.last_modified_by
            #     })                


            if zones:

                for zone_id in zones: 
                    zone = agg_hhc_professional_zone.objects.get(prof_zone_id=zone_id)
                    exists = agg_hhc_professional_location.objects.filter(
                        srv_prof_id=service_professional_instance,
                        location_name=zone.Name
                    ).exists()
                    
                    if not exists:
                        # Create a new record if it does not exist
                        pli = agg_hhc_professional_location.objects.create(
                            srv_prof_id=service_professional_instance,
                            location_name=zone.Name,
                            added_by=data.get('last_modified_by'),
                            last_modified_by=data.get('last_modified_by'),
                        )
                        # Append the details to the znd list
                        znd.append({
                            "prof_loc_id": pli.prof_loc_id,
                            "srv_prof_id": service_professional_instance.srv_prof_id,
                            "location_name": zone.Name,
                            "added_by": pli.added_by,
                            "last_modified_by": pli.last_modified_by
                        })
                    else:
                        print(f"Entry already exists for srv_prof_id: {service_professional_instance.srv_prof_id}, location_name: {zone.Name}")

            response_data = {
                "message": "Data updated successfully",
                "service_professional": service_professional_serializer.data,
                "colleague": colleague_serializer.data,
                "sub_services": sub,
                "Zone": znd,
            }

            return Response(response_data, status=status.HTTP_200_OK)

        # except Exception as e:
        #     return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Log the exception with a full traceback for detailed error information
            error_trace = traceback.format_exc()
            logger.error(f"An error occurred: {str(e)}\nTraceback: {error_trace}")

            # Return the error response with both the message and traceback details
            return Response({
                'error1': str(e),
                'traceback': error_trace
            }, status=status.HTTP_400_BAD_REQUEST)

# ___------------------------------------------------------------------------------------------------------




import json

import traceback
import logging

# Configure logging (you may already have this set up in Django settings)
logger = logging.getLogger(__name__)


def serialize_instance(instance, serializer_class):
    if instance:
        serializer = serializer_class(instance)
        return serializer.data
    return None



from django.http import JsonResponse
import json
from django.core.files.storage import default_storage
from django.db import transaction    

# import magic


class Register_professioanl_for_HR(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    # professional = agg_hhc_service_professionals.get 

    def get(self, request, prof_id=None):

        try:
            if prof_id:
                professional = agg_hhc_service_professionals.objects.get(srv_prof_id=prof_id)
                serialized_professional = Register_professioanl_for_professional(professional).data

                qualification = agg_hhc_service_professional_details.objects.get(srv_prof_id=prof_id)
                serialized_qualification = GET_prof_qualification_serializer(qualification).data

                # interview = agg_hhc_prof_interview_details.objects.get(srv_prof_id=prof_id)
                # serialized_interview = add_prof_schedule_interview(interview).data

                sub_services = agg_hhc_professional_sub_services.objects.filter(srv_prof_id=prof_id)
                serialized_sub_services = [serialize_instance(sub_service, show_prof_sub_services_serializer) for sub_service in sub_services]

                zones = agg_hhc_professional_location.objects.filter(srv_prof_id=prof_id)
                serialized_zones = [serialize_instance(zone, add_prof_zones_serializer) for zone in zones]

                response_data = {
                    "professional": serialized_professional,
                    "qualification": serialized_qualification,
                    # "interview": serialized_interview,
                    "sub_services": serialized_sub_services,
                    "zones": serialized_zones,
                }

                return Response(response_data, status=status.HTTP_200_OK)

            # If prof_id is not provided, return an empty response or a specific message.
            return Response(status=status.HTTP_204_NO_CONTENT)  # No content if prof_id is missing

        except agg_hhc_service_professionals.DoesNotExist:
            return Response({'error': 'Professional not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)        




    def post(self, request, *args, **kwargs):
        data = request.data

        try:
            # Start a transaction block to ensure rollback in case of errors
            with transaction.atomic():
                # Existing logic for data preparation, saving, and validation
                title_value = int(data.get('title', 0))
                title_name = Title(title_value).name if title_value in Title._value2member_map_ else ""
                full_colleague_name = f"{title_name} {data.get('clg_first_name', '')} {data.get('clg_last_name', '')}".strip()
                srv = int(request.data.get('srv_id'))

                # Existing data retrieval, e.g., for zones and services
                znjjn = agg_hhc_professional_zone.objects.get(prof_zone_id=data.get('prof_zone'))

                # Prepare service professional data (unchanged)
                service_professional_data = {
                    'title': title_value,
                    'role': data.get('role'),
                    'prof_fullname': full_colleague_name,
                    'gender': data.get('gender'),
                    'dob': data.get('dob'),
                    'doj': data.get('doj'),
                    'certificate_registration_no': data.get('certificate_registration_no'),
                    'srv_id': srv,
                    'Job_type': data.get('Job_type'),
                    'phone_no': data.get('contact_number'),
                    'work_phone_no':  data.get('contact_number'),
                    'email_id': data.get('email'),
                    'alt_phone_no': data.get('alternate_number'),
                    'eme_contact_no': data.get('emergency_contact_number'),
                    'eme_conact_person_name': data.get('emergency_name'),
                    'eme_contact_relation': data.get('emergency_relation'),
                    'state_name': data.get('state'),
                    'city': data.get('city'),
                    'address': data.get('address'),
                    'prof_address': data.get('address'),
                    'pin_code_id': data.get('pincode'),
                    'prof_zone_id': znjjn.Name,
                    'langitude': data.get('langitude'),
                    'lattitude': data.get('lattitude'),
                    'added_by': data.get('added_by'),
                    'last_modified_by': data.get('last_modified_by'),
                    'cv_file': data.get('cv_file'),
                    'google_home_location': data.get('google_home_location'),
                    'prof_compny': data.get('prof_compny'),
                    'prof_registered': True,
                    'prof_interviewed': False,
                    'prof_doc_verified': False,
                    'prof_compny': 1
                }

                # Prepare colleague data (unchanged)
                colleague_data = {
                    'clg_first_name': full_colleague_name,
                    'clg_gender': data.get('gender'),
                    'clg_Date_of_birth': data.get('dob'),
                    'clg_joining_date': data.get('doj'),
                    'clg_qualification': data.get('qualification'),
                    'clg_specialization': data.get('clg_specialization'),
                    'clg_Work_phone_number': data.get('contact_number'),
                    'clg_work_email_id': data.get('email'),
                    'clg_mobile_no': data.get('alternate_number'),
                    'clg_state': data.get('state'),
                    'clg_address': data.get('address'),
                    'added_by': data.get('added_by'),
                    'last_modified_by': data.get('last_modified_by'),
                    'prof_compny': data.get('prof_compny'),
                    'password': "pbkdf2_sha256$600000$SVzSqOf9wlaVJpe6mWYSFw$VNaciXlbe6Jxn4V54EkzN05IPL2LtlzgzxRi2OcCo7Y=",
                    'grp_id': 2,
                    'clg_hos_id': 34,
                }

                # Check for duplicate phone number
                existing_colleague = agg_hhc_service_professionals.objects.filter(phone_no=data.get('contact_number')).first()
                if existing_colleague:
                    return Response({"error": "This professional number is already registered."},status=status.HTTP_409_CONFLICT,)

                # Validate and save colleague data
                colleague_serializer = Add_Proffesional_Clg_Table_amit_Serializer(data=colleague_data)
                if colleague_serializer.is_valid():
                    colleague_instance = colleague_serializer.save()
                    colleague_instance.clg_ref_id = f"clg_{colleague_instance.id}"
                    colleague_instance.save()

                    # Assign colleague reference ID
                    service_professional_data['clg_ref_id'] = colleague_instance.clg_ref_id

                    # Existing service professional logic (unchanged)
                    srvic = srv
                    srv = None
                    try:
                        srv = agg_hhc_services.objects.get(srv_id=srvic)
                    except agg_hhc_services.DoesNotExist:
                        srv = None

                    if srv:
                        service_professional_data['srv_id'] = srv.service_title
                    else:
                        service_professional_data['srv_id'] = None

                    # Validate and save service professional data
                    service_professional_serializer = Add_Proffesional_Service_Professionals_amit_Table_Serializer(data=service_professional_data)
                    if service_professional_serializer.is_valid():
                        service_professional_instance = service_professional_serializer.save()

                        # Save CV and additional details
                        professional_details_data = {
                            'srv_prof_id': service_professional_instance.pk,
                            'qualification': data.get('qualification'),
                            # 'prof_CV': data.get('cv_file'),
                            'specialization': data.get('clg_specialization'),
                            'availability_for_interview': data.get('availability_for_interview') if data.get('availability_for_interview') else None,
                            'added_by': data.get('added_by'),
                            'last_modified_by': data.get('last_modified_by')
                        }
                        professional_details_serializer = Professional_CV_Details_amit_Serializer(data=professional_details_data)
                        if professional_details_serializer.is_valid():
                            professional_details_serializer.save()
                        else:
                            return Response(professional_details_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


                        # # Save sub-services

                        abb = request.data.get('sub_services')
                        ccc = request.data.get('prof_zone')
                        dddd = ast.literal_eval(ccc)
                        abbc = ast.literal_eval(abb)
                        prid= agg_hhc_service_professionals.objects.get(srv_prof_id = service_professional_instance.pk)
                        sub = []
                        znd = []
                        for i in abbc:

                            sub_srv_inst = agg_hhc_sub_services.objects.get(sub_srv_id=i)
                            psss = agg_hhc_professional_sub_services.objects.create(
                                srv_prof_id = prid,
                                sub_srv_id = sub_srv_inst,
                                added_by = data.get('added_by'),
                                last_modified_by = data.get('last_modified_by'),
                                
                            )
                            dt = {
                                'prof_sub_srv_id':psss.prof_sub_srv_id,
                                'srv_prof_id':prid.srv_prof_id,
                                'sub_srv_id':sub_srv_inst.sub_srv_id,
                                'added_by':psss.added_by,
                                'last_modified_by':psss.last_modified_by
                                
                            }
                            sub.append(dt)
                        print(dddd,"dddddddddddddddddddd")
                        
                        # for i in dddd:
                        #     print('print_i ',i)
                        #     znn = agg_hhc_professional_zone.objects.get(prof_zone_id=i)
                        #     pli=agg_hhc_professional_location.objects.create(
                        #         srv_prof_id = prid,
                        #         location_name = znn.Name,
                        #         added_by = data.get('added_by'),
                        #         last_modified_by = data.get('last_modified_by')                                
                        #     )
                        #     dddt = {
                        #         "prof_loc_id":pli.prof_loc_id,
                        #         "srv_prof_id": prid.srv_prof_id,
                        #         "location_name": znn.Name,
                        #         "last_modified_by":pli.last_modified_by,
                        #         "added_by": pli.added_by
                        #     }
                        #     znd.append(dddt)

                        
                        print('print_i ',i)
                        znn = agg_hhc_professional_zone.objects.get(prof_zone_id=dddd)
                        pli=agg_hhc_professional_location.objects.create(
                            srv_prof_id = prid,
                            location_name = znn.Name,
                            added_by = data.get('added_by'),
                            last_modified_by = data.get('last_modified_by')                                
                        )
                        dddt = {
                            "prof_loc_id":pli.prof_loc_id,
                            "srv_prof_id": prid.srv_prof_id,
                            "prof_zone": znn.prof_zone_id,
                            "location_name": znn.Name,
                            "last_modified_by":pli.last_modified_by,
                            "added_by": pli.added_by
                        }
                        znd.append(dddt)


                        # Prepare response data
                        response_data = {
                            "message": "Data saved successfully",
                            "service_professional": service_professional_serializer.data,
                            "colleague": colleague_serializer.data,
                        }
                        return Response(response_data, status=status.HTTP_201_CREATED)
                    else:
                        return Response(service_professional_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                return Response(colleague_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Ensure rollback and log the error
            error_trace = traceback.format_exc()
            logger.error(f"An error occurred: {str(e)}\nTraceback: {error_trace}")
            return Response({
                'error': str(e),
                'traceback': error_trace
            }, status=status.HTTP_400_BAD_REQUEST)

# # ___________ AMit __________________
#     def post(self, request, *args, **kwargs):
#         # print("Request Data:", request.data)
#         data = request.data

#         # Concatenate full name
#         title_value = int(data.get('title', 0))
#         title_name = Title(title_value).name if title_value in Title._value2member_map_ else ""
#         full_colleague_name = f"{title_name} {data.get('clg_first_name', '')} {data.get('clg_last_name', '')}".strip()
#         srv = int(request.data.get('srv_id'))
#         print('32782_____________322',srv)
#         # inst = agg_hhc_company.objects.get(company_pk_id=1)
#         # if inst.DoesNotExist():
#         #     return Response({"error": f"company ID - {inst} not found."}, status=status.HTTP_404_NOT_FOUND)
#         # Service professional data
#         znjjn = agg_hhc_professional_zone.objects.get(prof_zone_id=data.get('prof_zone'))
#         service_professional_data = {
#             'title': title_value,
#             'role': data.get('role'),
#             'prof_fullname': full_colleague_name,
#             'gender': data.get('gender'),
#             'dob': data.get('dob'),
#             'doj': data.get('doj'),
#             # 'Education_level': data.get('qualification'),
#             'certificate_registration_no': data.get('certificate_registration_no'),
#             'srv_id': srv,
#             'Job_type': data.get('Job_type'),
#             'phone_no': data.get('contact_number'),
#             'email_id': data.get('email'),
#             'alt_phone_no': data.get('alternate_number'),
#             'eme_contact_no': data.get('emergency_contact_number'),
#             'eme_conact_person_name': data.get('emergency_name'),
#             'eme_contact_relation': data.get('emergency_relation'),
#             'state_name': data.get('state'),
#             'city': data.get('city'),
#             'prof_address': data.get('address'),
#             'pin_code_id': data.get('pincode'),
#             'prof_zone_id': znjjn.Name,
#             'langitude': data.get('langitude'),
#             'lattitude': data.get('lattitude'),
#             'added_by': data.get('added_by'),
#             'last_modified_by': data.get('last_modified_by'),
#             'cv_file': data.get('cv_file'),
#             'google_home_location': data.get('google_home_location'),
#             'prof_compny': data.get('prof_compny'),
#             'prof_registered': True,
#             'prof_interviewed': False,
#             'prof_doc_verified': False,
#             'prof_compny': 1
#         }

#         # Colleague data
#         colleague_data = {
#             'clg_first_name': full_colleague_name,
#             'clg_gender': data.get('gender'),
#             'clg_Date_of_birth': data.get('dob'),
#             'clg_joining_date': data.get('doj'),
#             'clg_qualification': data.get('qualification'),
#             'clg_specialization': data.get('clg_specialization'),
#             'clg_Work_phone_number': data.get('contact_number'),
#             'clg_work_email_id': data.get('email'),
#             'clg_mobile_no': data.get('alternate_number'),
#             'clg_state': data.get('state'),
#             'clg_address': data.get('address'),
#             'added_by': data.get('added_by'),
#             'last_modified_by': data.get('last_modified_by'),
#             'prof_compny': data.get('prof_compny'),
#             'password': "pbkdf2_sha256$600000$SVzSqOf9wlaVJpe6mWYSFw$VNaciXlbe6Jxn4V54EkzN05IPL2LtlzgzxRi2OcCo7Y=",
#             'grp_id': 14,
#             'clg_hos_id': 34,
#         }

#         # Check for duplicate phone number
#         existing_colleague = agg_hhc_service_professionals.objects.filter(phone_no=data.get('contact_number')).first()
#         if existing_colleague:
#             return Response({
#                 "service_professional_errors": {
#                     "phone_no": ["agg_hhc_service_professionals with this phone no already exists."]
#                 }
#             }, status=status.HTTP_409_CONFLICT)

#         # Start a transaction block
#         try:
#             with transaction.atomic():
#                 # Validate and save colleague data
#                 colleague_serializer = Add_Proffesional_Clg_Table_amit_Serializer(data=colleague_data)
#                 if colleague_serializer.is_valid():
#                     colleague_instance = colleague_serializer.save()
#                     colleague_instance.clg_ref_id = f"clg_{colleague_instance.id}"
#                     colleague_instance.save()

#                     # Assign colleague reference ID
#                     service_professional_data['clg_ref_id'] = colleague_instance.clg_ref_id

#                     # Handle service ID
#                     srvic = srv
#                     srv = None
#                     try:
#                         srv = agg_hhc_services.objects.get(srv_id=srvic)
#                     except agg_hhc_services.DoesNotExist:
#                         srv = None

#                     if srv:
#                         service_professional_data['srv_id'] = srv.service_title
#                     else:
#                         service_professional_data['srv_id'] = None

#                     # Validate and save service professional data
#                     service_professional_serializer = Add_Proffesional_Service_Professionals_amit_Table_Serializer(data=service_professional_data)
#                     if service_professional_serializer.is_valid():
#                         service_professional_instance = service_professional_serializer.save()

#                         # Save CV and additional details
#                         professional_details_data = {
#                             'srv_prof_id': service_professional_instance.pk,
#                             'qualification': data.get('qualification'),
#                             'prof_CV': data.get('cv_file'),
#                             'specialization': data.get('clg_specialization'),
#                             'availability_for_interview': data.get('availability_for_interview'),
#                             'added_by': data.get('added_by'),
#                             'last_modified_by': data.get('last_modified_by')
#                         }
#                         professional_details_serializer = Professional_CV_Details_amit_Serializer(data=professional_details_data)
#                         if professional_details_serializer.is_valid():
#                             professional_details_serializer.save()
#                         else:
#                             return Response(professional_details_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#                         # # Save sub-services

#                         abb = request.data.get('sub_services')
#                         ccc = request.data.get('prof_zone')
#                         dddd = ast.literal_eval(ccc)
#                         abbc = ast.literal_eval(abb)
#                         prid= agg_hhc_service_professionals.objects.get(srv_prof_id = service_professional_instance.pk)
#                         sub = []
#                         znd = []
#                         for i in abbc:

#                             sub_srv_inst = agg_hhc_sub_services.objects.get(sub_srv_id=i)
#                             psss = agg_hhc_professional_sub_services.objects.create(
#                                 srv_prof_id = prid,
#                                 sub_srv_id = sub_srv_inst,
#                                 added_by = data.get('added_by'),
#                                 last_modified_by = data.get('last_modified_by'),
                                
#                             )
#                             dt = {
#                                 'prof_sub_srv_id':psss.prof_sub_srv_id,
#                                 'srv_prof_id':prid.srv_prof_id,
#                                 'sub_srv_id':sub_srv_inst.sub_srv_id,
#                                 'added_by':psss.added_by,
#                                 'last_modified_by':psss.last_modified_by
                                
#                             }
#                             sub.append(dt)
#                         print(dddd,"dddddddddddddddddddd")
                        
#                         # for i in dddd:
#                         #     print('print_i ',i)
#                         #     znn = agg_hhc_professional_zone.objects.get(prof_zone_id=i)
#                         #     pli=agg_hhc_professional_location.objects.create(
#                         #         srv_prof_id = prid,
#                         #         location_name = znn.Name,
#                         #         added_by = data.get('added_by'),
#                         #         last_modified_by = data.get('last_modified_by')                                
#                         #     )
#                         #     dddt = {
#                         #         "prof_loc_id":pli.prof_loc_id,
#                         #         "srv_prof_id": prid.srv_prof_id,
#                         #         "location_name": znn.Name,
#                         #         "last_modified_by":pli.last_modified_by,
#                         #         "added_by": pli.added_by
#                         #     }
#                         #     znd.append(dddt)

                        
#                         print('print_i ',i)
#                         znn = agg_hhc_professional_zone.objects.get(prof_zone_id=dddd)
#                         pli=agg_hhc_professional_location.objects.create(
#                             srv_prof_id = prid,
#                             location_name = znn.Name,
#                             added_by = data.get('added_by'),
#                             last_modified_by = data.get('last_modified_by')                                
#                         )
#                         dddt = {
#                             "prof_loc_id":pli.prof_loc_id,
#                             "srv_prof_id": prid.srv_prof_id,
#                             "prof_zone": znn.prof_zone_id,
#                             "location_name": znn.Name,
#                             "last_modified_by":pli.last_modified_by,
#                             "added_by": pli.added_by
#                         }
#                         znd.append(dddt)


                        
#                         response_data = {
#                             "message": "Data saved successfully",
#                             "service_professional": service_professional_serializer.data,
#                             "colleague": colleague_serializer.data,
#                             "sub_services": sub,
#                             "Zone":znd
#                         }
#                         return Response(response_data, status=status.HTTP_201_CREATED)
#                     else:
#                         return Response(service_professional_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#                 return Response(colleague_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#         except Exception as e:
#             # Log the exception with a full traceback for detailed error information
#             error_trace = traceback.format_exc()
#             logger.error(f"An error occurred: {str(e)}\nTraceback: {error_trace}")

#             # Return the error response with both the message and traceback details
#             return Response({
#                 'error1': str(e),
#                 'traceback': error_trace
#             }, status=status.HTTP_400_BAD_REQUEST)








# ---------------------------------------------------------- Closure Revalidate Amit --------------------------------------------------------------------------


class Closure_Revalidate_Ongoing_Eve(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]

    # def get(self, request):
    #     # if(int(hosp_id)==0):
    #     print('hiii')
    #     eve_ids = []
    #     print(eve_ids,'eve')

    #     if eve_code:= request.GET.get('eve_code'):
    #         eve_idss = agg_hhc_events.objects.filter(event_code=eve_code, status=1)
    #         for eve_id in eve_idss:
    #             eve_ids.append(eve_id.eve_id) 
    #     elif (cl_no:= request.GET.get('caller_no')):
    #         print('condition in cl number and date')
    #         if (date := request.GET.get('date')):
                
    #             dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=date, status = 1)
    #             eve_ids_lst = list(set(dtl_data.values_list('eve_id', flat=True)))
    #             cl_dt = agg_hhc_callers.objects.filter(phone__icontains=cl_no)
    #             eve_idss = agg_hhc_events.objects.filter(eve_id__in=eve_ids_lst, caller_id__in=cl_dt, status=1)
    #         else:
    #             cl_dt = agg_hhc_callers.objects.filter(phone__icontains=cl_no)
    #             eve_idss = agg_hhc_events.objects.filter(caller_id__in=cl_dt, status=1)
    #         for eve_id in eve_idss:
    #             eve_ids.append(eve_id.eve_id) 
    #     elif (cl_name:= request.GET.get('caller_name')):
    #         print('condition in cl name and date')
    #         if (date := request.GET.get('date')):
                
    #             dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=date, status = 1)
    #             cl_dt = agg_hhc_callers.objects.filter(caller_fullname__icontains=cl_name)
    #             eve_ids_lst = list(set(dtl_data.values_list('eve_id', flat=True)))
    #             eve_idss = agg_hhc_events.objects.filter(eve_id__in=eve_ids_lst, caller_id__in=cl_dt, status=1)
    #             dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=date, status = 1)
    #         else:
    #             cl_dt = agg_hhc_callers.objects.filter(caller_fullname__icontains=cl_name)

    #             eve_idss = agg_hhc_events.objects.filter( caller_id__in=cl_dt, status=1)

    #         for eve_id in eve_idss:
    #             eve_ids.append(eve_id.eve_id)
    #     elif (pt_no:= request.GET.get('patient_no')) :
    #         print('condition in patient no and date')
    #         if (date := request.GET.get('date')):
    #             dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=date, status = 1)
    #             pt_dt = agg_hhc_patients.objects.filter(phone_no__icontains=pt_no)
    #             eve_ids_lst = list(set(dtl_data.values_list('eve_id', flat=True)))
    #             eve_idss = agg_hhc_events.objects.filter(eve_id__in=eve_ids_lst, agg_sp_pt_id__in=pt_dt, status=1)
    #         else: 
    #             pt_dt = agg_hhc_patients.objects.filter(phone_no__icontains=pt_no)
    #             eve_idss = agg_hhc_events.objects.filter(agg_sp_pt_id__in=pt_dt, status=1)
    #         for eve_id in eve_idss:
    #             eve_ids.append(eve_id.eve_id)
    #     elif (pt_name:= request.GET.get('patient_name')):
    #         print('condition in patient name and date')
    #         if (date := request.GET.get('date')):
    #             dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=date, status = 1)
    #             pt_dt = agg_hhc_patients.objects.filter(name__icontains=pt_name)
    #             eve_ids_lst = list(set(dtl_data.values_list('eve_id', flat=True)))
    #             eve_idss = agg_hhc_events.objects.filter(eve_id__in=eve_ids_lst, agg_sp_pt_id__in=pt_dt, status=1)
    #         else:
    #             pt_dt = agg_hhc_patients.objects.filter(name__icontains=pt_name)
    #             eve_idss = agg_hhc_events.objects.filter(agg_sp_pt_id__in=pt_dt, status=1)
    #         for eve_id in eve_idss:
    #             eve_ids.append(eve_id.eve_id)
    #     elif (s_month:= request.GET.get('s_month')) and (e_month:= request.GET.get('e_month')):
    #         dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time__range=(s_month,e_month), status = 1)
    #         eve_list = [i.eve_id for i in dtl_data]
    #         unique_eve = set(eve_list)
    #         for eve_id in unique_eve:
    #            eve_ids.append(eve_id.eve_id)
    #     elif (prof_name:=request.GET.get('prof_name')):
    #         print('condition in prof name and date')
    #         if (date := request.GET.get('date')):
    #             dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time = date,srv_prof_id__prof_fullname__icontains=prof_name, status = 1)
    #         else:
    #             dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(srv_prof_id__prof_fullname__icontains=prof_name, status = 1)
    #         eve_list = [i.eve_id for i in dtl_data]
    #         unique_eve = set(eve_list)
    #         for eve_id in unique_eve:
    #            eve_ids.append(eve_id.eve_id)
    #     elif (srv_id:=request.GET.get('srv_id')) and (date := request.GET.get('date')):
    #         print('condition in service name and date')
    #         dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time = date, eve_poc_id__srv_id=srv_id, status = 1)
    #         eve_list = [i.eve_id for i in dtl_data]
    #         unique_eve = set(eve_list)
    #         for eve_id in unique_eve:
    #            eve_ids.append(eve_id.eve_id)
    #     elif date := request.GET.get('date'):
    #         print(date,'date')
    #         dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=date, status = 1)
    #         eve_list = [i.eve_id for i in dtl_data]
    #         unique_eve = set(eve_list)
    #         for eve_id in unique_eve:
    #             eve_ids.append(eve_id.eve_id)
    #     else:
    #         print('condition else')
    #         dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=timezone.now().date(), status = 1)
    #         # eve_list = [i.eve_id fors i in dtl_data]
    #         eve_list = [i.eve_id for i in dtl_data if i.eve_id is not None]
    #         unique_eve = set(eve_list)
    #         for eve_id in unique_eve:
    #             eve_ids.append(eve_id.eve_id)
        
        
    #     print('hii2')
    #     if not eve_ids:
    #         return Response({"msg":"data not foundf"})
    #     else:
    #         print(eve_ids,'eve_ids')
    #         data =  agg_hhc_events.objects.filter(Q(event_status=2) | Q(event_status=3),eve_id__in=eve_ids,status=1)
    #         # else:
    #         #     data =  agg_hhc_events.objects.filter(Q(event_status=2) | Q(event_status=3),status=1,added_from_hosp=hosp_id)
    #         serialize_data=Ongoing_Eve_serializer(data, many=True) 
    #         return Response(serialize_data.data)

    def get(self, request):
        try:
            eve_ids = []
            # Validation for eve_code
            if eve_code := request.GET.get('eve_code'):
                eve_idss = agg_hhc_events.objects.filter(event_code=eve_code, status=1)
                if not eve_idss.exists():
                    return Response({"msg": "No events found for the provided eve_code."}, status=404)
                eve_ids.extend(eve.eve_id for eve in eve_idss)

            # Validation for caller_no
            elif cl_no := request.GET.get('caller_no'):
                cl_dt = agg_hhc_callers.objects.filter(phone__icontains=cl_no)
                if not cl_dt.exists():
                    return Response({"msg": "Caller not found."}, status=404)
                if date := request.GET.get('date'):
                    dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=date, status=1)
                    eve_ids_lst = list(set(dtl_data.values_list('eve_id', flat=True)))
                    eve_idss = agg_hhc_events.objects.filter(eve_id__in=eve_ids_lst, caller_id__in=cl_dt, status=1)
                else:
                    eve_idss = agg_hhc_events.objects.filter(caller_id__in=cl_dt, status=1)
                eve_ids.extend(eve.eve_id for eve in eve_idss)

            # Validation for caller_name
            elif cl_name := request.GET.get('caller_name'):
                cl_dt = agg_hhc_callers.objects.filter(caller_fullname__icontains=cl_name)
                if not cl_dt.exists():
                    return Response({"msg": "Caller not found."}, status=404)
                if date := request.GET.get('date'):
                    dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=date, status=1)
                    eve_ids_lst = list(set(dtl_data.values_list('eve_id', flat=True)))
                    eve_idss = agg_hhc_events.objects.filter(eve_id__in=eve_ids_lst, caller_id__in=cl_dt, status=1)
                else:
                    eve_idss = agg_hhc_events.objects.filter(caller_id__in=cl_dt, status=1)
                eve_ids.extend(eve.eve_id for eve in eve_idss)

            # Validation for patient_no
            elif pt_no := request.GET.get('patient_no'):
                pt_dt = agg_hhc_patients.objects.filter(phone_no__icontains=pt_no)
                if not pt_dt.exists():
                    return Response({"msg": "Patient not found."}, status=404)
                if date := request.GET.get('date'):
                    dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=date, status=1)
                    eve_ids_lst = list(set(dtl_data.values_list('eve_id', flat=True)))
                    eve_idss = agg_hhc_events.objects.filter(eve_id__in=eve_ids_lst, agg_sp_pt_id__in=pt_dt, status=1)
                else:
                    eve_idss = agg_hhc_events.objects.filter(agg_sp_pt_id__in=pt_dt, status=1)
                eve_ids.extend(eve.eve_id for eve in eve_idss)

            # Validation for patient_name
            elif pt_name := request.GET.get('patient_name'):
                pt_dt = agg_hhc_patients.objects.filter(name__icontains=pt_name)
                if not pt_dt.exists():
                    return Response({"msg": "Patient not found."}, status=404)
                if date := request.GET.get('date'):
                    dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=date, status=1)
                    eve_ids_lst = list(set(dtl_data.values_list('eve_id', flat=True)))
                    eve_idss = agg_hhc_events.objects.filter(eve_id__in=eve_ids_lst, agg_sp_pt_id__in=pt_dt, status=1)
                else:
                    eve_idss = agg_hhc_events.objects.filter(agg_sp_pt_id__in=pt_dt, status=1)
                eve_ids.extend(eve.eve_id for eve in eve_idss)

            # Validation for other parameters (e.g., patient_name, date range, etc.)
            elif (s_month := request.GET.get('s_month')) and (e_month := request.GET.get('e_month')):
                try:
                    dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(
                        actual_StartDate_Time__range=(s_month, e_month), status=1
                    )
                except ValueError:
                    return Response({"msg": "Invalid date range provided."}, status=400)
                unique_eve = set(dtl_data.values_list('eve_id', flat=True))
                eve_ids.extend(unique_eve)

            elif (prof_name := request.GET.get('prof_name')):
                if date := request.GET.get('date'):
                    dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(
                        actual_StartDate_Time=date, srv_prof_id__prof_fullname__icontains=prof_name, status=1
                    )
                else:
                    dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(
                        srv_prof_id__prof_fullname__icontains=prof_name, status=1
                    )
                unique_eve = set(dtl_data.values_list('eve_id', flat=True))
                eve_ids.extend(unique_eve)

            


            # elif prof_name := request.GET.get('prof_name'):
            #     try:
            #         if date := request.GET.get('date'):
            #             dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(
            #                 actual_StartDate_Time=date,
            #                 srv_prof_id__isnull=False,
            #                 srv_prof_id__prof_fullname__icontains=prof_name,
            #                 status=1
            #             )
            #         else:
            #             dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(
            #                 srv_prof_id__isnull=False,
            #                 srv_prof_id__prof_fullname__icontains=prof_name,
            #                 status=1
            #             )
            #         unique_eve = set(dtl_data.values_list('eve_id', flat=True))
            #         eve_ids.extend(unique_eve)
            #     except Exception as e:
            #         error_message = "An unexpected error occurred."
            #         logger.error(f"{error_message}: {str(e)}")
            #         return Response({
            #             "error": error_message,
            #             "details": str(e),
            #             "traceback": traceback.format_exc()
            #         }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


            elif date := request.GET.get('date'):
                dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(actual_StartDate_Time=date, status=1)
                unique_eve = set(dtl_data.values_list('eve_id', flat=True))
                eve_ids.extend(unique_eve)

            else:
                dtl_data = agg_hhc_detailed_event_plan_of_care.objects.filter(
                    actual_StartDate_Time=timezone.now().date(), status=1
                )
                unique_eve = set(dtl_data.values_list('eve_id', flat=True))
                eve_ids.extend(unique_eve)

            # Final response validation
            if not eve_ids:
                return Response({"msg": "No events found."}, status=404)

            data = agg_hhc_events.objects.filter(
                Q(event_status=2) | Q(event_status=3), eve_id__in=eve_ids, status=1
            )
            # serialize_data = Ongoing_Eve_serializer(data, many=True)
            serialize_data = Closure_Revalidate_serializer(data, many=True)
            return Response(serialize_data.data)

        except ValidationError as e:
            return Response({"msg": str(e)}, status=400)

        except Exception as e:
            error_message = "An unexpected error occurred."
            logger.error(f"{error_message}: {str(e)}")
            return Response({
                "error": error_message,
                "details": str(e),
                "traceback": traceback.format_exc()
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




def get_prof123(request):
    clg_id = ""
    auth_header = request.headers.get('Authorization')

    if not auth_header:
        raise ValueError("Authorization header is missing.")

    try:
        token = str(auth_header).split()[1]
    except IndexError:
        raise ValueError("Authorization header format is invalid. Expected 'Bearer <token>'.")

    try:
        decoded_token = jwt.decode(
            token,
            key='django-insecure-gelhauh(a&-!e01zl$_ic4l07frx!1qx^h(zjitk(c57w(n6ry',
            algorithms=['HS256']
        )
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired.")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token.")

    clg_id = decoded_token.get('user_id')
    if not clg_id:
        raise ValueError("Token is missing the 'user_id' field.")

    try:
        clg_ref = agg_com_colleague.objects.get(id=clg_id)
    except agg_com_colleague.DoesNotExist:
        raise ValueError(f"No colleague found with id {clg_id}.")

    return clg_id, clg_ref.clg_ref_id



class Closure_Revalidate_ServiceCancellationView(APIView):
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
        # dtl = agg_hhc_detailed_event_plan_of_care.object.get(agg_sp_dt_eve_poc_id=dtl_eve_id)

        response_data = {
            "event_data": event_serializer.data,
            "Service_date": event_plan_serializer.data
        }

        return Response(response_data)



    def post(self, request, eve_id):
        clgref_id = get_prof(request)[3]
        
        request.data['last_modified_by'] = clgref_id

        data1 = agg_hhc_events.objects.get(eve_id=eve_id)
        print(request.data,'request.data')
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from hhc_professional_app.views import get_prof
from decimal import Decimal, InvalidOperation
from django.db.models import Min, Max, Sum, Value
from django.db.models.functions import Coalesce

class SessionCancellationView(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    serializer_class = get_dtl_epoc_data_for_canc_session
    serializer_class2 = post_in_cancellation_history
    def post(self, request):
        # clgref_id = get_prof(request)[3]
        clgref_id = "abc"
        request.data['last_modified_by'] = clgref_id
        
        eve_id = request.data.get('eve_id')
        # start_date_time = request.data.get('start_date_time')
        # end_date_time = request.data.get('end_date_time')
        date_ranges = request.data.get('date_range',[])
        # start_date_time = date_ranges[0]
        # end_date_time = date_ranges[-1]
        start_date_time = request.data.get('start_date_time')
        end_date_time = request.data.get('end_date_time')
        sub_srv_id = request.data.get('sub_srv_id')
        remark = request.data.get('remark')

        # if eve_id is None or start_date_time is None:
        if eve_id is None or date_ranges is None:
            return Response({'error': 'Please provide eve_id and start_date_time'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            get_event_data = agg_hhc_events.objects.get(eve_id=eve_id, status=1)
            epoc_model = agg_hhc_event_plan_of_care.objects.get(eve_id=eve_id, status=1)
        except agg_hhc_events.DoesNotExist:
            return Response({'error': 'Event record not found'}, status=status.HTTP_404_NOT_FOUND)
        except agg_hhc_event_plan_of_care.DoesNotExist:
            return Response({'error': 'Plan of care record not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            # if end_date_time:
            record = agg_hhc_detailed_event_plan_of_care.objects.filter(
                eve_id=eve_id,
                # actual_StartDate_Time__range=(start_date_time, end_date_time),
                actual_StartDate_Time__in=date_ranges,
                status=1
            )
            active_sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=eve_id, status=1)
            if record.exists() and active_sessions.count() == record.count() == len(date_ranges):
                return Response({
                    'msg': "Don't cancel the entire Service of sessions. If you want to cancel the entire session, please use the Service Cancellation option."
                }, status=status.HTTP_409_CONFLICT)

                # closure_data = record.filter(Session_jobclosure_status=1)
                # if closure_data.exists():
                #     closure_dates = [
                #         cl_date.actual_StartDate_Time.strftime('%Y-%m-%d') for cl_date in closure_data
                #     ]
                #     return Response({
                #         'dates': closure_dates,
                #         'msg': "Do not close the sessions, because job closure is done for that day."
                #     }, status=status.HTTP_400_BAD_REQUEST)
        except agg_hhc_detailed_event_plan_of_care.DoesNotExist:
            return Response({'error': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)

        get_total_sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=eve_id, status=1)
        get_cancelled_sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(
            eve_id=eve_id,
            # actual_StartDate_Time__range=(start_date_time, end_date_time),
            actual_StartDate_Time__in=date_ranges,
            status=1
        )
        # get_remaining_sessions = get_total_sessions.exclude(actual_StartDate_Time__range=(start_date_time, end_date_time))
        get_remaining_sessions = get_total_sessions.exclude(actual_StartDate_Time__in=date_ranges)

        get_sub_srv_data = agg_hhc_sub_services.objects.get(sub_srv_id=sub_srv_id)
        per_session_amt = int(get_sub_srv_data.cost)

        con_chrg_cancel = get_cancelled_sessions.aggregate(
            total_convinance_charges=Coalesce(Sum('convinance_charges'), Value(0))
        )['total_convinance_charges']

        con_chrg_remaining = get_remaining_sessions.aggregate(
            total_convinance_charges=Coalesce(Sum('convinance_charges'), Value(0))
        )['total_convinance_charges']

        total_cancel_amt = get_cancelled_sessions.count() * per_session_amt
        total_remaining_amt = get_remaining_sessions.count() * per_session_amt

        discounted_amt_remaining = self.calculate_discount(get_event_data, total_remaining_amt, get_remaining_sessions)

        final_amt_with_charge = discounted_amt_remaining + (con_chrg_remaining or 0)
        get_event_data.final_amount = final_amt_with_charge
        get_event_data.last_modified_by = clgref_id
        get_event_data.save()

        for session in get_cancelled_sessions:
            cancel_history = {
                'event_id': eve_id,
                'cancellation_by': request.data.get("cancellation_by"),
                'can_amt': per_session_amt,
                'convineance_chrg': session.convinance_charges or 0,
                'remark': remark,
                'agg_sp_dt_eve_poc_id': session.agg_sp_dt_eve_poc_id,
                'reason': request.data.get('reason'),
                'last_modified_by': clgref_id
            }
            serialized2_data = self.serializer_class2(data=cancel_history)
            if serialized2_data.is_valid():
                serialized2_data.save()
            else:
                return Response(serialized2_data.errors, status=status.HTTP_400_BAD_REQUEST)

            session.status = 2
            session.is_cancelled = 1
            session.remark = remark
            session.last_modified_by = clgref_id
            session.save()

        remaining_sessions = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=eve_id, status=1)
        depoc_start_date = remaining_sessions.aggregate(Min('actual_StartDate_Time'))['actual_StartDate_Time__min']
        depoc_end_date = remaining_sessions.aggregate(Max('actual_StartDate_Time'))['actual_StartDate_Time__max']


        gasd = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=eve_id, status=1).values_list('actual_StartDate_Time', flat=True)


        epoc_model.start_date = depoc_start_date
        epoc_model.end_date = depoc_end_date
        epoc_model.serivce_dates =  [date.strftime('%Y-%m-%d') for date in gasd if date]
        epoc_model.last_modified_by = clgref_id
        epoc_model.save()
        

        return Response({"msg": "Session cancelled successfully."}, status=status.HTTP_200_OK)

    def calculate_discount(self, event_data, remaining_amount, remaining_sessions):
        disc_type = event_data.discount_type
        disc_value = Decimal(event_data.discount_value or 0)

        if disc_type == 1:  # Percentage
            discounted_amt = (disc_value / 100) * remaining_amount
        elif disc_type == 2:  # Flat amount
            total_sessions = agg_hhc_event_plan_of_care.objects.get(eve_id=event_data.eve_id).serivce_dates.count()
            session_discount = event_data.initail_discount_value / total_sessions
            discounted_amt = session_discount * remaining_sessions.count()
        else:
            discounted_amt = 0

        return remaining_amount - discounted_amt


class Medical_job_Closure_Revalidate(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
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
            dt_eve_serializer = agg_hhc_session_job_closure_serializer(dteve)
            print(dt_eve_serializer.data,"dt_eve_serializer.data")
            seri=agg_hhc_session_job_closure_H_serializer(data=dt_eve_serializer.data,many=True)
            if seri.is_valid():
                # print(seri)
                seri.save()
            else: 
                return Response(seri.errors, status=status.HTTP_400_BAD_REQUEST)
            up_seri = agg_hhc_session_job_closure_serializer(dteve,data=request.data)
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
        try:
            dd = []
            pc = agg_hhc_event_plan_of_care.objects.filter(eve_id = eve_id, status = 1)
            for i in pc:
                if i.eve_id:
                    jcd_dt = []
                    form_no_dt = agg_hhc_jobclosure_form_numbering.objects.filter(prof_sub_srv_id=i.sub_srv_id.sub_srv_id, status = 1)
                    form_number = form_no_dt[0].form_number 
                    ddtl = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=i.eve_id, status=1,  actual_StartDate_Time__lte=datetime.datetime.today(), job_closure_medical_gevournance=1).exclude(agg_hhc_jobclosure_detail__closure_revalidate = 1)
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
                                                datetime.datetime.strptime(datedet[0], "%Y-%m-%d")
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
                                        ss_act_date = j.prof_session_start_date.isoformat() if j.prof_session_start_date else None
                                        ee_act_date = j.prof_session_end_date.isoformat() if j.prof_session_end_date else None
                                        ss_act_time = j.prof_session_start_time.isoformat() if j.prof_session_start_time else None
                                        ee_act_time = j.prof_session_end_time.isoformat() if j.prof_session_end_time else None
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
                                            "actual_sdate":dateeee,
                                            "actual_edate":dateeee,
                                            "actual_stime":s_timeeeee,
                                            "actual_etime":e_timeeeee,
                                            "sess_s_date":ss_act_date,
                                            "sess_e_date":ee_act_date,
                                            "sess_s_time":ss_act_time,
                                            "sess_e_time":ee_act_time,   
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
                                    ss_act_date = j.prof_session_start_date.isoformat() if j.prof_session_start_date else None
                                    ee_act_date = j.prof_session_end_date.isoformat() if j.prof_session_end_date else None
                                    ss_act_time = j.prof_session_start_time.isoformat() if j.prof_session_start_time else None
                                    ee_act_time = j.prof_session_end_time.isoformat() if j.prof_session_end_time else None
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
                                            "actual_sdate":dateeee,
                                            "actual_edate":dateeee,
                                            "actual_stime":s_timeeeee,
                                            "actual_etime":e_timeeeee,
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
                                jcdddd = globals().get(f'agg_hhc_session_job_closure_serializer_form_{form_number}', None)
                                dateeee = j.actual_StartDate_Time.isoformat() if j.actual_StartDate_Time else None
                                s_timeeeee = j.start_time.isoformat() if j.start_time else None
                                e_timeeeee = j.end_time.isoformat() if j.end_time else None
                                datetimeeeee = f'{dateeee} -- {s_timeeeee} - {e_timeeeee}'
                                ss_act_date = j.prof_session_start_date.isoformat() if j.prof_session_start_date else None
                                ee_act_date = j.prof_session_end_date.isoformat() if j.prof_session_end_date else None
                                ss_act_time = j.prof_session_start_time.isoformat() if j.prof_session_start_time else None
                                ee_act_time = j.prof_session_end_time.isoformat() if j.prof_session_end_time else None
                                if jcdddd and jc.exists():
                                    last_jc = jc.last() 
                                    jcddddttt = jcdddd(last_jc, many=False)
                                    jc_data = jcddddttt.data.copy()  
                                    jc_data['is_job_closure_done'] = True
                                    # jc_data['session_date']=j.actual_StartDate_Time.isoformat() if j.actual_StartDate_Time else None
                                    jc_data['session_date']= datetimeeeee
                                    # jc_data['session_date']= datetimeeeee
                                    jc_data['actual_sdate']=dateeee
                                    jc_data['actual_edate']=dateeee
                                    jc_data['actual_stime']=s_timeeeee
                                    jc_data['actual_etime']=e_timeeeee                
                                    jc_data['sess_s_date']=ss_act_date
                                    jc_data['sess_e_date']=ee_act_date
                                    jc_data['sess_s_time']=ss_act_time
                                    jc_data['sess_e_time']=ee_act_time
                                    jcd_dt.append(jc_data)
                                else:
                                    print("-------------------",form_number)
                                                                        # print("-------------------", form_number)

                                    # Attempt to get the serializer dynamically
                                    jcdddd = globals().get(f'mg_agg_hhc_session_job_closure_serializer_form_{form_number}', None)

                                    # Initialize an empty dictionary for `keys_with_none`
                                    keys_with_none = {}

                                    if jcdddd:  # Check if the serializer exists
                                        # Instantiate the serializer
                                        serializer_instance = jcdddd()

                                        # Create a dictionary with serializer fields set to None
                                        keys_with_none = {field: None for field in serializer_instance.fields.keys()}
                                    else:
                                        # Log error if the serializer does not exist
                                        logger.error(f"Serializer for form number {form_number} is not defined.")

                                    # Add or update additional keys to the `keys_with_none` dictionary
                                    dateeee = j.actual_StartDate_Time.isoformat() if j.actual_StartDate_Time else None
                                    s_timeeeee = j.start_time.isoformat() if j.start_time else None
                                    e_timeeeee = j.end_time.isoformat() if j.end_time else None
                                    datetimeeeee = f'{dateeee} -- {s_timeeeee} - {e_timeeeee}'
                                    ss_act_date = j.prof_session_start_date.isoformat() if j.prof_session_start_date else None
                                    ee_act_date = j.prof_session_end_date.isoformat() if j.prof_session_end_date else None
                                    ss_act_time = j.prof_session_start_time.isoformat() if j.prof_session_start_time else None
                                    ee_act_time = j.prof_session_end_time.isoformat() if j.prof_session_end_time else None

                                    # Update `keys_with_none` with additional keys and their values
                                    keys_with_none.update({
                                        "is_job_closure_done": False,
                                        "srv_prof_id": j.srv_prof_id.srv_prof_id if j.srv_prof_id else None,
                                        "prof_name": {
                                            "prof_name": j.srv_prof_id.prof_fullname if j.srv_prof_id else None,
                                            "prof_no": j.srv_prof_id.phone_no if j.srv_prof_id else None
                                        },
                                        "dtl_eve_id": j.agg_sp_dt_eve_poc_id if j.agg_sp_dt_eve_poc_id else None,
                                        "prof_sub_srv_id": i.sub_srv_id.sub_srv_id if i.sub_srv_id else None,
                                        "sub_srv_name": i.sub_srv_id.recommomded_service if i.sub_srv_id else None,
                                        "session_date": datetimeeeee,
                                        "actual_sdate":dateeee,
                                        "actual_edate":dateeee,
                                        "actual_stime":s_timeeeee,
                                        "actual_etime":e_timeeeee,
                                        "sess_s_date": dateeee,
                                        "sess_e_date": dateeee,
                                        "sess_s_time": s_timeeeee,
                                        "sess_e_time": e_timeeeee
                                    })

                                    # Debug output for keys_with_none
                                    print(keys_with_none)

                                    # Append the updated dictionary to the list
                                    jcd_dt.append(keys_with_none)


                    print(jcd_dt)
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
        except Exception as e:
            error_message = "An unexpected error occurred."
            logger.error(f"{error_message}: {str(e)}")
            return Response({
                "error": error_message,
                "details": str(e),
                "traceback": traceback.format_exc()
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)    





class datewise_job_closure_Revalidate_dtls(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    def get(self, request, from_date=None, to_date=None):
        if not from_date:
            from_date = (datetime.datetime.today() - timedelta(days=30)).strftime('%Y-%m-%d')
        if not to_date:
            to_date = datetime.datetime.today().strftime('%Y-%m-%d')

        from_date = datetime.datetime.strptime(from_date, '%Y-%m-%d')
        to_date = datetime.datetime.strptime(to_date, '%Y-%m-%d')
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




class agg_hhc_session_job_closure(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        dtl_eve = request.GET.get('dtl_eve')
        form_num = request.data.get('form_number')

        try:
            try:
                is_exist_jc_dtl_eve = agg_hhc_jobclosure_detail.objects.filter(dtl_eve_id=dtl_eve).last()
            except agg_hhc_jobclosure_detail.DoesNotExist:
                is_exist_jc_dtl_eve = None

            prof_sub_srv = agg_hhc_detailed_event_plan_of_care.objects.get(agg_sp_dt_eve_poc_id=dtl_eve)
            clgref_id = get_prof123(request)[1]
            
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
               
                if is_exist_jc_dtl_eve:
                    print("update serilizer")
                    serializer = serializer_class( is_exist_jc_dtl_eve, data=request.data)
                    detw = agg_hhc_jobclosure_detail.objects.filter(dtl_eve_id = dtl_eve).last()
                    # print("detw.srv_prof_id", detw )
                    # print(detw.srv_prof_id.srv_prof_id,"detw.srv_prof_id.srv_prof_id")
                    aa=agg_hhc_jobclosure_detail_H.objects.create(

                    jcolse_id = detw if detw else None,
                    srv_prof_id = detw.srv_prof_id if detw.srv_prof_id else None,
                    dtl_eve_id = detw.dtl_eve_id if detw.dtl_eve_id else None,
                    prof_sub_srv_id = detw.prof_sub_srv_id if detw.prof_sub_srv_id else None,
                    Baseline = detw.Baseline if detw.Baseline else None,
                    Airway = detw.Airway if detw.Airway else None,
                    Breathing = detw.Breathing if detw.Breathing else None,
                    Circulation = detw.Circulation if detw.Circulation else None,
                    Skin_Perfusion = detw.Skin_Perfusion if detw.Skin_Perfusion else None,
                    Wound = detw.Wound if detw.Wound else None,
                    Oozing = detw.Oozing if detw.Oozing else None,
                    Discharge = detw.Discharge if detw.Discharge else None,
                    Inj_site_IM = detw.Inj_site_IM if detw.Inj_site_IM else None,
                    Procedure = detw.Procedure if detw.Procedure else None,
                    Size_catheter = detw.Size_catheter if detw.Size_catheter else None,
                    Size_RT = detw.Size_RT if detw.Size_RT else None,
                    Temp_core = detw.Temp_core if detw.Temp_core else None,
                    TBSL = detw.TBSL if detw.TBSL else None,
                    Pulse = detw.Pulse if detw.Pulse else None,
                    SpO2 = detw.SpO2 if detw.SpO2 else None,
                    RR = detw.RR if detw.RR else None,
                    GCS_Total = detw.GCS_Total if detw.GCS_Total else None,
                    BP = detw.BP if detw.BP else None,
                    diastolic = detw.diastolic if detw.diastolic else None,
                    Remark = detw.Remark if detw.Remark else None,
                    Name_injection_fld = detw.Name_injection_fld if detw.Name_injection_fld else None,
                    Dose_freq = detw.Dose_freq if detw.Dose_freq else None,
                    Num_Sutures_staples = detw.Num_Sutures_staples if detw.Num_Sutures_staples else None,
                    Dressing_status = detw.Dressing_status if detw.Dressing_status else None,
                    Catheter_type = detw.Catheter_type if detw.Catheter_type else None,
                    Sutures_type = detw.Sutures_type if detw.Sutures_type else None,
                    Wound_dehiscence = detw.Wound_dehiscence if detw.Wound_dehiscence else None,
                    Strength_exer = detw.Strength_exer if detw.Strength_exer else None,
                    is_patient_death = detw.is_patient_death if detw.is_patient_death else None,
                    Stretch_exer = detw.Stretch_exer if detw.Stretch_exer else None,
                    Walk_indep = detw.Walk_indep if detw.Walk_indep else None,
                    Walker_stick = detw.Walker_stick if detw.Walker_stick else None,
                    Movin_or_moveout = detw.Movin_or_moveout if detw.Movin_or_moveout else None,
                    Mobin_or_moveout_datetime_remark = detw.Mobin_or_moveout_datetime_remark if detw.Mobin_or_moveout_datetime_remark else None,
                    Getin_or_getout = detw.Getin_or_getout if detw.Getin_or_getout else None,
                    Getin_or_getout_datetime_remark = detw.Getin_or_getout_datetime_remark if detw.Getin_or_getout_datetime_remark else None,
                    ChairTobed_or_bedTochair = detw.ChairTobed_or_bedTochair if detw.ChairTobed_or_bedTochair else None,
                    ChairTobed_or_bedTochair_datetime_remark = detw.ChairTobed_or_bedTochair_datetime_remark if detw.ChairTobed_or_bedTochair_datetime_remark else None,
                    Situp_onbed = detw.Situp_onbed if detw.Situp_onbed else None,
                    Situp_onbed_datetime_remark = detw.Situp_onbed_datetime_remark if detw.Situp_onbed_datetime_remark else None,
                    Unocp_or_ocp_bed = detw.Unocp_or_ocp_bed if detw.Unocp_or_ocp_bed else None,
                    Unocp_or_ocp_bed_datetime_remark = detw.Unocp_or_ocp_bed_datetime_remark if detw.Unocp_or_ocp_bed_datetime_remark else None,
                    Showershampoo = detw.Showershampoo if detw.Showershampoo else None,
                    Showershampoo_datetime_remark = detw.Showershampoo_datetime_remark if detw.Showershampoo_datetime_remark else None,
                    Incontinent_care = detw.Incontinent_care if detw.Incontinent_care else None,
                    Incontinent_care_datetime_remark = detw.Incontinent_care_datetime_remark if detw.Incontinent_care_datetime_remark else None,
                    Mouth_care = detw.Mouth_care if detw.Mouth_care else None,
                    Mouth_care_datetime_remark = detw.Mouth_care_datetime_remark if detw.Mouth_care_datetime_remark else None,
                    Shaving = detw.Shaving if detw.Shaving else None,
                    Shaving_datetime_remark = detw.Shaving_datetime_remark if detw.Shaving_datetime_remark else None,
                    Hand_care = detw.Hand_care if detw.Hand_care else None,
                    Hand_care_datetime_remark = detw.Hand_care_datetime_remark if detw.Hand_care_datetime_remark else None,
                    Foot_care = detw.Foot_care if detw.Foot_care else None,
                    Foot_care_datetime_remark = detw.Foot_care_datetime_remark if detw.Foot_care_datetime_remark else None,
                    Vital_care = detw.Vital_care if detw.Vital_care else None,
                    vital_care_datetime_remark = detw.vital_care_datetime_remark if detw.vital_care_datetime_remark else None,
                    motion_care = detw.motion_care if detw.motion_care else None,
                    motion_care_datetime_remark = detw.motion_care_datetime_remark if detw.motion_care_datetime_remark else None,
                    Grooming = detw.Grooming if detw.Grooming else None,
                    Grooming_datetime_remark = detw.Grooming_datetime_remark if detw.Grooming_datetime_remark else None,
                    Bed_bath = detw.Bed_bath if detw.Bed_bath else None,
                    Bed_bath_datetime_remark = detw.Bed_bath_datetime_remark if detw.Bed_bath_datetime_remark else None,
                    Feeding = detw.Feeding if detw.Feeding else None,
                    Feeding_datetime_remark = detw.Feeding_datetime_remark if detw.Feeding_datetime_remark else None,
                    Reposition_patient = detw.Reposition_patient if detw.Reposition_patient else None,
                    Reposition_patient_datetime_remark = detw.Reposition_patient_datetime_remark if detw.Reposition_patient_datetime_remark else None,
                    Bed_pan = detw.Bed_pan if detw.Bed_pan else None,
                    Bed_pan_datetime_remark = detw.Bed_pan_datetime_remark if detw.Bed_pan_datetime_remark else None,
                    added_by_type = detw.added_by_type if detw.added_by_type else None,
                    status = detw.status if detw.status else None,
                    added_by = detw.added_by if detw.added_by else None,
                    added_date = detw.added_date if detw.added_date else None,
                    last_modified_by = detw.last_modified_by if detw.last_modified_by else None,
                    last_modified_date = detw.last_modified_date if detw.last_modified_date else None
                    )
                   
                else:
                    print("post serilaiser")
                    serializer = serializer_class( data=request.data)
            # is_exist_jc_dtl_eve.status = 2
            # is_exist_jc_dtl_eve.save()
            if serializer is not None:
                if serializer.is_valid():
                    serializer.save()
                    dtl_eves.Session_jobclosure_status = 1
                    dtl_eves.Session_status = 9
                    dtl_eves.save()
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
        # except Exception as e:
        #     return Response({    
        #         'record': None, 
        #         'success': 'False',
        #         'msg': str(e)
        #     }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            # Log the exception with a full traceback for detailed error information
            error_trace = traceback.format_exc()
            logger.error(f"An error occurred: {str(e)}\nTraceback: {error_trace}")

            # Return the error response with both the message and traceback details
            return Response({
                'error1': str(e),
                'traceback': error_trace
            }, status=status.HTTP_400_BAD_REQUEST)







class job_closure_srv_sess_wise_Closure_Revalidate(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    serializer_class = agg_hhc_session_job_closure_serializer_form_2

    def get(self, request, srv_prof_id, dtl_eve_id):
        try:
         
            session_data = agg_hhc_detailed_event_plan_of_care.objects.get(
                agg_sp_dt_eve_poc_id=dtl_eve_id
            )

            job_closure_data = agg_hhc_jobclosure_detail.objects.filter(
                srv_prof_id=srv_prof_id, dtl_eve_id=dtl_eve_id
            )

            # Serialize the detailed session and job closure data
            detailed_serializer = deteailed_session_st_ed_time_date(session_data)
            job_closure_serializer = self.serializer_class(job_closure_data, many=True)

            # Combine and return the data
            return Response({
                "detailed_session": detailed_serializer.data,
                "job_closure_details": job_closure_serializer.data,
                # "success": "True"
            })

        except agg_hhc_detailed_event_plan_of_care.DoesNotExist:
            return Response({"error": "Detailed Event Plan not found", "success": "False"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            error_message = "An unexpected error occurred."
            logger.error(f"{error_message}: {str(e)}")
            return Response({
                "error": error_message,
                "details": str(e),
                "traceback": traceback.format_exc()
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)    



    def post(self, request, srv_prof_id, dtl_eve_id):
        try:
            clgref_id = get_prof123(request)[1]
            
            instance = agg_hhc_detailed_event_plan_of_care.objects.get(agg_sp_dt_eve_poc_id=dtl_eve_id)
            if instance.Session_jobclosure_status==1:
                detw = agg_hhc_jobclosure_detail.objects.filter(dtl_eve_id = dtl_eve_id).last()
                aa=agg_hhc_jobclosure_detail_H.objects.create(

                jcolse_id = detw if detw else None,
                srv_prof_id = detw.srv_prof_id if detw.srv_prof_id else None,
                dtl_eve_id = detw.dtl_eve_id if detw.dtl_eve_id else None,
                prof_sub_srv_id = detw.prof_sub_srv_id if detw.prof_sub_srv_id else None,
                Baseline = detw.Baseline if detw.Baseline else None,
                Airway = detw.Airway if detw.Airway else None,
                Breathing = detw.Breathing if detw.Breathing else None,
                Circulation = detw.Circulation if detw.Circulation else None,
                Skin_Perfusion = detw.Skin_Perfusion if detw.Skin_Perfusion else None,
                Wound = detw.Wound if detw.Wound else None,
                Oozing = detw.Oozing if detw.Oozing else None,
                Discharge = detw.Discharge if detw.Discharge else None,
                Inj_site_IM = detw.Inj_site_IM if detw.Inj_site_IM else None,
                Procedure = detw.Procedure if detw.Procedure else None,
                Size_catheter = detw.Size_catheter if detw.Size_catheter else None,
                Size_RT = detw.Size_RT if detw.Size_RT else None,
                Temp_core = detw.Temp_core if detw.Temp_core else None,
                TBSL = detw.TBSL if detw.TBSL else None,
                Pulse = detw.Pulse if detw.Pulse else None,
                SpO2 = detw.SpO2 if detw.SpO2 else None,
                RR = detw.RR if detw.RR else None,
                GCS_Total = detw.GCS_Total if detw.GCS_Total else None,
                BP = detw.BP if detw.BP else None,
                diastolic = detw.diastolic if detw.diastolic else None,
                Remark = detw.Remark if detw.Remark else None,
                Name_injection_fld = detw.Name_injection_fld if detw.Name_injection_fld else None,
                Dose_freq = detw.Dose_freq if detw.Dose_freq else None,
                Num_Sutures_staples = detw.Num_Sutures_staples if detw.Num_Sutures_staples else None,
                Dressing_status = detw.Dressing_status if detw.Dressing_status else None,
                Catheter_type = detw.Catheter_type if detw.Catheter_type else None,
                Sutures_type = detw.Sutures_type if detw.Sutures_type else None,
                Wound_dehiscence = detw.Wound_dehiscence if detw.Wound_dehiscence else None,
                Strength_exer = detw.Strength_exer if detw.Strength_exer else None,
                is_patient_death = detw.is_patient_death if detw.is_patient_death else None,
                Stretch_exer = detw.Stretch_exer if detw.Stretch_exer else None,
                Walk_indep = detw.Walk_indep if detw.Walk_indep else None,
                Walker_stick = detw.Walker_stick if detw.Walker_stick else None,
                Movin_or_moveout = detw.Movin_or_moveout if detw.Movin_or_moveout else None,
                Mobin_or_moveout_datetime_remark = detw.Mobin_or_moveout_datetime_remark if detw.Mobin_or_moveout_datetime_remark else None,
                Getin_or_getout = detw.Getin_or_getout if detw.Getin_or_getout else None,
                Getin_or_getout_datetime_remark = detw.Getin_or_getout_datetime_remark if detw.Getin_or_getout_datetime_remark else None,
                ChairTobed_or_bedTochair = detw.ChairTobed_or_bedTochair if detw.ChairTobed_or_bedTochair else None,
                ChairTobed_or_bedTochair_datetime_remark = detw.ChairTobed_or_bedTochair_datetime_remark if detw.ChairTobed_or_bedTochair_datetime_remark else None,
                Situp_onbed = detw.Situp_onbed if detw.Situp_onbed else None,
                Situp_onbed_datetime_remark = detw.Situp_onbed_datetime_remark if detw.Situp_onbed_datetime_remark else None,
                Unocp_or_ocp_bed = detw.Unocp_or_ocp_bed if detw.Unocp_or_ocp_bed else None,
                Unocp_or_ocp_bed_datetime_remark = detw.Unocp_or_ocp_bed_datetime_remark if detw.Unocp_or_ocp_bed_datetime_remark else None,
                Showershampoo = detw.Showershampoo if detw.Showershampoo else None,
                Showershampoo_datetime_remark = detw.Showershampoo_datetime_remark if detw.Showershampoo_datetime_remark else None,
                Incontinent_care = detw.Incontinent_care if detw.Incontinent_care else None,
                Incontinent_care_datetime_remark = detw.Incontinent_care_datetime_remark if detw.Incontinent_care_datetime_remark else None,
                Mouth_care = detw.Mouth_care if detw.Mouth_care else None,
                Mouth_care_datetime_remark = detw.Mouth_care_datetime_remark if detw.Mouth_care_datetime_remark else None,
                Shaving = detw.Shaving if detw.Shaving else None,
                Shaving_datetime_remark = detw.Shaving_datetime_remark if detw.Shaving_datetime_remark else None,
                Hand_care = detw.Hand_care if detw.Hand_care else None,
                Hand_care_datetime_remark = detw.Hand_care_datetime_remark if detw.Hand_care_datetime_remark else None,
                Foot_care = detw.Foot_care if detw.Foot_care else None,
                Foot_care_datetime_remark = detw.Foot_care_datetime_remark if detw.Foot_care_datetime_remark else None,
                Vital_care = detw.Vital_care if detw.Vital_care else None,
                vital_care_datetime_remark = detw.vital_care_datetime_remark if detw.vital_care_datetime_remark else None,
                motion_care = detw.motion_care if detw.motion_care else None,
                motion_care_datetime_remark = detw.motion_care_datetime_remark if detw.motion_care_datetime_remark else None,
                Grooming = detw.Grooming if detw.Grooming else None,
                Grooming_datetime_remark = detw.Grooming_datetime_remark if detw.Grooming_datetime_remark else None,
                Bed_bath = detw.Bed_bath if detw.Bed_bath else None,
                Bed_bath_datetime_remark = detw.Bed_bath_datetime_remark if detw.Bed_bath_datetime_remark else None,
                Feeding = detw.Feeding if detw.Feeding else None,
                Feeding_datetime_remark = detw.Feeding_datetime_remark if detw.Feeding_datetime_remark else None,
                Reposition_patient = detw.Reposition_patient if detw.Reposition_patient else None,
                Reposition_patient_datetime_remark = detw.Reposition_patient_datetime_remark if detw.Reposition_patient_datetime_remark else None,
                Bed_pan = detw.Bed_pan if detw.Bed_pan else None,
                Bed_pan_datetime_remark = detw.Bed_pan_datetime_remark if detw.Bed_pan_datetime_remark else None,
                added_by_type = detw.added_by_type if detw.added_by_type else None,
                status = detw.status if detw.status else None,
                added_by = detw.added_by if detw.added_by else None,
                added_date = detw.added_date if detw.added_date else None,
                last_modified_by = detw.last_modified_by if detw.last_modified_by else None,
                last_modified_date = detw.last_modified_date if detw.last_modified_date else None
                )
                    

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
            
            serializer1 = deteailed_session_st_ed_time_date(instance=instance, data={
                "prof_session_start_date": request.data.get("prof_session_start_date"),
                "prof_session_end_date": request.data.get("prof_session_end_date"),
                "prof_session_start_time": request.data.get("prof_session_start_time"),
                "prof_session_end_time": request.data.get("prof_session_end_time"),


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
                "prof_sub_srv_id": sub_srv_id,
                "last_modified_by": clgref_id,
                "added_by": clgref_id,
                "closure_revalidate": request.data.get("closure_revalidate"),
                "closure_revalidate_remark": request.data.get("closure_revalidate_remark"),                
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
                all_detail_event_plan=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=instance.eve_id,status=1).count()
                detail_event=agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=instance.eve_id,status=1,Session_jobclosure_status=1).count()
                if (all_detail_event_plan==detail_event):
                    event_plan_care=agg_hhc_event_plan_of_care.objects.get(eve_id=instance.eve_id)
                    event_plan_care.service_status=4
                    event_plan_care.save()
                    event=agg_hhc_events.objects.get(eve_id=instance.eve_id.eve_id)
                    event.event_status=3
                    event.save()
                return Response({'serializer': serializer.data, 'success': 'True'})
            else:
                return Response({'serializer': serializer.errors, 'success': 'False'})
        except Exception as e:
            error_message = "An unexpected error occurred."
            logger.error(f"{error_message}: {str(e)}")
            return Response({
                "error": error_message,
                "details": str(e),
                "traceback": traceback.format_exc()
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)   




class agg_hhc_sub_srv_jc_form_num_Closure_Revalidate(APIView): # List of Sub-Services
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        try: 
            sub_srv = request.GET.get('sub_srv')
            sub_srvs =  agg_hhc_jobclosure_form_numbering.objects.get(prof_sub_srv_id=sub_srv)
            if sub_srvs:
                serializer = agg_hhc_sub_services_jc_form_Closure_Revalidate_serializer(sub_srvs)
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





class all_dtl_evnts_closure_Revalidate(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        eve = request.GET.get('eve')
        print("eve--", eve)
        today_dt = date.today()
        print("today-- ", type(today_dt))
        try:
            dtl_events =  agg_hhc_detailed_event_plan_of_care.objects.filter(Q(eve_id=eve, is_cancelled=2, status=1, actual_StartDate_Time__lte=today_dt)).order_by('index_of_Session').values()# To display all detailed events against event.)
            print("dtl events-- ", dtl_events)
            if dtl_events:
                serializer = all_dtl_evnts_closure_Revalidate_serializer(dtl_events, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({'msg':'No Data Found'}, serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'not found': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)






class get_selected_job_Closure_Revalidate_question(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, eve_id,lang_id=None):
        if lang_id:
                if lang_id==1:
                    data = agg_hhc_events_wise_jc_question.objects.filter(eve_id = eve_id, status = 1)
                    serialzier = get_selected_job_Closure_Revalidate_que_serializerM(data, many=True)
                    serialzier=list(serialzier.data)
                    for i in serialzier:
                        i['jcq_id']['jcq_question']=i['jcq_id']['jcq_question_mar']
                        i['jcq_id'].pop('jcq_question_mar')
                    # print(serialzier.data[0]['jcq_id']['jcq_question_hindi'])
                    return Response(serialzier)
                if lang_id==2:
                    data = agg_hhc_events_wise_jc_question.objects.filter(eve_id = eve_id, status = 1)
                    serialzier = get_selected_job_Closure_Revalidate_que_serializerH(data, many=True)
                    serialzier=list(serialzier.data)
                    for i in serialzier:
                        i['jcq_id']['jcq_question']=i['jcq_id']['jcq_question_hindi']
                        i['jcq_id'].pop('jcq_question_hindi')
                    # print(serialzier.data[0]['jcq_id']['jcq_question_hindi'])
                    return Response(serialzier)
                else:
                    data = agg_hhc_events_wise_jc_question.objects.filter(eve_id = eve_id, status = 1)
                    serialzier = get_selected_job_Closure_Revalidate_que_serializer(data, many=True)
                    return Response(serialzier.data)
        else:
            data = agg_hhc_events_wise_jc_question.objects.filter(eve_id = eve_id, status = 1)
            serialzier = get_selected_job_Closure_Revalidate_que_serializer(data, many=True)
            return Response(serialzier.data)














# # _______________ Closure Revalidate Amit _____________















# # _______________ Amit _____________







        
class qualification_get_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        try:
            quali_data=qualifications.objects.filter(status=1).order_by('qualification')
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
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
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
        






class Company_active_inactive_API(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, company_pk_id, args, *kwargs):
        snippet = get_object_or_404(agg_hhc_company, company_pk_id=company_pk_id, status=1)
        
        serializer = company_details_get_serializer(snippet)
        return Response(serializer.data)
    
    def put(self, request, company_pk_id, args, *kwargs):
        snippet = get_object_or_404(agg_hhc_company, company_pk_id=company_pk_id, status=1)
        serializer = company_details_put_serializer(snippet, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Company Inactive successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#-----------------------------Mohin---------------------------------------

class Company_Documents_GET_API(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self,request):
        snippet = agg_hhc_documents_list.objects.filter(comp_doc=1,status=1)
        serializers  = Get_Comapny_Documents_serializer(snippet,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)
    
 
# class Add_company_Post_API(APIView):
#     renderer_classes = [UserRenderer]
#     permission_classes = [IsAuthenticated]

#     def post(self, request, *args, **kwargs):
#         company_data = {
#             'company_name': request.data.get('company_name'),
#             'company_mail': request.data.get('company_mail'),
#             'company_contact_person': request.data.get('company_contact_person'),
#             'company_contact_number': request.data.get('company_contact_number'),
#             'company_alt_contact_person': request.data.get('company_alt_contact_person'),
#             'company_registration_number': request.data.get('company_registration_number'),
#             'company_agreement_validity_period': request.data.get('company_agreement_validity_period'),
#             'added_by': request.data.get('added_by'),
#             'last_modified_by': request.data.get('last_modified_by')
#         }
#         company_serializer = register_company_post_serializer(data=company_data)

#         if company_serializer.is_valid():
#             company_instance = company_serializer.save()
#         else:
#             return Response(company_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#         saved_files_data = []
#         errors = []

#         for key, file in request.FILES.items():
#             if key.startswith('company_documents[') and key.endswith(']'):
#                 doc_list_id = key.split('[')[1].split(']')[0]  
                
#                 document_data = {
#                     'doc_list_id': doc_list_id,
#                     'company_documents': file,
#                     'company_id': company_instance.pk  
#                 }
#                 document_serializer = Company_Documents_save_Serializer(data=document_data)

#                 if document_serializer.is_valid():
#                     document_serializer.save()
#                     saved_files_data.append(document_serializer.data)
#                 else:
#                     errors.append(document_serializer.errors)

#         if saved_files_data:
#             response_data = {
#                 'company': company_serializer.data,
#                 'documents': saved_files_data
#             }
#             return Response(response_data, status=status.HTTP_201_CREATED)
#         else:
#             return Response(errors, status=status.HTTP_400_BAD_REQUEST)



class Add_company_Post_API(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        company_data = {
            'company_name': request.data.get('company_name'),
            'company_mail': request.data.get('company_mail'),
            'company_contact_person': request.data.get('company_contact_person'),
            'company_contact_number': request.data.get('company_contact_number'),
            'company_alt_contact_person': request.data.get('company_alt_contact_person'),
            'company_registration_number': request.data.get('company_registration_number'),
            'company_agreement_validity_period': request.data.get('company_agreement_validity_period'),
            'added_by': request.data.get('added_by'),
            'last_modified_by': request.data.get('last_modified_by'),
            'username': request.data.get('username'),
            
        }
        
        conflicts = []
        if agg_hhc_company.objects.filter(company_contact_number=company_data['company_contact_number']).exists():
            conflicts.append("Company contact number already exists.")
        if agg_hhc_company.objects.filter(company_mail=company_data['company_mail']).exists():
            conflicts.append("Company email already exists.")
        if agg_com_colleague.objects.filter(clg_ref_id=company_data['username']).exists():
            conflicts.append("Username already exists.")

        if conflicts:
            return Response({"error": conflicts}, status=status.HTTP_409_CONFLICT)
        
        company_serializer = register_company_post_serializer(data=company_data)

        if company_serializer.is_valid():
            company_instance = company_serializer.save()
        else:
            return Response(company_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        saved_files_data = []
        errors = []

        # Handle company documents
        for key, file in request.FILES.items():
            if key.startswith('company_documents[') and key.endswith(']'):
                doc_list_id = key.split('[')[1].split(']')[0]

                document_data = {
                    'doc_list_id': doc_list_id,
                    'company_documents': file,
                    'company_id': company_instance.pk
                }
                document_serializer = Company_Documents_save_Serializer(data=document_data)

                if document_serializer.is_valid():
                    document_serializer.save()
                    saved_files_data.append(document_serializer.data)
                else:
                    errors.append(document_serializer.errors)

        # Save to agg_com_colleague table
        colleague_data = {
            'clg_ref_id': request.data.get('username'),
            'clg_first_name': request.data.get('company_name'),
            'clg_email': request.data.get('company_mail'),
            'clg_mobile_no': request.data.get('company_contact_number'),
            'clg_Work_phone_number': request.data.get('company_alt_contact_person'),
            'password': "pbkdf2_sha256$600000$SVzSqOf9wlaVJpe6mWYSFw$VNaciXlbe6Jxn4V54EkzN05IPL2LtlzgzxRi2OcCo7Y=",
            'prof_compny': company_instance.pk,
            'grp_id': 16,  # Default group ID
            'clg_hos_id': 34  # Default hospital ID
        }
        
        colleague_serializer = Company_Colleague_Details_Serializer(data=colleague_data)
        if colleague_serializer.is_valid():
            colleague_serializer.save()
        else:
            errors.append(colleague_serializer.errors)

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        response_data = {
            'company': company_serializer.data,
            'documents': saved_files_data,
            'colleague': colleague_serializer.data,
        }
        return Response(response_data, status=status.HTTP_201_CREATED)



class Get_company_Details_API(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        companies = agg_hhc_company.objects.filter(status=1) 
        serializer = CompanyDetailSerializer(companies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class Company_active_inactive_API(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, company_pk_id, *args, **kwargs):
        snippet = get_object_or_404(agg_hhc_company, company_pk_id=company_pk_id, status=1)
        
        serializer = company_details_get_serializer(snippet)
        return Response(serializer.data)
    
    def put(self, request, company_pk_id, *args, **kwargs):
        snippet = get_object_or_404(agg_hhc_company, company_pk_id=company_pk_id, status=1)
        serializer = company_details_put_serializer(snippet, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Company Inactive successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class Update_Company_details_PUT_API(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk, *args, **kwargs):
        # Retrieve company details by id
        company = get_object_or_404(agg_hhc_company, pk=pk)
        serializer = CompanyUpdateSerializer(company)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk, *args, **kwargs):
        # Step 1: Update company details
        company = get_object_or_404(agg_hhc_company, pk=pk)
        company_serializer = CompanyUpdateSerializer(company, data=request.data, partial=True)
        if not company_serializer.is_valid():
            return Response(company_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        company_instance = company_serializer.save()

        # Step 2: Update each document based on doc_list_id
        saved_files_data = []

        for key, file in request.FILES.items():
            if key.startswith('company_documents[') and key.endswith(']'):
                doc_list_id = key.split('[')[1].split(']')[0]

                # Check if the document exists for this company and doc_list_id
                document_instance = agg_hhc_company_documents_save.objects.filter(
                    company_id=company_instance.pk, doc_list_id=doc_list_id
                ).first()

                document_data = {
                    'doc_list_id': doc_list_id,
                    'company_documents': file,
                    'company_id': company_instance.pk  
                }

                if document_instance:
                    # Update existing document
                    document_serializer = Company_Documents_save_Serializer(
                        document_instance, data=document_data, partial=True
                    )
                else:
                    document_serializer = Company_Documents_save_Serializer(data=document_data)

                if document_serializer.is_valid():
                    document_serializer.save()
                    saved_files_data.append(document_serializer.data)
                   

        response_data = {
            'company': company_serializer.data,
            # 'documents': saved_files_data,
        }

        return Response(response_data, status=status.HTTP_200_OK)


class Proffessional_Documents_GET_API(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        snippet = agg_hhc_documents_list.objects.filter(prof_doc=1,status=1).order_by('doc_li_id')
        serializers  = Get_Comapny_Documents_serializer(snippet,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)


# class Add_Professional_Data_Post_API(APIView):
#     renderer_classes = [UserRenderer]
#     permission_classes = [IsAuthenticated]

#     def post(self, request, *args, **kwargs):
#         data = request.data

#         #concatenate
#         title_value = int(data.get('title', 0))
#         title_name = Title(title_value).name if title_value in Title._value2member_map_ else ""
#         full_colleague_name = f"{title_name} {data.get('clg_first_name', '')} {data.get('clg_last_name', '')}".strip()

#         #save rpfesional data
#         service_professional_data = {
#             'title': title_value,
#             'prof_fullname': full_colleague_name,
#             'gender': data.get('gender'),
#             'dob': data.get('dob'),
#             'doj': data.get('doj'),
#             'Education_level': data.get('qualification'),
#             'certificate_registration_no': data.get('certificate_registration_no'),
#             'srv_id': data.get('srv_id'),
#             # 'prof_sub_srv_id': data.get('prof_sub_srv_id'),
#             'Job_type': data.get('Job_type'),
#             'phone_no': data.get('contact_number'),
#             'email_id': data.get('email'),
#             'alt_phone_no': data.get('alternate_number'),
#             'eme_contact_no': data.get('emergency_contact_number'),
#             'eme_conact_person_name': data.get('emergency_name'),
#             'eme_contact_relation': data.get('emergency_relation'),
#             'state_name': data.get('state'),
#             'city': data.get('city'),
#             'prof_address': data.get('address'),
#             'pin_code_id': data.get('pincode'),
#             'prof_zone_id': data.get('zone'),
#             'langitude': data.get('langitude'),
#             'lattitude': data.get('lattitude'),
#             'added_by': data.get('added_by'),
#             'last_modified_by': data.get('last_modified_by'),
#             'cv_file': data.get('cv_file'),
#             'google_home_location': data.get('google_home_location'),
#             'prof_compny': data.get('prof_compny'),
            
#         }

#         #save clg data
#         colleague_data = {
#             'clg_first_name': full_colleague_name,
#             'clg_gender': data.get('gender'),
#             'clg_Date_of_birth': data.get('dob'),
#             'clg_joining_date': data.get('doj'),
#             'clg_qualification': data.get('qualification'),
#             'clg_specialization': data.get('clg_specialization'),
#             'clg_Work_phone_number': data.get('contact_number'),
#             'clg_work_email_id': data.get('email'),
#             'clg_mobile_no': data.get('alternate_number'),
#             'clg_state': data.get('state'),
#             'clg_address': data.get('address'),
#             'added_by': data.get('added_by'),
#             'last_modified_by': data.get('last_modified_by'),
#             'prof_compny': data.get('prof_compny'),
#         }

#         #check the phone_no is duplicate or not
#         existing_colleague = agg_com_colleague.objects.filter(clg_Work_phone_number=data.get('contact_number')).first()

#         if existing_colleague:
#             return Response({
#                 "service_professional_errors": {
#                     "phone_no": ["agg_hhc_service_professionals with this phone no already exists."]
#                 }
#             }, status=status.HTTP_400_BAD_REQUEST)
        
       
#         colleague_serializer = Add_Proffesional_Clg_Table_Serializer(data=colleague_data)

#         if colleague_serializer.is_valid():
#             # Save colleague record
#             colleague_instance = colleague_serializer.save()
#             colleague_instance.clg_ref_id = f"clg_{colleague_instance.id}"
#             colleague_instance.save()

#             service_professional_data['clg_ref_id'] = colleague_instance.clg_ref_id

#             service_professional_serializer = Add_Proffesional_Service_Professionals_Table_Serializer(data=service_professional_data)

#             if service_professional_serializer.is_valid():
#                 service_professional_instance = service_professional_serializer.save()

#                 saved_files_data = []
#                 errors = []
#                 for key, file in request.FILES.items():
#                     if key.startswith('professional_document[') and key.endswith(']'):
#                         doc_li_id = key.split('[')[1].split(']')[0]

#                         document_data = {
#                             'doc_li_id': doc_li_id,
#                             'professional_document': file,
#                             'srv_prof_id': service_professional_instance.pk,
#                             'added_by': data.get('added_by'),
#                             'last_modified_by': data.get('last_modified_by')
#                         }
#                         document_serializer = Proffesional_Documents_save_Serializer(data=document_data)

#                         if document_serializer.is_valid():
#                             document_serializer.save()
#                             saved_files_data.append(document_serializer.data)
#                         else:
#                             errors.append(document_serializer.errors)

#                 saved_sub_services = []
#                 index = 0
#                 while True:
#                     sub_srv_id = data.get(f'sub_services[{index}][sub_srv_id]')
#                     prof_cost = data.get(f'sub_services[{index}][prof_cost]')

#                     if not sub_srv_id or not prof_cost:
#                         break

#                     sub_service_data = {
#                         "srv_prof_id": service_professional_instance.pk,
#                         "sub_srv_id": sub_srv_id,
#                         "prof_cost": prof_cost,
#                         'added_by': data.get('added_by'),
#                         'last_modified_by': data.get('last_modified_by')
#                     }
#                     sub_service_serializer = Professional_Sub_Services_Serializer(data=sub_service_data)

#                     if sub_service_serializer.is_valid():
#                         saved_sub_services.append(sub_service_serializer.save())
#                     else:
#                         errors.append(sub_service_serializer.errors)
#                     index += 1

#                 response_data = {
#                     "message": "Data saved successfully",
#                     "service_professional": service_professional_serializer.data,
#                     "colleague": colleague_serializer.data,
#                     "documents": saved_files_data,
#                     "sub_services": [Professional_Sub_Services_Serializer(sub_service).data for sub_service in saved_sub_services]
#                 }
#                 return Response(response_data, status=status.HTTP_201_CREATED)
#             else:
#                 errors = {
#                     "service_professional_errors": service_professional_serializer.errors,
#                 }
#                 return Response(errors, status=status.HTTP_400_BAD_REQUEST)

#         else:
#             errors = {
#                 "colleague_errors": colleague_serializer.errors
#             }
#             return Response(errors, status=status.HTTP_400_BAD_REQUEST)


# class Add_Professional_Data_Post_API(APIView):
#     def post(self, request, *args, **kwargs):
#         print("Request Data:", request.data)
#         data = request.data

#         # Concatenate full name
#         title_value = int(data.get('title', 0))
#         title_name = Title(title_value).name if title_value in Title._value2member_map_ else ""
#         full_colleague_name = f"{title_name} {data.get('clg_first_name', '')} {data.get('clg_last_name', '')}".strip()

#         # Service professional data
#         service_professional_data = {
#             'title': title_value,
#             'prof_fullname': full_colleague_name,
#             'gender': data.get('gender'),
#             'dob': data.get('dob'),
#             'doj': data.get('doj'),
#             'Education_level': data.get('qualification'),
#             'certificate_registration_no': data.get('certificate_registration_no'),
#             'srv_id': None,  # This will be updated later
#             'Job_type': data.get('Job_type'),
#             'phone_no': data.get('contact_number'),
#             'email_id': data.get('email'),
#             'alt_phone_no': data.get('alternate_number'),
#             'eme_contact_no': data.get('emergency_contact_number'),
#             'eme_conact_person_name': data.get('emergency_name'),
#             'eme_contact_relation': data.get('emergency_relation'),
#             'state_name': data.get('state'),
#             'city': data.get('city'),
#             'prof_address': data.get('address'),
#             'pin_code_id': data.get('pincode'),
#             'prof_zone_id': data.get('zone'),
#             'langitude': data.get('langitude'),
#             'lattitude': data.get('lattitude'),
#             'added_by': data.get('added_by'),
#             'last_modified_by': data.get('last_modified_by'),
#             'cv_file': data.get('cv_file'),
#             'google_home_location': data.get('google_home_location'),
#             'prof_compny': data.get('prof_compny'),
#             'prof_registered': True,
#             'prof_interviewed': True,
#             'prof_doc_verified': True,
#         }

#         # Colleague data
#         colleague_data = {
#             'clg_first_name': full_colleague_name,
#             'clg_gender': data.get('gender'),
#             'clg_Date_of_birth': data.get('dob'),
#             'clg_joining_date': data.get('doj'),
#             'clg_qualification': data.get('qualification'),
#             'clg_specialization': data.get('clg_specialization'),
#             'clg_Work_phone_number': data.get('contact_number'),
#             'clg_work_email_id': data.get('email'),
#             'clg_mobile_no': data.get('alternate_number'),
#             'clg_state': data.get('state'),
#             'clg_address': data.get('address'),
#             'added_by': data.get('added_by'),
#             'last_modified_by': data.get('last_modified_by'),
#             'prof_compny': data.get('prof_compny'),
#             'password': "pbkdf2_sha256$600000$SVzSqOf9wlaVJpe6mWYSFw$VNaciXlbe6Jxn4V54EkzN05IPL2LtlzgzxRi2OcCo7Y=",
#             'grp_id': 14,
#             'clg_hos_id': 34,
#         }

#         # Check for duplicate phone number
#         existing_colleague = agg_hhc_service_professionals.objects.filter(phone_no=data.get('contact_number')).first()
#         if existing_colleague:
#             return Response({
#                 "service_professional_errors": {
#                     "phone_no": ["agg_hhc_service_professionals with this phone no already exists."]
#                 }
#             }, status=status.HTTP_409_CONFLICT)

#         # Validate and save colleague data
#         colleague_serializer = Add_Proffesional_Clg_Table_Serializer(data=colleague_data)
#         if colleague_serializer.is_valid():
#             colleague_instance = colleague_serializer.save()
#             colleague_instance.clg_ref_id = f"clg_{colleague_instance.id}"
#             colleague_instance.save()

#             # Assign colleague reference ID
#             service_professional_data['clg_ref_id'] = colleague_instance.clg_ref_id

#             # Handle service ID
#             srvic = data.get('srv_id')
#             srv = None
#             try:
#                 srv = agg_hhc_services.objects.get(srv_id=srvic)
#             except agg_hhc_services.DoesNotExist:
#                 srv = None

#             if srv:
#                 service_professional_data['srv_id'] = srv.service_title
#             else:
#                 service_professional_data['srv_id'] = None

#             # Validate and save service professional data
#             service_professional_serializer = Add_Proffesional_Service_Professionals_Table_Serializer(data=service_professional_data)
#             if service_professional_serializer.is_valid():
#                 service_professional_instance = service_professional_serializer.save()

#                 # Save CV and additional details
#                 professional_details_data = {
#                     'srv_prof_id': service_professional_instance.pk,
#                     'qualification': data.get('qualification'),
#                     'prof_CV': data.get('cv_file'),
#                     'added_by': data.get('added_by'),
#                     'last_modified_by': data.get('last_modified_by')
#                 }
#                 professional_details_serializer = Professional_CV_Details_Serializer(data=professional_details_data)
#                 if professional_details_serializer.is_valid():
#                     professional_details_serializer.save()
#                 else:
#                     return Response(professional_details_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#                 # Save documents
#                 saved_files_data = []
#                 errors = []
#                 for key, file in request.FILES.items():
#                     if key.startswith('professional_document[') and key.endswith(']'):
#                         doc_li_id = key.split('[')[1].split(']')[0]
#                         document_data = {
#                             'doc_li_id': doc_li_id,
#                             'professional_document': file,
#                             'srv_prof_id': service_professional_instance.pk,
#                             'added_by': data.get('added_by'),
#                             'last_modified_by': data.get('last_modified_by')
#                         }
#                         document_serializer = Proffesional_Documents_save_Serializer(data=document_data)
#                         if document_serializer.is_valid():
#                             document_serializer.save()
#                             saved_files_data.append(document_serializer.data)
#                         else:
#                             errors.append(document_serializer.errors)

#                 # Save sub-services
#                 saved_sub_services = []
#                 index = 0
#                 while True:
#                     sub_srv_id = data.get(f'sub_services[{index}][sub_srv_id]')
#                     prof_cost = data.get(f'sub_services[{index}][prof_cost]')
#                     if not sub_srv_id or not prof_cost:
#                         break
#                     sub_service_data = {
#                         "srv_prof_id": service_professional_instance.pk,
#                         "sub_srv_id": sub_srv_id,
#                         "prof_cost": prof_cost,
#                         'added_by': data.get('added_by'),
#                         'last_modified_by': data.get('last_modified_by')
#                     }
#                     sub_service_serializer = Professional_Sub_Services_Serializer(data=sub_service_data)
#                     if sub_service_serializer.is_valid():
#                         saved_sub_services.append(sub_service_serializer.save())
#                     else:
#                         errors.append(sub_service_serializer.errors)
#                     index += 1

#                 response_data = {
#                     "message": "Data saved successfully",
#                     "service_professional": service_professional_serializer.data,
#                     "colleague": colleague_serializer.data,
#                     "documents": saved_files_data,
#                     "sub_services": [Professional_Sub_Services_Serializer(sub_service).data for sub_service in saved_sub_services],
#                 }
#                 return Response(response_data, status=status.HTTP_201_CREATED)
#             else:
#                 return Response(service_professional_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#         return Response(colleague_serializer.errors, status=status.HTTP_400_BAD_REQUEST)





class Add_Professional_Data_Post_API(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        print("Request Data:", request.data)
        data = request.data

        # Concatenate full name
        title_value = int(data.get('title', 0))
        title_name = Title(title_value).name if title_value in Title._value2member_map_ else ""
        full_colleague_name = f"{title_name} {data.get('clg_first_name', '')} {data.get('clg_last_name', '')}".strip()

        # Service professional data
        service_professional_data = {
            'title': title_value,
            'prof_fullname': full_colleague_name,
            'gender': data.get('gender'),
            'dob': data.get('dob'),
            'doj': data.get('doj'),
            'Education_level': data.get('qualification'),
            'certificate_registration_no': data.get('certificate_registration_no'),
            'srv_id': None,  # This will be updated later
            'Job_type': data.get('Job_type'),
            'phone_no': data.get('contact_number'),
            'work_phone_no':data.get('contact_number'),
            'email_id': data.get('email'),
            'alt_phone_no': data.get('alternate_number'),
            'eme_contact_no': data.get('emergency_contact_number'),
            'eme_conact_person_name': data.get('emergency_name'),
            'eme_contact_relation': data.get('emergency_relation'),
            'state_name': data.get('state'),
            'city': data.get('city'),
            'prof_address': data.get('address'),
            'address': data.get('address'),
            'pin_code_id': data.get('pincode'),
            'prof_zone_id': data.get('zone'),
            'langitude': data.get('langitude'),
            'lattitude': data.get('lattitude'),
            'added_by': data.get('added_by'),
            'last_modified_by': data.get('last_modified_by'),
            'cv_file': data.get('cv_file'),
            'google_home_location': data.get('google_home_location'),
            'prof_compny': data.get('prof_compny'),
            'prof_registered': True,
            'prof_interviewed': True,
            'prof_doc_verified': True,
        }

        # Colleague data
        colleague_data = {
            'clg_first_name': full_colleague_name,
            'clg_gender': data.get('gender'),
            'clg_Date_of_birth': data.get('dob'),
            'clg_joining_date': data.get('doj'),
            'clg_qualification': data.get('qualification'),
            'clg_specialization': data.get('clg_specialization'),
            'clg_Work_phone_number': data.get('contact_number'),
            'clg_work_email_id': data.get('email'),
            'clg_mobile_no': data.get('alternate_number'),
            'clg_state': data.get('state'),
            'clg_address': data.get('address'),
            'added_by': data.get('added_by'),
            'last_modified_by': data.get('last_modified_by'),
            'prof_compny': data.get('prof_compny'),
            'password': "pbkdf2_sha256$600000$SVzSqOf9wlaVJpe6mWYSFw$VNaciXlbe6Jxn4V54EkzN05IPL2LtlzgzxRi2OcCo7Y=",
            'grp_id': 2,
            'clg_hos_id': 34,
        }

        # Check for duplicate phone number
        # existing_colleague = agg_hhc_service_professionals.objects.filter(phone_no=data.get('contact_number')).first()
        # if existing_colleague:
        #     return Response({
        #         "service_professional_errors": {
        #             "phone_no": ["agg_hhc_service_professionals with this phone no already exists."]
        #         }
        #     }, status=status.HTTP_409_CONFLICT)
        
        
        
        conflicts = []

        existing_colleague = agg_hhc_service_professionals.objects.filter(phone_no=data.get('contact_number')).first()
        if existing_colleague:
            conflicts.append("Phone no already exists.")

        existing_certificate = agg_hhc_service_professionals.objects.filter(certificate_registration_no=data.get('certificate_registration_no')).first()
        if existing_certificate:
            conflicts.append("Certificate registration number already exists.")

        if conflicts:
            return Response({"service_professional_errors": conflicts}, status=status.HTTP_409_CONFLICT)

        # Start a transaction block
        try:
            with transaction.atomic():
                # Validate and save colleague data
                colleague_serializer = Add_Proffesional_Clg_Table_Serializer(data=colleague_data)
                if colleague_serializer.is_valid():
                    colleague_instance = colleague_serializer.save()
                    colleague_instance.clg_ref_id = f"clg_{colleague_instance.id}"
                    colleague_instance.save()

                    # Assign colleague reference ID
                    service_professional_data['clg_ref_id'] = colleague_instance.clg_ref_id

                    # Handle service ID
                    srvic = data.get('srv_id')
                    srv = None
                    try:
                        srv = agg_hhc_services.objects.get(srv_id=srvic)
                    except agg_hhc_services.DoesNotExist:
                        srv = None

                    if srv:
                        service_professional_data['srv_id'] = srv.service_title
                    else:
                        service_professional_data['srv_id'] = None

                    # Validate and save service professional data
                    service_professional_serializer = Add_Proffesional_Service_Professionals_Table_Serializer(data=service_professional_data)
                    if service_professional_serializer.is_valid():
                        service_professional_instance = service_professional_serializer.save()

                        # Save CV and additional details
                        professional_details_data = {
                            'srv_prof_id': service_professional_instance.pk,
                            'qualification': data.get('qualification'),
                            # 'prof_CV': data.get('cv_file'),
                            'added_by': data.get('added_by'),
                            'last_modified_by': data.get('last_modified_by'),
                            'specialization': data.get('clg_specialization'),
                        }
                        print('ssssssssss',data.get('clg_specialization'))
                        print('ssssddddddddd',data.get('qualification'))
                        
                        professional_details_serializer = Professional_CV_Details_Serializer(data=professional_details_data)
                        if professional_details_serializer.is_valid():
                            professional_details_serializer.save()
                        else:
                            return Response(professional_details_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                        # Save documents
                        saved_files_data = []
                        errors = []
                        for key, file in request.FILES.items():
                            if key.startswith('professional_document[') and key.endswith(']'):
                                doc_li_id = key.split('[')[1].split(']')[0]
                                document_data = {
                                    'doc_li_id': doc_li_id,
                                    'professional_document': file,
                                    'srv_prof_id': service_professional_instance.pk,
                                    'added_by': data.get('added_by'),
                                    'last_modified_by': data.get('last_modified_by')
                                }
                                document_serializer = Proffesional_Documents_save_Serializer(data=document_data)
                                if document_serializer.is_valid():
                                    document_serializer.save()
                                    saved_files_data.append(document_serializer.data)
                                else:
                                    errors.append(document_serializer.errors)

                        # Save sub-services
                        saved_sub_services = []
                        index = 0
                        while True:
                            sub_srv_id = data.get(f'sub_services[{index}][sub_srv_id]')
                            prof_cost = data.get(f'sub_services[{index}][prof_cost]')
                            if not sub_srv_id or not prof_cost:
                                break
                            sub_service_data = {
                                "srv_prof_id": service_professional_instance.pk,
                                "sub_srv_id": sub_srv_id,
                                "prof_cost": prof_cost,
                                'added_by': data.get('added_by'),
                                'last_modified_by': data.get('last_modified_by')
                            }
                            sub_service_serializer = Professional_Sub_Services_Serializer(data=sub_service_data)
                            if sub_service_serializer.is_valid():
                                saved_sub_services.append(sub_service_serializer.save())
                            else:
                                errors.append(sub_service_serializer.errors)
                            index += 1

                        response_data = {
                            "message": "Data saved successfully",
                            "service_professional": service_professional_serializer.data,
                            "colleague": colleague_serializer.data,
                            "documents": saved_files_data,
                            "sub_services": [Professional_Sub_Services_Serializer(sub_service).data for sub_service in saved_sub_services],
                        }
                        return Response(response_data, status=status.HTTP_201_CREATED)
                    else:
                        return Response(service_professional_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                return Response(colleague_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Transaction rollback happens automatically in case of an exception inside the atomic block
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)




class Professional_Is_Already_Exists_API(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        phone_no = request.query_params.get('phone_no')
        certificate_registration_no = request.query_params.get('certificate_registration_no')
        
        messages = []
        
        if phone_no and agg_hhc_service_professionals.objects.filter(phone_no=phone_no).exists():
            messages.append("Professional with this phone number already exists.")
        
        if certificate_registration_no and agg_hhc_service_professionals.objects.filter(certificate_registration_no=certificate_registration_no).exists():
            messages.append("Professional with this certificate registration number already exists.")
        
        if messages:
            return Response({"message": " ".join(messages)}, status=status.HTTP_409_CONFLICT)
        
        return Response({"message": "Professional does not exist."}, status=status.HTTP_200_OK)
    
    
    

class Profesional_active_inactive_API(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, srv_prof_id, *args, **kwargs):
        snippet = get_object_or_404(agg_hhc_service_professionals, srv_prof_id=srv_prof_id, status=1)
        
        serializer = Profesional_status_Serializer(snippet)
        return Response(serializer.data)
    
    def delete(self, request, srv_prof_id, *args, **kwargs):
        snippet = get_object_or_404(agg_hhc_service_professionals, srv_prof_id=srv_prof_id, status=1)
        
        snippet.status = 2
        snippet.save()
        
        return Response({"message": "Profesional is Inactive successfully"}, status=status.HTTP_204_NO_CONTENT)
    
    

class Get_Professional_Data_API(APIView):
    def get(self,request):
        snippet = agg_hhc_service_professionals.objects.all()
        serializers = Profesional_Details_Get_Serializer(snippet,many=True) 
        return Response(serializers.data,status=status.HTTP_200_OK)
    


# class Update_Professional_Data_Put_API(APIView):
#     renderer_classes = [UserRenderer]
#     permission_classes = [IsAuthenticated]
    
#     def get(self, request, srv_prof_id):
#         snippet = agg_hhc_service_professionals.objects.filter(srv_prof_id=srv_prof_id)
#         serializer = Professional_Details_Get_Update_Serializer(snippet, many=True)
#         return Response(serializer.data)

#     def put(self, request, srv_prof_id):
#         try:
#             # Retrieve the professional record
#             clgref_id = get_prof(request)[1]
#             professional = agg_hhc_service_professionals.objects.get(srv_prof_id=srv_prof_id)
#         except agg_hhc_service_professionals.DoesNotExist:
#             return Response({"error": "Professional not found"}, status=status.HTTP_404_NOT_FOUND)
        
#         # Update the agg_hhc_service_professionals data
#         request_data = request.data.copy()
        
#         if 'phone_no' in request_data:
#             request_data['contact_number'] = request_data.pop('phone_no')
#         if 'alt_phone_no' in request_data:
#             request_data['alternate_number'] = request_data.pop('alt_phone_no')
            
#         if 'emergency_contact_number' in request_data:
#             request_data['eme_contact_no'] = int(request_data.pop('emergency_contact_number')[0])
        
#         if 'emergency_name' in request_data:
#             emergency_name = request_data.pop('emergency_name')
            
#             if isinstance(emergency_name, list):
#                 emergency_name = emergency_name[0]
            
#             request_data['eme_conact_person_name'] = str(emergency_name)

        
#         if 'emergency_relation' in request_data:
#             request_data['eme_contact_relation'] = int(request_data.pop('emergency_relation')[0])
        
        
#         print(request.data.get('emergency_contact_number'))
#         print(request.data.get('emergency_name'))
#         print(request.data.get('emergency_relation'))
            
        

#         # Update the agg_hhc_service_professionals data
#         prof_serializer = Professional_Details_Get_Update_Serializer(professional, data=request_data, partial=True)
#         if prof_serializer.is_valid():
#             # Concatenate title, first name, and last name to create full colleague name
#             title_value = int(request.data.get('title', 0))
#             title_name = Title(title_value).name if title_value in Title._value2member_map_ else ""
#             clg_first_name = request.data.get('clg_first_name', '')
#             clg_last_name = request.data.get('clg_last_name', '')
#             full_colleague_name = f"{title_name} {clg_first_name} {clg_last_name}".strip()

#             # Update `prof_fullname` in agg_hhc_service_professionals
#             professional.prof_fullname = full_colleague_name
#             prof_serializer.save()

          
#             colleague = professional.clg_ref_id  
#             if colleague:
#                 # Update the first name in `agg_com_colleague`
#                 colleague.clg_first_name = clg_first_name  
#                 # colleague.clg_last_name = clg_last_name  
#                 colleague.clg_first_name = f"{title_name} {clg_first_name} {clg_last_name}".strip() 
#                 colleague.clg_gender = request.data.get('gender')
#                 colleague.clg_Date_of_birth = request.data.get('dob')
#                 colleague.clg_joining_date = request.data.get('doj')
#                 colleague.clg_qualification = request.data.get('Education_level')
#                 colleague.clg_specialization = request.data.get('specialization')
#                 colleague.clg_Work_phone_number = request_data.get('contact_number') 
#                 colleague.clg_work_email_id = request.data.get('email_id')
#                 colleague.clg_mobile_no = request_data.get('alternate_number')
#                 colleague.clg_state = request.data.get('state_name')
#                 colleague.clg_address = request.data.get('prof_address')
#                 colleague.last_modified_by = request.data.get('last_modified_by')
#                 colleague.clg_specialization = request.data.get('clg_specialization')
#                 colleague.save()

#             # Handle uploaded professional documents
#             for file_key, file in request.FILES.items():
#                 if file_key.startswith('professional_document[') and file_key.endswith(']'):
#                     doc_id = file_key.split('[')[1].split(']')[0]
#                     lulu = agg_hhc_documents_list.objects.get(doc_li_id=doc_id)

#                     # Check if the document already exists for this professional
#                     existing_document = agg_hhc_professional_documents.objects.filter(
#                         doc_li_id=lulu, srv_prof_id=professional
#                     ).first()

#                     if existing_document:
#                         # Update the existing document with the new file
#                         existing_document.professional_document = file
#                         existing_document.last_modified_by = clgref_id
#                         existing_document.save()
#                     else:
#                         # Create a new document if not already existing
#                         agg_hhc_professional_documents.objects.create(
#                             srv_prof_id=professional,
#                             doc_li_id=lulu,           
#                             professional_document=file,
#                             added_by=clgref_id,
#                             last_modified_by=clgref_id
#                         )

#             # Update or create records in agg_hhc_professional_sub_services
#             sub_services_data = request.data.get('sub_services_details', [])
#             for sub_service_data in sub_services_data:
#                 sub_srv_id = sub_service_data.get('sub_srv_id')
                
#                 # Ensure sub_srv_id exists in sub_service_data
#                 if not sub_srv_id:
#                     continue

#                 # Retrieve the sub-service instance by sub_srv_id
#                 try:
#                     sub_service_instance = agg_hhc_sub_services.objects.get(sub_srv_id=sub_srv_id)
#                 except agg_hhc_sub_services.DoesNotExist:
#                     return Response({"error": f"Sub-service with id {sub_srv_id} not found"}, status=status.HTTP_400_BAD_REQUEST)

#             # Handle the sub-service and professional cost logic
#             sssss = agg_hhc_professional_sub_services.objects.filter(srv_prof_id=professional, status=1)
#             print(request.data.get('sub_services'))
#             if 'sub_services' in request.data:
#                 sub_srvicesss = ast.literal_eval(request.data.get('sub_services'))
#                 prof_costsss = ast.literal_eval(request.data.get('prof_cost'))

#                 if sssss.count() == len(sub_srvicesss):
#                     for index, existing_obj in enumerate(sssss):
#                         existing_obj.sub_srv_id = agg_hhc_sub_services.objects.get(sub_srv_id=sub_srvicesss[index])
#                         existing_obj.prof_cost = prof_costsss[index]
#                         existing_obj.last_modified_by = clgref_id
#                         existing_obj.save()

#                 elif len(sub_srvicesss) > sssss.count():
#                     for index, existing_obj in enumerate(sssss):
#                         existing_obj.sub_srv_id = agg_hhc_sub_services.objects.get(sub_srv_id=sub_srvicesss[index])
#                         existing_obj.prof_cost = prof_costsss[index]
#                         existing_obj.last_modified_by = clgref_id
#                         existing_obj.save()

#                     for index in range(sssss.count(), len(sub_srvicesss)):
#                         new_sub_service = agg_hhc_professional_sub_services(
#                             srv_prof_id=professional,
#                             sub_srv_id=agg_hhc_sub_services.objects.get(sub_srv_id=sub_srvicesss[index]),
#                             prof_cost=prof_costsss[index],
#                             status=1,
#                             added_by=clgref_id,
#                             last_modified_by=clgref_id
#                         )
#                         new_sub_service.save()
#                 else:
#                     for index, existing_obj in enumerate(sssss[:len(sub_srvicesss)]):
#                         existing_obj.sub_srv_id = agg_hhc_sub_services.objects.get(sub_srv_id=sub_srvicesss[index])
#                         existing_obj.prof_cost = prof_costsss[index]
#                         existing_obj.added_by = clgref_id
#                         existing_obj.last_modified_by = clgref_id
#                         existing_obj.save()
                        
#                     extra_objs = sssss[len(sub_srvicesss):]
#                     for i in extra_objs:
#                         i.status = 2
#                         i.save() 
                
#             return Response(prof_serializer.data, status=status.HTTP_200_OK)

#         return Response(prof_serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class Update_Professional_Data_Put_API(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, srv_prof_id):
        snippet = agg_hhc_service_professionals.objects.filter(srv_prof_id=srv_prof_id)
        serializer = Professional_Details_Get_Update_Serializer(snippet, many=True)
        return Response(serializer.data)
    
    def put(self, request, srv_prof_id):
        try:
            try:
                # Retrieve the professional record
                clgref_id = get_prof(request)[1]
                professional = agg_hhc_service_professionals.objects.get(srv_prof_id=srv_prof_id)
            except agg_hhc_service_professionals.DoesNotExist:
                return Response({"error": "Professional not found"}, status=status.HTTP_404_NOT_FOUND)
            
            conflicts = []

            existing_phone = agg_hhc_service_professionals.objects.filter(phone_no=request.data.get('contact_number')).exclude(srv_prof_id=srv_prof_id).first()
            if existing_phone:
                conflicts.append(f"Phone no already Assign the {existing_phone.prof_fullname} Please Provide Another Phone Number.")

            existing_certificate = agg_hhc_service_professionals.objects.filter(
                certificate_registration_no=request.data.get('certificate_registration_no')
            ).exclude(srv_prof_id=srv_prof_id).first()
            if existing_certificate:
                conflicts.append(f"Certificate Registration No already Assign the {existing_certificate.prof_fullname} Please Provide Another Certificate Registration No.")

            if conflicts:
                return Response({"conflicts": conflicts}, status=status.HTTP_409_CONFLICT)
                 
            # Update the agg_hhc_service_professionals data
            from django.utils.datastructures import MultiValueDict
            request_data = MultiValueDict(request.data)

            if 'contact_number' in request_data:
                request_data['phone_no'] = request_data.get('contact_number')
                request_data['work_phone_no'] = request_data.get('contact_number')
            
            if 'address' in request_data:
                request_data['prof_address'] = request_data.get('address')
                request_data['address'] = request_data.get('address')

            
            if 'alternate_number' in request_data:
                request_data['alt_phone_no'] = request_data.get('alternate_number')

            if 'emergency_contact_number' in request_data:
                d=request_data.pop('emergency_contact_number')[0]
                request_data['eme_contact_no'] =d if int(d) else None
            print('demo2')
            
            if 'emergency_name' in request_data:
                emergency_name = request_data.pop('emergency_name')
                print(emergency_name,'22')
                if isinstance(emergency_name, list):
                    emergency_name = emergency_name[0]
                # request_data['eme_conact_person_name'] =emergency_name if str(emergency_name) else None
                request_data['eme_conact_person_name'] = emergency_name if emergency_name not in [None, 'null'] else None
                
            print('demo3')
            if 'emergency_relation' in request_data:
                d1=request_data.pop('emergency_relation')[0]
                if d1=='null':
                    d1=''
                request_data['eme_contact_relation'] =d1 if d1.isdigit() and int(d1) else None
            print('demo4')
            if 'qualification' in request_data:
                quaaa = request.data.get('qualification')
                d2=request_data.pop('qualification')[0]
                request_data['Education_level'] =d2 if d2.isdigit() and int(d2) else None

            if 'email' in request_data:
                request_data['email_id'] = str(request_data.pop('email')[0])

            if 'zone' in request_data:
                request_data['prof_zone_id'] = str(request_data.pop('zone')[0])
            print('demo4')
            srvic = request_data.get('srv_id')
            srv = None
            try:
                srv = agg_hhc_services.objects.get(srv_id=srvic)
                print(srv)
            except agg_hhc_services.DoesNotExist:
                srv = None

            if srv:
                request_data['srv_id'] = srv.service_title
            else:
                request_data['srv_id'] = None
            # Update the professional record
            prof_serializer = Professional_Details_Get_Update_Serializer1(professional, data=request_data, partial=True)
            try:
                if prof_serializer.is_valid():
                    # Concatenate title, first name, and last name to create full colleague name
                    title_value = int(request.data.get('title', 0))
                    title_name = Title(title_value).name if title_value in Title._value2member_map_ else ""
                    clg_first_name = request.data.get('clg_first_name', '')
                    clg_last_name = request.data.get('clg_last_name', '')
                    full_colleague_name = f"{title_name} {clg_first_name} {clg_last_name}".strip()

                    # Update `prof_fullname` in agg_hhc_service_professionals
                    professional.prof_fullname = full_colleague_name
                    prof_serializer.save()
                    spl_id = None
    
                    if 'clg_specialization' in request_data:
                        
                        specialization_id = request_data.get('clg_specialization')
                        print(type(specialization_id))
                        if specialization_id == 'null':
                            spl_id = None
                        else:
                            spl_id = qualification_specialization.objects.get(quali_sp=int(specialization_id))
                            
                    else:
                        specialization_id = None
                        spl_id = None
                        
                            
                        print("doemfndjkcb")
                    print(spl_id,'spl_id') 
                        
                    # Update related colleague details
                    colleague = professional.clg_ref_id  
                    if colleague:
                        # Update the first name in `agg_com_colleague`
                        colleague.clg_first_name = f"{title_name} {clg_first_name} {clg_last_name}".strip()
                        colleague.clg_gender = request.data.get('gender')
                        colleague.clg_Date_of_birth = request.data.get('dob')
                        colleague.clg_joining_date = request.data.get('doj')
                        colleague.clg_qualification = request.data.get('Education_level')
                        # colleague.clg_specialization = request.data.get('specialization')
                        colleague.clg_Work_phone_number = request_data.get('contact_number')
                        colleague.clg_work_email_id = request.data.get('email')
                        colleague.clg_mobile_no = request_data.get('alternate_number')
                        colleague.clg_state = request.data.get('state_name')
                        colleague.clg_address = request.data.get('prof_address')
                        colleague.last_modified_by = request.data.get('last_modified_by')
                        if spl_id != None:
                            colleague.clg_specialization = spl_id
                            
                        colleague.save()
                       
                    # Handle professional details
                    professional_details = agg_hhc_service_professional_details.objects.filter(srv_prof_id=professional).first()
                    if professional_details:
                        professional_details.qualification = qualifications.objects.get(quali_id=quaaa)
                        # professional_details.prof_CV = request.FILES.get('cv_file', professional_details.prof_CV) 
                        professional_details.last_modified_by = request.data.get('last_modified_by')             
    
                        if spl_id != None:
                            professional_details.specialization = qualification_specialization.objects.get(quali_sp=int(specialization_id))
                        professional_details.save()
                        
                        
                    # Handle uploaded professional documents
                    for file_key, file in request.FILES.items():
                        if file_key.startswith('professional_document[') and file_key.endswith(']'):
                            doc_id = file_key.split('[')[1].split(']')[0]
                            lulu = agg_hhc_documents_list.objects.get(doc_li_id=doc_id)

                            # Check if the document already exists for this professional
                            existing_document = agg_hhc_professional_documents.objects.filter(
                                doc_li_id=lulu, srv_prof_id=professional
                            ).first()

                            if existing_document:
                                # Update the existing document with the new file
                                existing_document.professional_document = file
                                existing_document.last_modified_by = clgref_id
                                existing_document.save()
                            else:
                                # Create a new document if not already existing
                                agg_hhc_professional_documents.objects.create(
                                    srv_prof_id=professional,
                                    doc_li_id=lulu,           
                                    professional_document=file,
                                    added_by=clgref_id,
                                    last_modified_by=clgref_id
                                )

                    # Update or create records in agg_hhc_professional_sub_services
                    sub_services_data = request.data.get('sub_services_details', [])
                    for sub_service_data in sub_services_data:
                        sub_srv_id = sub_service_data.get('sub_srv_id')
                        if not sub_srv_id:
                            continue

                        # Retrieve the sub-service instance by sub_srv_id
                        try:
                            sub_service_instance = agg_hhc_sub_services.objects.get(sub_srv_id=sub_srv_id)
                        except agg_hhc_sub_services.DoesNotExist:
                            return Response({"error": f"Sub-service with id {sub_srv_id} not found"}, status=status.HTTP_400_BAD_REQUEST)

                    # Handle the sub-service and professional cost logic
                    sssss = agg_hhc_professional_sub_services.objects.filter(srv_prof_id=professional, status=1)
                    if 'sub_services' in request.data:
                        sub_srvicesss = ast.literal_eval(request.data.get('sub_services'))
                        prof_costsss = ast.literal_eval(request.data.get('prof_cost'))

                        if sssss.count() == len(sub_srvicesss):
                            for index, existing_obj in enumerate(sssss):
                                existing_obj.sub_srv_id = agg_hhc_sub_services.objects.get(sub_srv_id=sub_srvicesss[index])
                                existing_obj.prof_cost = prof_costsss[index]
                                existing_obj.last_modified_by = clgref_id
                                existing_obj.save()

                        elif len(sub_srvicesss) > sssss.count():
                            for index, existing_obj in enumerate(sssss):
                                existing_obj.sub_srv_id = agg_hhc_sub_services.objects.get(sub_srv_id=sub_srvicesss[index])
                                existing_obj.prof_cost = prof_costsss[index]
                                existing_obj.last_modified_by = clgref_id
                                existing_obj.save()

                            for index in range(sssss.count(), len(sub_srvicesss)):
                                new_sub_service = agg_hhc_professional_sub_services(
                                    srv_prof_id=professional,
                                    sub_srv_id=agg_hhc_sub_services.objects.get(sub_srv_id=sub_srvicesss[index]),
                                    prof_cost=prof_costsss[index],
                                    status=1,
                                    added_by=clgref_id,
                                    last_modified_by=clgref_id
                                )
                                new_sub_service.save()
                        else:
                            for index, existing_obj in enumerate(sssss[:len(sub_srvicesss)]):
                                existing_obj.sub_srv_id = agg_hhc_sub_services.objects.get(sub_srv_id=sub_srvicesss[index])
                                existing_obj.prof_cost = prof_costsss[index]
                                existing_obj.added_by = clgref_id
                                existing_obj.last_modified_by = clgref_id
                                existing_obj.save()

                            extra_objs = sssss[len(sub_srvicesss):]
                            for i in extra_objs:
                                i.status = 0
                                i.save()

                    return Response(prof_serializer.data, status=status.HTTP_200_OK)
                else:
                    return Response({'er':prof_serializer.errors}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    


    
    
    
    
    
    # def put(self, request, srv_prof_id):
    #     try:
    #         try:
    #             # Retrieve the professional record
    #             clgref_id = get_prof(request)[1]
    #             professional = agg_hhc_service_professionals.objects.get(srv_prof_id=srv_prof_id)
    #         except agg_hhc_service_professionals.DoesNotExist:
    #             return Response({"error": "Professional not found"}, status=status.HTTP_404_NOT_FOUND)
            
    #         # Update the agg_hhc_service_professionals data
    #         request_data = request.data.copy()
            
    #         if 'phone_no' in request_data:
    #             request_data['contact_number'] = request_data.pop('phone_no')
                
    #         if 'alt_phone_no' in request_data:
    #             request_data['alternate_number'] = request_data.pop('alt_phone_no')
                
    #         if 'emergency_contact_number' in request_data:
    #             request_data['eme_contact_no'] = int(request_data.pop('emergency_contact_number')[0])
            
    #         if 'emergency_name' in request_data:
    #             emergency_name = request_data.pop('emergency_name')
                
    #             if isinstance(emergency_name, list):
    #                 emergency_name = emergency_name[0]
                
    #             request_data['eme_conact_person_name'] = str(emergency_name)

    #         if 'emergency_relation' in request_data:
    #             request_data['eme_contact_relation'] = int(request_data.pop('emergency_relation')[0])
                
    #         if 'qualification' in request_data:
    #             request_data['Education_level'] = int(request_data.pop('qualification')[0])
                
    #         if 'email' in request_data:
    #             request_data['email_id'] = str(request_data.pop('email')[0])
            
    #         if 'zone' in request_data:
    #             request_data['prof_zone_id'] = str(request_data.pop('zone')[0])

    #         srvic = request_data.get('srv_id')
    #         srv = None
    #         try:
    #             srv = agg_hhc_services.objects.get(srv_id=srvic)
    #         except agg_hhc_services.DoesNotExist:
    #             srv = None

    #         if srv:
    #             request_data['srv_id'] = srv.service_title
    #         else:
    #             request_data['srv_id'] = None
    #         print(request_data, 'request_datarequest_data')
            
    #         # Update the professional record
    #         prof_serializer = Professional_Details_Get_Update_Serializer(professional, data=request_data, partial=True)
    #         if prof_serializer.is_valid():
    #             # Concatenate title, first name, and last name to create full colleague name
    #             title_value = int(request.data.get('title', 0))
    #             title_name = Title(title_value).name if title_value in Title._value2member_map_ else ""
    #             clg_first_name = request.data.get('clg_first_name', '')
    #             clg_last_name = request.data.get('clg_last_name', '')
    #             full_colleague_name = f"{title_name} {clg_first_name} {clg_last_name}".strip()

    #             # Update `prof_fullname` in agg_hhc_service_professionals
    #             professional.prof_fullname = full_colleague_name
    #             prof_serializer.save()

    #             # Update related colleague details
    #             colleague = professional.clg_ref_id  
    #             if colleague:
    #                 # Update the first name in `agg_com_colleague`
    #                 colleague.clg_first_name = f"{title_name} {clg_first_name} {clg_last_name}".strip() 
    #                 colleague.clg_gender = request.data.get('gender')
    #                 colleague.clg_Date_of_birth = request.data.get('dob')
    #                 colleague.clg_joining_date = request.data.get('doj')
    #                 colleague.clg_qualification = request.data.get('Education_level')
    #                 colleague.clg_specialization = request.data.get('specialization')
    #                 colleague.clg_Work_phone_number = request_data.get('contact_number') 
    #                 colleague.clg_work_email_id = request.data.get('email')
    #                 colleague.clg_mobile_no = request_data.get('alternate_number')
    #                 colleague.clg_state = request.data.get('state_name')
    #                 colleague.clg_address = request.data.get('prof_address')
    #                 colleague.last_modified_by = request.data.get('last_modified_by')
    #                 colleague.clg_specialization = request.data.get('clg_specialization')
    #                 colleague.save()

    #             quaaa = request.data.get('qualification')

    #             professional_details = agg_hhc_service_professional_details.objects.filter(srv_prof_id=professional).first()
    #             if professional_details:
    #                 professional_details.qualification = qualifications.objects.get(quali_id=quaaa) 
    #                 # professional_details.prof_CV = request.FILES.get('cv_file', professional_details.prof_CV)  
    #                 # if 'cv_file' in request.FILES:
    #                 #     professional_details.prof_CV = request.FILES['cv_file']

    #                 professional_details.last_modified_by = request.data.get('last_modified_by')
    #                 # professional_details.specialization = request.data.get('clg_specialization')
    #                 if 'clg_specialization' in request_data:
    #                     specialization_id = request_data.get('clg_specialization')
    #                     professional_details.specialization = qualification_specialization.objects.get(pk=specialization_id)
    #                 professional_details.save()

    #             # Handle uploaded professional documents
    #             for file_key, file in request.FILES.items():
    #                 if file_key.startswith('professional_document[') and file_key.endswith(']'):
    #                     doc_id = file_key.split('[')[1].split(']')[0]
    #                     lulu = agg_hhc_documents_list.objects.get(doc_li_id=doc_id)

    #                     # Check if the document already exists for this professional
    #                     existing_document = agg_hhc_professional_documents.objects.filter(
    #                         doc_li_id=lulu, srv_prof_id=professional
    #                     ).first()

    #                     if existing_document:
    #                         # Update the existing document with the new file
    #                         existing_document.professional_document = file
    #                         existing_document.last_modified_by = clgref_id
    #                         existing_document.save()
    #                     else:
    #                         # Create a new document if not already existing
    #                         agg_hhc_professional_documents.objects.create(
    #                             srv_prof_id=professional,
    #                             doc_li_id=lulu,           
    #                             professional_document=file,
    #                             added_by=clgref_id,
    #                             last_modified_by=clgref_id
    #                         )

    #             # Update or create records in agg_hhc_professional_sub_services
    #             sub_services_data = request.data.get('sub_services_details', [])
    #             for sub_service_data in sub_services_data:
    #                 sub_srv_id = sub_service_data.get('sub_srv_id')
                    
    #                 # Ensure sub_srv_id exists in sub_service_data
    #                 if not sub_srv_id:
    #                     continue

    #                 # Retrieve the sub-service instance by sub_srv_id
    #                 try:
    #                     sub_service_instance = agg_hhc_sub_services.objects.get(sub_srv_id=sub_srv_id)
    #                 except agg_hhc_sub_services.DoesNotExist:
    #                     return Response({"error": f"Sub-service with id {sub_srv_id} not found"}, status=status.HTTP_400_BAD_REQUEST)

    #             # Handle the sub-service and professional cost logic
    #             sssss = agg_hhc_professional_sub_services.objects.filter(srv_prof_id=professional, status=1)
    #             if 'sub_services' in request.data:
    #                 sub_srvicesss = ast.literal_eval(request.data.get('sub_services'))
    #                 prof_costsss = ast.literal_eval(request.data.get('prof_cost'))
                    
    #                 if sssss.count() == len(sub_srvicesss):
    #                     for index, existing_obj in enumerate(sssss):
    #                         print(prof_costsss[index],"prof_costsss[index]")
    #                         existing_obj.sub_srv_id = agg_hhc_sub_services.objects.get(sub_srv_id=sub_srvicesss[index])
    #                         existing_obj.prof_cost = prof_costsss[index]
    #                         existing_obj.last_modified_by = clgref_id
    #                         existing_obj.save()

    #                 elif len(sub_srvicesss) > sssss.count():
    #                     for index, existing_obj in enumerate(sssss):
    #                         existing_obj.sub_srv_id = agg_hhc_sub_services.objects.get(sub_srv_id=sub_srvicesss[index])
    #                         existing_obj.prof_cost = prof_costsss[index]
    #                         existing_obj.last_modified_by = clgref_id
    #                         existing_obj.save()

    #                     for index in range(sssss.count(), len(sub_srvicesss)):
    #                         new_sub_service = agg_hhc_professional_sub_services(
    #                             srv_prof_id=professional,
    #                             sub_srv_id=agg_hhc_sub_services.objects.get(sub_srv_id=sub_srvicesss[index]),
    #                             prof_cost=prof_costsss[index],
    #                             status=1,
    #                             added_by=clgref_id,
    #                             last_modified_by=clgref_id
    #                         )
    #                         new_sub_service.save()
    #                 else:
    #                     for index, existing_obj in enumerate(sssss[:len(sub_srvicesss)]):
    #                         existing_obj.sub_srv_id = agg_hhc_sub_services.objects.get(sub_srv_id=sub_srvicesss[index])
    #                         existing_obj.prof_cost = prof_costsss[index]
    #                         existing_obj.added_by = clgref_id
    #                         existing_obj.last_modified_by = clgref_id
    #                         existing_obj.save()
                            
    #                     extra_objs = sssss[len(sub_srvicesss):]
    #                     for i in extra_objs:
    #                         i.status = 2
    #                         i.save() 
                    
    #             return Response(prof_serializer.data, status=status.HTTP_200_OK)

    #         return Response(prof_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    #     except Exception as e:
    #         error_message = "An unexpected error occurred."
    #         logger.error(f"{error_message}: {str(e)}")
    #         return Response({
    #             "error": error_message,
    #             "details": str(e),
    #             "traceback": traceback.format_exc()
    #         }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  


class CvCreateView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = cv_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  
            return Response(serializer.data, status=status.HTTP_201_CREATED) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
    


class Clg_Is_Already_Exists_API(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        clg_Work_phone_number = request.query_params.get('clg_Work_phone_number')
        clg_work_email_id = request.query_params.get('clg_work_email_id')
        clg_ref_id = request.query_params.get('clg_ref_id')
        
        messages = []
        
        if clg_Work_phone_number and agg_com_colleague.objects.filter(clg_Work_phone_number=clg_Work_phone_number).exists():
            messages.append("User with this phone number already exists.")
        
        if clg_work_email_id and agg_com_colleague.objects.filter(clg_work_email_id=clg_work_email_id).exists():
            messages.append("User with this Email already exists.")
        
        if clg_ref_id and agg_com_colleague.objects.filter(clg_ref_id=clg_ref_id).exists():
            messages.append("User with this ID already exists.")
        
        if messages:
            return Response({"message": " ".join(messages)}, status=status.HTTP_409_CONFLICT)
        
        return Response({"message": "User does not exist."}, status=status.HTTP_200_OK)

#----------------------------Mohin Views End---------------------------------------------------------
