import React, { useState } from "react";
import { replyComment } from "../../api";

const ReplyComment: React.FC = () => {
  const [parentId, setParentId] = useState<string>(""); // ID bình luận gốc
  const [commentText, setCommentText] = useState<string>(""); // Nội dung trả lời
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const token = localStorage.getItem("youtubeToken");

  const handleReplyComment = async () => {
    if (!parentId || !commentText) {
      setError("Vui lòng nhập cả Parent ID và nội dung bình luận");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await replyComment(parentId, commentText);
      setMessage(`Trả lời bình luận thành công! Comment ID: ${response.id}`);
      setCommentText("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div>
        <h1>Trả lời bình luận</h1>
        <p>Vui lòng đăng nhập bằng Google để trả lời bình luận.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Trả lời bình luận</h1>
      <div>
        <label htmlFor="parentId">Parent Comment ID: </label>
        <input
          id="parentId"
          type="text"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          placeholder="Nhập ID bình luận gốc"
          disabled={loading}
        />
      </div>
      <div style={{ marginTop: "10px" }}>
        <label htmlFor="commentText">Nội dung trả lời: </label>
        <textarea
          id="commentText"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Nhập nội dung trả lời"
          disabled={loading}
          rows={4}
          style={{ width: "300px" }}
        />
      </div>
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleReplyComment} disabled={loading}>
          Gửi trả lời
        </button>
      </div>
      {loading && <p>Đang gửi...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default ReplyComment;
