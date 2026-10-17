import type { City, CityId, Property } from "@/types/property";

export const cities: City[] = [
  {
    id: "new-york",
    name: "New York",
    state: "New York",
    tagline: "City residences with a point of view.",
    introduction:
      "From quiet brownstone blocks to skyline penthouses, New York addresses reward a life lived with intention.",
    image: "/images/community-new-york.jpg",
    alt: "Elegant limestone townhouse facade in New York City",
  },
  {
    id: "miami",
    name: "Miami",
    state: "Florida",
    tagline: "Coastal living, composed.",
    introduction:
      "A sunlit collection of waterfront villas and architectural retreats shaped by water, light, and ease.",
    image: "/images/community-miami.jpg",
    alt: "Contemporary waterfront residence in Miami",
  },
  {
    id: "los-angeles",
    name: "Los Angeles",
    state: "California",
    tagline: "Modernism above the city.",
    introduction:
      "Discover hillside estates where indoor-outdoor living, privacy, and panoramic horizons come naturally.",
    image: "/images/community-los-angeles.jpg",
    alt: "Modern hillside home in Los Angeles",
  },
  {
    id: "chicago",
    name: "Chicago",
    state: "Illinois",
    tagline: "Architecture with a civic spirit.",
    introduction:
      "A considered edit of lakefront residences and storied city homes with enduring material character.",
    image: "/images/community-chicago.jpg",
    alt: "Refined greystone residence in Chicago",
  },
];

const imageSets = {
  hero: "/images/hero-miami.png",
  astor: "/images/property-astor-residence.jpg",
  astorGallery: "/images/gallery-astor-residence.jpg",
  parkAvenue: "/images/property-park-avenue-penthouse.jpg",
  parkAvenueGallery: "/images/gallery-park-avenue-penthouse.jpg",
  palmetto: "/images/property-palmetto-house.jpg",
  palmettoGallery: "/images/gallery-palmetto-house.jpg",
  coralGables: "/images/property-coral-gables-courtyard.jpg",
  coralGablesGallery: "/images/gallery-coral-gables-courtyard.jpg",
  canyonView: "/images/property-canyon-view-estate.jpg",
  canyonViewGallery: "/images/gallery-canyon-view-estate.jpg",
  silverLake: "/images/property-silver-lake-modern.jpg",
  silverLakeGallery: "/images/gallery-silver-lake-modern.jpg",
  lakeview: "/images/property-lakeview-greystone.jpg",
  lakeviewGallery: "/images/gallery-lakeview-greystone.jpg",
  magnificentMile: "/images/property-magnificent-mile-residence.jpg",
  magnificentMileGallery: "/images/gallery-magnificent-mile-residence.jpg",
};

