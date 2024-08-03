import {
  Label as ILabel,
  Identifier,
  LanguageTagSet,
  abc,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { skosxl } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import "iterator-helpers-polyfill";
import { Literal } from "@rdfjs/types";

export function labelsByType({
  includeLanguageTags,
  resource,
  type,
}: {
  includeLanguageTags: LanguageTagSet;
  resource: Resource;
  type: ILabel.Type;
}): readonly (
  | {
      label: Identifier;
      literalForm: Literal;
    }
  | { label: Literal; literalForm: Literal }
)[] {
  const labels: (
    | {
        label: Identifier;
        literalForm: Literal;
      }
    | { label: Literal; literalForm: Literal }
  )[] = [
    // All literals that are the objects of the skosPredicate
    ...resource
      .values(type.literalPredicate)
      .flatMap((value) =>
        value
          .toLiteral()
          .filter((literal) =>
            abc.matchLiteral(literal, {
              includeLanguageTags,
            }),
          )
          .toList(),
      )
      .map((literalForm) => ({ label: literalForm, literalForm })),
  ];

  type.skosXlPredicate.ifJust((skosXlPredicate) => {
    // Any resource in the range of a skosxl: label predicate is considered a skosxl:Label
    labels.push(
      ...resource.values(skosXlPredicate).flatMap((labelValue) =>
        labelValue
          .toNamedResource()
          .chain((labelResource) =>
            Maybe.fromNullable(
              [
                ...labelResource.values(skosxl.literalForm).flatMap((value) =>
                  value
                    .toLiteral()
                    .filter((literal) =>
                      abc.matchLiteral(literal, {
                        includeLanguageTags,
                      }),
                    )
                    .toList(),
                ),
              ].at(0),
            ).map((literalForm) => ({
              label: labelResource.identifier,
              literalForm,
            })),
          )
          .toList(),
      ),
    );
  });

  return labels;
}
