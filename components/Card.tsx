import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-lg ${className}`}>
      {title && <h3 className="text-gray-400 text-sm uppercase tracking-wider font-bold mb-4">{title}</h3>}
      {children}
    </div>
  );
};