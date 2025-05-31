import Button from "../ui/button/Button";

interface CommentActionsProps {
  commentId: string;
  onLike: () => Promise<void>;
  onDislike: () => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  canEditDelete: boolean;
  likeStatus: "like" | "dislike" | null;
}

export default function CommentActions({
  commentId,
  onLike,
  onDislike,
  onDelete,
  canEditDelete,
  likeStatus,
}: CommentActionsProps) {
  return (
    <div className="flex gap-2 mt-2">
      <Button
        type="button"
        onClick={onLike}
        className={`${
          likeStatus === "like"
            ? "bg-green-700 text-white"
            : "bg-green-500 text-white hover:bg-green-600"
        }`}
      >
        Like
      </Button>
      <Button
        type="button"
        onClick={onDislike}
        className={`${
          likeStatus === "dislike"
            ? "bg-orange-700 text-white"
            : "bg-orange-500 text-white hover:bg-orange-600"
        }`}
      >
        Dislike
      </Button>
      {canEditDelete && (
        <Button
          type="button"
          onClick={() => onDelete(commentId)}
          className="bg-red-500 text-white hover:bg-red-600"
        >
          Delete
        </Button>
      )}
    </div>
  );
}
