from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import requests
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.conf import settings
import json
import logging

from rest_framework import viewsets, status, generics, permissions, filters
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import authenticate, login, logout
from django.db.models import Q, Count, Avg
from django.utils import timezone
from datetime import timedelta
import uuid

from ..models.models import (
    User,
    UserPreferences,
    Destination,
    PointOfInterest,
    Trip,
    ItineraryItem,
    TransportationSegment,
    Accommodation,
    AIRecommendation,
    UserInteraction,
    Review,
    TripShare,
    WeatherData,
    PricingData,
    AITrainingFeedback,
    SavedItem,
)
from ..serializers.serializers import (
    UserSerializer,
    UserPreferencesSerializer,
    DestinationSerializer,
    PointOfInterestSerializer,
    TripSerializer,
    ItineraryItemSerializer,
    TransportationSegmentSerializer,
    AccommodationSerializer,
    AIRecommendationSerializer,
    UserInteractionSerializer,
    ReviewSerializer,
    TripShareSerializer,
    WeatherDataSerializer,
    PricingDataSerializer,
    AITrainingFeedbackSerializer,
    SavedItemSerializer,
)

from rest_framework import mixins, viewsets


# Authentication Views
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "user": UserSerializer(user).data,
                    "message": "User created successfully",
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            return Response(
                {"user": UserSerializer(user).data, "message": "Login successful"}
            )
        return Response(
            {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"message": "Logout successful"})


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not user.check_password(old_password):
            return Response(
                {"error": "Invalid old password"}, status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()
        return Response({"message": "Password changed successfully"})


# User Management ViewSets
class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)


class UserPreferencesViewSet(viewsets.ModelViewSet):
    serializer_class = UserPreferencesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserPreferences.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# Destination and POI ViewSets
class DestinationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["country", "region", "city", "cost_level", "safety_rating"]
    search_fields = ["name", "country", "city", "description"]
    ordering_fields = ["name", "cost_level", "safety_rating", "created_at"]

    @action(detail=True, methods=["get"])
    def weather(self, request, pk=None):
        destination = self.get_object()
        weather_data = destination.weather_data.filter(
            date__gte=timezone.now().date(),
            date__lte=timezone.now().date() + timedelta(days=14),
        )
        serializer = WeatherDataSerializer(weather_data, many=True)
        return Response(serializer.data)


class DestinationPOIViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PointOfInterestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        destination_pk = self.kwargs["destination_pk"]
        return PointOfInterest.objects.filter(destination_id=destination_pk)


class DestinationWeatherViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = WeatherDataSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        destination_pk = self.kwargs["destination_pk"]
        return WeatherData.objects.filter(destination_id=destination_pk)


class PointOfInterestViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PointOfInterest.objects.all()
    serializer_class = PointOfInterestSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["category", "price_level", "destination"]
    search_fields = ["name", "description", "category"]


