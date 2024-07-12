import { fileStemCodec } from "./fileStemCodec.js";

export const decodeFileName = (value: string): string =>
  fileStemCodec.decode(value).toString("utf-8");
