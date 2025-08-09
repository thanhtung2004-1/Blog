import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, message, Card } from "antd";
import api from "../services/api";

const { Title } = Typography;

export default function Register() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            setLoading(true);
            // Kiểm tra username đã tồn tại chưa
            const res = await api.get(`/users?username=${values.username}`);
            if (res.data.length > 0) {
                message.error("Tên đăng nhập đã tồn tại");
                setLoading(false);
                return;
            }

            const newUser = {
                ...values,
            };
            await api.post("/users", newUser);
            message.success("Đăng ký thành công, vui lòng đăng nhập");
            navigate("/login");
        } catch (err) {
            message.error("Lỗi đăng ký");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
            <Card style={{ width: 400 }}>
                <Title level={3} style={{ textAlign: "center" }}>
                    Đăng ký
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

                    <Form.Item
                        label="Họ và tên"
                        name="fullname"
                        rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
                    >
                        <Input placeholder="Nhập họ tên" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
