import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export function BarChart({ data }: { data: { month: string; actual: number; projected: number }[] }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Client Progress Over Time</h2>
      <ResponsiveContainer width="100%" height={250}>
        <ReBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="actual" fill="#3B82F6" />
          <Bar dataKey="projected" fill="#D1D5DB" />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}
