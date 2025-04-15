import { useState } from 'react';
import { useKpis } from '../../hooks/useKpis';
import { StatCard } from './StatCard';
import { DateRangePicker } from './DateRangePicker';
import { PieChartSection } from './PieChart';
import { BarChartSection } from './BarChart';
import { RadarChartSection } from './RadarChart';
import { EconomicImpact } from './EconomicImpact';
import { ReportButtons } from './ReportButtons';

export function Analytics() {
  const clientId = 'demo-client-id'; // Replace with context/router prop
  const { kpis } = useKpis(clientId);

  const [dateRange, setDateRange] = useState({
    start: new Date('2025-01-01'),
    end: new Date('2025-03-19'),
  });

  if (kpis.isLoading) return <div>Loading analytics...</div>;
  if (kpis.isError) return <div>Error loading data.</div>;

  const filtered = kpis.data?.filter(kpi => {
    const date = new Date(kpi.recorded_at || '');
    return date >= dateRange.start && date <= dateRange.end;
  }) || [];

  const getValue = (name: string) => filtered.find(k => k.name === name)?.value || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500">Track services, measure impact, and generate reports</p>
        </div>
        <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Clients" value={getValue('total_clients')} />
        <StatCard label="Services Provided" value={getValue('services_provided')} />
        <StatCard label="Resource Connections" value={getValue('resource_connections')} />
        <StatCard label="Client Satisfaction" value={`${getValue('client_satisfaction')}%`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PieChartSection data={filtered} />
        <BarChartSection data={filtered} />
      </div>

      <RadarChartSection data={filtered} />
      <EconomicImpact data={filtered} />

      <ReportButtons />
    </div>
  );
}
