export default function saveGame(gameState) {
  localStorage.setItem('current-game', JSON.stringify(gameState));
}
