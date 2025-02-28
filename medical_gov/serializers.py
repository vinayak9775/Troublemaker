from rest_framework import serializers
from rest_framework import serializers
from django.contrib.auth.hashers import make_password, check_password
from datetime import datetime, timedelta
from hhcweb.models import *
from hhcspero.settings import SERVER_KEY
import requests
from django.conf import settings
from hhcweb.models import agg_hhc_events
class agg_hhc_session_job_closure_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['jcolse_id','srv_prof_id','dtl_eve_id','prof_sub_srv_id','Baseline','Airway','Breathing','Circulation','Skin_Perfusion','Wound','Oozing','Discharge','Inj_site_IM','Procedure','Size_catheter','Size_RT','Temp_core','TBSL','Pulse','SpO2','RR','GCS_Total','BP','diastolic','Remark','Name_injection_fld','Dose_freq','Num_Sutures_staples','Dressing_status','Catheter_type','Sutures_type','Wound_dehiscence','Strength_exer','is_patient_death','Stretch_exer','Walk_indep','Walker_stick','Movin_or_moveout','Mobin_or_moveout_datetime_remark','Getin_or_getout','Getin_or_getout_datetime_remark','ChairTobed_or_bedTochair','ChairTobed_or_bedTochair_datetime_remark','Situp_onbed','Situp_onbed_datetime_remark','Unocp_or_ocp_bed','Unocp_or_ocp_bed_datetime_remark','Showershampoo','Showershampoo_datetime_remark','Incontinent_care','Incontinent_care_datetime_remark','Mouth_care','Mouth_care_datetime_remark','Shaving','Shaving_datetime_remark','Hand_care','Hand_care_datetime_remark','Foot_care','Foot_care_datetime_remark','Vital_care','vital_care_datetime_remark','motion_care','motion_care_datetime_remark','Grooming','Grooming_datetime_remark','Bed_bath','Bed_bath_datetime_remark','Feeding','Feeding_datetime_remark','Reposition_patient','Reposition_patient_datetime_remark','Bed_pan','Bed_pan_datetime_remark','added_by_type','status','last_modified_by']


    def validate(self, data):
        return data

