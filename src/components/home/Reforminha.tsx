/**
 * Approved hero composition: the Reforminha is dominant. The small,
 * translucent institutional building supports the Brazil growth map behind it.
 * Both are editorial accents, not a second hero illustration.
 */
export function Reforminha() {
  return (
    <figure className="relative isolate mx-auto aspect-[1.32] w-full min-w-0 max-w-[34rem] md:aspect-[1.36] lg:[@media(max-height:800px)]:max-w-[24rem]">
      <div
        aria-hidden="true"
        className="absolute inset-[9%_4%_5%_9%] -z-10 rounded-full bg-cyan-300/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[1.5%] left-[5%] -z-10 h-[9%] w-[92%] rounded-[100%] bg-brand-deep/30"
      />
      <img
        src="/images/mascot/reforminha-hero.webp"
        alt="Reforminha, mascote da reforma tributária"
        width={600}
        height={800}
        loading="eager"
        fetchPriority="high"
        className="absolute bottom-[1%] left-[4%] z-20 h-[98%] w-[61%] object-contain object-bottom drop-shadow-lg"
      />
      <div
        aria-hidden="true"
        className="absolute right-[1%] top-[4%] z-30 w-[43%] -rotate-3 rounded-[44%_42%_38%_42%] border-2 border-brand bg-white px-2 py-[4%] text-center shadow-lg before:absolute before:-bottom-2 before:left-[10%] before:size-4 before:skew-y-[-35deg] before:border-b-2 before:border-l-2 before:border-brand before:bg-white"
      >
        <span className="relative block text-[clamp(0.9rem,2.1vw,1.8rem)] font-bold italic tracking-tight text-brand-deep lg:[@media(max-height:800px)]:text-lg">
          Reforminha
        </span>
        <span className="mx-auto mt-1 block h-1 w-4/5 rounded-full bg-gold" />
      </div>
      {/* Institutional building: background element, above the Brazil silhouette. */}
      <img
        aria-hidden="true"
        src="/images/hero-institution.svg"
        alt=""
        width={210}
        height={166}
        className="absolute right-[8%] top-[37%] z-0 w-[25%] opacity-55"
      />
      {/* Brazil map: anchored lower than the institution, as in the mockup. */}
      <img
        aria-hidden="true"
        src="/images/mascot/brasil.webp"
        alt=""
        width={440}
        height={395}
        className="absolute bottom-[3%] right-[4%] z-10 w-[33%] object-contain"
      />
    </figure>
  );
}
