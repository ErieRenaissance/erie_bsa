interface DateRange {
  startDate: string;
  endDate: string;
}

interface DateRangePickerProps {
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
}

export function DateRangePicker({ dateRange, onChange }: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600">Date Range:</label>
      <input
        type="date"
        value={dateRange.startDate}
        onChange={(e) => onChange({ ...dateRange, startDate: e.target.value })}
        className="border rounded px-2 py-1"
      />
      <span>-</span>
      <input
        type="date"
        value={dateRange.endDate}
        onChange={(e) => onChange({ ...dateRange, endDate: e.target.value })}
        className="border rounded px-2 py-1"
      />
    </div>
  );
}
