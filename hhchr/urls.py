from django.urls import path
from hhchr.views import * 

urlpatterns=[
    # path('')
#---------------------------------SANDIP working on this api vishal working  on excel ---------------------------------------------


    # path('DayPrint_api/',DayPrint.as_view()),
    path('DayPrint_api/',Dayprint.as_view()),
    path('DayPrint_excel_api/<str:start_date>/<str:end_date>/<int:hosp_id>',DayPrint_excel.as_view()),
    path('Register_professioanl_for_HR/',Register_professioanl_for_HR.as_view()),      
    path('Register_professioanl_for_HR/<int:prof_id>/',Register_professioanl_for_HR.as_view()),
    path('edit_register_professional/<int:prof_id>/',edit_register_professional_from_hr.as_view()),      
    path('professional_begining_status/<int:prof_id>/',professional_begining_status_api.as_view()), 

#---------------------------------SANDIP working on this api ---------------------------------------------
 
    path('manage_emp/', Manage_emp.as_view()),     # Manage Profiles    Done        Amit
    path('manage_emp_Edit/', Manage_emp_Edit_Views.as_view()),     #  Manage Profiles Edit view                     Amit

    path('InvoiceApi/', InvoiceApi.as_view()),
    path('prof_int_dtls/', Prof_int_dtls.as_view()),
    path('prof_doc_dtls/', Prof_doc_dtls.as_view()),
    path('prof_doc_list/', Prof_doc_list.as_view()),
    path('reg_prof_Apiview/<str:clg_ref_id>', Register_prof_int_schedule.as_view()),
#---------------------------------vishal working on this api ---------------------------------------------
    path('qualification_get_api',qualification_get_api.as_view(),name="qualification_get_api"),#professional qualification get api 
    path('qualification_specialization_get_api/<int:qs>',qualification_specialization_get_api.as_view(),name="qualification_specialization_get_api"),
    path('male_female_employee/<int:da>',male_female_employee.as_view(),name="male_female_employee"),
    path('Total_employee/<int:da>',Total_employee.as_view(),name="Total_employee"),
    path('new_manpower_status/<int:da>',new_manpower_status.as_view(),name="new_manpower_status"),
    path('post_interview/<int:da>',post_interview.as_view(),name="post_interview"),
    path('onboarding/<int:da>',onboarding.as_view(),name="onboarding"),
    path('employee_roles/<int:da>',employee_roles.as_view(),name="employee_roles")

]