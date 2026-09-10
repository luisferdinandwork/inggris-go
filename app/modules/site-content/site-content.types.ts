// app/modules/site-content/site-content.types.ts
//
// Shared TS shapes for the jsonb columns of the landing-page CMS tables
// (home_page_settings, about_page_settings, contact_page_settings,
// site_cta_settings). Imported by the Drizzle schema, the Zod input
// schemas, the service defaults, and the public section components.

/* ── Generic ─────────────────────────────────────────────── */

export type IconTag = {
  icon: string;
  text: string;
};

export type LabelValue = {
  value: string;
  label: string;
};

/* ── Home ────────────────────────────────────────────────── */

export type HeroFloatingText = {
  speechName: string;
  speechLocation: string;
  speechQuote: string;
  speechInitials: string;
  liveTitle: string;
  activeText: string;
  chatHeader: string;
  chatMsg1: string;
  chatMsg2: string;
};

export type HeroStatLabel = {
  /** Which resolved site-stat feeds the value. */
  key: "alumni" | "rating" | "years" | "programs";
  label: string;
};

export type ProblemColorKey = "orange" | "teal" | "amber" | "purple";

export type ProblemCard = {
  number: string;
  title: string;
  body: string;
  icon: string;
  colorKey: ProblemColorKey;
};

export type MethodStep = {
  num: string;
  title: string;
  subtitle: string;
  body: string;
  tags: string[];
  icon: string;
};

export type AdvantageGradientKey = "blue" | "navy" | "gold" | "sky";

export type AdvantageFeature = {
  title: string;
  desc: string;
  icon: string;
  gradientKey: AdvantageGradientKey;
};

/* ── About ───────────────────────────────────────────────── */

export type AboutHeroEditorial = {
  quote: string;
  authorName: string;
  authorRole: string;
  authorInitials: string;
  fact1Label: string;
  fact1Value: string;
  fact2Label: string;
  fact2Value: string;
};

export type AboutMission = {
  num: string;
  text: string;
};

export type TeamMemberOverride = {
  hidden?: boolean;
  /** Public job title override (falls back to the user's role label). */
  title?: string;
  order?: number;
  imageUrl?: string;
};

export type TeamMemberOverrideMap = Record<string, TeamMemberOverride>;

/** Resolved team member returned by `siteContent.getAbout`. */
export type TeamMember = {
  id: string;
  name: string;
  title: string;
  imageUrl: string | null;
  initials: string;
  order: number;
};

/* ── Contact ─────────────────────────────────────────────── */

export type ContactHeroStat = {
  icon: string;
  title: string;
  subtitle: string;
};

export type ContactMethodColorKey =
  | "green"
  | "blue"
  | "violet"
  | "teal"
  | "amber";

export type ContactMethod = {
  icon: string;
  label: string;
  whenToUse: string;
  detail: string;
  actionLabel: string;
  actionHref: string;
  external: boolean;
  badge: string;
  colorKey: ContactMethodColorKey;
};

export type ContactInfoItem = {
  icon: string;
  label: string;
  value: string;
  href: string;
  sub: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

export type WhyChooseColorKey = "blue" | "violet" | "teal" | "amber";

export type WhyChooseItem = {
  icon: string;
  title: string;
  desc: string;
  colorKey: WhyChooseColorKey;
};

/* ── Resolved site stats (mirrors Footer CMS) ────────────── */

export type SiteStats = {
  alumni: number;
  rating: number;
  years: number;
  programs: number;
};
