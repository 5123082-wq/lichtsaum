import { isIndexable } from "@/config/environment";

import {
  legalReviewItems,
  type LegalReviewItemId
} from "./legal-review-items";

export function LegalReviewTodo({ item }: { item: LegalReviewItemId }) {
  if (isIndexable) {
    return null;
  }

  const reviewItem = legalReviewItems[item];

  return (
    <aside
      aria-label={`Внутренняя юридическая пометка: ${reviewItem.title}`}
      className="legal-review-todo"
      data-legal-review="required"
      data-legal-review-id={item}
      role="note"
    >
      <p className="legal-review-todo__label">Intern / vor Livegang</p>
      <h3>{reviewItem.title}</h3>
      <p>{reviewItem.description}</p>
    </aside>
  );
}
