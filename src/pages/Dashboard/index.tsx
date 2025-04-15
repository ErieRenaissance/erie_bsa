// src/pages/Dashboard/index.tsx

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { cn } from '../../utils/cn';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { priorityConfig } from '../../config/priorityConfig';
import { format, parseISO } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' as const },
    title: { display: true, text: 'Business Health Overview' },
  },
};

export function Dashboard() {
  const [chartData, setChartData] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // Fetch client growth data
      const { data: clients } = await supabase
        .from('biz_support_app.clients')
        .select('id, created_at');

      const monthLabels = Array.from({ length: 6 }, (_, i) =>
        format(new Date(new Date().getFullYear(), new Date().getMonth() - (5 - i)), 'MMM')
      );

      const clientGrowth: Record<string, number> = {};
      monthLabels.forEach((label) => (clientGrowth[label] = 0));

      clients?.forEach((client) => {
        const month = format(new Date(client.created_at), 'MMM');
        if (clientGrowth[month] !== undefined) clientGrowth[month]++;
      });

      const chart = {
        labels: monthLabels,
        datasets: [
          {
            label: 'Client Growth',
            data: monthLabels.map((label) => clientGrowth[label] ?? 0),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      };

      // Fetch assessments
      const { data: assessments } = await supabase
        .from('biz_support_app.assessments')
        .select('id, client_id, date')
        .order('date', { ascending: false })
        .limit(5);

      const recent = assessments?.map((a, i) => ({
        id: i + 1,
        action: 'Assessment Completed',
        client: `Client ID: ${a.client_id}`,
        date: format(parseISO(a.date), 'PPP'),
      })) ?? [];

      // Fetch tasks
      const { data: taskData } = await supabase
        .from('biz_support_app.tasks')
        .select('id, title, status, due_date')
        .order('due_date', { ascending: true });

      setChartData(chart);
      setRecentActivity(recent);
      setTasks(taskData ?? []);
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Business Health Overview</h2>
          {loading ? <Skeleton height={300} /> : <Line options={chartOptions} data={chartData} />}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Action Items</h2>
          <div className="space-y-4">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={60} />)
              : tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-gray-500">
                        Due: {format(parseISO(task.due_date), 'PPP')}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'px-2 py-1 text-xs rounded-full',
                        priorityConfig[task.status]?.className || 'bg-gray-100 text-gray-800'
                      )}
                    >
                      {task.status}
                    </span>
                  </div>
                ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={60} />)
            : recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{activity.action}</h3>
                    <p className="text-sm text-gray-500">{activity.client}</p>
                  </div>
                  <span className="text-sm text-gray-500">{activity.date}</span>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
