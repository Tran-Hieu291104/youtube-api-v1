import React, { useState } from "react";
import { deleteComment } from "../../api";

const DeleteComment: React.FC = () => {
  const [id, setId] = useState<string>(""); // ID của bình luận cần xóa
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const token = localStorage.getItem("youtubeToken");

  const handleDeleteComment = async () => {
    if (!id) {
      setError("Vui lòng nhập Comment ID");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await deleteComment(id);
      setMessage(`Xóa bình luận thành công! Comment ID: ${id}`);
      setId("");
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
        <h1>Xóa bình luận</h1>
        <p>Vui lòng đăng nhập bằng Google để xóa bình luận.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Xóa bình luận</h1>
      <div>
        <label htmlFor="commentId">Comment ID: </label>
        <input
          id="commentId"
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Nhập ID bình luận cần xóa"
          disabled={loading}
        />
      </div>
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleDeleteComment} disabled={loading}>
          Xóa bình luận
        </button>
      </div>
      {loading && <p>Đang xóa...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default DeleteComment;
