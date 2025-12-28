
import React, { useState, useEffect } from 'react';
import { Show, View } from '../types';
import { PlayIcon, PauseIcon } from './Icons';
import { IMAGES, LOGO_URL } from '../constants';
import { formatTimeToAMPM } from '../utils';

interface HeroProps {
  show: Show;
  nextShows: (Show | null)[];
  onPlay: () => void;
  isPlaying: boolean;
  onNavigate?: (view: View, show?: Show) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  isLiveTrack?: boolean;
}

const Hero: React.FC<HeroProps> = ({ show, nextShows, onPlay, isPlaying, onNavigate, isLiveTrack = true }) => {
  const [localExpanded, setLocalExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const progress = show.progress || 0;
  
  // Tamanhos responsivos
  const containerSize = isMobile ? 160 : 220; 
  const imageSize = isMobile ? 140 : 190;    
  const strokeWidth = isMobile ? 4 : 5;
  
  const radius = (imageSize / 2) - (strokeWidth / 2);
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  
  const isNoCover = !show.presenter.image || show.presenter.image === IMAGES.default;

  const next1 = nextShows[0];
  const next2 = nextShows[1];

  const handleNextClick = (nextShow: Show | null) => {
    if (nextShow && onNavigate) {
      onNavigate('programme-detail', nextShow);
    }
  };

  const handlePresenterClick = () => {
    if (onNavigate) {
      onNavigate('presenter-detail', show);
    }
  };

  return (
    <div className="bg-white pt-8 pb-4 border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 md:px-12">
        
        {/* LOGO HERO: Esquerda no PC, Centro no Mobile */}
        <div className="mb-10 flex items-center justify-center md:justify-start h-10 md:h-16">
             <img 
              src={LOGO_URL} 
              alt="Praise FM USA" 
              className="h-full w-auto object-contain cursor-pointer transition-transform hover:scale-105"
              onClick={() => onNavigate?.('home')}
             />
        </div>

        {/* CONTEÚDO PRINCIPAL: Esquerda no PC, Centro no Mobile */}
        <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-8 md:gap-12 mb-12">
            
            {/* ANEL PROGRESSIVO: Menor no Mobile */}
            <div className="relative flex items-center justify-center flex-shrink-0">
                <div 
                  className={`relative flex-shrink-0 flex items-center justify-center transition-all duration-500 shadow-sm rounded-full ${isNoCover ? 'bg-[#121212]' : 'bg-[#f3f3f3]'}`} 
                  style={{ width: containerSize, height: containerSize }}
                >
                    <div 
                      className={`relative z-10 rounded-full overflow-hidden border-[3px] border-white shadow-md transition-all duration-500 cursor-pointer hover:scale-105 active:scale-95 group ${isNoCover ? 'bg-[#1a1a1a]' : 'bg-white'}`}
                      style={{ width: imageSize, height: imageSize }}
                      onClick={handlePresenterClick}
                    >
                        {!isNoCover && (
                          <img 
                            src={show.presenter.image} 
                            alt={show.presenter.name} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                          />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    </div>

                    <svg 
                      className="absolute z-20 -rotate-90 transform pointer-events-none transition-all" 
                      style={{ width: imageSize, height: imageSize }}
                      viewBox={`0 0 ${imageSize} ${imageSize}`}
                    >
                      <circle
                        cx={imageSize/2} cy={imageSize/2} r={radius}
                        fill="transparent"
                        stroke="#f2f2f2"
                        strokeWidth={strokeWidth}
                      />
                      <circle
                        cx={imageSize/2} cy={imageSize/2} r={radius}
                        fill="transparent"
                        stroke="#f54900"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        style={{ 
                          strokeDashoffset: isLiveTrack ? offset : circumference, 
                          transition: 'stroke-dashoffset 1s linear' 
                        }}
                        strokeLinecap="round"
                      />
                    </svg>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                     <span className="font-black text-[10px] md:text-[11px] text-praise-orange uppercase tracking-[0.2em] animate-pulse">
                        LIVE NOW
                     </span>
                     <span className="text-gray-300 text-[10px]">•</span>
                     <span className="text-gray-500 font-bold text-[10px] md:text-[11px] tracking-tight uppercase">
                        {formatTimeToAMPM(show.startTime)} - {formatTimeToAMPM(show.endTime)} CT
                     </span>
                </div>
                
                <h2 className="text-3xl md:text-7xl sw-program-title mb-2 font-black uppercase tracking-tighter leading-none cursor-pointer hover:text-praise-orange transition-colors" onClick={() => onNavigate?.('programme-detail', show)}>
                    {show.title} <span className="text-praise-orange ml-1">›</span>
                </h2>
                
                <p className="text-gray-400 font-medium text-lg md:text-3xl mb-8 md:mb-10 tracking-tighter uppercase italic cursor-pointer hover:text-black transition-colors" onClick={handlePresenterClick}>
                    with {show.presenter.name}
                </p>

                <div className="flex items-center justify-center md:justify-start">
                  <button 
                    onClick={onPlay}
                    className="h-14 md:h-18 px-10 md:px-12 bg-praise-orange hover:bg-black text-white flex items-center gap-4 md:gap-6 transition-all active:scale-95 group font-black shadow-2xl rounded-full"
                  >
                      {isPlaying ? (
                        <>
                          <PauseIcon className="w-6 h-6 md:w-8 md:h-8 fill-current" />
                          <span className="text-xl md:text-2xl uppercase tracking-tighter">Pause</span>
                        </>
                      ) : (
                        <>
                          <PlayIcon className="w-6 h-6 md:w-8 md:h-8 fill-current" />
                          <span className="text-xl md:text-2xl uppercase tracking-tighter">Listen Live</span>
                        </>
                      )}
                  </button>
                </div>
            </div>
        </div>

        {localExpanded && (
          <div className="border-t border-gray-100 pt-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {next1 && (
                <div 
                  className="flex gap-5 cursor-pointer group/next"
                  onClick={() => handleNextClick(next1)}
                >
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-100 flex-shrink-0 overflow-hidden shadow-sm">
                    <img src={next1.image} alt="" className="w-full h-full object-cover transition-transform group-hover/next:scale-110" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-praise-orange text-[10px] font-black uppercase tracking-[0.15em]">UP NEXT:</span>
                      <span className="text-gray-400 text-[10px] font-bold uppercase">{formatTimeToAMPM(next1.startTime)} - {formatTimeToAMPM(next1.endTime)} CT</span>
                    </div>
                    <h3 className="text-lg md:text-2xl font-black text-black leading-none mb-1 group-hover/next:text-praise-orange transition-colors uppercase tracking-tight truncate">
                      {next1.title} <span className="text-praise-orange ml-1">›</span>
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 font-medium line-clamp-2 leading-snug">{next1.description}</p>
                  </div>
                </div>
              )}

              {next2 && (
                <div 
                  className="flex gap-5 cursor-pointer group/next"
                  onClick={() => handleNextClick(next2)}
                >
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-100 flex-shrink-0 relative overflow-hidden shadow-sm">
                    <img src={next2.image} alt="" className="w-full h-full object-cover transition-transform group-hover/next:scale-110" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-1">
                      <span className="text-gray-400 text-[10px] font-bold uppercase">{formatTimeToAMPM(next2.startTime)} - {formatTimeToAMPM(next2.endTime)} CT</span>
                    </div>
                    <h3 className="text-lg md:text-2xl font-black text-black leading-none mb-1 group-hover/next:text-praise-orange transition-colors uppercase tracking-tight truncate">
                      {next2.title} <span className="text-praise-orange ml-1">›</span>
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 font-medium line-clamp-2 leading-snug">{next2.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-10 flex justify-center md:justify-start">
          <button 
            onClick={() => setLocalExpanded(!localExpanded)}
            className="flex items-center gap-2 text-black font-black text-xs uppercase tracking-widest hover:text-praise-orange transition-colors bg-gray-50 px-6 py-2 rounded-full border border-gray-100"
          >
            {localExpanded ? 'Show less' : 'Upcoming schedule'}
            <svg className={`w-3 h-3 transition-transform ${localExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
