import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import PostDetail from "./pages/PostDetail";
import Profile from "./pages/Profile";

const { Content } = Layout;

function App() {
    return (
        <AuthProvider>
            <Router>
                <Layout style={{ minHeight: "100vh" }}>
                    <Navbar />
                    <Content style={{ padding: "20px 50px" }}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/posts/new" element={<CreatePost />} />
                            <Route path="/posts/:id/edit" element={<EditPost />} />
                            <Route path="/posts/:id" element={<PostDetail />} />
                            <Route path="/profile" element={<Profile />} />
                        </Routes>
                    </Content>
                </Layout>
            </Router>
        </AuthProvider>
    );
}

export default App;
