// Renders the donation certificate onto a <canvas> at a fixed, print-quality
// resolution (A4 landscape proportions). Used for both the on-screen preview
// and the PNG/PDF export, so there's exactly one source of truth for what
// the certificate looks like — no risk of the preview and the download
// drifting apart the way a separate CSS layout + canvas renderer can.

export const CERTIFICATE_WIDTH = 2000;
export const CERTIFICATE_HEIGHT = 1414;

const PRIMARY_GREEN = "#1F6B3A";
const ACCENT_GOLD = "#C9A24B";
const INK = "#1E1E1E";
const MUTED = "#5B5B5B";

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

export interface CertificateData {
  donorName: string;
  amount: number;
  designation: string;
  date: string;
  certificateNo: string;
}

export const drawCertificate = async (
  canvas: HTMLCanvasElement,
  data: CertificateData
) => {
  canvas.width = CERTIFICATE_WIDTH;
  canvas.height = CERTIFICATE_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = CERTIFICATE_WIDTH;
  const h = CERTIFICATE_HEIGHT;

  // Background
  ctx.fillStyle = "#FBF9F3";
  ctx.fillRect(0, 0, w, h);

  // Subtle corner watermark washes
  const wash = ctx.createRadialGradient(w, 0, 0, w, 0, w * 0.5);
  wash.addColorStop(0, "rgba(31,107,58,0.06)");
  wash.addColorStop(1, "rgba(31,107,58,0)");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, w, h);
  const wash2 = ctx.createRadialGradient(0, h, 0, 0, h, w * 0.5);
  wash2.addColorStop(0, "rgba(201,162,75,0.08)");
  wash2.addColorStop(1, "rgba(201,162,75,0)");
  ctx.fillStyle = wash2;
  ctx.fillRect(0, 0, w, h);

  // Outer border
  const margin = 48;
  ctx.strokeStyle = PRIMARY_GREEN;
  ctx.lineWidth = 6;
  ctx.strokeRect(margin, margin, w - margin * 2, h - margin * 2);

  // Inner gold hairline border
  const innerMargin = margin + 18;
  ctx.strokeStyle = ACCENT_GOLD;
  ctx.lineWidth = 2;
  ctx.strokeRect(
    innerMargin,
    innerMargin,
    w - innerMargin * 2,
    h - innerMargin * 2
  );

  // Corner ornaments (simple quarter-circle flourishes)
  const drawCorner = (x: number, y: number, rotate: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotate);
    ctx.strokeStyle = ACCENT_GOLD;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 60);
    ctx.lineTo(0, 10);
    ctx.lineTo(60, 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(10, 10, 8, 0, Math.PI * 2);
    ctx.fillStyle = ACCENT_GOLD;
    ctx.fill();
    ctx.restore();
  };
  drawCorner(margin + 10, margin + 10, 0);
  drawCorner(w - margin - 10, margin + 10, Math.PI / 2);
  drawCorner(w - margin - 10, h - margin - 10, Math.PI);
  drawCorner(margin + 10, h - margin - 10, -Math.PI / 2);

  // Logo
  try {
    const logo = await loadImage("/images/dawuroda-logo-256.png");
    const logoSize = 130;
    ctx.drawImage(logo, w / 2 - logoSize / 2, 90, logoSize, logoSize);
  } catch {
    // Non-critical — proceed without the logo if it fails to load.
  }

  ctx.textAlign = "center";

  // Org name
  ctx.fillStyle = PRIMARY_GREEN;
  ctx.font = "bold 34px Georgia, 'Times New Roman', serif";
  ctx.fillText("DAWURO DEVELOPMENT ASSOCIATION", w / 2, 268);

  // Title
  ctx.fillStyle = INK;
  ctx.font = "bold 64px Georgia, 'Times New Roman', serif";
  ctx.fillText("Certificate of Appreciation", w / 2, 360);

  // Decorative rule under title
  ctx.strokeStyle = ACCENT_GOLD;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 160, 390);
  ctx.lineTo(w / 2 + 160, 390);
  ctx.stroke();

  // Presented-to line
  ctx.fillStyle = MUTED;
  ctx.font = "28px Georgia, 'Times New Roman', serif";
  ctx.fillText("This certificate is proudly presented to", w / 2, 470);

  // Donor name
  ctx.fillStyle = PRIMARY_GREEN;
  ctx.font = "bold 58px 'Brush Script MT', Georgia, cursive, serif";
  ctx.fillText(data.donorName, w / 2, 555);
  ctx.strokeStyle = "rgba(31,107,58,0.35)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 280, 580);
  ctx.lineTo(w / 2 + 280, 580);
  ctx.stroke();

  // Body text
  ctx.fillStyle = INK;
  ctx.font = "26px Georgia, 'Times New Roman', serif";
  const amountText = `${data.amount.toLocaleString()} ETB`;
  ctx.fillText(
    "in generous support of",
    w / 2,
    650
  );
  ctx.font = "bold 32px Georgia, 'Times New Roman', serif";
  ctx.fillStyle = PRIMARY_GREEN;
  wrapCenteredText(ctx, data.designation, w / 2, 700, 1200, 42);

  ctx.fillStyle = INK;
  ctx.font = "26px Georgia, 'Times New Roman', serif";
  ctx.fillText(
    `contributing ${amountText} towards our community development efforts.`,
    w / 2,
    800
  );

  ctx.font = "24px Georgia, 'Times New Roman', serif";
  ctx.fillStyle = MUTED;
  ctx.fillText(
    "We are deeply grateful for your generosity and trust in our mission.",
    w / 2,
    845
  );

  // Footer: date (left), signature (right), certificate number centered below
  const footerY = h - margin - 140;
  ctx.textAlign = "left";
  ctx.strokeStyle = MUTED;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(innerMargin + 60, footerY);
  ctx.lineTo(innerMargin + 340, footerY);
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.font = "22px Georgia, serif";
  ctx.fillText(data.date, innerMargin + 60, footerY - 12);
  ctx.fillStyle = MUTED;
  ctx.font = "18px Georgia, serif";
  ctx.fillText("Date", innerMargin + 60, footerY + 30);

  ctx.textAlign = "right";
  ctx.strokeStyle = MUTED;
  ctx.beginPath();
  ctx.moveTo(w - innerMargin - 340, footerY);
  ctx.lineTo(w - innerMargin - 60, footerY);
  ctx.stroke();
  ctx.fillStyle = PRIMARY_GREEN;
  ctx.font = "italic bold 26px Georgia, serif";
  ctx.fillText("DawuroDA", w - innerMargin - 60, footerY - 12);
  ctx.fillStyle = MUTED;
  ctx.font = "18px Georgia, serif";
  ctx.fillText(
    "Dawuro Development Association",
    w - innerMargin - 60,
    footerY + 30
  );

  ctx.textAlign = "center";
  ctx.fillStyle = MUTED;
  ctx.font = "18px Georgia, serif";
  ctx.fillText(`Certificate No. ${data.certificateNo}`, w / 2, h - margin - 30);
};

const wrapCenteredText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) => {
  const words = text.split(" ");
  let line = "";
  let lines: string[] = [];
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line);
  lines = lines.slice(0, 2);
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
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
  // The certificate is a flat design (no photos), so JPEG at high quality
  // is visually lossless here while keeping the PDF a reasonable size
  // instead of embedding an 8MB+ uncompressed PNG.
  const imgData = canvas.toDataURL("image/jpeg", 0.92);
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: [CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT],
  });
  pdf.addImage(imgData, "JPEG", 0, 0, CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT);
  pdf.save(`${fileName}.pdf`);
};
