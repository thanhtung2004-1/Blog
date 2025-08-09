import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Select, Typography, message, Card, Spin } from "antd";
import api from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const { Title } = Typography;
const { Option } = Select;

export default function EditPost() {
    const { id } = useParams();
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState(null);

    const editor = useEditor({
        extensions: [StarterKit],
        content: "",
    });

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await api.get(`/posts/${id}`);
                const post = res.data;
                if (!currentUser || currentUser.id !== post.authorId) {
                    message.error("Bạn không có quyền sửa bài viết này");
                    navigate("/");
                    return;
                }
                setInitialValues({
                    title: post.title,
                    visibility: post.visibility,
                });
                editor?.commands.setContent(post.content);
            } catch (err) {
                message.error("Không tìm thấy bài viết");
                navigate("/");
            }
        };
        fetchPost();
    }, [id, currentUser, editor, navigate]);

    const onFinish = async (values) => {
        if (!editor || editor.isEmpty) {
            message.error("Vui lòng nhập nội dung");
            return;
        }
        try {
            setLoading(true);
            await api.put(`/posts/${id}`, {
                ...values,
                content: editor.getHTML(),
                authorId: currentUser.id,
                authorName: currentUser.fullname,
            });
            message.success("Cập nhật thành công");
            navigate("/");
        } catch (err) {
            message.error("Lỗi khi cập nhật bài viết");
        } finally {
            setLoading(false);
        }
    };

    if (!initialValues) {
        return (
            <div style={{ textAlign: "center", marginTop: 50 }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
            <Card style={{ width: 800 }}>
                <Title level={3}>Chỉnh sửa bài viết</Title>
                <Form layout="vertical" initialValues={initialValues} onFinish={onFinish}>
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
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
