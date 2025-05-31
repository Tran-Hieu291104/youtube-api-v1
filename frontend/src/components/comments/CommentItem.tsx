import { useState } from "react";
import CommentForm from "./CommentForm";
import CommentActions from "./CommentActions";
import { replyComment, deleteComment } from "../../api";
import { useCommentContext } from "./CommentContext";
import Button from "../ui/button/Button";

interface CommentItemProps {
  comment: {
    id: string;
    snippet: {
      topLevelComment: {
        id: string;
        snippet: {
          textOriginal: string;
          authorDisplayName: string;
          authorChannelId: { value: string };
        };
      };
    };
    replies?: { comments: any[] };
  };
  videoId: string;
  onUpdate: () => void;
}

export default function CommentItem({
  comment,
  videoId,
  onUpdate,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const { commentStates, setLikeStatus } = useCommentContext();
  const topLevelComment = comment.snippet.topLevelComment.snippet;
  const userEmail = localStorage.getItem("userEmail") || "";
  const isOwnComment =
    userEmail === "tranminhhieu291104@gmail.com" &&
    topLevelComment.authorChannelId.value === "UC8yajWjBFgHQk-dkmSdc5lQ";
  const likeStatus = commentStates[comment.id]?.likeStatus || null;

  const handleReply = async (text: string) => {
    await replyComment(comment.id, text);
    setShowReplyForm(false);
    onUpdate();
  };

  const handleLikeDislike = async (action: "like" | "dislike") => {
    setLikeStatus(comment.id, action);
    console.log(`${action} comment: ${comment.id}`);
  };

  const handleDelete = async (commentId: string) => {
    if (!isOwnComment) return;
    await deleteComment(commentId);
    setLikeStatus(commentId, null);
    onUpdate();
  };

  return (
    <div className="border-b border-gray-300 py-4">
      <div className="flex gap-3">
        <div>
          <p className="font-semibold text-gray-800 dark:text-white/90">
            {topLevelComment.authorDisplayName}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            {topLevelComment.textOriginal}
          </p>
        </div>
      </div>
      <CommentActions
        commentId={comment.snippet.topLevelComment.id}
        onLike={() => handleLikeDislike("like")}
        onDislike={() => handleLikeDislike("dislike")}
        onDelete={handleDelete}
        canEditDelete={isOwnComment}
        likeStatus={likeStatus}
      />
      <Button
        type="button"
        onClick={() => setShowReplyForm(!showReplyForm)}
        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 mt-2"
      >
        {showReplyForm ? "Cancel Reply" : "Reply"}
      </Button>
      {showReplyForm && (
        <CommentForm
          onSubmit={handleReply}
          placeholder="Enter your reply"
          onCancel={() => setShowReplyForm(false)}
        />
      )}
      {comment.replies?.comments?.map((reply: any) => (
        <div key={reply.id} className="ml-6 mt-2 border-l border-gray-300 pl-4">
          <p className="font-semibold text-gray-800 dark:text-white/90">
            {reply.snippet.authorDisplayName}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            {reply.snippet.textOriginal}
          </p>
          <CommentActions
            commentId={reply.id}
            onLike={() => handleLikeDislike("like")}
            onDislike={() => handleLikeDislike("dislike")}
            onDelete={handleDelete}
            canEditDelete={isOwnComment}
            likeStatus={commentStates[reply.id]?.likeStatus || null}
          />
        </div>
      ))}
    </div>
  );
}
