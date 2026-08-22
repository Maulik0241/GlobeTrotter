import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, SlidersHorizontal, Sparkles, Check, Heart, MapPin, DollarSign, Share2 } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import confetti from 'canvas-confetti';

interface SharedItineraryProps {
  setCurrentTab: (tab: string) => void;
}

export const SharedItinerary: React.FC<SharedItineraryProps> = ({ setCurrentTab }) => {
  const { currentTrip, copyTripToUser } = useTrips();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'date' | 'name'>('popular');

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [forkedId, setForkedId] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<{ [id: string]: boolean }>({});

  const communityPosts = [
    {
      id: 'post-1',
      user_name: 'Alex Traveler',
      user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      user_handle: '@alex_globetrotter',
      time_ago: '2 days ago',
      title: '10 Days Grand Alpine & Parisian Escape',
      city_name: 'Paris & Swiss Alps',
      image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      experience_text: 'Had an unbelievable journey wandering through Montmartre cafés and paragliding past the Matterhorn. The daily cost breakdown helped us stay under our $2,500 target budget!',
      likes_count: 142,
      budget: 2500,
      days: 10,
    },
    {
      id: 'post-2',
      user_name: 'Sophia Chen',
      user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      user_handle: '@sophia_travels',
      time_ago: '4 days ago',
      title: 'Tokyo & Kyoto Cultural Culinary Expedition',
      city_name: 'Tokyo & Kyoto',
      image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      experience_text: 'From early morning Tsukiji market sushi tours to tranquil bamboo grove walks in Arashiyama, this itinerary covered every top spot in Kansai with detailed time windows.',
      likes_count: 98,
      budget: 3200,
      days: 7,
    },
    {
      id: 'post-3',
      user_name: 'Marcus Vance',
      user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      user_handle: '@marcus_v',
      time_ago: '1 week ago',
      title: 'Amalfi Coast & Rome Archaeological Wonder',
      city_name: 'Rome & Amalfi',
      image_url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
      experience_text: 'Exploring the Colosseum underground chambers followed by sunset coastal drives in Positano. Highly recommended for couples looking for adventure and romance!',
      likes_count: 215,
      budget: 2800,
      days: 8,
    },
  ];

  const filteredPosts = communityPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.experience_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.city_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleCopyLink = (postId: string) => {
    const url = `${window.location.origin}/#post=${postId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(postId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleForkTrip = (post: any) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    if (currentTrip) {
      copyTripToUser(currentTrip);
    }
    setForkedId(post.id);
    setTimeout(() => {
      setForkedId(null);
      setCurrentTab('itinerary-builder');
    }, 1500);
  };

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <div className="w-full space-y-8 pb-24 animate-fade-in relative">
      
      {/* 1. Page Title & Explanatory Subtitle Box (Screen 10 Wireframe Match) */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-theme-main font-header tracking-tight">
            Community tab
          </h1>
        </div>

        {/* Explanatory Banner Box matching Screen 10 Wireframe Right Box */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-theme shadow-xl bg-theme-card space-y-2">
          <p className="text-xs sm:text-sm text-theme-main leading-relaxed font-medium">
            Community section where all the users can share their experience about a certain trip or activity. 
            Using the search, groupby or filter and sortby option, the user can narrow down the result that he is looking for...
          </p>
        </div>
      </div>

      {/* 2. Search & Controls Bar: [ Search bar ... | Group by | Filter | Sort by... ] (Screen 10 Mockup) */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-theme shadow-xl flex flex-col lg:flex-row items-center justify-between gap-4 w-full bg-theme-card">
        {/* Search Bar */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-theme-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search bar ..."
            className="w-full pl-11 pr-4 py-2.5 bg-theme-subtle border border-theme rounded-2xl text-theme-main placeholder:text-theme-muted text-xs focus:outline-none focus:border-[#007A87] dark:focus:border-[#00E5FF]"
          />
        </div>

        {/* Action Controls: Group by | Filter | Sort by */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
          <div className="flex items-center gap-2 bg-theme-subtle p-1.5 rounded-2xl border border-theme">
            <Filter className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF] ml-2" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="bg-transparent text-theme-main text-xs font-bold focus:outline-none pr-2 cursor-pointer"
            >
              <option value="All" className="bg-theme-card">Group by: All Experiences</option>
              <option value="Europe" className="bg-theme-card">Group by: Europe</option>
              <option value="Asia" className="bg-theme-card">Group by: Asia</option>
              <option value="America" className="bg-theme-card">Group by: Americas</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-theme-subtle p-1.5 rounded-2xl border border-theme">
            <ArrowUpDown className="w-4 h-4 text-[#FF5A5F] dark:text-[#FF7A00] ml-2" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent text-theme-main text-xs font-bold focus:outline-none pr-2 cursor-pointer"
            >
              <option value="popular" className="bg-theme-card">Sort by: Most Liked</option>
              <option value="date" className="bg-theme-card">Sort by: Recent</option>
              <option value="name" className="bg-theme-card">Sort by: Title</option>
            </select>
          </div>

          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-theme-subtle hover:brightness-95 border border-theme text-xs font-bold text-theme-main">
            <SlidersHorizontal className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF]" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* 3. Community Feed Posts (Screen 10 Wireframe Match: Left Avatar Circle + Right Experience Box) */}
      <div className="space-y-8 w-full">
        {filteredPosts.map((post) => {
          const isLiked = likedPosts[post.id];
          const isForked = forkedId === post.id;
          const isCopied = copiedId === post.id;

          return (
            <div key={post.id} className="flex flex-col sm:flex-row items-start gap-6 w-full group">
              
              {/* Left Circle User Avatar ◯ (Screen 10 Wireframe Match) */}
              <div className="flex flex-col items-center shrink-0">
                <img
                  src={post.user_avatar}
                  alt={post.user_name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ring-2 ring-[#007A87]/30 dark:ring-[#00E5FF]/30 shadow-lg"
                />
              </div>

              {/* Right Experience Post Card (Screen 10 Wireframe Match) */}
              <div className="flex-1 glass-card rounded-3xl p-6 sm:p-8 border border-theme bg-theme-card shadow-xl hover:shadow-2xl transition-all duration-300 space-y-4 w-full">
                
                {/* Header: User name, handle & date */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-theme pb-4">
                  <div>
                    <h3 className="text-lg font-black text-theme-main font-header flex items-center gap-2">
                      <span>{post.user_name}</span>
                      <span className="text-xs font-normal text-theme-muted">{post.user_handle}</span>
                    </h3>
                    <span className="text-[11px] text-theme-muted">{post.time_ago}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isLiked
                          ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                          : 'bg-theme-subtle text-theme-muted hover:text-rose-500 border border-theme'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{post.likes_count + (isLiked ? 1 : 0)}</span>
                    </button>
                  </div>
                </div>

                {/* Experience Title & Text */}
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-theme-main font-header group-hover:text-[#007A87] dark:group-hover:text-[#00E5FF] transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-theme-muted leading-relaxed">
                    "{post.experience_text}"
                  </p>
                </div>

                {/* Cover Image & Metadata Row */}
                <div className="relative h-60 rounded-2xl overflow-hidden shadow-lg">
                  <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between text-xs text-white">
                    <span className="flex items-center gap-1 font-bold">
                      <MapPin className="w-4 h-4 text-[#00E5FF]" />
                      {post.city_name} • {post.days} Days
                    </span>
                    <span className="flex items-center gap-1 font-bold text-emerald-400">
                      <DollarSign className="w-4 h-4" />
                      Budget: ${post.budget}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions: Copy / Fork Trip & Share */}
                <div className="pt-3 border-t border-theme flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => handleCopyLink(post.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-theme-subtle hover:brightness-95 text-theme-main text-xs font-bold border border-theme transition-colors cursor-pointer"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-[#007A87] dark:text-[#00E5FF]" />}
                    <span>{isCopied ? 'Link Copied!' : 'Share Link'}</span>
                  </button>

                  <button
                    onClick={() => handleForkTrip(post)}
                    className="btn-cta flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black shadow-lg cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 stroke-[2.5]" />
                    <span>{isForked ? 'Copied to My Account!' : 'Fork & Copy Itinerary'}</span>
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
