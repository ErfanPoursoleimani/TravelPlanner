export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  phone?: string;
  profile_image_url?: string;
  preferred_currency: string;
  timezone?: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  travel_style: string[];
  accommodation_preferences: string[];
  transportation_preferences: string[];
  dietary_restrictions: string[];
  accessibility_needs: string[];
  activity_interests: string[];
  budget_range: { min: number; max: number };
  group_size_preference: number;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  description?: string;
  best_visit_months: number[];
  average_temperature: Record<string, any>;
  popular_activities: string[];
  safety_rating?: number;
  cost_level?: number;
  image_urls: string[];
  created_at: string;
  updated_at: string;
}

export interface PointOfInterest {
  id: string;
  destination: string;
  name: string;
  category: string;
  subcategory?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  description?: string;
  rating?: number;
  price_level?: number;
  opening_hours: Record<string, any>;
  contact_info: Record<string, any>;
  website_url?: string;
  image_urls: string[];
  amenities: string[];
  accessibility_features: string[];
}

export interface Trip {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  status: 'planning' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  total_budget?: number;
  currency: string;
  traveler_count: number;
  ai_generated: boolean;
  ai_prompt?: string;
  created_at: string;
  updated_at: string;
  duration_days?: number;
}

export interface ItineraryItem {
  id: string;
  trip: string;
  day_number: number;
  start_time?: string;
  end_time?: string;
  activity_type: 'flight' | 'accommodation' | 'activity' | 'meal' | 'transportation';
  title: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  poi?: string;
  estimated_cost?: number;
  booking_reference?: string;
  booking_status: 'not_booked' | 'pending' | 'confirmed' | 'cancelled';
  ai_suggested: boolean;
  order_index: number;
}

export interface AIRecommendation {
  id: string;
  recommendation_type: 'destination' | 'activity' | 'restaurant' | 'hotel';
  recommended_item_id?: string;
  recommended_item_type?: string;
  confidence_score: number;
  reasoning?: string;
  user_feedback?: 'accepted' | 'rejected' | 'modified';
  recommendation_context: Record<string, any>;
  created_at: string;
}

export interface SavedItem {
  id: string;
  item_type: 'destination' | 'poi' | 'trip';
  item_id: string;
  notes?: string;
  created_at: string;
}

export interface WeatherData {
  id: string;
  destination: string;
  date: string;
  temperature_high?: number;
  temperature_low?: number;
  precipitation_chance?: number;
  weather_condition?: string;
  wind_speed?: number;
  humidity?: number;
}