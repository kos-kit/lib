import {
  Label as ILabel,
  Identifier,
  LanguageTagSet,
  LiteralLabel,
  Note,
  abc,
} from "@kos-kit/models";
import { Literal } from "@rdfjs/types";
import { dcterms, skos, skosxl } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import * as rdfjsResource from "rdfjs-resource";
import { Label } from "./Label.js";

interface Resource<LabelT extends ILabel> {
  kos: { readonly includeLanguageTags: LanguageTagSet };
  labelConstructor: new (_: Label.Parameters) => LabelT;
  resource: rdfjsResource.Resource<Identifier>;
}

export namespace Resource {
  export function labelsByType<LabelT extends ILabel>(
    this: Resource<LabelT>,
    type: ILabel.Type,
  ): readonly ILabel[] {
    const labels: ILabel[] = [
      ...this.resource
        .values(type.literalProperty)
        // All literals that are the objects of the skosPredicate
        .flatMap((value) =>
          value
            .toLiteral()
            .toMaybe()
            .filter((literal) =>
              abc.matchLiteral(literal, {
                includeLanguageTags: this.kos.includeLanguageTags,
              }),
            )
            .toList(),
        )
        .map((literalForm) => new LiteralLabel({ literalForm, type })),
    ];

    type.skosXlProperty.ifJust((skosXlPredicate) => {
      // Any resource in the range of a skosxl: label predicate is considered a skosxl:Label
      labels.push(
        ...this.resource.values(skosXlPredicate).flatMap((labelValue) =>
          labelValue
            .toNamedResource()
            .toMaybe()
            .chain((labelResource) =>
              Maybe.fromNullable(
                [
                  ...labelResource.values(skosxl.literalForm).flatMap((value) =>
                    value
                      .toLiteral()
                      .toMaybe()
                      .filter((literal) =>
                        abc.matchLiteral(literal, {
                          includeLanguageTags: this.kos.includeLanguageTags,
                        }),
                      )
                      .toList(),
                  ),
                ].at(0),
              ).map(
                (literalForm) =>
                  new this.labelConstructor({
                    identifier: labelResource.identifier,
                    literalForm,
                    type,
                  }),
              ),
            )
            .toList(),
        ),
      );
    });

    return labels;
  }

  export function modified<LabelT extends ILabel>(
    this: Resource<LabelT>,
  ): Maybe<Literal> {
    return this.resource
      .value(dcterms.modified)
      .chain((value) => value.toLiteral())
      .toMaybe();
  }

  export function notations<LabelT extends ILabel>(
    this: Resource<LabelT>,
  ): readonly Literal[] {
    return [
      ...this.resource
        .values(skos.notation)
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
  }

  export function notes<LabelT extends ILabel>(
    this: Resource<LabelT>,
    options?: { types?: readonly Note.Type[] },
  ): readonly Note[] {
    return (options?.types ?? Note.Types).flatMap((type) => [
      ...this.resource.values(type.skosProperty).flatMap((value) =>
        value
          .toLiteral()
          .toMaybe()
          .filter((literal) =>
            abc.matchLiteral(literal, {
              includeLanguageTags: this.kos.includeLanguageTags,
            }),
          )
          .map((literalForm) => new abc.Note({ literalForm, type }))
          .toList(),
      ),
    ]);
  }
}
