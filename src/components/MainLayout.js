import React, { useContext } from "react";
import { Layout, Menu, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const { Header, Content, Footer } = Layout;

export default function MainLayout({ children }) {
    const { currentUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Tạo menu động
    const menuItems = [
        { key: "home", label: <Link to="/">Trang chủ</Link> },
        ...(!currentUser
            ? [
                { key: "login", label: <Link to="/login">Login</Link> },
                { key: "register", label: <Link to="/register">Register</Link> },
            ]
            : [
                { key: "profile", label: <Link to="/edit-profile">Sửa thông tin</Link> },
                { key: "create", label: <Link to="/posts/new">Tạo bài viết</Link> },
                {
                    key: "logout",
                    label: (
                        <Button
                            type="link"
                            onClick={logout}
                            style={{ padding: 0, color: "#fff" }}
                        >
                            Đăng xuất
                        </Button>
                    ),
                },
            ]),
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
                    <Link to="/" style={{ color: "#fff" }}>
                        Blog Manager
                    </Link>
                </div>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectable={false}
                    items={menuItems}
                />
            </Header>

            <Content style={{ padding: "20px 50px" }}>{children}</Content>

            <Footer style={{ textAlign: "center" }}>
                © 2025 Blog Manager
            </Footer>
        </Layout>
    );
}
