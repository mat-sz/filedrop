export function humanTimeLeft(time?: number): string {
  if (typeof time === 'undefined') {
    return 'Never';
  } else if (time === 0) {
    return 'Almost there...';
  }

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')} left`;
}
