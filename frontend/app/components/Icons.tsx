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
        <defs>
            <linearGradient id="search-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e94560" />
                <stop offset="100%" stopColor="#ff6b8b" />
            </linearGradient>
        </defs>
        <circle cx="11" cy="11" r="8" fill="url(#search-grad)" fillOpacity="0.15" stroke="url(#search-grad)" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="url(#search-grad)" />
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
        <defs>
            <linearGradient id="flame-grad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#FF4B2B" />
                <stop offset="50%" stopColor="#FF8C00" />
                <stop offset="100%" stopColor="#FFE000" />
            </linearGradient>
        </defs>
        <path 
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" 
            fill="url(#flame-grad)" 
            fillOpacity="0.25"
            stroke="url(#flame-grad)" 
            strokeWidth="2"
        />
        <path 
            d="M12 18.5c.83 0 1.5-.67 1.5-1.5 0-.83-.3-1.2-.6-1.8-.64-1.28-.13-2.43 1.2-3.6.3 1.5 1.2 2.94 2.4 3.9 1.2.96 1.8 2.1 1.8 3.3a4.8 4.8 0 1 1-8.4 0c0-.69.26-1.38.6-1.8.3.4.9.8 1.5.8z" 
            fill="url(#flame-grad)" 
        />
    </svg>
);

export const StarIcon = ({ size = 16, className = "", fill = "currentColor", style = {} }: IconProps) => {
    const isFilled = fill !== "none" && fill !== "transparent";
    return (
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
            <defs>
                <linearGradient id="star-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFE000" />
                    <stop offset="100%" stopColor="#FF8C00" />
                </linearGradient>
            </defs>
            <polygon 
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" 
                fill={isFilled ? "url(#star-grad)" : "transparent"} 
                stroke="url(#star-grad)" 
                strokeWidth="2"
            />
        </svg>
    );
};

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
        <defs>
            <linearGradient id="eye-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00F2FE" />
                <stop offset="100%" stopColor="#4FACFE" />
            </linearGradient>
        </defs>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="url(#eye-grad)" fill="url(#eye-grad)" fillOpacity="0.1" />
        <circle cx="12" cy="12" r="3" fill="url(#eye-grad)" stroke="url(#eye-grad)" />
    </svg>
);

export const BookmarkIcon = ({ size = 16, className = "", fill = "none", style = {} }: IconProps) => {
    const isFilled = fill !== "none" && fill !== "transparent";
    return (
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
            <defs>
                <linearGradient id="bookmark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e94560" />
                    <stop offset="100%" stopColor="#7F00FF" />
                </linearGradient>
            </defs>
            <path 
                d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" 
                fill={isFilled ? "url(#bookmark-grad)" : "url(#bookmark-grad)"} 
                fillOpacity={isFilled ? 0.95 : 0.15}
                stroke="url(#bookmark-grad)" 
            />
        </svg>
    );
};

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
        <defs>
            <linearGradient id="cal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF416C" />
                <stop offset="100%" stopColor="#FF4B2B" />
            </linearGradient>
        </defs>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="url(#cal-grad)" fill="url(#cal-grad)" fillOpacity="0.1" />
        <path d="M3 10h18" stroke="url(#cal-grad)" />
        <line x1="16" y1="2" x2="16" y2="6" stroke="url(#cal-grad)" />
        <line x1="8" y1="2" x2="8" y2="6" stroke="url(#cal-grad)" />
    </svg>
);

export const ChevronLeftIcon = ({ size = 16, className = "", style = {} }: IconProps) => (
    <svg 
        viewBox="0 0 24 24" 
        width={size} 
        height={size} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className} 
        style={{ display: "inline-block", verticalAlign: "middle", ...style }}
    >
        <defs>
            <linearGradient id="chev-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e94560" />
                <stop offset="100%" stopColor="#ff6b8b" />
            </linearGradient>
        </defs>
        <polyline points="15 18 9 12 15 6" stroke="url(#chev-grad)" />
    </svg>
);

export const ChevronRightIcon = ({ size = 16, className = "", style = {} }: IconProps) => (
    <svg 
        viewBox="0 0 24 24" 
        width={size} 
        height={size} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className} 
        style={{ display: "inline-block", verticalAlign: "middle", ...style }}
    >
        <defs>
            <linearGradient id="chev-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e94560" />
                <stop offset="100%" stopColor="#ff6b8b" />
            </linearGradient>
        </defs>
        <polyline points="9 18 15 12 9 6" stroke="url(#chev-grad)" />
    </svg>
);

