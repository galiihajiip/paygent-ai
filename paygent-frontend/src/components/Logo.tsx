interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function Logo({
  size = 36,
  showText = true,
  className,
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <circle cx="20" cy="20" r="20" fill="#2563EB" />
        <path
          d="M13 10 L13 30 M13 10 L22 10 Q28 10 28 16 Q28 22 22 22 L13 22"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path d="M30 8 L31.2 11 L34 8 L31.2 5 Z" fill="#93C5FD" />
        <circle cx="33" cy="13" r="1" fill="#DBEAFE" />
        <circle cx="27" cy="6" r="1.2" fill="#BFDBFE" />
      </svg>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC] text-lg tracking-tight">
            PayGent
          </span>
          <span className="text-[#64748B] dark:text-[#94A3B8] text-[10px] font-medium tracking-wide uppercase">
            Auto-Biller AI
          </span>
        </div>
      )}
    </div>
  );
}
