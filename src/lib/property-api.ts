import { createHash } from "node:crypto";
import type { Prisma, Property as PrismaProperty, PropertyImage } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { cityIds, type CityId, type Property, type PropertyType } from "@/types/property";

const propertyTypes: PropertyType[] = ["Estate", "Penthouse", "Townhouse", "Villa"];
const priceFilters = ["under-5", "5-10", "over-10"] as const;

type SearchFilters = {
  cityId?: CityId;
  propertyType?: PropertyType;
  minBedrooms?: number;
  price?: (typeof priceFilters)[number];
  query?: string;
};

export class ClientInputError extends Error {}
export class PropertyDataError extends Error {}

const MAX_BODY_BYTES = 32_000;

export function apiError(message: string, status: number) {
  return Response.json({ error: { message } }, { status });
}

export function parseSearchFilters(searchParams: URLSearchParams, options: { cityFromPath?: string } = {}): SearchFilters {
  const city = options.cityFromPath ?? searchParams.get("city") ?? undefined;
  const type = searchParams.get("type") ?? undefined;
  const price = searchParams.get("price") ?? undefined;
  const bedrooms = searchParams.get("bedrooms") ?? undefined;
  const query = searchParams.get("q") ?? searchParams.get("search") ?? undefined;

  if (city && !cityIds.includes(city as CityId)) throw new ClientInputError("Invalid city filter.");
  if (type && !propertyTypes.includes(type as PropertyType)) throw new ClientInputError("Invalid property type filter.");
  if (price && !priceFilters.includes(price as (typeof priceFilters)[number])) throw new ClientInputError("Invalid price filter.");

  let minBedrooms: number | undefined;
  if (bedrooms) {
    minBedrooms = Number(bedrooms);
    if (!Number.isInteger(minBedrooms) || minBedrooms < 1 || minBedrooms > 20) throw new ClientInputError("Bedrooms must be an integer from 1 to 20.");
  }
  if (query && (query.trim().length < 2 || query.length > 100)) throw new ClientInputError("Search text must be between 2 and 100 characters.");

  return {
    cityId: city as CityId | undefined,
    propertyType: type as PropertyType | undefined,
    price: price as SearchFilters["price"],
    minBedrooms,
    query: query?.trim(),
  };
}

export function propertyWhere(filters: SearchFilters): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = {};
  if (filters.cityId) where.cityId = filters.cityId;
  if (filters.propertyType) where.propertyType = filters.propertyType;
  if (filters.minBedrooms) where.bedrooms = { gte: filters.minBedrooms };
  if (filters.price === "under-5") where.price = { lt: 5000000 };
  if (filters.price === "5-10") where.price = { gte: 5000000, lte: 10000000 };
  if (filters.price === "over-10") where.price = { gt: 10000000 };
  if (filters.query) {
    where.OR = [
      { name: { contains: filters.query, mode: "insensitive" } },
      { city: { contains: filters.query, mode: "insensitive" } },
      { address: { contains: filters.query, mode: "insensitive" } },
      { description: { contains: filters.query, mode: "insensitive" } },
    ];
  }
  return where;
}

