import { base62 } from "./base62.js";

export const defilenamify = (value: string): string =>
  base62.decode(value).toString("utf-8");
