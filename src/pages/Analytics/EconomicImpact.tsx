interface EconomicImpactProps {
  data: {
    newJobs: number;
    newLoans: string;
    revenueGrowth: string;
    retentionRate: string;
  };
}

export function EconomicImpact({ data }: EconomicImpactProps) {
  return (
    <div className="bg-white rounded-xl shadow p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h3 className="text-sm text-gray-500">New Jobs Created</h3>
        <p className="text-xl font-bold">{data.newJobs}</p>
      </div>
      <div>
        <h3 className="text-sm text-gray-500">New Loan Funding</h3>
        <p className="text-xl font-bold">{data.newLoans}</p>
      </div>
      <div>
        <h3 className="text-sm text-gray-500">Revenue Growth</h3>
        <p className="text-xl font-bold">{data.revenueGrowth}</p>
      </div>
      <div>
        <h3 className="text-sm text-gray-500">Business Retention</h3>
        <p className="text-xl font-bold">{data.retentionRate}</p>
      </div>
    </div>
  );
}
