"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cities } from "@/data/properties";

const mobileNavigationId = "mobile-navigation";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const onHero = pathname === "/";

  useEffect(() => {
    function closeOnOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setPropertiesOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setPropertiesOpen(false);
      }
    }
    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    if (mobileOpen) firstMobileLinkRef.current?.focus();
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeMenus = () => { setMobileOpen(false); setPropertiesOpen(false); };
  const mobileLinks = [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { label: "Communities", href: "/communities" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className={`absolute inset-x-0 top-0 z-30 border-b ${onHero ? "header-on-hero border-white/20 text-white" : "header-on-light border-charcoal/10 text-charcoal"}`}>
      <div className="page-shell flex h-24 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-serif text-2xl tracking-[0.08em]" onClick={closeMenus}>
          <svg aria-hidden="true" className="h-5 w-5 shrink-0 text-beige" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
            <path strokeLinecap="round" strokeLinejoin="round" d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z" />
          </svg>
          <span>Paradise Estate</span>
        </Link>

        <nav className="hidden items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.18em] xl:flex" aria-label="Primary navigation">
          <Link className="nav-link" href="/">Home</Link>
          <div className="relative" ref={menuRef}>
            <button type="button" className="nav-link inline-flex items-center gap-2" aria-expanded={propertiesOpen} aria-haspopup="menu" onClick={() => setPropertiesOpen((open) => !open)}>
              Properties <span aria-hidden="true">⌄</span>
            </button>
            {propertiesOpen && <div className="absolute left-0 top-full mt-5 w-56 border border-charcoal/10 bg-ivory p-2 text-charcoal shadow-2xl" role="menu">
              {cities.map((city) => <Link key={city.id} href={`/properties/${city.id}`} className="menu-link" role="menuitem" onClick={closeMenus}>{city.name}</Link>)}
              <Link href="/properties" className="menu-link border-t border-charcoal/10" role="menuitem" onClick={closeMenus}>All Properties</Link>
            </div>}
          </div>
          <Link className="nav-link" href="/communities">Communities</Link>
          <Link className="nav-link" href="/about">About Us</Link>
          <Link className="nav-link" href="/contact">Contact</Link>
        </nav>

        <button type="button" className={`relative z-50 flex h-11 w-11 items-center justify-center border text-xl xl:hidden ${onHero ? "border-white/40" : "border-charcoal/30"}`} aria-expanded={mobileOpen} aria-controls={mobileNavigationId} aria-label={mobileOpen ? "Close navigation" : "Open navigation"} onClick={() => setMobileOpen((open) => !open)}>
          {mobileOpen ? "×" : "☰"}
        </button>
      </div>

      {mobileOpen && <div id={mobileNavigationId} className="fixed inset-x-0 bottom-0 top-24 z-40 overflow-y-auto bg-charcoal px-6 py-8 text-white shadow-2xl xl:hidden">
        <nav className="page-shell flex flex-col" aria-label="Mobile navigation">
          {mobileLinks.map((link, index) => <Link key={link.href} ref={index === 0 ? firstMobileLinkRef : undefined} className="mobile-nav-link" href={link.href} aria-current={pathname === link.href ? "page" : undefined} onClick={closeMenus}>{link.label}</Link>)}
        </nav>
      </div>}
    </header>
  );
}
