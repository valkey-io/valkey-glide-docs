import { defineConfig } from "@playwright/test";

const port = 4322;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "test/e2e",
  testMatch: "*.test.ts",
  reporter: "list",
  use: {
    baseURL,
  },
  webServer: {
    command: `node ../../../../node_modules/astro/astro.js dev --host 127.0.0.1 --port ${port}`,
    cwd: "test/e2e/fixtures/param-tabs",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "Chrome Stable",
      use: {
        browserName: "chromium",
        channel: "chrome",
      },
    },
  ],
});
