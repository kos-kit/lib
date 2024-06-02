import { Model as MemModel } from "../mem/Model";
import { Literal, NamedNode } from "@rdfjs/types";
import { Model as IModel } from "../Model";
import { Identifier } from "../Identifier";
import SparqlClient from "sparql-http-client/ParsingClient";
import { LanguageTagSet } from "../LanguageTagSet";
import { dc11, dcterms } from "../../vocabularies";
import { GraphPattern, GraphPatternSubject } from "./GraphPattern";

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

  static propertyGraphPatterns(
    subject: GraphPatternSubject,
  ): readonly GraphPattern[] {
    return [
      {
        subject,
        predicate: dcterms.license,
        object: { termType: "Variable", plainLiteral: true, value: "license" },
        optional: true,
      },
      {
        subject,
        predicate: dcterms.modified,
        object: { termType: "Variable", value: "modified" },
        optional: true,
      },
      {
        subject,
        predicate: dc11.rights,
        object: { termType: "Variable", plainLiteral: true, value: "rights" },
        optional: true,
      },
      {
        subject,
        predicate: dcterms.rights,
        object: { termType: "Variable", plainLiteral: true, value: "rights" },
        optional: true,
      },
      {
        subject,
        predicate: dcterms.rightsHolder,
        object: {
          termType: "Variable",
          plainLiteral: true,
          value: "rightsHolder",
        },
        optional: true,
      },
    ];
  }

  get rights(): Literal | null {
    return this.memModel.rights;
  }

  get rightsHolder(): Literal | null {
    return this.memModel.rightsHolder;
  }
}
