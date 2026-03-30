import React, { useState, useEffect } from 'react';

const StepCarousel = ({ title, data, renderCard, onViewAll, navigat }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth < 768 ? 1 : 3);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    useEffect(() => {
        const handleResize = () => {
            setItemsPerPage(window.innerWidth < 768 ? 1 : 3);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isPaused || totalPages <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
        }, 4000); // 4 seconds hold time

        return () => clearInterval(interval);
    }, [isPaused, totalPages]);

    return (
        <section className='section-padding py-16 bg-white'>
            <div className='flex justify-between items-center mb-10'>
                <h2 className='text-3xl font-bold text-gray-900'>{title}</h2>
                <button
                    onClick={onViewAll}
                    className='text-blue-600 font-bold hover:underline'
                >
                    View All
                </button>
            </div>

            {/* Carousel Container */}
            <div
                className='relative overflow-hidden'
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div
                    className='flex transition-transform duration-700 ease-in-out'
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {/* Create pages of 3 items each */}
                    {Array.from({ length: totalPages }).map((_, pageIndex) => (
                        <div key={pageIndex} className='min-w-full grid grid-cols-1 md:grid-cols-3 gap-6 px-1'>
                            {data.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage).map((item) => (
                                <React.Fragment key={item.id}>
                                    {renderCard(item)}
                                </React.Fragment>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination Dots */}
            {totalPages > 1 && (
                <div className='flex justify-center gap-2 mt-8'>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${currentIndex === idx ? 'bg-blue-600 w-4' : 'bg-gray-300'}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default StepCarousel;
