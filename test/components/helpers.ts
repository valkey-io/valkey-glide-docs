import { addAttribute } from "astro/compiler-runtime";
import { load } from "cheerio";

export const serializeJsonAttribute = (name: string, value: unknown) =>
  String(addAttribute(JSON.stringify(value), name)).trim();

export const getTabLabels = (html: string) => {
  const $ = load(html);

  return $('[role="tab"]')
    .map((_, tab) => $(tab).text().trim())
    .get();
};
