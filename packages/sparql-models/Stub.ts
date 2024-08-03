import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Kos as IKos,
  Label as ILabel,
  NamedModel as INamedModel,
  Identifier,
  abc,
} from "@kos-kit/models";
import { DatasetCore } from "@rdfjs/types";
import { dc11, dcterms, rdf, skos, skosxl } from "@tpluscode/rdf-ns-builders";
import {
  GraphPattern,
  GraphPatternSubject,
  GraphPatternVariable,
} from "./GraphPattern.js";
import { SparqlClient } from "./SparqlClient.js";

export abstract class Stub<
  SparqlConceptT extends IConcept,
  SparqlConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
  ModelT extends SparqlConceptT | SparqlConceptSchemeT,
> extends abc.Stub<SparqlConceptT, SparqlConceptSchemeT, LabelT, ModelT> {
  protected readonly memModelConstructor: {
    dataset: DatasetCore;
    identifier: Identifier;
    kos: abc.Kos<SparqlConceptT, SparqlConceptSchemeT, LabelT>;
  };
  protected readonly sparqlClient: SparqlClient;

  constructor({
    sparqlClient,
    ...superParameters
  }: Stub.Parameters<SparqlConceptT, SparqlConceptSchemeT, LabelT>) {
    super(superParameters);
    this.sparqlClient = sparqlClient;
  }

  protected labeledModelPropertyGraphPatterns({
    subject,
    variablePrefix,
  }: {
    subject: GraphPatternSubject;
    variablePrefix: string;
  }): readonly GraphPattern[] {
    const graphPatterns: GraphPattern[] = [];
    for (const { skosPredicate, skosxlPredicate, variableName } of [
      {
        skosPredicate: skos.altLabel,
        skosxlPredicate: skosxl.altLabel,
        variableName: "AltLabel",
      },
      {
        skosPredicate: skos.hiddenLabel,
        skosxlPredicate: skosxl.hiddenLabel,
        variableName: "HiddenLabel",
      },
      {
        skosPredicate: skos.prefLabel,
        skosxlPredicate: skosxl.prefLabel,
        variableName: "PrefLabel",
      },
    ]) {
      graphPatterns.push({
        subject,
        predicate: skosPredicate,
        object: {
          plainLiteral: true,
          termType: "Variable",
          value: variablePrefix + variableName,
        },
        optional: true,
      });

      const skosxlLabelVariable: GraphPatternVariable = {
        termType: "Variable",
        value: `${variablePrefix + variableName}Resource`,
      };
      graphPatterns.push({
        subject,
        predicate: skosxlPredicate,
        object: skosxlLabelVariable,
        optional: true,
        subGraphPatterns: this.modelPropertyGraphPatterns({
          subject: skosxlLabelVariable,
          variablePrefix: skosxlLabelVariable.value,
        }).concat([
          {
            subject: skosxlLabelVariable,
            predicate: skosxl.literalForm,
            object: {
              termType: "Variable",
              value: `${variablePrefix + variableName}LiteralForm`,
            },
            optional: false,
          },
        ]),
      });
    }

    return this.modelPropertyGraphPatterns({ subject, variablePrefix }).concat(
      graphPatterns,
    );
  }

  protected modelPropertyGraphPatterns({
    subject,
    variablePrefix,
  }: {
    subject: GraphPatternSubject;
    variablePrefix: string;
  }): readonly GraphPattern[] {
    return [
      {
        subject,
        predicate: rdf.type,
        object: {
          termType: "Variable",
          value: `${variablePrefix}Type`,
        },
        optional: true,
      },
      {
        subject,
        predicate: dcterms.license,
        object: {
          termType: "Variable",
          value: `${variablePrefix}License`,
        },
        optional: true,
      },
      {
        subject,
        predicate: dcterms.modified,
        object: { termType: "Variable", value: `${variablePrefix}Modified` },
        optional: true,
      },
      {
        subject,
        predicate: dc11.rights,
        object: {
          termType: "Variable",
          plainLiteral: true,
          value: `${variablePrefix}DcRights`,
        },
        optional: true,
      },
      {
        subject,
        predicate: dcterms.rights,
        object: {
          termType: "Variable",
          plainLiteral: true,
          value: `${variablePrefix}DctermsRights`,
        },
        optional: true,
      },
      {
        subject,
        predicate: dcterms.rightsHolder,
        object: {
          termType: "Variable",
          plainLiteral: true,
          value: `${variablePrefix}RightsHolder`,
        },
        optional: true,
      },
    ];
  }
}

export namespace Stub {
  export interface Parameters<
    SparqlConceptT extends IConcept,
    SparqlConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
  > extends abc.Stub.Parameters<SparqlConceptT, SparqlConceptSchemeT, LabelT> {
    sparqlClient: SparqlClient;
  }
}
