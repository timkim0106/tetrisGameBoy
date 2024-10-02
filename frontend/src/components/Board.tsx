import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';

import { BOARD_WIDTH, BOARD_HEIGHT, BLOCK_SIZE, COLORS } from '../utils/constants.ts';
import { Piece } from './Piece.tsx';
import { checkCollision, clearLines } from '../utils/gameLogic.ts';

interface BoardProps {
  onScoreUpdate: (score: number) => void;
  onGameOver: (score: number) => void;
  gameOver: boolean;
}

const Board: React.FC<BoardProps> = ({ onScoreUpdate, onGameOver, gameOver }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState<number[][]>(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)));
  const [currentPiece, setCurrentPiece] = useState<Piece>(new Piece());
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (gameOver) return;

    const sketch = (p: p5) => {
      p.setup = () => {
        const canvas = p.createCanvas(BOARD_WIDTH * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);
        canvas.parent(boardRef.current!);
      };

      p.draw = () => {
        p.background(220);
        drawGrid(p);
        drawPiece(p);
        if (p.frameCount % 30 === 0) { // Move piece down every 30 frames
          movePieceDown();
        }
      };

      p.keyPressed = () => {
        if (p.keyCode === p.LEFT_ARROW) movePiece(-1, 0);
        if (p.keyCode === p.RIGHT_ARROW) movePiece(1, 0);
        if (p.keyCode === p.DOWN_ARROW) movePieceDown();
        if (p.keyCode === p.UP_ARROW) rotatePiece();
      };
    };

    const myP5 = new p5(sketch);

    return () => {
      myP5.remove();
    };
  }, [gameOver]);

  const drawGrid = (p: p5) => {
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        p.fill(COLORS[grid[y][x]]);
        p.rect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  };

  const drawPiece = (p: p5) => {
    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          p.fill(COLORS[value]);
          p.rect(
            (currentPiece.x + x) * BLOCK_SIZE,
            (currentPiece.y + y) * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
          );
        }
      });
    });
  };

  const movePiece = (dx: number, dy: number) => {
    const newX = currentPiece.x + dx;
    const newY = currentPiece.y + dy;
    if (!checkCollision(grid, currentPiece.shape, newX, newY)) {
      setCurrentPiece(prevPiece => ({
        ...prevPiece,
        x: newX,
        y: newY,
      }));
    }
  };

  const movePieceDown = () => {
    if (!checkCollision(grid, currentPiece.shape, currentPiece.x, currentPiece.y + 1)) {
      movePiece(0, 1);
    } else {
      placePiece();
    }
  };

  const rotatePiece = () => {
    const rotatedShape = currentPiece.shape[0].map((_, index) =>
      currentPiece.shape.map(row => row[index]).reverse()
    );
    if (!checkCollision(grid, rotatedShape, currentPiece.x, currentPiece.y)) {
      setCurrentPiece(prevPiece => ({
        ...prevPiece,
        shape: rotatedShape,
      }));
    }
  };

  const placePiece = () => {
    const newGrid = grid.map(row => [...row]);
    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          newGrid[currentPiece.y + y][currentPiece.x + x] = value;
        }
      });
    });

    const { clearedLines, updatedGrid } = clearLines(newGrid);
    setGrid(updatedGrid);

    const newScore = score + (clearedLines * 100);
    setScore(newScore);
    onScoreUpdate(newScore);

    if (checkGameOver(updatedGrid)) {
      onGameOver(newScore);
    } else {
      setCurrentPiece(new Piece());
    }
  };

  const checkGameOver = (grid: number[][]): boolean => {
    return grid[0].some(cell => cell !== 0);
  };

  return <div ref={boardRef}></div>;
};

export default Board;