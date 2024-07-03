import { FullConfig } from '@playwright/test';

function startupLog(config: FullConfig) {
  console.log('');
  console.log('Starting playwright tests:');
  console.log(`- Playwright version: ${config.version}`);
  console.log(`- CI: ${process.env['CI']}`);
  console.log(`- update snapshots: ${config.updateSnapshots}`);
  console.log(`- webServer.command: ${config.webServer?.command}`);
  console.log(`- webServer.url: ${config.webServer?.url}`);
  console.log(`- webServer.reuseExistingServer: ${config.webServer?.reuseExistingServer}`);
  console.log(`- testDir: ${config.projects[0].testDir}`);
  console.log(`- outputDir: ${config.projects[0].outputDir}`);
  const monocartReporter = config.reporter[2];
  if (monocartReporter) {
    const monocartReporterOptions = monocartReporter[1];
    console.log(`- monocart-reporter outputFile: ${monocartReporterOptions.outputFile}`);
    console.log(`- monocart-reporter coverage.outputDir: ${monocartReporterOptions.coverage.outputDir}`);
    console.log(`- monocart-reporter coverage.reportPath: ${monocartReporterOptions.coverage.reportPath}`);
  }

  console.log('');
}

async function globalSetup(config: FullConfig): Promise<void> {
  startupLog(config);
}

export default globalSetup;
