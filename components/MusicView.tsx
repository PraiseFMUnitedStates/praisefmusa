import React, { useMemo } from 'react';
import { Track, User } from '../types';
import { MUSIC_BY_GENRE, IMAGES, LOGO_URL } from '../constants';
import { HeartIcon, HeartFilledIcon } from './Icons';

interface MusicViewProps {
  onPlayMix: () => void;
  onPlayTrack: (track: Track) => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onPlayPlaylist: () => void;
  activeTrack?: Track;
  isPlaying: boolean;
  user: User | null;
  onToggleFavorite: (track: Track) => Promise<void>;
  recentTracks: Track[];
  onTogglePlay: () => void;
}

const MusicView: React.FC<MusicViewProps> = ({ 
  user, 
  onToggleFavorite, 
  activeTrack,
  recentTracks,
  onPlayTrack
}) => {
  const topSongs = useMemo(() => {
    const base = recentTracks.length > 5 
      ? recentTracks 
      : Object.values(MUSIC_BY_GENRE).flat();
    
    // Garante que sempre retorna um array, mesmo vazio
    if (base.length === 0) return [];
    
    return base.slice(0, 10); // Display up to 10 top songs since Artists were removed
  }, [recentTracks]);

  const handleFavoriteClick = async (e: React.MouseEvent, track: Track) => {
    e.stopPropagation();
    
    // Previne ação se não houver usuário logado
    if (!user) return;
    
    try {
      await onToggleFavorite(track);
    } catch (error) {
      console.error('Erro ao favoritar música:', error);
      // Você pode adicionar um toast/notificação aqui se quiser
    }
  };

  const handleTrackClick = (track: Track) => {
    // Permite tocar a música ao clicar nela
    if (onPlayTrack) {
      onPlayTrack(track);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = IMAGES.default;
  };

  return (
    <div className="bg-white min-h-screen animate-fade-in pb-32">
      <header className="bg-white pt-12 md:pt-20 pb-12 border-b-8 border-black">
        <div className="max-w-[1400px] mx-auto px-4 md:px-12">
          <div className="flex items-center gap-3 mb-6">
            <img src={LOGO_URL} alt="Praise FM USA Logo" className="h-10 w-auto object-contain" />
            <h2 className="text-xs font-bold text-praise-orange tracking-[0.5em] uppercase">
              The Sound of Praise FM USA
            </h2>
          </div>
          <h1 className="text-5xl md:text-9xl font-black text-black tracking-tighter uppercase mb-4 leading-none">
            Music <span className="text-gray-200">Charts</span>
          </h1>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-16">
        <div className="max-w-3xl">
          <div className="space-y-10">
            <div className="flex items-center justify-between border-b-4 border-black pb-4">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-black">
                Top Played Songs
              </h3>
            </div>
            
            {/* Mensagem quando não há músicas */}
            {topSongs.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg font-medium">
                  Nenhuma música registrada ainda
                </p>
                <p className="text-gray-300 text-sm mt-2">
                  As músicas mais tocadas aparecerão aqui
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {topSongs.map((track, idx) => {
                  const isFav = user?.favorites.includes(track.id);
                  const isActive = activeTrack?.id === track.id;
                  
                  return (
                    <div 
                      key={`${track.id}-${idx}`}
                      onClick={() => handleTrackClick(track)}
                      className={`flex items-center gap-6 py-6 group transition-all px-3 cursor-pointer ${
                        isActive ? 'bg-praise-orange/5' : 'hover:bg-gray-50'
                      }`}
                    >
                      <span 
                        className={`text-4xl font-black w-12 text-center italic tracking-tighter transition-colors ${
                          isActive 
                            ? 'text-praise-orange' 
                            : 'text-gray-200 group-hover:text-black'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      
                      <div className="w-20 h-20 bg-gray-100 flex-shrink-0 relative overflow-hidden shadow-md">
                        <img 
                          src={track.image} 
                          alt={`${track.title} cover`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          onError={handleImageError} 
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 
                          className={`font-black text-xl md:text-2xl uppercase tracking-tighter truncate leading-none mb-1 transition-colors ${
                            isActive ? 'text-praise-orange' : 'text-black'
                          }`}
                        >
                          {track.title}
                        </h4>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          {track.artist}
                        </p>
                      </div>
                      
                      <button 
                        onClick={(e) => handleFavoriteClick(e, track)}
                        disabled={!user}
                        className={`p-3 transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                          isFav ? 'text-praise-orange' : 'text-gray-300 hover:text-black'
                        }`}
                        aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                      >
                        {isFav ? (
                          <HeartFilledIcon className="w-6 h-6" />
                        ) : (
                          <HeartIcon className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicView;