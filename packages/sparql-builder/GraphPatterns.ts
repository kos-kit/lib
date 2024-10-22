import { GraphPattern } from "./GraphPattern.js";
import { IndentedString, TAB_SPACES } from "./IndentedString.js";
import { ToWhereOptions } from "./ToWhereOptions.js";

export class GraphPatterns implements Iterable<GraphPattern> {
  private readonly array: GraphPattern[]; // Mutable so subclasses can add to it in their constructors

  constructor() {
    this.array = [];
  }

  static fromArray(array: readonly GraphPattern[]): GraphPatterns {
    const instance = new GraphPatterns();
    instance.array.push(...array);
    return instance;
  }

  [Symbol.iterator](): Iterator<GraphPattern> {
    return this.array[Symbol.iterator]();
  }

  sort(): GraphPatterns {
    const sortedGraphPatterns = this.toArray().concat();
    sortedGraphPatterns.sort((left, right) => {
      return left.sortRank - right.sortRank;
    });
    return GraphPatterns.fromArray(sortedGraphPatterns);
  }

  toArray(): readonly GraphPattern[] {
    return this.array;
  }

  toConstructString(): string {
    return this.toConstructStrings().join("\n");
  }

  toConstructStrings(): readonly string[] {
    return this.toArray()
      .flatMap((graphPattern) => [
        ...graphPattern.toConstructIndentedStrings(TAB_SPACES),
      ])
      .map(IndentedString.toString);
  }

  toGroupGraphPattern(): GraphPattern {
    return GraphPattern.group(this);
  }

  toWhereString(options?: ToWhereOptions): string {
    return this.toWhereStrings(options).join("\n");
  }

  toWhereStrings(options?: ToWhereOptions): readonly string[] {
    return this.toArray()
      .flatMap((graphPattern) => [
        ...graphPattern.toWhereIndentedStrings(TAB_SPACES, options),
      ])
      .map(IndentedString.toString);
  }

  protected add(...graphPatterns: readonly GraphPattern[]): void {
    this.array.push(...graphPatterns);
  }
}
