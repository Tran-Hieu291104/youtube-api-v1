import { useState } from "react";
import Button from "../ui/button/Button";
import Label from "../form/Label";

interface ChannelBannerFormProps {
  onSubmit: (file: File) => Promise<void>;
}

export default function ChannelBannerForm({
  onSubmit,
}: ChannelBannerFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateImage = async (file: File): Promise<string | null> => {
    const validTypes = ["image/jpeg", "image/png", "image/bmp", "image/gif"];
    const maxSize = 6 * 1024 * 1024; // 6MB

    if (!validTypes.includes(file.type)) {
      return "Invalid file type. Only JPG, PNG, BMP, or GIF (non-animated) are supported.";
    }
    if (file.size > maxSize) {
      return "File size exceeds 6MB limit.";
    }

    // Kiểm tra kích thước ảnh
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (img.width < 2046 || img.height < 1144) {
          resolve("Image must be at least 2048x1152 pixels.");
        } else if (Math.abs(img.width / img.height - 16 / 9) > 0.1) {
          resolve("Image must have a 16:9 aspect ratio.");
        } else {
          resolve(null);
        }
      };
      img.onerror = () => resolve("Failed to load image.");
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file.");
      return;
    }

    const validationError = await validateImage(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSubmit(file);
      setFile(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to upload banner");
        console.error("Banner upload error:", err);
      } else {
        setError("Failed to upload banner");
        console.error("Banner upload error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
      <div>
        <Label>Banner Image (16:9, at least 2048x1152 pixels, max 6MB)</Label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setError(null);
          }}
          className="w-full text-sm text-gray-500 dark:text-gray-400"
        />
      </div>
      <Button
        type="submit"
        disabled={loading || !file}
        className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload Banner"}
      </Button>
    </form>
  );
}
