import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Database, CheckCircle2, Loader2, Sparkles, AlertCircle, Copy, Check } from 'lucide-react';
import { MOCK_CITIES, MOCK_ACTIVITIES_CATALOG, MOCK_TRIPS, MOCK_USER } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface DatabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncSuccess?: () => void;
}

const SQL_SCHEMA_SCRIPT = `-- GlobeTrotter Supabase Tables Re-creation (Replaces old UUID types with TEXT keys)
DROP TABLE IF EXISTS public.activities CASCADE;
DROP TABLE IF EXISTS public.stops CASCADE;
DROP TABLE IF EXISTS public.trips CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.cities CASCADE;

CREATE TABLE public.cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT NOT NULL,
  cost_index TEXT NOT NULL,
  popularity_score INT DEFAULT 80,
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  avg_daily_cost NUMERIC(10,2) DEFAULT 150,
  tags TEXT[] DEFAULT '{}'
);

CREATE TABLE public.activities (
  id TEXT PRIMARY KEY,
  city_id TEXT,
  city_name TEXT,
  stop_id TEXT,
  trip_id TEXT,
  title TEXT NOT NULL,
  category TEXT,
  cost NUMERIC(10,2) DEFAULT 0,
  duration_hours NUMERIC(4,1) DEFAULT 1,
  scheduled_time TEXT,
  day_number INT DEFAULT 1,
  is_completed BOOLEAN DEFAULT FALSE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  language_preference TEXT DEFAULT 'English',
  is_admin BOOLEAN DEFAULT FALSE,
  saved_destinations TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.trips (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cover_photo TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_budget NUMERIC(10,2) DEFAULT 0,
  is_public BOOLEAN DEFAULT TRUE,
  share_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.stops (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL,
  city_name TEXT NOT NULL,
  country TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  arrival_date DATE NOT NULL,
  departure_date DATE NOT NULL,
  notes TEXT,
  cover_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for public demo" ON public.cities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for public demo" ON public.activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for public demo" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for public demo" ON public.trips FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for public demo" ON public.stops FOR ALL USING (true) WITH CHECK (true);
`;

