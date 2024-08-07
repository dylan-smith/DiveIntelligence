import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const _testResultsDir = path.resolve('./test-results/playwright');
const _codeCoverageDir = path.resolve(_testResultsDir, 'code-coverage');

export default defineConfig({
  testDir: './e2e',
  outputDir: _testResultsDir,
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  globalSetup: require.resolve('./playwright.global-setup.ts'),
  reporter: [
    ['list'],
    ['junit', { outputFile: path.resolve(_testResultsDir, 'playwright.xml') }],
    [
      'monocart-reporter',
      {
        name: 'Playwright code coverage',
        outputFile: path.resolve(_testResultsDir, 'monocart-report.html'),
        coverage: {
          outputDir: _codeCoverageDir,
          reportPath: path.resolve(_codeCoverageDir, 'v8/index.html'),
          reports: [
            ['v8', { outputFile: 'v8/index.html', inline: true, metrics: ['lines'] }],
            ['console-summary', { metrics: ['lines'] }],
            ['html-spa', { subdir: 'html-spa' }],
            ['cobertura', { file: 'cobertura/code-coverage.cobertura.xml' }],
            ['lcovonly', { file: 'lcov/code-coverage.lcov.info' }],
          ],
          entryFilter: (entry: any) => {
            if (!URL.canParse(entry.url as string)) {
              return false;
            }

            const url = new URL(entry.url as string);
            return (
              !url.toString().includes('@fs') &&
              url.host !== 'fonts.googleapis.com' &&
              url.host !== 'www.youtube.com' &&
              url.toString() !== 'http://localhost:4200/styles.css'
            );
          },
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
