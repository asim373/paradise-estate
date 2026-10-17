import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PropertyCarousel } from "@/components/PropertyCarousel";
import { PropertySpecifications } from "@/components/PropertySpecifications";
import { properties } from "@/data/properties";
import { getDatabaseProperty } from "@/lib/property-api";
import { formatNumber, formatPrice } from "@/lib/format";

export function generateStaticParams() { return properties.map((property) => ({ city: property.cityId, slug: property.slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ city: string; slug: string }> }): Promise<Metadata> {
  const { city, slug } = await params; const property = await getDatabaseProperty(city, slug); if (!property) return {};
  return { title: `${property.name} | Paradise Estate`, description: `${property.name}, a considered ${property.propertyType.toLowerCase()} in ${property.city}, ${property.state}.` };
}

export default async function PropertyPage({ params }: { params: Promise<{ city: string; slug: string }> }) {
  const { city: cityId, slug } = await params; const property = await getDatabaseProperty(cityId, slug); if (!property) notFound();
  const { specifications } = property;
  return <main className="pt-24">
    <section className="page-shell grid gap-8 py-8 lg:grid-cols-[1.2fr_.8fr]">
      <div>
        <PropertyCarousel images={property.gallery} alts={property.galleryAlt} propertyName={property.name} />
        <div className="mt-3 flex items-end bg-beige p-8"><p className="w-full font-serif text-2xl leading-tight text-center">{property.editorialQuote}</p></div>
      </div>
      <div className="flex flex-col justify-center px-2 py-8 lg:px-8">
        <Link className="eyebrow text-taupe" href={`/properties/${property.cityId}`}>← {property.city}, {property.state}</Link>
        <p className="eyebrow mt-10 text-taupe">{property.propertyType}</p>
        <h1 className="mt-4 font-serif text-5xl leading-[1.05] sm:text-6xl">{property.name}</h1>
        <p className="mt-4 text-sm text-taupe">{property.address}</p>
        <p className="mt-8 font-serif text-3xl">{formatPrice(property.price)}</p>
        <div className="mt-8 grid grid-cols-3 border-y border-charcoal/10 py-5 text-[13px] uppercase tracking-[.1em] text-taupe"><span>{specifications.bedrooms} beds</span><span>{specifications.fullBathrooms} baths</span><span>{formatNumber(specifications.interiorSquareFeet)} sq ft</span></div>
        <Link className="button button-dark mt-8 self-start" href={`/contact?property=${property.slug}`}>Schedule a viewing <span aria-hidden="true">↗</span></Link>
      </div>
    </section>

    <section className="bg-white"><div className="page-shell grid gap-14 py-20 sm:py-28 lg:grid-cols-[1fr_1fr]"><div><p className="eyebrow text-taupe">The residence</p><h2 className="mt-4 font-serif text-4xl">{property.editorialHeading}</h2><p className="prose-copy mt-7">{property.description}</p><p className="mt-6 max-w-lg text-sm leading-7 text-taupe">{property.editorialNote}</p></div><div><div className="border border-charcoal/10 bg-ivory p-7"><p className="eyebrow text-taupe">Location</p><p className="mt-4 font-serif text-2xl">{property.city}, {property.state}</p><p className="mt-2 text-sm leading-6 text-taupe">An illustrative location selected for its architectural character and connection to the city.</p></div></div></div></section>
    <PropertySpecifications specifications={specifications} />
  </main>;
}
