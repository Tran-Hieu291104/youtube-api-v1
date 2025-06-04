import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import ComponentCard from "../../components/common/ComponentCard";
import VideoCard from "../../components/videoCard/VideoCard";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import {
  fetchYoutubeVideos,
  fetchChannelActivities,
  searchYouTube,
  uploadVideo,
  updateVideo,
  reportVideoAbuse,
} from "../../api";
import { YouTubeApiResponse, YouTubeSearchResult } from "../../youtubeApi";

// Explicitly define the type for video.id
interface VideoItem {
  id: { videoId?: string } | string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: { url: string };
    };
  };
}

export default function VideosPage() {
  const [videos, setVideos] = useState<YouTubeApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(6);
  const [hasChannel, setHasChannel] = useState(false);
  const [channelId, setChannelId] = useState("UC8YW6FO4bJzh8IKJl3PtZqw");
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    tags: "",
    file: null as File | null,
  });
  const [editForm, setEditForm] = useState({
    videoId: "",
    title: "",
    description: "",
    tags: "",
  });
  const [reportForm, setReportForm] = useState({ videoId: "", reason: "spam" });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<YouTubeSearchResult[]>([]);
  const [channelActivities, setChannelActivities] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const [showActivities, setShowActivities] = useState(false);

  const fetchVideos = async (pageToken?: string) => {
    setLoading(true);
    setError(null);
    try {
      const userEmail = localStorage.getItem("userEmail") || "";
      const canManage =
        userEmail === "tranminhhieu291104@gmail.com" &&
        channelId === "UC8yajWjBFgHQk-dkmSdc5lQ";
      setHasChannel(canManage);

      const data = await fetchYoutubeVideos(channelId, pageToken);
      setVideos(data ?? null); // Ensure null fallback for undefined data
    } catch (err: any) {
      setError(err.message || "Failed to fetch videos");
      console.error("Fetch videos error:", err.message, err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannelActivitiesData = async () => {
    setLoading(true);
    setError(null);
    try {
      const activities = await fetchChannelActivities(channelId);
      setChannelActivities(activities);
    } catch (err) {
      setError("Failed to fetch channel activities");
      console.error("Fetch channel activities error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (channelId) {
      fetchVideos();
      fetchChannelActivitiesData();
    }
  }, [channelId]);

  useEffect(() => {
    if (categoryId) {
      const fetchVideosByCategory = async () => {
        setLoading(true);
        setError(null);
        try {
          const results = await searchYouTube("", "video", undefined, undefined, categoryId);
          setSearchResults(results);
          setVideos(null); // Clear the video list to show category results
        } catch (err) {
          setError("Failed to fetch videos by category");
          console.error("Category search error:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchVideosByCategory();
    }
  }, [categoryId]);

  const handleChannelIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChannelId(e.target.value);
    setVideos(null); // Restored auto-load functionality
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    fetchVideos();
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.file) {
      setError("Please select a video file");
      return;
    }
    setLoading(true);
    try {
      console.log("Uploading video with:", {
        title: uploadForm.title,
        description: uploadForm.description,
        tags: uploadForm.tags,
        file: uploadForm.file.name,
      });
      await uploadVideo(
        uploadForm.title,
        uploadForm.description,
        uploadForm.tags.split(",").map((tag) => tag.trim()),
        uploadForm.file
      );
      setUploadForm({ title: "", description: "", tags: "", file: null });
      const data = await fetchYoutubeVideos(channelId);
      setVideos(data);
      setError(null);
    } catch (err) {
      setError("Failed to upload video");
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateVideo(
        editForm.videoId,
        editForm.title,
        editForm.description,
        editForm.tags.split(",").map((tag) => tag.trim())
      );
      setEditForm({ videoId: "", title: "", description: "", tags: "" });
      const data = await fetchYoutubeVideos(channelId);
      setVideos(data);
      setError(null);
    } catch (err) {
      setError("Failed to update video");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await reportVideoAbuse(reportForm.videoId, reportForm.reason);
      setReportForm({ videoId: "", reason: "spam" });
      setError(null);
    } catch (err) {
      setError("Failed to report video");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fixed the search functionality to load video list
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const results = await searchYouTube(searchQuery);
      setSearchResults(results);
      setVideos(null); // Clear the video list to show search results
      setShowActivities(false); // Hide activities when searching
    } catch (err) {
      setError("Failed to search");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadChannelData = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchVideos();
      await fetchChannelActivitiesData();
      setShowActivities(true); // Show activities when loading channel data
    } catch (err) {
      setError("Failed to load channel data");
      console.error("Load channel data error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <>
      <PageMeta
        title="YouTube Videos"
        description="Manage and explore YouTube videos"
      />
      <PageBreadcrumb pageTitle="Videos" />
      <div className="space-y-6">
        {/* Split Section: Select Channel and Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Select Channel */}
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
                onClick={handleLoadChannelData}
                className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Load Channel Data
              </Button>
            </div>
          </ComponentCard>

          {/* Search YouTube */}
          <ComponentCard title="Search YouTube">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <Label>Search Query</Label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter keywords"
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
              >
                Search
              </Button>
            </form>
          </ComponentCard>
        </div>

        {/* Video List */}
        <ComponentCard
          title={
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Video List
              </span>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="h-8 w-32 rounded-lg border border-gray-300 bg-transparent px-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option value="6">6 per page</option>
                <option value="12">12 per page</option>
                <option value="18">18 per page</option>
              </select>
            </div>
          }
        >
          {videos && videos.items.length > 0 ? (
            <>
              <div className="mb-4 text-gray-600 dark:text-gray-300">
                Total videos: {videos.pageInfo.totalResults} | Showing {pageSize} per page
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.items.map((video: VideoItem) => (
                  <VideoCard
                    key={typeof video.id === "object" ? video.id.videoId || "unknown" : video.id}
                    videoId={typeof video.id === "object" ? video.id.videoId || "unknown" : video.id}
                    title={video.snippet.title}
                    description={video.snippet.description}
                    thumbnailUrl={video.snippet.thumbnails.medium.url}
                  />
                ))}
              </div>
            </>
          ) : searchResults.length > 0 ? (
            <>
              <div className="mb-4 text-gray-600 dark:text-gray-300">
                Search results: {searchResults.length}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((result) => (
                  <VideoCard
                    key={result.id.videoId || result.id.channelId || result.id.playlistId || "unknown"}
                    videoId={result.id.videoId || result.id.channelId || result.id.playlistId || "unknown"}
                    title={result.snippet.title}
                    description={result.snippet.description}
                    thumbnailUrl={result.snippet.thumbnails.medium.url}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              No videos available. Click "Load Videos" or perform a search.
            </div>
          )}
        </ComponentCard>

        {/* Form tải video mới */}
        {hasChannel && (
          <ComponentCard title="Upload New Video">
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <Label>Title</Label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, title: e.target.value })
                  }
                  placeholder="Enter video title"
                  required
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>
              <div>
                <Label>Description</Label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) =>
                    setUploadForm({
                      ...uploadForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter video description"
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  rows={4}
                />
              </div>
              <div>
                <Label>Tags (comma-separated)</Label>
                <input
                  type="text"
                  value={uploadForm.tags}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, tags: e.target.value })
                  }
                  placeholder="tag1, tag2, tag3"
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>
              <div>
                <Label>Video File</Label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    setUploadForm({
                      ...uploadForm,
                      file: e.target.files?.[0] || null,
                    })
                  }
                  className="w-full text-sm text-gray-500 dark:text-gray-400"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
              >
                Upload Video
              </Button>
            </form>
          </ComponentCard>
        )}

        {/* Form chỉnh sửa video */}
        {hasChannel && editForm.videoId && (
          <ComponentCard title="Edit Video">
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <Label>Title</Label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  placeholder="Enter video title"
                  required
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>
              <div>
                <Label>Description</Label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  placeholder="Enter video description"
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  rows={4}
                />
              </div>
              <div>
                <Label>Tags (comma-separated)</Label>
                <input
                  type="text"
                  value={editForm.tags}
                  onChange={(e) =>
                    setEditForm({ ...editForm, tags: e.target.value })
                  }
                  placeholder="tag1, tag2, tag3"
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  onClick={() =>
                    setEditForm({
                      videoId: "",
                      title: "",
                      description: "",
                      tags: "",
                    })
                  }
                  className="bg-gray-500 text-white hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </ComponentCard>
        )}

        {/* Form báo cáo vi phạm */}
        <ComponentCard title="Report Video Abuse">
          <form onSubmit={handleReportSubmit} className="space-y-4">
            <div>
              <Label>Video ID</Label>
              <input
                type="text"
                value={reportForm.videoId}
                onChange={(e) =>
                  setReportForm({ ...reportForm, videoId: e.target.value })
                }
                placeholder="Enter video ID"
                required
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
            <div>
              <Label>Reason</Label>
              <select
                value={reportForm.reason}
                onChange={(e) =>
                  setReportForm({ ...reportForm, reason: e.target.value })
                }
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option value="spam">Spam or Misleading</option>
                <option value="violence">Violence</option>
                <option value="harmful">Harmful or Dangerous Content</option>
                <option value="abuse">Child Abuse</option>
                <option value="hate">Hate Speech</option>
              </select>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 disabled:opacity-50"
            >
              Report
            </Button>
          </form>
        </ComponentCard>

        {/* Channel Activities */}
        <ComponentCard title="Channel Activities">
          {showActivities && channelActivities.length > 0 ? (
            <div className="space-y-4">
              {channelActivities.map((activity, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="text-lg font-semibold">
                    {activity.snippet.title || "Untitled Activity"}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {activity.snippet.description || "No description available."}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">No activities available.</div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
