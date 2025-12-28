import React, { useState } from 'react';
import { HomeIcon, MusicIcon, BibleIcon, LibraryIcon } from './Icons';
import { User, View } from '../types';

const LOGO_URL = 'https://res.cloudinary.com/dtecypmsh/image/upload/v1766869698/SVGUSA_lduiui.webp';

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
  onNavigate: (view: View) => void;
  currentView: View;
}

const Header: React.FC<HeaderProps> = ({ user, onLoginClick, onNavigate, currentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent, view: View) => {
    e.preventDefault();
    onNavigate(view);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-[70] shadow-sm bg-white">
      {/* Main Header Bar */}
      <div className="text-black h-16 md:h-20 border-b border-gray-100 flex items-center">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 w-full flex items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <div 
              className="flex items-center cursor-pointer group h-10 md:h-12"
              onClick={() => onNavigate('home')}
            >
              <img 
                src={LOGO_URL} 
                alt="Praise FM USA" 
                className="h-full w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>

            <nav className="hidden lg:flex items-center gap-1 h-full">
              {[
                { id: 'home', label: 'Home', icon: <HomeIcon className="w-5 h-5" /> },
                { id: 'music', label: 'Music', icon: <MusicIcon className="w-5 h-5" /> },
                { id: 'devocional', label: 'Devotional', icon: <BibleIcon className="w-5 h-5" /> },
                { id: 'my-sounds', label: 'My Sounds', icon: <LibraryIcon className="w-5 h-5" /> },
              ].map((link) => {
                const isActive = currentView === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={(e) => handleNavClick(e, link.id as View)}
                    className={`flex items-center gap-3 px-5 h-16 md:h-20 relative transition-all group ${
                      isActive ? 'text-praise-orange' : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    <span className={`${isActive ? 'text-praise-orange' : 'text-gray-400 group-hover:text-black'} transition-colors`}>
                      {link.icon}
                    </span>
                    <span className={`text-[15px] font-bold ${isActive ? '' : 'font-medium'}`}>
                      {link.label}
                    </span>
                    {isActive && <div className="absolute bottom-0 left-0 right-0 h-1 bg-praise-orange"></div>}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <div className="relative hidden xl:block">
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-gray-100 border-none text-sm px-10 py-2 w-48 rounded-full focus:w-64 transition-all focus:bg-white focus:ring-2 focus:ring-praise-orange/20 outline-none"
              />
              <svg className="w-4 h-4 absolute left-4 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>

            <div className="hidden md:block">
              {user ? (
                <button 
                  onClick={() => onNavigate('profile')} 
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 rounded-lg group"
                >
                  <div className="w-8 h-8 rounded-full bg-praise-orange/10 flex items-center justify-center overflow-hidden border border-praise-orange/20">
                    {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <span className="text-praise-orange font-bold text-sm">{user.name?.charAt(0)}</span>}
                  </div>
                  <span className="text-sm font-bold text-gray-700 group-hover:text-black">{user.name || 'Account'}</span>
                </button>
              ) : (
                <button 
                  onClick={onLoginClick} 
                  className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-bold rounded-full hover:bg-praise-orange transition-all active:scale-95"
                >
                  Sign in
                </button>
              )}
            </div>

            <button className="lg:hidden p-2 text-black" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[64px] bg-white z-[80] animate-fade-in flex flex-col p-6 overflow-y-auto">
           <div className="flex flex-col gap-2">
              {[
                { id: 'home', label: 'Home', icon: <HomeIcon className="w-6 h-6" /> },
                { id: 'music', label: 'Music', icon: <MusicIcon className="w-6 h-6" /> },
                { id: 'devocional', label: 'Devotional', icon: <BibleIcon className="w-6 h-6" /> },
                { id: 'my-sounds', label: 'My Sounds', icon: <LibraryIcon className="w-6 h-6" /> },
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={(e) => handleNavClick(e, link.id as View)}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    currentView === link.id ? 'bg-praise-orange text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 active:bg-gray-100'
                  }`}
                >
                  <span className={currentView === link.id ? 'text-white' : 'text-gray-400'}>{link.icon}</span>
                  <span className="font-bold text-lg">{link.label}</span>
                </button>
              ))}
           </div>
        </div>
      )}
    </header>
  );
};

export default Header;