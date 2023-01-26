// @ts-check
import { devices } from "@playwright/test";

/**
 * @see https://playwright.dev/docs/test-configuration
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */
const config = {
  testDir: "./__checks__",
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["json", { outputFile: "results/results.json" }],
    ["line"],
    ["list", { printSteps: true }],
    ["html", { open: "never", outputFolder: "reports" }],
  ],
  use: {
    actionTimeout: 0,
    trace: "on-first-retry",
    screenshot: "on",
    video: "on",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
      },
    },
    {
      name: "Mobile Chrome",
      use: {
        ...devices["Pixel 5"],
      },
    },
    {
      name: "Mobile Safari",
      use: {
        ...devices["iPhone 12"],
      },
    },
    {
      name: "Microsoft Edge",
      use: {
        channel: "msedge",
      },
    },
    {
      name: "Google Chrome",
      use: {
        channel: "chrome",
      },
    },
  ],
  // Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: "results",
};

export default config;
