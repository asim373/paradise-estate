import { enforceWriteRateLimit, handleApiError, hashIdempotencyPayload, isUniqueConstraintError, optionalText, readIdempotencyKey, readJsonBody, requiredText, resolveOptionalProperty, validateBodySize, validateEmail } from "@/lib/property-api";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limited = enforceWriteRateLimit(request, "inquiries");
  if (limited) return limited;
  const tooLarge = validateBodySize(request);
  if (tooLarge) return tooLarge;
  try {
    const body = await readJsonBody(request);
    const idempotencyKey = readIdempotencyKey(request);
    const name = requiredText(body, "name", 2, 100);
    const email = validateEmail(body);
    const phone = optionalText(body, "phone", 40);
    const message = requiredText(body, "message", 10, 2000);
    const propertyId = await resolveOptionalProperty(body);
    const requestHash = hashIdempotencyPayload({ name, email, phone, message, propertyId });
    const existing = await prisma.propertyInquiry.findUnique({ where: { idempotencyKey } });
    if (existing) {
      if (existing.requestHash !== requestHash) return Response.json({ error: { message: "Idempotency-Key was already used for a different request." } }, { status: 409 });
      return Response.json({ data: { accepted: true, replayed: true } });
    }
    try {
      await prisma.propertyInquiry.create({ data: { name, email, phone, message, propertyId, idempotencyKey, requestHash } });
    } catch (error) {
      if (!isUniqueConstraintError(error)) throw error;
      const concurrent = await prisma.propertyInquiry.findUnique({ where: { idempotencyKey } });
      if (!concurrent || concurrent.requestHash !== requestHash) return Response.json({ error: { message: "Idempotency-Key was already used for a different request." } }, { status: 409 });
      return Response.json({ data: { accepted: true, replayed: true } });
    }
    return Response.json({ data: { accepted: true } }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "Unable to submit inquiry.");
  }
}
