import { useState } from "react";

interface Broadcast {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: { url: string };
    };
  };
}

const LiveBroadcastsPage = () => {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [channelUrl, setChannelUrl] = useState("");

  const handleFetchChannelData = async () => {
    if (!channelUrl) {
      setError("Please enter a valid Channel ID");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelUrl}&eventType=live&type=video&key=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch live broadcasts");
      }
      const data = await response.json();
      setBroadcasts(data.items);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>Select Channel</h1>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <label
          htmlFor="channelId"
          style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}
        >
          Channel ID
        </label>
        <input
          type="text"
          id="channelId"
          value={channelUrl}
          onChange={(e) => setChannelUrl(e.target.value)}
          placeholder="Enter YouTube Channel ID"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            textAlign: "center",
          }}
        />
        <button
          onClick={handleFetchChannelData}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            borderRadius: "5px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Load Channel Data
        </button>
      </div>
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {error && (
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      )}
      {broadcasts.length === 0 && !loading && (
        <p style={{ textAlign: "center" }}>No live broadcasts found.</p>
      )}
      <ul style={{ listStyleType: "none", padding: "0" }}>
        {broadcasts.map((broadcast) => (
          <li
            key={broadcast.id.videoId}
            style={{
              marginBottom: "20px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <img
              src={broadcast.snippet.thumbnails.medium.url}
              alt={broadcast.snippet.title}
              style={{ width: "100%", height: "auto" }}
            />
            <div style={{ padding: "15px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>
                {broadcast.snippet.title}
              </h2>
              <p style={{ fontSize: "14px", color: "#555", marginBottom: "15px" }}>
                {broadcast.snippet.description}
              </p>
              <a
                href={`https://www.youtube.com/watch?v=${broadcast.id.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  padding: "10px 15px",
                  backgroundColor: "#007BFF",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "5px",
                  fontWeight: "bold",
                }}
              >
                Watch on YouTube
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LiveBroadcastsPage;
