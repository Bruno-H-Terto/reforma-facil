import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { glossary } from "../../data/content";

const definitions = new Map(
  glossary.map(([term, meaning]) => [term.toLowerCase(), meaning]),
);
const aliases: Record<string, string> = {
  is: "imposto seletivo",
  "créditos tributários": "crédito tributário",
};
const terms = [...definitions.keys(), ...Object.keys(aliases)].sort(
  (a, b) => b.length - a.length,
);
const pattern = new RegExp(
  "(?<![\\p{L}\\p{N}])(" + terms.join("|") + ")(?![\\p{L}\\p{N}])",
  "giu",
);

function GlossaryInfo({ term, meaning }: { term: string; meaning: string }) {
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pinned = useRef(false);
  const [open, setOpen] = useState(false);
  const cancel = () => clearTimeout(timer.current);
  const position = () => {
    const anchor = button.current;
    const el = panel.current;
    if (!anchor || !el || !el.matches(":popover-open")) return;
    const rect = anchor.getBoundingClientRect();
    const width = el.offsetWidth;
    const height = el.offsetHeight;
    el.style.left =
      Math.max(
        8,
        Math.min(
          rect.left + rect.width / 2 - width / 2,
          innerWidth - width - 8,
        ),
      ) + "px";
    el.style.top =
      Math.max(
        8,
        Math.min(
          rect.top >= height + 16 ? rect.top - height - 8 : rect.bottom + 8,
          innerHeight - height - 8,
        ),
      ) + "px";
  };
  const show = () => {
    cancel();
    const el = panel.current;
    if (el && !el.matches(":popover-open")) el.showPopover();
    position();
  };
  const hide = () => {
    cancel();
    pinned.current = false;
    const el = panel.current;
    if (el?.matches(":popover-open")) el.hidePopover();
  };
  const scheduleHide = () => {
    cancel();
    if (!pinned.current && !button.current?.matches(":focus-visible"))
      timer.current = setTimeout(hide, 180);
  };
  useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => {
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    };
  }, [open]);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <>
      <button
        ref={button}
        type="button"
        aria-label={"Significado de " + term}
        aria-describedby={id}
        aria-expanded={open}
        aria-controls={id}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") show();
        }}
        onPointerLeave={scheduleHide}
        onFocus={(e) => {
          if (e.currentTarget.matches(":focus-visible")) show();
        }}
        onBlur={() => {
          if (!pinned.current) scheduleHide();
          else hide();
        }}
        onClick={() => {
          if (pinned.current) hide();
          else {
            pinned.current = true;
            show();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") hide();
        }}
        className="inline cursor-help border-0 bg-transparent p-0 text-inherit underline decoration-dotted decoration-1 underline-offset-[0.2em] hover:decoration-solid focus-visible:rounded-sm"
      >
        {term}
      </button>
      {createPortal(
        <span
          ref={panel}
          id={id}
          popover="auto"
          role="tooltip"
          onToggle={(e) => {
            const next = e.newState === "open";
            setOpen(next);
            if (!next) {
              pinned.current = false;
              cancel();
            } else position();
          }}
          onPointerEnter={cancel}
          onPointerLeave={scheduleHide}
          className="fixed inset-auto m-0 w-[min(19rem,calc(100vw-16px))] max-h-[calc(100dvh-16px)] overflow-auto whitespace-normal rounded-lg border border-line bg-brand-deep px-3 py-2.5 text-left text-sm font-normal leading-relaxed text-white shadow-lg"
        >
          {meaning}
        </span>,
        document.body,
      )}
    </>
  );
}

/** Mark only concepts introduced at this location, once per passage. */
export function GlossaryText({
  text,
  introduce,
}: {
  text: string;
  introduce: readonly string[];
}) {
  const allowed = new Set(
    introduce.map((term) => {
      const key = term.toLowerCase();
      return aliases[key] ?? key;
    }),
  );
  return (
    <>
      {text.split(pattern).map((part, index) => {
        const key = part.toLowerCase();
        const canonical = aliases[key] ?? key;
        const definition = definitions.get(canonical);
        if (!definition || !allowed.has(canonical)) return part;
        allowed.delete(canonical);
        return <GlossaryInfo key={index} term={part} meaning={definition} />;
      })}
    </>
  );
}
