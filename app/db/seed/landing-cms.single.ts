// app/db/seed/landing-cms.single.ts
//
// Seeds all four landing-page CMS singletons (home, about, contact, CTA)
// with the current site content. Idempotent — safe to re-run.

import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

async function main() {
  console.log("🌱 Seeding Landing Page CMS...\n");

  try {
    const { seedHomePageSettings } = await import("./home-page.seed");
    const { seedAboutPageSettings } = await import("./about-page.seed");
    const { seedContactPageSettings } = await import("./contact-page.seed");
    const { seedSiteCtaSettings } = await import("./site-cta.seed");

    await seedHomePageSettings();
    await seedAboutPageSettings();
    await seedContactPageSettings();
    await seedSiteCtaSettings();

    console.log("\n✅ Landing Page CMS seed complete.\n");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Landing Page CMS seed failed:", err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
