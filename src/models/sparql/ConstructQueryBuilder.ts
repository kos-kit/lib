// import { Variable } from "@rdfjs/types";
// import { LanguageTagSet } from "../LanguageTagSet";

// export class ConstructQueryBuilder {
//   private readonly constructGraphPatterns: string[] = [];
//   private readonly whereFilters: string[] = [];
//   private readonly optionalWhereGraphPatterns: string[] = [];
//   private readonly requiredWhereGraphPatterns: string[] = [];

//   addGraphPattern(
//     graphPattern: string,
//     options?: { optional?: boolean },
//   ): ConstructQueryBuilder {
//     const optional = options?.optional ?? false;

//     this.constructGraphPatterns.push(graphPattern);

//     if (optional) {
//       this.optionalWhereGraphPatterns.push(`OPTIONAL { ${graphPattern} }`);
//     }

//     return this;
//   }

//   addLanguageTagsFilter(
//     literalVariable: Variable,
//     includeLanguageTags: LanguageTagSet,
//   ): ConstructQueryBuilder {
//     if (includeLanguageTags.size === 0) {
//       return this;
//     }

//     this.whereFilters.push(
//       "FILTER ( " +
//         [...includeLanguageTags]
//           .map(
//             (languageTag) =>
//               `lang(?${literalVariable.value}) = "${languageTag}"`,
//           )
//           .join(" || ") +
//         " )",
//     );

//     return this;
//   }

//   build(): string {
//     return `
// CONSTRUCT {
// ${this.constructGraphPatterns.join("\n")}
// } WHERE {
// ${this.whereGraphPatterns.join("\n")}
// ${this.whereFilters.join("\n")}
// }
//     `;
//   }
// }
