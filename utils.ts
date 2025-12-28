
import { RAW_SCHEDULE, HOSTS_DATA, IMAGES } from './constants';
import { ScheduleItem, Show, User } from './types';

export function getStationTime(): Date {
  const dateString = new Date().toLocaleString("en-US", { timeZone: "America/Chicago" });
  return new Date(dateString);
}

function timeToMins(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function formatTimeToAMPM(t: string | undefined): string {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${suffix}`;
}

export function isShowCurrentlyOnAir(show: Show): boolean {
    if (!show.startTime || !show.endTime) return false;
    const now = getStationTime();
    const day = now.getDay();
    
    // Verifica se o dia atual está na lista de dias do programa (se houver)
    if (show.days && !show.days.includes(day)) return false;
    
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const [sh, sm] = show.startTime.split(':').map(Number);
    const [eh, em] = show.endTime.split(':').map(Number);
    const s = sh * 60 + sm;
    let e = eh * 60 + em;
    if (e <= s) e += 1440; // Caso de programa que vira a noite
    
    return currentMins >= s && currentMins < e;
}

export function calculateShowProgress(start: string, end: string): number {
    const now = getStationTime();
    const currentMins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    const s = timeToMins(start);
    const e = timeToMins(end);
    const endMins = e <= s ? e + 1440 : e;

    if (currentMins >= s && currentMins < endMins) {
        const total = endMins - s;
        const elapsed = currentMins - s;
        return (elapsed / total) * 100;
    }
    return 0;
}

export function formatRange(start: string, end: string): string {
    return `${formatTimeToAMPM(start)} - ${formatTimeToAMPM(end)} CT`;
}

export function mapToShow(item: ScheduleItem, progress?: number): Show {
    const hostInfo = HOSTS_DATA[item.name] || { name: 'Praise FM', bio: 'Continuous praise and worship.' };
    return {
        id: item.name + item.start,
        title: item.name,
        timeSlot: formatRange(item.start, item.end),
        description: item.desc,
        presenter: {
            id: hostInfo.name,
            name: hostInfo.name,
            image: item.img || IMAGES.default
        },
        image: item.img || IMAGES.default,
        isLive: progress !== undefined,
        progress: progress,
        startTime: item.start,
        endTime: item.end,
        days: item.days,
        websiteUrl: item.websiteUrl
    };
}

export function findShowByName(name: string): Show | null {
  const item = RAW_SCHEDULE.find(s => s.name === name);
  return item ? mapToShow(item) : null;
}

export function getCurrentAndNextShows() {
    const now = getStationTime();
    const day = now.getDay();
    const currentMins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    
    let current: ScheduleItem | null = null;
    const future: { prog: ScheduleItem, startMins: number }[] = [];
    let currentProgress = 0;

    for (const p of RAW_SCHEDULE) {
        if (p.days && !p.days.includes(day)) continue;
        const s = timeToMins(p.start);
        const e = timeToMins(p.end);
        const end = e <= s ? e + 1440 : e;

        if (currentMins >= s && currentMins < end) {
            if (!current || end > timeToMins(current.end)) {
                current = p;
                const total = end - s;
                const elapsed = currentMins - s;
                if (total > 0) {
                    currentProgress = (elapsed / total) * 100;
                }
            }
        }
        if (currentMins < s) {
            future.push({ prog: p, startMins: s });
        }
    }

    future.sort((a, b) => a.startMins - b.startMins);

    if (future.length < 2) {
        const tomorrow = (day + 1) % 7;
        const tomorrowShows: { prog: ScheduleItem, startMins: number }[] = [];
        for (const p of RAW_SCHEDULE) {
            if (!p.days || p.days.includes(tomorrow)) {
                tomorrowShows.push({ prog: p, startMins: timeToMins(p.start) });
            }
        }
        tomorrowShows.sort((a, b) => a.startMins - b.startMins);
        future.push(...tomorrowShows);
    }

    const defaultShow: ScheduleItem = { start: "00:00", end: "23:59", name: "Praise FM", img: IMAGES.default, desc: "Praise & Worship" };

    return {
        current: mapToShow(current || defaultShow, currentProgress),
        next1: future[0] ? mapToShow(future[0].prog) : null,
        next2: future[1] ? mapToShow(future[1].prog) : null
    };
}

export function getTodaysSchedule(): Show[] {
    const now = getStationTime();
    const day = now.getDay();
    const todays = RAW_SCHEDULE.filter(p => !p.days || p.days.includes(day));
    todays.sort((a, b) => a.start.localeCompare(b.start));
    return todays.map(s => mapToShow(s));
}

export async function fetchAlbumCover(artist: string, title: string): Promise<string> {
    if (!artist || !title || artist === "Praise FM") return IMAGES.default;
    const query = encodeURIComponent(`${artist} ${title}`);
    const url = `https://itunes.apple.com/search?term=${query}&entity=song&limit=1`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    try {
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) return IMAGES.default;
        const data = await res.json();
        if (data.results?.[0]?.artworkUrl100) {
            return data.results[0].artworkUrl100.replace('100x100', '600x600');
        }
    } catch (e) {
        return IMAGES.default;
    } finally {
        clearTimeout(timeoutId);
    }
    return IMAGES.default;
}
