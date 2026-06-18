import React from "react";

interface IconProps {
    size?: number;
    className?: string;
    fill?: string;
    style?: React.CSSProperties;
}

export const SearchIcon = ({ size = 16, className = "", style = {} }: IconProps) => (
    <svg 
        viewBox="0 0 24 24" 
        width={size} 
        height={size} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className} 
        style={{ display: "inline-block", verticalAlign: "middle", ...style }}
    >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

export const FlameIcon = ({ size = 16, className = "", style = {} }: IconProps) => (
    <svg 
        viewBox="0 0 24 24" 
        width={size} 
        height={size} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className} 
        style={{ display: "inline-block", verticalAlign: "middle", ...style }}
    >
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
);

export const StarIcon = ({ size = 16, className = "", fill = "currentColor", style = {} }: IconProps) => (
    <svg 
        viewBox="0 0 24 24" 
        width={size} 
        height={size} 
        fill={fill} 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className} 
        style={{ display: "inline-block", verticalAlign: "middle", ...style }}
    >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

export const EyeIcon = ({ size = 16, className = "", style = {} }: IconProps) => (
    <svg 
        viewBox="0 0 24 24" 
        width={size} 
        height={size} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className} 
        style={{ display: "inline-block", verticalAlign: "middle", ...style }}
    >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

export const BookmarkIcon = ({ size = 16, className = "", fill = "none", style = {} }: IconProps) => (
    <svg 
        viewBox="0 0 24 24" 
        width={size} 
        height={size} 
        fill={fill} 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className} 
        style={{ display: "inline-block", verticalAlign: "middle", ...style }}
    >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
);

export const CalendarIcon = ({ size = 16, className = "", style = {} }: IconProps) => (
    <svg 
        viewBox="0 0 24 24" 
        width={size} 
        height={size} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className} 
        style={{ display: "inline-block", verticalAlign: "middle", ...style }}
    >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

export const ChevronLeftIcon = ({ size = 16, className = "", style = {} }: IconProps) => (
    <svg 
        viewBox="0 0 24 24" 
        width={size} 
        height={size} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className} 
        style={{ display: "inline-block", verticalAlign: "middle", ...style }}
    >
        <polyline points="15 18 9 12 15 6" />
    </svg>
);

export const ChevronRightIcon = ({ size = 16, className = "", style = {} }: IconProps) => (
    <svg 
        viewBox="0 0 24 24" 
        width={size} 
        height={size} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className} 
        style={{ display: "inline-block", verticalAlign: "middle", ...style }}
    >
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

export const HeartIcon = ({ size = 16, className = "", fill = "none", style = {} }: IconProps) => (
    <svg 
        viewBox="0 0 24 24" 
        width={size} 
        height={size} 
        fill={fill} 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className} 
        style={{ display: "inline-block", verticalAlign: "middle", ...style }}
    >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

export const BookOpenIcon = ({ size = 16, className = "", style = {} }: IconProps) => (
    <svg 
        viewBox="0 0 24 24" 
        width={size} 
        height={size} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className} 
        style={{ display: "inline-block", verticalAlign: "middle", ...style }}
    >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 1 3-3h7z" />
    </svg>
);

export const SadFaceIcon = ({ size = 32, className = "", style = {} }: IconProps) => (
    <svg 
        viewBox="0 0 24 24" 
        width={size} 
        height={size} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className} 
        style={{ display: "inline-block", verticalAlign: "middle", ...style }}
    >
        <circle cx="12" cy="12" r="10" />
        <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
);

export const ThumbsUpIcon = ({ size = 14, className = "", fill = "none", style = {} }: IconProps) => (
    <svg 
        viewBox="0 0 24 24" 
        width={size} 
        height={size} 
        fill={fill} 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className} 
        style={{ display: "inline-block", verticalAlign: "middle", ...style }}
    >
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
);

export const ThumbsDownIcon = ({ size = 14, className = "", fill = "none", style = {} }: IconProps) => (
    <svg 
        viewBox="0 0 24 24" 
        width={size} 
        height={size} 
        fill={fill} 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className} 
        style={{ display: "inline-block", verticalAlign: "middle", ...style }}
    >
        <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm12-3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
    </svg>
);

export const MessageSquareIcon = ({ size = 14, className = "", style = {} }: IconProps) => (
    <svg 
        viewBox="0 0 24 24" 
        width={size} 
        height={size} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className} 
        style={{ display: "inline-block", verticalAlign: "middle", ...style }}
    >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

export const FlagIcon = ({ size = 14, className = "", fill = "none", style = {} }: IconProps) => (
    <svg 
        viewBox="0 0 24 24" 
        width={size} 
        height={size} 
        fill={fill} 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className} 
        style={{ display: "inline-block", verticalAlign: "middle", ...style }}
    >
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
);

export const TrashIcon = ({ size = 14, className = "", style = {} }: IconProps) => (
    <svg 
        viewBox="0 0 24 24" 
        width={size} 
        height={size} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className} 
        style={{ display: "inline-block", verticalAlign: "middle", ...style }}
    >
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

export const ClockIcon = ({ size = 14, className = "", style = {} }: IconProps) => (
    <svg 
        viewBox="0 0 24 24" 
        width={size} 
        height={size} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className} 
        style={{ display: "inline-block", verticalAlign: "middle", ...style }}
    >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

export const AlertTriangleIcon = ({ size = 14, className = "", style = {} }: IconProps) => (
    <svg 
        viewBox="0 0 24 24" 
        width={size} 
        height={size} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className} 
        style={{ display: "inline-block", verticalAlign: "middle", ...style }}
    >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);