class agg_hhc_session_job_closure_H_serializer(serializers.ModelSerializer):
    # status=serializers.SerializerMethodField()
    # Walker_stick=serializers.SerializerMethodField()
    # Strength_exer=serializers.SerializerMethodField()
    # Stretch_exer=serializers.SerializerMethodField()
    # Walk_indep=serializers.SerializerMethodField()
    Baseline=serializers.SerializerMethodField()
    Airway=serializers.SerializerMethodField()
    Breathing=serializers.SerializerMethodField()
    Circulation=serializers.SerializerMethodField()
    Skin_Perfusion=serializers.SerializerMethodField()
    Wound=serializers.SerializerMethodField()
    Oozing=serializers.SerializerMethodField()
    Discharge=serializers.SerializerMethodField()
    Inj_site_IM=serializers.SerializerMethodField()
    Procedure=serializers.SerializerMethodField()
    Dressing_status=serializers.SerializerMethodField()
    Catheter_type=serializers.SerializerMethodField()
    Sutures_type=serializers.SerializerMethodField()
    Wound_dehiscence=serializers.SerializerMethodField()
    Strength_exer=serializers.SerializerMethodField()
    is_patient_death=serializers.SerializerMethodField()
    Stretch_exer=serializers.SerializerMethodField()
    Walk_indep=serializers.SerializerMethodField()
    Walker_stick=serializers.SerializerMethodField()
    Movin_or_moveout=serializers.SerializerMethodField()
    Getin_or_getout=serializers.SerializerMethodField()
    ChairTobed_or_bedTochair=serializers.SerializerMethodField()
    Situp_onbed=serializers.SerializerMethodField()
    Unocp_or_ocp_bed=serializers.SerializerMethodField()
    Showershampoo=serializers.SerializerMethodField()
    Incontinent_care=serializers.SerializerMethodField()
    Mouth_care=serializers.SerializerMethodField()
    Shaving=serializers.SerializerMethodField()
    Hand_care=serializers.SerializerMethodField()
    Foot_care=serializers.SerializerMethodField()
    Vital_care=serializers.SerializerMethodField()
    motion_care=serializers.SerializerMethodField()
    Grooming=serializers.SerializerMethodField()
    Bed_bath=serializers.SerializerMethodField()
    Bed_pan=serializers.SerializerMethodField()
    added_by_type=serializers.SerializerMethodField()
    status=serializers.SerializerMethodField()
    
    class Meta:
        model = agg_hhc_jobclosure_detail_H
        fields = ['jcolse_id_H','jcolse_id','srv_prof_id','dtl_eve_id','prof_sub_srv_id','Baseline','Airway','Breathing','Circulation','Skin_Perfusion','Wound','Oozing','Discharge','Inj_site_IM','Procedure','Size_catheter','Size_RT','Temp_core','TBSL','Pulse','SpO2','RR','GCS_Total','BP','diastolic','Remark','Name_injection_fld','Dose_freq','Num_Sutures_staples','Dressing_status','Catheter_type','Sutures_type','Wound_dehiscence','Strength_exer','is_patient_death','Stretch_exer','Walk_indep','Walker_stick','Movin_or_moveout','Mobin_or_moveout_datetime_remark','Getin_or_getout','Getin_or_getout_datetime_remark','ChairTobed_or_bedTochair','ChairTobed_or_bedTochair_datetime_remark','Situp_onbed','Situp_onbed_datetime_remark','Unocp_or_ocp_bed','Unocp_or_ocp_bed_datetime_remark','Showershampoo','Showershampoo_datetime_remark','Incontinent_care','Incontinent_care_datetime_remark','Mouth_care','Mouth_care_datetime_remark','Shaving','Shaving_datetime_remark','Hand_care','Hand_care_datetime_remark','Foot_care','Foot_care_datetime_remark','Vital_care','vital_care_datetime_remark','motion_care','motion_care_datetime_remark','Grooming','Grooming_datetime_remark','Bed_bath','Bed_bath_datetime_remark','Feeding','Feeding_datetime_remark','Reposition_patient','Reposition_patient_datetime_remark','Bed_pan','Bed_pan_datetime_remark','added_by_type','status','last_modified_by']

    def get_Baseline(self, obj):
        if obj.Baseline=='A':
            return 1
        elif obj.Baseline=='V':
            return 2
        elif obj.Baseline=='P':
            return 3
        elif obj.Baseline=='U':
            return 4
        else:
            return None
    
    def get_Airway(self, obj):
        if obj.Airway=='Open':
            return 1
        elif obj.Airway=='Close':
            return 2
        else:
            return None
        
    def get_Breathing(self, obj):
        if obj.Breathing=='Present':
            return 1
        elif obj.Breathing=='Comprom':
            return 2
        elif obj.Breathing=='Absent':
            return 3
        else:
            return None
            
    def get_Circulation(self, obj):
        if obj.Circulation=='Radial':
            return 1
        elif obj.Circulation=='Present':
            return 2
        elif obj.Circulation=='Absent':
            return 3
        else:
            return None
                
    def get_Skin_Perfusion(self, obj):
        if obj.Skin_Perfusion=='Normal':
            return 1
        elif obj.Skin_Perfusion=='Abnormal':
            return 2
        else:
            return None
                
    def get_Wound(self, obj):
        if obj.Wound=='Healthy':
            return 1
        elif obj.Wound=='Unhealthy':
            return 2
        else:
            return None
                

    def get_Oozing(self, obj):
        if obj.Oozing=='Present':
            return 1
        elif obj.Oozing=='Absent':
            return 2
        else:
            return None
        
    def get_Discharge(self, obj):
        if obj.Discharge=='Serous':
            return 1
        elif obj.Discharge=='Serosqnguinous':
            return 2
        elif obj.Discharge=='Sanguinous':
            return 3
        elif obj.Discharge=='Purulent':
            return 4
        else:
            return None
        
    def get_Inj_site_IM(self, obj):
        if obj.Inj_site_IM=='Gluteal':
            return 1
        elif obj.Inj_site_IM=='Deltoid':
            return 2
        else:
            return None
        
    def get_Procedure(self, obj):
        if obj.Procedure=='Eventful':
            return 1
        elif obj.Procedure=='Uneventful':
            return 2
        else:
            return None
        
    def get_Dressing_status(self, obj):
        if obj.Dressing_status=='Healing':
            return 1
        elif obj.Dressing_status=='Non_healing':
            return 2
        else:
            return None
         
    def get_Catheter_type(self, obj):
        if obj.Catheter_type=='Silicon':
            return 1
        elif obj.Catheter_type=='Simple':
            return 2
        else:
            return None
         
    def get_Sutures_type(self, obj):
        if obj.Sutures_type=='Sutures':
            return 1
        elif obj.Sutures_type=='Staples':
            return 2
        else:
            return None
        
    def get_Wound_dehiscence(self, obj):
        if obj.Wound_dehiscence=='yes':
            return 1
        elif obj.Wound_dehiscence=='no':
            return 2
        else:
            return None
         
    def get_Strength_exer(self, obj):
        if obj.Strength_exer=='yes':
            return 1
        elif obj.Strength_exer=='no':
            return 2
        else:
            return None
        
    def get_is_patient_death(self, obj):
        if obj.is_patient_death=='yes':
            return 1
        elif obj.is_patient_death=='no':
            return 2
        else:
            return None
        
    def get_Stretch_exer(self, obj):
        if obj.Stretch_exer=='yes':
            return 1
        elif obj.Stretch_exer=='no':
            return 2
        else:
            return None
                        
    def get_Walk_indep(self, obj):
        if obj.Walk_indep=='yes':
            return 1
        elif obj.Walk_indep=='no':
            return 2
        else:
            return None
                
    def get_Walker_stick(self,obj):
        if obj.Walker_stick=='Walker':
            return 1
        if obj.Walker_stick=='Stick':
            return 2
        if obj.Walker_stick=='Independently':
            return 3
        else:
            return None
                
    def get_Movin_or_moveout(self, obj):
        if obj.Movin_or_moveout=='yes':
            return 1
        elif obj.Movin_or_moveout=='no':
            return 2
        else:
            return None
                
    def get_Getin_or_getout(self, obj):
        if obj.Getin_or_getout=='yes':
            return 1
        elif obj.Getin_or_getout=='no':
            return 2
        else:
            return None
                
    def get_ChairTobed_or_bedTochair(self, obj):
        if obj.ChairTobed_or_bedTochair=='yes':
            return 1
        elif obj.ChairTobed_or_bedTochair=='no':
            return 2
        else:
            return None
                
    def get_Situp_onbed(self, obj):
        if obj.Situp_onbed=='yes':
            return 1
        elif obj.Situp_onbed=='no':
            return 2
        else:
            return None
                
    def get_Unocp_or_ocp_bed(self, obj):
        if obj.Unocp_or_ocp_bed=='yes':
            return 1
        elif obj.Unocp_or_ocp_bed=='no':
            return 2
        else:
            return None
                
    def get_Showershampoo(self, obj):
        if obj.Showershampoo=='yes':
            return 1
        elif obj.Showershampoo=='no':
            return 2
        else:
            return None
                
    def get_Incontinent_care(self, obj):
        if obj.Incontinent_care=='yes':
            return 1
        elif obj.Incontinent_care=='no':
            return 2
        else:
            return None
                
    def get_Mouth_care(self, obj):
        if obj.Mouth_care=='yes':
            return 1
        elif obj.Mouth_care=='no':
            return 2
        else:
            return None
                
    def get_Shaving(self, obj):
        if obj.Shaving=='yes':
            return 1
        elif obj.Shaving=='no':
            return 2
        else:
            return None
                
    def get_Hand_care(self, obj):
        if obj.Hand_care=='yes':
            return 1
        elif obj.Hand_care=='no':
            return 2
        else:
            return None
                
    def get_Foot_care(self, obj):
        if obj.Foot_care=='yes':
            return 1
        elif obj.Foot_care=='no':
            return 2
        else:
            return None
                
    def get_Vital_care(self, obj):
        if obj.Vital_care=='yes':
            return 1
        elif obj.Vital_care=='no':
            return 2
        else:
            return None
                
    def get_motion_care(self, obj):
        if obj.motion_care=='yes':
            return 1
        elif obj.motion_care=='no':
            return 2
        else:
            return None
                
    def get_Grooming(self, obj):
        if obj.Grooming=='yes':
            return 1
        elif obj.Grooming=='no':
            return 2
        else:
            return None
                
    def get_Bed_bath(self, obj):
        if obj.Bed_bath=='yes':
            return 1
        elif obj.Bed_bath=='no':
            return 2
        else:
            return None
                
    def get_Feeding(self, obj):
        if obj.Feeding=='yes':
            return 1
        elif obj.Feeding=='no':
            return 2
        else:
            return None
                
    def get_Reposition_patient(self, obj):
        if obj.Reposition_patient=='yes':
            return 1
        elif obj.Reposition_patient=='no':
            return 2
        else:
            return None
                
    def get_Bed_pan(self, obj):
        if obj.Bed_pan=='yes':
            return 1
        elif obj.Bed_pan=='no':
            return 2
        else:
            return None
        
    def get_added_by_type(self, obj):
        if obj.added_by_type=='System':
            return 1
        elif obj.added_by_type=='App':
            return 2
        else:
            return None
        
    def get_status(self, obj):
        if obj.status=='Active':
            return 1
        elif obj.status=='Inactive':
            return 2
        elif obj.status=='Delete':
            return 3
        else:
            return None
        


