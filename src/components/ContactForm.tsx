"use client";

import { useRef, useState } from "react";
import { cities, properties } from "@/data/properties";

type InitialProperty = { cityId: string; slug: string; name: string };

export function ContactForm({ initialProperty }: { initialProperty?: InitialProperty }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interest, setInterest] = useState(initialProperty?.name || "Choose a city or property");
  const idempotencyKey = useRef<string | null>(null);
  if (submitted) return <div className="border border-charcoal/10 bg-white p-8" role="status" aria-live="polite"><p className="eyebrow text-taupe">Inquiry received</p><h2 className="mt-4 font-serif text-3xl">Inquiry received</h2><p className="mt-4 text-sm leading-7 text-taupe">Thank you for reaching out. Your inquiry has been successfully submitted.</p><button className="button button-dark mt-7" type="button" onClick={() => setSubmitted(false)}>Send another note</button></div>;
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSubmitting(true); setError(null);
    const form = new FormData(event.currentTarget);
    const selected = properties.find((property) => property.name === form.get("interest"));
    const body = { name: String(form.get("name") || ""), email: String(form.get("email") || ""), phone: String(form.get("phone") || ""), message: String(form.get("message") || ""), ...(selected ? { cityId: selected.cityId, slug: selected.slug } : initialProperty ? { cityId: initialProperty.cityId, slug: initialProperty.slug } : {}) };
    idempotencyKey.current ??= crypto.randomUUID();
    try { const response = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey.current }, body: JSON.stringify(body) }); const payload = await response.json() as { error?: { message?: string } }; if (!response.ok) throw new Error(payload.error?.message || "Unable to submit your inquiry."); setSubmitted(true); idempotencyKey.current = null; event.currentTarget.reset(); } catch (submitError: unknown) { setError(submitError instanceof Error ? submitError.message : "Unable to submit your inquiry."); } finally { setSubmitting(false); }
  }
  return <form className="grid gap-5" onSubmit={submit}>
    <div className="grid gap-5 sm:grid-cols-2"><label htmlFor="contact-name">Name<input id="contact-name" required name="name" autoComplete="name" placeholder="Your name" /></label><label htmlFor="contact-email">Email<input id="contact-email" required type="email" name="email" autoComplete="email" placeholder="you@example.com" /></label></div>
    <div className="grid items-start gap-5 sm:grid-cols-2"><label htmlFor="contact-phone"><span>Phone <span className="font-normal normal-case tracking-normal text-taupe">(optional)</span></span><input id="contact-phone" type="tel" name="phone" autoComplete="tel" placeholder="(555) 000-0000" /></label><label htmlFor="contact-interest"><span>Interested in</span><select id="contact-interest" name="interest" value={interest} onChange={(event) => setInterest(event.target.value)}><option>Choose a city or property</option>{cities.map((city) => <option key={city.id}>{city.name}</option>)}{properties.map((property) => <option key={property.id}>{property.name}</option>)}</select></label></div>
    <label htmlFor="contact-message">Message<textarea id="contact-message" required name="message" rows={5} placeholder="Tell us a little about what you are looking for." /></label>
    {error && <p className="text-sm text-charcoal" role="alert">{error}</p>}
    <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center"><p className="max-w-sm text-xs leading-5 text-taupe">Your inquiry is sent securely.</p><button className="button button-dark" type="submit" disabled={submitting}>{submitting ? "Sending…" : "Send inquiry"}</button></div>
  </form>;
}
