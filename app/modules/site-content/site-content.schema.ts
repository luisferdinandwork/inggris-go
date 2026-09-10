// app/modules/site-content/site-content.schema.ts
//
// Zod input schemas for the siteContent router update mutations.
// Scalars are nullable+optional (empty -> null on the client); arrays are
// validated by item shape. Keep generous max lengths — this is trusted
// admin input, the point is to catch obvious mistakes, not to be strict.

import { z } from "zod";

const str = z.string().trim().max(4000).nullable().optional();
const shortStr = z.string().trim().max(400).nullable().optional();
const icon = z.string().trim().max(80).default("");
const bool = z.boolean().optional();

/* ── Shared item shapes ──────────────────────────────────── */

const iconTag = z.object({
  icon,
  text: z.string().trim().max(400).default(""),
});

const labelValue = z.object({
  value: z.string().trim().max(200).default(""),
  label: z.string().trim().max(200).default(""),
});

/* ── HOME ────────────────────────────────────────────────── */

const heroFloatingText = z.object({
  speechName: z.string().trim().max(200).default(""),
  speechLocation: z.string().trim().max(200).default(""),
  speechQuote: z.string().trim().max(400).default(""),
  speechInitials: z.string().trim().max(8).default(""),
  liveTitle: z.string().trim().max(120).default(""),
  activeText: z.string().trim().max(120).default(""),
  chatHeader: z.string().trim().max(120).default(""),
  chatMsg1: z.string().trim().max(200).default(""),
  chatMsg2: z.string().trim().max(200).default(""),
});

const heroStatLabel = z.object({
  key: z.enum(["alumni", "rating", "years", "programs"]),
  label: z.string().trim().max(120).default(""),
});

const problemCard = z.object({
  number: z.string().trim().max(8).default(""),
  title: z.string().trim().max(200).default(""),
  body: z.string().trim().max(1000).default(""),
  icon,
  colorKey: z.enum(["orange", "teal", "amber", "purple"]).default("orange"),
});

const methodStep = z.object({
  num: z.string().trim().max(8).default(""),
  title: z.string().trim().max(120).default(""),
  subtitle: z.string().trim().max(160).default(""),
  body: z.string().trim().max(1000).default(""),
  tags: z.array(z.string().trim().max(80)).max(12).default([]),
  icon,
});

const advantageFeature = z.object({
  title: z.string().trim().max(160).default(""),
  desc: z.string().trim().max(1000).default(""),
  icon,
  gradientKey: z.enum(["blue", "navy", "gold", "sky"]).default("blue"),
});

export const updateHomeInput = z.object({
  heroBadgeText: shortStr,
  heroTitle: shortStr,
  heroTitleAccent: shortStr,
  heroSubtitle: str,
  heroSubtitleHighlight: shortStr,
  heroDescription: str,
  heroImageUrl: str,
  heroImageAlt: shortStr,
  heroPrimaryCtaLabel: shortStr,
  heroPrimaryCtaHref: shortStr,
  heroSecondaryCtaLabel: shortStr,
  heroSecondaryCtaHref: shortStr,
  heroFloatingText: heroFloatingText.nullable().optional(),
  heroStatLabels: z.array(heroStatLabel).max(6).nullable().optional(),

  problemEyebrow: shortStr,
  problemTitle: shortStr,
  problemTitleAccent: shortStr,
  problemDescription: str,
  problemCards: z.array(problemCard).max(12).nullable().optional(),
  problemCalloutText: str,
  problemCalloutHighlight: shortStr,
  problemCalloutIcon: shortStr,

  methodEyebrow: shortStr,
  methodTitle: shortStr,
  methodTitleAccent: shortStr,
  methodDescription: str,
  methodSteps: z.array(methodStep).max(12).nullable().optional(),
  methodFootnotePrefix: shortStr,
  methodFootnoteHighlight: shortStr,
  methodFootnoteSuffix: shortStr,

  advantageEyebrow: shortStr,
  advantageTitle: shortStr,
  advantageTitleAccent: shortStr,
  advantageDescription: str,
  advantageFeatures: z.array(advantageFeature).max(12).nullable().optional(),

  isActive: bool,
});

/* ── ABOUT ───────────────────────────────────────────────── */

const aboutEditorial = z.object({
  quote: z.string().trim().max(400).default(""),
  authorName: z.string().trim().max(200).default(""),
  authorRole: z.string().trim().max(200).default(""),
  authorInitials: z.string().trim().max(8).default(""),
  fact1Label: z.string().trim().max(120).default(""),
  fact1Value: z.string().trim().max(200).default(""),
  fact2Label: z.string().trim().max(120).default(""),
  fact2Value: z.string().trim().max(200).default(""),
});

const aboutMission = z.object({
  num: z.string().trim().max(8).default(""),
  text: z.string().trim().max(1000).default(""),
});

const teamMemberOverride = z.object({
  hidden: z.boolean().optional(),
  title: z.string().trim().max(160).optional(),
  order: z.number().int().optional(),
  imageUrl: z.string().trim().max(1000).optional(),
});

