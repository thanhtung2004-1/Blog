import React, { useState, useContext } from "react";
import { Form, Input, Button, Select, Typography, message, Card, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const { Title } = Typography;
const { Option } = Select;

export default function CreatePost() {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const editor = useEditor({
        extensions: [StarterKit],
        content: "",
    });

    const onFinish = async (values) => {
        if (!editor || editor.isEmpty) {
            message.error("Vui lòng nhập nội dung");
            return;
        }
        try {
            setLoading(true);
            const newPost = {
                ...values,
                content: editor.getHTML(),
                authorId: currentUser.id,
                authorName: currentUser.fullname,
            };
            await api.post("/posts", newPost);
            message.success("Tạo bài viết thành công");
            navigate("/");
        } catch (err) {
            message.error("Lỗi khi tạo bài viết");
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) {
        return <p>Bạn cần đăng nhập để tạo bài viết</p>;
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
            <Card style={{ width: 800 }}>
                <Title level={3}>Tạo bài viết</Title>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
                    >
                        <Input placeholder="Nhập tiêu đề" />
                    </Form.Item>

                    <Form.Item label="Nội dung">
                        <div style={{ border: "1px solid #ccc", borderRadius: 4, minHeight: 150, padding: 10 }}>
                            <EditorContent editor={editor} />
                        </div>
                    </Form.Item>

                    <Form.Item
                        label="Chế độ"
                        name="visibility"
                        rules={[{ required: true, message: "Vui lòng chọn chế độ" }]}
                    >
                        <Select placeholder="Chọn chế độ hiển thị">
                            <Option value="public">Public</Option>
                            <Option value="private">Private</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Tạo bài viết
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
