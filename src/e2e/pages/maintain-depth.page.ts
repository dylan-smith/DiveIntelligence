import { Page } from '@playwright/test';
import { DiveOverviewPage } from './dive-overview.page';

export class MaintainDepthPage {
  constructor(private page: Page) {}

  async getCurrentDepth(): Promise<string> {
    let content = await this.page.locator('dive-current-stats .current-stats .dive-stat').getByText('Current Depth: ').textContent();
    content = content ?? '';
    return content.replace('Current Depth: ', '').trim();
  }

  async getCurrentCeiling(): Promise<string> {
    let content = await this.page.locator('dive-current-stats .current-stats .dive-stat').getByText('Current Ceiling: ').textContent();
    content = content ?? '';
    return content.replace('Current Ceiling: ', '').trim();
  }

  async getCurrentGas(): Promise<string> {
    let content = await this.page.locator('dive-current-stats .current-stats .dive-stat').getByText('Current Gas: ').textContent();
    content = content ?? '';
    return content.replace('Current Gas: ', '').trim();
  }

  async getCurrentMaxDepthPO2(): Promise<string> {
    let content = await this.page.locator('dive-current-stats .current-stats .dive-stat').getByText('Max Depth (PO2): ').textContent();
    content = content ?? '';
    return content.replace('Max Depth (PO2): ', '').trim();
  }

  async getCurrentMaxDepthEND(): Promise<string> {
    let content = await this.page.locator('dive-current-stats .current-stats .dive-stat').getByText('Max Depth (END): ').textContent();
    content = content ?? '';
    return content.replace('Max Depth (END): ', '').trim();
  }

  async getCurrentMinDepthHypoxia(): Promise<string> {
    let content = await this.page.locator('dive-current-stats .current-stats .dive-stat').getByText('Min Depth (Hypoxia): ').textContent();
    content = content ?? '';
    return content.replace('Min Depth (Hypoxia): ', '').trim();
  }

  async getCurrentPO2(): Promise<string> {
    let content = await this.page.locator('dive-current-stats .current-stats .dive-stat').getByText('PO2: ').textContent();
    content = content ?? '';
    return content.replace('PO2: ', '').trim();
  }

  async isCurrentPO2Warning(): Promise<boolean> {
    return this.page
      .locator('dive-current-stats .current-stats div.dive-stat', { has: this.page.getByText(/\s*PO2:/) })
      .locator('mat-icon')
      .getByText('warning')
      .isVisible();
  }

  async getCurrentEND(): Promise<string> {
    let content = await this.page.locator('dive-current-stats .current-stats .dive-stat').getByText('END: ').textContent();
    content = content ?? '';
    return content.replace('END: ', '').trim();
  }

  async setTimeAtDepth(time: number): Promise<MaintainDepthPage> {
    await this.page.getByLabel('Time at Depth (mins)').fill(time.toString());
    return this;
  }

  async getFinalCeiling(): Promise<string> {
    let content = await this.page.locator('dive-new-time-stats .new-time-stats .dive-stat').getByText('Ceiling: ').textContent();
    content = content ?? '';
    return content.replace('Ceiling: ', '').trim();
  }

  async getTotalDiveDuration(): Promise<string> {
    let content = await this.page.locator('dive-new-time-stats .new-time-stats .dive-stat').getByText('Total Dive Duration: ').textContent();
    content = content ?? '';
    return content.replace('Total Dive Duration: ', '').trim();
  }

  async getDecoMilestones(): Promise<string[]> {
    const milestones = await this.page.locator('.deco-milestone').all();
    const milestoneDetails = [];
    for (const milestone of milestones) {
      const content = (await milestone.textContent()) ?? '';
      milestoneDetails.push(content.trim());
    }
    return milestoneDetails;
  }

  async Save(): Promise<DiveOverviewPage> {
    await this.page.getByRole('button', { name: 'Save' }).click();
    return new DiveOverviewPage(this.page);
  }
}
