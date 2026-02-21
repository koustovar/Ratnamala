// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProductCard from '../components/ui/ProductCard';
import GoldDivider from '../components/ui/GoldDivider';
import { getFeaturedProducts } from '../services/productService';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999';

const CATEGORIES = [
    {
        name: 'Necklaces',
        icon: '💎',
        desc: 'Elegant chains and statement pieces',
    },
    {
        name: 'Rings',
        icon: '💍',
        desc: 'Timeless bands and gemstone rings',
    },
    {
        name: 'Earrings',
        icon: '✨',
        desc: 'Delicate drops and chandelier styles',
    },
    {
        name: 'Bracelets',
        icon: '🌟',
        desc: 'Bangles, kadas and charm bracelets',
    },
    {
        name: 'Pendants',
        icon: '🔮',
        desc: 'Artisan pendants and lockets',
    },
    {
        name: 'Sets',
        icon: '👑',
        desc: 'Curated bridal and festive sets',
    },
];

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const products = await getFeaturedProducts(6);
                setFeaturedProducts(products);
            } catch {
                setFeaturedProducts([]);
            } finally {
                setLoadingProducts(false);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <MainLayout>
            {/* ── Hero ──────────────────────────────────────────────────────────── */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Background ornamental pattern */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `radial-gradient(circle at 20% 50%, #D4AF37 1px, transparent 1px),
                              radial-gradient(circle at 80% 50%, #D4AF37 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }}
                />
                {/* Radial glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)]" />

                <div className="relative text-center px-4 max-w-4xl mx-auto animate-fade-in">
                    {/* Ornament */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60" />
                        <span className="font-sans text-gold text-xs tracking-[0.4em] uppercase">Est. with Love</span>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60" />
                    </div>

                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-gold-gradient leading-tight mb-6">
                        Ratnamala
                    </h1>

                    <div className="gold-divider mx-auto mb-6" />

                    <p className="font-serif italic text-xl md:text-2xl text-ivory-dark mb-4">
                        A Garland of Gems
                    </p>

                    <p className="font-sans text-ivory-muted text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10">
                        Discover our curated collection of exquisite handcrafted jewellery,
                        where timeless artistry meets the brilliance of precious gems.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/collections" id="hero-explore-btn" className="btn-gold text-base px-8 py-4">
                            Explore Collection
                        </Link>
                        <a
                            href={`https://wa.me/${WHATSAPP_NUMBER}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            id="hero-whatsapp-btn"
                            className="btn-outline-gold text-base px-8 py-4"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>

                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-900 to-transparent" />
            </section>

            {/* ── Featured Categories ────────────────────────────────────────────── */}
            <section className="py-20 px-4">
                <div className="page-container">
                    <div className="text-center mb-12 animate-slide-up">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="h-px w-12 bg-gold/40" />
                            <span className="font-sans text-gold text-xs tracking-[0.3em] uppercase">Browse By</span>
                            <div className="h-px w-12 bg-gold/40" />
                        </div>
                        <h2 className="section-title text-ivory">Our Collections</h2>
                        <GoldDivider />
                        <p className="font-sans text-ivory-muted text-sm mt-4 max-w-md mx-auto">
                            Each category curated to reflect the heritage of Indian fine jewellery craft.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {CATEGORIES.map((cat) => (
                            <Link
                                key={cat.name}
                                to={`/collections?category=${cat.name}`}
                                id={`category-${cat.name.toLowerCase()}`}
                                className="card card-hover p-5 text-center group cursor-pointer"
                            >
                                <div className="text-3xl mb-3">{cat.icon}</div>
                                <h3 className="font-serif text-base text-ivory group-hover:text-gold transition-colors duration-200 mb-1">
                                    {cat.name}
                                </h3>
                                <p className="font-sans text-ivory-muted text-[11px] leading-relaxed hidden md:block">
                                    {cat.desc}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Featured Products ─────────────────────────────────────────────── */}
            <section className="py-16 px-4 bg-emerald-950/50">
                <div className="page-container">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="h-px w-12 bg-gold/40" />
                            <span className="font-sans text-gold text-xs tracking-[0.3em] uppercase">Handpicked</span>
                            <div className="h-px w-12 bg-gold/40" />
                        </div>
                        <h2 className="section-title text-ivory">Featured Pieces</h2>
                        <GoldDivider />
                    </div>

                    {loadingProducts ? (
                        <div className="flex justify-center py-20">
                            <div className="w-10 h-10 border-2 border-emerald-700 border-t-gold rounded-full animate-spin" />
                        </div>
                    ) : featuredProducts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {featuredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                            <div className="text-center mt-10">
                                <Link to="/collections" id="hero-view-all-btn" className="btn-outline-gold">
                                    View All Pieces
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20 space-y-4">
                            <div className="text-5xl opacity-20">💎</div>
                            <p className="font-serif text-xl text-ivory-muted italic">
                                Our collection is being curated…
                            </p>
                            <p className="font-sans text-ivory-muted text-sm">
                                Please check back soon or contact us on WhatsApp.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* ── About Section ────────────────────────────────────────────────── */}
            <section id="about" className="py-20 px-4">
                <div className="page-container">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="h-px w-12 bg-gold/40" />
                            <span className="font-sans text-gold text-xs tracking-[0.3em] uppercase">Our Story</span>
                            <div className="h-px w-12 bg-gold/40" />
                        </div>
                        <h2 className="section-title text-ivory">The Art of Adornment</h2>
                        <GoldDivider />
                        <p className="font-sans text-ivory-muted text-base leading-relaxed">
                            Ratnamala was born from a deep reverence for the ancient tradition of Indian jewellery craft.
                            Every piece in our collection tells a story — of the artisan's patient hands, of precious
                            materials sourced with integrity, and of designs that transcend fleeting fashion.
                        </p>
                        <p className="font-sans text-ivory-muted text-base leading-relaxed">
                            We believe that jewellery is not merely an accessory; it is an heirloom, a memory,
                            and a statement of who you are. Our catalogue celebrates this philosophy in every detail.
                        </p>
                        <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-emerald-800">
                            {[
                                { num: '500+', label: 'Unique Pieces' },
                                { num: '100%', label: 'Handcrafted' },
                                { num: '10+', label: 'Years of Craft' },
                            ].map(({ num, label }) => (
                                <div key={label} className="text-center">
                                    <div className="font-serif text-3xl text-gold-gradient mb-1">{num}</div>
                                    <div className="font-sans text-ivory-muted text-xs tracking-widest uppercase">{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Contact / CTA ─────────────────────────────────────────────────── */}
            <section id="contact" className="py-20 px-4 bg-emerald-950">
                <div className="page-container">
                    <div className="max-w-xl mx-auto text-center space-y-6">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="h-px w-12 bg-gold/40" />
                            <span className="font-sans text-gold text-xs tracking-[0.3em] uppercase">Get In Touch</span>
                            <div className="h-px w-12 bg-gold/40" />
                        </div>
                        <h2 className="section-title text-ivory">Inquire About a Piece</h2>
                        <GoldDivider />
                        <p className="font-sans text-ivory-muted text-sm leading-relaxed">
                            Interested in a piece from our catalogue? We'd love to hear from you.
                            Reach us directly on WhatsApp for personalised assistance.
                        </p>
                        <a
                            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello, I would like to inquire about your jewellery collection at Ratnamala.')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            id="contact-whatsapp-btn"
                            className="btn-gold text-base px-10 py-4 inline-flex items-center gap-3"
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Chat on WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
};

export default HomePage;
