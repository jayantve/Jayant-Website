'use client'

import Testimonals from '@/Component/UI-Blocks';
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Game constants
const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const MAX_COORD = CANVAS_SIZE / GRID_SIZE;

// Helper function to draw a square
const drawSquare = (ctx, x, y, color, strokeColor = '#2d3748') => {
  ctx.fillStyle = color;
  ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
  ctx.strokeStyle = strokeColor;
  ctx.strokeRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
};

// Main App component for the Snake game
export default function App() {
  // State variables for game logic
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({});
  const [direction, setDirection] = useState('right');
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(true);
  const [isPaused, setIsPaused] = useState(false); // New state for pause/play
  const [gameSpeed, setGameSpeed] = useState(150);
  const [changingDirection, setChangingDirection] = useState(false);
  const [message, setMessage] = useState({
    title: 'Welcome to Snake!',
    text: 'Use arrow keys or touch controls to move the snake. Eat the red food to grow!',
    buttonText: 'Start Game',
    isVisible: true,
  });

  // Refs for canvas and game interval
  const canvasRef = useRef(null);
  const gameIntervalRef = useRef(null);

  // Function to generate random food position
  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * MAX_COORD),
        y: Math.floor(Math.random() * MAX_COORD),
      };
    } while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
    setFood(newFood);
  }, [snake]); // Dependency on snake to ensure food doesn't spawn on it

  // Function to move the snake
  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const head = { x: prevSnake[0].x, y: prevSnake[0].y };

      switch (direction) {
        case 'up':
          head.y--;
          break;
        case 'down':
          head.y++;
          break;
        case 'left':
          head.x--;
          break;
        case 'right':
          head.x++;
          break;
        default:
          break;
      }

      const newSnake = [head, ...prevSnake];

      const didEatFood = head.x === food.x && head.y === food.y;

      if (didEatFood) {
        setScore((prevScore) => prevScore + 1);
        generateFood();
      } else {
        newSnake.pop(); // Remove tail if no food was eaten
      }
      setChangingDirection(false); // Reset flag after move
      return newSnake;
    });
  }, [direction, food, generateFood]); // Dependencies for moveSnake

  // Function to check for collisions
  const checkCollision = useCallback(() => {
    const head = snake[0];

    // Wall collision
    const hitLeftWall = head.x < 0;
    const hitRightWall = head.x >= MAX_COORD;
    const hitTopWall = head.y < 0;
    const hitBottomWall = head.y >= MAX_COORD;

    if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
      return true;
    }

    // Self-collision
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }
    return false;
  }, [snake]); // Dependency on snake for collision check

  // Function to end the game
  const endGame = useCallback(() => {
    setIsGameOver(true);
    setIsPaused(false); // Ensure game is not paused when it ends
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
    }
    setMessage({
      title: 'Game Over!',
      text: `You scored ${score} points!`,
      buttonText: 'Play Again',
      isVisible: true,
    });
  }, [score]); // Dependency on score for game over message

  // Game loop effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw food
    if (food.x !== undefined && food.y !== undefined) {
      drawSquare(ctx, food.x, food.y, '#f56565'); // Red for food
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const color = index === 0 ? '#4299e1' : '#63b3ed'; // Blue for head, lighter blue for body
      drawSquare(ctx, segment.x, segment.y, color);
    });

    // Game loop logic: runs only if not game over and not paused
    if (!isGameOver && !isPaused) {
      gameIntervalRef.current = setInterval(() => {
        moveSnake();
        if (checkCollision()) {
          endGame();
        }
      }, gameSpeed);
    }

    // Cleanup function for the interval
    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    };
  }, [snake, food, isGameOver, isPaused, gameSpeed, moveSnake, checkCollision, endGame]); // Dependencies for game loop

  // Keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (changingDirection) return;

      const keyPressed = e.key;
      const goingUp = direction === 'up';
      const goingDown = direction === 'down';
      const goingLeft = direction === 'left';
      const goingRight = direction === 'right';

      // Allow pausing/playing with 'Space' key
      if (keyPressed === ' ') {
        if (!isGameOver) { // Only allow pause/play if game is not over
          setIsPaused(prev => !prev);
        }
        return; // Prevent default space behavior (scrolling)
      }

      // Only allow direction changes if game is not over and not paused
      if (isGameOver || isPaused) return;

      if (keyPressed === 'ArrowLeft' && !goingRight) {
        setDirection('left');
        setChangingDirection(true);
      } else if (keyPressed === 'ArrowUp' && !goingDown) {
        setDirection('up');
        setChangingDirection(true);
      } else if (keyPressed === 'ArrowRight' && !goingLeft) {
        setDirection('right');
        setChangingDirection(true);
      } else if (keyPressed === 'ArrowDown' && !goingUp) {
        setDirection('down');
        setChangingDirection(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [direction, changingDirection, isGameOver, isPaused]); // Dependencies for keyboard listener

  // Function to initialize/restart the game
  const initGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('right');
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false); // Game starts unpaused
    setGameSpeed(150);
    setChangingDirection(false);
    generateFood();
    setMessage({ ...message, isVisible: false }); // Hide message box
  };

  // Toggle pause state
  const togglePause = () => {
    if (!isGameOver) { // Only allow toggling if game is not over
      setIsPaused(prev => !prev);
    }
  };

  // Handle mobile control clicks
  const handleControlClick = (newDirection) => {
    if (changingDirection || isGameOver || isPaused) return; // Prevent changes if paused or game over

    const goingUp = direction === 'up';
    const goingDown = direction === 'down';
    const goingLeft = direction === 'left';
    const goingRight = direction === 'right';

    if (newDirection === 'left' && !goingRight) {
      setDirection('left');
      setChangingDirection(true);
    } else if (newDirection === 'up' && !goingDown) {
      setDirection('up');
      setChangingDirection(true);
    } else if (newDirection === 'right' && !goingLeft) {
      setDirection('right');
      setChangingDirection(true);
    } else if (newDirection === 'down' && !goingUp) {
      setDirection('down');
      setChangingDirection(true);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center justify-center p-4 font-inter">
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-8 drop-shadow-lg">
        Snake Game
      </h1>

      <div className="game-container flex flex-col items-center">
        <canvas
          id="gameCanvas"
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="mb-4 bg-gray-200 border-4 border-gray-700 rounded-xl shadow-lg touch-action-none"
        ></canvas>

        <div className="game-info text-2xl font-semibold text-gray-700 mb-6">
          Score: <span id="score">{score}</span>
        </div>

        <div className="flex space-x-4 mb-4"> {/* Container for buttons */}
          <button
            id="startButton"
            onClick={initGame}
            className={`px-8 py-4 text-white text-xl font-bold rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4
              ${isGameOver ? 'bg-green-600 hover:bg-green-700 focus:ring-green-300' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300'}`}
          >
            {isGameOver ? 'Start Game' : 'Restart Game'} {/* Changed 'Playing...' to 'Restart Game' */}
          </button>

          {!isGameOver && ( // Only show pause/play button if game is not over
            <button
              id="pausePlayButton"
              onClick={togglePause}
              className={`px-8 py-4 text-white text-xl font-bold rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4
                ${isPaused ? 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-300' : 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-300'}`}
            >
              {isPaused ? 'Play' : 'Pause'}
            </button>
          )}
        </div>

        {/* Message Box */}
        {message.isVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full mx-4">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {message.title}
              </h2>
              <p className="text-lg text-gray-600 mb-6">{message.text}</p>
              <button
                onClick={initGame}
                className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-full hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                {message.buttonText}
              </button>
            </div>
          </div>
        )}

        {/* Mobile Controls */}
        <div className="controls-container md:hidden mt-8">
          <button
            className="control-button control-up"
            onClick={() => handleControlClick('up')}
          >
            ⬆️
          </button>
          <button
            className="control-button control-left"
            onClick={() => handleControlClick('left')}
          >
            ⬅️
          </button>
          <button
            className="control-button control-right"
            onClick={() => handleControlClick('right')}
          >
            ➡️
          </button>
          <button
            className="control-button control-down"
            onClick={() => handleControlClick('down')}
          >
            ⬇️
          </button>
        </div>
      </div>
    </div>
    <Testimonals/>
    </>
  );
}
