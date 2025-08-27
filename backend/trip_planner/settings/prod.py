from .base import *

import os

os.environ["GDAL_LIBRARY_PATH"] = r"C:\Program Files\GDAL\gdal311.dll"

DEBUG = False
SECRET_KEY = os.environ["SECRET_KEY"]
ALLOWED_HOSTS = ["yourdomain.com"]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        # 'NAME': os.environ['DB_NAME'],
        # 'USER': os.environ['DB_USER'],
        # 'PASSWORD': os.environ['DB_PASSWORD'],
        # 'HOST': os.environ['DB_HOST'],
        # 'PORT': os.environ['DB_PORT'],
        "NAME": "tripPlanner",
        "USER": "tripUser",
        "PASSWORD": "Erf@npoo85",
        "HOST": "127.0.0.1",
        "PORT": "5432",
    }
}

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = os.environ["EMAIL_HOST"]
EMAIL_PORT = int(os.environ.get("EMAIL_PORT", "587"))
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ["EMAIL_HOST_USER"]
EMAIL_HOST_PASSWORD = os.environ["EMAIL_HOST_PASSWORD"]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
CORS_ALLOW_CREDENTIALS = True


OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
GOOGLE_PLACES_API_KEY = os.environ.get("GOOGLE_PLACES_API_KEY")
WEATHER_API_KEY = os.environ.get("WEATHER_API_KEY")
BOOKING_API_KEY = os.environ.get("BOOKING_API_KEY")
