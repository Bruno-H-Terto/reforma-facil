import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";

const officialHosts = [
  "gov.br",
  "planalto.gov.br",
  "camara.leg.br",
  "senado.leg.br",
  "tcu.gov.br",
];

const internalPath =
  /^\/(?:simulador|empresas|entenda|biblioteca|noticias|mei|calculadoras|duvidas|404)(?:\/[a-z0-9-]+)*(?:\?[a-z0-9%=&_.-]+)?$/i;

function trustedLink(href: string | undefined) {
  if (!href) return null;

  if (internalPath.test(href)) return { kind: "internal" as const, href };

  try {
    const url = new URL(href);
    if (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      officialHosts.some(
        (domain) =>
          url.hostname === domain || url.hostname.endsWith("." + domain),
      )
    ) {
      return { kind: "external" as const, href: url.href };
    }
  } catch {
    /* Unsupported or malformed URL */
  }

  return null;
}

/**
 * Exibe Markdown/GFM sem interpretar HTML enviado pelo modelo.
 *
 * - Títulos, listas, negrito, itálico, código, citações e tabelas.
 * - Links internos navegam no React Router; links externos só abrem fontes
 *   oficiais em outra aba. URLs inseguras são mostradas como texto.
 * - O textarea permanece texto puro: Markdown é uma sintaxe de entrada,
 *   e esta função faz a visualização formatada.
 */
export function MarkdownMessage({
  content,
  onInternalNavigate,
}: {
  content: string;
  onInternalNavigate?: () => void;
}) {
  return (
    <div className="min-w-0 break-words text-sm leading-relaxed">
      <Markdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          p: ({ children }) => (
            <p className="mb-2 whitespace-pre-wrap last:mb-0">{children}</p>
          ),
          h1: ({ children }) => (
            <h3 className="mb-2 mt-3 text-base font-semibold first:mt-0">
              {children}
            </h3>
          ),
          h2: ({ children }) => (
            <h3 className="mb-2 mt-3 text-[15px] font-semibold first:mt-0">
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="mb-1.5 mt-2 font-semibold first:mt-0">{children}</h4>
          ),
          ul: ({ children }) => (
            <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-0.5">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-2 border-l-[3px] border-gold pl-3 italic">
              {children}
            </blockquote>
          ),
          pre: ({ children }) => (
            <pre className="my-2 max-w-full overflow-x-auto rounded-lg bg-brand-deep p-3 text-xs leading-relaxed text-white [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit">
              {children}
            </pre>
          ),
          code: ({ children, className }) => (
            <code
              className={
                "rounded bg-black/10 px-1 py-0.5 font-mono text-[0.9em] " +
                (className ?? "")
              }
            >
              {children}
            </code>
          ),
          table: ({ children }) => (
            <div className="my-2 max-w-full overflow-x-auto rounded-lg border border-line bg-surface text-ink">
              <table className="w-full border-collapse text-left text-xs">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-line bg-soft p-2 font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-line p-2 align-top">{children}</td>
          ),
          hr: () => <hr className="my-3 border-line" />,
          // Não carregar imagens externas indicadas por texto de terceiros.
          img: ({ alt }) => <span>{alt ?? ""}</span>,
          a: ({ href, children }) => {
            const destination = trustedLink(href);
            if (!destination) return <span>{children}</span>;

            const classes =
              "font-semibold underline decoration-dotted underline-offset-2 hover:decoration-solid focus-visible:rounded-sm";

            return destination.kind === "internal" ? (
              <Link
                to={destination.href}
                onClick={onInternalNavigate}
                className={classes}
              >
                {children}
              </Link>
            ) : (
              <a
                href={destination.href}
                target="_blank"
                rel="noopener noreferrer"
                className={classes}
              >
                {children}
                <span className="sr-only"> (abre nova aba)</span>
              </a>
            );
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
