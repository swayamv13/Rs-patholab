import { createContext, useState, useEffect } from "react";
import { healthPackages as fallbackHealthPackages } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext({
    tests: [],
    getTestById: () => null,
    user: null, 
    userData: null, 
    setUser: () => { },
    token: false,
    setToken: () => { },
    familyMembers: [],
    addFamilyMember: () => { },
    backendUrl: '',
    logout: () => { }
});

const AppContextProvider = (props) => {

    const [user, setUser] = useState(null); // Keep for compatibility if needed elsewhere
    const [userData, setUserData] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [familyMembers, setFamilyMembers] = useState([]);
    const [healthPackages, setHealthPackages] = useState(fallbackHealthPackages);

    const rawBackendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const backendUrl = rawBackendUrl.replace(/\/$/, '');

    useEffect(() => {
        const loadCatalog = async () => {
            try {
                const { data } = await axios.get(backendUrl + '/api/catalog');
                if (data.success && Array.isArray(data.items) && data.items.length > 0) {
                    setHealthPackages(data.items);
                }
            } catch {
                /* keep fallback from assets */
            }
        };
        loadCatalog();
    }, [backendUrl]);

    // Fetch user profile when token changes
    useEffect(() => {
        if (token) {
            const fetchProfile = async () => {
                try {
                    const storedToken = localStorage.getItem('token');
                    const { data } = await axios.get(backendUrl + '/api/user/profile', { headers: { token: storedToken } });
                    if (data.success) {
                        setUserData(data.userData);
                        setFamilyMembers(data.userData.familyMembers || []);
                    } else {
                        toast.error(data.message);
                        setToken('');
                        localStorage.removeItem('token');
                    }
                } catch (error) {
                    console.error(error);
                }
            };
            fetchProfile();
        } else {
            setUserData(null);
            setFamilyMembers([]);
        }
    }, [token, backendUrl]);

    // Helper function to find a specific test/package
    const getTestById = (id) => {
        if (id == null) return null;
        const sid = String(id);
        return healthPackages.find(test => String(test.id) === sid || test.id === id);
    };

    const addFamilyMember = async (newMember) => {
        try {
            const storedToken = localStorage.getItem('token');
            const { data } = await axios.post(backendUrl + '/api/user/family', newMember, { headers: { token: storedToken } });
            if (data.success) {
                setFamilyMembers(data.familyMembers);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setUserData(null);
        setFamilyMembers([]);
        toast.info("Logged Out!");
    };

    const value = {
        healthPackages,
        setHealthPackages,
        getTestById,
        user,
        userData,
        setUser,
        token,
        setToken,
        familyMembers,
        addFamilyMember,
        setUserData,
        backendUrl,
        logout
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;