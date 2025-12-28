
import React, { useEffect, useRef, useState } from 'react';
import { PlayerState } from '../types';
import { 
  PlayIcon, PauseIcon, VolumeMuteIcon, VolumeLowIcon, VolumeHighIcon, 
  RewindStartIcon, Rewind20Icon, Forward20Icon, ForwardLiveIcon, PlaylistIcon 
} from './Icons';
import { STREAM_URL, IMAGES, LOGO_URL } from '../constants';

interface PlayerProps {
  playerState: PlayerState;
  onTogglePlay: () => void;
  onVolumeChange?: (volume: number) => void;
  onOpenDrawer?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

const Player: React.FC<PlayerProps> = ({ playerState, onTogglePlay, onVolumeChange, onOpenDrawer, onNext, onPrev }) => {
  const { isPlaying, currentShow, volume, activeUrl, activeTrack } = playerState;
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isVolumeHovered, setIsVolumeHovered] = useState(false);
  const [isMobileVolumeOpen, setIsMobileVolumeOpen] = useState(false);

  const displayTitle = activeTrack ? activeTrack.title : (currentShow?.title || "Praise FM USA");
  const displaySubtitle = activeTrack ? activeTrack.artist : (currentShow?.presenter?.name ? `with ${currentShow.presenter.name}` : "Live Worship");
  const displayImage = activeTrack ? activeTrack.image : (currentShow?.image || IMAGES.default);
  
