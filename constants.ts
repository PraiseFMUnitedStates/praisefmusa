
import { ScheduleItem, Track } from './types';

export const STREAM_URL = "https://stream.zeno.fm/hvwifp8ezc6tv";
export const METADATA_URL = "https://api.zeno.fm/mounts/metadata/subscribe/hvwifp8ezc6tv";

// Official Praise FM USA Logo Image URL (Black and Orange)
export const LOGO_URL = "https://res.cloudinary.com/dtecypmsh/image/upload/v1766870037/LOGO1_yr7w4a.webp";

const GCLEF_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Cpath d='M55,20 C50,20 46,24 46,30 C46,45 65,45 65,60 C65,70 55,75 45,70 C40,65 40,55 45,50 L45,20 C45,15 50,10 55,10 C65,10 75,20 75,35 C75,55 55,65 40,65 C30,65 25,55 25,45 C25,30 35,20 45,20' fill='none' stroke='%23d1d5db' stroke-width='3' stroke-linecap='round' transform='translate(5, 5)'/%3E%3Ccircle cx='50' cy='50' r='3' fill='%23d1d5db'/%3E%3C/svg%3E";

export const IMAGES: Record<string, string> = {
    default: GCLEF_PLACEHOLDER,
    midnight: "https://i.ibb.co/9SWsm3k/Daniel-Brooks.png",
    worship: "https://i.ibb.co/h1TjccYj/Praise-FM-Worship.png",
    morning: "https://i.ibb.co/kV3k2zhK/Stancy-Campbell.png",
    midday: "https://i.ibb.co/zVKBhmQt/Michael-Ray.png",
    nonstop: "https://i.ibb.co/HD8bvHHM/Praise-FM-Non-Stop.png",
    carpool: "https://i.ibb.co/hJpcYYMg/Rachel-Harris.png",
    pop: "https://i.ibb.co/h1R4vz3H/Jordan-Reyes.png",
    sunday: "https://i.ibb.co/svmQFm5s/Matt-Riley.png",
    liveShow: "https://i.ibb.co/CKHykK47/Praise-FM-Live-Show.png",
    livingMessage: "https://i.ibb.co/RGMtQmH8/Living-the-Message.png",
    futureArtists: "https://i.ibb.co/k2g5npDk/Sarah-Jordan.png",
    classics: "https://i.ibb.co/99xN4fWv/Scott-Turner.png"
};

export const HOSTS_DATA: Record<string, { name: string, bio: string }> = {
    "Morning Show": {
      name: "Stancy Campbell",
      bio: "A bright voice in morning worship, Stancy brings a decade of faith-based broadcasting. Her infectious energy and deep scriptural insights turn early mornings into a celebration of grace."
    },
    "Midday Grace": {
      name: "Michael Ray",
      bio: "Michael is the calm in the middle of your day. A former worship leader from Chicago, he curates a flow of soulful anthems designed to refocus your spirit during the busy workday."
    },
    "Praise FM Carpool": {
      name: "Rachael Harris",
      bio: "Rachael Harris transforms your daily commute into a mobile sanctuary. With her high-energy style and curated praise hits, she makes the carpool the best hour of your journey home."
    },
    "Praise FM POP": {
      name: "Jordan Reys",
      bio: "At the pulse of contemporary Christian music, Jordan Reys delivers the latest chart-toppers and artist exclusives. His show is where faith meets modern culture."
    },
    "Sunday Morning With Christ": {
      name: "Matt Riley",
      bio: "Matt Riley leads the signature Sunday service with reverence for tradition and a passion for modern worship, creating a perfect atmosphere for Sunday reflection."
    },
    "Midnight Grace": {
      name: "Daniel Brooks",
      bio: "Daniel's soothing voice is the soundtrack to late-night reflection. He guides listeners through deep worship and peaceful prayer in the quietest hours of the night."
    },
    "Future Artists": {
      name: "Sarah Jordan",
      bio: "Sarah Jordan presents the best emerging talent in worship music."
    },
    "Praise FM Classics": {
      name: "Scott Turner",
      bio: "Scott Turner curates timeless anthems of faith that shaped generations."
    },
    "Living The Message": {
      name: "Praise FM Ministry",
      bio: "A profound journey into the heart of the Gospel. 'Living The Message' features powerful sermons and biblical teachings designed to equip and inspire believers. Join us for a deep dive into the Word of God that translates ancient truths into practical guidance for modern life."
    }
};

export const HOSTS: Record<string, string> = Object.entries(HOSTS_DATA).reduce((acc, [key, val]) => {
  acc[key] = val.name;
  return acc;
}, {} as Record<string, string>);

const DEFAULT_WEBSITE = "https://praisefm.usa/program/";

