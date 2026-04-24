import React, { useState, useContext, useRef } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../src/context/AppContext';
import { CartContext } from '../../src/context/CartContext';
import { useNavigate } from 'react-router-dom';

const AIPrescriptionModal = ({ isOpen, onClose }) => {
    const { backendUrl, token, healthPackages } = useContext(AppContext);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [status, setStatus] = useState('IDLE'); // IDLE, SCANNING, SUCCESS, ERROR
    const [parsedData, setParsedData] = useState(null);
    const [matchedPackages, setMatchedPackages] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    
    // Reset state when closing
    const handleClose = () => {
        setFile(null);
        setPreview(null);
        setStatus('IDLE');
        setParsedData(null);
        setMatchedPackages([]);
        setErrorMsg('');
        onClose();
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        
        // Basic validation
        if (!selectedFile.type.startsWith('image/') && selectedFile.type !== 'application/pdf') {
            toast.error("Please upload an image or PDF file.");
            return;
        }

        setFile(selectedFile);
        
        // Create preview for images
        if (selectedFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result);
            reader.readAsDataURL(selectedFile);
        } else {
            // PDF Preview placeholder
            setPreview('PDF_ICON'); 
        }
    };

    const analyzePrescription = async () => {
        if (!file) {
            toast.error("Please upload a file first.");
            return;
        }
        if (!token) {
            toast.error("Please login to use AI Prescription Parsing.");
            handleClose();
            navigate('/login');
            return;
        }

        try {
            setStatus('SCANNING');
            const formData = new FormData();
            formData.append('document', file);

            const { data } = await axios.post(`${backendUrl}/api/ai/parse-prescription`, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    token: token 
                }
            });

            if (data.success) {
                setParsedData(data.parsedData);
                matchTests(data.parsedData.tests);
                setStatus('SUCCESS');
            } else {
                toast.error(data.message || "Could not parse document.");
                setErrorMsg(data.message || "Could not parse document.");
                setStatus('ERROR');
            }
        } catch (error) {
            console.error("AI Error:", error);
            const msg = error.response?.data?.message || error.message || "An error occurred during analysis.";
            toast.error(msg);
            setErrorMsg(msg);
            setStatus('ERROR');
        }
    };

    // Very simple fuzzy matching logic
    const matchTests = (extractedTests) => {
        if (!extractedTests || extractedTests.length === 0) return;
        
        const matched = [];
        
        extractedTests.forEach(testName => {
            const lowerTest = testName.toLowerCase();
            // Try to find a package that includes the test name or vice-versa
            const foundPkg = healthPackages?.find(pkg => {
                const pkgName = pkg.name.toLowerCase();
                return pkgName.includes(lowerTest) || lowerTest.includes(pkgName);
            });
            
            if (foundPkg) {
                // Prevent duplicates
                if (!matched.some(m => m.id === foundPkg.id)) {
                    matched.push(foundPkg);
                }
            }
        });
        
        setMatchedPackages(matched);
    };

    const handleAddAllToCart = () => {
        matchedPackages.forEach(pkg => addToCart(pkg));
        toast.success(`Successfully added ${matchedPackages.length} matched tests to your cart!`);
        handleClose();
        navigate('/cart');
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 sm:p-6 flex justify-center py-10" onClick={handleClose}>
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col my-auto h-auto relative" onClick={(e) => e.stopPropagation()}>
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 text-white p-2 rounded-xl text-xl shadow-lg">✨</div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 leading-tight">AI Prescription Scanner</h2>
                            <p className="text-xs text-blue-600 font-semibold tracking-wide">POWERED BY GOOGLE GEMINI</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="text-gray-500 hover:text-red-600 hover:bg-red-50 w-10 h-10 rounded-full flex items-center justify-center transition-colors text-3xl font-light">&times;</button>
                </div>

                <div className="overflow-y-auto flex-1 p-6">
                    {status === 'IDLE' && (
                        <div className="flex flex-col items-center">
                            <p className="text-gray-600 text-center mb-6 text-sm">
                                Upload a photo of your doctor's prescription. Our AI will automatically read the handwriting and suggest the tests you need to book!
                                <br/><span className="text-xs text-gray-400 mt-2 block">(Limit: 3 uploads per day)</span>
                            </p>
                            
                            {!file ? (
                                <div className="w-full">
                                    <label className="border-2 border-dashed border-blue-200 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all bg-gray-50 group">
                                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">📤</div>
                                        <span className="text-blue-600 font-bold">Click to Upload</span>
                                        <span className="text-gray-400 text-xs mt-2">JPEG, PNG, or PDF</span>
                                        <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileSelect}/>
                                    </label>
                                    <button onClick={handleClose} className="mt-4 text-gray-500 font-bold hover:text-gray-800 transition-colors">
                                        Cancel & Go Back
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full flex flex-col items-center">
                                    <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border-4 border-gray-100 shadow-md">
                                        {preview === 'PDF_ICON' ? (
                                            <div className="h-48 bg-gray-50 flex items-center justify-center flex-col">
                                                <span className="text-6xl mb-2">📄</span>
                                                <span className="font-bold text-gray-500">{file.name}</span>
                                            </div>
                                        ) : (
                                            <img src={preview} alt="Upload Preview" className="w-full h-auto object-cover max-h-64" />
                                        )}
                                        <button onClick={() => setFile(null)} className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full shadow-lg flex items-center justify-center font-bold hover:bg-red-600">&times;</button>
                                    </div>
                                    <button 
                                        onClick={analyzePrescription}
                                        className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-8 rounded-xl w-full max-w-sm shadow-xl shadow-blue-200 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                                    >
                                        <span>✨</span> Extract Tests Now
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {status === 'SCANNING' && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="relative w-24 h-24 mb-6">
                                <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">✨</div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Analyzing Prescription...</h3>
                            <p className="text-gray-500 text-sm animate-pulse">Reading doctor's handwriting & finding matches.</p>
                        </div>
                    )}

                    {(status === 'SUCCESS' || status === 'ERROR') && (
                        <div className="flex flex-col animate-fade-in-up">
                            {status === 'SUCCESS' ? (
                                <>
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 text-green-200 opacity-20 text-6xl">📝</div>
                                        <h3 className="text-green-800 font-bold text-sm uppercase mb-1 flex items-center gap-2 border-b border-green-200/50 pb-2">
                                            <span>🩺</span> AI Summary
                                        </h3>
                                        <p className="text-green-900 mt-2 text-sm leading-relaxed">{parsedData?.briefInfo}</p>
                                    </div>

                                    <h3 className="font-bold text-gray-800 mb-3 text-lg flex items-center justify-between">
                                        <span>Prescribed Tests</span>
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-lg">Found {parsedData?.tests?.length || 0}</span>
                                    </h3>
                                    
                                    {parsedData?.tests && parsedData.tests.length > 0 ? (
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {parsedData.tests.map((test, idx) => (
                                                <span key={idx} className="bg-white border border-gray-200 shadow-sm px-3 py-1.5 rounded-lg text-sm text-gray-700 font-medium">{test}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm mb-6">No specific lab tests were confidently detected in the image.</p>
                                    )}

                                    <hr className="my-6 border-dashed border-gray-200" />

                                    <h3 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
                                        <span>🎯</span> Package Matches
                                    </h3>
                                    
                                    {matchedPackages.length > 0 ? (
                                        <div className="space-y-3 mb-6">
                                            {matchedPackages.map(pkg => (
                                                <div key={pkg.id} className="flex items-center justify-between bg-blue-50/50 border border-blue-100 p-3 rounded-xl hover:bg-blue-50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-blue-100 flex items-center justify-center text-xl text-blue-600">✅</div>
                                                        <div>
                                                            <p className="font-bold text-gray-800 text-sm">{pkg.name}</p>
                                                            <p className="text-xs text-blue-600 font-bold">₹{pkg.price}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                                            <p className="text-orange-800 text-sm">We couldn't automatically match these to our exact packages. Please search manually or call us at 8210236683.</p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-5xl mb-4">⚠️</div>
                                    <h3 className="text-xl font-bold text-red-600 mb-2">Scan Failed</h3>
                                    <p className="text-gray-600 mb-2 text-sm">Please make sure the image is clear and contains a valid medical prescription.</p>
                                    <p className="text-red-500 font-mono text-xs bg-red-50 p-2 rounded max-w-sm mx-auto overflow-hidden text-clip">{errorMsg}</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                                <button onClick={() => { setFile(null); setStatus('IDLE'); setMatchedPackages([]); }} className="flex-1 py-3 text-sm font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                    Scan Another
                                </button>
                                {status === 'SUCCESS' && matchedPackages.length > 0 && (
                                    <button onClick={handleAddAllToCart} className="flex-[2] py-3 text-sm font-bold text-white bg-green-600 rounded-xl hover:bg-green-700 shadow-lg hover:shadow-green-200 transition-all">
                                        Add {matchedPackages.length} Items to Cart
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AIPrescriptionModal;
