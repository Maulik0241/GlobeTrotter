import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Trip, Stop, Activity, CityCatalogItem, ActivityCatalogItem, BudgetBreakdown } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface TripContextType {
  trips: Trip[];
  cities: CityCatalogItem[];
  activityCatalog: ActivityCatalogItem[];
  currentTrip: Trip | null;
  selectedTripId: string | null;
  setSelectedTripId: (id: string | null) => void;
  createTrip: (tripData: Omit<Trip, 'id' | 'created_at' | 'share_code' | 'stops'>, initialCityId?: string) => string;
  updateTrip: (id: string, tripData: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  addStopToTrip: (tripId: string, city: CityCatalogItem, startDate: string, endDate: string) => void;
  removeStopFromTrip: (tripId: string, stopId: string) => void;
  reorderStops: (tripId: string, startIndex: number, endIndex: number) => void;
  addActivityToStop: (tripId: string, stopId: string, activityData: Omit<Activity, 'id' | 'trip_id' | 'stop_id'>) => void;
  toggleActivityStatus: (tripId: string, stopId: string, activityId: string) => void;
  deleteActivity: (tripId: string, stopId: string, activityId: string) => void;
  copyTripToUser: (sharedTrip: Trip) => string;
  calculateBudgetBreakdown: (trip: Trip) => BudgetBreakdown;
  getCityById: (id: string) => CityCatalogItem | undefined;
  refreshFromSupabase: () => Promise<void>;
}

const DEFAULT_CITIES: CityCatalogItem[] = [
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    cost_index: '$$$',
    popularity_score: 98,
    image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    description: 'The City of Light captivates travelers with romance, world-class gastronomy, haute couture, and timeless art landmarks.',
    avg_daily_cost: 210,
    tags: ['Art', 'Romance', 'Museums', 'Gastronomy'],
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    cost_index: '$$$',
    popularity_score: 96,
    image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    description: 'A exhilarating fusion of ultramodern neon skyscrapers, ancient Shinto shrines, bullet trains, and Michelin-starred dining.',
    avg_daily_cost: 190,
    tags: ['Technology', 'Anime', 'Food', 'Culture'],
  },
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    cost_index: '$$',
    popularity_score: 95,
    image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    description: 'An open-air museum filled with ancient Roman ruins, grand Vatican basilicas, bustling piazzas, and authentic gelato.',
    avg_daily_cost: 165,
    tags: ['History', 'Colosseum', 'Pasta', 'Architecture'],
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    cost_index: '$$$$',
    popularity_score: 91,
    image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    description: 'Futuristic oasis of luxury shopping, ultratall skyscrapers including Burj Khalifa, desert safaris, and artificial islands.',
    avg_daily_cost: 310,
    tags: ['Luxury', 'Desert', 'Shopping', 'Futuristic'],
  },
  {
    id: 'zurich',
    name: 'Zurich',
    country: 'Switzerland',
    region: 'Europe',
    cost_index: '$$$$',
    popularity_score: 94,
    image_url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
    description: 'Pristine Swiss city nestled on Lake Zurich with views of the snow-capped Alps, luxury watches, and fine chocolates.',
    avg_daily_cost: 290,
    tags: ['Alps', 'Lake', 'Chocolate', 'Luxury'],
  },
];

