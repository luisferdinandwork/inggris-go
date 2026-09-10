// app/db/seed/home-page.seed.ts

import { db } from "@/app/db/db";
import { homePageSettings } from "../schema/site-content";
import { DEFAULT_HOME } from "@/app/modules/site-content/site-content.defaults";

export async function seedHomePageSettings() {
  console.log("Seeding Home Page CMS...");

  const values = { ...DEFAULT_HOME, updatedAt: new Date() };

  await db
    .insert(homePageSettings)
    .values(values)
    .onConflictDoUpdate({ target: homePageSettings.id, set: values });

  console.log("Home Page CMS seeded.");
}
