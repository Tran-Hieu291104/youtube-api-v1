import { useState } from "react";

import { fetchPlaylists, insertPlaylist } from "../../api";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import PlaylistForm from "../../components/playlists/PlaylistForm";
import Playlist from "../../components/playlists/Playlist";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [channelId, setChannelId] = useState("UC8YW6FO4bJzh8IKJl3PtZqw");
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);
  const [showAddForm, setShowAddForm] = useState(false);
  const userEmail = localStorage.getItem("userEmail") || "";
  const canManage =
    userEmail === "tranminhhieu291104@gmail.com" &&
    channelId === "UC8yajWjBFgHQk-dkmSdc5lQ";

  const fetchPlaylistsData = async (token?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPlaylists(channelId, token);
      setPlaylists(data.items || []);
      setPageToken(data.nextPageToken);
    } catch (err: any) {
      setError(err.message || "Failed to fetch playlists");
      console.error("Fetch playlists error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlaylist = async (title: string, description: string) => {
    await insertPlaylist(title, description);
    setShowAddForm(false);
    fetchPlaylistsData();
  };

  const handleChannelIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChannelId(e.target.value);
    setPageToken(undefined);
    setPlaylists([]);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <>
      <PageMeta
        title="YouTube Playlists"
        description="Manage and explore YouTube playlists"
      />
      <PageBreadcrumb pageTitle="Playlists" />
      <div className="space-y-6">
        <ComponentCard title="Select Channel">
          <div className="space-y-4">
            <div>
              <Label>Channel ID</Label>
              <input
                type="text"
                value={channelId}
                onChange={handleChannelIdChange}
                placeholder="Enter YouTube Channel ID"
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
            <Button
              type="button"
              onClick={() => fetchPlaylistsData()}
              className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Load Playlists
            </Button>
          </div>
        </ComponentCard>

        {canManage && (
          <ComponentCard title="Create New Playlist">
            <Button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 text-white hover:bg-blue-700 mb-4"
            >
              {showAddForm ? "Cancel Add Playlist" : "Add Playlist"}
            </Button>
            {showAddForm && <PlaylistForm onSubmit={handleAddPlaylist} />}
          </ComponentCard>
        )}

        <ComponentCard title="Playlist List">
          {playlists.length > 0 ? (
            playlists.map((playlist) => (
              <Playlist
                key={playlist.id}
                playlist={playlist}
                onUpdate={fetchPlaylistsData}
                canManage={canManage}
              />
            ))
          ) : (
            <div className="text-center py-10">No playlists available.</div>
          )}
          {pageToken && (
            <Button
              type="button"
              onClick={() => fetchPlaylistsData(pageToken)}
              className="bg-blue-600 text-white hover:bg-blue-700 mt-4"
            >
              Load More
            </Button>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
