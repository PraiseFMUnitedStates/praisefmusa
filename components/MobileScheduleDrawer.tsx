
import React from 'react';
import { Show, View } from '../types';
import { CloseIcon, PlayIcon, PauseIcon, VolumeMuteIcon, VolumeLowIcon, VolumeHighIcon } from './Icons';
import { getTodaysSchedule, formatTimeToAMPM } from '../utils';

interface MobileScheduleDrawerProps {
  currentShow: Show | null;
  isPlaying: boolean;
  volume: number;
  onTogglePlay: () => void;
  onVolumeChange: (volume: number) => void;
  onClose: () => void;
  onNavigate: (view: View, show?: Show) => void;
}

const MobileScheduleDrawer: React.FC<MobileScheduleDrawerProps> = ({ 
  currentShow, 
  isPlaying, 
  volume,
  onTogglePlay, 
  onVolumeChange,
  onClose,
  onNavigate
}) => {
  const schedule = getTodaysSchedule();

  const renderVolumeIcon = () => {
    if (volume === 0) return <VolumeMuteIcon className="w-6 h-6" />;
    if (volume < 0.5) return <VolumeLowIcon className="w-6 h-6" />;
    return <VolumeHighIcon className="w-6 h-6" />;
  };

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col animate-slide-in-up">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-bold text-black uppercase tracking-tight">Schedule</h2>
        <button onClick={onClose} className="p-1">
          <CloseIcon className="w-6 h-6 text-black" />
        </button>
      </header>

      {/* Schedule List */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        <div className="divide-y divide-gray-100">
          {schedule.map((show, idx) => {
            const isCurrent = currentShow?.id === show.id;
            return (
              <div 
                key={show.id} 
                className={`flex items-start gap-4 p-5 ${isCurrent ? 'bg-[#f8f9fa]' : 'active:bg-gray-50'}`}
                onClick={() => { onNavigate('live-detail', show); onClose(); }}
              >
                <div className="w-14 h-14 flex-shrink-0 bg-gray-100 relative overflow-hidden">
                  <img src={show.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-bold text-black leading-tight mb-0.5 truncate uppercase tracking-tighter">{show.title}</h3>
                  <p className="text-[13px] text-gray-500 font-normal leading-tight mb-1">with {show.presenter.name}</p>
                  <p className="text-[13px] text-gray-400 font-normal leading-tight">
                    {formatTimeToAMPM(show.startTime)} - {formatTimeToAMPM(show.endTime)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Controls */}
      <footer className="border-t border-gray-100 px-6 py-8 pb-14 bg-white">
        {/* Progress Bar */}
        <div className="mb-10 flex flex-col items-center">
            <div className="w-full h-1 bg-gray-100 mb-2 relative">
                <div 
                    className="absolute inset-y-0 left-0 bg-praise-orange" 
                    style={{ width: `${currentShow?.progress || 0}%` }}
                ></div>
                <div 
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-praise-orange rounded-full shadow-sm"
                    style={{ left: `${currentShow?.progress || 0}%` }}
                ></div>
            </div>
            <div className="w-full flex justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">00:00</span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Stream</span>
            </div>
        </div>

        {/* Transport */}
        <div className="flex items-center justify-center mb-10 relative">
            <button 
                onClick={onTogglePlay}
                className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center active:bg-[#d43f00] active:scale-95 transition-all"
            >
                {isPlaying ? <PauseIcon className="w-7 h-7" /> : <PlayIcon className="w-7 h-7 ml-1" />}
            </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-4">
            <div className="flex-1 flex items-center gap-3 bg-bbc-gray px-5 py-3.5 rounded-full">
                <button 
                  onClick={() => onVolumeChange(volume === 0 ? 0.8 : 0)}
                  className="text-black"
                >
                    {renderVolumeIcon()}
                </button>
                <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={volume} 
                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                    className="flex-1 h-1 bg-gray-300 appearance-none rounded-full accent-praise-orange" 
                />
            </div>
        </div>
      </footer>
    </div>
  );
};

export default MobileScheduleDrawer;
