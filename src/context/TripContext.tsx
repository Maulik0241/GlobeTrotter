import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Trip, Stop, Activity, CityCatalogItem, ActivityCatalogItem, BudgetBreakdown } from '../types';
import { MOCK_TRIPS, MOCK_CITIES, MOCK_ACTIVITIES_CATALOG } from '../data/mockData';
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

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('globetrotter_trips');
    return saved ? JSON.parse(saved) : MOCK_TRIPS;
  });
  const [selectedTripId, setSelectedTripId] = useState<string | null>(trips[0]?.id || null);
  const [cities, setCities] = useState<CityCatalogItem[]>(MOCK_CITIES);
  const [activityCatalog, setActivityCatalog] = useState<ActivityCatalogItem[]>(MOCK_ACTIVITIES_CATALOG);

  useEffect(() => {
    localStorage.setItem('globetrotter_trips', JSON.stringify(trips));
  }, [trips]);

  const refreshFromSupabase = async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const { data: dbCities } = await supabase.from('cities').select('*');
      if (dbCities && dbCities.length > 0) {
        setCities(dbCities);
      }

      const { data: dbActivities } = await supabase.from('activities').select('*');
      if (dbActivities && dbActivities.length > 0) {
        setActivityCatalog(dbActivities);
      }

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
                cover_photo: t.cover_photo || MOCK_CITIES[0].image_url,
                start_date: t.start_date || '2026-09-10',
                end_date: t.end_date || '2026-09-20',
                total_budget: t.total_budget || 2500,
                estimated_cost: t.estimated_cost || 0,
                is_public: t.is_public ?? true,
                share_code: t.share_code || 'SHARE-CODE',
                created_at: t.created_at || new Date().toISOString(),
                stops: [],
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
        name: newTrip.name,
        description: newTrip.description,
        cover_photo: newTrip.cover_photo,
        start_date: newTrip.start_date,
        end_date: newTrip.end_date,
        total_budget: newTrip.total_budget,
        is_public: newTrip.is_public,
        share_code: newTrip.share_code,
      }).then(({ error }) => {
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
        return { ...trip, stops: [...trip.stops, newStop] };
      })
    );
  };

  const removeStopFromTrip = (tripId: string, stopId: string) => {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        return {
          ...trip,
          stops: trip.stops.filter((s) => s.id !== stopId).map((s, idx) => ({ ...s, order_index: idx })),
        };
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
