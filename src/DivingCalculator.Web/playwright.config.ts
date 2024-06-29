import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const _testsDir = path.resolve('./e2e');
const _testResultsDir = path.resolve('./test-results/playwright');
const _codeCoverageDir = path.resolve(_testResultsDir, 'code-coverage');

export default defineConfig({
  testDir: _testsDir,
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
            const url = entry.url as string;
            return (
              !url.includes('@fs') && !url.includes('fonts.googleapis.com') && !url.includes('www.youtube.com') && url !== 'http://localhost:4200/styles.css'
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
