"""
URL configuration for hhcspero project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from . views import index
from hhcspero import settings
from django.conf.urls.static import static
from .views import SendSMSView,ConcentSendSMSView
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('hhc/', index),
    path('', index),
    path('web/',include('hhcweb.urls')),
    path('enq_send_sms/', SendSMSView.as_view()),
    # path('concent_sms/<int:eve_id>',ConcentSendSMSView.as_view()),
    path('concent_sms/<int:eve_id>',ConcentSendSMSView.as_view()),
    path('app/',include('hhcapp.urls')),
    path('pro_app/',include('hhc_professional_app.urls')),
    path('hr/',include('hhchr.urls')),
    path('hhc_hcm/',include('hhc_hcm.urls')),
    path('hhc_repo/',include('hhc_reports.urls')),
    path('hhc_account/',include('hhc_account.urls')),
    path('medical/',include('medical_gov.urls')),
    

    # re_path(r'^hhc/.*', index),
    # re_path(r'^.*', index),
]
# +static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)



if settings.DEBUG:
    urlpatterns += [
        path('', TemplateView.as_view(template_name='index.html')),
    ]

# Serve static and media files during development
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Catch-all pattern for the frontend
# urlpatterns += [re_path(r'^.*', index)]
urlpatterns += [re_path(r'^.*', index)]


