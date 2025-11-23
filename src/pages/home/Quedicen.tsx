import React, { useEffect, useMemo, useRef, useState } from "react";
import Avatar from "./../../assets/medium-shot-smiley-woman-with-crossed-arms (1).png";

interface Testimonial {
  text: string;
  name: string;
  role: string;
  avatar: string;
}

const AUTO_MS = 4000;
const TRANSITION_MS = 550;

const Quedicen: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      text:
        "rápidos, económicos y seguros Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat..... ",
      name: "Karen",
      role: "Lorem ipsum dolor",
      avatar: Avatar,
    },
    {
      text:
        "rápidos, económicos y seguros Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat..... ",
      name: "Karen",
      role: "Lorem ipsum dolor",
      avatar: Avatar,
    },
    {
      text:
        "rápidos, económicos y seguros Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat..... ",
      name: "Karen",
      role: "Lorem ipsum dolor",
      avatar: Avatar,
    },
    {
      text:
        "rápidos, económicos y seguros Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat..... ",
      name: "Karen",
      role: "Lorem ipsum dolor",
      avatar: Avatar,
    },
    {
      text:
        "rápidos, económicos y seguros Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat..... ",
      name: "Karen",
      role: "Lorem ipsum dolor",
      avatar: Avatar,
    },
    {
      text:
        "rápidos, económicos y seguros Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat..... ",
      name: "Karen",
      role: "Lorem ipsum dolor",
      avatar: Avatar,
    },
  ];

  // responsive visible count
  const getVisibleCount = () => {
    if (typeof window === "undefined") return 3;
    const w = window.innerWidth;
    if (w < 640) return 1;
    if (w < 1024) return 2;
    return 3;
  };

  const [visibleCount, setVisibleCount] = useState<number>(getVisibleCount());
  useEffect(() => {
    const onResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // duplicate list for smooth visual loop
  const loopList = useMemo(() => [...testimonials, ...testimonials], [testimonials]);
  const innerSlides = loopList.length; // duplicated length

  // refs for rAF-driven autoplay & DOM transforms
  const innerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastAdvanceRef = useRef<number>(performance.now());
  const indexRef = useRef<number>(0); // holds current index (0..n-1)
  const isAnimatingRef = useRef(false);

  // state only used to trigger UI updates for dots and accessibility (not for driving autoplay)
  const [indexState, setIndexState] = useState<number>(0);

  const slideWidthInnerPercent = 100 / innerSlides;
  const containerWidthPercent = (innerSlides / visibleCount) * 100;

  // respects user reduced motion preference
  const prefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // apply transform directly on the DOM element (no React render)
  const applyTransform = (idx: number, animate = true) => {
    const el = innerRef.current;
    if (!el) return;
    const translate = -(idx * slideWidthInnerPercent);
    if (animate) {
      el.style.transition = `transform ${TRANSITION_MS}ms ease-in-out`;
    } else {
      el.style.transition = "none";
    }
    el.style.transform = `translateX(${translate}%)`;
  };

  // utility to set index (updates ref + visible state)
  const setIndexDirect = (i: number, animate = true) => {
    indexRef.current = ((i % testimonials.length) + testimonials.length) % testimonials.length; // normalized
    setIndexState(indexRef.current);
    applyTransform(indexRef.current, animate);
  };

  // manual controls (update refs and reset timer)
  const next = () => {
    const nextI = (indexRef.current + 1) % testimonials.length;
    setIndexDirect(nextI, true);
    lastAdvanceRef.current = performance.now();
  };
  const prev = () => {
    const prevI = (indexRef.current - 1 + testimonials.length) % testimonials.length;
    setIndexDirect(prevI, true);
    lastAdvanceRef.current = performance.now();
  };
  const goTo = (i: number) => {
    setIndexDirect(i, true);
    lastAdvanceRef.current = performance.now();
  };

  // rAF autoplay loop - uses refs only (so hover or React re-renders don't affect timing)
  useEffect(() => {
    if (prefersReduced) {
      // accessibility: disable autoplay if user prefers reduced motion
      return;
    }

    lastAdvanceRef.current = performance.now();

    const loop = (now: number) => {
      // if currently animating, skip until transition finishes
      if (!isAnimatingRef.current) {
        const elapsed = now - lastAdvanceRef.current;
        if (elapsed >= AUTO_MS) {
          // advance one slide
          const nextI = (indexRef.current + 1) % testimonials.length;
          isAnimatingRef.current = true;
          // apply animation
          setIndexDirect(nextI, true);
          lastAdvanceRef.current = now;
          // clear anim flag after transition ends
          window.setTimeout(() => {
            isAnimatingRef.current = false;
            // ensure transition cleared
            if (innerRef.current) innerRef.current.style.transition = "";
          }, TRANSITION_MS + 20);
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testimonials.length, slideWidthInnerPercent, visibleCount, prefersReduced]);

  // initial layout (no animation)
  useEffect(() => {
    applyTransform(indexRef.current, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleCount, innerSlides]);

  // optional: keep transform in sync when tab becomes visible again
  useEffect(() => {
    const handler = () => {
      // when coming back to the tab ensure transform matches indexRef
      applyTransform(indexRef.current, false);
      lastAdvanceRef.current = performance.now();
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  return (
    <div className="w-full bg-[#026432] overflow-hidden py-10">
      <h2
        className="
          text-[rgba(243,243,243,1)] font-bold 
          lg:text-[64px] md:text-[48px] text-3xl
          leading-tight tracking-wide text-center max-w-7xl mx-auto mb-10 px-4
        "
      >
        ¿Qué dicen nuestros clientes?
      </h2>

      <div className="relative w-full flex items-center justify-center px-4">
        {/* LEFT ARROW */}
        <button
          onClick={prev}
          aria-label="Previous testimonials"
          className="absolute left-3 text-orange-400 text-4xl cursor-pointer z-10 hidden md:flex items-center justify-center"
        >
          ❮
        </button>

        {/* VIEWPORT */}
        <div className="overflow-hidden w-full max-w-7xl">
          {/* inner / wide container */}
          <div
            ref={innerRef}
            className="flex items-start gap-10 will-change-transform"
            style={{
              width: `${containerWidthPercent}%`,
              // transition & transform managed in applyTransform
              // ensure smoothing: hardware acceleration hint
              transform: `translateX(${-(indexRef.current * slideWidthInnerPercent)}%)`,
            }}
          >
            {loopList.map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-start mx-auto"
                style={{ width: `${slideWidthInnerPercent}%` }}
              >
                {/* Card */}
                <div className="mx-auto w-full flex justify-center">
                  <div
                    className="relative bg-white rounded-[18px] shadow-md"
                    style={{
                      width: "min(92%, 380px)",
                      padding: "22px",
                    }}
                  >
                    <p
                      className="text-left text-gray-800"
                      style={{
                        fontSize: "clamp(13px, 1.3vw, 16px)",
                        lineHeight: "1.5",
                      }}
                    >
                      {item.text}
                    </p>

                    <div className="flex text-orange-400 text-xl mt-4">★★★★★</div>

                    <div
                      aria-hidden
                      className="absolute"
                      style={{
                        width: 14,
                        height: 14,
                        background: "white",
                        left: 32,
                        bottom: -7,
                        transform: "rotate(45deg)",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                        borderRadius: 2,
                      }}
                    />
                  </div>
                </div>

                {/* Avatar row */}
                <div className="flex items-center gap-3 mt-6 mx-auto w-full" style={{ maxWidth: 380 }}>
                  <img
                    src={item.avatar}
                    alt={`${item.name} avatar`}
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-full object-cover border border-[#707070] shadow-lg flex-shrink-0"
                  />
                  <div className="flex flex-col items-start">
                    <h3 className="text-white text-base md:text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-300 text-sm">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT ARROW */}
        <button
          onClick={next}
          aria-label="Next testimonials"
          className="absolute right-3 text-orange-400 text-4xl cursor-pointer z-10 hidden md:flex items-center justify-center"
        >
          ❯
        </button>
      </div>

      {/* DOTS */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: testimonials.length }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full ${i === indexState ? "bg-white" : "bg-gray-400/60"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Quedicen;
