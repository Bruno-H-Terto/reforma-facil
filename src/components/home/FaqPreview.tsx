import {
  Button,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  Heading,
} from "react-aria-components";
import { ChevronDown } from "@untitledui/icons";
import { faqs, sources } from "../../data/content";
import { Source } from "../ui";
import { SectionContainer } from "./SectionContainer";

export function FaqPreview() {
  return (
    <SectionContainer
      id="duvidas"
      labelledBy="home-faq-heading"
      className="flex min-h-[calc(100dvh-var(--portal-footer-height,0px))] flex-col justify-center bg-faq scroll-mt-6 [&>div]:w-full"
      spacing="section"
    >
      <div className="mx-auto min-w-0 max-w-3xl">
        <h2
          id="home-faq-heading"
          className="text-section font-semibold tracking-tight text-brand"
        >
          Dúvidas frequentes
        </h2>
        <DisclosureGroup
          defaultExpandedKeys={["0"]}
          allowsMultipleExpanded={false}
          className="mt-5 min-w-0 divide-y divide-line"
        >
          {faqs.map(([question, answer], index) => (
            <Disclosure
              key={question}
              id={String(index)}
              className="group min-w-0"
            >
              <Heading level={3}>
                <Button
                  slot="trigger"
                  className="flex min-h-12 w-full min-w-0 items-center justify-between gap-4 rounded-sm py-4 text-left text-base font-medium leading-relaxed text-brand transition-colors hover:text-accent group-data-[expanded]:text-accent"
                >
                  <span className="min-w-0">{question}</span>
                  <ChevronDown
                    className="size-5 shrink-0 text-accent transition-transform duration-200 motion-reduce:transition-none group-data-[expanded]:rotate-180"
                    aria-hidden="true"
                  />
                </Button>
              </Heading>
              <DisclosurePanel className="text-base leading-relaxed text-muted motion-safe:data-[entering]:animate-enter">
                <p className="pb-5 pr-0 sm:pr-9">{answer}</p>
              </DisclosurePanel>
            </Disclosure>
          ))}
        </DisclosureGroup>
        <div className="mt-4">
          <Source url={sources.overview}>Consultar fonte oficial</Source>
        </div>
      </div>
    </SectionContainer>
  );
}
