export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  city?: string;
  country?: string;
  additional_info?: string;
  avatar_url?: string;
  language_preference: string;
  is_admin?: boolean;
  saved_destinations?: string[];
  created_at: string;
}

export interface Activity {
  id: string;
  stop_id: string;
  trip_id: string;
  title: string;
  category: 'Sightseeing' | 'Food' | 'Adventure' | 'Transport' | 'Stay' | 'Shopping';
  cost: number;
  duration_hours: number;
  scheduled_time?: string;
  day_number: number;
  is_completed?: boolean;
  description?: string;
  location?: string;
  image_url?: string;
}

export interface Stop {
  id: string;
  trip_id: string;
  city_name: string;
  country: string;
  order_index: number;
  arrival_date: string;
  departure_date: string;
  notes?: string;
  cover_image?: string;
  activities: Activity[];
}

export interface Trip {
  id: string;
  user_id: string;
  user_name?: string;
  name: string;
  description: string;
  cover_photo: string;
  start_date: string;
  end_date: string;
  total_budget: number;
  estimated_cost?: number;
  is_public: boolean;
  share_code: string;
  created_at: string;
  stops: Stop[];
}

export interface CityCatalogItem {
  id: string;
  name: string;
  country: string;
  region: string;
  cost_index: '$' | '$$' | '$$$' | '$$$$';
  popularity_score: number;
  image_url: string;
  description: string;
  avg_daily_cost: number;
  tags: string[];
}

export interface ActivityCatalogItem {
  id: string;
  city_id: string;
  city_name: string;
  title: string;
  category: 'Sightseeing' | 'Food' | 'Adventure' | 'Transport' | 'Stay' | 'Shopping';
  cost: number;
  duration_hours: number;
  image_url: string;
  rating: number;
  reviews_count: number;
  description: string;
}

export interface BudgetBreakdown {
  transport: number;
  stay: number;
  activities: number;
  meals: number;
  totalEstimated: number;
  budgetCap: number;
  dailyAverage: number;
  overbudgetDays: number[];
}

export interface PlatformStats {
  totalTrips: number;
  activeUsers: number;
  topCities: { name: string; count: number; country: string }[];
  categoryBreakdown: { name: string; value: number }[];
  monthlyGrowth: { month: string; trips: number; users: number }[];
}
