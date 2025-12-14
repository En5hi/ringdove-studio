"use server";

import { Resend } from "resend";
import { z } from "zod";

const contactSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Valid email required"),
    message: z.string().min(10, "Please share a few details"),
    honey: z.string().max(0, "Spam detected"),
    startedAt: z.coerce.number().optional()
  })
  .refine(
    (data) => {
      if (!data.startedAt) return true;
      const elapsed = Date.now() - data.startedAt;
      return elapsed > 1500;
    },
    { message: "Too quick, please try again." }
  );

const resendApiKey = process.env.RESEND_API_KEY;
const toEmail = process.env.CONTACT_TO_EMAIL;

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export type ContactResult =
  | { ok: true }
  | { ok: false; error: string; fields?: Record<string, string> };

export async function sendContactEmail(formData: FormData): Promise<ContactResult> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    honey: formData.get("honey") ?? "",
    startedAt: formData.get("startedAt")
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.errors.at(0);
    return { ok: false, error: first?.message ?? "Invalid input", fields: { [first?.path[0] ?? "form"]: first?.message ?? "" } };
  }

  if (!resend || !toEmail) {
    return { ok: false, error: "Email service not configured" };
  }

  try {
    await resend.emails.send({
      from: "Ringdove Studio <studio@ringdove.example>",
      to: [toEmail],
      reply_to: parsed.data.email,
      subject: `New inquiry from ${parsed.data.name}`,
      text: `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\n\nMessage:\n${parsed.data.message}`
    });
    return { ok: true };
  } catch (error) {
    console.error("Resend error", error);
    return { ok: false, error: "Unable to send right now. Please try again." };
  }
}
