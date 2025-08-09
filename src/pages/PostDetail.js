import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";
import {
    Card,
    Typography,
    Spin,
    List,
    Avatar,
    Input,
    Button,
    message,
} from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

export default function PostDetail() {
    const { id } = useParams();
    const { currentUser } = useContext(AuthContext);
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(true);
    const [commentLoading, setCommentLoading] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const resPost = await api.get(`/posts/${id}`);
                setPost(resPost.data);

                const resComments = await api.get(`/comments?postId=${id}&_sort=createdAt&_order=desc`);
                setComments(resComments.data);
            } catch (err) {
                message.error("Không tìm thấy bài viết");
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleAddComment = async () => {
        if (!commentText.trim()) {
            message.warning("Vui lòng nhập nội dung bình luận");
            return;
        }
        try {
            setCommentLoading(true);
            const newComment = {
                postId: Number(id),
                userId: currentUser.id,
                userName: currentUser.fullname,
                content: commentText,
                createdAt: new Date().toISOString(),
            };
            const res = await api.post("/comments", newComment);
            setComments([res.data, ...comments]);
            setCommentText("");
        } catch (err) {
            message.error("Lỗi khi gửi bình luận");
        } finally {
            setCommentLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: 50 }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!post) {
        return <p>Không tìm thấy bài viết</p>;
    }

    return (
        <div style={{ maxWidth: 900, margin: "30px auto" }}>
            <Card>
                <Title level={2}>{post.title}</Title>
                <Paragraph>
                    <strong>Tác giả:</strong> {post.authorName} |{" "}
                    <strong>Chế độ:</strong> {post.visibility}
                </Paragraph>
                <div
                    style={{ border: "1px solid #eee", padding: 15, borderRadius: 5 }}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </Card>

            <Card style={{ marginTop: 30 }} title="Bình luận">
                {currentUser ? (
                    <div style={{ marginBottom: 20 }}>
                        <TextArea
                            rows={3}
                            placeholder="Nhập bình luận..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <Button
                            type="primary"
                            onClick={handleAddComment}
                            style={{ marginTop: 10 }}
                            loading={commentLoading}
                        >
                            Gửi bình luận
                        </Button>
                    </div>
                ) : (
                    <p>Vui lòng đăng nhập để bình luận.</p>
                )}

                <List
                    itemLayout="horizontal"
                    dataSource={comments}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar>{item.userName.charAt(0).toUpperCase()}</Avatar>}
                                title={
                                    <>
                                        {item.userName}{" "}
                                        <span style={{ color: "#999", fontSize: 12 }}>
                      {dayjs(item.createdAt).fromNow()}
                    </span>
                                    </>
                                }
                                description={item.content}
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
}
