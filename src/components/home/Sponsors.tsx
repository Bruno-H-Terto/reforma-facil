import { SectionContainer } from "./SectionContainer";

const illustrativeInstitutions = [
  {
    name: "Receita Federal",
    image: "/images/sponsors/receita-federal.svg",
    size: "h-[64px] w-[78px] sm:h-[70px] sm:w-[86px]",
  },
  {
    name: "Conselho Regional de Contabilidade de Minas Gerais (CRCMG)",
    image: "/images/sponsors/crcmg.svg",
    size: "h-[46px] w-[170px] sm:h-[52px] sm:w-[192px]",
  },
  {
    name: "Tesouro Nacional",
    image: "/images/sponsors/tesouro.png",
    size: "h-[42px] w-[174px] sm:h-[48px] sm:w-[205px]",
  },
  {
    name: "Governo de Minas Gerais",
    image: "/images/sponsors/governo-mg.png",
    size: "h-[53px] w-[164px] sm:h-[61px] sm:w-[190px]",
  },
  {
    name: "Governo Federal",
    image: "/images/sponsors/governo-federal.svg",
    size: "h-[56px] w-[129px] sm:h-[66px] sm:w-[152px]",
  },
];

export function Sponsors() {
  return (
    <SectionContainer
      id="patrocinadores"
      labelledBy="home-sponsors-heading"
      className="border-t border-line bg-paper"
      spacing="normal"
    >
      <h2
        id="home-sponsors-heading"
        className="text-base font-semibold text-brand"
      >
        Patrocinadores
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        Simulação acadêmica: os órgãos apresentados não patrocinam, apoiam ou
        endossam este projeto.
      </p>
      <div
        className="sponsors-marquee mt-4 overflow-hidden"
        aria-label="Logotipos ilustrativos"
      >
        <div className="sponsors-marquee-track flex w-max items-center">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1 ? "true" : undefined}
              className="flex shrink-0 items-center gap-5 pr-5 sm:gap-8 sm:pr-8"
            >
              {illustrativeInstitutions.map(({ name, image, size }) => (
                <div
                  key={image}
                  className="flex h-[76px] w-[174px] shrink-0 items-center justify-center sm:h-[88px] sm:w-[216px]"
                >
                  <img
                    src={image}
                    alt={copy === 0 ? name : ""}
                    loading="eager"
                    className={size + " max-h-full max-w-full object-contain"}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
