import Link from "next/link";
import { cities } from "@/data/properties";

export function Footer() {
  return <footer className="bg-charcoal text-white">
    <div className="page-shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div><Link href="/" className="font-serif text-2xl tracking-[0.08em]">Paradise Estate</Link><p className="mt-5 max-w-xs text-sm leading-7 text-white/70">A considered collection of American luxury residences, selected for character, craftsmanship, and a sense of place.</p></div>
      <div><p className="eyebrow text-beige">Explore</p><div className="mt-5 flex flex-col gap-3 text-sm text-white/80"><Link className="footer-link" href="/">Home</Link><Link className="footer-link" href="/properties">All properties</Link><Link className="footer-link" href="/communities">Communities</Link><Link className="footer-link" href="/about">About Us</Link><Link className="footer-link" href="/contact">Contact</Link></div></div>
      <div><p className="eyebrow text-beige">Cities</p><div className="mt-5 flex flex-col gap-3 text-sm text-white/80">{cities.map((city) => <Link className="footer-link" key={city.id} href={`/properties/${city.id}`}>{city.name}</Link>)}</div></div>
      <div><p className="eyebrow text-beige">A considered beginning</p><p className="mt-5 text-sm leading-7 text-white/70">Tell us what you are looking for and we will shape the search around it.</p><Link className="button button-outline mt-6" href="/contact">Get in touch <span aria-hidden="true">↗</span></Link></div>
    </div>
    <div className="page-shell flex flex-col gap-3 border-t border-white/10 py-6 text-xs uppercase tracking-[0.12em] text-white/55 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 Paradise Estate</span><span>Considered residences across four American cities</span></div>
  </footer>;
}
