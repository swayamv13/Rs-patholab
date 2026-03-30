import React, { useContext } from 'react'
import { CartContext } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

const Cart = () => {
    const { cartItems, removeFromCart, getCartTotal, clearCart } = useContext(CartContext)
    const navigate = useNavigate()

    return (
        <div className='min-h-screen bg-gray-50 py-10'>
            <div className='section-padding'>
                <h1 className='text-3xl font-bold text-gray-900 mb-8'>Your Cart</h1>

                {cartItems.length > 0 ? (
                    <div className='flex flex-col lg:flex-row gap-8'>
                        {/* Cart Items List */}
                        <div className='flex-1'>
                            <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
                                {cartItems.map((item) => (
                                    <div key={item.id} className='flex items-center justify-between p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors'>
                                        <div className='flex-1'>
                                            <h3 className='font-semibold text-gray-800 text-lg'>{item.name}</h3>
                                            <p className='text-sm text-gray-500 mt-1'>{item.details[2]}</p>
                                        </div>
                                        <div className='flex items-center gap-6'>
                                            <p className='font-bold text-lg text-primary'>₹{item.discountedPrice}</p>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className='text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors'
                                                title="Remove"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className='w-full lg:w-96 h-fit'>
                            <div className='bg-white rounded-xl shadow-lg border border-teal-100 p-6 sticky top-24'>
                                <h2 className='text-xl font-bold mb-6 text-gray-800'>Order Summary</h2>

                                <div className='space-y-4 mb-6'>
                                    <div className='flex justify-between text-gray-600'>
                                        <span>Subtotal ({cartItems.length} items)</span>
                                        <span>₹{getCartTotal()}</span>
                                    </div>
                                    <div className='flex justify-between text-gray-600'>
                                        <span>Home Collection Charges</span>
                                        <span className='text-green-600 font-medium'>FREE</span>
                                    </div>
                                    <div className='border-t border-dashed border-gray-200 pt-4 flex justify-between font-bold text-lg'>
                                        <span>Total Amount</span>
                                        <span className='text-primary'>₹{getCartTotal()}</span>
                                    </div>
                                </div>

                                <button
                                    className='w-full bg-primary text-white py-3.5 rounded-xl font-bold text-lg hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all active:scale-95 mb-3'
                                    onClick={() => navigate('/appointment', { state: { type: 'cart' } })}
                                >
                                    Proceed to Checkout
                                </button>

                                <button
                                    onClick={clearCart}
                                    className='w-full text-gray-500 text-sm hover:text-red-500 transition-colors'
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100'>
                        <div className='text-6xl mb-4 opacity-50'>🛒</div>
                        <h2 className='text-2xl font-bold text-gray-800 mb-2'>Your cart is empty</h2>
                        <p className='text-gray-500 mb-6'>Looks like you haven't added any tests yet.</p>
                        <button onClick={() => navigate('/Packages')} className='btn-primary'>
                            Browse Tests
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Cart
