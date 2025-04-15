// src/pages/Clients/index.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
import {
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ClientForm } from './ClientForm';
import { useClients } from '../../hooks/useClients';

type Client = {
  id: string;
  name: string;
  business: string;
  industry: string;
  stage: 'startup' | 'growth' | 'mature' | 'decline';
  lastContact: string;
  status: 'active' | 'inactive' | 'pending';
};

const columnHelper = createColumnHelper<Client>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('business', {
    header: 'Business',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('industry', {
    header: 'Industry',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('stage', {
    header: 'Stage',
    cell: (info) => {
      const value = info.getValue();
      const color =
        value === 'startup'
          ? 'blue'
          : value === 'growth'
          ? 'green'
          : value === 'mature'
          ? 'yellow'
          : 'gray';

      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-${color}-100 text-${color}-800`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      );
    },
  }),
  columnHelper.accessor('lastContact', {
    header: 'Last Contact',
    cell: (info) => format(new Date(info.getValue()), 'MMM d, yyyy'),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => {
      const value = info.getValue();
      const color =
        value === 'active'
          ? 'green'
          : value === 'inactive'
          ? 'red'
          : 'yellow';

      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-${color}-100 text-${color}-800`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      );
    },
  }),
];

export function Clients() {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showAddClient, setShowAddClient] = useState(false);

  const { clients } = useClients();

  const table = useReactTable({
    data: clients.data ?? [],
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (clients.isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (clients.isError) {
    return (
      <div className="flex items-center justify-center h-96 text-red-600">
        Error loading clients. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all clients and their businesses in your portfolio.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setShowAddClient(true)}
            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Client
          </button>
        </div>
      </div>

      <div>
        <div className="relative mt-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search clients..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="block w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto mt-6">
        <div className="inline-block min-w-full align-middle">
          <div className="shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 bg-white">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <div
                          className={`group inline-flex ${
                            header.column.getCanSort() ? 'cursor-pointer' : ''
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <span className="ml-2">
                            {{
                              asc: <ChevronUpIcon className="h-4 w-4" />,
                              desc: <ChevronDownIcon className="h-4 w-4" />,
                            }[header.column.getIsSorted() as string] ?? null}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => navigate(`/clients/${row.original.id}`)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-3 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddClient && <ClientForm onClose={() => setShowAddClient(false)} />}
    </div>
  );
}
