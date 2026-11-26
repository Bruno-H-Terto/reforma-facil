import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { Send01, X, RefreshCcw01, MessageCircle01 } from "@untitledui/icons";
import { MarkdownMessage } from "./MarkdownMessage";
import { buildChatHistory, type ChatLine } from "./chatHistory";
import type { MarkdownComposerHandle } from "./MarkdownComposer";

const MarkdownComposer = lazy(() =>
  import("./MarkdownComposer").then((module) => ({
    default: module.MarkdownComposer,
  })),
);

type Mood = "idle" | "thinking" | "speaking" | "helpful" | "error";

const avatar: Record<Mood, string> = {
  idle: "/images/mascot/chat-avatar.webp",
  thinking: "/images/mascot/chat-thinking.webp",
  speaking: "/images/mascot/chat-speaking.webp",
  helpful: "/images/mascot/chat-helpful.webp",
  error: "/images/mascot/chat-thinking.webp",
};
const labels: Record<Mood, string> = {
  idle: "Reforminha pronto para conversar",
  thinking: "Reforminha pensando",
  speaking: "Reforminha respondendo",
  helpful: "Reforminha disponível",
  error: "Reforminha aguardando nova tentativa",
};

export function ReforminhaChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatLine[]>([]);
  const [draft, setDraft] = useState("");
  const [phase, setPhase] = useState<Mood>("idle");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const composerRef = useRef<MarkdownComposerHandle>(null);
  const launchRef = useRef<HTMLButtonElement>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const requestRef = useRef<AbortController | undefined>(undefined);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [open]);

  useEffect(() => {
    if (open)
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy, open]);

  useEffect(
    () => () => {
      requestRef.current?.abort();
      clearTimeout(resetTimer.current);
    },
    [],
  );

  const close = () => {
    setOpen(false);
    launchRef.current?.focus();
  };

  const send = async (event?: FormEvent) => {
    event?.preventDefault();
    const content = (composerRef.current?.getMarkdown() ?? draft).trim();
    if (!content || content.length > 1800 || busy) return;

    const history = buildChatHistory(messages, content);
    const next: ChatLine[] = [...messages, { role: "user", content }];
    setMessages(next);
    composerRef.current?.clear();
    setDraft("");
    setBusy(true);
    setError("");
    setPhase("thinking");
    clearTimeout(resetTimer.current);

    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });
      if (
        !(response.headers.get("content-type") || "").includes(
          "application/json",
        )
      ) {
        throw new Error(
          import.meta.env.DEV
            ? "A API do chatbot não está ativa no Vite. Execute npm run dev:full e configure as variáveis de ambiente do servidor."
            : "O serviço do assistente ainda não está disponível.",
        );
      }
      const payload: unknown = await response.json().catch(() => ({}));
      const result =
        payload && typeof payload === "object"
          ? (payload as Record<string, unknown>)
          : {};
      if (!response.ok || typeof result.answer !== "string") {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "O assistente não respondeu. Tente novamente.",
        );
      }
      setMessages([...next, { role: "assistant", content: result.answer }]);
      setPhase("speaking");
      resetTimer.current = setTimeout(() => setPhase("helpful"), 2100);
    } catch (reason) {
      if (controller.signal.aborted) return;
      setError(
        reason instanceof Error
          ? reason.message
          : "Falha na consulta. Tente novamente.",
      );
      setPhase("error");
      // Mostra a falha ao usuário, mas não a reenvia no próximo turno.
      setMessages((current) =>
        current.map((line, index) =>
          index === next.length - 1 ? { ...line, failed: true } : line,
        ),
      );
    } finally {
      setBusy(false);
      requestRef.current = undefined;
    }
  };

  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[80] sm:bottom-6 sm:right-6">
      {open && (
        <section
          role="dialog"
          aria-label="Conversa com o Reforminha"
          aria-modal="false"
          onKeyDown={(event) => {
            if (event.key === "Escape") close();
          }}
          className="absolute bottom-[5.25rem] right-0 flex h-[min(39rem,calc(100dvh-7rem))] w-[min(25rem,calc(100vw-2rem))] min-w-0 flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
        >
          <header className="flex shrink-0 items-center gap-3 border-b border-line bg-soft px-4 py-3">
            <img
              src={avatar[phase]}
              alt=""
              className="size-12 shrink-0 object-contain"
              width="48"
              height="48"
            />
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-brand">
                Converse com o Reforminha
              </h2>
              <p aria-live="polite" className="text-xs text-muted">
                {busy ? "Consultando informações..." : "Assistente educacional"}
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              className="flex size-11 shrink-0 items-center justify-center rounded-lg text-brand hover:bg-line"
              aria-label="Fechar conversa"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </header>
          <div
            className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
            aria-label="Mensagens da conversa"
          >
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={avatar.helpful}
                    width="50"
                    height="50"
                    alt=""
                    className="size-12 shrink-0 object-contain"
                  />
                  <p className="min-w-0 rounded-xl rounded-tl-sm bg-soft px-3 py-2.5 text-sm leading-relaxed text-brand">
                    Olá! Sou o Reforminha. Posso ajudar você a entender a
                    reforma tributária e encontrar o simulador adequado.
                  </p>
                </div>
                <p className="text-xs leading-relaxed text-muted">
                  As respostas são educativas e podem conter limitações.
                  Consulte as fontes oficiais e um profissional antes de tomar
                  decisões fiscais.
                </p>
                <p className="text-xs text-muted">
                  Você pode começar perguntando: “O que muda para uma empresa do
                  Simples Nacional?”
                </p>
              </div>
            )}
            {messages.map((line, index) => (
              <div
                key={index}
                className={
                  "flex " +
                  (line.role === "user" ? "justify-end" : "items-start gap-2")
                }
              >
                {line.role === "assistant" && (
                  <img
                    src={avatar.speaking}
                    width="36"
                    height="36"
                    alt=""
                    className="size-9 shrink-0 object-contain"
                  />
                )}
                <div
                  className={
                    "min-w-0 max-w-[86%] rounded-xl px-3 py-2.5 " +
                    (line.role === "user"
                      ? "rounded-br-sm bg-brand text-white"
                      : "rounded-tl-sm bg-soft text-brand")
                  }
                >
                  <MarkdownMessage
                    content={line.content}
                    onInternalNavigate={close}
                  />
                  {line.failed && (
                    <p className="mt-1 text-xs opacity-80">
                      Não enviada ao assistente.
                    </p>
                  )}
                </div>
              </div>
            ))}
            {busy && (
              <div
                aria-live="polite"
                className="flex items-center gap-2 text-sm text-muted"
              >
                <img
                  src={avatar.thinking}
                  width="40"
                  height="40"
                  alt=""
                  className="size-10 object-contain"
                />
                Reforminha está pensando...
              </div>
            )}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm text-slate-800"
              >
                {error}
                <p className="mt-1 text-xs">
                  Nenhuma resposta de IA foi gerada para esta mensagem.
                </p>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <form
            ref={formRef}
            onSubmit={(event) => void send(event)}
            className="shrink-0 border-t border-line bg-surface p-3"
          >
            <div className="flex items-end gap-2">
              <Suspense
                fallback={
                  <p
                    role="status"
                    className="flex min-h-12 min-w-0 flex-1 items-center rounded-xl border border-line px-3 text-sm text-muted"
                  >
                    Preparando editor...
                  </p>
                }
              >
                <MarkdownComposer
                  ref={composerRef}
                  initialMarkdown={draft}
                  disabled={busy}
                  onChange={setDraft}
                  onSend={() => formRef.current?.requestSubmit()}
                />
              </Suspense>
              <button
                type="submit"
                disabled={!draft.trim() || draft.length > 1800 || busy}
                className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand text-white hover:bg-brand-mid disabled:opacity-50"
                aria-label="Enviar mensagem"
              >
                <Send01 className="size-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-1 flex items-center justify-between gap-2">
              <p id="reforminha-editor-help" className="text-[11px] text-muted">
                Formatação ao digitar · Enter envia · Shift+Enter quebra linha
                {draft.length > 1800 && (
                  <span role="alert"> · Máximo de 1.800 caracteres</span>
                )}
              </p>
              <button
                type="button"
                disabled={busy || messages.length === 0}
                onClick={() => {
                  setMessages([]);
                  composerRef.current?.clear();
                  setDraft("");
                  setError("");
                  setPhase("idle");
                  composerRef.current?.focus();
                }}
                className="inline-flex min-h-8 items-center gap-1 text-xs font-medium text-accent hover:underline disabled:opacity-50"
              >
                <RefreshCcw01 className="size-3.5" aria-hidden="true" />
                Nova conversa
              </button>
            </div>
          </form>
        </section>
      )}
      <button
        ref={launchRef}
        type="button"
        aria-label={
          open ? "Recolher chat do Reforminha" : "Conversar com o Reforminha"
        }
        aria-expanded={open}
        onClick={() => {
          if (open) close();
          else setOpen(true);
        }}
        className="group relative flex size-[4.5rem] items-center justify-center rounded-full border-2 border-gold bg-white p-1.5 shadow-xl transition-transform hover:scale-105 focus-visible:outline-4 focus-visible:outline-accent"
      >
        <img
          src={avatar[phase]}
          alt=""
          width={64}
          height={64}
          className="size-full object-contain"
        />
        {!open && (
          <span
            aria-hidden="true"
            className="absolute -left-1 -top-1 flex size-6 items-center justify-center rounded-full bg-brand text-white"
          >
            <MessageCircle01 className="size-3.5" />
          </span>
        )}
        <span className="sr-only">{labels[phase]}</span>
      </button>
    </div>
  );
}
