import { useEffect, useState } from "react";
import { YouTubeApiResponse } from "../../youtubeApi";
import { fetchYoutubeVideos } from "../../api";

const Video = () => {
  const [videos, setVideos] = useState<YouTubeApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    if (apiKey) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await fetchYoutubeVideos();
          setVideos(data);
        } catch (err) {
          setError("Failed to fetch videos");
          console.log(err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setError("API key is missing");
    }
  }, []);

  return (
    <div
      style={{
        marginTop: "4rem",
      }}
    >
      <div>
        {videos ? (
          <ul>
            <label>
              Tổng số video của kênh: ${videos.pageInfo.totalResults}
            </label>
            <br />
            <label>
              Tổng số video của 1 trang: ${videos.pageInfo.resultsPerPage}
            </label>
            {videos.items.map((video) => (
              <li key={video.id}>
                <h3>{video.snippet.title}</h3>
                <img
                  src={video.snippet.thumbnails.default.url}
                  alt={video.snippet.title}
                  width={100}
                />
                {/* <h3>Số lượt like: ${video.statistics.likeCount}</h3> */}
                {/* <h3>Số lượt dislike: ${video.statistics.dislikeCount}</h3> */}
                {/* <h3>Số lượt xem: ${video.statistics.viewCount}</h3> */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No videos found</p>
        )}
      </div>
    </div>
  );
};

export default Video;
