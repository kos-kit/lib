import { beforeEach, vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

import { describe, it } from "vitest";
import { HttpSparqlUpdateClient } from "../HttpSparqlUpdateClient.js";

describe("HttpSparqlUpdateClient", () => {
  const sut = new HttpSparqlUpdateClient({
    endpointUrl: "http://example.com",
  });

  beforeEach(() => {
    fetchMocker.resetMocks();
  });

  it("should make an update ", async () => {
    fetchMocker.mockResponseOnce("");
    await sut.update("INSERT DATA");
  });

  it("should use the POST directly method", async ({ expect }) => {
    fetchMocker.mockResponseOnce("");
    await sut.update("UPDATE", { method: "POSTDirectly" });
    expect(fetchMocker.requests()).toHaveLength(1);
    const request = fetchMocker.requests()[0];
    expect(request.url).toStrictEqual("http://example.com/");
    expect(request.headers.get("content-type")).toStrictEqual(
      "application/sparql-update; charset=utf-8",
    );
    expect(await request.text()).toStrictEqual("UPDATE");
  });

  it("should use the POST with URL-encoded parameters method", async ({
    expect,
  }) => {
    fetchMocker.mockResponseOnce("");
    await sut.update("UPDATE", { method: "POSTWithUrlEncodedParameters" });
    expect(fetchMocker.requests()).toHaveLength(1);
    const request = fetchMocker.requests()[0];
    expect(request.url).toStrictEqual("http://example.com/");
    expect(request.headers.get("content-type")).toStrictEqual(
      "application/x-www-form-urlencoded",
    );
    expect(await request.text()).toStrictEqual("update=UPDATE");
  });
});
