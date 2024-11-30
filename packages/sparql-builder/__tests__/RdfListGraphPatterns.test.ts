import { schema } from "@tpluscode/rdf-ns-builders";
import * as oxigraph from "oxigraph";
import { describe, expect, it } from "vitest";
import { ConstructQueryBuilder } from "../ConstructQueryBuilder.js";
import { GraphPattern } from "../GraphPattern.js";
import { RdfListGraphPatterns } from "../RdfListGraphPatterns.js";
import { termToString } from "../termToString.js";

describe("RdfListGraphPatterns", () => {
  function testRdfListGraphPatterns(
    inputRdfListTtl: string,
    options?: {
      itemGraphPatterns?: (
        item: GraphPattern.Variable,
      ) => Iterable<GraphPattern>;
      otherInputTtl?: string;
    },
  ): void {
    const inputStore = new oxigraph.Store();
    const dummySubject = oxigraph.namedNode("http://example.com/dummysubject");
    const dummyPredicate = oxigraph.namedNode(
      "http://example.com/dummypredicate",
    );
    inputStore.load(
      `<${dummySubject.value}> <${dummyPredicate.value}> ${inputRdfListTtl} . ${options?.otherInputTtl ?? ""}`,
      { format: "text/turtle" },
    );
    const inputTrig = inputStore.dump({ format: "text/trig" });
    console.info("Input trig:\n", inputTrig);
    console.info();

    const rdfListConstructQuery = new ConstructQueryBuilder()
      .addGraphPatterns(
        GraphPattern.basic(
          dummySubject,
          dummyPredicate,
          GraphPattern.variable("rdfList"),
        ).chainObject(
          (rdfList) =>
            new RdfListGraphPatterns({
              rdfList,
              itemGraphPatterns: options?.itemGraphPatterns,
            }),
        ),
      )
      .build();
    console.info("CONSTRUCT query:\n", rdfListConstructQuery);
    console.info();

    // @ts-ignore
    const actualOutputQuads: oxigraph.Quad[] = inputStore.query(
      rdfListConstructQuery,
    );
    const actualOutputTrig = new oxigraph.Store(actualOutputQuads).dump({
      format: "text/trig",
    });
    console.info("Actual output trig:\n", actualOutputTrig);
    console.info();
    console.info("Actual output quads:");
    for (const actualOutputQuad of actualOutputQuads) {
      console.info(
        `${termToString(actualOutputQuad.subject as any)} ${termToString(actualOutputQuad.predicate)} ${termToString(actualOutputQuad.object as any)}`,
      );
    }

    expect(actualOutputQuads).toHaveLength(inputStore.size);
    for (const expectedOutputQuad of inputStore.match()) {
      expect(
        actualOutputQuads.some((actualOutputQuad) =>
          actualOutputQuad.equals(expectedOutputQuad),
        ),
      ).toStrictEqual(true);
    }
  }

  it("should get a single-item, literal list", () => {
    testRdfListGraphPatterns('( "test1" )');
  });

  it("should get a multiple-item, literal list", () => {
    testRdfListGraphPatterns('( "test1" "test2" )');
  });

  it("should get a multiple-item list with extra triples", () => {
    testRdfListGraphPatterns(
      "( <http://example.com/1> <http://example.com/2> )",
      {
        otherInputTtl: `<http://example.com/1> <${schema.name.value}> "test1" . <http://example.com/2> <${schema.name.value}> "test2" .`,
        itemGraphPatterns: (item) => [
          GraphPattern.basic(
            item,
            schema.name,
            GraphPattern.variable(`${item.value}Name`),
          ),
        ],
      },
    );
  });
});
