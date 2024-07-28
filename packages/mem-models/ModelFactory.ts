import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
} from "@kos-kit/models";
import { ConceptFactory } from "./ConceptFactory.js";
import { ConceptSchemeFactory } from "./ConceptSchemeFactory.js";
import { LabelFactory } from "./LabelFactory.js";

export interface ModelFactory<
  ConceptT extends IConcept,
  ConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
> extends ConceptFactory<ConceptT>,
    ConceptSchemeFactory<ConceptSchemeT>,
    LabelFactory<LabelT> {}
