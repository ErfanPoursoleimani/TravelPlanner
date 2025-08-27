import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User, Destination, UserPreferences, PointOfInterest, Trip, ItineraryItem, AIRecommendation, SavedItem, WeatherData } from '../../types/data';

// API Response Types
/* interface ApiResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
} */

// State Interface
interface DataState {
  // Auth
  user: User | null;
  userPreferences: UserPreferences | null;
  isAuthenticated: boolean;
  
  // Destinations and POIs
  destinations: Destination[];
  destinationsLoading: boolean;
  destinationsError: string | null;
  
  pois: PointOfInterest[];
  poisLoading: boolean;
  poisError: string | null;
  
  // Trips
  trips: Trip[];
  tripsLoading: boolean;
  tripsError: string | null;
  
  currentTrip: Trip | null;
  currentTripItems: ItineraryItem[];
  currentTripLoading: boolean;
  
  // AI and Recommendations
  recommendations: AIRecommendation[];
  recommendationsLoading: boolean;
  
  // Saved Items
  savedItems: SavedItem[];
  savedItemsLoading: boolean;
  
  // Weather
  weatherData: Record<string, WeatherData[]>; // keyed by destination ID
  weatherLoading: boolean;
  
  // Search
  searchResults: {
    destinations: Destination[];
    pois: PointOfInterest[];
    trips: Trip[];
  };
  searchLoading: boolean;
  
  // UI State
  selectedDestination: Destination | null;
  selectedPOI: PointOfInterest | null;
}

// Initial State
const initialState: DataState = {
  user: null,
  userPreferences: null,
  isAuthenticated: false,
  
  destinations: [],
  destinationsLoading: false,
  destinationsError: null,
  
  pois: [],
  poisLoading: false,
  poisError: null,
  
  trips: [],
  tripsLoading: false,
  tripsError: null,
  
  currentTrip: null,
  currentTripItems: [],
  currentTripLoading: false,
  
  recommendations: [],
  recommendationsLoading: false,
  
  savedItems: [],
  savedItemsLoading: false,
  
  weatherData: {},
  weatherLoading: false,
  
  searchResults: {
    destinations: [],
    pois: [],
    trips: []
  },
  searchLoading: false,
  
  selectedDestination: null,
  selectedPOI: null,
};

// API Base URL
const API_BASE = '/api/v1';

// Helper function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP ${response.status}`);
  }

  return response.json();
};

