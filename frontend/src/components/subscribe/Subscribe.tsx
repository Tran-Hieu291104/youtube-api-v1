import { useState } from "react";
import { subscribeToChannel } from "../../api";

const Subscribe = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [subscribeStatus, setSubscribeStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    const channelId = "UCvjXo25nY-WMCTEXZZb0xsw";
    const token = localStorage.getItem("youtubeToken");
    console.log("token: ", token);
    setLoading(true);
    try {
      const result = await subscribeToChannel(channelId);
      setSubscribeStatus(`Subscribed to channel: ${channelId}`);
      console.log("Subscription result:", result);
    } catch (err) {
      setError("Failed to subscribe");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <button onClick={handleSubscribe} className="text-red-600">
        Theo dõi kênh
      </button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {subscribeStatus && <p style={{ color: "green" }}>{subscribeStatus}</p>}
    </div>
  );
};

export default Subscribe;
