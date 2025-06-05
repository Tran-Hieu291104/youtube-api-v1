import Button from "../ui/button/Button";
import { useState } from "react";
import { updatePlaylistItem, deletePlaylistItem } from "../../api";
import PlaylistItemForm from "./PlaylistItemForm";

interface PlaylistItemProps {
  item: {
    id: string;
    snippet: {
      title: string;
      resourceId: { videoId: string };
      position: number;
    };
  };
  playlistId: string;
  onUpdate: () => void;
  canManage: boolean; // Thêm canManage vào interface
}

export default function PlaylistItem({
  item,
  playlistId,
  onUpdate,
  canManage,
}: PlaylistItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = async (videoId: string, position: number) => {
    await updatePlaylistItem(item.id, playlistId, videoId, position);
    setIsEditing(false);
    onUpdate();
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    await deletePlaylistItem(item.id);
    onUpdate();
  };

  return (
    <div className="border-b border-gray-300 py-4">
      {isEditing && canManage ? (
        <PlaylistItemForm
          onSubmit={handleUpdate}
          initialVideoId={item.snippet.resourceId.videoId}
          initialPosition={item.snippet.position}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-800 dark:text-white/90">
              {item.snippet.title}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Position: {item.snippet.position}
            </p>
          </div>
          {canManage && (
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 text-white hover:bg-yellow-600"
              >
                Edit
              </Button>
              <Button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
