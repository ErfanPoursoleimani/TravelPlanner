import uuid
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    """Extended user model with travel-specific fields"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date_of_birth = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    profile_image_url = models.URLField(blank=True)
    preferred_currency = models.CharField(max_length=3, default='USD')
    timezone = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}" if self.first_name else self.username


class UserPreferences(models.Model):
    """User preferences for AI personalization"""
    TRAVEL_STYLE_CHOICES = [
        ('adventure', 'Adventure'),
        ('luxury', 'Luxury'),
        ('budget', 'Budget'),
        ('cultural', 'Cultural'),
        ('relaxation', 'Relaxation'),
    ]
    
    ACCOMMODATION_CHOICES = [
        ('hotel', 'Hotel'),
        ('hostel', 'Hostel'),
        ('airbnb', 'Airbnb'),
        ('resort', 'Resort'),
    ]
    
    TRANSPORTATION_CHOICES = [
        ('flight', 'Flight'),
        ('train', 'Train'),
        ('car', 'Car'),
        ('bus', 'Bus'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preferences')
    travel_style = models.JSONField(default=list, blank=True)
    accommodation_preferences = models.JSONField(default=list, blank=True)
    transportation_preferences = models.JSONField(default=list, blank=True)
    dietary_restrictions = models.JSONField(default=list, blank=True)
    accessibility_needs = models.JSONField(default=list, blank=True)
    activity_interests = models.JSONField(default=list, blank=True)
    budget_range = models.JSONField(default=dict, blank=True)  # {"min": 50, "max": 200}
    group_size_preference = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Preferences for {self.user.username}"


class Destination(models.Model):
    """Travel destinations"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=100, blank=True)
    region = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    timezone = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)
    best_visit_months = ArrayField(
        models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(12)]),
        size=12,
        default=list,
        blank=True
    )
    average_temperature = models.JSONField(default=dict, blank=True)
    popular_activities = models.JSONField(default=list, blank=True)
    safety_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        null=True,
        blank=True
    )
    cost_level = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        null=True,
        blank=True
    )
    image_urls = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['latitude', 'longitude']),
            models.Index(fields=['country', 'city']),
        ]

    def __str__(self):
        return f"{self.name}, {self.country}"


class PointOfInterest(models.Model):
    """Points of interest within destinations"""
    CATEGORY_CHOICES = [
        ('restaurant', 'Restaurant'),
        ('museum', 'Museum'),
        ('attraction', 'Attraction'),
        ('hotel', 'Hotel'),
        ('shopping', 'Shopping'),
        ('nightlife', 'Nightlife'),
        ('outdoor', 'Outdoor Activity'),
        ('transportation', 'Transportation'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='pois')
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    subcategory = models.CharField(max_length=100, blank=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    address = models.TextField(blank=True)
    description = models.TextField(blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    price_level = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(4)],
        null=True,
        blank=True
    )
    opening_hours = models.JSONField(default=dict, blank=True)
    contact_info = models.JSONField(default=dict, blank=True)
    website_url = models.URLField(blank=True)
    image_urls = models.JSONField(default=list, blank=True)
    amenities = models.JSONField(default=list, blank=True)
    accessibility_features = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['destination', 'category']),
            models.Index(fields=['latitude', 'longitude']),
        ]

    def __str__(self):
        return f"{self.name} - {self.destination.name}"


class Trip(models.Model):
    """User trips"""
    STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trips')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='planning')
    total_budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=3, default='USD')
    traveler_count = models.PositiveIntegerField(default=1)
    ai_generated = models.BooleanField(default=False)
    ai_prompt = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'start_date']),
            models.Index(fields=['start_date', 'end_date']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.start_date} - {self.end_date})"

    @property
    def duration_days(self):
        return (self.end_date - self.start_date).days + 1


class ItineraryItem(models.Model):
    """Individual items in a trip itinerary"""
    ACTIVITY_TYPE_CHOICES = [
        ('flight', 'Flight'),
        ('accommodation', 'Accommodation'),
        ('activity', 'Activity'),
        ('meal', 'Meal'),
        ('transportation', 'Transportation'),
    ]
    
    BOOKING_STATUS_CHOICES = [
        ('not_booked', 'Not Booked'),
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='itinerary_items')
    day_number = models.PositiveIntegerField()
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    activity_type = models.CharField(max_length=100, choices=ACTIVITY_TYPE_CHOICES)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    poi = models.ForeignKey(PointOfInterest, on_delete=models.SET_NULL, null=True, blank=True)
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    booking_reference = models.CharField(max_length=100, blank=True)
    booking_status = models.CharField(max_length=50, choices=BOOKING_STATUS_CHOICES, default='not_booked')
    ai_suggested = models.BooleanField(default=False)
    order_index = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['trip', 'day_number', 'order_index']),
        ]
        ordering = ['day_number', 'order_index']

    def __str__(self):
        return f"Day {self.day_number}: {self.title}"


