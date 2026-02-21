// src/pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import WhatsAppButton from '../components/ui/WhatsAppButton';
import GoldDivider from '../components/ui/GoldDivider';
import { getProductById } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { toggleFavorite, getUserFavorites } from '../services/userService';

const ProductDetailPage = () => {
    const { productId } = useParams();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const data = await getProductById(productId);
                if (!data) {
                    setError('Product not found');
                } else {
                    setProduct(data);
                    setActiveImage(0);

                    // Check if is favorite
                    if (user) {
                        const favorites = await getUserFavorites(user.uid);
                        setIsFavorite(favorites.includes(data.id));
                    }
                }
            } catch {
                setError('Failed to load product');
            } finally {
                setLoading(false);
            }
        };
        if (productId) fetchProduct();
    }, [productId, user]);

    const handleToggleFavorite = async () => {
        if (!user) {
            alert("Please login to save favorites.");
            return;
        }
        const added = await toggleFavorite(user.uid, product.id);
        setIsFavorite(added);
    };

    const images = product
        ? [product.mainImage, ...(product.images || [])].filter(Boolean)
        : [];

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="w-12 h-12 border-2 border-emerald-700 border-t-gold rounded-full animate-spin" />
                </div>
            </MainLayout>
        );
    }

    if (error || !product) {
        return (
            <MainLayout>
                <div className="page-container py-32 text-center space-y-4">
                    <div className="text-6xl opacity-20">💎</div>
                    <h2 className="font-serif text-3xl text-ivory">Piece Not Found</h2>
                    <p className="font-sans text-ivory-muted text-sm">{error || 'This product does not exist.'}</p>
                    <Link to="/collections" className="btn-gold inline-flex mt-4">
                        Back to Collections
                    </Link>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            {/* Breadcrumb */}
            <div className="bg-emerald-950/40 border-b border-emerald-800 py-3 px-4">
                <div className="page-container">
                    <nav className="flex items-center gap-2 text-xs font-sans text-ivory-muted">
                        <Link to="/" className="hover:text-ivory transition-colors">Home</Link>
                        <span>/</span>
                        <Link to="/collections" className="hover:text-ivory transition-colors">Collections</Link>
                        <span>/</span>
                        <span className="text-ivory">{product.name}</span>
                    </nav>
                </div>
            </div>

            <div className="page-container py-12 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                    {/* ── Image Gallery ──────────────────────────────────────────── */}
                    <div className="space-y-4 animate-fade-in">
                        {/* Main Image */}
                        <div className="aspect-square rounded-sm overflow-hidden bg-emerald-950 border border-emerald-800 relative">
                            {images.length > 0 ? (
                                <img
                                    src={images[activeImage]}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-all duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                                    <svg viewBox="0 0 64 64" className="w-16 h-16 opacity-10" fill="none">
                                        <polygon
                                            points="32,4 38,20 56,20 42,30 48,46 32,36 16,46 22,30 8,20 26,20"
                                            fill="#D4AF37"
                                        />
                                    </svg>
                                    <p className="font-sans text-ivory-muted text-xs tracking-widest uppercase">No Image Available</p>
                                </div>
                            )}
                            {/* Image count */}
                            {images.length > 1 && (
                                <div className="absolute bottom-3 right-3 bg-emerald-900/80 backdrop-blur-sm text-ivory-muted text-xs font-sans px-2 py-0.5 rounded-sm border border-emerald-700">
                                    {activeImage + 1} / {images.length}
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-5 gap-2">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        id={`thumb-${idx}`}
                                        className={`aspect-square rounded-sm overflow-hidden border-2 transition-all duration-200 ${activeImage === idx
                                            ? 'border-gold'
                                            : 'border-emerald-700 hover:border-gold/50 opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Product Details ────────────────────────────────────────── */}
                    <div className="space-y-6 animate-slide-up text-left">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                {/* Category */}
                                {product.category && (
                                    <span className="font-sans text-gold text-xs tracking-[0.3em] uppercase block">
                                        {product.category}
                                    </span>
                                )}

                                {/* Name */}
                                <h1 className="font-serif text-3xl md:text-4xl text-ivory leading-tight">
                                    {product.name}
                                </h1>
                            </div>

                            {/* Favorite Toggle */}
                            <button
                                onClick={handleToggleFavorite}
                                className={`p-3 rounded-full border transition-all duration-200 ${isFavorite ? 'bg-gold/10 border-gold text-gold' : 'border-emerald-800 text-ivory-muted hover:border-gold/50 hover:text-gold'}`}
                                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                            >
                                <svg className={`w-6 h-6 ${isFavorite ? 'fill-gold' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>

                        {/* Product ID Badge */}
                        <div className="flex items-center gap-2">
                            <span className="badge-gold text-sm px-3 py-1">
                                Product ID: #{product.productId}
                            </span>
                        </div>

                        <GoldDivider className="!justify-start !mx-0" />

                        {/* Description */}
                        {product.description && (
                            <div className="space-y-2">
                                <h3 className="font-sans text-xs tracking-widest uppercase text-gold">Description</h3>
                                <p className="font-sans text-ivory-muted text-sm leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {/* Optional Details */}
                        {(product.weight || product.purity || product.material) && (
                            <div className="space-y-3">
                                <h3 className="font-sans text-xs tracking-widest uppercase text-gold">Details</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {product.material && (
                                        <div className="bg-emerald-950 border border-emerald-800 rounded-sm p-3">
                                            <div className="font-sans text-[10px] text-ivory-muted tracking-widest uppercase mb-0.5">Material</div>
                                            <div className="font-sans text-ivory text-sm">{product.material}</div>
                                        </div>
                                    )}
                                    {product.weight && (
                                        <div className="bg-emerald-950 border border-emerald-800 rounded-sm p-3">
                                            <div className="font-sans text-[10px] text-ivory-muted tracking-widest uppercase mb-0.5">Weight</div>
                                            <div className="font-sans text-ivory text-sm">{product.weight}</div>
                                        </div>
                                    )}
                                    {product.purity && (
                                        <div className="bg-emerald-950 border border-emerald-800 rounded-sm p-3">
                                            <div className="font-sans text-[10px] text-ivory-muted tracking-widest uppercase mb-0.5">Purity</div>
                                            <div className="font-sans text-ivory text-sm">{product.purity}</div>
                                        </div>
                                    )}
                                    {product.stone && (
                                        <div className="bg-emerald-950 border border-emerald-800 rounded-sm p-3">
                                            <div className="font-sans text-[10px] text-ivory-muted tracking-widest uppercase mb-0.5">Stone</div>
                                            <div className="font-sans text-ivory text-sm">{product.stone}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* WhatsApp Inquiry */}
                        <div className="pt-4 border-t border-emerald-800 space-y-3">
                            <WhatsAppButton
                                productName={product.name}
                                productId={product.productId}
                                className="w-full justify-center"
                            />
                            <p className="font-sans text-ivory-muted text-xs text-center leading-relaxed">
                                Click to open WhatsApp with a pre-filled inquiry message.
                                Our team responds promptly.
                            </p>
                        </div>

                        {/* Back Link */}
                        <div className="pt-2">
                            <Link
                                to="/collections"
                                className="font-sans text-xs text-ivory-muted hover:text-gold transition-colors duration-200 tracking-widest uppercase flex items-center gap-2"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Collections
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ProductDetailPage;
