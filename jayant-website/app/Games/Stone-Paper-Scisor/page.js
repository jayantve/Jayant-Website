'use client'
import Testimonals from '@/Component/UI-Blocks';
import React, { useState } from 'react';

// Main App component for the Stone Paper Scissor game
export default function App() {
  // State to store the user's choice
  const [userChoice, setUserChoice] = useState(null);
  // State to store the computer's choice
  const [computerChoice, setComputerChoice] = useState(null);
  // State to store the result of the round (Win, Lose, Draw)
  const [result, setResult] = useState('');
  // State to store the score for both user and computer
  const [score, setScore] = useState({ user: 0, computer: 0 });
  // State to control the animation of the results display
  const [showResults, setShowResults] = useState(false);
  // State to store the AI-generated commentary
  const [commentary, setCommentary] = useState('');
  // State to indicate if commentary is being loaded
  const [isLoadingCommentary, setIsLoadingCommentary] = useState(false);

  // Array of possible choices with corresponding emojis
  const choices = [
    { name: 'Stone', emoji: '🪨' },
    { name: 'Paper', emoji: '📄' },
    { name: 'Scissor', emoji: '✂️' },
  ];

  /**
   * Helper function to get the emoji for a given choice name.
   * @param {string} choiceName - The name of the choice (e.g., 'Stone').
   * @returns {string} The corresponding emoji.
   */
  const getChoiceEmoji = (choiceName) => {
    const foundChoice = choices.find(c => c.name === choiceName);
    return foundChoice ? foundChoice.emoji : '';
  };

  /**
   * Function to handle the user's selection.
   * @param {string} choiceName - The name of the choice made by the user.
   */
  const handleUserChoice = (choiceName) => {
    // Reset showResults to false briefly to trigger re-animation if same choice is made
    setShowResults(false);
    setUserChoice(choiceName); // Set user's choice
    setCommentary(''); // Clear previous commentary

    // Generate a random choice for the computer
    const randomComputerChoiceObj = choices[Math.floor(Math.random() * choices.length)];
    setComputerChoice(randomComputerChoiceObj.name); // Set computer's choice name

    // Determine the winner of the round
    determineWinner(choiceName, randomComputerChoiceObj.name);

    // Trigger animation after a short delay to allow state update
    setTimeout(() => setShowResults(true), 50);
  };

  /**
   * Function to determine the winner of the round.
   * @param {string} user - The user's choice name.
   * @param {string} computer - The computer's choice name.
   */
  const determineWinner = (user, computer) => {
    if (user === computer) {
      setResult('It\'s a Draw!');
    } else if (
      (user === 'Stone' && computer === 'Scissor') ||
      (user === 'Paper' && computer === 'Stone') ||
      (user === 'Scissor' && computer === 'Paper')
    ) {
      setResult('You Win!');
      setScore((prevScore) => ({ ...prevScore, user: prevScore.user + 1 })); // Increment user score
    } else {
      setResult('You Lose!');
      setScore((prevScore) => ({ ...prevScore, computer: prevScore.computer + 1 })); // Increment computer score
    }
  };

  /**
   * Function to generate commentary using the Gemini API.
   */
  const generateCommentary = async () => {
    setIsLoadingCommentary(true);
    const prompt = `Given the following Stone Paper Scissor round:
User chose: ${userChoice}
Computer chose: ${computerChoice}
Result: ${result}

Provide a short, fun, and witty commentary or analysis about this round. Keep it under 30 words.`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const apiKey = ""; // If you want to use models other than gemini-2.0-flash or imagen-3.0-generate-002, provide an API key here. Otherwise, leave this as-is.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const resultData = await response.json();

      if (resultData.candidates && resultData.candidates.length > 0 &&
          resultData.candidates[0].content && resultData.candidates[0].content.parts &&
          resultData.candidates[0].content.parts.length > 0) {
        const text = resultData.candidates[0].content.parts[0].text;
        setCommentary(text);
      } else {
        setCommentary('Could not generate commentary. Try again!');
      }
    } catch (error) {
      console.error('Error generating commentary:', error);
      setCommentary('Failed to get commentary. Network error or API issue.');
    } finally {
      setIsLoadingCommentary(false);
    }
  };

  /**
   * Function to reset the game to its initial state.
   */
  const resetGame = () => {
    setUserChoice(null);
    setComputerChoice(null);
    setResult('');
    setScore({ user: 0, computer: 0 });
    setShowResults(false); // Hide results on reset
    setCommentary(''); // Clear commentary on reset
    setIsLoadingCommentary(false); // Reset loading state
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center justify-center p-4 font-inter">
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-8 drop-shadow-lg">
        Stone Paper Scissor
      </h1>

      <div className="game-container bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center max-w-lg w-full">
        <div className="choices-buttons flex space-x-4 mb-8">
          {choices.map((choice) => (
            <button
              key={choice.name}
              onClick={() => handleUserChoice(choice.name)}
              className="px-6 py-3 bg-indigo-600 text-white text-xl font-semibold rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-300 flex items-center justify-center space-x-2"
            >
              <span>{choice.name}</span>
              <span className="text-3xl">{choice.emoji}</span> {/* Emoji next to text */}
            </button>
          ))}
        </div>

        {userChoice && (
          <div
            className={`results-display text-center mb-8 transition-all duration-500 ease-out
              ${showResults ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          >
            <p className="text-2xl text-gray-700 mb-2 flex items-center justify-center space-x-2">
              Your Choice: <span className="font-bold text-indigo-800">{userChoice}</span>
              <span className="text-4xl">{getChoiceEmoji(userChoice)}</span> {/* User's hand emoji */}
            </p>
            <p className="text-2xl text-gray-700 mb-4 flex items-center justify-center space-x-2">
              Computer's Choice: <span className="font-bold text-red-600">{computerChoice}</span>
              <span className="text-4xl">{getChoiceEmoji(computerChoice)}</span> {/* Computer's hand emoji */}
            </p>
            <p className="text-4xl font-extrabold text-gray-900">
              {result}
            </p>

            <button
              onClick={generateCommentary}
              disabled={isLoadingCommentary}
              className="mt-6 px-6 py-3 bg-purple-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingCommentary ? 'Generating...' : '✨ Get Commentary ✨'}
            </button>

            {commentary && (
              <p className="mt-4 text-lg text-gray-600 italic max-w-sm mx-auto">
                "{commentary}"
              </p>
            )}
          </div>
        )}

        <div className="score-board text-center text-2xl font-semibold text-gray-800 mb-8">
          <p>User Score: <span className="text-green-600">{score.user}</span></p>
          <p>Computer Score: <span className="text-red-600">{score.computer}</span></p>
        </div>

        <button
          onClick={resetGame}
          className="px-8 py-4 bg-gray-600 text-white text-xl font-bold rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300"
        >
          Reset Game
        </button>
      </div>
    </div>
    <Testimonals/>
    </>
  );
}
