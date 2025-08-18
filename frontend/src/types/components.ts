export interface User {
  id: number;
  name: string;
  email: string;
}

export interface DashboardProps {
  userId: number;
  onUserUpdate?: (user: User) => void;
}

export interface ProfileProps {
  user: User;
  isEditing?: boolean;
}

export interface Destination {
  city: string,
  country: string,
  bestTime: string,
  tags: string[],
  imgUrl: string,
  description: string,
  id: number
}

export interface RecommendationPanelProps {
  onAddToItinerary?: (recommendation: Recommendation) => void;
}

export interface Recommendation {
  id: string;
  type: "attraction" | "restaurant" | "accommodation";
  name: string;
  description: string;
  rating: number;
  price: number;
  duration?: string;
  image: string;
  location: string;
}

export interface Activity {
  id: string;
  title: string;
  type: "attraction" | "restaurant" | "accommodation";
  location: string;
  time: string;
  duration: string;
  cost: number;
  image?: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  activity?: Activity;
}

export interface DayPlan {
  id: string;
  date: string;
  timeSlots: TimeSlot[];
}