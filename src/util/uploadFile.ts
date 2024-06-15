import { put } from "@vercel/blob";

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
  try {
    const { url } = await put(`${path}/${fileName}`, file, {
      contentType: mimeType,
      access: "public",
    });
    return url;
  } catch (err) {
    console.error(err);
    
  }
};
