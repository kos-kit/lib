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
    readonly literalPredicate: NamedNode;
    readonly name: "alternative" | "hidden" | "other" | "preferred";
    readonly skosXlPredicate: Maybe<NamedNode>;
  }

  export namespace Type {
    export const ALTERNATIVE: Type = {
      literalPredicate: skos.altLabel,
      name: "alternative",
      skosXlPredicate: Maybe.of(skosxl.altLabel),
    };

    export const HIDDEN: Type = {
      literalPredicate: skos.hiddenLabel,
      name: "hidden",
      skosXlPredicate: Maybe.of(skosxl.hiddenLabel),
    };

    export const OTHER: Type = {
      literalPredicate: rdfs.label,
      name: "hidden",
      skosXlPredicate: Maybe.empty(),
    };

    export const PREFERRED: Type = {
      literalPredicate: skos.prefLabel,
      name: "preferred",
      skosXlPredicate: Maybe.of(skosxl.prefLabel),
    };
  }

  export const Types: readonly Type[] = [
    Type.PREFERRED,
    Type.ALTERNATIVE,
    Type.HIDDEN,
    Type.OTHER,
  ];
}
