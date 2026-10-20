import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { expect, test } from "vitest";
import ClientTabs, { LABELS } from "../../src/components/ClientTabs.astro";
import { getTabLabels, serializeJsonAttribute } from "./helpers";

test("ClientTabs basic rendering", async () => {
  const container = await AstroContainer.create();

  /*
  The below is similar to this mdx form:
    <ClientTabs>
      <ClientTab slot="ruby">Ruby content</ClientTab>
      <ClientTab slot="csharp">C# content</ClientTab>
      ...
    </ClientTabs>
  */
  const html = await container.renderToString(ClientTabs, {
    slots: {
      ruby: "Ruby content",
      csharp: "C# content",
      python: "Python content",
      php: "PHP content",
      node: "Node content",
      go: "Go content",
      java: "Java content",
    },
  });

  const dataAliases = serializeJsonAttribute("data-aliases", LABELS);

  expect(html).toContain('class="param-tabs"');
  expect(html).toContain('data-param="lang"');
  expect(html).toContain(dataAliases);
  expect(getTabLabels(html)).toEqual(Object.values(LABELS));
  for (const label of Object.values(LABELS)) {
    expect(html).toContain(`${label} content`);
  }
});

test("ClientTabs error on default slot", async () => {
  const container = await AstroContainer.create();

  /*
  The below is similar to this mdx form:
    <ClientTabs>
      <ClientTab>Default content</ClientTab>
    </ClientTabs>
  */
  await expect(
    container.renderToString(ClientTabs, {
      slots: {
        default: "Default content",
      },
    }),
  ).rejects.toThrow(
    "<ClientTabs> content must use named client language slots.",
  );
});

test("ClientTabs error on unknown slots", async () => {
  const container = await AstroContainer.create();

  await expect(
    container.renderToString(ClientTabs, {
      slots: {
        unknown: "Unknown slot name content",
      },
    }),
  ).rejects.toThrow("Unsupported <ClientTabs> slot: unknown.");
});

test("ClientTabs error on empty contents", async () => {
  const container = await AstroContainer.create();

  await expect(container.renderToString(ClientTabs)).rejects.toThrow(
    "<ClientTabs> requires at least one client language slot.",
  );
});
