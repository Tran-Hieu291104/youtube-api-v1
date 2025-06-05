import Button from "../../components/ui/button/Button";

interface SubscriptionItemProps {
  subscription: {
    id: string;
    snippet: {
      title: string;
      description: string;
      resourceId: { channelId: string };
      thumbnails: { default: { url: string } };
    };
  };
  onUnsubscribe: (subscriptionId: string) => Promise<void>;
}

export default function SubscriptionItem({
  subscription,
  onUnsubscribe,
}: SubscriptionItemProps) {
  return (
    <div className="border-b border-gray-300 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img
          src={subscription.snippet.thumbnails.default.url}
          alt={subscription.snippet.title}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {subscription.snippet.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {subscription.snippet.description}
          </p>
        </div>
      </div>
      <Button
        type="button"
        onClick={() => onUnsubscribe(subscription.id)}
        className="bg-red-500 text-white hover:bg-red-600"
      >
        Unsubscribe
      </Button>
    </div>
  );
}
