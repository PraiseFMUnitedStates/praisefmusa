
import React from 'react';
import { Show, View, Track } from '../types';
import { PodcastIcon, PlayIcon, PauseIcon } from './Icons';
import { IMAGES, LOGO_URL } from '../constants';
import { formatRange } from '../utils';

interface LiveDetailViewProps {
  show: Show;
  nowPlaying: Track | null;
  recentTracks: Track[];
  upcomingTracks?: Track[];
  favorites?: string[];
  onToggleFavorite?: (track: Track) => void;
  nextShows: Show[];
  onPlay: () => void;
  isPlaying: boolean;
  onNavigate: (view: View) => void;
  onPopOut?: () => void;
}

const LiveDetailView: React.FC<LiveDetailViewProps> = ({ 
  show, 
  onPlay, 
  isPlaying, 
  onNavigate
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = IMAGES.default;
  };

  const cleanTitle = (t: string) => t.replace(/ ›$/, '').trim();

  return (
    <div className="bg-white min-h-screen animate-fade-in">
      <div className="bg-zinc-900 text-white py-5 px-4 text-center border-b border-white/10">
        <p className="text-sm md:text-base font-normal mb-1">
          Stay connected with Praise FM USA through our official app and web player.
        </p>
        <button className="text-sm text-praise-orange hover:underline font-bold">
          Learn how to listen everywhere
        </button>
      </div>

      <div className="bg-[#121212] text-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-16 md:py-32">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
            
            <div className="flex-1 order-2 md:order-1 text-center md:text-left">
              <h1 className="text-5xl md:text-8xl font-medium tracking-tighter mb-8 uppercase leading-none">
                {cleanTitle(show.title)}
              </h1>
              <p className="text-gray-400 text-2xl md:text-4xl font-normal mb-10 max-w-2xl leading-tight tracking-tighter">
                {show.description}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4 text-gray-500 text-base mb-12 uppercase tracking-widest font-normal">
                <img src={LOGO_URL} alt="Praise FM USA" className="h-4 w-auto brightness-0 invert" />
                <span>•</span>
                <span>{formatRange(show.startTime || '', show.endTime || '')}</span>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-8">
                <button 
                  onClick={() => onNavigate('signin')}
                  className="flex items-center gap-4 border-2 border-white/40 px-10 py-4 hover:bg-praise-orange hover:border-praise-orange hover:text-white transition-all group rounded-none"
                >
                  <PodcastIcon className="w-6 h-6" />
                  <span className="text-sm font-medium uppercase tracking-[0.2em]">Subscribe</span>
                </button>
                <button 
                  onClick={onPlay}
                  className="w-24 h-24 bg-white hover:bg-praise-orange text-black hover:text-white rounded-full flex items-center justify-center transition-all shadow-xl active:scale-90"
                >
                  {isPlaying ? (
                    <PauseIcon className="w-10 h-10 fill-current" />
                  ) : (
                    <PlayIcon className="w-10 h-10 fill-current ml-1.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex-1 order-1 md:order-2 w-full max-w-[600px]">
              <div className="relative aspect-square overflow-hidden bg-zinc-900 shadow-2xl border-4 border-zinc-800">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(245,73,0,0.4),transparent)]"></div>
                
                <img 
                  src={show.image} 
                  alt={show.title} 
                  className="w-full h-full object-cover relative z-10"
                  onError={handleImageError}
                />

                <div className="absolute bottom-10 right-10 z-20 text-right">
                   <div className="flex items-center gap-3 justify-end mb-3">
                      <img src={LOGO_URL} className="h-8 w-auto brightness-0 invert" alt="" />
                   </div>
                   <h3 className="text-white font-medium text-5xl md:text-7xl uppercase tracking-tighter leading-none">
                      {cleanTitle(show.title).split(' ').pop()}
                   </h3>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-16">
        <div className="pt-8 border-t border-gray-100 flex justify-between items-center">
             <div className="flex flex-col">
                <span className="text-praise-orange text-[10px] font-normal uppercase tracking-[0.4em] mb-2">Broadcasting Now</span>
                <h3 className="text-2xl md:text-4xl font-normal uppercase tracking-tighter text-black">Enjoy the sounds of Praise FM USA</h3>
             </div>
             <button 
                onClick={() => onNavigate('todays-schedule')} 
                className="text-[10px] font-normal uppercase tracking-[0.4em] text-gray-400 hover:text-praise-orange transition-colors border-b border-transparent hover:border-praise-orange pb-1"
              >
                Full Schedule
              </button>
        </div>
      </div>
    </div>
  );
};

export default LiveDetailView;
