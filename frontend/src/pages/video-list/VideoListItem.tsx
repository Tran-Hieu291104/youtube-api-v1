interface VideoListItemProps {
  video: {
    title: string;
    videoId: string;
    publishedAt: string;
    views: number;
    thumbnailUrl: string;
  };
}

export default function VideoListItem({ video }: VideoListItemProps) {
  return (
    <div className="border-b border-gray-300 py-4 flex items-center gap-4">
      <img
        src={video.thumbnailUrl}
        alt={video.title}
        className="w-24 h-14 object-cover rounded-lg"
      />
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {video.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Video ID: {video.videoId}
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Published: {video.publishedAt}
        </p>
        <p className="text-gray-600 dark:text-gray-300">Views: {video.views}</p>
      </div>
    </div>
  );
}
