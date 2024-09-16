import pytest
from django.test import TestCase
# myapp/tests/test_views.py
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_srv_sess_api():
    client = APIClient()
    url = reverse('srv_sess_api', kwargs={'srv_prof_id': 1, 'eve_id': 7})  # Replace with appropriate IDs
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK  
