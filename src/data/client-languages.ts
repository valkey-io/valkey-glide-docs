/**
 * Canonical list of GLIDE client languages used in per-language code examples.
 *
 * The array order is the canonical tab order (see AGENTS.md). It is consumed by
 * `ClientTabs.astro` (ordering, label normalization, icons) and `ClientTab.astro`
 * (typed `lang` prop), so this is the single place to add or reorder a language.
 */
import type { StarlightIcon } from "@astrojs/starlight/types";

/** Default sync key shared by all per-language example tabs. */
export const CLIENT_TABS_SYNC_KEY = "progLangInExamples";

export const CLIENT_LANGUAGES = [
  { id: "python", label: "Python", icon: "seti:python", aliases: ["py"] },
  { id: "java", label: "Java", icon: "seti:java", aliases: [] },
  {
    id: "node",
    label: "Node",
    icon: "node",
    aliases: ["nodejs", "node.js"],
  },
  { id: "go", label: "Go", icon: "seti:go", aliases: ["golang"] },
  { id: "php", label: "PHP", icon: "seti:php", aliases: [] },
  {
    id: "csharp",
    label: "C#",
    icon: "seti:c-sharp",
    aliases: ["c#", "dotnet"],
  },
  { id: "ruby", label: "Ruby", icon: "seti:ruby", aliases: ["rb"] },
] as const satisfies readonly {
  id: string;
  label: string;
  icon: StarlightIcon;
  aliases: readonly string[];
}[];

export type ClientLanguage = (typeof CLIENT_LANGUAGES)[number];

/** Canonical language identifier, e.g. `"csharp"`. */
export type ClientLanguageId = ClientLanguage["id"];

/** Any accepted way to refer to a language: its id or one of its aliases. */
export type ClientLanguageKey =
  | ClientLanguageId
  | ClientLanguage["aliases"][number];

const lookup = new Map<string, { language: ClientLanguage; rank: number }>();
CLIENT_LANGUAGES.forEach((language, rank) => {
  for (const key of [language.id, language.label, ...language.aliases]) {
    lookup.set(key.toLowerCase(), { language, rank });
  }
});

/**
 * Resolves an id, alias, or label (case-insensitive) to a client language.
 * Returns `undefined` for anything that is not a known client language.
 */
export function resolveClientLanguage(
  value: string,
): ClientLanguage | undefined {
  return lookup.get(value.trim().toLowerCase())?.language;
}

/**
 * Position of a language in the canonical order. Values that are not known
 * client languages share the last rank, so they sort after all known ones.
 */
export function clientLanguageRank(value: string): number {
  return (
    lookup.get(value.trim().toLowerCase())?.rank ?? CLIENT_LANGUAGES.length
  );
}
