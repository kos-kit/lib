import { NamedNode } from "@rdfjs/types";
import { rdf, rdfs } from "@tpluscode/rdf-ns-builders";
import sparqljs from "sparqljs";

export function sparqlRdfTypePattern({
  rdfType,
  subject,
}: {
  rdfType: NamedNode;
  subject: sparqljs.Triple["subject"];
}): sparqljs.Pattern {
  return {
    triples: [
      {
        object: rdfType,
        subject,
        predicate: {
          items: [
            rdf.type,
            {
              items: [rdfs.subClassOf],
              pathType: "*",
              type: "path",
            },
          ],
          pathType: "/",
          type: "path",
        },
      },
    ],
    type: "bgp",
  };
}
