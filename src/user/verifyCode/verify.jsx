import React, {useState} from 'react';
import './verify.css'

import { FaAngleLeft } from "react-icons/fa";
import { useLocation, useNavigate} from "react-router-dom";
import {API_URL, INFO_USER, KEY_LOGGED} from "../../service/API_URL.jsx";

const Verify = () => {
    const location = useLocation();
    const newUser = location.state.newUser;
    console.log(newUser);

    const navigate = useNavigate();

    const [otp, setOtp] = useState(new Array(6).fill(""));

    // const newUser = {
    //     email: "123",
    //     password: "123",
    //     lastName: "minh",
    //     firstName: "tran",
    //     phone: "1",
    // }

    const handleChange = (element, index) => {
        const value = element.value;
        if (isNaN(value)) return false; // Chỉ cho nhập số

        // Cập nhật giá trị vào mảng otp
        let newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Chỉ lấy 1 ký tự cuối
        setOtp(newOtp);

        // Tự động nhảy sang ô tiếp theo nếu có nhập giá trị
        // if (value && element.nextSibling) {
        //     element.nextSibling.focus();
        // }
    };

    const signUp = async(e) => {
        e.preventDefault();

        const code = otp.join("");
        const verify = await fetch(`${API_URL}/auth/verifyCode?email=${newUser.email}&code=${code}`, {
            method: "POST"
        });
        const isVerify = await verify.json();
        console.log(newUser.email);
        console.log(code);

        if (!isVerify) return;
        alert("DONE");
        // try {
        //     const res = await fetch(`${API_URL}/user/sign`, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify(newUser),
        //     });
        //
        //     if (res.ok) {
        //         const loginUser = await fetch(`${API_URL}/user/login`, {
        //             method: "Post",
        //             headers: {
        //                 "Content-Type": "application/json",
        //             },
        //             body: JSON.stringify({
        //                 email: email,
        //                 pass: password
        //             }),
        //         });
        //
        //         const logined = await loginUser.json();
        //
        //         localStorage.setItem(KEY_LOGGED, "true");
        //         localStorage.setItem(INFO_USER, JSON.stringify(logined));
        //         alert("Đăng ký thành công.");
        //         navigate("/");
        //     }
        // } catch (error) {
        //     console.log("Error SignUp: ", error);
        // }
    }

    return (
        <div id="verify">
            <div className="container">
                <form className="table" onSubmit={signUp}>
                    {/* HEADER */}
                    <div className="header">
                        <div className="icon" onClick={() => navigate("/user/sign")}><FaAngleLeft /></div>
                        <div className="title">Xác minh email của bạn</div>
                    </div>

                    {/* BODY */}
                    <div className="body">
                        <div style={{fontSize: "1.1rem"}}>Nhập mã xác minh chúng tôi vừa gửi cho bạn: <span>{newUser.email}</span></div>
                        <div className="placeCode">
                            <ul className="list-place">
                                {otp.map((data, index) => (
                                    <li className="item-place">
                                        <input className="value"
                                            key={index}
                                            type="text"
                                            maxLength="1"
                                            value={data}
                                            onChange={e => handleChange(e.target, index)}
                                            onFocus={e => e.target.select()} // Tự động bôi đen để dễ nhập đè
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="text">Bạn không nhận được mã?<span>TIME</span></div>
                    </div>

                    {/* BUTTON SUBMIT */}
                    <div className="submit">
                        <button className="confirm" type="submit">Xác nhận</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Verify;