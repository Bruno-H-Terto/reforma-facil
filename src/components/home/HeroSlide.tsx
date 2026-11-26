import { Link } from "react-router-dom";
import { ArrowRight, Calculator, Play } from "@untitledui/icons";
import { goldButton, outlineDark } from "../ui";
import type { slides } from "../../data/heroSlides";

type Slide = (typeof slides)[number];
export function HeroSlide({
  slide,
  active,
  index,
}: {
  slide: Slide;
  active: boolean;
  index: number;
}) {
  return (
    <div
      aria-hidden={!active}
      inert={!active}
      className={
        "col-start-1 row-start-1 min-w-0 self-center " +
        (active ? "motion-safe:animate-enter" : "invisible")
      }
    >
      <h2 className="max-w-2xl text-display font-bold tracking-tight lg:[@media(max-height:800px)]:text-[clamp(2.125rem,3.25vw,2.75rem)]">
        {index === 0 ? (
          <>
            <span className="block">Entenda a</span>
            <span className="block">Reforma Tributária</span>
          </>
        ) : (
          <span className="block">{slide.title}</span>
        )}
        <span className="block italic text-gold">{slide.highlight}</span>
      </h2>
      <p className="mt-4 lg:[@media(max-height:800px)]:mt-2 max-w-xl text-base leading-relaxed text-on-dark lg:text-[17px]">
        {slide.text}
      </p>
    </div>
  );
}
export function HeroActions({ slide, index }: { slide: Slide; index: number }) {
  return (
    <div className="grid min-w-0 gap-3 sm:flex sm:flex-wrap" key={slide.to}>
      <Link to={slide.to} className={goldButton}>
        {index === 0 ? (
          <Play className="size-5 shrink-0" aria-hidden="true" />
        ) : (
          <ArrowRight className="size-5 shrink-0" aria-hidden="true" />
        )}
        <span className="min-w-0">{slide.action}</span>
      </Link>
      {index === 0 && (
        <Link to="/simulador" className={outlineDark}>
          <Calculator className="size-5 shrink-0" aria-hidden="true" />
          Simular cenários
        </Link>
      )}
    </div>
  );
}