class mg_agg_hhc_session_job_closure_serializer_form_1(serializers.ModelSerializer):
    prof_name = serializers.SerializerMethodField()
    sub_srv_name = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['jcolse_id','srv_prof_id','prof_name','dtl_eve_id', 'prof_sub_srv_id','sub_srv_name','Baseline','Airway', 'Breathing', 'Circulation', 'Temp_core','TBSL','Pulse','SpO2','RR','GCS_Total','BP','diastolic','Skin_Perfusion','Remark','diastolic','is_patient_death','added_by', 'last_modified_by']
    
    def get_prof_name(self, obj):
        return obj.srv_prof_id.prof_fullname if obj.srv_prof_id else None
    
    def get_sub_srv_name(self, obj):
        return obj.prof_sub_srv_id.recommomded_service if obj.prof_sub_srv_id else None



class mg_agg_hhc_session_job_closure_serializer_form_2(serializers.ModelSerializer):
    prof_name = serializers.SerializerMethodField()
    sub_srv_name = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['jcolse_id','srv_prof_id','prof_name','dtl_eve_id', 'prof_sub_srv_id','sub_srv_name', 'Movin_or_moveout','Mobin_or_moveout_datetime_remark', 'Getin_or_getout','Getin_or_getout_datetime_remark', 'ChairTobed_or_bedTochair','ChairTobed_or_bedTochair_datetime_remark', 'Situp_onbed','Situp_onbed_datetime_remark','Unocp_or_ocp_bed','Unocp_or_ocp_bed_datetime_remark','Showershampoo','Showershampoo_datetime_remark','Incontinent_care','Incontinent_care_datetime_remark','Mouth_care','Mouth_care_datetime_remark','Shaving','Shaving_datetime_remark','Hand_care','Hand_care_datetime_remark','Foot_care','Foot_care_datetime_remark','Vital_care','vital_care_datetime_remark', 'motion_care','motion_care_datetime_remark', 'Grooming','Grooming_datetime_remark', 'Bed_bath','Bed_bath_datetime_remark', 'Feeding','Feeding_datetime_remark', 'Reposition_patient','Reposition_patient_datetime_remark', 'Bed_pan','Bed_pan_datetime_remark','added_by', 'last_modified_by']
    def get_prof_name(self, obj):
        data = {
            "prof_name": obj.srv_prof_id.prof_fullname if obj.srv_prof_id else None,
            "prof_no": obj.srv_prof_id.phone_no if obj.srv_prof_id else None,
           }
        return data
    
    def get_sub_srv_name(self, obj):
        return obj.prof_sub_srv_id.recommomded_service if obj.prof_sub_srv_id else None


