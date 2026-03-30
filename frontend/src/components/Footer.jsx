import React from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className='bg-gradient-to-br from-[#002B36] to-[#004D40] text-white pt-16 pb-8 transition-all'>
            <div className='flex flex-col md:grid md:grid-cols-[1.5fr_1fr_1fr_1.5fr] gap-12 section-padding mb-12'>
                {/* Column 1: Brand & Description */}
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        {/* Logo moved to left */}
                        <div className='bg-white/10 p-2 rounded-xl backdrop-blur-sm inline-block'>
                            <div className='flex items-center gap-2'>
                                <div className='w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold shadow-lg'>RS</div>
                                <div className='text-white'>
                                    <p className='font-bold text-lg leading-none tracking-tight'>RS Path Lab &amp; Digital X-Ray</p>
                                    <p className='text-[10px] text-gray-300 tracking-widest uppercase'>Diagnostic &amp; Imaging Center</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className='text-gray-300 text-sm leading-relaxed mb-6'>
                        Your trusted partner for accurate diagnostics and timely results in Jamshedpur.
                        We offer a comprehensive range of services including advanced blood tests,
                        modern Digital X-Ray facility, and customized Health Check-up Packages.
                    </p>
                    <div className='flex gap-4'>
                        {/* Social Placeholders */}
                        <div className='w-8 h-8 rounded-full bg-teal-800 flex items-center justify-center cursor-pointer hover:bg-primary transition-colors'>🐦</div>
                        <div className='w-8 h-8 rounded-full bg-teal-800 flex items-center justify-center cursor-pointer hover:bg-primary transition-colors'>📘</div>
                        <div className='w-8 h-8 rounded-full bg-teal-800 flex items-center justify-center cursor-pointer hover:bg-primary transition-colors'>📸</div>
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div>
                    <h3 className='text-lg font-semibold mb-6 text-teal-400'>Quick Links</h3>
                    <ul className="flex flex-col gap-3 text-gray-300 text-sm">
                        <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                        <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                        <li><Link to="/packages" className="hover:text-primary transition-colors">All Packages</Link></li>
                        <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                        <li><Link to="/doctors" className="hover:text-primary transition-colors">Doctors</Link></li>
                    </ul>
                </div>

                {/* Column 3: Services */}
                <div>
                    <h3 className='text-lg font-semibold mb-6 text-teal-400'>Services</h3>
                    <ul className="flex flex-col gap-3 text-gray-300 text-sm">
                        <li><Link to="/packages/bloodtest" className="hover:text-primary transition-colors">Blood Tests</Link></li>
                        <li><Link to="/packages/full-body-checkup" className="hover:text-primary transition-colors">Full Body Checkup</Link></li>
                        <li><Link to="/packages/xray" className="hover:text-primary transition-colors">X-Ray & Radiology</Link></li>
                        <li><Link to="/packages/diabetes" className="hover:text-primary transition-colors">Diabetes Screening</Link></li>
                        <li><Link to="/packages/covid" className="hover:text-primary transition-colors">Covid-19 Testing</Link></li>
                    </ul>
                </div>

                {/* Column 4: Newsletter / Contact */}
                <div>
                    <h3 className='text-lg font-semibold mb-6 text-teal-400'>Stay Updated</h3>
                    <p className='text-gray-300 text-sm mb-4'>Subscribe to our newsletter for health tips and exclusive offers.</p>
                    <div className='flex gap-2 mb-6'>
                        <input type="email" placeholder='Enter your email' className='bg-teal-900 icon-white text-sm p-3 rounded-l-lg outline-none w-full border border-teal-800 focus:border-teal-500 transition-colors' />
                        <button className='bg-primary px-4 py-2 rounded-r-lg hover:bg-primary-dark transition-colors'>Subscribe</button>
                    </div>
                    {/* Right Section - Contact */}
                    <div>
                        <h3 className='text-xl font-bold mb-4'>Contact Us</h3>
                        <ul className='space-y-4 text-gray-400 text-sm'>
                            <li className='flex items-start gap-3'>
                                <span className='text-xl'>📍</span>
                                <span>Harharguttu Shiv Mandir Chowk,<br />Jamshedpur, 831002</span>
                            </li>
                            <li className='flex items-center gap-3'>
                                <span className='text-xl'>📞</span>
                                <div>
                                    <p>+91 82102 36683</p>
                                    <p>+91 90979 56657</p>
                                </div>
                            </li>
                            <li className='flex items-center gap-3'>
                                <span className='text-xl'>📧</span>
                                <span>support@rspathlab.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className='border-t border-teal-900 pt-8'>
                <p className='text-center text-sm text-gray-400 font-medium'>
                    Copyright © 2024 RS Path Lab &amp; Digital X-Ray. All Rights Reserved.<br />
                    <span className='text-xs text-gray-600 italic'>Providing quality healthcare since inception.</span>
                </p>
            </div>
        </footer>
    );
};

export default Footer;