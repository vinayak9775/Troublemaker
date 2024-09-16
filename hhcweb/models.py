from django.db import models
from django_enumfield import enum
from rest_framework import status
from datetime import date
from django.http import Http404
from django.utils import timezone
import datetime
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import(
	BaseUserManager,AbstractBaseUser
)
# Create your models here.
class cheque_approval_enum(enum.Enum):
	pending=1
	approved=2
	rejected=3

class truefalse_enum(enum.Enum):
    true=1
    false=2
class cancel_from(enum.Enum):
	Cancel_By_Spero=1
	Cancel_By_Patient=2
	Cancel_By_professional=3
	
class enquiry_from_enum(enum.Enum):
	website = 1
	application = 2
	consultant = 3
	Oncall = 4
	__default__ = website

class enquiry_status(enum.Enum):
	Follow_up_pending = 2
	Follow_up_Reschedule = 4
	Converted_Into_service = 3
	Cancelled_Enquiry = 1
	__default__= 2

class Title(enum.Enum):      # Added by mayank
	DR = 1
	MR = 2
	MRS = 3	


class transport_charges(enum.Enum):
	yes=1
	no=2



class sms_type(enum.Enum): 
	Enquiry = 1
	Concent_form = 2
	otp = 3
	cf_payment = 4
	
	
class Transport_type(enum.Enum):
	public=1
	private=2

class vehicle_type(enum.Enum):
	car=1
	bike=2
	buss=3
	metro=4
	Auto=5
	Train=6

class is_srv_sesn(enum.Enum):      # Added by Vinayak
	Service = 1
	Session = 2
	Professional = 3
	
 
class approve_status(enum.Enum):
	Approved = 1
	Not_Approved = 2
	Approve_from_manager_side = 3
	__default__ = Approved
	

class mode_of_srv(enum.Enum):      # Added by Vinayak
	Employment = 1
	Consultant = 2
	

class Professional_status(enum.Enum):  # Added by Vinayak
	Info_Submitted = 1
	In_process_with_HR = 2
	Interview_schedule = 3
	On_Board = 4
	Document_varified = 5



class relations_professional(enum.Enum): # Added by Vinayak
	Spouse = 1
	Wife = 2 
	Father = 3 
	Mother = 4
	Grand_Father = 5
	Grand_Mother = 6
	Sister = 7
	Brother = 8
	Relative = 9
	Friend = 10
	Child = 11
	Other = 12
	
	

class Education_level(enum.Enum):  # Added by Vinayak
	Tenthpass = 0
	Twelthpass = 1
	Highschool = 2
	Diploma = 3
	Bachelor = 4
	Master= 5
	Doctorate= 6

class JOB_type(enum.Enum):         # Added by mayank
	ONCALL = 1
	FULLTIME = 2
	PARTTIME= 3

class active_inactive_enum(enum.Enum):
    Active=1
    Inactive=2

class Treatmet_Type_enum(enum.Enum):
	Sergery = 1
	Medicine = 2
	__default__ = Sergery


class int_status_enum(enum.Enum):
	Select = 1
	Reject = 2
	OnHold = 3
	Pending = 4
	Shortlisted = 5

	__default__ = 3

class status_enum(enum.Enum):
	Active = 1
	Inactive = 2
	Delete = 3
	__default__ = Active

class feedback_question(enum.Enum):
	patient = 1
	professional = 2 
	

class action_enum(enum.Enum):
	Pending = 1
	Completed = 2
	__default__ = Pending

class enq_spero_srv_status_enum(enum.Enum):
	Converted_to_Srvice = 1
	Spero_service = 2
	Enquiry = 3


class job_cl_ques_type(enum.Enum):
	Spero_service = 1
	Enquiry = 2

class valid_event_enum(enum.Enum):
	Not_allocated_Professional = 1
	Allocated_Professional = 2
	Closure_completed = 3 
	Incomplete_info=4

class service_status_enum1(enum.Enum):
	Service_about_to_end = 1
	Acknowledge_pending = 2
	Acknowledge_by_professional = 3
	Closure_completed = 4
	Pending_for_closure = 5

class level(enum.Enum):
    Primary = 0
    Secondary = 1
	
class yes_no_enum(enum.Enum):
	yes = 1
	no = 2
class yes_no_enum2(enum.Enum): # Nikita P
	yes = 1
	no = 2
	__default__ = no

class professional_request_status(enum.Enum): # Vinayak
	Approve = 1
	Rejected = 2
	Pending = 3 
	__default__ = Pending


class last_modified_by_enum(enum.Enum):
	System = 1
	App = 2

class Session_status_enum(enum.Enum):
	Pending = 1
	Completed = 2
	Upcoming =3
	No_show_by_Patient = 4
	No_show_by_Professional = 5
	Closed = 6
	Enroute = 7
	Started_Session = 8
	Completed_Session = 9
	session_not_done=10#added by vishal and python team. we have to do auto update from this enum 

	__default__ = Pending

class Reason_for_no_serivce_enum(enum.Enum):
	Session_added = 1
	Patient_Hospitalized = 2
	Patient_Death =3
	Other = 4

class enquiry_status_enum(enum.Enum):
	Enquiry_received = 1
	Called_back = 2
	Confirm =3
	Cancel = 4

class discount_type_enum(enum.Enum):
	In_Percentage = 1
	In_amount = 2
	complimentary =3
	VIP = 4
	No_discount = 5
	__default__ = No_discount

   
class estimate_cost_enum(enum.Enum):
	not_set = 1
	No = 2
	Yes =3

class Payment_type_enum(enum.Enum):
	
	Online = 1
	Offline = 2

class int_mode_enum(enum.Enum):
    Online = 1
    Offline = 2

class types_enum(enum.Enum):
	Family_doctors = 1
	Consultant = 2

class reporting_by_enum(enum.Enum):
	SMS = 1
	Email = 2
	PhoneCall =3

class Role_id_enum(enum.Enum):
	Professional = 1
	Admin = 2

class cl_status_enum(enum.Enum):
	Incoming = 1
	Disconnect = 2

class srv_status_enum(enum.Enum):
	Confirmed = 1
	Enquiry = 2

class professional_type_enum(enum.Enum):
	Professional = 1
	Vender = 2

class flag_enum(enum.Enum):
	HD_systems = 1
	Mobile_App = 2
	__default__ = HD_systems

class Tf_enum(enum.Enum):
	HD_systems = 1
	Mobile_App = 2
	__default__ = HD_systems

class package_status_enum(enum.Enum):
	Servcie = 1
	Package = 2

class pt_gender_enum(enum.Enum):
	No_prefrence = 3
	Male = 1
	Female = 2
	

class reg_status_enum(enum.Enum):
	registration = 1
	Reject = 2
	Accept = 3

class reference_type_enum(enum.Enum):
	Professional = 1
	Vender = 2

class set_location_enum(enum.Enum):
	home_locatoin = 1
	work_location = 2

class document_status_enum(enum.Enum):
	Verified = 1
	need_more_details = 2
	Rejected = 3
	In_Progress = 4

class reg_source_enum(enum.Enum):
	System = 1
	App = 2

class skin_perfusion_enum(enum.Enum):
	NA = 1
	Normal = 2
	Abnormal = 3

class airway_enum(enum.Enum):
	NA = 1
	Open = 2
	Closed = 3

class breathing_enum(enum.Enum):
	NA = 1
	Present = 2
	Compromised = 3
	Absent = 4

class circulation_enum(enum.Enum):
	NA = 1
	Radial = 2
	Present = 3
	Absent = 4

class baseline_enum(enum.Enum):
	NA = 1
	A = 2
	V = 3
	P = 4
	U = 5

class consumption_type_enum(enum.Enum):
	unitmedicine = 1
	nonunitmedicine = 2
	unitconsumable = 3
	nonunitconsumble = 4

class user_type_enum(enum.Enum):
	dcm = 1
	hd = 2
	caller = 3

class option_type_enum(enum.Enum):
	Text = 1
	Radio = 2
	Checkbox = 3
	Rating = 4

class professional_types_enum(enum.Enum):
	Professional = 1
	Patient = 2

class acceptance_status_enum(enum.Enum):
	Pending = 1
	Accepted = 2
	Rejected = 3

class user_types_enum(enum.Enum):
	Professional = 1
	HD_User = 2

class payment_status_enum(enum.Enum):
	Amount_With_Profesional = 1
	Amount_paid_to_spero = 2
	Amount_paid_from_Desk = 3
	__default__ = Amount_paid_from_Desk

class Payment_mode_enum(enum.Enum):
	Cash = 1
	Cheque = 2
	Online = 3
	Card = 4
	qr_code = 5
	NEFT = 6

class OTP_verifivation_enum(enum.Enum):
	Verified = 1
	Not_Verified = 2


class caller_status_enum(enum.Enum):
	mobile=1
	website=2
	walking=3
	calling=4

class service_status_enum(enum.Enum):
	Pending = 1
	Ongoing = 2
	Completed = 3
	terminated = 4
	__default__= Ongoing

#-------------------------------sandip shimpi-------------------------------
class refer_by_enum(enum.Enum):
	Self = 1
	Hospital = 2
	Other = 3

class patient_present_at_enum(enum.Enum):
	Home = 1
	Hospital = 2

class patient_richedBy_status_enum(enum.Enum):
	mobile=1
	website=2
	walking=3
	calling=4

class Professional_status(enum.Enum):
	Info_Submitted = 1
	In_process_with_HR = 2
	Interview_schedule = 3
	On_Board = 4
	Document_varified = 5

class Education_level(enum.Enum):
    Tenthpass = 0
    Twelthpass = 1
    Highschool = 2
    Diploma = 3
    Bachelor = 4
    Master= 5
    Doctorate= 6

class Designation(enum.Enum):     # Added by mayank
    NURSE = 1
    DOCTOR = 2
    Healthcare_Attendant = 3
    Physician_Assistant = 4
    Physiotherapiest = 5
    X_Ray_Technician = 6
    Uro_Technician = 7


# --------------------------------Amit Rasale-----------------------------
class follow_up_cancel_by(models.TextChoices):
    From_Spero 		= 1
    From_Patient   	= 2
    Other      		= 3
    

class follow_up(models.TextChoices):
    Follow_up_Reschedule = 1
    Cancel = 2
    Create_Service = 3
    follow_up_pending = 4
    ongoing = 5
	
	
    __deafult__ = follow_up_pending
	
# ------------------------------------------------------------------------

class prof_enum(enum.Enum): 
    Pending=1
    Accepted=2
    Rejected=3
    Expired=4

class Package_status_enum(enum.Enum):
    Servcie=1
    Package=2

class flag_enum(enum.Enum):
    HD_systems=1
    Mobile_App=2

class is_delet_enum(enum.Enum):
    No=1
    Yes=2

	

class active_enum(enum.Enum):
	Active=0
	
class type_enum(enum.Enum):
    Doctor=1
    Consultant=2

class consultant_status_enum(enum.Enum):
    Active=1
    Inactive=2
    Delete=3
    Pending=4
    __default__=Active

class documents_enum(enum.Enum):
	Verified=1
	need_more_details=2
	Rejected=3
	In_Progress=4
	__default__ = In_Progress
	
class truefalse_enum(enum.Enum):
    true=1
    false=2

class pic_enum(enum.Enum):
    Photo=1
    Video=2
class Leave_Conflit_enum(enum.Enum):
    Conflit=1
    Not_conflite=2

class Leave_status_enum(enum.Enum):
    Applied=1
    Approve=2
    pending=3
    Rejected=4
    Cancle=5
class desk_type_enum(enum.Enum):
    SuperAdmin=1
    Admin=2
    HRManager=3
class patient_bed_location_enum(enum.Enum):
    hall1=1
    hall2=2
    bedroom1=3
    bedroom2=4

class Facility_type_enum(enum.Enum):
    Day_care=1
    Reguler=2
    Luxury=3

class consumable_type_enum(enum.Enum):
    Unit=1
    NonUnit=2

class content_type_enum(enum.Enum):
    header=1
    footer=2

class employee_type_enum(enum.Enum):
    HCM=1
    HD=2
    Accountant=3
    Office_Assistant=4
    Trainer=5
    Hospital=6
    dashbaord=7
    caller = 8

class event_by_professional_enum(enum.Enum):
    Started_Route=1
    Started_Session=2
    Completed_Session=3

class Add_through_enum(enum.Enum):
    HD=1
    Professional=2
    Community_App=3

class Pause_Ready_enum(enum.Enum):
    Pause=1
    Ready=2
class session_status_enum(enum.Enum):
    Active=1
    inactive=2
    Device_removed=3

class reciver_enum(enum.Enum):
    Patient=1
    Prof=2
    Consultant=3
    Caller=4

class user_admin_enum(enum.Enum):
    User=1
    Admin=2

class added_by_type_enum(enum.Enum):
    Employee=1
    Professional=2
    Admin=3


# ------------------------------------------ Nikita P----------------------------------------------

class baseline_enum(enum.Enum):
	A=1
	V=2
	P=3
	U=4
class airway_enum(enum.Enum):
    Open=1
    Close=2
class breathing_enum(enum.Enum):
	Present=1
	Comprom=2
	Absent=3

class Circulation_enum(enum.Enum):
	Radial=1
	Present=2
	Absent=3

class Skin_Perfusion_enum(enum.Enum):
	Normal=1
	Abnormal=2

class Wound_enum(enum.Enum):
	Healthy=1
	Unhealthy=2

class Oozing_enum(enum.Enum):
	Present=1
	Absent=2
	

class Discharge_enum(enum.Enum):
	Serous=1
	Serosqnguinous=2
	Sanguinous=3
	Purulent=4

class Inj_site_IM_enum(enum.Enum):
	Gluteal=1
	Deltoid=2

class Procedure_enum(enum.Enum):
	Eventful=1
	Uneventful=2

class Dressing_enum(enum.Enum):
	Healing=1
	Non_healing=2

class Catheter_enum(enum.Enum):
	Silicon=1
	Simple=2
class Sutures_enum(enum.Enum):
	Sutures=1
	Staples=2

class online_payment_by(enum.Enum):
	by_card=1
	by_upi=2

class prof_role_enum(enum.Enum):
	Professional=1
	Vendor=2
class fileType(enum.Enum):
	video=1
	doc=2
	image=3
	pdf=4

# -------------------------------------------------Tables--------------------------------------------------



class agg_hhc_callers(models.Model):#113 this table is used for app register user as well as for web caller register
	caller_id=models.AutoField(primary_key=True)
	clg_ref_id=models.ForeignKey('agg_com_colleague',on_delete=models.CASCADE,null=True,to_field="clg_ref_id")
	phone=models.BigIntegerField(unique = True,null=True)#this will used to store otp
	otp=models.IntegerField(null=True)
	otp_expire_time=models.DateTimeField(null=True)
	caller_fullname=models.CharField(max_length=50,null=True)
	# lname=models.CharField(max_length=50,null=True)
	purp_call_id = models.ForeignKey('agg_hhc_purpose_call',on_delete=models.CASCADE,null=True)
	Age=models.IntegerField(null=True)
	gender=models.ForeignKey('agg_hhc_gender',on_delete=models.CASCADE,null=True)
	email=models.EmailField(null=True)
	# contact_no=models.BigIntegerField(null=True)
	alter_contact=models.BigIntegerField(null=True)
	Address=models.CharField(max_length=900,null=True)
	city = models.ForeignKey("agg_hhc_city",on_delete=models.CASCADE,null=True)
	locality = models.CharField(max_length=900, null=True)
	state = models.ForeignKey("agg_hhc_state",on_delete=models.CASCADE,null=True)
	pincode = models.CharField(max_length=250, null=True,blank=True)
	# save_this_add=models.CharField(max_length=50,null=True)
	emp_id=models.BigIntegerField(null=True)
	profile_pic=models.FileField(upload_to='community_profile/',null=True)# profile picture
	status=enum.EnumField(status_enum,null=True)
	service_taken=enum.EnumField(yes_no_enum2)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
	#caller_status=enum.EnumField(caller_status_enum,null=True)
	# def __str__(self):
	# 	return f"{self.caller_id},{self.caller_fullname}"
	def save(self, *args, **kwargs):
		if not self.caller_id:
			self.added_by=self.last_modified_by
		super().save(*args, **kwargs)


class agg_hhc_patient_list_enquiry(models.Model):#1  demos
	pt_id = models.AutoField(primary_key = True)
	doct_cons_id = models.ForeignKey('agg_hhc_doctors_consultants',on_delete=models.CASCADE,null=True)
	# consultat_fname = models.CharField(max_length=50,null=True)
	caller_id=models.ForeignKey(agg_hhc_callers,on_delete=models.CASCADE,null=True)
	# hhc_code = models.CharField(max_length=50,null=True, blank=True)
	# eve_id = models.ForeignKey('agg_hhc_events',to_field='eve_id', on_delete=models.CASCADE,null=True)
	name = models.CharField(max_length=50,null=True)
	phone_no = models.CharField(max_length=20,null=True)
	call_type=models.CharField(max_length=50,null=True)
	relation = models.CharField(max_length=20,null=True)
	preferred_hosp_id=models.ForeignKey('agg_hhc_hospitals',on_delete=models.CASCADE,null=True)# Sandip
	# patient_fname = models.CharField(max_length=50,null=True)
	Age = models.CharField(max_length=2,null=True)
	patient_date_of_birth=models.DateField(null=True)
	gender_id = models.ForeignKey('agg_hhc_gender',on_delete=models.CASCADE,null=True)
	Suffered_from=models.CharField(max_length=200,null=True)
	hospital_name=models.CharField(max_length=150,null=True)
	patient_add = models.CharField(max_length=200,null=True)
	google_location = models.CharField(max_length=200,null=True)
	patient_Locality=models.CharField(max_length=250,null=True)
	patient_contact = models.CharField(max_length=10,null=True)
	patient_email_id = models.EmailField(null=True)
	srv_id=models.ForeignKey('agg_hhc_services',on_delete=models.CASCADE,null=True)#added by vishal
	Patient_status_at_present=enum.EnumField(patient_present_at_enum,null=True)#added by vishal
	# enq_follow_up_id = models.ForeignKey('agg_hhc_enquiry_follow_up',on_delete=models.CASCADE,null=True)    # AMIT
	# sub_service = models.CharField(max_length=11,null=True)
	Start_Date_and_Time=models.DateTimeField(null=True)
	# End_Date_and_Time=models.DateTimeField(null=True)
	# Professional_Preferred=models.CharField(max_length=100,null=True)
	# note = models.CharField(max_length=50,null=True)
	enquiry_status = models.CharField(max_length=2,null=True)
	enquiry_from = enum.EnumField(enquiry_from_enum,null=True)
	address = models.CharField(max_length=500,null=True)
	city_id = models.ForeignKey('agg_hhc_city',on_delete=models.CASCADE,null=True)   	#sandip
	state_id=models.ForeignKey('agg_hhc_state',on_delete=models.CASCADE,null=True)		#sandip
	pincode = models.CharField(max_length=10,null=True,blank=True)		#sandip
	refer_by = enum.EnumField(refer_by_enum,null=True)  #sandip
	sub_location = models.CharField(max_length=50,null=True)
	prof_zone_id = models.ForeignKey('agg_hhc_professional_zone',on_delete=models.CASCADE,null=True)   #Amit
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
	def save(self, *args, **kwargs):
		if not self.pt_id:
			self.added_by=self.last_modified_by
		super().save(*args, **kwargs)


class agg_hhc_assessment_patient(models.Model):#2
	ass_pt_id = models.AutoField(primary_key = True)
	ass_pt_li_id = models.BigIntegerField(null=True)
	haemodynamics_day1ass = models.CharField(max_length=2,null=True)
	haemodynamics_day2ass = models.CharField(max_length=2,null=True)
	haemodynamics_day3ass = models.CharField(max_length=2,null=True)
	haemodynamics_day4ass = models.CharField(max_length=2,null=True)
	haemodynamics_remark = models.CharField(max_length=50,null=True)
	BP_Day1 = models.CharField(max_length=1,null=True)
	BP_Day2 = models.CharField(max_length=1,null=True)
	BP_Day3 = models.CharField(max_length=1,null=True)
	BP_Day4 = models.CharField(max_length=1,null=True)
	PULSE_Day1 = models.CharField(max_length=1,null=True)
	PULSE_Day2 = models.CharField(max_length=1,null=True)
	PULSE_Day3 = models.CharField(max_length=1,null=True)
	PULSE_Day4 = models.CharField(max_length=1,null=True)
	SPO2_Day1 = models.IntegerField(null=True)
	SPO2_Day2 = models.CharField(max_length=1,null=True)
	SPO2_Day3 = models.CharField(max_length=1,null=True)
	SPO2_Day4 = models.CharField(max_length=1,null=True)
	UO_Day1 = models.CharField(max_length=1,null=True)
	UO_Day2 = models.CharField(max_length=1,null=True)
	UO_Day3 = models.CharField(max_length=1,null=True)
	UO_Day4 = models.CharField(max_length=1,null=True)
	Temp_Day1 = models.CharField(max_length=1,null=True)
	Temp_Day2 = models.CharField(max_length=1,null=True)
	Temp_Day3 = models.CharField(max_length=1,null=True)
	Temp_Day4 = models.CharField(max_length=1,null=True)
	BSL_Day1 = models.CharField(max_length=1,null=True)
	BSL_Day2 = models.CharField(max_length=1,null=True)
	BSL_Day3 = models.CharField(max_length=1,null=True)
	BSL_Day4 = models.CharField(max_length=1,null=True)
	Total_Day1 = models.CharField(max_length=1,null=True)
	Total_Day2 = models.CharField(max_length=1,null=True)
	Total_Day3 = models.CharField(max_length=1,null=True)
	Total_Day4 = models.CharField(max_length=1,null=True)
	necessary_Invest_before_initiating_HHC = models.CharField(max_length=50,null=True)
	milestone_before_initiating_HHC = models.CharField(max_length=50,null=True)
	discharge_homecare = models.CharField(max_length=5,null=True)
	# TreatmentType = enum.EnumField(TreatmentType_enum,null=True)
	hosp_id = models.CharField(max_length=1,null=True)
	emp_id = models.CharField(max_length=1,null=True)
	# status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
	def save(self, *args, **kwargs):
		if not self.ass_pt_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
	

