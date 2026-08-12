import { describe, expect, it } from "vitest";

import { LegalReviewTodo } from "@/features/legal/legal-review-todo";
import { unresolvedLegalReviewItemIds } from "@/features/legal/legal-review-items";

describe("legal review record", () => {
  it("keeps the owner-accepted residual questions explicit without blocking launch", () => {
    expect(unresolvedLegalReviewItemIds).toHaveLength(4);
    expect(new Set(unresolvedLegalReviewItemIds).size).toBe(4);
    expect(LegalReviewTodo).toBeTypeOf("function");
  });
});
