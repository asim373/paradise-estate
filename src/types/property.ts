export const cityIds = ["new-york", "miami", "los-angeles", "chicago"] as const;

export type CityId = (typeof cityIds)[number];
export type PropertyType = "Estate" | "Penthouse" | "Townhouse" | "Villa";

export type PropertySpecifications = {
  bedrooms: number;
  fullBathrooms: number;
  halfBathrooms: number;
  interiorSquareFeet: number;
  lotSize?: string;
  levels?: number;
  parking: string;
  interior: {
    kitchens: string;
    livingSpaces: string;
    dining: string;
    familyOrLounge?: string;
    officeOrStudy?: string;
    laundry: string;
    storage: string;
    additional?: string;
  };
  architecture: {
    style: string;
    flooring: string;
    kitchenFinishes: string;
    bathroomFinishes: string;
    windowsAndLight: string;
    ceilingsAndStructure: string;
    distinctiveDetails: string;
  };
  outdoor: string[];
  facilities: string[];
};

export type Property = {
  id: string;
  slug: string;
  cityId: CityId;
  city: string;
  state: string;
  name: string;
  address: string;
  price: number;
  propertyType: PropertyType;
  description: string;
  editorialHeading: string;
  editorialNote: string;
  editorialQuote: string;
  specifications: PropertySpecifications;
  image: string;
  gallery: string[];
  galleryAlt: string[];
  alt: string;
};

export type City = {
  id: CityId;
  name: string;
  state: string;
  tagline: string;
  introduction: string;
  image: string;
  alt: string;
};
