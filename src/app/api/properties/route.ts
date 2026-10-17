import { handleApiError, parseSearchFilters, propertyWhere, serializeProperty } from "@/lib/property-api";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const filters = parseSearchFilters(new URL(request.url).searchParams);
    const properties = await prisma.property.findMany({
      where: propertyWhere(filters),
      include: { images: { orderBy: { sortOrder: "asc" } } },
      orderBy: [{ cityId: "asc" }, { name: "asc" }],
    });
    return Response.json({ data: properties.map(serializeProperty), meta: { count: properties.length } });
  } catch (error) {
    return handleApiError(error, "Unable to list properties.");
  }
}
