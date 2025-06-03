'use client'
import React, { useState, useMemo } from 'react';
import gamesData from '@/Component/Data.json'

export default function App() {
    const [searchResults, setSearchResults] = useState(gamesData.gamesData);

    const handleSearch = (query) => {
        if (!query) {
            setSearchResults(gamesData);
            return;
        }

        const lowerCaseQuery = query.toLowerCase();
        const filteredResults = gamesData.gamesData.filter(item =>
            item.title.toLowerCase().includes(lowerCaseQuery) ||
            item.description.toLowerCase().includes(lowerCaseQuery) ||
            item.category.toLowerCase().includes(lowerCaseQuery)
        );
        setSearchResults(filteredResults);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8 pt-10">
            <SearchInput onSearch={handleSearch} />

            <div className="w-full  mt-8 bg-white p-4 sm:p-6 rounded-lg shadow-xl border border-gray-200">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Search Results</h2>
                {searchResults.length > 0 ? (
                    <ul className="space-y-4">
                        {searchResults.map(item => (
                            <li key={item.id} className="p-3 sm:p-4 bg-gray-50 rounded-md shadow-sm border border-gray-100">
                                <a href={item.link}>
                                    <h3 className="text-lg font-bold text-blue-900">{item.title}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                                    <p className="text-gray-900 font-semibold text-xs mt-1">Category: {item.category}</p>
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600 text-center py-4">No results found for your search.</p>
                )}
            </div>
        </div>
    );
}

function SearchInput({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(searchTerm.trim());
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-4 sm:p-6 rounded-lg shadow-xl flex items-center space-x-3 border border-gray-200">
            <input
                type="text"
                value={searchTerm}
                onChange={handleChange}
                placeholder="Search anything..."
                aria-label="Search input"
                className="flex-grow p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 text-base sm:text-lg transition duration-200 ease-in-out"
            />

            <button
                type="submit"
                className="px-4 py-2 sm:px-5 sm:py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out shadow-md hover:shadow-lg active:bg-blue-800"
            >
                Search
            </button>
        </form>
    );
}
