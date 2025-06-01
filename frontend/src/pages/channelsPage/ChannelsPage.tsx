import { useState, useEffect } from "react";

import {
  fetchChannelDetails,
  updateChannel,
  insertChannelBanner,
  fetchChannelDetailsById,
} from "../../api";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import ComponentCard from "../../components/common/ComponentCard";
import ChannelForm from "../../components/channels/ChannelForm";
import ChannelBannerForm from "../../components/channels/ChannelBannerForm";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";

export default function ChannelsPage() {
  const [channel, setChannel] = useState<any>(null);
  const [otherChannel, setOtherChannel] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [otherChannelId, setOtherChannelId] = useState("");
  const userEmail = localStorage.getItem("userEmail") || "";
  const channelId = "UC8yajWjBFgHQk-dkmSdc5lQ";
  const canManage = userEmail === "tranminhhieu291104@gmail.com";

  const fetchChannel = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchChannelDetails();
      if (data.items && data.items[0].id !== channelId) {
        throw new Error(
          "You can only manage your own channel (UC8yajWjBFgHQk-dkmSdc5lQ)."
        );
      }
      setChannel(data.items[0]);
    } catch (err: any) {
      setError(err.message || "Failed to fetch channel details");
      console.error("Fetch channel error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOtherChannel = async () => {
    if (!otherChannelId) {
      setError("Please enter a channel ID.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchChannelDetailsById(otherChannelId);
      if (!data.items || data.items.length === 0) {
        throw new Error("Channel not found.");
      }
      setOtherChannel(data.items[0]);
    } catch (err: any) {
      setError(err.message || "Failed to fetch other channel details");
      console.error("Fetch other channel error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateChannel = async (
    title: string,
    description: string,
    keywords: string
  ) => {
    if (!canManage) return;
    try {
      const channelData: {
        id: string;
        snippet?: { title: string };
        brandingSettings?: {
          channel: { description?: string; keywords: string };
        };
      } = {
        id: channelId,
      };
      if (title && title !== channel.snippet.title) {
        channelData.snippet = { title };
      }
      const currentDescription =
        channel.brandingSettings.channel.description || "";
      if (
        (description && description !== currentDescription) ||
        (keywords &&
          keywords !== (channel.brandingSettings.channel.keywords || ""))
      ) {
        channelData.brandingSettings = {
          channel: {
            description: description || currentDescription,
            keywords:
              keywords || channel.brandingSettings.channel.keywords || "",
          },
        };
      }
      if (!channelData.snippet && !channelData.brandingSettings) {
        console.log("No changes to update.");
        return;
      }
      console.log("Sending channel update with data:", channelData);
      await updateChannel(channelData);
      await fetchChannel();
    } catch (err) {
      console.error("Update channel error:", err);
    }
  };

  const handleInsertBanner = async (file: File) => {
    if (!canManage) return;
    try {
      await insertChannelBanner(file);
      await fetchChannel();
    } catch (err) {
      console.error("Insert banner error:", err);
    }
  };

  useEffect(() => {
    fetchChannel();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <>
      <PageMeta
        title="Manage YouTube Channel"
        description="Manage your YouTube channel details and banner"
      />
      <PageBreadcrumb pageTitle="Manage Channel" />
      <div className="space-y-6">
        <ComponentCard title="Your Channel Details">
          {channel ? (
            <>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  {channel.snippet.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {channel.snippet.description}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Keywords: {channel.brandingSettings.channel.keywords || "N/A"}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Description:{" "}
                  {channel.brandingSettings.channel.description || "N/A"}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Subscribers: {channel.statistics.subscriberCount || "N/A"}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Total Views: {channel.statistics.viewCount || "N/A"}
                </p>
              </div>
              {canManage && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg"
                >
                  {isEditing ? "Cancel Edit" : "Edit Channel"}
                </button>
              )}
              {isEditing && canManage && (
                <div className="mt-4">
                  <ChannelForm
                    onSubmit={handleUpdateChannel}
                    initialTitle={channel.snippet.title}
                    initialDescription={
                      channel.brandingSettings.channel.description || ""
                    }
                    initialKeywords={
                      channel.brandingSettings.channel.keywords || ""
                    }
                    onCancel={() => setIsEditing(false)}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10">No channel data available.</div>
          )}
        </ComponentCard>

        {canManage && (
          <ComponentCard title="Upload Channel Banner">
            <ChannelBannerForm onSubmit={handleInsertBanner} />
          </ComponentCard>
        )}

        <ComponentCard title="View Other Channel">
          <div className="space-y-4">
            <div>
              <Label>Channel ID</Label>
              <input
                type="text"
                value={otherChannelId}
                onChange={(e) => {
                  setOtherChannelId(e.target.value);
                  setError(null);
                }}
                placeholder="Enter YouTube Channel ID"
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
            <Button
              type="button"
              onClick={fetchOtherChannel}
              className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Load Channel
            </Button>
          </div>
          {otherChannel && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                {otherChannel.snippet.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {otherChannel.snippet.description}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Keywords:{" "}
                {otherChannel.brandingSettings.channel.keywords || "N/A"}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Description:{" "}
                {otherChannel.brandingSettings.channel.description || "N/A"}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Subscribers: {otherChannel.statistics.subscriberCount || "N/A"}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Total Views: {otherChannel.statistics.viewCount || "N/A"}
              </p>
            </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
