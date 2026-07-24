export function Logo({
  className = "",
  streaks: _streaks = false,
  reg = true,
}: {
  className?: string;
  streaks?: boolean;
  reg?: boolean;
}) {
  return (
    <svg
      className={`urc ${className}`}
      viewBox="0 0 300 100"
      role="img"
      aria-label="Ubuntu Run Club"
      fill="currentColor"
      preserveAspectRatio="xMinYMid meet"
    >
      {/* Clean URC lockup based on the supplied white-on-black reference. */}
      <path d="M8 8h29v46c0 12 6 19 18 19s18-7 18-19V8h29v47c0 27-16 39-47 39S8 82 8 55V8Z" />
      <path d="M104 8h65c23 0 36 10 36 28 0 12-7 20-18 24l30 32h-35l-25-28h-25v28h-28V8Zm28 21v16h36c8 0 12-3 12-8s-4-8-12-8h-36Z" />
      <path d="M247 8h45l-14 22h-28c-12 0-19 7-19 20s7 20 19 20h28l14 22h-45c-29 0-45-15-45-42s16-42 45-42Z" />
      {reg && <text x="291" y="12" fontFamily="Arial, sans-serif" fontSize="8" fill="currentColor">®</text>}
    </svg>
  );
}

export function LogoStack({ className = "" }: { className?: string }) {
  return <Logo className={className} reg={false} />;
}

export function ShakeNTossLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`shake-logo ${className}`}
      viewBox="0 0 260 112"
      role="img"
      aria-label="Shake n Toss"
      preserveAspectRatio="xMidYMid meet"
    >
      <g fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" textAnchor="middle" paintOrder="stroke fill">
        <text x="130" y="41" fontSize="38" fill="#319447" stroke="#fff" strokeWidth="4">Shake</text>
        <text x="130" y="76" fontSize="37" fill="#319447" stroke="#fff" strokeWidth="4">n Toss</text>
      </g>
      <path d="M63 86c27 9 71 10 111 1" fill="none" stroke="#319447" strokeWidth="3" strokeLinecap="round" />
      <path d="M171 82c8-8 16-10 25-10-4 7-10 12-18 14" fill="#319447" />
      <text x="130" y="104" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fontStyle="italic" letterSpacing="1.2" fill="#245c2d">Gotta Shake It To Toss It</text>
    </svg>
  );
}
