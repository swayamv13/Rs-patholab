// src/components/SpecialityMenu.jsx

import React from 'react';
import { specialityData } from '../assets/assets'; // Make sure this is updated with new icons
import { Link } from 'react-router-dom';

const SpecialityMenu = () => {
    return (
        // Added back the gap-4 for spacing between the header and the content
        <div className='flex flex-col items-center gap-4 py-16 text-gray-800' id='speciality'>
            
            {/* ⭐️ ADDED SECTION HEADER ⭐️ */}
            <h1 className='text-3xl font-medium'>Diagnostic Services</h1>
            <p className='sm:w-1/3 text-center text-sm'>Simply browse our complete list of available tests and scans, or select a service category below.</p>
            {/* --------------------------- */}
            
            {/* The main content area: flex-wrap is used to allow icons to stack on small screens */}
            <div className='flex justify-center gap-x-8 gap-y-6 pt-5 w-full flex-wrap'>
                {specialityData.map((item, index) => (
                    <Link 
                        onClick={() => window.scrollTo(0, 0)} 
                        className='flex flex-col items-center cursor-pointer flex-shrink-0 
                                   hover:translate-y-[-5px] transition-all duration-300 transform' 
                        key={index} 
                        // Using item.slug if available, otherwise generating it from the speciality name
                        to={`/packages/${item.slug || item.speciality.trim().toLowerCase().replace(/ /g, '-')}`}
                    >
                        {/* Circular Icon Container (from the previous requested design) */}
                        <div className='w-28 h-28 sm:w-32 sm:h-32 bg-gray-100 rounded-full 
                                        flex items-center justify-center shadow-sm mb-2'>
                            <img 
                                src={item.image} 
                                alt={item.speciality}
                                className='w-16 h-16 sm:w-20 sm:h-20 object-contain'
                            />
                        </div>
                        <p className='text-sm font-medium text-gray-700'>{item.speciality}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default SpecialityMenu;