  const isLive = !activeTrack;
  const progress = isLive 
    ? (currentShow?.progress || 0) 
    : (isFinite(duration) && duration > 0 ? (currentTime / duration) * 100 : 0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const targetUrl = activeUrl || STREAM_URL;
    
    if (audio.src !== targetUrl) {
      audio.pause();
      audio.src = targetUrl;
      audio.load();
      if (isPlaying) {
        audio.play().catch(e => console.warn("Playback error after load:", e));
      }
    } else {
      if (isPlaying) {
        audio.play().catch(e => console.warn("Playback error:", e));
      } else {
        audio.pause();
      }
    }
  }, [isPlaying, activeUrl]);

  const handleTimeUpdate = () => {
    if (audioRef.current && !isLive) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && !isLive) {
      const d = audioRef.current.duration;
      setDuration(isFinite(d) ? d : 0);
    }
  };

  const handleEnded = () => {
    if (activeTrack && onNext) {
      onNext();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLive || !isFinite(duration) || duration <= 0) return;
    const newPercentage = parseFloat(e.target.value);
    const newTime = (newPercentage / 100) * duration;
    
    if (audioRef.current && isFinite(newTime)) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skipTime = (seconds: number) => {
    if (isLive || !audioRef.current || !isFinite(duration) || duration <= 0) return;
    const newTime = audioRef.current.currentTime + seconds;
    if (isFinite(newTime)) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, newTime));
    }
  };

  const restartTrack = () => {
    if (isLive || !audioRef.current) return;
    audioRef.current.currentTime = 0;
  };

  const renderVolumeIcon = (sizeClass: string = "w-5 h-5") => {
    if (volume === 0) return <VolumeMuteIcon className={sizeClass} />;
    if (volume < 0.5) return <VolumeLowIcon className={sizeClass} />;
    return <VolumeHighIcon className={sizeClass} />;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] safe-area-inset-bottom">
      <audio 
        ref={audioRef} 
        onEnded={handleEnded} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      
      {/* Miniplayer Mobile */}
      <div className="md:hidden flex items-center justify-between px-5 py-3 bg-white border-t border-gray-200 shadow-[0_-8px_30px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-3 min-w-0 max-w-[40%]">
          <div className="w-10 h-10 flex-shrink-0 bg-gray-50 border border-gray-100">
             <img src={displayImage} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="min-w-0">
             <h4 className="text-[10px] font-black text-black truncate uppercase tracking-tighter leading-none">{displayTitle}</h4>
             <p className="text-[8px] text-gray-400 truncate uppercase mt-0.5">{displaySubtitle}</p>
          </div>
        </div>

        <div className="flex-shrink-0">
          <button 
            onClick={onTogglePlay} 
            className="w-12 h-12 bg-praise-orange text-white flex items-center justify-center rounded-full shadow-md active:scale-90 transition-transform"
          >
            {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6 ml-0.5" />}
          </button>
        </div>

        <div className="flex items-center gap-2">
           <button 
            onClick={() => setIsMobileVolumeOpen(!isMobileVolumeOpen)} 
            className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full transition-colors ${isMobileVolumeOpen ? 'text-praise-orange bg-praise-orange/5' : 'text-black'}`}
          >
            {renderVolumeIcon("w-6 h-6")}
          </button>
          
          {isMobileVolumeOpen && (
            <div className="absolute bottom-full left-0 right-0 p-4 bg-white border-t border-gray-100 animate-slide-in-up">
              <div className="flex-1 bg-gray-50 rounded-full flex items-center px-4 h-10">
                  <input 
                    type="range" 
                    min="0" max="1" step="0.01" 
                    value={volume} 
                    onChange={(e) => onVolumeChange?.(parseFloat(e.target.value))} 
                    className="w-full h-1 bg-gray-200 appearance-none rounded-full accent-praise-orange cursor-pointer" 
                  />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Player */}
      <div className="hidden md:block bg-white text-black border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1600px] mx-auto px-12 pt-4">
           {/* BARRA PROGRESSIVA */}
           <div className="relative flex items-center h-8">
              <div className="w-full h-[4px] bg-gray-100 relative rounded-full">
                  <div 
                    className="h-full bg-praise-orange rounded-full relative transition-all duration-150" 
                    style={{ width: `${progress}%` }}
                  >
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-praise-orange rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.1)] border-2 border-white z-10"></div>
                  </div>
                  
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={progress}
                    onChange={handleSeek}
                    className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 ${isLive ? 'pointer-events-none' : ''}`}
                  />
              </div>
              <div className="ml-5 flex items-center gap-2 text-praise-orange">
                 <div className="relative w-4 h-4 flex items-center justify-center">
                    <div className={`absolute inset-0 border-[1.5px] border-current rounded-full ${isPlaying ? 'animate-ping' : 'opacity-30'}`}></div>
                    <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                 </div>
                 <span className="text-[11px] font-black tracking-tighter uppercase">{isLive ? 'LIVE' : 'REC'}</span>
              </div>
           </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-12 h-20 flex items-center justify-between gap-4 pb-2">
          <div className="flex-1 flex items-center gap-4 min-w-0">
             <div className="relative flex-shrink-0">
                <div className="w-14 h-14 bg-gray-50 flex items-center justify-center group cursor-pointer overflow-hidden rounded border border-gray-100 shadow-sm">
                   <img src={displayImage} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                </div>
             </div>
             <div className="min-w-0 text-left">
               <h4 className="text-[14px] font-black text-black truncate uppercase tracking-tighter leading-none mb-1">
                  {displayTitle}
               </h4>
               <p className="text-[11px] font-normal text-gray-500 uppercase tracking-widest truncate leading-none">
                  {displaySubtitle}
               </p>
             </div>
          </div>

          <div className="flex items-center gap-6 justify-center flex-1">
             <button 
               onClick={restartTrack}
               className={`${isLive ? 'text-gray-200 cursor-not-allowed' : 'text-black hover:text-praise-orange'} transition-all active:scale-95`}
               disabled={isLive}
             >
                <RewindStartIcon className="w-10 h-10" />
             </button>
             <button 
               onClick={() => skipTime(-20)}
               className={`${isLive ? 'text-gray-200 cursor-not-allowed' : 'text-black hover:text-praise-orange'} transition-all active:scale-95`}
               disabled={isLive}
             >
                <Rewind20Icon className="w-10 h-10" />
             </button>
             
             <button 
                onClick={onTogglePlay} 
                className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center hover:bg-praise-orange transition-all shadow-md active:scale-90"
             >
               {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8 ml-1" />}
             </button>

             <button 
               onClick={() => skipTime(20)}
               className={`${isLive ? 'text-gray-200 cursor-not-allowed' : 'text-black hover:text-praise-orange'} transition-all active:scale-95`}
               disabled={isLive}
             >
                <Forward20Icon className="w-10 h-10" />
             </button>
             <button className="text-gray-100 cursor-not-allowed">
                <ForwardLiveIcon className="w-10 h-10" />
             </button>
          </div>

          <div className="flex-1 flex items-center justify-end gap-6">
             <div className="flex items-center gap-5 mr-4 border-r border-gray-100 pr-6">
               <button className="text-black hover:text-praise-orange transition-colors">
                 <PlaylistIcon className="w-6 h-6" />
               </button>
               <span className="text-[13px] font-black text-praise-orange cursor-pointer hover:text-black transition-colors">1x</span>
             </div>

             <div className="relative flex items-center group/volume" onMouseEnter={() => setIsVolumeHovered(true)} onMouseLeave={() => setIsVolumeHovered(false)}>
                <div className={`flex items-center transition-all duration-500 ${isVolumeHovered ? 'w-48' : 'w-10'}`}>
                  <div className={`flex-1 transition-all duration-500 overflow-hidden flex items-center ${isVolumeHovered ? 'max-w-[160px] opacity-100 mr-4' : 'max-w-0 opacity-0 mr-0'}`}>
                    <input 
                      type="range" 
                      min="0" max="1" step="0.01" 
                      value={volume} 
                      onChange={(e) => onVolumeChange?.(parseFloat(e.target.value))} 
                      className="w-full h-[3px] bg-gray-100 appearance-none rounded-full accent-praise-orange cursor-pointer" 
                    />
                  </div>
                  <button 
                    onClick={() => onVolumeChange?.(volume === 0 ? 0.8 : 0)} 
                    className="text-black hover:text-praise-orange transition-colors"
                  >
                    {renderVolumeIcon()}
                  </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
