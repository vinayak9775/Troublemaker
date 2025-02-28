from django.urls import path
from hhchr.views import * 

urlpatterns=[
    # path('')
#---------------------------------SANDIP working on this api vishal working  on excel ---------------------------------------------

    # path('DayPrint_api/',DayPrint.as_view()),
    path('DayPrint_api/',Dayprint.as_view()),
    path('DayPrint_excel_api/<str:start_date>/<str:end_date>/<int:hosp_id>',DayPrint_excel.as_view()),
    path('Register_professioanl_for_HR/',Register_professioanl_for_HR.as_view()),                           # POST Add new Professional       - Amit - Status - Done 19_09_2024  23_09_2024
    path('Register_professioanl_for_HR/<int:prof_id>/',Register_professioanl_for_HR.as_view()),             # GET Add new Professional Id WIse - Status - Done 19_09_2024 23_09_2024
    path('edit_register_professional/<int:srv_prof_id>/',edit_register_professional_from_hr.as_view()),         # GET and EDIT Add new Professional Id WIse      Amit - Status - Done 20_09_2024 23_09_2024
    path('professional_begining_status/<int:prof_id>/',professional_begining_status_api.as_view()), 
    path('submit_doc_api/',submit_doc_api.as_view()), 


    path('edit/<int:srv_prof_id>/',edit.as_view()), 

#---------------------------------SANDIP working on this api ---------------------------------------------

    path('manage_emp/', Manage_emp.as_view()),                                          # Manage Profiles    Done                                           Amit - Status - Done 19_09_2024
    path('manage_emp_Edit/', Manage_emp_Edit_Views.as_view()),                          #  Manage Profiles Edit view                                        Amit Done
    
    path('InvoiceApi/', InvoiceApi.as_view()),
    path('prof_id_card/', Prof_id_card.as_view()),
    path('prof_int_dtls/', Prof_int_dtls.as_view()),                                                                    # GET Interview schedule                              Amit
    path('interview_status/<int:srv_pro_id>/', interviews_schedule_prof_status_Views.as_view()),    # PUT GET srv_prof_int_id Interview schedule status API                                            Amit
    # path('interview_Rejected/<int:srv_pro_id>/', Our_EMPLOYEE_Active_Inactive_Views.as_view()),       # PUT GET Interview schedule status Rejected Stetus API                   Amit


    path('Selected_cand_ind_Trai_id/<int:srv_prof_id>/', Selected_candidates_ind_Trai_id.as_view()),                                    # PUT GET srv_prof_int_id Selected PUT GET  API 1).Induction. 2).Training. 3)Id Card API                                            Amit

    path('prof_int_dtls_Create_record/', Prof_int_dtls_create_new_R.as_view()),         # POST Interview schedule Half Complete    13-08-2024               Amit
    
    path('prof_doc_dtls/', Prof_doc_dtls.as_view()),
    path('prof_doc_list/', Prof_doc_list.as_view()),
    path('reg_prof_Apiview/<str:clg_ref_id>', Register_prof_int_schedule.as_view()),

#---------------------------------vishal working on this api ---------------------------------------------
    path('qualification_get_api',qualification_get_api.as_view(),name="qualification_get_api"),             #professional qualification get api
    path('qualification_specialization_get_api/<int:qs>',qualification_specialization_get_api.as_view(),name="qualification_specialization_get_api"),
#----------------------------------------------------------------DASHBOARD API'S ---------------------------------------------------------------
    path('Total_employee/<int:da>',Total_employee.as_view(),name="Total_employee"),
    path('male_female_employee/<int:da>',male_female_employee.as_view(),name="male_female_employee"),
    path('new_manpower_status/<int:da>',new_manpower_status.as_view(),name="new_manpower_status"),
    path('post_interview/<int:da>',post_interview.as_view(),name="post_interview"),
    path('onboarding/<int:da>',onboarding.as_view(),name="onboarding"),
    path('employee_roles/<int:da>',employee_roles.as_view(),name="employee_roles"),


# ------------------------------------------------------------------- Amit -------------------------------------------------------------
    path('Our_Employees_List/', Our_EMPLOYEE_List_VIew.as_view()),                                      # Our Employees    10-10-2024                       Amit
    path('Our_Employees_Active_Inactive/<int:srv_pro_id>/', Our_EMPLOYEE_Active_Inactive_Views.as_view()),               # Our Employees Active / Inactive                   Amit

    path('check_file_API_VIew/<int:srv_prof_id>/', check_file_API_VIew.as_view()),                      # Post PUT File API Onboarding - DOCUMENT VERIFICATION - Employees    10-10-2024             Amit
    path('Edit_file_API_VIew/<srv_prof_id>/', Edit_file_API_VIew.as_view()),                            # Put File API Employees                            Amit
    path('Get_Document_list_names/', Get_Document_list_names_VIew.as_view()),                           # Get_Document_list_names    22-08-2024             Amit
    path('external_prof_list/', external_prof_list_Views.as_view()),                                    # external_prof_list    11-11-2024             Amit
    # path('Exter_Prof_Action_Get/<int:srv_prf_id>/', Exter_Prof_Action_Get_Views.as_view()),  # Correct format
    path('Exter_Prof_Action_Get/<int:srv_prf_id>/', external_prof_list_id_wise_Views.as_view(), name='external_prof_action_get'),

    path('Manage_Prof_List_Get/<int:prof_compny>/', Manage_prof_list_Views.as_view(), name='Manage_prof_list'),

    path('prof_interview_round/<int:srv_prof_id>/', prof_interview_round_view.as_view(), name='prof_interview_round'),

    path('Exter_Prof_Action_Delete/<int:srv_prof_id>/', Exter_Prof_Action_Delete_Views.as_view()),
    path('External_prof_Ongoing_Event/<int:prof_compny>/', External_pro_Ongoing_Eve.as_view()), 

    path('External_prof_accept_reject/<int:srv_prof_id>/', exter_prof_aprov_reject_remark_Views.as_view()),   # External Professional Approved/Rejected

    path('hr_Onbording_doj_add/<int:srv_prof>/', hr_Onbording_doj_add_Views.as_view()),   # hr Professional DOJ get and add
    
    path('get_serv_subsrv_prof_paymt/<srv_prof_id>/', get_Prof_Payment_Detail_API.as_view()),
    path('Onboarding_status_bar_API/<srv_prof_id>/', Onboarding_status_bar_API.as_view()),




# Closure Revalidate Amit


    path('Ongoing_Event_Closure_Revalidate/', Closure_Revalidate_Ongoing_Eve.as_view()),    # GET API           changed handel empty fileds and resolved name field error
    path('ServiceCancellationView_Closure_Revalidate/<int:eve_id>/', Closure_Revalidate_ServiceCancellationView.as_view()),     # GET POST API  Corrected to access index 1 
    path('session_cancellation/', SessionCancellationView.as_view()),  
    
    # path('event_wise_job_Closure_Revalidate_dtls/<int:eve_id>/',event_wise_job_Closure_Revalidate_dtls.as_view()),  # GET API     
    path('Medical_job_closure/',Medical_job_Closure_Revalidate.as_view()),  # POST API

    path('datewise_job_closure_Revalidate/',datewise_job_closure_Revalidate_dtls.as_view()),    # GET API       Handeld NUll fields and resolved null fields error 
    path('datewise_job_closure_Revalidate/<str:from_date>/<str:to_date>/',datewise_job_closure_Revalidate_dtls.as_view()),      # GET API   Handeld NUll fields and resolved null fields error 
    path('update_job_closure_form_api/<str:jc_id>/',update_job_closure.as_view()),              # PUT API   
    path('event_wise_job_clouser_dtls/<int:eve_id>/',event_wise_job_clouser_dtls.as_view()),    # Get API       Hnadel ewsolved indux out of range error  

    path('all_dtl_evnts_closure_Revalidate/',all_dtl_evnts_closure_Revalidate.as_view()), # Display All Detailed Events against particular Event            changed ID status wise get 
    path('get_selected_job_Closure_Revalidate_question/<int:eve_id>/', get_selected_job_closure_question.as_view()),  # GET API
    path('get_selected_job_Closure_Revalidate_question/<int:eve_id>/<int:lang_id>', get_selected_job_closure_question.as_view()),   # GET API

    path('job_closure_srv_sess_wise_Closure_Revalidate/<int:srv_prof_id>/<int:dtl_eve_id>/', job_closure_srv_sess_wise_Closure_Revalidate.as_view()),     # GET Form 2 POST add remark and satatus API  changed Creatd GET API
    path('agg_hhc_session_job_closure/',agg_hhc_session_job_closure.as_view()),# Post API to submit job closure as per session  changed                 Create get API  all Form 

    path('agg_hhc_sub_srv_jc_form_num_Closure_Revalidate/',agg_hhc_sub_srv_jc_form_num_Closure_Revalidate.as_view()),# Display the number of form based on sub service      


# Closure Revalidate Amit






    #-----------------------------Mohin--------------------------------------------
    path('add_company/', Add_company_Post_API.as_view(), name='add_company'),
    path('get_company_details/', Get_company_Details_API.as_view(), name='get_company_details'),
    path('update_company_details/<int:pk>/', Update_Company_details_PUT_API.as_view(), name='update_company_details'),
    path('company_status/<int:company_pk_id>/', Company_active_inactive_API.as_view(), name='company_status'),
    path('company_document_get/', Company_Documents_GET_API.as_view(), name='company_document_get'),
    
    
    path('add_proffessional/', Add_Professional_Data_Post_API.as_view(), name='add_proffessional'),
    path('proffessional_documents_get/', Proffessional_Documents_GET_API.as_view(), name='company_document_get'),
    path('professional_is_already_exists/', Professional_Is_Already_Exists_API.as_view(), name='professional_is_already_exists'),
    path('profesional_status/<int:srv_prof_id>/', Profesional_active_inactive_API.as_view(), name='Profesional_active_inactive_API'),
    
    path('get_professional_data_api/', Get_Professional_Data_API.as_view(), name='get_professional_data_api'),
    path('update_professional_data_get/<int:srv_prof_id>/', Update_Professional_Data_Put_API.as_view(), name='update_professional_data_get'),
    
    path('company_get/', Company_Get_API.as_view(), name='company_get'),
    path('clg_is_already_exists/', Clg_Is_Already_Exists_API.as_view(), name='clg_is_already_exists'),
    
    
    

    # path('add_proffessional/', Add_Professional_Data_Post_API.as_view(), name='add_proffessional'),
    # path('company_document_get/', Company_Documents_GET_API.as_view(), name='company_document_get'),








#--------------------------------------------------------------mohin -----------------------------------------------------------------
    # path('add_company/', Add_company_Post_API.as_view(), name='add_company'),
    path('get_company_details/', Get_Company_Details_Get_API.as_view(), name='get_company_details'),



]