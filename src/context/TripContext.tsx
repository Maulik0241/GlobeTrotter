import React, { createContext, useContext, useState, useEffect } from 'react';
import { Trip, Stop, Activity, CityCatalogItem, ActivityCatalogItem, BudgetBreakdown } from '../types';
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
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('globetrotter_trips');
    return saved ? JSON.parse(saved) : MOCK_TRIPS;
  });
  const [selectedTripId, setSelectedTripId] = useState<string | null>(trips[0]?.id || null);
  const cities = MOCK_CITIES;
  const activityCatalog = MOCK_ACTIVITIES_CATALOG;

  useEffect(() => {
    localStorage.setItem('globetrotter_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      supabase.from('trips').select('*, stops(*, activities(*))').then(({ data, error }) => {
        if (data && !error && data.length > 0) {
          // Format Supabase trips if present
        }
      });
    }
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
    return newId;
  };

  const updateTrip = (id: string, data: Partial<Trip>) => {
    setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
  };

  const deleteTrip = (id: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
    if (selectedTripId === id) {
      const remaining = trips.filter((t) => t.id !== id);
      setSelectedTripId(remaining[0]?.id || null);
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
      is_completed: false,
    };

    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        return {
          ...trip,
          stops: trip.stops.map((stop) => {
            if (stop.id !== stopId) return stop;
            return { ...stop, activities: [...stop.activities, newActivity] };
          }),
        };
      })
    );
  };

  const toggleActivityStatus = (tripId: string, stopId: string, activityId: string) => {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        return {
          ...trip,
          stops: trip.stops.map((stop) => {
            if (stop.id !== stopId) return stop;
            return {
              ...stop,
              activities: stop.activities.map((act) =>
                act.id === activityId ? { ...act, is_completed: !act.is_completed } : act
              ),
            };
          }),
        };
      })
    );
  };

  const deleteActivity = (tripId: string, stopId: string, activityId: string) => {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        return {
          ...trip,
          stops: trip.stops.map((stop) => {
            if (stop.id !== stopId) return stop;
            return {
              ...stop,
              activities: stop.activities.filter((act) => act.id !== activityId),
            };
          }),
        };
      })
    );
  };

  const copyTripToUser = (sharedTrip: Trip): string => {
    const newId = 'trip-' + Date.now();
    const copiedTrip: Trip = {
      ...sharedTrip,
      id: newId,
      name: `${sharedTrip.name} (My Copy)`,
      user_id: user?.id || 'guest',
      user_name: user?.full_name || 'Guest Traveler',
      share_code: `COPY-${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: new Date().toISOString(),
      stops: sharedTrip.stops.map((s, sIdx) => ({
        ...s,
        id: `stop-copy-${sIdx}-${Date.now()}`,
        trip_id: newId,
        activities: s.activities.map((a, aIdx) => ({
          ...a,
          id: `act-copy-${aIdx}-${Date.now()}`,
          trip_id: newId,
          is_completed: false,
        })),
      })),
    };
    setTrips((prev) => [copiedTrip, ...prev]);
    setSelectedTripId(newId);
    return newId;
  };

  const calculateBudgetBreakdown = (trip: Trip): BudgetBreakdown => {
    let transport = 0;
    let stay = 0;
    let activities = 0;
    let meals = 0;

    trip.stops.forEach((stop) => {
      // Calculate activities
      stop.activities.forEach((act) => {
        if (act.category === 'Transport') transport += act.cost;
        else if (act.category === 'Stay') stay += act.cost;
        else if (act.category === 'Food') meals += act.cost;
        else activities += act.cost;
      });

      // Default baseline estimate if empty activities
      if (stop.activities.length === 0) {
        stay += 120 * 3;
        meals += 50 * 3;
        activities += 60;
      }
    });

    const totalEstimated = transport + stay + activities + meals;
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const durationDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const dailyAverage = Math.round(totalEstimated / durationDays);

    // identify overbudget days
    const overbudgetDays: number[] = [];
    const dailyTargetLimit = trip.total_budget / durationDays;
    for (let d = 1; d <= durationDays; d++) {
      let dayCost = 0;
      trip.stops.forEach((stop) => {
        stop.activities.forEach((act) => {
          if (act.day_number === d) dayCost += act.cost;
        });
      });
      if (dayCost > dailyTargetLimit && dailyTargetLimit > 0) {
        overbudgetDays.push(d);
      }
    }

    return {
      transport,
      stay,
      activities,
      meals,
      totalEstimated,
      budgetCap: trip.total_budget,
      dailyAverage,
      overbudgetDays,
    };
  };

  const getCityById = (id: string) => cities.find((c) => c.id === id);

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
