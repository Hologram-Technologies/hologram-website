import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { Link } from "@tanstack/react-router";
import hologramIcon from "@/assets/holo-H-white.png";

export function HologramMark({ className = "" }: { className?: string }) {
  return <img src={hologramIcon} alt="" className={className} />;
}

/**
 * The bar an overlay page wears: it sits in the scroll flow, so nothing ever
 * runs underneath it. Over the dark headline block it is the same near-black
 * and reads as one piece; once that block scrolls past, it turns to white with
 * a hairline and the mark inverts to ink.
 */
export function OverlayBar({
  scrollRef,
  heroRef,
  onClose,
  closeTo,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
  heroRef: RefObject<HTMLElement | null>;
  onClose?: () => void;
  closeTo?: string;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const [light, setLight] = useState(false);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const measure = () => {
      const hero = heroRef.current;
      const barHeight = barRef.current?.offsetHeight ?? 64;
      setLight(hero ? hero.getBoundingClientRect().bottom <= barHeight : false);
    };
    measure();
    scroller.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      scroller.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [scrollRef, heroRef]);

  const closeClass = `inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors sm:h-11 sm:w-11 ${
    light ? "bg-black/80 text-white hover:bg-black" : "bg-white/10 text-white hover:bg-white/20"
  }`;
  const closeIcon = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );

  return (
    <div
      ref={barRef}
      className={`sticky top-0 z-50 flex h-[calc(4rem+env(safe-area-inset-top))] items-center justify-between px-5 pt-[env(safe-area-inset-top)] transition-colors duration-300 sm:px-6 md:px-10 ${
        light
          ? "border-b border-black/10 bg-white/90 backdrop-blur-md"
          : "border-b border-transparent bg-[#0A0A0A]"
      }`}
    >
      <Link
        to="/"
        aria-label="Hologram"
        onClick={onClose}
        className={`flex items-center gap-2 transition-colors ${light ? "text-[#0A0A0A]" : "text-white"}`}
      >
        <HologramMark
          className={`h-8 w-8 shrink-0 transition-[filter] duration-300 sm:h-9 sm:w-9 ${light ? "invert" : ""}`}
        />
        <span className="truncate text-[18px] font-semibold tracking-[0.22em] sm:text-[22px] sm:tracking-[0.28em]">
          HOLOGRAM
        </span>
      </Link>

      {closeTo ? (
        <Link to={closeTo} aria-label="Close" className={closeClass}>
          {closeIcon}
        </Link>
      ) : (
        <button type="button" onClick={onClose} aria-label="Close" className={closeClass}>
          {closeIcon}
        </button>
      )}
    </div>
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