export const updateAboutInput = z.object({
  heroLocationBadge: shortStr,
  heroSectionBadge: shortStr,
  heroOverline: shortStr,
  heroTitle: shortStr,
  heroTitleAccent: shortStr,
  heroDescription: str,
  heroStatLabels: z.array(heroStatLabel).max(6).nullable().optional(),
  heroTeamStripLabel: shortStr,
  heroEditorial: aboutEditorial.nullable().optional(),

  whoEyebrow: shortStr,
  whoTitle: shortStr,
  whoParagraphs: z
    .array(z.string().trim().max(2000))
    .max(8)
    .nullable()
    .optional(),
  whoTags: z.array(iconTag).max(8).nullable().optional(),
  whoImageUrl: str,
  whoFilosofiQuote: str,
  whoFilosofiDescription: str,
  whoFounderName: shortStr,
  whoFounderRole: shortStr,
  whoFounderInitials: shortStr,
  whoFounderImageUrl: str,
  whoLocationLine: shortStr,

  vmEyebrow: shortStr,
  vmTitle: shortStr,
  vmTitleAccent: shortStr,
  visionBadge: shortStr,
  visionStatement: str,
  visionStatementAccent: str,
  visionFooterNote: shortStr,
  missions: z.array(aboutMission).max(12).nullable().optional(),

  teamMemberOverrides: z.record(z.string(), teamMemberOverride).nullable().optional(),

  isActive: bool,
});

/* ── CONTACT ─────────────────────────────────────────────── */

const contactHeroStat = z.object({
  icon,
  title: z.string().trim().max(200).default(""),
  subtitle: z.string().trim().max(300).default(""),
});

const contactMethod = z.object({
  icon,
  label: z.string().trim().max(120).default(""),
  whenToUse: z.string().trim().max(300).default(""),
  detail: z.string().trim().max(400).default(""),
  actionLabel: z.string().trim().max(120).default(""),
  actionHref: z.string().trim().max(1000).default(""),
  external: z.boolean().default(false),
  badge: z.string().trim().max(60).default(""),
  colorKey: z
    .enum(["green", "blue", "violet", "teal", "amber"])
    .default("blue"),
});

const contactInfoItem = z.object({
  icon,
  label: z.string().trim().max(120).default(""),
  value: z.string().trim().max(300).default(""),
  href: z.string().trim().max(1000).default(""),
  sub: z.string().trim().max(200).default(""),
});

const faqItem = z.object({
  q: z.string().trim().max(400).default(""),
  a: z.string().trim().max(3000).default(""),
});

const whyChooseItem = z.object({
  icon,
  title: z.string().trim().max(200).default(""),
  desc: z.string().trim().max(1000).default(""),
  colorKey: z.enum(["blue", "violet", "teal", "amber"]).default("blue"),
});

export const updateContactInput = z.object({
  heroBadgeText: shortStr,
  heroTitle: shortStr,
  heroTitleAccent: shortStr,
  heroDescription: str,
  heroTrustPills: z.array(iconTag).max(8).nullable().optional(),
  heroStats: z.array(contactHeroStat).max(8).nullable().optional(),
  heroImageUrl: str,

  methodsEyebrow: shortStr,
  methodsTitle: shortStr,
  methodsSubtitle: str,
  methods: z.array(contactMethod).max(8).nullable().optional(),

  formRecipientEmail: z.string().trim().max(200).nullable().optional(),
  formEyebrow: shortStr,
  formTitle: shortStr,
  formSubtitle: str,
  formCategories: z.array(labelValue).max(20).nullable().optional(),
  infoItems: z.array(contactInfoItem).max(12).nullable().optional(),
  faqItems: z.array(faqItem).max(30).nullable().optional(),
  faqSeeAllHref: shortStr,
  sidebarCtaTitle: shortStr,
  sidebarCtaText: str,
  sidebarCtaButtonLabel: shortStr,
  sidebarCtaButtonHref: shortStr,

  whyChooseEyebrow: shortStr,
  whyChooseBadgeText: shortStr,
  whyChooseTitle: shortStr,
  whyChooseDescription: str,
  whyChooseItems: z.array(whyChooseItem).max(12).nullable().optional(),

  isActive: bool,
});

/* ── SHARED CTA ──────────────────────────────────────────── */

export const updateCtaInput = z.object({
  eyebrow: str,
  title: shortStr,
  titleAccent: shortStr,
  description: str,
  primaryLabel: shortStr,
  primaryHref: shortStr,
  secondaryLabel: shortStr,
  secondaryHref: shortStr,
  secondaryIsWhatsapp: z.boolean().default(true),
  trustPoints: z.array(z.string().trim().max(200)).max(8).nullable().optional(),
  isActive: bool,
});

export type UpdateHomeInput = z.infer<typeof updateHomeInput>;
export type UpdateAboutInput = z.infer<typeof updateAboutInput>;
export type UpdateContactInput = z.infer<typeof updateContactInput>;
export type UpdateCtaInput = z.infer<typeof updateCtaInput>;
