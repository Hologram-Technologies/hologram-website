import { Link } from "@tanstack/react-router";
import hologramIcon from "@/assets/holo-H-white.png";

export function HologramMark({ className = "" }: { className?: string }) {
  return <img src={hologramIcon} alt="" className={className} />;
}

export function OverlayLogo() {
  return (
    <Link
      to="/"
      aria-label="Hologram"
      className="group/logo fixed left-4 top-[calc(env(safe-area-inset-top)+1rem)] z-40 flex items-center gap-2 mix-blend-difference sm:left-6 md:left-10 md:top-8"
    >
      <div className="relative">
        <HologramMark className="h-8 w-8 shrink-0 sm:h-10 sm:w-10 md:h-11 md:w-11" />
        <div className="absolute inset-0 rounded-full bg-signal/30 blur-2xl opacity-0 transition-opacity duration-500 group-hover/logo:opacity-100" />
      </div>
      <span className="truncate text-[18px] font-semibold tracking-[0.22em] text-white transition-all duration-300 group-hover/logo:tracking-[0.32em] sm:text-[24px] sm:tracking-[0.3em] md:text-[30px]">
        HOLOGRAM
      </span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="relative shrink-0 bg-transparent pt-[env(safe-area-inset-top)]">
      <div className="relative mx-auto grid h-14 max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 pt-4 sm:px-6 sm:pt-5 md:px-10">
        <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <HologramMark className="h-8 w-8 shrink-0 text-foreground sm:h-10 sm:w-10 md:h-11 md:w-11" />
          <span className="truncate text-[18px] font-semibold tracking-[0.22em] sm:text-[24px] sm:tracking-[0.3em] md:text-[30px]">
            HOLOGRAM
          </span>
        </Link>
        <nav className="flex shrink-0 items-center">
          <Link
            to="/team"
            className="text-[14px] text-muted-foreground transition-colors hover:text-foreground sm:text-[17px] md:text-[20px] [&.active]:text-foreground"
          >
            Join our team
          </Link>
        </nav>
      </div>
    </header>
  );
}



export function SiteFooter() {
  return (
    <footer className="shrink-0 bg-transparent pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-[1400px] items-center justify-center px-5 py-4 text-center text-[13px] text-muted-foreground sm:px-6 sm:py-5 sm:text-[17px] md:px-10 md:text-[20px]">
        © 2026. Hologram Technologies Inc.
      </div>
    </footer>
  );
}


