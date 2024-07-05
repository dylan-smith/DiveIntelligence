import { Page } from '@playwright/test';
import { DiveOverviewPage } from './dive-overview.page';

export class ChangeDepthPage {
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
