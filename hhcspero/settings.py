
from pathlib import Path
from datetime import timedelta
import os


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-gelhauh(a&-!e01zl$_ic4l07frx!1qx^h(zjitk(c57w(n6ry'
GOOGLE_KEY = 'AIzaSyBeJqPCMUVSGtOmMO7sLs6vSqNHBrmNKFo'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
# DEBUG = False

#ALLOWED_HOSTS = ['b0e0-103-186-133-168.ngrok-free.app']
ALLOWED_HOSTS = ['192.168.1.109','122.176.232.35','0.0.0.0', 'sperohealthcare.in',
                #  'hhc.hospitalguru.in',
                 '127.0.0.1', 'localhost']
#ALLOWED_HOST = ['0.0.0.0']
# AUTH_USER_MODEL = 'hhcweb.agg_hhc_callers'

# Textlocal Settings - SMS
TEXTLOCAL_API_KEY  = 'DYj0ooG2pfo-150ozYrDn36WfoGBkZOum6v5J76fIk'

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # 'django.contrib.media', # Amit    
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'hhcapp',
    'hhcweb',
    # 'hhchr',
    'hhc_hcm',
    'hhc_professional_app',
    # 'hhc_admin',
    'hhchr',
    'hhc_reports',
    'rest_framework',
    "corsheaders",
    "hhc_account"
    
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'hhcspero.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR,'HHC_client/build')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'hhcspero.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    # 'default': {
    #     'ENGINE': 'django.db.backends.sqlite3',
    #     'NAME':os.path.join(BASE_DIR,'db.sqlite3'),
    # }

    # 'default': {
    #     'ENGINE' : 'django.db.backends.postgresql',
    #     'NAME' : 'test3',
    #     'USER' : 'postgres',
    #     'PASSWORD' : 'root',
    #     'HOST' : 'localhost',
    #     'PORT' : '5432'
    # }

    
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'test_cicd',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': '192.168.1.109',
        'PORT': '5432',  # Default PostgreSQL port
        'OPTIONS': {
            'options': '-c timezone=Asia/Kolkata',
        },
    }
}



REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
    # ,
    # 'DEFAULT_RENDERER_CLASSES':('rest_framework.renderers.JSONRenderer',)
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Kolkata'

USE_I18N = True

USE_L10N = True

USE_TZ = False

AUTH_KEY = 'c27d7fa6-292c-4534-8dc4-a0dd28e7d7e3'

SERVER_KEY = 'AAAAZz1Av20:APA91bGnZoa_Qtt_rklf2eWRXGd53bIOHmRNlIG-9oWtcSQieQV-UGTzVRFgjoZRGi7iO3K-MDoM8_XePDBpUjl7s-5g2FGkmdOh8zQK-MNID6RHrVMFccM1I9F9RLWCC0wVyaB3p-dt'

STATIC_URL = 'static/'

STATICFILES_DIRS = [
    os.path.join(BASE_DIR,'HHC_client/build/static')
]

STATIC_ROOT = os.path.join(BASE_DIR, 'static')



MEDIA_ROOT = BASE_DIR / "media"

MEDIA_URL ="/media/"




# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'hhcweb.agg_com_colleague'



SIMPLE_JWT = {
    # "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "ACCESS_TOKEN_LIFETIME": timedelta(days=90),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=90),


    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",

    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",

    "JTI_CLAIM": "jti",

    "TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainPairSerializer",
    "TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSerializer",
    "TOKEN_VERIFY_SERIALIZER": "rest_framework_simplejwt.serializers.TokenVerifySerializer",
    "TOKEN_BLACKLIST_SERIALIZER": "rest_framework_simplejwt.serializers.TokenBlacklistSerializer",
    "SLIDING_TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainSlidingSerializer",
    "SLIDING_TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSlidingSerializer",
}

PASSWORD_RESET_TIMEOUT=900

CORS_ALLOW_ALL_ORIGINS = False

CORS_ALLOWED_ORIGINS=[
    "http://192.168.1.109:8050",
    "http://122.176.232.35:8050",
    "http://localhost:3000",
    "http://localhost:3001"
]











# # BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath('django_logs/django_logger.log')))
# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# LOG_FILE_PATH = os.path.join(BASE_DIR, 'logs', 'django_logs/django_logger.log')

# if not os.path.exists(os.path.dirname(LOG_FILE_PATH)):
#     os.makedirs(os.path.dirname(LOG_FILE_PATH))

# LOGGING = {
#     'version': 1,
#     'disable_existing_loggers': False,
#     'formatters': {
#         'verbose': {
#             'format': '{levelname} {asctime} {module} {message}',
#             'style': '{',
#         },
#         'simple': {
#             'format': '{levelname} {message}',
#             'style': '{',
#         },
#     },
#     'handlers': {
#         'file': {
#             'level': 'INFO',  # Adjust the logging level as needed (INFO, WARNING, ERROR, CRITICAL)
#             'class': 'logging.FileHandler',
#             'filename': 'django_logs/django_logger.log',
#             'formatter': 'verbose',
#         },
#     },
#     'root': {
#         'handlers': ['file'],
#         'level': 'INFO',  # Set the logging level for the root logger
#     },
# }


