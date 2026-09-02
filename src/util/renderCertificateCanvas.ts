// Renders the donation certificate onto a <canvas> using the org's actual
// certificate artwork (public/DawuroDevelopmentAssociationcertificate.jpg —
// same "drawImage the real template, overlay text at measured field boxes"
// approach as the membership ID cards in renderIdCardCanvas.ts) rather than
// a from-scratch design, so it matches the printed/physical certificate.
// Used for both the on-screen preview and the PNG/PDF export — one source
// of truth for what the certificate looks like.

const TEMPLATE_SRC = "/DawuroDevelopmentAssociationcertificate.jpg";

const INK_BLUE = "#0A4488";
// Sampled directly from the template's blank paper — used to blank out the
// printed placeholder lines before drawing the real values over them.
const PAPER_COLOR = "#FDFAF5";

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

// All boxes are percentages of the template image's own dimensions
// (measured against the 1492x1054 source), so they stay correct regardless
// of what resolution the canvas ends up rendering at.
// left=540px sits right where the template's printed "ለ" glyph actually ends
// (its ink runs x524-539 — pixel-scanned, not eyeballed) so the erase covers
// the original underline (which starts at x542) right from its start, with
// no gap left showing, and without clipping the glyph itself. right is
// capped at x~1285, clear of the decorative striped gold border that starts
// around x~1310 on the right.
const NAME_BOX = { left: 36.19, top: 57.5, width: 49.93, height: 5.6 };
// Baseline (not box-centered) y for the donor name, matched to where the
// template's own "ለ" glyph sits, so the drawn name lines up with it instead
// of floating above it.
const NAME_BASELINE_Y = 61.48;
// The template prints "እርስዎ ለዳውሮ ልማት ... ለ____" / "ሥራ ላበረከቱት ... መጠን___ ብር ..." /
// "ይህንን የምስክር ወረቀት ስጥተንዎታል።" across 3 fixed lines with the designation and
// amount as inline blanks. A long designation would overflow that first
// blank into the fixed word that follows it, so instead of filling in the
// two inline blanks we blank out the whole paragraph and redraw it as one
// reflowing block with the values interpolated — it wraps to as many lines
// as it needs and never collides with the fixed wording around it.
//
// Line 1/2's box is centered on the template's true horizontal center
// (x~746, 50%) rather than just filling the available margin on each side —
// the right side has less room before the border (x~1310) than the left
// does (x~100), so centering uses that tighter right-hand distance
// symmetrically on both sides. Using each side's full unequal margin instead
// pulled the whole block visibly left of center.
const PARAGRAPH_ERASE_BOXES = [
  // Covers the original line 1 + line 2 (both blanks included) at their
  // full original width.
  { left: 12.2, top: 64.9, width: 75.6, height: 8.07 },
  // Line 3 only — kept narrower than line 1/2 and left-aligned (not
  // centered) so it doesn't erase into the circular seal stamp sitting
  // just below-right of it — matching the original template, where line 3
  // also sits in the left portion for the same reason.
  { left: 6.7, top: 72.96, width: 57.98, height: 5.22 },
];
// Two candidate layouts, tried in order. WIDE is centered and spans nearly
// the template's full inner width — same width the original line 1/2 text
// used — but is only tall enough to stay entirely above the seal stamp, so
// a short/medium designation (the common case) reads at full width like the
// original design instead of wrapping early inside a narrower box. NARROW
// is the fallback for text too long to fit that way: it trades width for
// height, staying clear of the seal horizontally (hence left-aligned, not
// centered, same as the line-3 erase box above) so it can grow to more
// lines.
const WIDE_TEXT_BOX = { left: 12.2, top: 65.5, width: 75.6, height: 7.4 };
const NARROW_TEXT_BOX = { left: 6.7, top: 65.5, width: 57.6, height: 12.3 };

const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] => {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
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
  return lines;
};

type ParagraphLine = { text: string; bold: boolean };
type ParagraphFit = { lines: ParagraphLine[]; fontSize: number; lineHeight: number };

