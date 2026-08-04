import { createEvent, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { CSSProperties } from "react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { ReferenceGallery } from "@/features/references/reference-gallery";
import type {
  ReferenceLayoutSlot,
  ReferenceProject
} from "@/features/references/types";

vi.mock("next/image", () => ({
  default: ({
    alt,
    className,
    src,
    style
  }: {
    alt: string;
    className?: string;
    src: string;
    style?: CSSProperties;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} className={className} src={src} style={style} />
  )
}));

const slots = [
  "left-tall",
  "center-top",
  "center-bottom",
  "right-tall"
] as const satisfies readonly ReferenceLayoutSlot[];

const items = slots.map((slot, index) => {
  const number = index + 1;

  return {
    id: `projekt-${number}`,
    slot,
    context: `Kontext ${number}`,
    title: `Projekt ${number}`,
    caption: `Bestätigter Projektumfang ${number}.`,
    image: {
      src: `/images/referenzen/projekt-${number}.webp`,
      width: 1600,
      height: 1200,
      alt: `Reales Projektfoto ${number}.`,
      focalPoint: { x: 50, y: 50 }
    },
    assetKind: "real-project",
    permission: "public-approved"
  } satisfies ReferenceProject;
}) as readonly ReferenceProject[];

const originalShowModal = HTMLDialogElement.prototype.showModal;
const originalClose = HTMLDialogElement.prototype.close;

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});

afterAll(() => {
  HTMLDialogElement.prototype.showModal = originalShowModal;
  HTMLDialogElement.prototype.close = originalClose;
});

describe("ReferenceGallery", () => {
  it("keeps all four fallback links crawlable", () => {
    render(<ReferenceGallery items={items} />);

    expect(screen.getAllByRole("link")).toHaveLength(4);
    items.forEach((item, index) => {
      expect(screen.getAllByRole("link")[index]).toHaveAttribute(
        "href",
        `/referenzen#${item.id}`
      );
    });
  });

  it("opens the dialog for an ordinary click and supports project navigation", async () => {
    render(<ReferenceGallery items={items} />);

    const firstLink = screen.getAllByRole("link")[0];
    firstLink.focus();
    const click = createEvent.click(firstLink, {
      button: 0,
      bubbles: true,
      cancelable: true
    });

    fireEvent(firstLink, click);

    expect(click.defaultPrevented).toBe(true);
    const dialog = screen.getByRole("dialog");
    await waitFor(() => expect(dialog).toHaveAttribute("open"));
    expect(
      screen.getByRole("heading", { name: "Projekt 1" })
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Nächstes Galeriebild" })
    );
    expect(
      screen.getByRole("heading", { name: "Projekt 2" })
    ).toBeInTheDocument();

    fireEvent.keyDown(dialog, { key: "ArrowLeft" });
    expect(
      screen.getByRole("heading", { name: "Projekt 1" })
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Galeriebild schließen" })
    );
    await waitFor(() => expect(dialog).not.toHaveAttribute("open"));
    expect(firstLink).toHaveFocus();
  });

  it("does not intercept modified clicks", () => {
    const showModal = vi.spyOn(HTMLDialogElement.prototype, "showModal");
    render(<ReferenceGallery items={items} />);

    const firstLink = screen.getAllByRole("link")[0];
    const click = createEvent.click(firstLink, {
      button: 0,
      ctrlKey: true,
      bubbles: true,
      cancelable: true
    });

    fireEvent(firstLink, click);

    expect(click.defaultPrevented).toBe(false);
    expect(showModal).not.toHaveBeenCalled();
    showModal.mockRestore();
  });

  it("closes on a native cancel event and restores the trigger focus", async () => {
    render(<ReferenceGallery items={items} />);

    const firstLink = screen.getAllByRole("link")[0];
    firstLink.focus();
    fireEvent.click(firstLink);

    const dialog = screen.getByRole("dialog");
    await waitFor(() => expect(dialog).toHaveAttribute("open"));
    fireEvent(dialog, new Event("cancel", { cancelable: true }));

    await waitFor(() => expect(dialog).not.toHaveAttribute("open"));
    expect(firstLink).toHaveFocus();
  });
});
