import { useState } from 'react';

interface Props {
  text: string;
}

export default function CopyButton({ text }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      className="mt-6 w-full py-3 px-6 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors"
      onClick={handleCopy}
    >
      {copied ? '已複製！' : '複製完整會議記錄'}
    </button>
  );
}
