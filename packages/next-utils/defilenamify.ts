import { base58 } from "./base58.js";

export const defilenamify = (value: string): string =>
  base58.decode(value).toString("utf-8");
