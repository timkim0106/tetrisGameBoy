import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import HighScores from './components/HighScores';
import { fetchHighScores, postHighScore } from './utils/api';
import './styles.css';  

const App: React.FC = () => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScores, setHighScores] = useState<Array<{ name: string; score: number }>>([]);

  useEffect(() => {
    loadHighScores();
  }, []);

  const loadHighScores = async () => {
    const scores = await fetchHighScores();
    setHighScores(scores);
  };

  const handleGameOver = async (finalScore: number) => {
    setGameOver(true);
    const playerName = prompt('Game Over! Enter your name for the high score:');
    if (playerName) {
      await postHighScore(playerName, finalScore);
      loadHighScores();
    }
  };

  const handleRestart = () => {
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="app">
      <h1>Tetris Clone</h1>
      <div className="game-container">
        <Board
          onScoreUpdate={setScore}
          onGameOver={handleGameOver}
          gameOver={gameOver}
        />
        <div className="info-panel">
          <h2>Score: {score}</h2>
          {gameOver && <button onClick={handleRestart}>Restart</button>}
          <HighScores scores={highScores} />
        </div>
      </div>
    </div>
  );
};

export default App;