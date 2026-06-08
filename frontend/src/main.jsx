import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import store from './store';
import ThemeContext from './components/layout/ThemeContext';
import ErrorBoundary from './components/ui/ErrorBoundary';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <HelmetProvider>
          <ThemeContext>
            <App />
          </ThemeContext>
        </HelmetProvider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);
