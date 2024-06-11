import { Page } from '@playwright/test';
import { AddDiveSegmentPage } from './add-dive-segment.page';

export class DiveOverviewPage {
  constructor(private page: Page) {}

  async addSegment(): Promise<AddDiveSegmentPage> {
    await this.page.locator('button').filter({ hasText: 'add' }).click();
    return new AddDiveSegmentPage(this.page);
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
}
