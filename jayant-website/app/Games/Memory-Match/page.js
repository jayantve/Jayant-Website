'use client'
import Testimonals from '@/Component/UI-Blocks';
import React, { useState, useEffect, useCallback } from 'react';

// Emojis for the cards
const cardEmojis = ['🍎', '🍌', '🍒', '🍇', '🍋', '🥭', '🍊', '🍑', '🍓', '🍉', '🍍', '🥝'];

// Function to shuffle an array
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(RNG.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};

// Simple Random Number Generator (RNG) for consistent shuffling across environments
const RNG = {
  seed: 0.12345, // Initial seed
  setSeed: function(s) {
    this.seed = s;
  },
  random: function() {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
};


function App() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]); // Stores indices of currently flipped cards
  const [matchedCards, setMatchedCards] = useState(new Set()); // Stores IDs of matched cards
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [canFlip, setCanFlip] = useState(true); // Prevents rapid clicking issues

  // Initialize the game board
  const initializeGame = useCallback(() => {
    // Set a new random seed for each game initialization
    RNG.setSeed(Math.random());

    const gameCards = [];
    // Create pairs of cards
    cardEmojis.forEach((emoji, index) => {
      const id1 = `card-${index}-a`;
      const id2 = `card-${index}-b`;
      gameCards.push({ id: id1, value: emoji, isFlipped: false, isMatched: false });
      gameCards.push({ id: id2, value: emoji, isFlipped: false, isMatched: false });
    });

    // Shuffle the cards
    const shuffledCards = shuffleArray(gameCards);

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedCards(new Set());
    setMoves(0);
    setGameOver(false);
    setCanFlip(true);
  }, []);

  // Effect to initialize the game on component mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Effect to handle card matching logic
  useEffect(() => {
    if (flippedCards.length === 2) {
      setCanFlip(false); // Disable flipping while comparing

      const [index1, index2] = flippedCards;
      const card1 = cards[index1];
      const card2 = cards[index2];

      if (card1.value === card2.value) {
        // Match found
        setMatchedCards(prev => new Set(prev).add(card1.id).add(card2.id));
        setCards(prevCards =>
          prevCards.map((card, idx) =>
            idx === index1 || idx === index2 ? { ...card, isMatched: true } : card
          )
        );
        setFlippedCards([]); // Clear flipped cards
        setCanFlip(true); // Re-enable flipping
      } else {
        // No match, flip back after a delay
        const timeout = setTimeout(() => {
          setCards(prevCards =>
            prevCards.map((card, idx) =>
              idx === index1 || idx === index2 ? { ...card, isFlipped: false } : card
            )
          );
          setFlippedCards([]);
          setCanFlip(true); // Re-enable flipping
        }, 1000); // 1 second delay
        return () => clearTimeout(timeout);
      }
      setMoves(prevMoves => prevMoves + 1);
    }
  }, [flippedCards, cards]);

  // Effect to check for game over
  useEffect(() => {
    if (matchedCards.size === cards.length && cards.length > 0) {
      setGameOver(true);
    }
  }, [matchedCards, cards.length]);

  // Handle card click
  const handleCardClick = (clickedIndex) => {
    if (!canFlip || gameOver || cards[clickedIndex].isFlipped || cards[clickedIndex].isMatched) {
      return; // Do not allow flipping if not allowed, game over, or already flipped/matched
    }

    const newCards = [...cards];
    newCards[clickedIndex] = { ...newCards[clickedIndex], isFlipped: true };
    setCards(newCards);

    setFlippedCards(prevFlipped => [...prevFlipped, clickedIndex]);
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 via-purple-400 to-pink-300 flex flex-col items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-full text-center border-4 border-purple-600">
        <h1 className="text-5xl font-extrabold text-center text-purple-800 mb-6 tracking-tight drop-shadow-lg">
          Memory Match! 🧠
        </h1>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 text-xl font-semibold text-gray-700">
          <span className="text-2xl text-purple-700 mb-2 sm:mb-0">Moves: {moves}</span>
          {gameOver && (
            <span className="text-green-600 font-bold text-3xl animate-bounce">
              You Won! 🎉
            </span>
          )}
          <button
            onClick={initializeGame}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-full shadow-lg
                       hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300
                       transition duration-300 ease-in-out transform hover:scale-105 active:scale-95
                       border-2 border-blue-700"
          >
            Reset Game
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 md:gap-4 lg:gap-5 mb-8 justify-center">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`
                relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32
                rounded-lg shadow-xl cursor-pointer transform transition-all duration-300 ease-in-out
                ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}
                ${card.isMatched ? 'opacity-50 scale-95' : ''}
                ${!card.isFlipped && !card.isMatched ? 'hover:scale-105 hover:shadow-2xl' : ''}
              `}
              onClick={() => handleCardClick(index)}
              style={{ perspective: '1000px' }}
            >
              <div
                className={`
                  absolute inset-0 backface-hidden rounded-lg
                  flex items-center justify-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl
                  bg-gradient-to-br from-gray-700 to-gray-900 text-white
                  transition-transform duration-300 ease-in-out
                  ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}
                  ${flippedCards.includes(index) && !card.isMatched ? 'border-4 border-yellow-400' : 'border-4 border-gray-500'}
                `}
              >
                {/* Card Back */}
                <span className="text-gray-300 font-bold text-6xl">?</span>
              </div>
              <div
                className={`
                  absolute inset-0 backface-hidden rounded-lg
                  flex items-center justify-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl
                  bg-white
                  transform rotate-y-180 transition-transform duration-300 ease-in-out
                  ${flippedCards.includes(index) && !card.isMatched ? 'border-4 border-yellow-400' : 'border-4 border-blue-500'}
                `}
              >
                {/* Card Front */}
                {card.value}
              </div>
            </div>
          ))}
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
