// app/(dashboard)/dashboard/settings/about/_modules/AboutPageCmsView.tsx
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Building2,
  Eye,
  Info,
  Loader2,
  Sparkles,
  Users,
} from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { PageHeader, PageNav } from "@/components/PageHeader";
import { IconPicker } from "@/components/IconPicker";
import { cn } from "@/lib/utils";
import {
  ActiveToggle,
  Field,
  ImageUploader,
  RepeatableList,
  SaveCard,
  Section,
  StickyPanel,
  TextArea,
  TextInput,
  emptyToNull,
  nullToEmpty,
} from "@/components/cms/CmsForm";
import type {
  AboutHeroEditorial,
  AboutMission,
  IconTag,
  TeamMemberOverride,
  TeamMemberOverrideMap,
} from "@/app/modules/site-content/site-content.types";

const EMPTY_EDITORIAL: AboutHeroEditorial = {
  quote: "",
  authorName: "",
  authorRole: "",
  authorInitials: "",
  fact1Label: "",
  fact1Value: "",
  fact2Label: "",
  fact2Value: "",
};

type FormState = {
  heroLocationBadge: string;
  heroSectionBadge: string;
  heroOverline: string;
  heroTitle: string;
  heroTitleAccent: string;
  heroDescription: string;
  heroTeamStripLabel: string;
  heroEditorial: AboutHeroEditorial;

  whoEyebrow: string;
  whoTitle: string;
  whoParagraphs: string[];
  whoTags: IconTag[];
  whoImageUrl: string;
  whoFilosofiQuote: string;
  whoFilosofiDescription: string;
  whoFounderName: string;
  whoFounderRole: string;
  whoFounderInitials: string;
  whoFounderImageUrl: string;
  whoLocationLine: string;

  vmEyebrow: string;
  vmTitle: string;
  vmTitleAccent: string;
  visionBadge: string;
  visionStatement: string;
  visionStatementAccent: string;
  visionFooterNote: string;
  missions: AboutMission[];

  teamMemberOverrides: TeamMemberOverrideMap;

  isActive: boolean;
};

const EMPTY: FormState = {
  heroLocationBadge: "",
  heroSectionBadge: "",
  heroOverline: "",
  heroTitle: "",
  heroTitleAccent: "",
  heroDescription: "",
  heroTeamStripLabel: "",
  heroEditorial: EMPTY_EDITORIAL,
  whoEyebrow: "",
  whoTitle: "",
  whoParagraphs: [],
  whoTags: [],
  whoImageUrl: "",
  whoFilosofiQuote: "",
  whoFilosofiDescription: "",
  whoFounderName: "",
  whoFounderRole: "",
  whoFounderInitials: "",
  whoFounderImageUrl: "",
  whoLocationLine: "",
  vmEyebrow: "",
  vmTitle: "",
  vmTitleAccent: "",
  visionBadge: "",
  visionStatement: "",
  visionStatementAccent: "",
  visionFooterNote: "",
  missions: [],
  teamMemberOverrides: {},
  isActive: true,
};

