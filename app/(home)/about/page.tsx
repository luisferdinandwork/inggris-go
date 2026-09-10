import { HydrateClient, trpc } from "@/lib/trpc/server";

import { HeroSection } from "@/components/sections/about/HeroSection";
import { CompanySection } from "@/components/sections/about/CompanySection";
import { VisionMissionSection } from "@/components/sections/about/VisionMissionSection";
import SharedCta from "@/components/sections/shared/SharedCta";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  await Promise.all([
    trpc.siteContent.getAbout.prefetch(),
    trpc.siteContent.getSiteStats.prefetch(),
    trpc.siteContent.getCta.prefetch(),
  ]);

  return (
    <HydrateClient>
      <main className="min-h-screen bg-white">
        <HeroSection />
        <CompanySection />
        <VisionMissionSection />
        <SharedCta />
      </main>
    </HydrateClient>
  );
}
