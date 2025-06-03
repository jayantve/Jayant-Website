import React from 'react';
import gamesData from '@/Component/Data.json';

const Testimonals = () => {
    return (
        <section className="text-gray-600 body-font ">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-wrap -m-4">
                    {gamesData.gamesData.map((game) => (
                        <a href={game.link} key={game.id} className="xl:w-1/3 md:w-1/2 sm:w-full p-4 ">
                            <div className="bg-gray-300 p-6 rounded-lg w-full">
                                <img className="h-40 rounded w-full object-cover object-center mb-6" src={game.imageUrl} alt={game.title} />
                                <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">{game.category}</h3>
                                <h2 className="text-lg text-gray-900 font-medium title-font mb-4">{game.title}</h2>
                                <p className="leading-relaxed text-base">{game.description}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonals;