from django.urls import path
from . import views

urlpatterns=[

# --------------------------------- Nikita P / Vishal ------------------------------------------
    path('pro_login/',views.ProfessionalOTPLogin.as_view()),
    path('pro_otp_chk/',views.OTPCHECK.as_view(),name="OTPCHECK"),
    path('pro_logout/',views.LogoutView.as_view(),name="LogoutView"),
    path('pro_profile/', views.UserProfileView.as_view(), name='profile'),
    path('prof_edit/', views.updateprofprofile.as_view(), name='profile_app'),
    path('patient_start_service_otp_send/',views.patient_start_service_otp_send.as_view(),name="patient_start_service_otp_send"),
    path('patient_start_service_otp_check/',views.patient_start_service_otp_check.as_view(),name="patient_start_service_otp_check"),
    path('patient_pending_amount/<int:eve_id>',views.patient_pending_amount.as_view(),name="patient_pending_amount"),#
    path('pro_sos_call/',views.SosDtlView.as_view(),name="SosDtlView"),
    path('pro_aval/',views.AddAvalView.as_view(),name="AddAvalView"),
    path('pro_aval_zone/',views.AvalZoneView.as_view(),name="AvalZoneView"),
    path('pro_del_aval/',views.DelAvalView.as_view(),name="DelAvalView"),
    path('pro_loc_list/',views.LocListView.as_view(),name="LocListView"),
    path('select_number_to_send_opt/<int:eve_id>',views.select_number_to_send_opt.as_view(),name="select_number_to_send_opt"),
    path('payment_recived_by_prof/',views.payment_recived_by_prof.as_view(),name="payment_recived_by_prof"),#payment post api 
    path('payment_from_professional_to_spero/',views.payment_from_professional_to_spero.as_view(),name="payment_from_professional_to_spero"),#Amount with professional get api 
    path('professional_dashboard_count/',views.professional_dashboard_count.as_view(),name="professional_dashboard_count"),#<int:prof_id>
    path('Transport_api/',views.Transport_api.as_view(),name="Transport_api"),
    path('last_login_check',views.last_login_check.as_view(),name="last_login_check"),
    path('feedback_status/<int:eve_id>/<int:dt_event>/',views.feedback_status.as_view(),name="feedback_status"),
# --------------------------------- Sandip Shimpi -----------------------------------------------
    path('agg_hhc_get_role/',views.agg_hhc_get_role.as_view()),
    path('agg_hhc_document_list/<int:pk>/',views.agg_hhc_document_list.as_view()),
    path('agg_hhc_add_document/<int:role>/',views.agg_hhc_add_document.as_view()), #<int:prof_id>/(1st)
    path('agg_hhc_add_document/',views.agg_hhc_add_document.as_view()),
    # path('agg_hhc_add_document/<int:pk>/',views.agg_hhc_add_document.as_view()),
    path('Add_Prof_location_api/',views.Add_Prof_location_api.as_view()),
    path('Send_Notification/', views.Send_Notification.as_view(), name='send-notification'),
    path('Prof_Notification_List/', views.Professional_Notification_List.as_view()),#<int:prof>/



# --------------------------------------- Vinayak -------------------------------------------------------
    path('reg_prof_Apiview/', views.Register_professioanl_for_interview.as_view()), #<str:clg_ref_id>
    # path('reg_prof_Apiview/<int:srv_prof_id>/<int:clg_ref_id>', views.Register_professioanl_for_interview.as_view()),
    path('prof_ongoing_srv_sesson/',views.get_professional_srv_dtl_apiview.as_view()), #<int:srv_prof_id>
    path('srv_cancelled_pro_app/',views.srv_cancelled_pro_app.as_view()), #<int:srv_prof_id>
    path('prof_req_to_cancle_session/',views.cancelled_request_professional.as_view()),
    path('srv_sesn_reschedule_pro_app/',views.Reschedule_request_professional.as_view()),   
    path('upcoming-service/',views.UpcomingServiceAPI.as_view(), name='upcoming-service'), # <int:srv_prof_id>/
    path('completed-service/',views.CompletedServiceAPI.as_view(), name='completed-service'), #<int:srv_prof_id>/
    path('pending_services/',views.pending_services.as_view()),#all pending servicess 
    path('pending_sessions/<int:eve_id>/',views.pending_sessions.as_view()),#all pending servicess 
    path('feedback/<int:lan>/', views.feedback.as_view(), name='feedback'),
    path('feedback/', views.feedback.as_view(), name='feedback'),
    path('cancellation-history/', views.CancellationHistoryAPIView.as_view(), name='cancellation_history_api'), #<int:srv_prof_id>/
    path('Pro_session/<int:eve_id>/', views.SrvSessAPIView.as_view(), name='srv_sess_api'), #<int:srv_prof_id>/
    path('Today_session/', views.TodaySessAPIView.as_view(), name='srv_api'), #<int:srv_prof_id>/
    path('Current_session/', views.CurrentSessAPIView.as_view(), name='sess_api'), #<int:srv_prof_id>/
    path('Patient_detail/<int:pt_id>/<int:eve_id>/<int:agg_sp_dt_eve_poc_id>/', views.MyView.as_view(), name='my_view'),
    path('Patient_detail/<int:pt_id>/<int:eve_id>/', views.MyView.as_view(), name='my_view'),
    path('call_back_api',views.call_back_api.as_view(),name="call_back_api"),
    path('payment_skip/<int:dt_ev>/',views.payment_skip.as_view(),name='payment_skip'),
    path('cancel_request',views.cancel_request.as_view(),name='cancel_request'),
    # path('payment_with_professionals',views.payment_with_professionals.as_view(),name="payment_with_professionals"),
    path('SendMessageView_for_allocation/',views.SendMessageView_for_allocation.as_view(),name='SendMessageView_for_allocation'),
    path('new_utr_35/',views.new_utr_name.as_view(),name="new_utr_name"),
    path('Orm_api/',views.Orm_api.as_view(),name="Orm_api"),       
]