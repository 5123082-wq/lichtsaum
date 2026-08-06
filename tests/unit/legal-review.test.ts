import { describe, expect, it } from "vitest";

import {
  legalReviewBlocksProductionIndexing,
  LegalReviewTodo
} from "@/features/legal/legal-review-todo";
import { unresolvedLegalReviewItemIds } from "@/features/legal/legal-review-items";

describe("legal review release gate", () => {
  it("keeps unresolved legal fields explicit and blocks production indexing", () => {
    expect(unresolvedLegalReviewItemIds).toHaveLength(4);
    expect(new Set(unresolvedLegalReviewItemIds).size).toBe(4);
    expect(legalReviewBlocksProductionIndexing(false)).toBe(false);
    expect(legalReviewBlocksProductionIndexing(true)).toBe(true);
    expect(LegalReviewTodo).toBeTypeOf("function");
  });
});
