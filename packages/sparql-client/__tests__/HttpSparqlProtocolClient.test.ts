import { beforeEach, vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

import N3 from "n3";
import { describe, it } from "vitest";
import { HttpSparqlUpdateClient } from "../HttpSparqlUpdateClient.js";

describe("HttpSparqlProtocolClient", () => {
  beforeEach(() => {
    fetchMocker.resetMocks();
  });

  it("should add using graph URIs with request options", async ({ expect }) => {
    fetchMocker.mockResponseOnce("");
    await new HttpSparqlUpdateClient({
      endpointUrl: "http://example.com",
    }).update("UPDATE", {
      method: "POSTDirectly",
      usingGraphUris: [N3.DataFactory.namedNode("http://test.com")],
    });
    expect(fetchMocker.requests()).toHaveLength(1);
    const request = fetchMocker.requests()[0];
    expect(request.url).toStrictEqual(
      "http://example.com/?using-graph-uri=http%3A%2F%2Ftest.com",
    );
  });

  it("should add using named graph URIs with default request options", async ({
    expect,
  }) => {
    fetchMocker.mockResponseOnce("");
    await new HttpSparqlUpdateClient({
      defaultRequestOptions: {
        usingNamedGraphUris: [N3.DataFactory.namedNode("http://test.com")],
      },
      endpointUrl: "http://example.com",
    }).update("UPDATE", {
      method: "POSTDirectly",
    });
    expect(fetchMocker.requests()).toHaveLength(1);
    const request = fetchMocker.requests()[0];
    expect(request.url).toStrictEqual(
      "http://example.com/?using-named-graph-uri=http%3A%2F%2Ftest.com",
    );
  });
});
