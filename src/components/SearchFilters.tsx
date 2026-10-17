"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cities } from "@/data/properties";
import type { Property, PropertyType } from "@/types/property";
import { PropertyCard } from "@/components/PropertyCard";

const types: PropertyType[] = ["Estate", "Penthouse", "Townhouse", "Villa"];

export function SearchFilters({ compact = false, initial, properties = [], initialFiltered }: { compact?: boolean; initial?: { city?: string; price?: string; type?: string; bedrooms?: string; search?: string }; properties?: Property[]; initialFiltered?: Property[] }) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const firstRequest = useRef(true);
  const [city, setCity] = useState(initial?.city || "all");
  const [price, setPrice] = useState(initial?.price || "all");
  const [type, setType] = useState(initial?.type || "all");
  const [bedrooms, setBedrooms] = useState(initial?.bedrooms || "all");
  const [search, setSearch] = useState(initial?.search || "");
  const [filtered, setFiltered] = useState(initialFiltered ?? properties);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) return;
    const timeout = window.setTimeout(() => {
      const query = new URLSearchParams(window.location.search);
      setCity(query.get("city") || "all"); setPrice(query.get("price") || "all"); setType(query.get("type") || "all"); setBedrooms(query.get("bedrooms") || "all"); setSearch(query.get("q") || "");
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [initial]);

  useEffect(() => {
    if (compact || firstRequest.current) { firstRequest.current = false; return; }
    const controller = new AbortController();
    const query = new URLSearchParams();
    if (city !== "all") query.set("city", city); if (price !== "all") query.set("price", price); if (type !== "all") query.set("type", type); if (bedrooms !== "all") query.set("bedrooms", bedrooms); if (search.trim()) query.set("q", search.trim());
    setLoading(true); setError(null);
    fetch(`/api/properties${query.toString() ? `?${query.toString()}` : ""}`, { signal: controller.signal })
      .then(async (response) => { const payload = await response.json() as { data?: Property[]; error?: { message?: string } }; if (!response.ok) throw new Error(payload.error?.message || "Unable to update the collection."); return payload.data ?? []; })
      .then(setFiltered)
      .catch((requestError: unknown) => { if (requestError instanceof DOMException && requestError.name === "AbortError") return; setError(requestError instanceof Error ? requestError.message : "Unable to update the collection."); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [bedrooms, city, compact, price, search, type]);

  function reset() { setCity("all"); setPrice("all"); setType("all"); setBedrooms("all"); setSearch(""); setError(null); if (!compact) { setFiltered(properties); router.push("/properties"); } }
  function applySearch() {
    const readValue = (name: string, fallback: string) => panelRef.current?.querySelector<HTMLSelectElement>(`select[name="${name}"]`)?.value || fallback;
    const query = new URLSearchParams();
    const selected = { city: readValue("city", city), price: readValue("price", price), type: readValue("type", type), bedrooms: readValue("bedrooms", bedrooms) };
    if (selected.city !== "all") query.set("city", selected.city); if (selected.price !== "all") query.set("price", selected.price); if (selected.type !== "all") query.set("type", selected.type); if (selected.bedrooms !== "all") query.set("bedrooms", selected.bedrooms);
    if (search.trim()) query.set("q", search.trim());
    router.push(`/properties${query.toString() ? `?${query.toString()}` : ""}`);
  }

  return <div className={compact ? "" : "page-shell"}>
    <div className={`filter-panel ${compact ? "filter-panel-compact" : ""}`} ref={panelRef}>
      <label htmlFor="search-city">City<select id="search-city" name="city" value={city} onChange={(event) => setCity(event.target.value)}><option value="all">All cities</option>{cities.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
      <label htmlFor="search-price">Price range<select id="search-price" name="price" value={price} onChange={(event) => setPrice(event.target.value)}><option value="all">Any price</option><option value="under-5">Under $5M</option><option value="5-10">$5M – $10M</option><option value="over-10">Over $10M</option></select></label>
      <label htmlFor="search-type">Property type<select id="search-type" name="type" value={type} onChange={(event) => setType(event.target.value)}><option value="all">Any type</option>{types.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
      <label htmlFor="search-bedrooms">Bedrooms<select id="search-bedrooms" name="bedrooms" value={bedrooms} onChange={(event) => setBedrooms(event.target.value)}><option value="all">Any number</option><option value="3">3+ bedrooms</option><option value="4">4+ bedrooms</option><option value="5">5+ bedrooms</option></select></label>
      <label htmlFor="search-keyword">Keyword search<input id="search-keyword" name="q" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Keyword" /></label>
      {compact ? <button className="button button-dark" type="button" onClick={applySearch}>Explore selection <span aria-hidden="true">→</span></button> : <button className="button button-dark" type="button" onClick={reset}>Reset filters</button>}
    </div>
    {!compact && <div className="mt-12"><div className="mb-8 flex items-center justify-between"><p className="text-sm text-taupe">{loading ? "Updating the collection…" : <>Showing <span className="font-semibold text-charcoal">{filtered.length}</span> of {properties.length} residences</>}</p>{filtered.length !== properties.length && <button className="text-sm underline underline-offset-4" onClick={reset}>Clear all</button>}</div>{error ? <div className="border border-charcoal/10 bg-white py-20 text-center" role="alert"><p className="font-serif text-3xl">The collection is unavailable.</p><p className="mt-3 text-sm text-taupe">{error}</p></div> : filtered.length ? <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((property) => <PropertyCard property={property} key={property.id} />)}</div> : <div className="border border-charcoal/10 bg-white py-20 text-center"><p className="font-serif text-3xl">Nothing matches this edit.</p><p className="mt-3 text-sm text-taupe">Try widening your criteria to continue exploring.</p><button className="button button-dark" type="button" onClick={reset}>Reset filters</button></div>}</div>}
  </div>;
}
