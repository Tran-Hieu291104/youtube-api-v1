import { useEffect, useState } from "react";
import { getCommentThreads } from "../../api";
import { CommentThread } from "../../youtubeApi";

const GetComments: React.FC = () => {
  const [videoId, setVideoId] = useState<string>("vUawE7RRywk"); // Video ID mặc định
  const [comments, setComments] = useState<CommentThread[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCommentThreads(videoId);
      setComments(data.items || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  return (
    <div>
      <h1>Danh sách bình luận cho Video ID: {videoId}</h1>
      <div>
        <label htmlFor="videoId">Video ID: </label>
        <input
          id="videoId"
          type="text"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          placeholder="Nhập YouTube Video ID"
        />
        <button onClick={fetchComments}>Tải bình luận</button>
      </div>
      {loading && <p>Đang tải...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {comments.length > 0 ? (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <strong>Id cmt: {comment.id}</strong>
              <strong>
                <br />
                {comment.snippet.topLevelComment.snippet.authorDisplayName}
              </strong>
              : {comment.snippet.topLevelComment.snippet.textDisplay}
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>Không tìm thấy bình luận nào.</p>
      )}
    </div>
  );
};

export default GetComments;
