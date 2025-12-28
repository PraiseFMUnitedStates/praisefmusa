
import React, { useState, useMemo } from 'react';
/* Fix: Added missing IMAGES import */
import { RAW_SCHEDULE, HOSTS, LOGO_URL, IMAGES } from '../constants';
import { getStationTime, mapToShow, formatTimeToAMPM } from '../utils';
import { PlayIcon } from './Icons';
import { Show, View } from '../types';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface ScheduleViewProps {
  onPlay: () => void;
  currentShowId?: string;
  onToggleReminder?: (show: Show) => void;
  savedShows?: string[];
  onNavigate: (view: View, show?: Show) => void;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ 
  currentShowId, 
  onToggleReminder, 
  savedShows = [],
  onNavigate
}) => {
  const stationTime = getStationTime();
  const [selectedDay, setSelectedDay] = useState(stationTime.getDay());

  const schedule = useMemo(() => {
    const base = RAW_SCHEDULE.filter(item => !item.days || item.days.includes(selectedDay));
    return base.sort((a, b) => a.start.localeCompare(b.start));
  }, [selectedDay]);

  const formatTitle = (title: string) => {
    return title.trim();
  };

  return (
    <div className="bg-white min-h-screen pb-32 animate-fade-in">
      <header className="bg-white pt-12 md:pt-16 pb-8 border-b border-r1-gray">
        <div className="max-w-[1400px] mx-auto px-4 md:px-12">
          <div className="flex items-center gap-4 mb-4">
             <img src={LOGO_URL} alt="Praise FM USA" className="h-6 w-auto" />
             <h2 className="text-[9px] font-normal text-praise-orange tracking-[0.5em] uppercase">Broadcast Services</h2>
          </div>
          <h1 className="text-4xl md:text-6xl font-normal text-black tracking-tighter mb-2 leading-none">
            Weekly <span className="text-gray-200">Guide</span>
          </h1>
          <p className="text-gray-400 text-base md:text-xl font-normal max-w-xl leading-tight">
            Complete daily schedule for the Praise FM USA worship broadcast.
          </p>
        </div>
      </header>

      <div className="sticky top-16 md:top-20 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 flex items-center h-14 md:h-16">
          <div className="flex gap-2 mr-6">
            <button
              onClick={() => onNavigate('home')}
              className="bg-black text-white px-4 py-2 font-normal uppercase text-[9px] tracking-widest flex items-center gap-2 border border-black hover:bg-praise-orange transition-colors"
            >
              Praise FM
            </button>
          </div>
          
          <div className="flex gap-1">
            {DAYS.map((day, idx) => {
              const isSelected = idx === selectedDay;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(idx)}
                  className={`px-3 py-1.5 text-[8px] font-normal uppercase tracking-widest transition-all ${
                    isSelected ? 'bg-praise-orange text-white' : 'text-gray-400 hover:text-black'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-12 mt-8 md:mt-12">
        <div className="space-y-1">
          {schedule.map((item) => {
            const presenter = HOSTS[item.name] || 'Praise FM';
            const showId = item.name + item.start;
            const isLive = selectedDay === stationTime.getDay() && showId === currentShowId;
            const isSaved = savedShows.includes(showId);
            const showObj = mapToShow(item);
            
            return (
              <div 
                key={`${item.name}-${item.start}`} 
                className={`group flex flex-col md:flex-row items-center border-b border-r1-gray py-6 px-4 transition-all ${isLive ? 'bg-r1-gray' : 'hover:bg-gray-50'}`}
              >
                <div className="w-full md:w-48 flex-shrink-0 mb-4 md:mb-0">
                  <span className="text-xl md:text-3xl font-normal text-black tracking-tighter block leading-none mb-1">
                    {formatTimeToAMPM(item.start)}
                  </span>
                  <span className={`text-[8px] font-normal tracking-widest ${isLive ? 'text-praise-orange' : 'text-gray-300'}`}>
                    {isLive ? 'ON AIR NOW' : `UNTIL ${formatTimeToAMPM(item.end)} CT`}
                  </span>
                </div>

                <div className="flex-1 flex flex-col md:flex-row items-center gap-6 w-full">
                  <div 
                    onClick={() => onNavigate('programme-detail', showObj)}
                    className="relative w-20 h-20 md:w-28 md:h-28 flex-shrink-0 cursor-pointer bg-white overflow-hidden border border-gray-100 shadow-sm"
                  >
                    <img 
                      /* Fix: Correctly using IMAGES.default from constants */
                      src={item.img || IMAGES.default} 
                      alt="" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {isLive && (
                      <div className="absolute inset-0 bg-praise-orange/10 flex items-center justify-center">
                         <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-praise-orange shadow-lg">
                            <PlayIcon className="w-4 h-4 ml-0.5 fill-current" />
                         </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                       <span className={`text-[8px] font-normal tracking-[0.3em] ${isLive ? 'text-praise-orange' : 'text-gray-300'}`}>
                          PRAISE FM USA
                       </span>
                    </div>
                    
                    <h3 
                      onClick={() => onNavigate('programme-detail', showObj)}
                      className="text-xl md:text-3xl font-normal text-black mb-1 leading-none hover:text-praise-orange transition-colors cursor-pointer hover:underline"
                    >
                      {formatTitle(item.name)} <span className="text-praise-orange">›</span>
                    </h3>
                    
                    <p className="text-[10px] font-normal text-gray-400 uppercase tracking-tighter mb-3">with {presenter}</p>
                    
                    <p className="text-gray-500 text-xs font-normal leading-relaxed max-w-xl hidden md:line-clamp-2 tracking-tight">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-6 md:mt-0">
                  <button 
                    onClick={() => onToggleReminder?.(showObj)}
                    className={`font-normal text-[8px] tracking-[0.1em] py-2 px-4 transition-all border ${
                      isSaved 
                        ? 'bg-praise-orange border-praise-orange text-white' 
                        : 'bg-transparent border-r1-gray text-black hover:border-black'
                    }`}
                  >
                    {isSaved ? 'Saved' : 'Save to my sounds'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScheduleView;
