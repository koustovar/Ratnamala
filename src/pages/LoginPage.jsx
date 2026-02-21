// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser, registerUser } from '../services/authService';
import Logo from '../components/ui/Logo';
import GoldDivider from '../components/ui/GoldDivider';

const LoginPage = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!loading && user) return <Navigate to="/account" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            if (isRegistering) {
                await registerUser(email, password);
            } else {
                await loginUser(email, password);
            }
            navigate('/account');
        } catch (err) {
            console.error(err);
            const code = err.code || '';
            if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
                setError('Invalid email or password. Please try again.');
            } else if (code.includes('email-already-in-use')) {
                setError('This email is already registered. Please login instead.');
            } else if (code.includes('weak-password')) {
                setError('Password should be at least 6 characters.');
            } else if (code.includes('too-many-requests')) {
                setError('Too many failed attempts. Please wait a moment.');
            } else {
                setError('Operation failed. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-emerald-900 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background ornament */}
            <div className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, #D4AF37 1px, transparent 1px),
                            radial-gradient(circle at 75% 75%, #D4AF37 1px, transparent 1px)`,
                    backgroundSize: '80px 80px',
                }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05)_0%,transparent_60%)]" />

            <div className="relative w-full max-w-md animate-fade-in">
                {/* Card */}
                <div className="bg-emerald-950 border border-emerald-800 rounded-sm p-8 md:p-10 shadow-card">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <Logo size="lg" />
                        </div>
                        <GoldDivider />
                        <p className="font-sans text-ivory-muted text-xs tracking-widest uppercase mt-3">
                            {isRegistering ? 'Create Account' : 'Welcome Back'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Error */}
                        {error && (
                            <div className="bg-red-900/20 border border-red-700/40 rounded-sm px-4 py-3">
                                <p className="font-sans text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label htmlFor="login-email" className="label">Email Address</label>
                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="input-field"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="login-password" className="label">Password</label>
                            <div className="relative">
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="input-field pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    id="toggle-password"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory-muted hover:text-ivory transition-colors"
                                    tabIndex={-1}
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            id="login-submit"
                            disabled={submitting}
                            className="btn-gold w-full py-3.5 text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin" />
                                    {isRegistering ? 'Creating Account…' : 'Signing in…'}
                                </span>
                            ) : (
                                isRegistering ? 'Sign Up' : 'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="font-sans text-xs text-ivory-muted hover:text-gold transition-colors duration-200"
                        >
                            {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                        </button>
                    </div>
                </div>

                {/* Back to site */}
                <div className="text-center mt-6">
                    <Link
                        to="/"
                        className="font-sans text-ivory-muted text-[10px] tracking-widest uppercase hover:text-gold transition-colors duration-200"
                    >
                        ← Back to Ratnamala
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
