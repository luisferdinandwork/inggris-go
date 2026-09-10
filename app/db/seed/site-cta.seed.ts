// app/db/seed/site-cta.seed.ts

import { db } from "@/app/db/db";
import { siteCtaSettings } from "../schema/site-content";
import { DEFAULT_CTA } from "@/app/modules/site-content/site-content.defaults";

export async function seedSiteCtaSettings() {
  console.log("Seeding Shared CTA CMS...");

  const values = { ...DEFAULT_CTA, updatedAt: new Date() };

  await db
    .insert(siteCtaSettings)
    .values(values)
    .onConflictDoUpdate({ target: siteCtaSettings.id, set: values });

  console.log("Shared CTA CMS seeded.");
}
