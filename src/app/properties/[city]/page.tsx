import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cities, getCity } from "@/data/properties";
import { PropertyCard } from "@/components/PropertyCard";
import { getDatabaseProperties } from "@/lib/property-api";
import type { CityId } from "@/types/property";

export function generateStaticParams() { return cities.map((city) => ({ city: city.id })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: cityId } = await params; const city = getCity(cityId); if (!city) return {};
  return { title: `${city.name} Properties | Paradise Estate`, description: `Explore considered luxury residences in ${city.name}, ${city.state}, curated by Paradise Estate.` };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: cityId } = await params; const city = getCity(cityId); if (!city) notFound();
  const cityProperties = await getDatabaseProperties({ cityId: city.id as CityId });
  return <main className="pt-24"><section className="relative flex min-h-[520px] items-end overflow-hidden bg-charcoal text-white"><Image src={city.image} alt={city.alt} fill priority sizes="100vw" className="object-cover" /><div className="hero-overlay absolute inset-0" /><div className="page-shell relative z-10 w-full pb-20"><p className="eyebrow text-beige">{city.state} · Paradise Estate</p><h1 className="mt-5 font-serif text-6xl sm:text-8xl">{city.name}</h1><p className="mt-5 max-w-lg text-base leading-7 text-white/75">{city.introduction}</p></div></section><section className="page-shell py-20 sm:py-28"><div className="flex flex-col justify-between gap-5 border-b border-charcoal/10 pb-8 sm:flex-row sm:items-end"><div><p className="eyebrow text-taupe">The {city.name} collection</p><h2 className="mt-3 font-serif text-4xl">{city.tagline}</h2></div><Link className="text-sm font-semibold underline underline-offset-8" href="/properties">View all properties ↗</Link></div>{cityProperties.length ? <div className="mt-14 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">{cityProperties.map((property) => <PropertyCard property={property} key={property.id} />)}</div> : <div className="py-20 text-center"><p className="font-serif text-3xl">A new collection is taking shape.</p></div>}</section></main>;
}
