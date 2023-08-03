export function humanTimeLeft(time?: number): string {
  if (typeof time === 'undefined') {
    return 'Never';
  }

  return `${humanTime(time)} left`;
}

export function humanTimeElapsed(time?: number): string {
  if (typeof time === 'undefined') {
    return '';
  }

  return `${humanTime(time)} elapsed`;
}

export function humanTime(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
