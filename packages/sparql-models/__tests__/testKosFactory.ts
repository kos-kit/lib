import { LanguageTag, LanguageTagSet } from "@kos-kit/models";
import {
  DataFactory,
  DatasetCore,
  DatasetCoreFactory,
  Quad,
} from "@rdfjs/types";
import N3 from "n3";
import { DefaultKos, HttpSparqlClient } from "..";

class N3DataFactory implements DataFactory {
  blankNode = N3.DataFactory.blankNode;
  defaultGraph = N3.DataFactory.defaultGraph;
  literal = N3.DataFactory.literal;
  namedNode = N3.DataFactory.namedNode;
  quad = N3.DataFactory.quad;
}

class N3DatasetCoreFactory implements DatasetCoreFactory {
  dataset(quads?: Quad[]): DatasetCore {
    const store = new N3.Store();
    if (quads) {
      store.addQuads(quads);
    }
    return store;
  }
}

export const testKosFactory = (includeLanguageTag: LanguageTag) => {
  const includeLanguageTags = new LanguageTagSet(includeLanguageTag, "");
  const sparqlClient = new HttpSparqlClient({
    dataFactoryConstructor: N3DataFactory,
    datasetCoreFactoryConstructor: N3DatasetCoreFactory,
    queryEndpointUrl: "http://localhost:7878/sparql",
    operation: "postDirect",
  });
  // const store = new Store();
  // store.load(
  //   fs
  //     .readFileSync(
  //       path.join(
  //         path.dirname(fileURLToPath(import.meta.url)),
  //         "..",
  //         "..",
  //         "..",
  //          "__tests__",
  //         "data",
  //         "unesco-thesaurus.nt",
  //       ),
  //     )
  //     .toString(),
  //   { format: "nt" },
  // );
  // const sparqlClient = new OxigraphSparqlClient(store);
  return new DefaultKos({
    includeLanguageTags,
    sparqlClient,
  });
};
