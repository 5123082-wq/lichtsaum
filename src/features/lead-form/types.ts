export const PROJECT_CHECK_FIELD_NAMES = [
  "email",
  "phone",
  "projectContext",
  "projectFiles"
] as const;

export type ProjectCheckFieldName =
  (typeof PROJECT_CHECK_FIELD_NAMES)[number];

export type ProjectCheckFieldErrors = Partial<
  Record<ProjectCheckFieldName, string[]>
>;

export type ProjectCheckFormStatus =
  | "idle"
  | "invalid"
  | "prototype_validated"
  | "prototype_unavailable";

export interface ProjectCheckFormState {
  status: ProjectCheckFormStatus;
  message: string;
  fieldErrors: ProjectCheckFieldErrors;
}

export const initialProjectCheckFormState: ProjectCheckFormState = {
  status: "idle",
  message: "",
  fieldErrors: {}
};