export const RAW_SCHEDULE: ScheduleItem[] = [
    {start:"00:00", end:"06:00", name:"Midnight Grace", img:IMAGES.midnight, websiteUrl: `${DEFAULT_WEBSITE}midnight-grace`, desc: "Peaceful hours with gentle worship."},
    {start:"06:00", end:"07:00", name:"Praise FM Worship", img:IMAGES.worship, websiteUrl: `${DEFAULT_WEBSITE}worship`, desc: "The finest worship music."},
    {start:"07:00", end:"12:00", name:"Morning Show", img:IMAGES.morning, days:[1,2,3,4,5,6], websiteUrl: `${DEFAULT_WEBSITE}morning-show`, desc: "Inspiration and worship to start your day."},
    {start:"07:00", end:"12:00", name:"Sunday Morning With Christ", img:IMAGES.sunday, days:[0], websiteUrl: `${DEFAULT_WEBSITE}sunday-morning`, desc: "Sunday reflection and praise."},
    {start:"12:00", end:"13:00", name:"Praise FM Worship", img:IMAGES.worship, websiteUrl: `${DEFAULT_WEBSITE}worship`, desc: "The finest worship music."},
    {start:"13:00", end:"16:00", name:"Midday Grace", img:IMAGES.midday, websiteUrl: `${DEFAULT_WEBSITE}midday-grace`, desc: "Michael Ray brings grace through the midday."},
    {start:"16:00", end:"17:00", name:"Praise FM Non Stop", img:IMAGES.nonstop, websiteUrl: `${DEFAULT_WEBSITE}non-stop`, desc: "Non-stop praise hits."},
    {start:"17:00", end:"18:00", name:"Future Artists", img:IMAGES.futureArtists, websiteUrl: `${DEFAULT_WEBSITE}future-artists`, desc: "Emerging talent in worship."},
    {start:"18:00", end:"20:00", name:"Praise FM Carpool", img:IMAGES.carpool, days:[1,2,3,4,5,6], websiteUrl: `${DEFAULT_WEBSITE}carpool`, desc: "Tunes for your drive home."},
    {start:"18:00", end:"20:00", name:"Praise FM Worship", days:[0], img:IMAGES.worship, websiteUrl: `${DEFAULT_WEBSITE}worship`, desc: "Sunday praise session."},
    {start:"20:00", end:"21:00", name:"Praise FM POP", days:[1,2,4,5,6,0], img:IMAGES.pop, websiteUrl: `${DEFAULT_WEBSITE}pop`, desc: "Contemporary praise hits."},
    {start:"20:00", end:"21:00", name:"Praise FM Live Show", days:[3], img:IMAGES.liveShow, websiteUrl: `${DEFAULT_WEBSITE}live-show`, desc: "Live sessions and guests."},
    {start:"21:00", end:"22:00", name:"Praise FM Classics", img:IMAGES.classics, websiteUrl: `${DEFAULT_WEBSITE}classics`, desc: "Timeless anthems of faith."},
    {start:"22:00", end:"22:30", name:"Living The Message", img:IMAGES.livingMessage, days:[0], websiteUrl: `${DEFAULT_WEBSITE}living-the-message`, desc: "Deep dive into the Word."},
    {start:"22:00", end:"00:00", name:"Praise FM Worship", days:[1,2,3,4,5,6], img:IMAGES.worship, websiteUrl: `${DEFAULT_WEBSITE}worship`, desc: "Nightly worship session."}
];

export const MUSIC_BY_GENRE: Record<string, Track[]> = {
  "Worship": [
    { id: 'w-1', title: "Ain't He", artist: 'Worship Collective', image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800", audioUrl: 'https://github.com/praisefmmedia/musics/releases/download/V1/Ain.t.He.mp3' },
    { id: 'w-2', title: 'Blesser', artist: 'Grace & Truth', image: "https://images.unsplash.com/photo-1499415479124-43c32433a620?q=80&w=800", audioUrl: 'https://github.com/praisefmmedia/musics/releases/download/V1/Blesser.mp3' }
  ]
};

export const ON_DEMAND_EPISODES: Track[] = [];

export const DAILY_VERSES = [
  { day: "Sunday", verse: "This is the day the Lord has made; let us rejoice and be glad in it.", ref: "Psalms 118:24" },
  { day: "Monday", verse: "Fear not, for I am with you; be not dismayed, for I am your God.", ref: "Isaiah 41:10" },
  { day: "Tuesday", verse: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" },
  { day: "Wednesday", verse: "The Lord is my shepherd; I shall not want.", ref: "Psalms 23:1" },
  { day: "Thursday", verse: "Trust in the Lord with all your heart.", ref: "Proverbs 3:5" },
  { day: "Friday", verse: "Come to me, all who labor and are heavy laden, and I will give you rest.", ref: "Matthew 11:28" },
  { day: "Saturday", verse: "Oh give thanks to the Lord, for he is good.", ref: "1 Chronicles 16:34" }
];
