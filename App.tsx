
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header.tsx';
import Player from './components/Player.tsx';
import Hero from './components/Hero.tsx';
import RecentTracks from './components/RecentTracks.tsx';
import Profile from './components/Profile.tsx';
import MusicView from './components/MusicView.tsx';
import MySoundsView from './components/MySoundsView.tsx';
import SignInView from './components/SignInView.tsx';
import TodaysScheduleView from './components/TodaysScheduleView.tsx';
import Schedule from './components/Schedule.tsx';
import ProgrammeDetailView from './components/ProgrammeDetailView.tsx';
import DevocionalView from './components/DevocionalView.tsx';
import MoreFromSection from './components/MoreFromSection.tsx';
import { PlayerState, Show, Track, User, View, Devotional } from './types.ts';
import { getCurrentAndNextShows, fetchAlbumCover } from './utils.ts';
import { METADATA_URL, STREAM_URL, IMAGES, MUSIC_BY_GENRE } from './constants.ts';
import { supabase } from './lib/supabase.ts';
import { favoriteSong, unfavoriteSong, getLocalFavoritesData, getLocalSavedShowsData, saveShow, unsaveShow, getLocalSavedDevotionalsData, saveDevotional, unsaveDevotional } from './services/favorites.ts';

const App: React.FC = () => {
  const [scheduleData, setScheduleData] = useState(getCurrentAndNextShows());
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentShow: null,
    volume: 0.8,
    isMuted: false,
    activeUrl: STREAM_URL,
    activeTrack: undefined
  });
  
  const [recentTracks, setRecentTracks] = useState<Track[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProgramme, setSelectedProgramme] = useState<Show | null>(null);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);

  const allLibraryTracks = useMemo(() => Object.values(MUSIC_BY_GENRE).flat(), []);

  const handleNavigate = useCallback((view: View, show?: Show) => {
    setCurrentView(view);
    if (show) setSelectedProgramme(show);
    window.scrollTo(0, 0);
  }, []);

  const syncUserWithStorage = (sessionUser: any) => {
    const favorites = getLocalFavoritesData(sessionUser.id).map(t => t.id);
    const savedShows = getLocalSavedShowsData(sessionUser.id).map(s => s.id);
    const savedDevotionals = getLocalSavedDevotionalsData(sessionUser.id).map(d => d.id);
    setUser({
      id: sessionUser.id,
      email: sessionUser.email || '',
      name: sessionUser.user_metadata?.name || sessionUser.email?.split('@')[0],
      avatar: sessionUser.user_metadata?.avatar_url,
      favorites,
      savedShows,
      savedDevotionals
    });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) syncUserWithStorage(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) syncUserWithStorage(session.user);
      else setUser(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const togglePlay = useCallback(() => {
    if (!hasStartedPlaying) setHasStartedPlaying(true);
    setPlayerState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, [hasStartedPlaying]);

  const handlePlayTrack = useCallback((track: Track) => {
    if (!hasStartedPlaying) setHasStartedPlaying(true);
    setPlayerState(prev => ({
      ...prev,
      isPlaying: true,
      activeUrl: track.audioUrl || STREAM_URL,
      activeTrack: track
    }));
  }, [hasStartedPlaying]);

  const handleNextTrack = useCallback(() => {
    if (!playerState.activeTrack) return;
    const currentIndex = allLibraryTracks.findIndex(t => t.id === playerState.activeTrack?.id);
    const nextIndex = (currentIndex + 1) % allLibraryTracks.length;
    handlePlayTrack(allLibraryTracks[nextIndex]);
  }, [playerState.activeTrack, allLibraryTracks, handlePlayTrack]);

  const handlePrevTrack = useCallback(() => {
    if (!playerState.activeTrack) return;
    const currentIndex = allLibraryTracks.findIndex(t => t.id === playerState.activeTrack?.id);
    const prevIndex = (currentIndex - 1 + allLibraryTracks.length) % allLibraryTracks.length;
    handlePlayTrack(allLibraryTracks[prevIndex]);
  }, [playerState.activeTrack, allLibraryTracks, handlePlayTrack]);

  const handleSwitchToLive = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      activeUrl: STREAM_URL,
      activeTrack: undefined,
      isPlaying: true
    }));
  }, []);

  const handleVolumeChange = useCallback((volume: number) => {
    setPlayerState(prev => ({ ...prev, volume }));
  }, []);

  const handleToggleFavoriteTrack = async (track: Track) => {
    if (!user) { setCurrentView('signin'); return; }
    const isFav = user.favorites.includes(track.id);
    if (isFav) {
      setUser(prev => prev ? { ...prev, favorites: prev.favorites.filter(id => id !== track.id) } : null);
      await unfavoriteSong(track.id, user.id);
    } else {
      setUser(prev => prev ? { ...prev, favorites: [...prev.favorites, track.id] } : null);
      await favoriteSong(track, user.id);
    }
  };

  const handleToggleSaveShow = async (show: Show) => {
    if (!user) { setCurrentView('signin'); return; }
    const isSaved = user.savedShows.includes(show.id);
    if (isSaved) {
      setUser(prev => prev ? { ...prev, savedShows: prev.savedShows.filter(id => id !== show.id) } : null);
      await unsaveShow(show.id, user.id);
    } else {
      setUser(prev => prev ? { ...prev, savedShows: [...prev.savedShows, show.id] } : null);
      await saveShow(show, user.id);
    }
  };

  const handleToggleSaveDevotional = async (devotional: Devotional) => {
    if (!user) { setCurrentView('signin'); return; }
    const isSaved = user.savedDevotionals.includes(devotional.id);
    if (isSaved) {
      setUser(prev => prev ? { ...prev, savedDevotionals: prev.savedDevotionals.filter(id => id !== devotional.id) } : null);
      await unsaveDevotional(devotional.id, user.id);
    } else {
      setUser(prev => prev ? { ...prev, savedDevotionals: [...prev.savedDevotionals, devotional.id] } : null);
      await saveDevotional(devotional, user.id);
    }
  };

  useEffect(() => {
    const updateSchedule = () => {
        const newData = getCurrentAndNextShows();
        setScheduleData(newData);
        setPlayerState(prev => ({ ...prev, currentShow: newData.current }));
    };
    updateSchedule();
    const interval = setInterval(updateSchedule, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let es = new EventSource(METADATA_URL);
    es.onmessage = (e) => {
        try {
            const d = JSON.parse(e.data);
            if (d.streamTitle) {
                const titleLower = d.streamTitle.toLowerCase();
                const forbiddenKeywords = ["praise fm u.s", "spots", "comerciais", "ramps", "praise fm usa", "intro", "ramp 3"];
                
                const isNonMusic = forbiddenKeywords.some(keyword => titleLower.includes(keyword));
                if (isNonMusic) return;

                let parts = d.streamTitle.split(" - ");
                let artist = parts[0]?.trim() || "Praise FM";
                let title = parts.slice(1).join(" - ").trim() || artist;

                if (artist.toLowerCase() === "praise fm" && title.toLowerCase() === "praise fm") return;

                fetchAlbumCover(artist, title).then(albumImage => {
                  const newTrack: Track = { id: `${artist}-${title}`.toLowerCase(), title, artist, image: albumImage || IMAGES.default };
                  setRecentTracks(prev => {
                    if (prev.length > 0 && prev[0].title === title) return prev;
                    return [newTrack, ...prev].slice(0, 15);
                  });
                });
            }
        } catch (err) {}
    };
    return () => es.close();
  }, []);

  return (
    <div className={`min-h-screen bg-white font-sans ${hasStartedPlaying ? 'pb-24 md:pb-24' : ''}`}>
      <Header user={user} onLoginClick={() => handleNavigate('signin')} onNavigate={(v) => handleNavigate(v)} currentView={currentView} />
      
      <main className="bg-white">
        {currentView === 'home' && (
            <>
                <Hero show={scheduleData.current!} nextShows={[scheduleData.next1, scheduleData.next2]} onPlay={playerState.activeTrack ? handleSwitchToLive : togglePlay} isPlaying={playerState.isPlaying && !playerState.activeTrack} onNavigate={handleNavigate} />
                <RecentTracks tracks={recentTracks} user={user} onPlayTrack={handlePlayTrack} onToggleFavorite={handleToggleFavoriteTrack} onNavigate={(v) => handleNavigate(v)} />
                <Schedule currentShowId={scheduleData.current?.id || ''} onNavigate={handleNavigate} onToggleReminder={handleToggleSaveShow} savedShows={user?.savedShows} />
                <MoreFromSection onNavigate={handleNavigate} />
            </>
        )}
        
        {currentView === 'music' && (
          <MusicView onPlayMix={handleSwitchToLive} onPlayTrack={handlePlayTrack} onNextTrack={handleNextTrack} onPrevTrack={handlePrevTrack} onPlayPlaylist={() => {}} activeTrack={playerState.activeTrack} isPlaying={playerState.isPlaying} user={user} onToggleFavorite={handleToggleFavoriteTrack} recentTracks={recentTracks} onTogglePlay={togglePlay} />
        )}

        {currentView === 'devocional' && <DevocionalView user={user} onToggleSaveDevotional={handleToggleSaveDevotional} onNavigate={handleNavigate} />}

        {currentView === 'my-sounds' && <MySoundsView user={user} onNavigate={(v) => handleNavigate(v)} />}

        {currentView === 'profile' && <Profile user={user} onLogout={() => supabase.auth.signOut()} onNavigate={(v) => handleNavigate(v)} onAvatarUpdate={(url) => setUser(prev => prev ? {...prev, avatar: url} : null)} />}
        
        {currentView === 'signin' && <SignInView onLoginSuccess={() => handleNavigate('home')} onCancel={() => handleNavigate('home')} />}
        {currentView === 'todays-schedule' && <TodaysScheduleView currentShowId={scheduleData.current?.id} onNavigate={handleNavigate} />}
        {(currentView === 'programme-detail' || currentView === 'presenter-detail') && selectedProgramme && (
          <ProgrammeDetailView 
            show={selectedProgramme} 
            onPlay={playerState.activeTrack ? handleSwitchToLive : togglePlay} 
            isPlaying={playerState.isPlaying} 
            onNavigate={handleNavigate}
            onPlayTrack={handlePlayTrack}
            activeTrackId={playerState.activeTrack?.id}
            onToggleFavorite={handleToggleFavoriteTrack}
            favorites={user?.favorites}
            user={user}
          />
        )}
      </main>

      {hasStartedPlaying && <Player playerState={playerState} onTogglePlay={togglePlay} onVolumeChange={handleVolumeChange} onNext={handleNextTrack} onPrev={handlePrevTrack} />}
    </div>
  );
};

export default App;
