import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/button/Button';

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
  const navigate = useNavigate();

  const handleAnalyzeClick = () => {
    navigate(`/video-analysis/${videoId}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-theme-sm overflow-hidden hover:shadow-theme-md transition-shadow">
      <div className="relative">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button 
            onClick={handleAnalyzeClick}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Nhấn trước khi xem
          </button>
          <select className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700">
            <option value="">Rate</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 truncate">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
          {description}
        </p>
        <div className="mt-3">
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
          >
            Watch on YouTube
          </a>
        </div>
      </div>
    </div>
  );
}
