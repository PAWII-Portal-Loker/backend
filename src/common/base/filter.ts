import { baseSortKey } from "@consts";
import { OrderBy, Sorter } from "@types";
import { toCamelCase } from "@utils/caseConvert";

class BaseFilter {
  protected filter(param: FilterByKey) {
    const isCaseSensitive = param.isCaseSensitive || false;

    if (typeof param.value === "boolean") {
      return {
        [param.key]: param.value,
      };
    }

    return {
      [param.key]: {
        $regex: param.value,
        $options: isCaseSensitive ? "" : "i",
      },
    };
  }

  protected handleSorter(
    sortKey: string[],
    sortBy: string | undefined,
    orderBy: string | undefined,
  ): Sorter {
    const sorter: Sorter = {
      sort: "createdAt",
      order: "asc",
    };

    if (sortBy && this.isSafe(sortBy)) {
      const validSortKey = baseSortKey.concat(sortKey);
      if (validSortKey.includes(sortBy)) {
        sorter.sort = toCamelCase(sortBy);
      }
    }

    if (orderBy && ["asc", "desc"].includes(orderBy.toLowerCase())) {
      sorter.order = orderBy.toLowerCase() as OrderBy;
    }

    return sorter;
  }

  protected isSafe(input: FilterByKey["value"]): boolean {
    if (input === "" || input === null || input === undefined) return false;
    if (typeof input === "boolean") return true;

    const injectionPatterns = [
      /\$[a-zA-Z]+/, // Detects MongoDB operators like $ne, $gt, $or, etc.
      /[\{\}\[\]]/, // Detects curly braces {} and square brackets [].
      /(sleep|eval|exec)/i, // Common functions used in injection attacks.
      /\bfunction\b|\breturn\b/i, // JavaScript code snippets.
      /;/, // Semicolons.
      /\$where/, // $where operator.
      /\bthis\b|\bconstructor\b/, // Attempts to access object properties.
      /\/\*/, // Start of block comment.
      /\*\//, // End of block comment.
      /\bnew\b\s+\bFunction\b/i, // Usage of new Function.
    ];

    return !injectionPatterns.some((pattern) => pattern.test(input));
  }

  protected async safelyAssign(
    filters: Record<string, unknown>,
    key: FilterByKey["key"],
    value: FilterByKey["value"],
    filterCallback?: (
      cbParam: FilterByKey,
    ) => Promise<Record<string, unknown> | null>,
  ) {
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      !this.isSafe(value)
    ) {
      return;
    }

    if (filterCallback) {
      const callbackResult = await filterCallback({ key, value });
      if (callbackResult) Object.assign(filters, callbackResult);
      return;
    }

    Object.assign(filters, this.filter({ key, value }));
    return;
  }
}

interface FilterByKey {
  key: string;
  value: string | boolean | undefined;
  isCaseSensitive?: boolean;
}

export default BaseFilter;
