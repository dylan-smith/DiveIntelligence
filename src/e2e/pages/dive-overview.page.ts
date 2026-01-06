import { Page } from '@playwright/test';
import { ChangeDepthPage } from './change-depth.page';
import { ChangeGasPage } from './change-gas.page';
import { MaintainDepthPage } from './maintain-depth.page';

export class DiveOverviewPage {
  constructor(private page: Page) {}

  async addChangeDepthSegment(): Promise<ChangeDepthPage> {
    await this.page.locator('button').filter({ hasText: 'add' }).click();
    return new ChangeDepthPage(this.page);
  }

  async addChangeGasSegment(): Promise<ChangeGasPage> {
    await this.page.locator('button').filter({ hasText: 'air' }).click();
    return new ChangeGasPage(this.page);
  }

  async addMaintainDepthSegment(): Promise<MaintainDepthPage> {
    await this.page.locator('button').filter({ hasText: 'arrow_forward' }).click();
    return new MaintainDepthPage(this.page);
  }

  async getDiveSegments(): Promise<{ heading: string; details: string }[]> {
    const segments = await this.page.locator('ul li').all();
    const segmentDetails = [];
    for (const segment of segments) {
      const heading = (await segment.locator('.MuiListItemText-primary').textContent()) ?? '';
      const details = (await segment.locator('.MuiListItemText-secondary').textContent()) ?? '';
      segmentDetails.push({ heading: heading.trim(), details: details.trim() });
    }
    return segmentDetails;
  }

  async getDiveDuration(): Promise<string> {
    const content = await this.page.getByText(/^Dive Duration:/).textContent();
    return (content ?? '').replace('Dive Duration:', '').trim();
  }

  async getMaxDepth(): Promise<string> {
    const content = await this.page.getByText(/^Max Depth:/).textContent();
    return (content ?? '').replace('Max Depth:', '').trim();
  }

  async getAverageDepth(): Promise<string> {
    const content = await this.page.getByText(/^Average Depth:/).textContent();
    return (content ?? '').replace('Average Depth:', '').trim();
  }

  async getDiveErrors(): Promise<string[]> {
    const errors = await this.page.locator('.MuiPaper-root').filter({ has: this.page.locator('[data-testid="ErrorIcon"]') }).locator('strong').all();
    const errorMessages = [];
    for (const error of errors) {
      const message = (await error.textContent()) ?? '';
      errorMessages.push(message.trim());
    }
    return errorMessages;
  }
}
