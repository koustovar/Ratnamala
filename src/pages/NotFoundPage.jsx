// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import GoldDivider from '../components/ui/GoldDivider';

const NotFoundPage = () => (
    <MainLayout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 space-y-6">
            <div className="text-7xl font-serif text-gold-gradient opacity-60">404</div>
            <h2 className="font-serif text-3xl text-ivory">Page Not Found</h2>
            <GoldDivider />
            <p className="font-sans text-ivory-muted text-sm max-w-sm leading-relaxed">
                The page you are looking for does not exist or has been moved.
            </p>
            <Link to="/" id="not-found-home" className="btn-gold mt-4">
                Return Home
            </Link>
        </div>
    </MainLayout>
);

export default NotFoundPage;
