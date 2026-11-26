import type { ReactNode } from "react";
import type { ComponentType, SVGProps } from "react";
import { Check, InfoCircle } from "@untitledui/icons";
import { card, SectionTitle } from "../ui";

export type BusinessTabOption<T extends string> = { id: T; label: string };

export function RegimeTabs<T extends string>({
  items,
  selected,
  onChange,
  panelId,
  ariaLabel = "Regime tributário",
  idPrefix = "business-tab-",
  fitMobile = false,
}: {
  items: BusinessTabOption<T>[];
  selected: T;
  onChange: (value: T) => void;
  panelId: string;
  ariaLabel?: string;
  idPrefix?: string;
  fitMobile?: boolean;
}) {
  return (
    <nav aria-label={ariaLabel} className="border-b border-line-strong">
      <div
        className={
          fitMobile
            ? "grid grid-cols-2 gap-1 sm:flex sm:overflow-x-auto"
            : "flex gap-1 overflow-x-auto"
        }
        role="tablist"
        aria-label={ariaLabel}
      >
        {items.map((tab) => (
          <button
            key={tab.id}
            id={idPrefix + tab.id}
            type="button"
            role="tab"
            aria-selected={selected === tab.id}
            aria-controls={panelId}
            onClick={() => onChange(tab.id)}
            className={
              "min-h-11 shrink-0 rounded-t-lg border border-b-0 px-4 py-2.5 text-sm font-semibold transition-colors sm:min-w-40 sm:px-5 sm:text-base " +
              (fitMobile
                ? "min-w-0 whitespace-normal text-center sm:text-left "
                : "") +
              (selected === tab.id
                ? "border-brand bg-brand text-white"
                : "border-line bg-surface text-brand hover:bg-soft")
            }
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export function SummaryPanel({ items }: { items: string[] }) {
  return (
    <aside aria-label="Em resumo" className={card + " !bg-soft"}>
      <div className="flex items-center gap-3">
        <InfoCircle
          className="size-6 shrink-0 text-accent"
          aria-hidden="true"
        />
        <h3 className="text-lg font-semibold text-brand">Em resumo</h3>
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-sm leading-relaxed sm:text-base"
          >
            <Check
              className="mt-0.5 size-5 shrink-0 text-accent"
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export type InfoSectionData = {
  title: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  content: ReactNode;
};
export function InfoColumns({ sections }: { sections: InfoSectionData[] }) {
  return (
    <div className="grid gap-6 border-t border-line pt-6 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
      {sections.map(({ title, icon: Icon, content }, i) => (
        <section
          key={title}
          className={
            "min-w-0 " +
            (i === 0
              ? "md:pr-5"
              : i === sections.length - 1
                ? "md:pl-5"
                : "md:px-5")
          }
        >
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-lg bg-soft p-2 text-accent">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="text-base font-semibold leading-snug text-brand">
              {title}
            </h3>
          </div>
          <div className="text-sm leading-relaxed text-ink sm:text-base">
            {content}
          </div>
        </section>
      ))}
    </div>
  );
}

export function BusinessPanelIntro({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div>
      <SectionTitle title={title}>{subtitle}</SectionTitle>
      <p className="max-w-3xl leading-relaxed text-ink">{children}</p>
    </div>
  );
}
