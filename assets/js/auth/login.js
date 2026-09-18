import { STORAGE_KEYS, ensureDefaults, getCurrentUser, hashPassword, parse, setCurrentUser } from "../common.js";

const message = document.getElementById("auth-message");
const form = document.getElementById("login-form");

const roleRoutes = {
  player: "../portal/player.html",
  organizer: "../portal/organizer.html",
  spectator: "../portal/spectator.html"
};

function setMessage(text, isError = false) {
  message.textContent = text;
  message.style.color = isError ? "#fca5a5" : "#86efac";
}

function redirectIfSessionExists() {
  const user = getCurrentUser();
  if (!user) return;
  window.location.href = roleRoutes[user.role] || roleRoutes.player;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const password = document.getElementById("login-password").value;

  let passwordHash;
  try {
    passwordHash = await hashPassword(password);
  } catch (error) {
    setMessage(error.message, true);
    return;
  }

  const users = parse(STORAGE_KEYS.users, []);
  const user = users.find((entry) => entry.email === email && entry.passwordHash === passwordHash);

  if (!user) {
    setMessage("Invalid email or password.", true);
    return;
  }

  setCurrentUser({ username: user.username, email: user.email, role: user.role });
  window.location.href = roleRoutes[user.role] || roleRoutes.player;
});

ensureDefaults();
redirectIfSessionExists();
