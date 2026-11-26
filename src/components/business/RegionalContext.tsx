import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { cases, states, legal } from "../../data/business";
import { serviceCases } from "../../data/serviceCases";
import { sources } from "../../data/content";
import { card, field, Source } from "../ui";

const validState = (code: string | null) =>
  states.some(([uf]) => uf === code) ? code! : "";

/**
 * Consulta regional simplificada, integrada à jornada "Minha empresa".
 * Os exemplos não alteram o cálculo nacional nem constituem alíquotas por UF.
 */
export function RegionalContext() {
  const [params] = useSearchParams();
  const [uf, setUf] = useState(() => validState(params.get("uf")));
  const region = cases.find((c) => c.uf === uf);
  const service = serviceCases.find((c) => c.uf === uf);
  const stateName = states.find(([code]) => code === uf)?.[1];

  return (
    <section
      id="impacto-regional"
      aria-labelledby="regional-heading"
      role="region"
      className={card + " scroll-mt-24 space-y-4"}
    >
      <div className="space-y-2">
        <h2 id="regional-heading" className="text-lg font-semibold text-brand">
          O que muda no seu estado?
        </h2>
        <p className="text-sm leading-relaxed text-muted">
          O IBS considera o destino da operação e, no futuro, as alíquotas do
          estado e do município. O DAS simplificado não muda apenas pela escolha
          da UF. Veja um exemplo de impacto regional, sem atribuir alíquotas que
          ainda não estão disponíveis no simulador.
        </p>
      </div>

      <label
        htmlFor="regional-state"
        className="block max-w-md text-sm font-semibold text-brand"
      >
        Estado da operação
        <select
          id="regional-state"
          className={field + " mt-2"}
          value={uf}
          onChange={(event) => setUf(event.target.value)}
        >
          <option value="">Selecione um estado</option>
          {states.map(([code, name]) => (
            <option key={code} value={code}>
              {name} ({code})
            </option>
          ))}
        </select>
      </label>

      {uf && (
        <div aria-live="polite" className="space-y-3 rounded-lg bg-soft p-4">
          <h3 className="font-semibold text-brand">{stateName}</h3>
          {region ? (
            <>
              <p className="text-sm font-medium">
                Exemplo ilustrativo: {region.activity} → {region.destination}
              </p>
              <p className="text-sm leading-relaxed">
                <strong>Hoje:</strong> {region.before}
              </p>
              <p className="text-sm leading-relaxed">
                <strong>Na transição:</strong> {region.after}
              </p>
              <p className="text-sm leading-relaxed">
                <strong>Atenção:</strong> {region.focus}
              </p>
              {service && (
                <div className="border-t border-line pt-3 text-sm leading-relaxed">
                  <p className="font-semibold">{service.title}</p>
                  <p className="mt-1">{service.detail}</p>
                </div>
              )}
              <Source url={region.source}>Fazenda estadual</Source>
            </>
          ) : (
            <p className="text-sm leading-relaxed">
              Ainda não há um exemplo revisado para {stateName}. Consulte as
              regras locais de ICMS, o município de destino, a atividade e os
              possíveis tratamentos especiais antes de comparar operações.
            </p>
          )}
          <p className="text-xs text-muted">
            Os exemplos são educativos, não cálculos de imposto por estado.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to={"/noticias?uf=" + uf}
              className="text-sm font-semibold text-accent underline underline-offset-2"
            >
              Notícias do estado
            </Link>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-x-5 gap-y-2">
        <Source url={sources.law}>LC 214/2025 — local da operação</Source>
        <Source url={legal.pib}>IBGE — dados estaduais</Source>
      </div>
    </section>
  );
}
