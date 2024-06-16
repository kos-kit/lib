import { DataFactory } from "n3";
import { Identifier } from "../models/Identifier";

export const stringToIdentifier = (str: string): Identifier => {
  if (str.startsWith("_:")) {
    return DataFactory.blankNode(str.substring("_:".length));
  } else if (str.startsWith("<") && str.endsWith(">") && str.length > 2) {
    return DataFactory.namedNode(str.substring(1, str.length - 1));
  } else {
    throw new RangeError(str);
  }
};
