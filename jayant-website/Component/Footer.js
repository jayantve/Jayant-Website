import React from 'react'
import Image from 'next/image'
import profilepic from '@/app/favicon.ico'

const Footer = () => {
    return (
        <div>
            <footer className="text-black-900 bg-white-900 body-font relative bottom-0">
                <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
                    <a className="flex title-font font-medium items-center md:justify-start justify-center text-black-900">
                        <Image hieght={100} width={100} alt="logo" src={profilepic} />
                        <span className="ml-3 text-xl">Shree Krishna F/M Services </span>
                    </a>
                    <p className="text-sm text-gray-400 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-800 sm:py-2 sm:mt-0 mt-4">© 2020 SKFMS —
                        <a href="https://twitter.com/knyttneve" className="text-gray-500 ml-1" target="_blank" rel="noopener noreferrer">@skfms</a>
                    </p>

                </div>
            </footer>
        </div>
    )
}

export default Footer