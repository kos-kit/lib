import { NamedNode } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import { iriToTranslationKey } from "./iriToTranslationKey.js";

export class LabelProperty {
  static readonly ALT = new LabelProperty(skos.altLabel);
  static readonly HIDDEN = new LabelProperty(skos.hiddenLabel);
  static readonly PREF = new LabelProperty(skos.prefLabel);

  private constructor(
    readonly identifier: NamedNode<
      | "http://www.w3.org/2004/02/skos/core#altLabel"
      | "http://www.w3.org/2004/02/skos/core#hiddenLabel"
      | "http://www.w3.org/2004/02/skos/core#prefLabel"
    >,
  ) {}

  get translationKey(): string {
    return iriToTranslationKey(this.identifier);
  }
}

export const labelProperties: readonly LabelProperty[] = [
  LabelProperty.ALT,
  LabelProperty.HIDDEN,
  LabelProperty.PREF,
];
