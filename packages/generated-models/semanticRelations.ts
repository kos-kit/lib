import {
  Concept,
  ConceptStub,
  SemanticRelationProperty,
  semanticRelationProperties,
} from "./index.js";

export function semanticRelations(
  concept: Concept,
): readonly [SemanticRelationProperty, readonly ConceptStub[]][] {
  const getSemanticallyRelatedConceptStubs = (
    semanticRelationProperty: SemanticRelationProperty,
  ): readonly ConceptStub[] => {
    switch (semanticRelationProperty.identifier.value) {
      case "http://www.w3.org/2004/02/skos/core#broader":
        return concept.broader;
      case "http://www.w3.org/2004/02/skos/core#broaderTransitive":
        return concept.broaderTransitive;
      case "http://www.w3.org/2004/02/skos/core#broadMatch":
        return concept.broadMatch;
      case "http://www.w3.org/2004/02/skos/core#closeMatch":
        return concept.closeMatch;
      case "http://www.w3.org/2004/02/skos/core#exactMatch":
        return concept.exactMatch;
      case "http://www.w3.org/2004/02/skos/core#narrower":
        return concept.narrower;
      case "http://www.w3.org/2004/02/skos/core#narrowerTransitive":
        return concept.narrowerTransitive;
      case "http://www.w3.org/2004/02/skos/core#narrowMatch":
        return concept.narrowMatch;
      case "http://www.w3.org/2004/02/skos/core#related":
        return concept.related;
      case "http://www.w3.org/2004/02/skos/core#relatedMatch":
        return concept.relatedMatch;
    }
  };

  return semanticRelationProperties.flatMap((semanticRelationProperty) => {
    const conceptStubs = getSemanticallyRelatedConceptStubs(
      semanticRelationProperty,
    );
    if (conceptStubs.length > 0) {
      return [[semanticRelationProperty, conceptStubs]];
    }
    return [];
  });
}