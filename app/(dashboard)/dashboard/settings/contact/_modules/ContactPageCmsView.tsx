// app/(dashboard)/dashboard/settings/contact/_modules/ContactPageCmsView.tsx
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  HelpCircle,
  Inbox,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { PageHeader, PageNav } from "@/components/PageHeader";
import { IconPicker } from "@/components/IconPicker";
import {
  ActiveToggle,
  ColorKeyPicker,
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
  ContactHeroStat,
  ContactInfoItem,
  ContactMethod,
  FaqItem,
  IconTag,
  LabelValue,
  WhyChooseItem,
} from "@/app/modules/site-content/site-content.types";

const METHOD_COLORS = ["green", "blue", "violet", "teal", "amber"] as const;
const WHY_COLORS = ["blue", "violet", "teal", "amber"] as const;

type FormState = {
  heroBadgeText: string;
  heroTitle: string;
  heroTitleAccent: string;
  heroDescription: string;
  heroTrustPills: IconTag[];
  heroStats: ContactHeroStat[];
  heroImageUrl: string;

  methodsEyebrow: string;
  methodsTitle: string;
  methodsSubtitle: string;
  methods: ContactMethod[];

  formRecipientEmail: string;
  formEyebrow: string;
  formTitle: string;
  formSubtitle: string;
  formCategories: LabelValue[];
  infoItems: ContactInfoItem[];
  faqItems: FaqItem[];
  faqSeeAllHref: string;
  sidebarCtaTitle: string;
  sidebarCtaText: string;
  sidebarCtaButtonLabel: string;
  sidebarCtaButtonHref: string;

  whyChooseBadgeText: string;
  whyChooseTitle: string;
  whyChooseDescription: string;
  whyChooseItems: WhyChooseItem[];

  isActive: boolean;
};

const EMPTY: FormState = {
  heroBadgeText: "",
  heroTitle: "",
  heroTitleAccent: "",
  heroDescription: "",
  heroTrustPills: [],
  heroStats: [],
  heroImageUrl: "",
  methodsEyebrow: "",
  methodsTitle: "",
  methodsSubtitle: "",
  methods: [],
  formRecipientEmail: "",
  formEyebrow: "",
  formTitle: "",
  formSubtitle: "",
  formCategories: [],
  infoItems: [],
  faqItems: [],
  faqSeeAllHref: "",
  sidebarCtaTitle: "",
  sidebarCtaText: "",
  sidebarCtaButtonLabel: "",
  sidebarCtaButtonHref: "",
  whyChooseBadgeText: "",
  whyChooseTitle: "",
  whyChooseDescription: "",
  whyChooseItems: [],
  isActive: true,
};

