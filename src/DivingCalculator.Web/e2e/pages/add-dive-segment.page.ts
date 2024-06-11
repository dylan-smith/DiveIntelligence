import { Page } from '@playwright/test';
import { DiveOverviewPage } from './dive-overview.page';

export class AddDiveSegmentPage {
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

  async getCurrentEND(): Promise<string> {
    let content = await this.page.locator('dive-current-stats .current-stats .dive-stat').getByText('END: ').textContent();
    content = content ?? '';
    return content.replace('END: ', '').trim();
  }

  async setNewDepth(depth: number): Promise<AddDiveSegmentPage> {
    await this.page.getByLabel('New Depth (m)').fill(depth.toString());
    return this;
  }

  async getDescentTime(): Promise<string> {
    let content = await this.page.locator('dive-new-depth-stats .new-depth-stats .dive-stat').getByText('Descent Time: ').textContent();
    content = content ?? '';
    return content.replace('Descent Time: ', '').trim();
  }

  async getNewDepthPO2(): Promise<string> {
    let content = await this.page.locator('dive-new-depth-stats .new-depth-stats .dive-stat').getByText('PO2: ').textContent();
    content = content ?? '';
    return content.replace('PO2: ', '').trim();
  }

  async getNewDepthEND(): Promise<string> {
    let content = await this.page.locator('dive-new-depth-stats .new-depth-stats .dive-stat').getByText('END: ').textContent();
    content = content ?? '';
    return content.replace('END: ', '').trim();
  }

  async getNewGasPO2(): Promise<string> {
    let content = await this.page.locator('dive-new-gas-stats .new-gas-stats .gas-calculation-chunk .dive-stat').getByText('PO2: ').textContent();
    content = content ?? '';
    return content.replace('PO2: ', '').trim();
  }

  async getNewGasEND(): Promise<string> {
    let content = await this.page.locator('dive-new-gas-stats .new-gas-stats .gas-calculation-chunk .dive-stat').getByText('END: ').textContent();
    content = content ?? '';
    return content.replace('END: ', '').trim();
  }

  async getNewGasNoDecoLimit(): Promise<string> {
    let content = await this.page.locator('dive-new-gas-stats .new-gas-stats .gas-calculation-chunk .dive-stat').getByText('No Deco Limit: ').textContent();
    content = content ?? '';
    return content.replace('No Deco Limit: ', '').trim();
  }

  async getNewGasMaxDepthPO2(): Promise<string> {
    let content = await this.page.locator('dive-new-gas-stats .new-gas-stats .gas-calculation-chunk .dive-stat').getByText('Max Depth (PO2): ').textContent();
    content = content ?? '';
    return content.replace('Max Depth (PO2): ', '').trim();
  }

  async getNewGasMaxDepthEND(): Promise<string> {
    let content = await this.page.locator('dive-new-gas-stats .new-gas-stats .gas-calculation-chunk .dive-stat').getByText('Max Depth (END): ').textContent();
    content = content ?? '';
    return content.replace('Max Depth (END): ', '').trim();
  }

  async getNewGasMinDepthHypoxia(): Promise<string> {
    let content = await this.page
      .locator('dive-new-gas-stats .new-gas-stats .gas-calculation-chunk .dive-stat')
      .getByText('Min Depth (Hypoxia): ')
      .textContent();
    content = content ?? '';
    return content.replace('Min Depth (Hypoxia): ', '').trim();
  }

  async setTimeAtDepth(time: number): Promise<AddDiveSegmentPage> {
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

  async Save(): Promise<DiveOverviewPage> {
    await this.page.getByRole('button', { name: 'Save' }).click();
    return new DiveOverviewPage(this.page);
  }
}
