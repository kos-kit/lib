import { Model as MemModel } from "../mem/Model";
import { Literal, NamedNode } from "@rdfjs/types";
import { Model as IModel } from "../Model";
import { Identifier } from "../Identifier";
import SparqlClient from "sparql-http-client/ParsingClient";
import { LanguageTagSet } from "../LanguageTagSet";

/**
 * Abstract base class for SPARQL-backed models.
 *
 * Most methods are delegated to a memory-backed model after populating it with a SPARQL construct query.
 */
export abstract class Model<MemModelT extends MemModel> implements IModel {
  protected readonly includeLanguageTags: LanguageTagSet;
  protected readonly memModel: MemModelT;
  protected readonly sparqlClient: SparqlClient;

  constructor({
    includeLanguageTags,
    memModel,
    sparqlClient,
  }: {
    identifier: Identifier;
    includeLanguageTags: LanguageTagSet;
    memModel: MemModelT;
    sparqlClient: SparqlClient;
  }) {
    this.includeLanguageTags = includeLanguageTags;
    this.memModel = memModel;
    this.sparqlClient = sparqlClient;
  }

  get identifier(): Identifier {
    return this.memModel.identifier;
  }

  get license(): Literal | NamedNode | null {
    return this.memModel.license;
  }

  get modified(): Literal | null {
    return this.memModel.modified;
  }

  get rights(): Literal | null {
    return this.memModel.rights;
  }

  get rightsHolder(): Literal | null {
    return this.memModel.rightsHolder;
  }
}
