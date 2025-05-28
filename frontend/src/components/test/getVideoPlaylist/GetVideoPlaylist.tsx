import React, { useState } from "react";
import { PlaylistItem } from "../../youtubeApi";
import { getVideosOfPlaylist } from "../../api";

const GetVideoPlaylist: React.FC = () => {
  const [playlistId, setPlaylistId] = useState<string>(""); // ID của playlist
  const [videos, setVideos] = useState<PlaylistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("youtubeToken");

  const handleFetchVideos = async () => {
    if (!playlistId) {
      setError("Vui lòng nhập Playlist ID");
      return;
    }

    setLoading(true);
    setError(null);
    setVideos([]);

    try {
      const data = await getVideosOfPlaylist(playlistId);
      setVideos(data.items || []);
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
        <h1>Lấy video trong playlist</h1>
        <p>Vui lòng đăng nhập bằng Google để lấy danh sách video.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Lấy video trong playlist</h1>
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
        <button
          onClick={handleFetchVideos}
          disabled={loading}
          style={{ marginLeft: "10px" }}
        >
          Tải danh sách video
        </button>
      </div>

      {loading && <p>Đang tải...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {videos.length > 0 ? (
        <div style={{ marginTop: "20px" }}>
          <h2>Danh sách video trong playlist</h2>
          <ul>
            {videos.map((video) => (
              <li key={video.id}>
                <strong>Playlist Item ID:</strong> {video.id} <br />{" "}
                {/* Hiển thị items.id */}
                <strong>Tiêu đề:</strong> {video.snippet.title} <br />
                <strong>Mô tả:</strong>{" "}
                {video.snippet.description || "Không có mô tả"} <br />
                <img
                  src={video.snippet.thumbnails.default.url}
                  alt={video.snippet.title}
                  style={{ marginTop: "5px" }}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !loading && <p>Không tìm thấy video nào trong playlist.</p>
      )}
    </div>
  );
};

export default GetVideoPlaylist;
