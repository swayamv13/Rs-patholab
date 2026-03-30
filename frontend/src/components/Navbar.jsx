import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const Navbar = () => {
    const navigate = useNavigate()
    const { cartItems } = useContext(CartContext)

    const { token, setToken, logout } = useContext(AppContext)
    const [showMenu, setShowMenu] = useState(false)


    return (
        <div className='sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm mb-1 transition-all duration-300 font-sans'>

            <div className='flex items-center justify-between text-sm py-4 section-padding'>

                {/* Logo */}
                <div onClick={() => navigate('/')} className='flex items-center gap-2 cursor-pointer'>
                    <div className='flex items-center gap-1 group'>
                        <div className='bg-yellow-400 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300'>
                            <span className='text-2xl'>🔬</span>
                        </div>
                        <div className='leading-tight'>
                            <h1 className='text-xl font-extrabold text-blue-900 tracking-tight'>RS Path Lab</h1>
                            <p className='text-[10px] text-gray-500 font-bold uppercase tracking-widest group-hover:text-primary transition-colors hidden sm:block'>Diagnostic Services</p>
                        </div>
                    </div>
                </div>

                {/* Desktop Menu */}
                <ul className='hidden xl:flex items-center gap-6 font-semibold text-gray-700 text-[15px]'>
                    {/* Call Us Link */}
                    <a href="tel:918210236683" className='flex items-center gap-2 group hover:scale-105 transition-transform mr-4'>
                        <span className='text-xl rotate-12'>📞</span>
                        <div className='leading-tight'>
                            <p className='text-[10px] text-gray-500 font-bold uppercase tracking-widest'>Call Us Now</p>
                            <p className='text-lg font-extrabold text-blue-900 group-hover:text-primary transition-colors'>82102 36683</p>
                        </div>
                    </a>

                    <NavLink to='/about'>
                        <li className='cursor-pointer hover:text-blue-900 transition-colors'>About</li>
                    </NavLink>

                    <li className='group relative cursor-pointer hover:text-blue-900 transition-colors'>
                        <span onClick={() => navigate('/Packages')}>Tests &amp; Packages</span>
                    </li>
                    <NavLink to='/contact'>
                        <li className='cursor-pointer hover:text-blue-900 transition-colors'>Contact Us</li>
                    </NavLink>
                </ul>

                {/* ACTION BUTTONS & USER SECTION */}
                <div className='flex items-center gap-4'>

                    {/* NEW: Prominent Action Buttons */}
                    <div className='hidden lg:flex items-center gap-3 mr-2'>
                        <button className='flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-lg hover:shadow-blue-200 hover:scale-105 transition-all animate-pulse-slow'>
                            <span>📤</span> Upload Prescription
                        </button>
                    </div>

                    {/* Cart Icon */}
                    <div onClick={() => navigate('/cart')} className='flex items-center gap-2 cursor-pointer hover:text-blue-900 transition-colors relative group'>
                        <div className='relative'>
                            <span className='text-2xl group-hover:scale-110 transition-transform block'>🛒</span>
                            {cartItems && cartItems.length > 0 && (
                                <div className='absolute -top-1 -right-1 bg-yellow-400 text-xs text-blue-900 rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm animate-bounce'>
                                    {cartItems.length}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* User Profile */}
                    {
                        token
                            ? <div className='flex items-center gap-2 cursor-pointer group relative'>
                                <div className='w-10 h-10 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-md group-hover:border-primary transition-colors'>
                                    <img className='w-full h-full object-cover' src={assets.profile_pic} alt="" />
                                </div>
                                {/* Dropdown */}
                                <div className='absolute top-full right-0 mt-2 min-w-48 bg-white rounded-xl shadow-xl border border-gray-100 text-gray-600 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right translate-y-2 group-hover:translate-y-0'>
                                    <div className='flex flex-col p-2'>
                                        <p onClick={() => navigate('my-profile')} className='px-4 py-2 hover:bg-blue-50 hover:text-primary rounded-lg cursor-pointer transition-colors'>My Profile</p>
                                        <p onClick={() => navigate('my-appointments')} className='px-4 py-2 hover:bg-blue-50 hover:text-primary rounded-lg cursor-pointer transition-colors'>My Appointments</p>
                                        <hr className='my-1 border-gray-100' />
                                        <p onClick={logout} className='px-4 py-2 hover:bg-red-50 hover:text-red-500 rounded-lg cursor-pointer transition-colors'>Logout</p>
                                    </div>
                                </div>
                            </div>
                            : <button onClick={() => navigate('/login')} className='bg-blue-900 text-white px-5 py-2 rounded-lg font-bold text-sm transition-transform active:scale-95 hover:bg-blue-800 shadow-lg hidden md:block'>
                                Sign In
                            </button>
                    }

                    {/* Mobile Menu Icon */}
                    <img onClick={() => setShowMenu(true)} className='w-6 md:hidden cursor-pointer' src={assets.menu_icon} alt="" />
                </div>

                {/* Mobile Menu Backdrop */}
                {showMenu && (
                    <div onClick={() => setShowMenu(false)} className="fixed top-20 inset-x-0 bottom-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"></div>
                )}

                {/* Mobile Menu Floating Card */}
                <div className={`fixed top-20 right-4 z-50 bg-white transition-all duration-300 shadow-2xl rounded-2xl border border-gray-100 overflow-hidden origin-top-right ${showMenu ? 'scale-100 opacity-100' : 'scale-95 opacity-0 invisible'} w-72`}>
                    <div className='p-5 flex flex-col'>
                        {/* Header hidden for cleaner card look, or kept minimal */}
                        <div className='flex items-center justify-between mb-4 pb-2 border-b border-gray-100'>
                            <h2 className='text-lg font-bold text-blue-900'>Menu</h2>
                            <img onClick={() => setShowMenu(false)} className='w-6 cursor-pointer hover:rotate-90 transition-transform opacity-60 hover:opacity-100' src={assets.cross_icon} alt="" />
                        </div>

                        {/* Mobile Actions */}
                        <div className='grid grid-cols-2 gap-3 mb-4'>
                            <button className='flex items-center justify-center gap-2 px-2 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all'>
                                <span>📤</span> Upload
                            </button>
                        </div>

                        <ul className='flex flex-col gap-2 text-sm font-medium text-gray-700'>
                            <NavLink onClick={() => setShowMenu(false)} to='/'><li className='px-3 py-2.5 rounded-lg hover:bg-gray-50 hover:text-primary transition-colors'>Home</li></NavLink>
                            <NavLink onClick={() => setShowMenu(false)} to='/about'><li className='px-3 py-2.5 rounded-lg hover:bg-gray-50 hover:text-primary transition-colors'>About</li></NavLink>
                            <li onClick={() => { navigate('/Packages'); setShowMenu(false); }} className='px-3 py-2.5 rounded-lg hover:bg-gray-50 hover:text-primary transition-colors cursor-pointer'>Tests & Packages</li>
                            <NavLink onClick={() => setShowMenu(false)} to='/contact'><li className='px-3 py-2.5 rounded-lg hover:bg-gray-50 hover:text-primary transition-colors'>Contact Us</li></NavLink>
                            {/* Profile Links for Mobile */}
                            {token && (
                                <>
                                    <div className='h-[1px] bg-gray-100 my-1'></div>
                                    <NavLink onClick={() => setShowMenu(false)} to='/my-profile'><li className='px-3 py-2.5 rounded-lg hover:bg-gray-50 hover:text-primary transition-colors'>My Profile</li></NavLink>
                                    <NavLink onClick={() => setShowMenu(false)} to='/my-appointments'><li className='px-3 py-2.5 rounded-lg hover:bg-gray-50 hover:text-primary transition-colors'>My Appointments</li></NavLink>
                                    <li onClick={() => { logout(); setShowMenu(false); }} className='px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors cursor-pointer font-bold'>Logout</li>
                                </>
                            )}
                        </ul>
                        {!token && (
                            <div className='mt-4 pt-3 border-t border-gray-100'>
                                <button onClick={() => { navigate('/login'); setShowMenu(false) }} className='w-full bg-blue-900 text-white py-2.5 rounded-lg font-bold shadow-md text-sm hover:bg-blue-800 transition-colors'>Sign In</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar