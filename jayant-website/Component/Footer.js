import React from 'react'
import Image from 'next/image'
import profilepic from '@/app/favicon.ico'
import footerCategoriesData from '@/Component/Data.json'


const Footer = () => {
  return (
    <footer className="text-gray-600 body-font bg-black ">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap md:text-left text-center order-first">
          {footerCategoriesData.footerCategoriesData.map((categoryGroup, index) => (
            <div key={index} className="lg:w-1/3 md:w-1/2 sm:1/1 w-full  px-4">
              <h2 className="title-font font-large text-white tracking-widest text-sm mb-3">
                {categoryGroup.title}
              </h2>
              <nav className="list-none mb-10">
                {categoryGroup.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={link.url} className="text-white hover:text-gray-800">
                      {link.name}
                    </a>
                  </li>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-black">
        <div className="container px-5 py-6 mx-auto flex items-center sm:flex-row flex-col">
          <a className="flex title-font font-medium items-center md:justify-start justify-center text-white">
            <Image alt='logo' src={profilepic} height={100} width={100} className='rounded-full'/>
            <span className="ml-3 text-xl">Jayant Website</span>
          </a>
          <p className="text-sm text-gray-500 sm:ml-6 sm:mt-0 mt-4">
            © 2025 Jayant Website —
          </p>
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
        <a href='/About-us' className="ml-3 text-gray-400 hover:text-white">
          About
        </a>
        <a href='/privacy' className="ml-3 text-gray-400 hover:text-white">
          Privacy Policy
        </a>
        <a href='/terms' className="ml-3 text-gray-400 hover:text-white">
          Terms and Conditions
        </a>
      </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;