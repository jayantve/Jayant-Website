'use client'
import Testimonals from '@/Component/Testimonal';
import React, { useRef, useEffect, useState, useCallback } from 'react';

const App = () => {
    const canvasRef = useRef(null);
    const [puzzle, setPuzzle] = useState(null);
    const [options, setOptions] = useState([]);
    const [feedback, setFeedback] = useState('');
    const [isGameReady, setIsGameReady] = useState(false);

    const generatePuzzle = useCallback(() => {
        const operators = ['+', '-', '*'];
        const operator = operators[Math.floor(Math.random() * operators.length)];
        let num1 = Math.floor(Math.random() * 20) + 1;
        let num2 = Math.floor(Math.random() * 20) + 1;
        let correctAnswer;

        if (operator === '-') {
            if (num1 < num2) {
                [num1, num2] = [num2, num1];
            }
            correctAnswer = num1 - num2;
        } else if (operator === '+') {
            correctAnswer = num1 + num2;
        } else if (operator === '*') {
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            correctAnswer = num1 * num2;
        }

        const newOptions = new Set();
        newOptions.add(correctAnswer);

        while (newOptions.size < 4) {
            let incorrectAnswer;
            const deviation = Math.floor(Math.random() * 10) + 1;
            if (Math.random() > 0.5) {
                incorrectAnswer = correctAnswer + deviation;
            } else {
                incorrectAnswer = correctAnswer - deviation;
            }
            if (incorrectAnswer >= 0) {
                newOptions.add(incorrectAnswer);
            }
        }

        const shuffledOptions = Array.from(newOptions).sort(() => Math.random() - 0.5);

        setPuzzle({ num1, num2, operator, correctAnswer });
        setOptions(shuffledOptions);
        setFeedback('');
        setIsGameReady(true);
    }, []);

    const drawPuzzle = useCallback((ctx, canvas) => {
        if (!puzzle) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.font = 'bold 48px Inter, sans-serif';
        ctx.fillStyle = '#1f2937';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const puzzleText = `${puzzle.num1} ${puzzle.operator} ${puzzle.num2} = ?`;

        ctx.fillText(puzzleText, canvas.width / 2, canvas.height / 2);
    }, [puzzle]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        const setCanvasDimensions = () => {
            canvas.style.width = '100%';
            canvas.style.height = '200px';

            const dpr = window.devicePixelRatio || 1;
            canvas.width = canvas.offsetWidth * dpr;
            canvas.height = canvas.offsetHeight * dpr;
            ctx.scale(dpr, dpr);

            drawPuzzle(ctx, canvas);
        };

        setCanvasDimensions();

        window.addEventListener('resize', setCanvasDimensions);

        return () => {
            window.removeEventListener('resize', setCanvasDimensions);
        };
    }, [drawPuzzle]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !puzzle) return;
        const ctx = canvas.getContext('2d');
        drawPuzzle(ctx, canvas);
    }, [puzzle, drawPuzzle]);

    useEffect(() => {
        generatePuzzle();
    }, [generatePuzzle]);

    const handleOptionClick = (selectedAnswer) => {
        if (!puzzle) {
            setFeedback('Please generate a puzzle first!');
            return;
        }

        if (selectedAnswer === puzzle.correctAnswer) {
            setFeedback('🎉 Correct! Well done!');
        } else {
            setFeedback('❌ Try again!');
        }
    };

    return (
        <>
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center p-4 font-inter">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center space-y-6 transform transition-all duration-300 hover:scale-105">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-4 text-center">
                    Math Puzzle
                </h1>

                <div className="w-full bg-gray-50 border border-gray-200 rounded-lg overflow-hidden shadow-inner">
                    <canvas
                        ref={canvasRef}
                        className="w-full h-48 block"
                    >
                        Your browser does not support the HTML canvas tag.
                    </canvas>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 text-xl"
                            aria-label={`Option ${option}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                {feedback && (
                    <p className={`text-xl font-semibold ${feedback.includes('Correct') ? 'text-green-600' : 'text-red-600'} transition-opacity duration-300`}>
                        {feedback}
                    </p>
                )}

                <button
                    onClick={generatePuzzle}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 text-xl"
                    aria-label="Generate New Puzzle"
                >
                    New Puzzle
                </button>
            </div>
        </div>
        <Testimonals/>
        </>
    );
};

export default App;
