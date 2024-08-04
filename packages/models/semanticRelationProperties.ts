import { Maybe } from "purify-ts";
import { MappingProperty } from "./MappingProperty.js";
import { SemanticRelationProperty } from "./SemanticRelationProperty.js";

export const mappingProperties: readonly MappingProperty[] = [
  MappingProperty.BROAD_MATCH,
  MappingProperty.CLOSE_MATCH,
  MappingProperty.EXACT_MATCH,
  MappingProperty.NARROW_MATCH,
  MappingProperty.RELATED_MATCH,
];

// https://www.w3.org/TR/skos-reference/#L4160
export const semanticRelationProperties: readonly SemanticRelationProperty[] = [
  SemanticRelationProperty.BROADER,
  SemanticRelationProperty.BROADER_TRANSITIVE,
  SemanticRelationProperty.NARROWER,
  SemanticRelationProperty.NARROWER_TRANSITIVE,
  SemanticRelationProperty.RELATED,
].concat(mappingProperties);

export function inverseSemanticRelationProperty(
  semanticRelationProperty: SemanticRelationProperty,
): Maybe<SemanticRelationProperty> {
  return semanticRelationProperty.inverseIdentifier.map(
    (inverseIdentifier) =>
      semanticRelationProperties.find((semanticRelationProperty) =>
        semanticRelationProperty.identifier.equals(inverseIdentifier),
      )!,
  );
}

export const semanticRelationPropertiesByName =
  semanticRelationProperties.reduce<Record<string, SemanticRelationProperty>>(
    (map, semanticRelationProperty) => {
      map[semanticRelationProperty.name] = semanticRelationProperty;
      return map;
    },
    {},
  );
