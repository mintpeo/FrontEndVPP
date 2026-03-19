import React, {useEffect, useState} from 'react';
import './password.css';

import {GetStoredUser} from "../../../../service/GetStoredUser.jsx";
import {API_URL, INFO_USER} from "../../../../service/API_URL.jsx";

const Password = () => {
    const API = API_URL;

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newAgainPassword, setNewAgainPassword] = useState("");

    const [isValid, setIsValid] = useState(false);

    const userString = localStorage.getItem(INFO_USER);
    const user = JSON.parse(userString);

    // CHECK NEW PASSWORD AND NEW PASSWORD AGAIN
    useEffect(() => {
        const handler = setTimeout(() => {
           if (newPassword !== newAgainPassword) {
               setIsValid(true);
           } else setIsValid(false);
        }, 500);

        return () => clearTimeout(handler);
    }, [newPassword, newAgainPassword]);

    // UPDATE PASSWORD
    const updatePassword = async (e) => {
        e.preventDefault();

        const changePassword = {
            email: user.email,
            oldPass: oldPassword,
            newPass: newPassword
        }

        try {
            const res = await fetch(`${API}/user/changePass`, {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(changePassword),
            });

            const status = await res.json();

            if (status) {
                alert("Đổi mật khẩu thành công!");
                window.location.reload();
            } else {
                alert("Mật khẩu cũ không đúng!");
            }

        } catch (e) {
            console.log("ERROR UPDATE_PASSWORD ", e);
        }
    };

    return (
        <div className="password">
            <div className="title">Mật khẩu tài khoản</div>

            <form className="extraInfo" onSubmit={updatePassword}>
                <div className="info">
                    <p>Mật khẩu cũ:</p>
                    <input className="form-control" type="password" required placeholder="Nhập mật khẩu cũ (*)" onChange={(e) => setOldPassword(e.target.value)}/>
                </div>

                <div className="info">
                    <p>Mật khẩu mới:</p>
                    <input className="form-control" type="password" required placeholder="Nhập mật khẩu mới (*)" onChange={(e) => setNewPassword(e.target.value)}/>
                </div>

                <div className="info">
                    <p>Nhập lại mật khẩu mới:</p>
                    <input className="form-control" type="password" required placeholder="Nhập lại mật khẩu mới (*)" onChange={(e) => setNewAgainPassword(e.target.value)}/>
                </div>

                {isValid && <p style={{ color: "red" }}>Mật khẩu mới không khớp!</p>}

                <div className="btn-update">
                    <button className="btn" disabled={isValid} type="sumbit">Đổi mật khẩu</button>
                </div>
            </form>
        </div>
    );
};

export default Password;