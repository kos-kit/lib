import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
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

export class ConceptSchemeStub<
  SparqlConceptT extends IConcept,
  SparqlConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
> extends Stub<
  SparqlConceptT,
  SparqlConceptSchemeT,
  LabelT,
  SparqlConceptSchemeT
> {
  async resolve(): Promise<Maybe<SparqlConceptSchemeT>> {
    const conceptSchemeVariable: GraphPatternVariable = {
      termType: "Variable",
      value: "conceptScheme",
    };

    const dataset = await this.sparqlClient.query.construct(
      new ConstructQueryBuilder({
        includeLanguageTags: this.kos.includeLanguageTags,
      })
        .addGraphPatterns(
          ...this.conceptSchemePropertyGraphPatterns({
            subject: conceptSchemeVariable,
            variablePrefix: conceptSchemeVariable.value,
          }),
        )
        .addValues(conceptSchemeVariable, this.identifier)
        .build(),
    );

    const resource = new Resource({ dataset, identifier: this.identifier });
    if (!resource.isInstanceOf(skos.ConceptScheme)) {
      console.warn(
        "tried to resolve missing concept scheme",
        this.identifier.value,
      );
      return Maybe.empty();
    }

    return Maybe.of(
      new this.conceptSchemeConstructor({
        memModel: this.memModelFactory.createConceptScheme(
          new Resource({ dataset, identifier }),
        ),
        modelFetcher: this,
        sparqlClient: this.sparqlClient,
      }),
    );
  }

  protected conceptSchemePropertyGraphPatterns(kwds: {
    subject: GraphPatternSubject;
    variablePrefix: string;
  }): readonly GraphPattern[] {
    return this.labeledModelPropertyGraphPatterns(kwds);
  }
}
