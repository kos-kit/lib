import { HttpSparqlProtocolClient } from "./HttpSparqlProtocolClient";
import { SparqlUpdateClient } from "./SparqlUpdateClient.js";

export class HttpSparqlUpdateClient
  extends HttpSparqlProtocolClient
  implements SparqlUpdateClient
{
  async update(
    update: string,
    options?: HttpSparqlProtocolClient.RequestOptions,
  ): Promise<void> {
    await this.request(update, options);
  }
}
