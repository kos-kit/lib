import { Label } from "./Label.js";
import { Model } from "./Model.js";
import { DataFactory, NamedNode } from "@rdfjs/types";

/**
 * Common interface between Concept and ConceptScheme.
 */
export interface LabeledModel extends Model {
  /**
   * Alternate labels, equivalent to skos:altLabel.
   */
  readonly altLabels: readonly Label[];
  readonly displayLabel: string;
  /**
   * Hidden labels, equivalent to skos:hiddenLabel.
   */
  readonly hiddenLabels: readonly Label[];
  readonly identifier: LabeledModel.Identifier;
  /**
   * Preferred labels, equivalent to skos:prefLabel.
   */
  readonly prefLabels: readonly Label[];
}

export namespace LabeledModel {
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

    export function toString(identifier: Identifier): string {
      return `<${identifier.value}>`;
    }
  }
}
