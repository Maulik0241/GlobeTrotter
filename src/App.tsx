import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

import { Dashboard } from './pages/Dashboard';
import { MyTrips } from './pages/MyTrips';
import { CreateTrip } from './pages/CreateTrip';
import { ItineraryBuilder } from './pages/ItineraryBuilder';
import { ItineraryView } from './pages/ItineraryView';
import { CitySearch } from './pages/CitySearch';
import { ActivitySearch } from './pages/ActivitySearch';
import { TripBudget } from './pages/TripBudget';
import { TripCalendar } from './pages/TripCalendar';
import { SharedItinerary } from './pages/SharedItinerary';
import { UserProfile } from './pages/UserProfile';
import { AdminDashboard } from './pages/AdminDashboard';

export const MainContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      
      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openCreateModal={() => setCurrentTab('create-trip')}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {currentTab === 'dashboard' && (
          <Dashboard
            setCurrentTab={setCurrentTab}
            openCreateTripModal={() => setCurrentTab('create-trip')}
          />
        )}

        {currentTab === 'my-trips' && (
          <MyTrips
            setCurrentTab={setCurrentTab}
            openCreateTripModal={() => setCurrentTab('create-trip')}
          />
        )}

        {currentTab === 'create-trip' && (
          <CreateTrip
            onSuccess={() => {
              setCurrentTab('itinerary-builder');
            }}
            onCancel={() => setCurrentTab('my-trips')}
          />
        )}

        {currentTab === 'itinerary-builder' && (
          <ItineraryBuilder setCurrentTab={setCurrentTab} />
        )}

        {currentTab === 'itinerary-view' && (
          <ItineraryView setCurrentTab={setCurrentTab} />
        )}

        {currentTab === 'cities' && (
          <CitySearch openCreateTripModal={() => setCurrentTab('create-trip')} />
        )}

        {currentTab === 'activities' && <ActivitySearch />}

        {currentTab === 'trip-budget' && <TripBudget setCurrentTab={setCurrentTab} />}

        {currentTab === 'trip-calendar' && <TripCalendar setCurrentTab={setCurrentTab} />}

        {currentTab === 'shared-itinerary' && <SharedItinerary setCurrentTab={setCurrentTab} />}

        {currentTab === 'profile' && <UserProfile />}

        {currentTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Authentication Modal */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <MainContent />
      </TripProvider>
    </AuthProvider>
  );
}
