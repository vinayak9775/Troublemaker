from django.urls import path
from hhc_admin import views

urlpatterns = [
    path('hospital_api',views.NewHospitalRegistration.as_view())
]