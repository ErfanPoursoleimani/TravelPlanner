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
from django.urls import path, include
from apps.planner.views import views
from apps.planner.views.views import GoogleLoginView, GitHubLoginView
from apps.planner.views.views import ProtectedView

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('auth/login/', views.LoginView.as_view(), name='login'),
    # path('auth/register/', views.register_view, name='register'),
    # path('auth/logout/', views.logout_view, name='logout'),
    
    path('auth/', include('dj_rest_auth.urls')),  
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('auth/social/', include('allauth.socialaccount.urls')), 
    path("auth/google/", GoogleLoginView.as_view(), name="google-login"),
    path("auth/github/", GitHubLoginView.as_view(), name="github-login"),

    path("protected/", ProtectedView.as_view(), name="protected"),
]
