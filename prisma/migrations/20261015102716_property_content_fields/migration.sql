/*
  Warnings:

  - Added the required column `cityId` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coverAlt` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coverImage` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `editorialHeading` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `editorialNote` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `editorialQuote` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "cityId" TEXT NOT NULL,
ADD COLUMN     "coverAlt" TEXT NOT NULL,
ADD COLUMN     "coverImage" TEXT NOT NULL,
ADD COLUMN     "editorialHeading" TEXT NOT NULL,
ADD COLUMN     "editorialNote" TEXT NOT NULL,
ADD COLUMN     "editorialQuote" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Property_cityId_idx" ON "Property"("cityId");
