import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React from "react"
import Scroll from './service/ScrollToTop.jsx'
import './App.css'
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react";

import Home from './home/home.jsx'
import Detail from './detail/detail.jsx'
import Login from './user/login/login.jsx'
import Sign from './user/sign/sign.jsx'
import Verify from './user/verifyCode/verify.jsx'
import Info from './user/infoUser/info.jsx'
import Cart from './cart/cart.jsx'
import Checkout from './cart/checkout/checkout.jsx'
import MainLayout from "./MainLayout.jsx"

function App() {
  return (
    <>
        {/* Turn off console */}
        {/*<Analytics debug={false} />*/}
        {/*<SpeedInsights debug={false} />*/}

        <Router>
            <Scroll />
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Home />}/>
                        <Route path="/detail/:id" element={<Detail />}/>
                        <Route path="/user/login" element={<Login />}/>
                        <Route path="/user/sign" element={<Sign />}/>
                        <Route path="/user/verify" element={<Verify />}/>
                        <Route path="/user/info" element={<Info />}/>
                        <Route path="/cart" element={<Cart />} />
                    </Route>

                <Route path="/cart/checkout" element={<Checkout />}/>
            </Routes>
        </Router>
    </>
  )
}

export default App
