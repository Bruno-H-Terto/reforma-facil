import type { ReactNode } from "react";

/** Consistent editorial tip, shared by the simulator and company pages. */
export function ReforminhaTip({
  children,
  variant = "compact",
}: {
  children: ReactNode;
  variant?: "compact" | "feature";
}) {
  if (variant === "feature") {
    return (
      <aside
        aria-label="Fica a dica"
        className="flex flex-col gap-4 rounded-xl border border-line bg-soft p-4 sm:flex-row sm:items-center sm:gap-5 sm:px-6"
      >
        <div className="flex shrink-0 items-center gap-3">
          <img
            src="/images/mascot/chat-helpful.webp"
            alt="Reforminha explicando"
            width={112}
            height={112}
            className="h-auto w-20 shrink-0 object-contain sm:w-24"
            loading="lazy"
          />
          <span className="rounded-full bg-gold px-3 py-1.5 text-sm font-semibold text-brand">
            Fica a dica
          </span>
        </div>
        <div className="border-t border-line-strong pt-3 text-sm leading-relaxed text-ink sm:border-l sm:border-t-0 sm:py-1 sm:pl-5 sm:text-base">
          {children}
        </div>
      </aside>
    );
  }
  return (
    <aside className="flex min-w-0 items-start gap-3 rounded-xl border border-line bg-soft p-3 sm:p-4">
      <img
        src="/images/mascot/chat-helpful.webp"
        alt="Reforminha explicando"
        width={48}
        height={48}
        loading="lazy"
        className="size-12 shrink-0 object-contain"
      />
      <div className="min-w-0">
        <p className="mb-1 text-xs font-semibold text-accent">
          Dica do Reforminha
        </p>
        <div className="text-sm leading-relaxed text-ink">{children}</div>
      </div>
    </aside>
  );
}
