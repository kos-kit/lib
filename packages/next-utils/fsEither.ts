import * as fs from "node:fs";
import { Either, Left, Right } from "purify-ts";
import invariant from "ts-invariant";

export async function stat(
  path: fs.PathLike,
): Promise<Either<Error, fs.Stats>> {
  try {
    return Right(await fs.promises.stat(path));
  } catch (e) {
    invariant(e instanceof Error);
    return Left(e);
  }
}
