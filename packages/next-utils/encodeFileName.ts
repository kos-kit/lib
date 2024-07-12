import { fileNameCodec } from "./fileNameCodec.js";
import { isSafeFileName } from "./isSafeFileName.js";
import { splitFileName } from "./splitFileName.js";

/**
 * Encode a file name to file name-safe characters, preserving its extension.
 */
export const encodeFileName = (fileName: string): string => {
  const [fileStem, fileExtension] = splitFileName(fileName);
  if (fileExtension.length > 1) {
    if (!isSafeFileName(fileExtension.substring(1))) {
      throw new RangeError(
        "file extension must be file name safe: " + fileExtension,
      );
    }
  }
  return fileNameCodec.encode(Buffer.from(fileStem, "utf-8")) + fileExtension;
};
