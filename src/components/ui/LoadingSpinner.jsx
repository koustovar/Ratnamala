// src/components/ui/LoadingSpinner.jsx
const LoadingSpinner = ({ text = 'Loading…' }) => {
    return (
        <div className="min-h-screen bg-emerald-900 flex flex-col items-center justify-center gap-4">
            <div className="relative w-14 h-14">
                <div className="absolute inset-0 border-2 border-emerald-700 rounded-full" />
                <div className="absolute inset-0 border-2 border-t-gold rounded-full animate-spin" />
                <div className="absolute inset-3 flex items-center justify-center">
                    <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none">
                        <polygon
                            points="10,1 12.4,7.2 19,7.2 13.8,11.4 15.8,18 10,14 4.2,18 6.2,11.4 1,7.2 7.6,7.2"
                            fill="#D4AF37"
                            opacity="0.8"
                        />
                    </svg>
                </div>
            </div>
            <p className="font-sans text-ivory-muted text-sm tracking-widest uppercase">{text}</p>
        </div>
    );
};

export default LoadingSpinner;
