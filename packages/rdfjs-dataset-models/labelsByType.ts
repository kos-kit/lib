import {
  Label as ILabel,
  LanguageTagSet,
  LiteralLabel,
  abc,
} from "@kos-kit/models";
import { skosxl } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import { Resource } from "rdfjs-resource";
import { Label } from "./Label.js";

export function labelsByType<LabelT extends ILabel>({
  includeLanguageTags,
  labelConstructor,
  resource,
  type,
}: {
  includeLanguageTags: LanguageTagSet;
  labelConstructor: new (_: Label.Parameters) => LabelT;
  resource: Resource;
  type: ILabel.Type;
}): readonly ILabel[] {
  const labels: ILabel[] = [
    // All literals that are the objects of the skosPredicate
    ...resource
      .values(type.literalProperty)
      .flatMap((value) =>
        value
          .toLiteral()
          .toMaybe()
          .filter((literal) =>
            abc.matchLiteral(literal, {
              includeLanguageTags,
            }),
          )
          .toList(),
      )
      .map((literalForm) => new LiteralLabel({ literalForm, type })),
  ];

  type.skosXlProperty.ifJust((skosXlPredicate) => {
    // Any resource in the range of a skosxl: label predicate is considered a skosxl:Label
    labels.push(
      ...resource.values(skosXlPredicate).flatMap((labelValue) =>
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
                        includeLanguageTags,
                      }),
                    )
                    .toList(),
                ),
              ].at(0),
            ).map(
              (literalForm) =>
                new labelConstructor({
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
