import { Locator, Page } from '@playwright/test';
import { DiveOverviewPage } from './dive-overview.page';

export class NewDivePage {
  private readonly planADiveButton: Locator;

  constructor(private page: Page) {
    this.planADiveButton = page.getByRole('button', { name: 'Plan a Dive' });
  }

  async goto(): Promise<NewDivePage> {
    await this.page.goto('/new-dive');
    return this;
  }

  async selectStandardGas(gas: string): Promise<NewDivePage> {
    await this.page.getByText(gas).click();
    return this;
  }

  async getMaxDepthPO2(): Promise<string> {
    let content = await this.page.getByText('Max Depth (PO2): ').textContent();
    content = content ?? '';
    return content.replace('Max Depth (PO2): ', '').trim();
  }

  async getMaxDepthEND(): Promise<string> {
    let content = await this.page.getByText('Max Depth (END): ').textContent();
    content = content ?? '';
    return content.replace('Max Depth (END): ', '').trim();
  }

  async getMinDepthHypoxia(): Promise<string> {
    let content = await this.page.getByText('Min Depth (Hypoxia): ').textContent();
    content = content ?? '';
    return content.replace('Min Depth (Hypoxia): ', '').trim();
  }

  async Save(): Promise<DiveOverviewPage> {
    await this.page.getByRole('button', { name: 'Save' }).click();
    return new DiveOverviewPage(this.page);
  }
}
