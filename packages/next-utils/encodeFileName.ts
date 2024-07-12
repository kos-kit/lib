import { fileStemCodec } from "./fileStemCodec.js";

export const encodeFileName = (value: string): string =>
  fileStemCodec.encode(Buffer.from(value, "utf-8"));
