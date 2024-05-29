export function countIterable<T>(iterable: Iterable<T>): number {
  let count = 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const _ of iterable) {
    count++;
  }
  return count;
}
