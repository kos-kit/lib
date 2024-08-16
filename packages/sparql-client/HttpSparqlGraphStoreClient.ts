import { DataFactory, DatasetCoreFactory } from "@rdfjs/types";
import { HttpSparqlBaseClient } from "./HttpSparqlBaseClient.js";
import { SparqlGraphStoreClient } from "./SparqlGraphStoreClient.js";

export class HttpSparqlGraphStoreClient
  extends HttpSparqlBaseClient
  implements SparqlGraphStoreClient
{
  private readonly dataFactory: DataFactory;
  private readonly datasetCoreFactory: DatasetCoreFactory;

  constructor({
    dataFactory,
    datasetCoreFactory,
    ...superParameters
  }: {
    dataFactory: DataFactory;
    datasetCoreFactory: DatasetCoreFactory;
  } & HttpSparqlBaseClient.Parameters) {
    super(superParameters);
    this.dataFactory = dataFactory;
    this.datasetCoreFactory = datasetCoreFactory;
  }
}
