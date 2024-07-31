export function countIterable<T>(iterable: Iterable<T>): number {
  let count = 0;
  for (const _ of iterable) {
    count++;
  }
  return count;
}
