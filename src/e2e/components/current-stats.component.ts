import { Locator, Page } from '@playwright/test';

export class CurrentStatsComponent {
  constructor(private page: Page, private host: Locator) {}

  async getCurrentDepth(): Promise<string> {
    const content = await this.host.getByText(/^Current Depth:/).textContent();
    return (content ?? '').replace('Current Depth:', '').trim();
  }

  async getNoDecoLimit(): Promise<string> {
    const content = await this.host.getByText(/^No Deco Limit:/).textContent();
    return (content ?? '').replace('No Deco Limit:', '').trim();
  }

  async getCurrentCeiling(): Promise<string> {
    const content = await this.host.getByText(/^Current Ceiling:/).textContent();
    return (content ?? '').replace('Current Ceiling:', '').trim();
  }

  async getCurrentGas(): Promise<string> {
    const content = await this.host.getByText(/^Current Gas:/).textContent();
    return (content ?? '').replace('Current Gas:', '').trim();
  }

  async getCurrentMaxDepthPO2(): Promise<string> {
    const content = await this.host.getByText(/^Max Depth \(PO2\):/).textContent();
    return (content ?? '').replace('Max Depth (PO2):', '').trim();
  }

  async getCurrentMaxDepthEND(): Promise<string> {
    const content = await this.host.getByText(/^Max Depth \(END\):/).textContent();
    return (content ?? '').replace('Max Depth (END):', '').trim();
  }

  async getCurrentMinDepthHypoxia(): Promise<string> {
    const content = await this.host.getByText(/^Min Depth \(Hypoxia\):/).textContent();
    return (content ?? '').replace('Min Depth (Hypoxia):', '').trim();
  }

  async getCurrentPO2(): Promise<string> {
    const content = await this.host.getByText(/^PO2:/).textContent();
    return (content ?? '').replace('PO2:', '').trim();
  }

  async isCurrentPO2Warning(): Promise<boolean> {
    return this.host.locator('[data-testid="WarningIcon"]').isVisible();
  }

  async getCurrentEND(): Promise<string> {
    const content = await this.host.getByText(/^END:/).textContent();
    return (content ?? '').replace('END:', '').trim();
  }
}