export const DatabaseSyncModal: React.FC<DatabaseSyncModalProps> = ({ isOpen, onClose, onSyncSuccess }) => {
  const [progress, setProgress] = useState<number>(0);
  const [currentStepText, setCurrentStepText] = useState<string>('Ready to sync dataset to Supabase DB...');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [errorLog, setErrorLog] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const runDatabaseSync = async () => {
    setIsSyncing(true);
    setProgress(5);
    setCompletedSteps([]);
    setErrorLog(null);
    setCurrentStepText('Testing connection to Supabase Database...');

    if (!isSupabaseConfigured()) {
      setIsSyncing(false);
      setErrorLog('Supabase is not configured. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file.');
      return;
    }

    try {
      // 1. Sync Cities Table
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCurrentStepText('Inserting Cities dataset into Supabase "cities" table...');
      setProgress(25);

      const { error: cityErr } = await supabase.from('cities').upsert(
        MOCK_CITIES.map((c) => ({
          id: c.id,
          name: c.name,
          country: c.country,
          region: c.region,
          cost_index: c.cost_index,
          popularity_score: c.popularity_score,
          image_url: c.image_url,
          description: c.description,
          avg_daily_cost: c.avg_daily_cost,
          tags: c.tags,
        })),
        { onConflict: 'id' }
      );

      if (cityErr) {
        throw new Error(`Cities Table Issue: ${cityErr.message}`);
      }
      setCompletedSteps((prev) => [...prev, 'Cities Data (10 Global Cities inserted)']);

      // 2. Sync Activities Catalog Table
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCurrentStepText('Inserting Activities catalog into Supabase "activities" table...');
      setProgress(50);

      const { error: actErr } = await supabase.from('activities').upsert(
        MOCK_ACTIVITIES_CATALOG.map((a) => ({
          id: a.id,
          city_id: a.city_id,
          city_name: a.city_name,
          title: a.title,
          category: a.category,
          cost: a.cost,
          duration_hours: a.duration_hours,
          image_url: a.image_url,
          description: a.description,
        })),
        { onConflict: 'id' }
      );

      if (actErr) {
        throw new Error(`Activities Table Issue: ${actErr.message}`);
      }
      setCompletedSteps((prev) => [...prev, 'Activities Catalog (11 Sightseeing & Dining Activities)']);

      // 3. Sync Sample Trips & Stops
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCurrentStepText('Inserting Sample Trips into Supabase "trips" table...');
      setProgress(75);

      const { error: tripErr } = await supabase.from('trips').upsert(
        MOCK_TRIPS.map((t) => ({
          id: t.id,
          user_id: t.user_id,
          name: t.name,
          description: t.description,
          cover_photo: t.cover_photo,
          start_date: t.start_date,
          end_date: t.end_date,
          total_budget: t.total_budget,
          is_public: t.is_public,
          share_code: t.share_code,
        })),
        { onConflict: 'id' }
      );

      if (tripErr) {
        throw new Error(`Trips Table Issue: ${tripErr.message}`);
      }
      setCompletedSteps((prev) => [...prev, 'Sample Trips & Itineraries (Grand European 2026)']);

      // 4. Sync User Profile
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCurrentStepText('Upserting User Profile into Supabase "profiles" table...');
      setProgress(100);

      const { error: profErr } = await supabase.from('profiles').upsert(
        [
          {
            id: MOCK_USER.id,
            full_name: MOCK_USER.full_name,
            email: MOCK_USER.email,
            avatar_url: MOCK_USER.avatar_url,
            language_preference: MOCK_USER.language_preference,
            is_admin: MOCK_USER.is_admin,
            saved_destinations: MOCK_USER.saved_destinations,
          },
        ],
        { onConflict: 'id' }
      );

      if (profErr) {
        throw new Error(`Profile Table Issue: ${profErr.message}`);
      }
      setCompletedSteps((prev) => [...prev, 'User Profiles & Saved Destinations']);

      setCurrentStepText('Database Synchronization Complete! All data live in Supabase.');
      setIsSyncing(false);
      if (onSyncSuccess) onSyncSuccess();
    } catch (err: any) {
      setIsSyncing(false);
      setErrorLog(err.message || 'Error executing database sync.');
    }
  };

  const modalContent = (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full min-h-screen z-[9999] bg-slate-950/80 dark:bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#12181F] border border-[#DDE5E8] dark:border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 text-[#1A2B32] dark:text-[#F8FAFC] my-auto space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSyncing}
          className="absolute top-4 right-4 p-2 text-theme-muted hover:text-theme-main rounded-full hover:bg-theme-subtle transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#007A87] via-[#00E5FF] to-[#FF7A00] flex items-center justify-center text-slate-950 shadow-lg">
            <Database className="w-6 h-6 text-white dark:text-slate-950" />
          </div>
          <div>
            <h3 className="text-xl font-black text-theme-main font-header">Supabase DB Live Data Sync</h3>
            <p className="text-xs text-theme-muted">Insert static mock dataset into live Supabase relational tables</p>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="space-y-3 bg-theme-subtle p-5 rounded-2xl border border-theme">
          <div className="flex items-center justify-between text-xs font-bold font-header">
            <span className="text-theme-main flex items-center gap-2">
              {isSyncing && <Loader2 className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF] animate-spin" />}
              <span>{currentStepText}</span>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400">{progress}%</span>
          </div>

          {/* Animated Bar */}
          <div className="w-full h-3 bg-theme-card rounded-full overflow-hidden border border-theme p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#007A87] via-[#00E5FF] to-[#22C55E] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Completed Steps Log */}
        {completedSteps.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-theme-muted font-header">Sync Execution Log</h4>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {completedSteps.map((step, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Alert with 1-Click Copy SQL Script Button */}
        {errorLog && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs space-y-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">{errorLog}</p>
                <p className="text-[11px] font-normal text-theme-muted">
                  Click the button below to copy the updated SQL script, then paste it in your <strong>Supabase Dashboard → SQL Editor → Run</strong>!
                </p>
              </div>
            </div>

            <button
              onClick={handleCopySql}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-600 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-2 border border-rose-500/30 transition-all cursor-pointer"
            >
              {copiedSql ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>SQL Script Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy SQL Table Creation Script</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          {progress === 100 && !errorLog ? (
            <button
              onClick={onClose}
              className="btn-cta w-full py-3.5 px-4 rounded-2xl text-xs font-black shadow-lg cursor-pointer"
            >
              Done & Close
            </button>
          ) : (
            <button
              onClick={runDatabaseSync}
              disabled={isSyncing}
              className="btn-cta w-full py-3.5 px-4 rounded-2xl text-xs font-black shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSyncing ? 'Syncing to Supabase DB...' : 'Start Supabase DB Sync'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
