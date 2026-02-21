// src/pages/CollectionsPage.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProductCard from '../components/ui/ProductCard';
import GoldDivider from '../components/ui/GoldDivider';
import { getAllProducts } from '../services/productService';

const CATEGORIES = ['All', 'Necklaces', 'Rings', 'Earrings', 'Bracelets', 'Pendants', 'Sets', 'Other'];

const CollectionsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const activeCategory = searchParams.get('category') || 'All';

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const all = await getAllProducts();
                setProducts(all);
            } catch {
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const setCategory = (cat) => {
        if (cat === 'All') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', cat);
        }
        setSearchParams(searchParams);
    };

    const filtered = products.filter((p) => {
        const matchCat = activeCategory === 'All' || p.category === activeCategory;
        const q = search.toLowerCase();
        const matchSearch =
            !q ||
            p.name?.toLowerCase().includes(q) ||
            p.productId?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q);
        return matchCat && matchSearch;
    });

    return (
        <MainLayout>
            {/* Page Header */}
            <section className="py-16 px-4 bg-emerald-950/60 border-b border-emerald-800">
                <div className="page-container text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <div className="h-px w-12 bg-gold/40" />
                        <span className="font-sans text-gold text-xs tracking-[0.3em] uppercase">Catalogue</span>
                        <div className="h-px w-12 bg-gold/40" />
                    </div>
                    <h1 className="font-serif text-4xl md:text-5xl text-ivory mb-3">Our Collections</h1>
                    <GoldDivider />
                    <p className="font-sans text-ivory-muted text-sm mt-4 max-w-md mx-auto">
                        Browse our complete catalogue of handcrafted jewellery. Each piece is unique.
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className="sticky top-16 md:top-20 z-30 bg-emerald-900/95 backdrop-blur-md border-b border-emerald-800 py-3 px-4">
                <div className="page-container">
                    <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                        {/* Category Tabs */}
                        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    id={`filter-${cat.toLowerCase()}`}
                                    className={`flex-shrink-0 px-4 py-1.5 rounded-sm font-sans text-xs tracking-widest uppercase transition-all duration-200 border ${activeCategory === cat
                                            ? 'bg-gold text-emerald-950 border-gold'
                                            : 'border-emerald-700 text-ivory-muted hover:border-gold/40 hover:text-ivory'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative flex-shrink-0 md:w-64">
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ivory-muted"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                id="collections-search"
                                placeholder="Search name or ID…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-emerald-950 border border-emerald-700 text-ivory placeholder-ivory-muted pl-9 pr-4 py-2 rounded-sm text-xs focus:outline-none focus:border-gold transition-colors duration-200"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-12 px-4">
                <div className="page-container">
                    {loading ? (
                        <div className="flex justify-center py-32">
                            <div className="w-10 h-10 border-2 border-emerald-700 border-t-gold rounded-full animate-spin" />
                        </div>
                    ) : filtered.length > 0 ? (
                        <>
                            <p className="font-sans text-ivory-muted text-xs tracking-widest uppercase mb-6">
                                {filtered.length} piece{filtered.length !== 1 ? 's' : ''} found
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {filtered.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-32 space-y-4">
                            <div className="text-5xl opacity-20">🔍</div>
                            <p className="font-serif text-xl text-ivory-muted italic">No pieces found</p>
                            <p className="font-sans text-ivory-muted text-sm">
                                Try adjusting your filters or search term.
                            </p>
                            <button
                                onClick={() => { setSearch(''); setCategory('All'); }}
                                className="btn-outline-gold text-xs mt-4"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </MainLayout>
    );
};

export default CollectionsPage;
