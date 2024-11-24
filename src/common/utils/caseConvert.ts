export function ObjToSnakeCase(obj: unknown): unknown {
  if (!obj) return obj;
  if (Array.isArray(obj)) return obj.map(ObjToSnakeCase);
  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        toSnakeCase(key),
        ObjToSnakeCase(value),
      ]),
    );
  }

  return obj;
}

export function toSnakeCase(text: string): string {
  return text
    .replace(/(([a-z])(?=[A-Z][a-zA-Z])|([A-Z])(?=[A-Z][a-z]))/g, "$1_")
    .toLowerCase();
}

export function ObjToCamelCase(obj: unknown): unknown {
  if (!obj) return obj;
  if (Array.isArray(obj)) return obj.map(ObjToCamelCase);
  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        toCamelCase(key),
        ObjToCamelCase(value),
      ]),
    );
  }

  return obj;
}

export function toCamelCase(text: string): string {
  return text.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}
