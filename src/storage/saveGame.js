export default function saveGame(gameState) {
  localStorage.setItem(CURRENT_GAME_KEY, JSON.stringify(gameState));
}
