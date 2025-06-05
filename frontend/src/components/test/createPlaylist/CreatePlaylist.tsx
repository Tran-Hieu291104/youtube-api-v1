import React, { useState } from "react";
import { createPlaylist } from "../../api";

const CreatePlaylist: React.FC = () => {
  const [title, setTitle] = useState<string>(""); // Tiêu đề playlist
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const token = localStorage.getItem("youtubeToken");

  const handleCreatePlaylist = async () => {
    if (!title || !description) {
      setError("Vui lòng nhập cả tiêu đề và mô tả");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const newPlaylist = await createPlaylist(title, description);
      setMessage(`Tạo playlist thành công! Playlist ID: ${newPlaylist.id}`);
      setTitle("");
      setDescription("");
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
        <h1>Tạo Playlist</h1>
        <p>Vui lòng đăng nhập bằng Google để tạo playlist.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Tạo Playlist</h1>
      <div>
        <label htmlFor="title">Tiêu đề: </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập tiêu đề playlist"
          disabled={loading}
        />
      </div>
      <div style={{ marginTop: "10px" }}>
        <label htmlFor="description">Mô tả: </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Nhập mô tả playlist"
          disabled={loading}
          rows={4}
          style={{ width: "300px" }}
        />
      </div>
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleCreatePlaylist} disabled={loading}>
          Tạo Playlist
        </button>
      </div>
      {loading && <p>Đang tạo...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default CreatePlaylist;
