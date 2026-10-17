-- Add atomic idempotency storage for public write endpoints.
ALTER TABLE "PropertyInquiry"
  ADD COLUMN "idempotencyKey" TEXT,
  ADD COLUMN "requestHash" TEXT;

ALTER TABLE "ViewingRequest"
  ADD COLUMN "idempotencyKey" TEXT,
  ADD COLUMN "requestHash" TEXT;

CREATE UNIQUE INDEX "PropertyInquiry_idempotencyKey_key"
  ON "PropertyInquiry"("idempotencyKey");

CREATE UNIQUE INDEX "ViewingRequest_idempotencyKey_key"
  ON "ViewingRequest"("idempotencyKey");

-- Enforce the supported domain values at the database boundary.
ALTER TABLE "Property"
  ADD CONSTRAINT "Property_cityId_check"
  CHECK ("cityId" IN ('new-york', 'miami', 'los-angeles', 'chicago'));

ALTER TABLE "Property"
  ADD CONSTRAINT "Property_propertyType_check"
  CHECK ("propertyType" IN ('Estate', 'Penthouse', 'Townhouse', 'Villa'));

-- Rollback procedure (manual, forward-only migration):
-- DROP INDEX "PropertyInquiry_idempotencyKey_key";
-- DROP INDEX "ViewingRequest_idempotencyKey_key";
-- ALTER TABLE "PropertyInquiry" DROP COLUMN "idempotencyKey", DROP COLUMN "requestHash";
-- ALTER TABLE "ViewingRequest" DROP COLUMN "idempotencyKey", DROP COLUMN "requestHash";
-- ALTER TABLE "Property" DROP CONSTRAINT "Property_cityId_check";
-- ALTER TABLE "Property" DROP CONSTRAINT "Property_propertyType_check";
