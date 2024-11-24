import { baseSortKey } from "@consts";
import { OrderBy, Sorter } from "@types";
import { toCamelCase } from "@utils/caseConvert";

class BaseFilter {
  protected filter(param: FilterByKey) {
    const isCaseSensitive = param.isCaseSensitive || false;
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

  protected isSafe(input: string | undefined): boolean {
    if (!input) return false;

    const injectionPatterns = [
      /\$[a-zA-Z]+/, // Detects MongoDB operators like $ne, $gt, $or, etc.
      /[\{\}\[\]]/, // Detects curly braces {} and square brackets [].
      /(sleep|eval|system|exec)/i, // Common functions used in injection attacks.
      /\bfunction\b|\breturn\b/i, // JavaScript code snippets.
      /;/, // Semicolons.
      /\$where/, // $where operator.
      /\bthis\b|\bconstructor\b/, // Attempts to access object properties.
      /\/\*/, // Start of block comment.
      /\*\//, // End of block comment.
      /\bnew\b\s+\bFunction\b/i, // Usage of new Function.
      /\bprocess\b/, // Accessing process object.
      /\brequire\b/, // Usage of require function.
      /\bexports\b/, // Accessing exports.
      /\bmodule\b/, // Accessing module object.
    ];

    return !injectionPatterns.some((pattern) => pattern.test(input));
  }

  protected safelyAssign(
    filters: Record<string, unknown>,
    key: string,
    value: string | undefined,
    filterCallback?: (key: string, value: string) => Record<string, unknown>,
  ) {
    if (!value || !this.isSafe(value)) {
      return;
    }

    if (filterCallback) {
      Object.assign(filters, filterCallback(key, value));
      return;
    }

    Object.assign(filters, this.filter({ key, value }));
    return;
  }
}

interface FilterByKey {
  key: string;
  value: string | undefined;
  isCaseSensitive?: boolean;
}

export default BaseFilter;
