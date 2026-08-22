import React from 'react';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  light?: boolean;
  className?: string;
}

export function SectionHeader({
  badge,
  title,
  subtitle,
  align = 'center',
  light = false,
  className = '',
}: SectionHeaderProps) {
  const alignStyles = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  };

  return (
    <div className={`flex flex-col max-w-3xl mb-12 sm:mb-16 ${alignStyles[align]} ${className}`}>
      {badge && (
        <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3 ${
          light ? 'bg-white/15 text-[#00B6FF] border border-white/20' : 'bg-[#0400CC]/10 text-[#0400CC] border border-[#0400CC]/20'
        }`}>
          {badge}
        </span>
      )}
      <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold tracking-tight leading-tight ${
        light ? 'text-white' : 'text-[#00001C]'
      }`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-sm sm:text-base md:text-lg leading-relaxed ${
          light ? 'text-slate-300' : 'text-[#62748E]'
        }`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
