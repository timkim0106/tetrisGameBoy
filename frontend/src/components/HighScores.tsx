import React from 'react';

interface HighScore {
  name: string;
  score: number;
}

interface HighScoresProps {
  scores: HighScore[];
}

const HighScores: React.FC<HighScoresProps> = ({ scores }) => {
  return (
    <div className="high-scores">
      <h2>High Scores</h2>
      <ul>
        {scores.map((score, index) => (
          <li key={index}>
            {score.name}: {score.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HighScores;