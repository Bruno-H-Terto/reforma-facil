import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

/** Ajuda contextual acessível por hover, foco, toque e Escape. */
export function FieldInfo({ label, text }: { label: string; text: string }) {
  const id = useId();
  const anchor = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pinned = useRef(false);
  const [open, setOpen] = useState(false);
  const cancel = () => clearTimeout(timer.current);
  const position = () => {
    const button = anchor.current;
    const tooltip = panel.current;
    if (!button || !tooltip || !tooltip.matches(":popover-open")) return;
    const rect = button.getBoundingClientRect();
    const width = tooltip.offsetWidth;
    const height = tooltip.offsetHeight;
    tooltip.style.left =
      Math.max(8, Math.min(rect.left + rect.width / 2 - width / 2, innerWidth - width - 8)) + "px";
    tooltip.style.top =
      Math.max(8, Math.min(rect.top >= height + 16 ? rect.top - height - 8 : rect.bottom + 8, innerHeight - height - 8)) + "px";
  };
  const show = () => {
    cancel();
    const tooltip = panel.current;
    if (tooltip && !tooltip.matches(":popover-open")) tooltip.showPopover();
    position();
  };
  const hide = () => {
    cancel();
    pinned.current = false;
    if (panel.current?.matches(":popover-open")) panel.current.hidePopover();
  };
  const scheduleHide = () => {
    cancel();
    if (!pinned.current && !anchor.current?.matches(":focus-visible")) {
      timer.current = setTimeout(hide, 180);
    }
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
        ref={anchor}
        type="button"
        aria-label={"O que significa: " + label}
        aria-controls={id}
        aria-expanded={open}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") show();
        }}
        onPointerLeave={scheduleHide}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) show();
        }}
        onBlur={() => {
          if (pinned.current) hide();
          else scheduleHide();
        }}
        onClick={() => {
          if (pinned.current) hide();
          else {
            pinned.current = true;
            show();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") hide();
        }}
        className="relative -top-0.5 ml-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-line-strong bg-soft align-middle text-[11px] font-bold leading-none text-accent hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span aria-hidden="true">?</span>
      </button>
      {createPortal(
        <span
          ref={panel}
          id={id}
          role="tooltip"
          popover="auto"
          onToggle={(event) => {
            const next = event.newState === "open";
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
          {text}
        </span>,
        document.body,
      )}
    </>
  );
}
