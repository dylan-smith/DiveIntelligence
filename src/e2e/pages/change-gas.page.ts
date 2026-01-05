import { Page } from '@playwright/test';
import { DiveOverviewPage } from './dive-overview.page';
import { CurrentStatsComponent } from 'e2e/components/current-stats.component';

export class ChangeGasPage {
  public currentStats: CurrentStatsComponent;

  constructor(private page: Page) {
    this.currentStats = new CurrentStatsComponent(page, page.locator('main').first());
  }

  async getOptimalDecoGas(): Promise<string> {
    const content = await this.page.getByText(/^Optimal gas for/).textContent();
    return (content ?? '').trim();
  }

  async selectOptimalDecoGas(): Promise<ChangeGasPage> {
    await this.page.getByLabel('Gas Type').click();
    await this.page.getByRole('option', { name: 'Optimal Deco Gas' }).click();
    return this;
  }

  async selectStandardGas(gas: string): Promise<ChangeGasPage> {
    await this.page.getByLabel('Gas Type').click();
    await this.page.getByRole('option', { name: 'Standard Gas' }).click();
    await this.page.getByLabel('Standard Gas').click();
    await this.page.getByRole('option', { name: gas }).click();
    return this;
  }

  async selectCustomGas(oxygen: number, helium: number): Promise<ChangeGasPage> {
    await this.page.getByLabel('Gas Type').click();
    await this.page.getByRole('option', { name: 'Custom Gas' }).click();
    await this.page.getByLabel('Oxygen (%)').fill(oxygen.toString());
    await this.page.getByLabel('Helium (%)').fill(helium.toString());
    return this;
  }

  async getNewGasPO2(): Promise<string> {
    const content = await this.page.locator('main').getByText(/^PO2 at current depth:/).textContent();
    return (content ?? '').replace('PO2 at current depth:', '').trim();
  }

  async isNewGasPO2Warning(): Promise<boolean> {
    return this.page.locator('[data-testid="WarningIcon"]').isVisible();
  }

  async getNewGasEND(): Promise<string> {
    const content = await this.page.locator('main').getByText(/^END at current depth:/).textContent();
    return (content ?? '').replace('END at current depth:', '').trim();
  }

  async getNewGasNoDecoLimit(): Promise<string> {
    const content = await this.page.locator('main').getByText(/^No Deco Limit:/).textContent();
    return (content ?? '').replace('No Deco Limit:', '').trim();
  }

  async getNewGasMaxDepthPO2(): Promise<string> {
    const content = await this.page.locator('main').getByText(/^Max Depth \(PO2\):/).textContent();
    return (content ?? '').replace('Max Depth (PO2):', '').trim();
  }

  async getNewGasMaxDepthEND(): Promise<string> {
    const content = await this.page.locator('main').getByText(/^Max Depth \(END\):/).textContent();
    return (content ?? '').replace('Max Depth (END):', '').trim();
  }

  async getNewGasMinDepthHypoxia(): Promise<string> {
    const content = await this.page.locator('main').getByText(/^Min Depth \(Hypoxia\):/).textContent();
    return (content ?? '').replace('Min Depth (Hypoxia):', '').trim();
  }

  async Save(): Promise<DiveOverviewPage> {
    await this.page.getByRole('button', { name: 'Save' }).click();
    return new DiveOverviewPage(this.page);
  }
}
