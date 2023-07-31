export function randomString(
  length: number,
  characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-_'
) {
  return Array.from({ length }, () =>
    characterSet.charAt(Math.floor(Math.random() * characterSet.length))
  ).join('');
}