class agg_hhc_assessment_patient_details(models.Model):#3
	agg_sp_ass_pt_dt_id = models.AutoField(primary_key = True)
	ass_pt_li_id = models.BigIntegerField(null=True)
	ass_pt_id = models.BigIntegerField(null=True)
	mental_day1ass = models.CharField(max_length=3,null=True)
	mental_day2ass = models.CharField(max_length=3,null=True)
	mental_day3ass = models.CharField(max_length=3,null=True)
	mental_day4ass = models.CharField(max_length=3,null=True)
	altered_consciousness_comatose_day1 = models.CharField(max_length=3,null=True)
	altered_consciousness_comatose_day2 = models.CharField(max_length=3,null=True)
	altered_consciousness_comatose_day3 = models.CharField(max_length=3,null=True)
	altered_consciousness_comatose_day4 = models.CharField(max_length=3,null=True)
	altered_consciousness_comatose_remark = models.CharField(max_length=20,null=True)
	Conscious_day1 = models.CharField(max_length=3,null=True)
	Conscious_day2 = models.CharField(max_length=3,null=True)
	Conscious_day3 = models.CharField(max_length=3,null=True)
	Conscious_day4 = models.CharField(max_length=3,null=True)
	Conscious_remark = models.CharField(max_length=20,null=True)
	ventilator_day1 = models.CharField(max_length=3,null=True)
	ventilator_day2 = models.CharField(max_length=3,null=True)
	ventilator_day3 = models.CharField(max_length=3,null=True)
	ventilator_day4 = models.CharField(max_length=3,null=True)
	ventilator_remark = models.CharField(max_length=30,null=True)
	O2_day1 = models.CharField(max_length=3,null=True)
	O2_day2 = models.CharField(max_length=3,null=True)
	O2_day3 = models.CharField(max_length=3,null=True)
	O2_day4 = models.CharField(max_length=3,null=True)
	O2_remark = models.CharField(max_length=30,null=True)
	RT_day1 = models.CharField(max_length=3,null=True)
	RT_day2 = models.CharField(max_length=3,null=True)
	RT_day3 = models.CharField(max_length=3,null=True)
	RT_day4 = models.CharField(max_length=3,null=True)
	RT_remark = models.CharField(max_length=30,null=True)
	Drain_day1 = models.CharField(max_length=3,null=True)
	Drain_day2 = models.CharField(max_length=3,null=True)
	Drain_day3 = models.CharField(max_length=3,null=True)
	Drain_day4 = models.CharField(max_length=3,null=True)
	Drain_remark = models.CharField(max_length=30,null=True)
	ICD_day1 = models.CharField(max_length=3,null=True)
	ICD_day2 = models.CharField(max_length=3,null=True)
	ICD_day3 = models.CharField(max_length=3,null=True)
	ICD_day4 = models.CharField(max_length=3,null=True)
	ICD_remark = models.CharField(max_length=30,null=True)
	Colostomy_Enterostomy_day1 = models.CharField(max_length=3,null=True)
	Colostomy_Enterostomy_day2 = models.CharField(max_length=3,null=True)
	Colostomy_Enterostomy_day3 = models.CharField(max_length=3,null=True)
	Colostomy_Enterostomy_day4 = models.CharField(max_length=3,null=True)
	Colostomy_Enterostomy_remark = models.CharField(max_length=30,null=True)
	PEG_day1 = models.CharField(max_length=3,null=True)
	PEG_day2 = models.CharField(max_length=3,null=True)
	PEG_day3 = models.CharField(max_length=3,null=True)
	PEG_day4 = models.CharField(max_length=3,null=True)
	PEG_remark = models.CharField(max_length=30,null=True)
	Dressing_day1 = models.CharField(max_length=3,null=True)
	Dressing_day2 = models.CharField(max_length=3,null=True)
	Dressing_day3 = models.CharField(max_length=3,null=True)
	Dressing_day4 = models.CharField(max_length=3,null=True)
	Dressing_remark = models.CharField(max_length=30,null=True)
	Dressing_large_day1 = models.CharField(max_length=3,null=True)
	Dressing_large_day2 = models.CharField(max_length=3,null=True)
	Dressing_large_day3 = models.CharField(max_length=3,null=True)
	Dressing_large_day4 = models.CharField(max_length=3,null=True)
	Dressing_medium_day1 = models.CharField(max_length=3,null=True)
	Dressing_medium_day2 = models.CharField(max_length=3,null=True)
	Dressing_medium_day3 = models.CharField(max_length=3,null=True)
	Dressing_medium_day4 = models.CharField(max_length=3,null=True)
	Dressing_small_day1 = models.CharField(max_length=3,null=True)
	Dressing_small_day2 = models.CharField(max_length=3,null=True)
	Dressing_small_day3 = models.CharField(max_length=3,null=True)
	Dressing_small_day4 = models.CharField(max_length=3,null=True)
	Bedsorecare_day1 = models.CharField(max_length=3,null=True)
	Bedsorecare_day2 = models.CharField(max_length=3,null=True)
	Bedsorecare_day3 = models.CharField(max_length=3,null=True)
	Bedsorecare_day4 = models.CharField(max_length=3,null=True)
	Bedsorecare_remark = models.CharField(max_length=30,null=True)
	BedsorecareLarge_day1 = models.CharField(max_length=3,null=True)
	BedsorecareLarge_day2 = models.CharField(max_length=3,null=True)
	BedsorecareLarge_day3 = models.CharField(max_length=3,null=True)
	BedsorecareLarge_day4 = models.CharField(max_length=3,null=True)
	BedsorecareMedium_day1 = models.CharField(max_length=3,null=True)
	BedsorecareMedium_day2 = models.CharField(max_length=3,null=True)
	BedsorecareMedium_day3 = models.CharField(max_length=3,null=True)
	BedsorecareMedium_day4 = models.CharField(max_length=3,null=True)
	Bedsorecaresmall_day1 = models.CharField(max_length=3,null=True)
	Bedsorecaresmall_day2 = models.CharField(max_length=3,null=True)
	Bedsorecaresmall_day3 = models.CharField(max_length=3,null=True)
	Bedsorecaresmall_day4 = models.CharField(max_length=3,null=True)
	Sutures_day1 = models.CharField(max_length=3,null=True)
	Sutures_day2 = models.CharField(max_length=3,null=True)
	Sutures_day3 = models.CharField(max_length=3,null=True)
	Sutures_day4 = models.CharField(max_length=3,null=True)
	Sutures_remark = models.CharField(max_length=30,null=True)
	Catheter_day1 = models.CharField(max_length=3,null=True)
	Catheter_day2 = models.CharField(max_length=3,null=True)
	Catheter_day3 = models.CharField(max_length=3,null=True)
	Catheter_day4 = models.CharField(max_length=3,null=True)
	Catheter_remark = models.CharField(max_length=30,null=True)
	Enema_day1 = models.CharField(max_length=3,null=True)
	Enema_day2 = models.CharField(max_length=3,null=True)
	Enema_day3 = models.CharField(max_length=3,null=True)
	Enema_day4 = models.CharField(max_length=3,null=True)
	Enema_remark = models.CharField(max_length=30,null=True)
	IV_Injections_day1 = models.CharField(max_length=3,null=True)
	IV_Injections_day2 = models.CharField(max_length=3,null=True)
	IV_Injections_day3 = models.CharField(max_length=3,null=True)
	IV_Injections_day4 = models.CharField(max_length=3,null=True)
	IV_Injections_remark = models.CharField(max_length=30,null=True)
	IM_Injections_day1 = models.CharField(max_length=3,null=True)
	IM_Injections_day2 = models.CharField(max_length=3,null=True)
	IM_Injections_day3 = models.CharField(max_length=3,null=True)
	IM_Injections_day4 = models.CharField(max_length=3,null=True)
	IM_Injections_remark = models.CharField(max_length=30,null=True)
	SC_Injections_day1 = models.CharField(max_length=3,null=True)
	SC_Injections_day2 = models.CharField(max_length=3,null=True)
	SC_Injections_day3 = models.CharField(max_length=3,null=True)
	SC_Injections_day4 = models.CharField(max_length=3,null=True)
	SC_Injections_remark = models.CharField(max_length=30,null=True)
	Intracath_day1 = models.CharField(max_length=3,null=True)
	Intracath_day2 = models.IntegerField(null=True)
	Intracath_day3 = models.IntegerField(null=True)
	Intracath_day4 = models.IntegerField(null=True)
	Intracath_remark = models.BigIntegerField(null=True)
	Tracheostomy_caresuction_day1 = models.IntegerField(null=True)
	Tracheostomy_caresuction_day2 = models.IntegerField(null=True)
	Tracheostomy_caresuction_day3 = models.IntegerField(null=True)
	Tracheostomy_caresuction_day4 = models.IntegerField(null=True)
	Tracheostomy_caresuction_remark = models.BigIntegerField(null=True)
	Nebulization_day1 = models.IntegerField(null=True)
	Nebulization_day2 = models.IntegerField(null=True)
	Nebulization_day3 = models.IntegerField(null=True)
	Nebulization_day4 = models.IntegerField(null=True)
	Nebulization_remark = models.BigIntegerField(null=True)
	Investigations_day1 = models.CharField(max_length=3,null=True)
	Investigations_day2 = models.CharField(max_length=3,null=True)
	Investigations_day3 = models.CharField(max_length=3,null=True)
	Investigations_day4 = models.CharField(max_length=3,null=True)
	InvestigationsEcg_day1 = models.CharField(max_length=3,null=True)
	InvestigationsEcg_day2 = models.CharField(max_length=3,null=True)
	InvestigationsEcg_day3 = models.CharField(max_length=3,null=True)
	InvestigationsEcg_day4 = models.CharField(max_length=3,null=True)
	InvestigationsEcg_remark = models.CharField(max_length=3,null=True)
	InvestigationsChestXray_day1 = models.CharField(max_length=3,null=True)
	InvestigationsChestXray_day2 = models.CharField(max_length=3,null=True)
	InvestigationsChestXray_day3 = models.CharField(max_length=3,null=True)
	InvestigationsChestXray_day4 = models.CharField(max_length=3,null=True)
	InvestigationsChestXray_remark = models.CharField(max_length=3,null=True)
	InvestigationsUsg_day1 = models.CharField(max_length=3,null=True)
	InvestigationsUsg_day2 = models.CharField(max_length=3,null=True)
	InvestigationsUsg_day3 = models.CharField(max_length=3,null=True)
	InvestigationsUsg_day4 = models.CharField(max_length=3,null=True)
	InvestigationsUsg_remark = models.CharField(max_length=3,null=True)
	# TreatmentType = enum.EnumField(TreatmentType_enum,null=True)
	hosp_id = models.BigIntegerField(null=True)
	emp_id = models.BigIntegerField(null=True)
	# status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
	
	def save(self, *args, **kwargs):
		if not self.agg_sp_ass_pt_dt_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
	

class agg_hhc_assessment_patient_list(models.Model):#4
	agg_sp_ass_pt_li_id = models.AutoField(primary_key = True)
	MRD_NO = models.CharField(max_length=30,null=True)
	name = models.CharField(max_length=20,null=True)
	first_name = models.CharField(max_length=15,null=True)
	middle_name = models.CharField(max_length=15,null=True)
	relation = models.CharField(max_length=10,null=True)
	phone_no = models.CharField(max_length=10,null=True)
	patient_name = models.CharField(max_length=15,null=True)
	patient_first_name = models.CharField(max_length=15,null=True)
	patient_middle_name = models.CharField(max_length=15,null=True)
	age = models.CharField(max_length=2,null=True)
	gender = models.CharField(max_length=7,null=True)
	residential_address = models.CharField(max_length=200,null=True)
	google_location = models.CharField(max_length=200,null=True)
	patient_mobile_no = models.CharField(max_length=10,null=True)
	patient_email_id = models.CharField(max_length=20,null=True)
	hosp_id = models.CharField(max_length=11,null=True)
	srv_id = models.CharField(max_length=11,null=True)
	sub_srv_id = models.CharField(max_length=11,null=True)
	reg_no = models.CharField(max_length=20,null=True)
	admission_date = models.DateField(null=True)
	consultant_name = models.CharField(max_length=20,null=True)
	hosp_id = models.BigIntegerField(null=True)
	dept_id = models.BigIntegerField(null=True)
	Treatmet_Type = enum.EnumField(Treatmet_Type_enum,null=True)
	notes = models.CharField(max_length=50,null=True)
	CaseID = models.CharField(max_length=100,null=True)
	OPIPNo = models.CharField(max_length=100,null=True)
	country = models.CharField(max_length=50,null=True)
	State = models.CharField(max_length=50,null=True)
	city = models.CharField(max_length=50,null=True)
	area = models.CharField(max_length=100,null=True)
	pin = models.IntegerField(null=True)
	VisitAdmitTime = models.CharField(max_length=50,null=True)
	VisitType = models.CharField(max_length=50,null=True)
	DoctorLoginName = models.CharField(max_length=50,null=True)
	Discharge_Date = models.CharField(max_length=50,null=True)
	TimeofDischarge = models.CharField(max_length=50,null=True)
	DateofDeath = models.CharField(max_length=50,null=True)
	enquiry_status = enum.EnumField(enquiry_status,null=True)    #sandip shimpi
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.agg_sp_ass_pt_li_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
	
