import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Paradise Estate",
  description: "Learn about Paradise Estate's thoughtful approach to architecture, place, and a more personal real-estate experience.",
};

const principles = [
  ["A clear point of view", "A focused edit of residences chosen for their design integrity, atmosphere, and relationship to place."],
  ["Personal attention", "A search shaped around your rhythms, priorities, and the feeling you want your next home to create."],
  ["The long view", "A belief that a well-chosen home becomes more meaningful as your life within it expands."],
  ["Architecture with Purpose", "We value homes where architecture serves both beauty and everyday living. Thoughtful proportions, natural light, and carefully considered materials create spaces that feel as functional as they are exceptional."],
  ["A Sense of Place", "Every remarkable home belongs to a larger story. We consider the character of its neighborhood, its connection to the landscape, and the experiences that make its surroundings distinctive."],
  ["Relationships That Matter", "Our approach begins with understanding individual priorities and aspirations. We believe meaningful guidance, careful attention, and clear communication are essential to a more personal real-estate experience."],
];

export default function AboutPage() {
  return <main className="pt-24">
    <section className="page-shell py-24 sm:py-32"><p className="eyebrow text-taupe">About Paradise Estate</p><h1 className="mt-5 max-w-4xl font-serif text-6xl leading-[1.04] sm:text-8xl">A more thoughtful<br /><em className="font-normal text-taupe">way home.</em></h1><p className="prose-copy mt-8">Paradise Estate is a considered luxury real estate house focused on the intersection of exceptional architecture and thoughtful client service.</p></section>
    <section className="bg-charcoal text-white"><div className="page-shell grid gap-12 py-16 sm:py-20 lg:grid-cols-[1fr_1fr] lg:items-center"><div className="image-frame aspect-[4/3]"><Image src="/images/editorial-library.jpg" alt="Warm architectural library with a limestone fireplace and garden view" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div><div><p className="eyebrow text-beige">Our philosophy</p><h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">Luxury is not a look. It is a feeling of fit.</h2><p className="mt-7 text-base leading-8 text-white/65">We look beyond the obvious markers of prestige. The homes that stay with us are the ones that understand their setting, make daily life feel more natural, and offer a sense of arrival every time you return.</p><p className="mt-6 text-base leading-8 text-white/65">Our team pairs careful listening with a deep appreciation for architecture, landscape, and the quieter details that make a property feel distinctly yours.</p><p className="mt-6 text-base leading-8 text-white/65">At Paradise Estate, we believe exceptional real estate is about more than finding a beautiful address. It is about understanding individual aspirations, recognizing lasting quality, and connecting people with spaces that reflect how they truly want to live. Every property in our curated collection represents our commitment to thoughtful design, meaningful experiences, and a more personal approach to luxury living.</p></div></div></section>
    <section className="page-shell grid gap-12 py-24 sm:py-32 md:grid-cols-2 lg:grid-cols-3">{principles.map(([title, copy]) => <div key={title}><h2 className="font-serif text-3xl">{title}</h2><p className="mt-4 text-sm leading-7 text-taupe">{copy}</p></div>)}</section>
    <section className="bg-beige"><div className="page-shell py-16"><h2 className="max-w-xl font-serif text-4xl">Let&apos;s find a place that feels like yours.</h2></div></section>
  </main>;
}
