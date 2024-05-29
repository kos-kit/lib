import { Model as RdfJsModel } from "../rdfjs/Model";
import { DatasetCore, Literal, NamedNode } from "@rdfjs/types";
import { Model as IModel } from "../Model";
import { Identifier } from "../Identifier";
import { SparqlClient } from "../../SparqlClient";

/**
 * Abstract base class for SPARQL-backed models.
 *
 * Most methods are delegated to an RDF/JS-backed model after populating it with a SPARQL construct query.
 */
export abstract class Model<RdfJsModelT extends RdfJsModel> implements IModel {
  readonly identifier: Identifier;
  protected readonly sparqlClient: SparqlClient;
  private _rdfJsModel: RdfJsModelT | null = null;

  constructor({
    identifier,
    sparqlClient,
  }: {
    identifier: Identifier;
    sparqlClient: SparqlClient;
  }) {
    this.identifier = identifier;
    this.sparqlClient = sparqlClient;
  }

  protected abstract createRdfJsModel(dataset: DatasetCore): RdfJsModelT;

  protected async getOrCreateRdfJsModel(): Promise<RdfJsModelT> {
    if (this._rdfJsModel !== null) {
      return this._rdfJsModel;
    }

    this._rdfJsModel = this.createRdfJsModel(
      await this.sparqlClient.query.construct(this.rdfJsDatasetQueryString),
    );
    return this._rdfJsModel;
  }

  async license(
    languageTag: string,
  ): Promise<Literal | NamedNode<string> | null> {
    return (await this.getOrCreateRdfJsModel()).license(languageTag);
  }

  async modified(): Promise<Literal | null> {
    return (await this.getOrCreateRdfJsModel()).modified();
  }

  protected get rdfJsDatasetQueryString(): string {
    return `
CONSTRUCT WHERE {
  <${this.identifier.value}> ?p ?o .
}
`;
  }

  async rights(languageTag: string): Promise<Literal | null> {
    return (await this.getOrCreateRdfJsModel()).rights(languageTag);
  }

  async rightsHolder(languageTag: string): Promise<Literal | null> {
    return (await this.getOrCreateRdfJsModel()).rightsHolder(languageTag);
  }
}
