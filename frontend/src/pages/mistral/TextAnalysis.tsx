import React, { useState } from 'react';
import axios from 'axios';
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";

const MISTRAL_ENDPOINT = "https://api.mistral.ai/v1/chat/completions";
const MISTRAL_API_KEY = "3w1dhxZj0tjACm6ZbIjhB7LjOaOaGn4l";

const TextAnalysis = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<{
    sentiment?: string;
    keywords?: string[];
    summary?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const analyzeText = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        MISTRAL_ENDPOINT,
        {
          model: "mistral-small-latest",
          temperature: 1.5,
          top_p: 1,
          max_tokens: 1000,
          stream: false,
          messages: [
            {
              role: 'user',
              content: `Phân tích văn bản sau và cung cấp:
              1. Tình cảm/cảm xúc chính (tích cực, tiêu cực, trung lập)
              2. Từ khóa chính (liệt kê 5 từ khóa)
              3. Tóm tắt ngắn gọn (trong 2-3 câu)
              
              Văn bản: "${text}"`
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MISTRAL_API_KEY}`,
          },
        }
      );

      const analysisText = response.data.choices[0].message.content;
      
      // Parse the response into structured data
      const sentimentMatch = analysisText.match(/1\.(.*?)2\./s);
      const keywordsMatch = analysisText.match(/2\.(.*?)3\./s);
      const summaryMatch = analysisText.match(/3\.(.*?)$/s);

      setAnalysis({
        sentiment: sentimentMatch ? sentimentMatch[1].trim() : undefined,
        keywords: keywordsMatch 
          ? keywordsMatch[1]
              .split(',')
              .map(k => k.trim())
              .filter(k => k.length > 0)
          : undefined,
        summary: summaryMatch ? summaryMatch[1].trim() : undefined,
      });
    } catch (error: any) {
      console.error('Error calling Mistral AI:', error);
      setAnalysis({
        sentiment: 'Lỗi phân tích cảm xúc',
        keywords: ['Lỗi phân tích từ khóa'],
        summary: 'Xin lỗi, đã xảy ra lỗi khi phân tích văn bản. Vui lòng thử lại sau.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Text Analysis" description="Phân tích văn bản với Mistral AI" />
      <PageBreadcrumb pageTitle="Text Analysis" />

      <div className="space-y-6">
        <ComponentCard title="Phân tích văn bản với Mistral AI">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Văn bản cần phân tích</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Nhập văn bản cần phân tích..."
                className="w-full h-32 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <Button
              type="button"
              onClick={analyzeText}
              disabled={loading || !text.trim()}
              className="w-full py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Đang phân tích...' : 'Phân tích'}
            </Button>

            {Object.keys(analysis).length > 0 && (
              <div className="space-y-4">
                {analysis.sentiment && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Cảm xúc/Tình cảm</label>
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <p>{analysis.sentiment}</p>
                    </div>
                  </div>
                )}

                {analysis.keywords && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Từ khóa chính</label>
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <div className="flex flex-wrap gap-2">
                        {analysis.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {analysis.summary && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Tóm tắt</label>
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <p>{analysis.summary}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </ComponentCard>
      </div>
    </>
  );
};

export default TextAnalysis; 