# Trip Management ViewSets
class TripViewSet(viewsets.ModelViewSet):
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["status", "ai_generated"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def duplicate(self, request, pk=None):
        trip = self.get_object()
        new_trip = trip
        new_trip.pk = None
        new_trip.id = uuid.uuid4()
        new_trip.title = f"{trip.title} (Copy)"
        new_trip.status = "planning"
        new_trip.save()

        # Duplicate itinerary items
        for item in trip.itinerary_items.all():
            item.pk = None
            item.id = uuid.uuid4()
            item.trip = new_trip
            item.save()

        return Response(TripSerializer(new_trip).data)


class ItineraryItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItineraryItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        trip_pk = self.kwargs["trip_pk"]
        return ItineraryItem.objects.filter(
            trip_id=trip_pk, trip__user=self.request.user
        )

    def perform_create(self, serializer):
        trip_pk = self.kwargs["trip_pk"]
        trip = Trip.objects.get(pk=trip_pk, user=self.request.user)
        serializer.save(trip=trip)


class AccommodationViewSet(viewsets.ModelViewSet):
    serializer_class = AccommodationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        trip_pk = self.kwargs["trip_pk"]
        return Accommodation.objects.filter(
            trip_id=trip_pk, trip__user=self.request.user
        )

    def perform_create(self, serializer):
        trip_pk = self.kwargs["trip_pk"]
        trip = Trip.objects.get(pk=trip_pk, user=self.request.user)
        serializer.save(trip=trip)


class TransportationSegmentViewSet(viewsets.ModelViewSet):
    serializer_class = TransportationSegmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        trip_pk = self.kwargs["trip_pk"]
        return TransportationSegment.objects.filter(
            trip_id=trip_pk, trip__user=self.request.user
        )

    def perform_create(self, serializer):
        trip_pk = self.kwargs["trip_pk"]
        trip = Trip.objects.get(pk=trip_pk, user=self.request.user)
        serializer.save(trip=trip)


# AI and Recommendations ViewSets
class AIRecommendationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AIRecommendationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AIRecommendation.objects.filter(user=self.request.user)

    @action(detail=True, methods=["post"])
    def feedback(self, request, pk=None):
        recommendation = self.get_object()
        feedback = request.data.get("feedback")
        recommendation.user_feedback = feedback
        recommendation.save()
        return Response({"message": "Feedback recorded"})


class AITrainingFeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = AITrainingFeedbackSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AITrainingFeedback.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# Reviews and Social Features
class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TripShareViewSet(viewsets.ModelViewSet):
    serializer_class = TripShareSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TripShare.objects.filter(
            Q(shared_by_user=self.request.user) | Q(shared_with_user=self.request.user)
        )


# User Interactions and Analytics
class UserInteractionViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    serializer_class = UserInteractionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SavedItemViewSet(viewsets.ModelViewSet):
    serializer_class = SavedItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SavedItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# Weather and Pricing Data
class WeatherDataViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = WeatherData.objects.all()
    serializer_class = WeatherDataSerializer
    permission_classes = [IsAuthenticated]


class PricingDataViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PricingData.objects.all()
    serializer_class = PricingDataSerializer
    permission_classes = [IsAuthenticated]


# Search Views
class DestinationSearchView(generics.ListAPIView):
    serializer_class = DestinationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query = self.request.GET.get("q", "")
        return Destination.objects.filter(
            Q(name__icontains=query)
            | Q(country__icontains=query)
            | Q(city__icontains=query)
            | Q(description__icontains=query)
        )


class POISearchView(generics.ListAPIView):
    serializer_class = PointOfInterestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query = self.request.GET.get("q", "")
        return PointOfInterest.objects.filter(
            Q(name__icontains=query)
            | Q(description__icontains=query)
            | Q(category__icontains=query)
        )


class TripSearchView(generics.ListAPIView):
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query = self.request.GET.get("q", "")
        return Trip.objects.filter(user=self.request.user).filter(
            Q(title__icontains=query) | Q(description__icontains=query)
        )


# AI-Powered Views
class GenerateItineraryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # This would integrate with your AI service
        # For now, returning a placeholder response
        prompt = request.data.get("prompt", "")
        trip_id = request.data.get("trip_id")

        # TODO: Implement AI itinerary generation logic

        return Response(
            {"message": "Itinerary generation started", "job_id": str(uuid.uuid4())}
        )


class GetRecommendationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        recommendations = AIRecommendation.objects.filter(user=request.user).order_by(
            "-created_at"
        )[:10]

        serializer = AIRecommendationSerializer(recommendations, many=True)
        return Response(serializer.data)


class OptimizeTripView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        trip_id = request.data.get("trip_id")
        optimization_type = request.data.get("type", "time")  # time, cost, distance

        # TODO: Implement trip optimization logic

        return Response({"message": "Trip optimization completed", "optimized": True})


# Analytics Views
class UserStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        stats = {
            "total_trips": user.trips.count(),
            "completed_trips": user.trips.filter(status="completed").count(),
            "countries_visited": user.trips.filter(status="completed")
            .values("itinerary_items__poi__destination__country")
            .distinct()
            .count(),
            "total_reviews": user.reviews.count(),
            "saved_items": user.saved_items.count(),
        }
        return Response(stats)


class TripInsightsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        trip_id = request.GET.get("trip_id")
        trip = Trip.objects.get(id=trip_id, user=request.user)

        insights = {
            "duration_days": trip.duration_days,
            "total_activities": trip.itinerary_items.count(),
            "estimated_cost": trip.total_budget,
            "destinations_count": trip.itinerary_items.values("poi__destination")
            .distinct()
            .count(),
        }
        return Response(insights)


# Utility Views
class ImageUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # TODO: Implement image upload to cloud storage
        return Response({"url": "https://example.com/uploaded-image.jpg"})


class GeocodeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        address = request.GET.get("address", "")
        # TODO: Implement geocoding service integration
        return Response(
            {"latitude": 40.7128, "longitude": -74.0060, "address": address}
        )


class WeatherForecastView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        lat = request.GET.get("lat")
        lng = request.GET.get("lng")
        # TODO: Implement weather service integration
        return Response(
            {"current": {"temperature": 22, "condition": "sunny"}, "forecast": []}
        )


# Public Views (no authentication required)
class PublicDestinationsView(generics.ListAPIView):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    permission_classes = [AllowAny]


class PopularDestinationsView(generics.ListAPIView):
    serializer_class = DestinationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Destination.objects.annotate(
            trip_count=Count("pois__itineraryitem__trip")
        ).order_by("-trip_count")[:10]


# Auth =============================================================================


logger = logging.getLogger(__name__)


class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "message": f"Hello, {request.user.username}! This is a protected endpoint.",
                "user": {
                    "id": request.user.id,
                    "username": request.user.username,
                    "email": request.user.email,
                },
            },
            status=200,
        )


