import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Button, Card, Space, Row, Col, Typography, message } from "antd";

const { Title, Text } = Typography;

export default function Home() {
    const { currentUser, logout } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                let res;
                if (currentUser) {
                    res = await api.get(`/posts`);
                    setPosts(
                        res.data.filter(
                            (p) =>
                                p.visibility === "public" || p.authorId === currentUser.id
                        )
                    );
                } else {
                    res = await api.get(`/posts?visibility=public`);
                    setPosts(res.data);
                }
            } catch (err) {
                console.error(err);
                message.error("Lỗi tải bài viết");
            }
        };
        fetchPosts();
    }, [currentUser]);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
            await api.delete(`/posts/${id}`);
            setPosts(posts.filter((p) => p.id !== id));
            message.success("Đã xóa bài viết");
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
                <Col>
                    <Title level={2}>Trang chủ</Title>
                </Col>
                <Col>
                    {currentUser ? (
                        <Space>
                            <Text>Xin chào, {currentUser.fullname}</Text>
                            <Button danger onClick={logout}>
                                Đăng xuất
                            </Button>
                            <Button type="primary" onClick={() => navigate("/posts/new")}>
                                Tạo bài viết
                            </Button>
                        </Space>
                    ) : (
                        <Text>Bạn chưa đăng nhập</Text>
                    )}
                </Col>
            </Row>

            <Title level={3}>Danh sách bài viết</Title>
            <Row gutter={[16, 16]}>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <Col xs={24} sm={12} md={8} key={post.id}>
                            <Card
                                title={post.title}
                                variant="outlined" // Thay cho bordered
                                extra={<Text type="secondary">{post.visibility}</Text>}
                            >
                                <p>
                                    <Text type="secondary">Tác giả: {post.authorName}</Text>
                                </p>
                                <Space>
                                    <Button
                                        type="link"
                                        onClick={() => navigate(`/posts/${post.id}`)}
                                    >
                                        Xem chi tiết
                                    </Button>
                                    {currentUser && currentUser.id === post.authorId && (
                                        <>
                                            <Button
                                                type="link"
                                                onClick={() => navigate(`/posts/${post.id}/edit`)}
                                            >
                                                Sửa
                                            </Button>
                                            <Button
                                                type="link"
                                                danger
                                                onClick={() => handleDelete(post.id)}
                                            >
                                                Xóa
                                            </Button>
                                        </>
                                    )}
                                </Space>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col span={24}>
                        <Text>Không có bài viết</Text>
                    </Col>
                )}
            </Row>
        </div>
    );
}
