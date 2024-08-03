import { NamedModel as INamedModel, Identifier } from "@kos-kit/models";

export abstract class NamedModel implements INamedModel {
  readonly identifier: Identifier;

  abstract readonly displayLabel: string;

  protected constructor({ identifier }: NamedModel.Parameters) {
    this.identifier = identifier;
  }
}

export namespace NamedModel {
  export interface Parameters {
    identifier: Identifier;
  }
}