export const HeartIcon = ({ size = 16, className = "", fill = "none", style = {} }: IconProps) => {
    const isFilled = fill !== "none" && fill !== "transparent";
    return (
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
            <defs>
                <linearGradient id="heart-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF0844" />
                    <stop offset="100%" stopColor="#FFB199" />
                </linearGradient>
            </defs>
            <path 
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
                fill={isFilled ? "url(#heart-grad)" : "url(#heart-grad)"} 
                fillOpacity={isFilled ? 0.95 : 0.15}
                stroke="url(#heart-grad)" 
            />
        </svg>
    );
};

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
        <defs>
            <linearGradient id="book-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#11998e" />
                <stop offset="100%" stopColor="#38ef7d" />
            </linearGradient>
        </defs>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" fill="url(#book-grad)" fillOpacity="0.1" stroke="url(#book-grad)" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 1 3-3h7z" fill="url(#book-grad)" fillOpacity="0.1" stroke="url(#book-grad)" />
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
        <defs>
            <linearGradient id="sad-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8e9eab" />
                <stop offset="100%" stopColor="#eef2f3" />
            </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#sad-grad)" fillOpacity="0.08" stroke="url(#sad-grad)" />
        <path d="M16 16s-1.5-2-4-2-4 2-4 2" stroke="url(#sad-grad)" />
        <line x1="9" y1="9" x2="9.01" y2="9" stroke="url(#sad-grad)" strokeWidth="2" />
        <line x1="15" y1="9" x2="15.01" y2="9" stroke="url(#sad-grad)" strokeWidth="2" />
    </svg>
);

export const ThumbsUpIcon = ({ size = 14, className = "", fill = "none", style = {} }: IconProps) => {
    const isFilled = fill !== "none" && fill !== "transparent";
    return (
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
            <defs>
                <linearGradient id="thumb-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00b0ff" />
                    <stop offset="100%" stopColor="#00e5ff" />
                </linearGradient>
            </defs>
            <path 
                d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" 
                fill={isFilled ? "url(#thumb-grad)" : "url(#thumb-grad)"} 
                fillOpacity={isFilled ? 0.95 : 0.15}
                stroke="url(#thumb-grad)"
            />
        </svg>
    );
};

export const ThumbsDownIcon = ({ size = 14, className = "", fill = "none", style = {} }: IconProps) => {
    const isFilled = fill !== "none" && fill !== "transparent";
    return (
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
            <defs>
                <linearGradient id="thumb-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00b0ff" />
                    <stop offset="100%" stopColor="#00e5ff" />
                </linearGradient>
            </defs>
            <path 
                d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm12-3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" 
                fill={isFilled ? "url(#thumb-grad)" : "url(#thumb-grad)"} 
                fillOpacity={isFilled ? 0.95 : 0.15}
                stroke="url(#thumb-grad)"
            />
        </svg>
    );
};

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
        <defs>
            <linearGradient id="msg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#36D1DC" />
                <stop offset="100%" stopColor="#5B86E5" />
            </linearGradient>
        </defs>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="url(#msg-grad)" fillOpacity="0.15" stroke="url(#msg-grad)" />
    </svg>
);

export const FlagIcon = ({ size = 14, className = "", fill = "none", style = {} }: IconProps) => {
    const isFilled = fill !== "none" && fill !== "transparent";
    return (
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
            <defs>
                <linearGradient id="flag-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f857a6" />
                    <stop offset="100%" stopColor="#ff5858" />
                </linearGradient>
            </defs>
            <path 
                d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" 
                fill={isFilled ? "url(#flag-grad)" : "url(#flag-grad)"} 
                fillOpacity={isFilled ? 0.95 : 0.2}
                stroke="url(#flag-grad)" 
            />
            <line x1="4" y1="22" x2="4" y2="15" stroke="url(#flag-grad)" />
        </svg>
    );
};

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
        <defs>
            <linearGradient id="trash-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff4b1f" />
                <stop offset="100%" stopColor="#ff9068" />
            </linearGradient>
        </defs>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h12z" fill="url(#trash-grad)" fillOpacity="0.15" stroke="url(#trash-grad)" />
        <polyline points="3 6 5 6 21 6" stroke="url(#trash-grad)" />
        <path d="M19 6V4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2" stroke="url(#trash-grad)" />
        <line x1="10" y1="11" x2="10" y2="17" stroke="url(#trash-grad)" />
        <line x1="14" y1="11" x2="14" y2="17" stroke="url(#trash-grad)" />
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
        <defs>
            <linearGradient id="clock-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#02aab0" />
                <stop offset="100%" stopColor="#00cdac" />
            </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#clock-grad)" fillOpacity="0.1" stroke="url(#clock-grad)" />
        <polyline points="12 6 12 12 16 14" stroke="url(#clock-grad)" />
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
        <defs>
            <linearGradient id="alert-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f12711" />
                <stop offset="100%" stopColor="#f5af19" />
            </linearGradient>
        </defs>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="url(#alert-grad)" fillOpacity="0.2" stroke="url(#alert-grad)" />
        <line x1="12" y1="9" x2="12" y2="13" stroke="url(#alert-grad)" strokeWidth="2.5" />
        <line x1="12" y1="17" x2="12.01" y2="17" stroke="url(#alert-grad)" strokeWidth="3" />
    </svg>
);
