
export interface Presenter {
  id: string;
  name: string;
  image: string;
}

export interface Show {
  id: string;
  title: string;
  timeSlot: string;
  description: string;
  presenter: Presenter;
  image: string;
  isLive?: boolean;
  progress?: number;
  startTime?: string;
  endTime?: string;
  days?: number[];
  websiteUrl?: string;
}

export interface ScheduleItem {
  start: string;
  end: string;
  name: string;
  img: string;
  desc: string;
  days?: number[];
  websiteUrl?: string;
}

export interface NextShow {
  date: string;
  venue: string;
  location: string;
  ticketUrl: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  image: string;
  year?: string;
  audioUrl?: string;
  artistBio?: string;
  lyrics?: string;
  nextShow?: NextShow;
  spotifyUrl?: string;
}

export interface Devotional {
  id: string;
  day: string;
  verse: string;
  ref: string;
  dateSaved: string;
}

export interface PlayerState {
  isPlaying: boolean;
  currentShow: Show | null;
  volume: number;
  isMuted: boolean;
  activeUrl?: string;
  activeTrack?: Track;
  playlist?: Track[];
  playlistIndex?: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  favorites: string[];
  savedShows: string[];
  savedDevotionals: string[];
}

export type View = 'home' | 'profile' | 'music' | 'devocional' | 'signin' | 'schedule' | 'live-detail' | 'tracklist' | 'todays-schedule' | 'track-detail' | 'my-sounds' | 'programme-detail' | 'presenter-detail';
