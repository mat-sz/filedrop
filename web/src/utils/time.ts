export function humanTime(time?: number): string {
  if (typeof time === 'undefined') {
    return '';
  }

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
