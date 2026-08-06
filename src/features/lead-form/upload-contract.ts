import { z } from "zod";

import {
  isAcceptedProjectFileType,
  MAX_PROJECT_FILES,
  MAX_PROJECT_FILE_SIZE,
  MAX_PROJECT_FILES_TOTAL_SIZE
} from "./file-rules";

export const uploadFileDescriptorSchema = z.object({
  name: z.string().trim().min(1).max(255),
  type: z
    .string()
    .refine(isAcceptedProjectFileType, "Unsupported file type."),
  size: z.number().int().positive().max(MAX_PROJECT_FILE_SIZE)
});

export const uploadManifestSchema = z
  .array(uploadFileDescriptorSchema)
  .max(MAX_PROJECT_FILES)
  .refine(
    (files) =>
      files.reduce((total, file) => total + file.size, 0) <=
      MAX_PROJECT_FILES_TOTAL_SIZE,
    "The combined file size exceeds 50 MB."
  );

export const blobUploadPayloadSchema = z.object({
  leadId: z.string().uuid(),
  fileId: z.string().uuid(),
  uploadToken: z.string().min(32).max(256)
});

export const blobCallbackPayloadSchema = blobUploadPayloadSchema.omit({
  uploadToken: true
});

export type UploadFileDescriptor = z.infer<typeof uploadFileDescriptorSchema>;
