import { Identifier, Label as ILabel } from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { Literal } from "@rdfjs/types";

export interface LabelFactory<LabelT extends ILabel> {
  createLabel(kwds: {
    literalForm: Literal;
    resource: Resource<Identifier>;
  }): LabelT;
}
