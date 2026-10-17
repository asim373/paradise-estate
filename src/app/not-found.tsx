import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() { return <main className="flex min-h-[70vh] items-center justify-center px-6 pt-24 text-center"><div><p className="eyebrow text-taupe">404 · Not found</p><h1 className="mt-5 font-serif text-5xl">This address is not on our map.</h1><p className="mx-auto mt-5 max-w-md text-sm leading-7 text-taupe">The page you are looking for may have moved, or it may be part of a future collection.</p><Link className="button button-dark mt-8" href="/properties">Return to properties</Link></div></main>; }
