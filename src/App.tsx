import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

import { PublicLanding } from './pages/PublicLanding';
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
  const { user, setAuthModalOpen, setAuthMode } = useAuth();
  
  // Initialize tab state from URL hash or fallback to user status
  const getInitialTab = () => {
    const hash = window.location.hash.replace('#', '');
    if (hash) return hash;
    return user ? 'dashboard' : 'landing';
  };

  const [currentTab, setCurrentTabState] = useState<string>(getInitialTab);

  // Wrapper function to set current tab & push state to browser backstack
  const setCurrentTab = (newTab: string) => {
    if (newTab !== currentTab) {
      setCurrentTabState(newTab);
      window.history.pushState({ tab: newTab }, '', `#${newTab}`);
    }
  };

  // Browser Back / Forward Button Handler (popstate)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.tab) {
        setCurrentTabState(event.state.tab);
      } else {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
          setCurrentTabState(hash);
        } else {
          setCurrentTabState(user ? 'dashboard' : 'landing');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [user]);

  // Dynamic Session Navigation: redirect to landing page when user logs out
  useEffect(() => {
    if (!user) {
      setCurrentTabState('landing');
      window.history.replaceState({ tab: 'landing' }, '', '#landing');
    } else if (currentTab === 'landing') {
      setCurrentTabState('dashboard');
      window.history.replaceState({ tab: 'dashboard' }, '', '#dashboard');
    }
  }, [user]);

  const isPublicLanding = currentTab === 'landing' && !user;

  return (
    <div className="min-h-screen w-full bg-[#F4F7F6] dark:bg-[#0B131A] text-[#1A2B32] dark:text-[#F8FAFC] flex flex-col font-sans selection:bg-[#007A87] dark:selection:bg-[#00E5FF] selection:text-white dark:selection:text-slate-950 transition-colors duration-300">
      
      {/* Navigation Bar */}
      {!isPublicLanding && (
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          openCreateModal={() => setCurrentTab('create-trip')}
        />
      )}

      {/* Main View Area */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-6 pb-16 transition-all duration-300">
        {isPublicLanding && (
          <PublicLanding
            onGetStarted={() => {
              if (user) {
                setCurrentTab('dashboard');
              } else {
                setAuthMode('signup');
                setAuthModalOpen(true);
              }
            }}
            onLogin={() => {
              setAuthMode('login');
              setAuthModalOpen(true);
            }}
            onSignup={() => {
              setAuthMode('signup');
              setAuthModalOpen(true);
            }}
          />
        )}

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
            onCancel={() => setCurrentTab('dashboard')}
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

        {currentTab === 'profile' && <UserProfile setCurrentTab={setCurrentTab} />}

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
    <ThemeProvider>
      <AuthProvider>
        <TripProvider>
          <MainContent />
        </TripProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
