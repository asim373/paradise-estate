import type { MetadataRoute } from "next";
import { cities, properties } from "@/data/properties";
import { getPublicSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getPublicSiteUrl();
  if (!siteUrl) return [];

  const paths = ["", "/properties", "/about", "/communities", "/contact"];

  return [
    ...paths.map((path) => ({ url: `${siteUrl}${path}` })),
    ...cities.map((city) => ({ url: `${siteUrl}/properties/${city.id}` })),
    ...properties.map((property) => ({ url: `${siteUrl}/properties/${property.cityId}/${property.slug}` })),
  ];
}
