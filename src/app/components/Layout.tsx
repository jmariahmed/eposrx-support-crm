import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Building2, Home, LogOut, Store } from 'lucide-react';
import { Button } from './ui/button';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchVisible, setSearchVisible] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200">
        <div className="p-6">
          <h1 className="text-xl font-semibold text-slate-900">Support Portal</h1>
        </div>

        <nav className="px-3 space-y-1">
          <button
            onClick={() => navigate('/dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive('/dashboard')
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => navigate('/companies')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              location.pathname.startsWith('/company')
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span>Companies</span>
          </button>

          <button
            onClick={() => navigate('/pharmacies')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              location.pathname.startsWith('/pharmac')
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Store className="w-5 h-5" />
            <span>Pharmacies</span>
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-600"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64">
        <Outlet />
      </main>
    </div>
  );
}
