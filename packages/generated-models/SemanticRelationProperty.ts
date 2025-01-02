import { NamedNode } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";

export class SemanticRelationProperty {
  static readonly BROADER = new SemanticRelationProperty({
    inverseIdentifier: Maybe.of(skos.narrower),
    mapping: false,
    identifier: skos.broader,
  });
  static readonly BROADER_TRANSITIVE = new SemanticRelationProperty({
    inverseIdentifier: Maybe.of(skos.narrowerTransitive),
    mapping: false,
    identifier: skos.broaderTransitive,
  });
  static readonly BROAD_MATCH = new SemanticRelationProperty({
    inverseIdentifier: Maybe.of(skos.narrowMatch),
    mapping: true,
    identifier: skos.broadMatch,
  });
  static readonly CLOSE_MATCH = new SemanticRelationProperty({
    inverseIdentifier: Maybe.empty(),
    mapping: true,
    identifier: skos.closeMatch,
  });
  static readonly EXACT_MATCH = new SemanticRelationProperty({
    inverseIdentifier: Maybe.empty(),
    mapping: true,
    identifier: skos.exactMatch,
  });
  static readonly NARROWER = new SemanticRelationProperty({
    inverseIdentifier: Maybe.of(skos.broader),
    mapping: false,
    identifier: skos.narrower,
  });
  static readonly NARROWER_TRANSITIVE = new SemanticRelationProperty({
    inverseIdentifier: Maybe.of(skos.broaderTransitive),
    mapping: false,
    identifier: skos.narrowerTransitive,
  });
  static readonly NARROW_MATCH = new SemanticRelationProperty({
    inverseIdentifier: Maybe.of(skos.broadMatch),
    mapping: true,
    identifier: skos.narrowMatch,
  });
  static readonly RELATED = new SemanticRelationProperty({
    inverseIdentifier: Maybe.empty(),
    mapping: false,
    identifier: skos.related,
  });
  static readonly RELATED_MATCH = new SemanticRelationProperty({
    inverseIdentifier: Maybe.empty(),
    mapping: true,
    identifier: skos.relatedMatch,
  });
  readonly identifier: NamedNode;
  readonly mapping: boolean;
  private readonly inverseIdentifier: Maybe<NamedNode>;

  private constructor({
    identifier,
    inverseIdentifier,
    mapping,
  }: {
    identifier: NamedNode;
    inverseIdentifier: Maybe<NamedNode>;
    mapping: boolean;
  }) {
    this.identifier = identifier;
    this.inverseIdentifier = inverseIdentifier;
    this.mapping = mapping;
  }

  get inverse(): Maybe<SemanticRelationProperty> {
    return this.inverseIdentifier.map(
      (inverseIdentifier) =>
        semanticRelationProperties.find((property) =>
          property.identifier.equals(inverseIdentifier),
        )!,
    );
  }

  equals(other: SemanticRelationProperty): boolean {
    return this.identifier.equals(other.identifier);
  }
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
