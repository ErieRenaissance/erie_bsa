interface StatCardProps {
  title: string;
  value: string | number;
}

export function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-4 text-center">
      <h2 className="text-sm text-gray-500">{title}</h2>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
