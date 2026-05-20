import React, { useState } from 'react';
import './login.css'

import { FaGoogle } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";

import {API_URL, INFO_USER, IS_LOGGED} from "../../service/API_URL.jsx";
import {useNavigate} from "react-router-dom";
import LoadingModal from "../../modal/LoadingModal.jsx";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const login = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/user/login`, {
                method: "Post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            });

            if (!res.ok) {
                setIsLoading(false);
                const message = await res.text();
                alert(message);
            } else {
                setIsLoading(false);
                const data = await res.json(); // array
                const authData = {
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    expiresAt: Date.now() + (data.expiresIn * 1000), // Do Date.now() Tra ve mili s, data.expiresIn tra ve giay (s) nen phai * 1000
                    lastName: data.lastName,
                }

                // Save Info User
                localStorage.setItem(IS_LOGGED, "true");
                localStorage.setItem(INFO_USER, JSON.stringify(authData)); // array -> Object
                alert("Đăng nhập thành công!");
                navigate("/");
            }

        } catch (error) {
            console.log("Error Login:", error);
        }
    };

    return (
        <div id="login">
            <LoadingModal isLoading={isLoading} />
           <div className="container">
               <form className="table-login" onSubmit={login}>
                   <div className="title">Đăng nhập</div>
                   <div className="form">
                       <div className="name">Email<span className="required">*</span></div>
                       <div className="input-form"><input type="email" placeholder="Nhập Email" onChange={(e) => setEmail(e.target.value)} required/></div>
                   </div>

                   <div className="form">
                       <div className="name">Mật khẩu<span className="required">*</span></div>
                       <div className="input-form"><input type="password" placeholder="Nhập Mật khẩu" onChange={(e) => setPassword(e.target.value)} required/></div>
                   </div>

                   <div className="forget-pass">Quên mật khẩu? Nhấn vào <b>đây</b></div>

                   <button className="btn-login" type="sumbit">Đăng nhập</button>

                   <div className="forget-pass">Bạn chưa có tài khoản? <b onClick={() => navigate("/user/sign")}>Đăng ký tại đây</b></div>

                   <div className="login-more">
                       <div className="btn" style={{background: "#DE3F32"}}>
                           <div className="icon"><FaGoogle /></div>
                           <div className="name">Google</div>
                       </div>

                       <div className="btn" style={{background: "#49669C"}}>
                           <div className="icon"><FaFacebook /></div>
                           <div className="name">Facebook</div>
                       </div>
                   </div>
               </form>
           </div>
        </div>
    );
};

export default Login;