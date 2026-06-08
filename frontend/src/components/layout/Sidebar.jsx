import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  LayoutDashboard,
  Users,
  BrainCircuit,
  PieChart,
  Settings,
  LogOut,
  ShoppingBag,
  TrendingDown
} from 'lucide-react';
import authService from '../../services/authService';
import { logoutUser } from '../../store/authSlice';

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = authService.getCurrentUser();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Churn & Predictions', path: '/predictions', icon: BrainCircuit },
    { name: 'Customer Cohorts', path: '/segments', icon: PieChart },
    { name: 'Settings & Health', path: '/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0 transition-colors duration-300">
      {/* Brand logo */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <div className="p-2 bg-indigo-600 rounded-xl text-white">
          <ShoppingBag size={22} className="animate-pulse" />
        </div>
        <div>
          <h1 className="text-md font-bold text-slate-800 dark:text-white leading-tight">Churnlytics</h1>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wider uppercase">EC Analytics Hub</p>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User profile / Logout */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 p-2 mb-3 bg-slate-100 dark:bg-slate-800/40 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-semibold text-indigo-500 dark:text-indigo-400">
            {user?.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.name || 'Administrator'}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user?.email || 'admin@ecommerce.com'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/40 transition-all duration-200 cursor-pointer"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
