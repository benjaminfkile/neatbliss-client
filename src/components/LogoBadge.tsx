interface LogoBadgeProps {
  size?: number;
  showRibbon?: boolean;
  title?: string;
}

export function LogoBadge({
  size = 160,
  showRibbon = true,
  title = "NeatBliss",
}: LogoBadgeProps) {
  const id = `neatbliss-badge-${showRibbon ? "full" : "mini"}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4FA8D8" />
          <stop offset="100%" stopColor="#7FC49A" />
        </linearGradient>
      </defs>

      <circle cx="100" cy="100" r="96" fill="#16345E" />
      <circle cx="100" cy="100" r="86" fill="#FFFFFF" />
      <circle cx="100" cy="100" r="78" fill={`url(#${id}-fill)`} />

      <g transform="translate(60 60)">
        <path
          d="M40 8 L74 34 L74 72 L6 72 L6 34 Z"
          fill="#FFFFFF"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <rect x="56" y="14" width="10" height="14" fill="#FFFFFF" />
        <rect x="32" y="46" width="16" height="18" fill={`url(#${id}-fill)`} />
      </g>

      <g fill="#FFFFFF" opacity="0.85">
        <circle cx="46" cy="60" r="4" />
        <circle cx="152" cy="66" r="3" />
        <circle cx="60" cy="150" r="3" />
        <circle cx="146" cy="146" r="4" />
      </g>

      <g transform="translate(100 158)" fill="#FFFFFF">
        <path d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z" />
      </g>

      {showRibbon && (
        <g>
          <path
            d="M8 100 L192 100 L184 112 L192 124 L8 124 L16 112 Z"
            fill="#16345E"
          />
          <text
            x="100"
            y="118"
            textAnchor="middle"
            fill="#FFFFFF"
            fontFamily="Nunito, sans-serif"
            fontWeight="900"
            fontSize="18"
            letterSpacing="0.5"
          >
            NeatBliss
          </text>
        </g>
      )}
    </svg>
  );
}
