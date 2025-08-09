import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Form, Input, Button, Typography, message, Card } from "antd";
import api from "../services/api";

const { Title } = Typography;

export default function Login() {
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const res = await api.get(`/users?username=${values.username}`);
            if (res.data.length === 0) {
                message.error("Tài khoản không tồn tại");
            } else {
                const user = res.data[0];
                if (user.password === values.password) {
                    login(user);
                    message.success("Đăng nhập thành công");
                    navigate("/");
                } else {
                    message.error("Sai mật khẩu");
                }
            }
        } catch (err) {
            message.error("Lỗi đăng nhập");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
            <Card style={{ width: 400 }}>
                <Title level={3} style={{ textAlign: "center" }}>
                    Đăng nhập
                </Title>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Tên đăng nhập"
                        name="username"
                        rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
                    >
                        <Input placeholder="Nhập username" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
