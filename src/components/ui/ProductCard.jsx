// src/components/ui/ProductCard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toggleFavorite, getUserFavorites } from '../../services/userService';

const ProductCard = ({ product }) => {
    const { user } = useAuth();
    const { id, name, productId, images = [], mainImage, category } = product;
    const displayImage = mainImage || images[0] || null;
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const checkFavorite = async () => {
            if (user) {
                const favorites = await getUserFavorites(user.uid);
                setIsFavorite(favorites.includes(id));
            }
        };
        checkFavorite();
    }, [user, id]);

    const handleToggleFavorite = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to save favorites.");
            return;
        }
        const added = await toggleFavorite(user.uid, id);
        setIsFavorite(added);
    };

    return (
        <div className="card card-hover group animate-fade-in relative">
            {/* Favorite Button */}
            {user && (
                <button
                    onClick={handleToggleFavorite}
                    className="absolute top-3 right-3 z-10 p-2 bg-emerald-900/60 backdrop-blur-sm rounded-full border border-gold/20 hover:border-gold/50 transition-all duration-200 group/fav"
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                    <svg
                        className={`w-4 h-4 transition-colors duration-200 ${isFavorite ? 'text-gold fill-gold' : 'text-ivory-muted group-hover/fav:text-gold'}`}
                        fill={isFavorite ? "currentColor" : "none"}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            )}

            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-emerald-950">
                {displayImage ? (
                    <img
                        src={displayImage}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <svg viewBox="0 0 48 48" className="w-12 h-12 opacity-20" fill="none">
                            <polygon
                                points="24,4 28,16 40,16 30,24 34,36 24,28 14,36 18,24 8,16 20,16"
                                fill="#D4AF37"
                            />
                        </svg>
                        <span className="text-ivory-muted text-xs tracking-widest uppercase">No Image</span>
                    </div>
                )}
                {/* Category badge */}
                {category && (
                    <div className="absolute top-3 left-3">
                        <span className="bg-emerald-900/90 border border-gold/20 text-gold text-[10px] font-sans tracking-widest uppercase px-2 py-0.5 rounded-sm backdrop-blur-sm">
                            {category}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <div className="space-y-1">
                    <h3 className="font-serif text-lg text-ivory leading-tight group-hover:text-gold transition-colors duration-200">
                        {name}
                    </h3>
                    <span className="badge-gold">#{productId}</span>
                </div>

                <Link
                    to={`/product/${id}`}
                    id={`view-product-${productId}`}
                    className="btn-outline-gold w-full text-xs py-2 block text-center"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;
