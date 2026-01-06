import { Page } from '@playwright/test';
import { DiveOverviewPage } from './dive-overview.page';
import { CurrentStatsComponent } from 'e2e/components/current-stats.component';

export class ChangeDepthPage {
  public currentStats: CurrentStatsComponent;

  constructor(private page: Page) {
    this.currentStats = new CurrentStatsComponent(page, page.locator('main').first());
  }

  async setNewDepth(depth: number): Promise<ChangeDepthPage> {
    await this.page.getByLabel('New Depth (m)').fill(depth.toString());
    return this;
  }

  async getDescentTime(): Promise<string> {
    const content = await this.page.getByText(/Descent Time:/).textContent();
    return (content ?? '').replace(/.*Descent Time:\s*/, '').trim();
  }

  async getAscentTime(): Promise<string> {
    const content = await this.page.getByText(/Ascent Time:/).textContent();
    return (content ?? '').replace(/.*Ascent Time:\s*/, '').trim();
  }

  async getNewDepthPO2(): Promise<string> {
    const content = await this.page.locator('main').getByText(/^PO2:/).textContent();
    return (content ?? '').replace('PO2:', '').trim();
  }

  async isNewDepthPO2Warning(): Promise<boolean> {
    return this.page.locator('[data-testid="WarningIcon"]').isVisible();
  }

  async getNewDepthEND(): Promise<string> {
    const content = await this.page.locator('main').getByText(/^END:/).textContent();
    return (content ?? '').replace('END:', '').trim();
  }

  async getNewDepthNDL(): Promise<string> {
    const content = await this.page.locator('main').getByText(/^NDL:/).textContent();
    return (content ?? '').replace('NDL:', '').trim();
  }

  async getNewDepthCeiling(): Promise<string> {
    const content = await this.page.locator('main').getByText(/^Ceiling:/).textContent();
    return (content ?? '').replace('Ceiling:', '').trim();
  }

  async Save(): Promise<DiveOverviewPage> {
    await this.page.getByRole('button', { name: 'Save' }).click();
    return new DiveOverviewPage(this.page);
  }
}
