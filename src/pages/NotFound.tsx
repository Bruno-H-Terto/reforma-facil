import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen01 } from "@untitledui/icons";

export function NotFound() {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-6xl flex-col items-center gap-6 py-8 text-center lg:flex-row lg:gap-12 lg:py-16 lg:text-left">
      <div className="min-w-0 flex-1 space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-ink">
          Opa! Onde fomos parar?
        </p>
        <h1 className="text-[clamp(3.5rem,9vw,6.5rem)] font-bold leading-none text-brand">
          404
        </h1>
        <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-semibold leading-snug text-brand">
          Parece que pegamos o caminho errado!
        </h2>
        <p className="max-w-xl text-base leading-relaxed text-muted">
          Até o Reforminha ficou perdido neste cruzamento. A página que você
          procura não existe ou mudou de endereço. Vamos encontrar o caminho
          certo?
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-mid"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> Voltar ao início
          </Link>
          <Link
            to="/entenda"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line-strong bg-surface px-5 py-3 font-semibold text-brand hover:bg-soft"
          >
            <BookOpen01 className="size-4" aria-hidden="true" /> Explorar o guia
          </Link>
        </div>
      </div>
      <img
        src="/images/mascot/404-lost.webp"
        alt="Reforminha confuso, olhando uma placa de sinalização em uma bifurcação"
        width={820}
        height={615}
        className="w-full min-w-0 max-w-md flex-1 object-contain lg:max-w-[520px]"
      />
    </div>
  );
}
