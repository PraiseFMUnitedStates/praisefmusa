
import React from 'react';
import { Track, User, View } from '../types';
import { IMAGES } from '../constants';
import { PlayIcon, HeartIcon, HeartFilledIcon } from './Icons';

interface RecentTracksProps {
    tracks: Track[];
    user: User | null;
    onPlayTrack: (track: Track) => void;
    onToggleFavorite: (track: Track) => void;
    onNavigate: (view: View) => void;
}

const RecentTracks: React.FC<RecentTracksProps> = ({ tracks, user, onPlayTrack, onToggleFavorite, onNavigate }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = IMAGES.default;
  };

  const isFavorite = (trackId: string) => {
    return user?.favorites?.includes(trackId) || false;
  };

  const handleTrackAction = (track: Track) => {
    if (user) {
      onPlayTrack(track);
    } else {
      onNavigate('signin');
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent, track: Track) => {
    e.stopPropagation();
    if (user) {
      onToggleFavorite(track);
    } else {
      onNavigate('signin');
    }
  };

  return (
    <section className="bg-white py-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-12">
        <h2 className="text-xl md:text-2xl font-bold text-black tracking-tighter mb-10 uppercase">
           Recent Tracks
        </h2>
        
        {tracks.length === 0 ? (
          <div className="py-12 border-t border-gray-100">
             <p className="text-gray-400 font-bold text-xs uppercase tracking-widest animate-pulse">
                Sintonizando trilhas recentes...
             </p>
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Track</th>
                  <th className="py-4 text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Artist</th>
                  <th className="py-4 text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tracks.slice(0, 4).map((track, idx) => {
                  const marked = isFavorite(track.id);
                  return (
                    <tr 
                      key={track.id + idx} 
                      className="group transition-all hover:bg-gray-50/50 cursor-pointer"
                      onClick={() => handleTrackAction(track)}
                    >
                      <td className="py-5 pr-4 flex items-center gap-4 md:gap-6">
                        <span className="text-[10px] font-bold text-gray-300 w-4">
                          {(idx + 1).toString().padStart(2, '0')}
                        </span>

                        <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 bg-gray-50 overflow-hidden border border-gray-100 shadow-sm relative group/img">
                          <img 
                            src={track.image || IMAGES.default} 
                            alt={track.title} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            onError={handleImageError}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-center justify-center">
                             <PlayIcon className="w-6 h-6 text-white opacity-0 group-hover/img:opacity-100 transition-opacity" />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-sm md:text-base font-bold text-black leading-tight truncate tracking-tight uppercase">
                            {track.title}
                          </h4>
                        </div>
                      </td>

                      <td className="py-5 text-xs md:text-sm font-medium text-gray-500 tracking-tight uppercase italic">
                        {track.artist}
                      </td>

                      <td className="py-5 text-right">
                        <div className="flex items-center justify-end gap-3 md:gap-6">
                          {/* Favorite Button */}
                          <button 
                            onClick={(e) => handleFavoriteClick(e, track)}
                            className={`p-2 transition-all hover:scale-110 active:scale-95 group/fav ${
                              marked ? 'text-praise-orange' : 'text-gray-300 hover:text-black'
                            }`}
                            title={marked ? "Unmark track" : "Mark as favorite"}
                          >
                            {marked ? (
                              <HeartFilledIcon className="w-6 h-6 md:w-7 md:h-7 drop-shadow-sm" />
                            ) : (
                              <HeartIcon className="w-6 h-6 md:w-7 md:h-7" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentTracks;
