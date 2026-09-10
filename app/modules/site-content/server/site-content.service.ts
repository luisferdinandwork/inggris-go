// app/modules/site-content/server/site-content.service.ts

import { eq } from "drizzle-orm";

import { db } from "@/app/db/db";
import {
  aboutPageSettings,
  contactPageSettings,
  homePageSettings,
  siteCtaSettings,
} from "@/app/db/schema/site-content";
import { footerSettings } from "@/app/db/schema/footer";
import { SOCIAL_PROOF } from "@/constants";

import {
  DEFAULT_ABOUT,
  DEFAULT_CONTACT,
  DEFAULT_CTA,
  DEFAULT_HOME,
} from "../site-content.defaults";
import type { SiteStats } from "../site-content.types";

export const SITE_CONTENT_ID = "default";

/**
 * Merge a (possibly partial / null-filled) settings row over the verbatim
 * defaults so every consumer gets a fully-populated object. `null` columns
 * fall through to the default value; only non-null columns win.
 */
function mergeDefined<T extends Record<string, unknown>>(
  base: T,
  row: Partial<T> | undefined,
): T {
  if (!row) return base;
  const out = { ...base };
  for (const [key, value] of Object.entries(row)) {
    if (value !== null && value !== undefined) {
      (out as Record<string, unknown>)[key] = value;
    }
  }
  return out;
}

export async function getHomePage() {
  const [row] = await db
    .select()
    .from(homePageSettings)
    .where(eq(homePageSettings.id, SITE_CONTENT_ID))
    .limit(1);

  return mergeDefined(DEFAULT_HOME, row as never);
}

export async function getAboutPageSettings() {
  const [row] = await db
    .select()
    .from(aboutPageSettings)
    .where(eq(aboutPageSettings.id, SITE_CONTENT_ID))
    .limit(1);

  return mergeDefined(DEFAULT_ABOUT, row as never);
}

export async function getContactPage() {
  const [row] = await db
    .select()
    .from(contactPageSettings)
    .where(eq(contactPageSettings.id, SITE_CONTENT_ID))
    .limit(1);

  return mergeDefined(DEFAULT_CONTACT, row as never);
}

export async function getSiteCta() {
  const [row] = await db
    .select()
    .from(siteCtaSettings)
    .where(eq(siteCtaSettings.id, SITE_CONTENT_ID))
    .limit(1);

  return mergeDefined(DEFAULT_CTA, row as never);
}

/**
 * Resolved site-wide stats, mirroring the Footer CMS overrides with the
 * same fallbacks `components/Footer.tsx` uses. Home + About hero bands
 * read from here so there is a single source of truth.
 */
export async function getSiteStats(): Promise<SiteStats> {
  const [footer] = await db
    .select({
      alumni: footerSettings.statAlumniOverride,
      programs: footerSettings.statProgramOverride,
      years: footerSettings.statYearsOverride,
      rating: footerSettings.statRatingOverride,
      isActive: footerSettings.isActive,
    })
    .from(footerSettings)
    .where(eq(footerSettings.id, "singleton"))
    .limit(1);

  const active = footer?.isActive !== false;
  const ratingRaw = active ? footer?.rating : null;
  const parsedRating = ratingRaw ? Number(ratingRaw) : NaN;

  return {
    alumni: (active ? footer?.alumni : null) ?? SOCIAL_PROOF.totalStudents,
    programs: (active ? footer?.programs : null) ?? 12,
    years: (active ? footer?.years : null) ?? 8,
    rating: Number.isFinite(parsedRating) ? parsedRating : 4.9,
  };
}

/**
 * Which email address receives contact-form submissions.
 * DB override -> ADMIN_EMAIL env -> hard default.
 */
export async function getContactRecipientEmail(): Promise<string> {
  try {
    const [row] = await db
      .select({ email: contactPageSettings.formRecipientEmail })
      .from(contactPageSettings)
      .where(eq(contactPageSettings.id, SITE_CONTENT_ID))
      .limit(1);

    const dbEmail = row?.email?.trim();
    if (dbEmail) return dbEmail;
  } catch {
    // fall through to env
  }

  return process.env.ADMIN_EMAIL ?? "support@inggrisgo.com";
}
