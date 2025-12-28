import React, { useState, useEffect } from 'react';
import { User, View } from '../types';
import { FavoriteSongsList } from './FavoriteSongsList';
import { SavedShowsList } from './SavedShowsList';
import { SavedDevotionalsList } from './SavedDevotionalsList';

interface MySoundsViewProps {
  user: User | null;
  onNavigate: (view: View) => void;
}

type TabType = 'tracks' | 'shows' | 'devotionals';

const MySoundsView: React.FC<MySoundsViewProps> = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<TabType>('tracks');

  // Reseta para a primeira tab quando o usuário fizer login/logout
  useEffect(() => {
    if (!user) {
      setActiveTab('tracks');
    }
  }, [user]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: 'tracks', label: 'Favorite Tracks' },
    { id: 'shows', label: 'Saved Programs' },
    { id: 'devotionals', label: 'Saved Devotionals' },
  ];

  return (
    <div className="bg-white min-h-screen font-sans animate-fade-in">
      {/* Hero Section - Alinhado à nova marca */}
      <div className="bg-gradient-to-r from-zinc-900 to-black relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-16 md:py-24 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            My Sounds
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-lg">
            Everything you've favorited and saved across Praise FM USA.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-zinc-900 sticky top-16 md:top-24 z-30 overflow-x-auto no-scrollbar">
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              disabled={!user}
              className={`py-4 text-sm font-bold uppercase tracking-widest transition-all border-b-4 flex-shrink-0 disabled:cursor-not-allowed disabled:opacity-50 ${
                activeTab === tab.id
                  ? 'border-praise-orange text-white'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
              aria-label={`Switch to ${tab.label}`}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-16">
        {!user ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <div className="max-w-md mx-auto">
              <svg
                className="w-20 h-20 mx-auto mb-6 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-black mb-4">
                Sign in to see your sounds
              </h2>
              <p className="text-gray-600 mb-6">
                Access your favorite tracks, saved programs, and devotionals all in one place.
              </p>
              <button
                onClick={() => onNavigate('signin')}
                className="bg-praise-orange text-white px-8 py-3 font-bold rounded-md hover:bg-black transition-colors inline-flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Sign In
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            {activeTab === 'tracks' && <FavoriteSongsList userId={user.id} />}
            {activeTab === 'shows' && <SavedShowsList userId={user.id} />}
            {activeTab === 'devotionals' && <SavedDevotionalsList userId={user.id} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySoundsView;