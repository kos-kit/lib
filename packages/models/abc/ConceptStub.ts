import { Concept as IConcept } from "../Concept.js";
import { ConceptScheme as IConceptScheme } from "../ConceptScheme.js";
import { Label as ILabel } from "../Label.js";
import { Stub } from "./Stub.js";

export type ConceptStub<
  ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
  ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
  LabelT extends ILabel,
> = Stub<ConceptT, ConceptSchemeT, LabelT, ConceptT>;
