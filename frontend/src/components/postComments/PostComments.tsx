import React, { useState } from "react";
import { postComment } from "../../api";

const Comments: React.FC = () => {
  const [videoId, setVideoId] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handlePostComment = async () => {
    if (!videoId || !commentText) {
      setError("Please enter both Video ID and comment text");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await postComment(videoId, commentText);
      setMessage(`Comment posted successfully! Comment ID: ${response.id}`);
      setCommentText("");
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
      <h1>Post a Top Level Comment</h1>

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

      <div style={{ marginTop: "10px" }}>
        <label htmlFor="commentText">Comment: </label>
        <textarea
          id="commentText"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Enter your comment"
          disabled={loading}
          rows={4}
          style={{ width: "300px" }}
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <button onClick={handlePostComment} disabled={loading}>
          Post Comment
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default Comments;
