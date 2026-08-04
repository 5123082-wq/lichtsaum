import { z } from "zod";

import {
  isAcceptedProjectFileType,
  MAX_PROJECT_FILES,
  MAX_PROJECT_FILE_SIZE
} from "./file-rules";

const optionalTrimmedText = (maximum: number, message: string) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().trim().max(maximum, message).optional()
  );

function isFile(value: unknown): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

const projectFile = z
  .custom<File>(isFile, {
    error: "Bitte wählen Sie gültige Dateien aus."
  })
  .refine(
    (file) => isAcceptedProjectFileType(file.type),
    "Bitte verwenden Sie nur JPG, PNG, WebP oder PDF."
  )
  .refine(
    (file) => file.size <= MAX_PROJECT_FILE_SIZE,
    "Eine Datei darf höchstens 15 MB groß sein."
  );

export const projectCheckSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Bitte geben Sie eine E-Mail-Adresse ein.")
    .max(254, "Die E-Mail-Adresse ist zu lang.")
    .email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  phone: optionalTrimmedText(
    50,
    "Die Telefonnummer darf höchstens 50 Zeichen lang sein."
  ),
  projectContext: optionalTrimmedText(
    1000,
    "Die Nachricht darf höchstens 1.000 Zeichen lang sein."
  ),
  projectFiles: z
    .array(projectFile)
    .max(MAX_PROJECT_FILES, "Sie können höchstens fünf Dateien auswählen."),
  website: z
    .string()
    .max(0, "Die Anfrage konnte nicht geprüft werden.")
    .default("")
});

export type ProjectCheckInput = z.infer<typeof projectCheckSchema>;

function stringValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export function parseProjectCheckFormData(formData: FormData) {
  return projectCheckSchema.safeParse({
    email: stringValue(formData, "email"),
    phone: stringValue(formData, "phone"),
    projectContext: stringValue(formData, "projectContext"),
    projectFiles: formData
      .getAll("projectFiles")
      .filter((value): value is File => isFile(value) && value.size > 0),
    website: stringValue(formData, "website")
  });
}