class mg_agg_hhc_session_job_closure_serializer_form_3(serializers.ModelSerializer):
    prof_name = serializers.SerializerMethodField()
    sub_srv_name = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['jcolse_id','srv_prof_id','prof_name','dtl_eve_id', 'prof_sub_srv_id','sub_srv_name','Wound', 'Oozing', 'Discharge', 'Dressing_status','added_by', 'last_modified_by']
    
    def get_prof_name(self, obj):
        data = {
            "prof_name": obj.srv_prof_id.prof_fullname if obj.srv_prof_id else None,
            "prof_no": obj.srv_prof_id.phone_no if obj.srv_prof_id else None,
           }
        return data
    
    def get_sub_srv_name(self, obj):
        return obj.prof_sub_srv_id.recommomded_service if obj.prof_sub_srv_id else None


class mg_agg_hhc_session_job_closure_serializer_form_4(serializers.ModelSerializer):
    prof_name = serializers.SerializerMethodField()
    sub_srv_name = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['jcolse_id','srv_prof_id','prof_name','dtl_eve_id', 'prof_sub_srv_id','sub_srv_name', 'Name_injection_fld', 'Inj_site_IM', 'Dose_freq', 'Remark','added_by', 'last_modified_by']
    def get_prof_name(self, obj):
        data = {
            "prof_name": obj.srv_prof_id.prof_fullname if obj.srv_prof_id else None,
            "prof_no": obj.srv_prof_id.phone_no if obj.srv_prof_id else None,
           }
        return data
    
    def get_sub_srv_name(self, obj):
        return obj.prof_sub_srv_id.recommomded_service if obj.prof_sub_srv_id else None


