import { useState } from 'react';

interface Props {
  onDownload: () => Promise<void>;
}

export default function DownloadDocxButton({ onDownload }: Props) {
  const [downloading, setDownloading] = useState(false);

  const handleClick = async () => {
    setDownloading(true);
    await onDownload();
    setDownloading(false);
  };

  return (
    <button
      className="w-full py-3 px-6 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      onClick={handleClick}
      disabled={downloading}
    >
      {downloading ? '生成中...' : '下載 Word 檔'}
    </button>
  );
}
