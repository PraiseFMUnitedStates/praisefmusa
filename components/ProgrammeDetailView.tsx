
import React, { useMemo, useState, useEffect } from 'react';
import { Show, View, Track, User } from '../types';
import { SpeakerIcon } from './Icons';
import { formatTimeToAMPM, getStationTime, isShowCurrentlyOnAir } from '../utils';
import { HOSTS_DATA, MUSIC_BY_GENRE, ON_DEMAND_EPISODES, LOGO_URL } from '../constants';

interface ProgrammeDetailViewProps {
  show: Show;
  onPlay: () => void;
  isPlaying: boolean;
  onNavigate: (view: View, show?: Show) => void;
  onPlayTrack: (track: Track) => void;
  activeTrackId?: string;
  onToggleFavorite?: (track: Track) => void;
  favorites?: string[];
  user?: User | null;
}

const ProgrammeDetailView: React.FC<ProgrammeDetailViewProps> = ({ 
  show, onPlay, isPlaying, onNavigate, onPlayTrack, activeTrackId, onToggleFavorite, favorites = [], user 
}) => {
  const [currentTime, setCurrentTime] = useState(getStationTime());

  // Atualiza o tempo interno para checagem de "ao vivo" a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getStationTime());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const isActuallyLive = useMemo(() => isShowCurrentlyOnAir(show), [show, currentTime]);

  const hostBio = useMemo(() => {
    return HOSTS_DATA[show.title]?.bio || "A signature Praise FM USA program delivering the finest worship hits to your ears.";
  }, [show.title]);

  const episodes = useMemo(() => {
    const title = show.title.toLowerCase();
    return ON_DEMAND_EPISODES.filter(ep => {
      const epTitle = ep.title.toLowerCase();
      if (title.includes('classics')) return epTitle.includes('classics');
      if (title.includes('pop')) return epTitle.includes('pop');
      return epTitle.includes(title) || ep.artist.toLowerCase().includes(show.presenter.name.toLowerCase());
    });
  }, [show.title, show.presenter.name]);

  return (
    <div className="bg-black min-h-screen text-white font-sans animate-fade-in pb-24">
      {/* Header Estilo Praise FM USA */}
      <div className="max-w-[1200px] mx-auto px-4 py-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div 
            className="flex items-center cursor-pointer h-8 md:h-12"
            onClick={() => onNavigate('home')}
          >
            <img 
              src={LOGO_URL} 
              alt="Praise FM USA" 
              className="h-full w-auto object-contain brightness-0 invert" 
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-medium leading-none tracking-tight uppercase border-l border-white/20 pl-6">
            {show.title}
          </h1>
        </div>
        
        <button 
          onClick={() => onNavigate('todays-schedule')}
          className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white hover:text-praise-orange hover:border-praise-orange transition-all pb-1"
        >
          Daily Schedule
        </button>
      </div>

      {/* Sub Navigation */}
      <div className="bg-[#1a1a1a] border-y border-white/5">
        <div className="max-w-[1200px] mx-auto px-4 flex gap-6 h-12 items-center">
          <button onClick={() => onNavigate('home')} className="text-praise-orange font-bold text-sm hover:underline uppercase tracking-tighter">Home</button>
          <button className="text-white/70 font-bold text-sm hover:underline uppercase tracking-tighter">Episodes</button>
          <button onClick={() => onNavigate('todays-schedule')} className="md:hidden text-white/70 font-bold text-sm uppercase tracking-tighter">Schedule</button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-0 shadow-2xl">
          
          <div className="flex-1 bg-[#323232]">
            <div className="relative aspect-video lg:aspect-auto lg:h-[450px] overflow-hidden bg-black">
               <img src={show.image} alt="" className="w-full h-full object-cover opacity-80" />
               
               {/* Botão LISTEN LIVE - CONDICIONAL AO HORÁRIO */}
               <div className="absolute bottom-0 left-0">
                  {isActuallyLive ? (
                    <button 
                      onClick={onPlay}
                      className="bg-[#2d2220] hover:bg-praise-orange transition-colors flex items-center gap-3 px-8 py-5"
                    >
                      <SpeakerIcon className="w-7 h-7 text-white" />
                      <span className="font-normal text-xl lowercase tracking-tight">
                        {isPlaying && !activeTrackId ? 'pause' : 'listen live'}
                      </span>
                    </button>
                  ) : (
                    <div className="bg-[#1a1a1a] flex items-center gap-3 px-8 py-5 opacity-80 border-t border-r border-white/10">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" /></svg>
                      <span className="font-bold text-sm uppercase tracking-widest text-gray-400">
                        on air at {formatTimeToAMPM(show.startTime)}
                      </span>
                    </div>
                  )}
               </div>
            </div>

            <div className="p-8 md:p-10">
               <h2 className="text-2xl md:text-3xl font-bold mb-4 uppercase tracking-tighter">{show.title}</h2>
               
               <div className="mb-10">
                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-praise-orange mb-3">Host Spotlight</h4>
                 <p className="text-white text-lg md:text-xl font-normal leading-relaxed tracking-tight">
                    {hostBio}
                 </p>
               </div>

               <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" /></svg>
                  <span>Scheduled Session: {show.timeSlot}</span>
               </div>
               
               <p className="text-xs text-gray-500 font-normal">
                 Produced for Praise FM USA.
               </p>
            </div>
          </div>

          {/* Coluna Direita: Sidebar */}
          <div className="w-full lg:w-[320px] bg-[#212121]">
            <div className="p-6 border-b border-white/5">
               <h3 className="text-lg font-bold mb-4 uppercase tracking-tight">On air</h3>
               <div className="flex gap-4">
                  <div className="w-16 h-12 bg-black flex flex-col items-center justify-center rounded-sm flex-shrink-0 border border-white/5">
                    <img 
                      src={LOGO_URL} 
                      alt="" 
                      className="h-4 w-auto object-contain brightness-0 invert opacity-50" 
                    />
                  </div>
                  <div>
                    <span className="block text-gray-400 text-xs font-normal mb-1">Weekly Session</span>
                    <span className="text-2xl font-bold block leading-none mb-1">{formatTimeToAMPM(show.startTime)}</span>
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">PRAISE FM</span>
                  </div>
               </div>
            </div>

            <div className="p-6">
               <h3 className="text-lg font-bold mb-6 uppercase tracking-tight">Episodes</h3>
               <div className="space-y-6">
                  {episodes.length > 0 ? (
                    episodes.map((ep, i) => {
                      const isCurrentEp = activeTrackId === ep.id;
                      return (
                        <div 
                          key={ep.id} 
                          className={`flex items-start gap-4 cursor-pointer group transition-all ${!isCurrentEp && i > 0 ? 'opacity-60 hover:opacity-100' : ''}`} 
                          onClick={() => onPlayTrack(ep)}
                        >
                          <div className={`w-1.5 h-16 transition-colors ${isCurrentEp ? 'bg-praise-orange' : 'bg-[#424242] group-hover:bg-praise-orange'}`}></div>
                          <div className="min-w-0">
                            <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                              {isCurrentEp ? 'PLAYING NOW' : (i === 0 ? 'LATEST' : 'PREVIOUS')}
                            </span>
                            <h4 className={`font-bold text-sm group-hover:underline line-clamp-2 uppercase ${isCurrentEp ? 'text-praise-orange' : 'text-white'}`}>
                              {ep.title}
                            </h4>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-gray-500 italic">No archive available.</p>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgrammeDetailView;
