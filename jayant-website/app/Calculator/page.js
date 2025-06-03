'use client'
import Testimonals from '@/Component/Testimonal';
import React, { useState } from 'react';

const App = () => {
    const [displayValue, setDisplayValue] = useState('0');
    const [firstOperand, setFirstOperand] = useState(null);
    const [operator, setOperator] = useState(null);
    const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

    const inputDigit = (digit) => {
        if (waitingForSecondOperand) {
            setDisplayValue(digit);
            setWaitingForSecondOperand(false);
        } else {
            setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
        }
    };

    const inputDecimal = () => {
        if (waitingForSecondOperand) {
            setDisplayValue('0.');
            setWaitingForSecondOperand(false);
            return;
        }
        if (!displayValue.includes('.')) {
            setDisplayValue(displayValue + '.');
        }
    };

    const toggleSign = () => {
        setDisplayValue(String(parseFloat(displayValue) * -1));
    };

    const inputPercent = () => {
        const value = parseFloat(displayValue);
        if (value === 0) return;
        setDisplayValue(String(value / 100));
    };

    const square = () => {
        const value = parseFloat(displayValue);
        setDisplayValue(String(value * value));
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };

    const cube = () => {
        const value = parseFloat(displayValue);
        setDisplayValue(String(value * value * value));
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };

    const squareRoot = () => {
        const value = parseFloat(displayValue);
        if (value < 0) {
            setDisplayValue('Error');
            return;
        }
        setDisplayValue(String(Math.sqrt(value)));
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };

    const cubeRoot = () => {
        const value = parseFloat(displayValue);
        setDisplayValue(String(Math.cbrt(value)));
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };

    const power = () => {
        setDisplayValue(displayValue + '^');
        setWaitingForSecondOperand(true);
        setOperator('^');
    };

    const pi = () => {
        setDisplayValue(String(Math.PI));
        setWaitingForSecondOperand(false);
    };

    const sin = () => {
        setDisplayValue(String(Math.sin(parseFloat(displayValue))));
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };

    const cos = () => {
        setDisplayValue(String(Math.cos(parseFloat(displayValue))));
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };

    const tan = () => {
        setDisplayValue(String(Math.tan(parseFloat(displayValue))));
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };

    const log = () => {
        const value = parseFloat(displayValue);
        if (value <= 0) {
            setDisplayValue('Error');
            return;
        }
        setDisplayValue(String(Math.log10(value)));
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };

    const ln = () => {
        const value = parseFloat(displayValue);
        if (value <= 0) {
            setDisplayValue('Error');
            return;
        }
        setDisplayValue(String(Math.log(value)));
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };

    const openParenthesis = () => {
        // For a fully functional scientific calculator, this would involve parsing the expression.
        // For now, it just appends.
        setDisplayValue(displayValue + '(');
    };

    const closeParenthesis = () => {
        // For a fully functional scientific calculator, this would involve parsing the expression.
        // For now, it just appends.
        setDisplayValue(displayValue + ')');
    };

    const eConstant = () => {
        setDisplayValue(String(Math.E));
        setWaitingForSecondOperand(false);
    };

    const exponent = () => {
        setDisplayValue(String(Math.exp(parseFloat(displayValue))));
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };

    const reciprocal = () => {
        const value = parseFloat(displayValue);
        if (value === 0) {
            setDisplayValue('Error');
            return;
        }
        setDisplayValue(String(1 / value));
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };

    const factorial = () => {
        const value = parseInt(displayValue);
        if (value < 0 || !Number.isInteger(value)) {
            setDisplayValue('Error');
            return;
        }
        let result = 1;
        for (let i = 2; i <= value; i++) {
            result *= i;
        }
        setDisplayValue(String(result));
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };

    const absolute = () => {
        setDisplayValue(String(Math.abs(parseFloat(displayValue))));
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };

    const handleOperator = (nextOperator) => {
        const inputValue = parseFloat(displayValue);

        if (firstOperand === null) {
            setFirstOperand(inputValue);
        } else if (operator) {
            const result = performCalculation[operator](firstOperand, inputValue);
            setDisplayValue(String(result));
            setFirstOperand(result);
        }

        setWaitingForSecondOperand(true);
        setOperator(nextOperator);
    };

    const performCalculation = {
        '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
        '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
        '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
        '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
        '^': (firstOperand, secondOperand) => Math.pow(firstOperand, secondOperand),
        '=': (firstOperand, secondOperand) => secondOperand,
        '%': (firstOperand, secondOperand) => firstOperand % secondOperand, // Modulo operator
    };

    const calculate = () => {
        if (firstOperand === null || operator === null) {
            return;
        }

        const inputValue = parseFloat(displayValue);
        const result = performCalculation[operator](firstOperand, inputValue);

        setDisplayValue(String(result));
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };

    const clearDisplay = () => {
        setDisplayValue('0');
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };

    const renderButton = (value, className = '', onClickHandler) => (
        <button
            className={`
        flex items-center justify-center p-4 text-2xl font-semibold
        bg-gray-700 text-white rounded-xl shadow-md
        hover:bg-gray-600 active:bg-gray-800 transition-colors duration-200
        ${className}
      `}
            onClick={onClickHandler}
        >
            {value}
        </button>
    );

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 font-inter p-4">
                <div className="bg-gray-800 rounded-3xl shadow-2xl p-6 w-full max-w-2xl border border-gray-600">
                    <div className="bg-gray-900 text-right text-white text-5xl font-light p-6 mb-6 rounded-2xl overflow-hidden break-words">
                        {displayValue}
                    </div>

                    <div className="grid grid-cols-8 gap-4">
                        {/* Row 1: Clear, Sign, Percent, Basic Ops, Scientific */}
                        {renderButton('C', 'bg-red-600 hover:bg-red-500 active:bg-red-700', clearDisplay)}
                        {renderButton('+/-', '', toggleSign)}
                        {renderButton('%', '', inputPercent)}
                        {renderButton('(', '', openParenthesis)}
                        {renderButton(')', '', closeParenthesis)}
                        {renderButton('^', 'bg-orange-500 hover:bg-orange-400 active:bg-orange-600', power)}
                        {renderButton('√x', '', squareRoot)}
                        {renderButton('³√x', '', cubeRoot)}

                        {/* Row 2: Scientific Functions */}
                        {renderButton('sin', '', sin)}
                        {renderButton('cos', '', cos)}
                        {renderButton('tan', '', tan)}
                        {renderButton('log', '', log)}
                        {renderButton('ln', '', ln)}
                        {renderButton('e', '', eConstant)}
                        {renderButton('π', '', pi)}
                        {renderButton('exp', '', exponent)}


                        {/* Row 3: Numbers 7-9, Multiply, Reciprocal, Factorial, Absolute */}
                        {renderButton('7', '', () => inputDigit('7'))}
                        {renderButton('8', '', () => inputDigit('8'))}
                        {renderButton('9', '', () => inputDigit('9'))}
                        {renderButton('*', 'bg-orange-500 hover:bg-orange-400 active:bg-orange-600', () => handleOperator('*'))}
                        {renderButton('x²', '', square)}
                        {renderButton('x³', '', cube)}
                        {renderButton('1/x', '', reciprocal)}
                        {renderButton('x!', '', factorial)}


                        {/* Row 4: Numbers 4-6, Subtract, More Scientific */}
                        {renderButton('4', '', () => inputDigit('4'))}
                        {renderButton('5', '', () => inputDigit('5'))}
                        {renderButton('6', '', () => inputDigit('6'))}
                        {renderButton('-', 'bg-orange-500 hover:bg-orange-400 active:bg-orange-600', () => handleOperator('-'))}
                        {renderButton('abs', '', absolute)}
                        {renderButton('00', '', () => inputDigit('00'))}
                        {renderButton('000', '', () => inputDigit('000'))}
                        {renderButton('mod', 'bg-orange-500 hover:bg-orange-400 active:bg-orange-600', () => handleOperator('%'))}


                        {/* Row 5: Numbers 1-3, Add, Decimal, Equals */}
                        {renderButton('1', '', () => inputDigit('1'))}
                        {renderButton('2', '', () => inputDigit('2'))}
                        {renderButton('3', '', () => inputDigit('3'))}
                        {renderButton('+', 'bg-orange-500 hover:bg-orange-400 active:bg-orange-600', () => handleOperator('+'))}
                        {renderButton('0', 'col-span-2', () => inputDigit('0'))}
                        {renderButton('.', '', inputDecimal)}
                        {renderButton('=', 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700', calculate)}
                    </div>
                </div>
            </div>
            <Testimonals />
        </>
    );
};

export default App;
