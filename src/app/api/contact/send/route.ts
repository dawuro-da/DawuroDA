import { NextResponse } from "next/server";
import { transporter } from "@/services/nodemailer";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const html = `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject || "(no subject)")}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(String(message)).replace(/\n/g, "<br />")}</p>
    `;

    const result = await transporter.sendMail({
      to: "info@dawuroda.org",
      from: process.env.NODEMAIL_EMAIL,
      replyTo: email,
      subject: `New Contact Message: ${subject || "No subject"}`,
      html,
    });

    if (result) {
      return NextResponse.json({ success: true }, { status: 200 });
    }
    return NextResponse.json(
      { success: false, error: "Unable to send message" },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      { success: false, error: "Unable to send message" },
      { status: 500 }
    );
  }
}
