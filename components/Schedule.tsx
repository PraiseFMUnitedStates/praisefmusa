
import React from 'react';
import { getTodaysSchedule, formatTimeToAMPM } from '../utils';
import { Show, View } from '../types';
import { HeartIcon, HeartFilledIcon } from './Icons';
import { LOGO_URL } from '../constants';

interface ScheduleProps {
  currentShowId: string;
  onNavigate: (view: View, show?: Show) => void;
  onToggleReminder?: (show: Show) => void;
  savedShows?: string[];
}

const Schedule: React.FC<ScheduleProps> = ({ currentShowId, onNavigate, onToggleReminder, savedShows = [] }) => {
  const schedule = getTodaysSchedule();

  return (
    <section id="schedule" className="bg-white py-16 md:py-24 border-t border-r1-gray relative">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div className="max-w-xl">
            {/* BRANDING: Praise FM USA Oficial */}
            <div 
              className="mb-6 h-8 md:h-12 flex items-center cursor-pointer group"
              onClick={() => onNavigate('home')}
            >
               <img src={LOGO_URL} alt="Praise FM USA" className="h-full w-auto object-contain transition-transform group-hover:scale-105" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-black tracking-tighter uppercase leading-none">
              Daily Schedule
            </h2>
          </div>
          <button 
            onClick={() => onNavigate('todays-schedule')}
            className="inline-flex items-center gap-3 self-start md:self-auto text-black text-xs font-black uppercase tracking-[0.2em] border-b-2 border-black hover:border-praise-orange hover:text-praise-orange transition-all py-2"
          >
            Full Weekly View
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
          {schedule.slice(0, 12).map((show) => {
            const isCurrent = show.id === currentShowId;
            const isSaved = savedShows.includes(show.id);
            return (
              <div 
                key={show.id} 
                className="group flex flex-col h-full cursor-pointer animate-fade-in"
                onClick={() => onNavigate('programme-detail', show)}
              >
                <div className="relative aspect-square overflow-hidden bg-r1-gray mb-4 shadow-sm border border-transparent group-hover:border-black transition-all duration-300">
                  <img 
                    src={show.presenter.image} 
                    alt={show.presenter.name}
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
                  />
                  
                  {isCurrent && (
                     <div className="absolute top-2 left-2 z-10">
                        <span className="bg-praise-orange text-white text-[8px] font-bold px-2 py-1 uppercase tracking-[0.1em] shadow-lg flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-white animate-pulse"></span>
                          ON AIR
                        </span>
                     </div>
                  )}

                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onToggleReminder?.(show); }}
                      className="p-2 bg-white text-black shadow-lg"
                    >
                      {isSaved ? <HeartFilledIcon className="w-4 h-4 text-praise-orange" /> : <HeartIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className={`text-[9px] font-black uppercase tracking-[0.1em] ${isCurrent ? 'text-praise-orange' : 'text-gray-400'}`}>
                        {formatTimeToAMPM(show.startTime)}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-r1-gray"></div>
                    <span className="text-[9px] font-black text-black uppercase tracking-widest">Guide</span>
                  </div>
                  
                  <h3 className="text-sm md:text-base leading-tight mb-1 font-bold uppercase tracking-tight group-hover:underline">
                    {show.title} <span className="text-praise-orange ml-0.5">›</span>
                  </h3>
                  
                  <p className="text-[9px] font-normal text-gray-400 uppercase tracking-widest mb-2">
                    with {show.presenter.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Schedule;
