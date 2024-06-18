import { base58 } from "./base58.js";

export const filenamify = (value: string): string =>
  base58.encode(Buffer.from(value, "utf-8"));
