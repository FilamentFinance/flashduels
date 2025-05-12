import { cn } from '@/shadcn/lib/utils';
import React from 'react';

const Arc: React.FC<{
  percentage: number;
  color: string;
  label: string;
  labelClassName?: string;
}> = ({ percentage, color, label, labelClassName }) => {
  const size = 80;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  // Semicircle arc
  const arcLength = Math.PI * radius;
  const dashArray = arcLength;
  const dashOffset = arcLength * (1 - Math.abs(percentage) / 100);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 1.2} viewBox={`0 0 ${size} ${size / 1.2}`}>
        {/* Background arc */}
        <path
          d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
          fill="none"
          stroke="#23272b"
          strokeWidth={strokeWidth}
        />
        {/* Foreground arc */}
        <path
          d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
        {/* Percentage label inside arc */}
        <text
          x={center}
          y={center - 5}
          textAnchor="middle"
          fill={color}
          fontSize="15"
          fontWeight="bold"
          fontFamily="inherit"
        >
          {Math.abs(percentage)}%
        </text>
      </svg>
      <span className={cn('text-xs font-medium', labelClassName)} style={{ color }}>
        Sentiment
      </span>
    </div>
  );
};

export default Arc; 