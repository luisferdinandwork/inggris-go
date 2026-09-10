// app/db/seed/contact-page.seed.ts

import { db } from "@/app/db/db";
import { contactPageSettings } from "../schema/site-content";
import { DEFAULT_CONTACT } from "@/app/modules/site-content/site-content.defaults";

export async function seedContactPageSettings() {
  console.log("Seeding Contact Page CMS...");

  const values = { ...DEFAULT_CONTACT, updatedAt: new Date() };

  await db
    .insert(contactPageSettings)
    .values(values)
    .onConflictDoUpdate({ target: contactPageSettings.id, set: values });

  console.log("Contact Page CMS seeded.");
}
