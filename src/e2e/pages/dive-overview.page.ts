import { Page } from '@playwright/test';
import { ChangeDepthPage } from './change-depth.page';
import { ChangeGasPage } from './change-gas.page';
import { MaintainDepthPage } from './maintain-depth.page';

export class DiveOverviewPage {
  constructor(private page: Page) {}

  async addChangeDepthSegment(): Promise<ChangeDepthPage> {
    await this.page.locator('button').filter({ hasText: 'height' }).click();
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
    const segments = await this.page.getByRole('listbox').locator('mat-list-item').all();
    const segmentDetails = [];
    for (const segment of segments) {
      const heading = (await segment.locator('span.mat-mdc-list-item-title').textContent()) ?? '';
      const details = (await segment.locator('span.mat-mdc-list-item-line').textContent()) ?? '';
      segmentDetails.push({ heading: heading.trim(), details: details.trim() });
    }
    return segmentDetails;
  }

  async getDiveDuration(): Promise<string> {
    let content = await this.page.locator('dive-dive-summary .dive-stats .dive-stat').getByText('Dive Duration: ').textContent();
    content = content ?? '';
    return content.replace('Dive Duration: ', '').trim();
  }

  async getMaxDepth(): Promise<string> {
    let content = await this.page.locator('dive-dive-summary .dive-stats .dive-stat').getByText('Max Depth: ').textContent();
    content = content ?? '';
    return content.replace('Max Depth: ', '').trim();
  }

  async getAverageDepth(): Promise<string> {
    let content = await this.page.locator('dive-dive-summary .dive-stats .dive-stat').getByText('Average Depth: ').textContent();
    content = content ?? '';
    return content.replace('Average Depth: ', '').trim();
  }

  async getDiveErrors(): Promise<string[]> {
    const errors = await this.page.locator('dive-error-list .plan-error .error-message').all();
    const errorMessages = [];
    for (const error of errors) {
      const message = (await error.textContent()) ?? '';
      errorMessages.push(message.trim());
    }
    return errorMessages;
  }
}
