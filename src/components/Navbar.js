import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Menu, Avatar, Dropdown, Button } from "antd";
import { AuthContext } from "../contexts/AuthContext";

const { Header } = Layout;

export default function Navbar() {
    const { currentUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const userMenu = {
        items: [
            {
                key: "profile",
                label: <Link to="/profile">Sửa thông tin</Link>,
            },
            {
                key: "logout",
                label: <span onClick={handleLogout}>Đăng xuất</span>,
            },
        ],
    };

    return (
        <Header style={{ background: "#fff", padding: "0 20px", boxShadow: "0 2px 8px #f0f1f2" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {/* Left Menu */}
                <Menu mode="horizontal" selectedKeys={[]} style={{ flex: 1, borderBottom: "none" }}>
                    <Menu.Item key="home">
                        <Link to="/">🏠 Trang chủ</Link>
                    </Menu.Item>
                    {currentUser && (
                        <Menu.Item key="create">
                            <Link to="/posts/new">✍️ Tạo bài viết</Link>
                        </Menu.Item>
                    )}
                </Menu>

                {/* Right Area */}
                {currentUser ? (
                    <Dropdown menu={userMenu} placement="bottomRight">
                        <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                            <Avatar style={{ backgroundColor: "#87d068", marginRight: 8 }}>
                                {currentUser.fullname.charAt(0).toUpperCase()}
                            </Avatar>
                            {currentUser.fullname}
                        </div>
                    </Dropdown>
                ) : (
                    <div>
                        <Link to="/login">
                            <Button type="primary" style={{ marginRight: 10 }}>
                                Đăng nhập
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button>Đăng ký</Button>
                        </Link>
                    </div>
                )}
            </div>
        </Header>
    );
}
