import { useState } from "react";
import Label from "../form/Label";
import Button from "../ui/button/Button";

interface CommentFormProps {
  onSubmit: (text: string) => Promise<void>;
  placeholder?: string;
  initialText?: string;
  onCancel?: () => void;
}

export default function CommentForm({
  onSubmit,
  placeholder = "Enter your comment",
  initialText = "",
  onCancel,
}: CommentFormProps) {
  const [text, setText] = useState(initialText);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      await onSubmit(text);
      setText("");
    } catch (error) {
      console.error("Comment error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div>
        <Label>Comment</Label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          rows={3}
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post Comment"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
