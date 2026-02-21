// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { subscribeToAuthChanges, getUserRole, logoutUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
            if (firebaseUser) {
                const userRole = await getUserRole(firebaseUser.uid);
                setUser(firebaseUser);
                setRole(userRole);
            } else {
                setUser(null);
                setRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await logoutUser();
        setUser(null);
        setRole(null);
    };

    const isAdmin = role === 'admin';

    return (
        <AuthContext.Provider value={{ user, role, isAdmin, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