// The paragraph is built from 3 pieces that each always start on their own
// line — the intro sentence up to "ለ" ("to"), the designation on its own
// line so it reads clearly as *the reason* rather than being buried inline,
// then the rest of the sentence (amount + closing) wrapping across however
// many lines it needs. Picks the largest font size (stepping down from
// maxFontSize) whose combined wrapped lines fit within maxHeight. Returns
// null if `strict` and nothing in range fits (caller falls back to a
// different box); otherwise falls back to minFontSize and allows overflow
// rather than losing text.
function fitParagraph(
  ctx: CanvasRenderingContext2D,
  segments: { text: string; bold: boolean }[],
  fontFamily: string,
  maxWidth: number,
  maxHeight: number,
  maxFontSize: number,
  minFontSize: number,
  lineHeightRatio: number | undefined,
  strict: true
): ParagraphFit | null;
function fitParagraph(
  ctx: CanvasRenderingContext2D,
  segments: { text: string; bold: boolean }[],
  fontFamily: string,
  maxWidth: number,
  maxHeight: number,
  maxFontSize: number,
  minFontSize: number,
  lineHeightRatio?: number,
  strict?: false
): ParagraphFit;
function fitParagraph(
  ctx: CanvasRenderingContext2D,
  segments: { text: string; bold: boolean }[],
  fontFamily: string,
  maxWidth: number,
  maxHeight: number,
  maxFontSize: number,
  minFontSize: number,
  lineHeightRatio = 1.45,
  strict = false
): ParagraphFit | null {
  const wrapAtSize = (fontSize: number): ParagraphLine[] =>
    segments.flatMap(({ text, bold }) => {
      ctx.font = `${bold ? "bold " : ""}${fontSize}px ${fontFamily}`;
      return wrapText(ctx, text, maxWidth).map((line) => ({ text: line, bold }));
    });

  for (let fontSize = maxFontSize; fontSize >= minFontSize; fontSize -= 1) {
    const lines = wrapAtSize(fontSize);
    const lineHeight = fontSize * lineHeightRatio;
    if (lines.length * lineHeight <= maxHeight) {
      return { lines, fontSize, lineHeight };
    }
  }
  if (strict) return null;
  const lines = wrapAtSize(minFontSize);
  return { lines, fontSize: minFontSize, lineHeight: minFontSize * lineHeightRatio };
};

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

  // Same cap-but-don't-upscale pattern as the ID cards — the template is
  // already print-quality (1492x1054), so this just guards against a future
  // higher-res replacement blowing past a sane canvas size.
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
  // it installed, and falls back to the site's normal font everywhere else,
  // same as before.
  const fontFamily = `"Nokia Pure Headline", ${
    getComputedStyle(document.body).fontFamily || "Arial, sans-serif"
  }`;

  // --- Donor name (drawn right after the template's fixed "ለ" / "To") ---
  const nameLeft = (NAME_BOX.left / 100) * width;
  const nameTop = (NAME_BOX.top / 100) * height;
  const nameWidth = (NAME_BOX.width / 100) * width;
  const nameHeight = (NAME_BOX.height / 100) * height;
  const nameBaselineY = (NAME_BASELINE_Y / 100) * height;
  ctx.fillStyle = PAPER_COLOR;
  ctx.fillRect(nameLeft, nameTop, nameWidth, nameHeight);

  // A small gap after "ለ" before the name starts — erasing right from
  // nameLeft (needed to fully clear the original underline) but also
  // drawing the name starting exactly there left it butted right up
  // against the glyph with no breathing room.
  const nameTextLeft = nameLeft + 0.012 * width;

  // Targets the template's own "ለ" glyph size (its ink stands about 40px
  // tall in the source image) rather than maximizing to fill the box — a
  // short name maximized to the box read noticeably larger than "ለ" right
  // next to it. fitSingleLine still shrinks below that target for a name
  // too long to fit at it.
  const nameFontSize = fitSingleLine(
    ctx,
    data.donorName,
    fontFamily,
    nameWidth - (nameTextLeft - nameLeft),
    Math.min(nameHeight * 0.68, 40),
    nameHeight * 0.4
  );
  ctx.font = `bold ${nameFontSize}px ${fontFamily}`;
  ctx.fillStyle = INK_BLUE;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(data.donorName, nameTextLeft, nameBaselineY);

  // --- Paragraph (designation + amount reflowed into the template's wording) ---
  PARAGRAPH_ERASE_BOXES.forEach((box) => {
    ctx.fillStyle = PAPER_COLOR;
    ctx.fillRect(
      (box.left / 100) * width,
      (box.top / 100) * height,
      (box.width / 100) * width,
      (box.height / 100) * height
    );
  });

  const amountText = `${Math.round(data.amount).toLocaleString()}`;
  const segments: { text: string; bold: boolean }[] = [
    { text: "እርስዎ ለዳውሮ ልማት ካለዎት ተነሳሽነትና ፍላጎት የተነሳ ለ", bold: true },
    { text: data.designation, bold: true },
    {
      text: `ሥራ ላበረከቱት ለገንዘብ መጠን ${amountText} ብር በዳውሮ ሕዝብ ለላቀ ምስጋና በማቅረብ ይህንን የምስክር ወረቀት ስጥተንዎታል፡፡`,
      bold: true,
    },
  ];

  const boxPx = (box: typeof WIDE_TEXT_BOX) => ({
    left: (box.left / 100) * width,
    top: (box.top / 100) * height,
    width: (box.width / 100) * width,
    height: (box.height / 100) * height,
  });

  const wideBox = boxPx(WIDE_TEXT_BOX);
  // Every paragraph now has at least 3 lines minimum — intro, designation,
  // and tail are forced onto separate lines — so the minimum font size here
  // has to be small enough that 3 lines actually fit in the wide box's
  // fixed height, or every paragraph fails this attempt and falls back to
  // the narrower, left-aligned box below (which looks visibly off-center
  // under the centered title above it) even for short designations.
  const wideFit = fitParagraph(
    ctx,
    segments,
    fontFamily,
    wideBox.width,
    wideBox.height,
    wideBox.height * 0.56,
    wideBox.height * 0.225,
    1.22,
    true
  );

  const textBox = wideFit ? wideBox : boxPx(NARROW_TEXT_BOX);
  const textLeft = textBox.left;
  const textTop = textBox.top;
  const textWidth = textBox.width;
  const textHeight = textBox.height;
  const textCenterX = textLeft + textWidth / 2;

  const { lines, fontSize, lineHeight } =
    wideFit ??
    fitParagraph(
      ctx,
      segments,
      fontFamily,
      textWidth,
      textHeight,
      textHeight * 0.4,
      textHeight * 0.16,
      1.32
    );
  ctx.fillStyle = INK_BLUE;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const blockHeight = lines.length * lineHeight;
  const startY = textTop + (textHeight - blockHeight) / 2 + fontSize;
  lines.forEach((line, i) => {
    ctx.font = `${line.bold ? "bold " : ""}${fontSize}px ${fontFamily}`;
    ctx.fillText(line.text, textCenterX, startY + i * lineHeight);
  });
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
