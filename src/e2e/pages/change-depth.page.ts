import { Page } from '@playwright/test';
import { DiveOverviewPage } from './dive-overview.page';
import { CurrentStatsComponent } from 'e2e/components/current-stats.component';

export class ChangeDepthPage {
  constructor(private page: Page) {}

  public currentStats = new CurrentStatsComponent(this.page.locator('dive-current-stats'));

  async setNewDepth(depth: number): Promise<ChangeDepthPage> {
    await this.page.getByLabel('New Depth (m)').fill(depth.toString());
    return this;
  }

  async getDescentTime(): Promise<string> {
    let content = await this.page.locator('dive-new-depth-stats .new-depth-stats .dive-stat').getByText('Descent Time: ').textContent();
    content = content ?? '';
    return content.replace('Descent Time: ', '').trim();
  }

  async getAscentTime(): Promise<string> {
    let content = await this.page.locator('dive-new-depth-stats .new-depth-stats .dive-stat').getByText('Ascent Time: ').textContent();
    content = content ?? '';
    return content.replace('Ascent Time: ', '').trim();
  }

  async getNewDepthPO2(): Promise<string> {
    let content = await this.page.locator('dive-new-depth-stats .new-depth-stats .dive-stat').getByText('PO2: ').textContent();
    content = content ?? '';
    return content.replace('PO2: ', '').trim();
  }

  async isNewDepthPO2Warning(): Promise<boolean> {
    return this.page
      .locator('dive-new-depth-stats .new-depth-stats div.dive-stat', { has: this.page.getByText(/\s*PO2:/) })
      .locator('mat-icon')
      .getByText('warning')
      .isVisible();
  }

  async getNewDepthEND(): Promise<string> {
    let content = await this.page.locator('dive-new-depth-stats .new-depth-stats .dive-stat').getByText('END: ').textContent();
    content = content ?? '';
    return content.replace('END: ', '').trim();
  }

  async Save(): Promise<DiveOverviewPage> {
    await this.page.getByRole('button', { name: 'Save' }).click();
    return new DiveOverviewPage(this.page);
  }
}
