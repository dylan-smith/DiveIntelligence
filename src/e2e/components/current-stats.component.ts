import { Locator } from '@playwright/test';

export class CurrentStatsComponent {
  constructor(private host: Locator) {}

  async getCurrentDepth(): Promise<string> {
    let content = await this.host.locator('.current-stats .dive-stat').getByText('Current Depth: ').textContent();
    content = content ?? '';
    return content.replace('Current Depth: ', '').trim();
  }

  async getCurrentCeiling(): Promise<string> {
    let content = await this.host.locator('.current-stats .dive-stat').getByText('Current Ceiling: ').textContent();
    content = content ?? '';
    return content.replace('Current Ceiling: ', '').trim();
  }

  async getCurrentGas(): Promise<string> {
    let content = await this.host.locator('.current-stats .dive-stat').getByText('Current Gas: ').textContent();
    content = content ?? '';
    return content.replace('Current Gas: ', '').trim();
  }

  async getCurrentMaxDepthPO2(): Promise<string> {
    let content = await this.host.locator('.current-stats .dive-stat').getByText('Max Depth (PO2): ').textContent();
    content = content ?? '';
    return content.replace('Max Depth (PO2): ', '').trim();
  }

  async getCurrentMaxDepthEND(): Promise<string> {
    let content = await this.host.locator('.current-stats .dive-stat').getByText('Max Depth (END): ').textContent();
    content = content ?? '';
    return content.replace('Max Depth (END): ', '').trim();
  }

  async getCurrentMinDepthHypoxia(): Promise<string> {
    let content = await this.host.locator('.current-stats .dive-stat').getByText('Min Depth (Hypoxia): ').textContent();
    content = content ?? '';
    return content.replace('Min Depth (Hypoxia): ', '').trim();
  }

  async getCurrentPO2(): Promise<string> {
    let content = await this.host.locator('.current-stats .dive-stat').getByText('PO2: ').textContent();
    content = content ?? '';
    return content.replace('PO2: ', '').trim();
  }

  async isCurrentPO2Warning(): Promise<boolean> {
    return this.host
      .locator('.current-stats div.dive-stat', { has: this.host.page().getByText(/\s*PO2:/) })
      .locator('mat-icon')
      .getByText('warning')
      .isVisible();
  }

  async getCurrentEND(): Promise<string> {
    let content = await this.host.locator('.current-stats .dive-stat').getByText('END: ').textContent();
    content = content ?? '';
    return content.replace('END: ', '').trim();
  }
}
