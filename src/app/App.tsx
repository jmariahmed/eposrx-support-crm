import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginScreen } from './components/LoginScreen';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { CompanySearch } from './components/CompanySearch';
import { CompanyProfile } from './components/CompanyProfile';
import { PharmacyList } from './components/PharmacyList';
import { PharmacyProfile } from './components/PharmacyProfile';
import { TicketSearch } from './components/TicketSearch';
import { CreateTicket } from './components/CreateTicket';
import { Toaster } from './components/ui/sonner';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="companies" element={<CompanySearch />} />
          <Route path="company/:id" element={<CompanyProfile />} />
          <Route path="pharmacies" element={<PharmacyList />} />
          <Route path="pharmacy/:id" element={<PharmacyProfile />} />
          <Route path="ticket/search" element={<TicketSearch />} />
          <Route path="ticket/new" element={<CreateTicket />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
