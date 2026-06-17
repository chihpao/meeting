import type { ActionItem } from '../types';

interface Props {
  items: ActionItem[];
}

const priorityColors: Record<string, string> = {
  '高': 'bg-red-100 text-red-800',
  High: 'bg-red-100 text-red-800',
  '中': 'bg-yellow-100 text-yellow-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  '低': 'bg-green-100 text-green-800',
  Low: 'bg-green-100 text-green-800',
};

export default function ActionItemsTable({ items }: Props) {
  if (!items.length) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-3">待辦事項</h2>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-600">事項</th>
              <th className="px-4 py-3 font-semibold text-gray-600">負責人</th>
              <th className="px-4 py-3 font-semibold text-gray-600">截止日</th>
              <th className="px-4 py-3 font-semibold text-gray-600">優先級</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-800">{item.task}</td>
                <td className="px-4 py-3 text-gray-600">{item.owner}</td>
                <td className="px-4 py-3 text-gray-600">{item.deadline}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${priorityColors[item.priority] || 'bg-gray-100 text-gray-700'}`}
                  >
                    {item.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
