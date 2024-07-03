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
  createConcept(resource: Resource): ConceptT;
  createConceptScheme(resource: Resource): ConceptSchemeT;
  createLabel(kwds: { literalForm: Literal; resource: Resource }): LabelT;
}
