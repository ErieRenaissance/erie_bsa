import {
  RadarChart as ReRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface KPI {
  name: string;
  value: number;
  recorded_at?: string;
}

interface RadarChartSectionProps {
  data: KPI[];
}

export function RadarChartSection({ data }: RadarChartSectionProps) {
  const categories = [
    'Business Planning',
    'Marketing',
    'Financing',
    'Operations',
    'HR/Staffing',
  ];

  const radarData = categories.map((category) => {
    const match = data.find(k => k.name.toLowerCase() === category.toLowerCase().replace(/ /g, '_'));
    return {
      category,
      value: match?.value || 0,
    };
  });

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Client Service Coverage</h2>
      <ResponsiveContainer width="100%" height={300}>
        <ReRadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="Coverage"
            dataKey="value"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.6}
          />
          <Tooltip />
        </ReRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
