
import React from 'react';
import { Show } from '../types';
import { PlayIcon } from './Icons';

interface ContinueListeningProps {
  shows: Show[];
  onPlay: (show: Show) => void;
}

const ContinueListening: React.FC<ContinueListeningProps> = ({ shows, onPlay }) => {
  if (shows.length === 0) return null;

  return (
    <section className="max-w-[1600px] mx-auto px-4 md:px-12 py-16 border-t border-gray-50">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-black">Continue Listening</h2>
        <button className="text-sm font-bold text-gray-400 hover:text-black transition-colors">
          View all history ›
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {shows.map((show) => (
          <div 
            key={show.id} 
            className="group flex flex-col cursor-pointer"
            onClick={() => onPlay(show)}
          >
            {/* Card Image Wrapper */}
            <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden mb-4 shadow-sm">
              <img 
                src={show.image} 
                alt={show.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <div className="w-12 h-12 rounded-full bg-praise-orange text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                  <PlayIcon className="w-6 h-6 ml-0.5 fill-current" />
                </div>
              </div>

              {/* BBC Style Station Badge */}
              <div className="absolute top-0 left-0 bg-black text-white px-2 py-0.5 text-[10px] font-bold tracking-tighter">
                PRAISE 1
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                <div 
                  className="h-full bg-praise-orange shadow-[0_0_8px_rgba(245,73,0,0.8)]" 
                  style={{ width: `${show.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Meta Data */}
            <div className="flex flex-col">
              <h3 className="text-base font-bold text-black leading-tight group-hover:text-praise-orange transition-colors truncate uppercase">
                {show.title}
              </h3>
              <p className="text-xs text-gray-500 font-normal mt-1">
                with {show.presenter.name}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  EPISODE • {show.timeSlot.split(' ')[0]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContinueListening;
