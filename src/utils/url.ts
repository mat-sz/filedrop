export function replaceUrlParameters(url: string): string {
  return url
    .replace('(hostname)', window.location.hostname)
    .replace(
      '(protocol)',
      window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    )
    .replace(
      '(port)',
      window.location.port ||
        (window.location.protocol === 'https:' ? '443' : '80')
    );
}
