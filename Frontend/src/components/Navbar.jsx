import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, LogOut, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2 lg:space-x-3 text-emerald-400 hover:text-emerald-300 transition-colors">
              <Stethoscope className="h-8 w-8" />
              <span className="font-bold text-xl tracking-tight hidden sm:block text-white">
                Vet<span className="text-emerald-400">EMR</span>
              </span>
            </Link>
          </div>

          {user && (
            <div className="flex items-center space-x-4 lg:space-x-6">
              <div className="relative group hidden md:block">
                 <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input 
                   type="text"
                   placeholder="Search animals..."
                   className="pl-9 pr-4 py-1.5 bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all w-64"
                 />
              </div>

              <div className="flex flex-col text-right hidden sm:block">
                <span className="text-sm font-medium text-slate-200">{user.name}</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">{user.role}</span>
              </div>
              
              <button 
                onClick={handleLogout}
                className="p-2 rounded-full text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-all flex items-center justify-center"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
