// src/components/ui/GoldDivider.jsx
const GoldDivider = ({ className = '' }) => (
    <div className={`flex items-center justify-center gap-3 my-2 ${className}`}>
        <div className="h-px flex-1 max-w-12 bg-gradient-to-r from-transparent to-gold/50" />
        <svg viewBox="0 0 16 16" className="w-3 h-3 flex-shrink-0" fill="none">
            <polygon
                points="8,1 9.5,5.5 14.5,5.5 10.5,8.5 12,13 8,10 4,13 5.5,8.5 1.5,5.5 6.5,5.5"
                fill="#D4AF37"
                opacity="0.8"
            />
        </svg>
        <div className="h-px flex-1 max-w-12 bg-gradient-to-l from-transparent to-gold/50" />
    </div>
);

export default GoldDivider;
