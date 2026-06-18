import type { MeetingResult } from '../types';

interface Props {
  result: MeetingResult | null;
  rawJson: string;
}

export default function MeetingResult({ result, rawJson }: Props) {
  if (!result) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 text-left space-y-4" style={{ fontFamily: '"Times New Roman", "標楷體", serif' }}>
      {/* Header */}
      <div className="border-b pb-4 text-center">
        <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: '"標楷體", "Times New Roman", serif' }}>
          {result.project_name}
        </h1>
        <p className="text-lg font-bold text-gray-800 mt-2" style={{ fontFamily: '"標楷體", "Times New Roman", serif' }}>
          {result.meeting_type} 會議紀錄
        </p>
      </div>

      {/* 壹、開會時間 */}
      <div>
        <h2 className="font-bold text-gray-800" style={{ fontFamily: '"標楷體", "Times New Roman", serif' }}>壹、開會時間：</h2>
        <p className="text-gray-700 ml-6">{result.date}</p>
      </div>

      {/* 貳、開會地點 */}
      <div>
        <h2 className="font-bold text-gray-800" style={{ fontFamily: '"標楷體", "Times New Roman", serif' }}>貳、開會地點：</h2>
        <p className="text-gray-700 ml-6">{result.location}</p>
      </div>

      {/* 參、主持人 */}
      <div>
        <h2 className="font-bold text-gray-800" style={{ fontFamily: '"標楷體", "Times New Roman", serif' }}>參、主持人：</h2>
        <p className="text-gray-700 ml-6">{result.host}</p>
      </div>

      {/* 肆、出席單位及人員 */}
      <div>
        <h2 className="font-bold text-gray-800" style={{ fontFamily: '"標楷體", "Times New Roman", serif' }}>肆、出席單位及人員：</h2>
        <ul className="ml-6 space-y-1">
          {result.attendees.map((a, i) => (
            <li key={i} className="text-gray-700">{a}</li>
          ))}
        </ul>
      </div>

      {/* 伍、討論事項 */}
      <div>
        <h2 className="font-bold text-gray-800" style={{ fontFamily: '"標楷體", "Times New Roman", serif' }}>伍、討論事項：</h2>
        <div className="ml-6 space-y-3">
          {result.discussion.map((d, i) => (
            <div key={i}>
              <p className="font-semibold text-gray-800">{i + 1}. {d.topic}</p>
              <p className="text-gray-700 ml-4">內容：{d.content}</p>
              <p className="text-gray-700 ml-4">決議：{d.resolution}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 陸、待辦事項與待提供文件 */}
      <div>
        <h2 className="font-bold text-gray-800 mb-2" style={{ fontFamily: '"標楷體", "Times New Roman", serif' }}>陸、待辦事項與待提供文件：</h2>
        {result.action_items.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left font-bold">負責單位</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-bold">待辦事項</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-bold">期限</th>
                </tr>
              </thead>
              <tbody>
                {result.action_items.map((ai, i) => (
                  <tr key={i}>
                    <td className="border border-gray-300 px-3 py-2">{ai.unit}</td>
                    <td className="border border-gray-300 px-3 py-2">{ai.task}</td>
                    <td className="border border-gray-300 px-3 py-2">{ai.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 柒、後續安排 */}
      <div>
        <h2 className="font-bold text-gray-800" style={{ fontFamily: '"標楷體", "Times New Roman", serif' }}>柒、後續安排：</h2>
        <p className="text-gray-700 ml-6">{result.follow_up}</p>
      </div>

      {/* Raw JSON toggle for debug */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-600">
          Raw JSON
        </summary>
        <pre className="mt-2 text-xs text-gray-500 bg-gray-50 p-3 rounded overflow-x-auto whitespace-pre-wrap">
          {rawJson}
        </pre>
      </details>
    </div>
  );
}