@method_decorator(csrf_exempt, name="dispatch")
class GoogleLoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        try:
            # Debug: Print request data
            logger.info(f"Request data: {request.data}")

            token = request.data.get("token")
            if not token:
                logger.error("No token provided in request")
                return Response(
                    {"success": False, "error": "Token is required"}, status=400
                )

            logger.info(f"Token received: {token[:50]}...")  # Log first 50 chars

            # Use settings for client ID
            # client_id = getattr(settings, 'GOOGLE_OAUTH2_CLIENT_ID', None)
            client_id = "213670148556-dq7i7pqpnmltnt6hdeftn2fl41ljpod2.apps.googleusercontent.com"
            if not client_id:
                logger.error("Google OAuth2 Client ID not configured")
                return Response(
                    {"success": False, "error": "OAuth not properly configured"},
                    status=500,
                )

            # Verify the Google token
            idinfo = id_token.verify_oauth2_token(
                token, google_requests.Request(), client_id
            )

            logger.info(f"Token verified successfully for email: {idinfo.get('email')}")

            # Validate issuer
            if idinfo["iss"] not in [
                "accounts.google.com",
                "https://accounts.google.com",
            ]:
                logger.error(f"Invalid token issuer: {idinfo['iss']}")
                return Response(
                    {"success": False, "error": "Invalid token issuer"}, status=400
                )

            # Extract user info
            email = idinfo.get("email")
            name = idinfo.get("name", "")
            given_name = idinfo.get("given_name", "")
            family_name = idinfo.get("family_name", "")
            picture = idinfo.get("picture", "")

            if not email:
                return Response(
                    {"success": False, "error": "Email not found in token"}, status=400
                )

            # Create or get user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": email,  # Use email as username
                    "first_name": given_name,
                    "last_name": family_name,
                },
            )

            # Update user info if not created
            if not created:
                user.first_name = given_name
                user.last_name = family_name
                user.save()

            # Create or get token
            auth_token, token_created = Token.objects.get_or_create(user=user)

            logger.info(
                f"User authentication successful: {user.email}, created: {created}"
            )

            return Response(
                {
                    "success": True,
                    "token": auth_token.key,
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "name": f"{user.first_name} {user.last_name}".strip()
                        or user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                    },
                    "created": created,
                },
                status=200,
            )

        except ValueError as e:
            logger.error(f"ValueError: {str(e)}")
            return Response(
                {"success": False, "error": f"Invalid token: {str(e)}"}, status=400
            )
        except Exception as e:
            logger.error(f"Exception: {str(e)}")
            return Response(
                {"success": False, "error": "Authentication failed"}, status=500
            )


class GitHubLoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        try:
            code = request.data.get("code")
            if not code:
                return Response(
                    {"success": False, "error": "Authorization code is required"},
                    status=400,
                )

            # Get GitHub OAuth settings from Django settings
            client_id = getattr(settings, "GITHUB_CLIENT_ID", None)
            client_secret = getattr(settings, "GITHUB_CLIENT_SECRET", None)

            if not client_id or not client_secret:
                logger.error("GitHub OAuth credentials not configured")
                return Response(
                    {"success": False, "error": "GitHub OAuth not properly configured"},
                    status=500,
                )

            # 1️⃣ Exchange code for access_token
            token_url = "https://github.com/login/oauth/access_token"
            headers = {"Accept": "application/json"}
            data = {
                "client_id": client_id,
                "client_secret": client_secret,
                "code": code,
            }

            token_res = requests.post(token_url, headers=headers, data=data)

            if token_res.status_code != 200:
                logger.error(f"GitHub token exchange failed: {token_res.text}")
                return Response(
                    {"success": False, "error": "Failed to exchange code for token"},
                    status=400,
                )

            token_json = token_res.json()
            access_token = token_json.get("access_token")

            if not access_token:
                logger.error(f"No access token in response: {token_json}")
                return Response(
                    {"success": False, "error": "Failed to get GitHub access token"},
                    status=400,
                )

            # 2️⃣ Fetch user info
            user_res = requests.get(
                "https://api.github.com/user",
                headers={
                    "Authorization": f"Bearer {access_token}",  # Updated to Bearer
                    "Accept": "application/vnd.github.v3+json",
                },
            )

            if user_res.status_code != 200:
                logger.error(f"GitHub user fetch failed: {user_res.text}")
                return Response(
                    {"success": False, "error": "Failed to fetch user information"},
                    status=400,
                )

            user_json = user_res.json()

            # Get user email (might be private)
            email_res = requests.get(
                "https://api.github.com/user/emails",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/vnd.github.v3+json",
                },
            )

            primary_email = user_json.get("email")
            if not primary_email and email_res.status_code == 200:
                emails = email_res.json()
                for email_obj in emails:
                    if email_obj.get("primary"):
                        primary_email = email_obj.get("email")
                        break

            # Fallback if no email found
            if not primary_email:
                primary_email = f"{user_json['login']}@github.com"

            # 3️⃣ Create or get user in Django
            user, created = User.objects.get_or_create(
                username=user_json["login"],
                defaults={
                    "email": primary_email,
                    "first_name": (
                        user_json.get("name", "").split(" ")[0]
                        if user_json.get("name")
                        else ""
                    ),
                    "last_name": (
                        " ".join(user_json.get("name", "").split(" ")[1:])
                        if user_json.get("name")
                        and len(user_json.get("name", "").split(" ")) > 1
                        else ""
                    ),
                },
            )

            # Create or get auth token
            auth_token, token_created = Token.objects.get_or_create(user=user)

            logger.info(
                f"GitHub authentication successful: {user.username}, created: {created}"
            )

            return Response(
                {
                    "success": True,
                    "token": auth_token.key,
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "name": user_json.get("name", user.username),
                        "avatar_url": user_json.get("avatar_url"),
                    },
                    "created": created,
                },
                status=200,
            )

        except Exception as e:
            logger.error(f"GitHub OAuth error: {str(e)}")
            return Response(
                {"success": False, "error": "GitHub authentication failed"}, status=500
            )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Delete the user's token
            request.user.auth_token.delete()
            logger.info(f"User {request.user.username} logged out successfully")
            return Response(
                {"success": True, "message": "Logout successful"}, status=200
            )
        except Exception as e:
            logger.error(f"Logout error: {str(e)}")
            return Response({"success": False, "error": "Logout failed"}, status=500)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "name": f"{user.first_name} {user.last_name}".strip() or user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
            },
            status=200,
        )
