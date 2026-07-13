export class DiveSettings {
  ascentRate = 10;
  descentRate = 20;
  isOxygenNarcotic = true;
  workingPO2Maximum = 1.4;
  decoPO2Maximum = 1.6;
  pO2Minimum = 0.18;
  ENDErrorThreshold = 30;

  get ENDErrorMessage(): string {
    return `END is above the configured error threshold of ${this.ENDErrorThreshold}m`;
  }

  get MaxDepthPO2Tooltip(): string {
    return `Maximum depth this gas can be breathed at without going over an oxygen partial pressure of ${this.workingPO2Maximum} (${this.decoPO2Maximum} for deco stops)`;
  }

  get MaxDepthENDTooltip(): string {
    return `Maximum depth this gas can be breathed at before you experience narcosis equivalent to ${this.ENDErrorThreshold}m on air`;
  }

  get MinDepthTooltip(): string {
    return `Minimum depth this gas can be breathed at before you experience hypoxia (PO2 < ${this.pO2Minimum})`;
  }
}
