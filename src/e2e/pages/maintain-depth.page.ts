import { Page } from '@playwright/test';
import { DiveOverviewPage } from './dive-overview.page';
import { CurrentStatsComponent } from 'e2e/components/current-stats.component';

export class MaintainDepthPage {
  constructor(private page: Page) {}

  public currentStats = new CurrentStatsComponent(this.page);

  async setTimeAtDepth(time: number): Promise<MaintainDepthPage> {
    await this.page.getByLabel('Time at Depth (mins)').fill(time.toString());
    return this;
  }

  async getTotalDiveDuration(): Promise<string> {
    let content = await this.page.getByText('Total Dive Duration: ').textContent();
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

  async getNewNDL(): Promise<string> {
    let content = await this.page.getByText('No Deco Limit: ').last().textContent();
    content = content ?? '';
    return content.replace('No Deco Limit: ', '').trim();
  }

  async getNewCeiling(): Promise<string> {
    let content = await this.page.getByText('Ceiling: ').last().textContent();
    content = content ?? '';
    return content.replace('Ceiling: ', '').trim();
  }

  async Save(): Promise<DiveOverviewPage> {
    await this.page.getByRole('button', { name: 'Save' }).click();
    return new DiveOverviewPage(this.page);
  }
}
