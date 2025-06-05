import { useEffect, useState } from "react";
import { YouTubeApiResponse } from "../../../youtubeApi";
import { fetchYoutubeVideos } from "../../../api";
import PageMeta from "../../common/PageMeta";
import PageBreadcrumb from "../../common/PageBreadcrumb";
import ComponentCard from "../../common/ComponentCard";
import VideoCard from "../../videoCard/VideoCard";
import Button from "../../ui/button/Button";

export default function Video() {
  const [videos, setVideos] = useState<YouTubeApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    if (!apiKey) {
      setError("API key is missing");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchYoutubeVideos();
        setVideos(data);
        setTotalPages(Math.ceil(data.pageInfo.totalResults / pageSize));
      } catch (err) {
        setError("Failed to fetch videos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pageSize, pageNumber]);

  const handlePrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber((prev) => prev + 1);
    }
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setPageNumber(1); // Reset về trang 1 khi đổi pageSize
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <>
      <PageMeta
        title="YouTube Videos"
        description="Explore videos from the YouTube channel"
      />
      <PageBreadcrumb pageTitle="Videos" />
      <div className="space-y-6">
        <ComponentCard
          title={
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Video List
              </span>
              {/* <onselect
                options={[
                  { value: "5", label: "5 per page" },
                  { value: "10", label: "10 per page" },
                  { value: "20", label: "20 per page" },
                ]}
                placeholder="Select page size"
                onChange={handlePageSizeChange}
                value={pageSize.toString()}
                className="w-32 h-8 dark:bg-dark-900"
              /> */}
            </div>
          }
        >
          {videos && videos.items.length > 0 ? (
            <>
              <div className="mb-4 text-gray-600 dark:text-gray-300">
                Total videos: {videos.pageInfo.totalResults} | Showing{" "}
                {videos.pageInfo.resultsPerPage} per page
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.items.map((video) => (
                  <VideoCard
                    key={video.id}
                    videoId={video.id}
                    title={video.snippet.title}
                    description={video.snippet.description}
                    thumbnailUrl={video.snippet.thumbnails.medium.url}
                  />
                ))}
              </div>
              <div className="flex justify-between items-center mt-6">
                <Button
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={pageNumber === 1}
                  className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </Button>
                <span className="text-gray-600 dark:text-gray-300">
                  Page {pageNumber} of {totalPages}
                </span>
                <Button
                  size="sm"
                  onClick={handleNextPage}
                  disabled={pageNumber === totalPages}
                  className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-10">No videos available.</div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
