import { ClientInputError, enforceWriteRateLimit, handleApiError, hashIdempotencyPayload, isUniqueConstraintError, optionalText, readIdempotencyKey, readJsonBody, requiredText, resolveOptionalProperty, validateBodySize, validateEmail } from "@/lib/property-api";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limited = enforceWriteRateLimit(request, "viewing-requests");
  if (limited) return limited;
  const tooLarge = validateBodySize(request);
  if (tooLarge) return tooLarge;
  try {
    const body = await readJsonBody(request);
    const idempotencyKey = readIdempotencyKey(request);
    const name = requiredText(body, "name", 2, 100);
    const email = validateEmail(body);
    const phone = optionalText(body, "phone", 40);
    const notes = optionalText(body, "notes", 2000);
    const propertyId = await resolveOptionalProperty(body);
    if (!propertyId) throw new ClientInputError("A property is required for a viewing request.");
    let requestedDate: Date | null = null;
    if (body.requestedDate !== undefined && body.requestedDate !== null && body.requestedDate !== "") {
      if (typeof body.requestedDate !== "string") throw new ClientInputError("requestedDate must be an ISO date string.");
      requestedDate = new Date(body.requestedDate);
      if (Number.isNaN(requestedDate.getTime())) throw new ClientInputError("requestedDate must be a valid ISO date.");
    }
    const requestHash = hashIdempotencyPayload({ name, email, phone, notes, requestedDate: requestedDate?.toISOString() ?? null, propertyId });
    const existing = await prisma.viewingRequest.findUnique({ where: { idempotencyKey } });
    if (existing) {
      if (existing.requestHash !== requestHash) return Response.json({ error: { message: "Idempotency-Key was already used for a different request." } }, { status: 409 });
      return Response.json({ data: { accepted: true, replayed: true } });
    }
    try {
      await prisma.viewingRequest.create({ data: { name, email, phone, notes, requestedDate, propertyId, idempotencyKey, requestHash } });
    } catch (error) {
      if (!isUniqueConstraintError(error)) throw error;
      const concurrent = await prisma.viewingRequest.findUnique({ where: { idempotencyKey } });
      if (!concurrent || concurrent.requestHash !== requestHash) return Response.json({ error: { message: "Idempotency-Key was already used for a different request." } }, { status: 409 });
      return Response.json({ data: { accepted: true, replayed: true } });
    }
    return Response.json({ data: { accepted: true } }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "Unable to submit viewing request.");
  }
}
