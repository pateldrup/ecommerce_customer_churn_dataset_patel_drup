import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { Settings as SettingsIcon, Shield, Server, RefreshCw, CheckCircle2, XCircle, Moon, Sun } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import analyticsService from '../services/analyticsService';
import { toggleTheme, addToast, toggleNotificationSetting } from '../store/uiSlice';

export const Settings = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);
  const settings = useSelector((state) => state.ui.notificationSettings) || {
    churnAlerts: true,
    systemHealthAlerts: true,
    databaseAlerts: true
  };
  
  const handleToggleSetting = (settingKey) => {
    dispatch(toggleNotificationSetting(settingKey));
    const labelMap = {
      churnAlerts: 'High Churn Risk Alerts',
      systemHealthAlerts: 'System Health Alerts',
      databaseAlerts: 'Database Sync Reports',
    };
    const nextState = !settings[settingKey];
    dispatch(addToast({
      message: `${labelMap[settingKey]} has been ${nextState ? 'enabled' : 'disabled'}.`,
      type: 'success',
    }));
  };

  const [apiUrl, setApiUrl] = useState(localStorage.getItem('custom_api_url') || 'http://localhost:5000/api');
  const [healthData, setHealthData] = useState(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const checkHealth = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const data = await analyticsService.getSystemHealth();
      setHealthData(data);
      setTestResult({
        success: true,
        message: 'Diagnostics check complete. Backend API connections are healthy.'
      });
    } catch (e) {
      console.error(e);
      setHealthData(null);
      setTestResult({
        success: false,
        message: 'Could not connect to backend server. Ensure backend is running on port 5000.'
      });
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const handleSaveConfig = (e) => {
    e.preventDefault();
    localStorage.setItem('custom_api_url', apiUrl);
    dispatch(addToast({ message: 'API Configuration saved. Reloading page...', type: 'success' }));
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleThemeChange = () => {
    dispatch(toggleTheme());
    dispatch(addToast({ message: `Theme switched to ${theme === 'dark' ? 'light' : 'dark'} mode!`, type: 'info' }));
  };

  return (
    <div className="p-8 space-y-8">
      <Helmet>
        <title>Settings & System Health - Churnlytics</title>
        <meta name="description" content="Manage dashboard preferences, toggle light and dark modes, configure backend API ports, and run health diagnostics checks." />
        <meta property="og:title" content="System Settings | Churnlytics Console" />
      </Helmet>

      {/* Title */}
      <div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Settings & Diagnostics</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure API connection endpoints and monitor server instance health stats.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* API connection form */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="API Configuration" subtitle="Configure frontend connection parameters">
            <form onSubmit={handleSaveConfig} className="space-y-4 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Backend API URL Path</label>
                <input
                  type="url"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              
              <div className="p-3 bg-slate-100/50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Default connection path targets <code className="text-indigo-600 dark:text-indigo-400 font-mono">http://localhost:5000/api</code>. Changing this value requires rebuilding or reloading the client dev servers.
              </div>

              <Button type="submit" variant="primary" className="bg-indigo-600 hover:bg-indigo-500">
                Save Connection Configuration
              </Button>
            </form>
          </Card>

          {/* Theme Preferences */}
          <Card title="User Preferences" subtitle="Customize the workspace interface styling">
            <div className="flex items-center justify-between mt-2 p-4 rounded-xl bg-slate-50/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Color Interface Mode</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Toggle between dark mode console and light mode interface.</p>
              </div>
              <button
                id="theme-toggle-btn"
                onClick={handleThemeChange}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
              >
                {theme === 'dark' ? (
                  <>
                    <Moon size={14} className="text-indigo-400" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun size={14} className="text-amber-550" />
                    <span>Light Mode</span>
                  </>
                )}
              </button>
            </div>
          </Card>

          {/* Notification Preferences */}
          <Card title="Notification Preferences" subtitle="Manage and customize console notification channels">
            <div className="space-y-4 mt-2">
              {/* Toggle 1: Churn Alerts */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">High Churn Risk Alerts</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Receive warning logs when customer churn probabilities exceed set thresholds.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleSetting('churnAlerts')}
                  className={`w-11.5 h-6 flex items-center rounded-full p-1 transition-all duration-300 relative cursor-pointer ${
                    settings.churnAlerts ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                      settings.churnAlerts ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>

              {/* Toggle 2: System Health */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">System Health Alerts</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Alerts when backend APIs or database sync modules experience downtime.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleSetting('systemHealthAlerts')}
                  className={`w-11.5 h-6 flex items-center rounded-full p-1 transition-all duration-300 relative cursor-pointer ${
                    settings.systemHealthAlerts ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                      settings.systemHealthAlerts ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>

              {/* Toggle 3: Database sync reports */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Database Sync Reports</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Get logs showing completion of customer record syncs with database storage.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleSetting('databaseAlerts')}
                  className={`w-11.5 h-6 flex items-center rounded-full p-1 transition-all duration-300 relative cursor-pointer ${
                    settings.databaseAlerts ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                      settings.databaseAlerts ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Server status cards */}
        <Card title="System Diagnostics" subtitle="Ping checks and metrics">
          <div className="space-y-5 mt-2">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700/30 pb-3">
              <div className="flex items-center gap-2">
                <Server size={16} className="text-slate-400" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Backend Server</span>
              </div>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                healthData ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}>
                {healthData ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700/30 pb-3">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-slate-400" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Database (MongoDB Atlas)</span>
              </div>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                healthData ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}>
                {healthData ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>

            {testResult && (
              <div className={`p-4 rounded-xl text-xs flex gap-3 border ${
                testResult.success ? 'bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/10 dark:border-emerald-500/20' : 'bg-rose-500/5 text-rose-600 dark:text-rose-400 border-rose-500/10 dark:border-rose-500/20'
              }`}>
                {testResult.success ? <CheckCircle2 size={16} className="shrink-0" /> : <XCircle size={16} className="shrink-0" />}
                <p className="leading-relaxed">{testResult.message}</p>
              </div>
            )}

            <Button onClick={checkHealth} loading={testing} variant="outline" className="w-full flex items-center justify-center gap-2">
              <RefreshCw size={14} />
              <span>Ping Diagnostics Check</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
