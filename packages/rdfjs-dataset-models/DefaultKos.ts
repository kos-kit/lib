import { Identifier } from "@kos-kit/models";
import { skos } from "@tpluscode/rdf-ns-builders";
import { Left, Right } from "purify-ts";
import { Resource } from "rdfjs-resource";
import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { Kos } from "./Kos.js";
import { Label } from "./Label.js";
import { Stub } from "./Stub.js";

class DefaultConcept extends Concept<
  DefaultConcept,
  DefaultConceptScheme,
  DefaultLabel
> {}

class DefaultConceptScheme extends ConceptScheme<
  DefaultConcept,
  DefaultConceptScheme,
  DefaultLabel
> {}

type DefaultLabel = Label;

export class DefaultKos extends Kos<
  DefaultConcept,
  DefaultConceptScheme,
  DefaultLabel
> {
  concept(identifier: Identifier): Stub<DefaultConcept> {
    return new Stub({
      logger: this.logger,
      modelFromRdf: (resource) =>
        resource.isInstanceOf(skos.Concept)
          ? Right(
              new DefaultConcept({
                kos: this,
                labelConstructor: Label,
                logger: this.logger,
                resource,
              }),
            )
          : Left(
              new Error(
                `${Resource.Identifier.toString(resource.identifier)} is not a skos:Concept`,
              ),
            ),
      resource: new Resource<Identifier>({ dataset: this.dataset, identifier }),
    });
  }

  conceptScheme(identifier: Identifier): Stub<DefaultConceptScheme> {
    return new Stub({
      logger: this.logger,
      modelFromRdf: (resource) =>
        resource.isInstanceOf(skos.ConceptScheme)
          ? Right(
              new DefaultConceptScheme({
                kos: this,
                labelConstructor: Label,
                logger: this.logger,
                resource,
              }),
            )
          : Left(
              new Error(
                `${Resource.Identifier.toString(resource.identifier)} is not a skos:ConceptScheme`,
              ),
            ),
      resource: new Resource<Identifier>({ dataset: this.dataset, identifier }),
    });
  }
}
