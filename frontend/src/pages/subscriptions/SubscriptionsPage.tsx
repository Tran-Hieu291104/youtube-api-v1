import SubscriptionItem from "./SubscriptionItem";
import {
  fetchSubscriptions,
  insertSubscription,
  deleteSubscription,
} from "../../api";
import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);
  const [newChannelId, setNewChannelId] = useState("");

  const fetchSubscriptionsData = async (token?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSubscriptions(token);
      setSubscriptions(data.items || []);
      setPageToken(data.nextPageToken);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to fetch subscriptions");
        console.error("Fetch subscriptions error:", err);
      } else {
        setError("Failed to fetch subscriptions");
        console.error("Fetch subscriptions error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!newChannelId.trim()) {
      setError("Please enter a channel ID.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await insertSubscription(newChannelId);
      setNewChannelId("");
      await fetchSubscriptionsData();
    } catch (err: any) {
      setError(err.message || "Failed to subscribe to channel");
      console.error("Subscribe error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (subscriptionId: string) => {
    if (!confirm("Are you sure you want to unsubscribe from this channel?"))
      return;
    setLoading(true);
    setError(null);
    try {
      await deleteSubscription(subscriptionId);
      await fetchSubscriptionsData();
    } catch (err: any) {
      setError(err.message || "Failed to unsubscribe from channel");
      console.error("Unsubscribe error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionsData();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <>
      <PageMeta
        title="Manage YouTube Subscriptions"
        description="View and manage your YouTube subscriptions"
      />
      <PageBreadcrumb pageTitle="Subscriptions" />
      <div className="space-y-6">
        <ComponentCard title="Subscribe to a Channel">
          <div className="space-y-4">
            <div>
              <Label>Channel ID</Label>
              <input
                type="text"
                value={newChannelId}
                onChange={(e) => setNewChannelId(e.target.value)}
                placeholder="Enter YouTube Channel ID"
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
            <Button
              type="button"
              onClick={handleSubscribe}
              className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Subscribe
            </Button>
          </div>
        </ComponentCard>

        <ComponentCard title="Your Subscriptions">
          {subscriptions.length > 0 ? (
            <>
              {subscriptions.map((subscription) => (
                <SubscriptionItem
                  key={subscription.id}
                  subscription={subscription}
                  onUnsubscribe={handleUnsubscribe}
                />
              ))}
              {pageToken && (
                <Button
                  type="button"
                  onClick={() => fetchSubscriptionsData(pageToken)}
                  className="bg-blue-600 text-white hover:bg-blue-700 mt-4"
                >
                  Load More
                </Button>
              )}
            </>
          ) : (
            <div className="text-center py-10">No subscriptions found.</div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