const DEFAULT_TRIPS: Trip[] = [
  {
    id: 'trip-2026-01',
    user_id: 'usr-101',
    user_name: 'Alex Rivera',
    name: 'Grand European & Asian Odyssey 2026',
    description: 'A multi-city trip across Paris, Rome, Zurich, and Tokyo featuring cultural landmarks, gastronomy, and high-speed transit.',
    cover_photo: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80',
    start_date: '2026-09-10',
    end_date: '2026-09-25',
    total_budget: 3500,
    estimated_cost: 2940,
    is_public: true,
    share_code: 'EURO-2026-ALEX',
    created_at: '2026-02-01T10:00:00Z',
    stops: [
      {
        id: 'stop-p1',
        trip_id: 'trip-2026-01',
        city_name: 'Paris',
        country: 'France',
        order_index: 0,
        arrival_date: '2026-09-10',
        departure_date: '2026-09-14',
        notes: 'Hotel booked near Le Marais district. Eiffel Tower & Louvre reservations confirmed.',
        cover_image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
        activities: [
          {
            id: 'act-101',
            stop_id: 'stop-p1',
            trip_id: 'trip-2026-01',
            title: 'TGV Express Flight & Boutique Hotel Stay',
            category: 'Transport',
            cost: 450,
            duration_hours: 4.0,
            scheduled_time: '14:00',
            day_number: 1,
            is_completed: true,
          },
          {
            id: 'act-102',
            stop_id: 'stop-p1',
            trip_id: 'trip-2026-01',
            title: 'Eiffel Tower Summit Skip-The-Line Access',
            category: 'Sightseeing',
            cost: 45,
            duration_hours: 2.5,
            scheduled_time: '18:30',
            day_number: 1,
            is_completed: true,
          },
        ],
      },
      {
        id: 'stop-r1',
        trip_id: 'trip-2026-01',
        city_name: 'Rome',
        country: 'Italy',
        order_index: 1,
        arrival_date: '2026-09-14',
        departure_date: '2026-09-18',
        notes: 'Stay at Piazza Navona suites. Early morning Colosseum VIP tour.',
        cover_image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
        activities: [
          {
            id: 'act-201',
            stop_id: 'stop-r1',
            trip_id: 'trip-2026-01',
            title: 'Frecciarossa High-Speed Rail & Hotel Check-in',
            category: 'Transport',
            cost: 180,
            duration_hours: 3.5,
            scheduled_time: '11:00',
            day_number: 5,
            is_completed: false,
          },
        ],
      },
    ],
  },
];

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('globetrotter_trips');
    return saved ? JSON.parse(saved) : DEFAULT_TRIPS;
  });
  const [selectedTripId, setSelectedTripId] = useState<string | null>(trips[0]?.id || null);
  const [cities, setCities] = useState<CityCatalogItem[]>(DEFAULT_CITIES);
  const [activityCatalog, setActivityCatalog] = useState<ActivityCatalogItem[]>([]);

  useEffect(() => {
    localStorage.setItem('globetrotter_trips', JSON.stringify(trips));
  }, [trips]);

  const refreshFromSupabase = async () => {
    if (!isSupabaseConfigured()) return;
    try {
      // Fetch Cities back from Supabase
      const { data: dbCities } = await supabase.from('cities').select('*');
      if (dbCities && dbCities.length > 0) {
        setCities(dbCities);
      }

      // Fetch Activities Catalog back from Supabase
      const { data: dbActivities } = await supabase.from('activities').select('*');
      if (dbActivities && dbActivities.length > 0) {
        setActivityCatalog(dbActivities);
      }

      // Fetch Trips back from Supabase
      const { data: dbTrips } = await supabase.from('trips').select('*');
      if (dbTrips && dbTrips.length > 0) {
        setTrips((prev) => {
          const map = new Map(prev.map((t) => [t.id, t]));
          dbTrips.forEach((t: any) => {
            if (!map.has(t.id)) {
              map.set(t.id, {
                id: t.id,
                user_id: t.user_id || 'guest',
                user_name: t.user_name || 'Traveler',
                name: t.name,
                description: t.description || '',
                cover_photo: t.cover_photo || DEFAULT_CITIES[0].image_url,
                start_date: t.start_date || '2026-09-10',
                end_date: t.end_date || '2026-09-20',
                total_budget: t.total_budget || 2500,
                estimated_cost: t.estimated_cost || 0,
                is_public: t.is_public ?? true,
                share_code: t.share_code || 'SHARE-CODE',
                created_at: t.created_at || new Date().toISOString(),
                stops: DEFAULT_TRIPS.find((mt) => mt.id === t.id)?.stops || [],
              });
            }
          });
          return Array.from(map.values());
        });
      }
    } catch (err) {
      console.warn('Supabase fetch refresh note:', err);
    }
  };

  useEffect(() => {
    refreshFromSupabase();
  }, []);

  const currentTrip = trips.find((t) => t.id === selectedTripId) || trips[0] || null;

  const createTrip = (tripData: Omit<Trip, 'id' | 'created_at' | 'share_code' | 'stops'>, initialCityId?: string): string => {
    const newId = 'trip-' + Date.now();
    const shareCode = `${tripData.name.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    let initialStops: Stop[] = [];
    if (initialCityId) {
      const matchedCity = cities.find((c) => c.id === initialCityId);
      if (matchedCity) {
        initialStops = [
          {
            id: 'stop-' + Date.now(),
            trip_id: newId,
            city_name: matchedCity.name,
            country: matchedCity.country,
            order_index: 0,
            arrival_date: tripData.start_date,
            departure_date: tripData.end_date,
            cover_image: matchedCity.image_url,
            notes: `Explore the vibrant culture, local cuisine, and top sights of ${matchedCity.name}.`,
            activities: [],
          },
        ];
      }
    }

    const newTrip: Trip = {
      ...tripData,
      id: newId,
      user_id: user?.id || 'guest',
      user_name: user?.full_name || 'Guest Traveler',
      share_code: shareCode,
      created_at: new Date().toISOString(),
      stops: initialStops,
      estimated_cost: 0,
    };

    setTrips((prev) => [newTrip, ...prev]);
    setSelectedTripId(newId);

    if (isSupabaseConfigured()) {
      supabase.from('trips').upsert({
        id: newTrip.id,
        user_id: newTrip.user_id,
        user_name: newTrip.user_name,
        name: newTrip.name,
        description: newTrip.description,
        cover_photo: newTrip.cover_photo,
        start_date: newTrip.start_date,
        end_date: newTrip.end_date,
        total_budget: newTrip.total_budget,
        is_public: newTrip.is_public,
        share_code: newTrip.share_code,
      }, { onConflict: 'id' }).then(({ error }) => {
        if (error) console.warn('Supabase sync trip error:', error.message);
      });
    }

    return newId;
  };

  const updateTrip = (id: string, data: Partial<Trip>) => {
    setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
    if (isSupabaseConfigured()) {
      supabase.from('trips').update(data).eq('id', id).then(() => {});
    }
  };

  const deleteTrip = (id: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
    if (selectedTripId === id) {
      const remaining = trips.filter((t) => t.id !== id);
      setSelectedTripId(remaining[0]?.id || null);
    }
    if (isSupabaseConfigured()) {
      supabase.from('trips').delete().eq('id', id).then(() => {});
    }
  };

  const addStopToTrip = (tripId: string, city: CityCatalogItem, startDate: string, endDate: string) => {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const nextOrder = trip.stops.length;
        const newStop: Stop = {
          id: 'stop-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
          trip_id: tripId,
          city_name: city.name,
          country: city.country,
          order_index: nextOrder,
          arrival_date: startDate,
          departure_date: endDate,
          cover_image: city.image_url,
          notes: `Selected from destination discovery. Estimated daily cost ~$${city.avg_daily_cost}.`,
          activities: [],
        };
        const updatedStops = [...trip.stops, newStop];

        if (isSupabaseConfigured()) {
          supabase.from('stops').upsert({
            id: newStop.id,
            trip_id: tripId,
            city_name: newStop.city_name,
            country: newStop.country,
            order_index: newStop.order_index,
            arrival_date: newStop.arrival_date,
            departure_date: newStop.departure_date,
            cover_image: newStop.cover_image,
            notes: newStop.notes,
          }, { onConflict: 'id' }).then(() => {});
        }

        return { ...trip, stops: updatedStops };
      })
    );
  };

  const removeStopFromTrip = (tripId: string, stopId: string) => {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const updatedStops = trip.stops.filter((s) => s.id !== stopId).map((s, idx) => ({ ...s, order_index: idx }));
        if (isSupabaseConfigured()) {
          supabase.from('stops').delete().eq('id', stopId).then(() => {});
        }
        return { ...trip, stops: updatedStops };
      })
    );
  };

  const reorderStops = (tripId: string, startIndex: number, endIndex: number) => {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const reordered = Array.from(trip.stops);
        const [moved] = reordered.splice(startIndex, 1);
        reordered.splice(endIndex, 0, moved);
        const updated = reordered.map((stop, idx) => ({ ...stop, order_index: idx }));
        return { ...trip, stops: updated };
      })
    );
  };

  const addActivityToStop = (tripId: string, stopId: string, activityData: Omit<Activity, 'id' | 'trip_id' | 'stop_id'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: 'act-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      trip_id: tripId,
      stop_id: stopId,
    };

    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const updatedStops = trip.stops.map((stop) => {
          if (stop.id !== stopId) return stop;
          return { ...stop, activities: [...stop.activities, newActivity] };
        });
        const totalEst = updatedStops.reduce(
          (acc, s) => acc + s.activities.reduce((a, act) => a + act.cost, 0),
          0
        );

        if (isSupabaseConfigured()) {
          supabase.from('activities').upsert({
            id: newActivity.id,
            city_id: newActivity.stop_id,
            city_name: newActivity.title,
            title: newActivity.title,
            category: newActivity.category,
            cost: newActivity.cost,
            duration_hours: newActivity.duration_hours,
            image_url: newActivity.image_url || '',
            description: newActivity.description || '',
          }, { onConflict: 'id' }).then(() => {});
        }

        return { ...trip, stops: updatedStops, estimated_cost: totalEst };
      })
    );
  };

  const toggleActivityStatus = (tripId: string, stopId: string, activityId: string) => {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const updatedStops = trip.stops.map((stop) => {
          if (stop.id !== stopId) return stop;
          return {
            ...stop,
            activities: stop.activities.map((a) =>
              a.id === activityId ? { ...a, is_completed: !a.is_completed } : a
            ),
          };
        });
        return { ...trip, stops: updatedStops };
      })
    );
  };

  const deleteActivity = (tripId: string, stopId: string, activityId: string) => {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const updatedStops = trip.stops.map((stop) => {
          if (stop.id !== stopId) return stop;
          return {
            ...stop,
            activities: stop.activities.filter((a) => a.id !== activityId),
          };
        });
        const totalEst = updatedStops.reduce(
          (acc, s) => acc + s.activities.reduce((a, act) => a + act.cost, 0),
          0
        );

        if (isSupabaseConfigured()) {
          supabase.from('activities').delete().eq('id', activityId).then(() => {});
        }

        return { ...trip, stops: updatedStops, estimated_cost: totalEst };
      })
    );
  };

  const copyTripToUser = (sharedTrip: Trip): string => {
    const copiedId = 'trip-' + Date.now();
    const copiedTrip: Trip = {
      ...sharedTrip,
      id: copiedId,
      user_id: user?.id || 'guest',
      user_name: user?.full_name || 'Guest Traveler',
      name: `Copy of ${sharedTrip.name}`,
      share_code: `COPY-${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: new Date().toISOString(),
    };

    setTrips((prev) => [copiedTrip, ...prev]);
    setSelectedTripId(copiedId);

    if (isSupabaseConfigured()) {
      supabase.from('trips').upsert({
        id: copiedTrip.id,
        user_id: copiedTrip.user_id,
        user_name: copiedTrip.user_name,
        name: copiedTrip.name,
        description: copiedTrip.description,
        cover_photo: copiedTrip.cover_photo,
        start_date: copiedTrip.start_date,
        end_date: copiedTrip.end_date,
        total_budget: copiedTrip.total_budget,
        is_public: copiedTrip.is_public,
        share_code: copiedTrip.share_code,
      }, { onConflict: 'id' }).then(() => {});
    }

    return copiedId;
  };

  const calculateBudgetBreakdown = (trip: Trip): BudgetBreakdown => {
    let transport = 0;
    let stay = 0;
    let activities = 0;
    let meals = 0;

    trip.stops.forEach((stop) => {
      stop.activities.forEach((act) => {
        if (act.category === 'Transport') transport += act.cost;
        else if (act.category === 'Stay') stay += act.cost;
        else if (act.category === 'Food') meals += act.cost;
        else activities += act.cost;
      });
    });

    const totalEstimated = transport + stay + activities + meals;
    const totalDays = Math.max(1, trip.stops.length * 3);
    const dailyAverage = Math.round(totalEstimated / totalDays);

    return {
      transport,
      stay,
      activities,
      meals,
      totalEstimated,
      budgetCap: trip.total_budget,
      dailyAverage,
      overbudgetDays: totalEstimated > trip.total_budget ? [1] : [],
      remaining: Math.max(0, trip.total_budget - totalEstimated),
      isOverBudget: totalEstimated > trip.total_budget,
    };
  };

  const getCityById = (id: string) => {
    return cities.find((c) => c.id === id);
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        cities,
        activityCatalog,
        currentTrip,
        selectedTripId,
        setSelectedTripId,
        createTrip,
        updateTrip,
        deleteTrip,
        addStopToTrip,
        removeStopFromTrip,
        reorderStops,
        addActivityToStop,
        toggleActivityStatus,
        deleteActivity,
        copyTripToUser,
        calculateBudgetBreakdown,
        getCityById,
        refreshFromSupabase,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => {
  const context = useContext(TripContext);
  if (!context) throw new Error('useTrips must be used within TripProvider');
  return context;
};
