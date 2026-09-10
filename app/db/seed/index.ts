// app/db/seed/index.ts

import "./load-env";

import { seedAllPrograms, seedCategories } from "./programs.seed";
import { seedRoles, seedUserRoles, seedUsers } from "./users.seed";
import { seedAllBlog } from "./blog.seed";
import { seedSiteHeaderSettings } from "./site-header.seed";
import { seedFooterSettings } from "./site-footer.seed";
import { seedHomePageSettings } from "./home-page.seed";
import { seedAboutPageSettings } from "./about-page.seed";
import { seedContactPageSettings } from "./contact-page.seed";
import { seedSiteCtaSettings } from "./site-cta.seed";

async function main() {
  console.log("🌱 Seeding...\n");

  try {
    // ── Auth / users ───────────────────────────────────────────────────────────
    await seedRoles();
    await seedUsers();
    await seedUserRoles();

    // ── Site Header / Layout CMS ───────────────────────────────────────────────
    await seedSiteHeaderSettings();
    await seedFooterSettings();
    await seedHomePageSettings();
    await seedAboutPageSettings();
    await seedContactPageSettings();
    await seedSiteCtaSettings();

    // ── Programs ───────────────────────────────────────────────────────────────
    await seedCategories();
    await seedAllPrograms();

    // ── Blog ───────────────────────────────────────────────────────────────────
    await seedAllBlog();

    console.log("\n✅  Seed complete.\n");
    process.exit(0);
  } catch (err) {
    console.error("\n❌  Seed failed:", err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});