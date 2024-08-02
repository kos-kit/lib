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
    readonly skosXlPredicate: Maybe<NamedNode>;
    readonly type: "alternative" | "hidden" | "other" | "preferred";
  }

  export namespace Type {
    export const ALTERNATIVE: Type = {
      literalPredicate: skos.altLabel,
      skosXlPredicate: Maybe.of(skosxl.altLabel),
      type: "alternative",
    };

    export const HIDDEN: Type = {
      literalPredicate: skos.hiddenLabel,
      skosXlPredicate: Maybe.of(skosxl.hiddenLabel),
      type: "hidden",
    };

    export const OTHER: Type = {
      literalPredicate: rdfs.label,
      skosXlPredicate: Maybe.empty(),
      type: "hidden",
    };

    export const PREFERRED: Type = {
      literalPredicate: skos.prefLabel,
      skosXlPredicate: Maybe.of(skosxl.prefLabel),
      type: "preferred",
    };
  }
}
