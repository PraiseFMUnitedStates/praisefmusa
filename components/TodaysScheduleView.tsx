
import React, { useRef, useState, useMemo } from 'react';
import { View, Show } from '../types';
import { getStationTime, formatTimeToAMPM, mapToShow } from '../utils';
import { RAW_SCHEDULE, LOGO_URL } from '../constants';

interface TodaysScheduleViewProps {
  currentShowId?: string;
  onNavigate: (view: View, show?: Show) => void;
}

const getDaySuffix = (day: number) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
};

const TodaysScheduleView: React.FC<TodaysScheduleViewProps> = ({ currentShowId, onNavigate }) => {
  const stationTime = getStationTime();
  const [selectedDateIndex, setSelectedDateIndex] = useState(6); // "Today" is index 6
  
  const dateOptions = useMemo(() => {
    const options = [];
    for (let i = -6; i <= 3; i++) {
      const d = new Date(stationTime);
      d.setDate(d.getDate() + i);
      
      let label = "";
      if (i === -1) label = "Yesterday";
      else if (i === 0) label = "Today";
      else if (i === 1) label = "Tomorrow";
      else {
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNum = d.getDate();
        label = `${dayName} ${dayNum}${getDaySuffix(dayNum)}`;
      }
      
      options.push({ 
        label, 
        dayOfWeek: d.getDay(),
        isToday: i === 0
      });
    }
    return options;
  }, [stationTime]);

  const selectedDayOfWeek = dateOptions[selectedDateIndex].dayOfWeek;
  const isViewingToday = dateOptions[selectedDateIndex].isToday;

  const schedule = useMemo(() => {
    const filtered = RAW_SCHEDULE.filter(p => !p.days || p.days.includes(selectedDayOfWeek));
    filtered.sort((a, b) => a.start.localeCompare(b.start));
    return filtered.map(s => mapToShow(s));
  }, [selectedDayOfWeek]);

  const groups = useMemo(() => {
    const g = {
      early: [] as Show[],
      morning: [] as Show[],
      afternoon: [] as Show[],
      evening: [] as Show[],
    };

    schedule.forEach(show => {
      const startHour = parseInt(show.startTime?.split(':')[0] || '0');
      if (startHour < 6) g.early.push(show);
      else if (startHour < 12) g.morning.push(show);
      else if (startHour < 18) g.afternoon.push(show);
      else g.evening.push(show);
    });

    return g;
  }, [schedule]);

  const sectionRefs = {
    live: useRef<HTMLDivElement>(null),
    early: useRef<HTMLDivElement>(null),
    morning: useRef<HTMLDivElement>(null),
    afternoon: useRef<HTMLDivElement>(null),
    evening: useRef<HTMLDivElement>(null),
  };

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const offset = 140; 
      const elementPosition = ref.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  const renderShowItem = (show: Show, isLive: boolean) => {
    const startTimeFormatted = formatTimeToAMPM(show.startTime);
    const endTimeFormatted = formatTimeToAMPM(show.endTime);
    
    if (isLive && isViewingToday) {
      return (
        <div 
          key={show.id} 
          ref={sectionRefs.live}
          className="bg-[#eef5f5] p-6 md:p-10 mb-4 border-b border-[#dce9e9]"
        >
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-36 flex-shrink-0">
               <img src={LOGO_URL} alt="Praise FM USA" className="h-10 w-auto object-contain mb-3" />
               <div className="text-xl font-normal text-gray-500 mt-1">{startTimeFormatted} CT</div>
            </div>

            <div className="relative w-36 h-36 md:w-44 md:h-44 flex-shrink-0">
               <div className="w-full h-full rounded-full border-[4px] border-praise-orange p-1 bg-white">
                 <img src={show.presenter.image} alt="" className="w-full h-full object-cover rounded-full" />
               </div>
               <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 text-[10px] font-black border border-gray-200 shadow-sm whitespace-nowrap tracking-tighter uppercase">
                  {show.presenter.name}
               </div>
            </div>

            <div className="flex-1">
              <h3 className="text-2xl md:text-5xl font-normal text-black mb-2 leading-none">
                {show.title}
              </h3>
              <p className="text-base font-normal text-gray-500 mb-3 tracking-tighter">Today on Air ({startTimeFormatted} - {endTimeFormatted} CT)</p>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-xl tracking-tight font-serif">{show.description}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div 
        key={show.id} 
        className="group flex flex-col md:flex-row gap-8 items-start py-8 px-4 border-b border-gray-100 transition-colors"
      >
        <div className="w-32 flex-shrink-0 pt-1">
           <span className="text-xl font-normal text-black whitespace-nowrap">{startTimeFormatted} CT</span>
        </div>

        <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 bg-gray-100 relative overflow-hidden shadow-sm">
           <img src={show.image} alt="" className="w-full h-full object-cover" />
           <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-center">
              <span className="text-[10px] text-white font-normal tracking-tight">{show.title}</span>
           </div>
        </div>

        <div className="flex-1 pt-1 text-left">
          <h3 className="text-xl md:text-3xl font-normal text-black mb-1 leading-none">
            {show.title}
          </h3>
          <p className="text-base text-gray-500 mb-3 tracking-tight font-normal">
            with {show.presenter.name}
          </p>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-xl line-clamp-2 mb-4 tracking-tighter font-serif">
            {show.description}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen animate-fade-in pb-32">
      <div className="bg-[#f2f2f2] border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-center h-20 md:h-24">
          <div className="h-10 md:h-14 cursor-pointer hover:scale-105 transition-transform" onClick={() => onNavigate('home')}>
             <img src={LOGO_URL} alt="Praise FM USA" className="h-full w-auto object-contain" />
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-100 sticky top-16 md:top-20 z-30">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center h-16 overflow-x-auto no-scrollbar gap-8">
            <button 
              onClick={() => setSelectedDateIndex(prev => Math.max(0, prev - 1))}
              className="text-black font-normal text-xl px-2 hover:bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center transition-colors"
            >
              ‹
            </button>
            
            <div className="flex-1 flex justify-center gap-8 h-full">
              {dateOptions.map((d, idx) => {
                const isActive = idx === selectedDateIndex;
                return (
                  <button 
                    key={idx}
                    onClick={() => setSelectedDateIndex(idx)}
                    className={`text-sm font-normal whitespace-nowrap px-2 h-full flex items-center relative transition-colors ${
                      isActive ? 'text-black font-bold' : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    {d.label}
                    {isActive && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-praise-orange"></div>}
                  </button>
                );
              })}
            </div>

            <button 
              onClick={() => setSelectedDateIndex(prev => Math.min(dateOptions.length - 1, prev + 1))}
              className="text-black font-normal text-xl px-2 hover:bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center transition-colors"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-6xl font-normal text-black mb-8 tracking-tighter lowercase">Program Schedule</h1>
        
        <div className="flex items-center gap-3 mb-16 text-[10px] font-normal text-black overflow-x-auto no-scrollbar pb-2">
          <span className="text-gray-400 font-normal whitespace-nowrap tracking-widest mr-1 uppercase">Skip to:</span>
          {isViewingToday && (
            <>
              <button onClick={() => scrollTo(sectionRefs.live)} className="hover:text-praise-orange transition-colors tracking-tight whitespace-nowrap px-1 uppercase">LIVE</button>
              <span className="text-gray-200">|</span>
            </>
          )}
          <button onClick={() => scrollTo(sectionRefs.early)} className="hover:text-praise-orange transition-colors tracking-tight whitespace-nowrap px-1 uppercase">Early</button>
          <span className="text-gray-200">|</span>
          <button onClick={() => scrollTo(sectionRefs.morning)} className="hover:text-praise-orange transition-colors tracking-tight whitespace-nowrap px-1 uppercase">Morning</button>
          <span className="text-gray-200">|</span>
          <button onClick={() => scrollTo(sectionRefs.afternoon)} className="hover:text-praise-orange transition-colors tracking-tight whitespace-nowrap px-1 uppercase">Afternoon</button>
          <span className="text-gray-200">|</span>
          <button onClick={() => scrollTo(sectionRefs.evening)} className="hover:text-praise-orange transition-colors tracking-tight whitespace-nowrap px-1 uppercase">Evening</button>
        </div>

        <div className="space-y-16">
          {isViewingToday && schedule.find(s => s.id === currentShowId) && (
            <div>
               {renderShowItem(schedule.find(s => s.id === currentShowId)!, true)}
            </div>
          )}

          <div ref={sectionRefs.early}>
            <h2 className="text-2xl md:text-3xl font-normal text-black mb-8 tracking-tight border-b border-gray-100 pb-3 lowercase">Early</h2>
            {groups.early.length > 0 ? (
              groups.early.map(s => renderShowItem(s, s.id === currentShowId))
            ) : (
              <p className="text-gray-400 text-sm tracking-widest font-normal">No programs scheduled for this period.</p>
            )}
          </div>

          <div ref={sectionRefs.morning}>
            <h2 className="text-2xl md:text-3xl font-normal text-black mb-8 tracking-tight border-b border-gray-100 pb-3 lowercase">Morning</h2>
            {groups.morning.length > 0 ? (
              groups.morning.map(s => renderShowItem(s, s.id === currentShowId))
            ) : (
              <p className="text-gray-400 text-sm tracking-widest font-normal">No programs scheduled for this period.</p>
            )}
          </div>

          <div ref={sectionRefs.afternoon}>
            <h2 className="text-2xl md:text-3xl font-normal text-black mb-8 tracking-tight border-b border-gray-100 pb-3 lowercase">Afternoon</h2>
            {groups.afternoon.length > 0 ? (
              groups.afternoon.map(s => renderShowItem(s, s.id === currentShowId))
            ) : (
              <p className="text-gray-400 text-sm tracking-widest font-normal">No programs scheduled for this period.</p>
            )}
          </div>

          <div ref={sectionRefs.evening}>
            <h2 className="text-2xl md:text-3xl font-normal text-black mb-8 tracking-tight border-b border-gray-100 pb-3 lowercase">Evening</h2>
            {groups.evening.length > 0 ? (
              groups.evening.map(s => renderShowItem(s, s.id === currentShowId))
            ) : (
              <p className="text-gray-400 text-sm tracking-widest font-normal">No programs scheduled for this period.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodaysScheduleView;
