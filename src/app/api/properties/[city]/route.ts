import { apiError, handleApiError, parseSearchFilters, propertyWhere, serializeProperty } from "@/lib/property-api";
import { prisma } from "@/lib/prisma";
import { cityIds, type CityId } from "@/types/property";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  if (!cityIds.includes(city as CityId)) return apiError("City not found.", 404);
  try {
    const filters = parseSearchFilters(new URL(request.url).searchParams, { cityFromPath: city });
    const properties = await prisma.property.findMany({
      where: propertyWhere(filters),
      include: { images: { orderBy: { sortOrder: "asc" } } },
      orderBy: { name: "asc" },
    });
    return Response.json({ data: properties.map(serializeProperty), meta: { city, count: properties.length } });
  } catch (error) {
    return handleApiError(error, "Unable to list city properties.");
  }
}
