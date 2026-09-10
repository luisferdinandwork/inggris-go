// components/cms/CmsForm.tsx
//
// Shared building blocks for the landing-page CMS dashboard views
// (Home / About / Contact / CTA). Mirrors the visual language of
// app/(dashboard)/dashboard/settings/{footer,header}/_modules/*View.tsx
// and adds RepeatableList + ColorKeyPicker for the jsonb array fields.

"use client";

import { useCallback, useRef, useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ImageIcon,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useCloudinaryUpload } from "@/lib/hooks/useCloudinaryUpload";

/* ─────────────────────────────────────────────────────────────
   FIELD + INPUTS
───────────────────────────────────────────────────────────── */

export function Field({
  label,
  description,
  hint,
  children,
}: {
  label?: string;
  description?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      {(label || description) && (
        <div>
          {label && (
            <p className="text-[12.5px] font-black text-slate-800">{label}</p>
          )}
          {description && (
            <p className="mt-0.5 text-[11.5px] leading-relaxed text-slate-500">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  prefix,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  prefix?: React.ReactNode;
}) {
  if (prefix) {
    return (
      <div className="flex h-10 overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100">
        <span className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-[12px] font-semibold text-slate-400 select-none">
          {prefix}
        </span>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="h-full flex-1 bg-transparent px-3 text-[13px] font-medium text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>
    );
  }

  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-medium text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
    />
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
  maxLength,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}) {
  return (
    <div className="relative">
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[13px] font-medium text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100",
          maxLength && "pb-6",
        )}
      />
      {maxLength && (
        <span className="pointer-events-none absolute bottom-2 right-3 text-[10.5px] font-semibold text-slate-400">
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION CARD
───────────────────────────────────────────────────────────── */

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function Section({
  icon: Icon,
  title,
  description,
  badge,
  children,
  collapsible = false,
  defaultOpen = true,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const anchorId = `cms-${slugify(title)}`;

  return (
    <section
      id={anchorId}
      className="scroll-mt-44 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Highlighted section header — big, tinted, scannable */}
      <div
        className={cn(
          "relative flex items-center gap-3.5 border-b-2 border-indigo-100 bg-gradient-to-r from-indigo-50 to-indigo-50/30 px-5 py-4",
          collapsible && "cursor-pointer select-none",
        )}
        onClick={collapsible ? () => setOpen((o) => !o) : undefined}
      >
        {/* Left accent bar */}
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-1.5 bg-indigo-500"
        />

        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/25">
          <Icon className="size-[22px]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[17px] font-black leading-tight tracking-tight text-slate-900">
              {title}
            </h2>
            {badge && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-amber-700">
                {badge}
              </span>
            )}
          </div>
          <p className="mt-1 text-[12px] leading-relaxed text-slate-500">
            {description}
          </p>
        </div>

        {collapsible && (
          <ChevronRight
            className={cn(
              "size-5 shrink-0 text-indigo-400 transition-transform",
              open && "rotate-90",
            )}
          />
        )}
      </div>

      {(!collapsible || open) && (
        <div className="grid gap-4 p-5">{children}</div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   TOGGLE (active flag)
───────────────────────────────────────────────────────────── */

export function ActiveToggle({
  active,
  onToggle,
  icon: Icon,
  label,
  hint,
}: {
  active: boolean;
  onToggle: () => void;
  icon: React.ElementType;
  label: string;
  hint: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-2xl transition-colors",
            active
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-100 text-slate-500",
          )}
        >
          <Icon className="size-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[13.5px] font-black text-slate-900">{label}</p>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10.5px] font-black",
                active
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-500",
              )}
            >
              {active ? "Aktif" : "Nonaktif"}
            </span>
          </div>
          <p className="text-[11.5px] text-slate-500">{hint}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-[12.5px] font-black transition-colors",
          active
            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200",
        )}
      >
        {active ? "Nonaktifkan" : "Aktifkan"}
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   IMAGE UPLOADER (URL + Cloudinary)
───────────────────────────────────────────────────────────── */

export function ImageUploader({
  value,
  onChange,
  previewShape = "rect",
}: {
  value: string;
  onChange: (url: string) => void;
  previewShape?: "rect" | "square" | "circle";
}) {
  const { upload, isUploading, progress, error, reset } = useCloudinaryUpload();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      const url = await upload(file);
      if (url) onChange(url);
    },
    [upload, onChange],
  );

  const shapeClass =
    previewShape === "circle"
      ? "aspect-square w-16 rounded-full"
      : previewShape === "square"
        ? "aspect-square w-20 rounded-xl"
        : "aspect-video w-full rounded-xl";

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… atau /path atau unggah"
          className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-[12.5px] font-medium text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-[12px] font-black text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Upload className="size-3.5" />
          )}
          Upload
        </button>
      </div>

      {!value && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-6 text-center transition-colors",
            dragOver
              ? "border-indigo-400 bg-indigo-50"
              : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/50",
          )}
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-white shadow-sm">
            <ImageIcon className="size-4 text-slate-400" />
          </div>
          <p className="text-[12px] font-black text-slate-600">
            {dragOver ? "Lepas untuk upload" : "Drag & drop atau klik"}
          </p>
          <p className="text-[11px] text-slate-400">PNG, JPG, WEBP · maks 10 MB</p>
        </div>
      )}

      {isUploading && (
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${progress ?? 0}%` }}
          />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2">
          <AlertCircle className="size-3.5 shrink-0 text-red-500" />
          <p className="text-[11.5px] font-semibold text-red-600">{error}</p>
          <button type="button" onClick={reset} className="ml-auto">
            <X className="size-3.5 text-red-400" />
          </button>
        </div>
      )}

      {value && !isUploading && (
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "overflow-hidden border border-slate-200 bg-slate-50",
              shapeClass,
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="mt-1 inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-black text-red-600 hover:bg-red-100"
          >
            <X className="size-3" /> Hapus
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   COLOR KEY PICKER
───────────────────────────────────────────────────────────── */

const COLOR_SWATCH: Record<string, string> = {
  orange: "#f97316",
  teal: "#0d9488",
  amber: "#f59e0b",
  purple: "#7c3aed",
  blue: "#1a52c8",
  navy: "#0f2340",
  gold: "#f5a800",
  sky: "#0ea5e9",
  green: "#16a34a",
  violet: "#7c3aed",
};

export function ColorKeyPicker<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          title={opt}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border-2 px-2.5 py-1.5 text-[11px] font-bold capitalize transition-all",
            value === opt
              ? "border-slate-800 bg-slate-800 text-white"
              : "border-slate-200 bg-white text-slate-500 hover:border-slate-300",
          )}
        >
          <span
            className="size-3 rounded-full ring-1 ring-black/10"
            style={{ background: COLOR_SWATCH[opt] ?? "#999" }}
          />
          {opt}
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   REPEATABLE LIST
───────────────────────────────────────────────────────────── */

export function RepeatableList<T>({
  items,
  onChange,
  makeNew,
  renderItem,
  itemLabel = "Item",
  max,
  addLabel,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  makeNew: () => T;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  itemLabel?: string;
  max?: number;
  addLabel?: string;
}) {
  const list = items ?? [];

  function move(from: number, to: number) {
    if (to < 0 || to >= list.length) return;
    const next = [...list];
    const [row] = next.splice(from, 1);
    next.splice(to, 0, row);
    onChange(next);
  }

  function remove(index: number) {
    onChange(list.filter((_, i) => i !== index));
  }

  function update(index: number, patch: Partial<T>) {
    onChange(list.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  const atMax = max !== undefined && list.length >= max;

  return (
    <div className="space-y-3">
      {list.map((item, index) => (
        <div
          key={index}
          className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="rounded-md bg-white px-2 py-0.5 text-[10.5px] font-black uppercase tracking-wider text-slate-400 ring-1 ring-slate-200">
              {itemLabel} {index + 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(index, index - 1)}
                disabled={index === 0}
                className="flex size-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-100 disabled:opacity-30"
              >
                <ChevronUp className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => move(index, index + 1)}
                disabled={index === list.length - 1}
                className="flex size-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-100 disabled:opacity-30"
              >
                <ChevronDown className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                className="flex size-7 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-500 transition-colors hover:bg-red-100"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
          <div className="grid gap-3">
            {renderItem(item, (patch) => update(index, patch), index)}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...list, makeNew()])}
        disabled={atMax}
        className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-white px-3.5 py-2 text-[12px] font-black text-slate-600 transition-colors hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus className="size-3.5" />
        {addLabel ?? `Tambah ${itemLabel}`}
        {max !== undefined && (
          <span className="text-[10.5px] font-bold text-slate-400">
            {list.length}/{max}
          </span>
        )}
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STICKY SIDE PANEL
───────────────────────────────────────────────────────────── */

/**
 * Wrapper for the right-hand save/preview column. The `top` offset clears
 * the app header (~49px) plus the sticky PageNav header (~69px once
 * scrolled/compact, sitting at top:40px) so the panel never slides under
 * it while scrolling. The PageNav header sits at top:40px and is ~69px tall
 * once compact / ~122px at full height (bottom ≈ 162px); `top-44` (176px)
 * keeps a gap in every state.
 */
export function StickyPanel({ children }: { children: React.ReactNode }) {
  return <div className="sticky top-44 space-y-4">{children}</div>;
}

/* ─────────────────────────────────────────────────────────────
   SAVE CARD + CHECKLIST
───────────────────────────────────────────────────────────── */

export function SaveCard({
  onSave,
  isSaving,
  checklist,
  note = "Perubahan langsung berlaku di halaman publik.",
}: {
  onSave: () => void;
  isSaving: boolean;
  checklist: { label: string; ok: boolean }[];
  note?: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <button
        type="button"
        disabled={isSaving}
        onClick={onSave}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 text-[13.5px] font-black text-white transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Menyimpan…
          </>
        ) : (
          "Simpan Perubahan"
        )}
      </button>

      <p className="mt-3 text-center text-[11px] text-slate-400">{note}</p>

      {checklist.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-[10.5px] font-black uppercase tracking-widest text-slate-400">
            Kelengkapan
          </p>
          {checklist.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-4 items-center justify-center rounded-full text-[10px] font-black",
                  item.ok
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-slate-100 text-slate-300",
                )}
              >
                {item.ok ? "✓" : "•"}
              </span>
              <p
                className={cn(
                  "text-[12px] font-semibold",
                  item.ok ? "text-slate-700" : "text-slate-400",
                )}
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */

export function nullToEmpty(v: string | null | undefined): string {
  return v ?? "";
}

export function emptyToNull(v: string): string | null {
  return v.trim() || null;
}
