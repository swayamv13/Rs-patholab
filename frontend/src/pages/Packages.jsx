import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { CartContext } from '../context/CartContext';
import { specialityData } from '../assets/assets';

const Packages = () => {
    // 1. Context and State
    const { healthPackages } = useContext(AppContext);
    const { addToCart } = useContext(CartContext);
    const { speciality: urlCategory } = useParams();
    const [filteredPackages, setFilteredPackages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // 2. Filter Logic 
    useEffect(() => {
        if (!healthPackages) return;
        let base = healthPackages;
        if (urlCategory) {
            base = base.filter(p => p.categorySlug && p.categorySlug.toLowerCase() === urlCategory.toLowerCase());
        }
        if (searchQuery.trim()) {
            base = base.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        setFilteredPackages(base);
    }, [healthPackages, urlCategory, searchQuery]);

    return (
        <div className='bg-gray-50 min-h-screen py-10'>
            <div className='section-padding'>

                {/* Header section */}
                <div className='text-center mb-8'>
                    <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>Comprehensive Lab Tests</h1>
                    <p className='text-gray-500 max-w-2xl mx-auto mb-6'>Choose from our wide range of diagnostic tests and health checkup packages. Accurate results guaranteed.</p>
                    {/* Search Bar */}
                    <div className='max-w-xl mx-auto flex items-center gap-3 bg-white border-2 border-blue-100 rounded-2xl px-5 py-3 shadow-sm focus-within:border-blue-500 transition-all'>
                        <span className='text-xl text-gray-400'>🔍</span>
                        <input
                            type='text'
                            placeholder='Search test or package name...'
                            className='flex-1 outline-none text-gray-700 text-base font-medium bg-transparent'
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className='text-gray-400 hover:text-gray-700 font-bold text-lg'>✕</button>
                        )}
                    </div>
                </div>

                <div className='flex flex-col lg:flex-row gap-8'>

                    {/* FILTER SIDEBAR */}
                    <div className='w-full lg:w-1/4 flex-shrink-0'>
                        <div className='bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden sticky top-24'>
                            <h2 className='text-lg font-bold px-6 py-4 bg-gradient-to-r from-blue-900 to-blue-800 text-white'>
                                Categories
                            </h2>
                            <ul className='space-y-1 p-2'>
                                <li>
                                    <Link
                                        to="/Packages"
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
                                        ${!urlCategory ? 'bg-blue-50 text-blue-900 shadow-sm ring-1 ring-blue-100' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        <span className='text-xl'>🏥</span>
                                        All Packages
                                    </Link>
                                </li>
                                {specialityData.map((cat, index) => (
                                    <li key={index}>
                                        <Link
                                            to={`/Packages/${cat.slug}`}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
                                            ${urlCategory === cat.slug ? 'bg-blue-50 text-blue-900 shadow-sm ring-1 ring-blue-100' : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            <img src={cat.image} className="w-6 h-6 object-contain rounded-full bg-white p-0.5" alt="" />
                                            {cat.speciality}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* PACKAGE GRID */}
                    <div className='w-full lg:w-3/4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                        {filteredPackages.length > 0 ? (
                            filteredPackages.map((item) => (
                                <div
                                    key={item.id}
                                    className='bg-white group rounded-2xl border border-gray-200 shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-2 flex flex-col relative overflow-hidden'
                                >

                                    {/* Card Top Decorative Gradient */}
                                    <div className='h-1.5 w-full bg-gradient-to-r from-blue-400 to-blue-600 group-hover:h-2 transition-all'></div>

                                    <div className='p-6 flex flex-col h-full'>

                                        {/* Status Row */}
                                        <div className='flex justify-between items-start mb-4'>
                                            {item.discount > 0 ? (
                                                <span className='bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider'>
                                                    {item.discount}% OFF
                                                </span>
                                            ) : (
                                                <span className='bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider'>
                                                    Best Value
                                                </span>
                                            )}
                                            <span className='text-blue-900 bg-blue-50 w-10 h-10 flex items-center justify-center rounded-full group-hover:bg-blue-900 group-hover:text-white transition-colors duration-300'>
                                                🧬
                                            </span>
                                        </div>

                                        {/* Name */}
                                        <h3 className='font-bold text-lg text-gray-900 mb-3 leading-tight min-h-[50px] group-hover:text-blue-900 transition-colors'>
                                            {item.name}
                                        </h3>

                                        {/* Parameters Chip */}
                                        <div className='mb-6'>
                                            <span className='text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-md border border-gray-200 inline-block'>
                                                {item.details.find(d => d.includes('Parameter')) || 'Multi-parameter test'}
                                            </span>
                                        </div>

                                        {/* Price Section */}
                                        <div className='mt-auto pt-6 border-t border-gray-100'>
                                            <div className='flex items-end gap-3 mb-5'>
                                                <p className='text-2xl font-black text-blue-900'>
                                                    ₹{item.discountedPrice.toFixed(0)}
                                                </p>
                                                {item.discount > 0 && (
                                                    <p className='text-sm text-gray-400 line-through font-medium mb-1'>
                                                        ₹{item.originalPrice}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className='grid grid-cols-2 gap-3'>
                                                <button
                                                    onClick={() => addToCart(item)}
                                                    className='col-span-1 border-2 border-blue-900 text-blue-900 font-bold py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors'
                                                >
                                                    Add to Cart
                                                </button>
                                                <Link
                                                    to={`/book/${item.id}`}
                                                    className='col-span-1 bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold py-2.5 rounded-xl text-sm text-center hover:shadow-lg hover:from-blue-800 hover:to-blue-700 transition-all shadow-blue-900/20'
                                                >
                                                    Book Now
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                                <div className='text-6xl mb-4 opacity-30'>🔍</div>
                                <h3 className='text-xl font-bold text-gray-800'>No packages found</h3>
                                <p className='text-gray-500 mt-2'>Try selecting a different category or view all tests.</p>
                                <Link to="/Packages" className='mt-6 text-blue-600 font-bold hover:underline'>View All Packages</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Packages;