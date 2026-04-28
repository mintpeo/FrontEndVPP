import React, {useEffect, useRef, useState} from 'react';
import './verify.css'

import { FaAngleLeft } from "react-icons/fa";
import { useLocation, useNavigate} from "react-router-dom";
import {API_URL, INFO_USER, IS_LOGGED} from "../../service/API_URL.jsx";
import LoadingModal from "../../modal/LoadingModal.jsx";

const Verify = () => {
    const location = useLocation();
    const newUser = location.state.newUser;
    // const newUser = {
    //     email: "123",
    //     password: "123",
    //     lastName: "minh",
    //     firstName: "tran",
    //     phone: "1",
    // }

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [time, setTime] = useState(60);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (time <= 0) return;

        const timer = setInterval(() => {
            setTime((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [time]);

    const handleResendCode = async () => {
        if (time > 0) return;
        alert("Chúng tôi đã gửi lại mã xác minh cho bạn!");
        setTime(60);
        await fetch(`${API_URL}/authVerify/sendCode?email=${newUser.email}`, {
            method: "POST"
        });
    };

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
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // TỰ ĐỘNG QUAY LẠI Ô TRƯỚC KHI BẤM BACKSPACE
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const signUp = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const code = otp.join("");
        const verify = await fetch(`${API_URL}/authVerify/verifyCode?email=${newUser.email}&code=${code}`, {
            method: "POST"
        });
        const isVerify = await verify.json();

        if (!isVerify) {
            setIsLoading(false);
            alert("Vui lòng thử lại hoặc mã đã hết hạn!");
            return;
        }

        // Verify = True
        try {
            const signUp = await fetch(`${API_URL}/user/sign`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            const data = await signUp.json();

            if (signUp.ok) {
                setIsLoading(false);

                const authData = {
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    expiresAt: Date.now() + (data.expiresIn * 1000), // Tính ra thời điểm milisec
                    id: data.id,
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    role: "user"
                }

                localStorage.setItem(IS_LOGGED, "true");
                localStorage.setItem(INFO_USER, JSON.stringify(authData));
                alert("Đăng ký thành công.");
                navigate("/");
            }
        } catch (error) {
            console.log("Error SignUp: ", error);
        }
    }

    return (
        <div id="verify">
            <LoadingModal isLoading={isLoading} />
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
                                               inputMode="numeric"
                                               maxLength="1"
                                               value={data}
                                               ref={(el) => (inputRefs.current[index] = el)}
                                               onChange={e => handleChange(e.target, index)}
                                               onKeyDown={(e) => handleKeyDown(e, index)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="text">
                            <p style={{cursor: time <= 0 ? "pointer" : "not-allowed"}}
                               onClick={handleResendCode}>Bạn không nhận được mã? Ấn vào đây</p>
                            <span>{time}s</span>
                        </div>
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