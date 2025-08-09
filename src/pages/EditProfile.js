import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const [fullname, setFullname] = useState(currentUser.fullname);
    const [password, setPassword] = useState(currentUser.password);
    const navigate = useNavigate();

    const handleSave = async () => {
        try {
            const updatedUser = { ...currentUser, fullname, password };
            await api.put(`/users/${currentUser.id}`, updatedUser);
            setCurrentUser(updatedUser);
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Sửa thông tin cá nhân</h2>
            <input
                placeholder="Họ và tên"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                style={{ width: "100%", marginBottom: "10px" }}
            />
            <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", marginBottom: "10px" }}
            />
            <button onClick={handleSave}>Lưu</button>
        </div>
    );
}
