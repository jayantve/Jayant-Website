import React from 'react'
import Image from 'next/image'
import profilepic from '@/app/favicon.ico'

const Navbar = () => {
  return (
    <div>
      <header className="text-gray-600 body-font h-1vh">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <nav className="flex lg:w-2/5 flex-wrap items-center text-base md:ml-auto">
            <a href='/' className="mr-5 hover:text-gray-900">Home</a>
            <a href='/About' className="mr-5 hover:text-gray-900">About</a>
            <a href='/Services' className="mr-5 hover:text-gray-900">Services</a>
            <a href='/Contact' className="hover:text-gray-900">Contact</a>
          </nav>
          <a className="flex order-first lg:order-none lg:w-1/5 title-font font-medium items-center text-gray-900 lg:items-center lg:justify-center mb-4 md:mb-0">
            <Image src={profilepic} height={100} width={100} alt='logo' />
            <span className="ml-3 text-xl">SKFMS</span>
          </a>
        </div>
      </header>
    </div>
  )
}

export default Navbar