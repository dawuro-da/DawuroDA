export const prepareURL = async (currTarget: any, name: string) => {
  const cardElement = currTarget;
  if (!cardElement) return;

  try {
    // Lazy load the html2canvas package
    const html2canvas = await import(/* webpackPrefetch: true */ "html2canvas");

    // Ensure all images are loaded
    const images = cardElement.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map((img: any) => {
        if (!img.complete) {
          return new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve(); // Handle errors as well
          });
        }
      })
    );

    // Capture the element
    const result = await html2canvas.default(cardElement, {
      useCORS: true, // This might help with cross-origin issues
      scale: 2, // Increase resolution if needed
    });

    const asURL = result.toDataURL("image/jpeg");

    // Trigger the download
    const anchor = document.createElement("a");
    anchor.href = asURL;
    anchor.download = `${name}.jpeg`;
    anchor.click();
    anchor.remove();
  } catch (err) {
    console.error("Error capturing the element:", err);
  }
};
