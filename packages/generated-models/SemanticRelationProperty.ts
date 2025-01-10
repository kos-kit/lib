import { NamedNode } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import { iriToTranslationKey } from "./iriToTranslationKey.js";

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

  readonly identifier: NamedNode<
    | "http://www.w3.org/2004/02/skos/core#broader"
    | "http://www.w3.org/2004/02/skos/core#broaderTransitive"
    | "http://www.w3.org/2004/02/skos/core#broadMatch"
    | "http://www.w3.org/2004/02/skos/core#closeMatch"
    | "http://www.w3.org/2004/02/skos/core#exactMatch"
    | "http://www.w3.org/2004/02/skos/core#narrower"
    | "http://www.w3.org/2004/02/skos/core#narrowerTransitive"
    | "http://www.w3.org/2004/02/skos/core#narrowMatch"
    | "http://www.w3.org/2004/02/skos/core#related"
    | "http://www.w3.org/2004/02/skos/core#relatedMatch"
  >;
  readonly mapping: boolean;
  private readonly inverseIdentifier: Maybe<NamedNode>;

  private constructor({
    identifier,
    inverseIdentifier,
    mapping,
  }: {
    identifier: SemanticRelationProperty["identifier"];
    inverseIdentifier: SemanticRelationProperty["inverseIdentifier"];
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

  get translationKey(): string {
    return iriToTranslationKey(this.identifier);
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
