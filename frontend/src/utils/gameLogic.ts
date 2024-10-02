import { BOARD_WIDTH, BOARD_HEIGHT } from './constants';

export const checkCollision = (
  grid: number[][],
  piece: number[][],
  x: number,
  y: number
): boolean => {
  for (let row = 0; row < piece.length; row++) {
    for (let col = 0; col < piece[row].length; col++) {
      if (piece[row][col] !== 0) {
        const newY = y + row;
        const newX = x + col;

        if (
          newY >= BOARD_HEIGHT ||
          newX < 0 ||
          newX >= BOARD_WIDTH ||
          (newY >= 0 && grid[newY][newX] !== 0)
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

export const clearLines = (grid: number[][]): { clearedLines: number; updatedGrid: number[][] } => {
  let clearedLines = 0;
  const updatedGrid = grid.filter(row => {
    if (row.every(cell => cell !== 0)) {
      clearedLines++;
      return false;
    }
    return true;
  });

  while (updatedGrid.length < BOARD_HEIGHT) {
    updatedGrid.unshift(Array(BOARD_WIDTH).fill(0));
  }

  return { clearedLines, updatedGrid };
};

