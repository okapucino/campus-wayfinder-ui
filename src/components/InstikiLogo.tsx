import React from 'react';

interface InstikiLogoProps {
  variant?: 'mark' | 'full';
  className?: string;
}

export const InstikiLogo: React.FC<InstikiLogoProps> = ({
  variant = 'mark',
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {/* Official INSTIKI Eagle-Checkmark Emblem */}
      <svg
        viewBox="0 0 100 72"
        className="w-7 h-5 shrink-0"
        aria-label="Logo INSTIKI"
      >
        {/* Lower-left deep crimson wing */}
        <polygon points="6,20 51,45 60,67" fill="#8F0000" />
        {/* Upper-left crimson wing */}
        <polygon points="6,20 51,32 51,45" fill="#BA0000" />
        {/* Upper-right gold-amber wedge */}
        <polygon points="51,32 95,4 51,45" fill="#FFA000" />
        {/* Main right bright red wing */}
        <polygon points="51,45 95,4 60,67" fill="#F70000" />
        {/* White eagle head silhouette */}
        <path
          d="M 51,32 L 36,32 L 35,33.5 L 30.5,34.2 L 28,37.8 L 31.5,37.3 L 35,38.8 L 51,45 Z"
          fill="#FFFFFF"
        />
      </svg>

      {variant === 'full' && (
        <div className="leading-none">
          <span className="font-extrabold tracking-tight text-[#162552] text-sm block">
            INSTIKI
          </span>
          <span className="text-[6.5px] font-bold tracking-wider text-slate-600 uppercase block mt-0.5">
            Institut Bisnis dan Teknologi Indonesia
          </span>
        </div>
      )}
    </div>
  );
};
