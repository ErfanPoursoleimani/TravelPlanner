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