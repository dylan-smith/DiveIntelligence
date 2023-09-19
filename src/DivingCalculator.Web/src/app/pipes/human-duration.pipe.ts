import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'humanDuration',
})
export class HumanDurationPipe implements PipeTransform {
  transform(value: number): string {
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);

    let result = `${minutes > 0 ? minutes + ' min ' : ''}
                  ${seconds > 0 ? seconds + ' sec ' : ''}`;

    if (minutes + seconds === 0) {
      result = '0 sec ';
    }

    return result;
  }
}
