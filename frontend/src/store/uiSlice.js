import { createSlice } from '@reduxjs/toolkit';

const getLocalStorageBoolean = (key, defaultValue) => {
  if (typeof window === 'undefined') return defaultValue;
  const val = localStorage.getItem(key);
  return val === null ? defaultValue : val === 'true';
};

const initialState = {
  theme: (typeof window !== 'undefined' && localStorage.getItem('theme')) || 'dark',
  toasts: [],
  notificationSettings: {
    churnAlerts: getLocalStorageBoolean('notif_churnAlerts', true),
    systemHealthAlerts: getLocalStorageBoolean('notif_systemHealthAlerts', true),
    databaseAlerts: getLocalStorageBoolean('notif_databaseAlerts', true),
  },
  notifications: [
    {
      id: 'notif-1',
      title: 'High Churn Risk Alert',
      message: '5 customers in the Premium Cohort have been flagged with a churn probability score exceeding 85%.',
      type: 'warning',
      category: 'churnAlerts',
      timestamp: '10 mins ago',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Database Synchronization Complete',
      message: 'Successfully imported and parsed 15,259 records from MongoDB Atlas customer collection.',
      type: 'success',
      category: 'databaseAlerts',
      timestamp: '1 hour ago',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'API Server Diagnostics',
      message: 'Daily background connectivity and load speed check completed successfully.',
      type: 'info',
      category: 'systemHealthAlerts',
      timestamp: '4 hours ago',
      read: true,
    },
  ],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      state.theme = nextTheme;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', nextTheme);
      }
      // Sync document class for Tailwind CSS styling
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
      }
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    addToast: (state, action) => {
      const id = Date.now();
      state.toasts.push({
        id,
        message: action.payload.message,
        type: action.payload.type || 'info', // success, error, warning, info
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
    toggleNotificationSetting: (state, action) => {
      const setting = action.payload; // key like 'churnAlerts'
      if (state.notificationSettings[setting] !== undefined) {
        const nextVal = !state.notificationSettings[setting];
        state.notificationSettings[setting] = nextVal;
        if (typeof window !== 'undefined') {
          localStorage.setItem('notif_' + setting, String(nextVal));
        }
      }
    },
    markNotificationsRead: (state) => {
      state.notifications.forEach(n => {
        n.read = true;
      });
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    addNotification: (state, action) => {
      // payload expects { title, message, type, category, timestamp }
      const id = 'notif-' + Date.now();
      state.notifications.unshift({
        id,
        read: false,
        timestamp: 'Just now',
        ...action.payload
      });
    }
  },
});

export const {
  toggleTheme,
  setTheme,
  addToast,
  removeToast,
  toggleNotificationSetting,
  markNotificationsRead,
  clearAllNotifications,
  addNotification
} = uiSlice.actions;

export default uiSlice.reducer;

