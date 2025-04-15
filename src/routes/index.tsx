import { Routes, Route } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { Clients } from '../pages/Clients';
import { ClientDetails } from '../pages/Clients/ClientDetails';
import { Documents } from '../pages/Documents';
import { Calendar } from '../pages/Calendar';
import { Analytics } from '../pages/Analytics';
import { Settings } from '../pages/Settings';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/clients/:id" element={<ClientDetails />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}