import { NamedNode } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";

export class SemanticRelationProperty {
  private readonly inverseIdentifier: Maybe<NamedNode>;

  static readonly BROADER = new SemanticRelationProperty({
    identifier: skos.broader,
    inverseIdentifier: Maybe.of(skos.narrower),
    mapping: false,
    name: "broader",
  });
  static readonly BROADER_TRANSITIVE = new SemanticRelationProperty({
    identifier: skos.broaderTransitive,
    inverseIdentifier: Maybe.of(skos.narrowerTransitive),
    mapping: false,
    name: "broaderTransitive",
  });
  static readonly BROAD_MATCH = new SemanticRelationProperty({
    identifier: skos.broadMatch,
    inverseIdentifier: Maybe.of(skos.narrowMatch),
    mapping: true,
    name: "broadMatch",
  });
  static readonly CLOSE_MATCH = new SemanticRelationProperty({
    identifier: skos.closeMatch,
    inverseIdentifier: Maybe.empty(),
    mapping: true,
    name: "closeMatch",
  });
  static readonly EXACT_MATCH = new SemanticRelationProperty({
    identifier: skos.exactMatch,
    inverseIdentifier: Maybe.empty(),
    mapping: true,
    name: "exactMatch",
  });
  static readonly NARROWER = new SemanticRelationProperty({
    identifier: skos.narrower,
    inverseIdentifier: Maybe.of(skos.broader),
    mapping: false,
    name: "narrower",
  });
  static readonly NARROWER_TRANSITIVE = new SemanticRelationProperty({
    identifier: skos.narrowerTransitive,
    inverseIdentifier: Maybe.of(skos.broaderTransitive),
    mapping: false,
    name: "narrowerTransitive",
  });
  static readonly NARROW_MATCH = new SemanticRelationProperty({
    identifier: skos.narrowMatch,
    inverseIdentifier: Maybe.of(skos.broadMatch),
    mapping: true,
    name: "narrowMatch",
  });
  static readonly RELATED = new SemanticRelationProperty({
    identifier: skos.related,
    inverseIdentifier: Maybe.empty(),
    mapping: false,
    name: "related",
  });
  static readonly RELATED_MATCH = new SemanticRelationProperty({
    identifier: skos.relatedMatch,
    inverseIdentifier: Maybe.empty(),
    mapping: true,
    name: "relatedMatch",
  });

  readonly identifier: NamedNode;
  readonly mapping: boolean;
  readonly name: SemanticRelationProperty.Name;

  protected constructor({
    identifier,
    inverseIdentifier,
    mapping,
    name,
  }: {
    identifier: NamedNode;
    inverseIdentifier: Maybe<NamedNode>;
    mapping: boolean;
    name: SemanticRelationProperty.Name;
  }) {
    this.identifier = identifier;
    this.inverseIdentifier = inverseIdentifier;
    this.mapping = mapping;
    this.name = name;
  }

  get inverse(): Maybe<SemanticRelationProperty> {
    return this.inverseIdentifier.map(
      (inverseIdentifier) =>
        semanticRelationProperties.find((semanticRelationProperty) =>
          semanticRelationProperty.identifier.equals(inverseIdentifier),
        )!,
    );
  }
}

export namespace SemanticRelationProperty {
  export type Name =
    | "broader"
    | "broaderTransitive"
    | "broadMatch"
    | "closeMatch"
    | "exactMatch"
    | "narrower"
    | "narrowerTransitive"
    | "narrowMatch"
    | "related"
    | "relatedMatch";
}

// https://www.w3.org/TR/skos-reference/#L4160
export const semanticRelationProperties: readonly SemanticRelationProperty[] = [
  SemanticRelationProperty.BROADER,
  SemanticRelationProperty.BROADER_TRANSITIVE,
  SemanticRelationProperty.BROAD_MATCH,
  SemanticRelationProperty.CLOSE_MATCH,
  SemanticRelationProperty.EXACT_MATCH,
  SemanticRelationProperty.NARROWER,
  SemanticRelationProperty.NARROWER_TRANSITIVE,
  SemanticRelationProperty.NARROW_MATCH,
  SemanticRelationProperty.RELATED,
  SemanticRelationProperty.RELATED_MATCH,
];
