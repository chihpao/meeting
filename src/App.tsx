import { useState } from 'react';
import TranscriptInput from './components/TranscriptInput';
import MeetingResult from './components/MeetingResult';
import CopyButton from './components/CopyButton';
import DownloadDocxButton from './components/DownloadDocxButton';
import { analyzeTranscript } from './services/claude';
import type { MeetingResult as MeetingResultType } from './types';

function formatFullText(result: MeetingResultType): string {
  const sections: string[] = [];

  sections.push(result.project_name);
  sections.push(`${result.meeting_type} 會議紀錄`);
  sections.push('');
  sections.push('壹、開會時間：');
  sections.push(result.date);
  sections.push('');
  sections.push('貳、開會地點：');
  sections.push(result.location);
  sections.push('');
  sections.push('參、主持人：');
  sections.push(result.host);
  sections.push('');
  sections.push('肆、出席單位及人員：');
  result.attendees.forEach((a) => sections.push(a));
  sections.push('');
  sections.push('伍、討論事項：');
  result.discussion.forEach((d, i) => {
    sections.push(`${i + 1}. ${d.topic}`);
    sections.push(`   內容：${d.content}`);
    sections.push(`   決議：${d.resolution}`);
    sections.push('');
  });
  sections.push('陸、待辦事項與待提供文件：');
  result.action_items.forEach((ai) =>
    sections.push(`- [${ai.unit}] ${ai.task} | 期限：${ai.deadline}`),
  );
  sections.push('');
  sections.push('柒、後續安排：');
  sections.push(result.follow_up);

  return sections.join('\n');
}

function App() {
  const [result, setResult] = useState<MeetingResultType | null>(null);
  const [rawJson, setRawJson] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (transcript: string, refText: string) => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await analyzeTranscript(transcript, refText || undefined);
      setRawJson(JSON.stringify(data, null, 2));
      setResult(data);
    } catch (e) {
      console.error('=== API ERROR ===', JSON.stringify(e));
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            📋 會議記錄產生器
          </h1>
          <p className="text-gray-500 mt-2">
            貼上逐字稿或上傳錄音，AI 自動產生結構化會議記錄
          </p>
        </header>

        <TranscriptInput onSubmit={handleSubmit} loading={loading} />

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8 space-y-0">
            <MeetingResult result={result} rawJson={rawJson} />
            <div className="flex gap-4 mt-4">
              <div className="flex-1">
                <CopyButton text={formatFullText(result)} />
              </div>
              <div className="flex-1">
                <DownloadDocxButton
                  onDownload={async () => {
                    const { downloadDocx } = await import('./services/docxGenerator');
                    await downloadDocx(result);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
