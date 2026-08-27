import { put, del } from "@vercel/blob";

export const uploadFile = async ({
  path,
  fileName,
  file,
  mimeType,
}: {
  fileName: string;
  path: string;
  file: File;
  mimeType: string;
}) => {
  const { url } = await put(`${path}/${fileName}`, file, {
    contentType: mimeType,
    access: "public",
    addRandomSuffix: true,
  });
  return url;
};

const BLOB_HOST_PATTERN = /\.public\.blob\.vercel-storage\.com\//;

export const deleteOldFile = async (oldUrl?: string | null) => {
  if (!oldUrl || !BLOB_HOST_PATTERN.test(oldUrl)) return;
  try {
    await del(oldUrl);
  } catch (err) {
    console.error("Failed to delete old blob:", err);
  }
};
