import { GraphPattern } from "./GraphPattern.js";
import { IndentedString, TAB_SPACES } from "./IndentedString.js";
import { ToWhereOptions } from "./ToWhereOptions.js";
import "iterator-helpers-polyfill";

export abstract class GraphPatterns implements Iterable<GraphPattern> {
  static fromArray(array: readonly GraphPattern[]): GraphPatterns {
    return new ArrayGraphPatterns(array);
  }

  abstract [Symbol.iterator](): Iterator<GraphPattern>;

  sort(): GraphPatterns {
    const sortedGraphPatterns = this.toArray().concat();
    sortedGraphPatterns.sort((left, right) => {
      return left.sortRank - right.sortRank;
    });
    return new ArrayGraphPatterns(sortedGraphPatterns);
  }

  toArray(): readonly GraphPattern[] {
    return [...this];
  }

  toConstructString(): string {
    return this.toConstructStrings().join("\n");
  }

  toConstructStrings(): readonly string[] {
    return [
      ...this[Symbol.iterator]()
        .flatMap((graphPattern) =>
          graphPattern.toConstructIndentedStrings(TAB_SPACES),
        )
        .map(IndentedString.toString),
    ];
  }

  toWhereString(options?: ToWhereOptions): string {
    return this.toWhereStrings(options).join("\n");
  }

  toWhereStrings(options?: ToWhereOptions): readonly string[] {
    return [
      ...this[Symbol.iterator]()
        .flatMap((graphPattern) =>
          graphPattern.toWhereIndentedStrings(TAB_SPACES, options),
        )
        .map(IndentedString.toString),
    ];
  }
}

class ArrayGraphPatterns extends GraphPatterns {
  constructor(private readonly array: readonly GraphPattern[]) {
    super();
  }

  override [Symbol.iterator](): Iterator<GraphPattern> {
    return this.array[Symbol.iterator]();
  }
}
