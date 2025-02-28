from django.contrib import admin
# Register your models here.
from . models import *
from hhcweb.models import agg_com_colleague
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField
#from import_export.admin import ImportExportModelAdmin
# from import_export.admin import ImportExportModelAdmin



# Register your models here.
class UserCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = agg_com_colleague
        fields = ('clg_ref_id', 'clg_first_name', 'clg_mid_name' ,'clg_last_name' ,'grp_id' ,'clg_email' ,'clg_mobile_no' ,'clg_gender' ,'clg_address' ,'clg_is_login' ,'clg_designation' ,'clg_state' ,'clg_division' ,'clg_district' ,'clg_break_type' ,'clg_senior' ,'clg_hos_id' ,'clg_agency_id' ,'clg_status' ,'added_by' ,'last_modified_by' ,'clg_Date_of_birth' ,'clg_Work_phone_number' ,'clg_work_email_id' ,'clg_Emplyee_code' ,'clg_qualification','clg_avaya_agentid' ,'clg_Aadhar_no','clg_specialization', 'clg_profile_photo_path' ,'clg_joining_date' ,'clg_marital_status')

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user



class UserChangeForm(forms.ModelForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    password hash display field.
    """
    # password = ReadOnlyPasswordHashField()

    class Meta:
        model = agg_com_colleague
        fields = '__all__'
        # fields = ('email', 'password','group', 'name','tc', 'is_active', 'is_admin')

    def clean_password(self):
        # Regardless of what the user provides, return the initial value.
        # This is done here, rather than on the field, because the
        # field does not have access to the initial value
        return self.initial["password"]


class UserModelAdmin(BaseUserAdmin):
  # The fields to be used in displaying the User model.
  # These override the definitions on the base UserModelAdmin
  # that reference specific fields on auth.User.
  list_display = ('id', 'is_admin', 'clg_ref_id', 'clg_first_name', 'clg_mid_name' ,'clg_last_name' ,'grp_id' ,'clg_email' ,'clg_mobile_no' ,'clg_gender' ,'clg_address' ,'clg_is_login' ,'clg_designation' ,'clg_state' ,'clg_division' ,'clg_district' ,'clg_break_type' ,'clg_senior' ,'clg_hos_id' ,'clg_agency_id' ,'clg_status' ,'added_by' ,'last_modified_by' ,'clg_Date_of_birth' ,'clg_Work_phone_number' ,'clg_work_email_id' ,'clg_Emplyee_code' ,'clg_qualification','clg_avaya_agentid' ,'clg_Aadhar_no','clg_specialization', 'clg_profile_photo_path' ,'clg_joining_date' ,'clg_marital_status')

  list_filter = ('is_admin',)

  fieldsets = (
      ('User Credentials', {'fields': ('clg_ref_id', 'password')}),
      ('Personal info', {'fields': ('clg_first_name', 'clg_mid_name' ,'clg_last_name' ,'grp_id' ,'clg_email' ,'clg_mobile_no' ,'clg_gender' ,'clg_address' ,'clg_is_login' ,'clg_designation' ,'clg_state' ,'clg_division' ,'clg_district' ,'clg_break_type' ,'clg_senior' ,'clg_hos_id' ,'clg_agency_id' ,'clg_status' ,'added_by' ,'last_modified_by' ,'clg_Date_of_birth' ,'clg_Work_phone_number' ,'clg_work_email_id' ,'clg_Emplyee_code' ,'clg_qualification','clg_avaya_agentid' ,'clg_Aadhar_no','clg_specialization', 'clg_profile_photo_path' ,'clg_joining_date' ,'clg_marital_status')}),
      ('Permissions', {'fields': ('is_admin',)}),
  )
  # add_fieldsets is not a standard ModelAdmin attribute. UserModelAdmin
  # overrides get_fieldsets to use this attribute when creating a user.
  add_fieldsets = (
      (None, {
          'classes': ('wide',),
          'fields': ('clg_ref_id', 'clg_first_name', 'clg_mid_name' ,'clg_last_name' ,'grp_id' ,'clg_email' ,'clg_mobile_no' ,'clg_gender' ,'clg_address' ,'clg_is_login' ,'clg_designation' ,'clg_state' ,'clg_division' ,'clg_district' ,'clg_break_type' ,'clg_senior' ,'clg_hos_id' ,'clg_agency_id' ,'clg_status' ,'added_by' ,'last_modified_by' ,'clg_Date_of_birth' ,'clg_Work_phone_number' ,'clg_work_email_id' ,'clg_Emplyee_code' ,'clg_qualification','clg_avaya_agentid' ,'clg_Aadhar_no','clg_specialization', 'clg_profile_photo_path' ,'clg_joining_date' ,'clg_marital_status', 'password1', 'password2'),
      }),
  )
  search_fields = ('clg_ref_id',)
  ordering = ('clg_ref_id', 'id')
  filter_horizontal = ()






# Register your models here.
admin.site.register(agg_com_colleague, UserModelAdmin)
admin.site.register(agg_mas_group)
admin.site.register(agg_hhc_patient_list_enquiry)#1
admin.site.register(agg_hhc_assessment_patient)#2
admin.site.register(agg_hhc_assessment_patient_details)#3
admin.site.register(agg_hhc_assessment_patient_list)#4
admin.site.register(agg_hhc_patients)#6
# @admin.register(agg_hhc_patients)
# class userdataa(ImportExportModelAdmin):
#     pass
#admin.site.register(agg_hhc_webinar_patient_table)#7
admin.site.register(agg_hhc_detailed_event_plan_of_care)#8
admin.site.register(agg_hhc_events)#9
admin.site.register(agg_hhc_event_consultant_call)#10
admin.site.register(agg_hhc_event_doctor_mapping)#11
admin.site.register(agg_hhc_event_follow_up)#12
admin.site.register(agg_hhc_event_job_summary)#13
admin.site.register(agg_hhc_event_other_call)#14
admin.site.register(agg_hhc_event_plan_of_care)#15
admin.site.register(agg_hhc_event_professional)#16
# admin.site.register(agg_hhc_event_requirements)#17
admin.site.register(agg_hhc_event_share_hcm)#18
admin.site.register(agg_hhc_log_for_event)#19
admin.site.register(agg_hhc_caller_relation)#21
admin.site.register(agg_hhc_conference_call)#22
admin.site.register(agg_hhc_sp_incoming_call)#23
admin.site.register(agg_hhc_outgoing_call)#24
#class admin_agg_hhc_purpose_call(admin.ModelAdmin):#25
#    list_display=['name','status']
admin.site.register(agg_hhc_purpose_call)#25admin.site.register(agg_hhc_purpose_call,admin_agg_hhc_purpose_call)
admin.site.register(agg_hhc_extend_service)#26
admin.site.register(agg_hhc_no_reason_for_service)#27
admin.site.register(agg_hhc_professional_services)#28
admin.site.register(agg_hhc_professional_sub_services)#29
admin.site.register(agg_hhc_services)#30
admin.site.register(agg_hhc_service_membership_registration)#31
admin.site.register(agg_hhc_service_professionals)#32

# @admin.register(agg_hhc_service_professionals)
# class AggHhcServiceProfessionalsAdmin(ImportExportModelAdmin):
    # pass

admin.site.register(agg_hhc_service_professional_details)#33
admin.site.register(agg_hhc_sub_services)#34
admin.site.register(agg_hhc_jobclosure_detail)#35
#admin.site.register(agg_hhc_jobclosure_detail_datewise_old)#36
admin.site.register(agg_hhc_job_closure)#37
admin.site.register(agg_hhc_job_closure_consumption_mapping)#38                         
admin.site.register(agg_hhc_assisted_living_schedule)#44
admin.site.register(agg_hhc_membership_schedule_detail)#45
admin.site.register(agg_hhc_professional_scheduled)#46
admin.site.register(agg_hhc_reschedule_session)#47
admin.site.register(agg_hhc_payments_received_by_professional)#48
admin.site.register(agg_hhc_professional_availability)#49
admin.site.register(agg_hhc_professional_availability_detail)#50
admin.site.register(agg_hhc_professional_locations_as_per_zones)#50
admin.site.register(agg_hhc_professional_device_info)#51
admin.site.register(agg_hhc_professional_documents)#52
admin.site.register(agg_hhc_professional_zone)#53
admin.site.register(agg_hhc_professional_location)#53
admin.site.register(agg_hhc_professional_location_details)#54
admin.site.register(agg_hhc_professional_location_preferences)#55
admin.site.register(agg_hhc_professional_media)#56
admin.site.register(agg_hhc_professional_notification)#57
admin.site.register(agg_hhc_professional_password)#58
admin.site.register(agg_hhc_professional_weekoff)#59
admin.site.register(agg_hhc_admin_users)#60
admin.site.register(agg_hhc_admin_users_modules)#61
admin.site.register(agg_hhc_admin_user_hospital_mapping)#62
admin.site.register(agg_hhc_assisted_living_booking)#63
admin.site.register(agg_hhc_attendance)#64
admin.site.register(agg_hhc_attendance_details)#64
admin.site.register(agg_hhc_avaya_extensions)#65
admin.site.register(agg_hhc_bank_details)#66
admin.site.register(agg_hhc_cancellation_history)#67
admin.site.register(agg_hhc_change_status)#68
admin.site.register(agg_hhc_cheque_images)#69
admin.site.register(agg_hhc_city)#70
admin.site.register(agg_hhc_consent_agree_form)#71
admin.site.register(agg_hhc_consumables)#72
admin.site.register(agg_hhc_content)#73
admin.site.register(agg_hhc_dash_count_details)#74
admin.site.register(agg_hhc_device_version_info)#75
admin.site.register(agg_hhc_doctors_consultants)#76
admin.site.register(agg_hhc_documents_list)#77
admin.site.register(agg_hhc_doc_con)#78
admin.site.register(agg_hhc_employees)#79
admin.site.register(agg_hhc_emp_spero)#80
admin.site.register(agg_hhc_enquiry_follow_up)#81
admin.site.register(agg_hhc_enquiry_requirements)#82
admin.site.register(agg_hhc_hospitals)#83
admin.site.register(agg_hhc_hospital_ips)#84
admin.site.register(agg_hhc_knowledge_base_documents)#85
admin.site.register(agg_hhc_locations)#86
admin.site.register(agg_hhc_log_location_for_session)#87
admin.site.register(agg_hhc_manager_spero)#88
#admin.site.register()#89
#admin.site.register()#90
admin.site.register(agg_hhc_modules)#91
admin.site.register(agg_hhc_ongoing_remark_history)#92
admin.site.register(agg_hhc_payments)#93
admin.site.register(agg_hhc_payment_details)#94
#admin.site.register()#95
#admin.site.register()#96
#admin.site.register()#97
admin.site.register(agg_hhc_restriction_for_session_complete)#98
admin.site.register(agg_hhc_session)#99
admin.site.register(agg_hhc_sms_response)#100
admin.site.register(agg_hhc_source_of_enquiry)#101
admin.site.register(agg_hhc_specialty)#102
admin.site.register(agg_hhc_tc_examination)#103
admin.site.register(agg_hhc_teleconsultation_enquiry)#104
admin.site.register(agg_hhc_user_activity)#105
admin.site.register(agg_hhc_vc_diagnosis)#106
admin.site.register(agg_hhc_vc_fam_his)#107
admin.site.register(agg_hhc_vc_investigation)#108
admin.site.register(agg_hhc_vc_med_his)#109
admin.site.register(sp_vc_prescription)#110
admin.site.register(agg_hhc_video_consulting)#111
admin.site.register(agg_hhc_gender)#112
admin.site.register(agg_hhc_pincode)
admin.site.register(agg_hhc_enquiry_follow_up_cancellation_reason)
admin.site.register(agg_hhc_coupon_codes)
admin.site.register(agg_hhc_Professional_app_feedback)
# admin.site.register(agg_hhc_questions)
# admin.site.register(agg_hhc_service_closure_questions)
# admin.site.register(agg_hhc_cancellation_request)
admin.site.register(agg_hhc_cancellation_and_reschedule_request)
admin.site.register(agg_hhc_jobclosure_form_numbering)
admin.site.register(agg_hhc_transport)
admin.site.register(DeviceToken)
admin.site.register(NotificationList)
admin.site.register(Professional_notification)
admin.site.register(agg_hhc_professional_Denial_reason_list)
admin.site.register(agg_hhc_professional_Denial_reason)
admin.site.register(agg_hhc_prof_interview_details)
admin.site.register(agg_hhc_concent_form_details)
admin.site.register(DischargeFile)
admin.site.register(professional_call_back)
admin.site.register(SMS_sent_details)
admin.site.register(cancelation_charges)
admin.site.register(sos_details)
admin.site.register(agg_hhc_event_plan_of_care_history_tracker)
admin.site.register(agg_hhc_patient_documents)
admin.site.register(FeedBack_Questions)
admin.site.register(permission)
admin.site.register(Permission_module)
admin.site.register(agg_save_permissions)
admin.site.register(agg_Add_inventory)
admin.site.register(agg_hhc_job_closure_questions)
admin.site.register(qualifications)
admin.site.register(qualification_specialization)
admin.site.register(dash_complaint_feedback_counts)
# admin.site.register(agg_hhc_feedback_media_note)
admin.site.register(Android_updates)
admin.site.register(ems_colleague_login_logout_info)
admin.site.register(agg_hhc_service_follow_up)
admin.site.register(HeplFiles)
admin.site.register(Multiple_utr)