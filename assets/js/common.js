export const STORAGE_KEYS = {
  users: "gtp_users",
  session: "gtp_session",
  registrations: "gtp_registrations",
  teams: "gtp_teams",
  leaderboard: "gtp_leaderboard",
  announcements: "gtp_announcements",
  prizes: "gtp_prizes",
  reactions: "gtp_reactions"
};

export const tournaments = [
  { id: "valorant-cup", name: "Valorant Weekend Cup", date: "2026-10-01 17:00", mode: "Online" },
  { id: "fifa-clash", name: "FIFA Arena Clash", date: "2026-10-03 14:00", mode: "In-person" },
  { id: "bgmi-showdown", name: "BGMI Showdown", date: "2026-10-05 19:00", mode: "Online" }
];

export const defaultLeaderboard = [
  { name: "Team Phoenix", points: 30 },
  { name: "Night Raiders", points: 25 },
  { name: "Pixel Squad", points: 20 }
];

export const defaultAnnouncements = [
  "Welcome to the Gaming Tournament Portal.",
  "Registrations are open for all listed tournaments."
];

export const reactionOptions = ["🔥", "👏", "🎮", "🏆"];

export const parse = (key, fallback) => {
  const value = localStorage.getItem(key);
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export async function hashPassword(password) {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error("Secure password hashing is not supported in this browser.");
  }
  const bytes = new TextEncoder().encode(password);
  const digest = await window.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function ensureDefaults() {
  if (!localStorage.getItem(STORAGE_KEYS.leaderboard)) {
    save(STORAGE_KEYS.leaderboard, defaultLeaderboard);
  }
  if (!localStorage.getItem(STORAGE_KEYS.announcements)) {
    save(STORAGE_KEYS.announcements, defaultAnnouncements);
  }
  if (!localStorage.getItem(STORAGE_KEYS.reactions)) {
    save(STORAGE_KEYS.reactions, Object.fromEntries(reactionOptions.map((emoji) => [emoji, 0])));
  }
}

export function getCurrentUser() {
  return parse(STORAGE_KEYS.session, null);
}

export function setCurrentUser(user) {
  save(STORAGE_KEYS.session, user);
}

export function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEYS.session);
}
