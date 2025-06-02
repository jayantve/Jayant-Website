'use client'
import Testimonals from '@/Component/Testimonal';
import React, { useState } from 'react';

export default function App() {
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState('');
  const [score, setScore] = useState({ user: 0, computer: 0 });
  const [showResults, setShowResults] = useState(false);
  const [commentary, setCommentary] = useState('');
  const [isLoadingCommentary, setIsLoadingCommentary] = useState(false);

  const choices = [
    { name: 'Snake', emoji: '🐍' },
    { name: 'Water', emoji: '💧' },
    { name: 'Gun', emoji: '🔫' },
  ];

  const getChoiceEmoji = (choiceName) => {
    const foundChoice = choices.find(c => c.name === choiceName);
    return foundChoice ? foundChoice.emoji : '';
  };

  const handleUserChoice = (choiceName) => {
    setShowResults(false);
    setUserChoice(choiceName);
    setCommentary('');

    const randomComputerChoiceObj = choices[Math.floor(Math.random() * choices.length)];
    setComputerChoice(randomComputerChoiceObj.name);

    determineWinner(choiceName, randomComputerChoiceObj.name);

    setTimeout(() => setShowResults(true), 50);
  };

  const determineWinner = (user, computer) => {
    if (user === computer) {
      setResult('It\'s a Draw!');
    } else if (
      (user === 'Snake' && computer === 'Water') ||
      (user === 'Water' && computer === 'Gun') ||
      (user === 'Gun' && computer === 'Snake')
    ) {
      setResult('You Win!');
      setScore((prevScore) => ({ ...prevScore, user: prevScore.user + 1 }));
    } else {
      setResult('You Lose!');
      setScore((prevScore) => ({ ...prevScore, computer: prevScore.computer + 1 }));
    }
  };

  const generateCommentary = async () => {
    setIsLoadingCommentary(true);
    const prompt = `Given the following Snake Water Gun round:
User chose: ${userChoice}
Computer chose: ${computerChoice}
Result: ${result}

Provide a short, fun, and witty commentary or analysis about this round. Keep it under 30 words.`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const apiKey = "";
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

  const resetGame = () => {
    setUserChoice(null);
    setComputerChoice(null);
    setResult('');
    setScore({ user: 0, computer: 0 });
    setShowResults(false);
    setCommentary('');
    setIsLoadingCommentary(false);
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-teal-200 flex flex-col items-center justify-center p-4 font-inter">
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-8 drop-shadow-lg">
        Snake Water Gun
      </h1>

      <div className="game-container bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center max-w-lg w-full">
        <div className="choices-buttons flex space-x-4 mb-8">
          {choices.map((choice) => (
            <button
              key={choice.name}
              onClick={() => handleUserChoice(choice.name)}
              className="px-6 py-3 bg-blue-600 text-white text-xl font-semibold rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center space-x-2"
              aria-label={`Choose ${choice.name}`}
            >
              <span>{choice.name}</span>
              <span className="text-3xl">{choice.emoji}</span>
            </button>
          ))}
        </div>

        {userChoice && (
          <div
            className={`results-display text-center mb-8 transition-all duration-500 ease-out
              ${showResults ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          >
            <p className="text-2xl text-gray-700 mb-2 flex items-center justify-center space-x-2">
              Your Choice: <span className="font-bold text-blue-800">{userChoice}</span>
              <span className="text-4xl">{getChoiceEmoji(userChoice)}</span>
            </p>
            <p className="text-2xl text-gray-700 mb-4 flex items-center justify-center space-x-2">
              Computer's Choice: <span className="font-bold text-red-600">{computerChoice}</span>
              <span className="text-4xl">{getChoiceEmoji(computerChoice)}</span>
            </p>
            <p className="text-4xl font-extrabold text-gray-900">
              {result}
            </p>

            <button
              onClick={generateCommentary}
              disabled={isLoadingCommentary || !userChoice}
              className="mt-6 px-6 py-3 bg-purple-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Get Commentary"
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
          aria-label="Reset Game"
        >
          Reset Game
        </button>
      </div>
    </div>
    <Testimonals/>
    </>
  );
}
