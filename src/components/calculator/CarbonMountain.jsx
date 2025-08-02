import React from "react";

export default function CarbonMountain({ progress }) {
  // Directly map progress to height for a smooth growth effect
  const mountainHeight = Math.min(progress, 100);
  // Adjust opacity to be subtle but visible from the start
  const mountainOpacity = Math.min(progress / 100 * 0.6, 0.35);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      <div className="absolute bottom-0 left-0 right-0 h-full flex items-end justify-center">
        {/* Single SVG for the mountain shape */}
        <svg
          className="absolute bottom-0 transition-all duration-1000 ease-out"
          style={{
            width: '120%', // Makes the mountain feel broader
            height: `${mountainHeight}%`,
            opacity: mountainOpacity,
          }}
          viewBox="0 0 800 400"
          preserveAspectRatio="xMidYEnd meet"
        >
          <defs>
            <linearGradient id="singleMountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d1d5db" /> 
              <stop offset="100%" stopColor="#9ca3af" />
            </linearGradient>
          </defs>
          {/* A path that creates a single, wide, soft-peaked mountain */}
          <path
            d="M -100,400 L 350,50 Q 400,20 450,50 L 900,400 Z"
            fill="url(#singleMountainGradient)"
          />
        </svg>
      </div>
    </div>
  );
}