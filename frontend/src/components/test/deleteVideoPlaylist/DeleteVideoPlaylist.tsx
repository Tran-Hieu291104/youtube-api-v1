import React, { useState } from "react";
import { deleteVideoPlaylist } from "../../api";

const DeleteVideoPlaylist: React.FC = () => {
  const [id, setId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const token = localStorage.getItem("youtubeToken");

  const handleDeleteVideo = async () => {
    if (!id) {
      setError("Vui lòng nhập Playlist Item ID");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await deleteVideoPlaylist(id);
      setMessage(`Xóa video khỏi playlist thành công! Playlist Item ID: ${id}`);
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
        <h1>Xóa video khỏi playlist</h1>
        <p>Vui lòng đăng nhập bằng Google để xóa video.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Xóa video khỏi playlist</h1>
      <div>
        <label htmlFor="playlistItemId">Playlist Item ID: </label>
        <input
          id="playlistItemId"
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Nhập ID của mục video trong playlist"
          disabled={loading}
        />
      </div>
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleDeleteVideo} disabled={loading}>
          Xóa video
        </button>
      </div>
      {loading && <p>Đang xóa...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default DeleteVideoPlaylist;
