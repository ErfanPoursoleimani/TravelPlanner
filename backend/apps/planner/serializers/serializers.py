from rest_framework import serializers
from django.contrib.auth import get_user_model
from ...models import (
    UserPreferences, Destination, PointOfInterest, Trip, ItineraryItem,
    TransportationSegment, Accommodation, AIRecommendation, Review, SavedItem
)

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                 'preferred_currency', 'timezone', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferences
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class DestinationSerializer(serializers.ModelSerializer):
    poi_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Destination
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_poi_count(self, obj):
        return obj.pois.count()


class PointOfInterestSerializer(serializers.ModelSerializer):
    destination_name = serializers.CharField(source='destination.name', read_only=True)
    
    class Meta:
        model = PointOfInterest
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class ItineraryItemSerializer(serializers.ModelSerializer):
    poi_details = PointOfInterestSerializer(source='poi', read_only=True)
    
    class Meta:
        model = ItineraryItem
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class AccommodationSerializer(serializers.ModelSerializer):
    poi_details = PointOfInterestSerializer(source='poi', read_only=True)
    nights = serializers.SerializerMethodField()
    
    class Meta:
        model = Accommodation
        fields = '__all__'
        read_only_fields = ['id', 'created_at']
    
    def get_nights(self, obj):
        return (obj.check_out_date - obj.check_in_date).days


class TransportationSegmentSerializer(serializers.ModelSerializer):
    duration = serializers.SerializerMethodField()
    
    class Meta:
        model = TransportationSegment
        fields = '__all__'
        read_only_fields = ['id', 'created_at']
    
    def get_duration(self, obj):
        if obj.departure_time and obj.arrival_time:
            return str(obj.arrival_time - obj.departure_time)
        return None


class TripSerializer(serializers.ModelSerializer):
    itinerary_items = ItineraryItemSerializer(many=True, read_only=True)
    accommodations = AccommodationSerializer(many=True, read_only=True)
    transportation_segments = TransportationSegmentSerializer(many=True, read_only=True)
    duration_days = serializers.ReadOnlyField()
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Trip
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class AIRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIRecommendation
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at']


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['id', 'user', 'helpful_votes', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class SavedItemSerializer(serializers.ModelSerializer):
    item_details = serializers.SerializerMethodField()
    
    class Meta:
        model = SavedItem
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at']
    
    def get_item_details(self, obj):
        """Get details of the saved item based on type"""
        if obj.item_type == 'destination':
            try:
                destination = Destination.objects.get(id=obj.item_id)
                return DestinationSerializer(destination).data
            except Destination.DoesNotExist:
                return None
        elif obj.item_type == 'poi':
            try:
                poi = PointOfInterest.objects.get(id=obj.item_id)
                return PointOfInterestSerializer(poi).data
            except PointOfInterest.DoesNotExist:
                return None
        elif obj.item_type == 'trip':
            try:
                trip = Trip.objects.get(id=obj.item_id)
                return TripSerializer(trip).data
            except Trip.DoesNotExist:
                return None
        return None
