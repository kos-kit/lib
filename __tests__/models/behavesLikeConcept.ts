import { Concept } from "../../src/models/Concept";
import { LanguageTag } from "../../src/models/LanguageTag";
import { behavesLikeLabeledModel } from "./behavesLikeLabeledModel";

export const behavesLikeConcept = (
  lazyConcept: (includeLanguageTag: LanguageTag) => Promise<Concept>,
) => {
  behavesLikeLabeledModel(lazyConcept);
};
