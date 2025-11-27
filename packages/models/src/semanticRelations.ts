import {
  Concept,
  PartialConcept,
  SemanticRelationProperty,
  semanticRelationProperties,
} from "./index.js";

export function semanticRelations(
  concept: Concept,
): readonly [SemanticRelationProperty, readonly PartialConcept[]][] {
  const getSemanticallyRelatedConcepts = (
    semanticRelationProperty: SemanticRelationProperty,
  ): readonly PartialConcept[] => {
    switch (semanticRelationProperty.identifier.value) {
      case "http://www.w3.org/2004/02/skos/core#broader":
        return concept.broader.partials;
      case "http://www.w3.org/2004/02/skos/core#broaderTransitive":
        return concept.broaderTransitive.partials;
      case "http://www.w3.org/2004/02/skos/core#broadMatch":
        return concept.broadMatch.partials;
      case "http://www.w3.org/2004/02/skos/core#closeMatch":
        return concept.closeMatch.partials;
      case "http://www.w3.org/2004/02/skos/core#exactMatch":
        return concept.exactMatch.partials;
      case "http://www.w3.org/2004/02/skos/core#narrower":
        return concept.narrower.partials;
      case "http://www.w3.org/2004/02/skos/core#narrowerTransitive":
        return concept.narrowerTransitive.partials;
      case "http://www.w3.org/2004/02/skos/core#narrowMatch":
        return concept.narrowMatch.partials;
      case "http://www.w3.org/2004/02/skos/core#related":
        return concept.related.partials;
      case "http://www.w3.org/2004/02/skos/core#relatedMatch":
        return concept.relatedMatch.partials;
    }
  };

  return semanticRelationProperties.flatMap((semanticRelationProperty) => {
    const conceptStubs = getSemanticallyRelatedConcepts(
      semanticRelationProperty,
    );
    if (conceptStubs.length > 0) {
      return [[semanticRelationProperty, conceptStubs]];
    }
    return [];
  });
}
