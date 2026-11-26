import { useState } from "react";
import { serviceCases } from "../../data/serviceCases";
import {
  cbsReference,
  cbsReferenceNote,
  cbsReferenceSource,
} from "../../data/rates";
import { CurrencyInput } from "../CurrencyInput";
import { compare } from "../../lib/scenarios";
import { sources } from "../../data/content";
import { Action, SectionTitle, Source, card, field } from "../ui";

const money = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function RegularExample({
  preset,
}: { preset?: (typeof serviceCases)[number] } = {}) {
  const [base, setBase] = useState(String(preset?.base ?? 10000));
  const [old, setOld] = useState(String(preset?.old ?? 1200));
  const [ibsRate, setIbsRate] = useState(
    Math.round(12 * (1 - (preset?.reduction ?? 0) / 100) * 100) / 100,
  );
  const [cbsRate, setCbsRate] = useState(
    Math.round(cbsReference * (1 - (preset?.reduction ?? 0) / 100) * 100) / 100,
  );
  const [ibsCredit, setIbsCredit] = useState(String(preset?.ibsCredit ?? 500));
  const [cbsCredit, setCbsCredit] = useState(String(preset?.cbsCredit ?? 300));
  const result = compare({
    revenue: 0,
    operationBase: Number(base),
    dasInside: 0,
    dasOutside: 0,
    ibsRate,
    cbsRate,
    ibsCredit: Number(ibsCredit),
    cbsCredit: Number(cbsCredit),
  });
  const net = result.outside;
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Cenário comparativo sem ano fiscal específico, com alíquotas editáveis,
        não oficiais. Informe tributos anteriores líquidos sobre consumo
        comparáveis, sem IRPJ/CSLL. Não contempla todos os regimes especiais,
        benefícios ou regras de transição.
      </p>
      <p className="text-sm text-slate-600">
        {cbsReferenceNote} <Source url={cbsReferenceSource}>Fonte TCU</Source>
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {(
          [
            ["Base de venda sem IBS/CBS", base, setBase],
            ["Tributos anteriores líquidos", old, setOld],
            ["Créditos elegíveis de IBS", ibsCredit, setIbsCredit],
            ["Créditos elegíveis de CBS", cbsCredit, setCbsCredit],
          ] as const
        ).map(([label, value, set]) => (
          <label
            key={label}
            className="block min-w-0 text-sm font-medium text-brand"
          >
            {label}
            <CurrencyInput
              className={field + " mt-1"}
              value={value}
              onValueChange={set}
            />
          </label>
        ))}
        {(
          [
            ["Alíquota hipotética de IBS (%)", ibsRate, setIbsRate],
            ["Alíquota hipotética de CBS (%)", cbsRate, setCbsRate],
          ] as const
        ).map(([label, value, set]) => (
          <label
            key={label}
            className="block min-w-0 text-sm font-medium text-brand"
          >
            {label}
            <input
              className={field + " mt-1"}
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={value}
              onChange={(e) =>
                set(Math.min(100, Math.max(0, Number(e.target.value) || 0)))
              }
            />
          </label>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-3" aria-live="polite">
        {[
          ["Antes (informado)", Number(old)],
          ["Depois (estimado)", net],
          ["Diferença (depois − antes)", net - Number(old)],
        ].map(([label, value]) => (
          <div
            key={String(label)}
            className="min-w-0 rounded-xl bg-slate-100 p-4"
          >
            <p className="text-xs text-slate-600">{label}</p>
            <p className="mt-2 break-words text-lg font-semibold text-brand">
              {money(Number(value))}
            </p>
          </div>
        ))}
      </div>
      <div className="space-y-2 text-sm">
        <h3 className="font-semibold text-brand">Como o valor foi calculado</h3>
        <p>
          IBS: {money(Number(base))} × {ibsRate}% = {money(result.ibs.debit)};
          menos {money(Number(ibsCredit))} de créditos → saldo a pagar de{" "}
          {money(result.ibs.due)}.
        </p>
        <p>
          CBS: {money(Number(base))} × {cbsRate}% = {money(result.cbs.debit)};
          menos {money(Number(cbsCredit))} de créditos → saldo a pagar de{" "}
          {money(result.cbs.due)}.
        </p>
        <p>
          Saldo total: {money(result.ibs.due)} + {money(result.cbs.due)} ={" "}
          {money(net)}. Saldos credores não são compensados entre tributos: IBS{" "}
          {money(result.ibs.excess)}, CBS {money(result.cbs.excess)}.
        </p>
      </div>
      <Source url={sources.law}>LC 214/2025, arts. 12–15 e 47</Source>
    </div>
  );
}
export function ServiceExamples({
  uf,
  filter,
}: {
  uf?: string;
  filter?: string;
}) {
  const entries = serviceCases.filter(
    (e) =>
      (!uf || e.uf === uf) &&
      (!filter ||
        filter === "simples-nacional" ||
        (filter === "anexo-iii" && e.regime.includes("III")) ||
        (filter === "anexo-iv" && e.regime.includes("IV")) ||
        (filter === "anexo-v" && e.regime.includes(" V"))),
  );
  const [active, setActive] = useState(entries[0]?.uf);
  const current = entries.find((e) => e.uf === active) ?? entries[0];
  if (!current) return null;
  return (
    <section className={card}>
      <SectionTitle title="Prestação de serviços: casos práticos">
        Exemplos fictícios com foco no Simples. O cálculo é apenas do regime
        regular de IBS/CBS, não o valor total do DAS. As reduções pressupõem
        atendimento aos requisitos legais.
      </SectionTitle>
      <div
        role="group"
        aria-label="Escolha o serviço"
        className="grid gap-2 sm:grid-cols-2"
      >
        {entries.map((e) => (
          <button
            type="button"
            key={e.uf}
            aria-pressed={current.uf === e.uf}
            onClick={() => setActive(e.uf)}
            className={
              "rounded-xl border p-3 text-left text-sm font-semibold " +
              (current.uf === e.uf
                ? "border-brand bg-brand text-white"
                : "border-slate-300 text-brand hover:bg-soft")
            }
          >
            {e.title}
          </button>
        ))}
      </div>
      <div className="my-5">
        <h3 className="text-lg font-semibold text-brand">{current.title}</h3>
        <p className="my-2 text-sm font-medium text-accent">{current.regime}</p>
        <p className="text-sm leading-relaxed">{current.detail}</p>
        <p className="mt-3 text-sm font-semibold">
          Referência CBS: 11,3%{" "}
          {current.reduction > 0
            ? "× " +
              (100 - current.reduction) +
              "% = " +
              (cbsReference * (1 - current.reduction / 100)).toLocaleString(
                "pt-BR",
                { maximumFractionDigits: 2 },
              ) +
              "% (condicional)"
            : "(sem redução presumida)"}
        </p>
        <p className="mt-2 text-xs text-slate-600">
          Valores de tributos anteriores e créditos fictícios; informe seus
          valores reais. O IBS de 12% antes de reduções é hipótese, não alíquota
          oficial.
        </p>
        <div className="mt-3">
          <Source url={sources.law}>
            LC 214/2025, arts. 127, 129 e 130 e anexos II/III
          </Source>
        </div>
      </div>
      <RegularExample key={current.uf} preset={current} />
      <div className="mt-5">
        <Action to="/simulador?modo=comparar">
          Comparar DAS com regime regular
        </Action>
      </div>
    </section>
  );
}
