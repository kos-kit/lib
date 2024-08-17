import { DatasetCore, DatasetCoreFactory, Quad } from "@rdfjs/types";
import N3 from "n3";

export class N3DatasetCoreFactory implements DatasetCoreFactory {
  dataset(quads?: Quad[]): DatasetCore {
    const store = new N3.Store();
    if (quads) {
      store.addQuads(quads);
    }
    return store;
  }
}
