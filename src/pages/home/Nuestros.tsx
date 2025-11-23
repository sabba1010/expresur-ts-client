// src/pages/home/Nuestros.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";

import iconPackage from "../../assets/icon-package.png";
import iconRemesas from "../../assets/icon-remesas.png";
import iconPickup from "../../assets/icon-pickup.png";
import iconConfirm from "../../assets/icon-confirm.png";

type IconType = string | { src?: string } | any;

interface Card {
  title: string;
  desc: string;
  icon: IconType;
}

const cards: Card[] = [
  {
    title: "ENVÍOS\nDE PAQUETES",
    desc:
      "Ismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud",
    icon: iconPackage,
  },
  {
    title: "ENVÍO\nDE REMESAS",
    desc:
      "Ismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wsi enim ad minim veniam, quis nostrud",
    icon: iconRemesas,
  },
  {
    title: "RECOGIDA\nDE PAQUETES",
    desc:
      "Ismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wsi enim ad minim veniam, quis nostrud",
    icon: iconPickup,
  },
  {
    title: "CONFORMAR\nENVÍOS",
    desc:
      "Ismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wsi enim ad minim veniam, quis nostrud",
    icon: iconConfirm,
  },
];

const Nuestros: React.FC = () => {
  // ---------- Responsive visible count ----------
  const getVisibleCount = () => {
    if (typeof window === "undefined") return 1;
    const w = window.innerWidth;
    if (w < 480) return 1; // small phones
    if (w < 768) return 1; // phones
    if (w < 1024) return 2; // tablets
    if (w < 1280) return 3; // small desktop
    return 4; // large desktop
  };

  const [visibleCount, setVisibleCount] = useState<number>(getVisibleCount());
  useEffect(() => {
    const onResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ---------- State & refs ----------
  const total = cards.length;
  const [index, setIndex] = useState<number>(0); // logical index 0..total-1

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  slideRefs.current = [];

  const pushSlideRef = (el: HTMLDivElement | null) => {
    if (el) slideRefs.current.push(el);
  };

  // autoplay
  const autoplayRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);

  // ---------- helpers to scroll/center slide ----------
  const scrollToIndex = (i: number, smooth = true) => {
    const vp = viewportRef.current;
    const slide = slideRefs.current[i];
    if (!vp || !slide) return;
    const vpWidth = vp.clientWidth;
    const slideWidth = slide.clientWidth;
    const left = slide.offsetLeft - (vpWidth - slideWidth) / 2;
    vp.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
  };

  // on index change, scroll to center (mobile) OR align left for multi-visible
  useEffect(() => {
    // clamp index
    const idx = Math.max(0, Math.min(total - 1, index));
    setIndex(idx);
    // center when visibleCount === 1 (mobile)
    // otherwise, scroll so that the first visible item is at left (nice effect)
    if (!viewportRef.current) return;
    if (visibleCount === 1) {
      scrollToIndex(idx, true);
    } else {
      // calculate left such that the first visible is aligned left
      const vp = viewportRef.current;
      const slide = slideRefs.current[idx];
      if (!slide) return;
      const left = slide.offsetLeft;
      vp.scrollTo({ left, behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, visibleCount]);

  // ---------- autoplay ----------
  useEffect(() => {
    const start = () => {
      stop();
      autoplayRef.current = window.setInterval(() => {
        if (!isPausedRef.current) setIndex((i) => (i + 1) % total);
      }, 4000);
    };
    const stop = () => {
      if (autoplayRef.current !== null) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
    start();
    return () => stop();
  }, [total]);

  // ---------- keyboard navigation ----------
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % total);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + total) % total);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [total]);

  // ---------- click handlers ----------
  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const goTo = (i: number) => setIndex(() => Math.max(0, Math.min(total - 1, i)));

  // ---------- update index on manual scroll (so dots / state stay in sync) ----------
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    let raf = 0;
    const onScroll = () => {
      // Avoid updating while programmatic scroll uses smooth behavior (still okay)
      // We'll compute the slide which is most centered in viewport
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const vpCenter = vp.scrollLeft + vp.clientWidth / 2;
        let nearest = 0;
        let nearestDist = Infinity;
        slideRefs.current.forEach((slide, idx) => {
          if (!slide) return;
          const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
          const dist = Math.abs(slideCenter - vpCenter);
          if (dist < nearestDist) {
            nearestDist = dist;
            nearest = idx;
          }
        });
        if (nearest !== index) {
          // Update index but don't trigger another programmatic scroll (we rely on user)
          setIndex(nearest);
        }
      });
    };

    vp.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      vp.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleCount]);

  // ---------- pointer / focus handlers to pause autoplay ----------
  const handlePointerEnter = () => (isPausedRef.current = true);
  const handlePointerLeave = () => (isPausedRef.current = false);
  const handleFocusIn = () => (isPausedRef.current = true);
  const handleFocusOut = () => (isPausedRef.current = false);

  // ---------- button class ----------
  const btnClass = (disabled: boolean) =>
    `inline-flex items-center justify-center rounded-full shadow-lg transition ${
      disabled
        ? "opacity-40 pointer-events-none bg-white/10 text-white"
        : "bg-gradient-to-tr from-amber-400 to-amber-500 text-green-900 hover:scale-105"
    } w-12 h-12`;

  // ---------- compute slide width percent (each slide width relative to viewport) ----------
  // If visibleCount = 1 -> each slide = 100% viewport width
  // If visibleCount = 2 -> each slide = 50%, etc.
  const slideWidthPercent = 100 / visibleCount;

  return (
    <section className="bg-white py-8 mx-auto max-w-[1773px] px-4 sm:px-6 lg:px-8 mt-5">
      <div className="relative mx-auto w-full max-w-[1200px] md:max-w-[1400px] rounded-[28px] sm:rounded-[36px] lg:rounded-[43px] shadow-[3px_3px_6px_0_rgba(0,0,0,0.16)] bg-[rgba(4,104,56,1)] text-white p-6 sm:p-10 md:p-12 lg:p-16 overflow-visible -mt-[10%]">
        <h2 className="z-50 text-center text-4xl sm:text-5xl font-semibold mb-6 sm:mb-8 tracking-wide ">
          Nuestros servicios
        </h2>

        <div
          className="relative"
          onMouseEnter={handlePointerEnter}
          onMouseLeave={handlePointerLeave}
          onFocus={handleFocusIn}
          onBlur={handleFocusOut}
        >
          {/* Prev */}
          <button
            aria-label="Previous"
            onClick={prev}
            className={`${btnClass(false)} hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20`}
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>

          {/* VIEWPORT — use scroll-snap for centering on mobile */}
          <div
            ref={viewportRef}
            className="w-full overflow-x-auto no-scrollbar"
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Nuestros servicios carousel"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollSnapType: "x mandatory",
              // hide native scrollbars via CSS utility 'no-scrollbar' (ensure you have it or add)
            }}
          >
            <div
              className="flex items-start gap-4"
              style={{
                // width is implicitly controlled by children; but set minWidth to ensure each slide size
                // We'll set each slide's flexBasis to `slideWidthPercent%` so that for visibleCount=1 it's full-width.
              }}
            >
              {cards.map((card, i) => {
                const imgSrc =
                  typeof card.icon === "string" ? card.icon : (card.icon && (card.icon.src || card.icon.default)) || "";

                return (
                  <div
                    key={i}
                    ref={pushSlideRef}
                    className="relative flex flex-col justify-between rounded-xl border-2 border-amber-500 p-4 sm:p-6 bg-white/8 backdrop-blur-md shadow-md min-h-[240px] sm:min-h-[260px] flex-shrink-0"
                    style={{
                      flex: `0 0 ${slideWidthPercent}%`,
                      maxWidth: `${slideWidthPercent}%`,
                      scrollSnapAlign: visibleCount === 1 ? "center" : "start",
                      transition: "transform 280ms ease, box-shadow 280ms ease",
                    }}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`Slide ${i + 1} of ${total}`}
                  >
                    {/* Favorite icon — hidden on mobile */}
                    <button aria-label="Favorito" className="absolute top-3 right-3 text-amber-400 text-lg hidden sm:block">
                      ♡
                    </button>

                    <div className="flex justify-center mb-3">
                      <div className="w-[70%] sm:w-40 md:w-44 lg:w-48 aspect-[4/3] flex items-center justify-center">
                        <img src={imgSrc} alt={card.title.replace(/\n/g, " ")} className="object-contain w-full h-full drop-shadow-md" />
                      </div>
                    </div>

                    <h3 className="text-center whitespace-pre-line font-bold mb-2 tracking-wider text-amber-100 text-[clamp(0.9rem,1.6vw,1.15rem)]">
                      {card.title}
                    </h3>

                    <p className="text-center text-green-50/90 px-2 text-[clamp(0.78rem,1.1vw,0.98rem)] mb-3 leading-relaxed">
                      {card.desc}
                    </p>

                    {/* VER MÁS — hidden on mobile */}
                    <div className="flex justify-center mt-auto hidden sm:flex">
                      <button className="px-5 py-2 rounded-full bg-amber-500 text-green-900 font-bold text-xs shadow-md">
                        VER MÁS
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next */}
          <button
            aria-label="Next"
            onClick={next}
            className={`${btnClass(false)} hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20`}
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Dots (mobile only) */}
        <div className="mt-6 flex justify-center gap-2 md:hidden" role="tablist" aria-label="Seleccionar slide">
          {cards.map((_, i) => (
            <button
              key={`dot-${i}`}
              onClick={() => goTo(i)}
              className={`w-3 h-3 rounded-full transition-transform duration-200 ${i === index ? "bg-amber-400 scale-125" : "bg-white/30"}`}
              aria-label={`Ir al slide ${i + 1}`}
              aria-current={i === index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Nuestros;
