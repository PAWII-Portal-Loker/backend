import * as Yup from "yup";

export function shouldBeNumber() {
  return Yup.number().transform((_, originalValue) =>
    !isNaN(originalValue) ? parseInt(originalValue, 10) : -1,
  );
}
