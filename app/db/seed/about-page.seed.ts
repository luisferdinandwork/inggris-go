// app/db/seed/about-page.seed.ts

import { db } from "@/app/db/db";
import { aboutPageSettings } from "../schema/site-content";
import { DEFAULT_ABOUT } from "@/app/modules/site-content/site-content.defaults";

export async function seedAboutPageSettings() {
  console.log("Seeding About Page CMS...");

  const values = { ...DEFAULT_ABOUT, updatedAt: new Date() };

  await db
    .insert(aboutPageSettings)
    .values(values)
    .onConflictDoUpdate({ target: aboutPageSettings.id, set: values });

  console.log("About Page CMS seeded.");
}
