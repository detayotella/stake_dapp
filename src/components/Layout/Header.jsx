import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid" style={{ borderColor: "var(--border-color)", background: "var(--card-background)", padding: "1rem 2.5rem", position: "sticky", top: 0, zIndex: 10 }}>
      <div className="flex items-center gap-3 text-[var(--text-color)]">
        <div className="size-8 text-[var(--primary-color)]">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
            <path d="M4 44H44" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 36V28" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 36V20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M24 36V12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M32 36V20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M40 36V4" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 className="text-[var(--text-color)] text-xl font-bold" style={{ letterSpacing: "-0.015em" }}>
          Ìdàgbàsókè
        </h2>
      </div>

      <div className="flex items-center gap-4">
          <ConnectButton/>
      </div>
    </header>
  );
}
