import { useState, useRef } from 'react';

interface Props {
  onTextExtracted: (text: string) => void;
  disabled: boolean;
}

export default function ReferenceUpload({ onTextExtracted, disabled }: Props) {
  const [parsing, setParsing] = useState(false);
  const [docInfo, setDocInfo] = useState<{ name: string; chars: number } | null>(null);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setDocInfo(null);
    setParsing(true);

    try {
      let text = '';
      const ext = file.name.split('.').pop()?.toLowerCase();

      if (ext === 'docx') {
        const mammoth = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else if (ext === 'pdf') {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const pages: string[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items
            .map((item) => ('str' in item ? item.str : ''))
            .join(' ');
          pages.push(pageText);
        }
        text = pages.join('\n');
      } else {
        throw new Error('不支援的檔案格式，僅接受 .docx 與 .pdf');
      }

      if (!text.trim()) {
        throw new Error('無法從檔案中提取文字');
      }

      setDocInfo({ name: file.name, chars: text.length });
      console.log('=== REFERENCE TEXT ===', text.slice(0, 200));
      onTextExtracted(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : '解析失敗');
    } finally {
      setParsing(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 flex-wrap">
        <label className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          {docInfo ? '更換文件' : '上傳參考文件'}
          <input
            ref={inputRef}
            type="file"
            accept=".docx,.pdf"
            className="hidden"
            onChange={handleFile}
            disabled={disabled || parsing}
          />
        </label>
        {parsing && (
          <span className="flex items-center gap-1 text-sm text-purple-700">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            解析中...
          </span>
        )}
        {docInfo && !parsing && (
          <span className="text-sm text-gray-600">
            {docInfo.name}（{docInfo.chars.toLocaleString()} 字）
          </span>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
