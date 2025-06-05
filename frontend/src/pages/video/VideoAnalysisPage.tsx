import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";

const GEMINI_API_KEY = 'AIzaSyCnle7jJc2N3px3_lI3GLq0Q5_UbNF7k0Q';

interface YouTubeResponse {
  items: Array<{
    snippet: {
      title: string;
      description: string;
    };
    statistics: {
      viewCount: string;
      likeCount: string;
      commentCount: string;
    };
  }>;
}

export default function VideoAnalysisPage() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState<any>(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  const fetchVideoData = async () => {
    try {
      const response = await axios.get<YouTubeResponse>(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${GEMINI_API_KEY}`
      );
      
      if (!response.data.items || response.data.items.length === 0) {
        setError('Không tìm thấy video này. Vui lòng kiểm tra lại ID video.');
        return;
      }

      setVideoData(response.data.items[0]);
      analyzeVideo(response.data.items[0]);
    } catch (err: any) {
      console.error('Error fetching video data:', err);
      if (err.response?.status === 403) {
        setError('Lỗi xác thực API key. Vui lòng kiểm tra lại API key YouTube.');
      } else if (err.response?.status === 404) {
        setError('Không tìm thấy video này. Vui lòng kiểm tra lại ID video.');
      } else {
        setError('Lỗi khi tải thông tin video: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const analyzeVideo = async (video: any) => {
    if (!video?.snippet || !video?.statistics) {
      setError('Không thể phân tích video do thiếu thông tin cần thiết.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const prompt = `Hãy phân tích chi tiết về video YouTube này (trả lời bằng tiếng Việt):

Thông tin video:
Tiêu đề: ${video.snippet.title}
Mô tả: ${video.snippet.description}
Lượt xem: ${video.statistics.viewCount}
Lượt thích: ${video.statistics.likeCount}
Bình luận: ${video.statistics.commentCount}

Vui lòng phân tích theo các mục sau:

1. Tóm tắt nội dung:
- Nội dung chính của video
- Các điểm nhấn quan trọng

2. Các chủ đề chính:
- Highlight và kỹ năng được thể hiện
- Các điểm đặc biệt về gameplay/kỹ thuật
- Phân tích meta game nếu có

3. Phân tích mức độ tương tác:
- Số lượt xem và tương tác
- Tỷ lệ like/dislike
- Số lượng bình luận và chất lượng tương tác
- Đề xuất cải thiện tương tác

4. Đề xuất cải thiện:
- Tiêu đề và thumbnail
- Nội dung và cách trình bày
- SEO và tags
- Chiến lược phát triển

5. Phân tích đối tượng mục tiêu:
- Đối tượng người xem chính
- Nhóm người xem tiềm năng
- Cách tiếp cận đối tượng mục tiêu`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }]
        }
      );

      const text = (response.data as any).candidates[0].content.parts[0].text;
      setAnalysis(text);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi phân tích video');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="p-10">
        <ComponentCard title="Lỗi">
          <div className="text-center py-6">
            <div className="text-red-600 mb-4">{error}</div>
            <Button
              type="button"
              onClick={() => window.history.back()}
              className="bg-gray-500 text-white hover:bg-gray-600"
            >
              Quay lại danh sách video
            </Button>
          </div>
        </ComponentCard>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Phân tích Video"
        description="AI-powered video analysis using Gemini"
      />
      <PageBreadcrumb pageTitle="Phân tích Video" />

      <div className="space-y-6">
        <ComponentCard title="Video Information">
          <div className="space-y-4">
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              />
            </div>
            
            {videoData && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">{videoData.snippet.title}</h2>
                <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>👁️ {parseInt(videoData.statistics.viewCount).toLocaleString()} lượt xem</span>
                  <span>👍 {parseInt(videoData.statistics.likeCount).toLocaleString()} lượt thích</span>
                  <span>💬 {parseInt(videoData.statistics.commentCount).toLocaleString()} bình luận</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {videoData.snippet.description}
                </p>
              </div>
            )}
          </div>
        </ComponentCard>

        <ComponentCard title="AI Analysis">
          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Tuyệt vời! Dưới đây là phân tích chi tiết về video YouTube mà bạn cung cấp thông tin:
            </div>

            {loading && (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4">Đang phân tích nội dung video...</p>
              </div>
            )}

            {analysis && !loading && (
              <div className="prose dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap space-y-4">
                  {analysis.split('**').map((section, index) => (
                    <div key={index} className="py-2">
                      {section.trim() && (
                        <div className={section.includes(':') ? 'font-semibold' : ''}>
                          {section}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ComponentCard>

        <ComponentCard title="Actions">
          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => window.history.back()}
              className="bg-gray-500 text-white hover:bg-gray-600"
            >
              Quay lại danh sách video
            </Button>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