export type PropertyWithImages = PrismaProperty & { images: PropertyImage[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(value: unknown, field: string) {
  if (typeof value !== "string" || value.length === 0) throw new PropertyDataError(`Invalid property field: ${field}.`);
  return value;
}

function optionalString(value: unknown, field: string) {
  if (value === undefined) return undefined;
  return requiredString(value, field);
}

function validateSpecifications(value: unknown): Property["specifications"] {
  if (!isRecord(value)) throw new PropertyDataError("Property specifications are invalid.");
  const interior = value.interior;
  const architecture = value.architecture;
  const outdoor = value.outdoor;
  const facilities = value.facilities;
  if (!isRecord(interior) || !isRecord(architecture) || !Array.isArray(outdoor) || !Array.isArray(facilities)) throw new PropertyDataError("Property specifications are invalid.");
  const numberFields = ["bedrooms", "fullBathrooms", "halfBathrooms", "interiorSquareFeet"] as const;
  for (const field of numberFields) if (typeof value[field] !== "number" || !Number.isFinite(value[field])) throw new PropertyDataError("Property specifications are invalid.");
  const interiorFields = ["kitchens", "livingSpaces", "dining", "laundry", "storage"] as const;
  for (const field of interiorFields) requiredString(interior[field], `interior.${field}`);
  for (const field of ["familyOrLounge", "officeOrStudy", "additional"] as const) optionalString(interior[field], `interior.${field}`);
  for (const field of ["style", "flooring", "kitchenFinishes", "bathroomFinishes", "windowsAndLight", "ceilingsAndStructure", "distinctiveDetails"] as const) requiredString(architecture[field], `architecture.${field}`);
  if (!outdoor.every((item) => typeof item === "string") || !facilities.every((item) => typeof item === "string")) throw new PropertyDataError("Property specifications are invalid.");
  return value as Property["specifications"];
}

export function serializeProperty(property: PropertyWithImages): Property {
  const images = [...property.images].sort((a, b) => a.sortOrder - b.sortOrder);
  return {
    id: property.id,
    slug: property.slug,
    cityId: cityIds.includes(property.cityId as CityId) ? property.cityId as CityId : (() => { throw new PropertyDataError("Property city is unsupported."); })(),
    city: property.city,
    state: property.state,
    name: property.name,
    address: property.address,
    price: Number(property.price),
    propertyType: propertyTypes.includes(property.propertyType as PropertyType) ? property.propertyType as PropertyType : (() => { throw new PropertyDataError("Property type is unsupported."); })(),
    description: property.description,
    editorialHeading: property.editorialHeading,
    editorialNote: property.editorialNote,
    editorialQuote: property.editorialQuote,
    specifications: validateSpecifications(property.specifications),
    image: property.coverImage,
    alt: property.coverAlt,
    gallery: images.map((image) => image.path),
    galleryAlt: images.map((image) => image.alt),
  };
}

export async function getDatabaseProperties(filters: SearchFilters = {}) {
  const properties = await prisma.property.findMany({
    where: propertyWhere(filters),
    include: { images: { orderBy: { sortOrder: "asc" } } },
    orderBy: [{ cityId: "asc" }, { name: "asc" }],
  });
  return properties.map(serializeProperty);
}

export async function findPropertyByCityAndSlug(cityId: string, slug: string) {
  return prisma.property.findFirst({
    where: { cityId, slug },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getDatabaseProperty(cityId: string, slug: string) {
  const property = await findPropertyByCityAndSlug(cityId, slug);
  return property ? serializeProperty(property) : undefined;
}

export async function resolveOptionalProperty(body: Record<string, unknown>) {
  const propertyId = typeof body.propertyId === "string" ? body.propertyId.trim() : undefined;
  const cityId = typeof body.cityId === "string" ? body.cityId.trim() : undefined;
  const slug = typeof body.slug === "string" ? body.slug.trim() : undefined;

  if (propertyId && (cityId || slug)) throw new ClientInputError("Use propertyId or cityId and slug, not both.");
  if (!propertyId && (cityId || slug)) {
    if (!cityId || !slug || !cityIds.includes(cityId as CityId)) throw new ClientInputError("A valid cityId and slug are required.");
    const property = await findPropertyByCityAndSlug(cityId, slug);
    if (!property) throw new ClientInputError("Property not found for this city.");
    return property.id;
  }
  if (propertyId) {
    const property = await prisma.property.findUnique({ where: { id: propertyId }, select: { id: true } });
    if (!property) throw new ClientInputError("Property not found.");
    return property.id;
  }
  return null;
}

const limiterState = globalThis as typeof globalThis & {
  __paradiseEstateRateLimit?: Map<string, { count: number; resetAt: number }>;
};
const rateLimits = limiterState.__paradiseEstateRateLimit ?? new Map<string, { count: number; resetAt: number }>();
limiterState.__paradiseEstateRateLimit = rateLimits;

export function enforceWriteRateLimit(request: Request, bucket: string) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const current = rateLimits.get(key);
  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return null;
  }
  if (current.count >= 10) return apiError("Too many requests. Please try again later.", 429);
  current.count += 1;
  return null;
}

export function validateBodySize(request: Request) {
  const length = request.headers.get("content-length");
  if (length && Number.isFinite(Number(length)) && Number(length) > MAX_BODY_BYTES) return apiError("Request body is too large.", 413);
  return null;
}

export async function readJsonBody(request: Request) {
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new ClientInputError("Request body must be valid JSON.");
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BODY_BYTES) throw new RequestBodyTooLargeError();
      chunks.push(value);
    }
    const bytes = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    const body: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
    return body as Record<string, unknown>;
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) throw error;
    if (error instanceof ClientInputError) throw error;
    throw new ClientInputError("Request body must be valid JSON.");
  }
}

export class RequestBodyTooLargeError extends Error {}

export function readIdempotencyKey(request: Request) {
  const key = request.headers.get("idempotency-key")?.trim();
  if (!key || key.length > 128 || /[\u0000-\u001f\u007f]/.test(key)) throw new ClientInputError("Idempotency-Key header is required and must be valid.");
  return key;
}

export function hashIdempotencyPayload(payload: Record<string, unknown>) {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

export function isUniqueConstraintError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

export function handleApiError(error: unknown, fallback: string) {
  if (error instanceof ClientInputError) return apiError(error.message, 400);
  if (error instanceof RequestBodyTooLargeError) return apiError("Request body is too large.", 413);
  console.error(fallback, { errorType: error instanceof Error ? error.name : "UnknownError" });
  return apiError(fallback, 500);
}

export function requiredText(body: Record<string, unknown>, key: string, min: number, max: number) {
  const value = typeof body[key] === "string" ? body[key].trim() : "";
  if (value.length < min || value.length > max) throw new ClientInputError(`${key} must be between ${min} and ${max} characters.`);
  return value;
}

export function optionalText(body: Record<string, unknown>, key: string, max: number) {
  if (body[key] === undefined || body[key] === null || body[key] === "") return null;
  if (typeof body[key] !== "string" || body[key].trim().length > max) throw new ClientInputError(`${key} must be at most ${max} characters.`);
  return body[key].trim();
}

export function validateEmail(body: Record<string, unknown>) {
  const email = requiredText(body, "email", 5, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ClientInputError("email must be valid.");
  return email;
}
