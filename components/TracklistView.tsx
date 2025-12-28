
import React, { useState } from 'react';
import { Track } from '../types';
import { IMAGES } from '../constants';
import { HeartIcon, HeartFilledIcon, CloseIcon } from './Icons';

interface TracklistViewProps {
  tracks: Track[];
  favorites?: string[];
  onToggleFavorite?: (track: Track) => void;
  onBack: () => void;
}

const TracklistView: React.FC<TracklistViewProps> = ({ tracks, favorites = [], onToggleFavorite, onBack }) => {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  const handleTrackClick = (track: Track) => {
    if (!track.artistBio) {
      track.artistBio = "Information about this worship artist and their spiritual journey is coming soon.";
    }
    setSelectedTrack(track);
  };

  return (
    <div className="bg-white min-h-screen animate-fade-in pb-32">
      <div className="bg-white pt-16 md:pt-24 pb-8 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 flex items-center justify-between">
          <div>
            <h1 className="text-5xl md:text-8xl font-normal text-black tracking-tighter uppercase mb-2">Tracklist</h1>
            <p className="text-gray-400 text-lg md:text-xl font-normal">Everything played on Praise FM 1 recently.</p>
          </div>
          <button onClick={onBack} className="p-4 bg-black text-white hover:bg-praise-orange transition-colors">
            <CloseIcon className="w-8 h-8" />
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-12">
        {tracks.length === 0 ? (
          <div className="py-32 text-center text-gray-400">
            <p className="text-2xl font-light">No tracks played yet in this session.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {tracks.map((track, idx) => {
              const isFavorite = favorites.includes(track.id);
              return (
                <div 
                  key={track.id + idx} 
                  className="group flex items-center gap-8 py-8 px-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleTrackClick(track)}
                >
                  <span className="text-3xl font-normal text-gray-200 w-12 text-right">
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>
                  <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-gray-100 shadow-md">
                    <img src={track.image || IMAGES.default} alt={track.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-2xl md:text-3xl font-normal text-black leading-tight truncate tracking-tight group-hover:text-praise-orange transition-colors">
                      {track.title}
                    </h4>
                    <p className="text-sm md:text-base font-normal text-gray-500 tracking-widest mt-1">
                      {track.artist}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(track); }}
                      className={`p-3 transition-colors ${isFavorite ? 'text-praise-orange' : 'text-gray-300 hover:text-black'}`}
                    >
                      {isFavorite ? <HeartFilledIcon className="w-8 h-8" /> : <HeartIcon className="w-8 h-8" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Artist Spotlight Sidebar/Modal */}
      {selectedTrack && (
        <div className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm animate-fade-in flex justify-end" onClick={() => setSelectedTrack(null)}>
          <div className="w-full md:max-w-xl bg-white h-full shadow-2xl animate-slide-in-right overflow-y-auto" onClick={e => e.stopPropagation()}>
             <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-praise-orange">Artist Spotlight</span>
                <button onClick={() => setSelectedTrack(null)} className="p-2 text-gray-400 hover:text-black"><CloseIcon className="w-6 h-6" /></button>
             </div>
             <div className="p-12">
                <div className="w-full aspect-square bg-gray-100 mb-8 shadow-2xl">
                   <img src={selectedTrack.image} alt={selectedTrack.artist} className="w-full h-full object-cover" />
                </div>
                <h2 className="text-5xl font-normal text-black tracking-tighter uppercase mb-2">{selectedTrack.artist}</h2>
                <h3 className="text-xl text-gray-400 mb-8">Featured on: {selectedTrack.title}</h3>
                <div className="space-y-6">
                   <h4 className="text-xs font-bold uppercase tracking-widest text-black border-b-2 border-praise-orange inline-block pb-1">About the Artist</h4>
                   <p className="text-lg text-gray-600 leading-relaxed font-light">{selectedTrack.artistBio}</p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TracklistView;