class TransportationSegment(models.Model):
    """Transportation between locations"""
    TRANSPORT_TYPE_CHOICES = [
        ('flight', 'Flight'),
        ('train', 'Train'),
        ('bus', 'Bus'),
        ('car', 'Car'),
        ('walk', 'Walk'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='transportation_segments')
    from_location = models.CharField(max_length=255)
    to_location = models.CharField(max_length=255)
    from_latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    from_longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    to_latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    to_longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    transport_type = models.CharField(max_length=50, choices=TRANSPORT_TYPE_CHOICES)
    departure_time = models.DateTimeField(null=True, blank=True)
    arrival_time = models.DateTimeField(null=True, blank=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    booking_reference = models.CharField(max_length=100, blank=True)
    provider = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.from_location} → {self.to_location} ({self.transport_type})"


class Accommodation(models.Model):
    """Trip accommodations"""
    TYPE_CHOICES = [
        ('hotel', 'Hotel'),
        ('hostel', 'Hostel'),
        ('airbnb', 'Airbnb'),
        ('resort', 'Resort'),
    ]
    
    BOOKING_STATUS_CHOICES = [
        ('not_booked', 'Not Booked'),
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='accommodations')
    poi = models.ForeignKey(PointOfInterest, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=100, choices=TYPE_CHOICES)
    check_in_date = models.DateField()
    check_out_date = models.DateField()
    room_type = models.CharField(max_length=100, blank=True)
    guest_count = models.PositiveIntegerField(null=True, blank=True)
    nightly_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    booking_reference = models.CharField(max_length=100, blank=True)
    booking_status = models.CharField(max_length=50, choices=BOOKING_STATUS_CHOICES, default='not_booked')
    amenities = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.trip.title}"


class AIRecommendation(models.Model):
    """AI recommendations and learning data"""
    RECOMMENDATION_TYPE_CHOICES = [
        ('destination', 'Destination'),
        ('activity', 'Activity'),
        ('restaurant', 'Restaurant'),
        ('hotel', 'Hotel'),
    ]
    
    FEEDBACK_CHOICES = [
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('modified', 'Modified'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_recommendations')
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='ai_recommendations', null=True, blank=True)
    recommendation_type = models.CharField(max_length=100, choices=RECOMMENDATION_TYPE_CHOICES)
    recommended_item_id = models.UUIDField(null=True, blank=True)
    recommended_item_type = models.CharField(max_length=100, blank=True)
    confidence_score = models.DecimalField(max_digits=3, decimal_places=2, 
                                         validators=[MinValueValidator(0), MaxValueValidator(1)])
    reasoning = models.TextField(blank=True)
    user_feedback = models.CharField(max_length=50, choices=FEEDBACK_CHOICES, blank=True)
    recommendation_context = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['recommendation_type', 'confidence_score']),
        ]

    def __str__(self):
        return f"AI Recommendation: {self.recommendation_type} for {self.user.username}"


