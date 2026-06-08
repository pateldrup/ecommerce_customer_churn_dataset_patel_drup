import React from 'react';

export const Card = ({ children, title, subtitle, className = '', headerAction, ...props }) => {
  return (
    <div
      className={`bg-white/70 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl/10 transition-all duration-300 ${className}`}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between mb-5 border-b border-slate-200/80 dark:border-slate-700/30 pb-3">
          <div>
            {title && <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>}
            {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Card;
