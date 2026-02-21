// src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../ui/Logo';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/collections', label: 'Collections' },
    ];

    const activeCls = 'text-gold';
    const inactiveCls = 'text-ivory-muted hover:text-ivory';

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-emerald-900/95 backdrop-blur-md border-b border-emerald-800' : 'bg-transparent'
                }`}
        >
            <nav className="page-container flex items-center justify-between h-16 md:h-20">
                {/* Logo */}
                <Link to="/" id="nav-logo" className="flex-shrink-0">
                    <Logo size="sm" />
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            id={`nav-${label.toLowerCase()}`}
                            className={({ isActive }) =>
                                `font-sans text-sm tracking-widest uppercase transition-colors duration-200 ${isActive ? activeCls : inactiveCls
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <>
                            <Link
                                to="/account"
                                id="nav-account"
                                className="btn-outline-gold text-xs py-2 px-4"
                            >
                                Account
                            </Link>
                            <button
                                onClick={handleLogout}
                                id="nav-logout"
                                className="btn-ghost text-xs tracking-widest uppercase"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            id="nav-login"
                            className="btn-outline-gold text-xs py-2 px-4"
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile menu button */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    id="nav-mobile-menu"
                    className="md:hidden p-2 text-ivory-muted hover:text-gold transition-colors"
                    aria-label="Toggle menu"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {menuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </nav>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-emerald-900/98 backdrop-blur-md border-t border-emerald-800 py-4 px-4 space-y-1 animate-slide-up">
                    {navLinks.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                                `block px-4 py-3 font-sans text-sm tracking-widest uppercase transition-colors duration-200 ${isActive ? activeCls : inactiveCls
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                    <div className="pt-2 border-t border-emerald-800 mt-2 space-y-1">
                        {user ? (
                            <>
                                <Link
                                    to="/account"
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-4 py-3 text-gold font-sans text-sm tracking-widest uppercase"
                                >
                                    My Account
                                </Link>
                                <button
                                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                                    className="block w-full text-left px-4 py-3 text-ivory-muted font-sans text-sm tracking-widest uppercase hover:text-ivory"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setMenuOpen(false)}
                                className="block px-4 py-3 text-gold font-sans text-sm tracking-widest uppercase"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
