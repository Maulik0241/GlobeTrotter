import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { MOCK_USER } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  toggleSavedDestination: (cityId: string) => void;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'signup' | 'forgot';
  setAuthMode: (mode: 'login' | 'signup' | 'forgot') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('globetrotter_user');
    return saved ? JSON.parse(saved) : MOCK_USER;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');

  useEffect(() => {
    if (user) {
      localStorage.setItem('globetrotter_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('globetrotter_user');
    }
  }, [user]);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      setIsLoading(true);
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setUser({
                  id: data.id,
                  email: data.email,
                  full_name: data.full_name || session.user.email?.split('@')[0] || 'Traveler',
                  avatar_url: data.avatar_url || MOCK_USER.avatar_url,
                  language_preference: data.language_preference || 'English',
                  is_admin: data.is_admin || false,
                  saved_destinations: data.saved_destinations || [],
                  created_at: data.created_at,
                });
              }
              setIsLoading(false);
            });
        } else {
          setIsLoading(false);
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) {
          // preserve demo state or set null if requested
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  const login = async (email: string, _pass: string) => {
    setIsLoading(true);
    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.signInWithPassword({ email, password: _pass });
      if (error) {
        setIsLoading(false);
        throw error;
      }
    }
    // Fallback or demo user login
    const loggedUser: UserProfile = {
      ...MOCK_USER,
      email: email,
      full_name: email.split('@')[0].toUpperCase(),
    };
    setUser(loggedUser);
    setIsLoading(false);
    setAuthModalOpen(false);
  };

  const signup = async (email: string, _pass: string, name: string) => {
    setIsLoading(true);
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: _pass,
        options: { data: { full_name: name } },
      });
      if (error) {
        setIsLoading(false);
        throw error;
      }
      if (data.user) {
        await supabase.from('profiles').insert([
          {
            id: data.user.id,
            email,
            full_name: name,
            avatar_url: MOCK_USER.avatar_url,
          },
        ]);
      }
    }
    const newProfile: UserProfile = {
      id: 'usr-' + Date.now(),
      email,
      full_name: name,
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      language_preference: 'English',
      is_admin: false,
      saved_destinations: [],
      created_at: new Date().toISOString(),
    };
    setUser(newProfile);
    setIsLoading(false);
    setAuthModalOpen(false);
  };

  const logout = () => {
    if (isSupabaseConfigured()) {
      supabase.auth.signOut();
    }
    setUser(null);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    if (isSupabaseConfigured()) {
      supabase.from('profiles').update(data).eq('id', user.id);
    }
  };

  const toggleSavedDestination = (cityId: string) => {
    if (!user) return;
    const current = user.saved_destinations || [];
    const exists = current.includes(cityId);
    const updatedDestinations = exists ? current.filter((id) => id !== cityId) : [...current, cityId];
    updateProfile({ saved_destinations: updatedDestinations });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        toggleSavedDestination,
        isAuthModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
