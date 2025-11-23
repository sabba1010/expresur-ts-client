// src/pages/home/Nuestros.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";

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

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, when: "beforeChildren", duration: 0.7 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 190, damping: 22 },
  },
};

const Nuestros: React.FC = () => {
  const getVisibleCount = () => {
    if (typeof window === "undefined") return 4;
    const w = window.innerWidth;
    if (w < 640) return 1;
    if (w < 1024) return 2;
    if (w < 1280) return 3;
    return 4;
  };

  const [visibleCount, setVisibleCount] = useState<number>(getVisibleCount());
  useEffect(() => {
    const onResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // duplicated list for smooth looping
  const loopList = useMemo(() => [...cards, ...cards], []);
  const total = cards.length;

  // index refers to "logical" slide index in [0 .. total-1]
  const [index, setIndex] = useState<number>(0);
  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const goTo = (i: number) => setIndex(() => Math.max(0, Math.min(total - 1, i)));

  // autoplay management
  const autoplayRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);

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

  // keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // layout math — fixed: translate percentage is relative to the inner container width
  const innerSlides = loopList.length; // duplicated length
  const slideWidthInnerPercent = 100 / innerSlides; // each slide width as percent of inner container
  const containerWidthPercent = (innerSlides / visibleCount) * 100; // keep width relative to viewport

  // translate as percent of inner container (this prevents mismatch that caused blank/black gaps)
  const translateXInnerPercent = -(index * slideWidthInnerPercent);

  // pause/resume helpers used by UI events
  const handlePointerEnter = () => (isPausedRef.current = true);
  const handlePointerLeave = () => (isPausedRef.current = false);
  const handleFocusIn = () => (isPausedRef.current = true);
  const handleFocusOut = () => (isPausedRef.current = false);

  const btnClass = (disabled: boolean) =>
    `inline-flex items-center justify-center rounded-full shadow-lg transition ${
      disabled
        ? "opacity-40 pointer-events-none bg-white/10 text-white"
        : "bg-gradient-to-tr from-amber-400 to-amber-500 text-green-900 hover:scale-105"
    } w-12 h-12`;

  // compute which logical indices are currently visible (for aria-hidden and z-index)
  const visibleSet = useMemo(() => {
    const s = new Set<number>();
    for (let k = 0; k < visibleCount; k++) {
      s.add((index + k) % total);
    }
    return s;
  }, [index, visibleCount, total]);

  return (
    <section className="bg-white py-10 mx-auto max-w-[1773px] px-4 sm:px-6 lg:px-8 mt-5">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="relative mx-auto w-full max-w-[1200px] md:max-w-[1400px] rounded-[28px] sm:rounded-[36px] lg:rounded-[43px] shadow-[3px_3px_6px_0_rgba(0,0,0,0.16)] bg-[rgba(4,104,56,1)] text-white p-8 sm:p-10 md:p-12 lg:p-16 overflow-hidden -mt-[10%]"
      >
        <h2 className="z-50 text-center text-5xl font-semibold mb-8 tracking-wide ">
          Nuestros servicios
        </h2>

        <div
          className="relative"
          onMouseEnter={handlePointerEnter}
          onMouseLeave={handlePointerLeave}
          onPointerDown={() => (isPausedRef.current = true)}
          onPointerUp={() => (isPausedRef.current = false)}
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

          {/* VIEWPORT */}
          <div
            className="overflow-hidden w-full max-w-full"
            // allow the viewport to be focusable so keyboard focus pauses autoplay
            tabIndex={0}
            onFocus={handleFocusIn}
            onBlur={handleFocusOut}
            role="region"
            aria-roledescription="carousel"
            aria-label="Nuestros servicios carousel"
          >
            <motion.div
              className="flex items-start gap-6"
              animate={{ x: `${translateXInnerPercent}%` }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              style={{ width: `${containerWidthPercent}%` }}
              role="list"
              aria-live="polite"
            >
              {loopList.map((card, i) => {
                const logicalIndex = i % total;
                const isVisible = visibleSet.has(logicalIndex);
                const slideKey = `${logicalIndex}-${i}`; // ensures uniqueness across the duplicated list

                // compute slide width as percent of the inner container
                const slideWidth = `${100 / loopList.length}%`;

                // compute accessible name if needed
                const imgSrc =
                  typeof card.icon === "string" ? card.icon : (card.icon && (card.icon.src || card.icon.default)) || "";

                return (
                  <motion.div
                    key={slideKey}
                    variants={cardVariants}
                    className="relative flex flex-col justify-between rounded-xl border-2 border-amber-500 p-5 sm:p-6 bg-white/8 backdrop-blur-md shadow-md min-h-[250px] sm:min-h-[270px] lg:min-h-[260px] flex-shrink-0"
                    style={{ width: slideWidth, zIndex: isVisible ? 20 : 10, transition: "z-index 0.2s" }}
                    role="listitem"
                    aria-hidden={!isVisible}
                  >
                    {/* favorite icon — position fixed relative to card */}
                    <button aria-label="Favorito" className="absolute top-3 right-3 text-amber-400 text-xl">
                      ♡
                    </button>

                    <div className="flex justify-center mb-3">
                      <div className="w-[60%] sm:w-40 md:w-44 lg:w-48 aspect-[4/3] flex items-center justify-center">
                        <img
                          src={imgSrc}
                          alt={card.title.replace(/\n/g, " ")}
                          className="object-contain w-full h-full drop-shadow-md"
                        />
                      </div>
                    </div>

                    <h3 className="text-center whitespace-pre-line font-bold mb-1 tracking-wider text-amber-100 text-[clamp(0.9rem,1.6vw,1.2rem)]">
                      {card.title}
                    </h3>

                    <p className="text-center text-green-50/90 px-2 text-[clamp(0.8rem,1.2vw,1rem)] mb-3 leading-relaxed">
                      {card.desc}
                    </p>

                    <div className="flex justify-center mt-auto">
                      <button className="px-6 py-2 rounded-full bg-amber-500 text-green-900 font-bold text-xs shadow-md">
                        VER MÁS
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
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
              className={`w-3 h-3 rounded-full transition ${i === index ? "bg-amber-400 scale-125" : "bg-white/30"}`}
              aria-label={`Ir al slide ${i + 1}`}
              aria-current={i === index}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Nuestros;
