import type { Risk } from '../types';

interface Props {
  risks: Risk[];
}

const levelBorder: Record<string, string> = {
  '高': 'border-l-red-600',
  High: 'border-l-red-600',
  '中': 'border-l-yellow-500',
  Medium: 'border-l-yellow-500',
  '低': 'border-l-green-500',
  Low: 'border-l-green-500',
};

export default function RisksCard({ risks }: Props) {
  if (!risks.length) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold text-red-700 mb-3">風險</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {risks.map((risk, i) => (
          <div
            key={i}
            className={`bg-red-50 border-l-4 ${levelBorder[risk.level] || 'border-l-red-400'} p-4 rounded-r-lg`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-red-700 bg-red-200 px-2 py-0.5 rounded">
                {risk.level}
              </span>
            </div>
            <p className="text-gray-800 font-medium">{risk.description}</p>
            <p className="text-gray-600 text-sm mt-2">
              <span className="font-semibold">因應對策：</span>
              {risk.mitigation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
