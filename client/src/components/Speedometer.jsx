import React from 'react';

const Speedometer = ({ score }) => {
    // Score is 0 to 1. We want 0 to 100.
    const percentage = Math.round(score * 100);

    // Calculate rotation: -90deg (0%) to 90deg (100%)
    // 0% -> -90
    // 50% -> 0
    // 100% -> 90
    const rotation = (percentage / 100) * 180 - 90;

    // Color based on score
    let color = '#10B981'; // Green (Low)
    if (percentage > 30) color = '#F59E0B'; // Yellow (Medium)
    if (percentage > 70) color = '#EF4444'; // Red (High)

    return (
        <div className="relative w-48 h-24 overflow-hidden mx-auto mb-4">
            {/* Background Arch */}
            <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[20px] border-gray-200 box-border"></div>

            {/* Needle */}
            <div
                className="absolute bottom-0 left-1/2 w-1 h-24 bg-gray-800 origin-bottom transition-transform duration-1000 ease-out z-10"
                style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
            ></div>

            {/* Center Dot */}
            <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-gray-800 rounded-full transform -translate-x-1/2 translate-y-1/2 z-20"></div>

            {/* Labels */}
            <div className="absolute bottom-1 left-2 text-xs font-bold text-gray-400">0%</div>
            <div className="absolute bottom-1 right-2 text-xs font-bold text-gray-400">100%</div>

            {/* Colored Segment Overlay (Simplified for CSS) */}
            <div
                className="absolute top-0 left-0 w-48 h-48 rounded-full border-[20px] border-transparent border-t-blue-500 box-border opacity-20"
                style={{ borderColor: color }}
            ></div>
        </div>
    );
};

export default Speedometer;
