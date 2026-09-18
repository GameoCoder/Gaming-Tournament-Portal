import { STORAGE_KEYS, ensureDefaults, getCurrentUser, hashPassword, parse, save } from "../common.js";

const message = document.getElementById("auth-message");
const form = document.getElementById("signup-form");

function setMessage(text, isError = false) {
  message.textContent = text;
  message.style.color = isError ? "#fca5a5" : "#86efac";
}

function redirectIfSessionExists() {
  if (getCurrentUser()) {
    window.location.href = "login.html";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const userInput = {
    username: document.getElementById("signup-username").value.trim(),
    email: document.getElementById("signup-email").value.trim().toLowerCase(),
    password: document.getElementById("signup-password").value,
    role: document.getElementById("signup-role").value
  };

  if (!userInput.username || !userInput.email || !userInput.password) {
    setMessage("Please fill all signup fields.", true);
    return;
  }

  const users = parse(STORAGE_KEYS.users, []);
  if (users.some((entry) => entry.email === userInput.email)) {
    setMessage("This email is already registered. Please login.", true);
    return;
  }

  let passwordHash;
  try {
    passwordHash = await hashPassword(userInput.password);
  } catch (error) {
    setMessage(error.message, true);
    return;
  }

  users.push({
    username: userInput.username,
    email: userInput.email,
    passwordHash,
    role: userInput.role
  });
  save(STORAGE_KEYS.users, users);

  form.reset();
  setMessage("Signup successful. Redirecting to login...");
  setTimeout(() => {
    window.location.href = "login.html";
  }, 800);
});

ensureDefaults();
redirectIfSessionExists();
