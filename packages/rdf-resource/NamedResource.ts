import { DatasetCore, NamedNode } from "@rdfjs/types";
import { Resource } from "./Resource";

export class NamedResource extends Resource {
  constructor({ dataset, iri }: { dataset: DatasetCore; iri: NamedNode }) {
    super({ dataset, identifier: iri });
  }

  get iri(): NamedNode {
    return this.identifier as NamedNode;
  }
}
