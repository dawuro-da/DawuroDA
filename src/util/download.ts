// Preloads every image the element depends on — both real <img> tags and
// anything set via a CSS `background-image` inline style (which the ID
// card uses exclusively, so the old <img>-only check below was a no-op for
// it and let html2canvas capture before the template/photo had decoded).
const waitForImages = async (root: HTMLElement) => {
  const urls = new Set<string>();

  root.querySelectorAll("img").forEach((img) => urls.add(img.src));
  root.querySelectorAll<HTMLElement>("*").forEach((el) => {
    const bg = el.style.backgroundImage;
    const match = bg && bg.match(/url\(["']?(.*?)["']?\)/);
    if (match?.[1]) urls.add(match[1]);
  });

  await Promise.all(
    Array.from(urls).map(
      (src) =>
        new Promise<void>((resolve) => {
          if (!src) return resolve();
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        })
    )
  );
};

export const prepareURL = async (currTarget: any, name: string) => {
  const cardElement = currTarget;
  if (!cardElement) return;

  try {
    // Lazy load the html2canvas package
    const html2canvas = await import(/* webpackPrefetch: true */ "html2canvas");

    await waitForImages(cardElement);

    // Capture the element at a high resolution and export losslessly (PNG)
    // — re-encoding to JPEG here would be a second, compounding round of
    // lossy compression on top of the already-JPEG template background.
    const result = await html2canvas.default(cardElement, {
      useCORS: true,
      scale: 3,
    });

    const asURL = result.toDataURL("image/png");

    // Trigger the download
    const anchor = document.createElement("a");
    anchor.href = asURL;
    anchor.download = `${name}.png`;
    anchor.click();
    anchor.remove();
  } catch (err) {
    console.error("Error capturing the element:", err);
  }
};
