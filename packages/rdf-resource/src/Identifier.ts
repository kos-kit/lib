/* eslint-disable @typescript-eslint/no-namespace */
import { BlankNode, NamedNode } from "@rdfjs/types";
import DataFactory from "@rdfjs/data-model";

export type Identifier = BlankNode | NamedNode;

export namespace Identifier {
  export function fromString(str: string) {
    if (str.startsWith("_:")) {
      return DataFactory.blankNode(str.substring("_:".length));
    } else if (str.startsWith("<") && str.endsWith(">") && str.length > 2) {
      return DataFactory.namedNode(str.substring(1, str.length - 1));
    } else {
      throw new RangeError(str);
    }
  }

  export function toString(identifier: Identifier) {
    switch (identifier.termType) {
      case "BlankNode":
        return `_:${identifier.value}`;
      case "NamedNode":
        return `<${identifier.value}>`;
    }
  }
}
