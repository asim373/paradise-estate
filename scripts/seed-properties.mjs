import fs from "node:fs";
import ts from "typescript";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

process.loadEnvFile?.(".env.local");

const connectionString = process.env.DIRECT_URL;
if (!connectionString) {
  throw new Error("DIRECT_URL must be set before seeding.");
}

function loadApprovedProperties() {
  const sourcePath = new URL("../src/data/properties.ts", import.meta.url);
  const source = fs.readFileSync(sourcePath, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
    fileName: sourcePath.pathname,
  }).outputText;
  const moduleRecord = { exports: {} };
  new Function("exports", "module", transpiled)(moduleRecord.exports, moduleRecord);
  return moduleRecord.exports.properties;
}

const properties = loadApprovedProperties();
if (!Array.isArray(properties) || properties.length !== 8) {
  throw new Error(`Expected 8 approved properties, found ${properties?.length ?? 0}.`);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

try {
  for (const property of properties) {
    const saved = await prisma.property.upsert({
      where: { id: property.id },
      create: {
        id: property.id,
        slug: property.slug,
        cityId: property.cityId,
        name: property.name,
        city: property.city,
        state: property.state,
        address: property.address,
        price: property.price,
        propertyType: property.propertyType,
        description: property.description,
        editorialHeading: property.editorialHeading,
        editorialNote: property.editorialNote,
        editorialQuote: property.editorialQuote,
        coverImage: property.image,
        coverAlt: property.alt,
        bedrooms: property.specifications.bedrooms,
        fullBathrooms: property.specifications.fullBathrooms,
        halfBathrooms: property.specifications.halfBathrooms,
        interiorSquareFeet: property.specifications.interiorSquareFeet,
        specifications: property.specifications,
      },
      update: {
        slug: property.slug,
        cityId: property.cityId,
        name: property.name,
        city: property.city,
        state: property.state,
        address: property.address,
        price: property.price,
        propertyType: property.propertyType,
        description: property.description,
        editorialHeading: property.editorialHeading,
        editorialNote: property.editorialNote,
        editorialQuote: property.editorialQuote,
        coverImage: property.image,
        coverAlt: property.alt,
        bedrooms: property.specifications.bedrooms,
        fullBathrooms: property.specifications.fullBathrooms,
        halfBathrooms: property.specifications.halfBathrooms,
        interiorSquareFeet: property.specifications.interiorSquareFeet,
        specifications: property.specifications,
      },
    });

    const sortOrders = property.gallery.map((_, index) => index);
    await prisma.propertyImage.deleteMany({
      where: { propertyId: saved.id, sortOrder: { notIn: sortOrders } },
    });

    for (const [index, path] of property.gallery.entries()) {
      await prisma.propertyImage.upsert({
        where: { propertyId_sortOrder: { propertyId: saved.id, sortOrder: index } },
        create: {
          propertyId: saved.id,
          path,
          alt: property.galleryAlt[index],
          sortOrder: index,
        },
        update: {
          path,
          alt: property.galleryAlt[index],
        },
      });
    }
  }

  const [propertyCount, imageCount] = await Promise.all([
    prisma.property.count(),
    prisma.propertyImage.count(),
  ]);
  if (propertyCount !== 8 || imageCount !== 64) {
    throw new Error(`Seed verification failed: ${propertyCount} properties and ${imageCount} images.`);
  }
  console.log(`Seeded ${propertyCount} approved properties and ${imageCount} ordered gallery images.`);
} finally {
  await prisma.$disconnect();
}
