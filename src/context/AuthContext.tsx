import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (regData: {
    email: string;
    pass: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    city?: string;
    country?: string;
    additionalInfo?: string;
    avatarUrl?: string;
  }) => Promise<void>;
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
    return saved ? JSON.parse(saved) : null;
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
                  first_name: data.first_name,
                  last_name: data.last_name,
                  phone_number: data.phone_number,
                  city: data.city,
                  country: data.country,
                  additional_info: data.additional_info,
                  avatar_url: data.avatar_url || '',
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
    }
  }, []);

  const login = async (email: string, _pass: string) => {
    setIsLoading(true);

    let supabaseUserId: string | null = null;
    if (isSupabaseConfigured()) {
      try {
        const { data: authData } = await supabase.auth.signInWithPassword({ email, password: _pass });
        if (authData?.user) supabaseUserId = authData.user.id;
      } catch (e) {
        console.warn('Supabase auth signin note:', e);
      }
    }

    const namePart = email.split('@')[0].replace('.', ' ');
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    const loggedUser: UserProfile = {
      id: supabaseUserId || 'usr-' + Date.now(),
      email: email,
      full_name: formattedName || 'Traveler',
      language_preference: 'English',
      avatar_url: '',
      is_admin: true,
      saved_destinations: [],
      created_at: new Date().toISOString(),
    };

    setUser(loggedUser);
    setIsLoading(false);
    setAuthModalOpen(false);
  };

  const signup = async (regData: {
    email: string;
    pass: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    city?: string;
    country?: string;
    additionalInfo?: string;
    avatarUrl?: string;
  }) => {
    setIsLoading(true);
    const fullName = `${regData.firstName} ${regData.lastName}`.trim();
    const avatar = regData.avatarUrl || '';
    let assignedUserId = 'usr-' + Date.now();

    if (isSupabaseConfigured()) {
      try {
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email: regData.email,
          password: regData.pass,
          options: { data: { full_name: fullName } },
        });

        if (authErr) {
          console.warn('Supabase auth signup warning:', authErr.message);
        }

        if (authData?.user?.id) {
          assignedUserId = authData.user.id;
        }

        // Upsert into Supabase "profiles" table
        const { error: profErr } = await supabase.from('profiles').upsert([
          {
            id: assignedUserId,
            email: regData.email,
            full_name: fullName,
            avatar_url: avatar,
            language_preference: 'English',
            is_admin: true,
            saved_destinations: [],
          },
        ], { onConflict: 'id' });

        if (profErr) {
          console.warn('Supabase profiles upsert error:', profErr.message);
        }
      } catch (e: any) {
        console.warn('Supabase signup execution note:', e);
      }
    }

    const newProfile: UserProfile = {
      id: assignedUserId,
      email: regData.email,
      full_name: fullName,
      first_name: regData.firstName,
      last_name: regData.lastName,
      phone_number: regData.phoneNumber,
      city: regData.city,
      country: regData.country,
      additional_info: regData.additionalInfo,
      avatar_url: avatar,
      language_preference: 'English',
      is_admin: true,
      saved_destinations: [],
      created_at: new Date().toISOString(),
    };

    setUser(newProfile);
    setIsLoading(false);
    setAuthModalOpen(false);
  };

  const logout = () => {
    if (isSupabaseConfigured()) {
      supabase.auth.signOut().catch(() => {});
    }
    localStorage.removeItem('globetrotter_user');
    setUser(null);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    if (isSupabaseConfigured()) {
      supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: updated.full_name,
        avatar_url: updated.avatar_url || '',
        language_preference: updated.language_preference || 'English',
        saved_destinations: updated.saved_destinations || [],
      }, { onConflict: 'id' }).then(({ error }) => {
        if (error) console.warn('Supabase profile update note:', error.message);
      });
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
