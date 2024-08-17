import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  Identifier,
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
  ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
  ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
  LabelT extends ILabel,
> extends Stub<ConceptT, ConceptSchemeT, LabelT, ConceptT> {
  async resolve(): Promise<Maybe<ConceptT>> {
    const conceptVariable: GraphPatternVariable = {
      termType: "Variable",
      value: "concept",
    };

    const dataset = await this.sparqlQueryClient.queryDataset(
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
      this.logger.warn(
        "%s is missing or not an instance of skos.Concept, unable to resolve",
        Identifier.toString(this.identifier),
      );
      return Maybe.empty();
    }

    return Maybe.of(
      this.modelFactory({
        dataset,
        identifier: this.identifier,
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
