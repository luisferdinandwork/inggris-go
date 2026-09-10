// app/(home)/contact/page.tsx
import { HydrateClient, trpc } from "@/lib/trpc/server";
import ContactView from "./_modules/ContactView";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  await Promise.all([
    trpc.siteContent.getContact.prefetch(),
    trpc.siteContent.getCta.prefetch(),
  ]);

  return (
    <HydrateClient>
      <ContactView />
    </HydrateClient>
  );
}
