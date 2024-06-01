export default function archiveGame(newGameState) {
  const gameState = localStorage.getItem('current-game');
  const timestamp = JSON.parse(gameState).gameConfig.startTime;
  localStorage.setItem(`game-${timestamp}`, gameState);
  localStorage.setItem('current-game', JSON.stringify(newGameState));
}
