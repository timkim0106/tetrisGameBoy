import express from 'express';
import pool from '../config/db';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM highscores ORDER BY score DESC LIMIT 10');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching high scores:', error);
    res.status(500).json({ message: 'Error fetching high scores' });
  }
});

router.post('/', async (req, res) => {
  const { name, score } = req.body;
  try {
    await pool.query('INSERT INTO highscores (name, score) VALUES (?, ?)', [name, score]);
    res.status(201).json({ message: 'High score added successfully' });
  } catch (error) {
    console.error('Error adding high score:', error);
    res.status(500).json({ message: 'Error adding high score' });
  }
});

export default router;