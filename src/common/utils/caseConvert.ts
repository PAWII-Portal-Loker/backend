export function toSnakeCase(obj: unknown): unknown {
  if (!obj) return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key
          .replace(/(([a-z])(?=[A-Z][a-zA-Z])|([A-Z])(?=[A-Z][a-z]))/g, "$1_")
          .toLowerCase(),
        toSnakeCase(value),
      ]),
    );
  }

  return obj;
}
