import { Label as ILabel, Identifier, LiteralLabel } from "@kos-kit/models";
import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { ConceptSchemeStub } from "./ConceptSchemeStub.js";
import { ConceptStub } from "./ConceptStub.js";
import { Kos } from "./Kos.js";
import { Label } from "./Label.js";
import { labelsByType } from "./labelsByType.js";

class DefaultConcept extends Concept<
  DefaultConcept,
  DefaultConceptScheme,
  DefaultLabel
> {
  protected override labelsByType(type: ILabel.Type): readonly ILabel[] {
    return labelsByType({
      includeLanguageTags: this.kos.includeLanguageTags,
      resource: this.resource,
      type,
    }).map(({ label, literalForm }) => {
      switch (label.termType) {
        case "Literal":
          return new LiteralLabel({ literalForm, type });
        case "NamedNode":
          return new Label({ identifier: label, literalForm, type });
      }
    });
  }
}

class DefaultConceptScheme extends ConceptScheme<
  DefaultConcept,
  DefaultConceptScheme,
  DefaultLabel
> {
  protected override labelsByType(type: ILabel.Type): readonly ILabel[] {
    return labelsByType({
      includeLanguageTags: this.kos.includeLanguageTags,
      resource: this.resource,
      type,
    }).map(({ label, literalForm }) => {
      switch (label.termType) {
        case "Literal":
          return new LiteralLabel({ literalForm, type });
        case "NamedNode":
          return new Label({ identifier: label, literalForm, type });
      }
    });
  }
}

type DefaultLabel = Label;

export class DefaultKos extends Kos<
  DefaultConcept,
  DefaultConceptScheme,
  DefaultLabel
> {
  conceptByIdentifier(
    identifier: Identifier,
  ): ConceptStub<DefaultConcept, DefaultConceptScheme, DefaultLabel> {
    return new ConceptStub({
      dataset: this.dataset,
      identifier,
      kos: this,
      modelConstructor: DefaultConcept,
    });
  }

  conceptSchemeByIdentifier(
    identifier: Identifier,
  ): ConceptSchemeStub<DefaultConcept, DefaultConceptScheme, DefaultLabel> {
    return new ConceptSchemeStub({
      dataset: this.dataset,
      identifier,
      kos: this,
      modelConstructor: DefaultConceptScheme,
    });
  }
}
