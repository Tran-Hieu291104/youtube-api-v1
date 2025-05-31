import { useState, useEffect } from "react";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { getCommentThreads, postComment } from "../../api";
import ComponentCard from "../common/ComponentCard";

interface CommentListProps {
  videoId: string;
}

export default function CommentList({ videoId }: CommentListProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCommentThreads(videoId);
      setComments(data.items || []);
    } catch (err) {
      if (err && typeof err === "object" && "message" in err) {
        setError(
          (err as { message: string }).message || "Failed to fetch comments"
        );
      } else {
        setError("Failed to fetch comments");
      }
      console.error("Fetch comments error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (text: string) => {
    await postComment(videoId, text);
    fetchComments();
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  if (loading)
    return <div className="text-center py-4">Loading comments...</div>;
  if (error)
    return <div className="text-center py-4 text-red-600">{error}</div>;

  return (
    <ComponentCard title="Comments">
      <CommentForm onSubmit={handleAddComment} placeholder="Add a comment..." />
      <div className="mt-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              videoId={videoId}
              onUpdate={fetchComments}
            />
          ))
        ) : (
          <div className="text-center py-4">No comments available.</div>
        )}
      </div>
    </ComponentCard>
  );
}
