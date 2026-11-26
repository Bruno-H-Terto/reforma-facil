import { HeroCarousel } from "../components/HeroCarousel";
import { QuickAccessCards } from "../components/home/QuickAccessCards";
import { NewsHighlights } from "../components/home/NewsHighlights";
import { FaqPreview } from "../components/home/FaqPreview";
import { Sponsors } from "../components/home/Sponsors";

export function Home() {
  return (
    <>
      <div
        data-home-chapter="opening"
        className="flex min-h-[calc(100dvh-var(--portal-header-height,4.5rem))] flex-col bg-paper"
      >
        <HeroCarousel />
        <QuickAccessCards />
        <NewsHighlights />
      </div>
      <FaqPreview />
      <Sponsors />
    </>
  );
}
