import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ChevronDown } from "@untitledui/icons";
import {
  Button,
  Disclosure,
  DisclosurePanel,
  Heading,
} from "react-aria-components";

export const card =
  "min-w-0 rounded-2xl border border-line bg-surface p-4 sm:p-6 shadow-panel";
export const field =
  "w-full min-w-0 max-w-full min-h-11 rounded-lg border border-line-strong bg-white px-3 py-2.5 text-base text-ink transition-colors hover:border-accent focus:border-accent";
export const buttonBase =
  "inline-flex min-h-11 min-w-0 max-w-full items-center justify-center gap-3 rounded-lg px-5 py-3 text-center text-[15px] lg:text-base font-semibold leading-snug transition-colors duration-150 disabled:opacity-50";
export const primary =
  buttonBase + " bg-brand text-white hover:bg-brand-mid active:bg-brand-deep";
export const goldButton =
  buttonBase +
  " bg-gold text-brand-deep hover:bg-gold-hover active:bg-gold-pressed";
export const outlineDark =
  buttonBase +
  " border border-white/70 text-white hover:bg-white/10 active:bg-white/20";
export const secondary =
  buttonBase +
  " border border-line-strong bg-surface text-brand hover:bg-soft active:bg-line";
export function DisclosureSummary({ children }: { children: ReactNode }) {
  return (
    <summary className="group flex min-h-11 min-w-0 items-center justify-between gap-4 rounded-md text-base font-semibold text-brand transition-colors hover:text-accent">
      <span className="min-w-0 break-words">{children}</span>
      <ChevronDown
        className="size-5 shrink-0 text-accent transition-transform motion-reduce:transition-none "
        aria-hidden="true"
      />
    </summary>
  );
}
export function PageIntro({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-7 max-w-3xl">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold-ink">
        {label}
      </p>
      <h1 className="text-page font-semibold tracking-tight text-brand">
        {title}
      </h1>
      <p className="mt-3 text-base leading-relaxed text-muted lg:text-[17px]">
        {children}
      </p>
    </div>
  );
}
export function SectionTitle({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-5">
      <h2 className="text-section font-semibold tracking-tight text-brand">
        {title}
      </h2>
      {children && (
        <p className="mt-2 text-base leading-relaxed text-muted">{children}</p>
      )}
    </div>
  );
}
export function Action({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link className={primary} to={to}>
      <span className="min-w-0 break-words">{children}</span>
      <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
    </Link>
  );
}
export function Source({
  url,
  children = "Consultar fonte oficial",
  onDark = false,
}: {
  url: string;
  onDark?: boolean;
  children?: ReactNode;
}) {
  return (
    <a
      className={
        "inline-flex min-w-0 max-w-full items-center gap-2 break-words text-sm font-semibold underline underline-offset-4 " +
        (onDark
          ? "text-gold hover:text-gold-hover"
          : "text-accent hover:text-brand")
      }
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      <span className="min-w-0 break-words">{children}</span>
      <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
      <span className="sr-only"> (abre nova aba)</span>
    </a>
  );
}
export function FAQ({
  items,
  plain = false,
}: {
  items: string[][];
  plain?: boolean;
}) {
  return (
    <div
      className={
        plain
          ? "divide-y divide-line"
          : "divide-y divide-line rounded-xl border border-line bg-surface"
      }
    >
      {items.map(([q, a]) => (
        <Disclosure key={q} className="group">
          <Heading>
            <Button
              slot="trigger"
              className={
                "flex w-full items-center justify-between gap-4 min-h-12 py-4 text-left text-base font-medium text-brand transition-colors duration-150 hover:text-accent group-data-[expanded]:text-accent " +
                (plain
                  ? "px-0"
                  : "px-4 hover:bg-paper active:bg-line group-data-[expanded]:bg-soft")
              }
            >
              <span className="min-w-0 break-words">{q}</span>
              <ChevronDown
                className="size-5 shrink-0 transition-transform duration-200 motion-reduce:transition-none group-data-[expanded]:rotate-180"
                aria-hidden="true"
              />
            </Button>
          </Heading>
          <DisclosurePanel className="text-base leading-relaxed text-muted motion-safe:data-[entering]:animate-enter">
            <div className={plain ? "pb-4" : "px-4 pb-4 pt-2"}>{a}</div>
          </DisclosurePanel>
        </Disclosure>
      ))}
    </div>
  );
}