class agg_hhc_patients(models.Model):#6    demo
	agg_sp_pt_id = models.AutoField(primary_key = True)
	doct_cons_id = models.ForeignKey('agg_hhc_doctors_consultants',on_delete=models.CASCADE,null=True)
	#app_user_id=models.ForeignKey(agg_hhc_app_caller_register,on_delete=models.CASCADE,null=True)
	caller_id=models.ForeignKey("agg_hhc_callers",on_delete=models.CASCADE,null=True)
	caller_rel_id=models.ForeignKey('agg_hhc_caller_relation',on_delete=models.CASCADE,null=True)
	hhc_code = models.CharField(max_length=50,null=True, blank=True)
	# membership_id = models.CharField(max_length=50,null=True)
	name = models.CharField(max_length=255,null=True)
	# name = models.CharField(max_length=50,null=True)
	# middle_name = models.CharField(max_length=50,null=True)
	# pincode=models.PositiveIntegerField(null=True)
	Age = models.BigIntegerField(null=True)
	# age = models.BigIntegerField(null=True)
	# Gender = models.CharField(max_length=10,null=True)
	gender_id = models.ForeignKey('agg_hhc_gender',on_delete=models.CASCADE,null=True)
	patient_email_id = models.EmailField(null=True)
	# Patient_status_at_present=enum.EnumField(patient_present_at_enum,null=True)
	# address_type=models.CharField(max_length=100,null=True)
	# residential_address = models.CharField(max_length=500,null=True)
	# permanant_address = models.CharField(max_length=500,null=True)
	state_id=models.ForeignKey('agg_hhc_state',on_delete=models.CASCADE,null=True)
	city_id = models.ForeignKey('agg_hhc_city',on_delete=models.CASCADE,null=True)
	address = models.CharField(max_length=1000,null=True)
	google_address = models.CharField(max_length=1040,null=True)
	prof_zone_id = models.ForeignKey('agg_hhc_professional_zone',on_delete=models.CASCADE,null=True)
	pincode=models.CharField(max_length=10,null=True,blank=True)
	otp=models.IntegerField(null=True)
	otp_expire_time=models.DateTimeField(null=True)
	Suffered_from=models.CharField(max_length=240,null=True)
	hospital_name=models.CharField(max_length=240,null=True)
	preferred_hosp_id=models.ForeignKey('agg_hhc_hospitals',on_delete=models.CASCADE,null=True)# updated
	phone_no = models.BigIntegerField(null=True)
	# mobile_no = models.CharField(max_length=20,null=True)
	dob = models.DateField(null=True)
	# patient_ref_name = models.CharField(max_length=50,null=True)
	status = enum.EnumField(status_enum,null=True)
	# isDelStatus = models.BigIntegerField(null=True)
	isVIP = enum.EnumField(yes_no_enum,null=True)
	lattitude = models.FloatField(null=True)
	langitude = models.FloatField(null=True)
	Profile_pic = models.CharField(max_length=200,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	# def save(self, *args, **kwargs):
	# 	if not self.agg_sp_pt_id:
	# 		last_pt = agg_hhc_patients.objects.order_by('-agg_sp_pt_id').first()
	# 		prefix = self.hosp_id.hospital_short_code if self.hosp_id else None
	# 		if not prefix:
	# 			raise status.HTTP_404_NOT_FOUND
	# 		last_sequence = int(last_pt.hhc_code[-4:]) + 1 if last_pt else 1
	# 		self.hhc_code = f"{prefix}HC{last_sequence:05d}"
	# 	return super().save(*args, **kwargs)
	def save(self, *args, **kwargs):
		if not self.agg_sp_pt_id:
			self.added_by=self.last_modified_by
	
		if not self.hhc_code:
			last_pt = agg_hhc_patients.objects.order_by('-agg_sp_pt_id').first()
			prefix = self.preferred_hosp_id.hospital_short_code if self.preferred_hosp_id else 'SP'
			if not prefix:
				raise Http404
			# print(last_pt.hhc_code,';;;; last patient ;;;;')
			last_sequence = int(last_pt.hhc_code[-4:]) + 1 if last_pt else 1
			self.hhc_code = f"{prefix}HC{last_sequence:05d}"
		return super().save(*args, **kwargs)
	
	# class Meta:
	# 	db_table='agg_hhc_patients'
	
	
# class agg_hhc_webinar_patient_table(models.Model):#7
# 	agg_sp_web_pt_li_id = models.AutoField(primary_key = True)
# 	HHC_no = models.CharField(max_length=20,null=True)
# 	patient_name = models.CharField(max_length=100,null=True)
# 	Email = models.CharField(max_length=50,null=True)
# 	mob = models.CharField(max_length=15,null=True)
# 	address = models.CharField(max_length=200,null=True)
# 	date = models.DateField(null=True)
# 	status = enum.EnumField(status_enum,null=True)

class agg_hhc_detailed_event_plan_of_care(models.Model):#8
	agg_sp_dt_eve_poc_id = models.AutoField(primary_key = True)
	eve_poc_id = models.ForeignKey('agg_hhc_event_plan_of_care',on_delete=models.CASCADE,null=True)
	#pt_id= models.ForeignKey(agg_hhc_patient_list_enquiry, on_delete=models.CASCADE, null=True)
	eve_id = models.ForeignKey('agg_hhc_events',on_delete = models.CASCADE, null=True)
	# eve_req_id = models.BigIntegerField(null=True)
	index_of_Session = models.IntegerField(null=True)
	srv_prof_id = models.ForeignKey('agg_hhc_service_professionals', related_name='relation_id',on_delete=models.CASCADE, null=True, blank=True, default=None)
	actual_StartDate_Time = models.DateField(null=True)
	actual_EndDate_Time = models.DateField(null=True)
	start_time = models.TimeField(null=True)
	end_time = models.TimeField(null=True)
	prof_session_start_date = models.DateField(null=True)
	prof_session_end_date = models.DateField(null=True)
	prof_session_start_time = models.TimeField(null=True)
	prof_session_end_time = models.TimeField(null=True)
	# actual_StartDate_Time = models.DateTimeField(null=True) # previous
	# actual_EndDate_Time = models.DateTimeField(null=True)   # previous
	
	service_cost = models.FloatField(null=True)
	amount_received = models.CharField(max_length=11,null=True)
	emp_id = models.BigIntegerField(null=True)
	Session_status = enum.EnumField(Session_status_enum,null=True)
	Session_jobclosure_status = enum.EnumField(yes_no_enum2,null=True)
	session_note = models.CharField(max_length=200,null=True)
	Reason_for_no_serivce = enum.EnumField(Reason_for_no_serivce_enum,null=True)
	Comment_for_no_serivce = models.CharField(max_length=100,null=True)
	OTP = models.CharField(max_length=4,null=True)
	OTP_count = models.BigIntegerField(null=True)
	otp_expire_time = models.DateTimeField(null=True, blank=True)
	Reschedule_status=enum.EnumField(yes_no_enum2,null=True)
	is_convinance=models.BooleanField(null=True)
	convinance_charges = models.IntegerField(null=True)
	is_cancelled = enum.EnumField(yes_no_enum2,null=True)
	payment_skip=models.BooleanField(default=False, blank=True)
	#Reschedule_count = models.BigIntegerField(null=True)
	#service_status = enum.EnumField(service_status_enum, null=True) #asper nikita 
	remark = models.CharField(max_length=200, null=True)# newly added
	status = enum.EnumField(status_enum,null=True)
	last_modified_from = enum.EnumField(last_modified_by_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	# added_date=models.DateTimeField(timezone.now(),null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.agg_sp_dt_eve_poc_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
	
	class Meta:
        # Define indexes for the fields
		indexes = [
			models.Index(fields=['eve_id']),
			models.Index(fields=['eve_poc_id']),
			models.Index(fields=['srv_prof_id']),
			models.Index(fields=['actual_StartDate_Time']),
			models.Index(fields=['actual_EndDate_Time']),
		]





class agg_hhc_events(models.Model):#9
	eve_id = models.AutoField(primary_key = True)
	event_code = models.CharField(max_length=640,null=True,blank=True)
	# srv_id = models.ForeignKey('agg_hhc_services',on_delete=models.CASCADE,null=True)
	caller_id = models.ForeignKey('agg_hhc_callers',on_delete=models.CASCADE,null=True)
	added_from_hosp=models.ForeignKey("agg_hhc_hospitals",on_delete=models.CASCADE,null=True)#from which hospital hd added this entery
	# enq_follow_up_id = models.ForeignKey('agg_hhc_enquiry_follow_up',on_delete=models.CASCADE,null=True)    # AMIT
	# relation = models.CharField(max_length=64,null=True)	
	# pt_id = models.ForeignKey(agg_hhc_patient_list_enquiry,on_delete=models.CASCADE,null=True)
	agg_sp_pt_id= models.ForeignKey(agg_hhc_patients,on_delete=models.CASCADE, null=True)
	coupon_id= models.ForeignKey('agg_Discount_Coupon_Code',on_delete=models.CASCADE, null=True, blank=True)
	purp_call_id = models.BigIntegerField(null=True)
	bill_no_ref_no = models.BigIntegerField(null=True)
	event_date = models.DateTimeField(auto_now_add=True,null=True)
	note = models.CharField(max_length=500,null=True)
	# service_date_of_Enquiry = models.DateField(null=True)
	enquiry_added_date = models.DateField(default=timezone.now,null=True)
	enquiry_status = enum.EnumField(enquiry_status_enum,null=True)
	# enquiry_cancel_from = models.BigIntegerField(null=True)
	enquiry_cancellation_reason = models.CharField(max_length=500,null=True)
	enquiry_cancel_date = models.DateField(null=True)
	# description = models.CharField(max_length=500,null=True)
	Total_cost = models.DecimalField(max_digits=50, decimal_places=2,null=True)
	discount_type = enum.EnumField(discount_type_enum,null=True)
	discount_value = models.FloatField(null=True)
	final_amount = models.FloatField(blank=True,null=True)#this is final amount after conveniance also
	status = enum.EnumField(status_enum,null=True)
	day_convinance=models.IntegerField(null=True)
	total_convinance=models.IntegerField(null=True)
	# inc_call_id = models.CharField(max_length=100,null=True)
	# event_status = enum.EnumField(event_status_enum,null=True)
	# estimate_cost = enum.EnumField(estimate_cost_enum,null=True)
	isArchive = enum.EnumField(yes_no_enum,null=True)
	isConvertedService = enum.EnumField(yes_no_enum,null=True)
	#isDelStatus = models.BigIntegerField(null=True)
	# Added_through = enum.EnumField(Added_through_enum,null=True)
	Invoice_ID = models.BigIntegerField(unique=True,null=True)
	Invoice_narration = models.CharField(max_length=100,null=True)
	invoice_narration_desc = models.CharField(max_length=500,null=True)
	# purpose_event_id = models.BigIntegerField(null=True)
	branch_code = models.CharField(max_length=50,null=True)
	# hosp_id = models.BigIntegerField(null=True)
	Suffered_from = models.CharField(max_length=200,null=True)
	# hosp_id = models.ForeignKey('agg_hhc_hospitals',on_delete=models.CASCADE,null=True)
	# ref_hos_nm = models.CharField(max_length=50,null=True)
	# Tally_Remark = models.BigIntegerField(null=True)
	# Payment_type = enum.EnumField(Payment_type_enum,null=True)
	OTP = models.CharField(max_length=11,null=True)
	OTP_count = models.IntegerField(null=True)
	otp_expire_time = models.DateField(null=True)
	address_id=models.ForeignKey('agg_hhc_app_add_address',on_delete=models.CASCADE,null=True)
	enq_spero_srv_status = enum.EnumField(enq_spero_srv_status_enum, null=True)
	srv_cancelled = enum.EnumField(yes_no_enum2,null=True)
	event_status=enum.EnumField(valid_event_enum,null=True)
	refer_by = enum.EnumField(refer_by_enum,null=True)  #sandip
	Patient_status_at_present=enum.EnumField(patient_present_at_enum,null=True)#added by vishal
	patient_service_status = enum.EnumField(patient_richedBy_status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		# if not self.eve_id:
		# 	self.added_by=self.last_modified_by
		patients=agg_hhc_events.objects.filter(purp_call_id=1).order_by('Invoice_ID').last()
		if not self.Invoice_ID and self.purp_call_id==1:
			if patients:
				if patients.Invoice_ID:inv=patients.Invoice_ID+1
				else: inv=1
			else: inv=1
			self.Invoice_ID=inv
		if not self.eve_id:
			last_pt = agg_hhc_events.objects.order_by('-eve_id').first()	
			prefix=str(date.today()).replace('-','')
			if last_pt and last_pt.event_code[:-4]==prefix:
				last_sequence = int(last_pt.event_code[-4:]) + 1  
			else:last_sequence= 1
			self.event_code = f"{prefix}{last_sequence:04d}"
			print(self.last_modified_by, 'self.last_modified_by')
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

	class Meta:
        # Define indexes for the fields
		indexes = [
			models.Index(fields=['eve_id']),
			models.Index(fields=['caller_id']),
		]




class agg_hhc_event_consultant_call(models.Model):#10
	eve_cons_call_id = models.AutoField(primary_key = True)
	eve_id = models.BigIntegerField(null=True)
	consultant_event_id = models.BigIntegerField(null=True)
	consultant_caller_id = models.BigIntegerField(null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.eve_cons_call_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_event_doctor_mapping(models.Model):#11
	eve_doct_map_id = models.AutoField(primary_key = True)
	eve_id = models.BigIntegerField(null=True)
	pt_id = models.BigIntegerField(null=True)
	doct_cons_id = models.BigIntegerField(null=True)
	types = enum.EnumField(types_enum,null=True)
	status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.eve_doct_map_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_event_follow_up(models.Model):#12
	eve_follow_up_id = models.AutoField(primary_key = True)
	eve_id = models.BigIntegerField(null=True)
	enq_follow_up_id = models.BigIntegerField(null=True)
	enq_follow_up_id = models.BigIntegerField(null=True)
	date = models.DateField(null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.eve_follow_up_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_event_job_summary(models.Model):#13
	eve_job_summ_id = models.AutoField(primary_key = True)
	eve_id = models.BigIntegerField(null=True)
	srv_id = models.BigIntegerField(null=True)
	eve_prof_id = models.BigIntegerField(null=True)
	srv_prof_id = models.BigIntegerField(null=True)
	reporting_instruction = models.CharField(max_length=500,null=True)
	types = enum.EnumField(types_enum,null=True)
	report_status = enum.EnumField(reporting_by_enum,null=True)
	status = enum.EnumField(status_enum,null=True)
	isDelStatus = models.BigIntegerField(null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.eve_job_summ_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_event_other_call(models.Model):#14
	eve_o_call_id = models.AutoField(primary_key = True)
	eve_id = models.BigIntegerField(null=True)
	purp_call_id = models.BigIntegerField(null=True)
	description = models.CharField(max_length=500,null=True)
	status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.eve_o_call_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_event_plan_of_care(models.Model):#15
	eve_poc_id = models.AutoField(primary_key = True)
	eve_id = models.ForeignKey(agg_hhc_events,on_delete=models.CASCADE,related_name='event_id',null=True)# new added
	srv_id = models.ForeignKey('agg_hhc_services',on_delete=models.CASCADE,null=True)# new added
	sub_srv_id = models.ForeignKey('agg_hhc_sub_services', on_delete=models.CASCADE,null=True)
	hosp_id = models.ForeignKey('agg_hhc_hospitals',on_delete=models.CASCADE,null=True)# new added
	doct_cons_id = models.ForeignKey('agg_hhc_doctors_consultants',on_delete=models.CASCADE,null=True)# new added
	# pt_id = models.ForeignKey('agg_hhc_patient_list_enquiry',on_delete=models.CASCADE,null=True)# new added(mayank)
	# eve_req_id = models.BigIntegerField(null=True)
	srv_prof_id = models.ForeignKey('agg_hhc_service_professionals',on_delete=models.CASCADE,null=True)
	No_session_dates = models.TextField(null=True)
	# service_date = models.DateField(null=True)# this field for fields stor  time
	# service_date_to = models.DateField(null=True)# this field for fields stor time
	# actual_StartDate_Time = models.DateTimeField(null=True)
	# actual_EndDate_Time = models.DateTimeField(null=True)
	# start_date = models.DateTimeField(null=True)  # previous
	# end_date = models.DateTimeField(null=True)	# previous
	start_date = models.DateField(null=True,db_index=True)
	end_date = models.DateField(null=True,db_index=True)
	start_time = models.TimeField(null=True)
	end_time = models.TimeField(null=True)
	serivce_dates = models.JSONField(null = True)  # added by vinayak
	initail_final_amount = models.FloatField(blank=True,null=True)
	service_reschedule = enum.EnumField(yes_no_enum2,null=True,blank=True) # added by vinayak
	# service_cost = models.FloatField(null=True)
	consent_submited = enum.EnumField(yes_no_enum2,null=True)
	prof_prefered = enum.EnumField(pt_gender_enum,null=True,blank=True) # updated
	status = enum.EnumField(status_enum,null=True)
	remark = models.CharField(max_length=200, null=True,blank=True)# newly added
	service_status = enum.EnumField(service_status_enum1,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
	# def save(self, *args, **kwargs):
	# 	if self.end_date is not None:
	# 		two_days_later = timezone.now().date() + timezone.timedelta(days=2)
	# 		two_days_after = timezone.now().date() - timezone.timedelta(days=2)
	# 		if self.service_status !=4 and self.service_status !=5:
	# 			print(two_days_after)
	# 			print(self.end_date)
	# 			if self.end_date <= two_days_after:
	# 				self.service_status = 1  
	# 		super().save(*args, **kwargs)
	def save(self, *args, **kwargs):
		if not self.eve_poc_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

	class Meta:
        # Define indexes for the fields
		indexes = [
			models.Index(fields=['eve_id']),
			models.Index(fields=['srv_prof_id']),
			models.Index(fields=['start_date']),
			models.Index(fields=['end_date']),
		]


class agg_hhc_event_professional(models.Model):#16 To store professional available details
	eve_prof_id = models.AutoField(primary_key = True)
	eve_id = models.ForeignKey("agg_hhc_events",on_delete=models.CASCADE,null=True)
	eve_req_id = models.BigIntegerField(null=True)
	srv_prof_id = models.ForeignKey("agg_hhc_service_professionals",on_delete=models.CASCADE,null=True)
	eve_poc_id = models.ForeignKey("agg_hhc_event_plan_of_care",on_delete=models.CASCADE,null=True)
	srv_id = models.ForeignKey("agg_hhc_services",on_delete=models.CASCADE,null=True)
	service_closed = enum.EnumField(yes_no_enum,null=True)
	status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.eve_prof_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

# class agg_hhc_event_requirements(models.Model):#17
# 	# eve_req_id = models.AutoField(primary_key = True)
# 	# eve_id = models.BigIntegerField(null=True)
# 	srv_id = models.BigIntegerField(null=True)
# 	sub_srv_id = models.BigIntegerField(null=True)
# 	srv_prof_id = models.BigIntegerField(null=True)
# 	status = enum.EnumField(status_enum,null=True) 
# 	hosp_id = models.BigIntegerField(null=True)
# 	Consultant = models.BigIntegerField(null=True)
# 	added_by = models.BigIntegerField(null=True)
# 	added_date = models.DateField(null=True)
# 	last_modified_by = models.BigIntegerField(null=True)
# 	last_modified_date = models.DateField(null=True)

class agg_hhc_event_share_hcm(models.Model):#18
	eve_share_hcm_id = models.AutoField(primary_key = True)
	eve_id = models.BigIntegerField(null=True)
	assigned_to = models.BigIntegerField(null=True)
	assigned_by = models.BigIntegerField(null=True)
	status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.eve_share_hcm_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_log_for_event(models.Model):#19
	log_for_eve_id = models.AutoField(primary_key = True)
	Role_id = enum.EnumField(Role_id_enum,null=True)
	srv_prof_id = models.BigIntegerField(null=True)
	logged_from = models.CharField(max_length=50,null=True)
	logStatement = models.CharField(max_length=200,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.log_for_eve_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)


class agg_hhc_caller_relation(models.Model):#21
	caller_rel_id = models.AutoField(primary_key = True)
	relation = models.CharField(max_length=240,null=True)
	status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
	def __str__(self):
		return self.relation
	
	def save(self, *args, **kwargs):
		if not self.caller_rel_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_conference_call(models.Model):#22
	conf_call_id = models.AutoField(primary_key = True)
	caller_id = models.CharField(max_length=50,null=True)
	call_agentid = models.CharField(max_length=50,null=True)
	call_mobile = models.CharField(max_length=50,null=True)
	call_extension = models.CharField(max_length=50,null=True)
	# call_status = enum.EnumField(call_status_enum,null=True)
	call_type = models.CharField(max_length=20,null=True)
	call_datetime = models.DateField(null=True)
	is_deleted = enum.EnumField(yes_no_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.conf_call_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_sp_incoming_call(models.Model):#23
	inc_call_id = models.AutoField(primary_key = True)
	calling_phone_no = models.CharField(max_length=100,null=True)
	agent_no = models.CharField(max_length=100,null=True)
	ext_no = models.CharField(max_length=50,null=True)
	caller_id = models.CharField(max_length=50,null=True)
	status = models.CharField(max_length=500,null=True)
	call_Type = models.CharField(max_length=10,null=True)
	message = models.CharField(max_length=500,null=True)
	dis_conn_massage = models.CharField(max_length=500,null=True)
	call_datetime = models.DateField(null=True)
	call_rinning_datetime = models.DateField(null=True)
	call_connect_datetime = models.DateField(null=True)
	call_disconnect_datetime = models.DateField(null=True)
	avaya_call_time = models.CharField(max_length=50,null=True)
	call_audio = models.CharField(max_length=500,null=True)
	# cl_status = enum.EnumField(cl_status_enum,null=True)
	is_deleted = enum.EnumField(yes_no_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.inc_call_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_outgoing_call(models.Model):#24
	out_g_call_id = models.AutoField(primary_key = True)
	caller_id = models.CharField(max_length=50,null=True)
	call_agentid = models.CharField(max_length=50,null=True)
	call_mobile = models.CharField(max_length=50,null=True)
	call_extension = models.CharField(max_length=50,null=True)
	# call_status = enum.EnumField(call_status_enum,null=True)
	call_datetime = models.DateField(null=True)
	call_disconnect_datetime = models.DateField(null=True)
	is_deleted = enum.EnumField(yes_no_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.out_g_call_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
        
class agg_hhc_purpose_call(models.Model):#25
	purp_call_id = models.AutoField(primary_key = True)
	name = models.CharField(max_length=255,null=True)
	status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
	def __str__(self):
		return f"{self.name}"
	
	def save(self, *args, **kwargs):
		if not self.purp_call_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_extend_service(models.Model):#26
	ext_srv_id = models.AutoField(primary_key = True)
	eve_poc_id = models.BigIntegerField(null=True)
	eve_id = models.BigIntegerField(null=True)
	service_date = models.DateField(null=True)
	service_date_to = models.DateField(null=True)
	startTime = models.CharField(max_length=50,null=True)
	endTime = models.CharField(max_length=50,null=True)
	estimate_cost = models.BigIntegerField(null=True)
	OTP = models.CharField(max_length=11,null=True)
	status = enum.EnumField(srv_status_enum,null=True)
	OTP_count = models.IntegerField(null=True)
	otp_expire_time = models.DateField(null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.ext_srv_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_no_reason_for_service(models.Model):#27
	no_res_for_srv_id = models.AutoField(primary_key = True)
	reason_title = models.CharField(max_length=255,null=True)
	is_deleted = enum.EnumField(yes_no_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.no_res_for_srv_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_professional_services(models.Model):#28
	prof_srv_id = models.AutoField(primary_key = True)
	srv_id = models.BigIntegerField(null=True)
	sub_srv_id = models.ForeignKey('agg_hhc_sub_services',on_delete=models.CASCADE,null=True)
	professional_type = enum.EnumField(professional_type_enum,null=True)
	srv_prof_id = models.BigIntegerField(null=True)
	vender_id = models.BigIntegerField(null=True)
	availability = models.CharField(max_length=255,null=True)
	status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.prof_srv_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)


class agg_hhc_professional_sub_services(models.Model):#29
	prof_sub_srv_id = models.AutoField(primary_key = True)
	# srv_prof_id = models.BigIntegerField(null=True)
	srv_prof_id = models.ForeignKey("agg_hhc_service_professionals", on_delete=models.CASCADE, null=True)
	# srv_id = models.ForeignKey('agg_hhc_services',on_delete=models.CASCADE,null=True)
	sub_srv_id = models.ForeignKey('agg_hhc_sub_services',on_delete=models.CASCADE,null=True) #added by Sandip
	prof_cost = models.FloatField(null=True)
	status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.prof_sub_srv_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)


class agg_hhc_services(models.Model):#30
	srv_id = models.AutoField(primary_key = True)
	service_title = models.CharField(max_length=255,null=True,unique=True)
	is_hd_access = enum.EnumField(yes_no_enum,null=True)  #need to remove as per discuss with varsha maam
	status = enum.EnumField(status_enum,null=True)
	# flag = enum.EnumField(flag_enum,null=True)##########################################
	tf = enum.EnumField(Tf_enum,null=True) #need to remove as per discuss with varsha maam
	package_status = enum.EnumField(package_status_enum,null=True) #need to remove as per discuss with varsha maam
	image_path = models.FileField(upload_to="media/services",null=True)
	# info = models.CharField(max_length=500,null=True)
	discription = models.CharField(max_length=10500,null=True)
	info_image_path = models.CharField(max_length=300,null=True)	#need to remove as per discuss with varsha maam
	ser_order = models.CharField(max_length=10,null=True)		#need to remove as per discuss with varsha maam
	dash_order = models.CharField(max_length=10,null=True)	#need to remove as per discuss with varsha maam
	is_role = enum.EnumField(truefalse_enum,null=True) # added by sandip
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.srv_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
	
	def __str__(self):
	    return f"{self.srv_id}"
	
class agg_hhc_sub_services(models.Model):#34
	sub_srv_id = models.AutoField(primary_key = True)
	recommomded_service = models.CharField(max_length=255,null=True)
	srv_id = models.ForeignKey(agg_hhc_services,on_delete=models.CASCADE, related_name='service', null=True)
	cost = models.FloatField(null=True)
	Service_Time = models.FloatField(null=True)
	tax = models.FloatField(null=True)
	deposit = models.CharField(max_length=240,null=True)
	supplied_by = models.CharField(max_length=240,null=True)
	UOM = models.CharField(max_length=50,null=True)
	status = enum.EnumField(status_enum,null=True)
	# flag = enum.EnumField(flag_enum,null=True)
	tf = enum.EnumField(Tf_enum,null=True)
	Instruction = models.CharField(max_length=500,null=True)
	Specimen = models.CharField(max_length=100,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
	
	def save(self, *args, **kwargs):
		if not self.sub_srv_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
	
	def __str__(self):
	    return f"{self.recommomded_service}"
	

class agg_hhc_service_membership_registration(models.Model):#31
	srv_member_reg_id = models.AutoField(primary_key = True)
	membership_id = models.CharField(max_length=50,null=True)
	sp_pt_id = models.BigIntegerField(null=True)
	pt_name = models.CharField(max_length=50,null=True)
	pt_gender = enum.EnumField(pt_gender_enum,null=True)
	pt_age = models.CharField(max_length=10,null=True)
	pt_contact = models.CharField(max_length=20,null=True)
	pt_contact2 = models.CharField(max_length=20,null=True)
	pt_email = models.CharField(max_length=50,null=True)
	pt_address = models.CharField(max_length=100,null=True)
	pt_ref_form = models.CharField(max_length=30,null=True)
	pt_past_history = models.CharField(max_length=200,null=True)
	pt_curr_prob = models.CharField(max_length=200,null=True)
	pt_allergies = models.CharField(max_length=200,null=True)
	pt_med_company = models.CharField(max_length=50,null=True)
	pt_med_policy = models.CharField(max_length=10,null=True)
	pt_med_exp_date = models.DateField(null=True)
	occupation = models.CharField(max_length=20,null=True)
	rel_contact = models.CharField(max_length=20,null=True)
	rel_name = models.CharField(max_length=50,null=True)
	rel_address = models.CharField(max_length=100,null=True)
	rel_relation = models.CharField(max_length=10,null=True)
	pt_consultant = enum.EnumField(yes_no_enum,null=True)
	pt_consultant_name = models.CharField(max_length=50,null=True)
	pt_consultant_hos = models.CharField(max_length=50,null=True)
	pt_consultant_contact = models.CharField(max_length=20,null=True)
	reg_status = enum.EnumField(reg_status_enum,null=True)
	status = enum.EnumField(status_enum,null=True)
	# membership_approval = enum.EnumField(membership_approval_enum,null=True)
	membership_note = models.CharField(max_length=100,null=True)
	# membership = enum.EnumField(membership_enum,null=True)
	membership_id_path = models.CharField(max_length=100,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.srv_member_reg_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)


class agg_hhc_service_professionals(models.Model):#32
	srv_prof_id = models.AutoField(primary_key = True)
	professional_code = models.CharField(max_length=255,null=True)
	clg_ref_id=models.ForeignKey('agg_com_colleague',on_delete=models.CASCADE,null=True,to_field="clg_ref_id")
	role = enum.EnumField(prof_role_enum, null=True)
	reference_type = enum.EnumField(reference_type_enum,null=True)
	title = enum.EnumField(Title, null=True)
	skill_set=models.CharField(max_length=200,null=True)#BHMS	
	Job_type = enum.EnumField(JOB_type, null = True)
	prof_fullname = models.CharField(max_length=200,null=True)
	# first_name = models.CharField(max_length=255,null=True)
	# last_name = models.CharField(max_length=50,null=True)
	# middle_name = models.CharField(max_length=50,null=True)
	email_id = models.EmailField(max_length=254, null=True)
	phone_no = models.BigIntegerField(unique=True,null=True)
	alt_phone_no = models.BigIntegerField(blank=True,null=True) # added by vinayak
	eme_contact_no = models.BigIntegerField(null=True) # added by vinayak
	eme_contact_relation = models.ForeignKey(agg_hhc_caller_relation,on_delete=models.CASCADE, null=True) # added by vinayak #modified by sandip
	# eme_contact_relation = models.ForeignKey(agg_hhc_caller_relation,on_delete=models.CASCADE, null=True)
	eme_conact_person_name = models.CharField(max_length=100, blank=True,null=True) # added by vinayak
	dob = models.DateField(null=True)
	doj = models.DateField(null=True)
	address = models.CharField(max_length=500,null=True)
	work_email_id = models.EmailField(max_length=254, null=True)
	work_phone_no = models.BigIntegerField(null=True)
	work_address = models.CharField(max_length=500,null=True)
	prof_zone_id= models.ForeignKey('agg_hhc_professional_zone',on_delete=models.CASCADE,null=True, to_field="Name")
	# loc_id = models.CharField(max_length=240,null=True)
	set_location = enum.EnumField(set_location_enum,null=True)
	status = enum.EnumField(status_enum,null=True)
	isDelStatus = models.BigIntegerField(null=True)
	lattitude = models.FloatField(null=True)
	langitude = models.FloatField(null=True)
	google_home_location = models.CharField(max_length=240,null=True)
	google_work_location = models.CharField(max_length=240,null=True)
	Physio_Rate = models.FloatField(null=True)
	police_varification_charges = models.FloatField(null=True)
	apron_charges = models.FloatField(null=True)
	document_status = enum.EnumField(document_status_enum,null=True)
	# APP_password = models.CharField(max_length=350,null=True)
	OTP = models.CharField(max_length=4,null=True)
	OTP_count = models.BigIntegerField(default=0,null=False)
	otp_expire_time = models.DateTimeField(null=True)
	Profile_pic = models.ImageField(null=True,max_length=None)
	Ratings = models.FloatField(null=True)
	Reviews = models.IntegerField(null=True)
	# Description = models.CharField(max_length=200,null=True)
	OTP_verification = enum.EnumField(yes_no_enum,null=True)
	# reg_source = enum.EnumField(reg_source_enum,null=True)
	availability_status = enum.EnumField(JOB_type,null=True, blank=True)
	mode_of_service = enum.EnumField(mode_of_srv, null=True, blank=True)
	location_status = enum.EnumField(yes_no_enum,null=True)
	srv_id = models.ForeignKey('agg_hhc_services',on_delete=models.CASCADE,null=True,to_field="service_title")# rename by vishal
	# prof_srv_id = models.IntegerField(null=True)
	# prof_sub_srv_id = models.ForeignKey('agg_hhc_professional_sub_services',on_delete=models.CASCADE,null=True) agg_hhc_sub_services
	prof_sub_srv_id = models.ForeignKey('agg_hhc_sub_services',on_delete=models.CASCADE,null=True)
	# Experience = models.IntegerField(null=True)
	Calendar = models.DateField(auto_now=False, auto_now_add=False, null=True)
	certificate_registration_no = models.CharField(max_length=100, null= True) # added by vinayak
	# srv_id = models.ForeignKey(agg_hhc_services,on_delete=models.CASCADE,null=True) #added by mayank
	Experience = models.FloatField(null=True)#added by mayank
	gender = enum.EnumField(pt_gender_enum, null = True)
	Education_level = enum.EnumField(Education_level, null = True) # added by vinayak
	pin_code_id = models.CharField(max_length=50,null=True)
	prof_address = models.CharField(max_length=100, null=True)
	city = models.ForeignKey('agg_hhc_city', on_delete=models.CASCADE, null=True)
	state_name=models.ForeignKey('agg_hhc_state',on_delete=models.CASCADE,null=True)
	prof_address = models.CharField(max_length=255, null=True)
	# cv_file = models.FileField(upload_to='uploads/')
	cv_file = models.FileField(upload_to='pdfs/',null=True, blank=True)
	profile_file = models.FileField(upload_to='prof_profile/',null=True, blank=True)
	prof_registered = models.BooleanField(default=False, blank=True)
	prof_interviewed = models.BooleanField(default=False, blank=True)
	prof_doc_verified = models.BooleanField(default=False, blank=True)
	# uploaded_at = models.DateTimeField(auto_now_add=True)
	designation = enum.EnumField(Designation, null=True)
	availability = models.DateTimeField(auto_now=False, auto_now_add=False,null=True) # added by vinayak
	professinal_status = enum.EnumField(Professional_status, null=True) # added by vinayak
	induction = enum.EnumField(yes_no_enum2,null=True)# added by nikita
	training = enum.EnumField(yes_no_enum2,null=True)# added by nikita
	id_card = enum.EnumField(yes_no_enum2,null=True)# added by nikita
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.srv_prof_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)


class agg_hhc_prof_interview_details(models.Model):
	srv_prof_int_id = models.AutoField(primary_key=True)
	srv_prof_id = models.ForeignKey('agg_hhc_service_professionals',on_delete=models.CASCADE,null=True)
	int_round =  models.IntegerField(null=True)
	int_mode = enum.EnumField(int_mode_enum,null=True)
	int_schedule_with = models.CharField(max_length=50, null=True)
	int_schedule_date = models.DateField(null=True)
	int_schedule_time = models.TimeField(null=True)
	int_status = enum.EnumField(int_status_enum,null=True)
	status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.srv_prof_int_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_service_professional_details(models.Model):#33
	def nameField(instance,filename):
		return "/".join(['media',str(instance.srv_prof_id.prof_fullname),filename])
	srv_prof_dt_id = models.AutoField(primary_key = True)
	srv_prof_id = models.ForeignKey('agg_hhc_service_professionals',on_delete=models.CASCADE,null=True)
	qualification = models.ForeignKey('qualifications',on_delete=models.CASCADE,null=True)
	specialization = models.ForeignKey('qualification_specialization',on_delete=models.CASCADE,null=True)
	prof_CV = models.FileField(upload_to=nameField,null=True)
	availability_for_interview = models.DateTimeField(null=True)
	skill_set = models.CharField(max_length=255,null=True)
	work_experience = models.FloatField(null=True)
	hospital_attached_to = models.CharField(max_length=255,null=True)
	pancard_no = models.CharField(max_length=20,null=True)
	service_tax = models.FloatField(null=True)
	status = enum.EnumField(status_enum,null=True)
	designation = models.CharField(max_length=50,null=True)
	reference_1 = models.CharField(max_length=100,null=True)
	reference_2 = models.CharField(max_length=100,null=True)
	reference_1_contact_num = models.CharField(max_length=11,null=True)
	reference_2_contact_num = models.CharField(max_length=11,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.srv_prof_dt_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)


# class agg_hhc_jobclosure_detail_datewise_old(models.Model):#36
# 	jclose_dt_d_wise_old_id = models.AutoField(primary_key = True)
# 	eve_id = models.BigIntegerField(null=True)
# 	srv_id = models.BigIntegerField(null=True)
# 	sub_srv_id = models.BigIntegerField(null=True)
# 	service_date = models.DateField(null=True)
# 	actual_service_date = models.DateField(null=True)
# 	job_closure_detail = models.CharField(max_length=200,null=True)
# 	StartTime = models.CharField(max_length=240,null=True)
# 	Endtime = models.CharField(max_length=240,null=True)
# 	added_by = models.BigIntegerField(null=True)
# 	status = enum.EnumField(status_enum,null=True)
# 	added_date = models.DateField(default=timezone.now,null=True)

class agg_hhc_job_closure(models.Model):#37
	jclose_id = models.AutoField(primary_key = True)
	eve_id = models.BigIntegerField(null=True)
	srv_prof_id = models.BigIntegerField(null=True)
	srv_id = models.BigIntegerField(null=True)
	service_render = enum.EnumField(yes_no_enum,null=True)
	service_date = models.DateField(null=True)
	medicine_id = models.BigIntegerField(null=True)
	cons_id = models.BigIntegerField(null=True)
	temprature = models.FloatField(null=True)
	bsl = models.FloatField(null=True)
	pulse = models.BigIntegerField(null=True)
	spo2 = models.FloatField(null=True)
	rr = models.BigIntegerField(null=True)
	gcs_total = models.BigIntegerField(null=True)
	high_bp = models.CharField(max_length=5,null=True)
	low_bp = models.CharField(max_length=5,null=True)
	skin_perfusion = enum.EnumField(skin_perfusion_enum,null=True)
	airway = enum.EnumField(airway_enum,null=True)
	breathing = enum.EnumField(breathing_enum,null=True)
	circulation = enum.EnumField(circulation_enum,null=True)
	baseline = enum.EnumField(baseline_enum,null=True)
	summary_note = models.CharField(max_length=500,null=True)
	job_closure_file = models.CharField(max_length=255,null=True)
	# status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.jclose_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_job_closure_consumption_mapping(models.Model):#38
	jclose_cons_map_id = models.AutoField(primary_key = True)
	jclose_id = models.BigIntegerField(null=True)
	consumption_type = enum.EnumField(consumption_type_enum,null=True)
	unit_id = models.BigIntegerField(null=True)
	unit_quantity = models.CharField(max_length=255,null=True)
	status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.jclose_cons_map_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_assisted_living_schedule(models.Model):#44
	ass_liv_sche_id = models.AutoField(primary_key = True)
	event_id = models.BigIntegerField(null=True)
	service_date = models.DateField(null=True)
	Activity_Name = models.CharField(max_length=20,null=True)
	Cost = models.FloatField(null=True)
	Tax = models.FloatField(null=True)
	Start_time = models.CharField(max_length=20,null=True)
	End_time = models.CharField(max_length=20,null=True)
	# Status = enum.EnumField(Status_enum,null=True)
	date = models.DateField(null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.ass_liv_sche_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_membership_schedule_detail(models.Model):#45
	member_sche_dt_id = models.AutoField(primary_key = True)
	pt_id = models.CharField(max_length=2,null=True)
	Doctor_Visit_1 = models.DateField(null=True)
	Doctor_Visit_2 = models.DateField(null=True)
	Telemedicine_1 = models.DateField(null=True)
	Telemedicine_2 = models.DateField(null=True)
	Telemedicine_3 = models.DateField(null=True)
	Telemedicine_4 = models.DateField(null=True)
	lab_test_1 = models.DateField(null=True)
	lab_test_2 = models.DateField(null=True)
	hos_co_ordination_1 = models.DateField(null=True)
	hos_co_ordination_2 = models.DateField(null=True)
	membership_card = models.CharField(max_length=50,null=True)
	document = models.CharField(max_length=200,null=True)
	status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.member_sche_dt_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_professional_scheduled(models.Model):#46  THIS WILL WE USED TO STORE DATA IN CALENDAR
	prof_sche_id = models.AutoField(primary_key = True)
	srv_prof_id = models.ForeignKey('agg_hhc_service_professionals',on_delete=models.CASCADE,null=True)
	scheduled_date = models.DateField(null=True)
	from_time = models.DateTimeField(max_length=240,null=True)
	to_time = models.DateTimeField(max_length=240,null=True)
	is_night_shift = enum.EnumField(yes_no_enum,null=True)
	status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.prof_sche_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_reschedule_session(models.Model):#47
	re_sche_session_id = models.AutoField(primary_key = True)
	event_id = models.BigIntegerField(null=True)
	detail_plan_of_care_id = models.BigIntegerField(null=True)
	professional_id = models.BigIntegerField(null=True)
	professional_type = enum.EnumField(professional_types_enum,null=True)
	session_start_date = models.DateField(null=True)
	session_end_date = models.DateField(null=True)
	reschedule_start_date = models.DateField(null=True)
	reschedule_start_time = models.DateField(null=True)
	reschedule_end_date = models.DateField(null=True)
	reschedule_end_time = models.DateField(null=True)
	reschedule_reason = models.CharField(max_length=255,null=True)
	professional_acceptance_status = enum.EnumField(acceptance_status_enum,null=True)
	professional_acceptance_narration = models.CharField(max_length=255,null=True)
	patient_acceptance_status = enum.EnumField(acceptance_status_enum,null=True)
	patient_acceptance_narration = models.CharField(max_length=255,null=True)
	modified_user_type = enum.EnumField(user_types_enum,null=True)
	added_user_type = enum.EnumField(user_types_enum,null=True)
	status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.re_sche_session_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_payments_received_by_professional(models.Model):#48
	pay_recived_by_prof_id = models.AutoField(primary_key = True)
	# event_id = models.BigIntegerField(null=True)
	# eve_req_id = models.BigIntegerField(null=True)
	# Session_id = models.BigIntegerField(null=True)
	# cheque_DD_NEFT_no = models.CharField(max_length=50,null=True)
	# cheque_DD_NEFT_date = models.DateField(null=True)
	# cheque_path_id = models.BigIntegerField(null=True)
	# party_bank_name = models.CharField(max_length=50,null=True)
	srv_prof_id = models.ForeignKey('agg_com_colleague',on_delete=models.CASCADE,null=True)
	# professional_name = models.CharField(max_length=50,null=True)
	# Transaction_Type = models.CharField(max_length=50,null=True)
	amount = models.BigIntegerField(null=True)
	types = models.CharField(max_length=50,null=True)
	added_by = models.BigIntegerField(null=True)
	# added_by_type = enum.EnumField(reg_source_enum,null=True)
	#Card_Number = models.BigIntegerField(null=True)
	Transaction_ID = models.CharField(max_length=11,null=True)
	date_time = models.DateField(null=True)
	#Comments = models.CharField(max_length=250,null=True)
	#branch = models.CharField(max_length=50,null=True)
	#payment_receipt_no_voucher_no = models.BigIntegerField(null=True)
	status = enum.EnumField(status_enum,null=True)
	#payment_status = enum.EnumField(payment_status_enum,null=True)
	#Payment_type = enum.EnumField(Payment_type_enum,null=True)
	#Payment_mode = enum.EnumField(Payment_mode_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.pay_recived_by_prof_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)



# ------------------------------------------------------------------------------------------------------------------




class agg_hhc_professional_device_info(models.Model):#51
	prof_devi_info_id=models.AutoField(primary_key=True)
	OSVersion=models.CharField(max_length=100,null=True)
	OSName=models.CharField(max_length=100,null=True)
	DevicePlatform=models.CharField(max_length=100,null=True)
	AppVersion=models.CharField(max_length=100,null=True)
	DeviceTimezone=models.CharField(max_length=100,null=True)
	DeviceCurrentTimestamp=models.DateTimeField(null=True)
	Token=models.CharField(max_length=1000,null=True)
	ModelName=models.CharField(max_length=100,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.prof_devi_info_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_professional_documents(models.Model):#52
	def nameField(instance,filename):
		return "/".join(['media',str(instance.srv_prof_id.prof_fullname),filename])
	prof_doc_id=models.AutoField(primary_key=True)
	srv_prof_id=models.ForeignKey(agg_hhc_service_professionals,on_delete=models.CASCADE)
	doc_li_id=models.ForeignKey('agg_hhc_documents_list',on_delete=models.CASCADE)
	professional_document=models.FileField(upload_to=nameField,null=True)  #change urp_path to professional_document and char to filefield #sandip shimpi
	rejection_reason=models.CharField(max_length=200,null=True,blank=True)
	status=enum.EnumField(documents_enum,null=True)
	isVerified=enum.EnumField(truefalse_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.prof_doc_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_professional_location(models.Model):#53
	prof_loc_id=models.AutoField(primary_key=True)
	srv_prof_id=models.ForeignKey(agg_hhc_service_professionals,on_delete=models.CASCADE,null=True)
	location_name=models.CharField(max_length=100,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.prof_loc_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_professional_location_details(models.Model):#54
	prof_loc_dt_id=models.AutoField(primary_key=True)
	lattitude=models.FloatField(null=True)
	longitude=models.FloatField(null=True)
	location_name=models.TextField(null=True)
	prof_loc_id=models.ForeignKey('agg_hhc_professional_location',on_delete=models.CASCADE,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.prof_loc_dt_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_professional_location_preferences(models.Model):#55
	prof_loc_pref_id=models.AutoField(primary_key=True)
	srv_prof_id=models.ForeignKey(agg_hhc_service_professionals,on_delete=models.CASCADE,null=True)
	prof_loc_id=models.ForeignKey('agg_hhc_professional_location',on_delete=models.CASCADE,null=True)
	max_latitude=models.FloatField(null=True)
	min_latitude=models.FloatField(null=True)
	max_longitude=models.FloatField(null=True)
	min_longitude=models.FloatField(null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.prof_loc_pref_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
	
class agg_hhc_professional_locations_as_per_zones(models.Model):
	prof_loc_zone_id = models.AutoField(primary_key = True)
	prof_loc_dtl_id=models.ForeignKey('agg_hhc_professional_location_details',on_delete=models.CASCADE,null=True)
	prof_zone_id=models.ForeignKey('agg_hhc_professional_zone',on_delete=models.CASCADE,null=True)
	srv_prof_id = models.ForeignKey(agg_hhc_service_professionals,on_delete=models.CASCADE,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)


	def save(self, *args, **kwargs):
		if not self.prof_loc_zone_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)


class agg_hhc_professional_availability(models.Model):#49
	professional_avaibility_id = models.AutoField(primary_key = True)
	srv_prof_id = models.ForeignKey(agg_hhc_service_professionals,on_delete=models.CASCADE,null=True)
	# date = models.DateField(null=True)
	day = models.IntegerField(null=True, blank=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.professional_avaibility_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)


class agg_hhc_professional_availability_detail(models.Model):#50
	prof_avaib_dt_id = models.AutoField(primary_key=True)
	prof_avaib_id = models.ForeignKey(agg_hhc_professional_availability,on_delete=models.CASCADE,null=True)
	start_time = models.TimeField(null=True)
	end_time = models.TimeField(null=True)
	prof_loc_zone_id = models.ForeignKey(agg_hhc_professional_locations_as_per_zones,on_delete=models.CASCADE,null=True)
	prof_zone_id=models.ForeignKey('agg_hhc_professional_zone',on_delete=models.CASCADE,null=True)
	# prof_loc_id = models.ForeignKey(agg_hhc_professional_location,on_delete=models.CASCADE,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.prof_avaib_dt_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)


class agg_hhc_professional_media(models.Model):#56
	prof_media_id=models.AutoField(primary_key=True)
	srv_id=models.ForeignKey(agg_hhc_services,on_delete=models.CASCADE,null=True)
	#sub_srv_id=models.ForeignKey(agg_hhc_sub_services,on_delete=models.CASCADE,null=True)
	Service_day=models.IntegerField(null=True)
	types=enum.EnumField(pic_enum,null=True)
	path=models.CharField(max_length=200,null=True)
	thumbnail_path=models.CharField(max_length=200,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.prof_media_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_professional_notification(models.Model):#57
	prof_noti_id=models.AutoField(primary_key=True)
	#professional_id=models.ForeignKey(agg_hhc_service_professionals,on_delete=models.CASCADE,null=True)
	types=models.CharField(max_length=100,null=True)
	title=models.CharField(max_length=100,null=True)
	#notification_detail_id=models.IntegerField(null=True)
	message=models.CharField(max_length=1000,null=True)
	Acknowledged=enum.EnumField(prof_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.prof_noti_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_professional_password(models.Model):#58
	prof_passwd_id=models.AutoField(primary_key=True)
	#srv_id=models.ForeignKey(agg_hhc_services,on_delete=models.CASCADE,null=True)
	#srv_prof_id=models.ForeignKey(agg_hhc_service_professionals,on_delete=models.CASCADE,null=True)
	professional_password=models.CharField(max_length=50,null=True)
	status=models.IntegerField(null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.prof_passwd_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_professional_weekoff(models.Model):#59
	prof_woff_id=models.AutoField(primary_key=True)
	srv_prof_id=models.ForeignKey(agg_hhc_service_professionals,on_delete=models.CASCADE,null=True)
	date_form=models.DateTimeField(null=True)
	date_to=models.DateTimeField(null=True)
	Note=models.CharField(max_length=50,null=True)
	date=models.DateTimeField(null=True)
	Leave_Conflit=enum.EnumField(Leave_Conflit_enum,null=True)
	Leave_status=enum.EnumField(Leave_Conflit_enum,null=True)
	rejection_reason=models.CharField(max_length=200,null=True)
	status=enum.EnumField(truefalse_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.prof_woff_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_admin_users(models.Model):#60
	ad_usr_id=models.AutoField(primary_key=True)
	first_name=models.CharField(max_length=50,null=True)
	last_name=models.CharField(max_length=50,null=True)
	middle_name=models.CharField(max_length=50,null=True)
	email_id=models.EmailField(null=True)
	password=models.CharField(max_length=255,null=True)
	#landline_no=
	mobile_no=models.IntegerField(null=True)
	alternate_email_id=models.EmailField(null=True,blank=True)
	types=enum.EnumField(desk_type_enum,null=True)
	status=enum.EnumField(status_enum,null=True)
	isDelStatus=models.IntegerField(null=True)
	last_login_time=models.DateTimeField(null=True,blank=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.ad_usr_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_admin_users_modules(models.Model):#61
	ad_usr_model_id=models.AutoField(primary_key=True)
	ad_usr_id=models.ForeignKey(agg_hhc_admin_users,on_delete=models.CASCADE,null=True)
	#module_id=models.ForeignKey(agg_hhc_modules,on_delete=models.CASCADE,null=True)
	status=enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.ad_usr_model_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_admin_user_hospital_mapping(models.Model):#62
	ad_usr_hos_map_id=models.AutoField(primary_key=True)
	#ad_usr_id=models.ForeignKey(agg_hhc_admin_users,on_delete=models.CASCADE,null=True)
	#hosp_id=models.ForeignKey(agg_hhc_hospitals,on_delete=models.CASCADE,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.ad_usr_hos_map_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_assisted_living_booking(models.Model):#63
	ass_liv_book_id=models.AutoField(primary_key=True)
	Flat_Number=models.BigIntegerField(null=True)
	Patient_location=enum.EnumField(patient_bed_location_enum,null=True)
	Facility_type=enum.EnumField(Facility_type_enum,null=True)
	#agg_sp_pt_id=models.ForeignKey(agg_hhc_patients,on_delete=models.CASCADE,null=True)
	status=enum.EnumField(is_delet_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.ass_liv_book_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_attendance_details(models.Model):#64
	att_dt_id=models.AutoField(primary_key=True)
	#Professional_id=models.ForeignKey(agg_hhc_service_professionals,on_delete=models.CASCADE,null=True)
	attnd_date=models.DateField(null=True)
	attnd_type=models.CharField(max_length=30,null=True)
	attnd_status=models.CharField(max_length=10,null=True)
	attnd_Note=models.CharField(max_length=500,null=True)
	added_by_type=models.CharField(max_length=20,null=True)
	ad_usr_id=models.ForeignKey(agg_hhc_admin_users,on_delete=models.CASCADE,null=True)
	status=enum.EnumField(is_delet_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.att_dt_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_avaya_extensions(models.Model):#65
	avaya_ext_id=models.AutoField(primary_key=True)
	ext_type=models.CharField(max_length=100,null=True)
	ext_ip=models.CharField(max_length=100,null=True)
	ext_no=models.CharField(max_length=100,null=True)
	is_deleted=enum.EnumField(is_delet_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.avaya_ext_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_bank_details(models.Model):#66
	bank_dt_id=models.AutoField(primary_key=True)
	#Professional_id=models.ForeignKey(agg_hhc_service_professionals,on_delete=models.CASCADE,null=True)
	Account_name=models.CharField(max_length=100,null=True)
	Account_number=models.CharField(max_length=50,null=True)
	Bank_name=models.CharField(max_length=100,null=True)
	Branch=models.CharField(max_length=50,null=True)
	IFSC_code=models.CharField(max_length=20,null=True)
	Account_type=models.CharField(max_length=20,null=True)
	Amount_with_spero=models.IntegerField(null=True)
	Amount_with_me=models.IntegerField(null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.bank_dt_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class cancel_fileds(enum.Enum):
	Spero = 1
	Customer = 2

class agg_hhc_cancellation_history(models.Model):#67
	canc_his_id=models.AutoField(primary_key=True)
	event_id=models.ForeignKey(agg_hhc_events,on_delete=models.CASCADE,null=True)
	agg_sp_dt_eve_poc_id=models.ForeignKey(agg_hhc_detailed_event_plan_of_care,on_delete=models.CASCADE,null=True)
	event_code=models.CharField(max_length=50,null=True)
	cancellation_by = enum.EnumField(cancel_from,null=True)
	cancelled_date = models.DateTimeField(default=timezone.now, null=True)
	can_amt= models.FloatField(blank=True,null=True)
	convineance_chrg= models.FloatField(blank=True,null=True)
	deducted_amount= models.FloatField(blank=True,null=True)
	remark=models.CharField(max_length=100,null=True)
	reason = models.ForeignKey('agg_hhc_enquiry_follow_up_cancellation_reason', on_delete=models.CASCADE,null=True)
	status=enum.EnumField(is_delet_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.canc_his_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_change_status(models.Model):#68
	cng_stat_id=models.IntegerField(null=True)
	#prof_id=models.ForeignKey(agg_hhc_service_professionals,on_delete=models.CASCADE,null=True)
	status=models.CharField(max_length=20,null=True)
	reason=models.CharField(max_length=100,null=True)
	date=models.DateTimeField(null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.cng_stat_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_cheque_images(models.Model):#69
	cq_img_id=models.AutoField(primary_key=True)
	#agg_sp_dt_eve_poc_id=models.ForeignKey(agg_hhc_detailed_event_plan_of_care,on_delete=models.CASCADE,null=True)
	Url_path=models.CharField(max_length=200,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.cq_img_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

# class agg_hhc_city(models.Model):#70
#     city_id=models.AutoField(primary_key=True)
#     city_name=models.CharField(max_length=100,null=True,unique=True)
#     state_name=models.ForeignKey('agg_hhc_state',on_delete=models.CASCADE,null=True,to_field='state_name')
#     status=enum.EnumField(status_enum,null=True)
#     Added_by=models.IntegerField(null=True)
#     Added_date=models.DateTimeField(default=timezone.now,null=True)
#     def __str__(self):
# 	    return self.city_name
class agg_hhc_city(models.Model):#70
	city_id=models.AutoField(primary_key=True)
	city_name=models.CharField(max_length=100,null=True,unique=True)
	state_id=models.ForeignKey('agg_hhc_state',on_delete=models.CASCADE,null=True)
	status=enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.city_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
    
    # def __str__(self):
	#     return self.city_name

class agg_hhc_consent_agree_form(models.Model):#71
	consent_agree_form_id=models.AutoField(primary_key=True)
	#eid=models.ForeignKey(agg_hhc_events,on_delete=models.CASCADE,null=True)
	p_name=models.CharField(max_length=100,null=True)
	que=models.CharField(max_length=50,null=True)
	note=models.CharField(max_length=100,null=True)
	status=enum.EnumField(is_delet_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.consent_agree_form_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_consumables(models.Model):#72
	cons_id=models.AutoField(primary_key=True)
	name=models.CharField(max_length=255,null=True)
	types=enum.EnumField(consumable_type_enum,null=True)
	manufacture_name=models.CharField(max_length=255,null=True)
	rate=models.FloatField(null=True)#monthly rate
	manufa_name=models.CharField(max_length=11,null=True)#sale manufacture
	sale_price=models.FloatField(null=True)
	status=enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.cons_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_content(models.Model):#73
	content_id=models.AutoField(primary_key=True)
	#hosp_id=models.ForeignKey(agg_hhc_hospitals,on_delete=models.CASCADE,null=True)
	content_type=enum.EnumField(content_type_enum,null=True)
	content_value=models.CharField(max_length=500,null=True)
	status=enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.content_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_dash_count_details(models.Model):#74
	dash_count_dt_id=models.AutoField(primary_key=True)
	till_total_count=models.IntegerField(null=True)
	till_month_total_count=models.IntegerField(null=True)
	till_today_total_count=models.IntegerField(null=True)
	till_org_count=models.CharField(max_length=50,null=True)
	till_dia_count=models.CharField(max_length=50,null=True)
	till_month_org_count=models.CharField(max_length=50,null=True)
	till_month_dia_count=models.CharField(max_length=50,null=True)
	status=enum.EnumField(active_inactive_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.dash_count_dt_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_device_version_info(models.Model):#75
	devi_version_info_id=models.AutoField(primary_key=True)
	osName=models.CharField(max_length=50,null=True)
	osVersion=models.CharField(max_length=50,null=True)
	location_path=models.CharField(max_length=200,null=True)
	compulsory_version=models.CharField(max_length=20,null=True)
	status=enum.EnumField(active_inactive_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.devi_version_info_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_doctors_consultants(models.Model):#76
	doct_cons_id=models.AutoField(primary_key=True)
	#hosp_id=models.ForeignKey(agg_hhc_hospitals,on_delete=models.CASCADE,null=True)
	hos_nm=models.CharField(max_length=100,null=True)
	cons_fullname = models.CharField(max_length=255,null=True)
	# first_name=models.CharField(max_length=100,null=True)
	# last_name=models.CharField(max_length=100,null=True)
	# middle_name=models.CharField(max_length=100,null=True,blank=True)
	email_id=models.EmailField(null=True)
	#phone_no=models.IntegerField(null=True)
	mobile_no=models.BigIntegerField(null=True)
	weblogin_password=models.CharField(max_length=100,null=True)
	work_email_id=models.EmailField(null=True,blank=True)
	work_phone_no=models.IntegerField(null=True,blank=True)
	work_address=models.TextField(null=True)
	speciality=models.CharField(max_length=255,null=True)
	type1=enum.EnumField(type_enum,null=True)
	telephonic_consultation_fees=models.IntegerField(null=True,blank=True)
	approved_by=models.CharField(max_length=20,null=True,blank=True)
	reject_by=models.CharField(max_length=20,null=True,blank=True)
	reject_reason=models.CharField(max_length=100,null=True,blank=True)
	status=enum.EnumField(consultant_status_enum,null=True)
	#isDelStatus=models.IntegerField(null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		print('1')
		if not self.doct_cons_id:
			print('2')
			self.added_by=self.last_modified_by
			print(self.last_modified_by,'3')
		print(self.last_modified_by,'4')
		return super().save(*args, **kwargs)

class agg_hhc_documents_list(models.Model):#77
	doc_li_id=models.AutoField(primary_key=True)
	professional_role=models.ForeignKey(agg_hhc_services,on_delete=models.CASCADE,null=True)  # Remane Field professional_type to professional_role # Sandip Shimpi
	Documents_name=models.CharField(max_length=50,null=True)
	isManadatory=enum.EnumField(truefalse_enum,null=True)
	gracePeriod=models.IntegerField(null=True)   # 
	status=enum.EnumField(is_delet_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.doc_li_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_doc_con(models.Model):#78
	doc_cons_presc_id=models.AutoField(primary_key=True)
	#emp_id=models.ForeignKey(agg_hhc_service_professionals,on_delete=models.CASCADE,null=True)
	presc=models.CharField(max_length=500,null=True)
	doctor=models.CharField(max_length=100,null=True)
	redg_no=models.CharField(max_length=100,null=True)
	sug=models.CharField(max_length=100,null=True)
	note=models.CharField(max_length=100,null=True)
	complaints=models.CharField(max_length=100,null=True)
	status=enum.EnumField(is_delet_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.doc_cons_presc_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_employees(models.Model):#79
	emp_id=models.AutoField(primary_key=True)
	employee_code=models.CharField(max_length=255,null=True)
	types=enum.EnumField(employee_type_enum,null=True)
	#hosp_id=models.ForeignKey(agg_hhc_hospitals,null=True)
	first_name=models.CharField(max_length=50,null=True)
	last_name=models.CharField(max_length=50,null=True)
	middle_name=models.CharField(max_length=50,null=True)
	designation=models.CharField(max_length=255,null=True)
	email_id=models.EmailField(null=True)
	password=models.CharField(max_length=255,null=True)
	mobile_no=models.IntegerField(null=True)
	dob=models.DateField(null=True)
	address=models.CharField(max_length=500,null=True)
	work_phone_no=models.IntegerField(null=True,blank=True)
	work_email_id=models.EmailField(null=True,blank=True)
	loc_id=models.IntegerField(null=True)
	qualification=models.CharField(max_length=255,null=True)
	specialization=models.CharField(max_length=255,null=True)
	work_experience=models.CharField(max_length=255,null=True)
	status=enum.EnumField(status_enum,null=True)
	avaya_agentid=models.ForeignKey(agg_hhc_avaya_extensions,on_delete=models.CASCADE,null=True)
	is_login=enum.EnumField(is_delet_enum,null=True)
	isDelStatus=models.IntegerField(null=True)
	last_login=models.DateTimeField(null=True,blank=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.emp_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_emp_spero(models.Model):#80
	emp_sp_id=models.AutoField(primary_key=True)
	fname=models.CharField(max_length=50,null=True)
	designation=models.CharField(max_length=50,null=True)
	mobile_no=models.IntegerField(null=True)
	birth_date=models.DateField(null=True)
	DOJ=models.DateField(null=True)
	status=enum.EnumField(is_delet_enum,null=True)
	bitrthday_greeting=models.CharField(max_length=200,null=True)
	anniversary_greeting=models.CharField(max_length=200,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.emp_sp_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_enquiry_follow_up(models.Model):#81
	enq_follow_up_id=models.AutoField(primary_key=True)
	event_id=models.ForeignKey(agg_hhc_events,on_delete=models.CASCADE)
	follow_up_count = models.IntegerField(null=True)                              
	# follow_up_time = models.TimeField()   
	follow_up_date_time = models.DateTimeField(null=True)
	previous_follow_up_remark = models.CharField(max_length=500)
	cancel_by = models.CharField(max_length=255,choices=follow_up_cancel_by.choices)              # Amit Rasale __ Add follow_up field
	# canclation_reason = models.CharField(max_length=255)              				# Amit Rasale __ Add follow_up field   
	canclation_reason = models.ForeignKey('agg_hhc_enquiry_follow_up_cancellation_reason', on_delete=models.CASCADE,null=True)      
	follow_up = models.CharField(max_length=255,choices=follow_up.choices)
	# follow_up_date1=models.DateField(null=True)
	# follow_up_time1=models.CharField(max_length=255,null=True)
	follow_up_desc=models.CharField(max_length=500,null=True)
	follow_up_status=enum.EnumField(status_enum,null=True)
	follow_up_next_date=models.DateField(null=True,blank=True)
	is_read_status=enum.EnumField(is_delet_enum,null=True)
	# follow_up_of=enum.EnumField(followup_of,null=True) #added for follow up from enquiry or ongoing
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.enq_follow_up_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)



class agg_hhc_service_follow_up(models.Model):#81
	srv_follow_up_id=models.AutoField(primary_key=True)
	event_id=models.ForeignKey(agg_hhc_events,on_delete=models.CASCADE)
	follow_up_count = models.IntegerField(null=True)                              
	# follow_up_time = models.TimeField()   
	follow_up_date_time = models.DateTimeField(null=True)
	previous_follow_up_remark = models.CharField(max_length=500)
	cancel_by = models.CharField(max_length=255,choices=follow_up_cancel_by.choices)              # Amit Rasale __ Add follow_up field
	# canclation_reason = models.CharField(max_length=255)              				# Amit Rasale __ Add follow_up field   
	canclation_reason = models.ForeignKey('agg_hhc_enquiry_follow_up_cancellation_reason', on_delete=models.CASCADE,null=True)    
	follow_up = models.CharField(max_length=255,choices=follow_up.choices)
	# follow_up_date1=models.DateField(null=True)
	# follow_up_time1=models.CharField(max_length=255,null=True)
	follow_up_desc=models.CharField(max_length=500,null=True)
	follow_up_status=enum.EnumField(status_enum,null=True)
	follow_up_next_date=models.DateField(null=True,blank=True)
	is_read_status=enum.EnumField(is_delet_enum,null=True)
	# follow_up_of=enum.EnumField(followup_of,null=True) #added for follow up from enquiry or ongoing
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.srv_follow_up_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)


class agg_hhc_enquiry_requirements(models.Model):#82
	enq_requi_id=models.AutoField(primary_key=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
    #event_id=models.ForeignKey(agg_hhc_events,on_delete=models.CASCADE,null=True)
    #srv_id=models.ForeignKey(agg_hhc_services,on_delete=models.CASCADE,null=True)
    #sub_srv_id=models.ForeignKey(agg_hhc_sub_services,on_delete=models.CASCADE)

	def save(self, *args, **kwargs):
		if not self.enq_requi_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_hospitals(models.Model):#83
	hosp_id=models.AutoField(primary_key=True)
	branch=models.CharField(max_length=100,null=True)
	hospital_name=models.CharField(max_length=255,null=True)
	hospital_short_code=models.CharField(max_length=5,null=True)
	phone_no=models.BigIntegerField(null=True)
	website_url=models.CharField(max_length=70,null=True)
	#loc_id=models.ForeignKey(agg_hhc_locations,on_delete=models.CASCADE)
	address=models.TextField(null=True)
	status=enum.EnumField(status_enum,null=True)
	lattitude = models.FloatField(null=True)
	langitude = models.FloatField(null=True)
	distance_km=models.IntegerField(null=True)
	price_change_km=models.IntegerField(null=True)
	km_price=models.IntegerField(null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
	
	def save(self, *args, **kwargs):
		if not self.hosp_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
    # def __str__(self):
    #     return f"{self.hosp_id}"

class agg_hhc_hospital_ips(models.Model):#84
	hosp_ips_id=models.AutoField(primary_key=True)
	#hosp_id=models.ForeignKey(agg_hhc_hospitals,on_delete=models.CASCADE,null=True)
	hospital_ip=models.CharField(max_length=240)
	status=enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.hosp_ips_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_knowledge_base_documents(models.Model):#85
	know_b_doc_id=models.AutoField(primary_key=True)
	title=models.CharField(max_length=255,null=True)
	document_file=models.CharField(max_length=255,null=True)
	status=enum.EnumField(status_enum,null=True)
	isDelStatus=models.IntegerField(null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.know_b_doc_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_recived_hospitals(models.Model):#83
	recived_hosp_id=models.AutoField(primary_key=True)
	branch=models.CharField(max_length=100,null=True)
	hospital_name=models.CharField(max_length=255,null=True)
	hospital_short_code=models.CharField(max_length=5,null=True)
	phone_no=models.IntegerField(null=True)
	website_url=models.CharField(max_length=70,null=True)
	address=models.TextField(null=True)
	status=enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
	
	def save(self, *args, **kwargs):
		if not self.recived_hosp_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
class agg_hhc_locations(models.Model):#86 locality
	loc_id=models.AutoField(primary_key=True)
	location=models.CharField(max_length=255,null=True)
	pin_code=models.CharField(max_length=240,null=True)
	status=enum.EnumField(status_enum,null=True)
	#isDelStatus=
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
    
	def save(self, *args, **kwargs):
		if not self.loc_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_log_location_for_session(models.Model):#87
	log_loc_for_session_id=models.AutoField(primary_key=True)
	#Session_id=models.ForeignKey(agg_hhc_detailed_event_plan_of_care,on_delete=models.CASCADE,null=True)
	event_by_professional=enum.EnumField(event_by_professional_enum,null=True)
	#professional_id=models.ForeignKey(agg_hhc_service_professionals,on_delete=models.CASCADE,null=True)
	latitude=models.FloatField(null=True)
	longitude=models.FloatField(null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.log_loc_for_session_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_manager_spero(models.Model):#88
	man_sp_id=models.AutoField(primary_key=True)
	Man_name=models.CharField(max_length=50,null=True)
	mob=models.IntegerField(null=True)
	status=enum.EnumField(is_delet_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.man_sp_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
"""
class agg_hhc_medicines(models.Model):#89
    med_id
    pt_id
    doctor_visit1_BP
    doctor_visit1_pulse
    doctor_visit1_temp
    doctor_visit1_SPO2
    doctor_visit1_weight
    doctor_visit1_height
    doctor_visit1_prof
    doctor_visit1_complaint
    doctor_visit1_lab
    doctor_visit1_diet
    doctor_visit1_rx
    added_by
    status
    added_date
    modify_date
    modify_by
class agg_hhc_membership_pat_basic_detail(models.Model):#90
    member_pat_b_dt_id
    pt_id
    doctor_visit1_BP
    doctor_visit1_pulse
    doctor_visit1_temp
    doctor_visit1_SPO2
    doctor_visit1_weight
    doctor_visit1_height
    doctor_visit1_prof
    doctor_visit1_complaint
    doctor_visit1_lab
    doctor_visit1_diet
    doctor_visit1_rx
    added_by
    status
    added_date
    modify_date
    modify_by

"""
class agg_hhc_modules(models.Model):#91
	module_id=models.AutoField(primary_key=True)
	module_name=models.CharField(max_length=255,null=True)
	status=enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.module_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_ongoing_remark_history(models.Model):#92
	ong_remark_his_id=models.AutoField(primary_key=True)
	#eid=models.ForeignKey(agg_hhc_employees,on_delete=models.CASCADE,null=True)
	pat_nm=models.CharField(max_length=100,null=True)
	mobile=models.IntegerField(null=True)
	remark=models.CharField(max_length=100,null=True)
	status=enum.EnumField(is_delet_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.ong_remark_his_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_payments(models.Model):#93
	pay_id=models.AutoField(primary_key=True)
	event_id=models.ForeignKey(agg_hhc_events,on_delete=models.CASCADE,null=True)
	cheque_DD_NEFT_no=models.CharField(max_length=50,null=True)
	cheque_DD_NEFT_date=models.DateField(null=True)
	party_bank_name=models.CharField(max_length=50,null=True)
	professional_name=models.CharField(max_length=50,null=True)
	Transaction_Type=models.CharField(max_length=50,null=True)
	amount = models.DecimalField(max_digits=50, decimal_places=2)
	# amount = models.CharField(max_length=240,null=True)
	types=models.CharField(max_length=50,null=True)
	Add_through=enum.EnumField(Add_through_enum,null=True)
	Card_Number=models.BigIntegerField(null=True)
	Transaction_ID=models.CharField(max_length=11,null=True)
	Comments=models.CharField(max_length=255,null=True)
	payment_receipt_no_voucher_no=models.BinaryField(null=True)
	#hosp_id=models.ForeignKey(agg_hhc_hospitals,on_delete=models.CASCADE)
	status=enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.pay_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)



class agg_hhc_payment_details(models.Model):#94
	pay_dt_id=models.AutoField(primary_key=True)
	eve_id=models.ForeignKey(agg_hhc_events,on_delete=models.CASCADE,null=True)
	srv_prof_id = models.ForeignKey(agg_hhc_service_professionals,on_delete=models.CASCADE,null=True)
	#event_requrement_id=models.ForeignKey(agg_hhc_event_requirements,on_delete=models.CASCADE,null=True)
	Total_cost=models.DecimalField(max_digits=10, decimal_places=2,null=True) # change field name amount to this by Sandip
	paid_by = models.CharField(max_length=50, null = True)    #mayank
	amount_paid = models.DecimalField(max_digits=10, decimal_places=2,null=True)    #mayank
	amount_remaining  = models.DecimalField(max_digits=10, decimal_places=2,null=True)   #mayank
	pay_recived_by= models.ForeignKey("agg_com_colleague",on_delete=models.CASCADE,null=True)
	# hosp_id=models.ForeignKey(agg_hhc_hospitals,on_delete=models.CASCADE,null=True)
	date = models.DateTimeField(auto_now_add=True, null=True)
	receipt_no = models.IntegerField(null=True)
	# is_delete_status=enum.EnumField(is_delet_enum,null=True)
	mode  = enum.EnumField(Payment_mode_enum, null=True) #mayank
	bank_name = models.CharField(max_length=200,null=True)
	cheque_number=models.CharField(max_length=200,null=True)
	cheque_status=enum.EnumField(cheque_approval_enum,null=True)
	cheque_date=models.DateField(null=True)
	card_no = models.CharField(max_length=350,null=True)
	transaction_id = models.CharField(max_length=350,null=True)
	note=models.CharField(max_length=350,null=True)
	cheque_image=models.FileField(upload_to='payment/Cheque',blank=True,null=True)# added by nikita
	order_id = models.CharField(max_length=100,null=True)
	order_currency = models.CharField(max_length=10,null=True)
	order_note = models.CharField(max_length=255, null=True, blank=True)
	customer_email = models.EmailField(max_length=100,null=True)
	customer_phone = models.CharField(max_length=20,null=True)
	payment_status=enum.EnumField(payment_status_enum,null=True)
	transaction_status = models.JSONField(null=True,blank=True)
	overall_status = models.CharField(max_length=100,null=True, blank=True)
	cf_token = models.CharField(max_length=1000,null=True, blank=True)
	online_payment_by = enum.EnumField(online_payment_by,null=True)
	payment_to_desk_date=models.DateField(null=True)
	Remark=models.CharField(max_length=5000,null=True)
	utr = models.CharField(max_length=100,null=True, blank=True)
	status=enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
	created_at = models.DateTimeField(auto_now_add=True, blank=True,null=True)

	def save(self, *args, **kwargs):
		print('demo pyament ')
		if (not self.receipt_no) and self.overall_status=='SUCCESS':
			last_receipt=agg_hhc_payment_details.objects.filter(overall_status='SUCCESS',receipt_no__isnull=False).order_by('receipt_no').last()
			# print(last_receipt)
			print(last_receipt.receipt_no, 'asdfljh')
			print(last_receipt, 'asdfljh')
			if last_receipt:
				# print(last_receipt.pay_dt_id,'asdfh"""')
				self.receipt_no=last_receipt.receipt_no + 1
			else :self.receipt_no=1
			# print(last_receipt.pay_dt_id,'hjksldfj')
			# print(last_receipt.receipt_no,'hjksldfj2')
			# print(self.receipt_no,'hjksldfj3')
		if not self.pay_dt_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)



class agg_hhc_professional_track_payment_details(models.Model):
	pay_dt_id=models.AutoField(primary_key=True)
	eve_id=models.ForeignKey(agg_hhc_events,on_delete=models.CASCADE,null=True)
	srv_prof_id = models.ForeignKey(agg_hhc_service_professionals,on_delete=models.CASCADE,null=True)
	Total_cost=models.DecimalField(max_digits=10, decimal_places=2,null=True) 
	paid_by = models.CharField(max_length=50, null = True)
	amount_paid = models.DecimalField(max_digits=10, decimal_places=2,null=True)
	amount_remaining  = models.DecimalField(max_digits=10, decimal_places=2,null=True) 
	pay_recived_by= models.ForeignKey("agg_com_colleague",on_delete=models.CASCADE,null=True)
	date = models.DateTimeField(auto_now_add=True, null=True)
	receipt_no = models.IntegerField(null=True)
	mode  = enum.EnumField(Payment_mode_enum, null=True) 
	bank_name = models.CharField(max_length=200,null=True)
	cheque_number=models.CharField(max_length=200,null=True)
	cheque_status=enum.EnumField(cheque_approval_enum,null=True)
	bank_name=models.CharField(max_length=200,null=True)
	cheque_date=models.DateField(null=True)
	card_no = models.CharField(max_length=350,null=True)
	transaction_id = models.CharField(max_length=350,null=True)
	note=models.CharField(max_length=350,null=True)
	cheque_image=models.FileField(upload_to='payment/Cheque',blank=True,null=True)
	order_id = models.CharField(max_length=100,null=True)
	order_currency = models.CharField(max_length=10,null=True)
	order_note = models.CharField(max_length=255, null=True, blank=True)
	customer_email = models.EmailField(max_length=100,null=True)
	customer_phone = models.CharField(max_length=20,null=True)
	payment_status=enum.EnumField(payment_status_enum,null=True)
	transaction_status = models.JSONField(null=True,blank=True)
	utr = models.CharField(max_length=100,null=True, blank=True)
	overall_status = models.CharField(max_length=100,null=True, blank=True)
	cf_token = models.CharField(max_length=1000,null=True, blank=True)
	online_payment_by = enum.EnumField(online_payment_by,null=True)
	Remark=models.CharField(max_length=5000,null=True)
	status=enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
	created_at = models.DateTimeField(auto_now_add=True, blank=True,null=True)



"""
class sp_payment_response(models.Model):#95
    pay_resp_id
    transaction_id
    bank_transaction_id
    order_id
    transcation_amount
    status
    transcation_type
    gateway_name
    response_code
    response_msg
    bank_name
    MID
    payment_mode
    refund_amount
    transcation_date

class sp_payment_transaction(models.Model):#96
    pay_trans_id=
    mId
    channelId
    professional_id
    mobileNo
    email
    transaction_Amount
    website
    industryTypeId
    callbackUrl
    checksumHash
    pay_status
    added_date
"""
class sp_ready_pause_history(models.Model):#97
	ready_paus_his_id=models.AutoField(primary_key=True)
	ext_no=models.CharField(max_length=10,null=True)
	#CallUniqueID=models.ForeignKey(agg_hhc_callers,on_delete=models.CASCADE,null=True)
	#user_id=models.ForeignKey(agg_hhc_incomming,on_delete=models.CASCADE,null=True) Question
	mode_status=enum.EnumField(Pause_Ready_enum,null=True)
	is_deleted=enum.EnumField(is_delet_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.ready_paus_his_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_restriction_for_session_complete(models.Model):#98
	restri_for_session_comp_id=models.AutoField(primary_key=True)
	#distance=models.IntegerField(null=True)
	duration=models.IntegerField(null=True)
	status=enum.EnumField(active_inactive_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.restri_for_session_comp_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_session(models.Model):#99
	session_id=models.AutoField(primary_key=True)
	#prof_devi_info_id=models.ForeignKey(agg_hhc_professional_device_info,on_delete=models.CASCADE,null=True)
	#srv_prof_id=models.ForeignKey(agg_hhc_service_professionals,on_delete=models.CASCADE,null=True)
	status=enum.EnumField(session_status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.session_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_sms_response(models.Model):#100
    sms_resp_id=models.AutoField(primary_key=True)
    sms_event_code=models.CharField(max_length=20,null=True,blank=True)
    sms_mobile_no=models.IntegerField(null=True)
    sms_text=models.CharField(max_length=500,null=True)
    sms_datetime=models.DateTimeField(null=True)
    sms_response=models.CharField(max_length=500,null=True)
    added_by=models.CharField(max_length=100, blank=True,null=True)
    added_date=models.DateTimeField(auto_now_add=True,null=True)
    last_modified_by=models.CharField(max_length=100, blank=True,null=True)
    last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
	



class agg_hhc_source_of_enquiry(models.Model):#101
	sor_of_enq_id=models.AutoField(primary_key=True)
	name=models.CharField(max_length=255,null=True)
	status=enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.sor_of_enq_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_specialty(models.Model):#102
	spec_id=models.AutoField(primary_key=True)
	name=models.CharField(max_length=255,null=True)
	abbreviation=models.CharField(max_length=255,null=True)
	description=models.CharField(max_length=500,null=True)
	status=enum.EnumField(status_enum,null=True)
	isDelStatus=models.IntegerField(null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.spec_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_tc_examination(models.Model):#103
	id=models.AutoField(primary_key=True)
	#event_id=models.ForeignKey(agg_hhc_events,on_delete=models.CASCADE,null=True)
	patient_id=models.ForeignKey(agg_hhc_patients,on_delete=models.CASCADE,null=True)
	pulse_beat=models.CharField(max_length=50,null=True)
	bp=models.CharField(max_length=50,null=True)
	rr=models.CharField(max_length=50,null=True)
	o2_sat=models.CharField(max_length=50,null=True)
	temp=models.CharField(max_length=50,null=True)
	abdomen=models.CharField(max_length=100,null=True)
	chest=models.CharField(max_length=100,null=True)
	extremity=models.CharField(max_length=100,null=True)
	skin=models.CharField(max_length=100,null=True)
	CNS=models.CharField(max_length=100,null=True)
	ENT=models.CharField(max_length=100,null=True)
	phy_note=models.CharField(max_length=100,null=True)
	sys_note=models.CharField(max_length=100,null=True)
	psy_note=models.CharField(max_length=100,null=True)
	status=enum.EnumField(is_delet_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_teleconsultation_enquiry(models.Model):#104
	tc_enq_id=models.AutoField(primary_key=True)
	#doc_id=models.ForeignKey(agg_hhc_service_professional,on_delete=models.CASCADE,null=True)
	#event_id=models.ForeignKey(sp_events,on_delete=models.CASCADE,null=True)
	#receiver_id=models.ForeignKey(on_delete=,null=True)Question
	receiver=enum.EnumField(reciver_enum,null=True)
	new_event=models.IntegerField(null=True)
	status=enum.EnumField(is_delet_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.tc_enq_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_user_activity(models.Model):#105
	usr_acti_id=models.AutoField(primary_key=True)
	module_type=enum.EnumField(user_admin_enum,null=True)
	#module_id=models.ForeignKey(agg_hhc_modules,on_delete=models.CASCADE,null=True)
	module_name=models.CharField(max_length=255,null=True)
	#purp_call_id=models.ForeignKey(agg_hhc_purpose,on_delete=models.CASCADE,null=True)
	#event_id=models.ForeignKey(agg_hhc_events,on_delete=models.CASCADE,null=True)
	activity_description=models.CharField(max_length=500,null=True)
	added_by_type=enum.EnumField(added_by_type_enum,null=True)
	#added_by_id=models.ForeignKey(agg_hhc_employee,on_delete=models.CASCADE,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
	
	def save(self, *args, **kwargs):
		if not self.usr_acti_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
	
class agg_hhc_vc_diagnosis(models.Model):#106
	uvc_diagno_id=models.AutoField(primary_key=True)
	#event_id=models.ForeignKey(agg_hhc_events,on_delete=models.CASCADE,null=True)
	agg_sp_pt_id=models.ForeignKey(agg_hhc_patients,on_delete=models.CASCADE,null=True)
	diagno=models.CharField(max_length=500,null=True)
	phy_assessment=models.CharField(max_length=100,null=True)
	status=enum.EnumField(is_delet_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.uvc_diagno_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs) 

class agg_hhc_vc_fam_his(models.Model):#107
	vc_fam_his_id=models.AutoField(primary_key=True)
	#event_id=models.ForeignKey(agg_hhc_events,on_delete=models.CASCADE,null=True)
	agg_sp_pt_id=models.ForeignKey(agg_hhc_patients,on_delete=models.CASCADE,null=True)
	PH_mother=models.CharField(max_length=50,null=True)
	PH_father=models.CharField(max_length=50,null=True)
	note=models.CharField(max_length=100,null=True)
	status=enum.EnumField(is_delet_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.vc_fam_his_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_vc_investigation(models.Model):#108
	vc_inve_id=models.AutoField(primary_key=True)
	#event_id=models.ForeignKey(agg_hhc_events,on_delete=models.CASCADE,null=True)
	#agg_sp_pt_id=models.ForeignKey(agg_hhc_patients,on_delete=models.CASCADE,null=True)
	lab=models.CharField(max_length=100,null=True)
	MRI=models.CharField(max_length=100,null=True)
	CT_scan=models.CharField(max_length=100,null=True)
	USG=models.CharField(max_length=100,null=True)
	Xray=models.CharField(max_length=100,null=True)
	ECG=models.CharField(max_length=100,null=True)
	status=enum.EnumField(is_delet_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.vc_inve_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_vc_med_his(models.Model):#109
	vc_med_his_id=models.AutoField(primary_key=True)
	#event_id=models.ForeignKey(agg_hhc_events,on_delete=models.CASCADE,null=True)
	#agg_sp_pt_id=models.ForeignKey(agg_hhc_patients,on_delete=models.CASCADE,null=True)
	que1=models.CharField(max_length=100,null=True)
	que2=models.CharField(max_length=100,null=True)
	que3=models.CharField(max_length=100,null=True)
	que4=models.CharField(max_length=100,null=True)
	que5=models.CharField(max_length=100,null=True)
	que6=models.CharField(max_length=100,null=True)
	status=enum.EnumField(is_delet_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.vc_med_his_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class sp_vc_prescription(models.Model):#110
	vc_prescri_id=models.AutoField(primary_key=True)
	#event_id=models.ForeignKey(agg_hhc_events,on_delete=models.CASCADE,null=True)
	#agg_sp_pt_id=models.ForeignKey(agg_hhc_patients,on_delete=models.CASCADE,null=True)
	medicine=models.CharField(max_length=500,null=True)
	remark=models.CharField(max_length=100,null=True)
	mod_date=models.DateTimeField(null=True,blank=True)
	status=enum.EnumField(is_delet_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.vc_prescri_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_video_consulting(models.Model):#111
	vc_conslt_id=models.AutoField(primary_key=True)
	#event_id=models.ForeignKey(agg_hhc_events,on_delete=models.CASCADE,null=True)
	#agg_sp_pt_id=models.ForeignKey(agg_hhc_patients,on_delete=models.CASCADE,null=True)
	#prof_id=models.ForeignKey(null=True)
	room_id=models.CharField(max_length=100,null=True)
	app_date=models.DateTimeField(null=True)
	app_time=models.CharField(max_length=100,null=True)
	status=enum.EnumField(is_delet_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.vc_conslt_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
    
class agg_hhc_gender(models.Model):#112
	gender_id=models.AutoField(primary_key=True)
	name=models.CharField(max_length=20,null=True)
	status=enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.gender_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
	

#_____________________________________Android Application_________________#

class agg_hhc_app_add_address(models.Model):
	address_id = models.AutoField(primary_key=True)
	address = models.CharField(max_length=1500, null=True)
	google_address = models.CharField(max_length=1040,null=True)
	city_id = models.ForeignKey("agg_hhc_city",on_delete=models.CASCADE,null=True)
	locality = models.CharField(max_length=1250, null=True)
	state_id = models.ForeignKey("agg_hhc_state",on_delete=models.CASCADE,null=True)
	prof_zone_id=models.ForeignKey("agg_hhc_professional_zone",on_delete=models.CASCADE,null=True)
	pincode = models.CharField(max_length=250, null=True,blank=True)
	Address_type = models.CharField(max_length=250, null=True)
	#app_call_reg_id = models.ForeignKey(agg_hhc_app_caller_register, on_delete=models.SET_NULL,null=True)
	caller_id=models.ForeignKey(agg_hhc_callers,on_delete=models.CASCADE,null=True)
	status = enum.EnumField(status_enum,null=True)
	patient_id=models.ForeignKey(agg_hhc_patients,on_delete=models.CASCADE,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.address_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
	
class agg_hhc_patient_documents(models.Model):
	doc_id = models.AutoField(primary_key=True)
	agg_sp_pt_id = models.ForeignKey('agg_hhc_patients',null=True, on_delete=models.CASCADE)
	eve_id = models.ForeignKey("agg_hhc_events",on_delete=models.CASCADE,null=True)
	discharge_summary=models.FileField(upload_to="Patient_documents/",null=True)
	prescription=models.FileField(upload_to="Patient_documents/",null=True)
	lab_reports=models.FileField(upload_to="Patient_documents/",null=True)
	dressing=models.FileField(upload_to="Patient_documents/",null=True)
	verification_status = enum.EnumField(Leave_status_enum,null=True)
	status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.doc_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_state(models.Model):
	state_id=models.AutoField(primary_key=True)
	state_name=models.CharField(max_length=100,null=True,unique=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.state_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
	# def __str__(self):
	# 	return f"{self.state_name}"


#class agg_hhc_city(models.Model):
#	city_id=models.AutoField(primary_key=True)
#	city_name=models.CharField(max_length=255,null=True)
	

class agg_hhc_pincode(models.Model):
	pincode_id=models.AutoField(primary_key=True)
	state_name=models.ForeignKey('agg_hhc_state',on_delete=models.CASCADE,null=True,to_field='state_name')
	city_id=models.ForeignKey('agg_hhc_city',on_delete=models.CASCADE,null=True,to_field='city_name')
	pincode_number=models.PositiveIntegerField(null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.pincode_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_professional_zone(models.Model):#53 Zones 
	prof_zone_id=models.AutoField(primary_key=True)
	city_id=models.ForeignKey('agg_hhc_city',on_delete=models.CASCADE,null=True)
	#prof_srv_id=models.ForeignKey(agg_hhc_professional_services,on_delete=models.CASCADE,null=True)
	Name=models.CharField(max_length=50,null=True,unique=True)
	midpoint_latitude=models.FloatField(null=True)
	midpoint_longitude=models.FloatField(null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
	def __str__(self):
		return f'{self.prof_zone_id , self.Name}'
	
	def save(self, *args, **kwargs):
		if not self.prof_zone_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
	
class agg_hhc_professional_Denial_reason_list(models.Model):
	Reason_lst_id=models.AutoField(primary_key=True)
	reason=models.CharField(max_length=300,null=True)
	status=enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.Reason_lst_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)


class  agg_hhc_professional_Denial_reason(models.Model):
	Denial_reason_id=models.AutoField(primary_key=True)
	srv_prof_id=models.ForeignKey('agg_hhc_service_professionals',on_delete=models.CASCADE,null=True)
	Reason_lst_id=models.ForeignKey("agg_hhc_professional_Denial_reason_list",on_delete=models.CASCADE,null=True)
	eve_id=models.ForeignKey("agg_hhc_events",on_delete=models.CASCADE,null=True)
	reason_note=models.TextField(null=True)
	status=enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.Denial_reason_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
	
class agg_hhc_coupon_codes(models.Model):
	coupon_id=models.AutoField(primary_key=True)
	coupon_code=models.CharField(max_length=200,null=True)
	coupon_code_discount_Percentage=models.IntegerField(null=True)
	coupon_code_status=enum.EnumField(status_enum,null=True)
	is_used = enum.EnumField(is_delet_enum)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.coupon_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)


# -----------------------------------------Nikita P--------------------------------------
class agg_hhc_jobclosure_form_numbering(models.Model):
	jc_form_id = models.AutoField(primary_key = True)
	prof_sub_srv_id = models.ForeignKey('agg_hhc_sub_services',on_delete=models.CASCADE,null=True)
	form_number = models.IntegerField(null=True)
	status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.jc_form_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

# class agg_hhc_jobclosure_detail(models.Model):#35
# 	jcolse_id = models.AutoField(primary_key = True)
# 	srv_prof_id=models.ForeignKey('agg_hhc_service_professionals',on_delete=models.CASCADE,null=True)
# 	dtl_eve_id = models.ForeignKey(agg_hhc_detailed_event_plan_of_care,on_delete = models.CASCADE, null=True)
# 	prof_sub_srv_id = models.ForeignKey('agg_hhc_sub_services',on_delete=models.CASCADE,null=True)
# 	Baseline = enum.EnumField(baseline_enum,null=True)
# 	Airway = enum.EnumField(airway_enum,null=True)
# 	Breathing = enum.EnumField(breathing_enum,null=True)
# 	Circulation = enum.EnumField(Circulation_enum,null=True)
# 	Skin_Perfusion = enum.EnumField(Skin_Perfusion_enum,null=True)
# 	Wound = enum.EnumField(Wound_enum,null=True)
# 	Oozing = enum.EnumField(Oozing_enum,null=True)
# 	Discharge = enum.EnumField(Discharge_enum,null=True)
# 	Inj_site_IM = enum.EnumField(Inj_site_IM_enum,null=True)
# 	Procedure = enum.EnumField(Procedure_enum,null=True)
# 	Size_catheter = models.IntegerField(null=True)
# 	Size_RT = models.IntegerField(null=True)
# 	Temp_core = models.FloatField(null=True)
# 	TBSL = models.IntegerField(null=True)
# 	Pulse = models.IntegerField(null=True)
# 	SpO2 = models.FloatField(null=True)
# 	RR = models.IntegerField(null=True)
# 	GCS_Total = models.IntegerField(null=True)
# 	BP = models.IntegerField(null=True)
# 	Remark = models.CharField(max_length=200,null=True)
# 	Name_injection_fld = models.CharField(max_length=200,null=True)
# 	Dose_freq = models.CharField(max_length=200,null=True)
# 	Num_Sutures_staples = models.CharField(max_length=200,null=True)
# 	Dressing_status = enum.EnumField(Dressing_enum,null=True)
# 	Catheter_type = enum.EnumField(Catheter_enum,null=True)
# 	Sutures_type = enum.EnumField(Sutures_enum,null=True)
# 	Wound_dehiscence = enum.EnumField(yes_no_enum, blank=True, null=True)
# 	Strength_exer = enum.EnumField(yes_no_enum, blank=True, null=True)
# 	Stretch_exer = enum.EnumField(yes_no_enum, blank=True, null=True)
# 	Walk_indep = enum.EnumField(yes_no_enum, blank=True, null=True)
# 	Walker_stick = enum.EnumField(yes_no_enum, blank=True, null=True)
# 	Movin_or_moveout = enum.EnumField(yes_no_enum, blank=True, null=True)
# 	Mobin_or_moveout_datetime_remark = models.CharField(max_length=200,null=True)
# 	Getin_or_getout = enum.EnumField(yes_no_enum, blank=True, null=True)
# 	Getin_or_getout_datetime_remark = models.CharField(max_length=200,null=True)
# 	ChairTobed_or_bedTochair = enum.EnumField(yes_no_enum, blank=True, null=True)
# 	ChairTobed_or_bedTochair_datetime_remark = models.CharField(max_length=200,null=True)
# 	Situp_onbed = enum.EnumField(yes_no_enum, blank=True, null=True)
# 	Situp_onbed_datetime_remark = models.CharField(max_length=200,null=True)
# 	Unocp_or_ocp_bed = enum.EnumField(yes_no_enum, blank=True, null=True)
# 	Unocp_or_ocp_bed_datetime_remark = models.CharField(max_length=200,null=True)
# 	Showershampoo = enum.EnumField(yes_no_enum, blank=True, null=True)
# 	Showershampoo_datetime_remark = models.CharField(max_length=200,null=True)
# 	Incontinent_care = enum.EnumField(yes_no_enum, blank=True, null=True)
# 	Incontinent_care_datetime_remark = models.CharField(max_length=200,null=True)
# 	Mouth_care = enum.EnumField(yes_no_enum, blank=True, null=True)
# 	Mouth_care_datetime_remark = models.CharField(max_length=200,null=True)
# 	Shaving = enum.EnumField(yes_no_enum, blank=True, null=True)
# 	Shaving_datetime_remark = models.CharField(max_length=200,null=True)
# 	Hand_care = enum.EnumField(yes_no_enum, blank=True, null=True)
# 	Hand_care_datetime_remark = models.CharField(max_length=200,null=True)
# 	Foot_care = enum.EnumField(yes_no_enum, blank=True, null=True)
# 	Foot_care_datetime_remark = models.CharField(max_length=200,null=True)
# 	Vital_care = enum.EnumField(yes_no_enum, blank=True, null=True)
# 	vital_care_datetime_remark = models.CharField(max_length=200,null=True)
# 	motion_care = enum.EnumField(yes_no_enum, blank=True, null=True)
# 	motion_care_datetime_remark = models.CharField(max_length=200,null=True)
# 	Grooming = enum.EnumField(yes_no_enum, blank=True, null=True)
# 	Grooming_datetime_remark = models.CharField(max_length=200,null=True)
# 	Bed_bath = enum.EnumField(yes_no_enum, blank=True, null=True)
# 	Bed_bath_datetime_remark = models.CharField(max_length=200,null=True)
# 	Feeding = enum.EnumField(yes_no_enum, blank=True, null=True)
# 	Feeding_datetime_remark = models.CharField(max_length=200,null=True)
# 	Reposition_patient = enum.EnumField(yes_no_enum, blank=True, null=True)
# 	Reposition_patient_datetime_remark = models.CharField(max_length=200,null=True)
# 	Bed_pan = enum.EnumField(yes_no_enum, blank=True, null=True)
# 	Bed_pan_datetime_remark = models.CharField(max_length=200,null=True)
# 	added_by_type = enum.EnumField(reg_source_enum,null=True)
# 	status = enum.EnumField(status_enum,null=True)
# 	added_by=models.CharField(max_length=100, blank=True,null=True)
# 	added_date=models.DateTimeField(auto_now_add=True,null=True)
# 	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
# 	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

# 	def save(self, *args, **kwargs):
# 		if not self.jcolse_id:
# 			self.added_by=self.last_modified_by
# 		return super().save(*args, **kwargs)

class agg_hhc_jobclosure_detail(models.Model):#35
	jcolse_id = models.AutoField(primary_key = True)
	srv_prof_id=models.ForeignKey('agg_hhc_service_professionals',on_delete=models.CASCADE,null=True)
	dtl_eve_id = models.ForeignKey(agg_hhc_detailed_event_plan_of_care,on_delete = models.CASCADE, null=True)
	prof_sub_srv_id = models.ForeignKey('agg_hhc_sub_services',on_delete=models.CASCADE,null=True)
	Baseline = enum.EnumField(baseline_enum,null=True,blank=True)
	Airway = enum.EnumField(airway_enum,null=True,blank=True)
	Breathing = enum.EnumField(breathing_enum,null=True,blank=True)
	Circulation = enum.EnumField(Circulation_enum,null=True,blank=True)
	Skin_Perfusion = enum.EnumField(Skin_Perfusion_enum,null=True,blank=True)
	Wound = enum.EnumField(Wound_enum,null=True,blank=True)
	Oozing = enum.EnumField(Oozing_enum,null=True,blank=True)
	Discharge = enum.EnumField(Discharge_enum,null=True,blank=True)
	Inj_site_IM = enum.EnumField(Inj_site_IM_enum,null=True,blank=True)
	Procedure = enum.EnumField(Procedure_enum,null=True,blank=True)
	Size_catheter = models.IntegerField(null=True,blank=True)
	Size_RT = models.IntegerField(null=True,blank=True)
	Temp_core = models.FloatField(null=True,blank=True)
	TBSL = models.IntegerField(null=True,blank=True)
	Pulse = models.IntegerField(null=True,blank=True)
	SpO2 = models.FloatField(null=True,blank=True)
	RR = models.IntegerField(null=True,blank=True)
	GCS_Total = models.IntegerField(null=True,blank=True)
	BP = models.IntegerField(null=True,blank=True)
	diastolic = models.IntegerField(null=True,blank=True)
	Remark = models.CharField(max_length=200,null=True,blank=True)
	Name_injection_fld = models.CharField(max_length=200,null=True,blank=True)
	Dose_freq = models.CharField(max_length=200,null=True,blank=True)
	Num_Sutures_staples = models.CharField(max_length=200,null=True,blank=True)
	Dressing_status = enum.EnumField(Dressing_enum,null=True,blank=True)
	Catheter_type = enum.EnumField(Catheter_enum,null=True,blank=True)
	Sutures_type = enum.EnumField(Sutures_enum,null=True,blank=True)
	Wound_dehiscence = enum.EnumField(yes_no_enum, blank=True, null=True)
	Strength_exer = enum.EnumField(yes_no_enum, blank=True, null=True)
	Stretch_exer = enum.EnumField(yes_no_enum, blank=True, null=True)
	is_patient_death = enum.EnumField(yes_no_enum, blank=True, null=True)
	Walk_indep = enum.EnumField(yes_no_enum, blank=True, null=True)
	Walker_stick = enum.EnumField(yes_no_enum, blank=True, null=True)
	Movin_or_moveout = enum.EnumField(yes_no_enum, blank=True, null=True)
	Mobin_or_moveout_datetime_remark = models.CharField(max_length=200,null=True,blank=True)
	Getin_or_getout = enum.EnumField(yes_no_enum, blank=True, null=True)
	Getin_or_getout_datetime_remark = models.CharField(max_length=200,null=True,blank=True)
	ChairTobed_or_bedTochair = enum.EnumField(yes_no_enum, blank=True, null=True)
	ChairTobed_or_bedTochair_datetime_remark = models.CharField(max_length=200,null=True,blank=True)
	Situp_onbed = enum.EnumField(yes_no_enum, blank=True, null=True)
	Situp_onbed_datetime_remark = models.CharField(max_length=200,null=True,blank=True)
	Unocp_or_ocp_bed = enum.EnumField(yes_no_enum, blank=True, null=True)
	Unocp_or_ocp_bed_datetime_remark = models.CharField(max_length=200,null=True,blank=True)
	Showershampoo = enum.EnumField(yes_no_enum, blank=True, null=True)
	Showershampoo_datetime_remark = models.CharField(max_length=200,null=True,blank=True)
	Incontinent_care = enum.EnumField(yes_no_enum, blank=True, null=True)
	Incontinent_care_datetime_remark = models.CharField(max_length=200,null=True,blank=True)
	Mouth_care = enum.EnumField(yes_no_enum, blank=True, null=True)
	Mouth_care_datetime_remark = models.CharField(max_length=200,null=True,blank=True)
	Shaving = enum.EnumField(yes_no_enum, blank=True, null=True)
	Shaving_datetime_remark = models.CharField(max_length=200,null=True,blank=True)
	Hand_care = enum.EnumField(yes_no_enum, blank=True, null=True)
	Hand_care_datetime_remark = models.CharField(max_length=200,null=True,blank=True)
	Foot_care = enum.EnumField(yes_no_enum, blank=True, null=True)
	Foot_care_datetime_remark = models.CharField(max_length=200,null=True)
	Vital_care = enum.EnumField(yes_no_enum, blank=True, null=True)
	vital_care_datetime_remark = models.CharField(max_length=200,null=True,blank=True)
	motion_care = enum.EnumField(yes_no_enum, blank=True, null=True)
	motion_care_datetime_remark = models.CharField(max_length=200,null=True,blank=True)
	Grooming = enum.EnumField(yes_no_enum, blank=True, null=True)
	Grooming_datetime_remark = models.CharField(max_length=200,null=True,blank=True)
	Bed_bath = enum.EnumField(yes_no_enum, blank=True, null=True)
	Bed_bath_datetime_remark = models.CharField(max_length=200,null=True,blank=True)
	Feeding = enum.EnumField(yes_no_enum, blank=True, null=True)
	Feeding_datetime_remark = models.CharField(max_length=200,null=True,blank=True)
	Reposition_patient = enum.EnumField(yes_no_enum, blank=True, null=True)
	Reposition_patient_datetime_remark = models.CharField(max_length=200,null=True,blank=True)
	Bed_pan = enum.EnumField(yes_no_enum, blank=True, null=True)
	Bed_pan_datetime_remark = models.CharField(max_length=200,null=True,blank=True)
	added_by_type = enum.EnumField(reg_source_enum,null=True,blank=True)
	status = enum.EnumField(status_enum,null=True,blank=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True,blank=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.jcolse_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
#___________________JWT_tables-------------------------------  


class agg_mas_group(models.Model):
	grp_id = models.AutoField(primary_key=True, auto_created=True)
	grp_name = models.CharField(max_length=30, null=True)
	grp_code = models.CharField(max_length=15, null=True)
	grp_level = enum.EnumField(level, null=True)
	grp_parent = models.CharField(max_length=15, null=True)
	grp_status = enum.EnumField(status_enum, null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def __str__(self):
		return '%s' %(self.grp_id)
	
	def save(self, *args, **kwargs):
		if not self.grp_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)




# Custom User Manager
class agg_colleague_manager(BaseUserManager):

    def create_user(self, clg_ref_id, clg_first_name, clg_mid_name ,clg_last_name ,grp_id , clg_email ,clg_mobile_no ,clg_gender ,clg_address ,clg_is_login ,clg_designation ,clg_state ,clg_division ,clg_district ,clg_break_type ,clg_senior ,clg_hos_id ,clg_agency_id ,clg_status ,added_by ,last_modified_by ,clg_Date_of_birth ,clg_Work_phone_number ,clg_work_email_id ,clg_Emplyee_code ,clg_qualification,clg_avaya_agentid ,clg_Aadhar_no,clg_specialization ,clg_profile_photo_path ,clg_joining_date ,clg_marital_status, clg_otp, clg_otp_count, clg_otp_expire_time, password=None, password2=None):

        """
        Creates and saves a User with the given email, name, tc and password.
        """
        if not clg_ref_id:
            raise ValueError('User must have an user id')

        user = self.model(
            clg_email=self.normalize_email(clg_email),
            clg_ref_id = clg_ref_id,
            clg_Emplyee_code = clg_Emplyee_code,
            clg_hos_id = clg_hos_id,
            clg_avaya_agentid = clg_avaya_agentid,
            clg_agency_id = clg_agency_id,
            clg_first_name = clg_first_name,
            clg_mid_name = clg_mid_name, 
            clg_last_name = clg_last_name,
            grp_id = grp_id,
            clg_mobile_no = clg_mobile_no,
            clg_Work_phone_number = clg_Work_phone_number,
            clg_work_email_id = clg_work_email_id,
            clg_gender = clg_gender,
            clg_Date_of_birth = clg_Date_of_birth,
            clg_designation = clg_designation,
            clg_qualification = clg_qualification,
            clg_specialization = clg_specialization,
            clg_senior = clg_senior,
            clg_address = clg_address,
            clg_state = clg_state,
            clg_division = clg_division,
            clg_district = clg_district,
            clg_is_login = clg_is_login,
            clg_break_type = clg_break_type,
            clg_Aadhar_no = clg_Aadhar_no,
            clg_profile_photo_path = clg_profile_photo_path,
            clg_joining_date = clg_joining_date,
            clg_status = clg_status,
            clg_marital_status = clg_marital_status,
			clg_otp = clg_otp,
			clg_otp_count = clg_otp_count,
			clg_otp_expire_time = clg_otp_expire_time,
            added_by = added_by ,
            last_modified_by = last_modified_by
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, clg_ref_id, clg_first_name, clg_mid_name ,clg_last_name, grp_id ,clg_email ,clg_mobile_no ,clg_gender ,clg_address ,clg_is_login ,clg_designation ,clg_state ,clg_division ,clg_district ,clg_break_type ,clg_senior ,clg_hos_id ,clg_agency_id ,clg_status ,added_by ,last_modified_by ,clg_Date_of_birth ,clg_Work_phone_number ,clg_work_email_id ,clg_Emplyee_code ,clg_qualification,clg_avaya_agentid ,clg_Aadhar_no,clg_specialization, clg_profile_photo_path ,clg_joining_date ,clg_marital_status, clg_otp, clg_otp_count, clg_otp_expire_time, password=None):

        """Creates and saves a superuser with the given email, name, tc and password."""
        user = self.create_user(
            clg_email=clg_email,
            password=password,
            clg_ref_id = clg_ref_id,
            clg_Emplyee_code = clg_Emplyee_code,
            clg_hos_id = clg_hos_id,
            clg_avaya_agentid = clg_avaya_agentid,
            clg_agency_id = clg_agency_id,
            clg_first_name = clg_first_name,
            clg_mid_name = clg_mid_name, 
            clg_last_name = clg_last_name,
            grp_id = grp_id,
            clg_mobile_no = clg_mobile_no,
            clg_Work_phone_number = clg_Work_phone_number,
            clg_work_email_id = clg_work_email_id,
            clg_gender = clg_gender,
            clg_Date_of_birth = clg_Date_of_birth,
            clg_designation = clg_designation,
            clg_qualification = clg_qualification,
            clg_specialization = clg_specialization,
            clg_senior = clg_senior,
            clg_address = clg_address,
            clg_state = clg_state,
            clg_division = clg_division,
            clg_district = clg_district,
            clg_is_login = clg_is_login,
            clg_break_type = clg_break_type,
            clg_Aadhar_no = clg_Aadhar_no,
            clg_profile_photo_path = clg_profile_photo_path,
            clg_joining_date = clg_joining_date,
            clg_status = clg_status,
            clg_marital_status = clg_marital_status,
			clg_otp = clg_otp,
			clg_otp_count = clg_otp_count,
			clg_otp_expire_time = clg_otp_expire_time,
            added_by = added_by ,
            last_modified_by = last_modified_by
        )

        user.is_admin = True
        user.save(using=self._db)
        return user

class agg_com_colleague(AbstractBaseUser):
	# clg_id = models.AutoField(primary_key=True, auto_created=True)
	clg_ref_id = models.CharField(max_length=100,unique=True, null=True, blank=True)
	clg_email = models.EmailField(
		# verbose_name='email address',
		max_length=255,
		unique=True,
		null= True,
		blank=True
	)
	clg_work_email_id =	models.EmailField(max_length=100, null=True, blank=True)
	clg_hos_id = models.ForeignKey(agg_hhc_hospitals,on_delete=models.CASCADE,null=True, blank=True)
	clg_agency_id =	models.IntegerField(null=True, blank=True)
	clg_Emplyee_code =	models.CharField(max_length=100, null=True, blank=True)
	clg_avaya_agentid =	models.IntegerField(null=True, blank=True)
	clg_first_name = models.CharField(max_length=115, null=True, blank=True)
	clg_mid_name =	models.CharField(max_length=115, null=True, blank=True)
	clg_last_name =	models.CharField(max_length=115, null=True, blank=True)
	# grp_id = models.CharField(max_length=12,null=True)
	grp_id = models.ForeignKey(agg_mas_group,related_name='clg_group', on_delete=models.CASCADE, null=True, default=None, blank=True)
	clg_gender = models.CharField(max_length=15, null=True, blank=True)
	clg_mobile_no =	models.BigIntegerField(null=True, blank=True)
	clg_Work_phone_number =	models.BigIntegerField(null=True, blank=True)
	clg_Date_of_birth =	models.DateField(null=True, blank=True)
	clg_Aadhar_no =	models.BigIntegerField(null=True, blank=True)
	clg_designation = models.CharField(max_length=100, null=True, blank=True)
	clg_qualification =	models.CharField(max_length=100, null=True, blank=True)
	clg_specialization = models.CharField(max_length=100, null=True, blank=True)
	clg_address = models.CharField(max_length=100, null=True, blank=True)
	clg_state =	models.IntegerField(null=True, blank=True)
	clg_division =	models.IntegerField(null=True, blank=True)
	clg_district =	models.IntegerField(null=True, blank=True)
	clg_senior = models.CharField(max_length=15, null=True, blank=True)
	clg_break_type = models.IntegerField(null=True, blank=True)
	clg_status = models.CharField(max_length=100, default=True, null=True, blank=True)    
	clg_profile_photo_path = models.CharField(max_length=100, null=True, blank=True)
	clg_joining_date =	models.CharField(max_length=30, null=True, blank=True)
	clg_marital_status = models.CharField(max_length=100, null=True, blank=True)
	clg_otp =	models.IntegerField(null=True, blank=True)
	clg_otp_count =	models.IntegerField(default=0,null=False, blank=True)
	clg_otp_expire_time =	models.DateTimeField(null=True, blank=True)
	is_active = models.BooleanField(default=True, blank=True)
	clg_is_login =	models.BooleanField(default=False, blank=True)
	is_admin = models.BooleanField(default=False, blank=True)
	created_at = models.DateTimeField(auto_now_add=True, blank=True)
	updated_at = models.DateTimeField(auto_now=True, blank=True)
	# clg_added_by =	models.IntegerField(null=True, blank=True)
	# clg_added_date = models.DateField(auto_now_add=True, blank=True)
	# clg_modify_by =	models.IntegerField(null=True, blank=True)
	# clg_modify_date = models.DateField(auto_now=True, null=True, blank=True)

	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	username = None
	email = None

	objects = agg_colleague_manager()

	EMAIL_FIELD = 'clg_email'
	GROUP_FIELD = 'grp_id'


	USERNAME_FIELD = 'clg_ref_id'


	REQUIRED_FIELDS = ['grp_id','clg_first_name', 'clg_mid_name' ,'clg_last_name' ,'clg_email' ,'clg_mobile_no', 'clg_gender' ,'clg_address' ,'clg_is_login' ,'clg_designation' ,'clg_state' ,'clg_division' ,'clg_district' ,'clg_break_type' ,'clg_senior' ,'clg_hos_id' ,'clg_agency_id' ,'clg_status' ,'added_by' ,'last_modified_by' ,'clg_Date_of_birth' ,'clg_Work_phone_number' ,'clg_work_email_id' ,'clg_Emplyee_code' ,'clg_qualification','clg_avaya_agentid' ,'clg_Aadhar_no','clg_specialization', 'clg_profile_photo_path' ,'clg_joining_date' ,'clg_marital_status', 'clg_otp', 'clg_otp_count', 'clg_otp_expire_time']

	# REQUIRED_FIELDS = ['grp_id','clg_first_name', 'clg_mid_name' ,'clg_last_name' ,'clg_email' ,'clg_mobile_no', 'clg_gender' ,'clg_address' ,'clg_is_login' ,'clg_designation' ,'clg_state' ,'clg_division' ,'clg_district' ,'clg_break_type' ,'clg_senior' ,'clg_hos_id' ,'clg_agency_id' ,'clg_status' ,'clg_added_by' ,'clg_modify_by' ,'clg_Date_of_birth' ,'clg_Work_phone_number' ,'clg_work_email_id' ,'clg_Emplyee_code' ,'clg_qualification','clg_avaya_agentid' ,'clg_Aadhar_no','clg_specialization', 'clg_profile_photo_path' ,'clg_joining_date' ,'clg_marital_status', 'clg_otp', 'clg_otp_count', 'clg_otp_expire_time']


	def __str__(self):
		return str(self.clg_ref_id)

	def has_perm(self, perm, obj=None):
		"Does the user have a specific permission?"
		# Simplest possible answer: Yes, always
		return self.is_admin

	def has_module_perms(self, app_label):
		"Does the user have permissions to view the app `app_label`?"
		# Simplest possible answer: Yes, always
		return True

	@property
	def is_staff(self):
		"Is the user a member of staff?"
		# Simplest possible answer: All admins are staff
		return self.is_admin
    
class agg_hhc_enquiry_follow_up_cancellation_reason(models.Model):
	cancelation_reason_id = models.AutoField(primary_key=True)
	cancelation_reason = models.CharField(max_length=300,null=True)
	cancel_by_id= enum.EnumField(cancel_from,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)#
	# added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.cancelation_reason_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

#------------------------------------(this is used to store professional , and patient feedback )----------------------------------------------------------------------------
class agg_hhc_Professional_app_feedback(models.Model):
	feedbk_id = models.AutoField(primary_key=True)
	srv_prof_id = models.ForeignKey('agg_hhc_service_professionals',on_delete=models.CASCADE,null=True)
	#pt_id = models.ForeignKey('agg_hhc_patients',on_delete=models.CASCADE,null=True)
	eve_id = models.ForeignKey(agg_hhc_events,on_delete=models.CASCADE,null=True)
	rating =models.CharField(max_length=200,blank=True,null=True)#Answer yes no
	q1 = models.ForeignKey('FeedBack_Questions',on_delete=models.CASCADE,null=True)
	feedback_by=enum.EnumField(professional_types_enum,null=True)
	feedbk_med_id=models.ForeignKey('agg_hhc_feedback_media_note',on_delete=models.CASCADE,null=True)
	status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
	def save(self, *args, **kwargs):
		if not self.feedbk_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_feedback_media_note(models.Model):
	feedbk_med_id = models.AutoField(primary_key=True)
	eve_id = models.ForeignKey(agg_hhc_events,on_delete=models.CASCADE,null=True)
	image = models.FileField(upload_to='Patient_feedback/', blank=True,null = True)
	vedio = models.FileField(upload_to='Patient_feedback/',blank=True,null = True)
	audio = models.FileField(upload_to='Patient_feedback/', blank=True,null = True)
	feedback_by=enum.EnumField(professional_types_enum,null=True)
	additional_comment=models.CharField(max_length=9000, blank=True,null=True)
	status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
	def save(self, *args, **kwargs):
		if not self.feedbk_med_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
#__________________________--Feedback Questions for professional and patient--_____________________

class FeedBack_Questions(models.Model):
	F_questions = models.AutoField(primary_key=True)
	Question_eng = models.TextField(null=True)
	Question_hin = models.TextField(null=True)
	Question_mar = models.TextField(null=True)
	question_for = enum.EnumField(feedback_question, null=True)
	status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.F_questions:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)




# ------------------- cancellation request Model added by Vinayak ------------------------



# class agg_hhc_cancellation_request(models.Model):
# 	canc_req_id = models.AutoField(primary_key=True)
# 	eve_id = models.ForeignKey(agg_hhc_events,on_delete = models.CASCADE, null=True)
# 	epoc_id = models.ForeignKey(agg_hhc_event_plan_of_care,on_delete = models.CASCADE, null=True)
# 	dtl_eve_id = models.ForeignKey(agg_hhc_detailed_event_plan_of_care,on_delete = models.CASCADE, null=True)
# 	is_canceled = enum.EnumField(yes_no_enum, null=True)
# 	is_srv_sesn = enum.EnumField(is_srv_sesn, null=True)
# 	cncel_req_resson = models.CharField( max_length=100, null =True, blank=True)
# 	is_deleted = enum.EnumField(is_delet_enum, null=True)
# 	added_date= models.DateTimeField(null=True)
# 	added_by = models.ForeignKey(agg_com_colleague, to_field='clg_ref_id', on_delete=models.CASCADE, null=True)
# 	last_modify_date=models.DateTimeField(default=timezone.now,null=True)
# 	last_modified_by=models.BigIntegerField(null=True)



class agg_hhc_cancellation_and_reschedule_request(models.Model):
	req_id = models.AutoField(primary_key=True)
	eve_id = models.ForeignKey(agg_hhc_events,on_delete = models.CASCADE, null=True)
	epoc_id = models.ForeignKey(agg_hhc_event_plan_of_care,on_delete = models.CASCADE, null=True)
	dtl_eve_id = models.ForeignKey(agg_hhc_detailed_event_plan_of_care,on_delete = models.CASCADE, null=True)
	srv_prof_id=models.ForeignKey(agg_hhc_service_professionals,on_delete=models.CASCADE,null=True)
	agg_sp_pt_id=models.ForeignKey(agg_hhc_patients,on_delete=models.CASCADE,null=True)
	is_canceled = enum.EnumField(yes_no_enum2, null=True)
	is_srv_sesn = enum.EnumField(is_srv_sesn, null=True)
	is_reschedule = enum.EnumField(yes_no_enum2, null=True)
	reschedule_date = models.DateTimeField(null=True)
	req_resson = models.CharField( max_length=100, null =True, blank=True)
	remark=models.CharField(max_length=1000,null=True)
	atten_id = models.ForeignKey('agg_hhc_attendance' ,on_delete = models.CASCADE, null=True, blank=True)
	professional_request_status = enum.EnumField(professional_request_status, null=True)
	req_rejection_remark = models.CharField(max_length=1000,null=True)
	is_deleted = enum.EnumField(yes_no_enum2, null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
	
	def save(self, *args, **kwargs):
		if not self.req_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)



class agg_hhc_transport(models.Model):
	transp_id = models.AutoField(primary_key=True)
	srv_prof_id = models.ForeignKey('agg_hhc_service_professionals',on_delete=models.CASCADE,null=True)
	pass_number=models.CharField(max_length=200,null=True)
	Transport_type=enum.EnumField(Transport_type,null=True)
	start_date=models.DateField(null=True)
	end_date=models.DateField(null=True)
	vehicle_no=models.CharField(max_length=150,null=True)
	vehicle_type=enum.EnumField(vehicle_type,null=True)
	status=enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.transp_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
# from fcm_django.models import FCMDevice

# class DeviceToken(models.Model):
#     user = models.ForeignKey('agg_com_colleague', on_delete=models.CASCADE, null=True)
#     # fcm_device = models.OneToOneField(FCMDevice, on_delete=models.CASCADE,null=True)

class DeviceToken(models.Model):
	clg_id = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True)
	token = models.CharField(max_length=200, null=True)
	is_login=models.BooleanField(default=False,null=False)
	login_count=models.IntegerField(default=0,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.clg_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
class NotificationList(models.Model):
	noti_id= models.AutoField(primary_key=True)
	noti_title = models.CharField(max_length=255, null=True)
	noti_body = models.CharField(max_length=500, null=True)
	is_active = models.BooleanField(default=True, null=True)
	is_accepted = models.BooleanField(default=False, null=True)
	accepted_by = models.ForeignKey(agg_hhc_service_professionals, on_delete=models.CASCADE, null=True)
	eve_id = models.ForeignKey(agg_hhc_events, on_delete=models.CASCADE, null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.noti_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class Professional_notification(models.Model):
	prof_noti = models.AutoField(primary_key=True)
	noti_id = models.ForeignKey(NotificationList, on_delete=models.CASCADE, null=True)
	srv_prof_id = models.ForeignKey(agg_hhc_service_professionals, on_delete=models.CASCADE, null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.prof_noti:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
	
class agg_hhc_prof_call_back_btn_rec(models.Model):
	call_back_btn_id = models.AutoField(primary_key=True)
	srv_prof_id = models.ForeignKey(agg_hhc_service_professionals, on_delete=models.CASCADE)
	agg_sp_dt_eve_poc_id = models.ForeignKey(agg_hhc_detailed_event_plan_of_care, on_delete=models.CASCADE, null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.call_back_btn_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class community_device_token(models.Model):
	app_device_token_id = models.AutoField(primary_key=True)
	caller_id = models.ForeignKey("agg_hhc_callers", on_delete=models.CASCADE, null=True)
	token = models.CharField(max_length=200, null=True)
	is_login=models.BooleanField(default=False,null=False)
	login_count=models.IntegerField(default=0,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.app_device_token_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)


# class agg_hhc_concent_form_details(models.Model):
# 	con_id = models.AutoField(primary_key=True)
# 	eve_id = models.ForeignKey(agg_hhc_events,on_delete = models.CASCADE, null=True)
# 	is_aggree = models.BooleanField(default=False,null=False)
# 	sign = models.FileField(upload_to='Doctor_concent_sign/')
# 	# Discharge_summ_doc = models.FileField(upload_to='Doctor_concent_Discharge_summ_doc/')
# 	Discharge_summ_doc = models.TextField(null=True)
# 	status=enum.EnumField(status_enum,null=True)
# 	added_date= models.DateTimeField(null=True)
# 	added_by = models.IntegerField(null=True)
# 	last_modify_date=models.DateTimeField(default=timezone.now,null=True)
# 	last_modified_by=models.BigIntegerField(null=True)


class agg_hhc_concent_form_details(models.Model):
	con_id = models.AutoField(primary_key=True)
	eve_id = models.ForeignKey(agg_hhc_events, on_delete=models.CASCADE, null=True)
	is_aggree = models.BooleanField(default=False, null=False)
	sign = models.FileField(upload_to='Doctor_concent_sign/')
	Discharge_summ_docs = models.ManyToManyField('DischargeFile', related_name='concent_forms')
	status = enum.EnumField(status_enum, null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.con_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class DischargeFile(models.Model):
	ds_id = models.AutoField(primary_key=True)
	file = models.FileField(upload_to='Doctor_concent_Discharge_summ_doc/')
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.ds_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
						 
class professional_call_back(models.Model):
	cb_id = models.AutoField(primary_key=True)
	clg_id = models.ForeignKey("agg_com_colleague", on_delete=models.CASCADE,null=True)
	remark=models.CharField(max_length=150,null=True)
	status = enum.EnumField(status_enum, null=True)
	call_back_done_by=models.CharField(max_length=150,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.cb_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)




class SMS_sent_details(models.Model):
	s_id = models.AutoField(primary_key=True)
	eve_id = models.ForeignKey(agg_hhc_events, on_delete=models.CASCADE, null=True)
	patient_name = models.CharField(max_length=200, null=True)
	professional_name = models.CharField(max_length=200, null=True)
	contact_number = models.CharField(max_length=200, null=True)
	srv_id = models.ForeignKey("agg_hhc_services", on_delete=models.CASCADE,null=True)
	sent_status = enum.EnumField(yes_no_enum2, null=True)
	sms_type = enum.EnumField(sms_type, null=True)
	status = enum.EnumField(status_enum, null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.s_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
	
class cancelation_charges(models.Model):
	cancle_charge_id = models.AutoField(primary_key=True)
	charges=models.IntegerField(null=True)
	status=enum.EnumField(status_enum,null=True)
	clg_id = models.ForeignKey("agg_com_colleague", on_delete=models.CASCADE,null=True)   # added by
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.cancle_charge_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class sos_details(models.Model):
	sos_id = models.AutoField(primary_key=True)
	srv_prof_id = models.ForeignKey(agg_hhc_service_professionals,on_delete=models.CASCADE, null=True, blank=True, default=None)
	dtl_eve_id = models.ForeignKey(agg_hhc_detailed_event_plan_of_care,on_delete = models.CASCADE, null=True)
	sos_remark = models.CharField(max_length=100,null=True)
	status=enum.EnumField(status_enum,null=True)
	action_status = enum.EnumField(action_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.sos_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_event_plan_of_care_history_tracker(models.Model):#15
	eve_poc_ht_id = models.AutoField(primary_key=True)
	eve_poc_id = models.ForeignKey("agg_hhc_event_plan_of_care",on_delete=models.CASCADE,null=True)
	eve_id = models.ForeignKey("agg_hhc_events",on_delete=models.CASCADE,null=True)# new added
	srv_id = models.ForeignKey('agg_hhc_services',on_delete=models.CASCADE,null=True)# new added
	sub_srv_id = models.ForeignKey('agg_hhc_sub_services', on_delete=models.CASCADE,null=True)
	hosp_id = models.ForeignKey('agg_hhc_hospitals',on_delete=models.CASCADE,null=True)# new added
	doct_cons_id = models.ForeignKey('agg_hhc_doctors_consultants',on_delete=models.CASCADE,null=True)# new added
	# pt_id = models.ForeignKey('agg_hhc_patient_list_enquiry',on_delete=models.CASCADE,null=True)# new added(mayank)
	# eve_req_id = models.BigIntegerField(null=True)
	srv_prof_id = models.ForeignKey('agg_hhc_service_professionals',on_delete=models.CASCADE,null=True)
	No_session_dates = models.TextField(null=True)
	# service_date = models.DateField(null=True)# this field for fields stor  time
	# service_date_to = models.DateField(null=True)# this field for fields stor time
	# actual_StartDate_Time = models.DateTimeField(null=True)
	# actual_EndDate_Time = models.DateTimeField(null=True)
	# start_date = models.DateTimeField(null=True)  # previous
	# end_date = models.DateTimeField(null=True)	# previous
	start_date = models.DateField(null=True)
	end_date = models.DateField(null=True)
	start_time = models.TimeField(null=True)
	end_time = models.TimeField(null=True)
	serivce_dates = models.JSONField() # added by vinayak
	initail_final_amount = models.FloatField(blank=True,null=True)
	service_reschedule = enum.EnumField(yes_no_enum2,null=True,blank=True) # added by vinayak
	# service_cost = models.FloatField(null=True)
	prof_prefered = enum.EnumField(pt_gender_enum,null=True,blank=True) # updated
	status = enum.EnumField(status_enum,null=True)
	remark = models.CharField(max_length=200, null=True,blank=True)# newly added
	service_status = enum.EnumField(service_status_enum1,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
	# last_modified_date=models.DateTimeField(default=timezone.now, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.eve_poc_ht_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class demo1(models.Model):
	demo_id = models.AutoField(primary_key=True)
	data = models.CharField(max_length=255)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
	
	def save(self, *args, **kwargs):
		if not self.demo_id:
			self.added_by=self.last_modified_by
		super().save(*args, **kwargs)

class status_p(enum.Enum):
    NO = 0
    YES = 1
class agg_save_permissions(models.Model):
    id = models.AutoField(primary_key=True)
    # source =models.ForeignKey('agg_source',on_delete=models.CASCADE,null=False)
    role = models.ForeignKey('agg_mas_group',on_delete=models.CASCADE,null=False)
    modules_submodule = models.JSONField(null=True,blank=True)
    # modules = models.ForeignKey('Permission_module',on_delete=models.CASCADE,null=True)
    # sub_module = models.ManyToManyField('Permission', related_name='roles', blank=True)
    permission_status =enum.EnumField(status_p, default = status_p.NO)
    added_date = models.DateTimeField(auto_now_add=True)
    added_by = models.IntegerField(blank=True, null=True)
    modify_by =	models.IntegerField(null=True, blank=True)
    modify_date = models.DateTimeField(auto_now=True)
    
class Permission_module(models.Model):
    module_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=250, null=True)
    # Source_id = models.ForeignKey("agg_source", on_delete=models.CASCADE,null = True)
    group = models.ForeignKey('agg_mas_group',on_delete=models.CASCADE,null=False)
    added_date = models.DateTimeField(auto_now_add=True)
    added_by = models.IntegerField(blank=True, null=True)
    modify_by =	models.IntegerField(null=True, blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __str__(self):
        return self.name
    
class permission(models.Model):
    Permission_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    module = models.ForeignKey("Permission_module", on_delete=models.CASCADE,null = True)
    # source =models.ForeignKey('agg_source',on_delete=models.CASCADE,null=True)
    # guard_name = models.CharField(max_length=255)
    added_by =	models.IntegerField(null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True, blank=True)
    modify_by =	models.IntegerField(null=True, blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __str__(self):
        return self.name
    
# class Sub_module_actions(models.Model):
#     action_id = models.AutoField(primary_key=True)
#     name = models.CharField(max_length=255)
#     module = models.ForeignKey("Permission_module", on_delete=models.CASCADE,null = True)
#     sub_module = models.ForeignKey("permission", on_delete=models.CASCADE,null = True)
#     added_by =	models.IntegerField(null=True, blank=True)
#     added_date = models.DateTimeField(auto_now_add=True, blank=True)
#     modify_by =	models.IntegerField(null=True, blank=True)
#     modify_date = models.DateTimeField(auto_now=True, null=True, blank=True)
    




class agg_hhc_job_closure_questions(models.Model):   #------------------------ # Vinayak
	jcq_id = models.AutoField(primary_key=True)
	srv_id = models.ForeignKey(agg_hhc_services,on_delete=models.CASCADE, null=True)
	sub_srv_id = models.ForeignKey(agg_hhc_sub_services,on_delete=models.CASCADE, null=True)
	jcq_question = models.CharField(max_length=555,null=True, blank=True)
	jcq_question_mar = models.CharField(max_length=555,null=True, blank=True)
	jcq_question_hindi = models.CharField(max_length=555,null=True, blank=True)
	que_shrt_name = models.CharField(max_length=555,null=True, blank=True)
	date_time_remark_q_wise_name = models.CharField(max_length=555,null=True, blank=True)
	status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if not self.jcq_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)











class agg_hhc_events_wise_jc_question(models.Model):
	eve_jcq_id = models.AutoField(primary_key=True)
	eve_id=models.ForeignKey(agg_hhc_events,on_delete=models.CASCADE,null=True)
	srv_id = models.ForeignKey(agg_hhc_services,on_delete=models.CASCADE, null=True)
	jcq_id = models.ForeignKey(agg_hhc_job_closure_questions,on_delete=models.CASCADE, null=True)
	is_srv_enq_q = enum.EnumField(job_cl_ques_type,null=True)
	status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

	def save(self, *args, **kwargs):
		if self.pk is None:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
	# if self.pk is None:  # Check if the instance is new
    #         self.added_by = self.last_modified_by
    #     return super().save(*args, **kwargs)
class VIPConvert_to_normal(models.Model):
    Convert_id = models.AutoField(primary_key=True)
    eve_id = models.ForeignKey("agg_hhc_events",on_delete=models.CASCADE,null=True)
    added_by=models.CharField(max_length=100, blank=True,null=True)
    added_date=models.DateTimeField(auto_now_add=True,null=True)
    last_modified_by=models.CharField(max_length=100, blank=True,null=True)
    last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
    
    def save(self, *args, **kwargs):
        if not self.Convert_id:
            self.added_by=self.last_modified_by
        super().save(*args, **kwargs)


#---------------------------------------professional qualification -----------------------------------

class qualifications(models.Model):
	quali_id=models.AutoField(primary_key=True)
	qualification=models.CharField(max_length=400,null=True)
	status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
	def save(self, *args, **kwargs):
		if not self.quali_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)
	
class qualification_specialization(models.Model):
	quali_sp=models.AutoField(primary_key=True)
	specialization=models.CharField(max_length=400,null=True)
	quali_id=models.ForeignKey('qualifications',on_delete=models.CASCADE,null=True)
	status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
	def save(self, *args, **kwargs):
		if not self.quali_sp:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)





class c_f_enum(enum.Enum):
	is_feedback=1
	is_complaint=2

class dash_complaint_feedback_counts(models.Model):
	cont_id = models.AutoField(primary_key=True)
	comp_total_sch = models.BigIntegerField(null=True)
	comp_completed = models.BigIntegerField(null=True)
	comp_pending = models.BigIntegerField(null=True)
	comp_positive = models.BigIntegerField(null=True)
	comp_negative = models.BigIntegerField(null=True)
	feed_excellent = models.BigIntegerField(null=True)
	feed_good = models.BigIntegerField(null=True)
	feed_poor = models.BigIntegerField(null=True)
	is_feed_comp = enum.EnumField(c_f_enum,null=True)
	status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
	def save(self, *args, **kwargs):
		if not self.cont_id:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)


class device_enum(enum.Enum):
	Android=1
	ios=2

class application_enum(enum.Enum):
	Professional_Application=1
	Community_Application=2


class Android_updates(models.Model):
	au=models.AutoField(primary_key=True)
	version=models.CharField(max_length=400,null=True)
	Build_number=models.CharField(max_length=400,null=True)
	Application=enum.EnumField(application_enum,null=True)
	device=enum.EnumField(device_enum,null=True)
	status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
	def save(self, *args, **kwargs):
		if not self.au:
			self.added_by=self.last_modified_by
		return super().save(*args, **kwargs)

class agg_hhc_cashfree_online_payment(models.Model):#94
	pay_id=models.AutoField(primary_key=True)
	eve_id=models.ForeignKey(agg_hhc_events,on_delete=models.CASCADE,null=True)
	# srv_prof_id = models.ForeignKey(agg_hhc_service_professionals,on_delete=models.CASCADE,null=True)
	#event_requrement_id=models.ForeignKey(agg_hhc_event_requirements,on_delete=models.CASCADE,null=True)
	Total_cost=models.DecimalField(max_digits=10, decimal_places=2,null=True) # change field name amount to this by Sandip
	paid_by = models.CharField(max_length=50, null = True)    #mayank
	amount_paid = models.DecimalField(max_digits=10, decimal_places=2,null=True)    #mayank
	amount_remaining  = models.DecimalField(max_digits=10, decimal_places=2,null=True)   #mayank
	pay_recived_by= models.ForeignKey("agg_com_colleague",on_delete=models.CASCADE,null=True)
	# hosp_id=models.ForeignKey(agg_hhc_hospitals,on_delete=models.CASCADE,null=True)
	date = models.DateTimeField(auto_now_add=True, null=True)
	# receipt_no = models.IntegerField(null=True)
	is_delete_status=enum.EnumField(is_delet_enum,null=True)
	mode  = enum.EnumField(Payment_mode_enum, null=True) #mayank
	# cheque_number=models.CharField(max_length=200,null=True)
	# cheque_status=enum.EnumField(cheque_approval_enum,null=True)
	# bank_name=models.CharField(max_length=200,null=True)
	# cheque_date=models.DateField(null=True)
	# note=models.CharField(max_length=350,null=True)
	# cheque_image=models.FileField(upload_to='payment/Cheque',blank=True,null=True)# added by nikita
	order_id = models.CharField(max_length=100,null=True)
	order_currency = models.CharField(max_length=10,null=True)
	order_note = models.CharField(max_length=255, null=True, blank=True)
	customer_email = models.EmailField(max_length=100,null=True)
	customer_phone = models.CharField(max_length=20,null=True)
	payment_status=enum.EnumField(payment_status_enum,null=True)
	transaction_status = models.JSONField(null=True,blank=True)
	overall_status = models.CharField(max_length=100,null=True, blank=True)
	cf_token = models.CharField(max_length=1000,null=True, blank=True)
	online_payment_by = enum.EnumField(online_payment_by,null=True)
	Remark=models.CharField(max_length=5000,null=True)
	status=enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
	created_at = models.DateTimeField(auto_now_add=True, blank=True,null=True)

	
 
class agg_hhc_attendance(models.Model): 
	att_id = models.AutoField(primary_key=True)
	Professional_iid = models.ForeignKey('agg_hhc_service_professionals',on_delete=models.CASCADE,null=True, blank=True)
	mobile_no = models.BigIntegerField(null=True,blank=True)
	service = models.CharField(max_length=100, blank=True,null=True)
	attnd_date = models.DateTimeField( blank=True,null=True)
	job_type = models.CharField(max_length=100, blank=True,null=True)
	attnd_type = models.CharField(max_length=100, blank=True,null=True)
	attnd_status = models.CharField(max_length=100, blank=True,null=True)
	attnd_Note = models.CharField(max_length=100, blank=True,null=True)
	approve_status = enum.EnumField(approve_status,null=True)
	added_by_type = models.CharField(max_length=100, blank=True,null=True)
	from_avail = models.TimeField(blank=True,null=True)
	to_avail = models.TimeField(blank=True,null=True)
	admin_user_id = models.CharField(max_length=100, blank=True,null=True)
	added_by_date = models.DateTimeField(auto_now_add=True, blank=True,null=True)
	status = enum.EnumField(status_enum,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
	
	def save(self, *args, **kwargs):
		if not self.att_id:
			self.added_by=self.last_modified_by
		super().save(*args, **kwargs)


class ems_colleague_login_logout_info(models.Model):
	id = models.AutoField(primary_key=True, auto_created=True)
	clg_id = models.ForeignKey(agg_com_colleague,on_delete=models.CASCADE, null=True, default=None, blank=True, to_field='clg_ref_id')
	clg_login_time = models.DateTimeField(null=True)
	clg_logout_time = models.DateTimeField(null=True)
	device_os_name = models.CharField(max_length=150, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
 
class service_count_save_for_website(models.Model):
    id = models.AutoField(primary_key=True)
    today_session_count = models.BigIntegerField(null=True,blank=True)
    added_date=models.DateTimeField(auto_now_add=True,null=True)
    last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)
    
class HeplFiles(models.Model):
	file_id=models.AutoField(primary_key=True)
	file_name = models.CharField(max_length=100, blank=True,null=True)
	files = models.FileField(upload_to='static/HeplFile/',blank=True,null=True)
	file_type = enum.EnumField(fileType,null=True)
	is_active= models.BooleanField(default=True, null=True, blank=True)

class agg_save_patient_feedback_table(models.Model):
	feedback_id = models.AutoField(primary_key=True)
	eve_id = models.ForeignKey(agg_hhc_events, on_delete = models.CASCADE, null=True)
	ptn_id = models.ForeignKey(agg_hhc_patients,on_delete=models.CASCADE,null=True)
	prof_id = models.ForeignKey(agg_hhc_service_professionals,on_delete=models.CASCADE,null=True, blank=True)
	f_questions = models.ForeignKey(FeedBack_Questions,on_delete=models.CASCADE,null=True, blank=True)
	answer = models.CharField(max_length=500, null=True, blank=True)
	# media = models.FileField(upload_to='feedback_media',blank=True,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)


class agg_save_feedback_medias(models.Model):
	media_id = models.AutoField(primary_key=True)
	eve_id = models.ForeignKey(agg_hhc_events, on_delete = models.CASCADE, null=True)
	ptn_id = models.ForeignKey(agg_hhc_patients,on_delete=models.CASCADE,null=True)
	prof_id = models.ForeignKey(agg_hhc_service_professionals,on_delete=models.CASCADE,null=True, blank=True)
	images = models.FileField(upload_to='feedback_media',blank=True,null=True)
	video = models.FileField(upload_to='feedback_media',blank=True,null=True)
	added_by=models.CharField(max_length=100, blank=True,null=True)
	added_date=models.DateTimeField(auto_now_add=True,null=True)
	last_modified_by=models.CharField(max_length=100, blank=True,null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True,blank=True)

class agg_Discount_Coupon_Code(models.Model):
	coupon_id = models.AutoField(primary_key=True)
	Code = models.CharField(max_length=100,unique=True, null=True)
	agg_sp_pt_id= models.ForeignKey(agg_hhc_patients,on_delete=models.CASCADE, null=True)
	discount_type = enum.EnumField(discount_type_enum,null=True)
	discount_value = models.FloatField(null=True)
	status = enum.EnumField(status_enum,null=True)
	added_by = models.CharField(max_length = 100, blank=True, null=True)
	added_date = models.DateTimeField(auto_now_add=True, null=True)
	last_modified_by=models.CharField(max_length=100, blank=True, null=True)
	last_modified_date=models.DateTimeField(auto_now=True, null=True, blank=True)

	def save(self, *args, **kwargs):
		if not self.coupon_id:
			self.added_by=self.last_modified_by
		super().save(*args, **kwargs)


#############Website Chatbot Table#############(don't remove)
class ChatbotConversation(models.Model):
    conversation = models.JSONField(default=list)  # Store as a list of question-answer pairs
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Conversation at {self.timestamp}"