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
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers

# Import your custom views properly - FIXED: Remove the conflicting import
from apps.planner.views.views import (
    GoogleLoginView,
    GitHubLoginView,
    ProtectedView,
    LogoutView,
    UserProfileView,
    # Import all the views you need directly
    UserViewSet,
    UserPreferencesViewSet,
    DestinationViewSet,
    PointOfInterestViewSet,
    TripViewSet,
    ItineraryItemViewSet,
    AccommodationViewSet,
    TransportationSegmentViewSet,
    DestinationPOIViewSet,
    DestinationWeatherViewSet,
    ReviewViewSet,
    AIRecommendationViewSet,
    AITrainingFeedbackViewSet,
    UserInteractionViewSet,
    SavedItemViewSet,
    TripShareViewSet,
    WeatherDataViewSet,
    PricingDataViewSet,
    RegisterView,
    LoginView,
    ProfileView,
    ChangePasswordView,
    DestinationSearchView,
    POISearchView,
    TripSearchView,
    GenerateItineraryView,
    GetRecommendationsView,
    OptimizeTripView,
    UserStatsView,
    TripInsightsView,
    ImageUploadView,
    GeocodeView,
    WeatherForecastView,
    PublicDestinationsView,
    PopularDestinationsView,
)

# Main router
router = DefaultRouter()

# User and profile endpoints
router.register(r"users", UserViewSet, basename="user")
router.register(r"user-preferences", UserPreferencesViewSet, basename="userpreferences")

# Destination and POI endpoints
router.register(r"destinations", DestinationViewSet, basename="destination")
router.register(r"pois", PointOfInterestViewSet, basename="poi")

# Trip management endpoints
router.register(r"trips", TripViewSet, basename="trip")

# Reviews and ratings
router.register(r"reviews", ReviewViewSet, basename="review")

# AI and recommendations
router.register(
    r"ai-recommendations", AIRecommendationViewSet, basename="airecommendation"
)
router.register(r"ai-feedback", AITrainingFeedbackViewSet, basename="aifeedback")

# User interactions and analytics
router.register(
    r"user-interactions", UserInteractionViewSet, basename="userinteraction"
)
router.register(r"saved-items", SavedItemViewSet, basename="saveditem")

# Sharing and collaboration
router.register(r"trip-shares", TripShareViewSet, basename="tripshare")

# Weather and pricing data
router.register(r"weather-data", WeatherDataViewSet, basename="weatherdata")
router.register(r"pricing-data", PricingDataViewSet, basename="pricingdata")

# Nested routers for related resources
trips_router = routers.NestedDefaultRouter(router, r"trips", lookup="trip")
trips_router.register(
    r"itinerary-items", ItineraryItemViewSet, basename="trip-itinerary-items"
)
trips_router.register(
    r"accommodations", AccommodationViewSet, basename="trip-accommodations"
)
trips_router.register(
    r"transportation-segments",
    TransportationSegmentViewSet,
    basename="trip-transportation-segments",
)

destinations_router = routers.NestedDefaultRouter(
    router, r"destinations", lookup="destination"
)
destinations_router.register(
    r"pois", DestinationPOIViewSet, basename="destination-pois"
)
destinations_router.register(
    r"weather", DestinationWeatherViewSet, basename="destination-weather"
)

urlpatterns = [
    path("admin/", admin.site.urls),
    # Custom OAuth views (your implementation)
    path("auth/google/", GoogleLoginView.as_view(), name="google-login"),
    path("auth/github/", GitHubLoginView.as_view(), name="github-login"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/profile/", UserProfileView.as_view(), name="user_profile"),
    # Protected endpoint
    path("protected/", ProtectedView.as_view(), name="protected"),
    # traditional registration/login
    # path('auth/', include('dj_rest_auth.urls')),
    # path('auth/registration/', include('dj_rest_auth.registration.urls')),
    # path('auth/social/', include('allauth.socialaccount.urls')),
    path("api/v1/", include(router.urls)),
    path("api/v1/", include(trips_router.urls)),
    path("api/v1/", include(destinations_router.urls)),
    # Authentication endpoints
    path("api/v1/auth/register/", RegisterView.as_view(), name="auth-register"),
    path("api/v1/auth/login/", LoginView.as_view(), name="auth-login"),
    path("api/v1/auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path("api/v1/auth/profile/", ProfileView.as_view(), name="auth-profile"),
    path(
        "api/v1/auth/change-password/",
        ChangePasswordView.as_view(),
        name="auth-change-password",
    ),
    # Search endpoints
    path(
        "api/v1/search/destinations/",
        DestinationSearchView.as_view(),
        name="search-destinations",
    ),
    path("api/v1/search/pois/", POISearchView.as_view(), name="search-pois"),
    path("api/v1/search/trips/", TripSearchView.as_view(), name="search-trips"),
    # AI-powered endpoints
    path(
        "api/v1/ai/generate-itinerary/",
        GenerateItineraryView.as_view(),
        name="ai-generate-itinerary",
    ),
    path(
        "api/v1/ai/get-recommendations/",
        GetRecommendationsView.as_view(),
        name="ai-get-recommendations",
    ),
    path(
        "api/v1/ai/optimize-trip/",
        OptimizeTripView.as_view(),
        name="ai-optimize-trip",
    ),
    # Analytics and reporting
    path(
        "api/v1/analytics/user-stats/",
        UserStatsView.as_view(),
        name="analytics-user-stats",
    ),
    path(
        "api/v1/analytics/trip-insights/",
        TripInsightsView.as_view(),
        name="analytics-trip-insights",
    ),
    # Utility endpoints
    path(
        "api/v1/utils/upload-image/",
        ImageUploadView.as_view(),
        name="utils-upload-image",
    ),
    path("api/v1/utils/geocode/", GeocodeView.as_view(), name="utils-geocode"),
    path(
        "api/v1/utils/weather-forecast/",
        WeatherForecastView.as_view(),
        name="utils-weather-forecast",
    ),
    # Public endpoints (no authentication required)
    path(
        "api/v1/public/destinations/",
        PublicDestinationsView.as_view(),
        name="public-destinations",
    ),
    path(
        "api/v1/public/popular-destinations/",
        PopularDestinationsView.as_view(),
        name="public-popular-destinations",
    ),
]
