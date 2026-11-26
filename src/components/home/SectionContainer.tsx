import type { ReactNode } from "react";
export function SectionContainer({
  children,
  className = "",
  id,
  labelledBy,
  spacing = "normal",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  labelledBy?: string;
  spacing?: "normal" | "topless" | "tight" | "section";
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={
        "px-5 sm:px-8 " +
        {
          normal: "py-4",
          topless: "pt-0 pb-4",
          tight: "py-2",
          section: "py-8 sm:py-12",
        }[spacing] +
        " " +
        className
      }
    >
      <div className="mx-auto min-w-0 max-w-7xl">{children}</div>
    </section>
  );
}
