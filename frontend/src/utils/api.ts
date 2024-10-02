import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const fetchHighScores = async () => {
  try {
    const response = await axios.get(`${API_URL}/highscores`);
    return response.data;
  } catch (error) {
    console.error('Error fetching high scores:', error);
    return [];
  }
};

export const postHighScore = async (name: string, score: number) => {
  try {
    await axios.post(`${API_URL}/highscores`, { name, score });
  } catch (error) {
    console.error('Error posting high score:', error);
  }
};