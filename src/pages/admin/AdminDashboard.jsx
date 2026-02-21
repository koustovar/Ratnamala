// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { getAllProducts } from '../../services/productService';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value, icon, color = 'gold' }) => (
    <div className="bg-emerald-950 border border-emerald-800 rounded-sm p-6 flex items-center gap-5 hover:border-gold/30 transition-colors duration-200">
        <div className={`w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0 ${color === 'gold' ? 'bg-gold/10 text-gold' : 'bg-emerald-800 text-ivory-muted'
            }`}>
            {icon}
        </div>
        <div>
            <div className="font-serif text-3xl text-ivory">{value}</div>
            <div className="font-sans text-xs text-ivory-muted tracking-widest uppercase mt-0.5">{label}</div>
        </div>
    </div>
);

const AdminDashboard = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const all = await getAllProducts();
                setProducts(all);
            } catch {
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const categoryCount = products.reduce((acc, p) => {
        const cat = p.category || 'Uncategorized';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});

    const recentProducts = [...products].slice(0, 5);

    return (
        <AdminLayout>
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-serif text-3xl text-ivory">Dashboard</h1>
                <p className="font-sans text-ivory-muted text-sm mt-1">
                    Welcome back{user?.email ? `, ${user.email}` : ''} 👋
                </p>
            </div>

            {/* Stats */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-2 border-emerald-700 border-t-gold rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <StatCard
                            label="Total Products"
                            value={products.length}
                            icon={
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            }
                        />
                        <StatCard
                            label="Categories"
                            value={Object.keys(categoryCount).length}
                            color="muted"
                            icon={
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            }
                        />
                    </div>

                    {/* Category breakdown */}
                    {Object.keys(categoryCount).length > 0 && (
                        <div className="bg-emerald-950 border border-emerald-800 rounded-sm p-6 mb-6">
                            <h2 className="font-serif text-lg text-ivory mb-4">Products by Category</h2>
                            <div className="space-y-3">
                                {Object.entries(categoryCount).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
                                    <div key={cat} className="flex items-center gap-3">
                                        <span className="font-sans text-sm text-ivory-muted w-28 flex-shrink-0">{cat}</span>
                                        <div className="flex-1 bg-emerald-800 rounded-full h-1.5">
                                            <div
                                                className="bg-gold rounded-full h-1.5 transition-all duration-500"
                                                style={{ width: `${(count / products.length) * 100}%` }}
                                            />
                                        </div>
                                        <span className="font-sans text-xs text-ivory-muted w-8 text-right">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Products */}
                    {recentProducts.length > 0 && (
                        <div className="bg-emerald-950 border border-emerald-800 rounded-sm overflow-hidden">
                            <div className="flex items-center justify-between p-5 border-b border-emerald-800">
                                <h2 className="font-serif text-lg text-ivory">Recent Products</h2>
                                <Link to="/admin/products" className="font-sans text-xs text-gold hover:text-gold-light tracking-widest uppercase">
                                    View All →
                                </Link>
                            </div>
                            <div className="divide-y divide-emerald-800">
                                {recentProducts.map((p) => (
                                    <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-emerald-800/20 transition-colors">
                                        <div className="w-10 h-10 rounded-sm overflow-hidden bg-emerald-900 flex-shrink-0 border border-emerald-700">
                                            {p.mainImage || p.images?.[0] ? (
                                                <img src={p.mainImage || p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-ivory-muted text-[10px]">
                                                    💎
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-sans text-sm text-ivory truncate">{p.name}</p>
                                            <span className="font-sans text-[10px] text-gold tracking-widest">#{p.productId}</span>
                                        </div>
                                        <span className="font-sans text-xs text-ivory-muted flex-shrink-0">{p.category || '—'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </AdminLayout>
    );
};

export default AdminDashboard;
