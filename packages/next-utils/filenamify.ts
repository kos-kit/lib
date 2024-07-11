import { base62 } from "./base62.js";

export const filenamify = (value: string): string =>
  base62.encode(Buffer.from(value, "utf-8"));
