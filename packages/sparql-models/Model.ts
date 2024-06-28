import { Model as IModel } from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { Literal, NamedNode } from "@rdfjs/types";
import { Option } from "fp-ts/Option";

/**
 * Abstract base class for SPARQL-backed models.
 *
 * The SPARQL-backed models are implemented in the spirit of Labeled Property Graphs:
 * - "properties" such as labels (skos:prefLabel, et al.), rights, et al. should be available as instance members in memory / without asynchronous calls.
 * - "relationships" such as broader concepts, in-concept scheme, et al. should be retrieved via asynchronous calls.
 *
 * That means that creating a new instance of a model, such as a Concept, entails retrieving all of its instance "properties" first, usually via a SPARQL CONSTRUCT query.
 *
 * The line between "properties" and "relationships" can be intentionally blurred. For example:
 * - Not all literals attached to an instance have to be "properties". Literals that would take up significant space (long strings, large arrays, etc.) can be retrieved via asynchronous methods instead.
 * - Related RDF resources such as skosxl:Label instances can be retrieved as "properties".
 */
export abstract class Model<
  MemModelT extends IModel & { identifier: Resource.Identifier },
> implements IModel
{
  protected readonly memModel: MemModelT;

  constructor({ memModel }: Model.Parameters<MemModelT>) {
    this.memModel = memModel;
  }

  get identifier(): Resource.Identifier {
    return this.memModel.identifier;
  }

  get license(): Option<Literal | NamedNode> {
    return this.memModel.license;
  }

  get modified(): Option<Literal> {
    return this.memModel.modified;
  }

  get rights(): Option<Literal> {
    return this.memModel.rights;
  }

  get rightsHolder(): Option<Literal> {
    return this.memModel.rightsHolder;
  }
}

export namespace Model {
  export interface Parameters<MemModelT extends IModel> {
    memModel: MemModelT;
  }
}