export const properties: Property[] = [
  {
    id: "pe-ny-001",
    slug: "the-astor-residence",
    cityId: "new-york",
    city: "New York",
    state: "New York",
    name: "The Astor Residence",
    address: "18 East 78th Street",
    price: 6850000,
    propertyType: "Townhouse",
    description:
      "A quietly grand townhouse imagined for modern city living, with sunlit entertaining rooms and a private garden room.",
    editorialHeading: "A townhouse with a quieter rhythm.",
    editorialNote: "Sunlit entertaining rooms, original millwork, and a private garden room give this Upper East Side address its composed character.",
    editorialQuote: "Old New York character, carefully opened to the present",
    specifications: {
      bedrooms: 5, fullBathrooms: 5, halfBathrooms: 1, interiorSquareFeet: 4680, lotSize: "0.08 acre", levels: 5,
      parking: "Attached one-car garage",
      interior: { kitchens: "One chef's kitchen with secondary catering pantry", livingSpaces: "Formal living room with library", dining: "Formal dining room", familyOrLounge: "Garden-level family room", officeOrStudy: "Dedicated library / study", laundry: "Upper-level laundry room", storage: "Basement storage and garden-level utility room", additional: "Elevator-served entry, cellar, and private garden room" },
      architecture: { style: "Beaux-Arts limestone townhouse", flooring: "Restored oak parquet and honed limestone", kitchenFinishes: "Custom lacquer cabinetry, marble island, and integrated appliances", bathroomFinishes: "Calacatta marble primary bath with unlacquered brass fittings", windowsAndLight: "Tall street-facing sash windows and garden-facing southern light", ceilingsAndStructure: "Five connected levels with original high ceilings and restored millwork", distinctiveDetails: "Carved limestone facade, wood-burning fireplace, and original stair hall" },
      outdoor: ["Private rear garden", "Garden room", "Brownstone entry stoop"],
      facilities: ["Private elevator", "Video intercom", "Central air conditioning", "Smart lighting and climate controls", "Attached garage"]
    },
    image: imageSets.astor,
    gallery: [imageSets.astor, imageSets.astorGallery, "/images/astor-living-room.png", "/images/astor-kitchen.png", "/images/astor-primary-bedroom.png", "/images/astor-primary-bathroom.png", "/images/astor-foyer.png", "/images/astor-garden-room.png"],
    galleryAlt: ["Fictional New York townhouse exterior", "The Astor Residence architectural detail", "The Astor Residence formal living room with restored millwork", "The Astor Residence chef's kitchen with marble island", "The Astor Residence primary bedroom with tall sash windows", "The Astor Residence primary bathroom in Calacatta marble", "The Astor Residence limestone townhouse entrance foyer", "The Astor Residence private garden room"],
    alt: "Fictional New York townhouse exterior",
  },
  {
    id: "pe-ny-002",
    slug: "park-avenue-penthouse",
    cityId: "new-york",
    city: "New York",
    state: "New York",
    name: "Park Avenue Penthouse",
    address: "440 Park Avenue, Penthouse 4",
    price: 9250000,
    propertyType: "Penthouse",
    description:
      "A light-filled aerie with sculptural views and a terrace designed for long evenings above the city.",
    editorialHeading: "The city, framed with intention.",
    editorialNote: "A sky-lit interior and private terrace turn the Manhattan horizon into part of the daily composition.",
    editorialQuote: "A private vantage point above the avenues",
    specifications: {
      bedrooms: 4, fullBathrooms: 4, halfBathrooms: 1, interiorSquareFeet: 3210, levels: 1,
      parking: "Two attended garage spaces",
      interior: { kitchens: "One open chef's kitchen with concealed service pantry", livingSpaces: "Sky-lit great room and separate media lounge", dining: "Open dining area for formal or casual use", familyOrLounge: "Private media lounge", officeOrStudy: "Quiet study nook", laundry: "Dedicated laundry room", storage: "Private entry storage and climate-controlled closet", additional: "Private elevator vestibule and gallery-style entry" },
      architecture: { style: "Contemporary Manhattan penthouse", flooring: "Wide-plank oak and natural stone", kitchenFinishes: "Sculptural stone island, walnut cabinetry, and integrated appliances", bathroomFinishes: "Bookmatched marble, sculptural soaking tub, and brushed nickel fittings", windowsAndLight: "Expansive insulated glazing with skyline and river outlooks", ceilingsAndStructure: "Single-level plan with floating ceiling planes and discreet lighting", distinctiveDetails: "Gallery walls, full-height glass corners, and tailored millwork" },
      outdoor: ["Private rooftop terrace", "Outdoor dining terrace"],
      facilities: ["Private elevator access", "Attended lobby and doorman", "Central HVAC", "Integrated smart-home controls", "Two attended garage spaces"]
    },
    image: imageSets.parkAvenue,
    gallery: [imageSets.parkAvenue, imageSets.parkAvenueGallery, "/images/park-avenue-living-room.png", "/images/park-avenue-kitchen.png", "/images/park-avenue-primary-bedroom.png", "/images/park-avenue-primary-bathroom.png", "/images/park-avenue-foyer.png", "/images/park-avenue-roof-terrace.png"],
    galleryAlt: ["Fictional New York penthouse setting", "Park Avenue Penthouse architectural detail", "Park Avenue Penthouse great room with skyline windows", "Park Avenue Penthouse kitchen with walnut cabinetry", "Park Avenue Penthouse primary bedroom with city light", "Park Avenue Penthouse primary bathroom in veined marble", "Park Avenue Penthouse private elevator foyer", "Park Avenue Penthouse private rooftop terrace"],
    alt: "Fictional New York penthouse setting",
  },
  {
    id: "pe-mia-001",
    slug: "palmetto-house",
    cityId: "miami",
    city: "Miami",
    state: "Florida",
    name: "Palmetto House",
    address: "1840 North Bay Road",
    price: 7950000,
    propertyType: "Villa",
    description:
      "A composed waterfront villa where travertine, glass, and tropical planting frame a life at the water's edge.",
    editorialHeading: "Water at the edge of every day.",
    editorialNote: "Travertine terraces, tropical planting, and a private dock shape a relaxed waterfront routine.",
    editorialQuote: "The kind of address that makes time feel unhurried",
    specifications: {
      bedrooms: 5, fullBathrooms: 6, halfBathrooms: 1, interiorSquareFeet: 5320, lotSize: "0.34 acre", levels: 2,
      parking: "Climate-controlled two-car garage and motor court",
      interior: { kitchens: "One main kitchen with separate summer kitchen", livingSpaces: "Double-height great room opening to the water", dining: "Formal dining room and covered outdoor dining", familyOrLounge: "Water-facing family lounge", officeOrStudy: "Private office with garden outlook", laundry: "Two laundry rooms, one per level", storage: "Walk-in service storage and pool equipment room", additional: "Private guest suite with separate entrance" },
      architecture: { style: "Tropical modern waterfront villa", flooring: "Large-format travertine and warm oak", kitchenFinishes: "Custom oak cabinetry, quartzite counters, and integrated professional appliances", bathroomFinishes: "Veined stone, frameless glass, and brushed brass fixtures", windowsAndLight: "Retractable glass walls and shaded clerestory glazing", ceilingsAndStructure: "Double-height great room with exposed timber accents", distinctiveDetails: "Continuous water views, deep overhangs, and breezeway circulation" },
      outdoor: ["Waterfront infinity pool", "Private dock", "Covered terrace", "Summer kitchen", "Tropical garden"],
      facilities: ["Gated entry with camera system", "Central zoned air conditioning", "Smart lighting and shade controls", "Climate-controlled garage", "Pool and dock service areas"]
    },
    image: imageSets.palmetto,
    gallery: [imageSets.palmetto, imageSets.palmettoGallery, "/images/palmetto-living-room.png", "/images/palmetto-kitchen.png", "/images/palmetto-primary-bedroom.png", "/images/palmetto-primary-bathroom.png", "/images/palmetto-foyer.png", "/images/palmetto-summer-kitchen.png"],
    galleryAlt: ["Fictional Miami waterfront villa", "Palmetto House waterfront architectural detail", "Palmetto House waterfront great room", "Palmetto House tropical modern kitchen", "Palmetto House waterfront primary bedroom", "Palmetto House primary bathroom with limestone finishes", "Palmetto House villa entrance foyer", "Palmetto House covered summer kitchen and dining terrace"],
    alt: "Fictional Miami waterfront villa",
  },
  {
    id: "pe-mia-002",
    slug: "coral-gables-courtyard",
    cityId: "miami",
    city: "Miami",
    state: "Florida",
    name: "Coral Gables Courtyard",
    address: "1200 Granada Boulevard",
    price: 3890000,
    propertyType: "Estate",
    description:
      "A garden-led retreat with a generous courtyard, calm proportions, and rooms that open effortlessly outdoors.",
    editorialHeading: "A courtyard at the center of it all.",
    editorialNote: "Arched passageways and garden rooms create an easy sequence between the house and its lush Coral Gables setting.",
    editorialQuote: "An inward-looking garden home with a generous welcome",
    specifications: {
      bedrooms: 4, fullBathrooms: 4, halfBathrooms: 1, interiorSquareFeet: 3860, lotSize: "0.28 acre", levels: 1,
      parking: "Two-car detached garage with porte-cochere",
      interior: { kitchens: "One chef's kitchen with breakfast room", livingSpaces: "Formal living room arranged around the courtyard", dining: "Formal dining room with garden views", familyOrLounge: "Informal lounge opening to the pool terrace", officeOrStudy: "Flexible study / guest room", laundry: "Dedicated laundry and utility room", storage: "Walk-in pantry and garden storage", additional: "Separate guest casita with private bath" },
      architecture: { style: "Mediterranean Revival courtyard estate", flooring: "Patterned encaustic tile, limestone, and white oak", kitchenFinishes: "Painted cabinetry, marble counters, and professional gas range", bathroomFinishes: "Hand-set zellige tile, limestone vanities, and aged bronze fittings", windowsAndLight: "Arched steel windows and French doors centered on the courtyard", ceilingsAndStructure: "Single-story plan with beamed ceilings and arched passageways", distinctiveDetails: "Central courtyard, plaster walls, and hand-finished ironwork" },
      outdoor: ["Central courtyard", "Courtyard pool", "Lush gardens", "Covered loggia", "Outdoor dining terrace"],
      facilities: ["Gated driveway", "Security alarm and camera points", "Central air conditioning", "Pool equipment enclosure", "Detached two-car garage"]
    },
    image: imageSets.coralGables,
    gallery: [imageSets.coralGables, imageSets.coralGablesGallery, "/images/coral-gables-living-room.png", "/images/coral-gables-kitchen.png", "/images/coral-gables-primary-bedroom.png", "/images/coral-gables-primary-bathroom.png", "/images/coral-gables-foyer.png", "/images/coral-gables-courtyard.png"],
    galleryAlt: ["Fictional Coral Gables estate", "Coral Gables Courtyard architectural detail", "Coral Gables Courtyard Mediterranean Revival living room", "Coral Gables Courtyard chef's kitchen", "Coral Gables Courtyard primary bedroom", "Coral Gables Courtyard primary bathroom", "Coral Gables Courtyard arched entrance foyer", "Coral Gables Courtyard central pool courtyard"],
    alt: "Fictional Coral Gables estate",
  },
  {
    id: "pe-la-001",
    slug: "canyon-view-estate",
    cityId: "los-angeles",
    city: "Los Angeles",
    state: "California",
    name: "Canyon View Estate",
    address: "9750 Skyline Drive",
    price: 11900000,
    propertyType: "Estate",
    description:
      "An elevated contemporary estate with cinematic canyon views, layered gardens, and an effortless indoor-outdoor plan.",
    editorialHeading: "An elevated life above the lights.",
    editorialNote: "Long canyon views, layered gardens, and generous glass make the hillside setting feel expansive and private.",
    editorialQuote: "A high perch for days shaped by light and horizon",
    specifications: {
      bedrooms: 6, fullBathrooms: 7, halfBathrooms: 2, interiorSquareFeet: 6840, lotSize: "0.72 acre", levels: 3,
      parking: "Three-car garage with gated motor court",
      interior: { kitchens: "One main kitchen with secondary catering kitchen", livingSpaces: "Double-height great room with canyon outlook", dining: "Formal dining room and breakfast terrace", familyOrLounge: "Lower-level lounge and screening room", officeOrStudy: "Glass-walled executive office", laundry: "Two laundry rooms", storage: "Mudroom, wine storage, and equipment rooms", additional: "Guest wing with two en-suite bedrooms" },
      architecture: { style: "Contemporary hillside estate", flooring: "Wide oak boards, poured terrazzo, and limestone", kitchenFinishes: "Stone monolith island, rift-sawn oak cabinetry, and integrated appliances", bathroomFinishes: "Travertine slabs, floating oak vanities, and matte black fixtures", windowsAndLight: "Floor-to-ceiling glazing oriented toward canyon and sunset views", ceilingsAndStructure: "Split-level concrete and steel structure with cantilevered rooms", distinctiveDetails: "Framed canyon vistas, bridge-like gallery, and retractable glass walls" },
      outdoor: ["Canyon-facing infinity pool", "Layered hillside gardens", "Sunset terrace", "Outdoor kitchen and dining area"],
      facilities: ["Gated private drive", "Camera and alarm system", "Zoned HVAC", "Smart-home lighting, shades, and audio", "Wellness studio"]
    },
    image: imageSets.canyonView,
    gallery: [imageSets.canyonView, imageSets.canyonViewGallery, "/images/canyon-view-living-room.png", "/images/canyon-view-kitchen.png", "/images/canyon-view-primary-bedroom.png", "/images/canyon-view-primary-bathroom.png", "/images/canyon-view-foyer.png", "/images/canyon-view-pool-terrace.png"],
    galleryAlt: ["Fictional Los Angeles hillside estate", "Canyon View Estate architectural detail", "Canyon View Estate contemporary great room", "Canyon View Estate hillside kitchen with canyon light", "Canyon View Estate primary bedroom with canyon view", "Canyon View Estate primary bathroom in limestone", "Canyon View Estate double-height entry foyer", "Canyon View Estate canyon-facing infinity pool terrace"],
    alt: "Fictional Los Angeles hillside estate",
  },
  {
    id: "pe-la-002",
    slug: "silver-lake-modern",
    cityId: "los-angeles",
    city: "Los Angeles",
    state: "California",
    name: "Silver Lake Modern",
    address: "2418 Lucile Avenue",
    price: 3150000,
    propertyType: "Villa",
    description:
      "A serene hillside home defined by warm oak, generous glazing, and a terrace that catches the last light.",
    editorialHeading: "Warm modernism, open to the hillside.",
    editorialNote: "Oak, soft daylight, and a generous terrace give this Silver Lake home an intimate connection to its landscape.",
    editorialQuote: "Modern, grounded, and quietly connected to the hills",
    specifications: {
      bedrooms: 3, fullBathrooms: 3, halfBathrooms: 1, interiorSquareFeet: 2480, lotSize: "0.16 acre", levels: 2,
      parking: "Two-car attached garage",
      interior: { kitchens: "One open kitchen with breakfast island", livingSpaces: "Open living room with hillside outlook", dining: "Integrated dining area beside the kitchen", familyOrLounge: "Lower-level lounge / studio", officeOrStudy: "Flexible studio suitable for work or guests", laundry: "Dedicated laundry closet", storage: "Garage storage and under-stair storage", additional: "Compact guest suite with private entry" },
      architecture: { style: "Warm California modern hillside home", flooring: "White oak, polished concrete, and wool carpet", kitchenFinishes: "Oak cabinetry, soapstone counters, and integrated appliances", bathroomFinishes: "Microcement walls, oak vanities, and unlacquered brass fixtures", windowsAndLight: "Generous picture windows and clerestories capture late light", ceilingsAndStructure: "Split-level plan with exposed beams and open stair", distinctiveDetails: "Indoor-outdoor threshold, built-in oak joinery, and hillside views" },
      outdoor: ["Sun terrace", "Hillside garden", "Covered patio", "Outdoor lounge"],
      facilities: ["Quiet residential entry", "Alarm system", "Ducted air conditioning", "Smart lighting controls", "Two-car attached garage"]
    },
    image: imageSets.silverLake,
    gallery: [imageSets.silverLake, imageSets.silverLakeGallery, "/images/silver-lake-living-room.png", "/images/silver-lake-kitchen.png", "/images/silver-lake-primary-bedroom.png", "/images/silver-lake-primary-bathroom.png", "/images/silver-lake-foyer.png", "/images/silver-lake-studio-terrace.png"],
    galleryAlt: ["Fictional Silver Lake modern home", "Silver Lake Modern architectural detail", "Silver Lake Modern warm contemporary living room", "Silver Lake Modern kitchen with oak cabinetry", "Silver Lake Modern primary bedroom", "Silver Lake Modern primary bathroom", "Silver Lake Modern entry hall", "Silver Lake Modern studio opening to a planted terrace"],
    alt: "Fictional Silver Lake modern home",
  },
  {
    id: "pe-chi-001",
    slug: "lakeview-greystone",
    cityId: "chicago",
    city: "Chicago",
    state: "Illinois",
    name: "Lakeview Greystone",
    address: "1420 North Astor Street",
    price: 4650000,
    propertyType: "Townhouse",
    description:
      "A restored city home balancing original masonry and tailored contemporary interiors across five calm levels.",
    editorialHeading: "A greystone with a new point of view.",
    editorialNote: "Restored masonry and tailored interiors carry the character of this Lakeview home into contemporary life.",
    editorialQuote: "A considered Chicago classic with room to evolve",
    specifications: {
      bedrooms: 5, fullBathrooms: 5, halfBathrooms: 1, interiorSquareFeet: 4210, lotSize: "0.07 acre", levels: 5,
      parking: "Attached two-car garage",
      interior: { kitchens: "One chef's kitchen with butler's pantry", livingSpaces: "Parlor-level living room with original mantel", dining: "Formal dining room with restored millwork", familyOrLounge: "Garden-level family room", officeOrStudy: "Top-floor study", laundry: "Dedicated laundry room", storage: "Wine room, mudroom, and basement storage", additional: "Garden-level guest suite and workshop" },
      architecture: { style: "Restored Chicago greystone townhouse", flooring: "Refinished oak, encaustic tile, and limestone", kitchenFinishes: "Inset cabinetry, honed quartzite, and professional appliances", bathroomFinishes: "Marble tile, nickel fittings, and tailored millwork", windowsAndLight: "Tall restored windows with layered city and garden light", ceilingsAndStructure: "Five-level masonry structure with original trim and stair", distinctiveDetails: "Carved greystone facade, stained glass, and original fireplaces" },
      outdoor: ["Private roof deck", "Garden level patio", "Rear planting garden"],
      facilities: ["Secure gated entry", "Video intercom", "Central air conditioning", "Smart security and lighting", "Attached two-car garage"]
    },
    image: imageSets.lakeview,
    gallery: [imageSets.lakeview, imageSets.lakeviewGallery, "/images/lakeview-living-room.png", "/images/lakeview-kitchen.png", "/images/lakeview-primary-bedroom.png", "/images/lakeview-primary-bathroom.png", "/images/lakeview-foyer.png", "/images/lakeview-roof-deck.png"],
    galleryAlt: ["Fictional Chicago greystone residence", "Lakeview Greystone architectural detail", "Lakeview Greystone formal living room with original millwork", "Lakeview Greystone restored townhouse kitchen", "Lakeview Greystone primary bedroom", "Lakeview Greystone primary bathroom", "Lakeview Greystone restored entrance hall", "Lakeview Greystone private Chicago roof deck"],
    alt: "Fictional Chicago greystone townhouse",
  },
  {
    id: "pe-chi-002",
    slug: "the-magnificent-mile-residence",
    cityId: "chicago",
    city: "Chicago",
    state: "Illinois",
    name: "The Magnificent Mile Residence",
    address: "1210 North Lake Shore Drive",
    price: 5890000,
    propertyType: "Penthouse",
    description:
      "A composed lakefront residence with expansive entertaining space, tailored detailing, and luminous water views.",
    editorialHeading: "The lake as a daily horizon.",
    editorialNote: "Luminous water views and calm, tailored rooms give this residence its distinctive Chicago presence.",
    editorialQuote: "Light, water, and the city in equal measure",
    specifications: {
      bedrooms: 3, fullBathrooms: 4, halfBathrooms: 1, interiorSquareFeet: 2980, levels: 1,
      parking: "Two deeded garage spaces",
      interior: { kitchens: "One tailored kitchen with integrated appliances", livingSpaces: "Lake-facing living room with private foyer", dining: "Formal dining area for six to eight", familyOrLounge: "Separate den / lounge", officeOrStudy: "Library with built-in shelving", laundry: "Dedicated laundry room", storage: "Private storage room and entry closets", additional: "Service entrance and gallery hall" },
      architecture: { style: "Contemporary lakefront apartment", flooring: "Wide-plank oak and honed limestone", kitchenFinishes: "Flat-panel walnut cabinetry, quartzite counters, and integrated appliances", bathroomFinishes: "Veined marble, nickel fixtures, and frameless glass", windowsAndLight: "Full-height lake-facing windows with northern city light", ceilingsAndStructure: "Single-level residence with generous ceiling heights", distinctiveDetails: "Private elevator foyer, tailored built-ins, and framed lake views" },
      outdoor: ["Private lake-facing terrace"],
      facilities: ["24-hour staff and attended lobby", "Private elevator foyer", "Fitness room and resident lounge", "Central HVAC", "Two deeded garage spaces"]
    },
    image: imageSets.magnificentMile,
    gallery: [imageSets.magnificentMile, imageSets.magnificentMileGallery, "/images/magnificent-mile-living-room.png", "/images/magnificent-mile-kitchen.png", "/images/magnificent-mile-primary-bedroom.png", "/images/magnificent-mile-primary-bathroom.png", "/images/magnificent-mile-foyer.png", "/images/magnificent-mile-lake-terrace.png"],
    galleryAlt: ["Fictional Chicago lakefront penthouse", "The Magnificent Mile Residence architectural detail", "The Magnificent Mile Residence lakefront living room", "The Magnificent Mile Residence contemporary kitchen", "The Magnificent Mile Residence primary bedroom with lake view", "The Magnificent Mile Residence primary bathroom in veined marble", "The Magnificent Mile Residence private elevator foyer", "The Magnificent Mile Residence private lake-facing terrace"],
    alt: "Fictional Chicago lakefront penthouse",
  },
];

export function getCity(cityId: string): City | undefined {
  return cities.find((city) => city.id === cityId);
}

export function getPropertiesByCity(cityId: CityId): Property[] {
  return properties.filter((property) => property.cityId === cityId);
}

export function getProperty(cityId: string, slug: string): Property | undefined {
  return properties.find((property) => property.cityId === cityId && property.slug === slug);
}
