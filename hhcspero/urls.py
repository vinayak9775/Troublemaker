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