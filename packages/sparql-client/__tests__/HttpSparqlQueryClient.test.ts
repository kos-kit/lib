import { beforeEach, vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

import N3 from "n3";
import { describe, it } from "vitest";
import { HttpSparqlQueryClient } from "../HttpSparqlQueryClient.js";
import { N3DatasetCoreFactory } from "./N3DatasetCoreFactory.js";

describe("HttpSparqlQueryClient", () => {
  const sut = new HttpSparqlQueryClient({
    dataFactory: N3.DataFactory,
    datasetCoreFactory: new N3DatasetCoreFactory(),
    endpointUrl: "http://example.com",
  });

  beforeEach(() => {
    fetchMocker.resetMocks();
  });

  it("should make an ASK query", async ({ expect }) => {
    fetchMocker.mockResponseOnce(JSON.stringify({ boolean: true }));
    expect(await sut.queryBoolean("ASK")).toStrictEqual(true);
  });

  it("should make a CONSTRUCT query", async ({ expect }) => {
    fetchMocker.mockResponseOnce(
      '<http://example.org/book/book1> <http://purl.org/dc/elements/1.1/title> "SPARQL Tutorial" .\n',
    );
    const dataset = await sut.queryQuads("CONSTRUCT");
    expect(dataset.size).toStrictEqual(1);
  });

  it("should make a SELECT query", async ({ expect }) => {
    fetchMocker.mockResponseOnce(
      JSON.stringify({
        head: {
          link: ["http://www.w3.org/TR/rdf-sparql-XMLres/example.rq"],
          vars: ["x", "hpage", "name", "mbox", "age", "blurb", "friend"],
        },
        results: {
          bindings: [
            {
              x: { type: "bnode", value: "r1" },

              hpage: { type: "uri", value: "http://work.example.org/alice/" },

              name: { type: "literal", value: "Alice" },

              mbox: { type: "literal", value: "" },

              blurb: {
                datatype:
                  "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
                type: "literal",
                value:
                  '<p xmlns="http://www.w3.org/1999/xhtml">My name is <b>alice</b></p>',
              },

              friend: { type: "bnode", value: "r2" },
            },
            {
              x: { type: "bnode", value: "r2" },

              hpage: { type: "uri", value: "http://work.example.org/bob/" },

              name: { type: "literal", value: "Bob", "xml:lang": "en" },

              mbox: { type: "uri", value: "mailto:bob@work.example.org" },

              friend: { type: "bnode", value: "r1" },
            },
          ],
        },
      }),
    );
    const bindings = await sut.queryBindings("SELECT");
    expect(bindings).toHaveLength(2);
    expect(bindings[0]["name"].value).toStrictEqual("Alice");
  });

  it("should use the GET method", async ({ expect }) => {
    fetchMocker.mockResponseOnce(JSON.stringify({ boolean: true }));
    expect(await sut.queryBoolean("ASK", { method: "GET" })).toStrictEqual(
      true,
    );
    expect(fetchMocker.requests()).toHaveLength(1);
    const request = fetchMocker.requests()[0];
    expect(request.url).toStrictEqual("http://example.com/?query=ASK");
    expect(await request.text()).toStrictEqual("");
  });

  it("should use the POST directly method", async ({ expect }) => {
    fetchMocker.mockResponseOnce(JSON.stringify({ boolean: true }));
    expect(
      await sut.queryBoolean("ASK", { method: "POSTDirectly" }),
    ).toStrictEqual(true);
    expect(fetchMocker.requests()).toHaveLength(1);
    const request = fetchMocker.requests()[0];
    expect(request.url).toStrictEqual("http://example.com/");
    expect(request.headers.get("content-type")).toStrictEqual(
      "application/sparql-query; charset=utf-8",
    );
    expect(await request.text()).toStrictEqual("ASK");
  });

  it("should use the POST with URL-encoded parameters method", async ({
    expect,
  }) => {
    fetchMocker.mockResponseOnce(JSON.stringify({ boolean: true }));
    expect(
      await sut.queryBoolean("ASK", { method: "POSTWithUrlEncodedParameters" }),
    ).toStrictEqual(true);
    expect(fetchMocker.requests()).toHaveLength(1);
    const request = fetchMocker.requests()[0];
    expect(request.url).toStrictEqual("http://example.com/");
    expect(request.headers.get("content-type")).toStrictEqual(
      "application/x-www-form-urlencoded",
    );
    expect(await request.text()).toStrictEqual("query=ASK");
  });
});
