
import React, { useState, useEffect, useRef } from 'react';
import { Show, View } from '../types';
import { getTodaysSchedule, calculateShowProgress, formatTimeToAMPM } from '../utils';
import { LOGO_URL } from '../constants';

interface ListenLiveGridProps {
  currentShow: Show | null;
  onNavigate: (view: View) => void;
  onPlay: () => void;
  isPlaying: boolean;
  onSelectShow: (show: Show) => void;
}

const ListenLiveGrid: React.FC<ListenLiveGridProps> = ({ onNavigate }) => {
  const [schedule, setSchedule] = useState<Show[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const todaysSchedule = getTodaysSchedule();
    setSchedule(todaysSchedule);

    setTimeout(() => {
      if (scrollContainerRef.current) {
        const liveIndex = todaysSchedule.findIndex(show => {
          const p = calculateShowProgress(show.startTime || '', show.endTime || '');
          return p > 0 && p < 100;
        });

        if (liveIndex !== -1) {
          const container = scrollContainerRef.current;
          const cards = container.querySelectorAll('.program-card-wrapper');
          const liveCard = cards[liveIndex] as HTMLElement;
          
          if (liveCard) {
            const containerWidth = container.offsetWidth;
            const cardOffset = liveCard.offsetLeft;
            const cardWidth = liveCard.offsetWidth;
            
            const targetScroll = cardOffset - (containerWidth / 2) + (cardWidth / 2);
            container.scrollTo({ left: targetScroll, behavior: 'smooth' });
          }
        }
      }
    }, 600);
  }, []);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      setTimeout(checkScroll, 100);
    }
    return () => {
      container?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [schedule]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardWidth = 320;
      const scrollAmount = direction === 'left' ? -cardWidth * 2 : cardWidth * 2;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white py-24 md:py-32 border-t border-r1-gray overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-4">
               <img src={LOGO_URL} alt="Praise FM USA" className="h-6 w-auto" />
               <h2 className="text-xs font-bold text-praise-orange tracking-[0.5em] uppercase">Guide</h2>
            </div>
            <h3 className="text-5xl md:text-8xl font-black text-black tracking-tighter uppercase leading-none">Broadcast Schedule</h3>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-4 mr-6">
              <button 
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`w-14 h-14 rounded-full border-2 border-black flex items-center justify-center transition-all ${canScrollLeft ? 'bg-white text-black hover:bg-black hover:text-white' : 'opacity-20 cursor-not-allowed border-gray-200 text-gray-200'}`}
              >
                <span className="text-3xl leading-none">‹</span>
              </button>
              <button 
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`w-14 h-14 rounded-full border-2 border-black flex items-center justify-center transition-all ${canScrollRight ? 'bg-white text-black hover:bg-black hover:text-white' : 'opacity-20 cursor-not-allowed border-gray-200 text-gray-200'}`}
              >
                <span className="text-3xl leading-none">›</span>
              </button>
            </div>
            <button 
              onClick={() => onNavigate('todays-schedule')}
              className="self-start md:self-auto text-sm font-black text-black hover:text-praise-orange transition-colors uppercase tracking-widest border-b-4 border-black hover:border-praise-orange pb-3"
            >
              Full Schedule
            </button>
          </div>
        </header>

        <div 
          ref={scrollContainerRef}
          className="flex gap-10 md:gap-14 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-12 -mx-4 px-4 md:mx-0 md:px-0"
          style={{ scrollBehavior: 'smooth' }}
        >
          {schedule.map((show) => (
            <div key={show.id} className="program-card-wrapper flex-shrink-0 w-[300px] md:w-[360px] snap-center">
              <ProgramCard show={show} onSelect={() => {}} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProgramCard: React.FC<{ show: Show, onSelect: () => void }> = ({ show, onSelect }) => {
  const [progress, setProgress] = useState(0);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const checkLiveStatus = () => {
      if (show.startTime && show.endTime) {
        const p = calculateShowProgress(show.startTime, show.endTime);
        setProgress(p);
        setIsLive(p > 0 && p < 100);
      }
    };
    checkLiveStatus();
    const timer = setInterval(checkLiveStatus, 1000);
    return () => clearInterval(timer);
  }, [show.startTime, show.endTime]);

  const size = 320;
  const strokeWidth = 10;
  const radius = (size / 2) - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const formatTitle = (title: string) => {
    const cleaned = title.replace(/ ›$/, '').trim();
    if (!cleaned) return "";
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
  };

  return (
    <div className="group cursor-pointer animate-fade-in flex flex-col items-center text-center" onClick={onSelect}>
      <div className="relative w-full aspect-square max-w-[320px] flex items-center justify-center mb-10">
        <svg className="absolute inset-0 w-full h-full -rotate-90 transform z-10 pointer-events-none" viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size/2} cy={size/2} r={radius} fill="transparent" stroke="#f2f2f2" strokeWidth={strokeWidth} />
          {isLive && (
            <circle
              cx={size/2} cy={size/2} r={radius} fill="transparent" stroke="#f54900" strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          )}
        </svg>

        <div className={`w-[88%] h-[88%] rounded-full overflow-hidden relative z-0 bg-white border border-r1-gray shadow-xl transition-all duration-500 ${!isLive ? 'grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100' : 'group-hover:scale-105'}`}>
          <img src={show.presenter.image} className="w-full h-full object-cover" alt={show.title} />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <span className={`text-xs font-bold uppercase tracking-[0.3em] ${isLive ? 'text-praise-orange' : 'text-gray-400'}`}>
            {isLive ? 'ON AIR NOW' : 'UP NEXT'}
        </span>
        <div className="w-2.5 h-2.5 rounded-full bg-r1-gray"></div>
        <span className="text-xs font-bold text-black uppercase tracking-widest">{formatTimeToAMPM(show.startTime)} CT</span>
      </div>

      <h3 className="text-4xl sw-program-title l:sw-justify-self-start leading-none mb-4 truncate w-full font-bold">
        {formatTitle(show.title)}
      </h3>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
        with {show.presenter.name}
      </p>
    </div>
  );
};

export default ListenLiveGrid;
