import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { Literal } from "@rdfjs/types";

export interface ModelFactory<
  ConceptT extends IConcept,
  ConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
> {
  createConcept(identifier: Resource.Identifier): ConceptT;
  createConceptScheme(identifier: Resource.Identifier): ConceptSchemeT;
  createLabel(kwds: {
    identifier: Resource.Identifier;
    literalForm: Literal;
  }): LabelT;
}
