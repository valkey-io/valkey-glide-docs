import { expect, test } from "@playwright/test";

test("ParamTabs selects aliased tab from URL", async ({ page }) => {
  await page.goto("/?lang=csharp");

  await expect(page.getByRole("tab", { name: "C#" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByRole("tab", { name: "Python" })).toHaveAttribute(
    "aria-selected",
    "false",
  );
  await expect(page.getByRole("tabpanel", { name: "C#" })).toBeVisible();
});