// Authentication Thunks
export const loginUser = createAsyncThunk(
  'data/loginUser',
  async ({ username, password }: { username: string; password: string }) => {
    const response = await apiCall('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    return response;
  }
);

export const registerUser = createAsyncThunk(
  'data/registerUser',
  async (userData: Partial<User> & { password: string }) => {
    const response = await apiCall('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  }
);

export const logoutUser = createAsyncThunk(
  'data/logoutUser',
  async () => {
    await apiCall('/auth/logout/', { method: 'POST' });
    return null;
  }
);

export const fetchUserProfile = createAsyncThunk(
  'data/fetchUserProfile',
  async () => {
    return await apiCall('/auth/profile/');
  }
);

export const updateUserProfile = createAsyncThunk(
  'data/updateUserProfile',
  async (userData: Partial<User>) => {
    return await apiCall('/auth/profile/', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }
);

// User Preferences Thunks
export const fetchUserPreferences = createAsyncThunk(
  'data/fetchUserPreferences',
  async () => {
    const response = await apiCall('/user-preferences/');
    return response.results[0]; // Assuming one-to-one relationship
  }
);

export const updateUserPreferences = createAsyncThunk(
  'data/updateUserPreferences',
  async (preferences: Partial<UserPreferences>) => {
    return await apiCall('/user-preferences/', {
      method: 'POST',
      body: JSON.stringify(preferences),
    });
  }
);

// Destinations Thunks
export const fetchDestinations = createAsyncThunk(
  'data/fetchDestinations',
  async (params?: { search?: string; country?: string; page?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.country) queryParams.append('country', params.country);
    if (params?.page) queryParams.append('page', params.page.toString());
    
    const endpoint = `/destinations/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await apiCall(endpoint);
  }
);

export const fetchDestinationById = createAsyncThunk(
  'data/fetchDestinationById',
  async (id: string) => {
    return await apiCall(`/destinations/${id}/`);
  }
);

export const fetchDestinationWeather = createAsyncThunk(
  'data/fetchDestinationWeather',
  async (destinationId: string) => {
    return await apiCall(`/destinations/${destinationId}/weather/`);
  }
);

// Points of Interest Thunks
export const fetchPOIs = createAsyncThunk(
  'data/fetchPOIs',
  async (params?: { destination?: string; category?: string; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.destination) queryParams.append('destination', params.destination);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    
    const endpoint = `/pois/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await apiCall(endpoint);
  }
);

export const fetchDestinationPOIs = createAsyncThunk(
  'data/fetchDestinationPOIs',
  async (destinationId: string) => {
    return await apiCall(`/destinations/${destinationId}/pois/`);
  }
);

// Trips Thunks
export const fetchTrips = createAsyncThunk(
  'data/fetchTrips',
  async (params?: { status?: string; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    
    const endpoint = `/trips/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await apiCall(endpoint);
  }
);

export const createTrip = createAsyncThunk(
  'data/createTrip',
  async (tripData: Partial<Trip>) => {
    return await apiCall('/trips/', {
      method: 'POST',
      body: JSON.stringify(tripData),
    });
  }
);

export const updateTrip = createAsyncThunk(
  'data/updateTrip',
  async ({ id, data }: { id: string; data: Partial<Trip> }) => {
    return await apiCall(`/trips/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
);

export const deleteTrip = createAsyncThunk(
  'data/deleteTrip',
  async (id: string) => {
    await apiCall(`/trips/${id}/`, { method: 'DELETE' });
    return id;
  }
);

export const duplicateTrip = createAsyncThunk(
  'data/duplicateTrip',
  async (id: string) => {
    return await apiCall(`/trips/${id}/duplicate/`, { method: 'POST' });
  }
);

// Itinerary Items Thunks
export const fetchTripItinerary = createAsyncThunk(
  'data/fetchTripItinerary',
  async (tripId: string) => {
    return await apiCall(`/trips/${tripId}/itinerary-items/`);
  }
);

export const createItineraryItem = createAsyncThunk(
  'data/createItineraryItem',
  async ({ tripId, data }: { tripId: string; data: Partial<ItineraryItem> }) => {
    return await apiCall(`/trips/${tripId}/itinerary-items/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
);

export const updateItineraryItem = createAsyncThunk(
  'data/updateItineraryItem',
  async ({ tripId, id, data }: { tripId: string; id: string; data: Partial<ItineraryItem> }) => {
    return await apiCall(`/trips/${tripId}/itinerary-items/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
);

export const deleteItineraryItem = createAsyncThunk(
  'data/deleteItineraryItem',
  async ({ tripId, id }: { tripId: string; id: string }) => {
    await apiCall(`/trips/${tripId}/itinerary-items/${id}/`, { method: 'DELETE' });
    return id;
  }
);

// AI Recommendations Thunks
export const fetchRecommendations = createAsyncThunk(
  'data/fetchRecommendations',
  async (params?: { type?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('recommendation_type', params.type);
    
    const endpoint = `/ai-recommendations/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await apiCall(endpoint);
  }
);

export const generateItinerary = createAsyncThunk(
  'data/generateItinerary',
  async ({ prompt, tripId }: { prompt: string; tripId?: string }) => {
    return await apiCall('/ai/generate-itinerary/', {
      method: 'POST',
      body: JSON.stringify({ prompt, trip_id: tripId }),
    });
  }
);

export const provideFeedbackToRecommendation = createAsyncThunk(
  'data/provideFeedbackToRecommendation',
  async ({ id, feedback }: { id: string; feedback: string }) => {
    return await apiCall(`/ai-recommendations/${id}/feedback/`, {
      method: 'POST',
      body: JSON.stringify({ feedback }),
    });
  }
);

// Saved Items Thunks
export const fetchSavedItems = createAsyncThunk(
  'data/fetchSavedItems',
  async () => {
    return await apiCall('/saved-items/');
  }
);

export const saveItem = createAsyncThunk(
  'data/saveItem',
  async (data: { item_type: string; item_id: string; notes?: string }) => {
    return await apiCall('/saved-items/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
);

export const removeSavedItem = createAsyncThunk(
  'data/removeSavedItem',
  async (id: string) => {
    await apiCall(`/saved-items/${id}/`, { method: 'DELETE' });
    return id;
  }
);

// Search Thunks
export const searchDestinations = createAsyncThunk(
  'data/searchDestinations',
  async (query: string) => {
    return await apiCall(`/search/destinations/?q=${encodeURIComponent(query)}`);
  }
);

export const searchPOIs = createAsyncThunk(
  'data/searchPOIs',
  async (query: string) => {
    return await apiCall(`/search/pois/?q=${encodeURIComponent(query)}`);
  }
);

export const searchTrips = createAsyncThunk(
  'data/searchTrips',
  async (query: string) => {
    return await apiCall(`/search/trips/?q=${encodeURIComponent(query)}`);
  }
);

// Analytics Thunks
export const fetchUserStats = createAsyncThunk(
  'data/fetchUserStats',
  async () => {
    return await apiCall('/analytics/user-stats/');
  }
);

// Data Slice
const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    // UI Actions
    setSelectedDestination: (state, action: PayloadAction<Destination | null>) => {
      state.selectedDestination = action.payload;
    },
    
    setSelectedPOI: (state, action: PayloadAction<PointOfInterest | null>) => {
      state.selectedPOI = action.payload;
    },
    
    setCurrentTrip: (state, action: PayloadAction<Trip | null>) => {
      state.currentTrip = action.payload;
    },
    
    clearSearchResults: (state) => {
      state.searchResults = {
        destinations: [],
        pois: [],
        trips: []
      };
    },
    
    // Local data updates
    updateTripInList: (state, action: PayloadAction<Trip>) => {
      const index = state.trips.findIndex(trip => trip.id === action.payload.id);
      if (index !== -1) {
        state.trips[index] = action.payload;
      }
      if (state.currentTrip?.id === action.payload.id) {
        state.currentTrip = action.payload;
      }
    },
    
    addItineraryItem: (state, action: PayloadAction<ItineraryItem>) => {
      state.currentTripItems.push(action.payload);
    },
    
    updateItineraryItemInList: (state, action: PayloadAction<ItineraryItem>) => {
      const index = state.currentTripItems.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.currentTripItems[index] = action.payload;
      }
    },
    
    removeItineraryItemFromList: (state, action: PayloadAction<string>) => {
      state.currentTripItems = state.currentTripItems.filter(item => item.id !== action.payload);
    },
  },
  
  extraReducers: (builder) => {
    // Authentication
    builder
      .addCase(loginUser.pending, (state) => {
        state.isAuthenticated = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.userPreferences = null;
        state.isAuthenticated = false;
        state.trips = [];
        state.savedItems = [];
      })
      
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      
      // User Preferences
      .addCase(fetchUserPreferences.fulfilled, (state, action) => {
        state.userPreferences = action.payload;
      })
      
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.userPreferences = action.payload;
      })
      
      // Destinations
      .addCase(fetchDestinations.pending, (state) => {
        state.destinationsLoading = true;
        state.destinationsError = null;
      })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        state.destinations = action.payload.results || action.payload;
        state.destinationsLoading = false;
      })
      .addCase(fetchDestinations.rejected, (state, action) => {
        state.destinationsLoading = false;
        state.destinationsError = action.error.message || 'Failed to fetch destinations';
      })
      
      .addCase(fetchDestinationById.fulfilled, (state, action) => {
        const destination = action.payload;
        const index = state.destinations.findIndex(d => d.id === destination.id);
        if (index !== -1) {
          state.destinations[index] = destination;
        } else {
          state.destinations.push(destination);
        }
        state.selectedDestination = destination;
      })
      
      // Weather
      .addCase(fetchDestinationWeather.pending, (state) => {
        state.weatherLoading = true;
      })
      .addCase(fetchDestinationWeather.fulfilled, (state, action) => {
        const { meta } = action;
        const destinationId = meta.arg;
        state.weatherData[destinationId] = action.payload;
        state.weatherLoading = false;
      })
      .addCase(fetchDestinationWeather.rejected, (state) => {
        state.weatherLoading = false;
      })
      
      // POIs
      .addCase(fetchPOIs.pending, (state) => {
        state.poisLoading = true;
        state.poisError = null;
      })
      .addCase(fetchPOIs.fulfilled, (state, action) => {
        state.pois = action.payload.results || action.payload;
        state.poisLoading = false;
      })
      .addCase(fetchPOIs.rejected, (state, action) => {
        state.poisLoading = false;
        state.poisError = action.error.message || 'Failed to fetch POIs';
      })
      
      .addCase(fetchDestinationPOIs.fulfilled, (state, action) => {
        const newPOIs = action.payload.results || action.payload;
        // Update or add POIs
        newPOIs.forEach((poi: PointOfInterest) => {
          const index = state.pois.findIndex(p => p.id === poi.id);
          if (index !== -1) {
            state.pois[index] = poi;
          } else {
            state.pois.push(poi);
          }
        });
      })
      
      // Trips
      .addCase(fetchTrips.pending, (state) => {
        state.tripsLoading = true;
        state.tripsError = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.trips = action.payload.results || action.payload;
        state.tripsLoading = false;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.tripsLoading = false;
        state.tripsError = action.error.message || 'Failed to fetch trips';
      })
      
      .addCase(createTrip.fulfilled, (state, action) => {
        state.trips.unshift(action.payload);
        state.currentTrip = action.payload;
      })
      
      .addCase(updateTrip.fulfilled, (state, action) => {
        const trip = action.payload;
        const index = state.trips.findIndex(t => t.id === trip.id);
        if (index !== -1) {
          state.trips[index] = trip;
        }
        if (state.currentTrip?.id === trip.id) {
          state.currentTrip = trip;
        }
      })
      
      .addCase(deleteTrip.fulfilled, (state, action) => {
        const tripId = action.payload;
        state.trips = state.trips.filter(trip => trip.id !== tripId);
        if (state.currentTrip?.id === tripId) {
          state.currentTrip = null;
          state.currentTripItems = [];
        }
      })
      
      .addCase(duplicateTrip.fulfilled, (state, action) => {
        state.trips.unshift(action.payload);
      })
      
      // Itinerary Items
      .addCase(fetchTripItinerary.pending, (state) => {
        state.currentTripLoading = true;
      })
      .addCase(fetchTripItinerary.fulfilled, (state, action) => {
        state.currentTripItems = action.payload.results || action.payload;
        state.currentTripLoading = false;
      })
      .addCase(fetchTripItinerary.rejected, (state) => {
        state.currentTripLoading = false;
      })
      
      .addCase(createItineraryItem.fulfilled, (state, action) => {
        state.currentTripItems.push(action.payload);
      })
      
      .addCase(updateItineraryItem.fulfilled, (state, action) => {
        const item = action.payload;
        const index = state.currentTripItems.findIndex(i => i.id === item.id);
        if (index !== -1) {
          state.currentTripItems[index] = item;
        }
      })
      
      .addCase(deleteItineraryItem.fulfilled, (state, action) => {
        const itemId = action.payload;
        state.currentTripItems = state.currentTripItems.filter(item => item.id !== itemId);
      })
      
      // Recommendations
      .addCase(fetchRecommendations.pending, (state) => {
        state.recommendationsLoading = true;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.recommendations = action.payload.results || action.payload;
        state.recommendationsLoading = false;
      })
      .addCase(fetchRecommendations.rejected, (state) => {
        state.recommendationsLoading = false;
      })
      
      // Saved Items
      .addCase(fetchSavedItems.pending, (state) => {
        state.savedItemsLoading = true;
      })
      .addCase(fetchSavedItems.fulfilled, (state, action) => {
        state.savedItems = action.payload.results || action.payload;
        state.savedItemsLoading = false;
      })
      .addCase(fetchSavedItems.rejected, (state) => {
        state.savedItemsLoading = false;
      })
      
      .addCase(saveItem.fulfilled, (state, action) => {
        state.savedItems.push(action.payload);
      })
      
      .addCase(removeSavedItem.fulfilled, (state, action) => {
        const itemId = action.payload;
        state.savedItems = state.savedItems.filter(item => item.id !== itemId);
      })
      
      // Search
      .addCase(searchDestinations.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchDestinations.fulfilled, (state, action) => {
        state.searchResults.destinations = action.payload.results || action.payload;
        state.searchLoading = false;
      })
      .addCase(searchDestinations.rejected, (state) => {
        state.searchLoading = false;
      })
      
      .addCase(searchPOIs.fulfilled, (state, action) => {
        state.searchResults.pois = action.payload.results || action.payload;
      })
      
      .addCase(searchTrips.fulfilled, (state, action) => {
        state.searchResults.trips = action.payload.results || action.payload;
      });
  },
});

// Export actions
export const {
  setSelectedDestination,
  setSelectedPOI,
  setCurrentTrip,
  clearSearchResults,
  updateTripInList,
  addItineraryItem,
  updateItineraryItemInList,
  removeItineraryItemFromList,
} = dataSlice.actions;

// Selectors
export const selectUser = (state: { data: DataState }) => state.data.user;
export const selectIsAuthenticated = (state: { data: DataState }) => state.data.isAuthenticated;
export const selectUserPreferences = (state: { data: DataState }) => state.data.userPreferences;

export const selectDestinations = (state: { data: DataState }) => state.data.destinations;
export const selectDestinationsLoading = (state: { data: DataState }) => state.data.destinationsLoading;
export const selectSelectedDestination = (state: { data: DataState }) => state.data.selectedDestination;

export const selectPOIs = (state: { data: DataState }) => state.data.pois;
export const selectSelectedPOI = (state: { data: DataState }) => state.data.selectedPOI;

export const selectTrips = (state: { data: DataState }) => state.data.trips;
export const selectTripsLoading = (state: { data: DataState }) => state.data.tripsLoading;
export const selectCurrentTrip = (state: { data: DataState }) => state.data.currentTrip;
export const selectCurrentTripItems = (state: { data: DataState }) => state.data.currentTripItems;

export const selectRecommendations = (state: { data: DataState }) => state.data.recommendations;
export const selectRecommendationsLoading = (state: { data: DataState }) => state.data.recommendationsLoading;

export const selectSavedItems = (state: { data: DataState }) => state.data.savedItems;
export const selectSearchResults = (state: { data: DataState }) => state.data.searchResults;
export const selectSearchLoading = (state: { data: DataState }) => state.data.searchLoading;

export const selectWeatherForDestination = (destinationId: string) => 
  (state: { data: DataState }) => state.data.weatherData[destinationId] || [];

// Memoized selectors for better performance
export const selectTripsByStatus = (status: string) => 
  (state: { data: DataState }) => state.data.trips.filter(trip => trip.status === status);

export const selectUpcomingTrips = (state: { data: DataState }) => 
  state.data.trips.filter(trip => new Date(trip.start_date) > new Date());

export const selectPastTrips = (state: { data: DataState }) => 
  state.data.trips.filter(trip => trip.status === 'completed');

export default dataSlice.reducer;