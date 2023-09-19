import { IDiveSegment } from './IDiveSegment';

export class EndDiveSegment implements IDiveSegment {
  Timestamp: number;
  Title: string;
  Description: string;

  constructor(depth: number) {
    this.Timestamp = 0;
    this.Title = 'Surface';

    const ascentTime = (depth / 10) * 60;

    const ascentMinutes = Math.floor(ascentTime / 60);
    const ascentSeconds = Math.floor(ascentTime % 60);

    let ascentTimeDesc = `
      ${ascentMinutes > 0 ? ascentMinutes + ' min ' : ''}
      ${ascentSeconds > 0 ? ascentSeconds + ' sec ' : ''}`;

    if (ascentTimeDesc.trim() === '') {
      ascentTimeDesc = '0 sec ';
    }

    this.Description = `Ascent time: ${ascentTimeDesc}@ 10m/min`;
  }
}
