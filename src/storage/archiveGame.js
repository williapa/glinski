export default function archiveGame(gameState) {
  const timestamp = new Date().toISOString();
  localStorage.setItem(`game-${timestamp}`, JSON.stringify(gameState));
  // Optionally remove or reset the current game
  localStorage.removeItem(CURRENT_GAME_KEY);
}
