export function* limitGenerator<T>(
  generator: Generator<T>,
  limit: number | null,
): Generator<T> {
  if (limit === null || limit <= 0) {
    yield* generator;
    return;
  }

  let yieldedItemCount = 0;
  for (const item of generator) {
    yield item;
    if (++yieldedItemCount === limit) {
      return;
    }
  }
}
