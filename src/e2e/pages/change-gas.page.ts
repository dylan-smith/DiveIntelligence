import { Page } from '@playwright/test';
import { DiveOverviewPage } from './dive-overview.page';
import { CurrentStatsComponent } from 'e2e/components/current-stats.component';

export class ChangeGasPage {
  constructor(private page: Page) {}

  public currentStats = new CurrentStatsComponent(this.page);

  async getOptimalDecoGas(): Promise<string> {
    let content = await this.page.getByText('Optimal Deco Gas').locator('..').locator('p').textContent();
    content = content ?? '';
    return content.trim();
  }

  async selectOptimalDecoGas(): Promise<ChangeGasPage> {
    await this.page.getByLabel('Optimal Deco Gas').click();
    return this;
  }

  async selectStandardGas(gas: string): Promise<ChangeGasPage> {
    await this.page.getByLabel('Standard Gas').click();
    await this.page.getByRole('combobox').click();
    await this.page.getByRole('option', { name: new RegExp(gas) }).click();
    return this;
  }

  async selectCustomGas(oxygen: number, helium: number): Promise<ChangeGasPage> {
    await this.page.getByLabel('Custom gas').click();
    await this.page.getByLabel('Oxygen (%)').fill(oxygen.toString());
    await this.page.getByLabel('Helium (%)').fill(helium.toString());
    return this;
  }

  async getNewGasPO2(): Promise<string> {
    let content = await this.page.getByText(/^PO2: /).last().textContent();
    content = content ?? '';
    return content.replace('PO2: ', '').trim();
  }

  async isNewGasPO2Warning(): Promise<boolean> {
    return this.page.getByTestId('WarningIcon').isVisible();
  }

  async getNewGasEND(): Promise<string> {
    let content = await this.page.getByText(/^END: /).last().textContent();
    content = content ?? '';
    return content.replace('END: ', '').trim();
  }

  async getNewGasNoDecoLimit(): Promise<string> {
    let content = await this.page.getByText('No Deco Limit: ').last().textContent();
    content = content ?? '';
    return content.replace('No Deco Limit: ', '').trim();
  }

  async getNewGasMaxDepthPO2(): Promise<string> {
    let content = await this.page.getByText('Max Depth (PO2): ').last().textContent();
    content = content ?? '';
    return content.replace('Max Depth (PO2): ', '').trim();
  }

  async getNewGasMaxDepthEND(): Promise<string> {
    let content = await this.page.getByText('Max Depth (END): ').last().textContent();
    content = content ?? '';
    return content.replace('Max Depth (END): ', '').trim();
  }

  async getNewGasMinDepthHypoxia(): Promise<string> {
    let content = await this.page.getByText('Min Depth (Hypoxia): ').last().textContent();
    content = content ?? '';
    return content.replace('Min Depth (Hypoxia): ', '').trim();
  }

  async Save(): Promise<DiveOverviewPage> {
    await this.page.getByRole('button', { name: 'Save' }).click();
    return new DiveOverviewPage(this.page);
  }
}
