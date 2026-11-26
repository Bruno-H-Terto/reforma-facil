import { useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart01, Menu01, XClose } from "@untitledui/icons";
import { MainNav } from "./MainNav";
export function Header() {
  const { pathname } = useLocation();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menu = menuPath === pathname;
  const closeMenu = () => setMenuPath(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const root = document.documentElement;
    const update = () =>
      root.style.setProperty(
        "--portal-header-height",
        header.getBoundingClientRect().height + "px",
      );
    update();
    const observer = new ResizeObserver(update);
    observer.observe(header);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--portal-header-height");
    };
  }, []);
  return (
    <header
      ref={headerRef}
      onKeyDown={(event) => {
        if (menu && event.key === "Escape") {
          closeMenu();
          toggleRef.current?.focus();
        }
      }}
      className="relative z-20 border-b border-white/10 bg-brand-deep text-white"
    >
      <div className="mx-auto flex min-h-[4rem] max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3"
          onClick={closeMenu}
        >
          <span className="grid size-11 shrink-0 place-items-center text-gold-ink">
            <BarChart01 className="size-9" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-xl sm:text-2xl font-bold leading-tight tracking-tight">
              Reforma Clara
            </span>
            <span className="block text-xs leading-tight text-on-dark">
              Portal da Reforma Tributária
            </span>
          </span>
        </Link>
        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-1 xl:flex"
        >
          <MainNav pathname={pathname} onNavigate={closeMenu} />
        </nav>
        <button
          ref={toggleRef}
          type="button"
          aria-label={menu ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menu}
          aria-controls="mobile-navigation"
          onClick={() => setMenuPath(menu ? null : pathname)}
          className="grid size-11 shrink-0 place-items-center rounded-lg hover:bg-white/10 xl:hidden"
        >
          {menu ? (
            <XClose className="size-6" aria-hidden="true" />
          ) : (
            <Menu01 className="size-6" aria-hidden="true" />
          )}
        </button>
      </div>
      <nav
        id="mobile-navigation"
        aria-label="Navegação móvel"
        hidden={!menu}
        className="border-t border-white/20 px-5 pb-4 pt-2 xl:hidden"
      >
        <div className="flex flex-col gap-2">
          <MainNav pathname={pathname} onNavigate={closeMenu} />
        </div>
      </nav>
    </header>
  );
}
