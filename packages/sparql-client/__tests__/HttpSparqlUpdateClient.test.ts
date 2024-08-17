import { vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

import { describe, it } from "vitest";
import { HttpSparqlUpdateClient } from "../HttpSparqlUpdateClient.js";

describe("HttpSparqlUpdateClient", () => {
  const sut = new HttpSparqlUpdateClient({
    endpointUrl: "http://example.com",
  });

  it("should make an update ", async () => {
    fetchMocker.mockResponseOnce("");
    await sut.update("INSERT DATA");
  });
});
