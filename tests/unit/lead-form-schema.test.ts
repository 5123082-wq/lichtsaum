import { describe, expect, it, vi } from "vitest";

import { submitProjectCheck } from "../../src/features/lead-form/action";
import {
  parseProjectCheckFormData,
  projectCheckSchema
} from "../../src/features/lead-form/schema";
import { initialProjectCheckFormState } from "../../src/features/lead-form/types";

const validInput = {
  email: "alex@example.test",
  phone: "",
  projectContext: "Lokaler Formularprototyp.",
  projectFiles: [],
  website: ""
};

function validFormData() {
  const formData = new FormData();

  formData.set("email", validInput.email);
  formData.set("phone", validInput.phone);
  formData.set("projectContext", validInput.projectContext);
  formData.set("website", validInput.website);

  return formData;
}

describe("projectCheckSchema", () => {
  it("accepts an email-only first contact", () => {
    const result = projectCheckSchema.safeParse({
      ...validInput,
      projectContext: ""
    });

    expect(result.success).toBe(true);
  });

  it("normalizes blank optional fields", () => {
    const result = projectCheckSchema.safeParse({
      ...validInput,
      phone: "   ",
      projectContext: ""
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.phone).toBeUndefined();
      expect(result.data.projectContext).toBeUndefined();
      expect(result.data.projectFiles).toEqual([]);
    }
  });

  it("rejects an invalid email address", () => {
    const result = projectCheckSchema.safeParse({
      ...validInput,
      email: "not-an-email"
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path[0])).toContain(
        "email"
      );
    }
  });

  it("accepts supported optional project files", () => {
    const projectFile = new File(["image"], "markise.jpg", {
      type: "image/jpeg"
    });
    const result = projectCheckSchema.safeParse({
      ...validInput,
      projectFiles: [projectFile]
    });

    expect(result.success).toBe(true);
  });

  it("rejects an unsupported project file", () => {
    const projectFile = new File(["content"], "notes.txt", {
      type: "text/plain"
    });
    const result = projectCheckSchema.safeParse({
      ...validInput,
      projectFiles: [projectFile]
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe("projectFiles");
    }
  });

  it("rejects a project file larger than 15 MB", () => {
    const projectFile = new File(
      [new Uint8Array(15 * 1024 * 1024 + 1)],
      "markise.jpg",
      { type: "image/jpeg" }
    );
    const result = projectCheckSchema.safeParse({
      ...validInput,
      projectFiles: [projectFile]
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe("projectFiles");
      expect(result.error.issues[0]?.message).toContain("15 MB");
    }
  });

  it("rejects more than five project files", () => {
    const projectFiles = Array.from(
      { length: 6 },
      (_, index) =>
        new File(["image"], "markise-" + index + ".jpg", {
          type: "image/jpeg"
        })
    );
    const result = projectCheckSchema.safeParse({
      ...validInput,
      projectFiles
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe("projectFiles");
    }
  });

  it("rejects project files larger than 50 MB in total", () => {
    const projectFiles = Array.from(
      { length: 4 },
      (_, index) =>
        new File(
          [new Uint8Array(13 * 1024 * 1024)],
          "markise-" + index + ".jpg",
          { type: "image/jpeg" }
        )
    );
    const result = projectCheckSchema.safeParse({
      ...validInput,
      projectFiles
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe("projectFiles");
      expect(result.error.issues[0]?.message).toContain("50 MB");
    }
  });

  it("rejects a completed honeypot", () => {
    const result = projectCheckSchema.safeParse({
      ...validInput,
      website: "https://spam.invalid"
    });

    expect(result.success).toBe(false);
  });

  it("parses the minimal FormData shape", () => {
    const result = parseProjectCheckFormData(validFormData());

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe(validInput.email);
    }
  });
});

describe("submitProjectCheck", () => {
  it("returns prototype_validated without echoing or storing form values", async () => {
    vi.stubEnv("APP_ENV", "local");

    try {
      const state = await submitProjectCheck(
        initialProjectCheckFormState,
        validFormData()
      );

      expect(state.status).toBe("prototype_validated");
      expect(state).not.toHaveProperty("lead_id");
      expect(JSON.stringify(state)).not.toContain(validInput.email);
      expect(state.message).toContain(
        "nicht gespeichert und nicht als Projektanfrage weitergeleitet"
      );
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("fails closed in production", async () => {
    vi.stubEnv("APP_ENV", "production");

    try {
      const state = await submitProjectCheck(
        initialProjectCheckFormState,
        validFormData()
      );

      expect(state.status).toBe("prototype_unavailable");
      expect(state).not.toHaveProperty("lead_id");
      expect(state.message).toContain(
        "keine Daten gespeichert oder versendet"
      );
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
