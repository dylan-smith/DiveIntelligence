import { Page } from '@playwright/test';
import { DiveOverviewPage } from './dive-overview.page';
import { CurrentStatsComponent } from 'e2e/components/current-stats.component';

export class ChangeDepthPage {
  constructor(private page: Page) {}

  public currentStats = new CurrentStatsComponent(this.page);

  async setNewDepth(depth: number): Promise<ChangeDepthPage> {
    await this.page.getByLabel('New Depth (m)').fill(depth.toString());
    return this;
  }

  async getDescentTime(): Promise<string> {
    let content = await this.page.getByText('Descent Time: ').textContent();
    content = content ?? '';
    return content.replace('Descent Time: ', '').trim();
  }

  async getAscentTime(): Promise<string> {
    let content = await this.page.getByText('Ascent Time: ').textContent();
    content = content ?? '';
    return content.replace('Ascent Time: ', '').trim();
  }

  async getNewDepthPO2(): Promise<string> {
    let content = await this.page.getByText(/^PO2: /).last().textContent();
    content = content ?? '';
    return content.replace('PO2: ', '').trim();
  }

  async isNewDepthPO2Warning(): Promise<boolean> {
    return this.page.getByTestId('WarningIcon').isVisible();
  }

  async getNewDepthEND(): Promise<string> {
    let content = await this.page.getByText(/^END: /).last().textContent();
    content = content ?? '';
    return content.replace('END: ', '').trim();
  }

  async getNewDepthNDL(): Promise<string> {
    let content = await this.page.getByText('No Deco Limit: ').last().textContent();
    content = content ?? '';
    return content.replace('No Deco Limit: ', '').trim();
  }

  async getNewDepthCeiling(): Promise<string> {
    let content = await this.page.getByText('Ceiling: ').last().textContent();
    content = content ?? '';
    return content.replace('Ceiling: ', '').trim();
  }

  async Save(): Promise<DiveOverviewPage> {
    await this.page.getByRole('button', { name: 'Save' }).click();
    return new DiveOverviewPage(this.page);
  }
}
