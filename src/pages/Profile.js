import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, message, Typography } from "antd";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";

const { Title } = Typography;

export default function Profile() {
    const { currentUser, login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (!currentUser) {
            // Nếu chưa login chuyển về login
            navigate("/login");
            return;
        }
        // điền form với dữ liệu hiện tại
        form.setFieldsValue({
            fullname: currentUser.fullname || "",
            password: currentUser.password || "",
        });
    }, [currentUser, form, navigate]);

    const onFinish = async (values) => {
        if (!currentUser) return;
        try {
            setLoading(true);
            // Giữ các trường khác (username, id, ...)
            const updatedUser = {
                ...currentUser,
                fullname: values.fullname,
                // Nếu để trống password (nếu bạn cho phép) thì giữ password cũ
                password: values.password || currentUser.password,
            };

            await api.put(`/users/${currentUser.id}`, updatedUser);

            // Cập nhật context + localStorage (dùng login để set và lưu)
            if (typeof login === "function") {
                login(updatedUser);
            } else {
                // Nếu AuthContext không có login, fallback lưu trực tiếp
                localStorage.setItem("currentUser", JSON.stringify(updatedUser));
            }

            message.success("Cập nhật thông tin thành công");
            navigate("/");
        } catch (err) {
            console.error(err);
            message.error("Lỗi khi cập nhật thông tin");
        } finally {
            setLoading(false);
        }
    };

    // Nếu chưa login, sẽ redirect trong useEffect, ở đây chỉ hiển thị null tạm thời
    if (!currentUser) return null;

    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
            <Card style={{ width: 480 }}>
                <Title level={3} style={{ textAlign: "center" }}>
                    Sửa thông tin cá nhân
                </Title>

                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Họ và tên"
                        name="fullname"
                        rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
                    >
                        <Input placeholder="Họ và tên" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                        extra="Nhập mật khẩu mới hoặc giữ giống mật khẩu hiện tại"
                    >
                        <Input.Password placeholder="Mật khẩu" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Lưu thay đổi
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
