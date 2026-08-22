import React from 'react';
import { Compass, Sparkles, MapPin, Calendar, DollarSign, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PublicLandingProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onSignup: () => void;
}

export const PublicLanding: React.FC<PublicLandingProps> = ({ onGetStarted, onLogin, onSignup }) => {
  const { user } = useAuth();

  const features = [
    {
      icon: MapPin,
      title: 'Multi-City Route Planner',
      desc: 'Effortlessly map out multi-destination travel itineraries, reorder city stops, and manage arrival/departure dates.',
      color: 'text-[#007A87] dark:text-[#00E5FF]',
      bg: 'bg-[#007A87]/10 dark:bg-[#00E5FF]/10',
    },
    {
      icon: Calendar,
      title: 'Day-by-Day Daily Flow',
      desc: 'Organize activities into daily scheduled time slots with categorized tags (Sightseeing, Food, Adventure, Stay).',
      color: 'text-[#FF5A5F] dark:text-[#FF7A00]',
      bg: 'bg-[#FF5A5F]/10 dark:bg-[#FF7A00]/10',
    },
    {
      icon: DollarSign,
      title: 'Automated Budget Intelligence',
      desc: 'Set trip target budgets, estimate daily spend averages, view Recharts visual breakdowns, and get over-budget alerts.',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: Users,
      title: 'Public Sharing & Cloning',
      desc: 'Generate unique share codes, publish read-only itinerary links, and allow fellow travelers to copy trips in 1-click.',
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-500/10',
    },
  ];

  const highlights = [
    'AI-powered destination cost index recommendations',
    'Offline local-storage resilience & Supabase cloud sync',
    'Interactive day selector ribbon & printable itinerary summaries',
    'Curated catalog of top worldwide cities & activities',
  ];

  return (
    <div className="w-full space-y-20 pb-24 animate-fade-in">
      
      {/* Top Public Header Bar */}
      <header className="flex items-center justify-between py-6 border-b border-theme">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#007A87] via-[#00E5FF] to-[#FF7A00] flex items-center justify-center shadow-lg">
            <Compass className="w-5 h-5 text-white dark:text-slate-950 animate-pulse" />
          </div>
          <span className="text-2xl font-black font-header tracking-tight text-theme-main">
            GlobeTrotter
          </span>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={onGetStarted}
              className="btn-cta px-6 py-2.5 rounded-2xl text-xs font-black shadow-lg"
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={onLogin}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold text-theme-main hover:bg-theme-subtle border border-theme transition-colors"
              >
                Log In
              </button>
              <button
                onClick={onSignup}
                className="btn-cta px-5 py-2.5 rounded-2xl text-xs font-black shadow-md cursor-pointer"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Showcase Section */}
      <section className="relative glass-panel rounded-3xl p-8 sm:p-16 border border-theme overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=80"
          alt="GlobeTrotter Travel Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-50 filter brightness-90 scale-105"
        />

        <div className="relative z-20 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00E5FF]/20 backdrop-blur-md text-[#00E5FF] border border-[#00E5FF]/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Empowering Personalized Travel Planning</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white font-header tracking-tight leading-tight">
            Transform How You Dream, Design & Experience Travel.
          </h1>

          <p className="text-slate-200 text-base sm:text-lg leading-relaxed font-medium">
            GlobeTrotter simplifies the complexity of planning multi-city journeys. Explore global destinations, structure daily itineraries, calculate budget costs, and share trips within a vibrant travel community.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={onSignup}
              className="btn-cta flex items-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-black shadow-2xl active:scale-95 cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onLogin}
              className="px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md border border-white/20 transition-all"
            >
              Sign In to Account
            </button>
          </div>
        </div>
      </section>

      {/* Core Platform Features */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-black text-theme-main font-header">Everything You Need for End-to-End Travel</h2>
          <p className="text-xs text-theme-muted">Combining flexibility, interactivity, and intelligence for modern travelers.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="glass-card rounded-3xl p-6 border border-theme space-y-4 shadow-xl bg-theme-card"
              >
                <div className={`w-12 h-12 rounded-2xl ${feat.bg} ${feat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-theme-main font-header">{feat.title}</h3>
                <p className="text-xs text-theme-muted leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why GlobeTrotter Section */}
      <section className="glass-panel rounded-3xl p-8 sm:p-12 border border-theme bg-theme-card grid grid-cols-1 lg:grid-cols-2 gap-8 items-center shadow-xl">
        <div className="space-y-6">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#007A87]/15 dark:bg-[#00E5FF]/15 text-[#007A87] dark:text-[#00E5FF] uppercase tracking-wider">
            Why Travelers Choose Us
          </span>
          <h2 className="text-3xl font-black text-theme-main font-header">
            Built for Stress-Free, Cost-Effective Adventures.
          </h2>
          <p className="text-xs text-theme-muted leading-relaxed">
            Planning multi-city travel often involves messy spreadsheets, scattered notes, and hidden costs. GlobeTrotter brings everything into one unified, beautiful dashboard.
          </p>

          <div className="space-y-3 pt-2">
            {highlights.map((item) => (
              <div key={item} className="flex items-center gap-3 text-xs font-semibold text-theme-main">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              onClick={onSignup}
              className="btn-cta px-7 py-3.5 rounded-2xl text-xs font-black shadow-xl cursor-pointer"
            >
              Start Planning Your Trip Now
            </button>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-2xl h-80">
          <img
            src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80"
            alt="Travel Highlights"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
            <div className="text-white space-y-1">
              <span className="text-xs font-bold text-[#00E5FF]">Community Favorite</span>
              <h4 className="text-lg font-bold font-header">Explore 50+ Global Destinations</h4>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="text-center space-y-6 py-10">
        <h2 className="text-3xl font-black text-theme-main font-header">Ready to Design Your Next Expedition?</h2>
        <p className="text-xs text-theme-muted max-w-md mx-auto">Create a free account to unlock multi-city itineraries and budget tools.</p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onSignup}
            className="btn-cta px-8 py-4 rounded-2xl text-sm font-black shadow-2xl cursor-pointer"
          >
            Create Account
          </button>
        </div>
      </section>

    </div>
  );
};
