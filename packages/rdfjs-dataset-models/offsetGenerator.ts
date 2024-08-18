export function* offsetGenerator<T>(
  generator: Generator<T>,
  offset: number,
): Generator<T> {
  if (offset <= 0) {
    yield* generator;
    return;
  }

  let itemI = 0;
  for (const item of generator) {
    if (itemI++ >= offset) {
      yield item;
    }
  }
}
