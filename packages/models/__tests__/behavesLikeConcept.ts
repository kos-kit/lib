import { Concept, LanguageTag } from "..";
import { behavesLikeLabelsMixin } from "./behavesLikeLabelsMixin.js";

export const behavesLikeConcept = (
  lazyConcept: (includeLanguageTag: LanguageTag) => Promise<Concept>,
) => {
  behavesLikeLabelsMixin(lazyConcept);
};
