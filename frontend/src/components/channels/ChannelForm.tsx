import { useState } from "react";
import Button from "../ui/button/Button";
import Label from "../form/Label";

interface ChannelFormProps {
  onSubmit: (
    title: string,
    description: string,
    keywords: string
  ) => Promise<void>;
  initialTitle: string;
  initialDescription: string;
  initialKeywords: string;
  onCancel?: () => void;
}

export default function ChannelForm({
  onSubmit,
  initialTitle,
  initialDescription,
  initialKeywords,
  onCancel,
}: ChannelFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [keywords, setKeywords] = useState(initialKeywords);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubmit(title, description, keywords);
      setTitle(initialTitle);
      setDescription(initialDescription);
      setKeywords(initialKeywords);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to update channel");
        console.error("Channel update error:", err);
      } else {
        setError("Failed to update channel");
        console.error("Channel update error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
      <div>
        <Label>Channel Title</Label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter channel title"
          required
          disabled={loading}
          className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 disabled:opacity-50"
        />
      </div>
      <div>
        <Label>Description</Label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter channel description"
          disabled={loading}
          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 disabled:opacity-50"
          rows={4}
        />
      </div>
      <div>
        <Label>Keywords (comma-separated)</Label>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="e.g., music, vlog, tech"
          disabled={loading}
          className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 disabled:opacity-50"
        />
      </div>
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="bg-gray-500 text-white hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
