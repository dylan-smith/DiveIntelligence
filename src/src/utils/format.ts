export function humanDuration(value: number): string {
  const minutes = Math.floor(value / 60);
  const seconds = Math.round(value % 60);

  let result = `${minutes > 0 ? minutes + ' min' : ''}${seconds > 0 ? ' ' + seconds + ' sec' : ''}`;

  result = result.trim();

  if (minutes + seconds === 0) {
    result = '0 sec';
  }

  return result;
}

export function colonDuration(value: number): string {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value - hours * 3600) / 60);
  const seconds = Math.floor(value % 60);

  let result = '';

  if (hours > 0) {
    result += hours + ':';
    result += minutes < 10 ? '0' + minutes : minutes;
    result += ':';
  } else {
    result += minutes + ':';
  }

  result += seconds < 10 ? '0' + seconds : seconds;

  return result;
}
