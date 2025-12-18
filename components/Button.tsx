import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary hover:bg-emerald-600 text-white focus:ring-emerald-400",
    secondary: "bg-secondary hover:bg-blue-600 text-white focus:ring-blue-400",
    danger: "bg-danger hover:bg-red-600 text-white focus:ring-red-400",
    ghost: "bg-transparent hover:bg-gray-700 text-gray-300",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};