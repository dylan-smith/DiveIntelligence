import { Page } from '@playwright/test';

export class CurrentStatsComponent {
  constructor(private page: Page) {}

  async getCurrentDepth(): Promise<string> {
    let content = await this.page.getByText('Current Depth: ').first().textContent();
    content = content ?? '';
    return content.replace('Current Depth: ', '').trim();
  }

  async getNoDecoLimit(): Promise<string> {
    let content = await this.page.getByText('No Deco Limit: ').first().textContent();
    content = content ?? '';
    return content.replace('No Deco Limit: ', '').trim();
  }

  async getCurrentCeiling(): Promise<string> {
    let content = await this.page.getByText('Current Ceiling: ').first().textContent();
    content = content ?? '';
    return content.replace('Current Ceiling: ', '').trim();
  }

  async getCurrentGas(): Promise<string> {
    let content = await this.page.getByText('Current Gas: ').first().textContent();
    content = content ?? '';
    return content.replace('Current Gas: ', '').trim();
  }

  async getCurrentMaxDepthPO2(): Promise<string> {
    let content = await this.page.getByText('Max Depth (PO2): ').first().textContent();
    content = content ?? '';
    return content.replace('Max Depth (PO2): ', '').trim();
  }

  async getCurrentMaxDepthEND(): Promise<string> {
    let content = await this.page.getByText('Max Depth (END): ').first().textContent();
    content = content ?? '';
    return content.replace('Max Depth (END): ', '').trim();
  }

  async getCurrentMinDepthHypoxia(): Promise<string> {
    let content = await this.page.getByText('Min Depth (Hypoxia): ').first().textContent();
    content = content ?? '';
    return content.replace('Min Depth (Hypoxia): ', '').trim();
  }

  async getCurrentPO2(): Promise<string> {
    let content = await this.page.getByText(/^PO2: /).first().textContent();
    content = content ?? '';
    return content.replace('PO2: ', '').trim();
  }

  async isCurrentPO2Warning(): Promise<boolean> {
    return this.page.getByTestId('WarningIcon').isVisible();
  }

  async getCurrentEND(): Promise<string> {
    let content = await this.page.getByText(/^END: /).first().textContent();
    content = content ?? '';
    return content.replace('END: ', '').trim();
  }
}
