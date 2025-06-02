'use client'
import Testimonals from '@/Component/Testimonal';
import React, { useState, useEffect, useCallback } from 'react';

// Helper function to create a deep copy of a 2D array
const deepCopy = (arr) => arr.map(row => [...row]);

// Initial Sudoku board (0 represents empty cells)
const initialPuzzle = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

function App() {
  const [board, setBoard] = useState(deepCopy(initialPuzzle));
  const [initialBoard, setInitialBoard] = useState(deepCopy(initialPuzzle));
  const [message, setMessage] = useState('');

  // Function to check if a number can be placed at a given position
  const isValid = useCallback((currentBoard, row, col, num) => {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (currentBoard[row][x] === num) {
        return false;
      }
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (currentBoard[x][col] === num) {
        return false;
      }
    }

    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (currentBoard[i + startRow][j + startCol] === num) {
          return false;
        }
      }
    }
    return true;
  }, []);

  // Sudoku solver using backtracking
  const solveSudoku = useCallback((currentBoard) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (currentBoard[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(currentBoard, row, col, num)) {
              currentBoard[row][col] = num;
              if (solveSudoku(currentBoard)) {
                return true;
              } else {
                currentBoard[row][col] = 0; // Backtrack
              }
            }
          }
          return false; // No number works for this cell
        }
      }
    }
    return true; // Board is solved
  }, [isValid]);

  const handleSolve = () => {
    const boardToSolve = deepCopy(board);
    if (solveSudoku(boardToSolve)) {
      setBoard(boardToSolve);
      setMessage('Puzzle solved!');
    } else {
      setMessage('Cannot solve this puzzle with current numbers.');
    }
  };

  const handleReset = () => {
    setBoard(deepCopy(initialPuzzle));
    setInitialBoard(deepCopy(initialPuzzle)); // Re-initialize initial board
    setMessage('Board reset!');
  };

  const handleInputChange = (e, row, col) => {
    const value = e.target.value;
    // Allow empty string or single digit 1-9
    if (value === '' || (/^[1-9]$/.test(value) && value.length === 1)) {
      const newBoard = deepCopy(board);
      newBoard[row][col] = value === '' ? 0 : parseInt(value, 10);
      setBoard(newBoard);
      setMessage(''); // Clear message on input
    }
  };

  // Check if the current board is complete and valid
  const checkCompletion = () => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) {
          return false; // Board is not complete
        }
        // Temporarily set to 0 to check validity of current number
        const temp = board[r][c];
        board[r][c] = 0;
        if (!isValid(board, r, c, temp)) {
          board[r][c] = temp; // Restore
          return false; // Board is not valid
        }
        board[r][c] = temp; // Restore
      }
    }
    return true; // Board is complete and valid
  };

  const handleCheck = () => {
    if (checkCompletion()) {
      setMessage('Congratulations! You solved it correctly!');
    } else {
      setMessage('Keep going! The current solution is not yet correct or complete.');
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
        <h1 className="text-4xl font-extrabold text-center text-purple-800 mb-8 tracking-tight">
          Sudoku Fun!
        </h1>

        <div className="grid grid-cols-9 gap-0.5 border-4 border-purple-700 rounded-lg overflow-hidden mb-8">
          {board.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((cell, colIndex) => (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  type="text"
                  maxLength="1"
                  value={cell === 0 ? '' : cell}
                  onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                  disabled={initialBoard[rowIndex][colIndex] !== 0}
                  className={`
                    w-full h-10 text-center text-xl font-semibold
                    bg-white focus:outline-none focus:ring-2 focus:ring-purple-400
                    transition-all duration-150 ease-in-out
                    ${initialBoard[rowIndex][colIndex] !== 0
                      ? 'bg-purple-50 text-purple-900 cursor-not-allowed font-bold'
                      : 'text-gray-800 hover:bg-purple-50'
                    }
                    ${(colIndex + 1) % 3 === 0 && colIndex !== 8 ? 'border-r-2 border-purple-500' : ''}
                    ${(rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? 'border-b-2 border-purple-500' : ''}
                    ${colIndex % 3 === 0 && colIndex !== 0 ? 'border-l-2 border-purple-500' : ''}
                    ${rowIndex % 3 === 0 && rowIndex !== 0 ? 'border-t-2 border-purple-500' : ''}
                  `}
                  style={{
                    // Ensure consistent cell sizing and border application
                    gridColumn: `span 1`,
                    gridRow: `span 1`,
                    borderTopWidth: rowIndex % 3 === 0 && rowIndex !== 0 ? '2px' : '0px',
                    borderLeftWidth: colIndex % 3 === 0 && colIndex !== 0 ? '2px' : '0px',
                    borderBottomWidth: (rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? '2px' : '0px',
                    borderRightWidth: (colIndex + 1) % 3 === 0 && colIndex !== 8 ? '2px' : '0px',
                    borderColor: '#8B5CF6', // Tailwind purple-500
                  }}
                />
              ))}
            </React.Fragment>
          ))}
        </div>

        {message && (
          <div className="mb-6 p-3 text-center text-lg font-medium text-purple-700 bg-purple-100 rounded-lg shadow-inner">
            {message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleSolve}
            className="flex-1 px-6 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-md
                       hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300
                       transition duration-200 ease-in-out transform hover:scale-105"
          >
            Solve Puzzle
          </button>
          <button
            onClick={handleReset}
            className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 font-bold rounded-lg shadow-md
                       hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200
                       transition duration-200 ease-in-out transform hover:scale-105"
          >
            Reset Board
          </button>
          <button
            onClick={handleCheck}
            className="flex-1 px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md
                       hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300
                       transition duration-200 ease-in-out transform hover:scale-105"
          >
            Check Solution
          </button>
        </div>
      </div>
      {/* Tailwind CSS CDN */}
      <script src="https://cdn.tailwindcss.com"></script>
      {/* Inter font for better typography */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
    </div>
    <Testimonals/>
    </>
  );
}

export default App;
