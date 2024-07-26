import { behavesLikeLabelsMixin } from "./behavesLikeLabelsMixin.js";
import { Concept, LanguageTag } from "..";

export const behavesLikeConcept = (
  lazyConcept: (includeLanguageTag: LanguageTag) => Promise<Concept>,
) => {
  behavesLikeLabelsMixin(lazyConcept);
};
