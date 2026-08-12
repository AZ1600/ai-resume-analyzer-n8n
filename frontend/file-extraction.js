"use strict";

async function extractPdf(file) {
  if (!window.pdfjsLib) throw new Error("The PDF reader did not load. Try a TXT file or paste the text.");
  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  const document = await window.pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => item.str).join(" "));
  }
  return pages.join("\n");
}

async function extractDocx(file) {
  if (!window.mammoth) throw new Error("The DOCX reader did not load. Try a TXT file or paste the text.");
  const result = await window.mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return result.value;
}

async function extractResumeFile(file) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "txt" || file.type === "text/plain") return file.text();
  if (extension === "pdf" || file.type === "application/pdf") return extractPdf(file);
  if (extension === "docx") return extractDocx(file);
  throw new Error("Choose a PDF, DOCX, or TXT résumé.");
}

window.ResumeFileExtraction = { extractResumeFile };
