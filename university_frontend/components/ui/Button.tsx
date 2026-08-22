import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  isLoading?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  isLoading,
  children,
  icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary: 'bg-[#0400CC] hover:bg-[#030099] text-white shadow-md hover:shadow-lg focus:ring-[#0400CC]',
    secondary: 'bg-[#00001C] hover:bg-[#000030] text-white shadow-md hover:shadow-lg focus:ring-[#00001C]',
    accent: 'bg-[#00B6FF] hover:bg-[#009FE0] text-white shadow-md hover:shadow-lg focus:ring-[#00B6FF]',
    outline: 'border-2 border-[#0400CC] text-[#0400CC] hover:bg-[#0400CC] hover:text-white focus:ring-[#0400CC]',
    ghost: 'text-slate-700 hover:bg-slate-100 focus:ring-slate-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  };

  const combinedClass = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClass}>
        {isLoading && <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />}
        {!isLoading && icon && <span>{icon}</span>}
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClass} disabled={disabled || isLoading} {...props}>
      {isLoading && <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />}
      {!isLoading && icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
