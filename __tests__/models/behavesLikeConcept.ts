import { Concept } from "../../src/models/Concept";
import { behavesLikeLabeledModel } from "./behavesLikeLabeledModel";

export const behavesLikeConcept = (lazyConcept: () => Promise<Concept>) => {
  behavesLikeLabeledModel(lazyConcept);
};
