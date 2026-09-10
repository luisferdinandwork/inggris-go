// components/sidebar/nav-styles.ts
// Shared visual language for the sidebar nav — used by NavMain, NavGroups
// and NavTeamProjects so every item, label and group reads the same way in
// both the expanded and collapsed (icon) states.

/** Group heading — small uppercase micro-label with a leading accent bar. */
export const SECTION_LABEL_CLASS =
  "mb-1 flex items-center gap-1.5 px-2.5 text-[10px] font-bold uppercase text-[var(--text-faint)] select-none";

export const SECTION_LABEL_STYLE = { letterSpacing: "0.1em" } as const;

/** The little bar rendered before a group label. */
export const SECTION_LABEL_ACCENT_CLASS =
  "h-2.5 w-[3px] shrink-0 rounded-full bg-[rgba(26,82,200,0.3)]";

/** Flat nav row (expanded). Collapsed rows use `collapsedNavItemClass`. */
export function navItemClass(isActive?: boolean) {
  return [
    "group/nav relative h-8 gap-2.5 rounded-[10px] px-2.5 text-[0.8125rem] font-medium",
    "transition-colors duration-150",
    isActive
      ? [
          "bg-[rgba(26,82,200,0.1)] text-[var(--blue)] font-semibold",
          "before:absolute before:left-0 before:top-1/2 before:h-4 before:w-[3px]",
          "before:-translate-y-1/2 before:rounded-r-full before:bg-[var(--blue)]",
        ].join(" ")
      : "text-[var(--text-muted)] hover:bg-[rgba(10,45,135,0.05)] hover:text-[var(--blue-navy)]",
  ].join(" ");
}

/** Icon inside a flat nav row. */
export function navIconClass(isActive?: boolean) {
  return [
    "!size-4 shrink-0 transition-colors duration-150",
    isActive
      ? "text-[var(--blue)]"
      : "text-[var(--text-faint)] group-hover/nav:text-[var(--blue-navy)]",
  ].join(" ");
}

/**
 * Square icon button used when the sidebar is collapsed to the icon rail.
 * The primitive forces `size-8! p-2!` in collapsed mode; we override the
 * padding so a slightly larger glyph still breathes, and restyle the chrome.
 */
export function collapsedNavItemClass(isActive?: boolean) {
  return [
    "justify-center rounded-xl p-1.5! transition-colors duration-150",
    isActive
      ? "bg-[rgba(26,82,200,0.12)] text-[var(--blue)]"
      : "text-[var(--text-faint)] hover:bg-[rgba(10,45,135,0.06)] hover:text-[var(--blue-navy)]",
  ].join(" ");
}
