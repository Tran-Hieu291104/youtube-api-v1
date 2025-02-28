import React, { useState } from "react";
import { rate } from "../../api";

const Rate: React.FC = () => {
  const [videoId, setVideoId] = useState<string>("");
  const [rating, setRating] = useState<string | null>(null); // trạng thái rating hiện tại
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleRate = async (selectedRating: string) => {
    if (!videoId) {
      setError("Please enter a video ID");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await rate(videoId, selectedRating);
      setRating(selectedRating);
      setMessage(`Video rated as "${selectedRating}" successfully!`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Rate a Video</h1>

      {/* Input để nhập videoId */}
      <div>
        <label htmlFor="videoId">Video ID: </label>
        <input
          id="videoId"
          type="text"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          placeholder="Enter YouTube Video ID"
          disabled={loading}
        />
      </div>

      {/* nút để chọn rating */}
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={() => handleRate("like")}
          disabled={loading || rating === "like"}
          style={{ marginRight: "5px" }}
        >
          Like
        </button>
        <button
          onClick={() => handleRate("dislike")}
          disabled={loading || rating === "dislike"}
          style={{ marginRight: "5px" }}
        >
          Dislike
        </button>
        <button
          onClick={() => handleRate("none")}
          disabled={loading || rating === "none"}
        >
          None
        </button>
      </div>

      {/* Hiển thị trạng thái */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
      {rating && !loading && !error && !message && (
        <p>Current rating: {rating}</p>
      )}
    </div>
  );
};

export default Rate;
