from django.urls import path
from hhc_reports.views import *
from hhc_reports.serializers import *
from . import views

urlpatterns = [
    path('eve_report/', EventReportView.as_view(), name='event_repo'),
    path('prof_report/', ProfsReportView.as_view(), name='prof_repo'),
    path('hd_report/',hd_report.as_view()),
    path('service_report/',ServiceReport.as_view()),
    path('consent_report/',ConsentReport.as_view()),
    # ---------- Amit --------------
    # path('consent_doc_sign_View/<int:eveid>/',consent_view_image_Sign.as_view()),
    path('consent_doc_sign_View/<int:eveid>/', ConsentViewImageSign.as_view(), name='consent_doc_sign_view'),    
    # ---------- Amit --------------


    # path('Login_Logout_professionals/',views.Login_Logout_ReportAPIView),
    path('Login_Logout_professionals/',Login_Logout_ReportAPIView.as_view()),
    path('hospital_patient_count_Report/',hospital_patient_count_ReportAPIView.as_view()),

    # path('hospital_patient_count_Report_all/',hospital_patient_all_count.as_view()),
    path('Session_Refound_Amount/',Session_Refound_Amount_api.as_view()),
    path('Job_closure_report/',Job_closure_report_api.as_view()),

    path('Manage_enquiry_Report/',Manage_enquiry_ReportAPIView.as_view()),
    path('consultant_Report_all/',consultant_Report_APIView.as_view()),

    path('Test/',Test_APIView.as_view()),
    path('hospital_wise_session_count/',hospital_wise_session_count.as_view()),
    path('hospital_wise_session_count_excel/<str:start_date>/<str:end_date>/',hospital_wise_session_count_excel.as_view()),
    path('service_count_temp/',service_count_temp.as_view()),
    path('hospital_count_temp/',hospital_count_temp.as_view()),

]
