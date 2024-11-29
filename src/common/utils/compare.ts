import { Types } from "mongoose";

export function isIdEquals(a: unknown, b: unknown) {
  return (a as Types.ObjectId).equals(b as Types.ObjectId);
}
