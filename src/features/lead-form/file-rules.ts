export const MAX_PROJECT_FILE_SIZE = 15 * 1024 * 1024;
export const MAX_PROJECT_FILES = 5;

const PROJECT_FILE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf"
]);

export const PROJECT_FILE_ACCEPT =
  ".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf";

export function isAcceptedProjectFileType(type: string) {
  return PROJECT_FILE_TYPES.has(type);
}
