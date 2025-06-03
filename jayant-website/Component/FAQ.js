'use client'
import React, { useState } from 'react';
import faqs from '@/Component/Data.json'

export default function Faqs() {
  const [openItemId, setOpenItemId] = useState(null);

  const toggleAccordion = (id) => {
    setOpenItemId(openItemId === id ? null : id);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 mx-0">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">
          Frequently Asked Questions
        </h1>

        <div className="space-y-4">
          {faqs.faqs.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="flex justify-between items-center w-full p-4 text-left font-semibold text-lg text-gray-800 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                onClick={() => toggleAccordion(item.id)}
                aria-expanded={openItemId === item.id}
                aria-controls={`faq-answer-${item.id}`}
              >
                <span>{item.question}</span>
                <svg
                  className={`w-6 h-6 transform transition-transform duration-200 ${
                    openItemId === item.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <div
                id={`faq-answer-${item.id}`}
                className={`
                  overflow-hidden transition-all duration-300 ease-in-out
                  ${openItemId === item.id ? 'max-h-screen py-4 px-0' : 'max-h-0 p-0'}
                  ${openItemId === item.id ? '' : 'invisible'}
                `}
              >
                <p className="text-gray-700 px-4">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
