import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import { ReforminhaChat } from "./chat/ReforminhaChat";
export function Layout() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash)
      requestAnimationFrame(() =>
        document.getElementById(hash.slice(1))?.scrollIntoView(),
      );
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:text-brand focus:p-3"
      >
        Ir ao conteúdo
      </a>
      <Header />
      <main
        id="conteudo"
        className={
          pathname === "/"
            ? "min-h-[70vh]"
            : "mx-auto min-w-0 min-h-[70vh] max-w-7xl px-5 py-7 lg:px-8 lg:py-10"
        }
      >
        <Outlet />
      </main>
      <Footer />
      <ReforminhaChat />
    </>
  );
}
