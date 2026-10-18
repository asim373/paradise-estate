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
  ["Architecture with Purpose", "Thoughtful proportions, natural light, and considered materials create homes that are as functional as they are beautiful."],
  ["A Sense of Place", "We look to the character of a neighborhood, its landscape, and the rituals that make a place distinctive."],
  ["Relationships That Matter", "Careful attention, clear communication, and a deep understanding of priorities make property discovery feel more personal."],
];

function PrincipleIcon({ index }: { index: number }) {
  return <span className="flex h-14 w-14 items-center justify-center rounded-full bg-beige/15 text-beige"><svg aria-hidden="true" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">{index === 0 ? <><circle cx="12" cy="12" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="m15 9-2 4-4 2 2-4 4-2Z" /></> : index === 1 ? <><circle cx="12" cy="8" r="3.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M5 20v-2a7 7 0 0 1 14 0v2" /></> : index === 2 ? <><path strokeLinecap="round" strokeLinejoin="round" d="M3 18h18M5 15a7 7 0 0 1 14 0M12 3v3M4.5 8.5l2.1 1.2M19.5 8.5l-2.1 1.2" /></> : index === 3 ? <><path strokeLinecap="round" strokeLinejoin="round" d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z" /></> : index === 4 ? <><path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></> : <><circle cx="8" cy="8" r="3" /><circle cx="16" cy="8" r="3" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 20a5 5 0 0 1 10 0M11 20a5 5 0 0 1 10 0" /></>}</svg></span>;
}

export default function AboutPage() {
  return <main className="pt-24">
    <section className="page-shell py-24 sm:py-32">
      <p className="eyebrow text-taupe">About Paradise Estate</p>
      <h1 className="mt-5 max-w-4xl font-serif text-6xl leading-[1.04] sm:text-8xl">A more thoughtful<br /><em className="font-normal text-taupe">way home.</em></h1>
      <p className="prose-copy mt-8">Paradise Estate is a luxury real estate website concept designed to showcase an elegant and intuitive property discovery experience. Explore a curated collection of distinctive homes across four major U.S. cities, with detailed listings, immersive galleries, and thoughtfully organized property information.</p>
      <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-9 sm:grid-cols-3">
        <div className="flex items-center gap-3"><svg aria-hidden="true" className="h-6 w-6 shrink-0 text-beige" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z" /></svg><div><p className="font-serif text-3xl leading-none">8</p><p className="mt-2 text-xs text-taupe">Premium properties</p></div></div>
        <div className="flex items-center gap-3"><svg aria-hidden="true" className="h-6 w-6 shrink-0 text-beige" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" /></svg><div><p className="font-serif text-3xl leading-none">4</p><p className="mt-2 text-xs text-taupe">Major cities</p></div></div>
        <div className="flex items-center gap-3"><svg aria-hidden="true" className="h-6 w-6 shrink-0 text-beige" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" /></svg><div><p className="font-serif text-3xl leading-none">24/7</p><p className="mt-2 text-xs text-taupe">Expert Support</p></div></div>
      </div>
    </section>
    <section className="bg-charcoal text-white"><div className="page-shell grid gap-12 py-16 sm:py-20 lg:grid-cols-[1fr_1fr] lg:items-center"><div className="image-frame aspect-[4/3]"><Image src="/images/editorial-library.jpg" alt="Warm architectural library with a limestone fireplace and garden view" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div><div><p className="eyebrow text-beige">Our philosophy</p><h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">Luxury is not a look. It is a feeling of fit.</h2><p className="mt-7 text-base leading-8 text-white/65">Luxury feels most lasting when it belongs naturally to its setting and supports the rhythms of everyday life.</p><p className="mt-6 text-base leading-8 text-white/65">We focus on architecture, materiality, light, and the quiet details that give a residence its sense of ease.</p><p className="mt-6 text-base leading-8 text-white/65">This portfolio explores thoughtful design, distinctive places, and a more considered way to discover a home.</p></div></div></section>
    <section className="page-shell grid gap-5 py-24 sm:py-32 md:auto-rows-fr md:grid-cols-2 xl:grid-cols-3">{principles.map(([title, copy], index) => <article key={title} className="h-full rounded-md border border-beige/35 bg-[#F8F5F0] p-5 sm:p-6 xl:p-7"><PrincipleIcon index={index} /><h2 className="mt-4 font-serif text-3xl">{title}</h2><p className="mt-2 text-sm leading-7 text-taupe">{copy}</p></article>)}</section>
    <section className="bg-beige"><div className="page-shell py-16"><h2 className="max-w-xl font-serif text-4xl">Let&apos;s find a place that feels like yours.</h2></div></section>
  </main>;
}
