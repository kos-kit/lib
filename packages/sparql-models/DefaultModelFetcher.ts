import * as mem from "@kos-kit/mem-models";
import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  LanguageTagSet,
  noteProperties,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { isInstanceOf } from "@kos-kit/rdf-utils";
import { dc11, dcterms, rdf, skos, skosxl } from "@tpluscode/rdf-ns-builders";
import { ConstructQueryBuilder } from "./ConstructQueryBuilder.js";
import {
  GraphPattern,
  GraphPatternSubject,
  GraphPatternVariable,
} from "./GraphPattern.js";
import { LabeledModel } from "./LabeledModel.js";
import { ModelFetcher } from "./ModelFetcher.js";
import { SparqlClient } from "./SparqlClient.js";
import { Just, Maybe, Nothing } from "purify-ts";

export class DefaultModelFetcher<
  MemConceptT extends IConcept,
  MemConceptSchemeT extends IConceptScheme,
  MemLabelT extends ILabel,
  SparqlConceptT extends IConcept,
  SparqlConceptSchemeT extends IConceptScheme,
> implements ModelFetcher<SparqlConceptT, SparqlConceptSchemeT>
{
  private readonly conceptConstructor: new (
    parameters: LabeledModel.Parameters<
      MemConceptT,
      SparqlConceptT,
      SparqlConceptSchemeT
    >,
  ) => SparqlConceptT;
  private readonly conceptSchemeConstructor: new (
    parameters: LabeledModel.Parameters<
      MemConceptSchemeT,
      SparqlConceptT,
      SparqlConceptSchemeT
    >,
  ) => SparqlConceptSchemeT;
  private readonly includeLanguageTags: LanguageTagSet;
  private readonly memModelFactory: mem.ModelFactory<
    MemConceptT,
    MemConceptSchemeT,
    MemLabelT
  >;
  private readonly sparqlClient: SparqlClient;

  constructor({
    conceptConstructor,
    conceptSchemeConstructor,
    includeLanguageTags,
    memModelFactory,
    sparqlClient,
  }: {
    conceptConstructor: new (
      parameters: LabeledModel.Parameters<
        MemConceptT,
        SparqlConceptT,
        SparqlConceptSchemeT
      >,
    ) => SparqlConceptT;
    conceptSchemeConstructor: new (
      parameters: LabeledModel.Parameters<
        MemConceptSchemeT,
        SparqlConceptT,
        SparqlConceptSchemeT
      >,
    ) => SparqlConceptSchemeT;
    includeLanguageTags: LanguageTagSet;
    memModelFactory: mem.ModelFactory<
      MemConceptT,
      MemConceptSchemeT,
      MemLabelT
    >;
    sparqlClient: SparqlClient;
  }) {
    this.conceptConstructor = conceptConstructor;
    this.conceptSchemeConstructor = conceptSchemeConstructor;
    this.includeLanguageTags = includeLanguageTags;
    this.memModelFactory = memModelFactory;
    this.sparqlClient = sparqlClient;
  }

  async fetchConceptSchemesByIdentifiers(
    identifiers: readonly IConceptScheme.Identifier[],
  ): Promise<readonly Maybe<SparqlConceptSchemeT>[]> {
    const conceptSchemeVariable: GraphPatternVariable = {
      termType: "Variable",
      value: "conceptScheme",
    };
    const includeLanguageTags = this.includeLanguageTags;
    const dataset = await this.sparqlClient.query.construct(
      new ConstructQueryBuilder({
        includeLanguageTags,
      })
        .addGraphPatterns(
          ...this.conceptSchemePropertyGraphPatterns({
            subject: conceptSchemeVariable,
            variablePrefix: conceptSchemeVariable.value,
          }),
        )
        .addValues(conceptSchemeVariable, ...identifiers)
        .build(),
    );
    return identifiers.map((identifier) => {
      if (
        isInstanceOf({
          class_: skos.ConceptScheme,
          dataset,
          instance: identifier,
        })
      ) {
        return Just(
          new this.conceptSchemeConstructor({
            memModel: this.memModelFactory.createConceptScheme(
              new Resource({ dataset, identifier }),
            ),
            modelFetcher: this,
            sparqlClient: this.sparqlClient,
          }),
        );
      } else {
        console.warn("tried to fetch missing concept scheme", identifier.value);
        return Nothing;
      }
    });
  }

  async fetchConceptsByIdentifiers(
    identifiers: readonly IConcept.Identifier[],
  ): Promise<readonly Maybe<SparqlConceptT>[]> {
    const conceptVariable: GraphPatternVariable = {
      termType: "Variable",
      value: "concept",
    };
    const includeLanguageTags = this.includeLanguageTags;
    const dataset = await this.sparqlClient.query.construct(
      new ConstructQueryBuilder({
        includeLanguageTags,
      })
        .addGraphPatterns(
          ...this.conceptPropertyGraphPatterns({
            subject: conceptVariable,
            variablePrefix: conceptVariable.value,
          }),
        )
        .addValues(conceptVariable, ...identifiers)
        .build(),
    );
    return identifiers.map((identifier) => {
      if (
        isInstanceOf({
          class_: skos.Concept,
          dataset,
          instance: identifier,
        })
      ) {
        return Just(
          new this.conceptConstructor({
            memModel: this.memModelFactory.createConcept(
              new Resource({ dataset, identifier }),
            ),
            modelFetcher: this,
            sparqlClient: this.sparqlClient,
          }),
        );
      } else {
        console.warn("tried to fetch missing concept", identifier.value);
        return Nothing;
      }
    });
  }

  protected conceptPropertyGraphPatterns({
    subject,
    variablePrefix,
  }: {
    subject: GraphPatternSubject;
    variablePrefix: string;
  }): readonly GraphPattern[] {
    const graphPatterns: GraphPattern[] = [];

    graphPatterns.push({
      subject,
      predicate: skos.notation,
      object: {
        termType: "Variable",
        value: variablePrefix + "Notation",
      },
      optional: true,
    });

    for (const noteProperty of noteProperties) {
      graphPatterns.push({
        subject,
        predicate: noteProperty.identifier,
        object: {
          plainLiteral: true,
          termType: "Variable",
          value:
            variablePrefix +
            noteProperty.name[0].toUpperCase() +
            noteProperty.name.substring(1),
        },
        optional: true,
      });
    }

    return this.labeledModelPropertyGraphPatterns({
      subject,
      variablePrefix,
    }).concat(graphPatterns);
  }

  protected conceptSchemePropertyGraphPatterns(kwds: {
    subject: GraphPatternSubject;
    variablePrefix: string;
  }): readonly GraphPattern[] {
    return this.labeledModelPropertyGraphPatterns(kwds);
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
        value: variablePrefix + variableName + "Resource",
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
              value: variablePrefix + variableName + "LiteralForm",
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
          value: variablePrefix + "Type",
        },
        optional: true,
      },
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
}
