import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  outputDir: './test-results/playwright',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  globalSetup: require.resolve('./playwright.global-setup.ts'),
  reporter: [
    ['list'],
    ['junit', { outputFile: 'test-results/playwright/playwright.xml' }],
    [
      'monocart-reporter',
      {
        name: 'Playwright code coverage',
        outputFile: 'test-results/playwright/mono-cart-report.html',
        coverage: {
          outputDir: 'test-results/playwright/coverage',
          reportPath: 'test-results/playwright/coverage/v8/index.html',
          reports: [
            ['v8', { outputFile: 'v8/index.html', inline: true, metrics: ['lines'] }],
            ['console-summary', { metrics: ['lines'] }],
            ['html-spa', { subdir: 'html-spa' }],
            ['cobertura', { file: 'cobertura/code-coverage.cobertura.xml' }],
            ['lcovonly', { file: 'lcov/code-coverage.lcov.info' }],
          ],
          sourceFilter: (sourcePath: string) => {
            return sourcePath.search(/src\//u) !== -1;
          },
        },
      },
    ],
  ],
  use: {
    baseURL: process.env['PLAYWRIGHT_BASE_URL'] ?? 'http://localhost:4200',
    trace: 'retain-on-failure',
    // headless: false,
    // launchOptions: {
    //   args: ['--remote-debugging-port=9222'],
    // },
  },
  timeout: 360000,

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
  },
});
