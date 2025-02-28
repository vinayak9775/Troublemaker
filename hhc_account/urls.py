from django.urls import path
from . import views

urlpatterns=[

# --------------------------------- Vinayak ------------------------------------------
    path('pend_pay_frm_ptn/<str:start_date_str>/<str:end_date_str>',views.pend_pay_frm_ptn.as_view()),
    path('pend_pay_frm_prof/<str:start_date_str>/<str:end_date_str>',views.pend_pay_frm_prof.as_view()),
    path('job_closure_report/<str:start_date_str>/<str:end_date_str>',views.job_closure_report_ptn_wise.as_view()),
    path('job_closure_report_event_wise/<int:eve_id>',views.job_closure_report_event_wise.as_view()),
    path('Service_Wise_Pending_Payment/<str:start_date>/<str:end_date>/<int:hosp_id>',views.Service_Wise_Pending_Payment1.as_view()),
    path('View_professional_unit_report/<int:srv_prof_id>/<str:start_date>/<str:end_date>/',views.View_professional_unit_report.as_view()),
    path('View_professional_unit_report22/<int:srv_prof_id>/<str:start_date>/<str:end_date>/',views.View_professional_unit_report22.as_view()), # export in excel professional unit
    path('job_closure_report_prof_wise/<str:start_date_str>/<str:end_date_str>',views.job_closure_report_prof_wise.as_view()),
    path('job_closure_report_prof_id/<int:prof_id>/<str:start_date_str>/<str:end_date_str>',views.job_closure_report_prof_id.as_view()),


# --------------------------------- Sandip ------------------------------------------
    path('Day_wise_payment_list/',views.Day_wise_payment_list.as_view()),
    path('Service_Wise_Pending_Payment/',views.Service_Wise_Pending_Payment.as_view()),
    path('Manage_Receipt/',views.Manage_Receipt.as_view()),
    path('Manage_professional_unit_report/',views.Manage_professional_unit_report.as_view()),
    # path('View_professional_unit_report/',views.View_professional_unit_report.as_view()),

    
# --------------------------------- Vishal ------------------------------------------
    path('Acutal_salary_professionals/<int:find_id>/',views.Acutal_salary_professionals.as_view()),#1 will for year 2 for date wise
    path('Acutal_salary_professionals/<int:find_id>/<str:start_dat>/<str:end_dat>/',views.Acutal_salary_professionals.as_view()),#1 will for year 2 for date wise
    path('Accout_invoice_api/<int:find_id>/',views.Accout_invoice_api.as_view()),#invoice api for account #1 will for year 2 for date wise
    path('Accout_invoice_api/<int:find_id>/<str:start_dat>/<str:end_dat>/<int:hospt_id>/',views.Accout_invoice_api.as_view()),#1 will for year 2 for date wise
    path('Accout_invoice_excel_api/<int:find_id>/<str:start_dat>/<str:end_dat>/',views.Accout_invoice_excel_api.as_view()),#1 will for year 2 for date wise
    path('Accout_invoice_excel_api/<int:find_id>/<str:start_dat>/<str:end_dat>/<int:hospt_id>/',views.Accout_invoice_excel_api.as_view()),#1 will for year 2 for date wise
    path('check_approval_account/<int:pay_id>/<int:ra>',views.check_approval_account.as_view()),
    # path('amount_with_professional/',views.,amount_with_professional.as_vo)
# __________________________________ Amit Rasale ______________________________________
    path('Pending_UTR_Number_in_Payment_Details_Views/',views. Pending_UTR_Number_in_Payment_Details_Views.as_view()),
    path('Pending_UTR_Number_detail/<int:pay_dt_id>/<int:eve_id>', views.Pending_UTR_Number_in_Payment_Details_POST_Views.as_view(), name='create-payment-detail'),

# __________________________________ Amit Rasale ______________________________________
]