import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const source = fs.readFileSync(path.join(root, "src/data/properties.ts"), "utf8");
const imageSets = Object.fromEntries([...source.matchAll(/^  (\w+): "([^"]+)",$/gm)].map((match) => [match[1], match[2]]));
const propertyBlocks = [...source.matchAll(/id: "(pe-[^"]+)"[\s\S]*?gallery: \[([^\]]+)\]/g)].map((match) => ({
  id: match[1],
  paths: [...match[2].matchAll(/imageSets\.(\w+)|"(\/images\/[^"\n]+)"/g)].map((image) => imageSets[image[1]] ?? image[2]),
}));
const originalPaths = new Set([
  "/images/property-astor-residence.jpg", "/images/gallery-astor-residence.jpg",
  "/images/property-park-avenue-penthouse.jpg", "/images/gallery-park-avenue-penthouse.jpg",
  "/images/property-palmetto-house.jpg", "/images/gallery-palmetto-house.jpg",
  "/images/property-coral-gables-courtyard.jpg", "/images/gallery-coral-gables-courtyard.jpg",
  "/images/property-canyon-view-estate.jpg", "/images/gallery-canyon-view-estate.jpg",
  "/images/property-silver-lake-modern.jpg", "/images/gallery-silver-lake-modern.jpg",
  "/images/property-lakeview-greystone.jpg", "/images/gallery-lakeview-greystone.jpg",
  "/images/property-magnificent-mile-residence.jpg", "/images/gallery-magnificent-mile-residence.jpg",
]);

if (propertyBlocks.length !== 8) throw new Error(`Expected 8 properties, found ${propertyBlocks.length}`);
const allPaths = propertyBlocks.flatMap(({ id, paths }) => {
  if (paths.length !== 8) throw new Error(`${id} must have exactly 8 gallery images`);
  if (!originalPaths.has(paths[0]) || !originalPaths.has(paths[1])) throw new Error(`${id} does not preserve its first two gallery images`);
  for (const imagePath of paths) {
    const file = path.join(root, "public", imagePath.slice(1));
    if (!fs.existsSync(file)) throw new Error(`Missing image file: ${imagePath}`);
  }
  return paths;
});

if (new Set(allPaths).size !== 64) throw new Error(`Expected 64 unique gallery references, found ${new Set(allPaths).size}`);
const newPaths = allPaths.filter((imagePath) => !originalPaths.has(imagePath));
if (newPaths.length !== 48) throw new Error(`Expected 48 new gallery images, found ${newPaths.length}`);

const hashes = new Map();
for (const imagePath of allPaths) {
  const file = path.join(root, "public", imagePath.slice(1));
  const hash = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
  if (hashes.has(hash)) throw new Error(`Duplicate image content: ${imagePath} and ${hashes.get(hash)}`);
  hashes.set(hash, imagePath);
}

console.log("Verified 8 properties, 64 unique gallery images, 48 new files, and 16 preserved originals.");
