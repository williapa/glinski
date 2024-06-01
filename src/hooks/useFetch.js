import { useState, useEffect } from 'react';

const CURRENT_GAME_KEY = 'current-game';

function loadGame() {
  const gameData = localStorage.getItem(CURRENT_GAME_KEY);
  if (gameData) {
    return JSON.parse(gameData);
  } else {
    console.error('something broke 112');
  }
}

function useFetch() {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    try {
      const gameData = loadGame();
      setData(gameData);
    } catch (err) {
      setError(new Error('Failed to load game data'));
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error };
}

export default useFetch;
