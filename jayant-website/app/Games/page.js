import Testimonals from '@/Component/Testimonal';
import React from 'react';

const Games = () => {

    return (<>
        <section className="text-gray-600 body-font bg-gray-300">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-wrap w-full mb-20">
                    <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
                        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">Our Awesome Games Collection</h1>
                        <div className="h-1 w-20 bg-indigo-500 rounded"></div>
                    </div>
                    <p className="lg:w-1/2 w-full leading-relaxed text-gray-500">Explore a variety of fun and engaging games. From classic puzzles to arcade challenges, there's something for everyone!</p>
                </div>
            </div>
            <Testimonals/>
        </section>
        
    </>
    );
};

export default Games;