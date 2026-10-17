import { apiError, findPropertyByCityAndSlug, handleApiError, serializeProperty } from "@/lib/property-api";
import { cityIds, type CityId } from "@/types/property";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ city: string; slug: string }> }) {
  const { city, slug } = await params;
  if (!cityIds.includes(city as CityId)) return apiError("City not found.", 404);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return apiError("Invalid property slug.", 400);
  try {
    const property = await findPropertyByCityAndSlug(city, slug);
    if (!property) return apiError("Property not found for this city.", 404);
    return Response.json({ data: serializeProperty(property) });
  } catch (error) {
    return handleApiError(error, "Unable to retrieve property.");
  }
}
