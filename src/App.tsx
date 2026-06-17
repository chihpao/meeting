import { useState } from 'react';
import TranscriptInput from './components/TranscriptInput';
import MeetingResult from './components/MeetingResult';
import ActionItemsTable from './components/ActionItemsTable';
import RisksCard from './components/RisksCard';
import CopyButton from './components/CopyButton';
import { analyzeTranscript } from './services/claude';
import type { MeetingResult as MeetingResultType } from './types';

function formatFullText(result: MeetingResultType): string {
  const sections: string[] = [];

  sections.push(`# ${result.title}`);
  sections.push(`日期：${result.date}`);
  sections.push('');
  sections.push('## 與會者');
  result.attendees.forEach((a) => sections.push(`- ${a}`));
  sections.push('');
  sections.push('## 摘要');
  sections.push(result.summary);
  sections.push('');
  sections.push('## 討論重點');
  result.discussion_points.forEach((p) => sections.push(`- ${p}`));
  sections.push('');
  sections.push('## 決議');
  result.decisions.forEach((d) => sections.push(`- ${d}`));
  sections.push('');
  sections.push('## 待辦事項');
  result.action_items.forEach((ai) =>
    sections.push(
      `- [${ai.priority}] ${ai.task} | 負責人：${ai.owner} | 截止日：${ai.deadline}`,
    ),
  );
  sections.push('');
  sections.push('## 風險');
  result.risks.forEach((r) =>
    sections.push(`- [${r.level}] ${r.description} — 因應對策：${r.mitigation}`),
  );
  sections.push('');
  sections.push('## 下次會議');
  sections.push(result.next_meeting);

  return sections.join('\n');
}

function App() {
  const [result, setResult] = useState<MeetingResultType | null>(null);
  const [rawJson, setRawJson] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (transcript: string) => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await analyzeTranscript(transcript);
      setRawJson(JSON.stringify(data, null, 2));
      setResult(data);
    } catch (e) {
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
            <ActionItemsTable items={result.action_items} />
            <RisksCard risks={result.risks} />
            <CopyButton text={formatFullText(result)} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
