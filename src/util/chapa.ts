import axios, { AxiosResponse } from "axios";
import { randomUUID } from "crypto";

// Chapa's transaction/initialize endpoint validates `customization.title`
// (max 16 chars) and `customization.description` (max 50 chars, and only
// letters, numbers, hyphens, underscores, spaces and dots — no "&", quotes,
// commas, etc.) and REJECTS the whole request if either is violated. Since
// campaign headlines and donation designations are free-form admin-entered
// text, they need to be sanitized and truncated before being used here.
export const sanitizeChapaText = (text: string, maxLength: number): string => {
  const cleaned = text
    .replace(/&/g, "and")
    .replace(/[^A-Za-z0-9\-_. ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length > maxLength
    ? cleaned.slice(0, maxLength).trim()
    : cleaned;
};

// Chapa rejects tx_ref values over 50 characters. A full UUID (36 chars)
// plus our "dawuroda-<prefix>-" prefix blew past that on every single
// donation/payment attempt (e.g. "dawuroda-donation-<uuid>" is 54 chars) —
// this was a hard, permanent failure, not an edge case. 24 hex chars (96
// bits, still a UUID's own random bytes, just not hyphenated/truncated to
// the full 36) keeps every prefix comfortably under the limit while staying
// just as cryptographically unguessable for the donation-certificate token
// use case below.
export const generateTxRef = (prefix: string): string =>
  `dawuroda-${prefix}-${randomUUID().replace(/-/g, "").slice(0, 24)}`;

// Chapa rejects transaction/initialize with 400 "Transaction reference has
// been used before" if a tx_ref is ever submitted twice — which happens in
// practice from a donor/member double-clicking Pay before a button disables,
// or a dropped response causing a resend of the same request. Since every
// caller generates its own tx_ref right before this call, one retry with a
// freshly generated tx_ref is always safe and turns that whole failure class
// into a transparent success instead of a hard error the donor sees.
export async function initializeChapaTransaction(
  txRefPrefix: string,
  buildPayload: (txRef: string) => Record<string, unknown>
): Promise<AxiosResponse> {
  const post = (txRef: string) =>
    axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      JSON.stringify(buildPayload(txRef)),
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

  try {
    return await post(generateTxRef(txRefPrefix));
  } catch (err: any) {
    const chapaMessage = err?.response?.data?.message;
    const isDuplicateTxRef =
      err?.response?.status === 400 &&
      typeof chapaMessage === "string" &&
      chapaMessage.toLowerCase().includes("transaction reference");
    if (!isDuplicateTxRef) throw err;

    return await post(generateTxRef(txRefPrefix));
  }
}

// Chapa's error `message` is usually a plain string, but for field-validation
// failures it comes back as a nested object (one entry per invalid field)
// instead — never safe to hand straight to a toast, so fall back to a
// generic message whenever it isn't a plain string.
export const chapaErrorMessage = (err: any, fallback: string): string => {
  const message = err?.response?.data?.message;
  return typeof message === "string" ? message : fallback;
};
