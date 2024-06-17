import { Model as MemModel } from "@kos-kit/mem-models";
import { Model as IModel } from "@kos-kit/models";
import { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { GraphPattern, GraphPatternSubject } from "./GraphPattern";
import { Kos } from "./Kos";
import { dc11, dcterms } from "@tpluscode/rdf-ns-builders";

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
  protected readonly kos: Kos;
  protected readonly memModel: MemModelT;

  constructor({ kos, memModel }: { kos: Kos; memModel: MemModelT }) {
    this.kos = kos;
    this.memModel = memModel;
  }

  get identifier(): BlankNode | NamedNode {
    return this.memModel.identifier;
  }

  get license(): Literal | NamedNode | null {
    return this.memModel.license;
  }

  get modified(): Literal | null {
    return this.memModel.modified;
  }

  static propertyGraphPatterns({
    subject,
    variablePrefix,
  }: {
    subject: GraphPatternSubject;
    variablePrefix: string;
  }): readonly GraphPattern[] {
    return [
      {
        subject,
        predicate: dcterms.license,
        object: {
          termType: "Variable",
          value: variablePrefix + "License",
        },
        optional: true,
      },
      {
        subject,
        predicate: dcterms.modified,
        object: { termType: "Variable", value: variablePrefix + "Modified" },
        optional: true,
      },
      {
        subject,
        predicate: dc11.rights,
        object: {
          termType: "Variable",
          plainLiteral: true,
          value: variablePrefix + "DcRights",
        },
        optional: true,
      },
      {
        subject,
        predicate: dcterms.rights,
        object: {
          termType: "Variable",
          plainLiteral: true,
          value: variablePrefix + "DctermsRights",
        },
        optional: true,
      },
      {
        subject,
        predicate: dcterms.rightsHolder,
        object: {
          termType: "Variable",
          plainLiteral: true,
          value: variablePrefix + "RightsHolder",
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

  protected get sparqlClient() {
    return this.kos.sparqlClient;
  }
}
