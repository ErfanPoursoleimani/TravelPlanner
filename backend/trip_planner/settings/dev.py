from .base import *
import os
os.environ['GDAL_LIBRARY_PATH'] = r'C:\Program Files\GDAL\gdal311.dll'
DEBUG = True
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-vf)ij02850+)zri3hb-o7xn-)e&-^nx83n55g6xdnmim@0u977')
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql'
,
        # 'NAME': os.environ.get('DB_NAME', 'root'),
        # 'USER': os.environ.get('DB_USER', 'postgres'),
        # 'PASSWORD': os.environ.get('DB_PASSWORD', 'Erf@npoo85'),
        # 'HOST': os.environ.get('DB_HOST', 'localhost'),
        # 'PORT': os.environ.get('DB_PORT', '5432'),
        'NAME': "tripPlanner",
        'USER': "tripUser",
        'PASSWORD': 'Erf@npoo85',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'logs' / 'trip_planner.log',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
        'apps/planner': {
            'handlers': ['file', 'console'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
GOOGLE_PLACES_API_KEY = os.environ.get('GOOGLE_PLACES_API_KEY')
WEATHER_API_KEY = os.environ.get('WEATHER_API_KEY')
BOOKING_API_KEY = os.environ.get('BOOKING_API_KEY')

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

CSRF_EXEMPT_URLS = [
    r'^/auth/google/$',
    r'^/auth/github/$',
]



