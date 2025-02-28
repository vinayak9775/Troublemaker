from django.urls import path
from hhc_hcm.views import *
# from hhc_hcm import views
# from . import views

urlpatterns = [
    path('manage_srv/', manage_srv.as_view()),
    path('manage_hos/', manage_hos.as_view()),
    path('manage_sub_srv/', manage_sub_srv.as_view()),
    path('prof_api/', Prof_api.as_view()),
    path('manage_cons/', manage_cons.as_view()),
    path('callbackbtn/', CallBackButton.as_view()),
    path('prof_aval_api/', Prof_aval_api.as_view()),
    path('prof_srv_cost/', prof_srv_cost.as_view()),

    # ------------------------------------------- Sandip Shimpi ------------------------------------------
    path('VIPPatients/', VIPPatients_api.as_view()),
    path('VIPConvert/<int:event>/', VIPConvert_api.as_view()),
    path('FeedBack_questions/', FeedBack_questions.as_view()),
    path('FeedBack_questions/<int:question>/', FeedBack_questions.as_view()),
    path('forcefully_logout_api/',forcefully_logout_api.as_view()),


    # -----------------------------  Vinayak ----------------------------------------------------------------
    path('get_reschedule_cancle_request/<int:res_can>/<int:srv_sess>/',get_reschedule_cancle_request.as_view()),
    path('service_inactive_hhc/<int:srv_id>/<int:id>/', inactive_service.as_view()),
    path('sub_service_inactive_hhc/<int:sub_srv_id>/<int:id>/', inactive_sub_service.as_view()),
    path('Get_professional_otp_data/', Get_professional_otp_data.as_view()),
    path('date_srvwise_ptn_lst/',get_evewise_ptn_dt.as_view()),
    path('Insurance_Get_API/', Insurance_Get_API_View.as_view(), name='Insurance_Get_API'),
    path('submit_insurance_events_dtl/',submit_insurance_events_dtl.as_view()),

]
