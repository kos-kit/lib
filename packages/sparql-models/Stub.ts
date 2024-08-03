import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
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
  ConceptT extends IConcept,
  ConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
  ModelT extends ConceptT | ConceptSchemeT,
> extends abc.Stub<ConceptT, ConceptSchemeT, LabelT, ModelT> {
  protected readonly modelFactory: (_: {
    dataset: DatasetCore;
    identifier: Identifier;
  }) => ModelT;
  protected readonly sparqlClient: SparqlClient;

  constructor({
    modelFactory,
    sparqlClient,
    ...superParameters
  }: Stub.Parameters<ConceptT, ConceptSchemeT, LabelT, ModelT>) {
    super(superParameters);
    this.modelFactory = modelFactory;
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
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
    ModelT extends ConceptT | ConceptSchemeT,
  > extends abc.Stub.Parameters<ConceptT, ConceptSchemeT, LabelT> {
    modelFactory: (_: {
      dataset: DatasetCore;
      identifier: Identifier;
    }) => ModelT;
    sparqlClient: SparqlClient;
  }
}
