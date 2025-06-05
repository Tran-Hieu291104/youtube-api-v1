import React, { useState } from "react";
import { Reply } from "../../youtubeApi";
import { getComment } from "../../api";

const GetTopLevelCmtReplies: React.FC = () => {
  const [parentId, setParentId] = useState<string>(""); // ID của top-level comment
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("youtubeToken");

  const handleFetchReplies = async () => {
    if (!parentId) {
      setError("Vui lòng nhập Top-level Comment ID");
      return;
    }

    setLoading(true);
    setError(null);
    setReplies([]);

    try {
      const data = await getComment(parentId);
      setReplies(data.items || []);
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
        <h1>Lấy bình luận trả lời của Top-level Comment</h1>
        <p>Vui lòng đăng nhập bằng Google để tiếp tục.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Lấy bình luận trả lời của Top-level Comment</h1>
      <div>
        <label htmlFor="parentId">Top-level Comment ID: </label>
        <input
          id="parentId"
          type="text"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          placeholder="Nhập ID bình luận gốc"
          disabled={loading}
        />
        <button
          onClick={handleFetchReplies}
          disabled={loading}
          style={{ marginLeft: "10px" }}
        >
          Tải bình luận trả lời
        </button>
      </div>

      {loading && <p>Đang tải...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {replies.length > 0 ? (
        <div style={{ marginTop: "20px" }}>
          <h2>Danh sách bình luận trả lời</h2>
          <ul>
            {replies.map((reply) => (
              <li key={reply.id}>
                <strong>ID:</strong> {reply.id} <br />
                <strong>Tác giả:</strong> {reply.snippet.authorDisplayName}{" "}
                <br />
                <strong>Nội dung:</strong> {reply.snippet.textDisplay}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !loading && <p>Không tìm thấy bình luận trả lời nào.</p>
      )}
    </div>
  );
};

export default GetTopLevelCmtReplies;
