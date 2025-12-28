
import React from 'react';
import { Track } from '../types';
import { CloseIcon, HeartIcon, HeartFilledIcon, SpotifyIcon } from './Icons';
import { LOGO_URL } from '../constants';

interface TrackDetailViewProps {
  track: Track;
  isLoading?: boolean;
  onBack: () => void;
  onToggleFavorite: (track: Track) => void;
  isFavorite: boolean;
}

const TrackDetailView: React.FC<TrackDetailViewProps> = ({ track, onBack, onToggleFavorite, isFavorite }) => {
  const spotifySearchUrl = `https://open.spotify.com/search/${encodeURIComponent(track.artist + ' ' + track.title)}`;

  return (
    <div className="min-h-screen bg-white animate-fade-in pb-24">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-[60]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 h-20 md:h-24 flex items-center justify-between">
           <div className="flex items-center cursor-pointer group h-10 md:h-14" onClick={onBack}>
              <img src={LOGO_URL} alt="Praise FM USA" className="h-full w-auto object-contain transition-transform group-hover:scale-105" />
           </div>
           <button onClick={onBack} className="p-2.5 bg-r1-gray hover:bg-black hover:text-white transition-all">
             <CloseIcon className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 p-4 md:p-12">
          
          <div className="flex-1 max-w-[500px] mx-auto lg:mx-0">
             <div className="relative aspect-square shadow-xl border-b-4 border-praise-orange overflow-hidden bg-gray-100">
                <img src={track.image} className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
             </div>

             <div className="mt-8 grid grid-cols-1 gap-3">
                <button 
                  onClick={() => onToggleFavorite(track)}
                  className={`flex items-center justify-center gap-2 py-5 px-3 font-bold uppercase text-[9px] tracking-[0.2em] transition-all border-2 ${
                    isFavorite ? 'bg-praise-orange border-praise-orange text-white' : 'border-r1-gray text-black hover:border-black'
                  }`}
                >
                  {isFavorite ? <HeartFilledIcon className="w-4 h-4" /> : <HeartIcon className="w-4 h-4" />}
                  {isFavorite ? 'Saved' : 'Save Track'}
                </button>
                <a 
                  href={spotifySearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-5 px-3 font-bold uppercase text-[9px] tracking-[0.2em] transition-all border-2 border-[#1DB954] bg-[#1DB954] text-white hover:bg-black hover:border-black"
                >
                  <SpotifyIcon className="w-4 h-4" />
                  Listen on Spotify
                </a>
             </div>
          </div>

          <div className="flex-1 pt-2">
             <div className="flex items-center gap-3 mb-6">
                <span className="text-praise-orange font-bold text-[10px] uppercase tracking-[0.5em]">Intel</span>
                <div className="flex-1 h-px bg-r1-gray"></div>
             </div>

             <h1 className="text-4xl md:text-6xl font-bold text-black tracking-tighter mb-2 leading-tight break-words">
                {track.title}
             </h1>
             <h2 className="text-xl md:text-3xl font-medium text-gray-300 tracking-tighter mb-10">
                By {track.artist}
             </h2>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-r1-gray p-6 border-l-4 border-black h-fit">
                   <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-3">Track Info</h4>
                   <div className="space-y-3">
                      <div>
                        <p className="text-[8px] font-bold text-gray-400 uppercase">Released</p>
                        <p className="text-xl font-bold text-black uppercase">{track.year || 'N/A'}</p>
                      </div>
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-[8px] font-bold text-gray-400 uppercase">Station</p>
                        <p className="text-lg font-bold text-black uppercase">PRAISE FM</p>
                      </div>
                   </div>
                </div>
                
                <div className="font-serif text-gray-600 text-lg leading-relaxed">
                   <h4 className="font-sans text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-3">Biography</h4>
                   <p>{track.artistBio || "A powerful voice in modern worship, leading listeners into deeper connection through inspired melodies and heartfelt lyrics."}</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackDetailView;
