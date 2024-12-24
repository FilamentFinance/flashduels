import React from 'react';

interface CircularProgressBarProps {
  percentage: number; // Value between 0 and 100
  size?: number; // Diameter of the circle
  strokeWidth?: number; // Thickness of the progress stroke
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  percentage,
  size = 60,
  strokeWidth = 5,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference =  Math.PI * radius;
  const progress = (percentage / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#2d2d2d" // Dark background color
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#95DE64" // Green color
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`} // Rotate to start at top
        />
      </svg>
      {/* Percentage and Label */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: size * 0.2,
            fontWeight: 'bold',
            color: '#95DE64',
          }}
        >
          {percentage}%
        </div>
        <div
          style={{
            fontSize: size * 0.12,
            color: '#b0b0b0', // Grey text color
          }}
        >
          Chance
        </div>
      </div>
    </div>
  );
};

export default CircularProgressBar;
