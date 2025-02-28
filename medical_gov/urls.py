from django.urls import path
from .views import *


urlpatterns = [
    path('datewise_job_closure/',datewise_job_closure_dtls.as_view()),
    path('datewise_job_closure/<str:from_date>/<str:to_date>/',datewise_job_closure_dtls.as_view()),
    path('update_job_closure_form_api/<str:jc_id>/',update_job_closure.as_view()),
    path('event_wise_job_clouser_dtls/<int:eve_id>/',event_wise_job_clouser_dtls.as_view()),
    path('Medical_job_closure/',Medical_job_closure.as_view()),
    #==============================Mohin=============================
    path('vital_get/', Vital_get_API.as_view(), name='vital_get'),
    path('vital_post/', Vital_post_API.as_view(), name='vital_post'),
    path('all_vital_data/<int:event_id>/', Get_all_vital_data.as_view(), name='all_vital_data'),
    path('Post_Vital_remark_data/', Post_Vital_remark_data.as_view(), name='Post_Vital_remark_data'),
    path('ongoing_event_telemedicine/', Ongoing_Eve_Telemedicine.as_view(), name='ongoing_event_telemedicine'),
    path('Telemedicine_vc_data_save_api/', Telemedicine_videocall_data_save_api.as_view(), name='Telemedicine_vc_data_save_api'),
    path('get_patients_details/<int:agg_sp_pt_id>/', GET_patients_details_Api.as_view(), name='get_patients_details'),
    path('get_caller_details/<int:caller_id>/', GET_Caller_details_Api.as_view(), name='get_caller_details'),
    path('vital_details_update/<int:vital_pk_id>/',Vital_Details_Update_Api.as_view(), name='vital_details_update'),
    
    #==============================Mohin=============================
    
]