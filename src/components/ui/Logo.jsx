// src/components/ui/Logo.jsx
const Logo = ({ size = 'md', className = '' }) => {
    const sizes = {
        sm: 'text-xl',
        md: 'text-2xl',
        lg: 'text-4xl',
        xl: 'text-5xl',
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="flex-shrink-0">
                <svg
                    viewBox="0 0 36 36"
                    className={`${size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8'}`}
                    fill="none"
                >
                    <polygon
                        points="18,2 22,14 34,14 24,22 28,34 18,26 8,34 12,22 2,14 14,14"
                        fill="#D4AF37"
                        opacity="0.9"
                    />
                </svg>
            </div>
            <span className={`font-serif font-semibold text-gold ${sizes[size]} tracking-wide`}>
                Ratnamala
            </span>
        </div>
    );
};

export default Logo;
