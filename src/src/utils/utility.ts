export function ceilingWithThreshold(ceiling: number, threshold: number = 0.000001): number {
  return Math.ceil(ceiling - threshold);
}

export function floorWithThreshold(floor: number, threshold: number = 0.000001): number {
  return Math.floor(floor + threshold);
}
