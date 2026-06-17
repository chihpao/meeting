import { useState } from 'react';
import AudioUpload from './AudioUpload';

interface Props {
  onSubmit: (text: string) => void;
  loading: boolean;
}

export default function TranscriptInput({ onSubmit, loading }: Props) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim());
    }
  };

  return (
    <div className="space-y-4">
      <AudioUpload onTranscribed={setText} disabled={loading} />
      <textarea
        className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 bg-white"
        placeholder="請貼上會議逐字稿，或點上方上傳錄音檔..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
      />
      <button
        className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        onClick={handleSubmit}
        disabled={loading || !text.trim()}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            分析中...
          </span>
        ) : (
          '產生會議記錄'
        )}
      </button>
    </div>
  );
}
