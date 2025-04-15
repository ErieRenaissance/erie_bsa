// src/pages/Clients/ClientDetails.tsx

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import {
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  DocumentTextIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

import { useClient } from '../../hooks/useClients';
import { AssessmentForm } from './AssessmentForm';
import { DocumentForm } from './DocumentForm';

export function ClientDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: client, isLoading, isError } = useClient(id!);
  const [activeTab, setActiveTab] = useState<'overview' | 'assessments' | 'documents'>('overview');
  const [showNewAssessment, setShowNewAssessment] = useState(false);
  const [showNewDocument, setShowNewDocument] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'assessments', name: 'Assessments' },
    { id: 'documents', name: 'Documents' },
  ];

  if (isLoading) return <div>Loading client details...</div>;
  if (isError || !client) return <div>Failed to load client details.</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{client.name}</h1>
            <p className="mt-1 text-sm text-gray-500">{client.business}</p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium
              ${
                client.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : client.status === 'inactive'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
          >
            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
          </span>
        </div>

        {/* Tabs */}
        <div className="mt-4">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Contact Info */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-3 text-gray-500">
                <div className="flex items-center"><BuildingOfficeIcon className="h-5 w-5 mr-2" /><span>{client.business}</span></div>
                <div className="flex items-center"><PhoneIcon className="h-5 w-5 mr-2" /><span>{client.phone}</span></div>
                <div className="flex items-center"><EnvelopeIcon className="h-5 w-5 mr-2" /><span>{client.email}</span></div>
                <div className="flex items-center"><MapPinIcon className="h-5 w-5 mr-2" /><span>{client.address}</span></div>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  <span>
                    Last Contact:{' '}
                    {client.lastContact ? format(new Date(client.lastContact), 'MMM d, yyyy') : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Business Info */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Business Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Industry</label>
                  <p className="mt-1">{client.industry}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Business Stage</label>
                  <p className="mt-1">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        client.stage === 'startup'
                          ? 'bg-blue-100 text-blue-800'
                          : client.stage === 'growth'
                          ? 'bg-green-100 text-green-800'
                          : client.stage === 'mature'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {client.stage.charAt(0).toUpperCase() + client.stage.slice(1)}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Notes</label>
                  <p className="mt-1 text-gray-700">{client.notes}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assessments' && (
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Assessments</h2>
                <button
                  type="button"
                  onClick={() => setShowNewAssessment(true)}
                  className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
                >
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  New Assessment
                </button>
              </div>
              <p className="text-gray-500 italic">Coming soon: live assessments data.</p>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Documents</h2>
                <button
                  type="button"
                  onClick={() => setShowNewDocument(true)}
                  className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
                >
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  New Document
                </button>
              </div>
              <p className="text-gray-500 italic">Coming soon: live documents data.</p>
            </div>
          </div>
        )}
      </div>

      {showNewAssessment && (
        <AssessmentForm clientId={client.id} onClose={() => setShowNewAssessment(false)} />
      )}

      {showNewDocument && (
        <DocumentForm clientId={client.id} onClose={() => setShowNewDocument(false)} />
      )}
    </div>
  );
}
