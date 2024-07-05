import { Page } from '@playwright/test';
import { DiveOverviewPage } from './dive-overview.page';

export class ChangeGasPage {
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

  async getOptimalDecoGas(): Promise<string> {
    let content = await this.page.locator('dive-new-gas-input mat-radio-button[value="optimal"] .gas-description').textContent();
    content = content ?? '';
    return content.trim();
  }

  async selectOptimalDecoGas(): Promise<ChangeGasPage> {
    await this.page.getByLabel('Optimal Deco Gas').click();
    return this;
  }

  async selectStandardGas(gas: string): Promise<ChangeGasPage> {
    await this.page.getByLabel('Standard Gas').click();
    await this.page.locator('div.new-gas-col .mat-mdc-form-field-type-mat-select .mat-mdc-text-field-wrapper').click();
    await this.page.getByText(gas).click();
    return this;
  }

  async selectCustomGas(oxygen: number, helium: number): Promise<ChangeGasPage> {
    await this.page.getByLabel('Custom Gas').click();
    await this.page.getByLabel('Oxygen (%)').fill(oxygen.toString());
    await this.page.getByLabel('Helium (%)').fill(helium.toString());
    return this;
  }

  async getNewGasPO2(): Promise<string> {
    let content = await this.page.locator('dive-new-gas-stats .new-gas-stats .gas-calculation-chunk .dive-stat').getByText('PO2: ').textContent();
    content = content ?? '';
    return content.replace('PO2: ', '').trim();
  }

  async isNewGasPO2Warning(): Promise<boolean> {
    return this.page
      .locator('dive-new-gas-stats .new-gas-stats div.dive-stat', { has: this.page.getByText(/\s*PO2:/) })
      .locator('mat-icon')
      .getByText('warning')
      .isVisible();
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

  async Save(): Promise<DiveOverviewPage> {
    await this.page.getByRole('button', { name: 'Save' }).click();
    return new DiveOverviewPage(this.page);
  }
}
