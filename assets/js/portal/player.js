import { initPortal, renderAnnouncements, renderLeaderboard, renderReactions, STORAGE_KEYS, parse, save, tournaments } from "./shared.js";

const user = initPortal("player");
if (!user) {
  // Redirect handled in initPortal.
} else {
  renderTournaments();
  renderRegistrations();
  renderTeams();
  renderLeaderboard();
  renderAnnouncements();
  renderReactions();
  bindTeamForm();
}

function renderTournaments() {
  const container = document.getElementById("tournament-list");
  const registrations = parse(STORAGE_KEYS.registrations, {});
  container.innerHTML = "";

  tournaments.forEach((tournament) => {
    const card = document.createElement("div");
    card.className = "panel";
    card.innerHTML = `<strong>${tournament.name}</strong><p class="muted">${tournament.date} • ${tournament.mode}</p>`;

    const button = document.createElement("button");
    button.type = "button";
    const isRegistered = (registrations[tournament.id] || []).includes(user.email);
    button.textContent = isRegistered ? "Registered" : "Register";
    button.disabled = isRegistered;
    button.addEventListener("click", () => {
      const latest = parse(STORAGE_KEYS.registrations, {});
      const players = latest[tournament.id] || [];
      if (!players.includes(user.email)) {
        players.push(user.email);
        latest[tournament.id] = players;
        save(STORAGE_KEYS.registrations, latest);
        renderTournaments();
        renderRegistrations();
      }
    });

    card.appendChild(button);
    container.appendChild(card);
  });
}

function renderRegistrations() {
  const list = document.getElementById("registration-list");
  const registrations = parse(STORAGE_KEYS.registrations, {});
  const myEvents = tournaments.filter((event) => (registrations[event.id] || []).includes(user.email));
  list.innerHTML = myEvents.length
    ? myEvents.map((event) => `<li>${event.name} — ${event.date} (${event.mode})</li>`).join("")
    : "<li>No registrations yet.</li>";
}

function bindTeamForm() {
  const form = document.getElementById("team-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("team-name").value.trim();
    const members = document.getElementById("team-members").value
      .split(",")
      .map((member) => member.trim())
      .filter(Boolean);

    if (!name || members.length === 0) return;

    const teams = parse(STORAGE_KEYS.teams, []);
    teams.push({ owner: user.email, name, members });
    save(STORAGE_KEYS.teams, teams);
    form.reset();
    renderTeams();
  });
}

function renderTeams() {
  const list = document.getElementById("team-list");
  const teams = parse(STORAGE_KEYS.teams, []).filter((team) => team.owner === user.email);
  list.innerHTML = teams.length
    ? teams.map((team) => `<li>${team.name}: ${team.members.join(", ")}</li>`).join("")
    : "<li>No teams created yet.</li>";
}
