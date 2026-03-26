import { Outlet } from 'react-router-dom';
import Navbar from './navbar/navbar.jsx'
import Footer from './footer/footer.jsx'
import Snowfall from "react-snowfall";
import { Analytics } from "@vercel/analytics/react";
import {SpeedInsights} from "@vercel/speed-insights/react";

const MainLayout = () => {
    return (
        <>
            <Analytics />
            <SpeedInsights />
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