export function ContactPageCmsView() {
  const utils = trpc.useUtils();
  const query = trpc.siteContent.getContact.useQuery();
  const mutation = trpc.siteContent.updateContact.useMutation({
    onSuccess: () => {
      toast.success("Halaman Hubungi Kami diperbarui!");
      void utils.siteContent.getContact.invalidate();
    },
    onError: (err) => toast.error(err.message || "Gagal menyimpan"),
  });

  const [form, setForm] = useState<FormState>(EMPTY);

  useEffect(() => {
    if (!query.data) return;
    const d = query.data;
    setForm({
      heroBadgeText: nullToEmpty(d.heroBadgeText),
      heroTitle: nullToEmpty(d.heroTitle),
      heroTitleAccent: nullToEmpty(d.heroTitleAccent),
      heroDescription: nullToEmpty(d.heroDescription),
      heroTrustPills: d.heroTrustPills ?? [],
      heroStats: d.heroStats ?? [],
      heroImageUrl: nullToEmpty(d.heroImageUrl),
      methodsEyebrow: nullToEmpty(d.methodsEyebrow),
      methodsTitle: nullToEmpty(d.methodsTitle),
      methodsSubtitle: nullToEmpty(d.methodsSubtitle),
      methods: d.methods ?? [],
      formRecipientEmail: nullToEmpty(d.formRecipientEmail),
      formEyebrow: nullToEmpty(d.formEyebrow),
      formTitle: nullToEmpty(d.formTitle),
      formSubtitle: nullToEmpty(d.formSubtitle),
      formCategories: d.formCategories ?? [],
      infoItems: d.infoItems ?? [],
      faqItems: d.faqItems ?? [],
      faqSeeAllHref: nullToEmpty(d.faqSeeAllHref),
      sidebarCtaTitle: nullToEmpty(d.sidebarCtaTitle),
      sidebarCtaText: nullToEmpty(d.sidebarCtaText),
      sidebarCtaButtonLabel: nullToEmpty(d.sidebarCtaButtonLabel),
      sidebarCtaButtonHref: nullToEmpty(d.sidebarCtaButtonHref),
      whyChooseBadgeText: nullToEmpty(d.whyChooseBadgeText),
      whyChooseTitle: nullToEmpty(d.whyChooseTitle),
      whyChooseDescription: nullToEmpty(d.whyChooseDescription),
      whyChooseItems: d.whyChooseItems ?? [],
      isActive: d.isActive,
    });
  }, [query.data]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSave() {
    mutation.mutate({
      heroBadgeText: emptyToNull(form.heroBadgeText),
      heroTitle: emptyToNull(form.heroTitle),
      heroTitleAccent: emptyToNull(form.heroTitleAccent),
      heroDescription: emptyToNull(form.heroDescription),
      heroTrustPills: form.heroTrustPills,
      heroStats: form.heroStats,
      heroImageUrl: emptyToNull(form.heroImageUrl),
      methodsEyebrow: emptyToNull(form.methodsEyebrow),
      methodsTitle: emptyToNull(form.methodsTitle),
      methodsSubtitle: emptyToNull(form.methodsSubtitle),
      methods: form.methods,
      formRecipientEmail: emptyToNull(form.formRecipientEmail),
      formEyebrow: emptyToNull(form.formEyebrow),
      formTitle: emptyToNull(form.formTitle),
      formSubtitle: emptyToNull(form.formSubtitle),
      formCategories: form.formCategories,
      infoItems: form.infoItems,
      faqItems: form.faqItems,
      faqSeeAllHref: emptyToNull(form.faqSeeAllHref),
      sidebarCtaTitle: emptyToNull(form.sidebarCtaTitle),
      sidebarCtaText: emptyToNull(form.sidebarCtaText),
      sidebarCtaButtonLabel: emptyToNull(form.sidebarCtaButtonLabel),
      sidebarCtaButtonHref: emptyToNull(form.sidebarCtaButtonHref),
      whyChooseBadgeText: emptyToNull(form.whyChooseBadgeText),
      whyChooseTitle: emptyToNull(form.whyChooseTitle),
      whyChooseDescription: emptyToNull(form.whyChooseDescription),
      whyChooseItems: form.whyChooseItems,
      isActive: form.isActive,
    });
  }

  const crumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "CMS Halaman", href: "/dashboard/settings/home" },
    { label: "Hubungi Kami", icon: <Phone /> },
  ];

  if (query.isLoading) {
    return (
      <div className="flex flex-col gap-y-4 pt-2.5">
        <PageNav sticky>
          <PageHeader
            breadcrumbs={crumbs}
            title="CMS Hubungi Kami"
            description="Hero, cara kontak, info + FAQ + form, dan alasan memilih kami."
          />
        </PageNav>
        <div className="mx-4 flex min-h-[420px] items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm lg:mx-6">
          <Loader2 className="size-7 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4 pt-2.5">
      <PageNav sticky>
        <PageHeader
          breadcrumbs={crumbs}
          title="CMS Hubungi Kami"
          description="Hero, cara kontak, info + FAQ + form (termasuk email penerima), dan alasan memilih kami."
        />
      </PageNav>

      <div className="flex flex-col gap-4 px-4 pb-10 lg:px-6">
        <ActiveToggle
          active={form.isActive}
          onToggle={() => set("isActive", !form.isActive)}
          icon={Phone}
          label="CMS Hubungi Kami"
          hint="Saat aktif, halaman Hubungi Kami memakai konten dari sini."
        />

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex flex-col gap-4">
            {/* HERO */}
            <Section
              icon={Sparkles}
              title="Hero"
              description="Judul, deskripsi, pill kepercayaan, dan 3 statistik (mandiri)."
            >
              <Field label="Badge">
                <TextInput
                  value={form.heroBadgeText}
                  onChange={(v) => set("heroBadgeText", v)}
                  placeholder="Hubungi InggrisGo"
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Judul">
                  <TextInput
                    value={form.heroTitle}
                    onChange={(v) => set("heroTitle", v)}
                    placeholder="Hubungi Kami —"
                  />
                </Field>
                <Field label="Aksen Judul">
                  <TextInput
                    value={form.heroTitleAccent}
                    onChange={(v) => set("heroTitleAccent", v)}
                    placeholder="Kami Siap Membantu"
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
              <Field label="Gambar Hero">
                <ImageUploader
                  value={form.heroImageUrl}
                  onChange={(v) => set("heroImageUrl", v)}
                />
              </Field>

              <Field label="Pill Kepercayaan">
                <RepeatableList<IconTag>
                  items={form.heroTrustPills}
                  onChange={(next) => set("heroTrustPills", next)}
                  itemLabel="Pill"
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
                          placeholder="Balas dalam 24 jam"
                        />
                      </Field>
                    </div>
                  )}
                />
              </Field>

              <Field label="Statistik Hero">
                <RepeatableList<ContactHeroStat>
                  items={form.heroStats}
                  onChange={(next) => set("heroStats", next)}
                  itemLabel="Statistik"
                  max={6}
                  makeNew={() => ({ icon: "star", title: "", subtitle: "" })}
                  renderItem={(item, update) => (
                    <>
                      <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
                        <Field label="Ikon">
                          <IconPicker
                            value={item.icon || undefined}
                            onChange={(name) => update({ icon: name ?? "" })}
                          />
                        </Field>
                        <Field label="Judul">
                          <TextInput
                            value={item.title}
                            onChange={(v) => update({ title: v })}
                            placeholder="1.200+ Pelajar"
                          />
                        </Field>
                      </div>
                      <Field label="Sub-teks">
                        <TextInput
                          value={item.subtitle}
                          onChange={(v) => update({ subtitle: v })}
                          placeholder="Sudah dipercaya ribuan orang"
                        />
                      </Field>
                    </>
                  )}
                />
              </Field>
            </Section>

            {/* HOW TO CONTACT */}
            <Section
              icon={Phone}
              title="Cara Menghubungi"
              description="Kartu-kartu pilihan kontak (WhatsApp, email, konsultasi, dll)."
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Eyebrow">
                  <TextInput
                    value={form.methodsEyebrow}
                    onChange={(v) => set("methodsEyebrow", v)}
                    placeholder="Pilih Cara Kontak"
                  />
                </Field>
                <Field label="Judul">
                  <TextInput
                    value={form.methodsTitle}
                    onChange={(v) => set("methodsTitle", v)}
                  />
                </Field>
                <Field label="Sub-judul">
                  <TextInput
                    value={form.methodsSubtitle}
                    onChange={(v) => set("methodsSubtitle", v)}
                  />
                </Field>
              </div>

              <RepeatableList<ContactMethod>
                items={form.methods}
                onChange={(next) => set("methods", next)}
                itemLabel="Kartu Kontak"
                max={6}
                makeNew={() => ({
                  icon: "message-circle",
                  label: "",
                  whenToUse: "",
                  detail: "",
                  actionLabel: "",
                  actionHref: "",
                  external: false,
                  badge: "",
                  colorKey: "blue",
                })}
                renderItem={(item, update) => (
                  <>
                    <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
                      <Field label="Ikon">
                        <IconPicker
                          value={item.icon || undefined}
                          onChange={(name) => update({ icon: name ?? "" })}
                        />
                      </Field>
                      <Field label="Nama">
                        <TextInput
                          value={item.label}
                          onChange={(v) => update({ label: v })}
                          placeholder="WhatsApp"
                        />
                      </Field>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Gunakan ini jika…">
                        <TextInput
                          value={item.whenToUse}
                          onChange={(v) => update({ whenToUse: v })}
                        />
                      </Field>
                      <Field label="Detail">
                        <TextInput
                          value={item.detail}
                          onChange={(v) => update({ detail: v })}
                        />
                      </Field>
                      <Field label="Label Tombol">
                        <TextInput
                          value={item.actionLabel}
                          onChange={(v) => update({ actionLabel: v })}
                        />
                      </Field>
                      <Field label="URL Tombol">
                        <TextInput
                          value={item.actionHref}
                          onChange={(v) => update({ actionHref: v })}
                        />
                      </Field>
                      <Field label="Badge (opsional)">
                        <TextInput
                          value={item.badge}
                          onChange={(v) => update({ badge: v })}
                          placeholder="Tercepat"
                        />
                      </Field>
                      <Field label="Warna">
                        <ColorKeyPicker
                          value={item.colorKey}
                          options={METHOD_COLORS}
                          onChange={(c) => update({ colorKey: c })}
                        />
                      </Field>
                    </div>
                    <label className="flex items-center gap-2 text-[12px] font-semibold text-slate-600">
                      <input
                        type="checkbox"
                        checked={item.external}
                        onChange={(e) =>
                          update({ external: e.target.checked })
                        }
                        className="size-4 rounded border-slate-300"
                      />
                      Buka di tab baru (link eksternal)
                    </label>
                  </>
                )}
              />
            </Section>

            {/* INFO + FAQ + FORM */}
            <Section
              icon={Inbox}
              title="Info Kontak, FAQ & Formulir"
              description="Termasuk email penerima kiriman formulir kontak."
            >
              <Field
                label="Email Penerima Formulir"
                description="Semua kiriman formulir kontak dikirim ke sini. Kosong = pakai bawaan server."
              >
                <TextInput
                  value={form.formRecipientEmail}
                  onChange={(v) => set("formRecipientEmail", v)}
                  type="email"
                  prefix={<Mail className="size-3.5" />}
                  placeholder="support@inggrisgo.com"
                />
              </Field>

              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Form — Eyebrow">
                  <TextInput
                    value={form.formEyebrow}
                    onChange={(v) => set("formEyebrow", v)}
                  />
                </Field>
                <Field label="Form — Judul">
                  <TextInput
                    value={form.formTitle}
                    onChange={(v) => set("formTitle", v)}
                  />
                </Field>
                <Field label="Form — Sub-judul">
                  <TextInput
                    value={form.formSubtitle}
                    onChange={(v) => set("formSubtitle", v)}
                  />
                </Field>
              </div>

              <Field label="Pilihan Topik Formulir">
                <RepeatableList<LabelValue>
                  items={form.formCategories}
                  onChange={(next) => set("formCategories", next)}
                  itemLabel="Topik"
                  max={20}
                  makeNew={() => ({ value: "", label: "" })}
                  renderItem={(item, update) => (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Value" hint="kode singkat, mis. general">
                        <TextInput
                          value={item.value}
                          onChange={(v) => update({ value: v })}
                        />
                      </Field>
                      <Field label="Label">
                        <TextInput
                          value={item.label}
                          onChange={(v) => update({ label: v })}
                        />
                      </Field>
                    </div>
                  )}
                />
              </Field>

              <Field label="Info Kontak (sidebar)">
                <RepeatableList<ContactInfoItem>
                  items={form.infoItems}
                  onChange={(next) => set("infoItems", next)}
                  itemLabel="Info"
                  max={10}
                  makeNew={() => ({
                    icon: "mail",
                    label: "",
                    value: "",
                    href: "",
                    sub: "",
                  })}
                  renderItem={(item, update) => (
                    <>
                      <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
                        <Field label="Ikon">
                          <IconPicker
                            value={item.icon || undefined}
                            onChange={(name) => update({ icon: name ?? "" })}
                          />
                        </Field>
                        <Field label="Label">
                          <TextInput
                            value={item.label}
                            onChange={(v) => update({ label: v })}
                          />
                        </Field>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Nilai">
                          <TextInput
                            value={item.value}
                            onChange={(v) => update({ value: v })}
                          />
                        </Field>
                        <Field label="URL (opsional)">
                          <TextInput
                            value={item.href}
                            onChange={(v) => update({ href: v })}
                          />
                        </Field>
                        <Field label="Sub-teks (opsional)">
                          <TextInput
                            value={item.sub}
                            onChange={(v) => update({ sub: v })}
                          />
                        </Field>
                      </div>
                    </>
                  )}
                />
              </Field>

              <Field label="FAQ">
                <RepeatableList<FaqItem>
                  items={form.faqItems}
                  onChange={(next) => set("faqItems", next)}
                  itemLabel="FAQ"
                  max={30}
                  makeNew={() => ({ q: "", a: "" })}
                  renderItem={(item, update) => (
                    <>
                      <Field label="Pertanyaan">
                        <TextInput
                          value={item.q}
                          onChange={(v) => update({ q: v })}
                        />
                      </Field>
                      <Field label="Jawaban">
                        <TextArea
                          value={item.a}
                          onChange={(v) => update({ a: v })}
                          rows={3}
                        />
                      </Field>
                    </>
                  )}
                />
              </Field>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Link 'Lihat semua FAQ'">
                  <TextInput
                    value={form.faqSeeAllHref}
                    onChange={(v) => set("faqSeeAllHref", v)}
                    placeholder="/faq"
                  />
                </Field>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5">
                <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Kartu Mini CTA (sidebar)
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Judul">
                    <TextInput
                      value={form.sidebarCtaTitle}
                      onChange={(v) => set("sidebarCtaTitle", v)}
                    />
                  </Field>
                  <Field label="Label Tombol">
                    <TextInput
                      value={form.sidebarCtaButtonLabel}
                      onChange={(v) => set("sidebarCtaButtonLabel", v)}
                    />
                  </Field>
                  <Field label="Teks">
                    <TextArea
                      value={form.sidebarCtaText}
                      onChange={(v) => set("sidebarCtaText", v)}
                      rows={2}
                    />
                  </Field>
                  <Field label="URL Tombol">
                    <TextInput
                      value={form.sidebarCtaButtonHref}
                      onChange={(v) => set("sidebarCtaButtonHref", v)}
                    />
                  </Field>
                </div>
              </div>
            </Section>

            {/* WHY CHOOSE US */}
            <Section
              icon={ShieldCheck}
              title="Kenapa Memilih Kami"
              description="Badge, judul, deskripsi, dan kartu alasan."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Badge">
                  <TextInput
                    value={form.whyChooseBadgeText}
                    onChange={(v) => set("whyChooseBadgeText", v)}
                    placeholder="Kenapa kamu bisa percaya kami?"
                  />
                </Field>
                <Field label="Judul">
                  <TextInput
                    value={form.whyChooseTitle}
                    onChange={(v) => set("whyChooseTitle", v)}
                  />
                </Field>
              </div>
              <Field label="Deskripsi">
                <TextArea
                  value={form.whyChooseDescription}
                  onChange={(v) => set("whyChooseDescription", v)}
                  rows={2}
                />
              </Field>

              <RepeatableList<WhyChooseItem>
                items={form.whyChooseItems}
                onChange={(next) => set("whyChooseItems", next)}
                itemLabel="Kartu"
                max={8}
                makeNew={() => ({
                  icon: "shield",
                  title: "",
                  desc: "",
                  colorKey: "blue",
                })}
                renderItem={(item, update) => (
                  <>
                    <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
                      <Field label="Ikon">
                        <IconPicker
                          value={item.icon || undefined}
                          onChange={(name) => update({ icon: name ?? "" })}
                        />
                      </Field>
                      <Field label="Judul">
                        <TextInput
                          value={item.title}
                          onChange={(v) => update({ title: v })}
                        />
                      </Field>
                    </div>
                    <Field label="Deskripsi">
                      <TextArea
                        value={item.desc}
                        onChange={(v) => update({ desc: v })}
                        rows={2}
                      />
                    </Field>
                    <Field label="Warna">
                      <ColorKeyPicker
                        value={item.colorKey}
                        options={WHY_COLORS}
                        onChange={(c) => update({ colorKey: c })}
                      />
                    </Field>
                  </>
                )}
              />
            </Section>
          </div>

          <aside>
            <StickyPanel>
              <SaveCard
                onSave={handleSave}
                isSaving={mutation.isPending}
                note="Perubahan langsung berlaku di halaman Hubungi Kami."
                checklist={[
                  { label: "Judul Hero", ok: !!form.heroTitle },
                  {
                    label: "Email penerima formulir",
                    ok: !!form.formRecipientEmail,
                  },
                  { label: "Kartu cara kontak", ok: form.methods.length > 0 },
                  { label: "FAQ", ok: form.faqItems.length > 0 },
                  {
                    label: "Kartu 'kenapa memilih'",
                    ok: form.whyChooseItems.length > 0,
                  },
                ]}
              />
            </StickyPanel>
          </aside>
        </div>
      </div>
    </div>
  );
}
