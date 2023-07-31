import { createHash } from 'crypto';

export function secretToId(secret: string): string {
  return createHash('sha256').update(secret).digest('hex');
}
