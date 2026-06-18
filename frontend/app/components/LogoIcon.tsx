import React from "react";

interface LogoIconProps {
    width?: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
}

export default function LogoIcon({ width = 32, height = 32, className = "", style = {} }: LogoIconProps) {
    return (
        <svg 
            viewBox="0 0 100 100" 
            width={width} 
            height={height} 
            className={className}
            style={{ 
                display: "inline-block", 
                verticalAlign: "middle",
                filter: "drop-shadow(0 4px 12px rgba(124, 92, 252, 0.4))",
                ...style 
            }}
        >
            <defs>
                {/* Glow filter for neon effect */}
                <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#7c5cfc" stopOpacity="0.4" />
                    <stop offset="60%" stopColor="#e94560" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#0a0a0f" stopOpacity="0" />
                </radialGradient>

                {/* Ring border gradient */}
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e94560" />
                    <stop offset="50%" stopColor="#c837ab" />
                    <stop offset="100%" stopColor="#7c5cfc" />
                </linearGradient>

                {/* Light Side Ribbon Gradient */}
                <linearGradient id="lightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff5e62" />
                    <stop offset="100%" stopColor="#e94560" />
                </linearGradient>

                {/* Shadow Side Ribbon Gradient */}
                <linearGradient id="darkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c5cfc" />
                    <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
            </defs>

            {/* Background glowing circle */}
            <circle cx="50" cy="50" r="42" fill="url(#sunGlow)" />

            {/* Glowing ring framing the Logo */}
            <circle cx="50" cy="50" r="44" fill="none" stroke="url(#ringGrad)" strokeWidth="2.5" opacity="0.7" />

            {/* The 3D Folded Origami "M" */}
            {/* Segment 1: Left Outer Leg (Light) */}
            <path d="M 20,75 L 20,50 L 35,25 L 35,60 Z" fill="url(#lightGrad)" />

            {/* Segment 2: Left Inner Fold (Shadow) */}
            <path d="M 35,25 L 50,45 L 50,80 L 35,60 Z" fill="url(#darkGrad)" />

            {/* Segment 3: Right Inner Fold (Light) */}
            <path d="M 50,45 L 65,25 L 65,60 L 50,80 Z" fill="url(#lightGrad)" />

            {/* Segment 4: Right Outer Leg (Shadow) */}
            <path d="M 65,25 L 80,50 L 80,75 L 65,60 Z" fill="url(#darkGrad)" />

            {/* Glowing 4-point magic sparkle in the valley */}
            <path d="M 50,16 Q 50,23 57,23 Q 50,23 50,30 Q 50,23 43,23 Q 50,23 50,16" fill="url(#ringGrad)" />
        </svg>
    );
}