export function AboutPageCmsView() {
  const utils = trpc.useUtils();
  const query = trpc.siteContent.getAbout.useQuery();
  const candidatesQuery = trpc.siteContent.getTeamCandidates.useQuery();
  const mutation = trpc.siteContent.updateAbout.useMutation({
    onSuccess: () => {
      toast.success("Halaman Tentang Kami diperbarui!");
      void utils.siteContent.getAbout.invalidate();
    },
    onError: (err) => toast.error(err.message || "Gagal menyimpan"),
  });

  const [form, setForm] = useState<FormState>(EMPTY);

  useEffect(() => {
    if (!query.data) return;
    const d = query.data;
    setForm({
      heroLocationBadge: nullToEmpty(d.heroLocationBadge),
      heroSectionBadge: nullToEmpty(d.heroSectionBadge),
      heroOverline: nullToEmpty(d.heroOverline),
      heroTitle: nullToEmpty(d.heroTitle),
      heroTitleAccent: nullToEmpty(d.heroTitleAccent),
      heroDescription: nullToEmpty(d.heroDescription),
      heroTeamStripLabel: nullToEmpty(d.heroTeamStripLabel),
      heroEditorial: { ...EMPTY_EDITORIAL, ...(d.heroEditorial ?? {}) },
      whoEyebrow: nullToEmpty(d.whoEyebrow),
      whoTitle: nullToEmpty(d.whoTitle),
      whoParagraphs: d.whoParagraphs ?? [],
      whoTags: d.whoTags ?? [],
      whoImageUrl: nullToEmpty(d.whoImageUrl),
      whoFilosofiQuote: nullToEmpty(d.whoFilosofiQuote),
      whoFilosofiDescription: nullToEmpty(d.whoFilosofiDescription),
      whoFounderName: nullToEmpty(d.whoFounderName),
      whoFounderRole: nullToEmpty(d.whoFounderRole),
      whoFounderInitials: nullToEmpty(d.whoFounderInitials),
      whoFounderImageUrl: nullToEmpty(d.whoFounderImageUrl),
      whoLocationLine: nullToEmpty(d.whoLocationLine),
      vmEyebrow: nullToEmpty(d.vmEyebrow),
      vmTitle: nullToEmpty(d.vmTitle),
      vmTitleAccent: nullToEmpty(d.vmTitleAccent),
      visionBadge: nullToEmpty(d.visionBadge),
      visionStatement: nullToEmpty(d.visionStatement),
      visionStatementAccent: nullToEmpty(d.visionStatementAccent),
      visionFooterNote: nullToEmpty(d.visionFooterNote),
      missions: d.missions ?? [],
      teamMemberOverrides: (d.teamMemberOverrides as TeamMemberOverrideMap) ?? {},
      isActive: d.isActive,
    });
  }, [query.data]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function setEditorial<K extends keyof AboutHeroEditorial>(
    key: K,
    value: string,
  ) {
    setForm((f) => ({
      ...f,
      heroEditorial: { ...f.heroEditorial, [key]: value },
    }));
  }
  function setOverride(userId: string, patch: Partial<TeamMemberOverride>) {
    setForm((f) => {
      const current = f.teamMemberOverrides[userId] ?? {};
      const nextEntry = { ...current, ...patch };
      // Drop empty entries to keep the JSON lean.
      const cleaned: TeamMemberOverride = {};
      if (nextEntry.hidden) cleaned.hidden = true;
      if (nextEntry.title?.trim()) cleaned.title = nextEntry.title.trim();
      if (typeof nextEntry.order === "number") cleaned.order = nextEntry.order;
      if (nextEntry.imageUrl?.trim()) cleaned.imageUrl = nextEntry.imageUrl.trim();

      const next = { ...f.teamMemberOverrides };
      if (Object.keys(cleaned).length === 0) delete next[userId];
      else next[userId] = cleaned;
      return { ...f, teamMemberOverrides: next };
    });
  }

  function handleSave() {
    mutation.mutate({
      heroLocationBadge: emptyToNull(form.heroLocationBadge),
      heroSectionBadge: emptyToNull(form.heroSectionBadge),
      heroOverline: emptyToNull(form.heroOverline),
      heroTitle: emptyToNull(form.heroTitle),
      heroTitleAccent: emptyToNull(form.heroTitleAccent),
      heroDescription: emptyToNull(form.heroDescription),
      heroTeamStripLabel: emptyToNull(form.heroTeamStripLabel),
      heroEditorial: form.heroEditorial,
      whoEyebrow: emptyToNull(form.whoEyebrow),
      whoTitle: emptyToNull(form.whoTitle),
      whoParagraphs: form.whoParagraphs.map((p) => p.trim()).filter(Boolean),
      whoTags: form.whoTags,
      whoImageUrl: emptyToNull(form.whoImageUrl),
      whoFilosofiQuote: emptyToNull(form.whoFilosofiQuote),
      whoFilosofiDescription: emptyToNull(form.whoFilosofiDescription),
      whoFounderName: emptyToNull(form.whoFounderName),
      whoFounderRole: emptyToNull(form.whoFounderRole),
      whoFounderInitials: emptyToNull(form.whoFounderInitials),
      whoFounderImageUrl: emptyToNull(form.whoFounderImageUrl),
      whoLocationLine: emptyToNull(form.whoLocationLine),
      vmEyebrow: emptyToNull(form.vmEyebrow),
      vmTitle: emptyToNull(form.vmTitle),
      vmTitleAccent: emptyToNull(form.vmTitleAccent),
      visionBadge: emptyToNull(form.visionBadge),
      visionStatement: emptyToNull(form.visionStatement),
      visionStatementAccent: emptyToNull(form.visionStatementAccent),
      visionFooterNote: emptyToNull(form.visionFooterNote),
      missions: form.missions,
      teamMemberOverrides: form.teamMemberOverrides,
      isActive: form.isActive,
    });
  }

  const crumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "CMS Halaman", href: "/dashboard/settings/home" },
    { label: "Tentang Kami", icon: <Info /> },
  ];

  if (query.isLoading) {
    return (
      <div className="flex flex-col gap-y-4 pt-2.5">
        <PageNav sticky>
          <PageHeader
            breadcrumbs={crumbs}
            title="CMS Tentang Kami"
            description="Hero, Siapa Kami, Visi & Misi, dan Tim."
          />
        </PageNav>
        <div className="mx-4 flex min-h-[420px] items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm lg:mx-6">
          <Loader2 className="size-7 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  const candidates = candidatesQuery.data ?? [];

  return (
    <div className="flex flex-col gap-y-4 pt-2.5">
      <PageNav sticky>
        <PageHeader
          breadcrumbs={crumbs}
          title="CMS Tentang Kami"
          description="Hero (statistik mengikuti Footer), Siapa Kami, Visi & Misi, dan Tim."
        />
      </PageNav>

      <div className="flex flex-col gap-4 px-4 pb-10 lg:px-6">
        <ActiveToggle
          active={form.isActive}
          onToggle={() => set("isActive", !form.isActive)}
          icon={Info}
          label="CMS Tentang Kami"
          hint="Saat aktif, halaman Tentang Kami memakai konten dari sini."
        />

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex flex-col gap-4">
            {/* HERO */}
            <Section
              icon={Sparkles}
              title="Hero"
              description="Statistik mengikuti angka di Footer CMS; label bisa diubah di bawah."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Badge Lokasi">
                  <TextInput
                    value={form.heroLocationBadge}
                    onChange={(v) => set("heroLocationBadge", v)}
                    placeholder="Kampung Inggris Pare, Kediri"
                  />
                </Field>
                <Field label="Badge Bagian">
                  <TextInput
                    value={form.heroSectionBadge}
                    onChange={(v) => set("heroSectionBadge", v)}
                    placeholder="Tentang Kami"
                  />
                </Field>
              </div>
              <Field label="Overline" description="Label kecil di atas judul.">
                <TextInput
                  value={form.heroOverline}
                  onChange={(v) => set("heroOverline", v)}
                  placeholder="Kisah kami"
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Judul">
                  <TextInput
                    value={form.heroTitle}
                    onChange={(v) => set("heroTitle", v)}
                    placeholder="Membangun Kepercayaan Diri"
                  />
                </Field>
                <Field label="Aksen Judul">
                  <TextInput
                    value={form.heroTitleAccent}
                    onChange={(v) => set("heroTitleAccent", v)}
                    placeholder="Berbahasa Inggris"
                  />
                </Field>
              </div>
              <Field label="Deskripsi">
                <TextArea
                  value={form.heroDescription}
                  onChange={(v) => set("heroDescription", v)}
                  rows={2}
                />
              </Field>
              <Field label="Label Strip Tim">
                <TextInput
                  value={form.heroTeamStripLabel}
                  onChange={(v) => set("heroTeamStripLabel", v)}
                  placeholder="Tim Inggris Go"
                />
              </Field>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5">
                <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Band Editorial Bawah
                </p>
                <div className="grid gap-3">
                  <Field label="Kutipan">
                    <TextInput
                      value={form.heroEditorial.quote}
                      onChange={(v) => setEditorial("quote", v)}
                      placeholder="Speak First, Perfect Later."
                    />
                  </Field>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Field label="Nama Penulis">
                      <TextInput
                        value={form.heroEditorial.authorName}
                        onChange={(v) => setEditorial("authorName", v)}
                      />
                    </Field>
                    <Field label="Peran Penulis">
                      <TextInput
                        value={form.heroEditorial.authorRole}
                        onChange={(v) => setEditorial("authorRole", v)}
                      />
                    </Field>
                    <Field label="Inisial">
                      <TextInput
                        value={form.heroEditorial.authorInitials}
                        onChange={(v) => setEditorial("authorInitials", v)}
                      />
                    </Field>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Fakta 1 — Label">
                      <TextInput
                        value={form.heroEditorial.fact1Label}
                        onChange={(v) => setEditorial("fact1Label", v)}
                      />
                    </Field>
                    <Field label="Fakta 1 — Nilai">
                      <TextInput
                        value={form.heroEditorial.fact1Value}
                        onChange={(v) => setEditorial("fact1Value", v)}
                      />
                    </Field>
                    <Field label="Fakta 2 — Label">
                      <TextInput
                        value={form.heroEditorial.fact2Label}
                        onChange={(v) => setEditorial("fact2Label", v)}
                      />
                    </Field>
                    <Field label="Fakta 2 — Nilai">
                      <TextInput
                        value={form.heroEditorial.fact2Value}
                        onChange={(v) => setEditorial("fact2Value", v)}
                      />
                    </Field>
                  </div>
                </div>
              </div>
            </Section>

            {/* WHO ARE WE */}
            <Section
              icon={Building2}
              title="Siapa Kami"
              description="Judul, paragraf, tag, gambar, filosofi, dan founder."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Eyebrow">
                  <TextInput
                    value={form.whoEyebrow}
                    onChange={(v) => set("whoEyebrow", v)}
                    placeholder="Profil Perusahaan"
                  />
                </Field>
                <Field label="Judul">
                  <TextInput
                    value={form.whoTitle}
                    onChange={(v) => set("whoTitle", v)}
                    placeholder="Siapa Kami?"
                  />
                </Field>
              </div>

              <Field label="Paragraf">
                <RepeatableList<string>
                  items={form.whoParagraphs}
                  onChange={(next) => set("whoParagraphs", next)}
                  itemLabel="Paragraf"
                  max={6}
                  makeNew={() => ""}
                  renderItem={(item, _u, index) => (
                    <TextArea
                      value={item}
                      onChange={(v) =>
                        set(
                          "whoParagraphs",
                          form.whoParagraphs.map((p, i) => (i === index ? v : p)),
                        )
                      }
                      rows={3}
                    />
                  )}
                />
              </Field>

              <Field label="Tag / Chip">
                <RepeatableList<IconTag>
                  items={form.whoTags}
                  onChange={(next) => set("whoTags", next)}
                  itemLabel="Tag"
                  max={6}
                  makeNew={() => ({ icon: "circle", text: "" })}
                  renderItem={(item, update) => (
                    <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
                      <Field label="Ikon">
                        <IconPicker
                          value={item.icon || undefined}
                          onChange={(name) => update({ icon: name ?? "" })}
                        />
                      </Field>
                      <Field label="Teks">
                        <TextInput
                          value={item.text}
                          onChange={(v) => update({ text: v })}
                          placeholder="Kampung Inggris Pare, Kediri"
                        />
                      </Field>
                    </div>
                  )}
                />
              </Field>

              <Field label="Gambar / Logo Kartu Brand">
                <ImageUploader
                  value={form.whoImageUrl}
                  onChange={(v) => set("whoImageUrl", v)}
                  previewShape="square"
                />
              </Field>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Filosofi — Kutipan">
                  <TextInput
                    value={form.whoFilosofiQuote}
                    onChange={(v) => set("whoFilosofiQuote", v)}
                    placeholder="Speak First, Perfect Later."
                  />
                </Field>
                <Field label="Filosofi — Deskripsi">
                  <TextInput
                    value={form.whoFilosofiDescription}
                    onChange={(v) => set("whoFilosofiDescription", v)}
                  />
                </Field>
                <Field label="Founder — Nama">
                  <TextInput
                    value={form.whoFounderName}
                    onChange={(v) => set("whoFounderName", v)}
                  />
                </Field>
                <Field label="Founder — Peran">
                  <TextInput
                    value={form.whoFounderRole}
                    onChange={(v) => set("whoFounderRole", v)}
                  />
                </Field>
                <Field label="Founder — Inisial">
                  <TextInput
                    value={form.whoFounderInitials}
                    onChange={(v) => set("whoFounderInitials", v)}
                  />
                </Field>
                <Field label="Baris Lokasi">
                  <TextInput
                    value={form.whoLocationLine}
                    onChange={(v) => set("whoLocationLine", v)}
                  />
                </Field>
              </div>
              <Field label="Founder — Foto (opsional)">
                <ImageUploader
                  value={form.whoFounderImageUrl}
                  onChange={(v) => set("whoFounderImageUrl", v)}
                  previewShape="circle"
                />
              </Field>
            </Section>

            {/* VISION & MISSION */}
            <Section
              icon={Eye}
              title="Visi & Misi"
              description="Pernyataan visi lengkap dan daftar misi."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Eyebrow">
                  <TextInput
                    value={form.vmEyebrow}
                    onChange={(v) => set("vmEyebrow", v)}
                    placeholder="Visi & Misi"
                  />
                </Field>
                <Field label="Judul">
                  <TextInput
                    value={form.vmTitle}
                    onChange={(v) => set("vmTitle", v)}
                    placeholder="Arah & Tujuan Kami"
                  />
                </Field>
                <Field label="Aksen Judul" description="Kata yang diberi warna.">
                  <TextInput
                    value={form.vmTitleAccent}
                    onChange={(v) => set("vmTitleAccent", v)}
                    placeholder="Tujuan"
                  />
                </Field>
                <Field label="Badge Visi">
                  <TextInput
                    value={form.visionBadge}
                    onChange={(v) => set("visionBadge", v)}
                    placeholder="Inggris Go · Est. 2022"
                  />
                </Field>
              </div>
              <Field label="Pernyataan Visi">
                <TextArea
                  value={form.visionStatement}
                  onChange={(v) => set("visionStatement", v)}
                  rows={3}
                />
              </Field>
              <Field
                label="Pernyataan Visi — Aksen"
                description="Bagian akhir yang diberi warna emas."
              >
                <TextInput
                  value={form.visionStatementAccent}
                  onChange={(v) => set("visionStatementAccent", v)}
                  placeholder="tanpa rasa takut, tanpa hambatan."
                />
              </Field>
              <Field label="Catatan Kaki Visi">
                <TextInput
                  value={form.visionFooterNote}
                  onChange={(v) => set("visionFooterNote", v)}
                  placeholder="Membangun Indonesia yang berbicara dunia"
                />
              </Field>

              <Field label="Misi">
                <RepeatableList<AboutMission>
                  items={form.missions}
                  onChange={(next) => set("missions", next)}
                  itemLabel="Misi"
                  max={10}
                  makeNew={() => ({
                    num: String(form.missions.length + 1).padStart(2, "0"),
                    text: "",
                  })}
                  renderItem={(item, update) => (
                    <div className="grid gap-3 sm:grid-cols-[80px_1fr]">
                      <Field label="No.">
                        <TextInput
                          value={item.num}
                          onChange={(v) => update({ num: v })}
                        />
                      </Field>
                      <Field label="Teks">
                        <TextArea
                          value={item.text}
                          onChange={(v) => update({ text: v })}
                          rows={2}
                        />
                      </Field>
                    </div>
                  )}
                />
              </Field>
            </Section>

            {/* TEAM — drives the "Tim Inggris Go" avatar strip in the Hero */}
            <Section
              icon={Users}
              title="Tim Inggris Go (strip di Hero)"
              description="Daftar otomatis dari user ber-role karyawan. Atur siapa yang tampil, urutan, jabatan publik, dan foto di strip avatar pada bagian Hero."
            >
              <div className="space-y-2">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Anggota ({candidates.length})
                </p>
                {candidatesQuery.isLoading && (
                  <Loader2 className="size-4 animate-spin text-slate-400" />
                )}
                {candidates.map((c) => {
                  const o = form.teamMemberOverrides[c.id] ?? {};
                  const hidden = o.hidden ?? false;
                  return (
                    <div
                      key={c.id}
                      className={cn(
                        "rounded-2xl border p-3.5 transition-colors",
                        hidden
                          ? "border-slate-200 bg-slate-50 opacity-60"
                          : "border-slate-200 bg-white",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-black text-slate-800">
                            {c.name}
                          </p>
                          <p className="truncate text-[11px] text-slate-400">
                            {c.email} · {c.defaultTitle}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setOverride(c.id, { hidden: !hidden })
                          }
                          className={cn(
                            "shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-black transition-colors",
                            hidden
                              ? "bg-slate-200 text-slate-600 hover:bg-slate-300"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
                          )}
                        >
                          {hidden ? "Disembunyikan" : "Tampil"}
                        </button>
                      </div>
                      {!hidden && (
                        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_100px]">
                          <Field label="Jabatan publik (opsional)">
                            <TextInput
                              value={o.title ?? ""}
                              onChange={(v) => setOverride(c.id, { title: v })}
                              placeholder={c.defaultTitle}
                            />
                          </Field>
                          <Field label="Urutan">
                            <TextInput
                              type="number"
                              value={
                                typeof o.order === "number"
                                  ? String(o.order)
                                  : ""
                              }
                              onChange={(v) =>
                                setOverride(c.id, {
                                  order: v === "" ? undefined : Number(v),
                                })
                              }
                            />
                          </Field>
                          <div className="sm:col-span-2">
                            <Field label="Foto (opsional)">
                              <ImageUploader
                                value={o.imageUrl ?? ""}
                                onChange={(v) =>
                                  setOverride(c.id, { imageUrl: v })
                                }
                                previewShape="circle"
                              />
                            </Field>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Section>
          </div>

          <aside>
            <StickyPanel>
              <SaveCard
                onSave={handleSave}
                isSaving={mutation.isPending}
                note="Perubahan langsung berlaku di halaman Tentang Kami."
                checklist={[
                  { label: "Judul Hero", ok: !!form.heroTitle },
                  { label: "Paragraf Siapa Kami", ok: form.whoParagraphs.length > 0 },
                  { label: "Pernyataan Visi", ok: !!form.visionStatement },
                  { label: "Misi", ok: form.missions.length > 0 },
                ]}
              />
            </StickyPanel>
          </aside>
        </div>
      </div>
    </div>
  );
}
