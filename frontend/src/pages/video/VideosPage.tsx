import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import ComponentCard from "../../components/common/ComponentCard";
import VideoCard from "../../components/videoCard/VideoCard";
import Button from "../../components/ui/button/Button";
import { YouTubeApiResponse } from "../../youtubeApi";
import {
  deleteVideo,
  fetchYoutubeVideos,
  rateVideo,
  reportVideoAbuse,
  updateVideo,
  uploadVideo,
} from "../../api";
import Label from "../../components/form/Label";
import CommentList from "../../components/comments/CommentList";

export default function VideosPage() {
  const [videos, setVideos] = useState<YouTubeApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [hasChannel, setHasChannel] = useState(false);
  const [channelId, setChannelId] = useState("UC8YW6FO4bJzh8IKJl3PtZqw");
  const [currentPageToken, setCurrentPageToken] = useState<string | undefined>(
    undefined
  );
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
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

  const fetchVideos = async (pageToken?: string) => {
    setLoading(true);
    setError(null);
    try {
      const userEmail = localStorage.getItem("userEmail") || "";
      const canManage =
        userEmail === "tranminhhieu291104@gmail.com" &&
        channelId === "UC8yajWjBFgHQk-dkmSdc5lQ";
      setHasChannel(canManage);
      console.log(
        "hasChannel:",
        canManage,
        "channelId:",
        channelId,
        "email:",
        userEmail
      );

      const data = await fetchYoutubeVideos(channelId, pageToken);
      console.log("Fetched videos:", data);
      setVideos(data);
      setTotalPages(Math.ceil(data.pageInfo.totalResults / pageSize));
      setCurrentPageToken(pageToken);
    } catch (err: any) {
      setError(err.message || "Failed to fetch videos");
      console.error("Fetch videos error:", err.message, err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleChannelIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChannelId(e.target.value);
    setPageNumber(1);
    setCurrentPageToken(undefined);
    setVideos(null);
    setSelectedVideoId(null);
  };

  const handlePrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
      fetchVideos(videos?.prevPageToken);
    }
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber((prev) => prev + 1);
      fetchVideos(videos?.nextPageToken);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPageNumber(1);
    setCurrentPageToken(undefined);
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

  const handleDelete = async (videoId: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    setLoading(true);
    try {
      await deleteVideo(videoId);
      const data = await fetchYoutubeVideos(channelId);
      setVideos(data);
      setError(null);
      if (selectedVideoId === videoId) setSelectedVideoId(null);
    } catch (err) {
      setError("Failed to delete video");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (
    videoId: string,
    rating: "like" | "dislike" | "none"
  ) => {
    setLoading(true);
    try {
      await rateVideo(videoId, rating);
      setError(null);
    } catch (err) {
      setError("Failed to rate video");
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
        {/* Ô nhập Channel ID */}
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
              onClick={() => fetchVideos()}
              className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Load Videos
            </Button>
          </div>
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

        {/* Danh sách video */}
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
                Total videos: {videos.pageInfo.totalResults} | Showing{" "}
                {pageSize} per page
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.items.map((video) => (
                  <div key={video.id.videoId || video.id} className="relative">
                    <div
                      onClick={() =>
                        setSelectedVideoId(video.id.videoId || video.id)
                      }
                    >
                      <VideoCard
                        videoId={video.id.videoId || video.id}
                        title={video.snippet.title}
                        description={video.snippet.description}
                        thumbnailUrl={video.snippet.thumbnails.medium.url}
                      />
                    </div>
                    <div className="absolute top-2 right-2 flex gap-2 z-10">
                      {hasChannel && (
                        <>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() =>
                              setEditForm({
                                videoId: video.id.videoId || video.id,
                                title: video.snippet.title,
                                description: video.snippet.description,
                                tags: video.snippet.tags?.join(", ") || "",
                              })
                            }
                            className="bg-yellow-500 text-white hover:bg-yellow-600"
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() =>
                              handleDelete(video.id.videoId || video.id)
                            }
                            className="bg-red-500 text-white hover:bg-red-600"
                          >
                            Delete
                          </Button>
                        </>
                      )}
                      <select
                        onChange={(e) =>
                          handleRate(
                            video.id.videoId || video.id,
                            e.target.value as "like" | "dislike" | "none"
                          )
                        }
                        className="h-8 w-24 rounded-lg border border-gray-300 bg-white/90 dark:bg-gray-800/90 px-2 text-sm text-gray-700 dark:text-white/90 z-10 shadow-theme-xs"
                      >
                        <option value="" disabled selected>
                          Rate
                        </option>
                        <option value="like">Like</option>
                        <option value="dislike">Dislike</option>
                        <option value="none">Remove Rating</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-6">
                <Button
                  type="button"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={pageNumber === 1}
                  className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
                >
                  Previous
                </Button>
                <span className="text-gray-600 dark:text-gray-300">
                  Page {pageNumber} of {totalPages}
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={pageNumber === totalPages}
                  className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
              {selectedVideoId && (
                <ComponentCard title="Video Comments">
                  <CommentList videoId={selectedVideoId} />
                </ComponentCard>
              )}
            </>
          ) : (
            <div className="text-center py-10">
              No videos available. Click "Load Videos" to fetch.
            </div>
          )}
        </ComponentCard>

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
      </div>
    </>
  );
}
