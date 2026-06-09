import React, { useEffect, useState, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Bell,
  ShieldCheck,
  Activity,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Trash2,
  Check,
  Settings as SettingsIcon
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import analyticsService from '../../services/analyticsService';
import { markNotificationsRead, clearAllNotifications } from '../../store/uiSlice';

export const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  const [serverOk, setServerOk] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const notifications = useSelector((state) => state.ui.notifications) || [];
  const settings = useSelector((state) => state.ui.notificationSettings) || {
    churnAlerts: true,
    systemHealthAlerts: true,
    databaseAlerts: true
  };

  // Filter notifications based on active settings
  const filteredNotifications = notifications.filter((n) => {
    if (n.category === 'churnAlerts') return settings.churnAlerts;
    if (n.category === 'systemHealthAlerts') return settings.systemHealthAlerts;
    if (n.category === 'databaseAlerts') return settings.databaseAlerts;
    return true;
  });

  const unreadCount = filteredNotifications.filter((n) => !n.read).length;

  useEffect(() => {
    // Basic ping to verify backend server health
    const checkHealth = async () => {
      try {
        const res = await analyticsService.getSystemHealth();
        if (res?.success || res?.status?.toLowerCase() === 'ok' || res?.status?.toLowerCase() === 'success' || res?.status?.toLowerCase() === 'up' || res?.ok) {
          setServerOk(true);
        } else {
          setServerOk(false);
        }
      } catch (e) {
        setServerOk(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard & Metrics';
      case '/customers':
        return 'Customer Database';
      case '/predictions':
        return 'AI Churn Predictions';
      case '/segments':
        return 'Customer Segments & Cohorts';
      case '/settings':
        return 'Settings & System Diagnostics';
      default:
        return 'Console';
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />;
      case 'error':
        return <XCircle size={16} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />;
      default:
        return <Info size={16} className="text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />;
    }
  };

  return (
    <header className="h-20 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-40 transition-colors duration-300">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{getPageTitle()}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">Real-time analytical metrics dashboard</p>
      </div>

      <div className="flex items-center gap-5">
        {/* Backend health notifier */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium transition-colors duration-300">
          <Activity size={13} className={serverOk ? 'text-emerald-500 dark:text-emerald-400 animate-pulse' : 'text-rose-500 dark:text-rose-400'} />
          <span className="text-slate-500 dark:text-slate-400">Server status: </span>
          <span className={serverOk ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-rose-600 dark:text-rose-400 font-semibold'}>
            {serverOk ? 'Connected' : 'Offline'}
          </span>
        </div>

        {/* Notifications Button & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors relative cursor-pointer"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 border border-white dark:border-slate-900 rounded-full animate-pulse"></span>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800/90 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-3 duration-250 transition-colors duration-300">
              {/* Header */}
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Notifications {unreadCount > 0 && `(${unreadCount})`}
                </span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={() => dispatch(markNotificationsRead())}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                      title="Mark all as read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  {filteredNotifications.length > 0 && (
                    <button
                      onClick={() => dispatch(clearAllNotifications())}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 transition-colors cursor-pointer"
                      title="Clear all"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Body / Alert items */}
              <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-200 dark:divide-slate-800">
                {filteredNotifications.length === 0 ? (
                  <div className="py-8 px-4 flex flex-col items-center justify-center text-center">
                    <Bell size={28} className="text-slate-400 dark:text-slate-600 mb-2 stroke-[1.5]" />
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">No alerts found</p>
                    <p className="text-[10px] text-slate-500 mt-1 max-w-[200px]">
                      Customize your active alert channels in system preferences settings.
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 transition-colors flex gap-3 ${
                        notif.read ? 'bg-transparent' : 'bg-indigo-50/50 dark:bg-indigo-950/10'
                      }`}
                    >
                      {getNotifIcon(notif.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className={`text-xs font-bold ${notif.read ? 'text-slate-600 dark:text-slate-300' : 'text-slate-800 dark:text-slate-200'}`}>
                            {notif.title}
                          </p>
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium shrink-0 ml-2">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                      {!notif.read && (
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0"></span>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center">
                <Link
                  to="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-semibold py-1 transition-colors"
                >
                  <SettingsIcon size={12} />
                  <span>Configure Settings</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile badge status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-600/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold text-xs">
          <ShieldCheck size={14} />
          <span>Role: Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
