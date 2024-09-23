import { Literal, NamedNode } from "@rdfjs/types";
import { rdfs, skos, skosxl } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import { Model } from "./Model.js";

export interface Label extends Model {
  readonly literalForm: Literal;
  readonly type: Label.Type;

  equals(other: Label): boolean;
}

export namespace Label {
  export interface Type {
    readonly literalProperty: NamedNode;
    readonly skosXlProperty: Maybe<NamedNode>;

    equals(other: Label.Type): boolean;
  }

  export namespace Type {
    function equals(this: Label.Type, other: Label.Type): boolean {
      return this.literalProperty.equals(other.literalProperty);
    }

    export const ALTERNATIVE: Type = {
      equals,
      literalProperty: skos.altLabel,
      skosXlProperty: Maybe.of(skosxl.altLabel),
    };

    export const HIDDEN: Type = {
      equals,
      literalProperty: skos.hiddenLabel,
      skosXlProperty: Maybe.of(skosxl.hiddenLabel),
    };

    export const OTHER: Type = {
      equals,
      literalProperty: rdfs.label,
      skosXlProperty: Maybe.empty(),
    };

    export const PREFERRED: Type = {
      equals,
      literalProperty: skos.prefLabel,
      skosXlProperty: Maybe.of(skosxl.prefLabel),
    };
  }

  export const Types: readonly Type[] = [
    Type.PREFERRED,
    Type.ALTERNATIVE,
    Type.HIDDEN,
    Type.OTHER,
  ];
}
