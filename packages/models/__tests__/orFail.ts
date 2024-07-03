import * as O from "fp-ts/Option";

export function orFail<T>(option: O.Option<T>): T {
  if (O.isSome(option)) {
    return option.value;
  }
  throw new Error("fail");
}
