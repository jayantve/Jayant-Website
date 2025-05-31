'use client'
import Testimonals from '@/Component/UI-Blocks';
import React, { useState, useEffect } from 'react';

// Helper function to calculate the winner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // Returns 'X' or 'O'
    }
  }
  return null; // No winner yet
}

// Square component for each cell on the board
function Square({ value, onClick }) {
  return (
    <button
      className="w-24 h-24 bg-white border-2 border-gray-300 text-5xl font-bold rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300"
      onClick={onClick}
    >
      <span className={value === 'X' ? 'text-blue-600' : 'text-red-600'}>
        {value}
      </span>
    </button>
  );
}

// Board component to render the 3x3 grid
function Board({ squares, onClick }) {
  const renderSquare = (i) => {
    return <Square value={squares[i]} onClick={() => onClick(i)} />;
  };

  return (
    <div className="grid grid-cols-3 gap-2 p-4 bg-gray-200 rounded-xl shadow-lg">
      {/* Render 9 squares */}
      {Array(9).fill(null).map((_, i) => renderSquare(i))}
    </div>
  );
}

// Main App component for the Tic-Tac-Toe game
export default function App() {
  // State for the board squares, xIsNext (whose turn it is), and game history
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  // Calculate winner based on current squares
  const winner = calculateWinner(squares);
  // Check for a draw (all squares filled and no winner)
  const isDraw = !winner && squares.every(Boolean);

  // Determine the game status message
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = 'Draw!';
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  // Handle a click on a square
  const handleClick = (i) => {
    // If there's a winner or the square is already filled, do nothing
    if (winner || squares[i]) {
      return;
    }

    // Create a copy of the squares array to modify
    const newSquares = squares.slice();
    // Set the value of the clicked square
    newSquares[i] = xIsNext ? 'X' : 'O';

    // Update state
    setSquares(newSquares);
    setXIsNext(!xIsNext); // Toggle player turn
  };

  // Reset the game to its initial state
  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center justify-center p-4 font-inter">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-8 drop-shadow-md">
        Tic-Tac-Toe
      </h1>

      <div className="game-board mb-8">
        <Board squares={squares} onClick={handleClick} />
      </div>

      <div className="game-info text-center">
        <div className="status text-3xl font-semibold text-gray-700 mb-4">
          {status}
        </div>
        <button
          className="px-8 py-3 bg-blue-600 text-white text-xl font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
          onClick={resetGame}
        >
          Reset Game
        </button>
      </div>
    </div>
    <Testimonals/>
    </>
  );
}
