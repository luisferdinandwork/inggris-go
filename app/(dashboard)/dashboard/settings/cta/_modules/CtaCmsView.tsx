// app/(dashboard)/dashboard/settings/cta/_modules/CtaCmsView.tsx
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Megaphone, MousePointerClick, Sparkles } from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { PageHeader, PageNav } from "@/components/PageHeader";
import {
  ActiveToggle,
  Field,
  RepeatableList,
  SaveCard,
  Section,
  StickyPanel,
  TextArea,
  TextInput,
  emptyToNull,
  nullToEmpty,
} from "@/components/cms/CmsForm";

type FormState = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  secondaryIsWhatsapp: boolean;
  trustPoints: string[];
  isActive: boolean;
};

const EMPTY: FormState = {
  eyebrow: "",
  title: "",
  titleAccent: "",
  description: "",
  primaryLabel: "",
  primaryHref: "",
  secondaryLabel: "",
  secondaryHref: "",
  secondaryIsWhatsapp: true,
  trustPoints: [],
  isActive: true,
};

export function CtaCmsView() {
  const utils = trpc.useUtils();
  const query = trpc.siteContent.getCta.useQuery();
  const mutation = trpc.siteContent.updateCta.useMutation({
    onSuccess: () => {
      toast.success("CTA berhasil diperbarui!");
      void utils.siteContent.getCta.invalidate();
    },
    onError: (err) => toast.error(err.message || "Gagal menyimpan"),
  });

  const [form, setForm] = useState<FormState>(EMPTY);

  useEffect(() => {
    if (!query.data) return;
    const d = query.data;
    setForm({
      eyebrow: nullToEmpty(d.eyebrow),
      title: nullToEmpty(d.title),
      titleAccent: nullToEmpty(d.titleAccent),
      description: nullToEmpty(d.description),
      primaryLabel: nullToEmpty(d.primaryLabel),
      primaryHref: nullToEmpty(d.primaryHref),
      secondaryLabel: nullToEmpty(d.secondaryLabel),
      secondaryHref: nullToEmpty(d.secondaryHref),
      secondaryIsWhatsapp: d.secondaryIsWhatsapp ?? true,
      trustPoints: d.trustPoints ?? [],
      isActive: d.isActive,
    });
  }, [query.data]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSave() {
    mutation.mutate({
      eyebrow: emptyToNull(form.eyebrow),
      title: emptyToNull(form.title),
      titleAccent: emptyToNull(form.titleAccent),
      description: emptyToNull(form.description),
      primaryLabel: emptyToNull(form.primaryLabel),
      primaryHref: emptyToNull(form.primaryHref),
      secondaryLabel: emptyToNull(form.secondaryLabel),
      secondaryHref: emptyToNull(form.secondaryHref),
      secondaryIsWhatsapp: form.secondaryIsWhatsapp,
      trustPoints: form.trustPoints.map((t) => t.trim()).filter(Boolean),
      isActive: form.isActive,
    });
  }

  const crumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "CMS Halaman", href: "/dashboard/settings/home" },
    { label: "CTA Bersama", icon: <Megaphone /> },
  ];

  if (query.isLoading) {
    return (
      <div className="flex flex-col gap-y-4 pt-2.5">
        <PageNav sticky>
          <PageHeader
            breadcrumbs={crumbs}
            title="CTA Bersama"
            description="Satu ajakan bertindak yang tampil di akhir semua halaman."
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
          title="CTA Bersama"
          description="Satu ajakan bertindak yang tampil di akhir Beranda, Tentang Kami, dan Hubungi Kami."
        />
      </PageNav>

      <div className="flex flex-col gap-4 px-4 pb-10 lg:px-6">
        <ActiveToggle
          active={form.isActive}
          onToggle={() => set("isActive", !form.isActive)}
          icon={Megaphone}
          label="CTA Bersama"
          hint="Saat aktif, blok CTA di bawah dipakai. Nonaktif = teks bawaan."
        />

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col gap-4">
            <Section
              icon={Sparkles}
              title="Teks"
              description="Eyebrow, judul, aksen judul (baris kedua, warna emas), dan deskripsi."
            >
              <Field label="Eyebrow / Badge">
                <TextInput
                  value={form.eyebrow}
                  onChange={(v) => set("eyebrow", v)}
                  placeholder="🚀 Mulai Perjalanan Bahasa Inggrismu Sekarang!"
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Judul">
                  <TextInput
                    value={form.title}
                    onChange={(v) => set("title", v)}
                    placeholder="Siap Berani Bicara"
                  />
                </Field>
                <Field label="Aksen Judul" description="Baris kedua, warna emas.">
                  <TextInput
                    value={form.titleAccent}
                    onChange={(v) => set("titleAccent", v)}
                    placeholder="Bahasa Inggris?"
                  />
                </Field>
              </div>
              <Field label="Deskripsi">
                <TextArea
                  value={form.description}
                  onChange={(v) => set("description", v)}
                  rows={3}
                  placeholder="Jangan biarkan rasa takut menghalangi impianmu…"
                />
              </Field>
            </Section>

            <Section
              icon={MousePointerClick}
              title="Tombol"
              description="Tombol utama (isi) dan tombol kedua (garis luar / WhatsApp)."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Label Tombol Utama">
                  <TextInput
                    value={form.primaryLabel}
                    onChange={(v) => set("primaryLabel", v)}
                    placeholder="Lihat Program"
                  />
                </Field>
                <Field label="URL Tombol Utama">
                  <TextInput
                    value={form.primaryHref}
                    onChange={(v) => set("primaryHref", v)}
                    placeholder="/programs"
                  />
                </Field>
              </div>

              <Field label="Label Tombol Kedua">
                <TextInput
                  value={form.secondaryLabel}
                  onChange={(v) => set("secondaryLabel", v)}
                  placeholder="Hubungi Admin"
                />
              </Field>

              <label className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={form.secondaryIsWhatsapp}
                  onChange={(e) => set("secondaryIsWhatsapp", e.target.checked)}
                  className="size-4 rounded border-slate-300"
                />
                <span className="text-[12.5px] font-semibold text-slate-700">
                  Tombol kedua membuka WhatsApp otomatis
                </span>
              </label>

              {!form.secondaryIsWhatsapp && (
                <Field label="URL Tombol Kedua">
                  <TextInput
                    value={form.secondaryHref}
                    onChange={(v) => set("secondaryHref", v)}
                    placeholder="/contact"
                  />
                </Field>
              )}
            </Section>

            <Section
              icon={Sparkles}
              title="Poin Kepercayaan"
              description="Baris kecil di bawah tombol (mis. 'Tanpa syarat khusus')."
            >
              <RepeatableList<string>
                items={form.trustPoints}
                onChange={(next) => set("trustPoints", next)}
                makeNew={() => ""}
                itemLabel="Poin"
                max={6}
                renderItem={(item, _u, index) => (
                  <TextInput
                    value={item}
                    onChange={(v) =>
                      set(
                        "trustPoints",
                        form.trustPoints.map((t, i) => (i === index ? v : t)),
                      )
                    }
                    placeholder="Tanpa syarat khusus"
                  />
                )}
              />
            </Section>
          </div>

          <aside>
            <StickyPanel>
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Preview
                </p>
                <div
                  className="rounded-2xl px-5 py-6 text-center text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--blue,#1a52c8) 0%, var(--blue-navy,#0f2340) 100%)",
                  }}
                >
                  {form.eyebrow && (
                    <p className="mb-2 inline-block rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold">
                      {form.eyebrow}
                    </p>
                  )}
                  <p className="text-[16px] font-black leading-tight">
                    {form.title || "Judul CTA"}
                    {form.titleAccent && (
                      <>
                        <br />
                        <span style={{ color: "#fbbf24" }}>
                          {form.titleAccent}
                        </span>
                      </>
                    )}
                  </p>
                  {form.description && (
                    <p className="mx-auto mt-2 max-w-[240px] text-[11px] text-white/70">
                      {form.description}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-slate-900">
                      {form.primaryLabel || "Tombol Utama"}
                    </span>
                    <span className="rounded-full border border-white/50 px-3 py-1.5 text-[11px] font-bold">
                      {form.secondaryLabel || "Tombol Kedua"}
                    </span>
                  </div>
                </div>
              </div>

              <SaveCard
                onSave={handleSave}
                isSaving={mutation.isPending}
                note="Berlaku di akhir Beranda, Tentang Kami & Hubungi Kami."
                checklist={[
                  { label: "Judul", ok: !!form.title },
                  { label: "Deskripsi", ok: !!form.description },
                  { label: "Tombol utama", ok: !!form.primaryLabel },
                  { label: "Poin kepercayaan", ok: form.trustPoints.length > 0 },
                ]}
              />
            </StickyPanel>
          </aside>
        </div>
      </div>
    </div>
  );
}
