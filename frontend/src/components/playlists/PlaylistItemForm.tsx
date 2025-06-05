import { useState } from "react";
import Button from "../ui/button/Button";
import Label from "../form/Label";

interface PlaylistItemFormProps {
  onSubmit: (videoId: string, position: number) => Promise<void>; // Thêm onSubmit
  initialVideoId?: string;
  initialPosition?: number;
  onCancel?: () => void;
}

export default function PlaylistItemForm({
  onSubmit,
  initialVideoId = "",
  initialPosition = 0,
  onCancel,
}: PlaylistItemFormProps) {
  const [videoId, setVideoId] = useState(initialVideoId);
  const [position, setPosition] = useState(initialPosition);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoId.trim()) return;
    setLoading(true);
    try {
      await onSubmit(videoId, position);
      setVideoId("");
      setPosition(0);
    } catch (error) {
      console.error("Playlist item error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Video ID</Label>
        <input
          type="text"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          placeholder="Enter video ID"
          required
          className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
        />
      </div>
      <div>
        <Label>Position (optional)</Label>
        <input
          type="number"
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          placeholder="Enter position"
          className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Item"}
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
