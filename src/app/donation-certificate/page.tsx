"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Button, CircularProgress } from "@mui/material";
import { Download, PictureAsPdf, Favorite } from "@mui/icons-material";
import Navigation from "@/landingPage/navigation/Navigation";
import Footer from "@/landingPage/footer/Footer";
import {
  CertificateData,
  drawCertificate,
  downloadCertificatePdf,
  downloadCertificatePng,
} from "@/util/renderCertificateCanvas";

interface Donation {
  id: string;
  fullName: string;
  amount: number;
  donationDesignation: string;
  created_at: string;
  campaign?: { headlineAmharic: string } | null;
}

// The webhook that records the donation and the browser redirect back here
// happen independently — the redirect can arrive slightly before the
// webhook finishes, so this polls briefly instead of failing on the first
// miss.
const POLL_ATTEMPTS = 6;
const POLL_DELAY_MS = 2500;

// Certificates are only generated for donations above this amount — smaller
// donations still get a thank-you page, just no certificate to download.
const CERTIFICATE_MIN_AMOUNT = 500;

const CertificateContent = () => {
  const searchParams = useSearchParams();
  const txRef = searchParams.get("tx_ref");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [donation, setDonation] = useState<Donation | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "not_found">(
    "loading"
  );
  const [downloading, setDownloading] = useState<"png" | "pdf" | null>(null);

  useEffect(() => {
    if (!txRef) {
      setStatus("not_found");
      return;
    }
    let cancelled = false;

    const fetchDonation = async (attempt: number) => {
      try {
        const res = await axios.post("/api/donation/fetch/byTxRef", {
          txRef,
        });
        if (cancelled) return;
        if (res.data.success) {
          setDonation(res.data.value);
          setStatus("ready");
          return;
        }
      } catch {
        // fall through to retry
      }
      if (cancelled) return;
      if (attempt < POLL_ATTEMPTS) {
        setTimeout(() => fetchDonation(attempt + 1), POLL_DELAY_MS);
      } else {
        setStatus("not_found");
      }
    };

    fetchDonation(1);
    return () => {
      cancelled = true;
    };
  }, [txRef]);

  const isEligibleForCertificate =
    Boolean(donation) && donation!.amount > CERTIFICATE_MIN_AMOUNT;

  // Prefer the linked campaign's Amharic headline over the raw designation —
  // the certificate's wording is otherwise entirely in Amharic, and a
  // free-text designation (no campaign) is only ever in whatever language
  // the donor typed, so there's no Amharic version to fall back to there.
  const displayDesignation =
    donation?.campaign?.headlineAmharic || donation?.donationDesignation || "";

  useEffect(() => {
    if (
      status !== "ready" ||
      !donation ||
      !isEligibleForCertificate ||
      !canvasRef.current
    )
      return;
    const data: CertificateData = {
      donorName: donation.fullName,
      amount: donation.amount,
      designation: displayDesignation,
    };
    drawCertificate(canvasRef.current, data);
  }, [status, donation]);

  const fileName = donation
    ? `DawuroDA-Certificate-${donation.fullName.replace(/\s+/g, "-")}`
    : "DawuroDA-Certificate";

  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    setDownloading("png");
    downloadCertificatePng(canvasRef.current, fileName);
    setDownloading(null);
  };

  const handleDownloadPdf = async () => {
    if (!canvasRef.current) return;
    setDownloading("pdf");
    await downloadCertificatePdf(canvasRef.current, fileName);
    setDownloading(null);
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 w-full flex flex-col items-center justify-center py-16 px-4 gap-8 bg-[#f5f5f5]">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4 text-titleColor">
            <CircularProgress />
            <span>Confirming your donation…</span>
          </div>
        )}

        {status === "not_found" && (
          <div className="max-w-lg text-center flex flex-col items-center gap-3">
            <h1 className="text-2xl font-bold text-titleColor">
              We couldn&apos;t find this donation yet
            </h1>
            <p className="text-titleColor">
              If you just completed a payment, it can take a minute to
              confirm. Please check your email, or contact us at{" "}
              <a
                href="mailto:info@dawuroda.org"
                className="text-primaryColor underline"
              >
                info@dawuroda.org
              </a>{" "}
              if this persists.
            </p>
          </div>
        )}

        {status === "ready" && donation && isEligibleForCertificate && (
          <>
            <div className="w-full max-w-4xl overflow-x-auto">
              <canvas
                ref={canvasRef}
                className="w-full h-auto border border-[#e0e0e0] shadow-lg rounded"
              />
            </div>
            <div className="flex flex-row gap-4">
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleDownloadPng}
                disabled={downloading !== null}
                className="bg-primaryColor capitalize"
              >
                {downloading === "png" ? (
                  <CircularProgress size={20} className="text-white" />
                ) : (
                  "Download PNG"
                )}
              </Button>
              <Button
                variant="outlined"
                startIcon={<PictureAsPdf />}
                onClick={handleDownloadPdf}
                disabled={downloading !== null}
                className="border-primaryColor text-primaryColor capitalize"
              >
                {downloading === "pdf" ? (
                  <CircularProgress size={20} />
                ) : (
                  "Download PDF"
                )}
              </Button>
            </div>
          </>
        )}

        {status === "ready" && donation && !isEligibleForCertificate && (
          <div className="max-w-lg text-center flex flex-col items-center gap-3">
            <Favorite className="text-primaryColor" style={{ fontSize: 48 }} />
            <h1 className="text-3xl font-bold text-titleColor">
              Thank You, {donation.fullName}!
            </h1>
            <p className="text-titleColor">
              Your donation of {donation.amount.toLocaleString()} ETB
              {displayDesignation ? ` towards ${displayDesignation}` : ""}{" "}
              means a lot to us and the community we serve. We truly
              appreciate your generosity.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default function DonationCertificatePage() {
  return (
    <Suspense>
      <CertificateContent />
    </Suspense>
  );
}
