
import React, { useEffect, useState, useCallback } from 'react'
import { getFavoriteSongs, unfavoriteSong } from '../services/favorites'
import { Track } from '../types';
import { HeartFilledIcon, PlayIcon } from './Icons';

interface FavoriteSongsListProps {
  userId: string;
}

export const FavoriteSongsList: React.FC<FavoriteSongsListProps> = ({ userId }) => {
  const [songs, setSongs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadSongs = useCallback(() => {
    if (!userId) {
      setSongs([]);
      setLoading(false);
      return;
    }
    getFavoriteSongs(userId).then(({ data }) => {
      setSongs(data || []);
      setLoading(false);
    });
  }, [userId])

  useEffect(() => {
    loadSongs();
    const handleUpdate = () => loadSongs();
    window.addEventListener('storage', handleUpdate);
    return () => window.removeEventListener('storage', handleUpdate);
  }, [loadSongs])

  const handleUnfavorite = async (e: React.MouseEvent, songId: string) => {
    e.stopPropagation();
    await unfavoriteSong(songId, userId);
    loadSongs();
  };

  if (loading) {
    return (
      <div className="py-8 space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-50 animate-pulse"></div>)}
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-3xl md:text-5xl font-black text-black uppercase tracking-tighter">
          Favorite Songs
        </h3>
        {songs.length > 0 && (
          <span className="text-[10px] font-black text-white bg-praise-orange px-4 py-1.5 uppercase tracking-widest">
            {songs.length} Tracks
          </span>
        )}
      </div>
      
      {songs.length === 0 ? (
        <div className="bg-gray-50 py-24 px-6 text-center border-2 border-dashed border-gray-200">
           <p className="text-gray-400 font-black uppercase text-xs tracking-widest mb-2">Your library is empty</p>
           <p className="text-gray-300 text-sm">Heart any track in the player to save it here.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {songs.map((fav, idx) => {
            const track = fav.songs as Track;
            
            return (
              <div key={fav.song_id} className="group overflow-hidden">
                <div 
                  className={`flex items-center justify-between py-6 px-4 cursor-pointer transition-all hover:bg-gray-50`}
                >
                  <div className="flex items-center gap-6">
                    <span className={`w-8 font-black text-lg text-gray-200 group-hover:text-black`}>
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <div className="w-16 h-16 bg-gray-100 flex-shrink-0 relative">
                       <img src={track.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl uppercase tracking-tight leading-none mb-1">
                        {track.title}
                      </h4>
                      <p className={`text-[10px] font-black uppercase tracking-widest text-gray-500`}>
                        {track.artist}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={(e) => handleUnfavorite(e, fav.song_id)}
                      className={`p-2 transition-colors text-gray-300 hover:text-praise-orange`}
                    >
                      <HeartFilledIcon className="w-6 h-6 text-praise-orange" />
                    </button>
                    <span className={`font-black text-2xl transition-transform duration-300 text-gray-100`}>
                      ›
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}
