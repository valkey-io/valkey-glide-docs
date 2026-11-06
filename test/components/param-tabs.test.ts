import { TabItem } from "@astrojs/starlight/components";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { expect, test } from "vitest";
import ParamTabs from "../../src/components/ParamTabs.astro";
import { getTabLabels, serializeJsonAttribute } from "./helpers";

const TAB_ALIASES = {
  node: "Node",
  csharp: "C#",
};

test("ParamTabs basic rendering", async () => {
  const container = await AstroContainer.create();
  const nodeTab = await container.renderToString(TabItem, {
    props: { label: "Node" },
    slots: { default: "Node content" },
  });
  const csharpTab = await container.renderToString(TabItem, {
    props: { label: "C#" },
    slots: { default: "C# content" },
  });

  /*
  The below is similar to this mdx form:
    <ParamTabs
      param="lang"
      syncKey="progLangInExamples"
      aliases={{ node: "Node", csharp: "C#" }}
    >
      <TabItem label="Node">Node content</TabItem>
      <TabItem label="C#">C# content</TabItem>
    </ParamTabs>
  */
  const html = await container.renderToString(ParamTabs, {
    props: {
      param: "lang",
      syncKey: "progLangInExamples",
      aliases: TAB_ALIASES,
    },
    slots: {
      default: nodeTab + csharpTab,
    },
  });

  const dataAliases = serializeJsonAttribute("data-aliases", TAB_ALIASES);

  expect(html).toContain('class="param-tabs"');
  expect(html).toContain('data-param="lang"');
  expect(html).toContain(dataAliases);
  expect(html).toContain('data-sync-key="progLangInExamples"');
  expect(getTabLabels(html)).toEqual(["Node", "C#"]);
  expect(html).toContain("Node content");
  expect(html).toContain("C# content");
});
