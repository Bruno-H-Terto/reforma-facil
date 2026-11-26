import { ChevronLeft, ChevronRight } from "@untitledui/icons";
type Props = {
  index: number;
  count: number;
  reduced: boolean;
  playing: boolean;
  onToggle: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
};
const control =
  "grid size-10 shrink-0 place-items-center rounded-full border border-white/70 hover:bg-white/15 active:bg-white/25";
export function CarouselControls({
  index,
  count,
  reduced,
  playing,
  onToggle,
  onPrevious,
  onNext,
  onSelect,
}: Props) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2 pt-1 sm:gap-3">
      <button
        type="button"
        onClick={onToggle}
        disabled={reduced}
        aria-label={
          playing
            ? "Pausar reprodução automática"
            : "Iniciar reprodução automática"
        }
        className="min-h-10 rounded-full border border-white/70 px-4 text-sm font-semibold hover:bg-white/15 disabled:opacity-70"
      >
        {playing ? "Pausar" : "Iniciar"}
      </button>
      <button
        type="button"
        onClick={onPrevious}
        aria-label="Destaque anterior"
        className={control}
      >
        <ChevronLeft className="size-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label="Próximo destaque"
        className={control}
      >
        <ChevronRight className="size-5" aria-hidden="true" />
      </button>
      <div className="flex items-center gap-1">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={"Ver destaque " + (i + 1)}
            aria-current={i === index ? "true" : undefined}
            className="grid size-8 place-items-center rounded-full"
          >
            <span
              className={
                "h-2.5 rounded-full " +
                (i === index ? "w-6 bg-gold" : "w-2.5 bg-white/80")
              }
            />
          </button>
        ))}
      </div>
    </div>
  );
}
