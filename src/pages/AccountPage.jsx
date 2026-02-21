// src/pages/AccountPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import { getUserFavorites } from '../services/userService';
import { getProductById } from '../services/productService';
import ProductCard from '../components/ui/ProductCard';
import GoldDivider from '../components/ui/GoldDivider';

const AccountPage = () => {
    const { user, isAdmin, logout } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const favoriteIds = await getUserFavorites(user.uid);
                const productPromises = favoriteIds.map(id => getProductById(id));
                const products = await Promise.all(productPromises);
                setFavorites(products.filter(Boolean));
            } catch (error) {
                console.error("Error fetching favorites:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, [user]);

    if (!user) {
        return (
            <MainLayout>
                <div className="page-container py-20 text-center">
                    <h2 className="section-title mb-6">Access Denied</h2>
                    <p className="text-ivory-muted mb-8">Please login to view your account.</p>
                    <Link to="/login" className="btn-gold">Login Now</Link>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="page-container py-12 md:py-20">
                <div className="max-w-4xl mx-auto">
                    {/* Profile Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fade-in">
                        <div className="space-y-2">
                            <span className="font-sans text-gold text-xs tracking-[0.3em] uppercase">My Profile</span>
                            <h1 className="font-serif text-4xl md:text-5xl text-ivory">{user.email?.split('@')[0]}</h1>
                            <p className="font-sans text-ivory-muted text-sm">{user.email}</p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            {isAdmin && (
                                <Link to="/admin" className="btn-gold text-xs py-2 px-6">
                                    Admin Panel
                                </Link>
                            )}
                            <button onClick={logout} className="btn-outline-gold text-xs py-2 px-6">
                                Logout
                            </button>
                        </div>
                    </div>

                    <GoldDivider />

                    {/* Favorites Section */}
                    <section className="mt-16 animate-slide-up">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="font-serif text-2xl text-ivory">My Favorites</h2>
                            <div className="h-px flex-1 bg-emerald-800" />
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="w-8 h-8 border-2 border-emerald-700 border-t-gold rounded-full animate-spin" />
                            </div>
                        ) : favorites.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {favorites.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-emerald-950/30 border border-emerald-800 rounded-sm">
                                <div className="text-4xl mb-4 opacity-20">✨</div>
                                <p className="font-serif text-lg text-ivory-muted italic">No favorites saved yet.</p>
                                <Link to="/collections" className="text-gold text-xs tracking-widest uppercase mt-4 inline-block hover:underline">
                                    Browse Collections
                                </Link>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </MainLayout>
    );
};

export default AccountPage;
