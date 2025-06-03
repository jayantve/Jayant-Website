import React from 'react';
import Image from 'next/image';
import logo from '@/app/favicon.ico'

const Navbar = ({ className = '' }) => {
  return (
    <div className='bg-gray-600 shadow-md mx-auto my-2 rounded-lg sticky top-2 left-0 right-0 z-10'>
      <header className="text-gray-600 body-font py-2 md:py-3">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
          <a
            href="/"
            className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
          >
            <Image
              src={logo}
              height="32"
              width="32"
              alt="logo"
              className="rounded-full"
            />
            <span className="ml-3 text-xl">Jayant Website</span>
          </a>
          <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
            <a href="/Search" className="mr-4 md:mr-5 text-white hover:text-gray-900">
              <svg
      className={`h-6 w-6 text-gray-800 dark:text-white ${className}`} // Tailwind classes for size and color, with a customizable className prop
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true" // For accessibility
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
            </a>
            
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Navbar;