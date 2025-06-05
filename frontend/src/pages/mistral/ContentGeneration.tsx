import React, { useState } from 'react';
import axios from 'axios';
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";

const MISTRAL_ENDPOINT = "https://api.mistral.ai/v1/chat/completions";
const MISTRAL_API_KEY = "3w1dhxZj0tjACm6ZbIjhB7LjOaOaGn4l";

const ContentGeneration = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);

  const generateContent = async () => {
    if (!prompt.trim()) return;

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
              content: prompt
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

      setGeneratedContent(response.data.choices[0].message.content);
    } catch (error: any) {
      console.error('Error calling Mistral AI:', error);
      setGeneratedContent('Xin lỗi, đã xảy ra lỗi khi tạo nội dung. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Content Generation" description="Tạo nội dung với Mistral AI" />
      <PageBreadcrumb pageTitle="Content Generation" />

      <div className="space-y-6">
        <ComponentCard title="Tạo nội dung với Mistral AI">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Yêu cầu của bạn</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Nhập yêu cầu tạo nội dung của bạn..."
                className="w-full h-32 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <Button
              type="button"
              onClick={generateContent}
              disabled={loading || !prompt.trim()}
              className="w-full py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Đang tạo nội dung...' : 'Tạo nội dung'}
            </Button>

            {generatedContent && (
              <div>
                <label className="block text-sm font-medium mb-2">Nội dung đã tạo</label>
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="whitespace-pre-wrap">{generatedContent}</p>
                </div>
              </div>
            )}
          </div>
        </ComponentCard>
      </div>
    </>
  );
};

export default ContentGeneration; 