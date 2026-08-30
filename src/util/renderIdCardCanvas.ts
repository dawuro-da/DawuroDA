import { Member, MembershipLevel } from "@prisma/client";
import { calculateAge } from "@/util/date";
import {
  TEMPLATE_BY_LEVEL,
  FIELD_BOX,
  FIELD_BOX_SILVER,
  FONT_SIZE_PERCENT_OF_HEIGHT,
  PHOTO_BOX,
  STAMP_BOX,
  STAMP_SRC,
} from "@/components/shared/DawuroDAId";

// html2canvas re-rasterizes the DOM as displayed on screen (~800px wide)
// and merely upscales that raster for higher `scale` values — it doesn't
// redraw background-images at their real source resolution. That's why the
// downloaded ID always looked soft no matter how high `scale` was pushed,
// even once exporting as lossless PNG. Drawing directly onto a native
// <canvas> at the template's own resolution (the size the user's real,
// uncompressed template files actually are) sidesteps that limitation
// entirely — every pixel comes straight from the source image.

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const drawRoundedImage = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) => {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
  ctx.clip();

  // Emulate CSS `background-size: cover` / `background-position: center`.
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  let drawW = w;
  let drawH = h;
  if (imgRatio > boxRatio) {
    drawH = h;
    drawW = h * imgRatio;
  } else {
    drawW = w;
    drawH = w / imgRatio;
  }
  const drawX = x + (w - drawW) / 2;
  const drawY = y + (h - drawH) / 2;
  ctx.drawImage(img, drawX, drawY, drawW, drawH);
  ctx.restore();
};

export const downloadDawuroDAId = async (member: Member, name: string) => {
  const isSilver =
    member.membershipLevel === MembershipLevel.Silver ||
    member.membershipLevel === MembershipLevel.Standard;
  const box = isSilver ? FIELD_BOX_SILVER : FIELD_BOX;

  const templateSrc = TEMPLATE_BY_LEVEL[member.membershipLevel];
  const template = await loadImage(templateSrc);

  // Cap the export at a large-but-safe resolution rather than the
  // template's full native size (12000px+ — tens of megapixels, which is
  // slow and risks hitting browser canvas memory limits). 3600px wide is
  // still far sharper than the old ~2400px html2canvas output.
  const MAX_WIDTH = 3600;
  const scale = Math.min(1, MAX_WIDTH / template.width);
  const width = Math.round(template.width * scale);
  const height = Math.round(template.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.drawImage(template, 0, 0, width, height);

  // Photo
  if (member?.profileImage) {
    try {
      const photo = await loadImage(member.profileImage);
      drawRoundedImage(
        ctx,
        photo,
        (PHOTO_BOX.left / 100) * width,
        (PHOTO_BOX.top / 100) * height,
        (PHOTO_BOX.width / 100) * width,
        (PHOTO_BOX.height / 100) * height,
        (12 / 800) * width
      );
    } catch {
      // No photo, or it failed to load (e.g. CORS) — leave the template's
      // blank photo box showing rather than failing the whole export.
    }
  }

  // Stamp
  try {
    const stamp = await loadImage(STAMP_SRC);
    const stampW = (STAMP_BOX.width / 100) * width;
    const stampH = stampW / STAMP_BOX.aspect;
    const cx = (STAMP_BOX.left / 100) * width + stampW / 2;
    const cy = (STAMP_BOX.top / 100) * height + stampH / 2;
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.translate(cx, cy);
    ctx.rotate((STAMP_BOX.rotateDeg * Math.PI) / 180);
    ctx.drawImage(stamp, -stampW / 2, -stampH / 2, stampW, stampH);
    ctx.restore();
  } catch {
    // Non-critical decoration — skip silently if it fails to load.
  }

  // Text fields — same font size (as a fraction of card height) and font
  // family the live preview uses, so the download matches what's on screen.
  await document.fonts.ready.catch(() => {});
  const fontFamily =
    getComputedStyle(document.body).fontFamily || "Arial, sans-serif";
  const fontSize = FONT_SIZE_PERCENT_OF_HEIGHT * height;
  ctx.fillStyle = "#1E1E1E";
  ctx.textBaseline = "middle";
  ctx.font = `bold ${fontSize}px ${fontFamily}`;

  const fullName = member?.firstName
    ? `${member.firstName} ${member.lastName}`
    : `${member?.institutionName}`;

  const drawField = (
    fieldBox: { left: string; top: string; width: string; height: string },
    text: string,
    center = false
  ) => {
    const left = (parseFloat(fieldBox.left) / 100) * width;
    const top = (parseFloat(fieldBox.top) / 100) * height;
    const w = (parseFloat(fieldBox.width) / 100) * width;
    const h = (parseFloat(fieldBox.height) / 100) * height;
    ctx.textAlign = center ? "center" : "left";
    const x = center ? left + w / 2 : left;
    const y = top + h / 2;
    ctx.fillText(text, x, y);
  };

  drawField(box.idNo, member?.memberId ?? "");
  drawField(box.fullName, fullName);
  drawField(
    box.age,
    member?.dateOfBirth ? String(calculateAge(member.dateOfBirth)) : "-"
  );
  drawField(box.sex, member?.gender ?? "-");
  const occupation =
    (member?.expertise?.slice(0, 25) ?? "-") +
    (member?.expertise && member.expertise.length > 25 ? "..." : "");
  drawField(box.occupation, occupation);
  drawField(box.nationality, member?.nationality ?? "-");
  drawField(box.address, member?.city ?? "-");
  drawField(box.phone, member?.phone ?? "");
  drawField(
    box.renewedYear,
    member?.idRenewedYear ? String(member.idRenewedYear) : "-",
    true
  );

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );
  if (!blob) return;

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${name}.png`;
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};
