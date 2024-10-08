import { NamedNode } from "@rdfjs/types";
import { termToString } from "./termToString";

export type PropertyPath =
  | {
      readonly type: "PredicatePath";
      readonly value: NamedNode;
    }
  | {
      readonly type: "SequencePath";
      readonly value: readonly PropertyPath[];
    }
  | {
      readonly type: "ZeroOrMorePath";
      readonly value: PropertyPath;
    };

export namespace PropertyPath {
  export function predicate(value: NamedNode): PropertyPath {
    return {
      type: "PredicatePath",
      value,
    };
  }

  export function sequence(...value: readonly PropertyPath[]): PropertyPath {
    return {
      type: "SequencePath",
      value,
    };
  }

  export function zeroOrMore(value: PropertyPath): PropertyPath {
    return {
      type: "ZeroOrMorePath",
      value,
    };
  }

  export function toWhereString(propertyPath: PropertyPath): string {
    switch (propertyPath.type) {
      case "PredicatePath":
        return termToString(propertyPath.value);
      case "SequencePath":
        return propertyPath.value
          .map(
            (subPropertyPath): string => `(${toWhereString(subPropertyPath)})`,
          )
          .join("/");
      case "ZeroOrMorePath":
        return `(${toWhereString(propertyPath.value)})*`;
    }
  }
}
