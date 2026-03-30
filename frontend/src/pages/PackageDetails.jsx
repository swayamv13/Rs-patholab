
import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { CartContext } from '../context/CartContext'
import { assets } from '../assets/assets'

const PackageDetails = () => {
    const { testId } = useParams()
    const { healthPackages } = useContext(AppContext)
    const { addToCart } = useContext(CartContext)
    const navigate = useNavigate()
    const [packageData, setPackageData] = useState(null);
    const location = useLocation(); // ⭐️ Access navigation state ⭐️
    const [activeTab, setActiveTab] = useState('details')

    useEffect(() => {
        // 1. Check if data was passed via navigation (e.g. from Home "Most Prescribed")
        if (location.state) {
            setPackageData({
                ...location.state,
                // Ensure defaults if missing from the simple object
                discountedPrice: location.state.discountedPrice || location.state.price,
                details: location.state.details || [
                    "No special preparation required",
                    "Reports within 24 hours",
                    location.state.params || "Parameters varies"
                ]
            });
            window.scrollTo(0, 0);
            return;
        }

        if (!testId) return;

        // 2. Try to find in standard health packages
        const packagesSource = healthPackages; // Assuming contextPackages is a typo and should be healthPackages
        let foundPackage = packagesSource.find(p => p.id === testId || p.id === parseInt(testId, 10));

        // 3. Fallback for "test-" IDs if state wasn't passed (direct link access)
        if (!foundPackage && testId.toString().startsWith('test-')) {
            foundPackage = {
                id: testId,
                name: "Diagnostic Test",
                originalPrice: 0,
                discountedPrice: 0,
                details: ["Contact support for details", "Daily", "Unknown parameters"],
                categorySlug: "custom"
            };
        }

        if (foundPackage) {
            setPackageData(foundPackage)
        }
    }, [testId, healthPackages, location.state])

    const pkg = packageData

    if (!pkg) {
        return <div className='h-[60vh] flex items-center justify-center text-gray-500'>Loading details or functionality not fully connected to mock data yet...</div>
    }

    return (
        <div className='bg-gray-50 min-h-screen pb-16'>

            {/* Breadcrumb */}
            <div className='section-padding py-4 text-xs text-gray-500'>
                <span className='cursor-pointer hover:text-primary' onClick={() => navigate('/')}>Home</span>
                {' > '}
                <span className='cursor-pointer hover:text-primary' onClick={() => navigate('/Packages')}>Tests and Packages</span>
                {' > '}
                <span className='text-gray-900 font-semibold'>{pkg.name}</span>
            </div>

            <div className='section-padding grid grid-cols-1 lg:grid-cols-3 gap-8'>

                {/* Left Column: Details */}
                <div className='lg:col-span-2 space-y-6'>

                    {/* Tabs */}
                    <div className='flex items-center gap-4 border-b border-gray-200'>
                        {['details', 'overview', 'test details', "faq's"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 text-sm font-bold capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-blue-900 text-blue-900 bg-white rounded-t-lg' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Main Card */}
                    <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
                        <div className='flex justify-between items-start mb-6'>
                            <h1 className='text-2xl font-bold text-gray-900'>{pkg.name}</h1>
                            <div className='flex items-center gap-2 text-gray-400'>
                                <span className='text-xs'>4392+ Booked in Last 3 Days</span>
                                <span className='cursor-pointer hover:text-blue-900'>share</span>
                            </div>
                        </div>

                        {/* Icons Row */}
                        <div className='grid grid-cols-3 gap-4 border-t border-b border-gray-100 py-6 mb-6'>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-900 text-xl'>
                                    ♀
                                </div>
                                <div className='text-xs'>
                                    <p className='text-gray-500'>Gender for</p>
                                    <p className='font-bold text-gray-700'>Male, Female</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3 border-l border-gray-100 pl-4'>
                                <div className='w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 text-xl'>
                                    ⏱
                                </div>
                                <div className='text-xs'>
                                    <p className='text-gray-500'>Preparation</p>
                                    <p className='font-bold text-gray-700'>No special prep</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3 border-l border-gray-100 pl-4'>
                                <div className='w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 text-xl'>
                                    🧪
                                </div>
                                <div className='text-xs'>
                                    <p className='text-gray-500'>Sample Type</p>
                                    <p className='font-bold text-gray-700'>Blood / Serum</p>
                                </div>
                            </div>
                        </div>

                        {/* Overview Content */}
                        <div>
                            <h2 className='text-lg font-bold text-gray-900 mb-3'>Test Overview</h2>
                            <p className='text-gray-600 text-sm leading-relaxed mb-4'>
                                {pkg.description || "The Thyroid Profile Total is a comprehensive test designed to evaluate thyroid function, essential for metabolism, energy, and hormone regulation. This test includes crucial indicators like T3 (triiodothyronine), T4 (thyroxine), and TSH (thyroid-stimulating hormone) to diagnose conditions like hyperthyroidism, hypothyroidism, and other thyroid disorders. By measuring these hormones, healthcare providers gain valuable insight into the thyroid's performance, enabling accurate diagnosis and treatment plans for thyroid-related issues."}
                            </p>
                            <button className='text-primary font-bold text-sm border border-primary px-4 py-1.5 rounded-full hover:bg-blue-50 transition-colors'>
                                Read More
                            </button>
                        </div>
                    </div>

                </div>

                {/* Right Column: Pricing & Actions */}
                <div className='space-y-6'>

                    {/* Price Card */}
                    <div className='bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden transform hover:-translate-y-1 transition-all duration-300'>
                        <div className='bg-gradient-to-r from-blue-50 to-indigo-50 p-6 text-center border-b border-blue-100 relative overflow-hidden'>
                            {/* Decorative element */}
                            <div className='absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-blue-100 rounded-full opacity-50 blur-xl'></div>
                            <p className='font-bold text-gray-800 text-lg relative z-10'>{pkg.name}</p>
                        </div>
                        <div className='p-8 text-center'>
                            <p className='text-emerald-600 text-xs font-bold uppercase mb-2 tracking-widest'>Exclusive Offer</p>
                            <div className='flex items-center justify-center gap-3 mb-8'>
                                {pkg.originalPrice && <span className='text-gray-400 line-through text-lg font-medium'>₹{pkg.originalPrice}</span>}
                                <span className='text-4xl font-black text-blue-900'>₹{pkg.discountedPrice}</span>
                            </div>

                            <div className='flex flex-col gap-4'>
                                <button onClick={() => navigate('/appointment', { state: { type: 'lab', package: pkg } })} className='w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:from-blue-800 hover:to-blue-700 transition-all transform active:scale-[0.98] shadow-blue-900/20'>
                                    Add to Cart
                                </button>
                                <button onClick={() => navigate('/appointment', { state: { type: 'home', package: pkg } })} className='w-full bg-white text-blue-900 border-2 border-blue-100 font-bold py-4 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-colors'>
                                    Book Now
                                </button>
                            </div>
                        </div>
                        {/* Download Prompt */}
                        <div className='bg-gradient-to-r from-teal-500 to-emerald-500 p-4 flex items-center justify-between text-white'>
                            <div className='flex items-center gap-3 font-medium text-sm'>
                                <span className='bg-white/25 p-1.5 rounded-full text-xs box-content w-3 h-3 flex items-center justify-center'>⬇</span>
                                Download sample Report
                            </div>
                            <span className='cursor-pointer hover:scale-110 transition-transform bg-white/20 p-2 rounded-lg'>🔗</span>
                        </div>
                    </div>

                    {/* Assistance Card */}
                    <div className='bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl shadow-xl p-8 text-center text-white relative overflow-hidden'>
                        <div className='absolute top-0 left-0 w-full h-full bg-[url("https://www.transparenttextures.com/patterns/cubes.png")] opacity-10'></div>
                        <h3 className='font-bold text-xl mb-3 relative z-10'>Need Help Choosing?</h3>
                        <p className='text-blue-100 text-sm mb-6 leading-relaxed relative z-10'>
                            Our medical experts are here to help you select the right test for your needs.
                        </p>
                        <button className='bg-white text-blue-900 w-full py-3.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-lg relative z-10 group'>
                            <span className='group-hover:rotate-12 transition-transform duration-300'>📞</span>
                            Call +91 98765 43210
                        </button>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default PackageDetails