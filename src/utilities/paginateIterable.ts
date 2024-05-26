export function* paginateIterable<T>(
  iterable: Iterable<T>,
  { limit, offset }: { limit: number; offset: number },
): Iterable<T> {
  if (limit <= 0) {
    throw new RangeError();
  }
  if (offset < 0) {
    throw new RangeError();
  }

  let itemI = 0;
  let yieldedItemCount = 0;
  for (const item of iterable) {
    if (itemI++ >= offset) {
      yield item;
      if (++yieldedItemCount === limit) {
        return;
      }
    }
  }
}
