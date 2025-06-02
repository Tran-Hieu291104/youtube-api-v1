import { useState, useEffect } from "react";

import VideoListItem from "./VideoListItem";
import { fetchSheetVideos } from "../../api";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";

export default function VideoListPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideosFromSheet = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSheetVideos();
      setVideos(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to fetch videos from Google Sheet");
        console.error("Fetch videos error:", err);
      } else {
        setError("Failed to fetch videos from Google Sheet");
        console.error("Fetch videos error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideosFromSheet();
    // Tự động làm mới mỗi 5 phút (300,000 ms)
    const interval = setInterval(fetchVideosFromSheet, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <>
      <PageMeta
        title="Recent YouTube Videos"
        description="View recent videos from Google Sheet (auto-updated hourly)"
      />
      <PageBreadcrumb pageTitle="Recent Videos" />
      <div className="space-y-6">
        <ComponentCard title="Recent Videos from Google Sheet">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Videos are automatically updated hourly from channel
            UC8yajWjBFgHQk-dkmSdc5lQ.
          </p>
          <Button
            type="button"
            onClick={fetchVideosFromSheet}
            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 mb-4"
          >
            Refresh Now
          </Button>
          {videos.length > 0 ? (
            videos.map((video, index) => (
              <VideoListItem key={index} video={video} />
            ))
          ) : (
            <div className="text-center py-10">No videos found.</div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
