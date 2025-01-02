import { DataFactory, NamedNode } from "@rdfjs/types";

export type Identifier = NamedNode;

export namespace Identifier {
  export function fromString({
    dataFactory,
    identifier,
  }: {
    dataFactory: DataFactory;
    identifier: string;
  }): Identifier {
    if (
      identifier.startsWith("<") &&
      identifier.endsWith(">") &&
      identifier.length > 2
    ) {
      return dataFactory.namedNode(
        identifier.substring(1, identifier.length - 1),
      );
    }
    throw new RangeError(identifier);
  }

  // biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
  export function toString(identifier: Identifier): string {
    return `<${identifier.value}>`;
  }
}
