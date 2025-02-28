from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from hhc_admin.serializers import *
from hhcweb.models import *
# Create your views here.


class NewHospitalRegistration(APIView):
    def get(self, request, pk=None):  # Add 'pk=None' to the get method
        if pk is not None:
            hospital = agg_hhc_hospitals.objects.get(hosp_id=pk)
            serializer = NewHospitalRegistrationSerializer(hospital)
            return Response(serializer.data)
        else:
            snippets = agg_hhc_hospitals.objects.all()
            serializer = NewHospitalRegistrationSerializer(snippets, many=True)
            return Response(serializer.data)
    
    def post(self, request, pk=None):  # Add 'pk=None' to the get method
        serializer = NewHospitalRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self,request): 
        pk=request.data.get('hosp_id')
        try:
            obj=agg_hhc_hospitals.objects.get(hosp_id=pk)
            serialized= NewHospitalRegistrationSerializer(obj,data=request.data)
            if(serialized.is_valid()):
                serialized.save()
                return Response(serialized.data)
            return Response(serialized.errors,status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'error': 'Please provide a valid hospital ID.'}, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request):  
        pk=request.data.get('hosp_id')
        try:
            hospital = agg_hhc_hospitals.objects.get(pk=pk)
            hospital.status = 2
            hospital.save()
            return Response({'message': 'Delete Hospital Successfully'}, status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({'error': 'Please provide a valid hospital ID.'}, status=status.HTTP_400_BAD_REQUEST)
    
     