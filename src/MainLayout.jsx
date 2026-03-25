import { Outlet } from 'react-router-dom';
import Navbar from './navbar/navbar.jsx'
import Footer from './footer/footer.jsx'
import Snowfall from "react-snowfall";
import { Analytics } from "@vercel/analytics/react";

const MainLayout = () => {
    return (
        <>
            <Analytics />
            <Snowfall color="#82C3D9" style={{position: "fixed", zIndex: 99999}} />
            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default MainLayout;