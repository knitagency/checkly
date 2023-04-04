// @ts-check
import { devices } from "@playwright/test";
// @ts-ignore
//import dotenv from "dotenv";
import path from "path";

// Pass in variable on command line to switch .env file when testing specific sites.
// Use .env.<site> to configure variables unique to each site for local testing
// This file is ignored when using a test runner like checkly
//dotenv.config({ path: path.resolve(__dirname, ".", ".env") });

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
    headless: true,
    actionTimeout: 0,
    trace: "on-first-retry",
    screenshot: "on",
    video: "on",
    navigationTimeout: 80000
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
