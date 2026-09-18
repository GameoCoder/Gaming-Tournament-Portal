import {
  STORAGE_KEYS,
  clearCurrentUser,
  defaultAnnouncements,
  defaultLeaderboard,
  ensureDefaults,
  getCurrentUser,
  parse,
  reactionOptions,
  save,
  tournaments
} from "../common.js";

const roleRoutes = {
  player: "player.html",
  organizer: "organizer.html",
  spectator: "spectator.html"
};

export function initPortal(requiredRole) {
  ensureDefaults();
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "../auth/login.html";
    return null;
  }
  if (requiredRole && user.role !== requiredRole) {
    window.location.href = roleRoutes[user.role] || roleRoutes.player;
    return null;
  }

  const welcome = document.getElementById("welcome-text");
  const roleText = document.getElementById("role-text");
  if (welcome) welcome.textContent = `Welcome, ${user.username}`;
  if (roleText) roleText.textContent = `Role: ${user.role}`;

  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      clearCurrentUser();
      window.location.href = "../auth/login.html";
    });
  }

  return user;
}

export function renderLeaderboard() {
  const body = document.getElementById("leaderboard-body");
  if (!body) return;
  const board = parse(STORAGE_KEYS.leaderboard, defaultLeaderboard);
  body.innerHTML = board
    .sort((a, b) => b.points - a.points)
    .map((row) => `<tr><td>${row.name}</td><td>${row.points}</td></tr>`)
    .join("");
}

export function renderAnnouncements() {
  const list = document.getElementById("announcement-list");
  if (!list) return;
  const announcements = parse(STORAGE_KEYS.announcements, defaultAnnouncements);
  list.innerHTML = announcements.map((entry) => `<li>${entry}</li>`).join("");
}

export function renderReactions() {
  const box = document.getElementById("reaction-box");
  if (!box) return;
  const counts = parse(STORAGE_KEYS.reactions, {});
  box.innerHTML = "";
  reactionOptions.forEach((emoji) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${emoji} ${counts[emoji] || 0}`;
    button.addEventListener("click", () => {
      counts[emoji] = (counts[emoji] || 0) + 1;
      save(STORAGE_KEYS.reactions, counts);
      renderReactions();
    });
    box.appendChild(button);
  });
}

export function renderTournamentSelects(selectIds) {
  const options = tournaments.map((tournament) => `<option value="${tournament.id}">${tournament.name}</option>`).join("");
  selectIds.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.innerHTML = options;
    }
  });
}

export { STORAGE_KEYS, parse, save, tournaments, defaultLeaderboard, defaultAnnouncements };
