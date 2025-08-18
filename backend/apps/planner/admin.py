from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models.models import (
    User, UserPreferences, Destination, PointOfInterest, Trip, ItineraryItem,
    TransportationSegment, Accommodation, AIRecommendation, UserInteraction,
    Review, TripShare, WeatherData, PricingData, AITrainingFeedback, SavedItem
)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'date_joined', 'is_active']
    list_filter = ['is_active', 'is_staff', 'date_joined', 'preferred_currency']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Travel Info', {
            'fields': ('date_of_birth', 'phone', 'profile_image_url', 'preferred_currency', 'timezone')
        }),
    )


@admin.register(UserPreferences)
class UserPreferencesAdmin(admin.ModelAdmin):
    list_display = ['user', 'group_size_preference', 'created_at']
    list_filter = ['group_size_preference', 'created_at']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ['name', 'country', 'city', 'safety_rating', 'cost_level']
    list_filter = ['country', 'safety_rating', 'cost_level']
    search_fields = ['name', 'country', 'city']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related()


@admin.register(PointOfInterest)
class PointOfInterestAdmin(admin.ModelAdmin):
    list_display = ['name', 'destination', 'category', 'rating', 'price_level']
    list_filter = ['category', 'price_level', 'destination__country']
    search_fields = ['name', 'destination__name', 'category']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('destination')


class ItineraryItemInline(admin.TabularInline):
    model = ItineraryItem
    extra = 0
    fields = ['day_number', 'title', 'activity_type', 'start_time', 'end_time', 'estimated_cost']


class AccommodationInline(admin.TabularInline):
    model = Accommodation
    extra = 0
    fields = ['name', 'type', 'check_in_date', 'check_out_date', 'total_cost']


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'start_date', 'end_date', 'status', 'traveler_count', 'ai_generated']
    list_filter = ['status', 'ai_generated', 'start_date', 'currency']
    search_fields = ['title', 'user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at', 'duration_display']
    inlines = [ItineraryItemInline, AccommodationInline]
    
    def duration_display(self, obj):
        return f"{obj.duration_days} days"
    duration_display.short_description = "Duration"
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


@admin.register(ItineraryItem)
class ItineraryItemAdmin(admin.ModelAdmin):
    list_display = ['title', 'trip', 'day_number', 'activity_type', 'start_time', 'booking_status']
    list_filter = ['activity_type', 'booking_status', 'ai_suggested']
    search_fields = ['title', 'trip__title', 'location']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(AIRecommendation)
class AIRecommendationAdmin(admin.ModelAdmin):
    list_display = ['recommendation_type', 'user', 'confidence_score', 'user_feedback', 'created_at']
    list_filter = ['recommendation_type', 'user_feedback', 'confidence_score']
    search_fields = ['user__username', 'reasoning']
    readonly_fields = ['created_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'reviewable_type', 'rating', 'verified_visit', 'helpful_votes', 'created_at']
    list_filter = ['reviewable_type', 'rating', 'verified_visit']
    search_fields = ['user__username', 'title', 'content']
    readonly_fields = ['helpful_votes', 'created_at', 'updated_at']

