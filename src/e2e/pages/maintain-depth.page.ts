import { Page } from '@playwright/test';
import { DiveOverviewPage } from './dive-overview.page';
import { CurrentStatsComponent } from 'e2e/components/current-stats.component';

export class MaintainDepthPage {
  public currentStats: CurrentStatsComponent;

  constructor(private page: Page) {
    this.currentStats = new CurrentStatsComponent(page, page.locator('main').first());
  }

  async setTimeAtDepth(time: number): Promise<MaintainDepthPage> {
    await this.page.getByLabel('Time at Depth (minutes)').fill(time.toString());
    return this;
  }

  async getTotalDiveDuration(): Promise<string> {
    const content = await this.page.getByText(/^Total Dive Duration:/).textContent();
    return (content ?? '').replace('Total Dive Duration:', '').trim();
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
    const content = await this.page.getByText(/^NDL:/).textContent();
    return (content ?? '').replace('NDL:', '').trim();
  }

  async getNewCeiling(): Promise<string> {
    const content = await this.page.getByText(/^Ceiling:/).textContent();
    return (content ?? '').replace('Ceiling:', '').trim();
  }

  async Save(): Promise<DiveOverviewPage> {
    await this.page.getByRole('button', { name: 'Save' }).click();
    return new DiveOverviewPage(this.page);
  }
}
