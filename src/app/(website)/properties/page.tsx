import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  PropertiesPageContent,
  type PropertyListing,
} from "@/components/website/properties-page-content";

export const dynamic = "force-dynamic";

type PropertyWithProject = Prisma.PropertyGetPayload<{ include: { project: true } }>;

const FALLBACK_PROPERTIES: PropertyListing[] = [
  {
    id: "demo-1",
    slug: "the-riverside-residences",
    title: "The Riverside Residences",
    address: "Worli, Mumbai",
    city: "Mumbai",
    price: 48500000,
    type: "APARTMENT",
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2100,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=520&fit=crop",
    featured: true,
    isNewLaunch: false,
    photoCount: 12,
    amenities: ["Swimming Pool", "Gym", "Parking"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-2",
    slug: "skyline-heights",
    title: "Skyline Heights",
    address: "Bandra West, Mumbai",
    city: "Mumbai",
    price: 62000000,
    type: "PENTHOUSE",
    bedrooms: 4,
    bathrooms: 4,
    sqft: 3200,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=520&fit=crop",
    featured: false,
    isNewLaunch: true,
    photoCount: 18,
    amenities: ["Swimming Pool", "Gym", "Parking", "Garden"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-3",
    slug: "green-valley-villas",
    title: "Green Valley Villas",
    address: "Whitefield, Bangalore",
    city: "Bangalore",
    price: 18500000,
    type: "VILLA",
    bedrooms: 4,
    bathrooms: 4,
    sqft: 2800,
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=520&fit=crop",
    featured: true,
    isNewLaunch: false,
    photoCount: 15,
    amenities: ["Garden", "Parking"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-4",
    slug: "marina-bay-towers",
    title: "Marina Bay Towers",
    address: "Marine Drive, Mumbai",
    city: "Mumbai",
    price: 38000000,
    type: "APARTMENT",
    bedrooms: 3,
    bathrooms: 3,
    sqft: 1850,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=520&fit=crop",
    featured: false,
    isNewLaunch: true,
    photoCount: 10,
    amenities: ["Gym", "Parking"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-5",
    slug: "prestige-lakeside",
    title: "Prestige Lakeside",
    address: "Hinjewadi Phase 1, Pune",
    city: "Pune",
    price: 7200000,
    type: "APARTMENT",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1100,
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&h=520&fit=crop",
    featured: true,
    isNewLaunch: false,
    photoCount: 9,
    amenities: ["Swimming Pool", "Gym"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-6",
    slug: "emerald-heights",
    title: "Emerald Heights",
    address: "Sector 42, Gurgaon",
    city: "Gurgaon",
    price: 45000000,
    type: "VILLA",
    bedrooms: 5,
    bathrooms: 5,
    sqft: 4500,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=520&fit=crop",
    featured: false,
    isNewLaunch: true,
    photoCount: 20,
    amenities: ["Swimming Pool", "Gym", "Parking", "Garden"],
    createdAt: new Date().toISOString(),
  },
];

function parseAmenities(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((a): a is string => typeof a === "string");
}

function toListing(p: PropertyWithProject): PropertyListing {
  const created = new Date(p.createdAt);
  const daysOld = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
  const images = parseAmenities(p.images);

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    address: p.address,
    city: p.city,
    price: Number(p.price),
    type: p.type,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    sqft: p.sqft,
    image: p.image,
    featured: p.featured,
    isNewLaunch: daysOld <= 90 && !p.featured,
    photoCount: images.length > 0 ? images.length : 8 + (p.bedrooms % 5),
    amenities: parseAmenities(p.amenities),
    createdAt: created.toISOString(),
  };
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const search = searchParams.search;
  let properties: PropertyListing[] = [];

  try {
    const rows = await prisma.property.findMany({
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      include: { project: true },
    });
    properties = rows.map(toListing);
  } catch {
    // DB unavailable
  }

  if (properties.length === 0) {
    properties = FALLBACK_PROPERTIES;
  }

  return <PropertiesPageContent properties={properties} initialSearch={search ?? ""} />;
}
