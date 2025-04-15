export function ReportButtons() {
  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4">
      <h2 className="text-lg font-semibold">Report Generation</h2>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span>Monthly Service Summary</span>
          <button className="bg-blue-500 text-white px-4 py-1 rounded">Generate</button>
        </div>
        <div className="flex justify-between items-center">
          <span>Client Progress Report</span>
          <button className="bg-blue-500 text-white px-4 py-1 rounded">Generate</button>
        </div>
        <div className="flex justify-between items-center">
          <span>Economic Impact Assessment</span>
          <button className="bg-blue-500 text-white px-4 py-1 rounded">Generate</button>
        </div>
      </div>
    </div>
  );
}
