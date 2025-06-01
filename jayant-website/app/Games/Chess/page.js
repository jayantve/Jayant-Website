'use client'
import Testimonals from '@/Component/Testimonal';
import React, { useState, useEffect } from 'react';

// Main App component
const App = () => {
  // Initial board setup (standard chess starting position)
  // 'r': rook, 'n': knight, 'b': bishop, 'q': queen, 'k': king, 'p': pawn
  // Uppercase for White, lowercase for Black
  const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ];

  const [board, setBoard] = useState(initialBoard);
  const [selectedSquare, setSelectedSquare] = useState(null); // { row, col }
  const [turn, setTurn] = useState('white'); // 'white' or 'black'
  const [gameMode, setGameMode] = useState(null); // 'pvp' (Player vs Player) or 'pvc' (Player vs Computer)
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [message, setMessage] = useState(''); // For displaying game messages

  // Function to get piece emoji/SVG based on piece character
  const getPiece = (piece) => {
    if (!piece) return null;
    const isWhite = piece === piece.toUpperCase();
    const pieceType = piece.toLowerCase();

    // Using chess piece emojis for simplicity and broad compatibility
    const pieces = {
      'r': isWhite ? '♖' : '♜',
      'n': isWhite ? '♘' : '♞',
      'b': isWhite ? '♗' : '♝',
      'q': isWhite ? '♕' : '♛',
      'k': isWhite ? '♔' : '♚',
      'p': isWhite ? '♙' : '♟',
    };
    return pieces[pieceType];
  };

  // Function to check if a piece belongs to the current turn's player
  const isPlayersPiece = (piece, currentTurn) => {
    if (!piece) return false;
    const isPieceWhite = piece === piece.toUpperCase();
    return (isPieceWhite && currentTurn === 'white') || (!isPieceWhite && currentTurn === 'black');
  };

  // Helper function to check if a path is clear for sliding pieces (Rook, Bishop, Queen)
  const isPathClear = (startRow, startCol, endRow, endCol, currentBoard) => {
    const rowDiff = Math.abs(startRow - endRow);
    const colDiff = Math.abs(startCol - endCol);

    // Horizontal move
    if (startRow === endRow) {
      const step = (endCol > startCol) ? 1 : -1;
      for (let c = startCol + step; c !== endCol; c += step) {
        if (currentBoard[startRow][c] !== null) return false;
      }
    }
    // Vertical move
    else if (startCol === endCol) {
      const step = (endRow > startRow) ? 1 : -1;
      for (let r = startRow + step; r !== endRow; r += step) {
        if (currentBoard[r][startCol] !== null) return false;
      }
    }
    // Diagonal move
    else if (rowDiff === colDiff) {
      const rowStep = (endRow > startRow) ? 1 : -1;
      const colStep = (endCol > startCol) ? 1 : -1;
      let r = startRow + rowStep;
      let c = startCol + colStep;
      while (r !== endRow && c !== endCol) {
        if (currentBoard[r][c] !== null) return false;
        r += rowStep;
        c += colStep;
      }
    } else {
      return false; // Not a straight or diagonal path
    }
    return true;
  };

  // --- Piece-specific move validation functions ---

  const isValidPawnMove = (startRow, startCol, endRow, endCol, currentBoard, isWhite) => {
    const pieceAtTarget = currentBoard[endRow][endCol];
    const rowDiff = endRow - startRow;
    const colDiff = Math.abs(endCol - startCol);

    if (isWhite) { // White pawn moves (upwards on board)
      // Normal one step move
      if (rowDiff === -1 && colDiff === 0 && pieceAtTarget === null) {
        return true;
      }
      // Two step initial move
      if (startRow === 6 && rowDiff === -2 && colDiff === 0 && pieceAtTarget === null && currentBoard[startRow - 1][startCol] === null) {
        return true;
      }
      // Capture move
      if (rowDiff === -1 && colDiff === 1 && pieceAtTarget !== null && !isPlayersPiece(pieceAtTarget, 'white')) {
        return true;
      }
    } else { // Black pawn moves (downwards on board)
      // Normal one step move
      if (rowDiff === 1 && colDiff === 0 && pieceAtTarget === null) {
        return true;
      }
      // Two step initial move
      if (startRow === 1 && rowDiff === 2 && colDiff === 0 && pieceAtTarget === null && currentBoard[startRow + 1][startCol] === null) {
        return true;
      }
      // Capture move
      if (rowDiff === 1 && colDiff === 1 && pieceAtTarget !== null && !isPlayersPiece(pieceAtTarget, 'black')) {
        return true;
      }
    }
    return false;
  };

  const isValidKnightMove = (startRow, startCol, endRow, endCol) => {
    const rowDiff = Math.abs(startRow - endRow);
    const colDiff = Math.abs(startCol - endCol);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  };

  const isValidBishopMove = (startRow, startCol, endRow, endCol, currentBoard) => {
    const rowDiff = Math.abs(startRow - endRow);
    const colDiff = Math.abs(startCol - endCol);
    return rowDiff === colDiff && rowDiff > 0 && isPathClear(startRow, startCol, endRow, endCol, currentBoard);
  };

  const isValidRookMove = (startRow, startCol, endRow, endCol, currentBoard) => {
    const isHorizontal = startRow === endRow && startCol !== endCol;
    const isVertical = startCol === endCol && startRow !== endRow;
    return (isHorizontal || isVertical) && isPathClear(startRow, startCol, endRow, endCol, currentBoard);
  };

  const isValidQueenMove = (startRow, startCol, endRow, endCol, currentBoard) => {
    return isValidBishopMove(startRow, startCol, endRow, endCol, currentBoard) ||
           isValidRookMove(startRow, startCol, endRow, endCol, currentBoard);
  };

  const isValidKingMove = (startRow, startCol, endRow, endCol) => {
    const rowDiff = Math.abs(startRow - endRow);
    const colDiff = Math.abs(startCol - endCol);
    return rowDiff <= 1 && colDiff <= 1 && (rowDiff > 0 || colDiff > 0); // Must move at least one square
  };

  // Main move validation function
  const isValidMove = (startRow, startCol, endRow, endCol, currentBoard, currentTurn) => {
    // console.log(`isValidMove called: from (${startRow},${startCol}) to (${endRow},${endCol}) for turn ${currentTurn}`);
    const piece = currentBoard[startRow][startCol];
    if (!piece || !isPlayersPiece(piece, currentTurn)) {
      // console.log('isValidMove: No piece or not current player\'s piece.');
      return false; // No piece or not current player's piece
    }
    if (startRow === endRow && startCol === endCol) {
      // console.log('isValidMove: Cannot move to the same square.');
      return false; // Cannot move to the same square
    }
    if (endRow < 0 || endRow >= 8 || endCol < 0 || endCol >= 8) {
      // console.log('isValidMove: Out of bounds.');
      return false; // Out of bounds
    }

    const targetPiece = currentBoard[endRow][endCol];
    if (targetPiece && isPlayersPiece(targetPiece, currentTurn)) {
      // console.log('isValidMove: Cannot capture your own piece.');
      return false; // Cannot capture your own piece
    }

    const isWhite = piece === piece.toUpperCase();
    const pieceType = piece.toLowerCase();

    let valid = false;
    switch (pieceType) {
      case 'p': valid = isValidPawnMove(startRow, startCol, endRow, endCol, currentBoard, isWhite); /* console.log(`Pawn move valid: ${valid}`); */ break;
      case 'n': valid = isValidKnightMove(startRow, startCol, endRow, endCol); /* console.log(`Knight move valid: ${valid}`); */ break;
      case 'b': valid = isValidBishopMove(startRow, startCol, endRow, endCol, currentBoard); /* console.log(`Bishop move valid: ${valid}`); */ break;
      case 'r': valid = isValidRookMove(startRow, startCol, endRow, endCol, currentBoard); /* console.log(`Rook move valid: ${valid}`); */ break;
      case 'q': valid = isValidQueenMove(startRow, startCol, endRow, endCol, currentBoard); /* console.log(`Queen move valid: ${valid}`); */ break;
      case 'k': valid = isValidKingMove(startRow, startCol, endRow, endCol); /* console.log(`King move valid: ${valid}`); */ break;
      default: valid = false; // console.log('Unknown piece type.');
    }

    if (!valid) {
      // console.log('isValidMove: Basic piece movement invalid.');
      return false;
    }

    // --- Basic King Safety Check (prevents moving into immediate check) ---
    // Simulate the move
    const simulatedBoard = currentBoard.map(rowArr => [...rowArr]);
    simulatedBoard[endRow][endCol] = simulatedBoard[startRow][startCol];
    simulatedBoard[startRow][startCol] = null;

    // Find the king's position after the simulated move
    let kingRow, kingCol;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = simulatedBoard[r][c];
        if (p && p.toLowerCase() === 'k' && isPlayersPiece(p, currentTurn)) {
          kingRow = r;
          kingCol = c;
          break;
        }
      }
      if (kingRow !== undefined) break;
    }

    // If king position is not found (shouldn't happen in normal play, but good for robustness)
    if (kingRow === undefined) {
      // console.log('isValidMove: King not found after simulated move.');
      return false;
    }

    // Check if the king is attacked on the simulated board
    const opponentTurn = (currentTurn === 'white' ? 'black' : 'white');
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const opponentPiece = simulatedBoard[r][c];
        if (opponentPiece && !isPlayersPiece(opponentPiece, currentTurn)) {
          const attackerPieceType = opponentPiece.toLowerCase();
          const isAttackerWhite = opponentPiece === opponentPiece.toUpperCase();

          let canAttackKing = false;
          switch (attackerPieceType) {
            case 'p':
              if (isAttackerWhite) { // White pawn attacking (downwards on board)
                if (r + 1 === kingRow && (c - 1 === kingCol || c + 1 === kingCol)) canAttackKing = true;
              } else { // Black pawn attacking (upwards on board)
                if (r - 1 === kingRow && (c - 1 === kingCol || c + 1 === kingCol)) canAttackKing = true;
              }
              break;
            case 'n':
              canAttackKing = isValidKnightMove(r, c, kingRow, kingCol);
              break;
            case 'b':
              canAttackKing = isValidBishopMove(r, c, kingRow, kingCol, simulatedBoard);
              break;
            case 'r':
              canAttackKing = isValidRookMove(r, c, kingRow, kingCol, simulatedBoard);
              break;
            case 'q':
              canAttackKing = isValidQueenMove(r, c, kingRow, kingCol, simulatedBoard);
              break;
            case 'k':
              canAttackKing = isValidKingMove(r, c, kingRow, kingCol);
              break;
            default:
              break;
          }
          if (canAttackKing) {
            // console.log(`isValidMove: King would be in check by ${opponentPiece} at (${r},${c}).`);
            return false; // King is in check after this move
          }
        }
      }
    }
    // console.log('isValidMove: Move is valid and king is safe.');
    return true;
  };


  // Computer's move logic (basic AI - now prioritizes captures)
  const computerMove = async () => {
    setMessage('Computer is thinking...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate thinking time

    const currentBoardForAI = board;
    const captureMoves = [];
    const nonCaptureMoves = [];

    // Collect all legal moves for the computer, categorizing them
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = currentBoardForAI[r][c];
        if (piece && piece === piece.toLowerCase()) { // It's a black piece (computer's)
          for (let targetR = 0; targetR < 8; targetR++) {
            for (let targetC = 0; targetC < 8; targetC++) {
              if (isValidMove(r, c, targetR, targetC, currentBoardForAI, 'black')) {
                const targetPiece = currentBoardForAI[targetR][targetC];
                const move = { start: { r, c }, end: { r: targetR, c: targetC } };
                if (targetPiece && isPlayersPiece(targetPiece, 'white')) { // If it's a capture
                  captureMoves.push(move);
                } else {
                  nonCaptureMoves.push(move);
                }
              }
            }
          }
        }
      }
    }

    let chosenMove = null;

    if (captureMoves.length > 0) {
      // Prioritize capture moves
      chosenMove = captureMoves[Math.floor(Math.random() * captureMoves.length)];
      setMessage('Computer made a capture!');
    } else if (nonCaptureMoves.length > 0) {
      // If no captures, pick a random non-capture move
      chosenMove = nonCaptureMoves[Math.floor(Math.random() * nonCaptureMoves.length)];
      setMessage('Computer moved!');
    } else {
      setMessage('Computer could not find a legal move. Stalemate?');
    }

    if (chosenMove) {
      const { start, end } = chosenMove;
      const newBoardAfterComputerMove = currentBoardForAI.map(rowArr => [...rowArr]);
      newBoardAfterComputerMove[end.r][end.c] = newBoardAfterComputerMove[start.r][start.c]; // Move piece
      newBoardAfterComputerMove[start.r][start.c] = null; // Clear old square
      setBoard(newBoardAfterComputerMove);
    }
    setTurn('white'); // Switch turn back to white
  };

  // useEffect to trigger computer's move when it's black's turn in PVC mode
  useEffect(() => {
    if (isGameStarted && gameMode === 'pvc' && turn === 'black') {
      computerMove();
    }
  }, [turn, isGameStarted, gameMode]); // Dependencies: re-run when turn, gameMode, or isGameStarted changes

  // Basic square click handler (for selection and potential movement)
  const handleSquareClick = (row, col) => {
    // console.log(`Clicked square: (${row},${col})`);
    if (turn === 'black' && gameMode === 'pvc') {
      // Prevent human from moving during computer's turn
      setMessage('It\'s the computer\'s turn!');
      // console.log('handleSquareClick: Blocked - computer turn.');
      return;
    }

    // If a square is already selected
    if (selectedSquare) {
      // console.log(`handleSquareClick: Piece already selected at (${selectedSquare.row},${selectedSquare.col})`);
      const pieceToMove = board[selectedSquare.row][selectedSquare.col];

      // If clicking on your own piece, re-select it
      if (board[row][col] && isPlayersPiece(board[row][col], turn)) {
        setSelectedSquare({ row, col });
        setMessage(''); // Clear any previous messages
        // console.log('handleSquareClick: Re-selected own piece.');
      } else {
        // Attempt to move the piece
        // console.log(`handleSquareClick: Attempting to move from (${selectedSquare.row},${selectedSquare.col}) to (${row},${col})`);
        if (isValidMove(selectedSquare.row, selectedSquare.col, row, col, board, turn)) {
          // console.log('handleSquareClick: Move is VALID. Updating board.');
          const newBoard = board.map(rowArr => [...rowArr]); // Deep copy
          newBoard[row][col] = newBoard[selectedSquare.row][selectedSquare.col]; // Move piece to new square
          newBoard[selectedSquare.row][selectedSquare.col] = null; // Clear old square
          setBoard(newBoard);
          const nextTurn = turn === 'white' ? 'black' : 'white';
          setTurn(nextTurn); // Switch turn
          setMessage(''); // Clear message after successful move
        } else {
          setMessage('Invalid move. This move is not allowed for that piece or puts your king in check.');
          // console.log('handleSquareClick: Move is INVALID.');
        }
        setSelectedSquare(null); // Deselect after move attempt
        // console.log('handleSquareClick: Deselected square.');
      }
    } else {
      // No square selected, try to select a piece
      // console.log('handleSquareClick: No square selected. Attempting to select a piece.');
      const pieceOnSquare = board[row][col];
      if (pieceOnSquare && isPlayersPiece(pieceOnSquare, turn)) {
        setSelectedSquare({ row, col });
        setMessage(''); // Clear any previous messages
        // console.log(`handleSquareClick: Piece selected at (${row},${col}).`);
      } else if (pieceOnSquare && !isPlayersPiece(pieceOnSquare, turn)) {
        setMessage('That\'s not your piece!');
        // console.log('handleSquareClick: Tried to select opponent\'s piece.');
      } else {
        setMessage('No piece to select here.');
        // console.log('handleSquareClick: Clicked empty square without selection.');
      }
    }
  };

  // Function to reset the game
  const resetGame = () => {
    setBoard(initialBoard);
    setSelectedSquare(null);
    setTurn('white');
    setGameMode(null);
    setIsGameStarted(false);
    setMessage('');
    // console.log('Game reset.');
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center p-4 font-inter">
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 w-full max-w-4xl">
        <h1 className="text-4xl font-extrabold text-white text-center mb-6 drop-shadow-lg">
          Chess
        </h1>

        {!isGameStarted ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-gray-300 text-lg mb-4">Choose your game mode:</p>
            <button
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
              onClick={() => { setGameMode('pvp'); setIsGameStarted(true); setMessage('Player vs Player mode started!'); }}
            >
              Player vs Player
            </button>
            <button
              className="px-8 py-4 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 transform hover:scale-105"
              onClick={() => { setGameMode('pvc'); setIsGameStarted(true); setMessage('Player vs Computer mode started! You are White.'); }}
            >
              Player vs Computer
            </button>
          </div>
        ) : (
          <>
            <div className="text-center text-lg text-gray-300 mb-4">
              Current Turn: <span className="font-bold capitalize">{turn}</span>
            </div>
            {message && (
              <div className="text-center text-red-400 text-md mb-4 animate-pulse">
                {message}
              </div>
            )}
            <div className="grid grid-cols-8 gap-0 border-4 border-gray-600 rounded-lg overflow-hidden shadow-inner mx-auto max-w-fit">
              {board.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  {row.map((piece, colIndex) => {
                    const isLightSquare = (rowIndex + colIndex) % 2 === 0;
                    const squareColorClass = isLightSquare ? 'bg-amber-100' : 'bg-amber-700';
                    const isSelected = selectedSquare && selectedSquare.row === rowIndex && selectedSquare.col === colIndex;

                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                          w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24
                          flex items-center justify-center
                          text-3xl sm:text-4xl md:text-5xl lg:text-6xl
                          font-bold cursor-pointer transition-all duration-200 ease-in-out
                          ${squareColorClass}
                          ${isSelected ? 'ring-4 ring-blue-500 ring-offset-2 ring-offset-gray-800 scale-105' : ''}
                          hover:scale-105 hover:shadow-lg
                        `}
                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                      >
                        {getPiece(piece)}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
            <p className="text-gray-400 text-sm text-center mt-6">
              Click a piece to select, then click an empty square or opponent's piece to move.
              (Basic movement, no complex chess rules implemented yet!)
            </p>
            <div className="flex justify-center mt-6">
              <button
                className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300 transform hover:scale-105"
                onClick={resetGame}
              >
                Reset Game
              </button>
            </div>
          </>
        )}
      </div>
    </div>
    <Testimonals/>
    </>
  );
};

export default App;
