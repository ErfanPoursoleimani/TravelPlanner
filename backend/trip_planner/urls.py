"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
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
from django.urls import path

# Import your custom views properly
from apps.planner.views.views import (
    GoogleLoginView, 
    GitHubLoginView, 
    ProtectedView,
    LogoutView,
    UserProfileView
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Custom OAuth views (your implementation)
    path("auth/google/", GoogleLoginView.as_view(), name="google-login"),
    path("auth/github/", GitHubLoginView.as_view(), name="github-login"),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/profile/', UserProfileView.as_view(), name='user_profile'),
    
    # Protected endpoint
    path("protected/", ProtectedView.as_view(), name="protected"),
    
    # traditional registration/login
    
    # path('auth/', include('dj_rest_auth.urls')),  
    # path('auth/registration/', include('dj_rest_auth.registration.urls')),
    # path('auth/social/', include('allauth.socialaccount.urls')), 
]