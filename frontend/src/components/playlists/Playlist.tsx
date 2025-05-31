import { useState, useEffect } from "react";
import Button from "../ui/button/Button";
import PlaylistForm from "./PlaylistForm";
import PlaylistItemForm from "./PlaylistItemForm";
import PlaylistItem from "./PlaylistItem";
import {
  fetchPlaylistItems,
  insertPlaylistItem,
  updatePlaylist,
  deletePlaylist,
} from "../../api";

interface PlaylistProps {
  playlist: {
    id: string;
    snippet: {
      title: string;
      description: string;
    };
  };
  onUpdate: () => void;
  canManage: boolean;
}

export default function Playlist({
  playlist,
  onUpdate,
  canManage,
}: PlaylistProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);

  const fetchItems = async (token?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPlaylistItems(playlist.id, token);
      setItems(data.items || []);
      setPageToken(data.nextPageToken);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        console.error("Fetch playlist items error:", err);
      } else {
        setError("Failed to fetch playlist items");
        console.error("Fetch playlist items error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [playlist.id]);

  const handleUpdate = async (title: string, description: string) => {
    await updatePlaylist(playlist.id, title, description);
    setIsEditing(false);
    onUpdate();
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this playlist?")) return;
    await deletePlaylist(playlist.id);
    onUpdate();
  };

  const handleAddItem = async (videoId: string) => {
    await insertPlaylistItem(playlist.id, videoId);
    setShowAddItemForm(false);
    fetchItems();
  };

  return (
    <div className="border rounded-lg p-4 mb-4">
      {isEditing ? (
        <PlaylistForm
          onSubmit={handleUpdate}
          initialTitle={playlist.snippet.title}
          initialDescription={playlist.snippet.description}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                {playlist.snippet.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {playlist.snippet.description}
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
          <div className="mt-4">
            {canManage && (
              <>
                <Button
                  type="button"
                  onClick={() => setShowAddItemForm(!showAddItemForm)}
                  className="bg-blue-600 text-white hover:bg-blue-700 mb-4"
                >
                  {showAddItemForm ? "Cancel Add Item" : "Add Item"}
                </Button>
                {showAddItemForm && (
                  <PlaylistItemForm
                    onSubmit={handleAddItem}
                    onCancel={() => setShowAddItemForm(false)}
                  />
                )}
              </>
            )}
            {loading && (
              <div className="text-center py-4">Loading items...</div>
            )}
            {error && (
              <div className="text-center py-4 text-red-600">{error}</div>
            )}
            {!loading && !error && items.length > 0 ? (
              items.map((item) => (
                <PlaylistItem
                  key={item.id}
                  item={item}
                  playlistId={playlist.id}
                  onUpdate={() => fetchItems()}
                  canManage={canManage}
                />
              ))
            ) : (
              <div className="text-center py-4">No items in this playlist.</div>
            )}
            {pageToken && (
              <Button
                type="button"
                onClick={() => fetchItems(pageToken)}
                className="bg-blue-600 text-white hover:bg-blue-700 mt-4"
              >
                Load More
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
