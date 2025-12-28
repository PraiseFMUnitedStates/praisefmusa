
import React, { useEffect, useState, useCallback } from 'react';
import { getLocalSavedShowsData, unsaveShow } from '../services/favorites';
import { Show } from '../types';
import { HeartFilledIcon, PlayIcon } from './Icons';

interface SavedShowsListProps {
  userId: string;
}

export const SavedShowsList: React.FC<SavedShowsListProps> = ({ userId }) => {
  const [shows, setShows] = useState<Show[]>([]);

  const loadShows = useCallback(() => {
    const data = getLocalSavedShowsData(userId);
    setShows(data);
  }, [userId]);

  useEffect(() => {
    loadShows();
    window.addEventListener('storage', loadShows);
    return () => window.removeEventListener('storage', loadShows);
  }, [loadShows]);

  const handleUnsave = async (e: React.MouseEvent, showId: string) => {
    e.stopPropagation();
    await unsaveShow(showId, userId);
    loadShows();
  };

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-3xl md:text-5xl font-black text-black uppercase tracking-tighter">
          Saved Programs
        </h3>
        {shows.length > 0 && (
          <span className="text-[10px] font-black text-white bg-praise-orange px-4 py-1.5 uppercase tracking-widest">
            {shows.length} Saved
          </span>
        )}
      </div>
      
      {shows.length === 0 ? (
        <div className="bg-gray-50 py-24 px-6 text-center border-2 border-dashed border-gray-200">
           <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No programs saved yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shows.map((show) => (
            <div key={show.id} className="group relative bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
              <div className="aspect-[16/9] overflow-hidden">
                <img src={show.image} alt={show.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-black mb-1 uppercase tracking-tight">{show.title}</h4>
                <p className="text-xs text-gray-500 mb-4 tracking-widest uppercase">with {show.presenter.name}</p>
                <div className="flex items-center justify-between">
                  <button onClick={(e) => handleUnsave(e, show.id)} className="text-praise-orange hover:scale-110 transition-transform">
                    <HeartFilledIcon className="w-6 h-6" />
                  </button>
                  <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{show.timeSlot}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
