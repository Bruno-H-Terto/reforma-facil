import { useId, useLayoutEffect, useRef, useState } from "react";
import { ChevronDown } from "@untitledui/icons";

export function TaxExample({
  acronym,
  description,
  example,
}: {
  acronym: string;
  description: string;
  example: string;
}) {
  const id = useId();
  const [expanded, setExpanded] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!expanded) return;
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    const card = trigger?.closest("article");
    if (!trigger || !panel || !card) return;

    const position = () => {
      const rect = card.getBoundingClientRect();
      const button = trigger.getBoundingClientRect();
      const height = window.innerHeight;
      const gap = 4;
      panel.style.width = rect.width + "px";
      panel.style.left = rect.left + "px";
      panel.style.maxHeight = "none";
      const required =
        panel.scrollHeight + (panel.offsetHeight - panel.clientHeight);
      // Prefer extending the card downwards; flip or constrain only when needed.
      const belowCard = height - rect.bottom - gap - 8;
      const aboveCard = rect.top - gap - 8;
      const belowButton = height - button.bottom - gap - 8;
      const aboveButton = button.top - gap - 8;
      const options = [
        { edge: rect.bottom + gap, space: belowCard, above: false },
        { edge: rect.top - gap, space: aboveCard, above: true },
        { edge: button.bottom + gap, space: belowButton, above: false },
        { edge: button.top - gap, space: aboveButton, above: true },
      ];
      const choice =
        options.find((option) => option.space >= required) ??
        options.reduce((a, b) => (a.space >= b.space ? a : b));
      const available = Math.max(
        0,
        Math.min(required, choice.space, height - 16),
      );
      panel.style.maxHeight = available + "px";
      const top = choice.above ? choice.edge - panel.offsetHeight : choice.edge;
      panel.style.top =
        Math.max(8, Math.min(top, height - panel.offsetHeight - 8)) + "px";
    };
    position();
    const observer = new ResizeObserver(position);
    observer.observe(card);
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    };
  }, [expanded]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        popoverTarget={id}
        aria-expanded={expanded}
        aria-controls={id}
        aria-label={"Ver exemplo de " + acronym}
        className="group mt-3 flex min-h-11 w-full min-w-0 items-center justify-between gap-4 rounded-md text-left text-base font-semibold text-brand transition-colors hover:text-accent"
      >
        <span>Ver exemplo</span>
        <ChevronDown
          aria-hidden="true"
          className="size-5 shrink-0 text-accent transition-transform duration-150 motion-reduce:transition-none group-aria-expanded:rotate-180"
        />
      </button>
      <div
        ref={panelRef}
        id={id}
        popover="auto"
        role="region"
        aria-labelledby={id + "-title"}
        onToggle={(event) => setExpanded(event.newState === "open")}
        className="fixed inset-auto m-0 overflow-auto rounded-xl border border-line bg-surface p-4 shadow-panel sm:p-6"
      >
        <h4 id={id + "-title"} className="sr-only">
          Exemplo de {acronym}
        </h4>
        <p className="text-sm leading-relaxed text-muted">{description}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{example}</p>
      </div>
    </>
  );
}
