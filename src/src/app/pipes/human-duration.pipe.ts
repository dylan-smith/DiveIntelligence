import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'humanDuration',
  standalone: false,
})
export class HumanDurationPipe implements PipeTransform {
  transform(value: number): string {
    const minutes = Math.floor(value / 60);
    const seconds = Math.round(value % 60);

    let result = `${minutes > 0 ? minutes + ' min' : ''}${seconds > 0 ? ' ' + seconds + ' sec' : ''}`;

    result = result.trim();

    if (minutes + seconds === 0) {
      result = '0 sec ';
    }

    return result;
  }
}
