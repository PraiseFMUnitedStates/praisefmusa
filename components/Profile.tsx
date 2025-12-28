
import React from 'react';
import { User, View } from '../types';
import { FavoriteSongsList } from './FavoriteSongsList';
import { LOGO_URL } from '../constants';

interface ProfileProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (view: View) => void;
  onAvatarUpdate: (url: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout, onNavigate }) => {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Sub-navigation bar */}
      <div className="bg-white border-b border-gray-100 hidden md:block">
        <div className="max-w-[1400px] mx-auto px-4 md:px-12">
          <div className="flex items-center gap-8 h-12">
            <div 
              className="flex items-center cursor-pointer group mr-4 h-5"
              onClick={() => onNavigate('home')}
            >
              <img 
                src={LOGO_URL} 
                alt="Praise FM USA" 
                className="h-full w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors text-sm font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
              Home
            </button>
            <button onClick={() => onNavigate('music')} className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors text-sm font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
              Music
            </button>
            <button className="flex items-center gap-2 text-praise-orange border-b-2 border-praise-orange h-full text-sm font-bold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z"/></svg>
              My Sounds
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section - Background alterado para combinar com o novo logo */}
      <div className="bg-gradient-to-br from-black to-zinc-900 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-16 md:py-32 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            
            <div className="flex-1 text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight max-w-md leading-tight">
                All your favourite Praise FM sounds in one place
              </h1>
              
              {!user ? (
                <div className="flex flex-wrap items-center gap-4">
                  <button 
                    onClick={() => onNavigate('signin')}
                    className="bg-praise-orange hover:bg-black text-white px-8 py-3 font-bold text-sm flex items-center gap-2 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    Sign in
                  </button>
                  <span className="text-white text-sm">or 
                    <button onClick={() => onNavigate('signin')} className="ml-1 text-praise-orange hover:underline font-bold">Register</button>
                  </span>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <p className="text-white text-xl font-medium">Welcome back, {user.name || user.email}</p>
                  <button 
                    onClick={onLogout}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-2 text-sm font-bold w-fit transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 w-full flex justify-center md:justify-end">
              <div className="relative flex gap-4 md:gap-8 items-end">
                <div className="w-48 h-64 md:w-64 md:h-80 bg-zinc-800 shadow-2xl overflow-hidden transform -rotate-2">
                  <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800" className="w-full h-full object-cover opacity-60" alt="" />
                </div>
                <div className="w-56 h-72 md:w-72 md:h-96 bg-zinc-800 shadow-2xl overflow-hidden relative z-10 translate-y-4">
                  <img src="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800" className="w-full h-full object-cover opacity-80" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_70%_50%,rgba(0,0,0,0.4),transparent)]"></div>
      </div>

      {user && (
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-24">
          <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-8">
            <h2 className="text-4xl font-bold tracking-tight text-black uppercase tracking-tighter">Your Activity</h2>
            <div className="flex gap-4">
              <span className="px-4 py-1.5 bg-praise-orange text-white text-[10px] font-bold uppercase rounded-full tracking-widest">Bookmarks</span>
            </div>
          </div>
          
          <div className="animate-fade-in">
             <FavoriteSongsList userId={user.id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
