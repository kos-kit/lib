import { behavesLikeLabeledModel } from "./behavesLikeLabeledModel";
import { Concept, LanguageTag } from "..";

export const behavesLikeConcept = (
  lazyConcept: (includeLanguageTag: LanguageTag) => Promise<Concept>,
) => {
  behavesLikeLabeledModel(lazyConcept);
};
