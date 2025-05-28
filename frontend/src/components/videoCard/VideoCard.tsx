interface VideoCardProps {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
}

export default function VideoCard({
  videoId,
  title,
  description,
  thumbnailUrl,
}: VideoCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-theme-sm overflow-hidden hover:shadow-theme-md transition-shadow">
      <img
        src={thumbnailUrl}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 truncate">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
          {description}
        </p>
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
        >
          Watch on YouTube
        </a>
      </div>
    </div>
  );
}
