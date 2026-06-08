import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Button from './Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-6 text-center">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-rose-500/5 rounded-full blur-[120px]"></div>

          <div className="max-w-md z-10 space-y-6">
            <div className="inline-flex p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl shadow-xl">
              <AlertCircle size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-100">Application Error</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                An unexpected rendering error occurred inside the system console. Click below to return home.
              </p>
            </div>
            {this.state.error && (
              <pre className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-left text-xs font-mono text-rose-400 overflow-auto max-h-40 max-w-full">
                {this.state.error.toString()}
              </pre>
            )}
            <Button
              onClick={this.handleReset}
              variant="indigo"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center gap-2 mx-auto"
            >
              <RotateCcw size={15} />
              <span>Reset & Return Home</span>
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
