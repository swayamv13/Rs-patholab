// src/components/PopularTests.jsx (or whatever your file is named)

import React, { useContext } from 'react';
import { Link } from 'react-router-dom'; // ⭐️ Import Link for proper routing ⭐️
import { AppContext } from '../context/AppContext';
// ⭐️ Assume healthPackages are now imported from assets/assets or similar ⭐️
// import { healthPackages } from '../assets/assets'; 

// Import icons (assuming you have a way to get simple icons like react-icons or equivalent)
const InfoIcon = ({ className }) => <span className={`text-blue-600 ${className}`}>ⓘ</span>;
const CalendarIcon = ({ className }) => <span className={`text-blue-600 ${className}`}>🗓️</span>;
const ParametersIcon = ({ className }) => <span className={`text-blue-600 ${className}`}>🧪</span>;


const PopularTests = () => {
    
    // ⭐️ We'll get the data from context as you intended ⭐️
    const { healthPackages } = useContext(AppContext); 
    
    // Define the custom colors used in the design
    const PRIMARY_YELLOW = '#FFBF00'; // Rich Amber for the headers/badges
    const ACCENT_BLUE = '#1E3A8A'; // Deep blue for buttons/text

    // Safety check for undefined data
    if (!healthPackages || healthPackages.length === 0) {
        return <div className="text-center py-16">No popular packages available.</div>;
    }

    return (
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto text-center">
                
                {/* Section Titles */}
                <div className='flex justify-between items-center mb-10'>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Popular Tests / Health Packages
                    </h2>
                    {/* ⭐️ FIX: VIEW ALL BUTTON ROUTING ⭐️ */}
                    <Link to="/packages" className="text-sm font-semibold text-blue-600 hover:underline">
                        View All
                    </Link>
                </div>
                
                {/* Grid Container for Cards */}
                <div className="mt-4 grid gap-8 lg:grid-cols-3 md:grid-cols-2">
                    {/* The map logic remains the same, ensuring 'item.details' is an array with at least 3 elements */}
                    {healthPackages.slice(0, 3).map((item) => ( // Only show first 3 for 'popular' section
                        <div 
                            key={item.id} 
                            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-shadow duration-300 hover:shadow-xl"
                        >
                            {/* Card Header (Yellow Background) */}
                            <div className="p-4 rounded-t-xl" style={{ backgroundColor: PRIMARY_YELLOW }}>
                                <h3 className="text-lg font-semibold text-white uppercase tracking-wide">
                                    {item.name}
                                </h3>
                            </div>
                            
                            {/* Card Body and Details */}
                            <div className="p-6">
                                <div className="space-y-4">
                                    {/* Detail 1: Fasting/Form Requirement */}
                                    <div className="flex items-start text-left text-sm text-gray-700">
                                        <InfoIcon className="h-5 w-5 mr-3 mt-1 flex-shrink-0" />
                                        <p>{item.details[0]} <span className='text-blue-600'>...Read more</span></p>
                                    </div>
                                    
                                    {/* Detail 2: Availability */}
                                    <div className="flex items-center text-left text-sm text-gray-700">
                                        <CalendarIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                                        <p>Daily</p>
                                    </div>

                                    {/* Detail 3: Parameters Covered */}
                                    <div className="flex items-center text-left text-sm text-gray-700">
                                        <ParametersIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                                        <p>{item.details[2]}</p>
                                    </div>
                                </div>
                                
                                {/* Pricing and Discount */}
                                <div className="mt-6 flex justify-between items-end border-t pt-4">
                                    <div className="text-left">
                                        {/* Original Price (Strikethrough) */}
                                        <p className="text-sm line-through text-gray-500">
                                            ₹{item.originalPrice.toLocaleString()}
                                        </p>
                                        {/* Discounted Price (Large) */}
                                        <p className="text-3xl font-extrabold" style={{ color: ACCENT_BLUE }}>
                                            ₹{item.discountedPrice.toFixed(2)}
                                        </p>
                                    </div>

                                    {/* Discount Badge - Removed complex clipPath for Tailwind-only simple circle badge */}
                                    <div 
                                        className="h-16 w-16 rounded-full flex flex-col items-center justify-center text-white font-bold text-sm"
                                        style={{ backgroundColor: PRIMARY_YELLOW }}
                                    >
                                        <span className="text-xl leading-none">{item.discount}%</span>
                                        <span className="text-xs leading-none">OFF</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-8 flex justify-between items-center">
                                    <Link to={`/book/${item.id}`}>
                                        <button 
                                            className="px-6 py-2 rounded-lg text-white font-semibold transition duration-150 flex items-center"
                                            style={{ backgroundColor: ACCENT_BLUE }}
                                        >
                                            Book Now 
                                        </button>
                                    </Link>
                                    {/* Know More link */}
                                    <Link to={`/book/${item.id}`} className="text-sm font-semibold hover:underline" style={{ color: ACCENT_BLUE }}>
                                        Know More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PopularTests;