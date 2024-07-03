export async function* paginationToAsyncIterable<T>({
  getPage,
  totalCount,
}: {
  getPage: (kwds: { offset: number }) => Promise<readonly T[]>;
  totalCount: number;
}): AsyncIterable<T> {
  let offset = 0;
  while (offset < totalCount) {
    for (const value of await getPage({ offset })) {
      yield value;
      offset++;
    }
  }
}
