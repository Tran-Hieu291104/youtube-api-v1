import { useState } from "react";
import { unsubscribe } from "../../api";

const Unsubscribe = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [unSubscribeStatus, setUnSubscribeStatus] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleUnSubscribe = async () => {
    const idSubs = "HRv5zmJ-NwTfFdRTVUFibbYEwtlEdGvnlG2xbLDG6mA";
    const token = localStorage.getItem("youtubeToken");
    console.log("token: ", token);
    setLoading(true);
    try {
      const result = await unsubscribe(idSubs);
      setUnSubscribeStatus(`UnSubscribed to channel: ${idSubs}`);
      console.log("UnSubscription result:", result);
    } catch (err) {
      setError("Failed to subscribe");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <button
        onClick={handleUnSubscribe}
        style={{
          color: "red",
        }}
      >
        Bỏ theo dõi kênh
      </button>
      {loading && <p>Loading...</p>}
      {error && <p className="text-blue-400">{error}</p>}
      {unSubscribeStatus && (
        <p className="text-green-500">{unSubscribeStatus}</p>
      )}
    </div>
  );
};

export default Unsubscribe;
