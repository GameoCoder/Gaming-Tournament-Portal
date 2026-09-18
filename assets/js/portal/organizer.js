import {
  defaultAnnouncements,
  defaultLeaderboard,
  initPortal,
  parse,
  renderAnnouncements,
  renderLeaderboard,
  renderTournamentSelects,
  save,
  STORAGE_KEYS,
  tournaments
} from "./shared.js";

const user = initPortal("organizer");
if (!user) {
  // Redirect handled in initPortal.
} else {
  renderTournamentSelects(["result-tournament", "prize-tournament"]);
  renderOrganizerRegistrations();
  renderLeaderboard();
  renderAnnouncements();
  bindResultForm();
  bindPrizeForm();
  bindAnnouncementForm();
}

function renderOrganizerRegistrations() {
  const registrations = parse(STORAGE_KEYS.registrations, {});
  const prizes = parse(STORAGE_KEYS.prizes, {});
  const container = document.getElementById("organizer-registrations");

  container.innerHTML = tournaments
    .map((tournament) => {
      const players = registrations[tournament.id] || [];
      const prize = prizes[tournament.id] ? ` | Prize: ${prizes[tournament.id]}` : "";
      return `<p><strong>${tournament.name}</strong>: ${players.length} registered${prize}</p>`;
    })
    .join("");
}

function bindResultForm() {
  const form = document.getElementById("result-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const winner = document.getElementById("result-winner").value.trim();
    const points = Number(document.getElementById("result-points").value);
    if (!winner || Number.isNaN(points) || points < 1) return;

    const board = parse(STORAGE_KEYS.leaderboard, defaultLeaderboard);
    const existing = board.find((entry) => entry.name.toLowerCase() === winner.toLowerCase());
    if (existing) {
      existing.points += points;
    } else {
      board.push({ name: winner, points });
    }

    save(STORAGE_KEYS.leaderboard, board);
    form.reset();
    renderLeaderboard();
  });
}

function bindPrizeForm() {
  const form = document.getElementById("prize-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const tournamentId = document.getElementById("prize-tournament").value;
    const details = document.getElementById("prize-details").value.trim();
    if (!tournamentId || !details) return;

    const prizes = parse(STORAGE_KEYS.prizes, {});
    prizes[tournamentId] = details;
    save(STORAGE_KEYS.prizes, prizes);
    form.reset();
    renderOrganizerRegistrations();
  });
}

function bindAnnouncementForm() {
  const form = document.getElementById("announcement-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = document.getElementById("announcement-text").value.trim();
    if (!message) return;

    const announcements = parse(STORAGE_KEYS.announcements, defaultAnnouncements);
    announcements.unshift(message);
    save(STORAGE_KEYS.announcements, announcements.slice(0, 12));
    form.reset();
    renderAnnouncements();
  });
}
