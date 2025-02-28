from django.urls import path
from hhcweb import views
from hhcweb.views import UserRegistrationView, UserLoginView, LogoutView,combined_info, UserProfileView
# from .views import AggHHCServiceProfessionalAPIView


urlpatterns = [


    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='auth-logout'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('agg_hhc_purpose_call_api',views.agg_hhc_purpose_call_api.as_view()),#done
    path('agg_hhc_caller_relation_api',views.agg_hhc_caller_relation_api.as_view()),#done
    path('agg_hhc_locations_api',views.agg_hhc_locations_api.as_view()),
    path('agg_hhc_services_api',views.agg_hhc_services_api.as_view()),
    path('agg_hhc_sub_services_api/<int:pk>',views.agg_hhc_sub_services_api.as_view()),
    path('agg_hhc_gender_api',views.agg_hhc_gender_api.as_view()),#done
    path('agg_hhc_patients_api',views.agg_hhc_patients_api.as_view()),    # ??
    path('get_latest_patient_record_from_caller_id_api/<int:pk>/',views.get_latest_patient_record_from_caller_id_api.as_view()),
    # path('agg_hhc_add_'),
    # path('agg_hhc_patinet_list_enquiry_api',views.agg_hhc_patinet_list_enquiry_api.as_view()),#done
    path('agg_hhc_patinet_list_enquiry_put/<int:pk>/',views.agg_hhc_patinet_list_enquiry_put.as_view()),
    path('agg_hhc_callers_api',views.agg_hhc_callers_api.as_view()),#done
    path('agg_hhc_patient_from_callers_phone_no/<int:pk>/',views.agg_hhc_callers_phone_no.as_view()),#find all patients from caller number 
    # path('agg_hhc_form_patient_from_callers_phone_no/<int:pk>/',views.agg_hhc_callers_form_phone_no.as_view()),#find all patients from caller number 
    path('agg_hhc_add_service_details_api', views.agg_hhc_add_service_details_api.as_view()),
    path('agg_hhc_hospitals_api',views.agg_hhc_hospitals_api.as_view()),#done
    path('select_hospital_name',views.select_hospital_name.as_view()),
    path('agg_hhc_city_from_state_api/<str:state>',views.agg_hhc_city_from_state_api.as_view()),#find all city from state name
    path('agg_hhc_city_state_from_zone_api/<int:city_id>',views.agg_hhc_city_state_from_zone_api.as_view()),#this table is used to get city name and state name
    path('agg_hhc_pincode_from_city_api/<str:city>',views.agg_hhc_pincode_from_city_api.as_view()),#find all findcode from city name 
    path('Caller_details_api/<int:pk>', views.Caller_details_api.as_view()),
    path('patient_detail_info_api/<int:pk>', views.patient_detail_info_api.as_view()),
    path('Service_requirment_api/<int:pk>', views.Service_requirment_api.as_view()),
    path('agg_hhc_service_professionals_api',views.agg_hhc_service_professionals_api.as_view()),#this display professional name and skills
    # path('calculate_total_amount/<int:cost>/<str:start_date>/<str:end_date>/',views.calculate_total_amount.as_view()),  # add sub_service id to calculate amount as per sub_service
    path('calculate_total_amount/<int:cost>/<int:day_count>/',views.calculate_total_amount.as_view()),
    path('calculate_total_amount/<int:sub_srv>/<str:start_date>/<str:end_date>/',views.calculate_total_amount.as_view()),  # add sub_service id to calculate amount as per sub_service
    path('calculate_discount_api/<int:dtype>/<int:damount>/<int:total_amt>',views.calculate_discount_api.as_view()),
    path('last_patient_service_info/<int:pt_id>',views.last_patient_service_info.as_view()),#this is to display patient last service name and last start and end service date
    path('agg_hhc_professional_scheduled_api/<int:prof_sche_id>',views.agg_hhc_professional_scheduled_api.as_view()),#To display professional time in calander as well as in professional availability
    path('agg_hhc_professional_time_availability_api/<int:prof_sche_id>',views.agg_hhc_professional_time_availability_api.as_view()),#used to display professional booked services in professional Avalibility
    path('total_services/<int:service_professional_id>/', views.total_services, name='total_services'),#this display total services for Professionals
    path('agg_hhc_service_professionals/', views.AggHHCServiceProfessionalListAPIView.as_view(),name='agg_hhc_service_professional-list'),#mayank
    #--------------------------------------------Dashboard------------Api--------------------------------------
    path('service_details_today_total_services',views.service_details_today_total_services.as_view()),




    #-----------------------------------------nikita_p--------------------------------------
    path('pro_aval/',views.AddAvalView.as_view(),name="AddAvalView"),
    path('pro_dtl_aval/',views.GetDtlAvalView.as_view(),name="GetDtlAvalView"),
    path('pro_del_aval/',views.DelAvalView.as_view(),name="DelAvalView"),
    path('pro_del_loc/',views.DelLocView.as_view(),name="DelLocView"),
    path('pro_aval_zone/',views.AvalZoneView.as_view(),name="AvalZoneView"),
    path('pro_loc_list/',views.LocListView.as_view(),name="LocListView"),
    path('sos_detls/',views.sos_dtls_api.as_view()),# Display List of SOS details
    path('pen_consent/',views.pen_consent_api.as_view()),# Display List of pending consent form
    path('agg_hhc_zone_api/<int:pk>',views.agg_hhc_zone_api.as_view()),# Display List of Zones    
    path('agg_hhc_sub_srv/',views.agg_hhc_sub_srv.as_view()),# Display List of Sub Services
    path('agg_hhc_sub_srv_jc_form_num/',views.agg_hhc_sub_srv_jc_form_num.as_view()),# Display the number of form based on sub service
    path('agg_hhc_session_job_closure/',views.agg_hhc_session_job_closure.as_view()),# Post API to submit job closure as per session
    path('agg_hhc_event_professional_api/',views.agg_hhc_service_professional_list_api.as_view()), # Display List of Professionals (all) OR (with filter:- Services, Zones)
    path('agg_hhc_busydays_profs_api/',views.agg_hhc_busy_days_of_profs_api.as_view()), # Display BUSY or LEAVE days of Professionals
    path('agg_hhc_event_professional_reschdl_api/',views.agg_hhc_service_professional_reschdl_list_api.as_view()), # Display List of Professionals (all) OR (with filter:- Services, Zones)
    # path('agg_hhc_event_professional_api/',views.agg_hhc_service_professional_api.as_view()), # Display List of Professionals (all) OR (with filter:- Services, Zones)
    path('all_dtl_evnts/',views.all_dtl_evnts.as_view()), # Display All Detailed Events against particular Event 
    path('agg_hhc_detailed_event_plan_of_care/',views.agg_hhc_detailed_event_plan_of_care_api.as_view()), # Display All Events against perticular professional 
    path('agg_hhc_detailed_event_plan_of_care_per_day/',views.agg_hhc_detailed_event_plan_of_care_per_day_api.as_view()),# Display all the TOADY'S events against perticular professional display upcomming events from current time / and put api for update time slot
    path('agg_hhc_detailed_event_plan_of_care_each_event/',views.agg_hhc_detailed_event_plan_of_care_each_event.as_view()),# Display all the PARTICULAR events against perticular professional 


    #-------------------------------------------mohin---------------------------------------------------------
    path('service_request/<int:hosp_id>',views.combined_info.as_view()),



    #-----------------------------mayank-----------------------------
    # path('service-professionals/', AggHHCServiceProfessionalAPIView.as_view(), name='service-professional-api'),
    path('total_services/', views.total_services, name='total-services-list'),
    path('create_payment/', views.create_payment_url, name='create_payment_url'),
    # path('cashfree-webhook/', views.cashfree_webhook, name='cashfree_webhook'),
    # path('jjob-type-count/<int:id>', views.JjobTypeCountAPIView.as_view(), name='job-type-count'),
    path('jjob-type-count/', views.JjobTypeCountAPIView.as_view(), name='job-type-count1'),
    # path('update_transaction_status/', views.update_transaction_status, name='update_transaction_status'),
    # path('transaction_status/', views.payment_status_webhook, name='update_transaction_status'),
    path('update_transaction_status/', views.update_transaction_status, name='update_transaction_status'),
    path('combined/', views.CombinedAPIView.as_view(), name='combined-api'),
    path('permissions/', views.CreatePermissionAPIView.as_view(), name='create_permission'),
    path('permissions/<int:id>/', views.UpdatePermissionAPIView.as_view(), name='update_permission'),
    path('combined/<int:group>/', views.GetPermissionAPIView.as_view(), name='get_permissions'),
    path('add_inventory/', views.AddInventoryAPIView.as_view(), name='add_inventory_api'),
    path('inventory_names/', views.InventoryNameGetAPIView.as_view(), name='inventory_names_api'),
    path('add_stocks/', views.AddStocksAPIView.as_view(), name='add_stocks_api'),
    path('add_request_post/', views.AddRequestAPIView.as_view(), name='add_stocks_api'),
    path('material-request-put/<int:material_request_id>/', views.AddMaterialRequest_PUT_APIView.as_view(), name='material-request-detail'),
    path('HHC_Module_names/', views.HHC_Module_GetAPIView.as_view(), name='HHC_names_api'),
    
    path('agg_hhc_attendance/', views.AggHHCAttendanceAPIView.as_view(), name='agg_hhc_attendance_list'),
    path('agg-hhc-attendance/', views.PostAggHHCAttendanceAPIView.as_view(), name='post_agg_hhc_attendance'),
    
    path('get_transactiion/', views.get_settlement_reconciliation, name='get_url'),
    path('update_settlement_status/', views.update_transaction_status_settlement_webhook, name='update_transaction_status'),


    path('GET_attendance/<int:pro_id>/', views.GetAggHHCAttendanceAPIView.as_view(), name='get_attendance'),
    path('update-agg-hhc-attendance/', views.UpdateAggHHCAttendanceAPIView.as_view(), name='update-agg-hhc-attendance'),

    path('count-professionals/', views.CountProfessionals.as_view(), name='count-professionals'),
    path('count-professionals-attendance/', views.CountProfessionalsAttendanceStatus.as_view(), name='count-professionals-attendance'),


    path('Deallocater-attendance/', views.Deallocate_AggHHCAttendanceAPIView.as_view(), name='agg-hhc-attendance'),
    
    path('save_website_count/', views.session_count_view.as_view(), name='session_count_view'),
    path('latest-service-count/', views.LatestServiceCountView.as_view(), name='latest-service-count'),
    
    path('total_amount_received/', views.TotalAmountReceivedView.as_view(), name='total_amount_received'),
    path('pending_amount_received/', views.PendingAmountReceivedView.as_view(), name='total_amount_received'),
    path('unpaid_amount/', views.CalculateUNpaidAmount.as_view(), name='total_amount_received'),

    path('professional-count/', views.ProfessionalCountView.as_view(), name='professional-count'),


    path('cancelled_inq_detail/', views.cancelled_inq_detail.as_view(), name='total_amount_received'),
    path('pending_amount_details/', views.PendingAmountReceiveddetailed.as_view(), name='total_amount_received'),
    path('unpaid_amount_details/', views.UNpaidAmount_details.as_view(), name='total_amount_received'),

    path('unassign_professional/', views.UNassign_ProfessionalView.as_view(), name='professional-count'),

    path('Details_of_ServicesOngoingPendingCompleted/', views.TotalServicesOngoingPendingCompleted_counts_service_wise.as_view(), name='total_amount_received'),

    path('send-message/', views.SendMessageView.as_view(), name='send-message'),
    
    path('feedback_questions/', views.FeedbackQuestionsAPIView.as_view(), name='feedback-questions'),
    path('save_feedback_q/', views.SsavePatientFeedbackAPIView.as_view(), name='save-feedback'),
    
    path('F_question_app/', views.CombinedAPIView_for_feedback_questions.as_view(), name='combined_no_eve'),
    path('F_question_app/<int:eve_id>/', views.CombinedAPIView_for_feedback_questions.as_view(), name='combined_with_eve'),
    path('create_payment_sms/', views.create_payment_url_sms_new, name='create_payment_url'),

    # path('create_payment/', views.create_payment_url, name='create_payment_url'),
    path('cancel-payment-link/<int:event_id>/', views.CancelPaymentLinkView.as_view(), name='cancel_payment_link'),

    path('force-logout/', views.ForceLogoutView.as_view(), name='force_logout'),

    # -------------------- vinayak ----------------------------------------------

    path('ongoing_service/<int:hosp_id>', views.OngoingServiceView.as_view()),
    path('service_reschedule/<int:eve_id>/',views.service_reschedule_view.as_view()),
    path('session_reschedule/',views.Reschedule_session_view.as_view()),
    path('prof_reschedule/<int:eve_id>/', views.Professional_Reschedule_Apiview.as_view()),
    path('prof_reschedule/', views.Professional_Reschedule_Apiview.as_view()),
    path('service_cancellation/<int:eve_id>', views.ServiceCancellationView.as_view()),
    path('session_cancellation/', views.SessionCancellationView.as_view()),
    path('get_session_amt/<int:eve_id>/<int:sub_srv_id>/<str:start_date_time>/<str:end_date_time>/', views.get_session_data.as_view()),
    path('professional_availability_api/<int:sub_srv_id>/<str:actual_StartDate_Time>/<str:actual_EndDate_Time>',views.get_all_avail_professionals.as_view()), 
    path('srv_cancel_count_dashbord/<int:id>', views.srv_canc_count.as_view()), 
    path('srv_dtl_dash/<int:id>', views.srv_dtl_dash.as_view()),
    path('concent_upload_discharge_summery_document_and_signature/',views.concent_upload_discharge_summery_document_signature.as_view()),
    path('concent_upload_discharge_summery_document_and_signature/<int:eve_id>',views.concent_upload_discharge_summery_document_signature.as_view()),
    path('agg_hhc_consultant_api_web_form/',views.agg_hhc_consultant_api_web_form.as_view()),
    path('agg_hhc_hospitals_api_web_form',views.agg_hhc_hospitals_api_web_form.as_view()),
    path('agg_hhc_gender_api_web_form',views.agg_hhc_gender_api_web_form.as_view()),
    path('agg_hhc_services_api_web_form',views.agg_hhc_services_api_web_form.as_view()),
    path('agg_hhc_patient_from_callers_phone_no_web_form/<int:pk>/',views.agg_hhc_callers_phone_no_web_form.as_view()),
    # path('hd_invoce_eventwise/<int:eve_id>', views.hd_invoce_eventwise.as_view()),
    # path('get_reschedule_cancle_request/<int:res_can>/<int:srv_sess>/',views.get_reschedule_cancle_request.as_view()),
    # path('job_closure_questions/<int:srv_id>/', views.job_closure_questions.as_view()),

    path('hd_invoce_eventwise/<int:eve_id>', views.hd_invoce_eventwise.as_view()),

    path('feedback_complent_dashbord_count/<int:is_fc>/', views.feedback_complent_dashbord_count.as_view()),
    path('feedback_complent_dashbord_count/<int:is_fc>/<int:is_twm>/', views.feedback_complent_dashbord_count.as_view()),
    path('Calculate_pending_service/', views.Calculate_pending_service.as_view()),
    
    path('Calculate_Total_enquiry/', views.Calculate_Total_enquiry.as_view(), name='total_amount_received'),
    
    path('Calculate_infollow_up_service/', views.Calculate_infollow_up_service.as_view(), name='total_amount_received'),
    
    path('Calculate_cancelled_service/', views.Calculate_cancelled_service.as_view(), name='total_amount_received'),
    path('Calculate_converted_service/', views.Calculate_converted_service.as_view(), name='total_amount_received'),


    path('get_reschedule_cancle_request/<int:res_can>/<int:srv_sess>/',views.get_reschedule_cancle_request.as_view()),
    path('job_closure_questions/<int:srv_id>/', views.job_closure_questions.as_view()),
    path('job_closure_questions_web_form/<int:srv_id>/', views.job_closure_questions_web_form.as_view()),

    path('professional_reuest_approval/<int:req_id>/<int:res_can>/<int:srv_sess>/', views.request_approvals.as_view()),
    path('professional_reuest_approval_rc/<int:eve_id>/<int:dtl_eve_id>/', views.request_approvals_get_ptn.as_view()),
    path('professional_reuest_approval_rc/<int:eve_id>/', views.request_approvals_get_ptn.as_view()),
    path('professional_request_rejection/<int:req_id>/', views.request_rejection.as_view()),
    # path('get_selected_job_closure_question/<int:eve_id>/<int:lang_id>', views.get_selected_job_closure_question_prof_app.as_view()), 
    path('get_selected_job_closure_question/<int:eve_id>/', views.get_selected_job_closure_question.as_view()), 
    path('get_selected_job_closure_question/<int:eve_id>/<int:lang_id>', views.get_selected_job_closure_question.as_view()), 
    path('job_closure_srv_sess_wise/<int:srv_prof_id>/<int:dtl_eve_id>/', views.job_closure_srv_sess_wise.as_view()),
    path('test_case_service_deactivate/',views.test_case_service_deactivate.as_view()),
    path('collect_amt_frm_prof/',views.collectamtprof.as_view()),
    path('service_count/<str:from_date>/<str:to_date>/<int:hos_id>/',views.service_count.as_view()),
    path('srv_enq_cancellation_data/',views.srv_enq_cancellation_data.as_view()),
    path('update_sub_srv_eventwise/<int:eve_id>/<int:flag>/', views.update_sub_srv_eventwise.as_view()),





    #-------------------------------------------Amit---------------------------------------------------------
    path('Follow_Up_combined_table/<int:hosp_id>', views.agg_hhc_service_enquiry_list_combined_table_view.as_view()),
    path('previous_follow_up/<int:flag>/<int:event_id>', views.agg_hhc_enquiry_previous_follow_up_APIView.as_view()),
    path('Add_follow_up/', views.agg_hhc_enquiry_Add_follow_up_APIView.as_view()),
    path('cancellation_reason_follow_up_list/<int:pk>', views.agg_hhc_enquiry_followUp_cancellation_api.as_view()),
    path('cancel_follow_up/', views.agg_hhc_enquiry_Add_follow_up_Cancel_by_APIView.as_view()),
    path('create_service_follow_up/', views.agg_hhc_enquiry_Add_follow_up_create_service_APIView.as_view()),
    path('Prof_names_eve_wise/<int:eve_id>', views.Prof_names_eve_wise_view.as_view()),


    path('Get_User/', views.Create_Get_User_Views.as_view()),                                       # For HR Module - System User - Get registered User  
    path('Group_N/', views.group_and_type_Views.as_view()),                                         # For HR Module - System User - Get Group Name
    path('Post_User/', views.Create_Post_User_Views.as_view()),                                     # For HR Module - System User - registered User 
    path('Edit_User/<int:clg_id>/', views.Edit_User_Views.as_view()),                               # For HR Module - System User - Edit_User
    path('active_inActive_User/<int:clg_id>/', views.active_inActive_User_Views.as_view()),         # For HR Module - System User - Active InActive User    



    path('add_Group_module/', views.create_module_Views.as_view()),                             # Admin  Add Group POST API - Amit
    path('add_module_name/', views.create_permission_module_Views.as_view()),                      # Admin Add Module and Group Id POST API - Amit
    path('add_new_permission_name/', views.Add_New_permission_Views.as_view()),                      # Admin Add Permission and Group Id POST API - Amit     

    path('Get_sub_module/<int:group_id>/', views.get_sub_moduel_Views.as_view()),                              # Admin - Add Permission module Get API - Amit  

    path('1add_Group_module/', views.create_group_module_Views.as_view()),
    path('add_permission_module/', views.create_permission_Views.as_view()),






    # path('previous_follow_up/', views.agg_hhc_enquiry_previous_follow_up_APIView.as_view()),

    # path('cancel_spero_follow_up/', views.agg_hhc_enquiry_Add_follow_up_Cancel_by_Spero_APIView.as_view()),
    # path('cancel_patent_follow_up/', views.agg_hhc_enquiry_Add_follow_up_Cancel_by_Patent_APIView.as_view()),    
# ------------------------------------------Sandip-------------------------------------------------
    path('agg_hhc_add_service_details_api/', views.agg_hhc_add_service_details_api.as_view()),
    path('agg_hhc_add_service_form_api/', views.agg_hhc_add_service_form_api.as_view()),
    path('agg_hhc_add_service_form_api/<int:eve_id>/', views.agg_hhc_add_service_form_api.as_view()),
    path('agg_hhc_add_service_details_api/<int:pk>', views.agg_hhc_add_service_details_api.as_view()),
    path('agg_hhc_consultant_api/',views.agg_hhc_consultant_api.as_view()),
    path('agg_hhc_consultant_HD_api/',views.agg_hhc_consultant_HD_api.as_view()),
    path('agg_hhc_state_api',views.agg_hhc_state_api.as_view()),
    path('agg_hhc_city_api/<int:pk>',views.agg_hhc_city_api.as_view()),
    path('agg_hhc_patient_by_HHCID/<str:pk>',views.agg_hhc_patient_by_HHCID.as_view()),
    path('agg_hhc_srv_req_prof_allocate/<int:pk>',views.agg_hhc_srv_req_prof_allocate.as_view()),
    path('get_payment_details/<int:pk>',views.get_payment_details.as_view()),
    # path('FindProfessionalBySubService/<int:sub_service>/',views.FindProfessionalSubService.as_view()),
    path('FindProfessionalBySubService/<int:eve_id>/',views.FindProfessionalSubService.as_view()),
    # path('register-token/', views.DeviceTokenView.as_view(), name='register-token'),
    # path('send-notification/', views.SendNotificationView.as_view(), name='send-notification'),
    path('Store_Token/', views.Store_Token.as_view(), name='send-notification'),
    path('add_convinance_charges/<int:eve_id>/<int:prof_id>/', views.add_convinance_charges.as_view()),  
    path('add_consultant/', views.add_consultant.as_view()),  
    path('Add_ongoing_follow_up/', views.agg_hhc_ongoing_Add_follow_up_APIView.as_view()),
    path('enquiry_Service_Notification_count/', views.enquiry_Service_Notification_count.as_view()),
    path('CalculateConvinanceCharge/<int:eve_id>/<int:paid_amount>/', views.CalculateConvinanceCharge.as_view()),
    path('Ongoing_Event/', views.Ongoing_Eve.as_view()), 
    path('payment-detail/',views.PaymentDetailAPIView.as_view(), name='payment-detail-api'),
    path('update_receipt_no/', views.update_receipt_no.as_view()), 
    path('cancel_service/<int:eve_id>/',views.cancel_service.as_view()),
    path('SingleRecord/<int:eve_id>/', views.SingleRecord.as_view()),
    path('all_session_details/<int:eve_id>/',views.all_session_details.as_view()),
    path('service_count/<str:from_date>/<str:to_date>/<int:hos_id>/',views.service_count.as_view()),
    path('hospital_dashboard_srv_count/<str:clg_id>/<int:id>/',views.hospital_dashboard_srv_count.as_view()),
    path('hospital_dashboard_enquiry_follow_up_count/<str:clg_id>/<int:id>/',views.hospital_dashboard_enquiry_follow_up_count.as_view()),
    path('hospital_dashboard_service_details/<str:clg_id>/<int:id>/',views.hospital_dashboard_service_details.as_view()),
    # path('Ongoing_Event/', views.Ongoing_Eve.as_view()),
    path('get_payment_with_prof_eve_detail/<int:eve_id>/',views.get_payment_with_prof_eve_detail.as_view()), 
    path('get_event_dates/<int:eve_id>/',views.get_event_dates.as_view()), 
    path('get_service_details/<int:eve_id>/',views.get_service_details.as_view()), 
    path('get_help/',views.get_help.as_view()), 
    path('agg_hhc_all_zone_api/',views.agg_hhc_all_zone_api.as_view()), 
    path('Get_Coupons/',views.Get_Coupons.as_view()), 
    path('Get_Coupons/<int:pt_id>/',views.Get_Coupons.as_view()), 
    path('insurance_gen_dtl_api/<int:patient_id>/',views.insurance_gen_dtl_api.as_view()), 
    path('insurance_gen_ptn_api/',views.insurance_gen_ptn_api.as_view()), 
    # path('Get_Coupons/<int:pt_id>/<int:code_id>/',views.Get_Coupons.as_view()), 
    path('insurance_gen_dtl_api/<int:patient_id>/',views.insurance_gen_dtl_api.as_view()), 
    # path('insurance_gen_ptn_api/',views.insurance_gen_ptn_api.as_view()),  
    

    

#------------------------------------------Vishal-----------------------------------------------
    path('coupon_code_post_api/<str:code>/<int:total_amt>',views.coupon_code_post_api.as_view()),
    path('coupon_code_api',views.coupon_code_api.as_view()),
    path('allocate_api',views.allocate_api.as_view()),
    path('multiple_allocate_api',views.multiple_allocate_api.as_view()),
    path('temp_multiple_allocation_api',views.temp_multiple_allocation_api.as_view()),
    path('Dashboard_enquiry_count_api/<int:id>',views.Dashboard_enquiry_count_api.as_view()),
    path('Dashboard_enquiry_status_count_api/<int:id>',views.Dashboard_enquiry_status_count_api.as_view()),
    path('previous_patient_pending_amount/<int:pt_id>',views.previous_patient_pending_amount.as_view()),
    path('transport_charges_api/<int:hosp_id>/<str:lat>/<str:long>/<str:start_date>/<str:end_date>/',views.transport_charges_api.as_view(),name="transport_charges_api"),
    path('professional_Denial_api',views.professional_Denial_api.as_view()),
    path('conveniance_charges_count/<str:start_date>/<str:end_date>/<int:conve_charge>/',views.conveniance_charges_count.as_view()),
    path('call_back_notification_api',views.call_back_notification_api.as_view()),
    path('patient_last_feedback/<int:pt_id>',views.patient_last_feedback.as_view()),#get api
    path('new_api/<int:eve_poc_id>/',views.new_api.as_view()),
    path('enquirie_SingleRecord/<int:eve_id>/', views.enquirie_SingleRecord.as_view()),
    
    
    #-------------------------------------Mohin-----------------------------------------
    path('update_caller_event/<int:eve_id>/<int:cl_id>/', views.update_cl_eve.as_view()),
   
    
    
]


