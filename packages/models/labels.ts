import { Literal } from "@rdfjs/types";
import type * as rdfjs from "@rdfjs/types";
import { sha256 } from "js-sha256";
import { DataFactory as dataFactory } from "n3";
import { Maybe, NonEmptyList } from "purify-ts";
import { Identifier, Label, LabelStub } from "./index.js";

function literalLabel(literal: Literal): Label {
  const literalHash = sha256.create();
  literalHash.update(literal.datatype.value);
  if (literal.language.length > 0) {
    literalHash.update(literal.language);
  }
  literalHash.update(literal.value);
  return {
    identifier: dataFactory.namedNode(`urn:literal:${literalHash.hex()}`),
    literalForm: NonEmptyList([literal]),
    type: "Label",
  };
}

class Labels {
  readonly alternative: readonly Label[];
  readonly hidden: readonly Label[];
  readonly preferred: Maybe<Label>;
  private readonly subject: Identifier;

  constructor(kosResource: {
    readonly altLabel?: readonly rdfjs.Literal[];
    readonly altLabelXl?: readonly Label[];
    readonly hiddenLabel?: readonly rdfjs.Literal[];
    readonly hiddenLabelXl?: readonly Label[];
    readonly identifier: Identifier;
    readonly prefLabel: readonly rdfjs.Literal[];
    readonly prefLabelXl: readonly (Label | LabelStub)[];
  }) {
    const alternativeOrHiddenLabels = (
      skosLabels?: readonly Literal[],
      skosXlLabels?: readonly Label[],
    ): readonly Label[] => {
      const result: Label[] = [];

      if (skosLabels) {
        for (const skosLabel of skosLabels) {
          result.push(literalLabel(skosLabel));
        }
      }

      if (skosXlLabels) {
        for (const skosXlLabel of skosXlLabels) {
          result.push(skosXlLabel);
        }
      }

      return result;
    };

    const prefLabel = (): Maybe<Label> => {
      for (const skosLabel of kosResource.prefLabel) {
        return Maybe.of(literalLabel(skosLabel));
      }

      for (const skosXlLabel of kosResource.prefLabelXl) {
        switch (skosXlLabel.type) {
          case "Label":
            return Maybe.of(skosXlLabel);
          case "LabelStub":
            return Maybe.of({
              identifier: skosXlLabel.identifier,
              literalForm: skosXlLabel.literalForm,
              type: "Label",
            });
        }
      }

      return Maybe.empty();
    };

    this.alternative = alternativeOrHiddenLabels(
      kosResource.altLabel,
      kosResource.altLabelXl,
    );
    this.hidden = alternativeOrHiddenLabels(
      kosResource.hiddenLabel,
      kosResource.hiddenLabelXl,
    );
    this.preferred = prefLabel();
    this.subject = kosResource.identifier;
  }

  get display(): string {
    if (this.preferred.isJust()) {
      for (const literalForm of this.preferred.unsafeCoerce().literalForm) {
        return literalForm.value;
      }
    }
    return Identifier.toString(this.subject);
  }
}

export function labels(kosResource: ConstructorParameters<typeof Labels>[0]) {
  return new Labels(kosResource);
}
