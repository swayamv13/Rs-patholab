import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const checkLocal = localStorage.getItem('labCart');
        if (checkLocal) {
            setCartItems(JSON.parse(checkLocal));
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem('labCart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item) => {
        const exists = cartItems.find(i => i.id === item.id);
        if (exists) {
            toast.info("Item already in cart!");
            return;
        }
        setCartItems(prev => [...prev, item]);
        toast.success("Added to cart!");
    };

    const removeFromCart = (itemId) => {
        setCartItems(prev => prev.filter(i => i.id !== itemId));
        toast.error("Removed from cart.");
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.discountedPrice, 0);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, getCartTotal }}>
            {children}
        </CartContext.Provider>
    );
};
