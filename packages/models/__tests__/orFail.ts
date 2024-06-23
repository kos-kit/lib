import O, { Option } from "fp-ts/Option";

export function orFail<T>(option: Option<T>): T {
  if (O.isSome(option)) {
    return option.value;
  }
  throw new Error("fail");
}