class mg_agg_hhc_session_job_closure_serializer_form_5(serializers.ModelSerializer):
    prof_name = serializers.SerializerMethodField()
    sub_srv_name = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['jcolse_id','srv_prof_id','prof_name','dtl_eve_id', 'prof_sub_srv_id','sub_srv_name', 'Catheter_type', 'Size_catheter', 'Procedure', 'Remark','added_by', 'last_modified_by']
    def get_prof_name(self, obj):
        data = {
            "prof_name": obj.srv_prof_id.prof_fullname if obj.srv_prof_id else None,
            "prof_no": obj.srv_prof_id.phone_no if obj.srv_prof_id else None,
           }
        return data
    
    def get_sub_srv_name(self, obj):
        return obj.prof_sub_srv_id.recommomded_service if obj.prof_sub_srv_id else None



class mg_agg_hhc_session_job_closure_serializer_form_6(serializers.ModelSerializer):
    prof_name = serializers.SerializerMethodField()
    sub_srv_name = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['jcolse_id','srv_prof_id','prof_name','dtl_eve_id', 'prof_sub_srv_id','sub_srv_name', 'Remark','added_by', 'last_modified_by']
    def get_prof_name(self, obj):
        data = {
            "prof_name": obj.srv_prof_id.prof_fullname if obj.srv_prof_id else None,
            "prof_no": obj.srv_prof_id.phone_no if obj.srv_prof_id else None,
           }
        return data
    
    def get_sub_srv_name(self, obj):
        return obj.prof_sub_srv_id.recommomded_service if obj.prof_sub_srv_id else None


    
class mg_agg_hhc_session_job_closure_serializer_form_7(serializers.ModelSerializer):
    prof_name = serializers.SerializerMethodField()
    sub_srv_name = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['jcolse_id','srv_prof_id','prof_name','dtl_eve_id', 'prof_sub_srv_id','sub_srv_name', 'Temp_core', 'TBSL', 'Pulse', 'SpO2', 'RR', 'GCS_Total', 'BP','diastolic','added_by', 'last_modified_by']
    def get_prof_name(self, obj):
        data = {
            "prof_name": obj.srv_prof_id.prof_fullname if obj.srv_prof_id else None,
            "prof_no": obj.srv_prof_id.phone_no if obj.srv_prof_id else None,
           }
        return data
    
    def get_sub_srv_name(self, obj):
        return obj.prof_sub_srv_id.recommomded_service if obj.prof_sub_srv_id else None


class mg_agg_hhc_session_job_closure_serializer_form_8(serializers.ModelSerializer):
    prof_name = serializers.SerializerMethodField()
    sub_srv_name = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['jcolse_id','srv_prof_id','prof_name','dtl_eve_id', 'prof_sub_srv_id','sub_srv_name', 'Sutures_type', 'Num_Sutures_staples', 'Wound_dehiscence', 'Wound', 'Remark', 'added_by', 'last_modified_by']
    def get_prof_name(self, obj):
        data = {
            "prof_name": obj.srv_prof_id.prof_fullname if obj.srv_prof_id else None,
            "prof_no": obj.srv_prof_id.phone_no if obj.srv_prof_id else None,
           }
        return data
    
    def get_sub_srv_name(self, obj):
        return obj.prof_sub_srv_id.recommomded_service if obj.prof_sub_srv_id else None



class mg_agg_hhc_session_job_closure_serializer_form_9(serializers.ModelSerializer):
    prof_name = serializers.SerializerMethodField()
    sub_srv_name = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['jcolse_id','srv_prof_id','prof_name','dtl_eve_id', 'prof_sub_srv_id','sub_srv_name', 'Size_RT', 'Procedure', 'Remark','added_by', 'last_modified_by']
    def get_prof_name(self, obj):
        data = {
            "prof_name": obj.srv_prof_id.prof_fullname if obj.srv_prof_id else None,
            "prof_no": obj.srv_prof_id.phone_no if obj.srv_prof_id else None,
           }
        return data
    
    def get_sub_srv_name(self, obj):
        return obj.prof_sub_srv_id.recommomded_service if obj.prof_sub_srv_id else None


   
class mg_agg_hhc_session_job_closure_serializer_form_10(serializers.ModelSerializer):
    prof_name = serializers.SerializerMethodField()
    sub_srv_name = serializers.SerializerMethodField()
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['jcolse_id','srv_prof_id','prof_name','dtl_eve_id', 'prof_sub_srv_id','sub_srv_name', 'Strength_exer', 'Stretch_exer', 'Walk_indep', 'Walker_stick' ,'Remark','added_by', 'last_modified_by']
    def get_prof_name(self, obj):
        data = {
            "prof_name": obj.srv_prof_id.prof_fullname if obj.srv_prof_id else None,
            "prof_no": obj.srv_prof_id.phone_no if obj.srv_prof_id else None,
           }
        return data
    
    def get_sub_srv_name(self, obj):
        return obj.prof_sub_srv_id.recommomded_service if obj.prof_sub_srv_id else None


