import type { Metadata } from "next";
import { SearchFilters } from "@/components/SearchFilters";
import { getDatabaseProperties, parseSearchFilters } from "@/lib/property-api";

export const metadata: Metadata = { title: "Properties | Paradise Estate", description: "Explore the Paradise Estate collection of considered luxury residences across four American cities." };

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const values = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) if (typeof value === "string") query.set(key, value);
  const properties = await getDatabaseProperties();
  let initialFilteredProperties = properties;
  try {
    const filters = parseSearchFilters(query);
    if (Object.values(filters).some((value) => value !== undefined)) initialFilteredProperties = await getDatabaseProperties(filters);
  } catch { /* Client controls remain usable for invalid URLs. */ }
  const initial = { city: query.get("city") ?? "all", price: query.get("price") ?? "all", type: query.get("type") ?? "all", bedrooms: query.get("bedrooms") ?? "all", search: query.get("q") ?? "" };
  return <main className="pt-24"><section className="bg-charcoal py-24 text-white sm:py-32"><div className="page-shell"><p className="eyebrow text-beige">The collection</p><h1 className="mt-5 max-w-3xl font-serif text-5xl leading-tight sm:text-7xl">Properties with<br /><em className="font-normal text-beige">a sense of place.</em></h1><p className="mt-7 max-w-xl text-base leading-7 text-white/70">Explore a considered collection of residences across New York, Miami, Los Angeles, and Chicago.</p></div></section><section className="page-shell py-20 sm:py-28"><SearchFilters properties={properties} initialFiltered={initialFilteredProperties} initial={initial} /></section></main>;
}
