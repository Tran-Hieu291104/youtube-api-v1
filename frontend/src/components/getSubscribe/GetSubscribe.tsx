import React, { useState, useEffect } from "react";
import { YouTubeSubscription } from "../../youtubeApi";
import { getSubscribe } from "../../api";

const GetSubscribe: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<YouTubeSubscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const data = await getSubscribe();
        setSubscriptions(data);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Subscriptions</h1>
      {subscriptions.length === 0 ? (
        <p>No subscriptions found.</p>
      ) : (
        <ul>
          {subscriptions.map((sub) => (
            <li key={sub.id}>
              <strong>{sub.snippet.title}</strong>
              <br />
              <strong>ID subscription: {sub.id}</strong>
              <br />
              <span>Channel ID: {sub.snippet.channelId}</span>
              <br />
              <span>
                Subscribed at:{" "}
                {new Date(sub.snippet.publishedAt).toLocaleString()}
              </span>{" "}
              <br />
              <img
                src={sub.snippet.thumbnails.default.url}
                alt={`${sub.snippet.title} thumbnail`}
                width={sub.snippet.thumbnails.default.width}
                height={sub.snippet.thumbnails.default.height}
              />{" "}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GetSubscribe;
