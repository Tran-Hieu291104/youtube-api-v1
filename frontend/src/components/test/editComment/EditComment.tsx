import React, { useState } from "react";
import { editComment } from "../../api";

const EditComment: React.FC = () => {
  const [id, setId] = useState<string>(""); // ID của bình luận cần chỉnh sửa
  const [newComment, setNewComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const token = localStorage.getItem("youtubeToken");

  const handleEditComment = async () => {
    if (!id || !newComment) {
      setError("Vui lòng nhập cả Comment ID và nội dung mới");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const updatedComment = await editComment(newComment, id);
      setMessage(
        `Chỉnh sửa bình luận thành công! Comment ID: ${updatedComment.id}`
      );
      setNewComment("");
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
        <h1>Chỉnh sửa bình luận</h1>
        <p>Vui lòng đăng nhập bằng Google để chỉnh sửa bình luận.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Chỉnh sửa bình luận</h1>
      <div>
        <label htmlFor="commentId">Comment ID: </label>
        <input
          id="commentId"
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Nhập ID bình luận cần chỉnh sửa"
          disabled={loading}
        />
      </div>
      <div style={{ marginTop: "10px" }}>
        <label htmlFor="newComment">Nội dung mới: </label>
        <textarea
          id="newComment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Nhập nội dung mới"
          disabled={loading}
          rows={4}
          style={{ width: "300px" }}
        />
      </div>
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleEditComment} disabled={loading}>
          Gửi chỉnh sửa
        </button>
      </div>
      {loading && <p>Đang gửi...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default EditComment;
