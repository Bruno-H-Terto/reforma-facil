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
  "rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm";
export const field =
  "w-full rounded-lg border border-slate-400 bg-white px-3 py-3 text-sm text-ink";
export const primary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-brand active:bg-brand active:ring-2 active:ring-accent/40 motion-safe:active:scale-[0.98] transition-colors motion-safe:transition-transform";
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
    <div className="mb-8 max-w-3xl">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
        {label}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 leading-relaxed text-slate-600">{children}</p>
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
      <h2 className="text-xl font-semibold tracking-tight text-brand sm:text-2xl">
        {title}
      </h2>
      {children && (
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          {children}
        </p>
      )}
    </div>
  );
}
export function Action({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link className={primary} to={to}>
      {children}
      <ArrowRight aria-hidden="true" className="size-4" />
    </Link>
  );
}
export function Source({
  url,
  children = "Consultar fonte oficial",
}: {
  url: string;
  children?: ReactNode;
}) {
  return (
    <a
      className="inline-flex items-center gap-1 text-sm font-semibold text-accent underline underline-offset-4"
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      {children}
      <ArrowUpRight className="size-4" aria-hidden="true" />
      <span className="sr-only"> (abre nova aba)</span>
    </a>
  );
}
export function FAQ({ items }: { items: string[][] }) {
  return (
    <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
      {items.map(([q, a]) => (
        <Disclosure key={q} className="group">
          <Heading>
            <Button
              slot="trigger"
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold text-brand hover:bg-paper active:bg-emerald-100 data-[pressed]:bg-emerald-100 group-data-[expanded]:bg-emerald-50 group-data-[expanded]:text-accent transition-colors"
            >
              {q}
              <ChevronDown
                className="size-5 shrink-0 group-data-[expanded]:rotate-180"
                aria-hidden="true"
              />
            </Button>
          </Heading>
          <DisclosurePanel className="px-5 pb-5 text-sm leading-relaxed text-slate-600">
            {a}
          </DisclosurePanel>
        </Disclosure>
      ))}
    </div>
  );
}
