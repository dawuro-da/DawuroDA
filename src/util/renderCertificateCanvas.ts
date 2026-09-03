// Renders the donation certificate onto a <canvas> by drawing the org's
// actual certificate artwork (public/DawuroDevelopmentAssociationcertificate.jpg)
// and overlaying just 3 fields — name, designation, amount — onto the blanks
// already built into that image. Same "drawImage the template, fill in
// simple field boxes" approach as the membership ID cards in
// renderIdCardCanvas.ts: no erasing, no reconstructing sentences — the
// template's own blanks do the layout work.
// Used for both the on-screen preview and the PNG/PDF export — one source
// of truth for what the certificate looks like.

const TEMPLATE_SRC = "/DawuroDevelopmentAssociationcertificate.jpg";
const INK_BLUE = "#0A4488";

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

// Boxes are percentages of the template's own dimensions (measured directly
// against the 1492x1054 source's blank lines), so they stay correct
// regardless of what resolution the canvas ends up rendering at.
const NAME_BOX = { left: 37.53, width: 28.82, baselineY: 58.73 };
const DESIGNATION_BOX = { left: 23.12, width: 54.69, baselineY: 72.49 };
// Deliberately narrow — the template's own amount blank is short, sized for
// an abbreviated number rather than a full comma-separated one, which is
// why the amount is formatted with K/M/B below instead of shown in full.
const AMOUNT_BOX = { left: 39.54, width: 9.25, baselineY: 77.51 };

// Shrinks from maxFontSize down to minFontSize until the text fits
// maxWidth, so a short value renders at full size and a long one (a long
// donor/company name, mainly) still fits instead of overflowing its blank.
const fitSingleLine = (
  ctx: CanvasRenderingContext2D,
  text: string,
  fontFamily: string,
  maxWidth: number,
  maxFontSize: number,
  minFontSize: number
) => {
  for (let fontSize = maxFontSize; fontSize >= minFontSize; fontSize -= 1) {
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    if (ctx.measureText(text).width <= maxWidth) return fontSize;
  }
  return minFontSize;
};

// Abbreviates the amount once it reaches 10,000 — below that it's shown in
// full (e.g. "1,500"); at/above it, K/M/B (e.g. "15K", "2.5M", "1.2B"),
// matching the template's amount blank, which is sized for a short value
// rather than a long comma-separated one.
export const formatCertificateAmount = (amount: number): string => {
  const value = Math.round(amount);
  if (value < 10_000) return value.toLocaleString();
  const tiers: [number, string][] = [
    [1_000_000_000, "B"],
    [1_000_000, "M"],
    [1_000, "K"],
  ];
  for (const [threshold, suffix] of tiers) {
    if (value >= threshold) {
      const scaled = value / threshold;
      const rounded = Math.round(scaled * 10) / 10;
      return `${rounded % 1 === 0 ? rounded : rounded.toFixed(1)}${suffix}`;
    }
  }
  return value.toLocaleString();
};

export interface CertificateData {
  donorName: string;
  amount: number;
  designation: string;
}

export const drawCertificate = async (
  canvas: HTMLCanvasElement,
  data: CertificateData
) => {
  const template = await loadImage(TEMPLATE_SRC);

  // Cap the export at a large-but-safe resolution rather than upscaling —
  // the template is already print-quality (1492x1054) — same pattern as
  // the ID cards.
  const MAX_WIDTH = 3000;
  const scale = Math.min(1, MAX_WIDTH / template.width);
  const width = Math.round(template.width * scale);
  const height = Math.round(template.height * scale);

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.drawImage(template, 0, 0, width, height);

  await document.fonts.ready.catch(() => {});
  // "Nokia Pure Headline" isn't a font this project ships or loads (it's
  // Nokia's own proprietary brand font, not a public web font) — naming it
  // first just means the canvas uses it on any device that happens to have
  // it installed, and falls back to the site's normal font everywhere else.
  const fontFamily = `"Nokia Pure Headline", ${
    getComputedStyle(document.body).fontFamily || "Arial, sans-serif"
  }`;

  ctx.fillStyle = INK_BLUE;
  ctx.textBaseline = "alphabetic";

  const drawField = (
    box: { left: number; width: number; baselineY: number },
    text: string,
    align: "left" | "center",
    maxFontSize: number,
    minFontSize: number
  ) => {
    const left = (box.left / 100) * width;
    const boxWidth = (box.width / 100) * width;
    const baselineY = (box.baselineY / 100) * height;
    const fontSize = fitSingleLine(
      ctx,
      text,
      fontFamily,
      boxWidth,
      maxFontSize,
      minFontSize
    );
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.textAlign = align;
    const x = align === "center" ? left + boxWidth / 2 : left;
    ctx.fillText(text, x, baselineY);
  };

  drawField(NAME_BOX, data.donorName, "left", 30, 16);
  drawField(DESIGNATION_BOX, data.designation, "center", 28, 14);
  drawField(
    AMOUNT_BOX,
    formatCertificateAmount(data.amount),
    "center",
    26,
    14
  );
};

export const downloadCertificatePng = (
  canvas: HTMLCanvasElement,
  fileName: string
) => {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${fileName}.png`;
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }, "image/png");
};

export const downloadCertificatePdf = async (
  canvas: HTMLCanvasElement,
  fileName: string
) => {
  const { jsPDF } = await import("jspdf");
  const imgData = canvas.toDataURL("image/jpeg", 0.92);
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: [canvas.width, canvas.height],
  });
  pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
  pdf.save(`${fileName}.pdf`);
};
