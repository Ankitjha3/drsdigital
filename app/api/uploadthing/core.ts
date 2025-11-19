import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata?.userId, url: file.url };
    }),
  productFile: f({ 
    "application/zip": { maxFileSize: "50MB", maxFileCount: 1 },
    "application/pdf": { maxFileSize: "50MB", maxFileCount: 1 },
  })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata?.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

