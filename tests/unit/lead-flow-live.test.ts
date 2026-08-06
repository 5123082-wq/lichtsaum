import { readFile } from "node:fs/promises";

import { put } from "@vercel/blob";
import { describe, expect, it } from "vitest";

import { buildLeadFileDownloadUrl } from "../../src/features/lead-form/download-security";
import {
  confirmLeadFileUpload,
  createLeadUploadPlan,
  finalizeLeadUploadPlan
} from "../../src/features/lead-form/upload-service";

const liveIt = process.env.RUN_LIVE_LEAD_TEST === "true" ? it : it.skip;

describe("live lead flow", () => {
  liveIt(
    "persists a lead, uploads a private file, sends a notification and serves a signed download",
    async () => {
      process.env.SITE_URL = "http://127.0.0.1:3001";
      const file = await readFile("public/brand/lichtsaum-favicon-32.png");
      const plan = await createLeadUploadPlan(
        {
          email: "5123082@gmail.com",
          projectContext:
            "Automatischer Live-Test mit privatem Dateidownload am 06.08.2026.",
          sourcePath: "/"
        },
        [
          {
            name: "lichtsaum-live-test.png",
            type: "image/png",
            size: file.byteLength
          }
        ]
      );
      const plannedFile = plan.files[0];

      expect(plannedFile).toBeDefined();

      const blob = await put(plannedFile!.pathname, file, {
        access: "private",
        addRandomSuffix: false,
        allowOverwrite: false,
        contentType: "image/png"
      });

      await confirmLeadFileUpload({
        leadId: plan.leadId,
        fileId: plannedFile!.fileId,
        uploadToken: plan.uploadToken,
        pathname: blob.pathname,
        contentType: blob.contentType
      });
      await finalizeLeadUploadPlan(plan.leadId, plan.uploadToken);

      const response = await fetch(
        buildLeadFileDownloadUrl(plan.leadId, plannedFile!.fileId)
      );
      const downloaded = Buffer.from(await response.arrayBuffer());

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toBe("image/png");
      expect(downloaded.equals(file)).toBe(true);
    },
    30_000
  );
});
