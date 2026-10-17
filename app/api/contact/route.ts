import { site } from "@/content/site";

/**
 * Receives the contact form and emails it via Resend (https://resend.com).
 *
 * Required environment variables (set them in the Vercel project settings):
 *   RESEND_API_KEY   - API key from Resend
 *   CONTACT_TO_EMAIL - where messages should be delivered
 * Optional:
 *   CONTACT_FROM_EMAIL - verified sender, e.g. "Karl Shouler <hello@kshopho.com>"
 *                        (defaults to Resend's shared onboarding address)
 */

const MIN_FILL_TIME_MS = 2000;

function json(ok: boolean, message: string, status = 200) {
  return Response.json({ ok, message }, { status });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(false, "That submission could not be read.", 400);
  }

  const name = String(form.get("name") ?? "").trim().slice(0, 200);
  const email = String(form.get("email") ?? "").trim().slice(0, 320);
  const message = String(form.get("message") ?? "").trim().slice(0, 10000);
  const honeypot = String(form.get("_hp") ?? "");
  const renderedAt = Number(form.get("_ts"));

  // Bots fill the hidden field or submit faster than a person could type.
  const tooFast = Number.isFinite(renderedAt) && renderedAt > 0 && Date.now() - renderedAt < MIN_FILL_TIME_MS;
  if (honeypot || tooFast) {
    return json(true, "Thanks! Your message has been sent.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(false, "Please enter a valid email address.", 400);
  }
  if (!message) {
    return json(false, "Please include a message.", 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("Contact form: RESEND_API_KEY and CONTACT_TO_EMAIL must be set.");
    return json(false, "Sorry, the contact form isn't set up yet. Please reach out another way.", 503);
  }
  const from = process.env.CONTACT_FROM_EMAIL ?? `${site.title} <onboarding@resend.dev>`;

  const subject = `New message from ${name || email} via ${site.url.replace(/^https?:\/\//, "")}`;
  const text = `Name: ${name || "(not given)"}\nEmail: ${email}\n\n${message}`;
  const html = `<p><strong>Name:</strong> ${escapeHtml(name || "(not given)")}<br><strong>Email:</strong> ${escapeHtml(
    email,
  )}</p><p>${escapeHtml(message).replaceAll("\n", "<br>")}</p>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject, text, html }),
    });
    if (!res.ok) {
      console.error("Contact form: Resend responded", res.status, await res.text());
      return json(false, "Sorry, something went wrong sending your message. Please try again.", 502);
    }
  } catch (error) {
    console.error("Contact form: request failed", error);
    return json(false, "Sorry, something went wrong sending your message. Please try again.", 502);
  }

  return json(true, "Thanks! Your message has been sent.");
}
