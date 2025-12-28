
import { supabase, isMock } from '../lib/supabase'
import { Track, Show, Devotional } from '../types'

// Chaves consistentes
const getLocalSongsKey = (userId: string) => `praise_fm_fav_songs_v4_${userId}`;
const getLocalShowsKey = (userId: string) => `praise_fm_fav_shows_v4_${userId}`;
const getLocalDevotionalsKey = (userId: string) => `praise_fm_fav_devos_v1_${userId}`;

/**
 * Funções para MÚSICAS
 */
export function getLocalFavoritesData(userId: string): Track[] {
  try {
    const stored = localStorage.getItem(getLocalSongsKey(userId));
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

export async function favoriteSong(track: Track, userId: string) {
  if (!userId) return { error: 'No user ID provided' };
  const current = getLocalFavoritesData(userId);
  if (current.find(t => t.id === track.id)) return { data: null };
  const trackToSave = { ...track, artistBio: track.artistBio || "A powerful voice in modern worship." };
  const updated = [...current, trackToSave];
  localStorage.setItem(getLocalSongsKey(userId), JSON.stringify(updated));
  window.dispatchEvent(new Event('storage'));
  if (!isMock) {
    try { await supabase.from('favorite_songs').upsert({ user_id: userId, song_id: track.id, track_metadata: trackToSave }); } catch (err) {}
  }
  return { data: null, error: null };
}

export async function unfavoriteSong(songId: string, userId: string) {
  if (!userId) return { error: 'No user ID provided' };
  const current = getLocalFavoritesData(userId);
  const updated = current.filter(t => t.id !== songId);
  localStorage.setItem(getLocalSongsKey(userId), JSON.stringify(updated));
  window.dispatchEvent(new Event('storage'));
  if (!isMock) {
    try { await supabase.from('favorite_songs').delete().eq('user_id', userId).eq('song_id', songId); } catch (err) {}
  }
  return { data: null, error: null };
}

export async function getFavoriteSongs(userId: string) {
  const tracks = getLocalFavoritesData(userId);
  return { data: tracks.map(t => ({ song_id: t.id, songs: t })), error: null };
}

/**
 * Funções para PROGRAMAS (SHOWS)
 */
export function getLocalSavedShowsData(userId: string): Show[] {
  try {
    const stored = localStorage.getItem(getLocalShowsKey(userId));
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

export async function saveShow(show: Show, userId: string) {
  if (!userId) return { error: 'No user ID provided' };
  const current = getLocalSavedShowsData(userId);
  if (current.find(s => s.id === show.id)) return { data: null };
  const updated = [...current, show];
  localStorage.setItem(getLocalShowsKey(userId), JSON.stringify(updated));
  window.dispatchEvent(new Event('storage'));
  return { data: null, error: null };
}

export async function unsaveShow(showId: string, userId: string) {
  if (!userId) return { error: 'No user ID provided' };
  const current = getLocalSavedShowsData(userId);
  const updated = current.filter(s => s.id !== showId);
  localStorage.setItem(getLocalShowsKey(userId), JSON.stringify(updated));
  window.dispatchEvent(new Event('storage'));
  return { data: null, error: null };
}

/**
 * Funções para DEVOCIONAIS
 */
export function getLocalSavedDevotionalsData(userId: string): Devotional[] {
  try {
    const stored = localStorage.getItem(getLocalDevotionalsKey(userId));
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

export async function saveDevotional(devotional: Devotional, userId: string) {
  if (!userId) return { error: 'No user ID provided' };
  const current = getLocalSavedDevotionalsData(userId);
  if (current.find(d => d.id === devotional.id)) return { data: null };
  const updated = [...current, devotional];
  localStorage.setItem(getLocalDevotionalsKey(userId), JSON.stringify(updated));
  window.dispatchEvent(new Event('storage'));
  return { data: null, error: null };
}

export async function unsaveDevotional(id: string, userId: string) {
  if (!userId) return { error: 'No user ID provided' };
  const current = getLocalSavedDevotionalsData(userId);
  const updated = current.filter(d => d.id !== id);
  localStorage.setItem(getLocalDevotionalsKey(userId), JSON.stringify(updated));
  window.dispatchEvent(new Event('storage'));
  return { data: null, error: null };
}
