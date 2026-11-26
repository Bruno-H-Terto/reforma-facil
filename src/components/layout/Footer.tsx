import { useLayoutEffect, useRef } from "react";
import { reviewed } from "../../data/content";
export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    const root = document.documentElement;
    const update = () =>
      root.style.setProperty(
        "--portal-footer-height",
        footer.getBoundingClientRect().height + "px",
      );
    update();
    const observer = new ResizeObserver(update);
    observer.observe(footer);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--portal-footer-height");
    };
  }, []);
  return (
    <footer ref={footerRef} className="bg-brand-deep text-on-dark">
      <div className="mx-auto max-w-7xl px-5 py-9 text-base lg:px-8">
        <p className="font-semibold text-white">Reforma Clara · Grupo 1</p>
        <p className="mt-2">
          Projeto acadêmico independente. Não substitui orientação contábil.
        </p>
        <p className="mt-2 text-sm">
          Revisão editorial: {reviewed}. Atualização manual.
        </p>
      </div>
    </footer>
  );
}
