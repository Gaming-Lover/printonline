import pdf from "pdf-parse";
export async function countPages(buffer: Buffer, mime: string) {
  if (mime === "application/pdf") { const data = await pdf(buffer); return data.numpages || 1; }
  return 1;
}
