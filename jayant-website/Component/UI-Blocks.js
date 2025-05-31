import React from 'react';

const Testimonals = () => {
    // Sample JSON data
    const gamesData = [
        {
            id: 1,
            title: "Tic Tac Toe",
            category: "Classic Games",
            description: "A simple and fun game for two players. Get three in a row to win!",
            imageUrl: "https://cdn.pixabay.com/photo/2023/01/22/23/16/tic-tac-toe-7737546_1280.jpg",
            link: "/Games/Tic-Tac-Toe"
        },
        {
            id: 2,
            title: "Snake",
            category: "Arcade",
            description: "Grow your snake by eating food, but don't hit the walls or yourself!",
            imageUrl: "https://cdn.pixabay.com/photo/2016/04/11/15/01/snake-1322240_960_720.jpg",
            link: "/Games/Snake"
        },
        {
            id: 3,
            title: "Sudoku",
            category: "Puzzle",
            description: "Fill the 9x9 grid with digits so that each column, row, and the nine 3x3 subgrids contain all of the digits from 1 to 9.",
            imageUrl: "https://cdn.pixabay.com/photo/2018/05/03/12/16/leisure-3371229_1280.jpg",
            link: "/Games/Sudoku"
        },
        {
            id: 4,
            title: "Memory Match",
            category: "Brain Teaser",
            description: "Flip cards to find matching pairs. Test your memory skills!",
            imageUrl: "https://cdn.pixabay.com/photo/2017/02/16/22/02/doubt-2072602_640.jpg",
            link: "/Games/Memory-Match"
        },
        {
            id: 5,
            title: "Stone Paper Scisor",
            category: "Brain Teaser",
            description: "Flip cards to find matching pairs. Test your memory skills!",
            imageUrl: "https://media.istockphoto.com/id/1395632555/vector/colorful-hand-icon-set.jpg?s=612x612&w=0&k=20&c=g6r4Oms6euKipRCjlwLx-8MPs1pajjnP4_aK0r6HEeo=",
            link: "/Games/Stone-Paper-Scisor"
        }
    ];

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-wrap -m-4">
                    {gamesData.map((game) => (
                        <a href={game.link} key={game.id} className="xl:w-1/3 md:w-1/2 p-4 ">
                            <div className="bg-gray-100 p-6 rounded-lg w-full">
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