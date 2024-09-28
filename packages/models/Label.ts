import { Literal, NamedNode } from "@rdfjs/types";
import { rdfs, skos, skosxl } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import { Equatable } from "purify-ts-helpers";

export interface Label extends Equatable<Label> {
  readonly literalForm: Literal;
  readonly type: Label.Type;
}

export namespace Label {
  export interface Type extends Equatable<Type> {
    readonly literalProperty: NamedNode;
    readonly skosXlProperty: Maybe<NamedNode>;
  }

  export namespace Type {
    function equals(
      this: Label.Type,
      other: Label.Type,
    ): Equatable.EqualsResult {
      return Equatable.propertyEquals(this, other, "literalProperty");
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
