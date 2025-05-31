import { useState } from "react";
import Button from "../ui/button/Button";
import Label from "../form/Label";

interface PlaylistFormProps {
  onSubmit: (title: string, description: string) => Promise<void>;
  initialTitle?: string;
  initialDescription?: string;
  onCancel?: () => void;
}

export default function PlaylistForm({
  onSubmit,
  initialTitle = "",
  initialDescription = "",
  onCancel,
}: PlaylistFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await onSubmit(title, description);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Playlist error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Title</Label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter playlist title"
          required
          className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
        />
      </div>
      <div>
        <Label>Description</Label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter playlist description"
          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          rows={4}
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Playlist"}
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
