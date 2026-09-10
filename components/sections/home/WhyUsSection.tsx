"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

import { trpc } from "@/lib/trpc/client";
import { Icon } from "@/components/Icon";
import { BRAND, GRADIENT_GOLD_TEXT } from "@/constants/brand";
import { SOCIAL_PROOF } from "@/constants";
import { DEFAULT_HOME } from "@/app/modules/site-content/site-content.defaults";
import type { AdvantageGradientKey } from "@/app/modules/site-content/site-content.types";

const ease = [0.22, 1, 0.36, 1] as const;

const GRADIENT_MAP: Record<AdvantageGradientKey, string> = {
  blue: BRAND.gradientBlue,
  navy: BRAND.gradientNavy,
  gold: BRAND.gradientGold,
  sky: BRAND.gradientSky,
};

type Feature = (typeof DEFAULT_HOME.advantageFeatures)[number];

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-72px 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.08, ease }}
      whileHover={{ y: -6, transition: { duration: 0.28, ease } }}
      className="group relative flex cursor-default flex-col overflow-hidden rounded-2xl p-6"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "rgba(255,255,255,0.07)";
        el.style.borderColor = "rgba(255,255,255,0.13)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "rgba(255,255,255,0.04)";
        el.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      <div
        className="mb-5 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-white transition-transform duration-300 ease-out group-hover:-rotate-3 group-hover:scale-110"
        style={{ background: GRADIENT_MAP[feature.gradientKey] ?? BRAND.gradientBlue }}
      >
        <Icon name={feature.icon} className="h-5 w-5" />
      </div>

      <h3
        className="mb-2.5 font-display font-bold leading-snug text-white"
        style={{ fontSize: "0.9375rem" }}
      >
        {feature.title}
      </h3>

      <p
        className="leading-relaxed"
        style={{
          fontSize: "0.8125rem",
          color: "rgba(255,255,255,0.45)",
          lineHeight: "1.7",
        }}
      >
        {feature.desc}
      </p>
    </motion.div>
  );
}

function GeometricLines() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <path
        d="M 0 180 L 0 40 Q 0 0 40 0 L 180 0"
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth="1"
      />
      <line
        x1="75%"
        y1="0"
        x2="100%"
        y2="30%"
        stroke="rgba(26,82,200,0.08)"
        strokeWidth="1"
      />
      <line
        x1="5%"
        y1="50%"
        x2="95%"
        y2="50%"
        stroke="rgba(255,255,255,0.025)"
        strokeWidth="1"
        strokeDasharray="6 18"
      />
    </svg>
  );
}

export default function WhyUsSection() {
  const { data } = trpc.siteContent.getHome.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });
  const c = data && data.isActive !== false ? data : DEFAULT_HOME;

  const eyebrow = c.advantageEyebrow || DEFAULT_HOME.advantageEyebrow;
  const title = c.advantageTitle || DEFAULT_HOME.advantageTitle;
  const titleAccent =
    c.advantageTitleAccent ?? DEFAULT_HOME.advantageTitleAccent;
  const description =
    c.advantageDescription || DEFAULT_HOME.advantageDescription;
  const features =
    c.advantageFeatures && c.advantageFeatures.length > 0
      ? c.advantageFeatures
      : DEFAULT_HOME.advantageFeatures;

  return (
    <section
      className="relative w-full overflow-hidden py-20 lg:py-28"
      style={{ background: BRAND.blueAbyss }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Ccircle cx='12' cy='12' r='1' fill='%23ffffff' fill-opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundSize: "24px 24px",
        }}
      />

      <GeometricLines />

      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: "-25%",
          left: "-12%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${BRAND.overlayBlueBlob} 0%, transparent 65%)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          bottom: "-20%",
          right: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${BRAND.overlayGoldBlob} 0%, transparent 65%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-12">
        <div className="mb-12 flex flex-col items-center text-center lg:mb-16">
          <Reveal>
            <span
              className="mb-5 inline-block rounded-full px-4 py-1.5 font-display font-semibold uppercase tracking-tight"
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
                background: BRAND.overlayBlueIconStrong,
                color: BRAND.blueSky,
                border: `1px solid ${BRAND.overlayBlueCard}`,
              }}
            >
              {eyebrow}
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h2
              className="mb-4 font-display font-extrabold leading-[1.08] text-white"
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                letterSpacing: "-0.022em",
              }}
            >
              {title}{" "}
              {titleAccent && (
                <span style={GRADIENT_GOLD_TEXT}>{titleAccent}</span>
              )}
              ?
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <p
              className="leading-relaxed"
              style={{
                fontSize: "0.9375rem",
                color: "rgba(255,255,255,0.4)",
                maxWidth: "400px",
              }}
            >
              {description}
            </p>
          </Reveal>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {features.map((f, i) => (
            <FeatureCard key={`${f.title}-${i}`} feature={f} index={i} />
          ))}
        </div>

        {/* Bottom CTA band — static (not CMS-managed) */}
        <Reveal delay={0.1}>
          <div
            className="relative flex flex-col items-center justify-between gap-5 overflow-hidden rounded-2xl px-8 py-7 sm:flex-row"
            style={{
              background: BRAND.overlayBlueCard,
              border: `1px solid ${BRAND.overlayBlueIcon}`,
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, ${BRAND.overlayBlueIcon} 0px, ${BRAND.overlayBlueIcon} 1px, transparent 1px, transparent 14px)`,
              }}
            />

            <div className="relative z-10 text-center sm:text-left">
              <p
                className="mb-1 font-display font-bold text-white"
                style={{ fontSize: "1rem" }}
              >
                Siap mulai perjalananmu?
              </p>
              <p
                style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.45)" }}
              >
                Bergabung dengan {SOCIAL_PROOF.activeStudents}+ siswa yang sudah
                merasakan manfaatnya.
              </p>
            </div>

            <a
              href="#programs"
              className="relative z-10 inline-flex flex-shrink-0 items-center gap-2 rounded-full px-6 py-3 font-display font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
              style={{
                fontSize: "0.875rem",
                background: BRAND.gradientGold,
                boxShadow: BRAND.shadowGoldBtn,
                color: BRAND.blueNavy,
              }}
            >
              Lihat Program Kami
              <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth={1.7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