class UserInteraction(models.Model):
    """User behavior tracking for AI learning"""
    INTERACTION_TYPE_CHOICES = [
        ('search', 'Search'),
        ('view', 'View'),
        ('save', 'Save'),
        ('book', 'Book'),
        ('rate', 'Rate'),
        ('share', 'Share'),
    ]
    
    TARGET_TYPE_CHOICES = [
        ('destination', 'Destination'),
        ('poi', 'Point of Interest'),
        ('trip', 'Trip'),
        ('recommendation', 'Recommendation'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interactions')
    interaction_type = models.CharField(max_length=100, choices=INTERACTION_TYPE_CHOICES)
    target_type = models.CharField(max_length=100, choices=TARGET_TYPE_CHOICES)
    target_id = models.UUIDField()
    interaction_data = models.JSONField(default=dict, blank=True)
    session_id = models.UUIDField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['target_type', 'target_id']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.interaction_type} - {self.target_type}"


class Review(models.Model):
    """User reviews and ratings"""
    REVIEWABLE_TYPE_CHOICES = [
        ('poi', 'Point of Interest'),
        ('destination', 'Destination'),
        ('accommodation', 'Accommodation'),
        ('trip', 'Trip'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    reviewable_type = models.CharField(max_length=100, choices=REVIEWABLE_TYPE_CHOICES)
    reviewable_id = models.UUIDField()
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    title = models.CharField(max_length=255, blank=True)
    content = models.TextField(blank=True)
    photos = models.JSONField(default=list, blank=True)
    verified_visit = models.BooleanField(default=False)
    helpful_votes = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['reviewable_type', 'reviewable_id']),
            models.Index(fields=['user', 'created_at']),
        ]
        unique_together = ['user', 'reviewable_type', 'reviewable_id']

    def __str__(self):
        return f"Review by {self.user.username} - {self.rating}/5"


class TripShare(models.Model):
    """Trip sharing and collaboration"""
    PERMISSION_CHOICES = [
        ('view', 'View Only'),
        ('edit', 'Edit'),
        ('admin', 'Admin'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='shares')
    shared_by_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trips_shared')
    shared_with_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trips_shared_with', 
                                       null=True, blank=True)
    permission_level = models.CharField(max_length=50, choices=PERMISSION_CHOICES, default='view')
    share_token = models.CharField(max_length=100, unique=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.share_token:
            self.share_token = str(uuid.uuid4())[:8]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.trip.title} shared by {self.shared_by_user.username}"


class WeatherData(models.Model):
    """Weather data for AI planning"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='weather_data')
    date = models.DateField()
    temperature_high = models.IntegerField(null=True, blank=True)
    temperature_low = models.IntegerField(null=True, blank=True)
    precipitation_chance = models.IntegerField(null=True, blank=True)
    weather_condition = models.CharField(max_length=100, blank=True)
    wind_speed = models.IntegerField(null=True, blank=True)
    humidity = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['destination', 'date']),
        ]
        unique_together = ['destination', 'date']

    def __str__(self):
        return f"Weather for {self.destination.name} on {self.date}"


class PricingData(models.Model):
    """Real-time pricing data"""
    ITEM_TYPE_CHOICES = [
        ('flight', 'Flight'),
        ('hotel', 'Hotel'),
        ('activity', 'Activity'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    item_type = models.CharField(max_length=100, choices=ITEM_TYPE_CHOICES)
    item_id = models.CharField(max_length=255)  # External API ID
    origin = models.CharField(max_length=100, blank=True)
    destination = models.CharField(max_length=100, blank=True)
    date = models.DateField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3)
    provider = models.CharField(max_length=100)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['item_type', 'origin', 'destination', 'date']),
        ]

    def __str__(self):
        return f"{self.item_type}: {self.origin} → {self.destination} - {self.price} {self.currency}"


class AITrainingFeedback(models.Model):
    """Feedback for AI model training"""
    FEEDBACK_TYPE_CHOICES = [
        ('recommendation_quality', 'Recommendation Quality'),
        ('itinerary_usefulness', 'Itinerary Usefulness'),
        ('personalization_accuracy', 'Personalization Accuracy'),
        ('general_satisfaction', 'General Satisfaction'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_feedback')
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='ai_feedback', null=True, blank=True)
    feedback_type = models.CharField(max_length=100, choices=FEEDBACK_TYPE_CHOICES)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    feedback_text = models.TextField(blank=True)
    context_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"AI Feedback: {self.feedback_type} - {self.rating}/5"


class SavedItem(models.Model):
    """User saved/wishlist items"""
    ITEM_TYPE_CHOICES = [
        ('destination', 'Destination'),
        ('poi', 'Point of Interest'),
        ('trip', 'Trip'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_items')
    item_type = models.CharField(max_length=100, choices=ITEM_TYPE_CHOICES)
    item_id = models.UUIDField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'item_type', 'item_id']

    def __str__(self):
        return f"Saved {self.item_type} by {self.user.username}"


class APILog(models.Model):
    """External API integration logs"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    api_provider = models.CharField(max_length=100)
    endpoint = models.CharField(max_length=255)
    request_data = models.JSONField(default=dict, blank=True)
    response_status = models.IntegerField(null=True, blank=True)
    response_time_ms = models.IntegerField(null=True, blank=True)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['api_provider', 'created_at']),
        ]

    def __str__(self):
        return f"{self.api_provider} - {self.endpoint} ({self.response_status})"


# Custom managers for common queries
class TripManager(models.Manager):
    def active(self):
        return self.filter(status__in=['planning', 'confirmed', 'in_progress'])
    
    def for_user(self, user):
        return self.filter(user=user)
    
    def upcoming(self):
        return self.filter(start_date__gte=timezone.now().date())


class AIRecommendationManager(models.Manager):
    def high_confidence(self):
        return self.filter(confidence_score__gte=0.8)
    
    def for_user(self, user):
        return self.filter(user=user)
    
    def by_type(self, rec_type):
        return self.filter(recommendation_type=rec_type)


# Add custom managers to models
Trip.objects = TripManager()
AIRecommendation.objects = AIRecommendationManager()