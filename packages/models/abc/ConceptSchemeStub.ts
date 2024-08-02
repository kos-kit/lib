import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
} from "@kos-kit/models";
import { Stub } from "./Stub.js";

export abstract class ConceptSchemeStub<
  ConceptT extends IConcept,
  ConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
> extends Stub<ConceptT, ConceptSchemeT, LabelT, ConceptSchemeT> {}
