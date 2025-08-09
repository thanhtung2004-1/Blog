import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    // Lấy user từ localStorage khi load trang
    useEffect(() => {
        const savedUser = localStorage.getItem("currentUser");
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (user) => {
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
