"use client";

import { useEffect, useState, useTransition } from "react";
import type { ContactCopy } from "../../lib/i18n";
import { sendContactEmail } from "../../lib/email/sendContactEmail";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

type ContactProps = {
  copy: ContactCopy;
};

type Status = "idle" | "success" | "error";

export function Contact({ copy }: ContactProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [startedAt, setStartedAt] = useState<number>(() => Date.now());

  useEffect(() => {
    setStartedAt(Date.now());
  }, []);

  const onSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      formData.set("startedAt", String(startedAt));
      const result = await sendContactEmail(formData);
      if (result.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setError(result.error);
      }
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-start gap-6 text-left">
      <div className="flex flex-col gap-3">
        <h2 className="font-display text-4xl uppercase tracking-[0.12em]">{copy.heading}</h2>
        <p className="text-white/75">{copy.intro}</p>
      </div>
      <form action={onSubmit} className="grid w-full gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-left">
          <span className="text-sm text-muted">{copy.fields.name}</span>
          <Input name="name" required minLength={2} placeholder="Alex Doe" disabled={pending} />
        </label>
        <label className="flex flex-col gap-2 text-left">
          <span className="text-sm text-muted">{copy.fields.email}</span>
          <Input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            disabled={pending}
          />
        </label>
        <label className="md:col-span-2 flex flex-col gap-2 text-left">
          <span className="text-sm text-muted">{copy.fields.message}</span>
          <Textarea
            name="message"
            required
            minLength={10}
            placeholder="Project goals, timeline, links..."
            disabled={pending}
          />
        </label>
        <input type="text" name="honey" aria-hidden defaultValue="" className="hidden" />
        <input type="hidden" name="startedAt" value={startedAt} />
        <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit" disabled={pending}>
            {pending ? "Sending..." : copy.cta}
          </Button>
          <div className="text-sm text-muted">
            {status === "success" && <span className="text-accent">{copy.success}</span>}
            {status === "error" && <span className="text-red-300">{error ?? copy.error}</span>}
          </div>
        </div>
      </form>
    </div>
  );
}
