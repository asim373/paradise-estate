import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/types/property";
import { formatNumber, formatPrice, propertyPath } from "@/lib/format";

export function PropertyCard({ property }: { property: Property }) {
  return <article className="group min-w-0">
    <Link href={propertyPath(property.cityId, property.slug)} className="block focus-ring">
      <div className="image-frame aspect-[4/3]"><Image src={property.image} alt={property.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" /><span className="absolute left-4 top-4 bg-white/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-charcoal">{property.propertyType}</span></div>
      <div className="pt-5"><div className="flex items-start justify-between gap-4"><h3 className="min-w-0 font-serif text-[21px] leading-tight text-charcoal">{property.name}</h3><span className="shrink-0 pt-1 text-lg text-charcoal">↗</span></div><p className="mt-2 text-[14px] text-taupe">{property.address} · {property.city}, {property.state}</p><p className="mt-4 text-[17px] font-medium text-charcoal">{formatPrice(property.price)}</p><div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-charcoal/10 pt-4 text-[13px] uppercase tracking-[0.08em] text-taupe"><span>{property.specifications.bedrooms} beds</span><span>{property.specifications.fullBathrooms + property.specifications.halfBathrooms * 0.5} baths</span><span>{formatNumber(property.specifications.interiorSquareFeet)} sq ft</span></div></div>
    </Link>
  </article>;
}
