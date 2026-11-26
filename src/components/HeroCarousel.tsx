import { useEffect, useState } from "react";
import { slides } from "../data/heroSlides";
import { HeroSlide, HeroActions } from "./home/HeroSlide";
import { CarouselControls } from "./home/CarouselControls";
import { Reforminha } from "./home/Reforminha";

export function HeroCarousel() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [playing, setPlaying] = useState(!reduced);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(() => !document.hidden);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => {
      setReduced(media.matches);
      if (media.matches) setPlaying(false);
    };
    const visibility = () => setVisible(!document.hidden);
    media.addEventListener("change", change);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      media.removeEventListener("change", change);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    if (!playing || reduced || hovered || focused || !visible) return;
    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      7500,
    );
    return () => window.clearInterval(timer);
  }, [playing, reduced, hovered, focused, visible]);
  const select = (i: number) => {
    setPlaying(false);
    setIndex((i + slides.length) % slides.length);
  };
  return (
    <section
      aria-label="Destaques do Reforma Clara"
      aria-roledescription="carrossel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
      className="relative flex flex-1 flex-col bg-brand-deep bg-[url(/images/backgrounds/hero.svg)] bg-cover bg-center text-white"
    >
      <h1 className="sr-only">Entenda as mudanças. Prepare sua empresa.</h1>
      <div className="mx-auto my-auto grid w-full min-w-0 max-w-7xl items-center gap-x-8 gap-y-4 px-6 pt-6 sm:px-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:grid-rows-[1fr_auto_auto] md:gap-y-4 md:pt-8 lg:px-12 lg:[@media(max-height:950px)]:gap-y-2 lg:[@media(max-height:950px)]:pt-3 lg:[@media(max-height:800px)]:gap-y-2 lg:[@media(max-height:800px)]:pt-3">
        <div className="min-w-0 self-end">
          <p className="mb-4 inline-flex lg:[@media(max-height:800px)]:mb-2 rounded-full border border-gold px-3 py-1 text-sm font-semibold uppercase tracking-wide text-gold">
            Reforma tributária
          </p>
          <div className="grid min-w-0" aria-live={playing ? "off" : "polite"}>
            {slides.map((slide, i) => (
              <HeroSlide
                key={slide.to}
                slide={slide}
                active={i === index}
                index={i}
              />
            ))}
          </div>
        </div>
        <div className="min-w-0 md:col-start-2 md:row-start-1 md:row-span-3">
          <Reforminha />
        </div>
        <div className="grid min-w-0 md:col-start-1 md:row-start-2">
          {slides.map((slide, i) => (
            <div
              key={slide.to}
              aria-hidden={index !== i}
              inert={index !== i}
              className={
                "col-start-1 row-start-1 min-w-0 self-start " +
                (index === i ? "motion-safe:animate-enter" : "invisible")
              }
            >
              <HeroActions slide={slide} index={i} />
            </div>
          ))}
        </div>
        <div className="min-w-0 md:col-start-1 md:row-start-3">
          <CarouselControls
            index={index}
            count={slides.length}
            reduced={reduced}
            playing={playing}
            onToggle={() => setPlaying((v) => !v)}
            onPrevious={() => select(index - 1)}
            onNext={() => select(index + 1)}
            onSelect={select}
          />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="mt-2 h-9 shrink-0 bg-[url(/images/backgrounds/hero-wave.svg)] bg-size-[100%_100%] bg-no-repeat md:h-14 lg:[@media(max-height:950px)]:h-8 lg:[@media(max-height:800px)]:h-7"
      />
    </section>
  );
}
