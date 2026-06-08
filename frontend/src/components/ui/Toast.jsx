import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../../store/uiSlice';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export const ToastContainer = () => {
  const toasts = useSelector((state) => state.ui.toasts);
  const dispatch = useDispatch();

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={(id) => dispatch(removeToast(id))} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const styles = {
    success: 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300',
    error: 'bg-rose-950/90 border-rose-500/30 text-rose-300',
    warning: 'bg-amber-950/90 border-amber-500/30 text-amber-300',
    info: 'bg-indigo-950/90 border-indigo-500/30 text-indigo-300',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    info: <Info className="w-5 h-5 text-indigo-400" />,
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 border rounded-2xl shadow-2xl backdrop-blur-md transition-all duration-300 animate-slide-in ${styles[toast.type]}`}
    >
      <div className="shrink-0">{icons[toast.type]}</div>
      <div className="flex-1 text-xs font-medium leading-relaxed">{toast.message}</div>
      <button
        onClick={() => onClose(toast.id)}
        className="shrink-0 p-0.5 rounded-lg hover:bg-white/10 text-current/60 hover:text-current transition-colors cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default ToastContainer;
