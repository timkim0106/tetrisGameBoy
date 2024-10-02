import { TETROMINOES } from '../utils/tetrominos.ts';

export class Piece {
  shape: number[][];
  x: number;
  y: number;

  constructor() {
    const tetromino = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
    this.shape = tetromino.shape;
    this.x = Math.floor(Math.random() * (10 - tetromino.shape[0].length));
    this.y = 0;
  }
}