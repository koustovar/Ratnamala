// src/pages/admin/AdminLayout.jsx
import { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/ui/Logo';

const AdminLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const navItems = [
        {
            to: '/admin',
            label: 'Dashboard',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM14 11a1 1 0 011-1h4a1 1 0 011 1v8a1 1 0 01-1 1h-4a1 1 0 01-1-1v-8z" />
                </svg>
            ),
        },
        {
            to: '/admin/products',
            label: 'Products',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
        },
    ];

    const activeCls = 'bg-gold/10 text-gold border-l-2 border-gold';
    const inactiveCls = 'text-ivory-muted hover:bg-emerald-800/50 hover:text-ivory border-l-2 border-transparent';

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-5 border-b border-emerald-800">
                <Logo size="sm" />
                <p className="font-sans text-ivory-muted text-[10px] tracking-widest uppercase mt-1 ml-10">
                    Admin Panel
                </p>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-3 space-y-0.5">
                {navItems.map(({ to, label, icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/admin'}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-sm font-sans text-sm transition-all duration-200 ${isActive ? activeCls : inactiveCls
                            }`
                        }
                    >
                        {icon}
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* User + Logout */}
            <div className="p-4 border-t border-emerald-800 space-y-3">
                {user && (
                    <p className="font-sans text-ivory-muted text-xs truncate px-2">{user.email}</p>
                )}
                <Link
                    to="/"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-sm font-sans text-xs text-ivory-muted hover:text-ivory hover:bg-emerald-800/50 transition-all duration-200"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    View Website
                </Link>
                <button
                    onClick={handleLogout}
                    id="admin-logout"
                    className="flex items-center gap-2 w-full text-left px-4 py-2.5 rounded-sm font-sans text-xs text-ivory-muted hover:text-red-400 hover:bg-red-900/10 transition-all duration-200"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-emerald-900 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-60 bg-emerald-950 border-r border-emerald-800 fixed top-0 left-0 h-full z-40">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-emerald-950 border-r border-emerald-800 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
                {/* Top bar (mobile only) */}
                <header className="lg:hidden flex items-center justify-between px-4 py-4 bg-emerald-950 border-b border-emerald-800 sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        id="admin-menu-btn"
                        className="p-1.5 text-ivory-muted hover:text-gold transition-colors"
                        aria-label="Open menu"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <Logo size="sm" />
                    <div className="w-8" />
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