class agg_hhc_session_job_closure_serializer_form_1(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id','Baseline','Airway', 'Breathing', 'Circulation', 'Temp_core','TBSL','Pulse','SpO2','RR','GCS_Total','BP','diastolic','Skin_Perfusion','Remark','diastolic','is_patient_death', 'last_modified_by']

    def validate(self, data):
        return data


class agg_hhc_session_job_closure_serializer_form_2(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id', 'Movin_or_moveout','Mobin_or_moveout_datetime_remark', 'Getin_or_getout','Getin_or_getout_datetime_remark', 'ChairTobed_or_bedTochair','ChairTobed_or_bedTochair_datetime_remark', 'Situp_onbed','Situp_onbed_datetime_remark','Unocp_or_ocp_bed','Unocp_or_ocp_bed_datetime_remark','Showershampoo','Showershampoo_datetime_remark','Incontinent_care','Incontinent_care_datetime_remark','Mouth_care','Mouth_care_datetime_remark','Shaving','Shaving_datetime_remark','Hand_care','Hand_care_datetime_remark','Foot_care','Foot_care_datetime_remark','Vital_care','vital_care_datetime_remark', 'motion_care','motion_care_datetime_remark', 'Grooming','Grooming_datetime_remark', 'Bed_bath','Bed_bath_datetime_remark', 'Feeding','Feeding_datetime_remark', 'Reposition_patient','Reposition_patient_datetime_remark', 'Bed_pan','Bed_pan_datetime_remark', 'last_modified_by']

    def validate(self, data):
        return data
class agg_hhc_session_job_closure_serializer_form_3(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id','Wound', 'Oozing', 'Discharge', 'Dressing_status', 'last_modified_by']

    def validate(self, data):
        return data
class agg_hhc_session_job_closure_serializer_form_4(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id', 'Name_injection_fld', 'Inj_site_IM', 'Dose_freq', 'Remark', 'last_modified_by']

    def validate(self, data):
        return data
class agg_hhc_session_job_closure_serializer_form_5(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id', 'Catheter_type', 'Size_catheter', 'Procedure', 'Remark', 'last_modified_by']

    def validate(self, data):
        return data

class agg_hhc_session_job_closure_serializer_form_6(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id','prof_sub_srv_id','Baseline','Airway','Breathing','Circulation', 'Remark', 'last_modified_by']

    def validate(self, data):
        return data

class agg_hhc_session_job_closure_serializer_form_7(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id', 'Temp_core', 'TBSL', 'Pulse', 'SpO2', 'RR', 'GCS_Total', 'BP','diastolic', 'last_modified_by']

    def validate(self, data):
        return data

class agg_hhc_session_job_closure_serializer_form_8(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id', 'Sutures_type', 'Num_Sutures_staples', 'Wound_dehiscence', 'Wound', 'Remark', 'last_modified_by']

    def validate(self, data):
        return data

class agg_hhc_session_job_closure_serializer_form_9(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id', 'Size_RT', 'Procedure', 'Remark', 'last_modified_by']

    def validate(self, data):
        return data
class agg_hhc_session_job_closure_serializer_form_10(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_jobclosure_detail
        fields = ['srv_prof_id','dtl_eve_id', 'prof_sub_srv_id', 'Strength_exer', 'Stretch_exer', 'Walk_indep', 'Walker_stick' ,'Remark', 'last_modified_by']

    def validate(self, data):
        return data
    
#======================================================Mohin==================================================================================
class vital_Get_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_vital
        fields = '__all__'
        
class vital_Post_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_vital
        fields = ['vital_pk_id','pulse','systolic_pressure','diastolic_pressure','spo2','respiratory_system_rs','cardiovascular_system_svs','central_nervous_system_cns','skin_and_hair','abdomen','event_id','detailed_plan_of_care','patient_id','prof_id','added_by','last_modified_by','height','weight']
    
class All_Data_Vital_Serializers(serializers.ModelSerializer):
    event_code = serializers.CharField(source='event_id.event_code', read_only=True)
    patient_name = serializers.CharField(source='patient_id.name', read_only=True)
    patient_age = serializers.CharField(source='patient_id.Age', read_only=True)
    patient_no = serializers.CharField(source='patient_id.phone_no', read_only=True)
    patient_gender = serializers.CharField(source='patient_id.gender_id.name', read_only=True)
    caller_no = serializers.CharField(source='patient_id.caller_id.phone', read_only=True)
    caller_name = serializers.CharField(source='patient_id.caller_id.caller_fullname', read_only=True)
    class Meta:
        model = agg_hhc_vital
        fields = ['pulse','systolic_pressure','diastolic_pressure','height','weight','spo2','respiratory_system_rs','cardiovascular_system_svs','central_nervous_system_cns','skin_and_hair','abdomen','event_id','detailed_plan_of_care','patient_id','prof_id','added_by','last_modified_by','event_code','patient_name','patient_name','patient_age','patient_no','patient_gender','caller_no','caller_name']


class Vital_Remark_Post_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_vitals_remark
        fields = ['prescription','note','remark','event_id','detailed_plan_of_care','patient_id','prof_id','vital_id']


# class All_Data_Vital_Serializers(serializers.ModelSerializer):
#     event_code = serializers.CharField(source='event_id.event_code', read_only=True)
#     coupon_id = serializers.IntegerField(source='event_id.coupon_id_id', read_only=True)
#     Invoice_ID = serializers.IntegerField(source='event_id.Invoice_ID', read_only=True)

#     class Meta:
#         model = agg_hhc_vital
#         fields = ['event_code', 'coupon_id', 'Invoice_ID']





from django.db.models import Sum
from decimal import Decimal
class Ongoing_Eve_serializer(serializers.ModelSerializer):
    agg_sp_pt_id=serializers.SerializerMethodField()
    service=serializers.SerializerMethodField()
    payment=serializers.SerializerMethodField()
    job_closure=serializers.SerializerMethodField()
    session_data = serializers.SerializerMethodField()
    class Meta:
        model=agg_hhc_events
        fields = ['eve_id', 'event_code', 'agg_sp_pt_id', 'service', 'payment','discount_type', 'job_closure', 'session_data', 'added_by']
    
    def get_session_data(self, obj):
        cur = timezone.now().date()
        dtl = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id = obj.eve_id, actual_StartDate_Time=cur,status = 1).last()
        dt = {
                'eve_id':dtl.eve_id.eve_id if dtl and dtl.eve_id  else None,
                'sess_index':dtl.index_of_Session if dtl else None,
                'sess_start_date':dtl.actual_StartDate_Time.strftime('%Y-%m-%d') if dtl else None,
                'sess_end_date':dtl.actual_EndDate_Time.strftime('%Y-%m-%d') if dtl else None,
                'sess_start_time':dtl.start_time.strftime('%H:%M:%S')  if dtl else None,
                'sess_end_time':dtl.end_time.strftime('%H:%M:%S')   if dtl  else None
            }
        return dt
            

    def get_service(self, obj):
        plan_of_care = agg_hhc_event_plan_of_care.objects.filter(eve_id=obj.eve_id,status=1).values('eve_poc_id','sub_srv_id','sub_srv_id__recommomded_service','srv_id','srv_id__service_title','start_date','end_date','start_time','end_time').last()
        if plan_of_care:
            data={
                "eve_poc_id":plan_of_care['eve_poc_id'],
                "sub_service_id":plan_of_care['sub_srv_id'],
                "sub_service_start_time":str(plan_of_care['start_time']),
                "sub_service_end_time":str(plan_of_care['end_time']),
                "sub_service":plan_of_care['sub_srv_id__recommomded_service'],
                "service_id":plan_of_care['srv_id'],
                "service": plan_of_care['srv_id__service_title'],
                "start_date": str(plan_of_care['start_date'].strftime('%Y-%m-%d')),
                "end_date": str(plan_of_care['end_date'].strftime('%Y-%m-%d')),
            }
            return data
        else: return None
    
    def get_payment(self, obj):
        final_amount = obj.final_amount
        # paid=models.agg_hhc_payment_details.objects.filter(eve_id=obj.eve_id,overall_status='SUCCESS', status=1).values('amount_paid').aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0
        ammt=agg_hhc_payment_details.objects.filter(eve_id=obj.eve_id,overall_status='SUCCESS', status=1)
        paid = ammt.values('amount_paid').aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0
        # dt = []
        # for i in ammt:
        #     print(i.payment_status.value,"ammtammtammtammtammt")
        #     dt.append(i.payment_status.value)
        ammt_dtl = ammt.order_by('date')
        last_payment = ammt.last()

        # payment_status = last_payment.payment_status.value if last_payment else None
        if obj.discount_type == 3:
            payment_status = 100
        else:
            payment_status = last_payment.payment_status.value if last_payment else None

        # last_amt= ammt.first()
        # print(last_amt.payment_status.value)
        data = {
            "final_amount":final_amount,
            "paid_amount":round(paid),
            "pending_amount":round(final_amount-float(paid)),
            "payment_status":payment_status
        }   
        return data

    def get_job_closure(self, obj):
        detail_eve = agg_hhc_detailed_event_plan_of_care.objects.filter(eve_id=obj.eve_id, status=1).order_by('actual_StartDate_Time')
        total_session = detail_eve.count()
        job_closure_count = sum(1 for i in detail_eve if i.Session_jobclosure_status == 1)
        today = timezone.now().date()

        if detail_eve:
            if detail_eve[0].actual_StartDate_Time < today:
                prof_data = detail_eve[0].srv_prof_id
            elif detail_eve[0].actual_StartDate_Time > today:
                prof_data = detail_eve.last().srv_prof_id
            else:
                prof_data = detail_eve.filter(actual_StartDate_Time=today).last().srv_prof_id

            if prof_data:
                prof = prof_data.prof_fullname
                prof_id = prof_data.srv_prof_id
            else:
                prof = ""
                prof_id = None

            data = {
                "srv_prof_id": prof_id,
                "service_professional": prof,
                "total_session": total_session,
                "job_closure_count": job_closure_count,
                "job_closure_pending": total_session - job_closure_count
            }
            return data
        else:
            return 'no_data_available_for this event'


    def get_agg_sp_pt_id(self, obj):
        patient=obj.agg_sp_pt_id
        caller=obj.caller_id
        data={
            "patient_id":patient.agg_sp_pt_id,
            "name":patient.name,
            "phone":patient.phone_no,
            "caller_phone":caller.phone,
            "caller_name":caller.caller_fullname,
            "patient_email_id":patient.patient_email_id,
            "zone_id":patient.prof_zone_id.prof_zone_id if hasattr(patient.prof_zone_id,'prof_zone_id') else None,
            "zone":patient.prof_zone_id.Name if hasattr(patient.prof_zone_id,'Name') else None,
            "caller_id":caller.caller_id,
        }
        return data


class Telemedicine_VideoCall_Data_Save_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_telemedicine_videocall      
        fields = ['tv_pk_id','link','event_id','patient_id','patinet_name','dtpoc_id','added_by','last_modified_by']

class Telemedicine_VideoCall_Data_Save_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_telemedicine_videocall
        fields = ['tv_pk_id','link','event_id','patient_id','patinet_name','dtpoc_id','added_by','last_modified_by']
        
        
# class patients_details_Serializer(serializers.ModelSerializer):
#     cons_name = serializers.CharField(source='doct_cons_id.cons_fullname', read_only=True)
#     class Meta:
#         model = agg_hhc_patients
#         fields = ['agg_sp_pt_id','name','Age','phone_no','gender_id','Suffered_from','hospital_name','doct_cons_id','cons_name']
        
class caller_details_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_callers
        fields = ['caller_id','phone','caller_fullname']  
        

class patients_details_Serializer(serializers.ModelSerializer):
    name = serializers.CharField(source='eve_id.agg_sp_pt_id.name', read_only=True)
    Age = serializers.CharField(source='eve_id.agg_sp_pt_id.Age', read_only=True)
    phone_no = serializers.CharField(source='eve_id.agg_sp_pt_id.phone_no', read_only=True)
    gender_id = serializers.CharField(source='eve_id.agg_sp_pt_id.gender_id.name', read_only=True)
    Suffered_from = serializers.CharField(source='eve_id.agg_sp_pt_id.Suffered_from', read_only=True)
    cons_name = serializers.CharField(source='eve_id.agg_sp_pt_id.doct_cons_id.cons_fullname', read_only=True)
    hospital_name = serializers.CharField(source='hosp_id.hospital_name', read_only=True)
    class Meta:
        model = agg_hhc_event_plan_of_care
        fields = ['eve_id','name','Age','phone_no','gender_id','Suffered_from','cons_name','hospital_name'] 
        
        
class Vital_details_update_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_hhc_vital
        fields = ['vital_pk_id','pulse','systolic_pressure','diastolic_pressure','spo2','respiratory_system_rs','cardiovascular_system_svs','central_nervous_system_cns','skin_and_hair','abdomen','last_modified_by','height','weight']
    

#======================================================Mohin==================================================================================