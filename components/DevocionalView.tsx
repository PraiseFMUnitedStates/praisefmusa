import React, { useState } from 'react';
import { DAILY_VERSES, LOGO_URL } from '../constants';
import { getStationTime } from '../utils';
import { HeartIcon, HeartFilledIcon } from './Icons';
import { User, Devotional, View } from '../types';

interface DevocionalViewProps {
  user?: User | null;
  onToggleSaveDevotional?: (devotional: Devotional) => void;
  onNavigate?: (view: View) => void;
}

const DevocionalView: React.FC<DevocionalViewProps> = ({ user, onToggleSaveDevotional, onNavigate }) => {
  const stationTime = getStationTime();
  const dayIndex = stationTime.getDay();
  const dailyPassage = DAILY_VERSES[dayIndex];
  
  const [feedback, setFeedback] = useState<string | null>(null);

  const bgImages = [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1600&auto=format&fit=crop',
  ];

  const currentBg = bgImages[dayIndex];
  
  const devotionalObj: Devotional = {
    id: `devotional-${dailyPassage.day}-${stationTime.toDateString()}`,
    day: dailyPassage.day,
    verse: dailyPassage.verse,
    ref: dailyPassage.ref,
    dateSaved: new Date().toISOString()
  };

  const isSaved = user?.savedDevotionals.includes(devotionalObj.id) || false;

  const handleShare = async () => {
    const shareText = `"${dailyPassage.verse}" — ${dailyPassage.ref} (Praise FM USA)`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Praise FM USA Devotional',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(shareText);
      showFeedback('Copied to clipboard!');
    }
  };

  const handleSave = () => {
    if (!user && onNavigate) {
      onNavigate('signin');
      return;
    }
    if (onToggleSaveDevotional) {
      onToggleSaveDevotional(devotionalObj);
      showFeedback(isSaved ? 'Removed from My Sounds' : 'Saved to My Sounds!');
    }
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="bg-white min-h-screen animate-fade-in pb-32">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-black text-white px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest shadow-2xl animate-slide-in-up">
           {feedback}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={currentBg} 
            alt="Devotional Background" 
            className="w-full h-full object-cover scale-110 blur-[2px] opacity-90"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 max-w-[1000px] mx-auto px-6 text-center text-white">
          <span className="block text-praise-orange font-black text-xs md:text-sm uppercase tracking-[0.4em] mb-6">Today's Passage</span>
          
          <blockquote className="mb-10 px-4">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] mb-8 font-serif italic">
              "{dailyPassage.verse}"
            </h1>
            <cite className="not-italic text-2xl md:text-4xl font-bold uppercase tracking-tighter text-praise-orange">
              — {dailyPassage.ref}
            </cite>
          </blockquote>

          <div className="flex justify-center gap-4">
            <div className="w-16 h-1 bg-white/30 rounded-full"></div>
            <div className="w-16 h-1 bg-praise-orange rounded-full"></div>
            <div className="w-16 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="max-w-[1000px] mx-auto px-4 md:px-12 -mt-20 relative z-20">
        <div className="bg-white p-8 md:p-16 shadow-2xl border-b-8 border-black">
          <div className="space-y-8">
            <div className="flex items-center gap-4 border-b-4 border-black pb-4">
              <h3 className="text-3xl font-black uppercase tracking-tighter">Daily Reflection</h3>
              <span className="text-gray-300 font-bold text-xl tracking-widest italic">{dailyPassage.day}</span>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-xl md:text-2xl font-medium text-gray-700 leading-relaxed font-serif italic">
                "Start your day with the strength of the Word. No matter what challenge you face this {dailyPassage.day.toLowerCase()}, 
                remember that there is an eternal promise kept for you. Tune your heart to the frequency of faith on Praise FM USA."
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-8 border-t border-gray-100">
              <button 
                onClick={handleShare}
                className="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-praise-orange transition-all"
              >
                Share Verse
              </button>
              <button 
                onClick={handleSave}
                className={`flex items-center gap-3 border-2 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${
                  isSaved 
                    ? 'bg-praise-orange border-praise-orange text-white' 
                    : 'border-black text-black hover:bg-black hover:text-white'
                }`}
              >
                {isSaved ? <HeartFilledIcon className="w-4 h-4" /> : <HeartIcon className="w-4 h-4" />}
                {isSaved ? 'Saved to My Sounds' : 'Save to My Sounds'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevocionalView;