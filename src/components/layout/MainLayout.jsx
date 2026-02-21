// src/components/layout/MainLayout.jsx
import Navbar from './Navbar';
import Footer from './Footer';
import MobileWhatsApp from './MobileWhatsApp';

const MainLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-emerald-900">
            <Navbar />
            <main className="flex-grow pt-16 md:pt-20">
                {children}
            </main>
            <Footer />
            <MobileWhatsApp />
        </div>
    );
};

export default MainLayout;
