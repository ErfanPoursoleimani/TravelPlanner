from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
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
from django.utils import timezone


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    full_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "date_of_birth",
            "phone",
            "profile_image_url",
            "preferred_currency",
            "timezone",
            "created_at",
            "updated_at",
            "password",
            "password_confirm",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username

    def validate(self, attrs):
        if "password" in attrs and "password_confirm" in attrs:
            if attrs["password"] != attrs["password_confirm"]:
                raise serializers.ValidationError("Passwords don't match")
            validate_password(attrs["password"])
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm", None)
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        # Create default user preferences
        UserPreferences.objects.create(user=user)

        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        validated_data.pop("password_confirm", None)

        if password:
            instance.set_password(password)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferences
        fields = [
            "id",
            "travel_style",
            "accommodation_preferences",
            "transportation_preferences",
            "dietary_restrictions",
            "accessibility_needs",
            "activity_interests",
            "budget_range",
            "group_size_preference",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class DestinationSerializer(serializers.ModelSerializer):
    poi_count = serializers.SerializerMethodField(read_only=True)
    weather_preview = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Destination
        fields = [
            "id",
            "name",
            "country",
            "region",
            "city",
            "latitude",
            "longitude",
            "timezone",
            "description",
            "best_visit_months",
            "average_temperature",
            "popular_activities",
            "safety_rating",
            "cost_level",
            "image_urls",
            "poi_count",
            "weather_preview",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_poi_count(self, obj):
        return obj.pois.count()

    def get_weather_preview(self, obj):
        # Return recent weather data if available
        recent_weather = obj.weather_data.filter(
            date__gte=timezone.now().date()
        ).first()
        if recent_weather:
            return {
                "temperature_high": recent_weather.temperature_high,
                "temperature_low": recent_weather.temperature_low,
                "condition": recent_weather.weather_condition,
            }
        return None


class PointOfInterestSerializer(serializers.ModelSerializer):
    destination_name = serializers.CharField(source="destination.name", read_only=True)
    distance_from_center = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PointOfInterest
        fields = [
            "id",
            "destination",
            "destination_name",
            "name",
            "category",
            "subcategory",
            "latitude",
            "longitude",
            "address",
            "description",
            "rating",
            "price_level",
            "opening_hours",
            "contact_info",
            "website_url",
            "image_urls",
            "amenities",
            "accessibility_features",
            "distance_from_center",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_distance_from_center(self, obj):
        # Calculate distance from destination center if coordinates available
        if (
            obj.latitude
            and obj.longitude
            and obj.destination.latitude
            and obj.destination.longitude
        ):
            # Simple approximation - in a real app, use proper distance calculation
            lat_diff = abs(obj.latitude - obj.destination.latitude)
            lng_diff = abs(obj.longitude - obj.destination.longitude)
            return round(((lat_diff**2 + lng_diff**2) ** 0.5) * 111, 2)  # Convert to km
        return None


class ItineraryItemSerializer(serializers.ModelSerializer):
    poi_details = PointOfInterestSerializer(source="poi", read_only=True)
    duration_minutes = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ItineraryItem
        fields = [
            "id",
            "trip",
            "day_number",
            "start_time",
            "end_time",
            "activity_type",
            "title",
            "description",
            "location",
            "latitude",
            "longitude",
            "poi",
            "poi_details",
            "estimated_cost",
            "booking_reference",
            "booking_status",
            "ai_suggested",
            "order_index",
            "duration_minutes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_duration_minutes(self, obj):
        if obj.start_time and obj.end_time:
            from datetime import datetime, time

            start = datetime.combine(datetime.today(), obj.start_time)
            end = datetime.combine(datetime.today(), obj.end_time)
            return int((end - start).total_seconds() / 60)
        return None


class TripSerializer(serializers.ModelSerializer):
    itinerary_items = ItineraryItemSerializer(many=True, read_only=True)
    accommodations = serializers.SerializerMethodField(read_only=True)
    transportation_segments = serializers.SerializerMethodField(read_only=True)
    duration_days = serializers.ReadOnlyField()
    total_estimated_cost = serializers.SerializerMethodField(read_only=True)
    destinations_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Trip
        fields = [
            "id",
            "title",
            "description",
            "start_date",
            "end_date",
            "status",
            "total_budget",
            "currency",
            "traveler_count",
            "ai_generated",
            "ai_prompt",
            "duration_days",
            "total_estimated_cost",
            "destinations_count",
            "itinerary_items",
            "accommodations",
            "transportation_segments",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_accommodations(self, obj):
        return AccommodationSerializer(obj.accommodations.all(), many=True).data

    def get_transportation_segments(self, obj):
        return TransportationSegmentSerializer(
            obj.transportation_segments.all(), many=True
        ).data

    def get_total_estimated_cost(self, obj):
        total = 0
        for item in obj.itinerary_items.all():
            if item.estimated_cost:
                total += item.estimated_cost
        for accommodation in obj.accommodations.all():
            if accommodation.total_cost:
                total += accommodation.total_cost
        for segment in obj.transportation_segments.all():
            if segment.cost:
                total += segment.cost
        return total

    def get_destinations_count(self, obj):
        return (
            obj.itinerary_items.filter(poi__isnull=False)
            .values("poi__destination")
            .distinct()
            .count()
        )


class TransportationSegmentSerializer(serializers.ModelSerializer):
    duration_hours = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TransportationSegment
        fields = [
            "id",
            "trip",
            "from_location",
            "to_location",
            "from_latitude",
            "from_longitude",
            "to_latitude",
            "to_longitude",
            "transport_type",
            "departure_time",
            "arrival_time",
            "cost",
            "booking_reference",
            "provider",
            "duration_hours",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def get_duration_hours(self, obj):
        if obj.departure_time and obj.arrival_time:
            duration = obj.arrival_time - obj.departure_time
            return round(duration.total_seconds() / 3600, 2)
        return None


class AccommodationSerializer(serializers.ModelSerializer):
    poi_details = PointOfInterestSerializer(source="poi", read_only=True)
    nights = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Accommodation
        fields = [
            "id",
            "trip",
            "poi",
            "poi_details",
            "name",
            "type",
            "check_in_date",
            "check_out_date",
            "room_type",
            "guest_count",
            "nightly_rate",
            "total_cost",
            "booking_reference",
            "booking_status",
            "amenities",
            "nights",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def get_nights(self, obj):
        return (obj.check_out_date - obj.check_in_date).days


class AIRecommendationSerializer(serializers.ModelSerializer):
    recommended_item_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = AIRecommendation
        fields = [
            "id",
            "recommendation_type",
            "recommended_item_id",
            "recommended_item_type",
            "confidence_score",
            "reasoning",
            "user_feedback",
            "recommendation_context",
            "recommended_item_details",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def get_recommended_item_details(self, obj):
        if obj.recommended_item_id and obj.recommended_item_type:
            try:
                if obj.recommended_item_type == "destination":
                    item = Destination.objects.get(id=obj.recommended_item_id)
                    return DestinationSerializer(item).data
                elif obj.recommended_item_type == "poi":
                    item = PointOfInterest.objects.get(id=obj.recommended_item_id)
                    return PointOfInterestSerializer(item).data
            except (Destination.DoesNotExist, PointOfInterest.DoesNotExist):
                pass
        return None


class UserInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInteraction
        fields = [
            "id",
            "interaction_type",
            "target_type",
            "target_id",
            "interaction_data",
            "session_id",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class ReviewSerializer(serializers.ModelSerializer):
    user_info = serializers.SerializerMethodField(read_only=True)
    reviewed_item_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "reviewable_type",
            "reviewable_id",
            "rating",
            "title",
            "content",
            "photos",
            "verified_visit",
            "helpful_votes",
            "user_info",
            "reviewed_item_details",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "user_info", "created_at", "updated_at"]

    def get_user_info(self, obj):
        return {
            "username": obj.user.username,
            "full_name": f"{obj.user.first_name} {obj.user.last_name}".strip()
            or obj.user.username,
            "profile_image_url": obj.user.profile_image_url,
        }

    def get_reviewed_item_details(self, obj):
        try:
            if obj.reviewable_type == "destination":
                item = Destination.objects.get(id=obj.reviewable_id)
                return {"name": item.name, "type": "destination"}
            elif obj.reviewable_type == "poi":
                item = PointOfInterest.objects.get(id=obj.reviewable_id)
                return {"name": item.name, "type": "poi"}
            elif obj.reviewable_type == "trip":
                item = Trip.objects.get(id=obj.reviewable_id)
                return {"name": item.title, "type": "trip"}
        except (
            Destination.DoesNotExist,
            PointOfInterest.DoesNotExist,
            Trip.DoesNotExist,
        ):
            pass
        return None


class TripShareSerializer(serializers.ModelSerializer):
    trip_details = serializers.SerializerMethodField(read_only=True)
    shared_by_info = serializers.SerializerMethodField(read_only=True)
    shared_with_info = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TripShare
        fields = [
            "id",
            "trip",
            "trip_details",
            "shared_by_user",
            "shared_by_info",
            "shared_with_user",
            "shared_with_info",
            "permission_level",
            "share_token",
            "expires_at",
            "created_at",
        ]
        read_only_fields = ["id", "share_token", "created_at"]

    def get_trip_details(self, obj):
        return {
            "title": obj.trip.title,
            "start_date": obj.trip.start_date,
            "end_date": obj.trip.end_date,
            "status": obj.trip.status,
        }

    def get_shared_by_info(self, obj):
        user = obj.shared_by_user
        return {
            "username": user.username,
            "full_name": f"{user.first_name} {user.last_name}".strip() or user.username,
        }

    def get_shared_with_info(self, obj):
        if obj.shared_with_user:
            user = obj.shared_with_user
            return {
                "username": user.username,
                "full_name": f"{user.first_name} {user.last_name}".strip()
                or user.username,
            }
        return None


class WeatherDataSerializer(serializers.ModelSerializer):
    destination_name = serializers.CharField(source="destination.name", read_only=True)

    class Meta:
        model = WeatherData
        fields = [
            "id",
            "destination",
            "destination_name",
            "date",
            "temperature_high",
            "temperature_low",
            "precipitation_chance",
            "weather_condition",
            "wind_speed",
            "humidity",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class PricingDataSerializer(serializers.ModelSerializer):
    days_until_date = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PricingData
        fields = [
            "id",
            "item_type",
            "item_id",
            "origin",
            "destination",
            "date",
            "price",
            "currency",
            "provider",
            "days_until_date",
            "last_updated",
        ]
        read_only_fields = ["id", "last_updated"]

    def get_days_until_date(self, obj):
        if obj.date:
            from django.utils import timezone

            delta = obj.date - timezone.now().date()
            return delta.days
        return None


class AITrainingFeedbackSerializer(serializers.ModelSerializer):
    trip_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = AITrainingFeedback
        fields = [
            "id",
            "trip",
            "trip_details",
            "feedback_type",
            "rating",
            "feedback_text",
            "context_data",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def get_trip_details(self, obj):
        if obj.trip:
            return {
                "title": obj.trip.title,
                "start_date": obj.trip.start_date,
                "end_date": obj.trip.end_date,
            }
        return None


class SavedItemSerializer(serializers.ModelSerializer):
    item_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SavedItem
        fields = ["id", "item_type", "item_id", "notes", "item_details", "created_at"]
        read_only_fields = ["id", "created_at"]

    def get_item_details(self, obj):
        try:
            if obj.item_type == "destination":
                item = Destination.objects.get(id=obj.item_id)
                return {
                    "name": item.name,
                    "country": item.country,
                    "image_urls": item.image_urls[:1],  # Just first image
                    "cost_level": item.cost_level,
                }
            elif obj.item_type == "poi":
                item = PointOfInterest.objects.get(id=obj.item_id)
                return {
                    "name": item.name,
                    "category": item.category,
                    "destination_name": item.destination.name,
                    "image_urls": item.image_urls[:1],
                    "rating": item.rating,
                }
            elif obj.item_type == "trip":
                item = Trip.objects.get(id=obj.item_id)
                return {
                    "title": item.title,
                    "start_date": item.start_date,
                    "end_date": item.end_date,
                    "status": item.status,
                }
        except (
            Destination.DoesNotExist,
            PointOfInterest.DoesNotExist,
            Trip.DoesNotExist,
        ):
            pass
        return None


# Nested serializers for detailed responses
class TripDetailSerializer(TripSerializer):
    """Extended trip serializer with full nested data"""

    itinerary_items = ItineraryItemSerializer(many=True, read_only=True)
    accommodations = AccommodationSerializer(many=True, read_only=True)
    transportation_segments = TransportationSegmentSerializer(many=True, read_only=True)
    ai_recommendations = AIRecommendationSerializer(many=True, read_only=True)
    shares = TripShareSerializer(many=True, read_only=True)

    class Meta(TripSerializer.Meta):
        fields = TripSerializer.Meta.fields + ["ai_recommendations", "shares"]


class DestinationDetailSerializer(DestinationSerializer):
    """Extended destination serializer with POIs and weather"""

    pois = PointOfInterestSerializer(many=True, read_only=True)
    weather_data = WeatherDataSerializer(many=True, read_only=True)
    reviews = serializers.SerializerMethodField(read_only=True)

    class Meta(DestinationSerializer.Meta):
        fields = DestinationSerializer.Meta.fields + ["pois", "weather_data", "reviews"]

    def get_reviews(self, obj):
        from django.db.models import Q

        reviews = Review.objects.filter(
            Q(reviewable_type="destination") & Q(reviewable_id=obj.id)
        ).order_by("-created_at")[
            :5
        ]  # Latest 5 reviews
        return ReviewSerializer(reviews, many=True).data


# Simplified serializers for list views
class TripListSerializer(serializers.ModelSerializer):
    """Simplified trip serializer for list views"""

    duration_days = serializers.ReadOnlyField()
    destinations_preview = serializers.SerializerMethodField(read_only=True)
    items_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Trip
        fields = [
            "id",
            "title",
            "start_date",
            "end_date",
            "status",
            "duration_days",
            "total_budget",
            "currency",
            "traveler_count",
            "ai_generated",
            "destinations_preview",
            "items_count",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def get_destinations_preview(self, obj):
        destinations = (
            obj.itinerary_items.filter(poi__isnull=False)
            .values_list("poi__destination__name", flat=True)
            .distinct()[:3]
        )
        return list(destinations)

    def get_items_count(self, obj):
        return obj.itinerary_items.count()


class DestinationListSerializer(serializers.ModelSerializer):
    """Simplified destination serializer for list views"""

    poi_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Destination
        fields = [
            "id",
            "name",
            "country",
            "city",
            "description",
            "safety_rating",
            "cost_level",
            "image_urls",
            "poi_count",
        ]

    def get_poi_count(self, obj):
        return obj.pois.count()
