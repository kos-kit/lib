import { NamedNode } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";

export namespace SemanticRelation {
  export class Type {
    static readonly BROADER = new Type({
      inverseIdentifier: Maybe.of(skos.narrower),
      mapping: false,
      skosProperty: skos.broader,
    });
    static readonly BROADER_TRANSITIVE = new Type({
      inverseIdentifier: Maybe.of(skos.narrowerTransitive),
      mapping: false,
      skosProperty: skos.broaderTransitive,
    });
    static readonly BROAD_MATCH = new Type({
      inverseIdentifier: Maybe.of(skos.narrowMatch),
      mapping: true,
      skosProperty: skos.broadMatch,
    });
    static readonly CLOSE_MATCH = new Type({
      inverseIdentifier: Maybe.empty(),
      mapping: true,
      skosProperty: skos.closeMatch,
    });
    static readonly EXACT_MATCH = new Type({
      inverseIdentifier: Maybe.empty(),
      mapping: true,
      skosProperty: skos.exactMatch,
    });
    static readonly NARROWER = new Type({
      inverseIdentifier: Maybe.of(skos.broader),
      mapping: false,
      skosProperty: skos.narrower,
    });
    static readonly NARROWER_TRANSITIVE = new Type({
      inverseIdentifier: Maybe.of(skos.broaderTransitive),
      mapping: false,
      skosProperty: skos.narrowerTransitive,
    });
    static readonly NARROW_MATCH = new Type({
      inverseIdentifier: Maybe.of(skos.broadMatch),
      mapping: true,
      skosProperty: skos.narrowMatch,
    });
    static readonly RELATED = new Type({
      inverseIdentifier: Maybe.empty(),
      mapping: false,
      skosProperty: skos.related,
    });
    static readonly RELATED_MATCH = new Type({
      inverseIdentifier: Maybe.empty(),
      mapping: true,
      skosProperty: skos.relatedMatch,
    });
    readonly mapping: boolean;
    readonly property: NamedNode;
    private readonly inverseIdentifier: Maybe<NamedNode>;

    private constructor({
      inverseIdentifier,
      mapping,
      skosProperty,
    }: {
      skosProperty: NamedNode;
      inverseIdentifier: Maybe<NamedNode>;
      mapping: boolean;
    }) {
      this.property = skosProperty;
      this.inverseIdentifier = inverseIdentifier;
      this.mapping = mapping;
    }

    get inverse(): Maybe<Type> {
      return this.inverseIdentifier.map(
        (inverseIdentifier) =>
          Types.find((type) => type.property.equals(inverseIdentifier))!,
      );
    }

    equals(other: SemanticRelation.Type): boolean {
      return this.property.equals(other.property);
    }
  }

  // https://www.w3.org/TR/skos-reference/#L4160
  export const Types: readonly Type[] = [
    Type.BROADER,
    Type.BROADER_TRANSITIVE,
    Type.BROAD_MATCH,
    Type.CLOSE_MATCH,
    Type.EXACT_MATCH,
    Type.NARROWER,
    Type.NARROWER_TRANSITIVE,
    Type.NARROW_MATCH,
    Type.RELATED,
    Type.RELATED_MATCH,
  ];
}
