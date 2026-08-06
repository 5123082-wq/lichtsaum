export const MAX_PROJECT_FILE_SIZE = 15 * 1024 * 1024;
export const MAX_PROJECT_FILES_TOTAL_SIZE = 50 * 1024 * 1024;
export const MAX_PROJECT_FILES = 5;
export const PROJECT_FILE_RETENTION_DAYS = 90;

export const PROJECT_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf"
] as const;

const projectFileTypes = new Set<string>(PROJECT_FILE_TYPES);

export const PROJECT_FILE_ACCEPT =
  ".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf";

export function isAcceptedProjectFileType(type: string) {
  return projectFileTypes.has(type);
}

export function projectFilesFitTotalLimit(
  files: ReadonlyArray<Pick<File, "size">>
) {
  return (
    files.reduce((total, file) => total + file.size, 0) <=
    MAX_PROJECT_FILES_TOTAL_SIZE
  );
}
