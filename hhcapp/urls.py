from django.urls import path
from hhcapp import views
from hhcweb import views as webviews
from rest_framework_simplejwt.views import (TokenRefreshView,)

urlpatterns=[
    path('agg_hhc_app_services_api',views.agg_hhc_app_services_api.as_view()),#integrated
    path('add_family_member',views.add_family_member.as_view()),#get patient list and patient post api
    path('get_family_list',views.get_family_list.as_view(),name="get_family_list"),# self addede 
    path('add_multiple_address_api', views.add_multiple_address_api.as_view()),
    path('agg_hhc_callers_relation_api', webviews.agg_hhc_caller_relation_api.as_view()),
    path('agg_hhc_app_patient_by_caller_api/<int:pk>/', views.agg_hhc_app_patient_by_caller_api.as_view()),
    path('agg_hhc_app_address_by_caller_api/<int:pk>/',views.agg_hhc_app_address_by_caller_api.as_view()),
    path('agg_hhc_app_befered_by',views.agg_hhc_app_befered_by.as_view()),
    path('agg_hhc_app_prefered_consultant',views.agg_hhc_app_prefered_consultant.as_view()),
    path('agg_hhc_callers_api/<int:pk>/',views.agg_hhc_callers_put_api.as_view()),
    path('agg_hhc_state_api',views.agg_hhc_state_api.as_view()),
    path('agg_hhc_app_address_get_put_delete_api/<int:pk>/',views.agg_hhc_app_address_get_put_delete_api.as_view()),
    # path('agg_hhc_sub_services_from_service/<int:pk>',views.agg_hhc_sub_services_from_service.as_view()), #this api will de used in web as well as app
    path('agg_hhc_patient_doc_detail', views.agg_hhc_patient_doc_detail.as_view()),
     #=============================================================================
    path('register/<int:pk>/', views.RegisterAPIView.as_view(), name='register'),
    path('login/', views.LoginAPIView.as_view(), name='login'),
    path('logout/', views.LogoutAPIView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('otp/', views.otpview.as_view(), name='otp'),
    path('ResendOTP/', views.ResendOTP.as_view()),
    path('VerifyPhoneNo/', views.VerifyPhoneNo.as_view()),
    path('agg_hhc_consultant_api_android/', views.agg_hhc_consultant_api_android.as_view()),
    #=====================================Vishal Api========================================
    path('agg_hhc_callers_register_api',views.agg_hhc_callers_register_api.as_view(),name="agg_hhc_callers_api"),#integrated api 
    path("caller_profile_pic",views.caller_profile_pic.as_view(),name="caller_profile_pic"),
    path("create_service",views.create_service.as_view(),name="create_service"),
    path("completed_services",views.completed_services.as_view(),name="completed_services"),
    path("completed_sessions/<int:event_id>",views.completed_sessions.as_view(),name="completed_sessions"),
    path("active_services",views.active_services.as_view(),name="active_services"),
    path("can_services",views.can_services.as_view(),name="can_services"),
    path("create_service_new",views.create_service_new.as_view(),name="create_service_new"),
    path("payment_completed",views.payment_completed.as_view(),name="payment_completed"),
    path("event_status_api",views.event_status_api.as_view(),name="event_status_api"),
    path("event_status_event_api/<int:event_id>",views.event_status_event_api.as_view(),name="event_status_api"),
    path("cancellation_service_get_api/<int:event_id>",views.cancellation_service_get_api.as_view(),name="cancellation_service_get_api"),#get and creat cancel request here only
    path("Active_Api/<int:event_id>",views.Active_Api.as_view(),name="Active_Api"),
    path("professional_details/<int:dt_eve_id>",views.professional_details.as_view(),name="professional_details"),
    path("feedback",views.feedback.as_view(),name="feedback"),
    path("cancellation_charges_for_all_app/<int:eve_id>",views.cancellation_charges_for_all_app.as_view(),name="cancellation_charges_for_all_app"),

    #-------------------------------Mayank-----------------------------
    path('create_cf_token/', views.create_cf_token, name='create_cf_token'),
    path('feedback_status',views.feedback_status.as_view(),name="feedback_status"),
    path('update_check/<int:device_type>/<str:version_number>/<str:build_number>/<int:App>/',views.update_check.as_view(),name="update_check"),
    path('change/',views.change.as_view(),name="change"),

    ]