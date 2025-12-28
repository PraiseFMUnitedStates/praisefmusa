
import React, { useEffect, useState, useCallback } from 'react';
import { getLocalSavedDevotionalsData, unsaveDevotional } from '../services/favorites';
import { Devotional } from '../types';
import { CloseIcon } from './Icons';

interface SavedDevotionalsListProps {
  userId: string;
}

export const SavedDevotionalsList: React.FC<SavedDevotionalsListProps> = ({ userId }) => {
  const [devos, setDevos] = useState<Devotional[]>([]);

  const loadDevos = useCallback(() => {
    const data = getLocalSavedDevotionalsData(userId);
    setDevos(data);
  }, [userId]);

  useEffect(() => {
    loadDevos();
    window.addEventListener('storage', loadDevos);
    return () => window.removeEventListener('storage', loadDevos);
  }, [loadDevos]);

  const handleUnsave = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await unsaveDevotional(id, userId);
    loadDevos();
  };

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-3xl md:text-5xl font-black text-black uppercase tracking-tighter">
          Saved Devotionals
        </h3>
        {devos.length > 0 && (
          <span className="text-[10px] font-black text-white bg-praise-orange px-4 py-1.5 uppercase tracking-widest">
            {devos.length} Items
          </span>
        )}
      </div>
      
      {devos.length === 0 ? (
        <div className="bg-gray-50 py-24 px-6 text-center border-2 border-dashed border-gray-200">
           <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No verses saved yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {devos.map((devo) => (
            <div key={devo.id} className="group relative bg-white border-2 border-black p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all">
              <div className="flex items-start justify-end mb-6">
                <button 
                  onClick={(e) => handleUnsave(e, devo.id)} 
                  className="text-gray-300 hover:text-praise-orange transition-colors"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>
              
              <blockquote className="mb-6">
                <p className="text-xl font-bold font-serif italic text-black leading-tight mb-4">
                  "{devo.verse}"
                </p>
                <footer className="text-sm font-black uppercase tracking-widest text-praise-orange">
                  — {devo.ref}
                </footer>
              </blockquote>

              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{devo.day} Reflection</span>
                 <span className="text-[10px] font-black text-gray-200 uppercase tracking-widest">Radio 1</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
