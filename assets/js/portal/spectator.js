import { initPortal, renderAnnouncements, renderLeaderboard, renderReactions } from "./shared.js";

const user = initPortal("spectator");
if (!user) {
  // Redirect handled in initPortal.
} else {
  renderLeaderboard();
  renderAnnouncements();
  renderReactions();
}
