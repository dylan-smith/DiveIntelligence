import { Locator, Page } from '@playwright/test';
import { NewDivePage } from './new-dive.page';

export class HomePage {
  private readonly planADiveButton: Locator;

  constructor(private page: Page) {
    this.planADiveButton = page.getByRole('button', { name: 'Plan a Dive' });
  }

  async goto(): Promise<HomePage> {
    await this.page.goto('/');
    return this;
  }

  async planADive(): Promise<NewDivePage> {
    await this.planADiveButton.click();

    return new NewDivePage(this.page);
  }
}
