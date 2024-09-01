import { LoggingSparqlBaseClient } from "./LoggingSparqlBaseClient.js";
import { SparqlUpdateClient } from "./SparqlUpdateClient.js";

/**
 * SparqlClient implementation that logs queries and delegates actual work to another SparqlClient implementation.
 */
export class LoggingSparqlUpdateClient
  extends LoggingSparqlBaseClient<SparqlUpdateClient>
  implements SparqlUpdateClient
{
  async update(update: string): Promise<void> {
    this.logger.trace("SPARQL update:\n%s", update);
    await this.delegate.update(update);
    this.logger.trace("SPARQL update executed successfully");
  }
}
