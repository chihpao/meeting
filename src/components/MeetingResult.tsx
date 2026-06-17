import type { MeetingResult } from '../types';

interface Props {
  result: MeetingResult | null;
  rawJson: string;
}

export default function MeetingResult({ result, rawJson }: Props) {
  if (!result) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 text-left space-y-4">
      {/* Title & Date */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">{result.title}</h1>
        <p className="text-gray-500 mt-1">{result.date}</p>
      </div>

      {/* Attendees */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700">與會者</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {result.attendees.map((name, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700">摘要</h2>
        <p className="text-gray-600 mt-1">{result.summary}</p>
      </div>

      {/* Discussion Points */}
      {result.discussion_points.length > 0 && (
        <div>
            <h2 className="text-lg font-semibold text-gray-700">
              討論重點
            </h2>
          <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
            {result.discussion_points.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Decisions */}
      {result.decisions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-700">決議</h2>
          <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
            {result.decisions.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Next Meeting */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-700">下次會議</h2>
        <p className="text-gray-800 font-medium mt-1">{result.next_meeting}</p>
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
