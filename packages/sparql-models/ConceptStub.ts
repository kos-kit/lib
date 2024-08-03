import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  noteProperties,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { skos } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import { ConstructQueryBuilder } from "./ConstructQueryBuilder.js";
import {
  GraphPattern,
  GraphPatternSubject,
  GraphPatternVariable,
} from "./GraphPattern.js";
import { Stub } from "./Stub.js";

export class ConceptStub<
  SparqlConceptT extends IConcept,
  SparqlConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
> extends Stub<SparqlConceptT, SparqlConceptSchemeT, LabelT, SparqlConceptT> {
  async resolve(): Promise<Maybe<SparqlConceptT>> {
    const conceptVariable: GraphPatternVariable = {
      termType: "Variable",
      value: "concept",
    };

    const dataset = await this.sparqlClient.query.construct(
      new ConstructQueryBuilder({
        includeLanguageTags: this.kos.includeLanguageTags,
      })
        .addGraphPatterns(
          ...this.conceptPropertyGraphPatterns({
            subject: conceptVariable,
            variablePrefix: conceptVariable.value,
          }),
        )
        .addValues(conceptVariable, this.identifier)
        .build(),
    );

    const resource = new Resource({ dataset, identifier: this.identifier });
    if (!resource.isInstanceOf(skos.Concept)) {
      console.warn("tried to resolve missing concept", this.identifier.value);
      return Maybe.empty();
    }

    return Maybe.of(
      new this.conceptConstructor({
        memModel: this.memModelFactory.createConcept(
          new Resource({ dataset, identifier }),
        ),
        modelFetcher: this,
        sparqlClient: this.sparqlClient,
      }),
    );
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
        value: `${variablePrefix}Notation`,
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
}
