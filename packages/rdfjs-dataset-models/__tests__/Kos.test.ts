import { describe } from "vitest";
import { behavesLikeKos } from "../../../__tests__/behavesLikeKos.js";
import { testKosFactory } from "./testKosFactory.js";

describe("mem.Kos", () => {
  // it("should get a concept added manually", async ({ expect }) => {
  //   const dataset = new Store();
  //   const kos = new DefaultKos({
  //     dataset,
  //     includeLanguageTags: new LanguageTagSet(),
  //   });
  //   const conceptIdentifier = DataFactory.namedNode(
  //     "http://example.com/concept",
  //   );
  //   dataset.add(DataFactory.quad(conceptIdentifier, rdf.type, skos.Concept));
  //   expect(
  //     (await kos.conceptByIdentifier(conceptIdentifier).resolve())
  //       .unsafeCoerce()
  //       .identifier.equals(conceptIdentifier),
  //   );
  // });

  behavesLikeKos(testKosFactory("en"));
});
