import React, { useState } from "react";
import { editPlaylist } from "../../api";

const EditPlaylist: React.FC = () => {
  const [playlistId, setPlaylistId] = useState<string>("");
  const [videoId, setVideoId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const token = localStorage.getItem("youtubeToken");

  const handleEditPlaylist = async () => {
    if (!playlistId || !videoId) {
      setError("Vui lòng nhập cả Playlist ID và Video ID");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const updatedPlaylistItem = await editPlaylist(playlistId, videoId);
      setMessage(
        `Đã thêm video vào playlist thành công! Playlist Item ID: ${updatedPlaylistItem.id}`
      );
      setVideoId("");
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
        <h1>Thêm video vào playlist</h1>
        <p>Vui lòng đăng nhập bằng Google để thêm video vào playlist.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Thêm video vào playlist</h1>
      <div>
        <label htmlFor="playlistId">Playlist ID: </label>
        <input
          id="playlistId"
          type="text"
          value={playlistId}
          onChange={(e) => setPlaylistId(e.target.value)}
          placeholder="Nhập ID của playlist"
          disabled={loading}
        />
      </div>
      <div style={{ marginTop: "10px" }}>
        <label htmlFor="videoId">Video ID: </label>
        <input
          id="videoId"
          type="text"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          placeholder="Nhập ID của video"
          disabled={loading}
        />
      </div>
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleEditPlaylist} disabled={loading}>
          Thêm video vào playlist
        </button>
      </div>
      {loading && <p>Đang thêm...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default EditPlaylist;
