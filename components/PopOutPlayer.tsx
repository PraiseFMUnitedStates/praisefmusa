
import React from 'react';
import { Show, Track } from '../types';
import { PlayIcon, PauseIcon, MenuIcon, SpeakerIcon } from './Icons';
import { getTodaysSchedule, formatTimeToAMPM } from '../utils';
import { LOGO_URL } from '../constants';

interface PopOutPlayerProps {
  show: Show;
  isPlaying: boolean;
  onPlay: () => void;
  nowPlaying: Track | null;
}

const PopOutPlayer: React.FC<PopOutPlayerProps> = ({ show, isPlaying, onPlay, nowPlaying }) => {
  const schedule = getTodaysSchedule();

  return (
    <div className="bg-[#121212] min-h-screen text-white font-sans flex flex-col">
      {/* 1. Popout Header */}
      <header className="bg-white text-black h-12 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
           <MenuIcon className="w-5 h-5" />
           <img src={LOGO_URL} alt="Praise FM USA" className="h-4 w-auto object-contain" />
        </div>
        <div className="flex items-center">
           <span className="text-[10px] font-bold uppercase mr-1">Search</span>
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
           </svg>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* 2. Immersive Live Section */}
        <section className="pt-10 pb-6 px-6 flex flex-col items-center text-center">
          <div className="relative w-56 h-56 mb-8 flex items-center justify-center">
             <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
             {/* Progress ring */}
             <svg className="absolute inset-0 w-full h-full -rotate-90 z-10">
                <circle
                  cx="112" cy="112" r="108"
                  fill="transparent"
                  stroke="#f54900"
                  strokeWidth="4"
                  strokeDasharray="678"
                  strokeDashoffset={678 - (678 * (show.progress || 0) / 100)}
                  className="transition-all duration-1000"
                />
             </svg>
             <div className="w-[92%] h-[92%] rounded-full overflow-hidden border-2 border-white/20">
                <img src={show.presenter.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20"></div>
             </div>
             
             {/* Logo proeminente no lugar do '1' circular */}
             <div className="absolute z-20 w-16 h-10 bg-white p-2 rounded shadow-2xl border-2 border-zinc-100 select-none translate-x-[72px] translate-y-[72px] flex items-center justify-center">
                <img src={LOGO_URL} className="w-full h-auto object-contain" />
             </div>
             
             {/* Live indicator */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="bg-black/40 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border border-white/10 flex items-center gap-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-praise-orange animate-pulse"></span>
                   LIVE
                </div>
             </div>
          </div>

          <p className="text-praise-orange text-[10px] font-bold uppercase tracking-widest mb-1">{formatTimeToAMPM(show.startTime)} - {formatTimeToAMPM(show.endTime)}</p>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">On Air</h2>
          <h1 className="text-2xl font-bold leading-tight mb-4 px-4 uppercase tracking-tighter">{show.title}</h1>
          
          <p className="text-gray-400 text-sm mb-6">with {show.presenter.name}</p>

          <button className="text-[10px] font-bold text-white/50 hover:text-white uppercase tracking-widest underline underline-offset-4">
             View Full Schedule
          </button>
        </section>

        {/* 3. Information Bar */}
        <div className="bg-white/5 border-y border-white/5 p-4 flex items-center gap-3 mx-4 rounded-xl">
           <div className="w-10 h-10 bg-black flex-shrink-0">
              <img src={show.image} alt="" className="w-full h-full object-cover" />
           </div>
           <div className="flex-1 min-w-0">
              <p className="text-[8px] font-bold text-praise-orange uppercase">Broadcast</p>
              <h3 className="text-xs font-bold truncate uppercase">{show.title}</h3>
              <p className="text-[10px] text-gray-400 truncate">Praise FM USA • Live</p>
           </div>
        </div>

        {/* 4. Schedule List */}
        <div className="mt-8 px-6 pb-32">
           <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Praise FM Schedule</h4>
           <div className="space-y-4">
              {schedule.map((item, idx) => (
                <div key={idx} className="flex gap-4 group cursor-pointer border-b border-white/5 pb-4">
                   <span className="text-xs font-bold text-gray-500 w-20">{formatTimeToAMPM(item.startTime)}</span>
                   <div className="flex-1">
                      <h5 className="text-xs font-bold group-hover:text-praise-orange transition-colors uppercase">{item.title}</h5>
                      <p className="text-[10px] text-gray-500">with {item.presenter.name}</p>
                   </div>
                   <span className="text-gray-700 font-bold">›</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* 5. Footer Controls */}
      <footer className="bg-black/80 backdrop-blur-xl border-t border-white/5 p-6 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-10 h-6 bg-white flex items-center justify-center p-1 rounded">
               <img src={LOGO_URL} className="w-full h-auto object-contain" />
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] font-bold leading-none uppercase tracking-tighter">{show.title}</span>
               <span className="text-[8px] text-gray-500 uppercase tracking-widest mt-0.5">Live Now</span>
            </div>
         </div>

         <div className="flex items-center gap-6">
            <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-praise-orange hover:text-white transition-all shadow-lg" onClick={onPlay}>
              {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6 ml-0.5" />}
            </button>
         </div>
      </footer>
    </div>
  );
};

export default PopOutPlayer;
