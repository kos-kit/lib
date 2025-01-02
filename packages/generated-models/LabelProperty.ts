import { NamedNode } from "@rdfjs/types";
import { skos, skosxl } from "@tpluscode/rdf-ns-builders";

export class LabelProperty {
  static readonly ALT = new LabelProperty({
    skosIdentifier: skos.altLabel,
    skosXlIdentifier: skosxl.altLabel,
  });

  static readonly HIDDEN = new LabelProperty({
    skosIdentifier: skos.hiddenLabel,
    skosXlIdentifier: skosxl.hiddenLabel,
  });

  static readonly PREF = new LabelProperty({
    skosIdentifier: skos.prefLabel,
    skosXlIdentifier: skosxl.prefLabel,
  });

  readonly skosIdentifier: NamedNode;
  readonly skosXlIdentifier: NamedNode;

  private constructor({
    skosIdentifier,
    skosXlIdentifier,
  }: {
    skosIdentifier: NamedNode;
    skosXlIdentifier: NamedNode;
  }) {
    this.skosIdentifier = skosIdentifier;
    this.skosXlIdentifier = skosXlIdentifier;
  }

  equals(other: LabelProperty): boolean {
    return this.skosIdentifier.equals(other.skosIdentifier);
  }
}

export const labelProperties: readonly LabelProperty[] = [
  LabelProperty.ALT,
  LabelProperty.HIDDEN,
  LabelProperty.PREF,
];
