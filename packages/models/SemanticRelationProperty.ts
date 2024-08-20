import { NamedNode } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";

export class SemanticRelationProperty {
  private readonly inverseIdentifier: Maybe<NamedNode>;

  static readonly BROADER = new SemanticRelationProperty({
    identifier: skos.broader,
    inverseIdentifier: Maybe.of(skos.narrower),
    mapping: false,
  });
  static readonly BROADER_TRANSITIVE = new SemanticRelationProperty({
    identifier: skos.broaderTransitive,
    inverseIdentifier: Maybe.of(skos.narrowerTransitive),
    mapping: false,
  });
  static readonly BROAD_MATCH = new SemanticRelationProperty({
    identifier: skos.broadMatch,
    inverseIdentifier: Maybe.of(skos.narrowMatch),
    mapping: true,
  });
  static readonly CLOSE_MATCH = new SemanticRelationProperty({
    identifier: skos.closeMatch,
    inverseIdentifier: Maybe.empty(),
    mapping: true,
  });
  static readonly EXACT_MATCH = new SemanticRelationProperty({
    identifier: skos.exactMatch,
    inverseIdentifier: Maybe.empty(),
    mapping: true,
  });
  static readonly NARROWER = new SemanticRelationProperty({
    identifier: skos.narrower,
    inverseIdentifier: Maybe.of(skos.broader),
    mapping: false,
  });
  static readonly NARROWER_TRANSITIVE = new SemanticRelationProperty({
    identifier: skos.narrowerTransitive,
    inverseIdentifier: Maybe.of(skos.broaderTransitive),
    mapping: false,
  });
  static readonly NARROW_MATCH = new SemanticRelationProperty({
    identifier: skos.narrowMatch,
    inverseIdentifier: Maybe.of(skos.broadMatch),
    mapping: true,
  });
  static readonly RELATED = new SemanticRelationProperty({
    identifier: skos.related,
    inverseIdentifier: Maybe.empty(),
    mapping: false,
  });
  static readonly RELATED_MATCH = new SemanticRelationProperty({
    identifier: skos.relatedMatch,
    inverseIdentifier: Maybe.empty(),
    mapping: true,
  });

  readonly identifier: NamedNode;
  readonly mapping: boolean;
  readonly name: string;

  protected constructor({
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
    this.name = identifier.value.substring(skos[""].value.length);
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

// https://www.w3.org/TR/skos-reference/#L4160
export const semanticRelationProperties: readonly SemanticRelationProperty[] = [
  SemanticRelationProperty.BROADER,
  SemanticRelationProperty.BROADER_TRANSITIVE,
  SemanticRelationProperty.NARROWER,
  SemanticRelationProperty.NARROWER_TRANSITIVE,
  SemanticRelationProperty.RELATED,
  SemanticRelationProperty.BROAD_MATCH,
  SemanticRelationProperty.CLOSE_MATCH,
  SemanticRelationProperty.EXACT_MATCH,
  SemanticRelationProperty.NARROW_MATCH,
  SemanticRelationProperty.RELATED_MATCH,
];
