import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { properties } from "@/data/properties";

export const metadata: Metadata = { title: "Contact | Paradise Estate", description: "Begin a considered property conversation with Paradise Estate." };

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ property?: string }> }) {
  const { property: slug } = await searchParams;
  const selected = slug ? properties.find((item) => item.slug === slug) : undefined;
  const initialProperty = selected ? { cityId: selected.cityId, slug: selected.slug, name: selected.name } : undefined;
  return <main className="pt-24"><section className="page-shell py-24 sm:py-32"><p className="eyebrow text-taupe">Begin a conversation</p><h1 className="mt-5 max-w-3xl font-serif text-6xl leading-tight sm:text-8xl">Tell us what<br /><em className="font-normal text-taupe">you&apos;re looking for.</em></h1><p className="prose-copy mt-8">Whether you have a particular address in mind or are still finding your direction, a good conversation is a beautiful place to begin.</p></section><section className="bg-white"><div className="page-shell grid gap-14 py-20 sm:py-28 lg:grid-cols-[.7fr_1.3fr]"><div><p className="eyebrow text-taupe">Your brief</p><h2 className="mt-4 font-serif text-4xl">A considered beginning.</h2><p className="mt-5 text-sm leading-7 text-taupe">Share a few details and we will shape the conversation around what matters to you.</p></div><ContactForm initialProperty={initialProperty} /></div></section></main>;
}
